import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Copy,
  Library,
  MoreHorizontal,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import SiteHeader from "../components/SiteHeader";

interface PromptRecord {
  id: string;
  title: string;
  body: string;
  tags: string[];
  favorite: boolean;
  sourceHost: string;
  sourceTitle?: string;
  useCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

type FilterMode = "all" | "favorite" | "recent" | "archive";
type EditorMode = "view" | "edit";

const MAX_PROMPTS = 150;
const MAX_BODY_CHARS = 12000;
const MAX_TAGS = 8;

const FILTERS: { value: FilterMode; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "favorite", label: "Избранные" },
  { value: "recent", label: "Недавние" },
  { value: "archive", label: "Архив" },
];

const MOCK_PROMPTS: PromptRecord[] = [
  {
    id: "pl-001",
    title: "Higgsfield: камера вокруг продукта",
    body:
      "Cinematic product video, slow orbit camera move around a matte black perfume bottle on wet basalt stone. Soft green rim light, shallow depth of field, premium editorial look, no text, 8 seconds, seamless loop.",
    tags: ["video", "higgsfield", "product"],
    favorite: true,
    sourceHost: "higgsfield.ai",
    sourceTitle: "AI video generator",
    useCount: 18,
    lastUsedAt: "2026-05-31T12:40:00.000Z",
    createdAt: "2026-05-12T09:20:00.000Z",
    updatedAt: "2026-05-29T16:12:00.000Z",
  },
  {
    id: "pl-002",
    title: "Freepik product photo - white background",
    body:
      "Ultra clean product photo of a reusable ceramic coffee cup, centered on a pure white background, softbox reflections, realistic shadow, 85mm lens, high detail, commercial catalog style.",
    tags: ["image", "freepik", "product-photo"],
    favorite: false,
    sourceHost: "freepik.com",
    sourceTitle: "Product photo prompt",
    useCount: 9,
    lastUsedAt: "2026-05-30T08:10:00.000Z",
    createdAt: "2026-05-18T13:34:00.000Z",
    updatedAt: "2026-05-30T08:10:00.000Z",
  },
  {
    id: "pl-003",
    title: "Портрет персонажа с фиксированным лицом",
    body:
      "Один и тот же персонаж: женщина 32 лет, овальное лицо, короткие темные волосы, тонкая переносица, зеленые глаза, спокойная уверенная мимика. Сохраняй пропорции лица, возраст и форму прически во всех сценах.",
    tags: ["character", "consistency", "портрет"],
    favorite: true,
    sourceHost: "opten.space",
    sourceTitle: "Consistent character notes",
    useCount: 24,
    lastUsedAt: "2026-05-28T18:22:00.000Z",
    createdAt: "2026-05-04T11:05:00.000Z",
    updatedAt: "2026-05-21T10:44:00.000Z",
  },
  {
    id: "pl-004",
    title: "Negative prompt для рук и текста",
    body:
      "bad hands, extra fingers, fused fingers, missing fingers, malformed anatomy, unreadable text, random letters, watermark, low resolution, overexposed highlights, plastic skin, distorted face",
    tags: ["negative", "image", "fragment"],
    favorite: false,
    sourceHost: "midjourney.com",
    useCount: 41,
    lastUsedAt: "2026-05-27T17:42:00.000Z",
    createdAt: "2026-04-29T08:50:00.000Z",
    updatedAt: "2026-05-14T19:08:00.000Z",
  },
  {
    id: "pl-005",
    title: "Midjourney интерьер: скандинавский свет",
    body:
      "Bright Scandinavian living room, lime washed walls, oak floor, linen sofa, paper pendant lamp, morning light through sheer curtains, calm editorial interior photography, natural materials, 24mm lens, realistic proportions.",
    tags: ["midjourney", "interior", "image"],
    favorite: false,
    sourceHost: "midjourney.com",
    sourceTitle: "Interior reference board",
    useCount: 7,
    lastUsedAt: "2026-05-25T10:00:00.000Z",
    createdAt: "2026-05-08T15:18:00.000Z",
    updatedAt: "2026-05-15T13:14:00.000Z",
  },
  {
    id: "pl-006",
    title: "Seedance 2.0: динамичный opening shot",
    body:
      "A fast opening shot for a fashion film: model steps from shadow into narrow neon-green light, camera follows from low angle, fabric moves in wind, urban night background, controlled motion blur, 5 seconds.",
    tags: ["video", "seedance", "fashion"],
    favorite: true,
    sourceHost: "syntx.ai",
    sourceTitle: "Seedance 2.0 playground",
    useCount: 13,
    lastUsedAt: "2026-05-24T21:35:00.000Z",
    createdAt: "2026-05-10T18:26:00.000Z",
    updatedAt: "2026-05-24T21:35:00.000Z",
  },
  {
    id: "pl-007",
    title: "Magnific upscale - фактура ткани",
    body:
      "Upscale with preserved composition. Add realistic woven linen texture, micro shadows in folds, natural fiber irregularities, no plastic shine, keep original colors and silhouette, avoid changing the face.",
    tags: ["upscale", "magnific", "texture"],
    favorite: false,
    sourceHost: "magnific.com",
    useCount: 11,
    lastUsedAt: "2026-05-23T07:28:00.000Z",
    createdAt: "2026-05-03T12:04:00.000Z",
    updatedAt: "2026-05-20T09:31:00.000Z",
  },
  {
    id: "pl-008",
    title: "GPT Image: карточка маркетплейса",
    body:
      "Создай реалистичное изображение товара для маркетплейса: один объект в центре, чистый светло-серый фон, мягкая тень, вид на 3/4, без текста, без логотипов, акцент на материал и масштаб.",
    tags: ["gpt-image", "marketplace", "product"],
    favorite: true,
    sourceHost: "chatgpt.com",
    sourceTitle: "Product image thread",
    useCount: 29,
    lastUsedAt: "2026-05-22T14:11:00.000Z",
    createdAt: "2026-04-27T08:14:00.000Z",
    updatedAt: "2026-05-22T14:11:00.000Z",
  },
  {
    id: "pl-009",
    title: "Character Bible: Mara",
    body:
      "Mara is a calm cybernetic botanist in her late 20s. Keep the same face, freckles, short silver hair, asymmetric green jacket, botanical tool belt, and precise posture. She should look curious, not aggressive.",
    tags: ["character", "english", "series"],
    favorite: false,
    sourceHost: "opten.space",
    sourceTitle: "Reusable character sheet",
    useCount: 5,
    lastUsedAt: "2026-05-19T15:12:00.000Z",
    createdAt: "2026-05-02T16:30:00.000Z",
    updatedAt: "2026-05-17T11:52:00.000Z",
  },
  {
    id: "pl-010",
    title: "Фрагмент: мягкий студийный свет",
    body:
      "мягкий рассеянный студийный свет, большой октобокс слева, слабый контровой свет справа, чистые естественные тени, аккуратные блики на материале, реалистичная цветопередача",
    tags: ["fragment", "lighting", "ru"],
    favorite: false,
    sourceHost: "freepik.com",
    useCount: 36,
    lastUsedAt: "2026-05-18T09:25:00.000Z",
    createdAt: "2026-04-24T09:12:00.000Z",
    updatedAt: "2026-05-11T12:45:00.000Z",
  },
  {
    id: "pl-011",
    title: "Sora storyboard: breakfast ritual",
    body:
      "Storyboard for a warm kitchen scene: close-up of hands grinding coffee, steam rising from kettle, sunlight on wooden table, slow cuts, intimate morning rhythm, no dialogue, natural sound design, 12 seconds.",
    tags: ["video", "storyboard", "sora"],
    favorite: false,
    sourceHost: "chatgpt.com",
    sourceTitle: "Sora concept notes",
    useCount: 4,
    lastUsedAt: "2026-05-16T06:45:00.000Z",
    createdAt: "2026-05-16T06:22:00.000Z",
    updatedAt: "2026-05-16T06:45:00.000Z",
  },
  {
    id: "pl-012",
    title: "Nano Banana: replace object",
    body:
      "Replace only the object in the person's hand with a small chrome camera. Preserve hand pose, lighting, shadows, skin texture, background, clothing and camera angle. Do not alter the face.",
    tags: ["edit", "nano-banana", "image"],
    favorite: false,
    sourceHost: "opten.space",
    sourceTitle: "Image edit fragment",
    useCount: 8,
    lastUsedAt: "2026-05-13T20:01:00.000Z",
    createdAt: "2026-05-01T17:10:00.000Z",
    updatedAt: "2026-05-13T20:01:00.000Z",
  },
  {
    id: "pl-013",
    title: "Syntx polish fragment",
    body:
      "Improve clarity, remove vague adjectives, keep the user's intent, add camera angle, lighting, material details and explicit negative constraints. Return only the improved prompt.",
    tags: ["fragment", "syntx", "polish"],
    favorite: true,
    sourceHost: "syntx.ai",
    sourceTitle: "Prompt optimizer",
    useCount: 52,
    lastUsedAt: "2026-05-12T16:12:00.000Z",
    createdAt: "2026-04-25T14:22:00.000Z",
    updatedAt: "2026-05-12T16:12:00.000Z",
  },
  {
    id: "pl-014",
    title: "Veo product turntable",
    body:
      "Luxury watch on a dark graphite turntable, slow 360-degree rotation, crisp reflections, green edge light, macro lens details, premium campaign mood, no text, no logo distortion, 6 seconds.",
    tags: ["video", "veo", "product"],
    favorite: false,
    sourceHost: "chatgpt.com",
    sourceTitle: "Veo prompt draft",
    useCount: 6,
    lastUsedAt: "2026-05-10T13:18:00.000Z",
    createdAt: "2026-05-10T13:00:00.000Z",
    updatedAt: "2026-05-10T13:18:00.000Z",
  },
  {
    id: "pl-015",
    title: "Архив: старый тестовый промпт",
    body:
      "A generic cinematic scene with dramatic light, detailed background, high quality, trending style, no artifacts.",
    tags: ["archive", "test"],
    favorite: false,
    sourceHost: "opten.space",
    useCount: 1,
    createdAt: "2026-04-12T10:10:00.000Z",
    updatedAt: "2026-04-12T10:10:00.000Z",
    archivedAt: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "pl-016",
    title: "Archived logo prompt",
    body:
      "Minimal logo for a fictional AI studio, abstract folded ribbon mark, monochrome, vector feel, no letters.",
    tags: ["archive", "logo", "image"],
    favorite: false,
    sourceHost: "freepik.com",
    sourceTitle: "Old logo experiment",
    useCount: 2,
    lastUsedAt: "2026-04-18T11:15:00.000Z",
    createdAt: "2026-04-18T10:30:00.000Z",
    updatedAt: "2026-04-18T11:15:00.000Z",
    archivedAt: "2026-05-18T09:00:00.000Z",
  },
];

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function dateValue(value?: string | null): number {
  return value ? new Date(value).getTime() : 0;
}

