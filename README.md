# Nexa Interviews

A modern, mobile-first web app for uploading interview recordings, generating transcripts, and surfacing AI-driven insights. Built for fast feedback loops, a clean UX, and an easily swappable backend via a FastAPI stub.

## Overview

Nexa Interviews lets you:
- Upload audio/video files (mp3, wav, mp4, mov) with client-side validation and metadata display.
- View a synchronized transcript (scrollable, click-to-seek, highlight active line, search + tag selections).
- See AI analysis (summary, sentiment badges, keywords, Q&A parsing). In dev, analysis is simulated and randomized.
- Manage your library from the dashboard (search/filter, status badges, quick actions).

Architecture highlights:
- Frontend: React + TypeScript + Vite, Tailwind CSS, shadcn/ui, Zustand (UI state), TanStack Query (server state).
- Backend (stub): FastAPI with CORS enabled, in-memory DB, randomized analysis, and static sample data.
- Dev proxy: Vite proxies "/api/*" → FastAPI (localhost:8000) for zero-config local development.

## Setup

Prerequisites
- Node.js 18+
- Python 3.10+

Install dependencies
```bash
git clone <YOUR_GIT_URL>
cd brand-cast
npm i
```

Run backend stub (FastAPI)
```bash
# one-time setup
npm run backend:setup

# start the API (http://localhost:8000)
npm run backend:start
```

Run frontend (Vite)
```bash
npm run dev
# App runs at http://localhost:8080 and proxies /api to http://localhost:8000
```

Run both together
```bash
# installed in this repo
npm run dev:full
```

Configuration
- `VITE_API_BASE_URL` (optional): set to an absolute URL in production; in dev, defaults to "/api" and uses the proxy.
- Proxy config lives in `vite.config.ts` under `server.proxy`.

## Implementation Decisions

- TypeScript everywhere: safer refactors, clearer contracts (`src/types/interview.ts`).
- TanStack Query: caching, retries, optimistic UI for upload/transcribe/delete flows.
- Zustand for light UI state: search term, current playback time, tags.
- Dev-first backend: FastAPI stub with in-memory store and randomized analysis so the UI can be validated end‑to‑end quickly.
- Vite proxy vs. absolute URLs: relative "/api" avoids CORS/setup pain; `VITE_API_BASE_URL` allows easy production wiring.
- UI kit and styling: shadcn/ui + Tailwind for accessible, consistent, and quickly composable components.
- Error handling and UX: toasts on success/failure; loading and empty states throughout the dashboard/detail pages.

## Known Limitations

- Persistence: FastAPI stub stores data in memory and the `uploads/` folder; no database.
- Real transcription/LLM: simulated using sample JSON and randomized analysis; replace with your services for production.
- Auth/KYC/roles: not implemented.
- Accessibility: good defaults via shadcn/ui, but full audit not completed.
- Testing: unit/e2e tests not included due to time constraints.
- Mobile: responsive layouts implemented; further tuning may be needed for very small screens.

## What I achieved in 5 hours

- Frontend scaffolding with React/TS, routing, and a polished UI layer.
- Upload flow with validation, progress, toasts, and metadata injection.
- Dashboard with search, status badges, quick actions (view, transcribe, delete).
- Detail page with audio player, synchronized transcript, search highlight, and tagging.
- Analysis panel rendering summary, sentiment, keywords, and Q&A; randomized results after transcription.
- FastAPI stub backend with endpoints for upload/list/get/transcribe/status/delete, plus sample data wiring.
- Vite proxy and environment configuration for a zero-CORS local setup.
- Branding cleanup and favicon refresh.

## Deploy

Deploy the frontend to Vercel/Netlify/Render. Point `VITE_API_BASE_URL` to your deployed API. The stub is intended for local development and demos.
