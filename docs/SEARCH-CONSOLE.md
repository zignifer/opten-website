# Google Search Console Access

The site repo has a local Search Console CLI for direct indexing checks.

Credentials are stored only in `.secrets/gsc-oauth.env` and are not committed.
The file contains the OAuth installed-app client plus refresh token for the
owner Google account.

Service Account access is intentionally not used: Search Console rejected the
service account email with `email not found` when adding it as a user.

## Commands

```powershell
npm run gsc:sites
npm run gsc:sitemaps
npm run gsc:submit-sitemap
npm run gsc:inspect -- https://opten.space/models/gpt-image-2
npm run gsc:inspect-sitemap
npm run gsc:performance -- 90
npm run gsc:queries -- 90
```

`npm run gsc:inspect-sitemap` checks every `opten.space` URL in the live
sitemap through the official URL Inspection API with bounded concurrency and a
30-second per-request timeout. It prints progress, then counts and examples
grouped by `coverageState`, and writes the full ignored report to
`.secrets/gsc-inspection-latest.json`. Use this command when
the Search Console UI reports a large unindexed-page count but the authenticated
browser account is unavailable or different from the API owner account.

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

This is an API OAuth flow. Opening the ordinary Search Console dashboard is not
a substitute: the one-time `authUrl` from the helper must be opened in the
external Chrome profile.

Tell the user to select the Google account that owns the `opten.space` Search
Console property and approve the Webmasters/Search Console scope. After the
user says `готово`, check:

```powershell
node scripts/gsc-oauth-refresh.mjs status
npm run gsc:sites
```

When the status is `complete`, the helper has saved the new
`GSC_REFRESH_TOKEN` into `.secrets/gsc-oauth.env`.

Treat reauthorization as successful only after both checks pass:

1. `node scripts/gsc-oauth-refresh.mjs status` returns `"status": "complete"`.
2. `npm run gsc:sites` returns `https://opten.space/` or
   `sc-domain:opten.space` with `permissionLevel: "siteOwner"`.

## Recovery

- If normal GSC commands return `invalid_grant`, start a fresh authorization
  flow. Do not reuse an older `authUrl`; its localhost callback and state are
  one-time values.
- The helper retries the Google token exchange up to three times for temporary
  transport errors, HTTP 429, and HTTP 5xx responses. A final transport failure
  is written to `.secrets/gsc-oauth-refresh.status.json` with the underlying
  network error when Node provides one.
- If the helper still ends with `status: error`, run
  `npm run gsc:refresh-auth` again, open the newly printed `authUrl` in external
  Chrome, and approve access with the Google account that owns `opten.space`.
- Never print or paste `GSC_CLIENT_SECRET`, `GSC_REFRESH_TOKEN`, the OAuth code,
  or the full one-time `authUrl` into chat or project documentation.
