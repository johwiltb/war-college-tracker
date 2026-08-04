# External setup guide

The application works immediately in guest mode. Complete these steps only to enable GitHub sign-in, cross-device persistence, and GitHub Pages deployment.

## 1. Create the Supabase project

1. Sign in at `https://supabase.com/dashboard` and create a project.
2. Record the project reference from **Project Settings → General**.
3. In **Project Settings → API**, copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Publishable key (`sb_publishable_…`) → `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Do not use the service-role/secret key in this frontend or in a `VITE_` variable.

## 2. Apply the database migration

Dashboard method:

1. Open **SQL Editor → New query**.
2. Copy the complete contents of `supabase/migrations/202608040001_initial_schema.sql`.
3. Run the query once.
4. Open **Table Editor** and confirm `week_progress` and `command_documents` exist.
5. Open each table’s RLS/policies view and confirm RLS is enabled with separate select, insert, update, and delete policies for authenticated users.

CLI alternative (after installing the Supabase CLI):

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The migration can be reapplied safely: tables and indexes use `if not exists`, and policies are dropped/recreated by name.

## 3. Create the GitHub OAuth application

1. In Supabase, open **Authentication → Sign In / Providers → GitHub** and copy the displayed callback URL. It has this form:

   `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

2. In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**.
3. Enter:
   - Application name: `Joint Command & War College Tracker`
   - Homepage URL: `https://johwiltb.github.io/war-college-tracker/`
   - Authorization callback URL: the Supabase callback URL from step 1
4. Register the application.
5. Copy the GitHub Client ID and generate a client secret.
6. In Supabase’s GitHub provider settings, paste the Client ID and client secret, enable the provider, and save.
7. The GitHub client secret belongs only in Supabase. Never add it to this repository or GitHub Actions.

## 4. Configure Supabase application redirects

In **Supabase → Authentication → URL Configuration** set:

- Site URL: `https://johwiltb.github.io/war-college-tracker/`
- Redirect URLs:
  - `http://localhost:5173/war-college-tracker/`
  - `https://johwiltb.github.io/war-college-tracker/`

Use exact URLs, including the trailing slash. If Vite starts on another port, add that exact localhost URL before testing OAuth there.

There are two different callback concepts:

- GitHub OAuth App callback → Supabase: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Supabase allowed redirects → this application: localhost and GitHub Pages URLs above

## 5. Configure local authentication

```bash
cp .env.example .env.local
```

Replace both placeholder values in `.env.local`, then restart the dev server:

```bash
npm run dev
```

Open `http://localhost:5173/war-college-tracker/`, choose **Continue with GitHub**, complete consent, and verify the dashboard shows **Authenticated**. Create or edit a week, wait for **Saved**, then confirm a row appears in Supabase.

## 6. Add GitHub Actions secrets

In the GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**. Add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These are public frontend values. Do not add the GitHub OAuth client secret, Supabase service-role key, or database password.

## 7. Enable GitHub Pages deployment

1. Open **Repository Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push an approved commit to `main`, or open **Actions → Deploy to GitHub Pages → Run workflow**.
4. The workflow installs with `npm ci`, builds `dist`, uploads the Pages artifact, and deploys it.
5. Open `https://johwiltb.github.io/war-college-tracker/` after the workflow succeeds.

The workflow is already configured at `.github/workflows/deploy-pages.yml`. No `gh-pages` branch is needed.

## 8. Production acceptance test

1. Open the production URL in a private/incognito window.
2. Continue in guest mode, check a reading, type a prompt response, wait for **Saved**, refresh, and confirm recovery.
3. Export the JSON backup.
4. Sign in with GitHub and confirm the authenticated indicator.
5. Use **Data & account settings → Copy guest data to account**.
6. Open another browser/device, sign in with the same GitHub account, and confirm the copied record appears.
7. Create and edit a command document; verify it appears in Supabase and on the second browser.
8. Import the exported backup, review the summary, confirm it, and verify the record counts.
9. Test sign-out and confirm the guest workspace is isolated from authenticated data.

## Troubleshooting

- **GitHub returns a callback error:** the GitHub OAuth App callback must be the Supabase `/auth/v1/callback` URL, not the Pages URL.
- **Supabase rejects the redirect:** add the exact localhost or production application URL to Authentication URL Configuration.
- **Sign-in works but saves fail:** apply the migration and inspect RLS policies; do not disable RLS.
- **Pages loads but assets 404:** confirm `vite.config.ts` still has `base: '/war-college-tracker/'`.
- **A direct route is missing:** application navigation must remain hash-based (`/#/week/week-1`) on GitHub Pages.
- **Changes appear only on one device:** confirm the mode indicator says Authenticated and the save indicator reaches Saved rather than Save failed.
