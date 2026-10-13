import { useMemo } from "react";
import extension from "./generated/extension.json";

export type ExtensionDemo = typeof extension.demos[number];
export default function ExtensionSpecimen({ demo, variant, lang }: { demo: ExtensionDemo; variant: string; lang: "ru" | "en" }) {
  const srcDoc = useMemo(() => {
    const doc = new DOMParser().parseFromString(extension.markup, "text/html");
    const text = (key: string) => (extension.translations[lang] as Record<string, string>)[key] || (extension.translations.en as Record<string, string>)[key] || "";
    for (const [id, key] of Object.entries(extension.mappings)) {
      const node = doc.getElementById(id); if (node) node.textContent = text(key);
    }
    const set = (selector: string, value: string) => { const node = doc.querySelector(selector); if (node) node.textContent = value; };
    const visible = (selector: string, show: boolean) => { const node = doc.querySelector<HTMLElement>(selector); if (node) node.style.display = show ? "" : "none"; };
    const isFree = variant === "free";
    set("#ps-popup-email", "demo@example.com");
    set("#ps-popup-label-plan", lang === "ru" ? "Тариф" : "Plan");
    set("#ps-popup-label-checks", lang === "ru" ? "Использовано" : "Used");
    set("#ps-popup-plan", isFree ? "Free" : "Pro");
    set("#ps-popup-checks", isFree ? "0/300" : "24/300");
    set(".ps-dash-upgrade-title", text("upgradeTitle"));
    set(".ps-dash-upgrade-sub", text("upgradeSubtext"));
    set("#ps-popup-pro-status", variant === "cancelled" ? (lang === "ru" ? "Pro · продление отключено" : "Pro · renewal off") : "Pro");
    set("#ps-chat-model-text", "Nano Banana 2");
    set("#ps-chat-refs-placeholder", lang === "ru" ? "Загрузить фото" : "Upload photo");
    set("#ps-footer-updated", lang === "ru" ? "Пример даты обновления" : "Sample update date");
    for (const id of ["ps-site-syntx-status", "ps-site-higgsfield-status", "ps-site-freepik-status"]) set(`#${id}`, lang === "ru" ? "Подключено" : "Connected");
    const email = doc.querySelector<HTMLInputElement>("#ps-email-input"); if (email) email.placeholder = text("emailPlaceholder");
    const prompt = doc.querySelector<HTMLTextAreaElement>("#ps-chat-prompt");
    if (prompt) { prompt.placeholder = text("chatPromptPlaceholder"); if (["filled", "loading"].includes(variant)) prompt.textContent = lang === "ru" ? "Создай портрет на белом фоне с мягким студийным светом." : "Create a portrait on white with soft studio lighting."; }
    if (variant === "filled") doc.querySelectorAll<HTMLInputElement>(".ps-email-code-cell").forEach((node, i) => node.setAttribute("value", String(i + 1)));
    visible("#ps-email-code-form", variant !== "code"); visible("#ps-email-verify-form", variant === "code");
    doc.getElementById("ps-popup-logged-out")?.classList.toggle("ps-popup-logged-out--code", variant === "code");
    visible("#ps-popup-upgrade-btn", isFree || demo.id === "upgrade");
    visible("#ps-popup-pro-status", !isFree);
    visible("#ps-popup-cancel-btn", false);
    const progress = doc.getElementById("ps-popup-progress-bar"); if (progress) progress.style.width = variant === "exhausted" ? "100%" : "8%";
    const tabs = doc.querySelectorAll<HTMLButtonElement>(".ps-popup-tab");
    if (demo.id === "tabs") tabs.forEach(node => { const active = node.dataset.tab === variant; node.classList.toggle("ps-popup-tab--active", active); node.setAttribute("aria-selected", String(active)); });
    const underline = doc.querySelector<HTMLElement>(".ps-popup-tabs-underline");
    if (underline && demo.id === "tabs") { const index = ["aggregators", "skill", "chatgpt", "chat"].indexOf(variant); underline.style.width = "25%"; underline.style.left = `${Math.max(0, index) * 25}%`; }
    for (const node of doc.querySelectorAll<HTMLButtonElement>(".ps-chat-improve,.ps-skill-download,#ps-chat-model-btn,#ps-chatgpt-open-btn,.ps-btn-email")) {
      node.disabled = variant === "disabled" || (demo.id === "workbench" && variant === "empty");
      node.type = "button";
    }
    if (variant === "loading") { doc.querySelector(".ps-chat-improve")?.classList.add("ps-chat-improve--loading"); set("#ps-chat-improve-text", lang === "ru" ? "Улучшаем…" : "Improving…"); }
    if (variant === "error") { visible("#ps-chat-error", true); set("#ps-chat-error", lang === "ru" ? "Пример ошибки запроса" : "Sample request error"); }
    if (lang === "ru") doc.querySelector("#ps-promo-banner-image")?.setAttribute("src", "/assets/design-system-extension/popup/assets/prompt-library-banner-ru.png");
    const node = doc.querySelector<HTMLElement>(demo.selector);
    if (!node) return "<p>Образец отсутствует в снимке исходника.</p>";
    node.style.removeProperty("display");
    // No scripts, navigation, forms, or Chrome APIs run inside these snapshots.
    for (const link of node.querySelectorAll("a")) link.removeAttribute("href");
    node.querySelectorAll("form").forEach(form => form.removeAttribute("action"));
    node.querySelectorAll("script").forEach(script => script.remove());
    const full = ["login", "account", "header", "aggregators", "claude", "chatgpt", "workbench", "promo", "tabs"].includes(demo.id);
    const markup = demo.id === "login" ? `<div class="ps-popup-container">${node.outerHTML}</div>` : node.outerHTML;
    return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${location.origin} data:; font-src data:; style-src 'unsafe-inline'; form-action 'none';"><style>${extension.fontCss}\n${extension.css}\nhtml,body{width:420px;margin:0;min-height:0}body{padding:${full ? "0" : "18px"}}body>.ps-popup-screen{display:block}.ps-popup-bg-wrap{pointer-events:none}</style></head><body>${markup}</body></html>`;
  }, [demo, variant, lang]);
  const full = demo.level === "composite";
  const tall = ["login", "claude", "chatgpt"].includes(demo.id);
  const height = full ? (tall ? 540 : demo.id === "header" ? 78 : demo.id === "account" ? 230 : 400) : demo.id === "prompt" ? 280 : demo.id === "instruction" ? 200 : 108;
  return <div className="ds-frame-scroll"><iframe className="ds-extension-frame" title={`${demo.title} · ${variant}`} sandbox="" srcDoc={srcDoc} style={{ width: 420, height }} /></div>;
}
