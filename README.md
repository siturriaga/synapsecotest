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

> **Plain-language reminder:** If you point the app at a Netlify site on the internet (with `VITE_FUNCTION_BASE_URL`), give that site the very same hidden keys you keep on your laptop. Think of it like handing the substitute teacher the class roster and the Gemini password—without those notes, the remote helper picks up the phone but has no idea who you are or how to call Gemini back, so the quiz request dies.

### Client-safe
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FUNCTION_BASE_URL` (optional – points the browser at a deployed Netlify Functions host when you aren't running `netlify dev` locally)

## Netlify functions

| Function | Purpose |
| --- | --- |
| `uploadRoster` | Streams multipart uploads into Firebase Storage (or inline Firestore blobs when Storage is absent) and records metadata. |
| `processRoster` | Parses, validates, and optionally commits roster rows to Firestore. |
| `groupStudents` | Fetches roster, prompts Gemini for JSON groups, saves to `users/{uid}/groups`. |
| `generateAssignment` | Generates a differentiated lesson plan via Gemini and saves a draft assignment. |

All handlers call `verifyBearerUid` to ensure only authenticated users access data, and failures return structured JSON errors.

## Local development

1. Create `.env` with your `VITE_FIREBASE_*` values. Add `VITE_FUNCTION_BASE_URL="https://<your-deployment>.netlify.app"` if you want the browser to call a remote functions host instead of a local Netlify runtime.
2. `npm install` (uses only Firebase + Vite dependencies bundled in repo).
3. `npm run dev`

Gemini calls require the Netlify function runtime with `GEMINI_API_KEY`. You have two options during development:

- **Run Netlify locally** – Use `npx netlify-cli dev` to start Vite and the Netlify Functions runtime together. This is the most transparent workflow when you need live function logs.
- **Reuse a deployed host** – Define `VITE_FUNCTION_BASE_URL` so the app targets your deployed Netlify Functions instead of `localhost:8888`. Once that URL is in place, the quiz call stops returning the “Gemini request failed” 404 because it can finally reach the live function. The remote environment still needs the Firebase and Gemini secrets configured.

### Codespaces quick commands

If you are working in GitHub Codespaces and want the quiz generator to stop returning 404s, run the same Netlify workflow directly in the Codespace terminal:

```bash
npm install                 # pull project dependencies
npx netlify-cli dev         # launches Vite + Netlify Functions on the Codespace
```

Alternatively, if you have set `VITE_FUNCTION_BASE_URL` to a deployed Netlify site that already holds your Firebase and Gemini secrets, you can skip the Netlify CLI and run:

```bash
npm install
npm run dev
```

Either path makes sure the browser can reach `/.netlify/functions/generateAssignment`, which is the final hop before Gemini writes the quiz.

## Deployment checklist

1. Push to GitHub and connect the repo to Netlify.
2. Configure the environment variables above.
3. Authorize the Netlify domain in Firebase Auth.
4. Deploy → Sign in with Google → Upload roster → Generate groups + lessons → Verify Firestore collections update (`dashboard_stats`, `roster`, `groups`, `assignments`, `preferences`, `logs`).
5. Confirm CSP headers allow the Firebase and Google endpoints used here (a permissive
   `Cross-Origin-Opener-Policy: same-origin-allow-popups` header is already defined to
   keep Google sign-in popups working).
