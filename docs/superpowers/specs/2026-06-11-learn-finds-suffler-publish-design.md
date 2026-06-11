# Learn Finds And Suffler Publish Design

## Goal

Add a public Learn Finds format for curated third-party YouTube expert videos and let the local suffler desktop app publish analyzed videos into that format without leaving the app.

## Approved Product Shape

The `/learn` hub gains a segment switch between Opten lessons and curated finds. Finds use YouTube thumbnails, display as a separate card grid, and open a detail page under `/learn/finds/:slug` and `/en/learn/finds/:slug`. A find page embeds the original YouTube video, removes the Opten author/course card, and focuses on Opten-added utility: short summary, takeaways, commands, prompts, resources, risks, and timestamps.

## Architecture

The website owns rendering and SEO. A generated JSON file, `src/content/space/learnFinds.generated.json`, stores all published finds. TypeScript wrapper helpers in `src/content/space/learnFinds.ts` normalize localized text, YouTube thumbnails, timestamps, and cards. Routes are prerendered through the existing Learn SSR/SEO pipeline.

Suffler owns automation. After Gemini creates the story script, a new Publish button calls a local Electron IPC handler. The handler verifies NotebookLM CLI availability/auth, adds the YouTube source to a notebook, asks for structured JSON, merges the result into the website generated file, runs `npm run build`, commits, and pushes. It returns the public URL when the local push succeeds.

## Publishing Policy

The publisher uses git push to trigger Vercel because this project already deploys from `main`. It blocks if the website repo has unrelated tracked changes before writing content. It never commits NotebookLM auth state, temporary files, raw transcripts, or API keys. It writes only the generated content file for normal publishing.

## Error Handling

NotebookLM auth failures surface as an app status with a Login button that runs `notebooklm login`. Build failures, dirty worktree failures, git push failures, invalid YouTube URLs, and invalid NotebookLM JSON all return explicit messages and leave the UI in a retryable state.

## Verification

Website verification uses `npm run verify:space-learn`, `npm run build`, and a browser smoke for `/learn` and one `/learn/finds/:slug` route. Suffler verification uses `npm test` plus a dry-run unit test for the publisher merge and git guard behavior.
