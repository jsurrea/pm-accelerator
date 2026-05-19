# PM Accelerator Technical Assessments

**Candidate:** Juan Sebastian Urrea
**Program:** PM Accelerator — AI Engineer Intern
**Email:** jurrea@truora.com

> "By making industry-leading tools and education available to individuals from all backgrounds, we level the playing field for future PM leaders." — PM Accelerator

---

## Repository Structure

This repository contains two independent technical assessments:

```
pm-accelerator/
├── weather-app/          # Full Stack Assessment (Assessment 1 + 2)
└── weather-forecast/     # Data Science Assessment (Advanced)
```

---

## Assessment 1 & 2 — Full Stack Weather App

**Location:** [`weather-app/`](./weather-app/)

A production-ready full-stack weather application built with **Next.js 14**, **SQLite**, and real-world APIs. Covers both the frontend (Assessment 1) and backend (Assessment 2) requirements.

### Highlights

| Area | Details |
|------|---------|
| Frontend | Responsive UI, location search, geolocation, 5-day forecast, Leaflet maps, YouTube gallery |
| Backend | RESTful API routes, SQLite CRUD, Zod validation, 5-format data export (JSON/CSV/XML/PDF/MD) |
| Stack | Next.js 14 · TypeScript · Tailwind CSS · better-sqlite3 · React Leaflet · jsPDF |

### Quick Start

```bash
cd weather-app
npm install

# Create .env.local with your API keys:
# OPENWEATHER_API_KEY=your_key
# YOUTUBE_API_KEY=your_key

npm run dev
# Open http://localhost:3000
```

→ [Full documentation](./weather-app/README.md)

---

## Data Science Assessment — Weather Trend Forecasting (Advanced)

**Location:** [`weather-forecast/`](./weather-forecast/)

An end-to-end data science pipeline analyzing 142,000+ global weather records across 257 cities over two years. Implements the full **Advanced Assessment** including all five unique analyses.

### Highlights

| Area | Details |
|------|---------|
| Dataset | GlobalWeatherRepository.csv — 142,093 rows, 41 columns, 2024–2026 |
| EDA | Distribution plots, wind rose, correlation heatmap, IsolationForest anomaly detection |
| Spatial | Plotly choropleth, Folium bubble map + PM2.5 heatmap, continental comparisons |
| Forecasting | Prophet (daily) + SARIMA(2,1,2)×(1,1,1,12) (monthly) + inverse-MAE ensemble |
| Unique Analyses | Climate patterns, environmental impact, feature importance, spatial, geographical |

### Quick Start

```bash
cd weather-forecast
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
jupyter notebook weather_forecast_analysis.ipynb
# Run all cells: Kernel → Restart & Run All
```

→ [Full documentation](./weather-forecast/README.md)

---

## License

MIT License — see [LICENSE](./LICENSE)
