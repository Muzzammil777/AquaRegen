from fastapi import APIRouter, Depends
from app.schemas.schemas import AIChatRequest, AIChatResponse
from app.services.ai_service import AquaAIService
from app.api.endpoints.auth import get_current_user
from app.db.repository import db_repo

router = APIRouter()

SUGGESTED_PROMPTS = [
    "How much water can I harvest from my roof?",
    "Should I build a recharge pit or a recharge well?",
    "Why is my water availability low during summer?",
    "How can I reduce groundwater dependency by 50%?",
    "Compare my current system with a rainwater harvesting system."
]

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_aqua_ai(
    req: AIChatRequest,
    current_user: dict = Depends(get_current_user)
):
    # Fetch active property context if not provided
    ctx = req.property_context
    if not ctx:
        props = await db_repo.find_many("properties", {"user_id": current_user["id"]})
        if props:
            ctx = props[0]
            
    response = await AquaAIService.chat(
        message=req.message,
        property_context=ctx,
        chat_history=req.chat_history
    )
    return response

@router.get("/prompts")
async def get_suggested_prompts():
    return {"prompts": SUGGESTED_PROMPTS}
