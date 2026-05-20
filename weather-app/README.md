# WeatherWise

**PM Accelerator Internship Portfolio Project**
**Candidate:** Juan Sebastian Urrea

> "By making industry-leading tools and education available to individuals from all backgrounds, we level the playing field for future PM leaders." — PM Accelerator

A full-stack weather application built with Next.js 14 (App Router), Turso (libsql), and real-world APIs.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Turso (libsql) |
| Validation | Zod |
| Maps | React Leaflet + OpenStreetMap |
| Weather API | OpenWeatherMap |
| Video API | YouTube Data API v3 |
| PDF Export | jsPDF + jspdf-autotable |

---

## Prerequisites

- Node.js 18+
- npm 9+
- OpenWeatherMap API key (free at https://openweathermap.org/api)
- YouTube Data API v3 key (optional, for video gallery)

---

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create `.env.local` in the project root:
    ```
    OPENWEATHER_API_KEY=your_openweather_api_key_here
    YOUTUBE_API_KEY=your_youtube_api_key_here
    TURSO_DATABASE_URL=your_turso_database_url_here
    TURSO_AUTH_TOKEN=your_turso_auth_token_here
    ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

---

## Features

### Assessment 1 — Frontend

- Location search with 300ms debounced autocomplete (OpenWeatherMap Geocoding)
- "Use My Location" button using browser Geolocation API
- Current weather display: temperature, feels like, humidity, wind, pressure, sunrise/sunset
- 5-day forecast strip (grouped by day, noon reading)
- Interactive map (React Leaflet + OpenStreetMap, SSR-disabled)
- YouTube video gallery for the searched location
- Responsive design (Tailwind CSS)

### Assessment 2 — Backend

- Turso (libsql) database for search history
- Full CRUD REST API for search history
- Zod input validation on all endpoints
- Weather data captured and stored per search entry
- Export to JSON, CSV, XML, Markdown, PDF (5 formats)
- History table with edit/delete + confirmation modal

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/geocode?q=<query>` | Geocode a location name or zip code |
| GET | `/api/weather?lat=&lon=` | Get current weather + 5-day forecast |
| GET | `/api/searches` | List all saved search entries |
| POST | `/api/searches` | Create a new search entry |
| GET | `/api/searches/:id` | Get a single search entry |
| PUT | `/api/searches/:id` | Update a search entry |
| DELETE | `/api/searches/:id` | Delete a search entry |
| GET | `/api/export?format=json\|csv\|xml\|markdown\|pdf` | Export all searches |
| GET | `/api/youtube?q=<location>` | Get related YouTube videos |

---

## Project Structure

```
weather-app/
├── app/
│   ├── api/               # REST API routes
│   ├── history/           # Search history page
│   ├── layout.tsx         # Root layout + navigation
│   └── page.tsx           # Home / current weather page
├── components/
│   ├── history/           # CRUD components
│   ├── layout/            # Header + Navigation
│   ├── map/               # Leaflet map (SSR-disabled)
│   ├── ui/                # Reusable UI primitives
│   ├── weather/           # Weather display components
│   └── youtube/           # Video gallery
├── hooks/                 # React custom hooks
├── lib/                   # Utilities: DB, APIs, validation, export
```

---

## License

MIT License — Copyright (c) 2026 Juan Sebastian Urrea. See [LICENSE](../LICENSE) for details.
