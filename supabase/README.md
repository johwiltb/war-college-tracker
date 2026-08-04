# Supabase database setup

The migration in `migrations/202608040001_initial_schema.sql` creates the two user-owned application tables, constraints, indexes, grants, and Row Level Security policies.

Apply it with the Supabase Dashboard SQL Editor, or with a linked Supabase CLI project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

After applying it, confirm:

- `week_progress` and `command_documents` exist.
- RLS is enabled on both tables.
- The authenticated role has select, insert, update, and delete access only where `auth.uid() = user_id`.
- The anonymous role has no table privileges.

The browser requires only the project URL and publishable key. Never expose the service-role key or database password. Full OAuth and redirect instructions are in `docs/SETUP.md`.
