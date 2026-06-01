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
