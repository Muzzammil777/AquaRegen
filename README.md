<div align="center">

# 💧 AquaRegen
### Smart Rainwater Harvesting & Groundwater Recharge Decision-Support Platform

> **Turn Rainfall Into Water Security.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Open-Meteo](https://img.shields.io/badge/Open--Meteo-Live_Weather_API-159BD7.svg?style=flat)](https://open-meteo.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<br />

[Explore Features](#-key-features) •
[Quick Start](#-quick-start-windows-1-click) •
[Real-Time Weather](#-real-time-meteorological-integration) •
[Hydrological Science](#-hydrological-formulas--scientific-basis) •
[MongoDB Atlas](#-mongodb-atlas-cloud-configuration) •
[API Docs](#-api-architecture--endpoints)

</div>

---

## 🌍 Overview

**AquaRegen** is a climate-tech decision-support platform designed for households, apartment communities, educational campuses, industrial facilities, and municipal environmental planners.

It transforms local precipitation and property data into scientifically grounded **rainwater harvesting potential, artificial groundwater recharge designs, dynamic water availability simulations, and long-term sustainability impact analytics**.

```
              ┌─────────────────────────────────────────────────────────────┐
              │                   ATMOSPHERIC PRECIPITATION                 │
              │         (Live Open-Meteo Real-Time Satellite Feed)           │
              └──────────────────────────────┬──────────────────────────────┘
                                             │
                                             ▼
              ┌─────────────────────────────────────────────────────────────┐
              │                   ROOFTOP CATCHMENT AREA                    │
              │        Concrete (0.85), Metal (0.90), Tile (0.75), etc.     │
              └──────────────────────────────┬──────────────────────────────┘
                                             │
                                             ▼
              ┌─────────────────────────────────────────────────────────────┐
              │                  FIRST-FLUSH & MESH FILTER                  │
              │             1.5 mm Diversion + 90% Filter Pack              │
              └───────────────────────┬─────────────┬───────────────────────┘
                                      │             │
                    [Inflow]          │             │ [Overflow Surplus]
                                      ▼             ▼
  ┌────────────────────────────────────────┐   ┌────────────────────────────────────────┐
  │         MODULAR STORAGE TANK           │   │      ARTIFICIAL RECHARGE STRUCTURE     │
  │     Supplies Daily Domestic Demand     │   │      (Recharge Pit / Well / Trench)    │
  │     (30-90 Days of Water Autonomy)     │   │   Injected Directly Into Local Aquifer │
  └────────────────────────────────────────┘   └────────────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. 🎛️ Command Center Dashboard (`/dashboard`)
- **4 Real-Time KPI Cards:** Recent Precipitation ($mm$), Harvestable Water ($L/\text{year}$), Groundwater Depth ($m$), and Water Availability ($\%$).
- **Interactive Rainfall Trend Chart:** Toggle between Daily, Weekly, and Monthly precipitation distributions.
- **Radial SVG Water Gauge:** Visual autonomy gauge tracking days of self-sufficient water storage.
- **Water Balance Breakdown:** Comparative breakdown of Harvested Rainwater vs Annual Demand vs Aquifer Recharge vs Groundwater Drawn.
- **5-Year Aquifer History:** Historical water table trends with interpretative sustainability status tags.

### 2. 🌧️ Real-Time Rainfall & Weather Analysis (`/rainfall`)
- **Live Satellite Feed:** Real-time today's rain ($mm$), current temperature ($^\circ\text{C}$), humidity ($\%$), and past 90-days cumulative rainfall from Open-Meteo.
- **7-Day Live Precipitation Forecast:** Daily rainfall bar graph tracking upcoming storm events.
- **Global GPS & City Search:** Search any location worldwide with real-time OpenStreetMap Nominatim geocoding.

### 3. 📐 Rainwater Harvesting Planner (`/harvesting`)
- **Scientific Catchment Calculator:** Computes gross and net harvestable volume using $V = P \times A \times C$.
- **Transparent Mathematical Breakdown:** Step-by-step physical formula previews and runoff coefficient calibration.
- **Storage Sizing Optimization:** Recommends optimal tank capacities for dry-spell coverage.

### 4. 🌱 Groundwater Recharge Planner (`/groundwater`)
- **Recharge Suitability Score ($0-100\%$):** Geological permeability modeling based on soil typology and water table depth.
- **CGWB Engineering Structures:** Sizing and recommendations for **Recharge Pits**, **Recharge Trenches**, **Recharge Injection Wells / Shafts**, and **Percolation Ponds**.
- **Filter Media Specs:** Sizing for graded gravel, coarse sand, and boulder filtration packs.

### 5. 🔮 Water Simulator & What-If Scenario Matrix (`/simulator`)
- **Dynamic Real-Time Sliders:** Adjust rainfall, roof area, tank storage, daily demand, and recharge capacity on the fly.
- **Side-by-Side Scenario Matrix:**
  - **Scenario A (100% Depletion):** Without Rainwater Harvesting
  - **Scenario B (Moderate Autonomy):** With Rainwater Harvesting Only
  - **Scenario C (Optimal Security):** With RWH + Groundwater Recharge

### 6. 🗺️ Interactive GIS Water Map (`/map`)
- **Leaflet OpenStreetMap:** Visualizes localized recharge zones, storage tanks, and critical aquifer stress areas.
- **Status Indicators:** 🟢 Healthy, 🟡 Moderate, 🔴 Critical stress filters.
- **Zone Details Drawer:** Slide-out drawer with localized soil permeability, rainfall depth, and recommended interventions.

### 7. 🤖 Aqua AI Decision Assistant (`/ai`)
- **Context-Grounded Hydrological Intelligence:** Pre-loaded with your active property parameters.
- **Supported Backends:** Connects to Groq (`qwen/qwen3.6-27b`, `llama-3.3-70b`) or OpenAI via `.env`, backed by an embedded hydrological rule engine.
- **Rich Markdown Formatting:** Formatted bullet lists, formulas, and step badges.

---

## 🚀 Quick Start (Windows 1-Click)

The fastest way to launch the full platform:

```bat
start.bat
```

### What `start.bat` does automatically:
1. Detects your **Python 3.10+** and **Node.js/NPM** environments.
2. Creates `backend/.env` if not already present.
3. Automatically verifies and installs Python and Frontend NPM dependencies.
4. Starts the **FastAPI Backend** on `http://localhost:8000`.
5. Starts the **React Frontend** on `http://localhost:5173` and opens your browser!

---

## 🍃 MongoDB Atlas Cloud Configuration

AquaRegen supports **MongoDB Atlas** with a seamless local JSON document store fallback.

1. Open [`backend/.env`](file:///backend/.env)
2. Add your MongoDB Atlas connection URI:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aquaregen_db?retryWrites=true&w=majority"
   DATABASE_NAME="aquaregen_db"
   ```
3. **Important (Atlas Security):** In MongoDB Atlas, go to **Network Access** $\rightarrow$ **+ Add IP Address** $\rightarrow$ select **Allow Access from Anywhere** (`0.0.0.0/0`) or add your current IP address.
4. Restart [`start.bat`](file:///start.bat) — AquaRegen will connect to your cluster and seed the initial data!

---

## 📡 Real-Time Meteorological Integration

AquaRegen fetches live weather directly from the [Open-Meteo API](https://open-meteo.com) without requiring any API keys:

- **Live Precipitation:** `https://api.open-meteo.com/v1/forecast?daily=precipitation_sum&current=precipitation,temperature_2m,relative_humidity_2m`
- **Reverse Geocoding:** `https://nominatim.openstreetmap.org/reverse`
- **Global Search:** `https://nominatim.openstreetmap.org/search`

---

## 🔬 Hydrological Formulas & Scientific Basis

AquaRegen calculations adhere to **Central Ground Water Board (CGWB)** norms and standard physical hydrology equations:

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
  - Extensive Green Roof: **0.35**

> **Unit Verification:** $1\text{ mm rainfall} \times 1\text{ m}^2 \text{ area} = 0.001\text{ m} \times 1\text{ m}^2 = 0.001\text{ m}^3 = 1.0\text{ Litre}$.

### 2. First-Flush Wash Deduction
$$V_{\text{flush}} = A \times 1.5\text{ mm} \times C$$
Initial $1.5\text{ mm}$ of precipitation carries atmospheric dust and roof sediment and is automatically diverted.

### 3. Net Harvestable Volume
$$V_{\text{net}} = (V_{\text{gross}} - V_{\text{flush}}) \times \eta_{\text{filter}}$$
Where $\eta_{\text{filter}} = 0.90$ ($90\%$ filtration efficiency).

---

## 📂 Project Structure

```text
EVS/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints/         # FastAPI REST routers (auth, dashboard, rainfall, etc.)
│   │   ├── core/                  # Security, config, JWT encoding
│   │   ├── db/                    # MongoDB Atlas & local JSON repository
│   │   ├── schemas/               # Pydantic validation schemas
│   │   └── services/
│   │       ├── hydro_engine.py    # Physical hydrological calculation engine
│   │       ├── simulator_service.py # 12-month mass-balance water simulator
│   │       ├── weather_service.py # Open-Meteo real-time satellite weather service
│   │       └── ai_service.py      # Aqua AI assistant (Groq/OpenAI/Fallback)
│   ├── tests/                     # Pytest calculation engine test suite
│   ├── main.py                    # FastAPI server entrypoint
│   ├── requirements.txt           # Python dependencies
│   └── .env.example               # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # KpiCard, WaterGauge, FormattedMessage, etc.
│   │   │   └── layout/            # TopNavbar, Sidebar, AppLayout
│   │   ├── context/               # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/                 # 12 platform pages (Landing, Dashboard, etc.)
│   │   ├── services/              # Axios REST API client
│   │   ├── types/                 # TypeScript domain interfaces
│   │   ├── utils/                 # Geolocation & GPS detection utilities
│   │   ├── App.tsx                # Main router
│   │   └── index.css              # Tailwind v4 theme tokens
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.app.json
├── start.bat                      # 1-Click Windows execution script
├── .gitignore                     # Git ignore rules
└── README.md                      # Platform documentation
```

---

## 🔑 Demo Account Credentials

- **Email:** `demo@aquaregen.com`
- **Password:** `password123`
- *Or click **"1-Click Demo"** on the Landing / Login page for immediate access!*

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with 💧 for sustainable water security and climate resilience.</sub>
</div>
