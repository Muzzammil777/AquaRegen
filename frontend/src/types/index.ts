export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  location: string;
  property_type: string;
  property_area: number;
  onboarding_completed: boolean;
};

export type Property = {
  id: string;
  user_id: string;
  name: string;
  property_type: string;
  location: string;
  latitude?: number;
  longitude?: number;
  roof_area_sqm: number;
  surface_type: string;
  annual_rainfall_mm: number;
  daily_demand_litres: number;
  occupants?: number;
  storage_capacity_litres: number;
  soil_type: string;
  groundwater_depth_m: number;
  available_land_sqm?: number;
  has_recharge_pit?: boolean;
};

export type KpiItem = {
  label: string;
  value: string;
  raw_value?: number;
  unit: string;
  change_pct: string;
  change_label: string;
  trend: 'up' | 'down' | 'improving' | 'stable';
  status: 'healthy' | 'moderate' | 'critical';
};

export type DashboardData = {
  greeting: {
    headline: string;
    subheadline: string;
  };
  kpis: {
    rainfall: KpiItem;
    harvestable_water: KpiItem;
    groundwater_level: KpiItem;
    water_availability: KpiItem;
  };
  rainfall_trend: {
    selected_period: string;
    data: Array<{ time: string; rainfall_mm: number; harvest_litres: number }>;
  };
  water_availability_gauge: {
    percentage: number;
    status_label: string;
    days_of_autonomy: number;
  };
  harvest_vs_demand: Array<{
    name: string;
    volume: number;
    color: string;
  }>;
  groundwater_trend: {
    current_depth_m: number;
    interpretation: string;
    status: string;
    history: Array<{ year: string; depth_m: number; status: string }>;
  };
  property_summary: {
    name: string;
    roof_area_sqm: number;
    surface_type: string;
    location: string;
  };
};

export type HarvestingCalculationResult = {
  harvest_metrics: {
    roof_area_sqm: number;
    annual_rainfall_mm: number;
    surface_type: string;
    runoff_coefficient: number;
    filter_efficiency: number;
    first_flush_deduction_litres: number;
    gross_potential_litres: number;
    net_harvestable_litres: number;
    daily_average_harvest_litres: number;
    formula_string: string;
  };
  storage_metrics: {
    daily_demand_litres: number;
    annual_demand_litres: number;
    water_sufficiency_pct: number;
    recommended_storage_litres: number;
    active_storage_litres: number;
    days_of_water_autonomy: number;
    estimated_overflow_recharge_litres: number;
  };
  recommendation: {
    system_type: string;
    estimated_annual_collection_litres: number;
    recommended_storage_litres: number;
    estimated_recharge_litres_per_year: number;
    water_sufficiency_pct: number;
    days_of_water_autonomy: number;
    why_text: string[];
  };
  calculation_steps: Array<{
    step: number;
    title: string;
    formula: string;
    result: string;
    explanation: string;
  }>;
  surface_coefficients: Record<string, number>;
};

export type GroundwaterAssessment = {
  assessment: {
    suitability_score: number;
    potential_category: string;
    status_color: string;
    groundwater_depth_m: number;
    depth_assessment: string;
    soil_type: string;
    soil_details: {
      name: string;
      score: number;
      drainage: string;
      rate_mm_hr: number;
    };
    recommended_structure: string;
    structure_dimensions: string;
    filtration_media: string;
    reasons: string[];
    estimated_recharge_litres: number;
    estimated_recharge_range: string;
    disclaimer: string;
  };
  input_summary: {
    soil_type: string;
    groundwater_depth_m: number;
    available_land_sqm: number;
    annual_rainfall_mm: number;
    catchment_area_sqm: number;
  };
  soil_options: Array<{
    id: string;
    name: string;
    drainage: string;
    rate_mm_hr: number;
  }>;
};

export type MonthlySimulationItem = {
  month: string;
  rainfall_mm: number;
  harvest_inflow_litres: number;
  rainwater_used_litres: number;
  recharge_overflow_litres: number;
  groundwater_drawn_litres: number;
  tank_level_litres: number;
  sufficiency_pct: number;
};

export type SimulationResult = {
  potential_harvest_litres: number;
  annual_demand_litres: number;
  rainwater_utilized_litres: number;
  groundwater_drawn_litres: number;
  recharge_achieved_litres: number;
  groundwater_dependency_pct: number;
  water_sufficiency_pct: number;
  monthly_breakdown: MonthlySimulationItem[];
};

export type ScenarioItem = {
  name: string;
  label: string;
  groundwater_dependency_litres: number;
  rainwater_utilized_litres: number;
  recharge_achieved_litres: number;
  water_sufficiency_pct: number;
  groundwater_dependency_pct: number;
  net_aquifer_impact_litres: number;
  status_badge: string;
};

export type ScenarioComparison = {
  scenario_a: ScenarioItem;
  scenario_b: ScenarioItem;
  scenario_c: ScenarioItem;
  comparison_table: Array<{
    metric: string;
    scenario_a: string;
    scenario_b: string;
    scenario_c: string;
    unit: string;
  }>;
  insights: {
    groundwater_saved_litres: number;
    dependency_reduction_pct: number;
    summary_text: string;
  };
};

export type MapZone = {
  id: string;
  name: string;
  category: 'recharge_zone' | 'groundwater' | 'storage' | 'critical_areas';
  latitude: number;
  longitude: number;
  status: 'healthy' | 'moderate' | 'critical';
  groundwater_depth_m: number;
  recharge_potential_pct: number;
  annual_rainfall_mm: number;
  recommended_structure: string;
  estimated_recharge_litres: number;
  soil_type: string;
  description: string;
};

export type ImpactAnalyticsData = {
  kpis: {
    water_harvested: KpiItem;
    groundwater_saved: KpiItem;
    recharge_achieved: KpiItem;
    dependency_reduction: KpiItem;
  };
  sustainability_summary: {
    badge: string;
    headline: string;
    carbon_offset_kg: number;
    estimated_cost_savings_usd: number;
    tree_equivalent: number;
  };
  cumulative_trend: Array<{
    month: string;
    harvested_cumulative: number;
    recharge_cumulative: number;
    groundwater_saved: number;
  }>;
  scenarios_comparison: ScenarioComparison;
  measurement_disclaimer: string;
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  contextUsed?: Record<string, any>;
  provider?: string;
};

export type AIChatResponse = {
  reply: string;
  response?: string;
  context_used?: Record<string, any>;
  provider?: string;
};

export const SURFACE_RUNOFF_COEFFICIENTS = {
  concrete: 0.85,
  metal: 0.90,
  tile: 0.75,
  asphalt: 0.70,
  paved: 0.60,
  green_roof: 0.35,
};
