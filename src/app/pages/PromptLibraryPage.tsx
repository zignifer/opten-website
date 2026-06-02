import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Copy,
  Library,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { useLang } from "../../i18n/LangContext";
import LocalizedLink from "../components/LocalizedLink";
import SiteHeader from "../components/SiteHeader";

const SUPABASE_REST_URL = "https://supabase.opten.space/rest/v1";
const SUPABASE_FUNCTIONS_URL = "https://supabase.opten.space/functions/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXd5ZGh3a3FtaWhmenRwa2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAyODUsImV4cCI6MjA5MTAzNjI4NX0.A3apeGWSQih8qioX0XA2O5qbj4PnKwQsshPtG7vrbKg";
const CHROME_STORE_URL = "https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl";
const EXTENSION_IDS = [
  "iphkppgbobpilmphloffcalicmejacfl",
  "kcmcaeenfmfnpiaihicecnfnagejpcog",
];

const MAX_PROMPTS = 150;
const MAX_BODY_CHARS = 12000;
const MAX_TAGS = 8;
const PROMPT_SELECT = "id,user_id,title,body,tags,favorite,source_host,source_url,source_title,body_hash,use_count,last_used_at,created_at,updated_at,archived_at";
const PROMPT_LIBRARY_REFRESH_MESSAGE = "REFRESH_PROMPT_LIBRARY_CACHE";

type FilterMode = "all" | "favorite" | "recent" | "archive";
type EditorMode = "view" | "edit";
type AuthState = "detecting" | "no_extension" | "no_auth" | "checking" | "locked" | "ready" | "error";

interface PromptRecord {
  id: string;
  user_id: string;
  title: string;
  body: string;
  tags: string[];
  favorite: boolean;
  source_host: string | null;
  source_url: string | null;
  source_title: string | null;
  body_hash?: string;
  use_count: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

interface Subscription {
  plan?: string;
  status?: string | null;
  expires_at?: string | null;
}

const TEXT = {
  ru: {
    title: "Библиотека промптов",
    add: "Добавить промпт",
    search: "Найти промпт, тег или источник...",
    searchLabel: "Поиск промптов",
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
    tagsLabel: "Теги",
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
    checking: "Проверяем подписку...",
    loading: "Загружаем библиотеку...",
    notInstalledTitle: "Расширение Opten не найдено",
    notInstalledBody: "Открой библиотеку с установленным расширением Opten. Так сайт получает безопасный токен авторизации.",
    install: "Установить расширение",
    notLoggedTitle: "Войди в аккаунт",
    notLoggedBody: "Открой popup расширения Opten, войди через Google и обнови страницу.",
    lockedTitle: "Библиотека доступна в Pro",
    lockedBody: "Free-аккаунт не получает доступ к сохраненным промптам. Перейди на Pro, чтобы хранить и использовать свою библиотеку.",
    upgrade: "Перейти на Pro",
    retry: "Повторить",
    error: "Не удалось загрузить библиотеку.",
  },
  en: {
    title: "Prompt Library",
    add: "Add prompt",
    search: "Find a prompt, tag, or source...",
    searchLabel: "Search prompts",
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
    tagsLabel: "Tags",
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
    checking: "Checking subscription...",
    loading: "Loading library...",
    notInstalledTitle: "Opten extension not found",
    notInstalledBody: "Open the library with the Opten extension installed. The site uses it to receive a safe auth token.",
    install: "Install extension",
    notLoggedTitle: "Sign in",
    notLoggedBody: "Open the Opten extension popup, sign in with Google, and refresh this page.",
    lockedTitle: "Prompt Library is available in Pro",
    lockedBody: "Free accounts do not get access to saved prompts. Upgrade to Pro to store and reuse your library.",
    upgrade: "Upgrade to Pro",
    retry: "Retry",
    error: "Failed to load the library.",
  },
};

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
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

function isEntitled(sub: Subscription | null): boolean {
  if (!sub || sub.plan !== "pro") return false;
  if (sub.status !== "active" && sub.status !== "cancelled") return false;
  if (!sub.expires_at) return true;
  return new Date(sub.expires_at).getTime() > Date.now();
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
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[10px] border border-dashed border-white/12 bg-white/[0.025] px-6 py-10 text-center">
      <Library size={28} className="mb-4 text-white/35" aria-hidden="true" />
      <p className="text-[16px] font-medium text-white">{title}</p>
      {body && <p className="mt-2 max-w-[340px] text-[14px] leading-[1.55] text-white/45">{body}</p>}
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
  const [error, setError] = useState("");
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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
    return {
      Authorization: `Bearer ${authToken ?? ""}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    };
  }

  async function detectExtension() {
    const chrome = (window as any).chrome;
    if (!chrome?.runtime?.sendMessage) {
      setAuthState("no_extension");
      return;
    }

    let tried = 0;
    let resolved = false;
    for (const id of EXTENSION_IDS) {
      try {
        chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, (response: any) => {
          tried++;
          if (resolved) return;
          if (chrome.runtime.lastError || !response) {
            if (tried >= EXTENSION_IDS.length) setAuthState("no_extension");
            return;
          }
          if (!response.token) {
            resolved = true;
            setAuthState("no_auth");
            return;
          }
          const nextUserId = parseJwtUserId(response.token);
          if (!nextUserId) {
            resolved = true;
            setError("invalid_token");
            setAuthState("error");
            return;
          }
          resolved = true;
          setToken(response.token);
          setUserId(nextUserId);
          void checkEntitlement(response.token);
        });
      } catch {
        tried++;
        if (tried >= EXTENSION_IDS.length && !resolved) setAuthState("no_extension");
      }
    }
  }

  async function checkEntitlement(authToken: string) {
    setAuthState("checking");
    setError("");
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/get-subscription`, {
        headers: authHeaders(authToken),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || String(res.status));
        setAuthState("error");
        return;
      }
      if (!isEntitled(data)) {
        setAuthState("locked");
        return;
      }
      setAuthState("ready");
      await loadPrompts(authToken);
    } catch (err: any) {
      setError(err?.message || "network_error");
      setAuthState("error");
    }
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
    patchLocal(prompt.id, { favorite: !prompt.favorite });
    if (isDraft(prompt)) return;
    const saved = await mutatePrompt(`/prompt_library?id=eq.${prompt.id}&select=${PROMPT_SELECT}`, {
      method: "PATCH",
      body: JSON.stringify({ favorite: !prompt.favorite }),
    });
    if (saved) {
      upsertLocal(saved);
      notifyPromptLibraryCacheRefresh();
    }
    showToast(prompt.favorite ? text.favRemoved : text.favAdded);
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

