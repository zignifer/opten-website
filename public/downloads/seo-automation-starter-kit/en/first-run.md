# First SEO pipeline run

## Before the run

1. Add `business-brief.md` and `topic-registry.csv` to the project.
2. Complete the brief and replace the demonstration rows in the registry.
3. Add 5-10 seed phrases written in customer language.
4. Record the website rules: article folder, SEO fields, images, build, and publication.
5. Connect Wordstat through a separate service account.
6. Keep the API key in a secret store. Never paste it into chat or public files.

## Command

`Write an SEO article`

## What Codex should do

1. Inspect the project and existing pages without making changes.
2. Select exactly one topic with `queued` status.
3. Confirm that the topic and URL do not duplicate published material.
4. Assemble a brief from the registry, business context, and project rules.
5. Create the article, images, and required language versions.
6. Check facts, links, metadata, schema, sitemap, and the website build.
7. Present the result and wait for publication approval.
8. Change the topic to `published` only after the live page is verified.

## Starter scope

- 1 website
- 5-10 seed phrases
- 3 approved topics
- 1 article
- 1 manual review
