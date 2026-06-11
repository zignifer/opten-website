import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Link as LinkIcon,
  Play,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import { useLang } from "../../../i18n/LangContext";
import LocalizedLink from "../../components/LocalizedLink";
import { LearnSectionWrapper } from "../../components/space/learn/LearnComponents";
import {
  findLearnFind,
  getLearnFindDescription,
  getLearnFindRisks,
  getLearnFindSourceLabel,
  getLearnFindSummary,
  getLearnFindTakeaways,
  getLearnFindTimestamps,
  getLearnFindTitle,
  getYoutubeThumbnailUrl,
  type LearnFind,
  type LearnFindCommand,
  type LearnFindPrompt,
  type LearnFindResource,
} from "../../../content/space/learnFinds";
import { learnTopicLabels, type LearnLang, type LearnTimestamp, type LocalizedText } from "../../../content/space/learn";

export default function LearnFindDetailPage() {
  const { findSlug } = useParams();
  const { lang } = useLang();
  const find = findLearnFind(findSlug);

  if (!find) return <Navigate to={lang === "en" ? "/en/learn" : "/learn"} replace />;

  return <LearnFindDetail find={find} lang={lang} />;
}

function LearnFindDetail({ find, lang }: { find: LearnFind; lang: LearnLang }) {
  const copy = detailCopy[lang];
  const [startSeconds, setStartSeconds] = useState(0);
  const [playRequestId, setPlayRequestId] = useState(0);

  const selectTimestamp = (seconds: number) => {
    setStartSeconds(seconds);
    setPlayRequestId((current) => current + 1);
  };

  return (
    <LearnSectionWrapper>
      <nav className="mb-[24px] flex flex-wrap items-center gap-[9px] text-[14px] text-white/68" aria-label={copy.breadcrumb}>
        <LocalizedLink to="/learn" className="text-white/68 no-underline hover:text-white">
          {copy.learn}
        </LocalizedLink>
        <span className="text-white/28">/</span>
        <LocalizedLink to="/learn" className="text-white/68 no-underline hover:text-white">
          {copy.finds}
        </LocalizedLink>
        <span className="text-white/28">/</span>
        <span className="font-medium text-white">{getLearnFindTitle(find, lang)}</span>
      </nav>

      <section className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-[24px] max-lg:grid-cols-1">
        <div className="min-w-0">
          <FindPlayer find={find} lang={lang} startSeconds={startSeconds} playRequestId={playRequestId} />
          <section className="mt-[26px]">
            <div className="flex flex-wrap items-center gap-[10px]">
              <span className="rounded-[6px] bg-white/[0.05] px-[9px] py-[5px] text-[12px] font-medium leading-none text-white/56">
                {learnTopicLabels[lang][find.topic]}
              </span>
              <span className="rounded-[6px] bg-white/[0.05] px-[9px] py-[5px] text-[12px] font-medium leading-none text-white/56">
                {getLearnFindSourceLabel(find, lang)}
              </span>
            </div>
            <h1 className="mt-[18px] max-w-[820px] text-[30px] font-bold leading-[1.14] text-white max-md:text-[25px]">
              {getLearnFindTitle(find, lang)}
            </h1>
            <p className="mt-[18px] max-w-[820px] pb-[20px] text-[14px] leading-[1.6] text-white/70">
              {getLearnFindDescription(find, lang)}
            </p>
          </section>

          <TextCard title={copy.shortSummary}>
            <div className="space-y-[12px]">
              {getLearnFindSummary(find, lang).map((item) => (
                <p key={item} className="text-[14px] leading-[1.62] text-white/70">
                  {item}
                </p>
              ))}
            </div>
          </TextCard>

          <ListCard title={copy.takeaways} items={getLearnFindTakeaways(find, lang)} icon="check" />

          {find.commands.length > 0 && (
            <section className="mt-[34px] max-w-[820px]">
              <h2 className="text-[22px] font-bold leading-tight text-white">{copy.commands}</h2>
              <div className="mt-[14px] space-y-[12px]">
                {find.commands.map((command) => (
                  <CommandBlock key={`${localize(command.title, lang)}-${command.code}`} command={command} lang={lang} />
                ))}
              </div>
            </section>
          )}

          {find.prompts.length > 0 && (
            <section className="mt-[34px] max-w-[820px]">
              <h2 className="text-[22px] font-bold leading-tight text-white">{copy.prompts}</h2>
              <div className="mt-[14px] space-y-[12px]">
                {find.prompts.map((prompt) => (
                  <PromptBlock key={`${localize(prompt.title, lang)}-${prompt.text.slice(0, 24)}`} prompt={prompt} lang={lang} />
                ))}
              </div>
            </section>
          )}

          <ResourcesCard resources={find.resources} lang={lang} />
          <ListCard title={copy.risks} items={getLearnFindRisks(find, lang)} icon="warning" />
        </div>

        <aside className="flex min-w-0 flex-col gap-[16px] lg:sticky lg:top-[88px]">
          <SourceCard find={find} lang={lang} />
          <TimestampCard timestamps={getLearnFindTimestamps(find, lang)} onSelect={selectTimestamp} copy={copy} />
        </aside>
      </section>
    </LearnSectionWrapper>
  );
}

