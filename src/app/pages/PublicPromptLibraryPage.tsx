import { useEffect, useMemo, useState } from "react";
import { Check, Clock, Library, LogIn, RefreshCw, Save, Search, SortAsc } from "lucide-react";
import { useLocation, useParams } from "react-router";
import { useLang } from "../../i18n/LangContext";
import {
  PromptLibraryApiError,
  fetchPublicPromptLibrary,
  savePublicPromptToLibrary,
  type PublicPromptLibraryItem,
  type PublicPromptLibrarySnapshot,
} from "../../lib/promptLibraryApi";
import { readSession, refreshSessionIfNeeded, type OptenSession } from "../../lib/optenAuth";
import SiteHeader from "../components/SiteHeader";

type SortMode = "recent" | "az";

const TEXT = {
  ru: {
    title: "Библиотека промптов",
    publicLabel: "Публичная",
    libraryId: "ID библиотеки",
    search: "Найти промпт или тег...",
    searchLabel: "Поиск промптов",
    sortRecent: "Недавно добавленные",
    sortAz: "A-Z",
    allPrompts: "Все промпты",
    save: "Сохранить",
    saveCta: "Сохранить к себе в библиотеку",
    saved: "Сохранено",
    alreadySaved: "Уже есть в твоей библиотеке",
    quota: "Лимит 150 промптов уже заполнен",
    signIn: "Войти, чтобы сохранить",
    loading: "Загружаем библиотеку...",
    notFoundTitle: "Публикация недоступна",
    notFoundBody: "Владелец мог снять библиотеку с публикации или ссылка введена с ошибкой.",
    emptyTitle: "В публикации пока нет промптов",
    emptySearchTitle: "Ничего не найдено",
    emptySearchBody: "Попробуй другое название, тег или фрагмент промпта.",
    noSelected: "Промпт не выбран",
    noBody: "Промпт пока пуст.",
    updated: "Обновлено",
    created: "Создан",
    prompts: "промптов",
    error: "Не удалось выполнить действие",
  },
  en: {
    title: "Prompt Library",
    publicLabel: "Public",
    libraryId: "Library ID",
    search: "Find a prompt or tag...",
    searchLabel: "Search prompts",
    sortRecent: "Recently added",
    sortAz: "A-Z",
    allPrompts: "All prompts",
    save: "Save",
    saveCta: "Save to my library",
    saved: "Saved",
    alreadySaved: "Already in your library",
    quota: "The 150-prompt limit is full",
    signIn: "Sign in to save",
    loading: "Loading library...",
    notFoundTitle: "Publication unavailable",
    notFoundBody: "The owner may have unpublished this library, or the link may be wrong.",
    emptyTitle: "This publication has no prompts yet",
    emptySearchTitle: "Nothing found",
    emptySearchBody: "Try another title, tag, or prompt fragment.",
    noSelected: "No prompt selected",
    noBody: "This prompt is empty.",
    updated: "Updated",
    created: "Created",
    prompts: "prompts",
    error: "Action failed",
  },
};

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function formatDate(value: string | null | undefined, lang: string): string {
  if (!value) return lang === "en" ? "never" : "никогда";
  const locale = lang === "en" ? "en-US" : "ru-RU";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(value));
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

function StatusPanel({ icon, title, body }: { icon?: JSX.Element; title: string; body?: string }) {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-4">
      <div className="w-full max-w-[560px] rounded-[14px] border border-white/10 bg-[#071c1f] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#9cfb51]">
          {icon ?? <Library size={22} aria-hidden="true" />}
        </div>
        <h1 className="font-['Unbounded',sans-serif] text-[26px] font-bold leading-tight text-white">{title}</h1>
        {body && <p className="mx-auto mt-3 max-w-[430px] text-[14px] leading-[1.65] text-white/55">{body}</p>}
      </div>
    </div>
  );
}

function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        "fixed bottom-5 left-1/2 z-[90] w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 rounded-full border border-[#9cfb51]/30 bg-[#0b2023] px-4 py-3 text-center text-[14px] text-white shadow-[0_18px_60px_rgba(0,0,0,0.42)] transition",
        message ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {message}
    </div>
  );
}

