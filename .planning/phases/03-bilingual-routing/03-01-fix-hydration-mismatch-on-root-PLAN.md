---
phase: 03-bilingual-routing
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/i18n/LangContext.tsx
autonomous: false
requirements: []
must_haves:
  truths:
    - "Zero React hydration warnings on initial `/` render in `npm run preview` with no language stored"
    - "Zero React hydration warnings on initial `/` render in `npm run preview` with `navigator.language=en` simulated via DevTools Sensors"
    - "`<html lang=\"ru\">` attribute on `/` is byte-stable across SSR HTML and the first client commit (no attribute-change warning)"
  artifacts:
    - path: "src/i18n/LangContext.tsx"
      provides: "`LangProvider` with the runtime `document.documentElement.lang =` write removed"
      contains: "No occurrence of `document.documentElement.lang`"
  key_links:
    - from: "src/i18n/LangContext.tsx"
      to: "<html lang> attribute"
      via: "DELETED — runtime write removed; attribute now baked at prerender time (Plan 03)"
      pattern: "document\\.documentElement\\.lang"
---

<objective>
Plan 01 (Wave 1) is the carry-over hygiene fix from Phase 02.2 that the rest of Phase 3 stands on. STATE.md "Pre-Phase-3 known mismatch" documented a residual React hydration warning on `/` that survives Plan 02.2; RESEARCH.md Pitfall 1 + Pattern 3 diagnose the root cause as the `useEffect(() => { document.documentElement.lang = lang; }, [lang])` block at `src/i18n/LangContext.tsx:84-86`.

Per CONTEXT.md D-06 this plan ships **first and isolated**, before any plan that emits per-route `<html lang>`. Reason: dynamic `<html lang>` baking (Plan 03) plus an unchanged runtime `document.documentElement.lang =` write would compound the warning surface and make the diagnosis harder.

Purpose: remove the only known runtime DOM attribute mutator on `<html>`. The replacement (build-time `<html lang>` per emitted file) lands in Plan 03 — this plan deliberately ships a one-line removal first so the diagnosis can be confirmed in isolation.

Output: a minimal, surgical commit deleting `LangContext.tsx:84-86` and the preview-time verification that the residual hydration mismatch is gone on both RU-default and EN-simulated detection paths.

Escalation rule (CONTEXT.md D-06): if after the deletion the React hydration warning on `/` persists in `npm run preview` + DevTools Console, the root cause is elsewhere (suspected: a `motion` mount animation or an `OptenHeroAnimation` Suspense interaction). In that case STOP — do not proceed to Plan 02; instead surface the unresolved diagnosis to the user and propose splitting into a separate mini-phase 2.3 before resuming Phase 3.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/03-bilingual-routing/03-CONTEXT.md
@.planning/phases/03-bilingual-routing/03-RESEARCH.md
@.planning/phases/03-bilingual-routing/03-PATTERNS.md
@.planning/phases/03-bilingual-routing/03-VALIDATION.md
@src/i18n/LangContext.tsx
@src/main.tsx
@index.html
@CLAUDE.md

<interfaces>
<!-- Surface area of src/i18n/LangContext.tsx that downstream plans (especially Plan 06) build on. -->
<!-- Reproduced here so the executor does not have to re-derive exports. -->

From src/i18n/LangContext.tsx (verbatim signatures):
- export type Lang = "ru" | "en";
- export const LangContext = createContext<LangContextValue>({...});
- export function LangProvider({ children }: { children: React.ReactNode }) — wraps the React tree, owns `lang` state
- export function useT(): (key: string) => string
- export function useLang(): { lang: Lang; setLang: (l: Lang) => void }

The DELETED block (lines 84-86 in the current file) is INSIDE LangProvider and reads:
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

