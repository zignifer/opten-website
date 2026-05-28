# Supabase — доступ к ключевым словам (из opten-website, без opten-seo)

Живой источник SEO-ключей — Supabase-проект opten-seo (он **отдельный** от
продового, D-02). Доступен прямо из этого репо; заходить в `C:\Projects\opten-seo`
не нужно.

## Креды
Лежат в `.env.local` этого репо (gitignored, в git не попадают):
- `SUPABASE_URL`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_PUBLISHABLE_KEY` — **только publishable (чтение)**.

Secret key / access token сюда НЕ кладём — для записи/загрузки данных работаем в
opten-seo. Здесь — только read.

## Как читать
```bash
node seo/supabase-keywords.mjs                          # все BL-* кластеры, топ по объёму
node seo/supabase-keywords.mjs --cluster BL-news --limit 50
node seo/supabase-keywords.mjs --lang ru
```
Таблица `seo_keywords` (колонки `keyword, language, volume, cluster_id`). RLS на
проекте off, поэтому publishable key читает таблицы напрямую через PostgREST.

## Когда это нужно
По умолчанию темы берём из снимка `seo/blog-clusters.md` (он в репо и всегда под
рукой). Supabase — если нужны самые свежие фразы/объёмы, которых ещё нет в снимке.
