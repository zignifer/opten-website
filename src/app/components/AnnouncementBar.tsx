// Global maintenance ticker. Fixed full-bleed strip at the very top of every page
// (above any header). Pure render — no client-only state — so the SSR-prerendered
// markup matches the hydrated tree (mounted identically in main.tsx + entry-server.tsx).
// The seamless loop is a CSS marquee: two identical groups in one track animated by
// -50% (see .announce-* rules in theme.css). A flow spacer (height = ANNOUNCEMENT_HEIGHT)
// pushes page content below the fixed strip; it renders only when the switch is on, so
// hiding the bar leaves no empty gap. The on/off switch lives in announcementConfig.ts.

import { useT } from "../../i18n/LangContext";
import { ANNOUNCEMENT_ENABLED, ANNOUNCEMENT_HEIGHT } from "../announcementConfig";

// Repeated enough times that one group always exceeds the viewport width — otherwise a
// blank gap would appear mid-loop on wide screens.
const REPEAT = 6;

function Group({ text }: { text: string }): JSX.Element {
  return (
    <div className="announce-group">
      {Array.from({ length: REPEAT }).map((_, i) => (
        <span key={i} className="announce-item">
          {text}
          <span className="announce-dot">•</span>
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBar(): JSX.Element | null {
  const t = useT();
  if (!ANNOUNCEMENT_ENABLED) return null;
  const text = t("announcement.maintenance");
  return (
    <>
      {/* Flow spacer so page content clears the fixed bar. Tied to the switch — when the
          bar is off this isn't rendered, so no empty gap is left at the top. */}
      <div aria-hidden="true" style={{ height: ANNOUNCEMENT_HEIGHT }} />
      <div className="announce-bar">
        {/* Read once by screen readers; the animated track below is purely visual. */}
        <span className="sr-only">{text}</span>
        <div className="announce-track" aria-hidden="true">
          <Group text={text} />
          <Group text={text} />
        </div>
      </div>
    </>
  );
}