  const pageShell = (children: JSX.Element) => (
    <div className="min-h-dvh bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SiteHeader variant="page" />
      <main className="relative overflow-hidden px-4 pb-[70px] pt-[128px] sm:px-6 lg:px-8 lg:pt-[142px]">
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
    </div>
  );

  if (authState === "detecting") {
    return pageShell(<StatusPanel title={text.detecting} icon={<RefreshCw size={22} className="animate-spin" aria-hidden="true" />} />);
  }
  if (authState === "checking") {
    return pageShell(<StatusPanel title={text.checking} icon={<RefreshCw size={22} className="animate-spin" aria-hidden="true" />} />);
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
  if (authState === "locked") {
    return pageShell(
      <StatusPanel
        title={text.lockedTitle}
        body={text.lockedBody}
        action={
          <LocalizedLink to="/pay" className="inline-flex h-11 items-center justify-center rounded-full bg-[#9cfb51] px-5 text-[14px] font-bold text-[#011417] no-underline">
            {text.upgrade}
          </LocalizedLink>
        }
      />,
    );
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
    <div className="min-h-dvh bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SiteHeader variant="page" />

      <main className="relative overflow-hidden px-4 pb-[70px] pt-[128px] sm:px-6 lg:px-8 lg:pt-[142px]">
        <div
          aria-hidden="true"
          className="opten-figma-gradient"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col gap-4">
          <section className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-['Unbounded',sans-serif] text-[30px] font-bold leading-tight text-white sm:text-[38px]">
                {text.title}
              </h1>
              <span className="sr-only" aria-live="polite">{loadingPrompts ? text.loading : ""}</span>
            </div>
            <button
              type="button"
              onClick={handleCreate}
              disabled={promptCount >= MAX_PROMPTS}
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-5 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            >
              <Plus size={16} aria-hidden="true" />
              {text.add}
            </button>
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

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#071c1f]/90 lg:h-[calc(100dvh-358px)] lg:min-h-[520px]">
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
                            aria-label={prompt.favorite ? text.favoriteRemove : text.favoriteAdd}
                            className={cx(
                              "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60",
                              prompt.favorite ? "border-[#9cfb51]/35 bg-[#9cfb51]/12 text-[#9cfb51]" : "border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/10 hover:text-white",
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

            <aside className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#071c1f]/95 lg:sticky lg:top-[126px] lg:h-[calc(100dvh-358px)] lg:min-h-[520px] lg:overflow-hidden">
              {selectedPrompt ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                    <h2 className="min-w-0 truncate text-[15px] font-semibold leading-tight text-white">{selectedPrompt.title}</h2>
                    <button
                      type="button"
                      onClick={() => void handleFavorite(selectedPrompt)}
                      aria-label={selectedPrompt.favorite ? text.favoriteRemove : text.favoriteAdd}
                      className={cx("grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60", selectedPrompt.favorite ? "border-[#9cfb51]/40 bg-[#9cfb51]/12 text-[#9cfb51]" : "border-white/10 bg-white/[0.04] text-white/55 hover:text-white")}
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
    </div>
  );
}