export default function PublicPromptLibraryPage() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const { lang } = useLang();
  const text = lang === "en" ? TEXT.en : TEXT.ru;
  const [snapshot, setSnapshot] = useState<PublicPromptLibrarySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");
  const [selectedId, setSelectedId] = useState("");
  const [session, setSession] = useState<OptenSession | null>(() => readSession());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    const existingMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const previousRobots = existingMeta?.getAttribute("content") ?? null;
    const robots = existingMeta ?? document.createElement("meta");

    document.documentElement.classList.add("opten-demo-scrollbar");
    document.body.classList.add("opten-demo-scrollbar");
    document.title = lang === "en" ? "Public Prompt Library - Opten" : "Публичная библиотека промптов - Opten";
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
    let cancelled = false;
    async function loadSnapshot() {
      if (!slug) {
        setSnapshot(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const nextSnapshot = await fetchPublicPromptLibrary(slug);
        if (!cancelled) setSnapshot(nextSnapshot);
      } catch {
        if (!cancelled) setSnapshot(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSnapshot();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    void refreshSessionIfNeeded(session).then(setSession);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const visibleItems = useMemo(() => {
    const query = normalize(search);
    const filtered = (snapshot?.items ?? []).filter((item) => {
      if (!query) return true;
      return normalize(`${item.title} ${item.body} ${item.tags.join(" ")}`).includes(query);
    });
    return filtered.sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title, lang === "en" ? "en" : "ru");
      return (a.position ?? 0) - (b.position ?? 0);
    });
  }, [lang, search, snapshot?.items, sort]);

  useEffect(() => {
    if (visibleItems.length === 0) {
      setSelectedId("");
      return;
    }
    if (visibleItems.some((item) => item.item_id === selectedId)) return;
    setSelectedId(visibleItems[0].item_id);
  }, [selectedId, visibleItems]);

  const selectedItem = visibleItems.find((item) => item.item_id === selectedId) ?? null;
  const empty = search.trim()
    ? { title: text.emptySearchTitle, body: text.emptySearchBody }
    : { title: text.emptyTitle };

  async function ensureSession(): Promise<OptenSession | null> {
    const nextSession = await refreshSessionIfNeeded(readSession());
    setSession(nextSession);
    return nextSession;
  }

  function loginForSave() {
    const next = `${location.pathname}${location.search}`;
    window.location.href = `/login?next=${encodeURIComponent(next)}`;
  }

  async function handleSave(item: PublicPromptLibraryItem) {
    if (savingId) return;
    const activeSession = await ensureSession();
    if (!activeSession) {
      loginForSave();
      return;
    }

    setSavingId(item.item_id);
    try {
      await savePublicPromptToLibrary(item.item_id, activeSession.access_token);
      setSavedIds((current) => new Set(current).add(item.item_id));
      setToast(text.saved);
    } catch (err) {
      if (err instanceof PromptLibraryApiError && err.code === "23505") {
        setSavedIds((current) => new Set(current).add(item.item_id));
        setToast(text.alreadySaved);
      } else if (err instanceof PromptLibraryApiError && err.code === "23514") {
        setToast(text.quota);
      } else {
        setToast(text.error);
      }
    } finally {
      setSavingId(null);
    }
  }

  function getSaveButtonState(item: PublicPromptLibraryItem) {
    const saved = savedIds.has(item.item_id);
    const saving = savingId === item.item_id;
    const icon = saved ? <Check size={16} aria-hidden="true" /> : session ? <Save size={16} aria-hidden="true" /> : <LogIn size={16} aria-hidden="true" />;
    const label = saved ? text.saved : session ? text.save : text.signIn;
    return { saved, saving, icon, label };
  }

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
      <Toast message={toast} />
    </div>
  );

  if (loading) {
    return pageShell(<StatusPanel title={text.loading} icon={<RefreshCw size={22} className="animate-spin" aria-hidden="true" />} />);
  }

  if (!snapshot) {
    return pageShell(<StatusPanel title={text.notFoundTitle} body={text.notFoundBody} />);
  }

  return pageShell(
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Unbounded',sans-serif] text-[30px] font-bold leading-tight text-white sm:text-[38px]">
            {text.title}
          </h1>
          <p className="mt-2 flex min-w-0 items-center gap-2 text-[13px] text-white/45">
            <span>{text.libraryId}:</span>
            <span className="truncate font-mono text-white/68">{snapshot.slug}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#9cfb51]/25 bg-[#9cfb51]/8 px-3 py-1 text-[12px] font-medium text-[#9cfb51]">
            <Library size={14} aria-hidden="true" />
            {text.publicLabel}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-medium text-white/55">
            {snapshot.item_count} {text.prompts}
          </span>
          <span className="inline-flex items-center gap-2 text-[13px] text-white/42">
            <Clock size={14} aria-hidden="true" />
            {text.updated}: {formatDate(snapshot.updated_at, lang)}
          </span>
        </div>
      </section>

      <section>
        <label className="relative block">
          <span className="sr-only">{text.searchLabel}</span>
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={text.search}
            className="h-[54px] w-full rounded-[9px] border border-white/10 bg-[#081d1f] pl-10 pr-3 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-[#9cfb51]/60 focus:ring-2 focus:ring-[#9cfb51]/15"
          />
        </label>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#071c1f]/90 lg:h-[calc(100dvh-320px)] lg:min-h-[520px]">
          <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-[15px] font-semibold leading-tight text-white">
              {text.allPrompts} <span className="text-white/50">({visibleItems.length})</span>
            </h2>
            <div className="flex flex-wrap gap-1 rounded-[9px] border border-white/10 bg-[#0d2528] p-1" role="group" aria-label="Sort">
              {(["recent", "az"] as SortMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSort(item)}
                  aria-pressed={sort === item}
                  className={cx(
                    "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[7px] px-3 text-[12px] outline-none ring-0 transition focus:ring-0 focus-visible:ring-1 focus-visible:ring-[#9cfb51]/45",
                    sort === item ? "bg-[#9cfb51] text-[#011417]" : "text-white/58 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  <SortAsc size={12} aria-hidden="true" />
                  {item === "recent" ? text.sortRecent : text.sortAz}
                </button>
              ))}
            </div>
          </div>

          <div className="opten-demo-scrollbar flex min-h-0 flex-1 flex-col gap-2 p-2 md:overflow-y-auto md:pr-1">
            {visibleItems.length === 0 ? (
              <EmptyState title={empty.title} body={empty.body} />
            ) : (
              visibleItems.map((item) => {
                const selected = item.item_id === selectedId;
                const buttonState = getSaveButtonState(item);
                return (
                  <article
                    key={item.item_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedId(item.item_id)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      setSelectedId(item.item_id);
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
                          void handleSave(item);
                        }}
                        disabled={buttonState.saved || buttonState.saving}
                        aria-label={buttonState.label}
                        title={buttonState.label}
                        className={cx(
                          "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/60 disabled:cursor-default",
                          buttonState.saved
                            ? "border-[#9cfb51]/35 bg-[#9cfb51]/12 text-[#9cfb51]"
                            : "border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        {buttonState.saving ? <RefreshCw size={16} className="animate-spin" aria-hidden="true" /> : buttonState.icon}
                      </button>

                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-semibold leading-tight text-white">{item.title}</h3>
                        <p className="mt-1.5 text-[13px] leading-[1.45] text-white/50 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] [overflow:hidden]">
                          {item.body || text.noBody}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium text-white/45">
                          <span>{text.created}: <span className="text-white/65">{formatDate(item.source_created_at, lang)}</span></span>
                        </div>
                      </div>

                      <span className="hidden shrink-0 items-start pt-1 text-[12px] font-medium text-white/38 sm:inline-flex">
                        #{item.position + 1}
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <aside className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#071c1f]/95 lg:sticky lg:top-[126px] lg:h-[calc(100dvh-320px)] lg:min-h-[520px] lg:overflow-hidden">
          {selectedItem ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <h2 className="min-w-0 truncate text-[15px] font-semibold leading-tight text-white">{selectedItem.title}</h2>
                <button
                  type="button"
                  onClick={() => void handleSave(selectedItem)}
                  disabled={getSaveButtonState(selectedItem).saved || getSaveButtonState(selectedItem).saving}
                  aria-label={getSaveButtonState(selectedItem).label}
                  title={getSaveButtonState(selectedItem).label}
                  className={cx(
                    "grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 disabled:cursor-default",
                    getSaveButtonState(selectedItem).saved
                      ? "border-[#9cfb51]/40 bg-[#9cfb51]/12 text-[#9cfb51]"
                      : "border-white/10 bg-white/[0.04] text-white/55 hover:text-white",
                  )}
                >
                  {getSaveButtonState(selectedItem).saving ? <RefreshCw size={15} className="animate-spin" aria-hidden="true" /> : getSaveButtonState(selectedItem).icon}
                </button>
              </div>

              <div className="opten-demo-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="opten-demo-scrollbar min-h-[190px] flex-1 overflow-y-auto rounded-[10px] border border-white/10 bg-[#0d2528] p-4">
                  <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.62] text-white">{selectedItem.body || text.noBody}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => <PromptTag key={tag}>{tag}</PromptTag>)}
                </div>
              </div>

              <div className="shrink-0 border-t border-white/10 bg-[#071c1f]/98 p-3">
                {(() => {
                  const buttonState = getSaveButtonState(selectedItem);
                  return (
                    <button
                      type="button"
                      onClick={() => void handleSave(selectedItem)}
                      disabled={buttonState.saved || buttonState.saving}
                      className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9cfb51] px-4 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 disabled:cursor-default disabled:opacity-60"
                    >
                      {buttonState.saving ? <RefreshCw size={16} className="animate-spin" aria-hidden="true" /> : buttonState.icon}
                      {buttonState.saved || !session ? buttonState.label : text.saveCta}
                    </button>
                  );
                })()}
              </div>
            </>
          ) : (
            <EmptyState title={text.noSelected} />
          )}
        </aside>
      </section>
    </div>,
  );
}
