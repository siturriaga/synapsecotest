# Synapse Application Experience Overview

This guide captures how the Synapse instructional planning workspace is intended to behave from a user’s point of view. Each section walks through the feature surface that educators interact with after signing in, highlighting the data dependencies, AI enhancements, and navigation cues that keep the flows coherent.

## Authentication and Layout Shell

- **Sign-in/out:** The shell wires into Firebase authentication. The sidebar exposes primary navigation plus sign-in/out controls, and a mobile top bar mirrors those affordances when the viewport is narrow.【F:src/App.tsx†L15-L123】
- **Responsive chrome:** On narrow screens the sidebar collapses behind a backdrop and can be toggled with the mobile menu button. Body overflow is locked when the drawer is open so the backdrop functions like a modal scrim.【F:src/App.tsx†L21-L47】【F:src/App.tsx†L74-L119】
- **Context providers:** Once authenticated, the roster and preference providers stream class data and saved UI settings to every page, ensuring consistent personalization without refetching per route.【F:src/App.tsx†L57-L124】

## Dashboard

- **Dynamic welcome hero:** The hero greets the educator with their saved display name, AI-generated focus narrative, and status badges that react to reduced-motion preferences and to roster sync health. It surfaces loading placeholders until class data arrives, then transitions into animated metric cards.【F:src/components/core/DynamicWelcome.tsx†L1-L430】
- **Metrics deck:** Stat cards combine assessment snapshots, roster insights, and AI highlights into quick glances at mastery, attendance, or engagement trends. The layout supports printing via the persistent print button.【F:src/pages/Dashboard.tsx†L1-L116】
- **Mastery distribution:** Educators can filter by period, test, and view different segments (all students vs. sub-groups). The chart derives its dataset from Firestore and the roster-derived summaries, exposing trend deltas and normalized percentages.【F:src/pages/Dashboard.tsx†L118-L225】
- **Student explorer:** Selecting a learner reveals AI-authored insights about their progress. Default selection auto-advances to the first roster student, and the explorer keeps the selection valid even as filters change.【F:src/pages/Dashboard.tsx†L227-L309】
- **Data hygiene tools:** Clear buttons allow the teacher to purge workspace data (assignments, assessments, cached metrics) should they want a clean slate for new classes.【F:src/pages/Dashboard.tsx†L17-L40】

## Roster Workspace

- **File ingestion:** Educators upload CSV rosters, tag them with period/quarter/test context, and the page routes the file through Netlify functions that persist both the raw upload and the processed assessment snapshots.【F:src/pages/Roster.tsx†L1-L205】
- **Auto-sync feedback:** After committing a roster, the workspace triggers a sync, reports whether the snapshot refreshed, and provides manual retry (“Sync now”) controls if Firestore replication lags.【F:src/pages/Roster.tsx†L74-L187】
- **Historical uploads:** The grid lists saved uploads with download links. Files stored inline can be reconstituted as CSV blobs in the browser so teachers can retrieve the exact version previously submitted.【F:src/pages/Roster.tsx†L83-L143】
- **Bulk period updates:** Teachers can select students and apply a new period in bulk, which invokes the Netlify `bulkUpdatePeriods` function through the safeFetch helper to update Firestore records securely.【F:src/pages/Roster.tsx†L300-L505】【F:src/utils/safeFetch.ts†L1-L157】
- **Workspace snapshots:** The roster provider streams assessments, summaries, and student docs, translating them into AI context (focus narrative, struggling learners, pedagogy guidance) that the rest of the app consumes.【F:src/hooks/useRosterData.tsx†L1-L320】

## Groups Generator

