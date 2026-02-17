# Tagaru-Tech — Livestock Monitoring Dashboard

Tagaru-Tech is a small, opinionated monitoring dashboard for livestock farms. It combines a Vite + React frontend that visualizes animal locations, health metrics and environmental data, with a lightweight Node.js simulator in `iot-server` that can publish sample telemetry via WebSocket or MQTT.

Repository: https://github.com/Jeethan19/Tagaru-Tech

## Summary
- Frontend: Vite + React app with pages for live feed, livestock details, and geofencing.
- Maps: Uses Leaflet via `react-leaflet` for location display and geofence visualization.
- Charts: Line and bar charts display trends and aggregated metrics.
- Simulator: `iot-server` contains example code to simulate devices over WebSocket/MQTT for demo data.

## Features
- Live data feed component that can display incoming telemetry.
- Animal list/table with quick health & location overview.
- Detailed view per animal including charts and recent alerts.
- Map view with geofencing and markers.
- Multi-language support via `i18next` (files in `public/locales`).

## Architecture & Data Flow
- Devices (simulated or real) publish telemetry to a broker or the `iot-server`.
- `iot-server` can forward messages over WebSocket or MQTT to the frontend.
- The frontend subscribes to the live feed (WebSocket in the current demo) and updates UI components in real time.
- Sample/demo data is available under `src/data/` for offline mode or initial state.

### Typical telemetry payload (example)
```json
{
  "id": "goat-123",
  "ts": 1670000000000,
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "temperature": 38.5,
  "heartRate": 88,
  "battery": 78
}
```

## Components Overview
- `src/components/LiveFeed.jsx` — subscribes to live messages and emits updates.
- `src/components/Table.jsx` — lists animals with current status badges.
- `src/components/LineChart.jsx`, `BarChart.jsx` — visualize trends for health and environment.
- `src/pages/LiveStockInfo.jsx` — main dashboard page combining components.

## Configuration
- No required environment variables for demo mode. If you wire a real broker, add connection config in the client and `iot-server` as needed.
- Map tile provider: change tile URL and attribution inside the map component if you need an API key.

## Running Locally
1. Install root dependencies and start the frontend dev server:

```bash
git clone https://github.com/Jeethan19/Tagaru-Tech.git
cd Tagaru-Tech
npm install
npm run dev
```

2. Start the IoT simulator (optional, in another terminal):

```bash
cd iot-server
npm install
# Run the simulator or server
node server.js
```

By default the frontend uses demo `src/data/*` files if no live feed is connected.

## Simulating Devices
- Inspect `iot-server/simulate.js` to configure how many devices and message cadence to emit.
- The simulator demonstrates how telemetry is structured and how the frontend consumes updates.

## Build & Deploy
Build for production with:

```bash
npm run build
```

Publish the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages). For CI, create a workflow that runs `npm ci` and `npm run build` and deploys `dist/`.

## Troubleshooting
- Map not loading: ensure the tile provider URL is valid and the app can reach external tile servers.
- No live updates: confirm `iot-server` is running and that the frontend WebSocket endpoint matches the server.

## Contributing
- Contributions are welcome: open issues describing bugs or feature requests.
- For code changes, fork the repo, create a feature branch, and open a pull request with a clear description.

## License
Add a `LICENSE` file to state the intended license. If you're not sure, consider an OSI-approved license such as MIT or Apache-2.0.

## Contact
Open an issue on GitHub or reach out via the GitHub profile for additional help or to request features.