function formatDate(value?: string | null): string {
  if (!value) return "не использовался";
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date(value));
}

function formatFullDate(value?: string | null): string {
  if (!value) return "нет";
  return new Intl.DateTimeFormat("ru-RU", {
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

function buildTitleSuggestions(prompt: PromptRecord): string[] {
  const suggestions: string[] = [];
  const lines = prompt.body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const firstLine = lines[0];
  const firstWords = prompt.body.replace(/\s+/g, " ").trim().split(" ").slice(0, 9).join(" ");
  const haystack = normalize(`${prompt.body} ${prompt.sourceHost} ${prompt.sourceTitle ?? ""} ${prompt.tags.join(" ")}`);
  const host = prompt.sourceHost.replace(/^www\./, "");

  if (firstLine) suggestions.push(truncateTitle(firstLine));
  if (firstWords && normalize(firstWords) !== normalize(firstLine ?? "")) {
    suggestions.push(truncateTitle(firstWords, 52));
  }
  if (/(video|видео|sora|seedance|veo|higgsfield)/i.test(haystack)) suggestions.push("Промпт для видео");
  if (/(image|photo|изображ|midjourney|freepik|gpt-image|nano)/i.test(haystack)) suggestions.push("Промпт для изображения");
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

async function copyText(text: string): Promise<boolean> {
  if (!text.trim()) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy browser-only copy path.
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

function PromptTag({ children, active = false }: { children: string; active?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex max-w-full items-center rounded-full border px-2 py-1 text-[12px] leading-none",
        active
          ? "border-[#9cfb51]/50 bg-[#9cfb51]/12 text-[#9cfb51]"
          : "border-white/10 bg-white/[0.04] text-white/55",
      )}
    >
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

export default function PromptLibraryDemoPage() {
  const [prompts, setPrompts] = useState<PromptRecord[]>(MOCK_PROMPTS);
  const [selectedId, setSelectedId] = useState(MOCK_PROMPTS[0].id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [editorMode, setEditorMode] = useState<EditorMode>("view");
  const [draftTitle, setDraftTitle] = useState(MOCK_PROMPTS[0].title);
  const [draftBody, setDraftBody] = useState(MOCK_PROMPTS[0].body);
  const [draftTags, setDraftTags] = useState(MOCK_PROMPTS[0].tags.join(", "));
  const [quickTitlesOpen, setQuickTitlesOpen] = useState(false);
  const [cardMenuId, setCardMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    const existingMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const previousRobots = existingMeta?.getAttribute("content") ?? null;
    const robots = existingMeta ?? document.createElement("meta");

    document.documentElement.classList.add("opten-demo-scrollbar");
    document.body.classList.add("opten-demo-scrollbar");
    document.title = "Библиотека промптов - демо Opten";
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
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (prompts.some((prompt) => prompt.id === selectedId)) return;
    setSelectedId(prompts[0]?.id ?? "");
  }, [prompts, selectedId]);

  useEffect(() => {
    const prompt = prompts.find((item) => item.id === selectedId);
    setDraftTitle(prompt?.title ?? "");
    setDraftBody(prompt?.body ?? "");
    setDraftTags(prompt?.tags.join(", ") ?? "");
    setQuickTitlesOpen(false);
  }, [prompts, selectedId]);

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

  const selectedPrompt = prompts.find((prompt) => prompt.id === selectedId) ?? null;

  const filteredPrompts = useMemo(() => {
    const query = normalize(search);
    return prompts
      .filter((prompt) => {
        const archived = Boolean(prompt.archivedAt);
        if (filter === "archive" && !archived) return false;
        if (filter !== "archive" && archived) return false;
        if (filter === "favorite" && !prompt.favorite) return false;
        if (filter === "recent" && !prompt.lastUsedAt) return false;
        if (!query) return true;
        const haystack = normalize(`${prompt.title} ${prompt.body} ${prompt.tags.join(" ")} ${prompt.sourceHost}`);
        return haystack.includes(query);
      })
      .sort((a, b) => {
        return dateValue(b.lastUsedAt ?? b.updatedAt) - dateValue(a.lastUsedAt ?? a.updatedAt);
      });
  }, [filter, prompts, search]);

  const titleSuggestions = useMemo(() => {
    if (!selectedPrompt) return [];
    return buildTitleSuggestions({
      ...selectedPrompt,
      title: draftTitle,
      body: draftBody,
      tags: parseTags(draftTags),
    });
  }, [draftBody, draftTags, draftTitle, selectedPrompt]);

  const showToast = (message: string) => setToast(message);

  const updatePrompt = (id: string, patch: Partial<PromptRecord>) => {
    setPrompts((current) => current.map((prompt) => (prompt.id === id ? { ...prompt, ...patch } : prompt)));
  };

  const touchPrompt = (id: string, patch: Partial<PromptRecord>, message?: string) => {
    updatePrompt(id, { ...patch, updatedAt: new Date().toISOString() });
    if (message) showToast(message);
  };

  const handleCreate = () => {
    const now = new Date().toISOString();
    const prompt: PromptRecord = {
      id: `pl-local-${Date.now()}`,
      title: "Новый промпт",
      body: "",
      tags: ["draft"],
      favorite: false,
      sourceHost: "opten.local",
      sourceTitle: "Ручное добавление",
      useCount: 0,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    };
    setPrompts((current) => [prompt, ...current]);
    setFilter("all");
    setSelectedId(prompt.id);
    setEditorMode("edit");
    showToast("Новый промпт создан");
  };

  const handleCopy = async (prompt: PromptRecord) => {
    const ok = await copyText(prompt.body);
    if (!ok) {
      showToast("Промпт пуст или буфер недоступен");
      return;
    }
    setPrompts((current) =>
      current.map((item) => (item.id === prompt.id ? { ...item, useCount: item.useCount + 1 } : item)),
    );
    showToast("Промпт скопирован");
  };

  const handleArchiveToggle = (prompt: PromptRecord) => {
    setCardMenuId(null);
    if (prompt.archivedAt) {
      touchPrompt(prompt.id, { archivedAt: null }, "Промпт восстановлен");
    } else {
      touchPrompt(prompt.id, { archivedAt: new Date().toISOString() }, "Промпт перемещен в архив");
    }
    setSelectedId(prompt.id);
  };

  const handleSave = () => {
    if (!selectedPrompt) return;
    const nextTags = parseTags(draftTags);
    touchPrompt(
      selectedPrompt.id,
      {
        title: draftTitle.trim() || "Без названия",
        body: draftBody.slice(0, MAX_BODY_CHARS),
        tags: nextTags.length ? nextTags : ["draft"],
      },
      "Изменения сохранены",
    );
    setEditorMode("view");
    setQuickTitlesOpen(false);
  };

  const handleStartEdit = () => {
    if (!selectedPrompt) return;
    setDraftTitle(selectedPrompt.title);
    setDraftBody(selectedPrompt.body);
    setDraftTags(selectedPrompt.tags.join(", "));
    setEditorMode("edit");
    setQuickTitlesOpen(false);
  };

  const handleCancelEdit = () => {
    if (!selectedPrompt) return;
    setDraftTitle(selectedPrompt.title);
    setDraftBody(selectedPrompt.body);
    setDraftTags(selectedPrompt.tags.join(", "));
    setEditorMode("view");
    setQuickTitlesOpen(false);
  };

  const empty = search.trim()
    ? {
        title: "Ничего не найдено",
        body: "Попробуй другое название, тег или фрагмент промпта.",
      }
    : filter === "archive"
      ? { title: "Архив пуст" }
      : {
          title: "Пока нет сохраненных промптов",
          body: "В расширении: выдели текст - ПКМ - Сохранить в Opten.",
        };
  const filterTitle = filter === "all" ? "Все промпты" : FILTERS.find((item) => item.value === filter)?.label ?? "Промпты";
  const filterCountLabel = filter === "all" ? `${filteredPrompts.length}/${MAX_PROMPTS}` : `${filteredPrompts.length}`;

  return (
    <div className="min-h-dvh bg-[#011417] font-['PT_Root_UI',sans-serif] text-white">
      <SiteHeader variant="page" />

      <main className="relative overflow-hidden px-4 pb-10 pt-[98px] sm:px-6 lg:px-8 lg:pt-[112px]">
        <div
          aria-hidden="true"
          className="opten-figma-gradient"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col gap-4">
          <section className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-['Unbounded',sans-serif] text-[30px] font-bold leading-tight text-white sm:text-[38px]">
              Библиотека промптов
            </h1>
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-5 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 sm:w-auto"
            >
              <Plus size={16} aria-hidden="true" />
              Добавить промпт
            </button>
          </section>

          <section>
            <label className="relative block">
              <span className="sr-only">Поиск промптов</span>
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Найти промпт, тег или источник..."
                className="h-[54px] w-full rounded-[9px] border border-white/10 bg-[#081d1f] pl-10 pr-16 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-[6px] border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-white/42 sm:inline-flex">
                Ctrl K
              </span>
            </label>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#071c1f]/90 lg:h-[calc(100dvh-298px)] lg:min-h-[520px]">
              <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold leading-tight text-white">
                    {filterTitle} <span className="text-white/50">({filterCountLabel})</span>
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1 rounded-[9px] border border-white/10 bg-[#0d2528] p-1" role="group" aria-label="Фильтр">
                  {FILTERS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      aria-pressed={filter === item.value}
                      className={cx(
                        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[7px] px-3 text-[12px] outline-none ring-0 transition focus:ring-0 focus-visible:ring-1 focus-visible:ring-[#9cfb51]/45",
                        filter === item.value
                          ? "bg-[#9cfb51] text-[#011417]"
                          : "text-white/58 hover:bg-white/[0.06] hover:text-white",
                      )}
                    >
                      {item.value === "favorite" && <Star size={12} fill={filter === "favorite" ? "currentColor" : "none"} aria-hidden="true" />}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                data-prompt-list
                className="opten-demo-scrollbar flex min-h-0 flex-1 flex-col gap-2 p-2 md:overflow-y-auto md:pr-1"
              >
                {filteredPrompts.length === 0 ? (
                  <EmptyState title={empty.title} body={empty.body} />
                ) : (
                  filteredPrompts.map((prompt) => {
                    const selected = prompt.id === selectedId;
                    const archived = Boolean(prompt.archivedAt);
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
                          selected
                            ? "border-[#9cfb51]/42 bg-[#9cfb51]/7"
                            : "border-white/8 bg-white/[0.035] hover:border-white/16 hover:bg-white/[0.055]",
                        )}
                      >
                        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2.5 sm:gap-3">
                          <button
                            type="button"
                            data-action="favorite"
                            onClick={(event) => {
                              event.stopPropagation();
                              touchPrompt(prompt.id, { favorite: !prompt.favorite }, prompt.favorite ? "Убрано из избранного" : "Добавлено в избранное");
                            }}
                            aria-label={prompt.favorite ? "Убрать из избранного" : "Добавить в избранное"}
                            className={cx(
                              "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60",
                              prompt.favorite
                                ? "border-[#9cfb51]/35 bg-[#9cfb51]/12 text-[#9cfb51]"
                                : "border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/10 hover:text-white",
                            )}
                          >
                            <Star size={16} fill={prompt.favorite ? "currentColor" : "none"} aria-hidden="true" />
                          </button>

                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                              <h3 className="truncate text-[15px] font-semibold leading-tight text-white">{prompt.title}</h3>
                              {archived && (
                                <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/45">
                                  архив
                                </span>
                              )}
                            </div>
                            <p
                              className="mt-1.5 text-[13px] leading-[1.45] text-white/50 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] [overflow:hidden]"
                            >
                              {prompt.body || "Пустой промпт"}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium text-white/45">
                              <span>
                                Добавлен: <span className="text-white/65">{formatDate(prompt.createdAt)}</span>
                              </span>
                              <span>
                                Использований: <span className="text-white/65">{prompt.useCount}</span>
                              </span>
                            </div>
                          </div>

                          <div
                            className={cx(
                              "relative flex shrink-0 items-start gap-1 opacity-100 transition",
                              cardMenuId === prompt.id
                                ? "sm:opacity-100"
                                : "sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
                            )}
                          >
                            <button
                              type="button"
                              data-action="copy"
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleCopy(prompt);
                              }}
                              aria-label="Копировать"
                              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60"
                            >
                              <Copy size={16} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              data-action="menu"
                              onClick={(event) => {
                                event.stopPropagation();
                                setCardMenuId((current) => (current === prompt.id ? null : prompt.id));
                              }}
                              aria-expanded={cardMenuId === prompt.id}
                              aria-label="Открыть действия"
                              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60"
                            >
                              <MoreHorizontal size={16} aria-hidden="true" />
                            </button>
                            {cardMenuId === prompt.id && (
                              <div
                                className="absolute right-0 top-10 z-30 w-[176px] rounded-[10px] border border-white/10 bg-[#0b2023] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleArchiveToggle(prompt)}
                                  className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-[8px] px-3 text-left text-[13px] text-white/70 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/50"
                                >
                                  {archived ? <ArchiveRestore size={15} aria-hidden="true" /> : <Archive size={15} aria-hidden="true" />}
                                  {archived ? "Восстановить" : "Архивировать"}
                                </button>
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

            <aside className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#071c1f]/95 lg:sticky lg:top-[96px] lg:h-[calc(100dvh-298px)] lg:min-h-[520px] lg:overflow-hidden">
              {selectedPrompt ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-[15px] font-semibold leading-tight text-white">
                        {selectedPrompt.title}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => touchPrompt(selectedPrompt.id, { favorite: !selectedPrompt.favorite }, selectedPrompt.favorite ? "Убрано из избранного" : "Добавлено в избранное")}
                      aria-label={selectedPrompt.favorite ? "Убрать из избранного" : "Добавить в избранное"}
                      className={cx(
                        "grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60",
                        selectedPrompt.favorite
                          ? "border-[#9cfb51]/40 bg-[#9cfb51]/12 text-[#9cfb51]"
                          : "border-white/10 bg-white/[0.04] text-white/55 hover:text-white",
                      )}
                    >
                      <Star size={15} fill={selectedPrompt.favorite ? "currentColor" : "none"} aria-hidden="true" />
                    </button>
                  </div>

                  {editorMode === "view" ? (
                    <div className="opten-demo-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                      <div className="opten-demo-scrollbar min-h-[190px] flex-1 overflow-y-auto rounded-[10px] border border-white/10 bg-[#0d2528] p-4">
                        <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.62] text-white">
                          {selectedPrompt.body || "Промпт пока пуст. Перейди в редактирование, чтобы добавить текст."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedPrompt.tags.map((tag) => (
                          <PromptTag key={tag}>{tag}</PromptTag>
                        ))}
                      </div>

                      <details className="rounded-[9px] border border-white/10 bg-white/[0.025] p-3 text-[13px] text-white/55">
                        <summary className="cursor-pointer select-none text-white/70 outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60">
                          Детали промпта
                        </summary>
                        <div className="mt-3 grid gap-2">
                          {selectedPrompt.sourceTitle && (
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-white/35">Контекст</span>
                              <span className="max-w-[230px] text-right text-white/72">{selectedPrompt.sourceTitle}</span>
                            </div>
                          )}
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-white/35">Создан</span>
                            <span className="text-right text-white/72">{formatFullDate(selectedPrompt.createdAt)}</span>
                          </div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-white/35">Обновлен</span>
                            <span className="text-right text-white/72">{formatFullDate(selectedPrompt.updatedAt)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleArchiveToggle(selectedPrompt)}
                            className="mt-2 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 text-[13px] text-white/68 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
                          >
                            {selectedPrompt.archivedAt ? <ArchiveRestore size={15} aria-hidden="true" /> : <Archive size={15} aria-hidden="true" />}
                            {selectedPrompt.archivedAt ? "Восстановить" : "Архивировать"}
                          </button>
                        </div>
                      </details>
                    </div>
                  ) : (
                    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
                      <div className="relative">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <label htmlFor="prompt-demo-title" className="text-[13px] font-medium text-white/70">
                            Название
                          </label>
                          <button
                            type="button"
                            onClick={() => setQuickTitlesOpen((open) => !open)}
                            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 text-[12px] text-white/62 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
                          >
                            <Sparkles size={13} className="text-[#9cfb51]/80" aria-hidden="true" />
                            AI
                          </button>
                        </div>
                        <input
                          id="prompt-demo-title"
                          value={draftTitle}
                          onChange={(event) => setDraftTitle(event.target.value)}
                          className="h-11 w-full rounded-[9px] border border-white/10 bg-[#0d2528] px-3 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15"
                          placeholder="Название промпта"
                        />
                        {quickTitlesOpen && (
                          <div className="absolute right-0 top-[74px] z-20 grid w-full gap-1.5 rounded-[10px] border border-white/10 bg-[#0b2023] p-2 shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
                            {titleSuggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                  setDraftTitle(suggestion);
                                  setQuickTitlesOpen(false);
                                }}
                                className="cursor-pointer rounded-[8px] px-3 py-2 text-left text-[13px] text-white/70 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/50"
                              >
                                <span className="line-clamp-1 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <label className="flex min-h-0 flex-1 flex-col gap-2">
                        <span className="text-[13px] font-medium text-white/70">Промпт</span>
                        <textarea
                          value={draftBody}
                          onChange={(event) => setDraftBody(event.target.value.slice(0, MAX_BODY_CHARS))}
                          className="opten-demo-scrollbar min-h-[220px] flex-1 resize-none overflow-y-auto rounded-[9px] border border-white/10 bg-[#0d2528] px-3 py-3 text-[14px] leading-[1.55] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15"
                          placeholder="Текст промпта"
                        />
                        <span className="text-right text-[12px] text-white/35">
                          {draftBody.length} / {MAX_BODY_CHARS}
                        </span>
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-[13px] font-medium text-white/70">Теги</span>
                        <input
                          value={draftTags}
                          onChange={(event) => setDraftTags(event.target.value)}
                          className="h-11 rounded-[9px] border border-white/10 bg-[#0d2528] px-3 text-[14px] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15"
                          placeholder="video, product, freepik"
                        />
                        <span className="text-right text-[12px] text-white/35">
                          {parseTags(draftTags).length} / {MAX_TAGS}
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="shrink-0 border-t border-white/10 bg-[#071c1f]/98 p-3">
                    {editorMode === "view" ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedPrompt)}
                          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-4 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
                        >
                          <Copy size={16} aria-hidden="true" />
                          Копировать
                        </button>
                        <button
                          type="button"
                          onClick={handleStartEdit}
                          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[14px] text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
                        >
                          <Pencil size={16} aria-hidden="true" />
                          Редактировать
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={handleSave}
                          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-4 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
                        >
                          <Save size={16} aria-hidden="true" />
                          Сохранить
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[14px] text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60"
                        >
                          Отменить
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <EmptyState title="Промпт не выбран" />
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
