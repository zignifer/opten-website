---
phase: 03-bilingual-routing
plan: 06
type: execute
wave: 2
depends_on: [01]
files_modified:
  - src/i18n/LangContext.tsx
autonomous: true
requirements:
  - GEO-C-4
must_haves:
  truths:
    - "`detectLangFromPath(pathname)` returns `\"en\"` when pathname starts with `/en/` or equals `/en`, otherwise `null`"
    - "`LangProvider` initial `useState<Lang>` value is derived from `useLocation().pathname` synchronously — SSR and first client paint agree on `/en/*` routes"
    - "`LangProvider` re-runs detection on `location.pathname` change (URL drives language on prefixed routes)"
    - "On unprefixed paths, `LangProvider` keeps the Phase 2 behavior — post-mount `detectLangFromStorage()` reads `localStorage.opten_lang` ?? `navigator.language` and flips content (D-07 preserved)"
    - "`document.documentElement.lang` mutator is NOT re-introduced — Plan 01's deletion holds; `<html lang>` lives only in build-time prerender (Plan 03)"
    - "`en.json` static-import gate runs only when `typeof window === \"undefined\"` (SSR path) so that `renderToString` on `/en/*` sees EN strings synchronously (Pitfall 6 mitigation)"
  artifacts:
    - path: "src/i18n/LangContext.tsx"
      provides: "URL-prefix-aware LangProvider; SSR-safe initial state via useLocation; D-07 status-quo for unprefixed paths"
      contains: "detectLangFromPath"
      exports: ["LangContext", "LangProvider", "useT", "useLang", "Lang"]
  key_links:
    - from: "src/i18n/LangContext.tsx"
      to: "react-router useLocation"
      via: "synchronous read in LangProvider body; works in both BrowserRouter (client) and StaticRouter (SSR)"
      pattern: "useLocation\\(\\)"
    - from: "src/i18n/LangContext.tsx (LangProvider useEffect)"
      to: "loadEnDict() dynamic import (browser) / static en.json import (SSR)"
      via: "typeof window check decides path; only one of the two runs per environment"
      pattern: "typeof window"
---

<objective>
Extend `src/i18n/LangContext.tsx` so language detection is URL-prefix-driven on `/en/*` routes (with `localStorage` + `navigator.language` falling back only on unprefixed paths per D-07), and so SSR can render EN bodies synchronously (Pitfall 6 mitigation).

This plan is the second LangContext.tsx edit in Phase 3 — it sits AFTER Plan 01 (which deleted `LangContext.tsx:84-86`) in Wave 2. Plan 06's footprint:

1. **Add `detectLangFromPath(pathname)` helper** — pure function, returns `"en"` for `/en/*` or `/en`, else `null`.
2. **Rename `detectLang()` to `detectLangFromStorage()`** — same body, but add an SSR guard at the top so the function returns `"ru"` when `typeof window === "undefined"` (avoids `localStorage` reference errors during `renderToString`).
3. **Use `useLocation()` synchronously** in `LangProvider` to derive the initial `useState<Lang>` value — this is what makes SSR and first client paint agree on `/en/*` (no RU→EN content flash on direct hits to `/en/welcome` etc.).
4. **Wire `useEffect([location.pathname])`** — on URL change, re-run detection; on prefixed paths URL wins, on unprefixed paths fall back to storage/navigator (D-07 preserved).
5. **Gate dynamic EN dict import behind `typeof window !== "undefined"`** — and add a `typeof window === "undefined"` static-import path. Per RESEARCH.md Open Question #4 + Pitfall 6 recommendation (b): "detect SSR in `LangContext.tsx` and gate the dynamic import behind `typeof window !== 'undefined'`. One small change in `LangContext.tsx`: at module top, `import enDict from './en.json'` if `typeof window === 'undefined'`". The mechanism used here: dynamic `import.meta.env.SSR ? eager-import : lazy-import` is brittle in Vite, so simpler: keep the existing lazy-load for client BUT add a synchronous static import of `en.json` that runs only at SSR build time. Vite's tree-shaker drops the static import from the client bundle because the only consumer is the SSR-side conditional branch. See action body for the exact pattern.

Critically: Plan 06 MUST NOT re-introduce `document.documentElement.lang = lang` (the deletion from Plan 01). The lang attribute is now baked at prerender time (Plan 03) and stays put — that's the whole point of Pattern 3.

