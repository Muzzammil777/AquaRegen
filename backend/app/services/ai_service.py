import os
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.services.hydro_engine import HydroEngine

class AquaAIService:
    @staticmethod
    async def chat(
        message: str,
        property_context: Optional[Dict[str, Any]] = None,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Processes conversational queries using Groq/OpenAI if configured,
        or an intelligent hydrology expert engine grounded in the user's active property metrics.
        """
        # Prepare hydrological context facts
        ctx = property_context or {
            "name": "Default Property",
            "roof_area_sqm": 120.0,
            "annual_rainfall_mm": 850.0,
            "surface_type": "concrete",
            "daily_demand_litres": 360.0,
            "groundwater_depth_m": 7.4,
            "soil_type": "sandy_loam",
            "storage_capacity_litres": 2000.0
        }
        
        roof_area = float(ctx.get("roof_area_sqm", 120.0))
        rainfall = float(ctx.get("annual_rainfall_mm", 850.0))
        surface = ctx.get("surface_type", "concrete")
        demand = float(ctx.get("daily_demand_litres", 360.0))
        gw_depth = float(ctx.get("groundwater_depth_m", 7.4))
        soil = ctx.get("soil_type", "sandy_loam")
        storage = float(ctx.get("storage_capacity_litres", 2000.0))
        
        harvest_metrics = HydroEngine.calculate_harvest_potential(roof_area, rainfall, surface)
        storage_metrics = HydroEngine.calculate_storage_and_sufficiency(harvest_metrics["net_harvestable_litres"], demand, storage)
        recharge_metrics = HydroEngine.evaluate_groundwater_recharge(soil, gw_depth, ctx.get("available_land_sqm", 45.0), rainfall, roof_area, surface)
        
        # Try external Groq or OpenAI API if keys are set
        if settings.GROQ_API_KEY or settings.OPENAI_API_KEY:
            try:
                api_response = await AquaAIService._call_llm(
                    message=message,
                    context_summary={
                        "roof_area_sqm": roof_area,
                        "annual_rainfall_mm": rainfall,
                        "surface_type": surface,
                        "daily_demand_litres": demand,
                        "net_harvestable_litres": harvest_metrics["net_harvestable_litres"],
                        "water_sufficiency_pct": storage_metrics["water_sufficiency_pct"],
                        "recommended_structure": recharge_metrics["recommended_structure"],
                        "estimated_recharge_range": recharge_metrics["estimated_recharge_range"],
                        "groundwater_depth_m": gw_depth,
                        "soil_type": soil
                    },
                    chat_history=chat_history
                )
                if api_response:
                    return {
                        "reply": api_response,
                        "provider": "Groq/LLM-Active",
                        "context_used": {
                            "roof_area": f"{roof_area} m²",
                            "annual_rainfall": f"{rainfall} mm",
                            "harvest_potential": f"{harvest_metrics['net_harvestable_litres']:,} L/year",
                            "sufficiency": f"{storage_metrics['water_sufficiency_pct']}%"
                        }
                    }
            except Exception as e:
                print(f"LLM API call skipped/failed: {e}, falling back to built-in expert model.")
                
        # Smart Built-in Hydrology Expert Engine
        reply = AquaAIService._generate_domain_response(
            query=message.lower(),
            roof_area=roof_area,
            rainfall=rainfall,
            surface=surface,
            demand=demand,
            gw_depth=gw_depth,
            soil=soil,
            storage=storage,
            harvest_metrics=harvest_metrics,
            storage_metrics=storage_metrics,
            recharge_metrics=recharge_metrics
        )
        
        return {
            "reply": reply,
            "provider": "AquaRegen-Hydrology-Engine",
            "context_used": {
                "roof_area": f"{roof_area} m²",
                "annual_rainfall": f"{rainfall} mm",
                "harvest_potential": f"{harvest_metrics['net_harvestable_litres']:,} L/year",
                "sufficiency": f"{storage_metrics['water_sufficiency_pct']}%"
            }
        }

    @staticmethod
    def _generate_domain_response(
        query: str,
        roof_area: float,
        rainfall: float,
        surface: str,
        demand: float,
        gw_depth: float,
        soil: str,
        storage: float,
        harvest_metrics: Dict[str, Any],
        storage_metrics: Dict[str, Any],
        recharge_metrics: Dict[str, Any]
    ) -> str:
        coeff = harvest_metrics["runoff_coefficient"]
        harvest_l = round(harvest_metrics["net_harvestable_litres"])
        daily_avg = round(harvest_metrics["daily_average_harvest_litres"])
        annual_demand = round(storage_metrics["annual_demand_litres"])
        suff_pct = storage_metrics["water_sufficiency_pct"]
        recharge_struct = recharge_metrics["recommended_structure"]
        recharge_range = recharge_metrics["estimated_recharge_range"]
        
        if "how much" in query and ("harvest" in query or "collect" in query or "water" in query):
            return (
                f"Based on your **{roof_area:g} m²** {surface} roof, an annual rainfall of **{rainfall:g} mm**, "
                f"and an estimated runoff coefficient of **{coeff}**, your property has a calculated net harvest potential "
                f"of approximately **{harvest_l:,} Litres/year** (averaging ~{daily_avg} L/day).\n\n"
                f"**Calculation Breakdown:**\n"
                f"• Gross Potential = {rainfall:g} mm × {roof_area:g} m² × {coeff} = {round(harvest_metrics['gross_potential_litres']):,} L\n"
                f"• Net Yield (after first-flush diversion & filtration) ≈ **{harvest_l:,} L/year**.\n\n"
                f"*Note: This is a modeled hydrological estimate based on standard local precipitation patterns.*"
            )
            
        if "recharge" in query or "pit" in query or "well" in query or "structure" in query or "groundwater" in query and "should" in query:
            return (
                f"Yes, installing a **{recharge_struct}** is highly recommended for your property with a **{recharge_metrics['suitability_score']}% Suitability Score** ({recharge_metrics['potential_category']}).\n\n"
                f"**Key Reasons:**\n"
                + "\n".join([f"• {r}" for r in recharge_metrics["reasons"]]) +
                f"\n\n**Estimated Aquifer Contribution:**\n"
                f"• Expected Recharge: **{recharge_range}**\n"
                f"• Suggested Dimensions: **{recharge_metrics['structure_dimensions']}**\n"
                f"• Filter Composition: {recharge_metrics['filtration_media']}\n\n"
                f"*Disclaimer: {recharge_metrics['disclaimer']}*"
            )

        if "low" in query or "availability" in query or "scarcity" in query or "why" in query:
            return (
                f"Your modeled annual water demand is **{annual_demand:,} L/year** ({demand:g} L/day), while your annual harvest potential is **{harvest_l:,} L/year**, yielding a water sufficiency of **{suff_pct}%**.\n\n"
                f"**Key Factors Affecting Water Availability:**\n"
                f"1. **Seasonal Concentration:** Over 70% of precipitation falls during monsoon months. Without sufficient storage ({storage:g} L currently), excess water spills over.\n"
                f"2. **Storage Sizing:** Upgrading your storage tank to **{storage_metrics['recommended_storage_litres']:,} L** can bridge dry-spell gaps.\n"
                f"3. **Runoff Retention:** Routing overflow into a {recharge_struct} will recharge your local water table (currently at **{gw_depth}m depth**), boosting summer borewell yield."
            )

        if "reduce" in query or "dependency" in query or "save" in query or "improve" in query:
            return (
                f"You can reduce your groundwater dependency by up to **41% to 65%** through a dual-action strategy:\n\n"
                f"1. **Direct Rainwater Harvesting:** Capture roof runoff in a **{storage_metrics['recommended_storage_litres']:,} L** tank to supply non-potable domestic needs (flushing, gardening, washing), saving ~{round(harvest_l * 0.7):,} L/year of pumped groundwater.\n"
                f"2. **Groundwater Recharge Well/Pit:** Divert overflow into a **{recharge_struct}** to directly replenish the aquifer by **{recharge_range}**.\n"
                f"3. **Demand Management:** Implementing low-flow aerators can reduce your daily demand from {demand:g} L/day to ~280 L/day, bringing your water sufficiency up to **90%+**."
            )

        if "compare" in query or "scenario" in query or "system" in query:
            return (
                f"Here is how your property compares across 3 water management scenarios:\n\n"
                f"• **Baseline (Without RWH):**\n"
                f"  - Groundwater Drawn: **{annual_demand:,} L/year** (100% dependency)\n"
                f"  - Rainwater Harvested: **0 L**\n"
                f"  - Net Aquifer Impact: **-{annual_demand:,} L/year (Depletion)**\n\n"
                f"• **With Rainwater Harvesting Only:**\n"
                f"  - Groundwater Drawn: ~{round(annual_demand * 0.58):,} L/year\n"
                f"  - Rainwater Used: **{round(harvest_l * 0.65):,} L/year**\n"
                f"  - Water Sufficiency: **{suff_pct}%**\n\n"
                f"• **With RWH + Groundwater Recharge (Optimal):**\n"
                f"  - Groundwater Dependency reduced by **~50%**\n"
                f"  - Aquifer Replenished: **{recharge_range}**\n"
                f"  - Net Aquifer Balance: **Positive Water Neutral / Positive Impact** 🌱"
            )

        # General helpful answer
        return (
            f"Hello! I'm **Aqua AI**, your climate-tech hydrology assistant. "
            f"I have loaded your property details ({roof_area:g} m² roof, {rainfall:g} mm rainfall, {soil} soil).\n\n"
            f"Here is a quick snapshot of your water metrics:\n"
            f"• **Harvest Potential:** ~{harvest_l:,} L/year\n"
            f"• **Water Sufficiency:** {suff_pct}%\n"
            f"• **Recommended Recharge Structure:** {recharge_struct} ({recharge_metrics['potential_category']})\n\n"
            f"You can ask me about sizing your storage tanks, calculating runoff yields, designing recharge pits, or running what-if simulations!"
        )

    @staticmethod
    async def _call_llm(message: str, context_summary: Dict[str, Any], chat_history: Optional[List[Dict[str, str]]]) -> Optional[str]:
        api_key = settings.GROQ_API_KEY or settings.OPENAI_API_KEY
        if not api_key:
            return None
            
        endpoint = "https://api.groq.com/openai/v1/chat/completions" if settings.GROQ_API_KEY else "https://api.openai.com/v1/chat/completions"
        model = settings.AI_MODEL if settings.GROQ_API_KEY else "gpt-3.5-turbo"
        
        system_prompt = (
            "You are Aqua AI, an authoritative, scientifically rigorous climate-tech water management assistant for AquaRegen. "
            "Help users understand rainwater harvesting, groundwater recharge, storage sizing, and water security. "
            "Always be transparent, accurate, and state when numbers are modeled estimates. Use the provided property context:\n"
            f"{context_summary}"
        )
        
        messages = [{"role": "system", "content": system_prompt}]
        if chat_history:
            for ch in chat_history[-4:]:
                messages.append({"role": ch.get("role", "user"), "content": ch.get("content", "")})
        messages.append({"role": "user", "content": message})
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model,
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 500
            }
            res = await client.post(endpoint, json=payload, headers=headers)
            if res.status_code == 200:
                data = res.json()
                content = data["choices"][0]["message"]["content"]
                # Strip out <think> tags if model produces chain-of-thought
                import re
                content = re.sub(r'<think>.*?</think>', '', content, flags=re.DOTALL).strip()
                return content
            return None
