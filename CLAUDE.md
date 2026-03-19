# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install     # Install dependencies
npm run dev     # Start Vite dev server (localhost:5173)
npm run build   # Production build → dist/
npm run preview # Preview production build locally
```

No test framework is configured.

## Architecture

**Clockd** is a Vite + React SPA deployed on Netlify. Auth is handled by Netlify Identity; all time data lives in `localStorage` scoped per user.

### Auth (`src/hooks/useAuth.js`)

Wraps `netlify-identity-widget` (npm package). The CDN script in `index.html` is also included per Netlify's requirement. `useAuth` returns `{ user, isLoading, login, logout }`. Netlify Identity only works on a deployed Netlify site — local dev skips auth.

### Data Layer (`src/hooks/useTimeData.js`)

- Storage keys: `clockd_${userId}` (session history) and `clockd_active_${userId}` (in-progress clock-in ISO timestamp)
- On mount, checks for an active session from a previous day and auto-clocks-out at `23:59:59` of the clock-in date (midnight crossover handling)
- Returns `{ data, activeSession, clockIn, clockOut }`
- `data` shape: `{ "YYYY-MM-DD": { totalSeconds, sessions: [{ in, out, seconds }] } }`

### Routing

Two routes: `/` (TrackerPage) and `/export` (ExportPage). `public/_redirects` and `netlify.toml` both define the SPA redirect so React Router works on Netlify without 404s.

### Export (`src/utils/exportSheet.js`)

Uses SheetJS (`xlsx`) to generate a two-sheet `.xlsx` file: "Timesheet Summary" (one row per day) and "Session Log" (one row per session). Called directly from `ExportForm` on button click.

### Styling

Dark industrial theme — near-black background (`#0D0D0D`) with subtle CSS grid texture defined in `src/index.css`. Amber (`#F59E0B` / Tailwind `amber-400`) as the accent color. JetBrains Mono loaded from Google Fonts via `index.html`.
