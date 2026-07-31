import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  Braces,
  Check,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FileText,
  GitBranch,
  Layers3,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchAdminContentMachine,
  type ContentMachinePipeline,
  type ContentMachineSnapshot,
} from "../../../lib/adminContentMachine";

const sections = [
  { id: "overview", label: "Обзор", icon: Boxes },
  { id: "pipelines", label: "Пайплайны", icon: Workflow },
  { id: "formats", label: "Форматы", icon: Layers3 },
  { id: "sources", label: "Источники", icon: BookOpen },
  { id: "metrics", label: "Метрики", icon: BarChart3 },
  { id: "graph", label: "Связи", icon: GitBranch },
] as const;

type SectionId = (typeof sections)[number]["id"];

export function AdminContentMachine({ accessToken }: { accessToken: string }) {
  const [snapshot, setSnapshot] = useState<ContentMachineSnapshot | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [section, setSection] = useState<SectionId>(() => readSection());

  async function load() {
    setState("loading");
    setError("");
    try {
      setSnapshot(await fetchAdminContentMachine(accessToken));
      setState("ready");
    } catch {
      setError("Не удалось загрузить защищённый snapshot контент-машины.");
      setState("error");
    }
  }

  useEffect(() => {
    void load();
  }, [accessToken]);

  function chooseSection(next: SectionId) {
    setSection(next);
    const url = new URL(window.location.href);
    url.searchParams.set("view", "content");
    url.searchParams.set("section", next);
    window.history.replaceState(null, "", url);
  }

  if (state === "loading" || !snapshot) {
    return <MachineState icon={<RefreshCw className="animate-spin" size={22} />} title="Собираем карту контента" />;
  }
  if (state === "error") {
    return (
      <MachineState
        icon={<CircleAlert size={22} />}
        title="Snapshot недоступен"
        description={error}
        action={<button type="button" onClick={() => void load()} className={primaryButton}>Повторить</button>}
      />
    );
  }

  return (
    <section className="flex flex-col gap-[18px]">
      <div className="relative overflow-hidden rounded-[10px] border border-[#17302d] bg-[#061514] px-[18px] py-[20px] text-white md:px-[24px] md:py-[26px]">
        <div className="pointer-events-none absolute right-[-90px] top-[-120px] h-[300px] w-[300px] rounded-full border border-[#9cfb51]/20" />
        <div className="pointer-events-none absolute right-[30px] top-[18px] grid grid-cols-5 gap-[8px] opacity-35">
          {Array.from({ length: 20 }).map((_, index) => <span key={index} className="h-[3px] w-[3px] rounded-full bg-[#9cfb51]" />)}
        </div>
        <div className="relative max-w-[760px]">
          <div className="mb-[10px] inline-flex items-center gap-[7px] rounded-full border border-[#9cfb51]/35 bg-[#9cfb51]/10 px-[10px] py-[5px] text-[12px] font-semibold text-[#c7ffa0]">
            <ShieldCheck size={14} />
            Только чтение · private source
          </div>
          <h1 className="m-0 font-['Unbounded',sans-serif] text-[28px] font-semibold leading-[1.1] md:text-[38px]">Контент-машина</h1>
          <p className="m-0 mt-[12px] max-w-[690px] text-[15px] leading-[1.55] text-white/70">
            Живая карта того, как идея проходит через ресёрч, формат, авторский источник, CTA,
            проверку качества и возвращается в следующий цикл через метрики.
          </p>
        </div>
        <div className="relative mt-[18px] flex flex-wrap gap-[8px] text-[12px] text-white/62">
          <StatusPill label={`Синхронизация ${formatDateTime(snapshot.generatedAt)}`} />
          <StatusPill label={`${snapshot.overview.graphNodes.toLocaleString("ru-RU")} узлов Graphify`} />
          <StatusPill label={`${snapshot.overview.creators} каналов в watchlist`} />
        </div>
      </div>

      {snapshot.freshness.warnings.map((warning) => (
        <div key={warning.code} className="flex items-start gap-[10px] rounded-[8px] border border-[#ebd5a6] bg-[#fff9e9] px-[13px] py-[11px] text-[#705315]">
          <CircleAlert className="mt-[1px] shrink-0" size={17} />
          <p className="m-0 text-[13px] leading-[1.45]">{warning.message} В графиках дата всегда показана явно.</p>
        </div>
      ))}

      <nav aria-label="Разделы контент-машины" className="overflow-x-auto rounded-[8px] border border-[#dce4d9] bg-white p-[5px]">
        <div className="flex min-w-max gap-[4px]">
          {sections.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseSection(item.id)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-[42px] cursor-pointer items-center gap-[8px] rounded-[7px] px-[13px] text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75c83f] ${active ? "bg-[#102421] text-white" : "bg-transparent text-[#51625c] hover:bg-[#f0f4ec] hover:text-[#13201e]"}`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {section === "overview" ? <Overview snapshot={snapshot} onOpen={chooseSection} /> : null}
      {section === "pipelines" ? <Pipelines snapshot={snapshot} /> : null}
      {section === "formats" ? <Formats snapshot={snapshot} /> : null}
      {section === "sources" ? <Sources snapshot={snapshot} /> : null}
      {section === "metrics" ? <Metrics snapshot={snapshot} /> : null}
      {section === "graph" ? <GraphView snapshot={snapshot} /> : null}
    </section>
  );
}

function Overview({ snapshot, onOpen }: { snapshot: ContentMachineSnapshot; onOpen: (section: SectionId) => void }) {
  const stats = [
    { label: "Маршрутов", value: snapshot.overview.pipelines, icon: Workflow, section: "pipelines" as const },
    { label: "Форматов", value: snapshot.overview.formats, icon: Layers3, section: "formats" as const },
    { label: "Skills", value: snapshot.overview.skills, icon: Braces, section: "sources" as const },
    { label: "Связей", value: snapshot.overview.graphEdges, icon: GitBranch, section: "graph" as const },
  ];
  return (
    <div className="grid gap-[16px]">
      <div className="grid gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, section }) => (
          <button key={label} type="button" onClick={() => onOpen(section)} className="group flex min-h-[112px] cursor-pointer items-start justify-between rounded-[8px] border border-[#dce4d9] bg-white p-[15px] text-left transition hover:border-[#a8bd9e] hover:shadow-[0_6px_20px_rgba(20,45,37,0.07)]">
            <div>
              <p className="m-0 text-[13px] font-medium text-[#60716a]">{label}</p>
              <p className="m-0 mt-[11px] text-[32px] font-semibold leading-none text-[#0d1715]">{value.toLocaleString("ru-RU")}</p>
            </div>
            <span className="grid h-[36px] w-[36px] place-items-center rounded-[8px] bg-[#eaffdc] text-[#315d24]"><Icon size={18} /></span>
          </button>
        ))}
      </div>

      <div className="grid gap-[16px] lg:grid-cols-[1.25fr_0.75fr]">
        <Panel eyebrow="Логика производства" title="Одна идея — одна задача — один измеримый результат">
          <p className="m-0 text-[14px] leading-[1.6] text-[#52635d]">{snapshot.overview.positioning.oneLiner.split("\n")[0]}</p>
          <div className="mt-[16px] grid gap-[8px]">
            {snapshot.overview.positioning.tasks.map((task) => (
              <div key={task["Задача"]} className="grid gap-[3px] rounded-[7px] border border-[#e1e8de] bg-[#f8faf6] p-[11px] sm:grid-cols-[100px_1fr] sm:gap-[12px]">
                <strong className="text-[13px] text-[#16231f]">{task["Задача"]}</strong>
                <span className="text-[13px] leading-[1.45] text-[#66766f]">{task["Результат публикации"]}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel eyebrow="Библиотеки" title="Навигация без текста из головы">
          <div className="grid gap-[10px] sm:grid-cols-2 lg:grid-cols-1">
            <MiniMetric icon={Sparkles} value={snapshot.sourceLibraries.hookFormulas} label="формул хуков" />
            <MiniMetric icon={Target} value={snapshot.sourceLibraries.hookFamilies} label="семейств хуков" />
            <MiniMetric icon={Users} value={snapshot.creators.length} label="каналов в watchlist" />
          </div>
        </Panel>
      </div>

      <Panel eyebrow="Сквозной маршрут" title="Как знания соединяются в готовый материал">
        <div className="grid gap-[8px] md:grid-cols-6">
          {["Сигнал", "Авторская опора", "Ресёрч", "Формат + хук", "CTA + QA", "72h → новый цикл"].map((label, index) => (
            <div key={label} className="relative rounded-[8px] border border-[#dfe7dc] bg-white p-[12px]">
              <span className="text-[11px] font-semibold text-[#709163]">0{index + 1}</span>
              <p className="m-0 mt-[6px] text-[13px] font-semibold leading-[1.3] text-[#18231f]">{label}</p>
              {index < 5 ? <ChevronRight className="absolute right-[-14px] top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[#9cfb51] p-[2px] text-[#10201d] md:block" size={22} /> : null}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Pipelines({ snapshot }: { snapshot: ContentMachineSnapshot }) {
  const [activeId, setActiveId] = useState("reels");
  const active = snapshot.pipelines.find((pipeline) => pipeline.id === activeId) ?? snapshot.pipelines[0];
  return (
    <div className="grid gap-[16px] lg:grid-cols-[250px_1fr]">
      <aside className="h-fit rounded-[8px] border border-[#dce4d9] bg-white p-[6px]">
        {snapshot.pipelines.map((pipeline) => (
          <button key={pipeline.id} type="button" onClick={() => setActiveId(pipeline.id)} className={`flex min-h-[46px] w-full cursor-pointer items-center justify-between rounded-[7px] px-[11px] text-left text-[13px] font-semibold transition ${pipeline.id === active.id ? "bg-[#102421] text-white" : "text-[#52635d] hover:bg-[#f0f4ec]"}`}>
            <span>{pipeline.title}</span>
            <span className={`rounded-full px-[7px] py-[2px] text-[11px] ${pipeline.id === active.id ? "bg-white/12 text-[#cfffaa]" : "bg-[#edf3e9] text-[#5e7853]"}`}>{pipeline.stages.length}</span>
          </button>
        ))}
      </aside>
      <PipelineDetail pipeline={active} />
    </div>
  );
}

function PipelineDetail({ pipeline }: { pipeline: ContentMachinePipeline }) {
  return (
    <Panel eyebrow="Производственный маршрут" title={pipeline.title}>
      <p className="m-0 max-w-[740px] text-[14px] leading-[1.55] text-[#607069]">{pipeline.purpose}</p>
      <div className="mt-[18px] grid gap-[0]">
        {pipeline.stages.map((stage, index) => (
          <article key={`${stage.id}-${index}`} className="grid grid-cols-[34px_1fr] gap-[12px]">
            <div className="flex flex-col items-center">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-full border border-[#b8d9a4] bg-[#ecffdf] text-[12px] font-bold text-[#315d24]">{index + 1}</span>
              {index < pipeline.stages.length - 1 ? <span className="h-full min-h-[36px] w-px bg-[#d8e2d5]" /> : null}
            </div>
            <div className="pb-[16px]">
              <h3 className="m-0 text-[15px] font-semibold text-[#14201d]">{stage.title}</h3>
              <p className="m-0 mt-[4px] text-[13px] leading-[1.5] text-[#62716b]">{stage.description}</p>
              <SourceLink href={stage.sourceUrl}>{stage.sourceFile}</SourceLink>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function Formats({ snapshot }: { snapshot: ContentMachineSnapshot }) {
  return (
    <div className="grid gap-[13px] lg:grid-cols-2">
      {snapshot.formats.map((format) => (
        <article key={format.id} className="rounded-[8px] border border-[#dce4d9] bg-white p-[16px]">
          <div className="flex items-start justify-between gap-[12px]">
            <div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6f8b65]">Формат</p>
              <h2 className="m-0 mt-[5px] text-[19px] font-semibold leading-tight text-[#12201d]">{format.title}</h2>
            </div>
            <span className="rounded-[6px] bg-[#ecffdf] px-[8px] py-[5px] font-mono text-[11px] text-[#315d24]">{format.validatorMode}</span>
          </div>
          <dl className="mt-[16px] grid gap-[11px]">
            <Definition term="Главный источник">{format.sourceHierarchy}</Definition>
            <Definition term="Навигация">{format.navigation}</Definition>
            <Definition term="CTA">{format.ctaPolicy}</Definition>
            <Definition term="Финальный gate">{format.finalGate}</Definition>
          </dl>
          <SourceLink href={format.sourceUrl}>{format.styleFile}</SourceLink>
        </article>
      ))}
      <article className="rounded-[8px] border border-[#17302d] bg-[#102421] p-[16px] text-white lg:col-span-2">
        <div className="flex items-center gap-[9px] text-[#bfff91]"><Target size={18} /><strong className="text-[14px]">CTA выбирается по задаче, а не по формату</strong></div>
        <div className="mt-[14px] grid gap-[9px] md:grid-cols-3">
          {snapshot.cta.byTask.map((row) => (
            <div key={row["Задача"]} className="rounded-[7px] border border-white/10 bg-white/[0.04] p-[11px]">
              <p className="m-0 text-[13px] font-semibold">{row["Задача"]}</p>
              <p className="m-0 mt-[5px] text-[12px] leading-[1.45] text-white/62">{row["Базовый CTA"]}</p>
            </div>
          ))}
        </div>
      </article>
      <div className="lg:col-span-2">
        <Panel eyebrow="CTA ladder" title="Как выбирается следующий шаг">
          <div className="grid gap-[8px] sm:grid-cols-2 lg:grid-cols-4">
            {snapshot.cta.ladder.map((row, index) => (
              <div key={row["Уровень"]} className="rounded-[7px] border border-[#dfe7dc] bg-[#fafbf8] p-[11px]">
                <span className="text-[10px] font-bold text-[#709163]">0{index + 1}</span>
                <strong className="mt-[5px] block text-[13px] text-[#17231f]">{row["Уровень"]}</strong>
                <p className="m-0 mt-[4px] text-[11px] leading-[1.4] text-[#718079]">{row["Когда использовать"]}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Sources({ snapshot }: { snapshot: ContentMachineSnapshot }) {
  const [query, setQuery] = useState("");
  const [selectedDocPath, setSelectedDocPath] = useState(snapshot.knowledgeDocuments[0]?.path || "");
  const creators = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return snapshot.creators;
    return snapshot.creators.filter((creator) => `${creator.name} ${creator.reason}`.toLowerCase().includes(needle));
  }, [query, snapshot.creators]);
  const selectedDoc = snapshot.knowledgeDocuments.find((doc) => doc.path === selectedDocPath) ?? snapshot.knowledgeDocuments[0];
  return (
    <div className="grid gap-[16px]">
      <div className="grid gap-[16px] lg:grid-cols-[0.85fr_1.15fr]">
        <Panel eyebrow="Исполнительный слой" title="Skills и проверки">
          <div className="grid gap-[8px]">
            {snapshot.skills.map((skill) => (
              <div key={skill.name} className="rounded-[7px] border border-[#e0e7dd] bg-[#fafbf8] p-[11px]">
                <div className="flex items-center justify-between gap-[8px]">
                  <strong className="text-[13px] text-[#192620]">{skill.name}</strong>
                  <SourceLink href={skill.sourceUrl} compact>SKILL.md</SourceLink>
                </div>
                <p className="m-0 mt-[6px] line-clamp-3 text-[12px] leading-[1.45] text-[#68766f]">{skill.description}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel eyebrow="Каналы и блогеры" title={`Watchlist · ${creators.length} из ${snapshot.creators.length}`}>
          <label className="mb-[12px] flex h-[42px] items-center gap-[9px] rounded-[7px] border border-[#cfd9cc] bg-white px-[11px] focus-within:border-[#75c83f] focus-within:ring-2 focus-within:ring-[#9cfb51]/20">
            <Search size={16} className="text-[#718079]" />
            <span className="sr-only">Поиск по watchlist</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти автора или механику" className="min-w-0 flex-1 border-0 bg-transparent text-[13px] outline-none placeholder:text-[#8b9892]" />
          </label>
          <div className="max-h-[440px] overflow-y-auto pr-[4px]">
            {creators.map((creator) => (
              <a key={`${creator.priority}-${creator.name}`} href={creator.url} target="_blank" rel="noreferrer" className="group grid grid-cols-[32px_1fr_18px] gap-[9px] border-b border-[#edf1ea] px-[2px] py-[10px] text-inherit no-underline last:border-0 hover:bg-[#f8faf5]">
                <span className="grid h-[26px] w-[26px] place-items-center rounded-[6px] bg-[#edf4e8] text-[11px] font-bold text-[#58774d]">{creator.priority}</span>
                <span>
                  <strong className="block text-[13px] text-[#16231f]">{creator.name}</strong>
                  <span className="mt-[3px] block text-[12px] leading-[1.4] text-[#718079]">{creator.reason}</span>
                </span>
                <ExternalLink size={14} className="mt-[5px] text-[#91a08f] group-hover:text-[#315d24]" />
              </a>
            ))}
          </div>
        </Panel>
      </div>
      <Panel eyebrow="Канонические документы" title="Откуда интерфейс получает правила">
        <div className="grid gap-[8px] sm:grid-cols-2 lg:grid-cols-3">
          {snapshot.knowledgeDocuments.map((doc) => (
            <button key={doc.path} type="button" onClick={() => setSelectedDocPath(doc.path)} className={`cursor-pointer rounded-[7px] border p-[11px] text-left transition ${doc.path === selectedDoc?.path ? "border-[#75aa61] bg-[#eff9e9] shadow-[inset_3px_0_0_#9cfb51]" : "border-[#dfe7dc] bg-white hover:border-[#9bbd8a]"}`}>
              <div className="flex items-center justify-between gap-[8px]"><FileText size={15} className="text-[#5b8150]" /><ChevronRight size={14} className="text-[#93a099]" /></div>
              <strong className="mt-[9px] block text-[13px] leading-[1.35] text-[#16231f]">{doc.title}</strong>
              <span className="mt-[4px] block text-[11px] leading-[1.4] text-[#75827d]">{doc.purpose}</span>
            </button>
          ))}
        </div>
      </Panel>
      {selectedDoc ? (
        <Panel eyebrow={selectedDoc.category} title={selectedDoc.title}>
          <div className="mb-[13px] flex flex-wrap items-center justify-between gap-[8px] border-b border-[#e2e9df] pb-[11px]">
            <code className="text-[11px] text-[#6f7d77]">{selectedDoc.path}</code>
            <SourceLink href={selectedDoc.sourceUrl} compact>Открыть источник</SourceLink>
          </div>
          <div className="grid gap-[8px]">
            {selectedDoc.sections.map((section, index) => (
              <details key={`${section.title}-${index}`} open={index === 0} className="group rounded-[7px] border border-[#dfe7dc] bg-[#fafbf8]">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-[10px] px-[12px] text-[13px] font-semibold text-[#17231f]">
                  {section.title}
                  <ChevronRight size={15} className="shrink-0 text-[#718079] transition group-open:rotate-90" />
                </summary>
                <div className="border-t border-[#e2e9df] px-[12px] py-[11px]">
                  <p className="m-0 whitespace-pre-line text-[12px] leading-[1.6] text-[#5f6f68]">{section.body}</p>
                </div>
              </details>
            ))}
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

function Metrics({ snapshot }: { snapshot: ContentMachineSnapshot }) {
  const funnel = snapshot.metrics.telegramFunnel.map((row) => ({
    label: row["Этап"],
    value: Number((row["Люди"] || "0").replace(/[^\d]/g, "")),
    conversion: row["Конверсия от предыдущего этапа"],
  }));
  const maxFunnel = Math.max(...funnel.map((item) => item.value), 1);
  return (
    <div className="grid gap-[16px]">
      <div className="grid gap-[16px] xl:grid-cols-[1.2fr_0.8fr]">
        <Panel eyebrow={`Social snapshot · ${snapshot.metrics.snapshotDate || "нет даты"}`} title="Динамика аудитории">
          <div className="h-[330px] w-full" role="img" aria-label="Линейный график подписчиков YouTube, Instagram и Telegram по датам">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshot.metrics.history} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#e7ece3" vertical={false} />
                <XAxis dataKey="date" tickFormatter={(value) => String(value).slice(5)} tick={{ fontSize: 11, fill: "#6f7d77" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6f7d77" }} domain={["dataMin - 100", "dataMax + 100"]} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#dce4d9", fontSize: 12 }} labelFormatter={(value) => `Дата: ${value}`} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Line name="YouTube" type="monotone" dataKey="youtubeSubscribers" stroke="#101f1c" strokeWidth={2.5} dot={false} />
                <Line name="Instagram" type="monotone" dataKey="instagramFollowers" stroke="#a767e8" strokeWidth={2.5} dot={false} />
                <Line name="Telegram" type="monotone" dataKey="telegramSubscribers" stroke="#70bf38" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="m-0 mt-[8px] text-[12px] leading-[1.45] text-[#75827d]">
            Текстовый итог: YouTube растёт, Instagram и Telegram требуют отдельного разбора удержания. Последняя точка — {snapshot.metrics.snapshotDate}.
          </p>
        </Panel>
        <Panel eyebrow="Telegram" title="Короткая воронка">
          <div className="grid gap-[10px]">
            {funnel.map((item) => (
              <div key={item.label}>
                <div className="mb-[5px] flex items-end justify-between gap-[8px]">
                  <span className="text-[12px] font-medium text-[#465650]">{item.label}</span>
                  <span className="text-[12px] font-semibold text-[#17231f]">{item.value} · {item.conversion}</span>
                </div>
                <div className="h-[8px] overflow-hidden rounded-full bg-[#e9eee6]"><div className="h-full rounded-full bg-[#86d74b]" style={{ width: `${Math.max((item.value / maxFunnel) * 100, 3)}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel eyebrow="Что уже измерено" title="Контентные checkpoints">
        <div className="grid gap-[9px] lg:grid-cols-2">
          {snapshot.metrics.contentPerformance.map((row) => (
            <article key={row["Платформа / ролик"]} className="rounded-[7px] border border-[#e0e7dd] bg-[#fafbf8] p-[12px]">
              <strong className="block text-[13px] leading-[1.4] text-[#17231f]">{row["Платформа / ролик"]}</strong>
              <p className="m-0 mt-[7px] text-[12px] leading-[1.45] text-[#68766f]"><b>Охват:</b> {row["Охват"]}</p>
              <p className="m-0 mt-[4px] text-[12px] leading-[1.45] text-[#68766f]"><b>Качество:</b> {row["Качество"]}</p>
              <p className="m-0 mt-[4px] text-[12px] leading-[1.45] text-[#68766f]"><b>Решение:</b> {row["Статус / следующий тест"]}</p>
            </article>
          ))}
        </div>
      </Panel>
      <div className="rounded-[8px] border border-[#d7e2d2] bg-[#eef8e9] p-[14px]">
        <div className="flex items-center gap-[8px] text-[#315d24]"><Activity size={17} /><strong className="text-[13px]">Текущий аналитический вывод</strong></div>
        <p className="m-0 mt-[8px] whitespace-pre-line text-[13px] leading-[1.55] text-[#52635b]">{snapshot.metrics.diagnosis}</p>
      </div>
    </div>
  );
}

