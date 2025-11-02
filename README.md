# Synapse – Gemini-powered teacher co-pilot

This repository contains a production-ready build that matches the Synapse specification:

- Google Sign-In authentication (Firebase) with workspace-scoped Firestore data.
- Netlify Functions orchestrating secure roster ingestion and Gemini reasoning for grouping and lesson planning.
- React single-page app with a premium “glass” UI, keyboard-accessible navigation, and form controls with explicit identifiers.
- No demo placeholders: every action persists to Firebase or triggers a Gemini-backed workflow.

## Key decisions

- **Custom design system** – Tailwind/shadcn packages were unavailable in the build sandbox, so the UI is implemented with handcrafted CSS variables that mimic the requested aesthetic (glass cards, gradients, responsive grid, focus rings).
- **Gemini integration via REST** – Server functions call Google Gemini’s REST endpoint directly (no SDK) to keep dependencies minimal while still enforcing JSON-only outputs.
- **Firestore logging** – All Gemini actions append to `users/{uid}/logs`, powering the dashboard “Pulse updates” feed and providing an audit trail.

## Features

- **Dashboard** – Live Firestore metrics, Gemini insight pulses, and assignment radar with quick access to other modules.
- **Roster ingestion** – Upload CSV/XLSX/PDF/DOCX via Storage, preview validation issues, then commit clean rows into `users/{uid}/roster`.
- **AI grouping** – `/groups` calls Gemini to create heterogeneous or homogeneous cohorts, stores them in `users/{uid}/groups`, and surfaces refinement chips.
- **Standards engine** – Pick standards from `data/standards/standards.json`, request a differentiated lesson plan, and automatically archive the plan in `users/{uid}/assignments`.
- **Assignments planner** – Create, update, and delete assignments with tier tracking and due dates.
- **Settings** – Persist timezone, appearance, and accessibility preferences in Firestore.

## Environment variables

Set these in Netlify (Build & deploy → Environment):

### Server-side
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (use literal `\n` for newlines)
- `FIREBASE_STORAGE_BUCKET`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional – defaults to `gemini-1.5-pro`, falls back to `gemini-1.5-pro-001`)

### Client-safe
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`

## Netlify functions

| Function | Purpose |
| --- | --- |
| `uploadRoster` | Streams multipart uploads into Firebase Storage and records metadata. |
| `processRoster` | Parses, validates, and optionally commits roster rows to Firestore. |
| `groupStudents` | Fetches roster, prompts Gemini for JSON groups, saves to `users/{uid}/groups`. |
| `generateAssignment` | Generates a differentiated lesson plan via Gemini and saves a draft assignment. |

All handlers call `verifyBearerUid` to ensure only authenticated users access data, and failures return structured JSON errors.

## Local development

1. Create `.env` with your `VITE_FIREBASE_*` values.
2. `npm install` (uses only Firebase + Vite dependencies bundled in repo).
3. `npm run dev`

Gemini calls require the Netlify function runtime with `GEMINI_API_KEY`; when running locally, either proxy through Netlify (`netlify dev`) or stub responses.

## Deployment checklist

1. Push to GitHub and connect the repo to Netlify.
2. Configure the environment variables above.
3. Authorize the Netlify domain in Firebase Auth.
4. Deploy → Sign in with Google → Upload roster → Generate groups + lessons → Verify Firestore collections update (`dashboard_stats`, `roster`, `groups`, `assignments`, `preferences`, `logs`).
5. Confirm CSP headers allow the Firebase and Google endpoints used here (a permissive
   `Cross-Origin-Opener-Policy: same-origin-allow-popups` header is already defined to
   keep Google sign-in popups working).