Closes GEO-C-4 at the runtime level. Plan 03 closed it at the build-time level; the two together guarantee that `<html lang>` is correct both in the initial HTML payload and in the React tree's `useLang()` reads.

Purpose: a single, idempotent LangProvider that is URL-driven on prefixed routes (zero flash) and storage-driven on unprefixed routes (status-quo content flip per D-07).

Output: a refactored `LangContext.tsx` with the 5 changes above, no `document.documentElement.lang` write, full SSR safety.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/phases/03-bilingual-routing/03-CONTEXT.md
@.planning/phases/03-bilingual-routing/03-RESEARCH.md
@.planning/phases/03-bilingual-routing/03-PATTERNS.md
@.planning/phases/03-bilingual-routing/03-VALIDATION.md
@src/i18n/LangContext.tsx
@src/i18n/en.json
@src/main.tsx
@scripts/entry-server.tsx
@CLAUDE.md

<interfaces>
<!-- LangContext.tsx state AFTER Plan 01 (which deleted lines 84-86) and BEFORE this plan. -->
<!-- The executor must re-read the file post-Plan-01 to confirm the deletion landed. -->

Exports that downstream code (Plan 08's LangSwitcher + every page using useT/useLang) depends on — DO NOT change signatures:
- export type Lang = "ru" | "en";
- export const LangContext: React.Context<LangContextValue>;
- export function LangProvider({ children }): JSX.Element;
- export function useT(): (key: string) => string;
- export function useLang(): { lang: Lang; setLang: (l: Lang) => void };

Existing dynamic-import shape (Phase 2.2 lazy-load):
- `const dicts: Partial<Record<Lang, Dict>> = { ru };` — RU statically imported on line 2
- `loadEnDict()` returns a Promise that resolves once en.json has been dynamic-imported and cached in `dicts.en`
- `enLoadPromise` cache prevents duplicate fetches

`useEffect` patterns currently in the file (after Plan 01):
- Lines 57-68 — post-mount `detectLang()` call. This is the function being refactored into `detectLangFromStorage()` + a `useLocation`-keyed effect.

NOTE FROM RESEARCH.md Pitfall 6: For SSR-side EN body rendering on `/en/*` routes, `en.json` must be available SYNCHRONOUSLY during `renderToString`. The chosen pattern (recommendation (b)): gate a static import behind `typeof window === "undefined"`. Vite tree-shakes the SSR-only branch out of the client bundle. The executor confirms the SSR build size after this plan does NOT regress the client bundle.

(There is a subtlety here: ESM static imports cannot be conditional inside a `typeof window` check at the top level — they hoist. The workaround used in this plan: a `typeof window === "undefined" && (await import("./en.json"))` AT MODULE TOP using top-level await — Vite 6 + Node 22 support top-level await in SSR bundles. Or, alternatively, use the existing dynamic-import + a one-shot synchronous-blocking helper. The action below specifies the chosen pattern.)
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add detectLangFromPath helper + SSR-safe detectLangFromStorage rename</name>
  <read_first>
    - src/i18n/LangContext.tsx (full file AFTER Plan 01 — confirm lines 84-86 are gone; the surviving file has ~107 lines)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Architecture Patterns → Pattern 4, lines 359-415 — verbatim helper + Provider body; §Common Pitfalls → Pitfall 6, lines 578-592 — SSR-safety constraint)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§6, lines 296-339 — file-by-file mapping)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-05, D-07, D-07b — URL-prefix precedence; unprefixed paths keep status-quo; switcher = only URL-changer)
  </read_first>
  <action>
    In `src/i18n/LangContext.tsx`, make these changes (top to bottom):

    (a) **Top of file imports** — add `useLocation` from `"react-router"`. Existing imports `createContext, useContext, useState, useEffect` from "react" stay. New line: `import { useLocation } from "react-router";` placed after the React imports, before `import ru from "./ru.json";`. CLAUDE.md convention: import from `"react-router"`, NOT `"react-router-dom"` (RESEARCH.md anti-pattern line 477).

    (b) **Add `detectLangFromPath` helper** — pure function, place it immediately AFTER the existing `detectLang` function (which Task 2 will rename) but BEFORE the imports/exports section above LangProvider. Signature: `function detectLangFromPath(pathname: string): Lang | null`. Body: `if (pathname.startsWith("/en/") || pathname === "/en") return "en"; return null;`. The `=== "/en"` exact-match handles the edge case where a user lands on `/en` without trailing slash (defensive — the canonical is `/en/`, but Vercel may rewrite trailing slashes inconsistently per RESEARCH.md Pitfall 8).

    (c) **Rename `detectLang()` to `detectLangFromStorage()`** — same function body (lines 8-12 today), but add an SSR guard as the first line of the function: `if (typeof window === "undefined") return "ru";`. This guard short-circuits the function during `renderToString` in `entry-server.tsx` (where `localStorage` and `navigator` are undefined). Returning `"ru"` here is fine for D-07 unprefixed routes because: at SSR time the URL is unprefixed AND we have no storage/navigator info → SSR uses RU; at client time the storage/navigator are available → client may flip to EN. The flip is the accepted status-quo content flicker per D-07.

    DO NOT touch any other line in the file yet — Task 2 wires the new helpers into LangProvider.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('src/i18n/LangContext.tsx','utf-8'); const hasPathFn=s.includes('function detectLangFromPath'); const hasStorageFn=s.includes('function detectLangFromStorage'); const hasUseLocation=s.includes('import { useLocation }') || s.match(/import\s*\{[^}]*useLocation[^}]*\}\s*from\s*\"react-router\"/); const ssrGuard=s.match(/detectLangFromStorage[\s\S]{0,200}typeof\s+window\s*===\s*\"undefined\"/); const noOldName=!s.match(/function\s+detectLang\(/); if(!hasPathFn){console.error('FAIL: detectLangFromPath missing');process.exit(1)} if(!hasStorageFn){console.error('FAIL: detectLangFromStorage missing');process.exit(1)} if(!hasUseLocation){console.error('FAIL: useLocation import missing from react-router');process.exit(1)} if(!ssrGuard){console.error('FAIL: detectLangFromStorage missing SSR guard');process.exit(1)} if(!noOldName){console.error('FAIL: old detectLang() name still present — rename incomplete');process.exit(1)} console.log('PASS: helpers + SSR guard + useLocation import in place')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep "function detectLangFromPath" src/i18n/LangContext.tsx` returns 1 hit
    - `grep "function detectLangFromStorage" src/i18n/LangContext.tsx` returns 1 hit
    - `grep "function detectLang(" src/i18n/LangContext.tsx` returns 0 hits (old name fully renamed)
    - `grep "useLocation" src/i18n/LangContext.tsx` returns at least 1 hit AND the import is from `"react-router"` (not `"react-router-dom"`)
    - `detectLangFromStorage` body contains `typeof window === "undefined"` as the first guard
    - File still TS-parses (the build runs in Task 3; this task gates only on syntax)
  </acceptance_criteria>
  <done>
    Two new helper functions present; SSR guard in place; useLocation imported; old `detectLang` name gone.
  </done>
