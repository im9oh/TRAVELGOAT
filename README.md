# TravelGoat 🐐

Private travel planning app, built for a 2027 three-month Europe trip.

A responsive web app (phone + desktop) that runs entirely in your browser — no
account, no server, no tracking. All data is stored locally in `localStorage`,
so it's fully private and works offline once loaded. Use **Settings → Export**
to back up your data or move it to another device.

## Features

- **🏠 Dashboard** — trip countdown, budget summary, next stops at a glance
- **🗺️ Itinerary** — ordered city stops with dates, nights, accommodation, and
  the transport leg to each next stop
- **💶 Budget** — log expenses against your total budget, broken down by
  category and city
- **📍 Places** — bucket list of sights, food, and activities per city, with
  priority and a visited toggle
- **🎒 Packing** — checklists grouped by category, with progress
- **📔 Journal** — dated entries to capture the trip as it happens
- **📄 Docs** — bookings, confirmation numbers, and key dates in one place
- **⚙️ Settings** — edit trip details / budget / currency, and export, import,
  or reset your data

The app ships with a sample 10-city itinerary (London → Athens) you can edit or
clear from Settings.

## Tech

React + TypeScript + Vite + Tailwind CSS. No backend.

## Develop

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and build for production -> dist/
npm run preview  # preview the production build
```

## Deploy

`npm run build` produces a static site in `dist/` that you can host anywhere
(GitHub Pages, Netlify, Vercel, or any static file host). Because all data is
local to the browser, no environment configuration is needed.
