<div align="center">

# 💧 AquaRegen
### Smart Rainwater Harvesting & Groundwater Recharge Decision-Support Platform

<p align="center">
  <b>Turn Rainfall Into Long-Term Water Security.</b><br>
  <i>An AI-powered climate-tech platform converting meteorological satellite data into actionable rooftop catchment sizing, artificial aquifer recharge designs, and dry-spell simulations.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Open--Meteo-Live_Radar_API-159BD7?style=for-the-badge&logo=openmeteo&logoColor=white" alt="Open-Meteo" />
  <img src="https://img.shields.io/badge/Groq_AI-Qwen_3.6--27B-F55036?style=for-the-badge&logo=openai&logoColor=white" alt="Groq AI" />
</p>

---

[Explore Features](#-key-features) •
[Problem & Solution](#-problem-vs-solution) •
[Quick Start](#-quick-start-1-click-local-run) •
[Hydrological Science](#-scientific-hydrology-formulas) •
[Render Deployment](#-deployment-guide-render) •
[API Reference](#-api-architecture)

---

</div>

## 🛠️ Built With

<div align="center">

| Layer | Technologies & Libraries |
|---|---|
| **Frontend UI** | <img src="https://skillicons.dev/icons?i=react,ts,tailwind,vite,html,css" height="40" /> |
| **Backend & Engine** | <img src="https://skillicons.dev/icons?i=python,fastapi" height="40" /> |
| **Database & Cloud** | <img src="https://skillicons.dev/icons?i=mongodb,github,postman" height="40" /> |
| **Mapping & Analytics** | **Leaflet GIS Maps** • **Recharts Interactive Visualizations** • **Open-Meteo Satellite API** |
| **AI Intelligence** | **Groq LPU Engine** (`qwen/qwen3.6-27b`) • **Hydrological Rule Grounding** |

</div>

---

## 🌊 The Water Cycle Architecture

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                 ATMOSPHERIC PRECIPITATION                   │
                    │         (Live Open-Meteo Real-Time Satellite Feed)          │
                    └──────────────────────────────┬──────────────────────────────┘
                                                   │
                                                   ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                 ROOFTOP CATCHMENT AREA                      │
                    │        Concrete (0.85), Metal (0.90), Tile (0.75), etc.     │
                    └──────────────────────────────┬──────────────────────────────┘
                                                   │
                                                   ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                FIRST-FLUSH & MESH FILTER                    │
                    │             1.5 mm Diversion + 90% Filter Pack              │
                    └───────────────────────┬─────────────┬───────────────────────┘
                                            │             │
                          [Clean Inflow]    │             │ [Overflow Surplus]
                                            ▼             ▼
        ┌────────────────────────────────────────┐   ┌────────────────────────────────────────┐
        │         MODULAR STORAGE TANK           │   │      ARTIFICIAL RECHARGE STRUCTURE     │
        │     Supplies Daily Domestic Demand     │   │      (Recharge Pit / Well / Trench)    │
        │     (30-90 Days of Water Autonomy)     │   │   Injected Directly Into Local Aquifer │
        └────────────────────────────────────────┘   └────────────────────────────────────────┘
```

---

## 🚨 Problem vs Solution

| The Crisis Today ❌ | AquaRegen Solution ✅ |
|---|---|
| **Urban Groundwater Depletion:** Over-extraction from deep borewells drops water tables below 50–100m. | **Active Aquifer Recharge:** Sizing calculations for recharge pits and deep injection shafts to raise the local water table. |
| **Monsoon Flooding & Runoff Waste:** Over 80% of urban precipitation runs off concrete into drains. | **Catchment Harvesting:** Scientific formulas compute clean capture ($V = P \times A \times C$) to store thousands of litres. |
| **Crippling Water Tanker Bills:** Homes and apartments spend ₹5,000 to ₹30,000+ monthly in dry seasons. | **Autonomous Storage Sizing:** 12-month mass-balance simulator models optimal tank capacities for 60–120 days of water autonomy. |
| **Zero Scientific Guidance:** Citizens don't know their soil type, filtration needs, or harvest potential. | **AI Decision Assistant:** Context-grounded conversational AI providing step-by-step engineering recommendations. |

---

## 🌟 Key Features

### 1. 🎛️ Command Center Dashboard (`/dashboard`)
- **Real-Time KPI Telemetry:** Today's Precipitation ($mm$), Annual Harvest Potential ($L/\text{year}$), Groundwater Depth ($m$), and Autonomy Sufficiency ($\%$).
- **Interactive Radial Water Gauge:** Dynamic SVG gauge tracking days of self-sufficient water storage.
- **Annual Water Balance Breakdown:** Side-by-side comparison of harvested rainwater vs consumption vs aquifer recharge.
- **5-Year Aquifer History:** Historical water table trends with interpretative sustainability status tags.

### 2. 🌧️ Real-Time Rainfall & Weather Analysis (`/rainfall`)
- **Live Satellite Sensor Feed:** Current temperature ($^\circ\text{C}$), humidity ($\%$), today's rain ($mm$), and past 90-days cumulative rainfall from Open-Meteo.
- **7-Day Storm Radar Forecast:** Daily rainfall bar graph tracking upcoming storm events.
- **Global GPS & City Search:** Search any city worldwide with real-time OpenStreetMap Nominatim geocoding.

### 3. 📐 Rainwater Harvesting Planner (`/harvesting`)
- **Catchment Yield Calculator:** Computes gross and net harvestable volume using $V = P \times A \times C$.
- **Transparent Mathematical Breakdown:** Step-by-step physical formula previews and runoff coefficient calibration.
- **Optimal Tank Sizing:** Recommends modular tank capacities for dry-spell coverage.

### 4. 🌱 Groundwater Recharge Planner (`/groundwater`)
- **Recharge Suitability Score ($0-100\%$):** Geological permeability modeling based on soil typology and water table depth.
- **CGWB Engineering Structures:** Specifications for **Recharge Pits**, **Recharge Trenches**, **Recharge Injection Wells / Shafts**, and **Percolation Ponds**.
- **Filter Media Specs:** Sizing for graded gravel, coarse sand, and boulder filtration packs.

### 5. 🔮 Water Simulator & Scenario Matrix (`/simulator`)
- **Dynamic Real-Time Sliders:** Adjust rainfall, roof area, tank storage, daily demand, and recharge capacity on the fly.
- **3-Scenario Comparison Matrix:**
  - **Scenario A (100% Depletion):** Without Rainwater Harvesting
  - **Scenario B (Moderate Autonomy):** With Rainwater Harvesting Only
  - **Scenario C (Optimal Security):** With RWH + Groundwater Recharge

### 6. 🗺️ Interactive GIS Water Map (`/map`)
- **Leaflet OpenStreetMap:** Automatically centers on your real location (e.g. Pugalur, Tamil Nadu) with color-coded aquifer stress zones.
- **Zone Details Drawer:** Slide-out drawer with localized soil permeability, rainfall depth, and recommended interventions.
- **1-Click Live GPS:** Instant device GPS lock for high-accuracy local telemetry.

### 7. 🤖 Aqua AI Decision Assistant (`/ai`)
- **Context-Grounded Hydrological Intelligence:** Pre-loaded with your active property parameters.
- **Powered by Groq (`qwen/qwen3.6-27b`):** Fast inference with rich markdown formatting, formulas, and step badges.

---

## 🔬 Scientific Hydrology Formulas

AquaRegen calculations adhere to **Central Ground Water Board (CGWB)** standards and standard physical hydrology equations:

### 1. Rooftop Harvesting Potential Equation
$$V = P \times A \times C$$

- $V$ = Harvestable Volume in **Litres**
- $P$ = Annual Precipitation in **mm**
- $A$ = Catchment Roof Area in **$\text{m}^2$**
- $C$ = Runoff Coefficient:
  - Reinforced Concrete Terrace: **0.85**
  - Corrugated Galvanized Metal: **0.90**
  - Clay / Mangalore Tile: **0.75**
  - Asphalt / Bitumen Shingle: **0.70**
  - Interlocking Paver Blocks: **0.60**

> **Unit Proof:** $1\text{ mm rainfall} \times 1\text{ m}^2 \text{ area} = 0.001\text{ m} \times 1\text{ m}^2 = 0.001\text{ m}^3 = 1.0\text{ Litre}$.

### 2. First-Flush Wash Deduction
$$V_{\text{flush}} = A \times 1.5\text{ mm} \times C$$
Initial $1.5\text{ mm}$ of precipitation carries atmospheric dust and roof sediment and is automatically diverted.

### 3. Net Clean Harvestable Volume
$$V_{\text{net}} = (V_{\text{gross}} - V_{\text{flush}}) \times \eta_{\text{filter}}$$
Where $\eta_{\text{filter}} = 0.90$ ($90\%$ filtration efficiency).

---

## 🚀 Quick Start (1-Click Local Run)

### Windows 1-Click Launch:
Simply run:
```bat
start.bat
```
*Auto-detects Python and Node.js, installs dependencies, boots FastAPI + Vite, and opens the browser!*

### Manual Execution:

```bash
# 1. Start Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 2. Start Frontend
cd ../frontend
npm install
npm run dev
```

---

## 🌐 Deployment Guide (Render)

### Backend (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/?appName=evsproject`
  - `DATABASE_NAME`: `aquaregen_db`
  - `JWT_SECRET`: `your-secret-key`
  - `GROQ_API_KEY`: `gsk_...`
  - `AI_MODEL`: `qwen/qwen3.6-27b`

### Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com/api`
- **Redirects / Rewrites:** `/*` $\rightarrow$ `/index.html` (Rewrite)

---

## 🔑 Demo Account

- **Email:** `demo@aquaregen.com`
- **Password:** `password123`
- *Or click **"1-Click Demo"** on the landing page for immediate instant access!*

---

## 📜 License

Distributed under the **MIT License**.

<div align="center">
  <sub>Built with 💧 for water security, aquifer regeneration, and climate resilience.</sub>
</div>
