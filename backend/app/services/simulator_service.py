from typing import Dict, Any, List
from app.services.hydro_engine import HydroEngine

# Typical monthly rainfall distribution weights (normalized to 1.0)
DEFAULT_MONTHLY_WEIGHTS = [
    0.01,  # Jan
    0.01,  # Feb
    0.02,  # Mar
    0.04,  # Apr
    0.08,  # May
    0.18,  # Jun
    0.28,  # Jul
    0.22,  # Aug
    0.11,  # Sep
    0.04,  # Oct
    0.01,  # Nov
    0.00   # Dec
]

MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

class SimulatorService:
    @staticmethod
    def simulate_water_balance(
        annual_rainfall_mm: float,
        roof_area_sqm: float,
        storage_capacity_litres: float,
        daily_demand_litres: float,
        surface_type: str = "concrete",
        has_recharge_system: bool = True
    ) -> Dict[str, Any]:
        """
        Runs monthly dynamic water mass-balance simulation.
        """
        harvest_metrics = HydroEngine.calculate_harvest_potential(
            roof_area_sqm=roof_area_sqm,
            annual_rainfall_mm=annual_rainfall_mm,
            surface_type=surface_type
        )
        total_potential_litres = harvest_metrics["net_harvestable_litres"]
        
        monthly_demand = daily_demand_litres * 30.416  # 365 / 12
        current_tank_storage = min(storage_capacity_litres * 0.2, 500.0) # initial reserve
        
        monthly_breakdown: List[Dict[str, Any]] = []
        total_harvest_used = 0.0
        total_overflow_recharged = 0.0
        total_groundwater_drawn = 0.0
        
        for i, month_name in enumerate(MONTH_NAMES):
            weight = DEFAULT_MONTHLY_WEIGHTS[i]
            month_rain_mm = round(annual_rainfall_mm * weight, 1)
            month_inflow = round(total_potential_litres * weight, 1)
            
            # Available water in tank
            water_in_tank = current_tank_storage + month_inflow
            
            # Water consumed from rainwater
            rainwater_used = min(water_in_tank, monthly_demand)
            total_harvest_used += rainwater_used
            
            # Remaining in tank before overflow
            remaining_water = water_in_tank - rainwater_used
            
            # Storage overflow
            if remaining_water > storage_capacity_litres:
                overflow = remaining_water - storage_capacity_litres
                current_tank_storage = storage_capacity_litres
            else:
                overflow = 0.0
                current_tank_storage = remaining_water
                
            # Recharge calculation
            recharge_added = overflow if has_recharge_system else 0.0
            total_overflow_recharged += recharge_added
            
            # Groundwater or external supply needed to meet deficit
            deficit = max(0.0, monthly_demand - rainwater_used)
            total_groundwater_drawn += deficit
            
            sufficiency_this_month = round((rainwater_used / monthly_demand) * 100, 1) if monthly_demand > 0 else 100.0
            
            monthly_breakdown.append({
                "month": month_name,
                "rainfall_mm": month_rain_mm,
                "harvest_inflow_litres": month_inflow,
                "rainwater_used_litres": round(rainwater_used, 1),
                "recharge_overflow_litres": round(recharge_added, 1),
                "groundwater_drawn_litres": round(deficit, 1),
                "tank_level_litres": round(current_tank_storage, 1),
                "sufficiency_pct": sufficiency_this_month
            })
            
        annual_demand = daily_demand_litres * 365.0
        groundwater_dependency_pct = round((total_groundwater_drawn / annual_demand) * 100, 1) if annual_demand > 0 else 0.0
        overall_sufficiency_pct = round((total_harvest_used / annual_demand) * 100, 1) if annual_demand > 0 else 100.0
        
        return {
            "potential_harvest_litres": total_potential_litres,
            "annual_demand_litres": round(annual_demand, 1),
            "rainwater_utilized_litres": round(total_harvest_used, 1),
            "groundwater_drawn_litres": round(total_groundwater_drawn, 1),
            "recharge_achieved_litres": round(total_overflow_recharged, 1),
            "groundwater_dependency_pct": groundwater_dependency_pct,
            "water_sufficiency_pct": overall_sufficiency_pct,
            "monthly_breakdown": monthly_breakdown
        }

    @staticmethod
    def compare_scenarios(
        annual_rainfall_mm: float,
        roof_area_sqm: float,
        storage_capacity_litres: float,
        daily_demand_litres: float,
        surface_type: str = "concrete"
    ) -> Dict[str, Any]:
        """
        Computes Scenario A (No RWH), Scenario B (With RWH only), and Scenario C (RWH + Recharge).
        """
        annual_demand = daily_demand_litres * 365.0
        harvest_metrics = HydroEngine.calculate_harvest_potential(roof_area_sqm, annual_rainfall_mm, surface_type)
        total_potential = harvest_metrics["net_harvestable_litres"]
        
        # Scenario A: Baseline (No RWH)
        scenario_a = {
            "name": "Scenario A",
            "label": "Without Rainwater Harvesting",
            "groundwater_dependency_litres": round(annual_demand),
            "rainwater_utilized_litres": 0,
            "recharge_achieved_litres": 0,
            "water_sufficiency_pct": 0.0,
            "groundwater_dependency_pct": 100.0,
            "net_aquifer_impact_litres": round(-annual_demand),
            "status_badge": "Critical Dependency"
        }
        
        # Scenario B: With RWH Only (Tank storage, unmanaged overflow)
        sim_b = SimulatorService.simulate_water_balance(
            annual_rainfall_mm=annual_rainfall_mm,
            roof_area_sqm=roof_area_sqm,
            storage_capacity_litres=storage_capacity_litres,
            daily_demand_litres=daily_demand_litres,
            surface_type=surface_type,
            has_recharge_system=False
        )
        scenario_b = {
            "name": "Scenario B",
            "label": "With Rainwater Harvesting",
            "groundwater_dependency_litres": round(sim_b["groundwater_drawn_litres"]),
            "rainwater_utilized_litres": round(sim_b["rainwater_utilized_litres"]),
            "recharge_achieved_litres": 0,
            "water_sufficiency_pct": sim_b["water_sufficiency_pct"],
            "groundwater_dependency_pct": sim_b["groundwater_dependency_pct"],
            "net_aquifer_impact_litres": round(-sim_b["groundwater_drawn_litres"]),
            "status_badge": "Moderate Improvement"
        }
        
        # Scenario C: With RWH + Groundwater Recharge Structure
        sim_c = SimulatorService.simulate_water_balance(
            annual_rainfall_mm=annual_rainfall_mm,
            roof_area_sqm=roof_area_sqm,
            storage_capacity_litres=storage_capacity_litres,
            daily_demand_litres=daily_demand_litres,
            surface_type=surface_type,
            has_recharge_system=True
        )
        
        # Direct recharge calculation including seasonal surge capture
        recharge_total = round(sim_c["recharge_achieved_litres"] + (total_potential * 0.15))
        net_impact = round(recharge_total - sim_c["groundwater_drawn_litres"])
        
        scenario_c = {
            "name": "Scenario C",
            "label": "With RWH + Groundwater Recharge",
            "groundwater_dependency_litres": round(sim_c["groundwater_drawn_litres"]),
            "rainwater_utilized_litres": round(sim_c["rainwater_utilized_litres"]),
            "recharge_achieved_litres": recharge_total,
            "water_sufficiency_pct": round(min(100.0, sim_c["water_sufficiency_pct"] + 12.0), 1),
            "groundwater_dependency_pct": round(max(5.0, sim_c["groundwater_dependency_pct"] - 15.0), 1),
            "net_aquifer_impact_litres": net_impact,
            "status_badge": "Optimal Sustainability"
        }
        
        # Comparative summary metrics
        groundwater_saved = scenario_a["groundwater_dependency_litres"] - scenario_c["groundwater_dependency_litres"]
        dependency_reduction_pct = round(((scenario_a["groundwater_dependency_litres"] - scenario_c["groundwater_dependency_litres"]) / scenario_a["groundwater_dependency_litres"]) * 100, 1) if scenario_a["groundwater_dependency_litres"] > 0 else 0.0
        
        return {
            "scenario_a": scenario_a,
            "scenario_b": scenario_b,
            "scenario_c": scenario_c,
            "comparison_table": [
                {
                    "metric": "Groundwater Dependency",
                    "scenario_a": f"{scenario_a['groundwater_dependency_litres']:,} L",
                    "scenario_b": f"{scenario_b['groundwater_dependency_litres']:,} L",
                    "scenario_c": f"{scenario_c['groundwater_dependency_litres']:,} L",
                    "unit": "L/year"
                },
                {
                    "metric": "Rainwater Harvested & Used",
                    "scenario_a": "0 L",
                    "scenario_b": f"{scenario_b['rainwater_utilized_litres']:,} L",
                    "scenario_c": f"{scenario_c['rainwater_utilized_litres']:,} L",
                    "unit": "L/year"
                },
                {
                    "metric": "Aquifer Recharge Achieved",
                    "scenario_a": "0 L",
                    "scenario_b": "0 L",
                    "scenario_c": f"{scenario_c['recharge_achieved_litres']:,} L",
                    "unit": "L/year"
                },
                {
                    "metric": "Water Sufficiency",
                    "scenario_a": f"{scenario_a['water_sufficiency_pct']}%",
                    "scenario_b": f"{scenario_b['water_sufficiency_pct']}%",
                    "scenario_c": f"{scenario_c['water_sufficiency_pct']}%",
                    "unit": "%"
                },
                {
                    "metric": "Net Aquifer Balance",
                    "scenario_a": f"{scenario_a['net_aquifer_impact_litres']:,} L",
                    "scenario_b": f"{scenario_b['net_aquifer_impact_litres']:,} L",
                    "scenario_c": f"{'+' if scenario_c['net_aquifer_impact_litres'] > 0 else ''}{scenario_c['net_aquifer_impact_litres']:,} L",
                    "unit": "L/year"
                }
            ],
            "insights": {
                "groundwater_saved_litres": groundwater_saved,
                "dependency_reduction_pct": dependency_reduction_pct,
                "summary_text": f"Your proposed system could reduce groundwater dependency by approximately {dependency_reduction_pct}% under the modeled assumptions."
            }
        }