Plan 01 ONLY deletes this block. Plan 06 (Wave 2) will further extend LangProvider with `useLocation`-driven URL-prefix detection and SSR-safe initial state. Do NOT pre-empt Plan 06's changes here — leave the rest of the file (lines 1-83 and 87-end) byte-stable.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Delete the runtime <html lang> mutator in LangContext</name>
  <read_first>
    - src/i18n/LangContext.tsx (full file — confirm lines 84-86 still contain `useEffect(() => { document.documentElement.lang = lang; }, [lang]);` exactly as researched 2026-05-16)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Common Pitfalls → Pitfall 1, lines 517-536 — full diagnosis chain)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Architecture Patterns → Pattern 3, lines 330-357 — "DELETE — this is the hydration-mismatch root cause" rationale)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§Plan 01 section, lines 440-450)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-06 + D-07 — keep current root-path content-flip behavior; only the attribute write goes away)
    - index.html (line 2 — `<html lang="ru">` template stays exactly as-is; Plan 03 will bake per-output-file `lang` later, this plan does NOT touch the template)
  </read_first>
  <action>
    In `src/i18n/LangContext.tsx`, delete the three-line block that currently reads (per LangContext.tsx:84-86):
      useEffect(() => {
        document.documentElement.lang = lang;
      }, [lang]);
    Also remove the trailing blank line between the deleted block and the `t = (key: string) =>` declaration so the diff stays minimal. Leave the `useEffect` on lines 57-68 (`detectLang()` post-mount detection) untouched — that block is responsible for the D-07 content-flip behavior on root paths and stays. Leave imports unchanged — `useEffect` is still imported and used by the surviving detection effect. No new imports. No replacement code in this plan (the build-time `<html lang>` bake is Plan 03's responsibility). This is a pure deletion in the spirit of "remove the broken runtime write before introducing the build-time replacement" (PATTERNS.md "Plan 01 — Hydration mismatch fix").
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('src/i18n/LangContext.tsx','utf-8'); const hits=(s.match(/document\.documentElement\.lang/g)||[]).length; if(hits!==0){console.error('FAIL: documentElement.lang still appears '+hits+' time(s)');process.exit(1)} console.log('PASS: 0 occurrences')" &amp;&amp; npm run build</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "document.documentElement.lang" src/i18n/LangContext.tsx` returns `0` (mirrors VALIDATION.md row Plan 06 acceptance — the grep is the same; Plan 01 is the deletion, Plan 06 will further refactor the surviving code)
    - `npm run build` exits 0 with no TS errors (the build pipeline runs SSR + prerender; if the deletion breaks SSR somehow, the build fails loudly)
    - Diff in `src/i18n/LangContext.tsx` is ≤ 5 lines removed, 0 lines added (pure deletion)
    - `useEffect` is still imported at the top of the file (the post-mount `detectLang()` effect lines 57-68 still uses it — confirms the import line was not over-eagerly trimmed)
  </acceptance_criteria>
  <done>
    `src/i18n/LangContext.tsx` no longer contains the `document.documentElement.lang = lang` write. Build succeeds. File diff is a clean 3-5-line deletion.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Manual hydration-warning sweep in npm run preview</name>
  <read_first>
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (§Manual-Only Verifications first row — full test instructions)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Pitfall 1, "Warning signs" subsection — list of regex patterns to grep the console for)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-06 escalation rule — what to do if the warning persists)
  </read_first>
  <what-built>
    Task 1 deleted `LangContext.tsx:84-86` (the `document.documentElement.lang = lang` write). This task confirms that the residual hydration warning on `/` (the carry-over from Plan 02.2 documented in STATE.md "Pre-Phase-3 known mismatch") is now gone in both the default RU detection path AND the EN-simulated detection path.
  </what-built>
  <how-to-verify>
    1. From the repo root run `npm run build && npm run preview` — preview server listens on `http://localhost:4173/`.
    2. Open Chrome (or Edge/Chromium) → `http://localhost:4173/` with DevTools Console open BEFORE navigating (so any first-paint warning is captured).
    3. **Expected on the RU path:** zero console entries matching any of `Hydration failed`, `did not match`, `Text content did not match`, or `Prop \`lang\` did not match`. The page renders with `<html lang="ru">` (template default) and the existing post-mount RU/EN content-flip behavior is preserved per D-07.
    4. Open DevTools → ⋮ → More tools → Sensors → set Locale `en-US` (simulates `navigator.language=en`). Hard-refresh the page (Ctrl+Shift+R) with Console open. Expected: still zero console warnings matching the patterns above. The page may content-flip from RU to EN (this is the accepted D-07 status-quo content flicker — NOT what we're checking for). What we're checking is the React warning console, NOT the visual flicker.
    5. Repeat step 3 with `localStorage.opten_lang` set to `"en"` (run `localStorage.setItem('opten_lang','en')` in Console, then hard-refresh). Same expectation: zero hydration warnings.
    6. **If warnings still appear:** do NOT proceed to Plan 02. Per CONTEXT.md D-06 escalation rule, capture the full warning text + the network/DevTools timeline, surface to the user, and propose splitting the unresolved diagnosis into a mini-phase 2.3. The remaining Phase 3 plans depend on a clean baseline.
    7. **If warnings are gone in all three scenarios:** type `approved` and the executor proceeds to Plan 02.
  </how-to-verify>
  <resume-signal>Type "approved" to mark Plan 01 green and unblock Wave 2 (Plan 02 + Plan 06). Otherwise describe the persisting warning and trigger the D-06 escalation.</resume-signal>
</task>

</tasks>

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| (none in this plan) | Plan 01 is a 3-line deletion in a React context provider. No trust boundary crossed, no input parsed, no external surface added. The fix is purely local to client-side React behavior. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-01 | Tampering | `<html lang>` attribute mutation | accept | The mutation source is being REMOVED in this plan; remaining `<html lang>` value is template-baked. No runtime mutator means no tampering surface. |
| T-03-02 | Denial of Service | React hydration recovery cost | mitigate | Removing the attribute-mismatch source eliminates the ~50-200ms hydration recovery re-render documented in RESEARCH.md Pitfall 1, marginally reducing TBT on `/`. |

ASVS V14 only (minor — `vercel.json` `Permissions-Policy` / `X-Content-Type-Options` auto-apply unchanged on `/`; this plan does not touch headers).
</threat_model>

<verification>

- Build acceptance: `npm run build` exits 0.
- Grep acceptance: `grep -c "document.documentElement.lang" src/i18n/LangContext.tsx` returns `0`.
- Manual acceptance (Task 2): zero React hydration warnings in DevTools Console on `/` under three detection scenarios (no `opten_lang`, `opten_lang=en`, `navigator.language=en` via Sensors).

</verification>

<success_criteria>

- [ ] `src/i18n/LangContext.tsx` no longer contains `document.documentElement.lang` (grep returns 0).
- [ ] `npm run build` exits 0.
- [ ] Manual `npm run preview` smoke on `/` shows zero hydration warnings on all three detection scenarios.
- [ ] Escalation rule honored: if warnings persist, Plan 02 is NOT started; instead D-06 escalation flow is followed.

</success_criteria>

<output>
After completion, create `.planning/phases/03-bilingual-routing/03-01-SUMMARY.md` capturing:
- The diff (line-count + the 3-line block that was removed).
- The DevTools Console transcript or screenshot from Task 2 (or a textual note "0 warnings observed under all three scenarios").
- If escalation triggered, link the mini-phase-2.3 follow-up plan.
</output>
