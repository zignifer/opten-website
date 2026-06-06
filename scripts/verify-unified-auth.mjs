import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const main = read("src/main.tsx");
assert.match(main, /path="\/login"/, "Main router must register canonical /login");
assert.match(main, /path="\/auth\/callback"/, "Main router must register canonical /auth/callback");
assert.match(main, /<SpaceAuthProvider>[\s\S]*<ScrollToTop \/>[\s\S]*<Routes>[\s\S]*<\/Routes>[\s\S]*<\/SpaceAuthProvider>/, "Main app tree must be globally wrapped in SpaceAuthProvider");
assert.match(main, /vite:preloadError[\s\S]*reloadOnceAfterChunkError/, "Main app must recover from stale lazy chunks after deploy");
assert.match(main, /ChunkReloadBoundary[\s\S]*<Suspense fallback=\{<RouteLoading \/>}/, "Lazy routes must be wrapped in the chunk reload error boundary");
assert.match(main, /sessionStorage[\s\S]*CHUNK_RELOAD_COOLDOWN_MS[\s\S]*window\.location\.reload\(\)/, "Chunk reload recovery must guard against reload loops");
assert.doesNotMatch(main, /<SpaceAuthProvider><AppIndexPage \/><\/SpaceAuthProvider>/, "App routes must not keep route-local SpaceAuthProvider wrappers");
assert.match(main, /path="\/app\/login"[\s\S]*Navigate[\s\S]*to="\/login\?next=\/learn"/, "/app/login must redirect to the public Learn surface");
assert.match(main, /path="\/learn"/, "Main router must register public /learn");
assert.match(main, /path="\/learn\/:lessonSlug"/, "Main router must register public /learn/:lessonSlug");
assert.match(main, /path="\/en\/learn"/, "Main router must register public /en/learn");
assert.match(main, /path="\/en\/learn\/:lessonSlug"/, "Main router must register public /en/learn/:lessonSlug");

const entryServer = read("scripts/entry-server.tsx");
assert.match(entryServer, /SpaceAuthProvider/, "SSR entry must wrap SiteHeader consumers in SpaceAuthProvider");
assert.match(entryServer, /<SpaceAuthProvider>[\s\S]*<ScrollToTop \/>[\s\S]*<Routes>[\s\S]*<\/Routes>[\s\S]*<\/SpaceAuthProvider>/, "SSR entry must globally wrap routes in SpaceAuthProvider");

const vercel = read("vercel.json");
assert.match(vercel, /"source": "\/login"/, "Vercel must rewrite /login to the SPA");
assert.match(vercel, /"source": "\/auth\/callback"/, "Vercel must rewrite /auth/callback to the SPA");
assert.match(vercel, /"source": "\/login"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "/login must be noindex");
assert.match(vercel, /"source": "\/auth\/:path\*"[\s\S]*"X-Robots-Tag"[\s\S]*"noindex, nofollow"/, "/auth/* must be noindex");

