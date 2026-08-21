# 💧 AquaRegen: Project Overview & Decision-Support System
### *Smart Rainwater Harvesting & Groundwater Recharge Platform*
**Tagline:** *Turn Rainfall Into Water Security.*

---

## 1. 📌 Executive Summary

**AquaRegen** is an AI-powered, climate-tech decision-support platform designed to solve one of the most critical challenges of our century: **water scarcity and urban groundwater depletion**. 

The platform empowers homeowners, apartment communities, educational campuses, industrial facilities, and municipal town planners to calculate their exact **rainwater harvesting potential**, design **artificial groundwater recharge structures**, simulate **dry-spell water autonomy**, and interact with a context-aware **AI Hydrological Assistant**.

---

## 2. 🚨 The Problem Statement

### A. The Depleting Water Table Crisis
- **Over-Extraction:** Rapid urbanization has led to unmonitored drilling of borewells, extracting groundwater faster than nature can replenish it. In many cities, water tables have plummeted below **50–100+ meters**.
- **The "Dry Borewell" Trap:** Communities face soaring summer water tanker costs (often spending **₹5,000 – ₹25,000+ per month**) when borewells dry up.

### B. Lost Rainfall & Urban Flooding
- **Concrete Runoff:** Concrete buildings, asphalt roads, and paved surfaces prevent rainwater from naturally percolating into the soil.
- **Wasted Fresh Water:** Over **80% of urban precipitation** runs off into storm drains and sewer networks, causing seasonal flash floods while leaving the underlying aquifer dry.

### C. Lack of Scientific Planning Tools
- Most property owners do not know:
  1. *How much water their roof can actually capture.*
  2. *What size of storage tank they need.*
  3. *Which recharge structure (pit, trench, injection shaft, or pond) suits their soil type.*
  4. *How many days their family can survive without municipal water supply or private tankers.*

---

## 3. 💡 The Proposed Solution: AquaRegen

AquaRegen bridges the gap between **meteorological science** and **everyday property owners** by providing an intuitive, real-time, automated web platform:

```
                      ┌──────────────────────────────────────────────┐
                      │          REAL-TIME PRECIPITATION             │
                      │     (Open-Meteo Live Satellite Feeds)        │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          ROOFTOP CATCHMENT AREA              │
                      │   Concrete (0.85), Metal (0.90), Tile (0.75) │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │         FIRST-FLUSH & MESH FILTER            │
                      │     Diverts 1.5mm dust + 90% filtration      │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
┌──────────────────────────────┐                           ┌──────────────────────────────┐
│     STORAGE TANK SIZING      │                           │  ARTIFICIAL AQUIFER RECHARGE │
│ Supplies daily home demand   │                           │ Injects overflow deep into   │
│ (30 to 90+ days autonomy)    │                           │ unconfined water table       │
└──────────────────────────────┘                           └──────────────────────────────┘
```

---

## 4. 🔑 Core Modules & Features Explained Simply

| Module | What It Does | Why It Matters |
|---|---|---|
| **1. Command Center Dashboard** | Displays real-time KPIs: Today's Rain ($mm$), Annual Harvest Potential ($L$), Groundwater Depth ($m$), and Water Autonomy ($\%$). | Gives property owners an instant, high-level summary of their water security. |
| **2. Real-Time Meteorological Analysis** | Connects directly to satellite feeds (Open-Meteo) for live temperature, humidity, 24-hr rain, past 90-days accumulation, and 7-day storm forecasts. | Uses 100% real-time satellite data for any global city or GPS coordinate — no hardcoded mock data. |
| **3. Rainwater Harvesting Planner** | Computes gross and net harvestable volume based on roof area ($m^2$) and roofing material (Concrete, Metal, Tiles, Pavers). | Tells the user exactly how many litres of clean water they can collect per year. |
| **4. Groundwater Recharge Planner** | Assesses soil permeability (Sandy Loam, Clay, Silt) and water table depth to recommend **Recharge Pits, Trenches, Injection Wells, or Percolation Ponds**. | Prevents borewells from running dry by injecting rooftop overflow directly into the aquifer. |
| **5. Water Simulator (What-If Scenarios)** | Interactive sliders for rainfall, tank capacity, and daily demand to test **Scenario A (No RWH)** vs **Scenario B (RWH Only)** vs **Scenario C (RWH + Recharge)**. | Shows how a simple storage tank can provide **60–120 days** of independent water supply. |
| **6. Interactive GIS Water Map** | Leaflet-based map centered on the user's real location with color-coded aquifer stress zones (Healthy, Moderate, Critical). | Helps communities visualize localized groundwater health and nearby recharge swales. |
| **7. Aqua AI Hydrological Assistant** | An AI chatbot (Groq / Qwen / OpenAI) grounded in the user's active property profile. | Answers user questions in simple language with structured formulas and actionable recommendations. |

