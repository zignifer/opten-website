import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentPath = path.join(rootDir, "src/app/components/ExtensionVideoAvatar.tsx");
const appPath = path.join(rootDir, "src/app/App.tsx");
const cssPath = path.join(rootDir, "src/styles/theme.css");
const videoPath = path.join(rootDir, "public/assets/extension-avatar/opten-extension-avatar.mp4");

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
  existsSync(videoPath) && statSync(videoPath).size > 1_000_000,
  "opten-extension-avatar.mp4 must be present as a local public asset",
);
assert(
  component.includes('const EXTENSION_AVATAR_VIDEO_SRC = "/assets/extension-avatar/opten-extension-avatar.mp4";'),
  "component must use the local extension avatar MP4",
);
assert(
  /<video[\s\S]*autoPlay[\s\S]*muted=\{isIdle\}[\s\S]*loop[\s\S]*playsInline/.test(component),
  "video must autoplay muted in idle mode, unmute after click, loop, and use playsInline",
);
assert(
  /useEffect\(\(\) => \{[\s\S]*video\.muted = true;[\s\S]*video\.play\(\)\.catch\(\(\) => \{\}\);[\s\S]*\}, \[\]\);/.test(component),
  "component must explicitly start the muted preview on mount for autoplay reliability",
);
assert(
  component.includes('setMode("active")') && component.includes('setMode("idle")'),
  "component must support active playback and close back to idle",
);
assert(
  !/booking|lead|form|bubble|onEnded/i.test(component),
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

if (failures.length > 0) {
  console.error("extension-avatar verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("extension-avatar verification passed");
