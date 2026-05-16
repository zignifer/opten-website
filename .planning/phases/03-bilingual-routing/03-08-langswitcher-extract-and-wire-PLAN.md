---
phase: 03-bilingual-routing
plan: 08
type: execute
wave: 4
depends_on: [02, 04, 06, 07]
files_modified:
  - src/app/components/LangSwitcher.tsx
  - src/app/App.tsx
  - src/app/pages/PayPage.tsx
  - src/app/pages/AccountPage.tsx
  - src/app/components/layout/LegalLayout.tsx
autonomous: false
requirements:
  - GEO-C-1
  - GEO-C-4
must_haves:
  truths:
    - "A new shared component `src/app/components/LangSwitcher.tsx` exports a default React component that reads `useLang()` + `useLocation()` and routes via `useNavigate()` to a build-time allow-list of paths"
    - "All 4 consumer sites (App.tsx Navbar, App.tsx mobile menu, PayPage.tsx, AccountPage.tsx, LegalLayout.tsx) call the shared component — no consumer site still inlines `setLang(lang === \"ru\" ? \"en\" : \"ru\")` as the click handler"
    - "Clicking the switcher on `/welcome` routes to `/en/welcome`; clicking on `/en/welcome` routes to `/welcome` (bidirectional cluster pair navigation)"
    - "Clicking the switcher on `/success`, `/account`, `/dashboard/download-skill` routes to `/en/` (Claude's-Discretion default — \"route to /en/\" per CONTEXT.md OQ-6)"
    - "Switcher NEVER passes user-supplied input (URL query, hash, history-derived strings) to `navigate()` — the target is computed from a literal `EN_SIBLINGS` Set + a pure `getEnTarget`/`getRuTarget` function (Open Redirect mitigation, RESEARCH.md §Security Domain)"
  artifacts:
    - path: "src/app/components/LangSwitcher.tsx"
      provides: "Default-exported React component; pure target computation via allow-list"
      contains: "EN_SIBLINGS"
      exports: ["LangSwitcher (default)"]
    - path: "src/app/App.tsx"
      provides: "Two switcher sites (Navbar + mobile menu) now call <LangSwitcher /> instead of inlining setLang"
      contains: "<LangSwitcher"
    - path: "src/app/pages/PayPage.tsx"
      provides: "Switcher site now calls <LangSwitcher />"
      contains: "<LangSwitcher"
    - path: "src/app/pages/AccountPage.tsx"
      provides: "Switcher site now calls <LangSwitcher /> (routes to /en/ since /account has no EN sibling)"
      contains: "<LangSwitcher"
    - path: "src/app/components/layout/LegalLayout.tsx"
      provides: "Switcher site now calls <LangSwitcher />"
      contains: "<LangSwitcher"
  key_links:
    - from: "src/app/components/LangSwitcher.tsx"
      to: "react-router useNavigate + useLocation"
      via: "synchronous read of location.pathname + computed target → navigate(target)"
      pattern: "useNavigate\\(\\)"
    - from: "src/app/components/LangSwitcher.tsx EN_SIBLINGS set"
      to: "scripts/seo-routes.ts /en/* entries"
      via: "SYNC comment — the allow-list MUST match the 6 paths in the manifest (kept in sync manually, mirrors Phase 2 SYNC policy)"
      pattern: "EN_SIBLINGS"
---

<objective>
Extract the language switcher into a shared `src/app/components/LangSwitcher.tsx` and wire the 4 current consumer sites to use it. The component uses `react-router`'s `useNavigate` to change the URL on click — per CONTEXT.md D-05 and D-07b, the URL is the only legitimate way to change language during a session (the LangProvider then follows via `useLocation` per Plan 06).

This plan closes the loop: Plans 01-07 made the URL the source of truth for language; Plan 08 makes the SWITCHER write to the URL instead of just flipping the React context.

