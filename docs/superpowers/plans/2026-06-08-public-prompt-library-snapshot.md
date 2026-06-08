# Public Prompt Library Snapshot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build public read-only Prompt Library snapshots at `/p/:slug`, with owner publish/refresh/unpublish controls and per-prompt save into the viewer's private library.

**Architecture:** Keep `prompt_library` private and owner-scoped. Add extension-owned Supabase snapshot tables plus RPCs for owner publishing, public reads, and authenticated per-prompt saves. Add website helper functions, owner controls in `/prompt-library`, a separate public page, and route/docs/noindex updates.

**Tech Stack:** Vite 6, React 18, React Router 7, TypeScript, Tailwind 4, Supabase PostgREST/RPC with plain `fetch`, PostgreSQL RLS migrations in `promptscore`.

---

## File Structure

Website repo (`/Users/vladislavvoronezhtsev/Projects/opten-website`):

- Create: `src/lib/promptLibraryApi.ts` — shared prompt-library REST/RPC helpers, records, publication types, auth headers.
- Create: `src/app/pages/PublicPromptLibraryPage.tsx` — public read-only library route.
- Modify: `src/app/pages/PromptLibraryPage.tsx` — use shared helpers, add publication controls.
- Modify: `src/main.tsx` — lazy route `/p/:slug`.
- Modify: `vercel.json` — SPA rewrite + noindex header for `/p/:slug`.
- Modify: `docs/INTEGRATION-CONTRACT.md`, `docs/ARCHITECTURE.md`, `AGENTS.md`, `CLAUDE.md` — route/backend contract.
- Run: `npm run sync:agents` after editing `AGENTS.md`.

Extension repo (`/Users/vladislavvoronezhtsev/Projects/promptscore`):

- Create: `supabase/migrations/016_prompt_library_public_snapshots.sql` — schema/RLS/RPCs.
- Create: `supabase/functions/tests/016-prompt-library-public-snapshots.sql` — rollback-only behavioral SQL test.
- Modify: `supabase/functions/tests/README.md` — add test instructions.

## Task 1: Isolate Work

- [ ] **Step 1: Create/switch website branch**

Run:

```bash
cd /Users/vladislavvoronezhtsev/Projects/opten-website
git switch -c codex/public-prompt-library-snapshot
```

Expected: branch created from current `main`.

- [ ] **Step 2: Create/switch extension branch**

Run:

```bash
cd /Users/vladislavvoronezhtsev/Projects/promptscore
git switch -c codex/public-prompt-library-snapshot
```

Expected: branch created. Existing `.codex/*` local changes remain unstaged and must not be modified.

## Task 2: Add Supabase Snapshot Backend

- [ ] **Step 1: Create migration**

Create `supabase/migrations/016_prompt_library_public_snapshots.sql` with:

```sql
CREATE TABLE IF NOT EXISTS public.prompt_library_publications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  is_public boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  unpublished_at timestamptz,
  CONSTRAINT prompt_library_publications_slug_check
    CHECK (slug ~ '^[A-Za-z0-9_-]{8,24}$'),
  CONSTRAINT prompt_library_publications_one_per_user UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.prompt_library_publication_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id uuid NOT NULL REFERENCES public.prompt_library_publications(id) ON DELETE CASCADE,
  source_prompt_id uuid,
  title text NOT NULL,
  body text NOT NULL,
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  source_host text,
  source_url text,
  source_title text,
  source_created_at timestamptz,
  source_updated_at timestamptz,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector NOT NULL DEFAULT ''::tsvector,
  CONSTRAINT prompt_library_public_items_title_length_check
    CHECK (length(btrim(title)) BETWEEN 1 AND 160),
  CONSTRAINT prompt_library_public_items_body_length_check
    CHECK (length(btrim(body)) BETWEEN 1 AND 12000),
  CONSTRAINT prompt_library_public_items_tags_check
    CHECK (public.prompt_library_tags_valid(tags)),
  CONSTRAINT prompt_library_public_items_position_check
    CHECK (position >= 0)
);
```

Also add indexes, RLS, a before-write trigger for item trimming/search vector, and these RPCs:

- `public.prompt_library_publish_snapshot()` returns `prompt_library_publication_summary`.
- `public.prompt_library_get_public_snapshot(p_slug text)` returns publication + item rows.
- `public.prompt_library_unpublish()` returns boolean.
- `public.prompt_library_save_public_prompt(p_item_id uuid)` returns `public.prompt_library`.

- [ ] **Step 2: Create behavioral SQL test**

Create `supabase/functions/tests/016-prompt-library-public-snapshots.sql` that:

```sql
BEGIN;
-- Create owner/viewer auth users + public.users rows.
-- SET LOCAL request.jwt.claim.sub to owner.
-- Insert two owner prompt_library rows.
-- SELECT public.prompt_library_publish_snapshot(); assert two public items.
-- Insert a third owner prompt_library row and call publish again; assert three items and same slug.
-- SET LOCAL request.jwt.claim.sub to viewer.
-- SELECT public.prompt_library_save_public_prompt(first_public_item_id); assert viewer prompt_library row exists.
-- Call save again and assert unique duplicate error path.
-- SET LOCAL request.jwt.claim.sub to owner.
-- SELECT public.prompt_library_unpublish(); assert public snapshot RPC returns zero rows.
ROLLBACK;
```

