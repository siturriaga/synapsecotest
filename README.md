# Synapse – Assignments Module

Functional rebuild focused on the Assignments feature with resilient Gemini integration.

## Setup

```bash
npm install
cp .env.example .env.local # fill in values
```

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview build output
- `npm run check:env` – list missing environment variables (add `--strict` to exit with error)
- `npm run simulate:ai` – invoke the generateAssignment function locally with debug headers
- `npm run check:routes` – call Netlify functions to verify authentication responses

## Environment

All required keys are documented in `.env.example`. Functions fail with clear messages when values are missing; debug mode is available via the `X-Debug-UID` header for local testing without Firebase admin credentials.
