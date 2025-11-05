# Diagnostics and Recovery Checklist

## Baseline automation (Step 6)
- `npm run build`
- `npm run contract:check`
- `npm run api:canary`

All commands pass locally and are chained together through the new `npm run diagnostics` helper, which also executes the secret scan, unit tests, bundle report, and routing verification scripts added in this update.

## Secret scan remediation (Step 1)
- Added `scripts/secrets-scan.cjs` and wired it to `npm run scan:secrets`.
- The scan walks the repo (excluding `node_modules`, `dist`, and `build-tests`) for common credential patterns (Google API keys, OpenAI keys, PEM headers, generic JWT secrets).
- Running `npm run scan:secrets` now returns a clean bill of health so the Netlify build can pass the secrets gate once the environment variables are properly configured in the deploy environment.

## Shared grouping + AI context validation (Steps 2–4)
- Added Node-based unit tests (`tests/groupInsights.test.mjs`, `tests/aiContext.test.mjs`) that compile the TypeScript utilities and assert:
  - Group segmentation always emits the expected “foundation/developing/extending” cohorts and pedagogy guidance.
  - AI context narratives surface the latest assessment label, struggling learners, and class context even with sparse data.
- Introduced `tsconfig.test.json` and `npm run build:tests` to emit CommonJS artefacts the Node test runner can execute without new dependencies.

## Routing guardrails (Step 5)
- Added `public/_redirects` alongside a `scripts/verify-routing.cjs` check to guarantee the SPA fallback (`/* -> /index.html`) and API proxy rules exist in both the Netlify configuration and published assets.

## Performance profiling (Step 7)
- Created `scripts/bundle-report.cjs` to summarise built asset sizes and highlight bundles that exceed recommended thresholds (256 KB for JS, 128 KB for CSS) so large chunks can be split proactively.

## Regression tracking (Step 8)
- Documented the regression origin in [`docs/regressions.md`](./regressions.md), comparing commit `0cffb5f` (the AI refactor) against the last known stable merge (`c2ff3b2`) and outlining the remediation plan.
