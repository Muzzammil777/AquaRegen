import type {
  User,
  Property,
  DashboardData,
  HarvestingCalculationResult,
  GroundwaterAssessment,
  SimulationResult,
  ScenarioComparison,
  MapZone,
  ImpactAnalyticsData,
  AIChatResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('aquaregen_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(errData.detail || errData.message || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn(`API request to ${endpoint} failed:`, err);
      throw err;
    }
  }

  // Authentication
  async register(data: { name: string; email: string; password: string; location?: string; property_type?: string; property_area?: number }) {
    return this.request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<{ user: User; primary_property: Property }> {
    return this.request<{ user: User; primary_property: Property }>('/auth/me');
  }

  async completeOnboarding(data: {
    location: string;
    property_type: string;
    roof_area_sqm: number;
    surface_type: string;
    annual_rainfall_mm: number;
    daily_demand_litres: number;
    occupants: number;
    storage_capacity_litres: number;
    soil_type: string;
    groundwater_depth_m: number;
    available_land_sqm: number;
  }) {
    return this.request<{ status: string; message: string }>('/auth/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard
  async getDashboardData(period: string = 'daily'): Promise<DashboardData> {
    return this.request<DashboardData>(`/dashboard?period=${period}`);
  }

  // Rainfall Analysis
  async getRainfallAnalysis(location: string = 'bengaluru', roof_area: number = 120, surface: string = 'concrete') {
    return this.request<any>(`/rainfall?location=${location}&roof_area=${roof_area}&surface_type=${surface}`);
  }

  // Harvesting Planner
  async calculateHarvesting(data: {
    roof_area_sqm: number;
    annual_rainfall_mm: number;
    surface_type: string;
    daily_demand_litres?: number;
    existing_storage_litres?: number;
  }): Promise<HarvestingCalculationResult> {
    return this.request<HarvestingCalculationResult>('/harvesting/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Groundwater Recharge
  async recommendGroundwater(data: {
    groundwater_depth_m: number;
    soil_type: string;
    available_land_sqm: number;
    annual_rainfall_mm: number;
    catchment_area_sqm: number;
    surface_type?: string;
  }): Promise<GroundwaterAssessment> {
    return this.request<GroundwaterAssessment>('/groundwater/recommend', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGroundwaterOverview() {
    return this.request<any>('/groundwater/overview');
  }

  // Simulator
  async simulateWater(data: {
    annual_rainfall_mm: number;
    roof_area_sqm: number;
    storage_capacity_litres: number;
    daily_demand_litres: number;
    surface_type?: string;
  }): Promise<SimulationResult> {
    return this.request<SimulationResult>('/water/simulate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async compareScenarios(data: {
    annual_rainfall_mm: number;
    roof_area_sqm: number;
    storage_capacity_litres: number;
    daily_demand_litres: number;
    surface_type?: string;
  }): Promise<ScenarioComparison> {
    return this.request<ScenarioComparison>('/scenario/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // GIS Map
  async getMapZones(category?: string): Promise<{ zones: MapZone[]; total: number; categories: Array<{ id: string; label: string }> }> {
    const q = category ? `?category=${category}` : '';
    return this.request<{ zones: MapZone[]; total: number; categories: Array<{ id: string; label: string }> }>(`/map/zones${q}`);
  }

  // Impact Analytics
  async getImpactAnalytics(): Promise<ImpactAnalyticsData> {
    return this.request<ImpactAnalyticsData>('/analytics');
  }

  // Aqua AI
  async chatWithAquaAI(data: {
    message: string;
    property_context?: any;
    chat_history?: Array<{ role: string; content: string }>;
  }): Promise<AIChatResponse> {
    return this.request<AIChatResponse>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAIPrompts(): Promise<{ prompts: string[] }> {
    return this.request<{ prompts: string[] }>('/ai/prompts');
  }

  // Settings
  async getSettings() {
    return this.request<any>('/settings');
  }

  async updateSettings(data: any) {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async resetDemo() {
    return this.request<any>('/settings/reset-demo', {
      method: 'POST',
    });
  }
}

export const api = new ApiService();
