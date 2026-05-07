import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Tabs from "@radix-ui/react-tabs";
import * as Accordion from "@radix-ui/react-accordion";
import { Globe, Monitor, Terminal, Smartphone, Copy, Check, RefreshCw, ChevronDown } from "lucide-react";
import ConnectLayout from "../components/layout/ConnectLayout";
import { useT } from "../../i18n/LangContext";
import { detectOS, osToSurface, type SurfaceTab } from "../utils/detectOS";

const SURFACES: { id: SurfaceTab; icon: typeof Globe; labelKey: string }[] = [
  { id: "web",     icon: Globe,       labelKey: "connect.tabs.web" },
  { id: "desktop", icon: Monitor,     labelKey: "connect.tabs.desktop" },
  { id: "cli",     icon: Terminal,    labelKey: "connect.tabs.cli" },
  { id: "mobile",  icon: Smartphone,  labelKey: "connect.tabs.mobile" },
];

const STEP_COUNT = 5;

function StepScreenshot({ surface, n, alt }: { surface: SurfaceTab; n: number; alt: string }) {
  const src = `/screenshots/connect-claude/${surface}-${String(n).padStart(2, "0")}.webp`;
  return (
    <div
      className="mt-[12px] w-full rounded-[8px] overflow-hidden border border-[rgba(255,255,255,0.1)]"
      style={{ aspectRatio: "16/9", background: "rgba(255,255,255,0.04)" }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

export default function ConnectClaude() {
  const t = useT();
  const [activeTab, setActiveTab] = useState<SurfaceTab>("web");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveTab(osToSurface(detectOS()));
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText("https://opten.space/mcp");
      setCopied(true);
      toast(t("connect.copy.success"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("[Opten] clipboard copy failed", err);
      toast.error(t("connect.copy.failure"));
    }
  }

  function renderSteps(surface: SurfaceTab) {
    const altKey = `connect.screenshot.alt.${surface}` as const;
    return (
      <ol className="flex flex-col gap-[20px]">
        {Array.from({ length: STEP_COUNT }, (_, i) => i + 1).map((n) => (
          <li key={n} className="flex gap-[16px] items-start">
            <span className="shrink-0 w-[32px] h-[32px] rounded-full bg-[#111] flex items-center justify-center text-white text-[14px] font-medium mt-[2px]">
              {n}
            </span>
            <div className="flex flex-col gap-[4px] flex-1">
              <p className="text-[16px] font-medium text-white leading-[1.3]">
                {t(`connect.steps.${surface}.step${n}.title` as any)}
              </p>
              <p className="text-[14px] text-zinc-400 leading-[1.5]">
                {t(`connect.steps.${surface}.step${n}.body` as any)}
              </p>
              <StepScreenshot surface={surface} n={n} alt={t(altKey as any)} />
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ConnectLayout title={t("connect.page.title")}>
      {/* Hero */}
      <p className="text-[rgba(255,255,255,0.5)] text-[16px] leading-[1.7] mb-[24px]">
        {t("connect.page.subtitle")}
      </p>

      {/* MCP URL chip */}
      <div className="flex items-center justify-between gap-[12px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-[8px] px-[16px] py-[12px]">
        <code className="font-mono text-[14px] text-white select-all">
          https://opten.space/mcp
        </code>
        <button
          aria-label={t("connect.copy.ariaLabel")}
          onClick={handleCopy}
          className="shrink-0 p-[8px] rounded-[6px] text-zinc-400 hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      {/* Reload callout */}
      <div className="mt-[32px] flex gap-[12px] items-start rounded-[8px] border border-[rgba(234,179,8,0.4)] bg-[rgba(234,179,8,0.08)] px-[16px] py-[12px]">
        <RefreshCw size={16} className="shrink-0 mt-[4px] text-[rgb(234,179,8)]" />
        <p className="text-[14px] text-[rgba(255,255,255,0.8)] leading-[1.5]">
          {t("connect.reload.notice")}
        </p>
      </div>

      {/* Tabs — visible on sm+ screens */}
      <div className="hidden sm:block mt-[40px]">
        <Tabs.Root
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as SurfaceTab)}
        >
          <Tabs.List className="flex border-b border-[rgba(255,255,255,0.1)] mb-[32px]">
            {SURFACES.map(({ id, icon: Icon, labelKey }) => (
              <Tabs.Trigger
                key={id}
                value={id}
                className="flex items-center gap-[8px] px-[16px] py-[12px] text-[14px] text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent data-[state=active]:border-[#2777C3] data-[state=active]:text-white -mb-[1px]"
              >
                <Icon size={16} />
                {t(labelKey as any)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {SURFACES.map(({ id }) => (
            <Tabs.Content key={id} value={id}>
              {renderSteps(id)}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>

      {/* Accordion — visible on mobile screens */}
      <div className="block sm:hidden mt-[40px]">
        <Accordion.Root
          type="single"
          collapsible
          value={activeTab}
          onValueChange={(v) => setActiveTab((v || activeTab) as SurfaceTab)}
        >
          {SURFACES.map(({ id, icon: Icon, labelKey }) => (
            <Accordion.Item
              key={id}
              value={id}
              className="border-b border-[rgba(255,255,255,0.1)]"
            >
              <Accordion.Trigger className="flex items-center justify-between w-full py-[16px] text-[16px] font-medium text-white">
                <span className="flex items-center gap-[8px]">
                  <Icon size={16} />
                  {t(labelKey as any)}
                </span>
                <ChevronDown
                  size={18}
                  className="transition-transform data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
              <Accordion.Content className="pt-[16px] pb-[24px]">
                {renderSteps(id)}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>

      {/* Mini-FAQ */}
      <section className="mt-[48px]">
        <h2 className="text-[22px] font-medium text-white mb-[16px]">
          {t("connect.faq.title")}
        </h2>
        <Accordion.Root type="single" collapsible>
          {[
            { id: "freeVsPro",  q: "connect.faq.freeVsPro.q",  a: "connect.faq.freeVsPro.a" },
            { id: "reload",     q: "connect.faq.reload.q",     a: "connect.faq.reload.a" },
            { id: "refs",       q: "connect.faq.refs.q",       a: "connect.faq.refs.a" },
            { id: "killSwitch", q: "connect.faq.killSwitch.q", a: "connect.faq.killSwitch.a" },
          ].map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className="border-b border-[rgba(255,255,255,0.1)]"
            >
              <Accordion.Trigger className="flex items-center justify-between w-full py-[16px] text-[16px] font-medium text-white">
                {t(item.q as any)}
                <ChevronDown
                  size={18}
                  className="transition-transform data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
              <Accordion.Content className="text-[14px] text-[rgba(255,255,255,0.7)] leading-[1.7] pb-[16px]">
                {t(item.a as any)}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
    </ConnectLayout>
  );
}
