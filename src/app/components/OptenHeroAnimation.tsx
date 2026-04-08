import { useState, useEffect, useRef, useCallback } from "react";

const OLD_TEXT = "красивый пейзаж, горы";
const NEW_TEXT =
  "Величественный горный пейзаж на закате, тёплые золотистые лучи пробиваются сквозь облака, стиль landscape photography, Fujifilm, wide angle, cinematic lighting, 8K, --ar 16:9";

const ASSET = "/assets/opten-anim";

function charDelay(i: number): number {
  return 40 + ((i * 37 + 13) % 41);
}

type Phase =
  | "typing"
  | "idle"
  | "red-in"
  | "enhance-press"
  | "red-out"
  | "swap"
  | "green-in"
  | "hold"
  | "fade-out";

export default function OptenHeroAnimation() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [oldChars, setOldChars] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [enhancePressed, setEnhancePressed] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const delay = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timeoutsRef.current.push(id);
      }),
    []
  );

  useEffect(() => {
    if (phase !== "typing") return;
    const id = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      while (!cancelled) {
        setPhase("typing");
        setOldChars(0);
        setEnhancePressed(false);
        for (let i = 0; i <= OLD_TEXT.length; i++) {
          if (cancelled) return;
          setOldChars(i);
          await delay(charDelay(i));
        }
        setPhase("idle");
        await delay(500);
        setPhase("red-in");
        await delay(1500);
        setPhase("enhance-press");
        setEnhancePressed(true);
        await delay(300);
        setPhase("red-out");
        await delay(500);
        setPhase("swap");
        await delay(200);
        setPhase("green-in");
        await delay(4000);
        setPhase("fade-out");
        await delay(800);
      }
    }
    run();
    return () => { cancelled = true; clear(); };
  }, [delay, clear]);

  const isRedPhase = ["red-in", "enhance-press", "red-out"].includes(phase);
  const isGreenPhase = ["swap", "green-in", "hold"].includes(phase);
  const showOldText = ["typing", "idle", "red-in", "enhance-press", "red-out"].includes(phase);
  const showNewText = ["swap", "green-in", "hold", "fade-out"].includes(phase);

  const planetSrc =
    phase === "typing" || phase === "idle"
      ? `${ASSET}/planet-default.svg`
      : isRedPhase || phase === "red-out"
        ? `${ASSET}/planet-red.svg`
        : `${ASSET}/planet-green.svg`;

  // Always render both tooltips, control visibility via CSS class (so transitions work)
  const redTooltipClass = (() => {
    if (phase === "red-in") return "opten-tt-in";
    if (phase === "enhance-press") return "opten-tt-in";
    if (phase === "red-out") return "opten-tt-out";
    return "opten-tt-hide";
  })();

  const greenTooltipClass = (() => {
    if (phase === "green-in" || phase === "hold") return "opten-tt-in";
    if (phase === "fade-out") return "opten-tt-out";
    return "opten-tt-hide";
  })();

  return (
    <>
      <style>{`
        .opten-anim { transition: opacity 0.7s ease; }
        .opten-tt-hide { opacity: 0; transform: translateY(6px); pointer-events: none; transition: opacity 0.25s ease, transform 0.3s ease; }
        .opten-tt-in { opacity: 1; transform: translateY(0); transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
        .opten-tt-vis { opacity: 1; transform: translateY(0); }
        .opten-tt-out { opacity: 0; transform: translateY(6px); transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.7, 0, 0.84, 0); }
        .enhance-btn { transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease; }
        .enhance-btn.pressed { transform: scale(0.96); background: rgba(255,255,255,0.15) !important; border-color: rgba(255,255,255,0.25) !important; }
      `}</style>

      <div
        className="opten-anim relative"
        style={{
          width: 895,
          maxWidth: "100%",
          height: 170,
          opacity: phase === "fade-out" ? 0 : 1,
        }}
      >
        {/* Input box */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 680,
            height: 170,
            background: "#000",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: 20,
              fontFamily: '"PT Root UI", sans-serif',
              fontWeight: 500,
              fontSize: 14.6,
              lineHeight: "26px",
              color: "#fff",
            }}
          >
            {showOldText && (
              <span>
                {OLD_TEXT.slice(0, phase === "typing" ? oldChars : OLD_TEXT.length)}
                {phase === "typing" && (
                  <span style={{ opacity: cursorVisible ? 0.7 : 0 }}>|</span>
                )}
              </span>
            )}
            {showNewText && <span>{NEW_TEXT}</span>}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px 12px",
            }}
          >
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={`${ASSET}/paperclip.svg`} style={{ width: 16, height: 16 }} alt="" />
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6, height: 28, alignItems: "center", padding: "0 8px", borderRadius: 10 }}>
                <span style={{ fontFamily: '"PT Root UI", sans-serif', fontWeight: 500, fontSize: 11.8, color: "rgba(255,255,255,0.5)" }}>
                  MidJourney
                </span>
                <img src={`${ASSET}/chevron-down.svg`} style={{ width: 12, height: 12 }} alt="" />
              </div>
              <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1000 }}>
                <img src={planetSrc} style={{ width: 20, height: 20, minWidth: 20, minHeight: 20 }} alt="" />
              </div>
              <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1000 }}>
                <img src={`${ASSET}/send.svg`} style={{ width: 32, height: 32 }} alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* Red tooltip — always mounted so CSS transition works */}
        <div
            className={redTooltipClass}
            style={{
              position: "absolute",
              left: 623,
              top: 5,
              width: 203,
              display: "flex",
              flexDirection: "column",
              gap: 2.9,
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: "rgba(38,38,38,0.9)",
                backdropFilter: "blur(1.45px)",
                border: "0.725px solid rgba(255,255,255,0.1)",
                borderRadius: 5.8,
                padding: 8.7,
                display: "flex",
                flexDirection: "column",
                gap: 8.7,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <div style={{ display: "flex", gap: 2.9, alignItems: "center" }}>
                <span style={{ fontSize: 8.7, fontWeight: 600, color: "#fff" }}>34%</span>
                <span style={{ fontSize: 8.7, fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>Слабый промпт</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2.9 }}>
                <div style={{ display: "flex", gap: 5.8, alignItems: "center", fontSize: 8.7, color: "#fff" }}>
                  <span style={{ color: "#ef4444", fontSize: 8 }}>✦</span>
                  <span style={{ flex: 1 }}>Слишком общий запрос</span>
                  <img src={`${ASSET}/arrow-down.svg`} style={{ width: 5.95, height: 3.54, transform: "rotate(180deg)" }} alt="" />
                </div>
                <div style={{ paddingLeft: 11.6, fontSize: 8, fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>
                  Добавьте: время суток, погоду, освещение
                </div>
              </div>
              <div style={{ display: "flex", gap: 5.8, alignItems: "center", fontSize: 8.7, color: "#fff" }}>
                <span style={{ color: "#eab308", fontSize: 8 }}>✦</span>
                <span style={{ flex: 1 }}>Отсутствуют параметры</span>
                <img src={`${ASSET}/arrow-down.svg`} style={{ width: 5.95, height: 3.54 }} alt="" />
              </div>
            </div>
            <div
              className={`enhance-btn ${enhancePressed ? "pressed" : ""}`}
              style={{
                background: "rgba(38,38,38,0.9)",
                backdropFilter: "blur(1.45px)",
                border: "0.725px solid rgba(255,255,255,0.1)",
                borderRadius: "5.8px 5.8px 5.8px 0",
                padding: 8.7,
                fontFamily: "Inter, sans-serif",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 5.8, alignItems: "center" }}>
                <img src={`${ASSET}/enhance-icon.svg`} style={{ width: 5.8, height: 8.7 }} alt="" />
                <span style={{ fontSize: 8.7, color: "#fff" }}>Улучшить</span>
              </div>
              <span style={{ fontSize: 8.7, fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>Seedance 2.0</span>
            </div>
          </div>

        {/* Green tooltip — always mounted so CSS transition works */}
        <div
            className={greenTooltipClass}
            style={{
              position: "absolute",
              left: 623,
              bottom: 42,
              width: 203,
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: "rgba(22,163,74,0.21)",
                backdropFilter: "blur(1.45px)",
                border: "1px solid rgba(22,163,74,0.35)",
                borderRadius: "5.8px 5.8px 5.8px 0",
                padding: 8.7,
                fontFamily: "Inter, sans-serif",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 5.8, alignItems: "center" }}>
                <img src={`${ASSET}/checkmark-green.svg`} style={{ width: 5.8, height: 8.7 }} alt="" />
                <span style={{ fontSize: 8.7, color: "#fff" }}>Отличный промпт</span>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}