- [ ] **Step 3: Update test README**

Add the new SQL test command:

```bash
psql "$SUPABASE_DB_URL" -f supabase/functions/tests/016-prompt-library-public-snapshots.sql
```

## Task 3: Add Website API Helpers

- [ ] **Step 1: Create `src/lib/promptLibraryApi.ts`**

Move duplicated private constants and add public helpers:

```ts
export const SUPABASE_REST_URL = "https://supabase.opten.space/rest/v1";
export const PROMPT_SELECT = "id,user_id,title,body,tags,favorite,source_host,source_url,source_title,body_hash,use_count,last_used_at,created_at,updated_at,archived_at";
export const MAX_PROMPTS = 150;
export const MAX_BODY_CHARS = 12000;
export const MAX_TAGS = 8;

export function promptLibraryHeaders(accessToken?: string | null): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken ?? ""}`,
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  };
}
```

Add typed functions:

- `fetchPublicationSummary(accessToken)`
- `publishPromptLibrarySnapshot(accessToken)`
- `unpublishPromptLibrary(accessToken)`
- `fetchPublicPromptLibrary(slug)`
- `savePublicPromptToLibrary(itemId, accessToken)`

## Task 4: Add Owner Publish Controls

- [ ] **Step 1: Modify `PromptLibraryPage.tsx` imports and constants**

Import helper constants/functions from `../../lib/promptLibraryApi` and remove local duplicated `SUPABASE_REST_URL`, `MAX_PROMPTS`, `MAX_BODY_CHARS`, `MAX_TAGS`, `PROMPT_SELECT`.

- [ ] **Step 2: Add publication state**

Add state:

```ts
const [publication, setPublication] = useState<PromptLibraryPublicationSummary | null>(null);
const [publishing, setPublishing] = useState(false);
```

Load summary after auth readiness and after publish/unpublish.

- [ ] **Step 3: Add owner action handlers**

Add:

- `handlePublishSnapshot()`
- `handleUnpublishSnapshot()`
- `handleCopyPublicLink()`

Each uses the current extension JWT and shows localized toast messages.

- [ ] **Step 4: Render publication controls**

Add a compact control block near the page actions:

- no publication: `Опубликовать` / `Publish`
- active publication: link, `Скопировать`, `Обновить публикацию`, `Снять с публикации`

## Task 5: Add Public Prompt Library Page

- [ ] **Step 1: Create `PublicPromptLibraryPage.tsx`**

Build a read-only route that:

- reads `slug` from `useParams()`;
- fetches snapshot via `fetchPublicPromptLibrary(slug)`;
- supports local search + sort (`recent`, `az`);
- uses `readSession()` / `refreshSessionIfNeeded()` for website auth;
- on save, redirects signed-out users to `/login?next=/p/<slug>`;
- calls `savePublicPromptToLibrary(item.id, session.access_token)` for signed-in users.

- [ ] **Step 2: Add route**

In `src/main.tsx` add:

```ts
const PublicPromptLibraryPage = lazy(() => import("./app/pages/PublicPromptLibraryPage.tsx"));
```

and route:

```tsx
<Route path="/p/:slug" element={<PublicPromptLibraryPage />} />
```

## Task 6: Add Noindex SPA Routing

- [ ] **Step 1: Update `vercel.json` rewrites**

Add:

```json
{ "source": "/p/:slug", "destination": "/spa.html" }
```

- [ ] **Step 2: Update `vercel.json` headers**

Add:

```json
{
  "source": "/p/:slug",
  "headers": [
    { "key": "X-Robots-Tag", "value": "noindex, nofollow" }
  ]
}
```

## Task 7: Update Docs And Agent Context

- [ ] **Step 1: Update `AGENTS.md` first**

Document `/p/:slug`, snapshot tables/RPCs, and that public pages are noindex MVP.

- [ ] **Step 2: Mirror agent instructions**

Run:

```bash
npm run sync:agents
```

- [ ] **Step 3: Update contract docs**

Update `docs/INTEGRATION-CONTRACT.md` and `docs/ARCHITECTURE.md` with the route and backend contract.

## Task 8: Verify

- [ ] **Step 1: Website build**

Run:

```bash
cd /Users/vladislavvoronezhtsev/Projects/opten-website
npm run build
```

Expected: build completes without TypeScript/Vite errors.

- [ ] **Step 2: SQL syntax smoke**

Run:

```bash
cd /Users/vladislavvoronezhtsev/Projects/promptscore
rg -n "prompt_library_publish_snapshot|prompt_library_get_public_snapshot|prompt_library_save_public_prompt|prompt_library_unpublish" supabase/migrations/016_prompt_library_public_snapshots.sql supabase/functions/tests/016-prompt-library-public-snapshots.sql
```

Expected: all four RPC names appear in migration and behavioral test.

- [ ] **Step 3: Git status review**

Run:

```bash
git status --short
```

Expected: only intended files are modified in each repo; extension repo `.codex/*` changes remain unstaged and untouched.
