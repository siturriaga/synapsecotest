# Regression trace

## Summary
- The regression surfaced after commit [`0cffb5f`](../.git/commit/0cffb5ff246f656e5e944cb3b9c6e522ccf735ef) (“Centralize AI context and group insights”), which overhauled the roster pipeline and Dynamic Welcome hero without establishing regression coverage.
- The previous stable baseline is merge [`c2ff3b2`](../.git/commit/c2ff3b2b379180c9998ba49fff9e7fa0588dd305), where groups, assignments, and dashboard welcome behaviour still matched production expectations.

## Observations
- `useRosterData.tsx` was trimmed to emit only derived insights, causing downstream features (groups/assignments/dashboard) to rely on the same shared AI context without isolated guards.
- The Dynamic Welcome redesign replaced the simple hero with animated, data-heavy UI but lacked loading/error fallbacks, leading to blank states when Firestore snapshots lagged.
- No routing assets (`_redirects`) shipped with the dist output, so Netlify served 404s when refreshing deep links even though local dev routing worked.

## Remediation steps
1. Restore deterministic tests around `buildGroupInsights` and `buildRosterAIContext` to catch logic drift early.
2. Harden `DynamicWelcome` with loading/error banners and reduced-motion awareness so the hero always renders meaningful feedback.
3. Publish explicit routing fallbacks and a CLI verifier to guarantee SPA rewrites are present before deployment.
4. Add lightweight diagnostics (`npm run diagnostics`) that bundle the build, contract check, API canary, secret scan, unit tests, routing verification, and bundle report.

## Next actions
- Monitor Netlify builds after enabling `npm run diagnostics` in CI; the run will fail fast if secrets leak or routing rules disappear again.
- Iterate on the bundle report thresholds if new features introduce legitimate large chunks so performance budgets stay visible.
