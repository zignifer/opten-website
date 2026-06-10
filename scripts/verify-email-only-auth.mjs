import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const websiteRoot = process.cwd();
const extensionRoot = resolve(websiteRoot, "..", "promptscore");

function read(root, path) {
  return readFileSync(join(root, path), "utf8");
}

const loginPage = read(websiteRoot, "src/app/pages/space/AppLoginPage.tsx");
assert.match(loginPage, /const GOOGLE_AUTH_VISIBLE = false;/, "Website login must keep Google auth hidden behind an explicit false flag");
assert.match(loginPage, /GOOGLE_AUTH_VISIBLE\s*\?[\s\S]*copy\.google[\s\S]*:\s*null/, "Website Google button must render only through the visibility flag");
assert.match(loginPage, /startGoogleLogin\(getWebsiteAuthCallbackUrl\(safeNext\)\)/, "Website Google OAuth helper path must be retained for future re-enable");
assert.match(loginPage, /copy\.emailButton/, "Website login must keep the Email OTP entry point visible");
assert.doesNotMatch(loginPage, /copy\.description/, "Website login must not render the removed account description text");
assert.doesNotMatch(loginPage, /Единый вход для подписки, кредитов, расширения и будущих курсов\./, "Website login RU account description text must be removed from the component copy");
assert.doesNotMatch(loginPage, /One account for subscription, credits, the extension, and future courses\./, "Website login EN account description text must be removed from the component copy");
assert.match(loginPage, /top-\[248px\][\s\S]*h-\[433px\] w-\[358px\]/, "Website login card must keep 30px of bottom space after removing the description block");
assert.match(loginPage, /h-\[433px\] w-\[358px\][\s\S]*LoginCardFrame/, "Website login frame invocation must include the added 30px bottom space");
assert.match(loginPage, /className="pointer-events-none absolute inset-0 z-\[2\] h-\[433px\] w-\[358px\]/, "Website login card frame must be 433px tall after adding 30px at the bottom");
assert.match(loginPage, /left-\[44px\] top-\[40px\][\s\S]*SPACE_LOGO_SRC/, "Website login logo content must start 40px from the top of the email-only card");
assert.match(loginPage, /className="inline-block translate-y-px">\{copy\.codeButton\}<\/span>/, "Website OTP submit button text must be lowered by 1px without changing button height");
assert.match(loginPage, /className="inline-block translate-y-px">\{formState === "sending" \? copy\.sending : copy\.emailButton\}<\/span>/, "Website Email submit button text must be lowered by 1px without changing button height");

const authHelpers = read(websiteRoot, "src/lib/optenAuth.ts");
assert.match(authHelpers, /export function startGoogleLogin/, "Website Google OAuth helper must remain in architecture");
assert.match(authHelpers, /provider", "google"/, "Website Google OAuth helper must still target the Google provider");

const popupHtml = read(extensionRoot, "popup/popup.html");
assert.match(popupHtml, /id="ps-popup-signin-btn"[^>]*\bhidden\b/, "Extension Google sign-in button must be hidden in initial HTML");
assert.match(popupHtml, /id="ps-email-code-form"/, "Extension Email OTP form must remain visible in logged-out UI");

const popupCss = read(extensionRoot, "popup/popup.css");
assert.match(popupCss, /#ps-popup-logged-out\s*\{[\s\S]*min-height:\s*512px;/, "Extension logged-out popup must shrink for the email-only form");
assert.match(popupCss, /\.ps-popup-content\s*\{[\s\S]*min-height:\s*512px;/, "Extension logged-out content must use the shorter email-only height");
assert.match(popupCss, /\.ps-btn-google\[hidden\]\s*\{[\s\S]*display:\s*none\s*!important;/, "Extension CSS must force hidden Google auth buttons out of layout");

const popupJs = read(extensionRoot, "popup/popup.js");
assert.match(popupJs, /var PS_GOOGLE_AUTH_VISIBLE = false;/, "Extension popup must keep Google auth hidden behind an explicit false flag");
assert.match(popupJs, /function psApplyGoogleAuthVisibility\(\)/, "Extension popup must centralize Google button visibility");
assert.match(popupJs, /if \(!PS_GOOGLE_AUTH_VISIBLE\) return;/, "Extension Google click handler must no-op while hidden");
assert.match(popupJs, /psApplyGoogleAuthVisibility\(\);/, "Extension popup must apply Google visibility during render/init");

const background = read(extensionRoot, "background/background.js");
assert.match(background, /async function signInWithGoogle\(\)/, "Extension Google OAuth implementation must remain available behind hidden UI");
assert.match(background, /message\.type === 'SIGN_IN'[\s\S]*signInWithGoogle\(\)/, "Extension SIGN_IN handler must remain wired for future re-enable");

console.log("Email-only auth visibility checks passed.");
