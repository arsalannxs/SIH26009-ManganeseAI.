# ManganeseAI

### AI-Powered Manganese Reserve & Production Intelligence

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-22c55e)](https://recharts.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-8E75C2?logo=google&logoColor=white)](https://ai.google.dev/)

> **Smart India Hackathon 2026 Problem Statement SIH26009**  
> **Title:** Using AI/ML and Space Technology to Identify Manganese Reserves and Overcome Production Shortfalls  
> **Organization:** Ministry of Steel | **Department:** MOIL Ltd. | **Theme:** Space Technology | **Category:** Software  

**ManganeseAI** is a full-stack decision-support platform designed to assist mining engineers, geologists, and production planning teams in identifying prospective manganese-bearing zones and predicting operational production shortfalls. The system fuses geological field indicators, simulated satellite remote-sensing data, and mine operational telemetry into deterministic analytical models paired with Google Gemini AI explanations.

---

## Problem Statement (SIH26009)

Manganese is an essential strategic mineral for steelmaking and energy storage technologies. Traditional workflows face key hurdles:

1. **Exploration Inefficiencies**: Identifying prospective manganese reserves relies heavily on historical field records and intensive diamond core drilling without rapid space-borne reconnaissance screening.
2. **Production Shortfalls**: Planned monthly extraction targets are frequently compromised by unforeseen Heavy Earth Moving Machinery (HEMM) downtime, extreme weather conditions, blasting cycle delays, and bench grade variations.
3. **Data Silos**: Exploration geology, satellite remote sensing, fleet dispatch, and meteorological data remain isolated, hindering proactive decision-making.

---

## Proposed Solution

ManganeseAI bridges these silos through a streamlined analytical pipeline:

```
Geological Data (Lithology & Float)
           +
Simulated Remote-Sensing (SWIR & NDVI)
           +
Historical Production & Fleet Uptime
           +
Operational & Meteorological Factors
           ↓
   Analytical Models & Calculations
           ↓
Reserve Potential Score (0–100) + Production Forecast & Gap
           ↓
Shortfall Root-Cause Decomposition & What-If Simulator
           ↓
Google Gemini AI Explanation & Actionable Recommendations
```

---

## Key Features

- **Dashboard Analytics**: Top-level executive metrics for potential reserve zones, next month's forecast, shortfall risk level, and active concession summaries with standard mining status colors.
- **Interactive Reserve Mapping (GIS)**: Spatial concession map representing the Nagpur-Bhandara-Balaghat manganese mining belt. Includes interactive zone polygons, exploration borehole drill holes, Sausar synclinal fault lines, and simulated Sentinel-2 SWIR mineral reflectance overlays.
- **Reserve Potential Analysis (0–100)**: Multi-criteria weighted scoring model evaluating host Gondite rock lithology, surface pyrolusite indicators, satellite shortwave infrared (SWIR) absorption, core assays, and terrain slope.
- **Production Forecasting**: Models next month's output (MT) against operational targets using working days, equipment availability, ore grade recovery (% Mn), weather conditions, and blasting schedules.
- **Production Shortfall Risk Engine**: Classifies operational risk as **Low**, **Moderate**, **High**, or **Critical**, providing root-cause percentage contributions for equipment downtime, weather disruptions, and blasting turnaround.
- **What-If Scenario Simulator**: Interactive sliders allowing mine managers to test adjustments in equipment availability (%), working days, weather impact, and blasting delay to observe real-time impacts on output.
- **ManganeseAI Copilot**: In-app AI assistant powered by Google Gemini (`gemini-3.8-flash`) that answers questions grounded strictly in active concession and production telemetry.
- **Auditable Dossier Reports**: Generates structured, downloadable, and printable Area Analysis, Production Forecast, and Shortfall Analysis reports.
- **SIH Demo / Simulation Mode**: A 1-click guided 11-step interactive walkthrough showcasing the entire application workflow in under two minutes.

---

## How It Works

The platform enforces a simple, user-friendly workflow:

```
[ SELECT AREA ]
       ↓
[ ANALYZE AREA ]
       ↓
[ AI / GIS MAPPING ]
       ↓
[ RESERVE POTENTIAL ]
       ↓
[ PRODUCTION FORECAST ]
       ↓
[ SHORTFALL RISK ]
       ↓
[ RECOMMENDATION ]
```

---

## Reserve Potential Analysis

The reserve intelligence engine analyzes multiple data categories to calculate a **Reserve Potential Score (0–100)**:

| Category | Weight | Indicators Evaluated |
| :--- | :---: | :--- |
| **Geological Formation** | 45% | Sausar Group Gondite lithology, pyrolusite/braunite float, gossanous capping |
| **Satellite Remote Sensing** | 35% | Simulated Sentinel-2 SWIR B11/B12 absorption, Landsat-8 NDVI canopy stress |
| **Historical Exploration** | 10% | Core borehole log intercepts, subsurface thickness, ore continuity |
| **Terrain & Elevation** | 10% | Topographic ridge slope, surface drainage, bench excavation stability |

### Score Categories
- **80–100**: High Potential (Exploration Priority 1)
- **60–79**: Moderate Potential (Exploration Priority 2)
- **40–59**: Low Potential
- **0–39**: Very Low / Uncertain

> **Important Disclaimer**: Scores represent **Model Estimates** and **Potential Zones** for exploration prioritization and planning. They do not constitute officially verified or JORC/UNFC-certified mineral reserves.

---

## Production Forecasting & Shortfall Analysis

The forecasting engine computes expected manganese dispatch based on planned operating variables:

$$\text{Expected Output (MT)} = \left(\frac{\text{Target MT}}{\text{Standard Days}}\right) \times \text{Working Days} \times \text{Equipment Factor} \times \text{Weather Factor} \times \text{Blasting Factor}$$

### Key Operational Metrics
- **Current Production**: February baseline dispatch (e.g., 84,100 MT)
- **Expected Production**: Machine learning forecast (e.g., 82,500 MT)
- **Target Production**: MOIL operational monthly benchmark (e.g., 90,000 MT)
- **Production Gap**: Projected deficit (e.g., 7,500 MT / 8.3% deficit)
- **Shortfall Risk**: Categorized as **Low**, **Moderate**, **High**, or **Critical**

### Root-Cause Factor Breakdown
The shortfall module decomposes the gap into contributing drivers:
- **Equipment Downtime / Availability** (typically 35%–48% of deficit when below 85% availability)
- **Weather & Climate Disruptions** (monsoon bench flooding or severe heat shifts)
- **Blasting Schedule Delays** (rock fragmentation and face charging turnaround)
- **Working Days & Ore Availability** (planned operational shifts and grade constraints)

---

## Role of Artificial Intelligence

ManganeseAI clearly separates **deterministic calculations** from **generative AI interpretations**:

1. **Numerical Engine (Deterministic)**: All reserve scores, production tonnage forecasts, deficit gaps, and factor contribution percentages are computed via mathematical models and domain logic.
2. **Google Gemini (`gemini-3.8-flash`)**:
   - Synthesizes concise **"Why This Area?"** geological explanations.
   - Generates natural language summaries of production gaps.
   - Produces prioritized, decision-support engineering recommendations.
   - Powers the interactive **ManganeseAI Copilot** for domain-specific user queries.
   - Includes graceful, grounded rule-based fallbacks if API keys are unset.

---

## GIS & Spatial Mapping

The interactive mapping view provides a spatial visualization of the mining concession grid:
- **Color-Coded Status**:
  - 🟢 **Green**: High Potential Zone
  - 🟡 **Yellow**: Moderate Potential Zone
  - 🔴 **Red**: Low Potential / Uncertain
  - 🔵 **Blue**: Existing Operating Mine
- **Layer Controls**:
  - **SWIR Heatmap**: Simulated Sentinel-2 shortwave infrared reflectance anomaly.
  - **Boreholes**: Spatial positions of exploratory core drillings.
  - **Fault Lines**: Regional Sausar synclinal shear axes.

> **Data Disclosure**: Geospatial satellite indices and remote-sensing overlays in the prototype are **simulated demo datasets** grounded in published spectral characteristics of manganese oxyhydroxides.

---

## SIH Demo / Simulation Mode

Clicking the **RUN DEMO** button launches a 1-to-2 minute guided simulation covering 11 progressive stages:
1. Select concession (Area A - Mansar East Extension).
2. Display interactive GIS map with zone boundaries.
3. Review geological indicators (Gondite formation, pyrolusite float).
4. Review simulated satellite remote-sensing indices (SWIR & NDVI).
5. Generate Reserve Potential Score (84/100 - High Potential).
6. Inspect 6-month historical production dispatch curves.
7. Generate next month's forecast (82,500 MT).
8. Compute projected production gap (7,500 MT, Moderate Risk).
9. Decompose shortfall drivers (HEMM downtime, weather, blasting).
10. Generate Gemini AI narrative explanation.
11. Present actionable mitigation and exploration recommendations.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, TypeScript | Reactive, component-based user interface |
| **Build Tool** | Vite 8 | Fast frontend bundling and HMR in dev |
| **Styling** | Tailwind CSS v4 | Clean, accessible design system with status colors |
| **Icons & Visuals** | Lucide React | Professional UI iconography |
| **Data Visualization** | Recharts 2 | Production curves, trend filters, and factor bar charts |
| **Backend Runtime** | Node.js, Express 4, TypeScript (`tsx`) | REST API proxy, calculation engines, and static serving |
| **AI Integration** | Google GenAI SDK (`@google/genai`) | Server-side Gemini 3.8 Flash for narrative synthesis |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` | Token signing and credential hashing |
| **Data Layer** | In-Memory Database (`server/db.ts`) | Pre-seeded synthetic MOIL concession records |

---

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Client                      │
│   (Dashboard, Reserve Map, Forecast, Shortfall, Copilot)│
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST
┌───────────────────────────▼────────────────────────────┐
│               Express Server (server.ts)               │
│                                                        │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │   Analysis Engine    │    │   Google GenAI SDK   │  │
│  │ (Scoring & Forecast) │    │  (gemini-3.8-flash)  │  │
│  └──────────┬───────────┘    └──────────┬───────────┘  │
│             │                           │              │
│  ┌──────────▼───────────────────────────▼───────────┐  │
│  │         Synthetic Concession Database            │  │
│  │      (Geology, Satellite, Production, Fleets)    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules for node_modules and secrets
├── index.html                 # HTML application entry point
├── metadata.json              # AI Studio project capabilities
├── package.json               # Dependencies and build scripts
├── README.md                  # Project documentation
├── SECURITY.md                # Security and secret handling guidelines
├── server.ts                  # Express full-stack server entry point
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── server/                    # Backend services and logic
│   ├── ai.ts                  # Gemini API client and narrative synthesis
│   ├── analysis.ts            # Scoring algorithms, forecasting, and shortfall logic
│   ├── db.ts                  # In-memory database with synthetic MOIL seed data
│   ├── routes.ts              # REST API endpoints (/api/*)
│   └── types.ts               # Server data interfaces
└── src/                       # Frontend application
    ├── App.tsx                # Main application state and layout
    ├── index.css              # Global Tailwind CSS imports
    ├── main.tsx               # React DOM entry point
    ├── types.ts               # Frontend TypeScript interfaces
    ├── components/            # UI components
    │   ├── CopilotDrawer.tsx  # ManganeseAI Copilot slide-over assistant
    │   ├── DashboardView.tsx  # Main analytics dashboard
    │   ├── DataIndicatorsView.tsx # Data source and telemetry directory
    │   ├── DemoModal.tsx      # Guided 11-step hackathon simulation
    │   ├── Header.tsx         # Top bar with area selector and action buttons
    │   ├── Navigation.tsx     # Tabbed view navigation
    │   ├── ProductionForecastView.tsx # Forecasting inputs and Recharts curve
    │   ├── ReportsView.tsx    # Dossier generator and printable view
    │   ├── ReserveMappingView.tsx # Interactive GIS concession map
    │   ├── SettingsView.tsx   # Model weight calibrations and thresholds
    │   └── ShortfallAnalysisView.tsx # Factor decomposition and What-If simulator
    └── services/
        └── api.ts             # Typed REST API client
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Clone Repository
```bash
git clone https://github.com/your-username/manganese-ai.git
cd manganese-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```

Edit `.env` to supply your configuration:
```env
# Required for Google Gemini AI explanations (fallback active if omitted)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional JWT secret for authenticated sessions
JWT_SECRET="YOUR_JWT_SECRET_KEY"
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with Express serving API endpoints and mounting Vite dev middleware.

### 5. Build for Production
```bash
npm run build
npm start
```

### 6. Lint & Type Check
```bash
npm run lint
```

---

## Environment Variables

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `GEMINI_API_KEY` | Google Gemini API key for narrative explanations and Copilot | Optional | Fallback responses enabled |
| `JWT_SECRET` | Secret key used to sign session tokens | Optional | Default internal fallback key |
| `PORT` | HTTP port for the Express full-stack server | Optional | `3000` |

---

## License & Attribution

Developed for **Smart India Hackathon 2026** (Problem Statement SIH26009) under the aegis of the **Ministry of Steel** and **MOIL Limited**.
