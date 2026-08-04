# Repository guide

## Purpose

Joint Command & War College Tracker is a private, unclassified-only, 96-week professional military education tracker deployed as a static GitHub Pages project site.

## Architecture

- React + TypeScript + Vite; preserve `HashRouter` and Vite base `/war-college-tracker/`.
- Curriculum: `src/data/curriculum.ts`; models: `src/types/domain.ts`; templates: `src/data/templates.ts`.
- Guest/import persistence: `src/lib/storage.ts`; authenticated persistence: `src/context/DataContext.tsx`; auth client: `src/lib/supabase.ts`.
- Supabase schema/RLS: `supabase/migrations/`; Pages workflow: `.github/workflows/deploy-pages.yml`.

## Rules

- Preserve user work and unrelated uncommitted changes. Never reset or discard them.
- Keep curriculum content separate from UI components and maintain exactly 8 terms / 96 sequential weeks.
- Do not fabricate reading URLs. Use verified official links or `null`, and update `docs/CURRICULUM_VERIFICATION.md`.
- Do not copy copyrighted readings into the repository.
- Never expose a service-role key, database password, OAuth client secret, or administrative credential. Frontend code may use only Supabase public URL/publishable-key variables.
- Keep Row Level Security enabled; authenticated rows must remain owned by `auth.uid()`.
- Treat imported data and user Markdown as untrusted; never render it with `dangerouslySetInnerHTML`.
- Maintain the visible unclassified-only warning and confirmations for destructive operations.
- Do not replace hash routing with history routing unless a reliable Pages fallback is added and documented.

## Conventions and required checks

- Use strong domain types, semantic HTML, accessible labels, keyboard behavior, responsive styles, and reduced-motion support.
- Prefer small modules and pure testable functions over new heavy dependencies.
- Before handoff run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
