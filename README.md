# Joint Command & War College Tracker

A private, static-site-compatible learning-management and command-development tracker for a 96-week self-directed professional military education curriculum.

The application is designed for **unclassified personal study only**. Do not enter classified information, CUI, export-controlled information, employer-sensitive material, or current operational data.

## What it includes

- Eight terms and 96 substantive weekly lessons spanning theory of war, Civil War and World War II campaigns, Cold War operational art, modern joint operations, information warfare, strategy, force design, and a theater-strategy capstone.
- A dashboard with completion, current term, next recommended week, reading totals, hours, documents, and recent activity.
- Searchable/filterable curriculum views.
- Weekly workspaces with reading and exercise checklists, long-form autosaving editors, decision journal, lessons, questions, hours, confidence, dates, and a 100-point command-judgment rubric.
- A command notebook with eight document categories, reusable planning templates, search, week associations, autosave, Markdown export, and confirmed deletion.
- Versioned JSON backup/restore and combined Markdown export.
- Fully functional local guest mode with browser storage and draft recovery.
- Optional Supabase Auth (GitHub OAuth), user-owned remote persistence, and guest-to-account migration.
- Responsive light/dark interface, keyboard-accessible forms, reduced-motion support, and hash routing for GitHub Pages.

## Architecture

- React 19 + TypeScript + Vite
- Dependency-free local hash router tailored to the application’s static GitHub Pages routes
- Supabase JS client with PKCE authentication
- Zod validation for untrusted imports
- Local storage for guest records and temporary recovery drafts
- Supabase Postgres with Row Level Security for authenticated records
- Vitest for domain and persistence tests

Important paths:

- `src/data/curriculum.ts` — human-readable curriculum outline, source catalog, and week construction
- `src/types/domain.ts` — application domain model
- `src/context/` — authentication and persistence providers
- `src/pages/` — primary application routes
- `src/lib/router.tsx` — dependency-free hash navigation and route matching
- `src/lib/storage.ts` — guest storage and validated backup format
- `supabase/migrations/` — schema and RLS migration
- `.github/workflows/deploy-pages.yml` — gated GitHub Pages deployment
- `.github/workflows/quality.yml` — pull-request quality checks

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173/war-college-tracker/`). Supabase variables are optional; without them the app starts in guest mode.

Available checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

The deployment workflow gates publication on linting, type checking, unit tests, a high-severity production-dependency audit, a critical-severity full-tree audit, and the production build. Pull requests receive the same checks through `.github/workflows/quality.yml`.

## Environment variables

Only public browser configuration is used:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
```

Never put a Supabase service-role key, database password, GitHub OAuth client secret, or administrative credential in a `VITE_` variable. Vite embeds these variables in public browser assets.

## Guest mode

Guest mode is the default when Supabase is not configured. Curriculum progress, writing, settings, and notebook documents are stored in the current browser. Drafts are written immediately and the main record is updated after the configured debounce period. Use **Data & account settings → Export all data** for portability and backups.

After signing in, **Copy guest data to account** merges the newest guest week/document records into the authenticated workspace. Guest records are not automatically deleted.

## Supabase and GitHub OAuth

Apply [`supabase/migrations/202608040001_initial_schema.sql`](supabase/migrations/202608040001_initial_schema.sql), enable GitHub as an Auth provider, and set the allowed application redirects. The migration enables RLS and grants authenticated users access only to rows where `user_id = auth.uid()`.

Follow [`docs/SETUP.md`](docs/SETUP.md) for the exact project, OAuth callback, redirect, secret, and Pages configuration.

## GitHub Pages deployment

Vite is centrally configured with `/war-college-tracker/` as its base and the app uses hash routes. The included workflow validates and builds `dist` on pushes to `main` or manual dispatch, then deploys it with the official Pages actions.

After the one-time setup in `docs/SETUP.md`, deployment is automatic:

```bash
git push origin main
```

To validate the exact production artifact locally:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm audit --omit=dev --audit-level=high
npm run build
npm run preview
```

## Data export

JSON exports contain an export format version, timestamp, user settings, week progress and prompt responses, and command documents. Imports are schema-validated, staged with a record-count summary, and require confirmation before overwriting current application data. Markdown exports never render imported or user-authored HTML.

## Security and privacy

- Public source code does not publish user notes or Supabase rows.
- Authenticated data access is enforced by Postgres Row Level Security, not UI checks alone.
- Anonymous database access is revoked by the migration.
- The frontend uses only a Supabase publishable key.
- Imported JSON is treated as untrusted and validated with size, type, range, version, and timestamp checks.
- User-authored Markdown remains plain text; the app does not use `dangerouslySetInnerHTML`.
- Destructive data operations require two confirmations.
- Local browser data is readable by anyone with access to that browser profile; use an OS account and device protections appropriate to personal notes.
- The dependency audit report is retained at [`docs/DEPENDENCY_AUDIT.md`](docs/DEPENDENCY_AUDIT.md).

## Curriculum sourcing and limitations

The repository includes citations and official links where verified without reproducing copyrighted works. See [`docs/CURRICULUM_VERIFICATION.md`](docs/CURRICULUM_VERIFICATION.md) before relying on editions or page ranges.

Known limitations:

- Term 1 now uses curated section-level assignments and a two-hour core path with optional extension work. Later terms retain broader topic-level assignments and should receive the same instructor-level curation before formal use.
- External source availability and doctrine editions change; several readings intentionally omit a URL pending human verification.
- Markdown is edited and exported as plain text; there is no HTML preview.
- Guest data is device/browser-local until manually exported or migrated after sign-in.
- Display preferences are device-local even for authenticated users.
- The PWA manifest provides install metadata, but the app intentionally has no service worker or full offline asset cache.
- Supabase and GitHub OAuth require external accounts and one-time manual configuration.

## External setup

No external resources are created by this repository. Complete the remaining steps in [`docs/SETUP.md`](docs/SETUP.md).
