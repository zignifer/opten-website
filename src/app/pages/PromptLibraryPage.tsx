import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  CirclePlay,
  Copy,
  Library,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useLang } from "../../i18n/LangContext";
import {
  MAX_BODY_CHARS,
  MAX_PROMPTS,
  MAX_TAGS,
  PROMPT_SELECT,
  SUPABASE_REST_URL,
  fetchPublicationSummary,
  promptLibraryHeaders,
  publishPromptLibrarySnapshot,
  unpublishPromptLibrary,
  type PromptLibraryPublicationSummary,
  type PromptRecord,
} from "../../lib/promptLibraryApi";
import {
  PromptLibraryFavoriteError,
  savePromptFavoriteWithFreshAuth,
} from "../../lib/promptLibraryFavorite";
import SiteHeader from "../components/SiteHeader";

const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";
const EXTENSION_IDS = [
  "iphkppgbobpilmphloffcalicmejacfl",
  "kcmcaeenfmfnpiaihicecnfnagejpcog",
];

const PROMPT_LIBRARY_REFRESH_MESSAGE = "REFRESH_PROMPT_LIBRARY_CACHE";
const PROMPT_LIBRARY_DEMO_VIDEO_SRC = "/assets/prompt-library/demo.mp4";
const PROMPT_LIBRARY_DEMO_SEEN_KEY = "opten_prompt_library_demo_seen_v1";

type FilterMode = "all" | "favorite" | "recent" | "archive";
type EditorMode = "view" | "edit";
type AuthState = "detecting" | "no_extension" | "no_auth" | "ready" | "error";
type ExtensionAuthTokenResult =
  | { status: "ready"; token: string; userId: string }
  | { status: "no_extension" | "no_auth" | "error"; error?: string };

const TEXT = {
  ru: {
    title: "Библиотека промптов",
    add: "Добавить промпт",
    demoButton: "Как работает",
    demoTitle: "Посмотри демо",
    demoBody: "В демо показываем живой сценарий: сохраняем промпт из генератора, даем ему понятное имя, добавляем в избранное и вставляем в поле для ввода промптов.",
    demoClose: "Закрыть",
    demoVideoLabel: "Демо работы библиотеки промптов Opten",
    search: "Найти промпт, тег или источник...",
    searchLabel: "Поиск промптов",
    publishTitle: "Публичная ссылка",
    publishDesc: "Публикуется снимок текущей библиотеки. Новые промпты появятся по ссылке только после обновления публикации.",
    publishButton: "Опубликовать",
    publishedLabel: "Опубликовано",
    publicLink: "Публичная ссылка",
    libraryId: "ID библиотеки",
    copyLink: "Скопировать ссылку",
    refreshPublication: "Обновить публикацию",
    unpublish: "Снять с публикации",
    publicItems: "промптов",
    copiedLink: "Ссылка скопирована",
    publishedToast: "Библиотека опубликована",
    refreshedToast: "Публикация обновлена",
    unpublishedToast: "Публикация снята",
    publishFailed: "Не удалось обновить публикацию",
    filters: {
      all: "Все",
      favorite: "Избранные",
      recent: "Недавние",
      archive: "Архив",
    },
    allPrompts: "Все промпты",
    emptyTitle: "Пока нет сохраненных промптов",
    emptyBody: "Скоро здесь появятся промпты, сохраненные через сайт и расширение.",
    emptySearchTitle: "Ничего не найдено",
    emptySearchBody: "Попробуй другое название, тег или фрагмент промпта.",
    emptyArchive: "Архив пуст",
    noSelected: "Промпт не выбран",
    noBody: "Промпт пока пуст. Перейди в редактирование, чтобы добавить текст.",
    archived: "архив",
    added: "Добавлен",
    used: "Использований",
    context: "Контекст",
    created: "Создан",
    updated: "Обновлен",
    titleLabel: "Название",
    bodyLabel: "Промпт",
    tagsLabel: "Модель генерации",
    titlePlaceholder: "Название промпта",
    bodyPlaceholder: "Текст промпта",
    tagsPlaceholder: "video, product, freepik",
    suggestions: "Подсказки",
    copy: "Копировать",
    edit: "Редактировать",
    save: "Сохранить",
    cancel: "Отменить",
    favoriteAdd: "Добавить в избранное",
    favoriteRemove: "Убрать из избранного",
    archive: "Архивировать",
    restore: "Восстановить",
    deleteForever: "Удалить навсегда",
    copied: "Промпт скопирован",
    saved: "Изменения сохранены",
    createdToast: "Черновик создан",
    archivedToast: "Промпт перемещен в архив",
    restoredToast: "Промпт восстановлен",
    deletedToast: "Промпт удален навсегда",
    favAdded: "Добавлено в избранное",
    favRemoved: "Убрано из избранного",
    copyFailed: "Промпт пуст или буфер недоступен",
    duplicate: "Такой промпт уже есть в библиотеке",
    quota: "Лимит 150 промптов уже заполнен",
    detecting: "Подключаемся к расширению...",
    checking: "Подключаем библиотеку...",
    loading: "Загружаем библиотеку...",
    notInstalledTitle: "Расширение Opten не найдено",
    notInstalledBody: "Открой библиотеку с установленным расширением Opten. Так сайт получает безопасный токен авторизации.",
    install: "Установить расширение",
    notLoggedTitle: "Войди в аккаунт",
    notLoggedBody: "Открой popup расширения Opten, войди по Email-коду и обнови страницу.",
    retry: "Повторить",
    error: "Не удалось загрузить библиотеку.",
  },
  en: {
    title: "Prompt Library",
    add: "Add prompt",
    demoButton: "How it works",
    demoTitle: "Watch the demo",
    demoBody: "The demo shows the real flow: save a prompt from the generator, give it a clear name, mark it as a favorite, and insert it into the prompt input field.",
    demoClose: "Close",
    demoVideoLabel: "Opten Prompt Library demo",
    search: "Find a prompt, tag, or source...",
    searchLabel: "Search prompts",
    publishTitle: "Public link",
    publishDesc: "This publishes a snapshot of your current library. New prompts appear on the link only after you refresh the publication.",
    publishButton: "Publish",
    publishedLabel: "Published",
    publicLink: "Public link",
    libraryId: "Library ID",
    copyLink: "Copy link",
    refreshPublication: "Refresh publication",
    unpublish: "Unpublish",
    publicItems: "prompts",
    copiedLink: "Link copied",
    publishedToast: "Library published",
    refreshedToast: "Publication refreshed",
    unpublishedToast: "Publication unpublished",
    publishFailed: "Failed to update publication",
    filters: {
      all: "All",
      favorite: "Favorites",
      recent: "Recent",
      archive: "Archive",
    },
    allPrompts: "All prompts",
    emptyTitle: "No saved prompts yet",
    emptyBody: "Prompts saved from the site and extension will appear here.",
    emptySearchTitle: "Nothing found",
    emptySearchBody: "Try another title, tag, or prompt fragment.",
    emptyArchive: "Archive is empty",
    noSelected: "No prompt selected",
    noBody: "This prompt is empty. Switch to editing to add text.",
    archived: "archived",
    added: "Added",
    used: "Uses",
    context: "Context",
    created: "Created",
    updated: "Updated",
    titleLabel: "Title",
    bodyLabel: "Prompt",
    tagsLabel: "Generation model",
    titlePlaceholder: "Prompt title",
    bodyPlaceholder: "Prompt text",
    tagsPlaceholder: "video, product, freepik",
    suggestions: "Suggestions",
    copy: "Copy",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    favoriteAdd: "Add to favorites",
    favoriteRemove: "Remove from favorites",
    archive: "Archive",
    restore: "Restore",
    deleteForever: "Delete forever",
    copied: "Prompt copied",
    saved: "Changes saved",
    createdToast: "Draft created",
    archivedToast: "Prompt archived",
    restoredToast: "Prompt restored",
    deletedToast: "Prompt permanently deleted",
    favAdded: "Added to favorites",
    favRemoved: "Removed from favorites",
    copyFailed: "Prompt is empty or clipboard is unavailable",
    duplicate: "This prompt already exists in your library",
    quota: "The 150-prompt limit is full",
    detecting: "Connecting to extension...",
    checking: "Connecting library...",
    loading: "Loading library...",
    notInstalledTitle: "Opten extension not found",
    notInstalledBody: "Open the library with the Opten extension installed. The site uses it to receive a safe auth token.",
    install: "Install extension",
    notLoggedTitle: "Sign in",
    notLoggedBody: "Open the Opten extension popup, sign in with an Email code, and refresh this page.",
    retry: "Retry",
    error: "Failed to load the library.",
  },
};

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function markPromptLibraryDemoSeen() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROMPT_LIBRARY_DEMO_SEEN_KEY, "1");
  } catch {
    // Private browsing or storage policy failures should not block the modal.
  }
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function dateValue(value?: string | null): number {
  return value ? new Date(value).getTime() : 0;
}

