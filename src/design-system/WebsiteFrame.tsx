import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// A real viewport: production media queries and imported React components run
// against the specimen width. No copied component markup or screenshot assets.
export default function WebsiteFrame({ children, width, title }: { children: ReactNode; width: number; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(180);
  useEffect(() => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    doc.head.innerHTML = "";
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => doc.head.appendChild(node.cloneNode(true)));
    const style = doc.createElement("style");
    style.textContent = "html,body{margin:0;background:#011417;color:white;font-family:'PT Root UI',sans-serif}#specimen{display:flow-root;min-height:80px;transform:translateZ(0)}";
    doc.head.appendChild(style);
    doc.body.innerHTML = '<div id="specimen"></div>';
    setTarget(doc.getElementById("specimen"));
    const specimen = doc.getElementById("specimen")!;
    const observer = new ResizeObserver(() => setHeight(Math.max(100, Math.min(1400, Math.ceil(specimen.getBoundingClientRect().height)))));
    observer.observe(specimen);
    return () => observer.disconnect();
  }, []);
  return <div className="ds-frame-scroll"><iframe ref={frame} title={title} sandbox="allow-same-origin" style={{ width, height }} />{target && createPortal(children, target)}</div>;
}
