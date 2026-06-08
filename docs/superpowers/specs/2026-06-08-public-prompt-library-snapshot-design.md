# Public Prompt Library Snapshot Design

## Goal

Add public, read-only Prompt Library snapshots so a user can publish their current personal prompt library to a random share link, and other users can save individual prompts into their own library.

## Decision

Use a manual snapshot model, not a live public mirror.

When the owner publishes, the backend copies all non-archived prompts from `prompt_library` into a separate public snapshot. Prompts saved after that do not become public until the owner explicitly refreshes the publication. This avoids accidental disclosure of client, work, or personal prompts saved after sharing.

## Product Behavior

The existing private `/prompt-library` remains the owner workspace and stays extension-JWT gated.

Owner controls:

- `Publish library`: creates a new public snapshot from all current non-archived prompts.
- `Copy public link`: copies a random URL such as `/p/a8Kx29q`.
- `Refresh publication`: replaces the snapshot contents with the current non-archived private library.
- `Unpublish`: disables the public URL.

Public page:

- Route: `/p/:slug`.
- Random slug only for MVP; no custom handles.
- Read-only view with the same general information architecture as Prompt Library.
- No edit, archive, delete, favorite, or "copy whole library" action.
- Sorts: recently added and A-Z.
- Search over title, tags, and body.
- Each prompt has `Save to my library`.

Save behavior:

- If the viewer has a website Supabase session, saving creates a personal copy in `prompt_library`.
- If not signed in, the CTA routes to `/login?next=/p/<slug>`.
- Duplicate bodies are blocked by the existing `(user_id, body_hash)` uniqueness rule and shown as an "already saved" state.
- Saved copies are independent rows; later owner snapshot refreshes do not mutate viewer copies.

## Architecture

Keep private rows private. Do not loosen `prompt_library` RLS or expose owner rows directly.

Add public snapshot tables in the extension-owned Supabase project:

- `prompt_library_publications`: one publication per owner, random `slug`, `is_public`, timestamps.
- `prompt_library_publication_items`: copied prompt fields for public display, linked to a publication.

All public write operations run through database RPC functions exposed via PostgREST:

- `prompt_library_publish_snapshot()`: owner creates or refreshes their publication from current private prompts.
- `prompt_library_unpublish()`: owner disables their publication.
- `prompt_library_save_public_prompt(p_item_id uuid)`: authenticated viewer copies one public item into their private library.

Public reads use a security-invoker view or RPC that returns only active publication snapshots by slug. The public route must not need a Bearer token to render.

## Website Changes

Create small shared helpers instead of expanding `PromptLibraryPage.tsx` further:

- `src/lib/promptLibraryApi.ts`: PostgREST/RPC helpers, shared constants, auth header helpers.
- `src/app/pages/PublicPromptLibraryPage.tsx`: public read-only route.

Update:

- `src/app/pages/PromptLibraryPage.tsx`: add publish state and owner controls.
- `src/main.tsx`: add `/p/:slug`.
- `vercel.json`: route `/p/:slug` to SPA fallback and keep it `noindex,nofollow` for MVP.
- `docs/INTEGRATION-CONTRACT.md` and `docs/ARCHITECTURE.md`: document route and backend contract.
- `AGENTS.md` first, then `npm run sync:agents`, because this adds durable route/backend context.

## Security And Privacy

- Private `prompt_library` RLS remains owner-only.
- Public snapshots contain copied data, so unpublishing blocks future access without touching private data.
- The snapshot does not update automatically.
- Public save requires auth and inserts into the viewer's own `prompt_library` row under existing RLS.
- Slugs are random and not enumerable by owner email or user ID.
- Public pages are `noindex` in MVP.

## Errors

- Public slug missing or unpublished: show a not-found/disabled state.
- Save while signed out: redirect to website login with a safe `next`.
- Duplicate save: show "Already in your library".
- Viewer quota full: show existing 150-prompt limit message.
- Network/RPC failure: keep page usable and show retryable inline feedback.

## Verification

- SQL migration assertion verifies tables, constraints, indexes, RLS, and RPC grants.
- SQL behavioral test verifies owner snapshot creation, refresh replacing items, unpublish hiding the route, public read isolation, duplicate save behavior, and viewer quota behavior by pre-filling 150 private prompts before calling the save RPC.
- Website build must pass with `npm run build`.
- Manual browser verification:
  - owner publishes from `/prompt-library`;
  - `/p/:slug` renders signed out;
  - signed-out save routes to `/login?next=/p/:slug`;
  - signed-in save creates one personal copy;
  - duplicate save does not create another row;
  - unpublish hides the public page.