---

## 5. 🔬 Physical & Mathematical Formulas (Simple Breakdown)

AquaRegen calculates water yield using **Central Ground Water Board (CGWB)** and standard hydrological equations:

### Step 1: Rooftop Harvesting Potential
$$\text{Harvest Volume (Litres)} = \text{Precipitation (mm)} \times \text{Roof Area } (m^2) \times \text{Runoff Coefficient } (C)$$

- **Concrete Terrace:** $C = 0.85$ ($85\%$ captured)
- **Metal / Corrugated Roof:** $C = 0.90$ ($90\%$ captured)
- **Clay / Mangalore Tile:** $C = 0.75$ ($75\%$ captured)

> *Example:* A $120\text{ m}^2$ concrete roof in a region with $850\text{ mm}$ annual rainfall:
> $$\text{Gross Yield} = 850 \times 120 \times 0.85 = \mathbf{86,700\text{ Litres/year}}$$

### Step 2: First-Flush Diversion
$$\text{First Flush} = \text{Roof Area } (m^2) \times 1.5\text{ mm} \times C$$
*The first $1.5\text{ mm}$ of rainfall washes dust, leaves, and bird droppings off the roof and is safely diverted.*

### Step 3: Net Clean Water Available
$$\text{Net Yield} = (\text{Gross Yield} - \text{First Flush}) \times 0.90\text{ (Filter Efficiency)}$$
$$\text{Net Clean Yield} = (86,700 - 153) \times 0.90 \approx \mathbf{77,892\text{ Litres of pure water}}$$

---

## 6. 👥 Target Beneficiaries & Applications

1. **Individual Households & Villas:**
   - Eliminate or reduce private water tanker purchases during summer months.
   - Achieve 30–90 days of domestic water independence.
2. **Apartment Complexes & Gated Communities:**
   - Collective rooftop rainwater harvesting storing **500,000+ Litres**.
   - Recharge injection shafts to replenish community borewells.
3. **Educational Campuses & Universities:**
   - Large catchment areas (colleges, hostels, auditoriums) routed into percolation ponds and recharge swales.
4. **Municipal Town Planners & Environmental Officers:**
   - City-wide rainwater harvesting compliance and aquifer health monitoring.

---

## 7. 🌿 Environmental & Financial Impact

- **Financial Savings:** A typical household saves **₹15,000 to ₹40,000+ annually** on water tanker deliveries.
- **Aquifer Revival:** Recharging $80,000\text{ L}$ of rainwater back into the ground raises local water tables by **0.5m to 1.8m** over 3 years.
- **Urban Flood Prevention:** Storing and infiltrating rooftop water prevents waterlogging and stormwater drain overflow.
- **Zero Carbon Footprint:** Gravity-fed rainwater capture requires zero electrical pumping energy compared to municipal supply pipelines.

---

## 8. 💻 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons | Responsive climate-tech UI, radial gauges, interactive sliders |
| **Visualization** | Recharts, Leaflet GIS Maps | Monthly precipitation charts, 7-day radar forecasts, geospatial aquifer mapping |
| **Backend** | Python 3.10+, FastAPI, Uvicorn | High-performance asynchronous REST API and calculation engine |
| **Real-Time Weather** | Open-Meteo API & OpenStreetMap Nominatim | Live meteorological sensors and global GPS reverse-geocoding |
| **Database** | MongoDB Atlas Cloud + Local JSON Store | Dual-layer persistence for users, properties, and recharge zones |
| **AI Decision Engine** | Groq API (`qwen/qwen3.6-27b`) | Context-aware hydrological intelligence and advisory chatbot |

---

## 9. 🏁 Conclusion

**AquaRegen** converts complex environmental science into actionable, 1-click decision support. By giving citizens and institutions the tools to capture rainwater and recharge their aquifers, the platform turns every rooftop into a source of long-term water security.

---
*Created with 💧 for Sustainable Water Management and Climate Resilience.*
