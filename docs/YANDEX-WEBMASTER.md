# Yandex Webmaster Access

The site repo has a local Yandex Webmaster CLI for indexing and search-query
checks.

Credentials are stored in `.secrets/yandex-webmaster.env` and are not
committed:

```ini
YANDEX_WEBMASTER_OAUTH_TOKEN=
YANDEX_WEBMASTER_HOST_URL=https://opten.space/
```

The Yandex Cloud Wordstat key is a separate API and does not grant Webmaster
access. The old Wordstat OAuth token from `C:\Projects\opten-seo` was tested
against `https://api.webmaster.yandex.net/v4/user` and failed with
`ACCESS_FORBIDDEN` because the app has no Webmaster scopes.

## Getting a Token

Use the official Yandex Webmaster API authorization flow:

1. Create a Yandex OAuth app.
2. Platform: web service.
3. Redirect URI: `https://oauth.yandex.ru/verification_code`.
4. Data access: Yandex Webmaster permissions, including `webmaster:hostinfo`
   and `webmaster:verify`.
5. Open:

```text
https://oauth.yandex.ru/authorize?response_type=token&client_id=<client-id>
```

6. Copy the token and paste it into `.secrets/yandex-webmaster.env`.

Yandex currently documents this as a token that lasts 6 months. Re-issue it
when API calls start returning `401` or `ACCESS_FORBIDDEN`.

## Commands

```powershell
npm run yandex:webmaster:user
npm run yandex:webmaster:hosts
npm run yandex:webmaster:summary
npm run yandex:webmaster:sitemaps
npm run yandex:webmaster:queries
npm run yandex:webmaster:recrawl -- https://opten.space/models/gpt-image-2
```

## Current Status

Checked on 2026-06-01 from this repo:

- API auth works.
- `https://opten.space/` is present and `verified: true`.
- Summary: `sqi: 10`, `searchable_pages_count: 146`,
  `excluded_pages_count: 4`.
- Sitemap: `https://opten.space/sitemap.xml`, `errors_count: 0`,
  `urls_count: 160`, source `ROBOTS_TXT`.
- Search queries: 41 rows for 2026-05-24..2026-05-30.

This means agents can inspect Yandex Webmaster directly from the site repo.

Official docs:

- https://yandex.ru/dev/webmaster/doc/ru/tasks/how-to-get-oauth
- https://yandex.ru/dev/webmaster/doc/ru/concepts/getting-started
- https://yandex.ru/dev/webmaster/doc/dg/reference/host-search-queries-popular-docpage/
