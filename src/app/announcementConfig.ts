// ── Maintenance ticker switch ──────────────────────────────────────────────
// THE SWITCH. Flip this to show/hide the green running "maintenance" strip across
// the whole site (AnnouncementBar.tsx).
//
//   true  → strip visible (use while the extension is under maintenance)
//   false → no strip, no gap, headers sit at the very top
//
// Build-time flag: changing it needs a redeploy (commit + push to main) to affect
// the LIVE site. Locally `npm run dev` hot-reloads it instantly.
export const ANNOUNCEMENT_ENABLED = true;

// Strip height in px. Kept in sync with `.announce-bar { height }` in
// src/styles/theme.css and the `top-[40px]` header offsets in SiteHeader / PayPage.
export const ANNOUNCEMENT_HEIGHT = 40;