- **Roster-driven suggestions:** The groups view normalizes roster assessments into readiness tiers and feeds them to an AI grouping function. If no student documents exist yet, it falls back to deduplicated assessment rows.【F:src/pages/Groups.tsx†L1-L118】
- **Gemini orchestration:** Authenticated users can choose heterogeneous or homogeneous grouping, submit refinement prompts, and send the roster context to the Netlify `groupStudents` function. Optimistic groups display instantly while awaiting the final AI response.【F:src/pages/Groups.tsx†L120-L260】
- **Insight trail:** Saved group runs persist with metadata (mode, source, timestamp). The UI surfaces the latest run summary and AI chips that suggest next refinements.【F:src/pages/Groups.tsx†L122-L214】
- **Workspace storage:** Finalized groups are saved via the `useWorkspaceGroups` hook so the teacher can revisit, edit, or delete them later in the session.【F:src/pages/Groups.tsx†L98-L118】【F:src/hooks/useWorkspaceGroups.ts†L1-L142】

## Standards Explorer and Lesson Builder

- **Curriculum browser:** Teachers filter state standards by subject and grade. The catalog JSON plus details lookups enrich each standard with clarifications and objectives for deeper planning context.【F:src/pages/Standards.tsx†L1-L92】
- **AI lesson blueprint:** After picking a standard and optional focus, authenticated users request a Gemini-generated assessment blueprint. The AI payload is seeded with roster pedagogy context so strategies align with actual class needs.【F:src/pages/Standards.tsx†L94-L171】
- **Scaffolded output:** The blueprint response includes multi-level assessments, remediation paths, and AI insights summarizing class-wide strategies, all rendered inline for immediate planning.【F:src/pages/Standards.tsx†L171-L238】

## Assignments Workspace

- **Planning form:** Educators craft assignments by selecting subject, grade, standard, assessment type, question count, due date, and title. The UI guards against incomplete selections before allowing generation.【F:src/pages/Assignments.tsx†L1-L125】【F:src/pages/Assignments.tsx†L146-L203】
- **Shared AI context:** The generation request reuses the roster AI context (mastery summary, focus narrative, class grouping) to keep prompts consistent with dashboard insights and groups recommendations.【F:src/pages/Assignments.tsx†L63-L112】【F:src/pages/Assignments.tsx†L203-L263】
- **Assignment lifecycle:** Generated blueprints store in Firestore with status tracking (draft, assigned, completed). Teachers can update status, set due dates, or delete entries from the table, and changes sync in real time.【F:src/pages/Assignments.tsx†L104-L143】【F:src/pages/Assignments.tsx†L265-L377】

## Settings and Personalization

- **Preferences form:** Authenticated users customize timezone, greeting name, appearance, color accents, textures, and accessibility toggles (dyslexia-friendly font, micro-interactions). Inputs persist via the preferences hook and Firestore.【F:src/pages/Settings.tsx†L1-L120】【F:src/pages/Settings.tsx†L135-L214】
- **Live feedback:** Successful saves flash confirmation, and errors surface inline if Firebase writes fail. Unsigned users see a prompt to authenticate before adjusting settings.【F:src/pages/Settings.tsx†L53-L82】【F:src/pages/Settings.tsx†L100-L133】
- **Global effects:** The preferences provider applies texture and theme tokens to the document body so every page inherits the chosen premium aesthetic.【F:src/hooks/usePreferences.tsx†L1-L120】【F:src/hooks/usePreferences.tsx†L162-L205】

## Additional Experience Touchpoints

- **Navigation fallback:** Unknown routes render a stylized NotFound view with guidance to return to the dashboard, ensuring SPA routing failures degrade gracefully.【F:src/pages/NotFound.tsx†L1-L15】
- **Diagnostics workflow:** A composite `npm run diagnostics` script (build, contract check, API canary, secret scan, bundle analysis, routing verification, unit tests) offers a one-command readiness check before deploys.【F:package.json†L8-L15】【F:scripts/secrets-scan.cjs†L1-L65】【F:scripts/bundle-report.cjs†L1-L47】【F:scripts/verify-routing.cjs†L1-L43】
- **Safe network layer:** The `safeFetch` utility standardizes Netlify function calls with consistent JSON parsing, error handling, and retry-friendly signatures, keeping every page’s API usage predictable.【F:src/utils/safeFetch.ts†L1-L157】

With these flows in place, educators experience a cohesive planning assistant: roster uploads power the dashboard, AI insights flow into groups and assignments, and preferences tailor the aesthetic across the workspace.
