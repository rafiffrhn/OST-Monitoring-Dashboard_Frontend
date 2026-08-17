# OST Monitoring Dashboard — Frontend

A real-time web dashboard for monitoring Oil Storage Tanks (OST) in a palm oil plantation, built as part of an IoT-based CPO (Crude Palm Oil) tank monitoring system. This frontend visualizes sensor data (temperature, volume, and total mass) collected from ESP32-based hardware and served by the [backend API](https://github.com/rafiffrhn/OST-Monitoring-Dashboard_Backend).

## Overview

The dashboard provides plantation operators with a near real-time view of tank conditions, historical trends, and system health status, replacing manual, on-site tank checks with a centralized web interface.

## Features

- **Live tank monitoring** — displays current temperature, volume, and total mass per tank via HTTP polling
- **Historical data visualization** — multi-series charts (Recharts) with configurable time ranges up to 90 days
- **System status indicators** — real-time alerts for MQTT broker connectivity and per-device reachability, with color-coded toast notifications
- **Responsive, collapsible sidebar navigation** built with React Context
- **Custom UI theme** tailored for industrial monitoring use cases

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React |
| Build Tool | Vite |
| Charting | Recharts |
| Deployment | Nginx (reverse proxy), systemd, Ubuntu VPS |

## Project Structure

```
├── src/               # Application source code (components, hooks, pages)
├── index.html         # HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Project dependencies and scripts
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/rafiffrhn/OST-Monitoring-Dashboard_Frontend.git
cd OST-Monitoring-Dashboard_Frontend
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Building for Production

```bash
npm run build
```

The production-ready static files will be output to the `dist/` directory, ready to be served via Nginx or any static file host.

## Deployment

This project is deployed on an Ubuntu VPS behind an Nginx reverse proxy. A typical deployment flow is:

```bash
npm run build
sudo cp -r dist/* /var/www/ost-monitoring-dashboard/
```

## Related Repositories

- **Backend:** [OST-Monitoring-Dashboard_Backend](https://github.com/rafiffrhn/OST-Monitoring-Dashboard_Backend) — FastAPI + PostgreSQL + MQTT service powering this dashboard

## Author

**Rafif Farhan Putra Ardhana**
