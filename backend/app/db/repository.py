import json
import os
import asyncio
import uuid
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
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
                    # Update fields
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
            # Check connection
            await client.admin.command('ping')
            self.mongo_client = client
            self.db = client[settings.DATABASE_NAME]
            self.is_mongo = True
            print("Connected successfully to MongoDB.")
        except Exception as e:
            self.is_mongo = False
            print(f"MongoDB not reachable ({e}). Using persistent Local JSON Document Store.")

    async def find_one(self, collection: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_mongo and self.db is not None:
            doc = await self.db[collection].find_one(query)
            if doc and "_id" in doc:
                doc["id"] = str(doc["_id"])
            return doc
        return await self.local_store.find_one(collection, query)

    async def find_many(self, collection: str, query: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        if self.is_mongo and self.db is not None:
            cursor = self.db[collection].find(query or {}).limit(limit)
            results = []
            async for doc in cursor:
                if "_id" in doc:
                    doc["id"] = str(doc["_id"])
                results.append(doc)
            return results
        return await self.local_store.find_many(collection, query, limit)

    async def insert_one(self, collection: str, doc: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_mongo and self.db is not None:
            to_insert = dict(doc)
            res = await self.db[collection].insert_one(to_insert)
            to_insert["id"] = str(res.inserted_id)
            return to_insert
        return await self.local_store.insert_one(collection, doc)

    async def update_one(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        if self.is_mongo and self.db is not None:
            res = await self.db[collection].update_one(query, {"$set": update.get("$set", update)})
            return res.modified_count > 0 or res.matched_count > 0
        return await self.local_store.update_one(collection, query, update)

db_repo = DatabaseRepository()
