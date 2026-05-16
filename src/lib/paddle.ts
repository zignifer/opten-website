// Phase 2.2: Conditional Paddle loader.
// Paddle was previously sync-loaded in index.html on every route (~500-1500ms render-blocking
// on mobile 3G). It is only needed on /pay. Now /pay/index.html still gets the sync <script>
// tag (Integration Contract §6 preserved on the route that actually needs it), and other
// routes load Paddle on demand via this helper.
//
// Contract: ensurePaddle() resolves once window.Paddle exists AND Paddle.Initialize() has been
// called. Calling it multiple times is idempotent — the script tag is injected once, the init
// runs once, the promise is memoized.

let paddleReady: Promise<void> | null = null;

const PADDLE_CDN = "https://cdn.paddle.com/paddle/v2/paddle.js";

function initPaddleIfPossible(): void {
  if (!window.Paddle) return;
  const env = import.meta.env.VITE_PADDLE_ENV as "sandbox" | "production" | undefined;
  const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined;
  if (!token) {
    console.warn("[Opten] VITE_PADDLE_CLIENT_TOKEN is not set — USD payment path unavailable");
    return;
  }
  // BG-67-01: Paddle v2 SDK Environment.set('production') throws — only call for sandbox.
  if (env === "sandbox") {
    window.Paddle.Environment.set("sandbox");
  }
  window.Paddle.Initialize({ token });
}

export function ensurePaddle(): Promise<void> {
  if (paddleReady) return paddleReady;
  paddleReady = new Promise<void>((resolve, reject) => {
    // Already loaded (e.g. direct hit on /pay where prerender injected the sync script)
    if (window.Paddle) {
      initPaddleIfPossible();
      resolve();
      return;
    }
    // SPA-navigation case: inject script tag, wait for load
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PADDLE_CDN}"]`);
    if (existing) {
      existing.addEventListener("load", () => {
        initPaddleIfPossible();
        resolve();
      });
      existing.addEventListener("error", () => reject(new Error("Paddle SDK failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = PADDLE_CDN;
    script.async = true;
    script.onload = () => {
      initPaddleIfPossible();
      resolve();
    };
    script.onerror = () => {
      paddleReady = null; // allow retry on next call
      reject(new Error("Paddle SDK failed to load"));
    };
    document.head.appendChild(script);
  });
  return paddleReady;
}
