// Phase 2.1 D-02: Full-viewport dark spinner — Suspense fallback for lazy-loaded routes.
// Net-new file. Not yet imported anywhere; plan 02.1-07 wires it into main.tsx.
export function RouteLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#011417]"
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
    </div>
  );
}