</task>

<task type="auto">
  <name>Task 2: Refactor LangProvider — URL-driven initial state + location-keyed useEffect + SSR-eager en.json gate</name>
  <read_first>
    - src/i18n/LangContext.tsx (re-read after Task 1)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Code Examples → "LangContext — URL-prefix detection via useLocation", lines 685-741 — verbatim target body for LangProvider)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Open Questions #4, lines 814-817 — recommendation (b): "gate the dynamic import behind typeof window !== 'undefined'")
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-05 — URL prefix takes precedence; D-07 — unprefixed keeps status-quo)
    - scripts/entry-server.tsx (lines 1-31 — confirms LangProvider wraps StaticRouter at SSR; useLocation inside StaticRouter returns synchronous pathname per RESEARCH.md A4)
  </read_first>
  <action>
    In `LangProvider`, make these changes:

    (a) **Add `useLocation` call at the top of the function body** (before the `useState` line):
        `const location = useLocation();`
        `const pathLang = detectLangFromPath(location.pathname);`

    (b) **Change the `useState` initializer** (currently `useState<Lang>("ru")` at line 52 with comment about D-05) FROM:
        `const [lang, setLangState] = useState<Lang>("ru");`
        TO:
        `const [lang, setLangState] = useState<Lang>(pathLang ?? "ru");`
        Update the inline comment: replace the D-05 reference with a Phase 3 D-05/D-07 reference: `// Phase 3 D-05: URL prefix wins (synchronous, SSR-safe via useLocation). Unprefixed paths default to "ru" (D-07 storage/navigator detection runs post-mount).`

    (c) **Replace the existing `useEffect(() => { ... }, [])` block** (lines 57-68 today — the post-mount `detectLang()` call) with a `useEffect(() => { ... }, [location.pathname])` block per RESEARCH.md Code Example lines 701-719. Body shape:
        ```
        useEffect(() => {
          const next = detectLangFromPath(location.pathname);
          if (next === "en") {
            if (!dicts.en) {
              loadEnDict().then(() => { setEnReady(true); setLangState("en"); });
            } else {
              setLangState("en");
            }
            return;
          }
          if (next === "ru") {
            setLangState("ru");
            return;
          }
          // D-07: unprefixed routes — keep status-quo storage/navigator detection (post-mount).
          const detected = detectLangFromStorage();
          if (detected === "en") {
            loadEnDict().then(() => { setEnReady(true); setLangState("en"); });
          } else {
            setLangState("ru");
          }
        }, [location.pathname]);
        ```
        This effect re-runs on every URL change (e.g., when the LangSwitcher in Plan 08 navigates from `/welcome` to `/en/welcome`), keeping `lang` in sync with the URL on prefixed paths and with storage/navigator on unprefixed paths.

    (d) **DO NOT** re-introduce `useEffect(() => { document.documentElement.lang = lang; }, [lang])`. That block was deleted in Plan 01 and stays gone — `<html lang>` is build-time-baked (Plan 03). If the executor finds the block has somehow reappeared (e.g., from an accidental revert), DELETE it again.

    (e) **Add the SSR-eager en.json import gate**. The cleanest approach in Vite 6 + Node ESM + top-level await (supported in SSR builds): at module top, after the `import ru from "./ru.json";` line, add:
        ```
        // Phase 3 Pitfall 6 / Open Question #4: SSR needs synchronous en.json access so renderToString on /en/* sees EN strings.
        // The dynamic import below resolves at module-load time on the SERVER (Node, where typeof window === "undefined"),
        // and Vite's SSR bundler honors top-level await. On the CLIENT, the same module-top expression short-circuits
        // (typeof window !== "undefined" → never awaits) and en.json stays lazy via loadEnDict() in LangProvider's effect.
        if (typeof window === "undefined") {
          const enModule = await import("./en.json");
          (dicts as Record<Lang, Dict | undefined>).en = enModule.default as Dict;
        }
        ```
        Place this AFTER the `dicts` declaration (currently line 25) and BEFORE the `loadEnDict()` function (line 28). The expression is a no-op on the client (no `await` executes; the if is statically false at runtime in the browser; Vite's tree-shaker MAY also drop it from the client chunk because `typeof window === "undefined"` is constant-folded — verify with `grep en\.json dist/assets/index-*.js` per RESEARCH.md A3, acceptance below).

        IF Vite 6 rejects top-level await in this module for the client build (some configurations forbid it), fall back to this alternative: import `enFallback from "./en.json"` statically at the top, and use it ONLY in the `typeof window === "undefined"` branch inside the effect that runs `useEffect`. This bloats the client bundle by ~13 KB gzip — acceptable as a fallback per RESEARCH.md A3, but try the top-level-await path first. Note the decision in the SUMMARY.md.

    Do NOT touch the `setLang` function (lines 70-82) — it stays as Phase 2.2 wrote it (loads en.json on demand, writes to localStorage). Do NOT touch the `t()` function (lines 88-93) — its fallback chain (current dict → ru dict → key) is correct. Do NOT change any of the type exports.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('src/i18n/LangContext.tsx','utf-8'); const useStateUrl=s.includes('useState&lt;Lang&gt;(pathLang') || s.match(/useState&lt;Lang&gt;\(\s*pathLang\s*\?\?/); const locEffect=s.match(/useEffect\(\(\)\s*=&gt;\s*\{[\s\S]*?\},\s*\[location\.pathname\]\s*\)/); const noDocLang=!s.includes('document.documentElement.lang'); const ssrGate=s.match(/typeof\s+window\s*===\s*\"undefined\"[\s\S]{0,300}import\(\s*\"\.\/en\.json\"\s*\)/) || s.match(/typeof\s+window\s*===\s*\"undefined\"[\s\S]{0,300}enFallback/); if(!useStateUrl){console.error('FAIL: useState initializer not URL-driven');process.exit(1)} if(!locEffect){console.error('FAIL: useEffect not keyed on location.pathname');process.exit(1)} if(!noDocLang){console.error('FAIL: document.documentElement.lang re-introduced — Plan 01 invariant violated');process.exit(1)} if(!ssrGate){console.error('FAIL: SSR-eager en.json gate missing');process.exit(1)} console.log('PASS: URL-driven state, location-keyed effect, no doc.lang, SSR gate present')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "document.documentElement.lang" src/i18n/LangContext.tsx` returns `0` (Plan 01's invariant preserved — mirrors VALIDATION.md row Plan 06)
    - `grep "startsWith(\"/en/\")" src/i18n/LangContext.tsx` returns at least 1 hit (the detection function uses the URL prefix — mirrors VALIDATION.md row Plan 06 acceptance)
    - `useState<Lang>(...)` initializer is `pathLang ?? "ru"` (URL-driven; SSR-safe)
    - `useEffect(() => { ... }, [location.pathname])` exists (URL changes re-run detection)
    - SSR-eager en.json gate present and gated on `typeof window === "undefined"`
    - No subjective acceptance language ("looks right") used here
  </acceptance_criteria>
  <done>
    LangProvider is URL-driven on prefixed paths, storage-driven on unprefixed paths (D-07 preserved), and SSR-renders EN strings synchronously on `/en/*` (Pitfall 6 mitigated). `document.documentElement.lang` write is NOT re-introduced.
  </done>
</task>

<task type="auto">
  <name>Task 3: Build + verify SSR EN parity + verify client bundle does not regress on en.json size</name>
  <read_first>
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (row Plan 06 acceptance map)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Assumption A3, line 791 — verify SSR-only en.json doesn't reach client bundle)
  </read_first>
  <action>
    Run `npm run build` and verify the build pipeline completes (exit 0). The SSR build will exercise the `typeof window === "undefined"` branch — if top-level await fails in the SSR bundler, the build errors loudly and the executor falls back to the static-import alternative described in Task 2 (e). After build succeeds, verify:

    - `dist/assets/index-*.js` (the client bundle) does NOT contain a static reference to en.json's content (the dict strings should be in a separate chunk that loads only when EN is selected). Quick check: `grep -c "en.json" dist/assets/index-*.js` (the import marker) and `grep -c "hero\.installBtn" dist/assets/en-*.js` (a key from en.json that should be in the EN chunk). The exact assertion: en.json content does NOT appear in the main bundle by string content. Note: Vite WILL emit an `en-*.js` chunk; this is fine — what matters is the chunk loads lazily (in the EN branch of LangProvider's effect), not eagerly.
    - The new `dist/en/welcome/index.html` body content is in English. Spot-check via grep: read the file (it's already prerendered by Plan 03's loop), find an English string (e.g. the page H1 in en.json — likely under a key like `welcome.title` or `hero.title`), confirm it appears in the body. If the body is in RU, the SSR-eager en.json gate didn't fire — investigate Task 2 (e) and consider the static-import fallback.
    - The `dist/welcome/index.html` body (RU) is unchanged compared to a pre-Plan-06 build (or at least, still contains RU strings — Task 2's changes should not affect the RU SSR path).
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; npm run build 2&gt;&amp;1 | tail -20 &amp;&amp; node -e "const fs=require('fs'); const glob=require('child_process').execSync('node -e \"const p=require(\\'fs\\').readdirSync(\\'dist/assets\\').filter(f=&gt;f.startsWith(\\'index-\\')&amp;&amp;f.endsWith(\\'.js\\'));console.log(p[0])\"').toString().trim(); const main=fs.readFileSync('dist/assets/'+glob,'utf-8'); const enChunkPresent=require('fs').readdirSync('dist/assets').some(f=&gt;f.startsWith('en-')&amp;&amp;f.endsWith('.js')); console.log('Main bundle: dist/assets/'+glob+', size '+main.length); console.log('EN chunk emitted: '+enChunkPresent); const enHtml=fs.readFileSync('dist/en/welcome/index.html','utf-8'); const ruHtml=fs.readFileSync('dist/welcome/index.html','utf-8'); const enRoot=fs.readFileSync('dist/en/index.html','utf-8'); console.log('dist/en/welcome body sample (first 1000 chars of &lt;body&gt;): '+enHtml.substring(enHtml.indexOf('&lt;body'), enHtml.indexOf('&lt;body')+1000).replace(/\s+/g,' ')); console.log('dist/welcome body sample (first 500 chars): '+ruHtml.substring(ruHtml.indexOf('&lt;body'), ruHtml.indexOf('&lt;body')+500).replace(/\s+/g,' '))"</automated>
  </verify>
  <acceptance_criteria>
    - `npm run build` exits 0
    - `dist/en/welcome/index.html` body contains at least ONE English string from en.json (executor reads the body section and spot-checks; e.g., the page H1 or the hero CTA copy should be in English)
    - `dist/welcome/index.html` body is unchanged in terms of RU strings (the RU SSR path is not affected by the SSR-eager gate)
    - Client bundle (`dist/assets/index-*.js`) does NOT statically embed en.json's string content (the EN dict stays a lazy-loaded chunk for the client; the SSR-eager import is server-only). If the bundle size grew by ~13 KB gzip compared to Phase 2.2's baseline, the SSR gate is leaking into the client — investigate.
    - Manual smoke (deferred to Plan 07's checkpoint): `npm run preview` and visit `/en/welcome` directly; confirm the page renders English on first frame (no RU→EN flash). This task does NOT add a checkpoint — Plan 07's checkpoint covers the integrated smoke after `/en/*` routes are mounted.
  </acceptance_criteria>
  <done>
    Build succeeds. EN bodies prerender in English on `/en/*`. RU bodies unchanged on unprefixed paths. Client bundle size has not regressed.
  </done>
</task>

</tasks>

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| browser URL → React state | `useLocation().pathname` is the trust signal; it is browser-controlled but only a subset of routes (the 6 EN entries in the manifest) are reachable. Anything else falls through to the SPA fallback. |
| SSR module load → en.json import | The SSR-eager gate runs at module-load time on the server. The branch is guarded by `typeof window === "undefined"`. No user input enters the decision. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-15 | Tampering | URL-prefix detection | accept | `detectLangFromPath` is a pure prefix check on `location.pathname`. The pathname is browser-controlled but the only effect of a maliciously-crafted path is "show EN strings on a RU route" — no data leak, no privilege change. |
| T-03-16 | DoS | Hydration mismatch from divergent SSR/client lang | mitigate | The whole point of Task 2 (a-c): initial `useState` is derived synchronously from `useLocation()`, which works in both `StaticRouter` (SSR) and `BrowserRouter` (client). SSR and first client paint agree on `lang` for prefixed routes → zero hydration warning. Plan 01 already eliminated the runtime `<html lang>` mutation surface. |
| T-03-17 | Information Disclosure | en.json content in client bundle | accept | en.json is shipped to clients today (Phase 2.2 lazy-loads it via dynamic import). The SSR-eager gate adds a server-only load path; if Vite's tree-shaker fails to drop it from the client, the only impact is a one-time ~13 KB gzip increase — acceptable per RESEARCH.md A3. No new information leakage (the dict is already client-reachable). |

ASVS V14 only (minor — security headers unchanged).
</threat_model>

<verification>

- `npm run build` exits 0.
- `grep -c "document.documentElement.lang" src/i18n/LangContext.tsx` returns 0.
- `detectLangFromPath("/en/welcome")` returns "en" (verified via the body of the helper).
- `dist/en/welcome/index.html` body contains English strings.
- Client bundle size has not regressed by more than 1 KB (sanity check on the SSR-eager gate).

</verification>

<success_criteria>

- [ ] `detectLangFromPath` helper added.
- [ ] `detectLang` renamed to `detectLangFromStorage` with SSR guard.
- [ ] `useLocation` imported and used synchronously in `LangProvider`.
- [ ] `useEffect` keyed on `location.pathname`.
- [ ] No `document.documentElement.lang` writes anywhere in the file.
- [ ] SSR-eager en.json gate (typeof window check) present.
- [ ] Build emits English bodies on `/en/*` and RU bodies on `/`, `/welcome` etc.
- [ ] Client bundle does not eagerly embed en.json content.

</success_criteria>

<output>
After completion, create `.planning/phases/03-bilingual-routing/03-06-SUMMARY.md` capturing:
- The refactor diff stats (helpers added, useEffect rewrite, SSR-eager gate).
- The SSR-gate approach taken (top-level-await or static-import fallback) and rationale.
- Build verification snippet showing `dist/en/welcome/index.html` body contains English.
- Confirmation that client bundle size is within ±1 KB of pre-Plan-06 baseline.
</output>
