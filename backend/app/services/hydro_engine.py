from typing import Dict, Any, List, Optional
import math

# Standard runoff coefficients by catchment surface
RUNOFF_COEFFICIENTS = {
    "concrete": 0.85,
    "metal": 0.90,
    "tile": 0.75,
    "asphalt": 0.70,
    "paved": 0.60,
    "green_roof": 0.35,
    "soil_garden": 0.20,
    "other": 0.70
}

# Soil permeability factors (hydraulic conductivity ratings)
SOIL_FACTORS = {
    "gravel_sand": {"name": "Coarse Sand & Gravel", "score": 30, "drainage": "Very High", "rate_mm_hr": 50},
    "sandy_loam": {"name": "Sandy Loam", "score": 25, "drainage": "Good", "rate_mm_hr": 25},
    "silt_loam": {"name": "Silt Loam", "score": 18, "drainage": "Moderate", "rate_mm_hr": 12},
    "clay_loam": {"name": "Clay Loam", "score": 12, "drainage": "Slow", "rate_mm_hr": 5},
    "clay": {"name": "Dense Clay / Hardpan", "score": 6, "drainage": "Very Poor", "rate_mm_hr": 1.5},
    "rocky": {"name": "Fissured Rock / Mixed", "score": 15, "drainage": "Variable", "rate_mm_hr": 10},
}

