# Synapse – Gemini-powered teacher co-pilot

This repository contains a production-ready build that matches the Synapse specification:

- Google Sign-In authentication (Firebase) with workspace-scoped Firestore data.
- Netlify Functions orchestrating secure roster ingestion and Gemini reasoning for grouping and lesson planning.
- React single-page app with a premium “glass” UI, keyboard-accessible navigation, and form controls with explicit identifiers.
- No demo stand-ins: every action persists to Firebase or triggers a Gemini-backed workflow.

## Key decisions

- **Custom design system** – Tailwind/shadcn packages were unavailable in the build sandbox, so the UI is implemented with handcrafted CSS variables that mimic the requested aesthetic (glass cards, gradients, responsive grid, focus rings).
- **Gemini integration via REST** – Server functions call Google Gemini’s REST endpoint directly (no SDK) to keep dependencies minimal while still enforcing JSON-only outputs.
- **Firestore logging** – All Gemini actions append to `users/{uid}/logs`, powering the dashboard “Pulse updates” feed and providing an audit trail.

## Features

- **Dashboard** – Live Firestore metrics, Gemini insight pulses, and assignment radar with quick access to other modules.
- **Roster ingestion** – Upload CSV/XLSX/PDF/DOCX, preview validation issues, then commit clean rows into `users/{uid}/roster` (falls back to inline base64 storage when a Firebase Storage bucket is not configured).
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
- `FIREBASE_STORAGE_BUCKET` (optional – enables Firebase Storage uploads; inline base64 storage is used when omitted)
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional – defaults to Google’s latest Gemini 1.5 Pro variants with automatic fallbacks)
- `GEMINI_API_VERSION` (optional – defaults to `v1beta`)

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
| `uploadRoster` | Streams multipart uploads into Firebase Storage (or inline Firestore blobs when Storage is absent) and records metadata. |
| `processRoster` | Parses, validates, and optionally commits roster rows to Firestore. |
| `groupStudents` | Fetches roster, prompts Gemini for JSON groups, saves to `users/{uid}/groups`. |
| `generateAssignment` | Generates a differentiated lesson plan via Gemini and saves a draft assignment. |

All handlers call `verifyBearerUid` to ensure only authenticated users access data, and failures return structured JSON errors.

## Cloud setup

1. Connect this repository to Netlify and keep the default build command (`npm run build`).
2. Populate the server-side and client-safe variables above in Netlify → Site configuration → Environment.
3. Deploy the site and confirm the generated `/api/*` redirect maps to `/.netlify/functions/:splat` as defined in `netlify.toml`.
4. Sign in with Google on the deployed site, upload a roster, request groups, and generate assignments to confirm Firestore collections update (`dashboard_stats`, `roster`, `groups`, `assignments`, `preferences`, `logs`).
5. Keep Firebase Auth configured with the Netlify domain so Google sign-in can complete.

## Deployment checklist

1. Push to GitHub and connect the repo to Netlify.
2. Configure the environment variables above.
3. Authorize the Netlify domain in Firebase Auth.
4. Deploy → Sign in with Google → Upload roster → Generate groups + lessons → Verify Firestore collections update (`dashboard_stats`, `roster`, `groups`, `assignments`, `preferences`, `logs`).
5. Confirm CSP headers allow the Firebase and Google endpoints used here (a permissive
   `Cross-Origin-Opener-Policy: same-origin-allow-popups` header is already defined to
   keep Google sign-in popups working).