function FindPlayer({
  find,
  lang,
  startSeconds,
  playRequestId,
}: {
  find: LearnFind;
  lang: LearnLang;
  startSeconds: number;
  playRequestId: number;
}) {
  const copy = detailCopy[lang];
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    setActivated(false);
  }, [find.slug]);

  useEffect(() => {
    if (playRequestId > 0) setActivated(true);
  }, [playRequestId]);

  return (
    <section className="overflow-hidden rounded-[8px] border border-white/12 bg-[#0e2023] shadow-[0_18px_56px_rgba(0,0,0,0.24)]">
      <div className="relative aspect-video overflow-hidden bg-[#06191c]">
        {!activated ? (
          <>
            <img
              src={getYoutubeThumbnailUrl(find.youtubeId)}
              alt=""
              width="1280"
              height="720"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover opacity-90"
              onError={(event) => {
                const image = event.currentTarget;
                if (image.dataset.fallback !== "true") {
                  image.dataset.fallback = "true";
                  image.src = getYoutubeThumbnailUrl(find.youtubeId, "hq");
                }
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,20,23,0.06),rgba(1,20,23,0.46))]" />
            <button
              type="button"
              onClick={() => setActivated(true)}
              className="absolute inset-0 grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9cfb51]/80"
              aria-label={copy.play}
            >
              <span className="grid size-[76px] place-items-center rounded-full bg-[#9cfb51] text-[#011417] shadow-[0_16px_48px_rgba(156,251,81,0.26)] transition duration-200 hover:scale-[1.04] hover:bg-[#8ff144]">
                <Play size={30} fill="currentColor" strokeWidth={2.4} className="ml-[3px]" />
              </span>
            </button>
          </>
        ) : (
          <iframe
            key={`${find.youtubeId}-${startSeconds}-${playRequestId}`}
            src={getYoutubeEmbedUrl(find.youtubeId, lang, startSeconds, true)}
            title={getLearnFindTitle(find, lang)}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </section>
  );
}

function getYoutubeEmbedUrl(youtubeId: string, uiLanguage: LearnLang, startSeconds: number, autoplay: boolean) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    iv_load_policy: "3",
    hl: uiLanguage,
  });

  if (autoplay) params.set("autoplay", "1");
  if (startSeconds > 0) params.set("start", String(startSeconds));
  if (typeof window !== "undefined") params.set("origin", window.location.origin);

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}

function TextCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-[34px] max-w-[820px] rounded-[8px] border border-white/10 bg-[#0e2023]/92 px-[18px] py-[18px]">
      <h2 className="text-[22px] font-bold leading-tight text-white">{title}</h2>
      <div className="mt-[14px]">{children}</div>
    </section>
  );
}

function ListCard({ title, items, icon }: { title: string; items: string[]; icon: "check" | "warning" }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-[34px] max-w-[820px]">
      <h2 className="text-[22px] font-bold leading-tight text-white">{title}</h2>
      <div className="mt-[14px] grid gap-[10px]">
        {items.map((item) => (
          <div key={item} className="grid grid-cols-[28px_minmax(0,1fr)] gap-[10px] rounded-[8px] border border-white/10 bg-[#0e2023]/92 px-[14px] py-[12px]">
            <span className={`mt-[1px] grid size-[24px] place-items-center rounded-full ${icon === "check" ? "bg-[#9cfb51]/12 text-[#9cfb51]" : "bg-amber-300/10 text-amber-200"}`}>
              {icon === "check" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
            </span>
            <p className="text-[14px] leading-[1.5] text-white/70">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommandBlock({ command, lang }: { command: LearnFindCommand; lang: LearnLang }) {
  return (
    <CopyBlock
      icon={<Terminal size={17} />}
      title={localize(command.title, lang)}
      value={command.code}
      note={command.note ? localize(command.note, lang) : ""}
    />
  );
}

function PromptBlock({ prompt, lang }: { prompt: LearnFindPrompt; lang: LearnLang }) {
  return (
    <CopyBlock
      icon={<Clipboard size={17} />}
      title={localize(prompt.title, lang)}
      value={prompt.text}
      note={prompt.note ? localize(prompt.note, lang) : ""}
    />
  );
}

function CopyBlock({ icon, title, value, note }: { icon: ReactNode; title: string; value: string; note?: string }) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]/92">
      <div className="flex items-center justify-between gap-[12px] border-b border-white/8 px-[14px] py-[11px]">
        <div className="flex min-w-0 items-center gap-[9px] text-white">
          <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-white/[0.06] text-[#9cfb51]">{icon}</span>
          <h3 className="truncate text-[14px] font-bold leading-tight">{title}</h3>
        </div>
        <button
          type="button"
          onClick={copyValue}
          className="h-[32px] min-h-0 shrink-0 rounded-[7px] border border-white/10 bg-white/[0.055] px-[10px] text-[12px] font-bold text-white/76 transition hover:border-[#9cfb51]/45 hover:text-[#9cfb51]"
        >
          {copied ? "OK" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap px-[14px] py-[13px] text-[13px] leading-[1.5] text-white/72"><code>{value}</code></pre>
      {note && <p className="border-t border-white/8 px-[14px] py-[10px] text-[12px] leading-[1.45] text-white/45">{note}</p>}
    </article>
  );
}

function ResourcesCard({ resources, lang }: { resources: LearnFindResource[]; lang: LearnLang }) {
  const copy = detailCopy[lang];
  if (resources.length === 0) return null;

  return (
    <section className="mt-[34px] max-w-[820px]">
      <h2 className="text-[22px] font-bold leading-tight text-white">{copy.resources}</h2>
      <div className="mt-[14px] overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]/92">
        {resources.map((resource) => (
          <a
            key={`${resource.title}-${resource.href}`}
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-[12px] border-b border-white/8 px-[16px] py-[12px] text-white no-underline transition last:border-b-0 hover:bg-white/[0.045]"
          >
            <span className="grid size-[30px] place-items-center rounded-full bg-white/[0.065] text-white/76">
              <LinkIcon size={17} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-medium leading-tight text-white">{resource.title}</span>
              <span className="mt-[4px] block text-[12px] leading-tight text-white/42">{resource.kind}</span>
            </span>
            <ExternalLink size={16} className="text-white/42" />
          </a>
        ))}
      </div>
    </section>
  );
}

function SourceCard({ find, lang }: { find: LearnFind; lang: LearnLang }) {
  const copy = detailCopy[lang];

  return (
    <section className="rounded-[8px] border border-white/10 bg-[#0e2023]/92 px-[20px] py-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
      <p className="text-[13px] font-medium leading-tight text-white/42">{copy.sourceType}</p>
      <h2 className="mt-[14px] text-[20px] font-bold leading-[1.2] text-white">{getLearnFindSourceLabel(find, lang)}</h2>
      <p className="mt-[10px] text-[13px] leading-[1.45] text-white/58">{copy.sourceNote}</p>
      <a
        href={find.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-[18px] flex h-[40px] items-center justify-center gap-[8px] rounded-[8px] border border-[#9cfb51]/45 px-[14px] text-[13px] font-bold text-[#9cfb51] no-underline transition hover:bg-[#9cfb51]/10"
      >
        {copy.openOriginal}
        <ExternalLink size={15} />
      </a>
    </section>
  );
}

function TimestampCard({
  timestamps,
  onSelect,
  copy,
}: {
  timestamps: LearnTimestamp[];
  onSelect: (seconds: number) => void;
  copy: (typeof detailCopy)[keyof typeof detailCopy];
}) {
  return (
    <section className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0e2023]/92">
      <div className="flex h-[52px] items-end border-b border-white/8 px-[16px]">
        <h2 className="relative h-[52px] min-w-[116px] px-[10px] pt-[18px] text-[14px] font-bold text-white">
          {copy.timestamps}
          <span className="absolute inset-x-[10px] bottom-0 h-[2px] rounded-full bg-[#9cfb51]" />
        </h2>
      </div>
      <div className="max-h-[720px] overflow-y-auto p-[8px]">
        {timestamps.map((timestamp) => (
          <button
            key={`${timestamp.time}-${timestamp.title}`}
            type="button"
            onClick={() => onSelect(timestamp.seconds)}
            className="group grid w-full cursor-pointer grid-cols-[52px_minmax(0,1fr)] gap-[10px] rounded-[8px] border-0 bg-transparent px-[10px] py-[11px] text-left transition hover:bg-white/[0.045] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]/70"
          >
            <span className="mt-[1px] font-mono text-[13px] font-bold leading-tight text-[#9cfb51]">{timestamp.time}</span>
            <span className="min-w-0">
              <span className="block text-[14px] font-bold leading-[1.35] text-white group-hover:text-[#9cfb51]">{timestamp.title}</span>
              <span className="mt-[4px] block text-[12px] leading-[1.35] text-white/48">{timestamp.description}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function localize(value: LocalizedText, lang: LearnLang) {
  return value[lang] ?? value.ru;
}

const detailCopy = {
  ru: {
    breadcrumb: "Навигация по находке",
    learn: "Курсы",
    finds: "Находки",
    play: "Смотреть видео",
    shortSummary: "Коротко",
    takeaways: "Что забрать",
    commands: "Команды и настройки",
    prompts: "Промпты",
    resources: "Файлы и ссылки",
    risks: "Подводные камни",
    sourceType: "Источник",
    sourceNote: "Это чужое YouTube-видео. Opten добавляет краткий конспект, тайм-коды и рабочие артефакты, но не перезаливает ролик.",
    openOriginal: "Открыть оригинал",
    timestamps: "Тайм-коды",
  },
  en: {
    breadcrumb: "Find navigation",
    learn: "Courses",
    finds: "Finds",
    play: "Play video",
    shortSummary: "Short summary",
    takeaways: "What to take",
    commands: "Commands and settings",
    prompts: "Prompts",
    resources: "Files and links",
    risks: "Pitfalls",
    sourceType: "Source",
    sourceNote: "This is a third-party YouTube video. Opten adds a concise summary, timestamps, and practical artifacts without re-uploading the video.",
    openOriginal: "Open original",
    timestamps: "Timestamps",
  },
} as const;