class HydroEngine:
    @staticmethod
    def calculate_harvest_potential(
        roof_area_sqm: float,
        annual_rainfall_mm: float,
        surface_type: str = "concrete",
        filter_efficiency: float = 0.90,
        first_flush_mm: float = 1.5
    ) -> Dict[str, Any]:
        """
        Calculates harvestable rainwater:
        Formula: Harvestable Water (L) = Rainfall (mm) * Catchment Area (m^2) * Runoff Coefficient * Filter Efficiency
        Note: 1 mm over 1 m^2 = 1 Litre (0.001 m * 1 m^2 = 0.001 m^3 = 1 L)
        """
        runoff_coeff = RUNOFF_COEFFICIENTS.get(surface_type.lower(), 0.80)
        
        # Gross potential before first flush and filtration
        gross_potential_litres = annual_rainfall_mm * roof_area_sqm * runoff_coeff
        
        # Effective rainfall accounting for first flush diversion across ~35 rainfall events/year
        estimated_rainy_events = 35
        first_flush_loss_mm = min(annual_rainfall_mm * 0.08, estimated_rainy_events * first_flush_mm)
        effective_rainfall_mm = max(0.0, annual_rainfall_mm - first_flush_loss_mm)
        
        # Net harvestable water after first-flush filter and mesh filter
        net_harvestable_litres = effective_rainfall_mm * roof_area_sqm * runoff_coeff * filter_efficiency
        
        # Rounded figures
        net_harvestable_litres = round(net_harvestable_litres, 1)
        gross_potential_litres = round(gross_potential_litres, 1)
        
        return {
            "roof_area_sqm": roof_area_sqm,
            "annual_rainfall_mm": annual_rainfall_mm,
            "surface_type": surface_type,
            "runoff_coefficient": runoff_coeff,
            "filter_efficiency": filter_efficiency,
            "first_flush_deduction_litres": round(gross_potential_litres - net_harvestable_litres, 1),
            "gross_potential_litres": gross_potential_litres,
            "net_harvestable_litres": net_harvestable_litres,
            "daily_average_harvest_litres": round(net_harvestable_litres / 365, 1),
            "formula_string": f"{annual_rainfall_mm} mm × {roof_area_sqm} m² × {runoff_coeff} = {round(gross_potential_litres):,} L"
        }

    @staticmethod
    def calculate_storage_and_sufficiency(
        net_harvestable_litres: float,
        daily_demand_litres: float,
        existing_storage_litres: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Evaluates storage sufficiency, dry spell buffer, and recommended tank capacity.
        """
        annual_demand_litres = daily_demand_litres * 365.0
        
        # Water sufficiency ratio (can exceed 100% if harvest > demand)
        sufficiency_pct = min(100.0, (net_harvestable_litres / annual_demand_litres) * 100.0) if annual_demand_litres > 0 else 100.0
        sufficiency_pct = round(sufficiency_pct, 1)
        
        # Recommended storage capacity based on 25-35 days of demand during monsoon breaks
        recommended_storage_litres = round(daily_demand_litres * 30 / 500) * 500
        recommended_storage_litres = max(1000, min(recommended_storage_litres, 20000))
        
        storage_to_use = existing_storage_litres if existing_storage_litres and existing_storage_litres > 0 else recommended_storage_litres
        
        # Estimated days of full water independence
        days_of_autonomy = round((net_harvestable_litres / daily_demand_litres), 1) if daily_demand_litres > 0 else 365.0
        
        # Potential overflow to groundwater recharge
        potential_recharge_overflow = max(0.0, net_harvestable_litres - (daily_demand_litres * 180))
        
        return {
            "daily_demand_litres": daily_demand_litres,
            "annual_demand_litres": annual_demand_litres,
            "water_sufficiency_pct": sufficiency_pct,
            "recommended_storage_litres": recommended_storage_litres,
            "active_storage_litres": storage_to_use,
            "days_of_water_autonomy": days_of_autonomy,
            "estimated_overflow_recharge_litres": round(potential_recharge_overflow, 1)
        }

    @staticmethod
    def evaluate_groundwater_recharge(
        soil_type: str,
        groundwater_depth_m: float,
        available_land_sqm: float,
        annual_rainfall_mm: float,
        catchment_area_sqm: float,
        surface_type: str = "concrete"
    ) -> Dict[str, Any]:
        """
        Calculates Recharge Suitability Score (0-100%) and recommends optimal recharge structure.
        """
        soil_info = SOIL_FACTORS.get(soil_type.lower(), SOIL_FACTORS["sandy_loam"])
        soil_score = soil_info["score"]
        
        # Depth scoring (Ideal: 5m to 20m)
        if 5.0 <= groundwater_depth_m <= 25.0:
            depth_score = 30
            depth_label = "Optimal Aquifer Headroom"
        elif 3.0 <= groundwater_depth_m < 5.0:
            depth_score = 20
            depth_label = "Shallow Water Table (Risk of waterlogging during heavy floods)"
        elif 25.0 < groundwater_depth_m <= 50.0:
            depth_score = 25
            depth_label = "Deep Aquifer with High Storage Capacity"
        elif groundwater_depth_m > 50.0:
            depth_score = 18
            depth_label = "Very Deep Water Table (Requires Injection Shaft / Well)"
        else: # < 3m
            depth_score = 10
            depth_label = "Critically Shallow (Surface Water Recharge Not Advised)"
            
        # Land availability scoring (Max 20 pts)
        if available_land_sqm >= 100:
            land_score = 20
        elif available_land_sqm >= 30:
            land_score = 15
        elif available_land_sqm >= 10:
            land_score = 10
        else:
            land_score = 5
            
        # Rainfall & Catchment Potential Scoring (Max 20 pts)
        harvest = HydroEngine.calculate_harvest_potential(catchment_area_sqm, annual_rainfall_mm, surface_type)
        harvest_litres = harvest["net_harvestable_litres"]
        
        if harvest_litres >= 100000:
            harvest_score = 20
        elif harvest_litres >= 40000:
            harvest_score = 16
        elif harvest_litres >= 15000:
            harvest_score = 12
        else:
            harvest_score = 8
            
        total_suitability_score = min(100, max(15, soil_score + depth_score + land_score + harvest_score))
        
        if total_suitability_score >= 80:
            potential_category = "HIGH POTENTIAL"
            status_color = "emerald"
        elif total_suitability_score >= 55:
            potential_category = "MODERATE POTENTIAL"
            status_color = "amber"
        else:
            potential_category = "LOW POTENTIAL"
            status_color = "rose"

        # Structure Recommendation Logic
        reasons: List[str] = []
        structure_name = "Recharge Pit"
        dimensions = "1.5m × 1.5m × 2.0m depth"
        filtration_media = "Graded gravel (40-20mm), coarse sand bed, and geotextile silt trap"
        
        if available_land_sqm >= 500 and catchment_area_sqm >= 800:
            structure_name = "Percolation Pond"
            dimensions = "10m × 8m × 2.5m depth with overflow weir"
            filtration_media = "Sand filtration blanket and silt retention berm"
            reasons.append("High land availability allows natural vegetative percolation.")
            reasons.append("Captures large volume stormwater runoff from extensive property area.")
            reasons.append(f"Soil permeability ({soil_info['name']}) facilitates steady unconfined recharge.")
        elif groundwater_depth_m > 18.0 or soil_info["score"] <= 12:
            structure_name = "Recharge Shaft / Injection Well"
            dimensions = "150mm - 200mm diameter PVC slotted casing to depth of 15m-25m"
            filtration_media = "Dual chamber de-silting tank with inverted gravel filter"
            reasons.append(f"Deep groundwater table ({groundwater_depth_m}m) requires direct aquifer conduit.")
            reasons.append(f"Upper soil strata ({soil_info['name']}) has slower percolation, bypassing with shaft is optimal.")
            reasons.append("Prevents surface water stagnation and directs pure filtered water to target aquifer.")
        elif available_land_sqm >= 30 and catchment_area_sqm >= 200:
            structure_name = "Recharge Trench"
            dimensions = "0.8m width × 1.8m depth × 8.0m length"
            filtration_media = "Perforated PVC distributor pipe bedded in 40mm crushed stone aggregate"
            reasons.append("Linear layout utilizes driveway or boundary wall footprint efficiently.")
            reasons.append("Distributes inflow over a broad infiltration surface.")
            reasons.append(f"Favorable {soil_info['name']} soil provides high natural absorption.")
        else:
            structure_name = "Recharge Pit"
            dimensions = "1.5m × 1.5m × 2.0m depth"
            filtration_media = "Graded boulder-gravel-sand pack with removable mesh pre-filter"
            reasons.append("Ideal compact footprint for residential/suburban roof catchments.")
            reasons.append("Low construction cost and simple annual maintenance.")
            reasons.append(f"Sufficient hydraulic intake for {round(harvest_litres):,} L/year potential harvest.")

        # Estimate realistic annual recharge volume
        infiltration_efficiency = min(0.92, (total_suitability_score / 100.0) * 0.95)
        estimated_annual_recharge_litres = round(harvest_litres * infiltration_efficiency)
        
        # Formulate range
        recharge_min = round(estimated_annual_recharge_litres * 0.85, -2)
        recharge_max = round(estimated_annual_recharge_litres * 1.15, -2)
        recharge_range_str = f"{int(recharge_min):,} – {int(recharge_max):,} L/year"

        return {
            "suitability_score": total_suitability_score,
            "potential_category": potential_category,
            "status_color": status_color,
            "groundwater_depth_m": groundwater_depth_m,
            "depth_assessment": depth_label,
            "soil_type": soil_type,
            "soil_details": soil_info,
            "recommended_structure": structure_name,
            "structure_dimensions": dimensions,
            "filtration_media": filtration_media,
            "reasons": reasons,
            "estimated_recharge_litres": estimated_annual_recharge_litres,
            "estimated_recharge_range": recharge_range_str,
            "disclaimer": "Estimates are decision-support guidelines based on hydrological models and not certified structural engineering drawings."
        }