Chosen design (per RESEARCH.md Open Question #1 + CONTEXT.md "Claude's Discretion"): extract the component (Option A) rather than inline `useNavigate` per consumer (Option B). Rationale: the `getEnTarget` / `getRuTarget` pure helpers benefit from a single home — duplicating them across 4 sites invites drift the next time the manifest grows (every new EN entry would need 4 file edits).

Open-Redirect mitigation (RESEARCH.md §Security Domain): the switcher operates on a literal `EN_SIBLINGS` Set + a pure path-rewrite function. No user-controlled strings flow into `navigate()`. If somehow the current `location.pathname` is unrecognized, the fallback is `/en/` (or `/` from the EN side) — both static constants.

Locked-route-without-EN-sibling treatment (per CONTEXT.md OQ-6 default): on `/success`, `/account`, `/dashboard/download-skill`, the switcher routes to `/en/` (RESEARCH.md Pitfall 9 — user-friendly choice). Rejected alternatives: disable button (less surprising but adds copy), keep current content-flip (diverges from D-05 URL-as-source-of-truth).

Output: a single React component file + 4 consumer-site edits that swap inline buttons for `<LangSwitcher ... />`.
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
@src/app/App.tsx
@src/app/pages/PayPage.tsx
@src/app/pages/AccountPage.tsx
@src/app/components/layout/LegalLayout.tsx
@src/i18n/LangContext.tsx
@src/app/components/RouteLoading.tsx
@CLAUDE.md

<interfaces>
<!-- The 4 current consumer sites and their inline patterns. -->
<!-- The executor must Grep each file to find the EXACT line ranges before editing — line numbers may have drifted since the patterns were mapped 2026-05-16. -->

Inline switcher pattern (verbatim, with minor className variations):
  <button
    type="button"
    onClick={() => setLang(lang === "ru" ? "en" : "ru")}
    className="…tailwind classes per site…"
  >
    {lang === "ru" ? "EN" : "RU"}
  </button>

Sites (re-verify exact locations via grep `setLang(lang === "ru" ? "en" : "ru")` before editing):
- `src/app/App.tsx` Navbar — inline switcher (around lines 131-137 per PATTERNS.md, but re-grep to confirm)
- `src/app/App.tsx` mobile menu — inline switcher with `setOpen(false)` side effect (around lines 160-169)
- `src/app/pages/PayPage.tsx` — inline switcher (around line 374 per PATTERNS.md)
- `src/app/pages/AccountPage.tsx` — inline switcher (around line 209 per PATTERNS.md)
- `src/app/components/layout/LegalLayout.tsx` — inline switcher (around lines 22-27 per PATTERNS.md)

After this plan: each of the 5 inline switchers is replaced with `<LangSwitcher className="<original-classes>" onSwitch={?} />` (the `onSwitch` callback is needed only for the mobile-menu site to also call `setOpen(false)` — other sites don't need it).

The new component's API:
```tsx
interface LangSwitcherProps {
  className?: string;
  onSwitch?: () => void;  // optional side effect, e.g. close mobile menu
}
export default function LangSwitcher({ className, onSwitch }: LangSwitcherProps): JSX.Element
```

EN_SIBLINGS set (build-time allow-list inside LangSwitcher.tsx) — MUST match the 6 EN entries in scripts/seo-routes.ts:
  const EN_SIBLINGS = new Set(["/", "/welcome", "/pay", "/privacy", "/terms", "/refund"]);
  const EN_LANDING = "/en/";

getEnTarget(currentPath):
  - if currentPath in EN_SIBLINGS → return `currentPath === "/" ? "/en/" : "/en" + currentPath`
  - else → return EN_LANDING  (Pitfall 9 + OQ-6 default)

getRuTarget(currentPath):
  - if currentPath === "/en/" or "/en" → return "/"
  - if currentPath.startsWith("/en/") → return currentPath.slice(3)   // strips "/en"
  - else → return "/"  (defensive — should never hit, since the switcher only shows "RU" when lang === "en", which implies a /en/* URL)
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create src/app/components/LangSwitcher.tsx</name>
  <read_first>
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Architecture Patterns → Pattern 5, lines 417-468 — verbatim component body)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§7, lines 342-374 — file-by-file mapping, EN_SIBLINGS SYNC note)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-05, D-07b — URL is source of truth, switcher is the only URL-changer; OQ-6 default — route to /en/ on routes without EN sibling)
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (row Plan 08 — switcher acceptance test; Open Redirect threat)
    - src/app/components/RouteLoading.tsx (read for structural analog — small shared component in this directory)
    - src/i18n/LangContext.tsx (verify exports `useLang` is still available after Plan 06 — it is)
  </read_first>
  <action>
    Create a new file `src/app/components/LangSwitcher.tsx`. The file should:

    (a) Import `useLocation`, `useNavigate` from `"react-router"` (NOT `react-router-dom`).
    (b) Import `useLang` from `"../../i18n/LangContext"` (relative path; mirrors how other components in `app/components/` import).
    (c) Define module-level constants (NOT inside the component body — these are stable across renders):
        ```
        // SYNC: must match the 6 EN entries in scripts/seo-routes.ts. Update both when adding/removing EN routes.
        const EN_SIBLINGS = new Set(["/", "/welcome", "/pay", "/privacy", "/terms", "/refund"]);
        const EN_LANDING = "/en/";
        ```
    (d) Define `getEnTarget(currentPath: string): string` and `getRuTarget(currentPath: string): string` pure functions per the interfaces block above.
    (e) Define the component props interface `LangSwitcherProps { className?: string; onSwitch?: () => void; }`.
    (f) Define and default-export the component. Body:
        - Read `const { lang } = useLang();`
        - Read `const location = useLocation();`
        - Read `const navigate = useNavigate();`
        - Compute `const target = lang === "ru" ? getEnTarget(location.pathname) : getRuTarget(location.pathname);`
        - Render a `<button type="button" onClick={() => { navigate(target); onSwitch?.(); }} className={className}>{lang === "ru" ? "EN" : "RU"}</button>`.

    Add a header comment block at the top of the file referencing Phase 3 D-05, the SYNC policy for EN_SIBLINGS, and the Open-Redirect mitigation (allow-list pure-function path; no user-supplied input to navigate()). Mirror the comment style of `RouteLoading.tsx` and `scripts/seo-routes.ts:2`.

    File length target: ≤ 60 lines including the header comment. Keep it small and grep-able.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const fs=require('fs'); if(!fs.existsSync('src/app/components/LangSwitcher.tsx')){console.error('FAIL: file missing');process.exit(1)} const s=fs.readFileSync('src/app/components/LangSwitcher.tsx','utf-8'); const checks=[['useNavigate import',s.match(/import\s*\{[^}]*useNavigate[^}]*\}\s*from\s*\"react-router\"/)],['no react-router-dom',!s.includes('react-router-dom')],['EN_SIBLINGS set',s.includes('EN_SIBLINGS = new Set')],['default export',s.match(/export\s+default\s+function|export\s+default\s+\w+/)],['useLang import',s.includes('useLang')],['no untrusted navigate',!s.match(/navigate\(\s*window\./)&amp;&amp;!s.match(/navigate\(\s*location\.search/)&amp;&amp;!s.match(/navigate\(\s*location\.hash/)]]; let fail=false; for(const [n,r] of checks){if(!r){console.error('FAIL: '+n);fail=true}} if(fail)process.exit(1); console.log('PASS: LangSwitcher.tsx OK')"</automated>
  </verify>
  <acceptance_criteria>
    - File `src/app/components/LangSwitcher.tsx` exists
    - Imports `useNavigate` and `useLocation` from `"react-router"` (NOT `react-router-dom`)
    - Imports `useLang` from the LangContext module
    - Contains `EN_SIBLINGS = new Set(["/", "/welcome", "/pay", "/privacy", "/terms", "/refund"])` literal (exact 6 paths; if executor adds/removes, the gates in Task 2 still pass but the SYNC comment is broken — keep the 6 paths exact)
    - Default-exports the component
    - `navigate()` is called with the computed `target` variable, NEVER with `window.location.*`, `location.search`, `location.hash`, or any other browser-controlled raw string — verified by the negative grep gate above (Open Redirect mitigation)
    - File line count ≤ 60
  </acceptance_criteria>
  <done>
    A single, small, secure, default-exported `LangSwitcher` component file lives at `src/app/components/LangSwitcher.tsx`.
  </done>
</task>

<task type="auto">
  <name>Task 2: Replace inline switcher in src/app/App.tsx (Navbar + mobile menu — 2 sites)</name>
  <read_first>
    - src/app/App.tsx (full file or at least the Navbar function — read it fully; per PATTERNS.md the switcher sits at lines 131-137 in the Navbar render output and lines 160-169 in the mobile-menu render output, but the executor must re-grep to confirm)
    - .planning/phases/03-bilingual-routing/03-PATTERNS.md (§7, lines 342-374 — "Replacement pattern" subsection — verbatim swap shape)
    - src/app/components/LangSwitcher.tsx (just created — verify export shape)
  </read_first>
  <action>
    In `src/app/App.tsx`:

    (a) **Add the import** at the top of the file (group with other component imports): `import LangSwitcher from "./components/LangSwitcher";`. Use the existing relative-import convention used by `import { Link } from "react-router";` and similar lines.

    (b) **Locate the Navbar switcher** — grep `setLang(lang === "ru" ? "en" : "ru")` within the Navbar function. There are TWO occurrences (one in the desktop nav row, one in the mobile menu). Replace the desktop occurrence (the `<button>` block around line 131-137) with:
        `<LangSwitcher className="bg-transparent font-['PT_Root_UI',sans-serif] text-[14px] text-white/45 transition hover:text-white" />`
        (Use the EXACT classNames currently on the button — copy them verbatim from the file. The classes are visual styling; the component renders the right text per lang state internally.)

    (c) **Locate the mobile-menu switcher** — the second occurrence is inside the `{open && (...)}` block around lines 160-169. The current inline button also calls `setOpen(false)` on click. Replace with:
        `<LangSwitcher className="w-fit bg-transparent p-0 text-left text-white/60" onSwitch={() => setOpen(false)} />`
        The `onSwitch` callback preserves the existing UX of closing the mobile menu after the language change.

    (d) **Clean up unused imports** — if `useLang` was imported ONLY to feed the inline switcher (i.e., no other `useLang()` calls in this file), remove the import. Verify by grep: `grep "useLang" src/app/App.tsx` after the swap — if the count is 0, drop the import from the LangContext destructuring (keep `useT` since it's used elsewhere). If `useLang` is still referenced (e.g. by the `Hero` function at line 178 which calls `useLang()`), keep the import.

    Do NOT touch ANY other line in App.tsx. Particularly: the Hero, Features, Pricing, FAQ, Footer functions — none of those have switchers and are not being refactored here. The plan's scope is the 2 switcher sites in Navbar only.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const s=require('fs').readFileSync('src/app/App.tsx','utf-8'); const lsImport=s.match(/import\s+LangSwitcher\s+from\s+\"\.\/components\/LangSwitcher\"/); const lsUses=(s.match(/&lt;LangSwitcher/g)||[]).length; const inlineSwitchers=(s.match(/setLang\(\s*lang\s*===\s*\"ru\"\s*\?\s*\"en\"\s*:\s*\"ru\"\s*\)/g)||[]).length; if(!lsImport){console.error('FAIL: LangSwitcher import missing');process.exit(1)} if(lsUses!==2){console.error('FAIL: expected 2 &lt;LangSwitcher uses in App.tsx (Navbar + mobile), got '+lsUses);process.exit(1)} if(inlineSwitchers!==0){console.error('FAIL: '+inlineSwitchers+' inline setLang switcher(s) remain in App.tsx');process.exit(1)} console.log('PASS: App.tsx — 2 LangSwitcher uses, 0 inline switchers')"</automated>
  </verify>
  <acceptance_criteria>
    - `grep -c "LangSwitcher" src/app/App.tsx` returns at least `3` (1 import + 2 usages)
    - `grep -c '<LangSwitcher' src/app/App.tsx` returns exactly `2`
    - `grep -c 'setLang(lang === "ru" ? "en" : "ru")' src/app/App.tsx` returns `0` (both inline switchers replaced)
    - The desktop Navbar `<LangSwitcher>` retains its original tailwind classes via `className` prop
    - The mobile-menu `<LangSwitcher>` passes `onSwitch={() => setOpen(false)}` (preserves menu-close UX)
  </acceptance_criteria>
  <done>
    Both App.tsx switcher sites use the shared component; original styling preserved; mobile menu UX preserved.
  </done>
</task>

<task type="auto">
  <name>Task 3: Replace inline switcher in PayPage.tsx, AccountPage.tsx, LegalLayout.tsx (3 sites)</name>
  <read_first>
    - src/app/pages/PayPage.tsx (grep `setLang(lang === "ru" ? "en" : "ru")` to find the exact line; per PATTERNS.md around line 374)
    - src/app/pages/AccountPage.tsx (same grep; per PATTERNS.md around line 209)
    - src/app/components/layout/LegalLayout.tsx (full file — small file, ~30 lines)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (OQ-6 — on /account, switcher routes to /en/ since /account has no /en/ sibling; this is handled by the getEnTarget fallback already, NO consumer-side logic needed)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Pitfall 9, lines 609-619 — locked-route-without-EN behavior)
  </read_first>
  <action>
    For each of the 3 files, perform the same surgical swap as Task 2:

    (a) Add the import `import LangSwitcher from "../components/LangSwitcher";` (PayPage.tsx, AccountPage.tsx — both in `src/app/pages/`) OR `import LangSwitcher from "../LangSwitcher";` (LegalLayout.tsx — in `src/app/components/layout/`). Use the correct relative path for each file's location.

    (b) Locate the inline switcher button via `grep -n 'setLang(lang === "ru" ? "en" : "ru")' <file>` and find the enclosing `<button>...</button>` block. Replace with `<LangSwitcher className="<original-classes>" />`. NO `onSwitch` callback needed in these 3 sites (none of them have a mobile-menu-style side effect).

    (c) Clean up `useLang` imports if no longer used in the file (same rule as Task 2 — grep `useLang` after the swap; if 0 hits, drop the import).

    Special case for AccountPage.tsx: the switcher on this route routes to `/en/`, NOT `/en/account` (since `/en/account` does not exist per D-03). This is handled AUTOMATICALLY by LangSwitcher's `getEnTarget` function (it checks `EN_SIBLINGS.has("/account")` → false → returns `EN_LANDING = "/en/"`). No special handling needed at the consumer site — the consumer just calls `<LangSwitcher />` and the component picks the right target. This is the entire reason for extracting the component (DRY — the 4 consumer sites don't each have to repeat the allow-list logic).

    Do NOT touch any other line in any of the 3 files.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; node -e "const fs=require('fs');const files=['src/app/pages/PayPage.tsx','src/app/pages/AccountPage.tsx','src/app/components/layout/LegalLayout.tsx'];let fail=false;for(const f of files){const s=fs.readFileSync(f,'utf-8');const imp=s.includes('import LangSwitcher');const uses=(s.match(/&lt;LangSwitcher/g)||[]).length;const inline=(s.match(/setLang\(\s*lang\s*===\s*\"ru\"\s*\?\s*\"en\"\s*:\s*\"ru\"\s*\)/g)||[]).length;if(!imp){console.error(f+': missing import');fail=true}if(uses!==1){console.error(f+': expected 1 &lt;LangSwitcher use, got '+uses);fail=true}if(inline!==0){console.error(f+': '+inline+' inline switcher(s) remain');fail=true}}if(fail)process.exit(1);console.log('PASS: 3 consumer sites swapped')"</automated>
  </verify>
  <acceptance_criteria>
    - Each of `src/app/pages/PayPage.tsx`, `src/app/pages/AccountPage.tsx`, `src/app/components/layout/LegalLayout.tsx` imports `LangSwitcher` (1 import per file)
    - Each of the 3 files renders exactly one `<LangSwitcher` (per-file count = 1)
    - Each of the 3 files has 0 inline `setLang(lang === "ru" ? "en" : "ru")` blocks remaining
    - Final tally: `grep -rc 'setLang(lang === "ru" ? "en" : "ru")' src/` returns 0 across the whole repo (the 5 inline switchers — 2 in App.tsx + 3 here — are all gone)
  </acceptance_criteria>
  <done>
    All 4 consumer files (App.tsx counts as 1 file with 2 sites + 3 other files) use the shared LangSwitcher. Zero inline switchers remain in the repo.
  </done>
</task>

<task type="auto">
  <name>Task 4: Build + grep gates + verify no react-router-dom drift</name>
  <read_first>
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (row Plan 08 — `grep -c '/en/' src/main.tsx` already enforced by Plan 07; this plan's gate is the switcher grep)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (§Security Domain "Open Redirect via language switcher" — verify by inspection)
  </read_first>
  <action>
    Run `npm run build` from the repo root. Verify:

    - Build exits 0 (TS catches any prop-type mismatch in the new component or its consumers).
    - `grep -r "react-router-dom" src/ scripts/` returns 0 matches (the new component and all edits keep the React Router 7 unified import surface — RESEARCH.md anti-pattern line 477).
    - `grep -r "setLang(lang === \"ru\" ? \"en\" : \"ru\")" src/` returns 0 matches (every inline switcher replaced).
    - `grep -rc '<LangSwitcher' src/` returns at least `5` (2 in App.tsx + 1 each in PayPage, AccountPage, LegalLayout).
    - `grep -c 'navigate(' src/app/components/LangSwitcher.tsx` returns at least 1, AND the navigate call uses the locally-computed `target` variable (NOT `window.location.search`, etc. — defense-in-depth re-check).
    - After build, optionally peek at `dist/assets/index-*.js` and confirm the bundled output does NOT contain literal `setLang(lang ===` patterns (sanity check: dead code is gone). This is informational only; the build's exit code is the gate.
  </action>
  <verify>
    <automated>cd C:/Projects/opten-website &amp;&amp; npm run build 2&gt;&amp;1 | tail -20 &amp;&amp; node -e "const {execSync}=require('child_process'); function grepCount(re, dir){try{const out=execSync('node -e \"const fs=require(\\'fs\\');const path=require(\\'path\\');let c=0;function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\\.(tsx?|mjs|jsx?)$/.test(e.name)){const s=fs.readFileSync(p,\\'utf-8\\');const m=s.match('+JSON.stringify(re.source)+');if(m)c+=m.length}}}walk('+JSON.stringify(dir)+');console.log(c)\"').toString().trim();return parseInt(out)}catch(e){return -1}} const rrd=grepCount(/react-router-dom/g,'src');const rrd2=grepCount(/react-router-dom/g,'scripts');const inline=grepCount(/setLang\(\s*lang\s*===\s*\"ru\"\s*\?\s*\"en\"\s*:\s*\"ru\"\s*\)/g,'src');const lsUses=grepCount(/&lt;LangSwitcher/g,'src');console.log('react-router-dom in src: '+rrd+', in scripts: '+rrd2);console.log('inline switchers in src: '+inline);console.log('&lt;LangSwitcher uses in src: '+lsUses);if(rrd!==0||rrd2!==0){console.error('FAIL: react-router-dom drift');process.exit(1)}if(inline!==0){console.error('FAIL: inline switchers remain');process.exit(1)}if(lsUses&lt;5){console.error('FAIL: expected at least 5 LangSwitcher uses, got '+lsUses);process.exit(1)}console.log('PASS: all gates green')"</automated>
  </verify>
  <acceptance_criteria>
    - `npm run build` exits 0
    - 0 `react-router-dom` imports anywhere under `src/` or `scripts/`
    - 0 inline `setLang(lang === "ru" ? "en" : "ru")` patterns remain
    - At least 5 `<LangSwitcher` usages across the codebase
    - Switcher uses computed `target` for `navigate()`, never user-controlled raw strings (Open Redirect mitigation — verified by Task 1 gate + manual re-inspection here)
  </acceptance_criteria>
  <done>
    Build green; switcher invariants enforced via grep; no untrusted-input passes through navigate().
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 5: Phase-end manual smoke — switcher behavior across all consumer sites + locked routes still respond</name>
  <read_first>
    - .planning/phases/03-bilingual-routing/03-VALIDATION.md (§Manual-Only Verifications — full table; this is the phase-gate smoke)
    - .planning/phases/03-bilingual-routing/03-RESEARCH.md (Pitfall 9 — locked-route-without-EN-sibling behavior)
    - .planning/phases/03-bilingual-routing/03-CONTEXT.md (D-05, D-07, D-07b — URL-as-source-of-truth contract)
  </read_first>
  <what-built>
    All 8 Phase 3 plans are now landed:
    - Plan 01: hydration-mismatch fix.
    - Plan 02: 13-entry manifest.
    - Plan 03: per-file <html lang> + hreflang + og:locale.
    - Plan 04: /en/pay Paddle widen + INTEGRATION-CONTRACT + robots.txt.
    - Plan 05: bilingual sitemap.
    - Plan 06: URL-driven LangProvider + SSR-eager en.json.
    - Plan 07: /en/* routes mounted in both routers.
    - Plan 08 (this plan): shared LangSwitcher + 4 consumer sites wired.

    This checkpoint is the phase-end smoke before /gsd-verify-work. It tests the integrated user-facing behavior.
  </what-built>
  <how-to-verify>
    1. `npm run build && npm run preview` — preview on `http://localhost:4173/`.
    2. **Navbar switcher on `/`:** open `http://localhost:4173/` in Incognito. Click "EN" in the navbar. URL becomes `http://localhost:4173/en/`. Content flips to English. `<html lang>` is `en` (DevTools Elements). Click "RU" → URL becomes `/`, content RU, lang `ru`.
    3. **Navbar switcher on `/welcome`:** open `/welcome`. Click "EN" → URL `/en/welcome`. Content English. Click "RU" → URL `/welcome`. Content RU.
    4. **Navbar switcher on `/pay`:** open `/pay`. Click "EN" → URL `/en/pay`. Content English. Click upgrade CTA → Paddle modal opens without console errors. (Validates Plan 04 Paddle widen + Plan 08 switcher together.)
    5. **Switcher on AccountPage (`/account`):** open `/account`. Click "EN". URL becomes `/en/` (NOT `/en/account` — there is no `/en/account` by design; the switcher routes to landing per Pitfall 9). Page renders EN landing. This is the OQ-6 "route to /en/" default behavior.
    6. **Mobile menu switcher:** narrow the browser to mobile width (≤ 768 px). Hamburger menu appears. Open it on `/welcome`. Click "EN" inside the mobile menu. URL changes to `/en/welcome`, content flips, AND the mobile menu closes (the `onSwitch={() => setOpen(false)}` callback fires).
    7. **Legal page switcher (LegalLayout — used by /privacy /terms /refund):** open `/privacy`. Click switcher. URL → `/en/privacy`. Content EN.
    8. **Locked-route preservation:** `curl -sI http://localhost:4173/welcome` returns 200. Same for `/pay`, `/success`, `/account`, `/dashboard/download-skill`. None of them rename or redirect.
    9. **Direct-hit hydration warnings sweep:** in DevTools Console (cleared), navigate directly to `/en/welcome`, `/en/`, `/en/pay`, `/en/privacy`, `/en/terms`, `/en/refund` (one at a time, hard-refresh each). For each: zero hydration warnings, zero "did not match" errors, English content from first paint. If any warning surfaces, capture and surface — this regressed something across Plans 01-07.
    10. **Sitemap and robots:** `curl http://localhost:4173/sitemap.xml | head -50` shows the bilingual entries with xhtml:link annotations. `curl http://localhost:4173/robots.txt` shows the `/en/*` Disallows.

    If all 10 steps pass, type "approved". The phase is shippable to /gsd-verify-work + production.
    If any step fails, capture the specific failure with DevTools output / network responses / screenshots, and surface to the user. Do NOT consider the phase complete.
  </how-to-verify>
  <resume-signal>Type "approved" to mark Phase 3 complete and ready for /gsd-verify-work. Otherwise describe the specific failure and the suspect plan.</resume-signal>
</task>

</tasks>

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| user click → `navigate(target)` | The target string is computed inside `LangSwitcher.tsx` by `getEnTarget` / `getRuTarget` pure functions operating on `location.pathname`. The pathname is browser-controlled but the rewrite functions normalize it against a literal allow-list. Any unrecognized current path falls through to the static constant `EN_LANDING = "/en/"` or `"/"`. No browser-controlled string is concatenated raw into the navigate argument. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-22 | Tampering | Open Redirect via switcher | mitigate | `LangSwitcher` operates on a literal `EN_SIBLINGS` allow-list and pure path-rewrite functions. No `window.location.search`, `window.location.hash`, query-param parsing, or postMessage-driven URLs flow into `navigate()`. Verified by the negative-grep gate in Task 1 acceptance and Task 4 sweep. RESEARCH.md §Security Domain "Open Redirect via language switcher" disposition: mitigated by code shape. |
| T-03-23 | Information Disclosure | Switcher exposing internal routes | accept | The switcher only navigates to paths in the manifest (`/en/*`) or to literal constants (`/`, `/en/`). It cannot be tricked into routing to `/en/account` or other unimplemented paths — `getEnTarget` only returns `/en/<path>` when `<path>` is in the allow-list. |
| T-03-24 | DoS | Switcher → render loop | mitigate | Plan 06's LangProvider effect is keyed on `location.pathname`. When the switcher calls `navigate(target)`, `location.pathname` changes → effect re-runs → detects new lang → updates state. The effect's body short-circuits if `next === current lang state` is already in sync (the `setLangState` no-op in React 18 doesn't re-render). No loop. |

ASVS V14 only (minor — `vercel.json` security headers cover all switcher-reachable paths).
</threat_model>

<verification>

- `npm run build` exits 0.
- New component file exists; 5 consumer sites use it; 0 inline switchers remain.
- No `react-router-dom` drift.
- `navigate()` uses computed `target` — no untrusted-input pass-through.
- Manual phase-end smoke (Task 5) passes all 10 steps including switcher behavior on locked-routes-without-EN, mobile-menu UX, and `/en/pay` Paddle modal.

</verification>

<success_criteria>

- [ ] `src/app/components/LangSwitcher.tsx` exists, default-exports the component, imports from `"react-router"`.
- [ ] `EN_SIBLINGS` allow-list matches the 6 EN entries in the manifest.
- [ ] 4 consumer sites (App.tsx counts as 1 file with 2 usages, PayPage, AccountPage, LegalLayout) all use `<LangSwitcher>`.
- [ ] 0 inline `setLang(lang === "ru" ? "en" : "ru")` patterns remain.
- [ ] 0 `react-router-dom` imports anywhere in the codebase.
- [ ] Phase-end manual smoke passes all 10 steps.

</success_criteria>

<output>
After completion, create `.planning/phases/03-bilingual-routing/03-08-SUMMARY.md` capturing:
- Diff stats: 1 new file (~50 lines), 4 file edits (~5 net lines each — replace inline button with 1-line component use).
- DevTools transcript from Task 5 (or "0 warnings, all 10 steps green").
- Note: phase is ready for `/gsd-verify-work` and Vercel preview deploy.
</output>
