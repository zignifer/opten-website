# Google Search Console Access

The site repo has a local Search Console CLI for direct indexing checks.

Credentials are stored in `.secrets/gsc-oauth.env` and are not committed. The
file is copied from `C:\Projects\opten-seo\.env.local` and contains the OAuth
installed-app client plus refresh token for the owner Google account.

Service Account access is intentionally not used: Search Console rejected the
service account email with `email not found` when adding it as a user.

## Commands

```powershell
npm run gsc:sites
npm run gsc:sitemaps
npm run gsc:submit-sitemap
npm run gsc:inspect -- https://opten.space/models/gpt-image-2
npm run gsc:performance -- 90
```

If a command fails with `invalid_grant`, the refresh token was revoked or
expired. Re-run the OAuth installed-app consent flow and update
`.secrets/gsc-oauth.env`.

## Reauthorization Flow

Use this flow when GSC returns `invalid_grant`.

```powershell
npm run gsc:refresh-auth
```

The command starts a temporary localhost callback in the background and prints a
JSON object. It also writes the same data to
`.secrets/gsc-oauth-refresh.status.json`:

- `status` — usually `waiting`, then `complete`, `error`, or `timeout`
- `authUrl` — one-time Google OAuth URL
- `callback` — local `127.0.0.1` callback URL

Agents should open `authUrl` in the user's real Chrome profile with the Chrome
control plugin/skill, then leave that tab as a handoff. Do not rely on
PowerShell `Start-Process` as the primary UX for opening the browser in Codex
Desktop; it can fail to surface a window.

Tell the user to select the Google account that owns the `opten.space` Search
Console property and approve the Webmasters/Search Console scope. After the
user says `готово`, check:

```powershell
node scripts/gsc-oauth-refresh.mjs status
npm run gsc:sites
```

When the status is `complete`, the helper has saved the new
`GSC_REFRESH_TOKEN` into both `.secrets/gsc-oauth.env` and
`C:\Projects\opten-seo\.env.local`.
