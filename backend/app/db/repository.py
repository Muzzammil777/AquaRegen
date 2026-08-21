import json
import os
import asyncio
import uuid
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.core.config import settings

class LocalJSONStore:
    def __init__(self, filepath: str = "data/aquaregen_store.json"):
        self.filepath = filepath
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        self._lock = asyncio.Lock()
        if not os.path.exists(self.filepath):
            self._write_raw({})

    def _read_raw(self) -> Dict[str, List[Dict[str, Any]]]:
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def _write_raw(self, data: Dict[str, List[Dict[str, Any]]]) -> None:
        with open(self.filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)

    async def find_one(self, collection: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        async with self._lock:
            data = self._read_raw()
            items = data.get(collection, [])
            for item in items:
                match = True
                for k, v in query.items():
                    if item.get(k) != v:
                        match = False
                        break
                if match:
                    return dict(item)
            return None

    async def find_many(self, collection: str, query: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        async with self._lock:
            data = self._read_raw()
            items = data.get(collection, [])
            if not query:
                return [dict(i) for i in items[:limit]]
            matched = []
            for item in items:
                match = True
                for k, v in query.items():
                    if item.get(k) != v:
                        match = False
                        break
                if match:
                    matched.append(dict(item))
                    if len(matched) >= limit:
                        break
            return matched

    async def insert_one(self, collection: str, doc: Dict[str, Any]) -> Dict[str, Any]:
        async with self._lock:
            data = self._read_raw()
            if collection not in data:
                data[collection] = []
            new_doc = dict(doc)
            if "id" not in new_doc and "_id" not in new_doc:
                new_doc["id"] = str(uuid.uuid4())
            data[collection].append(new_doc)
            self._write_raw(data)
            return new_doc

    async def update_one(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        async with self._lock:
            data = self._read_raw()
            items = data.get(collection, [])
            for idx, item in enumerate(items):
                match = True
                for k, v in query.items():
                    if item.get(k) != v:
                        match = False
                        break
                if match:
                    set_data = update.get("$set", update)
                    item.update(set_data)
                    items[idx] = item
                    data[collection] = items
                    self._write_raw(data)
                    return True
            return False

class DatabaseRepository:
    def __init__(self):
        self.is_mongo = False
        self.mongo_client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.local_store = LocalJSONStore()

    async def initialize(self):
        try:
            client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=4000)
            await client.admin.command('ping')
            self.mongo_client = client
            self.db = client[settings.DATABASE_NAME]
            self.is_mongo = True
            print("Connected successfully to MongoDB.")
        except Exception as e:
            self.is_mongo = False
            print(f"MongoDB not reachable ({e}). Using persistent Local JSON Document Store.")

    def _format_mongo_query(self, query: Dict[str, Any]) -> Dict[str, Any]:
        mongo_query = dict(query)
        if "id" in mongo_query:
            val = mongo_query.pop("id")
            conditions = [{"id": val}]
            if ObjectId.is_valid(val):
                conditions.append({"_id": ObjectId(val)})
            mongo_query["$or"] = conditions
        return mongo_query

    def _clean_mongo_doc(self, doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if not doc:
            return None
        res = dict(doc)
        if "_id" in res:
            res_id = res.get("id") or str(res["_id"])
            res["id"] = res_id
            res["_id"] = str(res["_id"])
        return res

    async def find_one(self, collection: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_mongo and self.db is not None:
            try:
                m_query = self._format_mongo_query(query)
                doc = await self.db[collection].find_one(m_query)
                return self._clean_mongo_doc(doc)
            except Exception as e:
                print(f"Mongo find_one error: {e}")
        return await self.local_store.find_one(collection, query)

    async def find_many(self, collection: str, query: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        if self.is_mongo and self.db is not None:
            try:
                m_query = self._format_mongo_query(query) if query else {}
                cursor = self.db[collection].find(m_query).limit(limit)
                results = []
                async for doc in cursor:
                    results.append(self._clean_mongo_doc(doc))
                return results
            except Exception as e:
                print(f"Mongo find_many error: {e}")
        return await self.local_store.find_many(collection, query, limit)

    async def insert_one(self, collection: str, doc: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_mongo and self.db is not None:
            try:
                to_insert = dict(doc)
                if "id" not in to_insert:
                    to_insert["id"] = str(uuid.uuid4())
                res = await self.db[collection].insert_one(to_insert)
                to_insert["_id"] = str(res.inserted_id)
                return to_insert
            except Exception as e:
                print(f"Mongo insert_one error: {e}")
        return await self.local_store.insert_one(collection, doc)

    async def update_one(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        if self.is_mongo and self.db is not None:
            try:
                m_query = self._format_mongo_query(query)
                res = await self.db[collection].update_one(m_query, {"$set": update.get("$set", update)})
                return res.modified_count > 0 or res.matched_count > 0
            except Exception as e:
                print(f"Mongo update_one error: {e}")
        return await self.local_store.update_one(collection, query, update)

db_repo = DatabaseRepository()