function GraphView({ snapshot }: { snapshot: ContentMachineSnapshot }) {
  const categoryLabels: Record<string, string> = { system: "Система", style: "Стиль", research: "Ресёрч", product: "Продукт", metrics: "Метрики", skill: "Skill" };
  return (
    <div className="grid gap-[16px]">
      <div className="grid gap-[10px] sm:grid-cols-3">
        <GraphMetric label="Узлы" value={snapshot.graph.nodes} />
        <GraphMetric label="Связи" value={snapshot.graph.edges} />
        <GraphMetric label="Сообщества" value={snapshot.graph.communities} />
      </div>
      <Panel eyebrow="Graphify summary" title="Самые связанные элементы контент-машины">
        <p className="m-0 mb-[15px] text-[13px] leading-[1.5] text-[#66756f]">
          Это reader-view, а не редактор графа: показывает опорные узлы и их степень связи. Исходный Graphify остаётся в приватном репозитории.
        </p>
        <div className="grid gap-[8px] md:grid-cols-2 xl:grid-cols-3">
          {snapshot.graph.focusNodes.slice(0, 18).map((node) => (
            <article key={node.id} className="group rounded-[7px] border border-[#dfe7dc] bg-white p-[11px]">
              <div className="flex items-center justify-between gap-[10px]">
                <span className="rounded-full bg-[#edf4e8] px-[7px] py-[3px] text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5b7b50]">{categoryLabels[node.category] || node.category}</span>
                <span className="text-[11px] font-semibold text-[#82917f]">{node.degree} связей</span>
              </div>
              <strong className="mt-[9px] block text-[13px] leading-[1.35] text-[#16231f]">{node.label}</strong>
              <span className="mt-[5px] block truncate font-mono text-[10px] text-[#86928d]">{node.sourceFile}{node.sourceLocation ? ` · ${node.sourceLocation}` : ""}</span>
            </article>
          ))}
        </div>
      </Panel>
      <Panel eyebrow="Ключевая зависимость" title="Почему Reels — это не только style-файл">
        <div className="grid gap-[8px] md:grid-cols-5">
          {[
            ["Pre-write gate", "Источник и 2–5 видео"],
            ["Watchlist", "Блогеры и механики"],
            ["Hook library", "Один доказуемый вход"],
            ["Reels style", "Начитка и кадры"],
            ["CTA + metrics", "Следующий шаг и 72h"],
          ].map(([title, description], index) => (
            <div key={title} className="relative rounded-[7px] border border-[#dfe7dc] bg-[#fafbf8] p-[11px]">
              <strong className="block text-[12px] text-[#17231f]">{title}</strong>
              <span className="mt-[4px] block text-[11px] leading-[1.4] text-[#718079]">{description}</span>
              {index < 4 ? <ArrowRight size={18} className="absolute right-[-13px] top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[#9cfb51] p-[2px] text-[#10201d] md:block" /> : null}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-[8px] border border-[#dce4d9] bg-white p-[16px]">
      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6f8b65]">{eyebrow}</p>
      <h2 className="m-0 mt-[5px] mb-[14px] text-[20px] font-semibold leading-tight text-[#12201d]">{title}</h2>
      {children}
    </section>
  );
}

function Definition({ term, children }: { term: string; children: ReactNode }) {
  return <div><dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#72817b]">{term}</dt><dd className="m-0 mt-[4px] text-[13px] leading-[1.48] text-[#4f615a]">{children}</dd></div>;
}

function SourceLink({ href, children, compact = false }: { href: string; children: ReactNode; compact?: boolean }) {
  return <a href={href} target="_blank" rel="noreferrer" className={`mt-[8px] inline-flex items-center gap-[5px] font-mono text-[#497a3b] underline decoration-[#a8ca9d] underline-offset-2 hover:text-[#244d1c] ${compact ? "text-[10px]" : "text-[11px]"}`}>{children}<ExternalLink size={compact ? 11 : 12} /></a>;
}

function MiniMetric({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) {
  return <div className="flex items-center gap-[10px] rounded-[7px] border border-[#e0e7dd] bg-[#fafbf8] p-[11px]"><span className="grid h-[32px] w-[32px] place-items-center rounded-[7px] bg-[#ecffdf] text-[#315d24]"><Icon size={16} /></span><span><b className="block text-[18px] leading-none text-[#17231f]">{value}</b><small className="mt-[3px] block text-[11px] text-[#77837e]">{label}</small></span></div>;
}

function GraphMetric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-[8px] border border-[#17302d] bg-[#102421] p-[15px] text-white"><p className="m-0 text-[12px] text-white/55">{label}</p><p className="m-0 mt-[8px] font-['Unbounded',sans-serif] text-[25px] font-semibold text-[#bfff91]">{value.toLocaleString("ru-RU")}</p></div>;
}

function StatusPill({ label }: { label: string }) {
  return <span className="rounded-full border border-white/12 bg-white/[0.05] px-[9px] py-[4px]">{label}</span>;
}

function MachineState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return <section className="mx-auto mt-[60px] flex max-w-[440px] flex-col items-center rounded-[8px] border border-[#dce4d9] bg-white p-[22px] text-center"><span className="grid h-[42px] w-[42px] place-items-center rounded-[8px] bg-[#edf4e7] text-[#315d24]">{icon}</span><h1 className="m-0 mt-[13px] text-[21px] font-semibold">{title}</h1>{description ? <p className="m-0 mt-[7px] text-[13px] text-[#65746e]">{description}</p> : null}{action ? <div className="mt-[14px]">{action}</div> : null}</section>;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
}

function readSection(): SectionId {
  if (typeof window === "undefined") return "overview";
  const value = new URLSearchParams(window.location.search).get("section");
  return sections.some((item) => item.id === value) ? (value as SectionId) : "overview";
}

const primaryButton = "inline-flex h-[42px] cursor-pointer items-center rounded-[8px] bg-[#9cfb51] px-[14px] text-[13px] font-semibold text-[#0a1614] hover:bg-[#8cec48]";
