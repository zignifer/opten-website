import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentPath = path.join(rootDir, "src/app/components/ExtensionVideoAvatar.tsx");
const appPath = path.join(rootDir, "src/app/App.tsx");
const cssPath = path.join(rootDir, "src/styles/theme.css");
const ruVideoPath = path.join(rootDir, "public/assets/extension-avatar/opten-extension-avatar.mp4");
const enVideoPath = path.join(rootDir, "public/assets/extension-avatar/opten-extension-avatar-en.mp4");
const ruPreviewPath = path.join(rootDir, "public/assets/extension-avatar/opten-extension-avatar-preview.mp4");
const enPreviewPath = path.join(rootDir, "public/assets/extension-avatar/opten-extension-avatar-en-preview.mp4");

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function readIfExists(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
}

const component = readIfExists(componentPath);
const app = readIfExists(appPath);
const css = readIfExists(cssPath);

assert(component.length > 0, "ExtensionVideoAvatar.tsx must exist");
assert(
  existsSync(ruVideoPath) && statSync(ruVideoPath).size > 1_000_000,
  "opten-extension-avatar.mp4 must be present as a local public asset",
);
assert(
  existsSync(enVideoPath) && statSync(enVideoPath).size > 1_000_000,
  "opten-extension-avatar-en.mp4 must be present as a local public asset",
);
assert(
  existsSync(ruPreviewPath) && statSync(ruPreviewPath).size < 200_000,
  "RU avatar preview must exist and stay below 200 KB",
);
assert(
  existsSync(enPreviewPath) && statSync(enPreviewPath).size < 200_000,
  "EN avatar preview must exist and stay below 200 KB",
);
assert(
  component.includes('import { useLang } from "../../i18n/LangContext";'),
  "component must read the active language from LangContext",
);
assert(
  component.includes('ru: "/assets/extension-avatar/opten-extension-avatar.mp4"') &&
    component.includes('en: "/assets/extension-avatar/opten-extension-avatar-en.mp4"'),
  "component must define RU and EN local avatar video sources",
);
assert(
  component.includes('ru: "/assets/extension-avatar/opten-extension-avatar-preview.mp4"') &&
    component.includes('en: "/assets/extension-avatar/opten-extension-avatar-en-preview.mp4"'),
  "component must define RU and EN lightweight preview sources",
);
assert(
  component.includes("const fullVideoSrc = EXTENSION_AVATAR_VIDEO_SOURCES[lang];") &&
    component.includes("const previewVideoSrc = EXTENSION_AVATAR_PREVIEW_SOURCES[lang];") &&
    component.includes("const activeVideoSrc = isIdle ? previewVideoSrc : fullVideoSrc;") &&
    component.includes('data-video-format={videoFormat}'),
  "component must use the preview while idle and the full source only while active",
);
assert(
  /<video[\s\S]*src=\{activeVideoSrc\}[\s\S]*autoPlay=\{isIdle\}[\s\S]*muted=\{isIdle\}[\s\S]*loop[\s\S]*playsInline/.test(component),
  "only the lightweight idle preview may autoplay; active playback must stay inline",
);
assert(
  !component.includes("video.load()"),
  "component must not manually reload a video that the browser already loaded from src",
);
assert(
  /useEffect\(\(\) => \{[\s\S]*if \(mode !== "active"\) return;[\s\S]*video\.muted = false;[\s\S]*video\.play\(\)[\s\S]*\}, \[mode, fullVideoSrc\]\);/.test(component),
  "component must request and play the full video only after entering active mode",
);
assert(
  component.includes('setMode("active")') && component.includes('setMode("idle")'),
  "component must support active playback and close back to idle",
);
assert(
  !/booking|lead|bubble|onEnded/i.test(component),
  "component must not include NOVA booking/form/ended-bubble behavior",
);
assert(
  app.includes('import ExtensionVideoAvatar from "./components/ExtensionVideoAvatar";') &&
    app.includes("<ExtensionVideoAvatar />"),
  "landing App.tsx must render the widget",
);
assert(
  /opten-extension-avatar/.test(css) &&
    /@media \(max-width: 760px\)/.test(css) &&
    /@media \(prefers-reduced-motion: reduce\)/.test(css),
  "theme.css must include desktop, mobile, and reduced-motion widget styles",
);
assert(
  /data-video-format="landscape"/.test(css) && /aspect-ratio: 72 \/ 70/.test(css),
  "theme.css must include a compact 720x700 landscape layout for the EN video",
);

if (failures.length > 0) {
  console.error("extension-avatar verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("extension-avatar verification passed");
