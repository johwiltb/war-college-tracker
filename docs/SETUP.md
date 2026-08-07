# External setup guide

The application works immediately in guest mode. Complete these steps only to enable cloud sign-in, cross-device persistence, and GitHub Pages deployment.

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

## 3. Configure OAuth providers

The app supports GitHub and Google through Supabase Auth. Both providers use the same Supabase callback URL:

`https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### GitHub

1. In Supabase, open **Authentication → Sign In / Providers → GitHub** and copy the displayed callback URL.
2. In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**.
3. Enter:
   - Application name: `Joint Command & War College Tracker`
   - Homepage URL: `https://johwiltb.github.io/war-college-tracker/`
   - Authorization callback URL: the Supabase callback URL
4. Register the application.
5. Copy the GitHub Client ID and generate a client secret.
6. In Supabase’s GitHub provider settings, paste the Client ID and client secret, enable the provider, and save.
7. The GitHub client secret belongs only in Supabase. Never add it to this repository or GitHub Actions.

### Google

1. Open Google Cloud Console and select or create a project for the tracker.
2. Configure the OAuth consent screen. For personal use, an External app in testing mode is sufficient; add your Google account as a test user while the app remains in testing.
3. Create an OAuth 2.0 Client ID with application type **Web application**.
4. Add this **Authorized JavaScript origin**:
   - `https://johwiltb.github.io`
5. Add this **Authorized redirect URI**:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
6. Copy the Google Client ID and Client Secret.
7. In Supabase, open **Authentication → Sign In / Providers → Google**.
8. Paste the Google Client ID and Client Secret, enable the provider, and save.
9. Keep the Google Client Secret only in Supabase. Do not add it to the repository or to `VITE_` variables.

If you later use a custom domain, add that origin in Google Cloud and add the corresponding redirect target to Supabase URL Configuration.

## 4. Configure Supabase application redirects

In **Supabase → Authentication → URL Configuration** set:

- Site URL: `https://johwiltb.github.io/war-college-tracker/`
- Redirect URLs:
  - `http://localhost:5173/war-college-tracker/`
  - `https://johwiltb.github.io/war-college-tracker/`

Use exact URLs, including the trailing slash. If Vite starts on another port, add that exact localhost URL before testing OAuth there.

There are two different callback concepts:

- OAuth provider callback → Supabase: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Supabase allowed redirects → this application: localhost and GitHub Pages URLs above

## 5. Configure local authentication

```bash
cp .env.example .env.local
```

Replace both placeholder values in `.env.local`, then restart the dev server:

```bash
npm run dev
```

Open `http://localhost:5173/war-college-tracker/`, choose **Continue with GitHub** or **Continue with Google**, complete consent, and verify the dashboard shows **Authenticated**. Create or edit a week, wait for **Saved**, then confirm a row appears in Supabase.

## 6. Add GitHub Actions secrets

In the GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**. Add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These are public frontend values. Do not add OAuth client secrets, the Supabase service-role key, or the database password.

## 7. Enable GitHub Pages deployment

1. Open **Repository Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push an approved commit to `main`, or open **Actions → Deploy to GitHub Pages → Run workflow**.
4. The workflow installs with `npm ci`, validates the project, builds `dist`, uploads the Pages artifact, and deploys it.
5. Open `https://johwiltb.github.io/war-college-tracker/` after the workflow succeeds.

The workflow is already configured at `.github/workflows/deploy-pages.yml`. No `gh-pages` branch is needed.

## 8. Production acceptance test

1. Open the production URL in a private/incognito window.
2. Continue in guest mode, check a reading, type a prompt response, wait for **Saved**, refresh, and confirm recovery.
3. Export the JSON backup.
4. Sign in with GitHub and confirm the authenticated indicator.
5. Sign out, then sign in with Google and confirm the authenticated indicator.
6. Use **Data & account settings → Copy guest data to account** only for the identity you intend to use as the primary account.
7. Open another browser/device, sign in with the same provider/account, and confirm the copied record appears.
8. Create and edit a command document; verify it appears in Supabase and on the second browser.
9. Import the exported backup, review the summary, confirm it, and verify the record counts.
10. Test sign-out and confirm the guest workspace is isolated from authenticated data.

### Important identity note

GitHub and Google identities are separate Supabase users unless you explicitly implement account linking. Signing in with GitHub and signing in with Google may therefore show different saved progress even if both providers use the same email address. Choose one provider as your normal account unless account-linking support is added later.

## Troubleshooting

- **GitHub returns a callback error:** the GitHub OAuth App callback must be the Supabase `/auth/v1/callback` URL, not the Pages URL.
- **Google returns `redirect_uri_mismatch`:** the Google Web Client must list the exact Supabase `/auth/v1/callback` URL as an authorized redirect URI.
- **Google says the app is not available to the user:** while the Google OAuth consent screen is in Testing, add that Google account as a test user.
- **Supabase rejects the redirect:** add the exact localhost or production application URL to Authentication URL Configuration.
- **Sign-in works but saves fail:** apply the migration and inspect RLS policies; do not disable RLS.
- **Pages loads but assets 404:** confirm `vite.config.ts` still has `base: '/war-college-tracker/'`.
- **A direct route is missing:** application navigation must remain hash-based (`/#/week/week-1`) on GitHub Pages.
- **Changes appear only on one device:** confirm the mode indicator says Authenticated and the save indicator reaches Saved rather than Save failed.
