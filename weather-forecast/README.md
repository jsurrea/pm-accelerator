# Weather Trend Forecasting — Global Climate Intelligence

> **PM Accelerator Mission:** "By making industry-leading tools and education available to individuals from all backgrounds, we level the playing field for future PM leaders."

---

## Overview

This project delivers an end-to-end data science pipeline for global weather trend analysis and forecasting. It covers exploratory data analysis, spatial visualisation, environmental impact assessment, machine learning feature importance, and time-series forecasting (Prophet + SARIMA) on a two-year dataset spanning 257 capital cities across 211 countries.

**Author:** Juan Sebastian Urrea | **Program:** PM Accelerator Internship | **Year:** 2026

---

## Dataset

| Property | Value |
|---|---|
| File | `data/GlobalWeatherRepository.csv` |
| Rows | 142,093 |
| Columns | 41 |
| Date Range | 2024-05-16 → 2026-05-18 (731 days) |
| Locations | 257 unique capital cities |
| Countries | 211 |
| Frequency | ~1 reading per location per day |

### Key Columns

- **Identifiers:** `country`, `location_name`, `latitude`, `longitude`, `last_updated`
- **Temperature:** `temperature_celsius`, `temperature_fahrenheit`, `feels_like_celsius`
- **Atmosphere:** `humidity`, `pressure_mb`, `cloud`, `visibility_km`, `uv_index`
- **Wind:** `wind_mph`, `wind_kph`, `wind_degree`, `wind_direction`, `gust_mph`
- **Precipitation:** `precip_mm`, `condition_text`
- **Air Quality:** `air_quality_Carbon_Monoxide`, `air_quality_Ozone`, `air_quality_Nitrogen_dioxide`, `air_quality_Sulphur_dioxide`, `air_quality_PM2.5`, `air_quality_PM10`, `air_quality_us-epa-index`, `air_quality_gb-defra-index`
- **Astronomy:** `sunrise`, `sunset`, `moonrise`, `moonset`, `moon_phase`, `moon_illumination`

### Known Data Quality Issues

- **Sentinel values:** `-9999.0` in air quality columns (replaced with `NaN`)
- **Duplicate entries:** ~250 duplicate first-day records (deduplicated by keeping latest reading per location per day)
- **Non-ASCII country names:** 10 entries require mapping to English names

---

## Project Structure

```
weather-forecast/
├── data/
│   └── GlobalWeatherRepository.csv      # Raw dataset
├── outputs/
│   ├── figures/                         # Saved matplotlib/seaborn plots
│   ├── temperature_map.html             # Folium bubble map
│   └── pm25_heatmap.html                # Folium PM2.5 heatmap
├── weather_forecast_analysis.ipynb      # Main analysis notebook
├── create_notebook.py                   # Script that generated the notebook
├── requirements.txt                     # Python dependencies
└── README.md                            # This file
```

---

## Installation

```bash
# Create and activate a virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate        # macOS/Linux
# .venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

> **Python version:** 3.10+ recommended. Prophet requires `pystan`; installation is handled automatically by `pip install prophet`.

---

## How to Run

```bash
jupyter notebook weather_forecast_analysis.ipynb
```

Then run all cells top-to-bottom with **Kernel → Restart & Run All**.

---

## Notebook Sections

| # | Section | Key Techniques |
|---|---|---|
| 1 | Setup & Imports | Environment configuration, directory setup |
| 2 | Data Loading & Initial Inspection | Shape, dtypes, `.describe()`, date range |
| 3 | Data Cleaning & Preprocessing | Sentinel removal, deduplication, feature engineering, continent mapping |
| 4 | Advanced EDA | Distribution plots, wind rose, correlation heatmap, anomaly detection (IsolationForest) |
| 5 | Spatial Analysis | Choropleth map, Folium bubble map, PM2.5 heatmap, continental comparisons |
| 6 | Climate Analysis | City-level trends, rolling averages, seasonal decomposition, YoY comparison |
| 7 | Environmental Impact | AQ–weather correlations, EPA index distributions, PM2.5 vs wind speed |
| 8 | Feature Importance (RF) | RandomForestRegressor, temporal train/test split, MAE/RMSE, feature importance chart |
| 9 | Time Series Forecasting | Prophet (daily), SARIMA (monthly), ensemble weighting, multi-city evaluation |
| 10 | Insights & Conclusions | Key findings, model recommendations, business applications, future work |

---

## Key Analyses Performed

- **Global temperature heatmap** by country (Plotly choropleth)
- **Wind rose** showing mean wind speed by compass direction
- **Anomaly detection** using Isolation Forest (2% contamination) across 6 meteorological features
- **Seasonal decomposition** of Tokyo temperature into trend, seasonal, and residual components
- **Year-over-year comparison** (2024 vs 2025) for 6 focus cities
- **Air quality spatial heatmap** (PM2.5) via Folium
- **Random Forest feature importance** with temporal train/test split (pre/post 2026-01-01)
- **Prophet forecast** for Tokyo with 60-day horizon
- **SARIMA(2,1,2)×(1,1,1,12) forecast** on monthly-resampled data
- **Inverse-MAE weighted ensemble** combining Prophet and SARIMA predictions
- **Multi-city Prophet evaluation** (5 cities, MAE table)

---

## License

MIT License — Copyright (c) 2026 Juan Sebastian Urrea. See [LICENSE](../LICENSE) for details.

The dataset (`GlobalWeatherRepository.csv`) is sourced from [Kaggle — Global Weather Repository](https://www.kaggle.com/datasets/nelgiriyewithana/global-weather-repository/code) and is subject to its original license terms.
