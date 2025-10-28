
# Synapse – Functional Build (Google Sign-In only)

## What you get
- Vite + React frontend with Google Sign-In only.
- Netlify Functions:
  - `uploadRoster`: stores CSV/XLSX/DOCX/PDF into Cloud Storage and records a Firestore upload.
  - `processRoster`: parses file, previews mapping, commits valid rows to `users/{uid}/roster`.
- Minimal pages: Dashboard, Roster, Assignments, Standards, Settings.
- No mock data. If Firestore docs are missing, pages show neutral defaults.

## Setup (Netlify)
1) Add env vars (Site settings → Build & deploy → Environment):
   - FIREBASE_PROJECT_ID
   - FIREBASE_CLIENT_EMAIL
   - FIREBASE_PRIVATE_KEY (with literal \n newlines)
   - FIREBASE_STORAGE_BUCKET (e.g., your-project.appspot.com)
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID

2) Deploy to Netlify from GitHub.

3) After deploy:
   - Sign in with Google.
   - Go to Roster → upload file → Preview → Commit.
   - Check Firestore at `users/{uid}/roster` and Storage at `users/{uid}/uploads/*`.

## Local dev
- Create a `.env` with VITE_* Firebase config for your client SDK.
- `npm i`
- `npm run dev`

## Notes
- This build focuses on functionality; styling can be extended next.
- CSP in index.html allows Firebase + Google endpoints used here.