const siteHeader = read("src/app/components/SiteHeader.tsx");
assert.match(siteHeader, /useSpaceAuth/, "SiteHeader must read website auth state");
assert.match(siteHeader, /to="\/account"|to=\{["'`]\/account["'`]\}/, "Signed-in SiteHeader profile must link to /account");
assert.match(siteHeader, /\/login\?next=/, "Signed-out SiteHeader action must link to /login with next");
assert.match(siteHeader, /label: "Learn"[\s\S]*to: "\/learn"[\s\S]*label: "Extension"[\s\S]*to: "\/"[\s\S]*label: "Library"[\s\S]*to: "\/prompt-library"/, "SiteHeader must advertise public Learn before Extension and Library");
assert.match(siteHeader, /pathname\.startsWith\("\/learn"\)|pathname\.startsWith\("\/en\/learn"\)/, "SiteHeader must mark Learn active on RU and EN Learn routes");
assert.doesNotMatch(siteHeader, /\bMenu\b|\bX\b|site-header-menu|role="menu"/, "SiteHeader must not render hamburger marketing navigation");
assert.doesNotMatch(siteHeader, /nav\.pricing|nav\.blog|nav\.models|nav\.faq|nav\.about/, "SiteHeader must not include marketing nav labels");
assert.match(siteHeader, /<LocalizedLink[\s\S]*to="\/pay"[\s\S]*aria-label=\{copy\.usage\(creditLabel\)\}/, "SiteHeader credits pill must link to /pay");

const spaceHeader = read("src/app/components/space/SpaceHeader.tsx");
assert.match(spaceHeader, /label: "Learn"[\s\S]*to: "\/learn"[\s\S]*label: "Extension"[\s\S]*to: "\/"[\s\S]*label: "Library"[\s\S]*to: "\/prompt-library"/, "SpaceHeader must advertise public Learn before Extension and Library");
assert.match(spaceHeader, /pathname\.startsWith\("\/learn"\)|pathname\.startsWith\("\/en\/learn"\)/, "SpaceHeader must mark Learn active on RU and EN Learn routes");
assert.match(spaceHeader, /to="\/account"|to=\{["'`]\/account["'`]\}/, "SpaceHeader signed-in profile must navigate to /account");
assert.doesNotMatch(spaceHeader, /onClick=\{\(\) => signOut\(\)\}/, "SpaceHeader profile click must not sign out");
assert.match(spaceHeader, /<LocalizedLink[\s\S]*to="\/pay"[\s\S]*aria-label=\{copy\.usage\(creditLabel\)\}/, "SpaceHeader credits pill must link to /pay");

const auth = read("src/lib/optenAuth.ts");
assert.match(auth, /normalizeSafeNext/, "Auth helpers must expose normalizeSafeNext");
assert.match(auth, /getWebsiteAuthCallbackUrl/, "Auth helpers must expose a canonical website callback URL");

const login = read("src/app/pages/space/AppLoginPage.tsx");
assert.match(login, /useLocation/, "Login page must read next from URL search params");
assert.match(login, /normalizeSafeNext/, "Login page must normalize next redirects");
assert.match(login, /getWebsiteAuthCallbackUrl/, "Login page must use canonical website callback");
assert.match(login, /cursor-pointer[\s\S]*copy\.emailButton/, "Email OTP button must show a pointer cursor when active");
assert.match(login, /cursor-pointer[\s\S]*copy\.google/, "Google auth button must show a pointer cursor when active");
assert.doesNotMatch(login, /Navigate to="\/app\/learn"|navigate\("\/app\/learn"/, "Login page must not hardcode /app/learn as the only post-login destination");

const callback = read("src/app/pages/space/AppAuthCallbackPage.tsx");
assert.match(callback, /normalizeSafeNext/, "Auth callback must normalize next redirects");
assert.match(callback, /useSpaceAuth[\s\S]*refresh[\s\S]*await refresh\(\)[\s\S]*navigate\(safeNext/, "Auth callback must refresh website account state before redirecting");
assert.doesNotMatch(callback, /navigate\("\/app\/learn"/, "Auth callback must not always return to /app/learn");

const pay = read("src/app/pages/PayPage.tsx");
assert.match(pay, /useSpaceAuth/, "PayPage must prefer website auth");
assert.match(pay, /refreshSessionIfNeeded|readSession/, "PayPage must be able to refresh/read website session");
assert.match(pay, /fetchAccountSummary|account/, "PayPage must use account summary for website subscription state");
assert.match(pay, /\/login\?next=\/pay/, "PayPage must route signed-out users to /login?next=/pay");
assert.match(pay, /font-\['Unbounded',sans-serif\][\s\S]*text-\[34px\][\s\S]*md:text-\[46px\]/, "PayPage title must match AccountPage heading scale");

const account = read("src/app/pages/AccountPage.tsx");
assert.match(account, /useSpaceAuth/, "AccountPage must prefer website auth");
assert.match(account, /fetchAccountSummary/, "AccountPage must read account-summary for website sessions");
assert.match(account, /signOut/, "AccountPage must expose website sign-out");
assert.match(account, /h-\[52px\][\s\S]*font-\['PT_Root_UI',sans-serif\][\s\S]*text-\[14px\][\s\S]*font-medium/, "Account sign-out button must keep the requested 52px PT Root UI medium 14 styling");
assert.doesNotMatch(account, /account\.credits\.label|sub\?\.remaining|sub\?\.limit/, "AccountPage body must not render the credits summary card; credits stay in the shared header");
assert.doesNotMatch(account, /account\.auth\.websiteSource|account\.auth\.extensionSource|account\.signOut\.label|account\.signOut\.desc/, "AccountPage must not render explanatory auth-source text around the sign-out button");
assert.match(account, /cancel-subscription-paddle/, "AccountPage must call Paddle cancellation directly for website sessions");
assert.match(account, /cancel-subscription/, "AccountPage must call cancellation directly for website sessions");
assert.match(account, /\/login\?next=\/account/, "AccountPage must route signed-out users to /login?next=/account");

console.log("Unified website auth static checks passed.");