function parseTags(value: string): string[] {
  const seen = new Set<string>();
  return value
    .split(",")
    .map((tag) => tag.trim().replace(/\s+/g, "-").slice(0, 50))
    .filter(Boolean)
    .filter((tag) => {
      const key = normalize(tag);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_TAGS);
}

function formatDate(value: string | null | undefined, lang: string): string {
  if (!value) return lang === "en" ? "never" : "никогда";
  const locale = lang === "en" ? "en-US" : "ru-RU";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(value));
}

function formatFullDate(value: string | null | undefined, lang: string): string {
  if (!value) return lang === "en" ? "none" : "нет";
  const locale = lang === "en" ? "en-US" : "ru-RU";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function truncateTitle(value: string, max = 58): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}...`;
}

function buildTitleSuggestions(prompt: Pick<PromptRecord, "body" | "source_host" | "source_title" | "tags">, lang: string): string[] {
  const suggestions: string[] = [];
  const lines = prompt.body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const firstLine = lines[0];
  const firstWords = prompt.body.replace(/\s+/g, " ").trim().split(" ").slice(0, 9).join(" ");
  const haystack = normalize(`${prompt.body} ${prompt.source_host ?? ""} ${prompt.source_title ?? ""} ${prompt.tags.join(" ")}`);
  const host = (prompt.source_host ?? "").replace(/^www\./, "");

  if (firstLine) suggestions.push(truncateTitle(firstLine));
  if (firstWords && normalize(firstWords) !== normalize(firstLine ?? "")) suggestions.push(truncateTitle(firstWords, 52));
  if (/(video|видео|sora|seedance|veo|higgsfield)/i.test(haystack)) suggestions.push(lang === "en" ? "Video prompt" : "Промпт для видео");
  if (/(image|photo|изображ|midjourney|freepik|gpt-image|nano)/i.test(haystack)) suggestions.push(lang === "en" ? "Image prompt" : "Промпт для изображения");
  if (/(product|товар|маркетплейс|catalog|turntable)/i.test(haystack)) suggestions.push("Product photo prompt");
  if (host.includes("higgsfield")) suggestions.push("Higgsfield video prompt");
  if (host.includes("freepik")) suggestions.push("Freepik image prompt");
  if (host.includes("magnific")) suggestions.push("Magnific upscale prompt");
  if (host.includes("syntx")) suggestions.push("Syntx prompt fragment");

  const seen = new Set<string>();
  return suggestions
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const key = normalize(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

function parseJwtUserId(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json).sub ?? null;
  } catch {
    return null;
  }
}

function isDraft(prompt: PromptRecord): boolean {
  return prompt.id.startsWith("draft-");
}

function requestExtensionAuthToken(): Promise<ExtensionAuthTokenResult> {
  const chrome = (window as any).chrome;
  if (!chrome?.runtime?.sendMessage) {
    return Promise.resolve({ status: "no_extension" });
  }

  return new Promise((resolve) => {
    let tried = 0;
    let resolved = false;

    function finish(result: ExtensionAuthTokenResult) {
      if (resolved) return;
      resolved = true;
      resolve(result);
    }

    for (const id of EXTENSION_IDS) {
      try {
        chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, (response: any) => {
          tried++;
          if (resolved) return;
          if (chrome.runtime.lastError || !response) {
            if (tried >= EXTENSION_IDS.length) finish({ status: "no_extension" });
            return;
          }
          if (!response.token) {
            finish({ status: "no_auth" });
            return;
          }
          const nextUserId = parseJwtUserId(response.token);
          if (!nextUserId) {
            finish({ status: "error", error: "invalid_token" });
            return;
          }
          finish({ status: "ready", token: response.token, userId: nextUserId });
        });
      } catch {
        tried++;
        if (tried >= EXTENSION_IDS.length && !resolved) finish({ status: "no_extension" });
      }
    }
  });
}

async function patchPromptFavoriteWithToken(token: string, promptId: string, favorite: boolean): Promise<PromptRecord> {
  const res = await fetch(`${SUPABASE_REST_URL}/prompt_library?id=eq.${promptId}&select=${PROMPT_SELECT}`, {
    method: "PATCH",
    headers: {
      ...promptLibraryHeaders(token),
      Prefer: "return=representation",
    },
    body: JSON.stringify({ favorite }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const code = data?.code || data?.message || String(res.status);
    throw new PromptLibraryFavoriteError(data?.message || code, code, res.status);
  }

  const saved = Array.isArray(data) ? data[0] ?? null : data;
  if (!saved?.id) {
    throw new PromptLibraryFavoriteError("missing saved prompt", "missing_saved_prompt", 500);
  }
  return saved;
}

async function copyText(text: string): Promise<boolean> {
  if (!text.trim()) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to legacy browser copy.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  document.body.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  activeElement?.focus({ preventScroll: true });
  return ok;
}

function StatusPanel({ icon, title, body, action }: { icon?: JSX.Element; title: string; body?: string; action?: JSX.Element }) {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-4">
      <div className="w-full max-w-[560px] rounded-[14px] border border-white/10 bg-[#071c1f] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#9cfb51]">
          {icon ?? <Library size={22} aria-hidden="true" />}
        </div>
        <h1 className="font-['Unbounded',sans-serif] text-[26px] font-bold leading-tight text-white">{title}</h1>
        {body && <p className="mx-auto mt-3 max-w-[430px] text-[14px] leading-[1.65] text-white/55">{body}</p>}
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}

function PromptTag({ children }: { children: string }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[12px] leading-none text-white/55">
      <span className="truncate">{children}</span>
    </span>
  );
}

function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="flex min-h-[260px] flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <Library size={28} className="mb-4 text-white/35" aria-hidden="true" />
      <p className="text-[16px] font-medium text-white">{title}</p>
      {body && <p className="mt-2 max-w-[340px] text-[14px] leading-[1.55] text-white/45">{body}</p>}
    </div>
  );
}

function PromptLibraryDemoModal({ open, text, onClose }: { open: boolean; text: typeof TEXT.ru; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus({ preventScroll: true }), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/72 px-3 py-5 backdrop-blur-sm sm:px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-library-demo-title"
        aria-describedby="prompt-library-demo-description"
        className="max-h-[calc(100dvh-40px)] w-full max-w-[920px] overflow-y-auto rounded-[14px] border border-white/12 bg-[#071c1f] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.58)] sm:p-5"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="prompt-library-demo-title" className="font-['Unbounded',sans-serif] text-[22px] font-bold leading-tight text-white sm:text-[28px]">
              {text.demoTitle}
            </h2>
            <p id="prompt-library-demo-description" className="mt-2 max-w-[680px] text-[14px] leading-[1.58] text-white/58 sm:text-[15px]">
              {text.demoBody}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={text.demoClose}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[#021113]">
          <video
            aria-label={text.demoVideoLabel}
            className="block aspect-video w-full bg-[#021113] object-contain"
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            src={PROMPT_LIBRARY_DEMO_VIDEO_SRC}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 min-w-[128px] cursor-pointer items-center justify-center rounded-full bg-[#9cfb51] px-5 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
          >
            {text.demoClose}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function PromptLibraryPage() {
  const { lang } = useLang();
  const text = lang === "en" ? TEXT.en : TEXT.ru;
  const [authState, setAuthState] = useState<AuthState>("detecting");
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<PromptRecord[]>([]);
  const [promptCount, setPromptCount] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [editorMode, setEditorMode] = useState<EditorMode>("view");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const [quickTitlesOpen, setQuickTitlesOpen] = useState(false);
  const [cardMenuId, setCardMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [error, setError] = useState("");
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [publication, setPublication] = useState<PromptLibraryPublicationSummary | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishMenuOpen, setPublishMenuOpen] = useState(false);
  const [favoritePendingId, setFavoritePendingId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const publishMenuRef = useRef<HTMLDivElement | null>(null);

  const selectedPrompt = prompts.find((prompt) => prompt.id === selectedId) ?? null;

  useEffect(() => {
    const previousTitle = document.title;
    const existingMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const previousRobots = existingMeta?.getAttribute("content") ?? null;
    const robots = existingMeta ?? document.createElement("meta");

    document.documentElement.classList.add("opten-demo-scrollbar");
    document.body.classList.add("opten-demo-scrollbar");
    document.title = lang === "en" ? "Prompt Library - Opten" : "Библиотека промптов - Opten";
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex,nofollow");
    if (!existingMeta) document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      if (existingMeta) {
        if (previousRobots === null) existingMeta.removeAttribute("content");
        else existingMeta.setAttribute("content", previousRobots);
      } else {
        robots.remove();
      }
      document.documentElement.classList.remove("opten-demo-scrollbar");
      document.body.classList.remove("opten-demo-scrollbar");
    };
  }, [lang]);

  useEffect(() => {
    void detectExtension();
  }, []);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(PROMPT_LIBRARY_DEMO_SEEN_KEY) === "1") return;
    } catch {
      // If storage cannot be read, still show the first-run demo for this session.
    }

    markPromptLibraryDemoSeen();
    setDemoOpen(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const prompt = selectedPrompt;
    setDraftTitle(prompt?.title ?? "");
    setDraftBody(prompt?.body ?? "");
    setDraftTags(prompt?.tags.join(", ") ?? "");
    setQuickTitlesOpen(false);
  }, [selectedPrompt?.id]);

  useEffect(() => {
    if (authState !== "ready" || !token) return;
    const id = window.setTimeout(() => {
      void loadPrompts(token);
    }, 220);
    return () => window.clearTimeout(id);
  }, [authState, filter, search, token]);

  useEffect(() => {
    if (authState !== "ready" || !token) return;
    void loadPublication(token);
  }, [authState, token]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (!isSearchShortcut) return;
      event.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!publishMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (target instanceof Node && publishMenuRef.current?.contains(target)) return;
      setPublishMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPublishMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [publishMenuOpen]);

  const sortedPrompts = useMemo(() => {
    return [...prompts].sort((a, b) => dateValue(b.last_used_at ?? b.updated_at) - dateValue(a.last_used_at ?? a.updated_at));
  }, [prompts]);

  const titleSuggestions = useMemo(() => {
    if (!selectedPrompt) return [];
    return buildTitleSuggestions(
      {
        ...selectedPrompt,
        body: draftBody,
        tags: parseTags(draftTags),
      },
      lang,
    );
  }, [draftBody, draftTags, lang, selectedPrompt]);

  function showToast(message: string) {
    setToast(message);
  }

  function handleOpenDemo() {
    markPromptLibraryDemoSeen();
    setDemoOpen(true);
  }

  function handleCloseDemo() {
    markPromptLibraryDemoSeen();
    setDemoOpen(false);
  }

  function notifyPromptLibraryCacheRefresh() {
    const chrome = (window as any).chrome;
    if (!chrome?.runtime?.sendMessage) return;

    for (const id of EXTENSION_IDS) {
      try {
        chrome.runtime.sendMessage(id, { type: PROMPT_LIBRARY_REFRESH_MESSAGE }, () => {
          void chrome.runtime.lastError;
        });
      } catch {
        // The page tries both CWS and unpacked extension IDs; missing IDs are expected.
      }
    }
  }

  function authHeaders(authToken = token): HeadersInit {
    return promptLibraryHeaders(authToken);
  }

  function getPublicLibraryUrl(slug: string): string {
    if (typeof window === "undefined") return `https://opten.space/p/${slug}`;
    return `${window.location.origin}/p/${slug}`;
  }

  async function loadPublication(authToken = token) {
    if (!authToken) return;
    try {
      setPublication(await fetchPublicationSummary(authToken));
    } catch {
      setPublication(null);
    }
  }

  async function handlePublishSnapshot() {
    if (!token || publishing) return;
    setPublishing(true);
    try {
      const nextPublication = await publishPromptLibrarySnapshot(token);
      setPublication(nextPublication);
      showToast(publication?.is_public ? text.refreshedToast : text.publishedToast);
    } catch (err: any) {
      setError(err?.message || err?.code || "publish_failed");
      showToast(text.publishFailed);
    } finally {
      setPublishing(false);
    }
  }

  async function handleUnpublishSnapshot() {
    if (!token || publishing) return;
    setPublishing(true);
    try {
      await unpublishPromptLibrary(token);
      await loadPublication(token);
      showToast(text.unpublishedToast);
    } catch (err: any) {
      setError(err?.message || err?.code || "unpublish_failed");
      showToast(text.publishFailed);
    } finally {
      setPublishing(false);
    }
  }

  async function handleCopyPublicLink() {
    if (!publication?.slug) return;
    const ok = await copyText(getPublicLibraryUrl(publication.slug));
    showToast(ok ? text.copiedLink : text.copyFailed);
  }

  async function detectExtension() {
    const result = await requestExtensionAuthToken();
    if (result.status === "no_extension") {
      setAuthState("no_extension");
      return;
    }
    if (result.status === "no_auth") {
      setAuthState("no_auth");
      return;
    }
    if (result.status === "error") {
      setError(result.error || "invalid_token");
      setAuthState("error");
      return;
    }

    setToken(result.token);
    setUserId(result.userId);
    setAuthState("ready");
    void loadPrompts(result.token);
  }

  async function getFreshPromptLibraryToken(): Promise<string | null> {
    const result = await requestExtensionAuthToken();
    if (result.status === "ready") {
      setToken(result.token);
      setUserId(result.userId);
      setAuthState("ready");
      return result.token;
    }

    if (result.status === "no_extension") setAuthState("no_extension");
    else if (result.status === "no_auth") setAuthState("no_auth");
    else {
      setError(result.error || "invalid_token");
      setAuthState("error");
    }
    return null;
  }

  async function loadPromptCount(authToken: string) {
    const res = await fetch(`${SUPABASE_REST_URL}/prompt_library?select=id`, {
      headers: authHeaders(authToken),
    });
    if (!res.ok) return;
    const rows = await res.json().catch(() => []);
    if (Array.isArray(rows)) setPromptCount(rows.length);
  }

  async function loadPrompts(authToken = token) {
    if (!authToken) return;
    setLoadingPrompts(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("select", PROMPT_SELECT);
      params.set("limit", "150");
      params.set("order", "last_used_at.desc.nullslast,updated_at.desc");
      if (filter === "archive") params.set("archived_at", "not.is.null");
      else params.set("archived_at", "is.null");
      if (filter === "favorite") params.set("favorite", "eq.true");
      if (filter === "recent") params.set("last_used_at", "not.is.null");
      if (search.trim()) params.set("search_vector", `wfts.${search.trim()}`);

      const res = await fetch(`${SUPABASE_REST_URL}/prompt_library?${params.toString()}`, {
        headers: authHeaders(authToken),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || data?.code || String(res.status));
        setAuthState("error");
        return;
      }
      const nextPrompts = Array.isArray(data) ? data : [];
      setPrompts(nextPrompts);
      setSelectedId((current) => {
        if (nextPrompts.some((prompt: PromptRecord) => prompt.id === current)) return current;
        return nextPrompts[0]?.id ?? "";
      });
      await loadPromptCount(authToken);
    } catch (err: any) {
      setError(err?.message || "network_error");
      setAuthState("error");
    } finally {
      setLoadingPrompts(false);
    }
  }

  async function mutatePrompt(path: string, init: RequestInit): Promise<PromptRecord | null> {
    const res = await fetch(`${SUPABASE_REST_URL}${path}`, {
      ...init,
      headers: {
        ...authHeaders(),
        Prefer: "return=representation",
        ...(init.headers ?? {}),
      },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const code = data?.code || data?.message || String(res.status);
      if (code === "23505") showToast(text.duplicate);
      else if (code === "23514") showToast(text.quota);
      else {
        setError(code);
        showToast(text.error);
      }
      return null;
    }
    return Array.isArray(data) ? data[0] ?? null : data;
  }

  function upsertLocal(prompt: PromptRecord) {
    setPrompts((current) => {
      const withoutDraft = current.filter((item) => item.id !== selectedId || !isDraft(item));
      if (withoutDraft.some((item) => item.id === prompt.id)) {
        return withoutDraft.map((item) => (item.id === prompt.id ? prompt : item));
      }
      return [prompt, ...withoutDraft];
    });
    setSelectedId(prompt.id);
  }

  function patchLocal(id: string, patch: Partial<PromptRecord>) {
    setPrompts((current) => current.map((prompt) => (prompt.id === id ? { ...prompt, ...patch } : prompt)));
  }

  function handleCreate() {
    if (!userId) return;
    const now = new Date().toISOString();
    const draft: PromptRecord = {
      id: `draft-${Date.now()}`,
      user_id: userId,
      title: lang === "en" ? "New prompt" : "Новый промпт",
      body: "",
      tags: ["draft"],
      favorite: false,
      source_host: "opten.space",
      source_url: null,
      source_title: lang === "en" ? "Manual entry" : "Ручное добавление",
      use_count: 0,
      last_used_at: null,
      created_at: now,
      updated_at: now,
      archived_at: null,
    };
    setPrompts((current) => [draft, ...current]);
    setSelectedId(draft.id);
    setFilter("all");
    setEditorMode("edit");
    showToast(text.createdToast);
  }

  async function handleSave() {
    if (!selectedPrompt || !userId) return;
    const nextTags = parseTags(draftTags);
    const payload = {
      title: draftTitle.trim() || (lang === "en" ? "Untitled" : "Без названия"),
      body: draftBody.slice(0, MAX_BODY_CHARS).trim(),
      tags: nextTags,
    };
    if (!payload.body) {
      showToast(text.noBody);
      return;
    }

    const saved = isDraft(selectedPrompt)
      ? await mutatePrompt(`/prompt_library?select=${PROMPT_SELECT}`, {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            ...payload,
            favorite: selectedPrompt.favorite,
            source_host: selectedPrompt.source_host,
            source_url: selectedPrompt.source_url,
            source_title: selectedPrompt.source_title,
          }),
        })
      : await mutatePrompt(`/prompt_library?id=eq.${selectedPrompt.id}&select=${PROMPT_SELECT}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

    if (!saved) return;
    upsertLocal(saved);
    notifyPromptLibraryCacheRefresh();
    setEditorMode("view");
    setQuickTitlesOpen(false);
    showToast(text.saved);
    await loadPromptCount(token ?? "");
  }

  async function handleFavorite(prompt: PromptRecord) {
    const nextFavorite = !prompt.favorite;
    if (isDraft(prompt)) {
      patchLocal(prompt.id, { favorite: nextFavorite });
      return;
    }
    if (favoritePendingId === prompt.id) return;

    setFavoritePendingId(prompt.id);
    try {
      const saved = await savePromptFavoriteWithFreshAuth({
        promptId: prompt.id,
        favorite: nextFavorite,
        getFreshAuthToken: getFreshPromptLibraryToken,
        patchFavorite: patchPromptFavoriteWithToken,
        onTokenAccepted: setToken,
      });
      upsertLocal(saved);
      notifyPromptLibraryCacheRefresh();
      showToast(nextFavorite ? text.favAdded : text.favRemoved);
    } catch (err: any) {
      const code = err?.code || err?.message || "favorite_failed";
      setError(code);
      showToast(text.error);
    } finally {
      setFavoritePendingId(null);
    }
  }

  async function handleArchiveToggle(prompt: PromptRecord) {
    setCardMenuId(null);
    if (isDraft(prompt)) {
      setPrompts((current) => current.filter((item) => item.id !== prompt.id));
      setSelectedId("");
      return;
    }
    const nextArchivedAt = prompt.archived_at ? null : new Date().toISOString();
    const saved = await mutatePrompt(`/prompt_library?id=eq.${prompt.id}&select=${PROMPT_SELECT}`, {
      method: "PATCH",
      body: JSON.stringify({ archived_at: nextArchivedAt }),
    });
    if (!saved) return;
    setPrompts((current) => {
      if ((filter === "archive" && saved.archived_at) || (filter !== "archive" && !saved.archived_at)) {
        return current.map((item) => (item.id === saved.id ? saved : item));
      }
      return current.filter((item) => item.id !== saved.id);
    });
    setSelectedId(saved.id);
    notifyPromptLibraryCacheRefresh();
    showToast(saved.archived_at ? text.archivedToast : text.restoredToast);
  }

  async function handleDelete(prompt: PromptRecord) {
    setCardMenuId(null);
    if (!prompt.archived_at) return;
    const res = await fetch(`${SUPABASE_REST_URL}/prompt_library?id=eq.${prompt.id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || data?.code || String(res.status));
      showToast(text.error);
      return;
    }
    setPrompts((current) => current.filter((item) => item.id !== prompt.id));
    setSelectedId((current) => (current === prompt.id ? "" : current));
    setPromptCount((current) => Math.max(0, current - 1));
    notifyPromptLibraryCacheRefresh();
    showToast(text.deletedToast);
  }

  async function handleCopy(prompt: PromptRecord) {
    const ok = await copyText(prompt.body);
    if (!ok) {
      showToast(text.copyFailed);
      return;
    }
    showToast(text.copied);
    if (isDraft(prompt)) return;
    patchLocal(prompt.id, {
      use_count: prompt.use_count + 1,
      last_used_at: new Date().toISOString(),
    });
    const res = await fetch(`${SUPABASE_REST_URL}/rpc/prompt_library_mark_used`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ p_prompt_id: prompt.id }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data) {
      upsertLocal(Array.isArray(data) ? data[0] : data);
      notifyPromptLibraryCacheRefresh();
    }
  }

  function handleStartEdit() {
    if (!selectedPrompt) return;
    setDraftTitle(selectedPrompt.title);
    setDraftBody(selectedPrompt.body);
    setDraftTags(selectedPrompt.tags.join(", "));
    setEditorMode("edit");
    setQuickTitlesOpen(false);
  }

  function handleCancelEdit() {
    if (!selectedPrompt) return;
    if (isDraft(selectedPrompt)) {
      setPrompts((current) => current.filter((prompt) => prompt.id !== selectedPrompt.id));
      setSelectedId("");
      return;
    }
    setDraftTitle(selectedPrompt.title);
    setDraftBody(selectedPrompt.body);
    setDraftTags(selectedPrompt.tags.join(", "));
    setEditorMode("view");
    setQuickTitlesOpen(false);
  }

  const empty = search.trim()
    ? { title: text.emptySearchTitle, body: text.emptySearchBody }
    : filter === "archive"
      ? { title: text.emptyArchive }
      : { title: text.emptyTitle, body: text.emptyBody };
  const filterTitle = filter === "all" ? text.allPrompts : text.filters[filter];
  const filterCountLabel = filter === "all" ? `${promptCount}/${MAX_PROMPTS}` : `${sortedPrompts.length}`;
  const demoModal = <PromptLibraryDemoModal open={demoOpen} text={text} onClose={handleCloseDemo} />;

  const pageShell = (children: JSX.Element) => (
    <div className="min-h-dvh bg-[#011417] font-['PT_Root_UI',sans-serif] text-white lg:h-dvh lg:overflow-hidden">
      <SiteHeader variant="page" />
      <main className="relative overflow-hidden px-4 pb-[70px] pt-[128px] sm:px-6 lg:mt-[64px] lg:h-[calc(100dvh-64px)] lg:px-8 lg:py-[48px]">
        <div
          aria-hidden="true"
          className="opten-figma-gradient"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1100px]">{children}</div>
      </main>
      {demoModal}
    </div>
  );

  if (authState === "detecting") {
    return pageShell(<StatusPanel title={text.detecting} icon={<RefreshCw size={22} className="animate-spin" aria-hidden="true" />} />);
  }
  if (authState === "no_extension") {
    return pageShell(
      <StatusPanel
        title={text.notInstalledTitle}
        body={text.notInstalledBody}
        action={
          <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center rounded-full bg-[#9cfb51] px-5 text-[14px] font-bold text-[#011417] no-underline">
            {text.install}
          </a>
        }
      />,
    );
  }
  if (authState === "no_auth") {
    return pageShell(<StatusPanel title={text.notLoggedTitle} body={text.notLoggedBody} />);
  }
  if (authState === "error") {
    return pageShell(
      <StatusPanel
        title={text.error}
        body={error}
        action={
          <button type="button" onClick={() => void detectExtension()} className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[#9cfb51] px-5 text-[14px] font-bold text-[#011417]">
            {text.retry}
          </button>
        }
      />,
    );
  }

  return (
    <div className="min-h-dvh bg-[#011417] font-['PT_Root_UI',sans-serif] text-white lg:h-dvh lg:overflow-hidden">
      <SiteHeader variant="page" />

      <main className="relative overflow-hidden px-4 pb-[70px] pt-[128px] sm:px-6 lg:mt-[64px] lg:h-[calc(100dvh-64px)] lg:px-8 lg:py-[48px]">
        <div
          aria-hidden="true"
          className="opten-figma-gradient"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col gap-4 lg:h-full lg:min-h-0">
          <section className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-['Unbounded',sans-serif] text-[30px] font-bold leading-tight text-white sm:text-[38px]">
                {text.title}
              </h1>
              <span className="sr-only" aria-live="polite">{loadingPrompts ? text.loading : ""}</span>
            </div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleOpenDemo}
                className="inline-flex h-12 min-w-[148px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#9cfb51]/35 bg-transparent px-5 text-[14px] font-bold text-white/78 transition hover:-translate-y-0.5 hover:border-[#9cfb51]/60 hover:bg-[#9cfb51]/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 sm:flex-none"
              >
                <CirclePlay size={16} aria-hidden="true" />
                {text.demoButton}
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={promptCount >= MAX_PROMPTS}
                className="inline-flex h-12 min-w-[158px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-5 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
              >
                <Plus size={16} aria-hidden="true" />
                {text.add}
              </button>
              <div ref={publishMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setPublishMenuOpen((open) => !open)}
                  aria-label={text.publishTitle}
                  aria-expanded={publishMenuOpen}
                  aria-haspopup="dialog"
                  title={text.publishTitle}
                  className={cx(
                    "grid size-12 cursor-pointer place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60",
                    publication?.is_public
                      ? "border-[#9cfb51]/35 bg-[#9cfb51]/12 text-[#9cfb51] hover:bg-[#9cfb51]/18"
                      : "border-white/10 bg-white/[0.04] text-white/62 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Share2 size={18} aria-hidden="true" />
                </button>

                {publishMenuOpen && (
                  <section
                    role="dialog"
                    aria-label={text.publishTitle}
                    className="absolute right-0 top-[58px] z-40 w-[min(360px,calc(100vw-32px))] rounded-[12px] border border-white/10 bg-[#071c1f] p-3 text-left shadow-[0_22px_70px_rgba(0,0,0,0.52)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-full border border-[#9cfb51]/25 bg-[#9cfb51]/8 text-[#9cfb51]">
                        <Share2 size={16} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-[15px] font-semibold leading-tight text-white">{text.publishTitle}</h2>
                          {publication?.is_public && (
                            <span className="rounded-full border border-[#9cfb51]/25 bg-[#9cfb51]/8 px-2 py-0.5 text-[11px] font-medium text-[#9cfb51]">
                              {text.publishedLabel} · {publication.item_count} {text.publicItems}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-[13px] leading-[1.5] text-white/48">{text.publishDesc}</p>
                      </div>
                    </div>

                    {publication?.is_public && (
                      <div className="mt-3 grid gap-2">
                        <label className="block">
                          <span className="sr-only">{text.publicLink}</span>
                          <input
                            readOnly
                            value={getPublicLibraryUrl(publication.slug)}
                            className="h-10 w-full rounded-[8px] border border-white/10 bg-[#0d2528] px-3 text-[13px] text-white/72 outline-none"
                            onFocus={(event) => event.currentTarget.select()}
                          />
                        </label>
                        <p className="flex min-w-0 items-center gap-2 px-1 text-[12px] text-white/42">
                          <span>{text.libraryId}:</span>
                          <span className="truncate font-mono text-white/68">{publication.slug}</span>
                        </p>
                      </div>
                    )}

                    <div className="mt-3 grid gap-2">
                      {publication?.is_public ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void handleCopyPublicLink()}
                            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[13px] font-medium text-white/72 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
                          >
                            <Copy size={14} aria-hidden="true" />
                            {text.copyLink}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handlePublishSnapshot()}
                            disabled={publishing}
                            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-4 text-[13px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <RefreshCw size={14} className={publishing ? "animate-spin" : undefined} aria-hidden="true" />
                            {text.refreshPublication}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleUnpublishSnapshot()}
                            disabled={publishing}
                            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-[#ff5d76]/20 bg-[#ff5d76]/8 px-4 text-[13px] font-medium text-[#ff9aaa] transition hover:bg-[#ff5d76]/14 focus:outline-none focus:ring-2 focus:ring-[#ff5d76]/40 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {text.unpublish}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handlePublishSnapshot()}
                          disabled={publishing || promptCount === 0}
                          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-5 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <Share2 size={16} aria-hidden="true" />
                          {publishing ? text.checking : text.publishButton}
                        </button>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </section>

          <section>
            <label className="relative block">
              <span className="sr-only">{text.searchLabel}</span>
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" aria-hidden="true" />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={text.search}
                className="h-[54px] w-full rounded-[9px] border border-white/10 bg-[#081d1f] pl-10 pr-16 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-[6px] border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-white/42 sm:inline-flex">
                Ctrl K
              </span>
            </label>
          </section>

          <section className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#071c1f]/90 lg:min-h-0">
              <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-[15px] font-semibold leading-tight text-white">
                  <span className="inline-flex items-center gap-2">
                    <span>{filterTitle} <span className="text-white/50">({filterCountLabel})</span></span>
                    <RefreshCw
                      size={13}
                      aria-hidden="true"
                      className={cx(
                        "shrink-0 text-[#9cfb51]/75 transition-opacity",
                        loadingPrompts ? "animate-spin opacity-100" : "opacity-0",
                      )}
                    />
                  </span>
                </h2>
                <div className="flex flex-wrap gap-1 rounded-[9px] border border-white/10 bg-[#0d2528] p-1" role="group" aria-label="Filter">
                  {(["all", "favorite", "recent", "archive"] as FilterMode[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      aria-pressed={filter === item}
                      className={cx(
                        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[7px] px-3 text-[12px] outline-none ring-0 transition focus:ring-0 focus-visible:ring-1 focus-visible:ring-[#9cfb51]/45",
                        filter === item ? "bg-[#9cfb51] text-[#011417]" : "text-white/58 hover:bg-white/[0.06] hover:text-white",
                      )}
                    >
                      {item === "favorite" && <Star size={12} fill={filter === "favorite" ? "currentColor" : "none"} aria-hidden="true" />}
                      {text.filters[item]}
                    </button>
                  ))}
                </div>
              </div>

              <div data-prompt-list className="opten-demo-scrollbar flex min-h-0 flex-1 flex-col gap-2 p-2 md:overflow-y-auto md:pr-1">
                {sortedPrompts.length === 0 ? (
                  <EmptyState title={empty.title} body={empty.body} />
                ) : (
                  sortedPrompts.map((prompt) => {
                    const selected = prompt.id === selectedId;
                    const archived = Boolean(prompt.archived_at);
                    return (
                      <article
                        key={prompt.id}
                        data-prompt-id={prompt.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSelectedId(prompt.id);
                          setEditorMode("view");
                          setCardMenuId(null);
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter" && event.key !== " ") return;
                          event.preventDefault();
                          setSelectedId(prompt.id);
                          setEditorMode("view");
                          setCardMenuId(null);
                        }}
                        aria-current={selected ? "true" : undefined}
                        className={cx(
                          "group relative shrink-0 cursor-pointer rounded-[9px] border p-2.5 outline-none ring-0 transition focus:ring-0 focus-visible:ring-1 focus-visible:ring-[#9cfb51]/35",
                          selected ? "border-[#9cfb51]/42 bg-[#9cfb51]/7" : "border-white/8 bg-white/[0.035] hover:border-white/16 hover:bg-white/[0.055]",
                        )}
                      >
                        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2.5 sm:gap-3">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleFavorite(prompt);
                            }}
                            disabled={favoritePendingId === prompt.id}
                            aria-busy={favoritePendingId === prompt.id ? "true" : undefined}
                            aria-label={prompt.favorite ? text.favoriteRemove : text.favoriteAdd}
                            className={cx(
                              "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60",
                              prompt.favorite ? "border-[#9cfb51]/35 bg-[#9cfb51]/12 text-[#9cfb51]" : "border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/10 hover:text-white",
                              favoritePendingId === prompt.id && "cursor-wait opacity-60",
                            )}
                          >
                            <Star size={16} fill={prompt.favorite ? "currentColor" : "none"} aria-hidden="true" />
                          </button>

                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                              <h3 className="truncate text-[15px] font-semibold leading-tight text-white">{prompt.title}</h3>
                              {archived && <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/45">{text.archived}</span>}
                            </div>
                            <p className="mt-1.5 text-[13px] leading-[1.45] text-white/50 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] [overflow:hidden]">
                              {prompt.body || text.noBody}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium text-white/45">
                              <span>{text.added}: <span className="text-white/65">{formatDate(prompt.created_at, lang)}</span></span>
                              <span>{text.used}: <span className="text-white/65">{prompt.use_count}</span></span>
                            </div>
                          </div>

                          <div className={cx("relative flex shrink-0 items-start gap-1 opacity-100 transition", cardMenuId === prompt.id ? "sm:opacity-100" : "sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100")}>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleCopy(prompt);
                              }}
                              aria-label={text.copy}
                              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60"
                            >
                              <Copy size={16} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setCardMenuId((current) => (current === prompt.id ? null : prompt.id));
                              }}
                              aria-expanded={cardMenuId === prompt.id}
                              aria-label="Actions"
                              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60"
                            >
                              <MoreHorizontal size={16} aria-hidden="true" />
                            </button>
                            {cardMenuId === prompt.id && (
                              <div className="absolute right-0 top-10 z-30 w-[190px] rounded-[10px] border border-white/10 bg-[#0b2023] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]" onClick={(event) => event.stopPropagation()}>
                                <button type="button" onClick={() => void handleArchiveToggle(prompt)} className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-[8px] px-3 text-left text-[13px] text-white/70 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/50">
                                  {archived ? <ArchiveRestore size={15} aria-hidden="true" /> : <Archive size={15} aria-hidden="true" />}
                                  {archived ? text.restore : text.archive}
                                </button>
                                {archived && (
                                  <button type="button" onClick={() => void handleDelete(prompt)} className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-[8px] px-3 text-left text-[13px] text-[#ff7a8a] transition hover:bg-[#ff5d76]/10 focus:outline-none focus:ring-2 focus:ring-[#ff5d76]/40">
                                    <Trash2 size={15} aria-hidden="true" />
                                    {text.deleteForever}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            <aside className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#071c1f]/95 lg:min-h-0 lg:overflow-hidden">
              {selectedPrompt ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                    <h2 className="min-w-0 truncate text-[15px] font-semibold leading-tight text-white">{selectedPrompt.title}</h2>
                    <button
                      type="button"
                      onClick={() => void handleFavorite(selectedPrompt)}
                      disabled={favoritePendingId === selectedPrompt.id}
                      aria-busy={favoritePendingId === selectedPrompt.id ? "true" : undefined}
                      aria-label={selectedPrompt.favorite ? text.favoriteRemove : text.favoriteAdd}
                      className={cx("grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60", selectedPrompt.favorite ? "border-[#9cfb51]/40 bg-[#9cfb51]/12 text-[#9cfb51]" : "border-white/10 bg-white/[0.04] text-white/55 hover:text-white", favoritePendingId === selectedPrompt.id && "cursor-wait opacity-60")}
                    >
                      <Star size={15} fill={selectedPrompt.favorite ? "currentColor" : "none"} aria-hidden="true" />
                    </button>
                  </div>

                  {editorMode === "view" ? (
                    <div className="opten-demo-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                      <div className="opten-demo-scrollbar min-h-[190px] flex-1 overflow-y-auto rounded-[10px] border border-white/10 bg-[#0d2528] p-4">
                        <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.62] text-white">{selectedPrompt.body || text.noBody}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPrompt.tags.map((tag) => <PromptTag key={tag}>{tag}</PromptTag>)}
                      </div>
                      <details className="rounded-[9px] border border-white/10 bg-white/[0.025] p-3 text-[13px] text-white/55">
                        <summary className="cursor-pointer select-none text-white/70 outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60">
                          {lang === "en" ? "Prompt details" : "Детали промпта"}
                        </summary>
                        <div className="mt-3 grid gap-2">
                          {selectedPrompt.source_title && (
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-white/35">{text.context}</span>
                              <span className="max-w-[230px] text-right text-white/72">{selectedPrompt.source_title}</span>
                            </div>
                          )}
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-white/35">{text.created}</span>
                            <span className="text-right text-white/72">{formatFullDate(selectedPrompt.created_at, lang)}</span>
                          </div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-white/35">{text.updated}</span>
                            <span className="text-right text-white/72">{formatFullDate(selectedPrompt.updated_at, lang)}</span>
                          </div>
                          <button type="button" onClick={() => void handleArchiveToggle(selectedPrompt)} className="mt-2 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 text-[13px] text-white/68 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60">
                            {selectedPrompt.archived_at ? <ArchiveRestore size={15} aria-hidden="true" /> : <Archive size={15} aria-hidden="true" />}
                            {selectedPrompt.archived_at ? text.restore : text.archive}
                          </button>
                          {selectedPrompt.archived_at && (
                            <button type="button" onClick={() => void handleDelete(selectedPrompt)} className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ff5d76]/20 bg-[#ff5d76]/8 px-3 text-[13px] text-[#ff9aaa] transition hover:bg-[#ff5d76]/14 focus:outline-none focus:ring-2 focus:ring-[#ff5d76]/40">
                              <Trash2 size={15} aria-hidden="true" />
                              {text.deleteForever}
                            </button>
                          )}
                        </div>
                      </details>
                    </div>
                  ) : (
                    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
                      <div className="relative">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <label htmlFor="prompt-library-title" className="text-[13px] font-medium text-white/70">{text.titleLabel}</label>
                          <button type="button" onClick={() => setQuickTitlesOpen((open) => !open)} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 text-[12px] text-white/62 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60">
                            <Sparkles size={13} className="text-[#9cfb51]/80" aria-hidden="true" />
                            {text.suggestions}
                          </button>
                        </div>
                        <input id="prompt-library-title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} className="h-11 w-full rounded-[9px] border border-white/10 bg-[#0d2528] px-3 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15" placeholder={text.titlePlaceholder} />
                        {quickTitlesOpen && (
                          <div className="absolute right-0 top-[74px] z-20 grid w-full gap-1.5 rounded-[10px] border border-white/10 bg-[#0b2023] p-2 shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
                            {titleSuggestions.map((suggestion) => (
                              <button key={suggestion} type="button" onClick={() => { setDraftTitle(suggestion); setQuickTitlesOpen(false); }} className="cursor-pointer rounded-[8px] px-3 py-2 text-left text-[13px] text-white/70 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/50">
                                <span className="line-clamp-1 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <label className="flex min-h-0 flex-1 flex-col gap-2">
                        <span className="text-[13px] font-medium text-white/70">{text.bodyLabel}</span>
                        <textarea value={draftBody} onChange={(event) => setDraftBody(event.target.value.slice(0, MAX_BODY_CHARS))} className="opten-demo-scrollbar min-h-[220px] flex-1 resize-none overflow-y-auto rounded-[9px] border border-white/10 bg-[#0d2528] px-3 py-3 text-[14px] leading-[1.55] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15" placeholder={text.bodyPlaceholder} />
                        <span className="text-right text-[12px] text-white/35">{draftBody.length} / {MAX_BODY_CHARS}</span>
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-[13px] font-medium text-white/70">{text.tagsLabel}</span>
                        <input value={draftTags} onChange={(event) => setDraftTags(event.target.value)} className="h-11 rounded-[9px] border border-white/10 bg-[#0d2528] px-3 text-[14px] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15" placeholder={text.tagsPlaceholder} />
                        <span className="text-right text-[12px] text-white/35">{parseTags(draftTags).length} / {MAX_TAGS}</span>
                      </label>
                    </div>
                  )}

                  <div className="shrink-0 border-t border-white/10 bg-[#071c1f]/98 p-3">
                    {editorMode === "view" ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button type="button" onClick={() => void handleCopy(selectedPrompt)} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-4 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60">
                          <Copy size={16} aria-hidden="true" />
                          {text.copy}
                        </button>
                        <button type="button" onClick={handleStartEdit} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[14px] text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60">
                          <Pencil size={16} aria-hidden="true" />
                          {text.edit}
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button type="button" onClick={() => void handleSave()} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-4 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60">
                          <Save size={16} aria-hidden="true" />
                          {text.save}
                        </button>
                        <button type="button" onClick={handleCancelEdit} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[14px] text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60">
                          {text.cancel}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <EmptyState title={text.noSelected} />
              )}
            </aside>
          </section>
        </div>
      </main>

      <div
        role="status"
        aria-live="polite"
        className={cx(
          "fixed bottom-5 left-1/2 z-[90] w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 rounded-full border border-[#9cfb51]/30 bg-[#0b2023] px-4 py-3 text-center text-[14px] text-white shadow-[0_18px_60px_rgba(0,0,0,0.42)] transition",
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        {toast}
      </div>
      {demoModal}
    </div>
  );
}
