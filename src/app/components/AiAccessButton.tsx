import { useState } from "react";
import { ArrowUp, Check, Download, ExternalLink, LockKeyhole, MessagesSquare } from "lucide-react";
import { useLang } from "../../i18n/LangContext";
import LocalizedLink from "./LocalizedLink";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useSpaceAuth } from "./space/SpaceAuthProvider";

const ASSET_ROOT = "/assets/ai-access";
const CHATGPT_URL = "https://chatgpt.com/g/g-6a149d78a8688191b5a7aaa2fc0ba540-opten-prompt-improver-image-generator";

type Platform = "claude" | "chatgpt";
type DownloadStatus = "idle" | "loading" | "success" | "error";

const copy = {
  ru: {
    buttonEyebrow: "Использовать на сайтах:",
    buttonTitle: "ChatGPT и Claude",
    dialogTitle: "Улучшай промпты в Claude и ChatGPT",
    dialogTitleLine1: "Улучшай промпты",
    dialogTitleLine2: "в Claude и ChatGPT",
    dialogDescription: "Подключи инструкции Opten к любимому ИИ-чату и получай более точные промпты.",
    dialogDescriptionLine1: "Подключи инструкции Opten к любимому ИИ-чату",
    dialogDescriptionLine2: "и получай более точные промпты.",
    contextTitle: "Когда важен контекст переписки",
    contextDescription: "Claude и ChatGPT сохраняют предыдущие сообщения диалога, а Opten применяет те же инструкции для улучшения промптов. Так можно уточнять результат шаг за шагом, не объясняя задачу заново.",
    claude: "Claude",
    chatgpt: "ChatGPT",
    claudeStep1: "Скачай скилл",
    claudeStep2: "Установи его в Claude",
    chatgptStep1: "Открой ссылку",
    chatgptStep2: "Разреши доступ приложению",
    sharedStep3: "Упоминай Оптен при запросе на промпт в чате",
    promptExample: "Оптен, сделай мне промпт для Seedance 2.0…",
    download: "Скачать",
    downloading: "Скачиваем…",
    downloaded: "Скачано",
    open: "Открыть",
    proOnly: "Доступно для Pro",
    checking: "Проверяем доступ…",
    gateTitle: "Доступно в Pro",
    gateDescription: "Оплати Pro, чтобы скачать Claude Skill и открыть Opten GPT в ChatGPT.",
    upgrade: "Перейти на Pro",
    downloadError: "Не удалось скачать скилл. Обнови страницу и попробуй ещё раз.",
  },
  en: {
    buttonEyebrow: "Use on:",
    buttonTitle: "ChatGPT and Claude",
    dialogTitle: "Improve prompts in Claude and ChatGPT",
    dialogTitleLine1: "Improve prompts",
    dialogTitleLine2: "in Claude and ChatGPT",
    dialogDescription: "Connect Opten instructions to your preferred AI chat and get more accurate prompts.",
    dialogDescriptionLine1: "Connect Opten instructions to your preferred AI chat",
    dialogDescriptionLine2: "and get more accurate prompts.",
    contextTitle: "When conversation context matters",
    contextDescription: "Claude and ChatGPT retain previous messages while Opten applies the same prompt-improvement instructions. Refine the result step by step without explaining the task again.",
    claude: "Claude",
    chatgpt: "ChatGPT",
    claudeStep1: "Download the skill",
    claudeStep2: "Install it in Claude",
    chatgptStep1: "Open the link",
    chatgptStep2: "Allow app access",
    sharedStep3: "Mention Opten when asking for a prompt in chat",
    promptExample: "Opten, make me a prompt for Seedance 2.0…",
    download: "Download",
    downloading: "Downloading…",
    downloaded: "Downloaded",
    open: "Open",
    proOnly: "Available for Pro",
    checking: "Checking access…",
    gateTitle: "Available with Pro",
    gateDescription: "Upgrade to Pro to download the Claude Skill and open the Opten GPT in ChatGPT.",
    upgrade: "Upgrade to Pro",
    downloadError: "The skill could not be downloaded. Refresh the page and try again.",
  },
} as const;

function PlatformIcons() {
  return (
    <span className="flex shrink-0 items-center" aria-hidden="true">
      <img src={`${ASSET_ROOT}/claude.png`} alt="" width="40" height="40" className="relative z-10 size-10 rounded-full" />
      <img src={`${ASSET_ROOT}/chatgpt.png`} alt="" width="40" height="40" className="-ml-2 size-10 rounded-full" />
    </span>
  );
}

function Step({ number, last = false, children }: { number: number; last?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[30px_1fr] gap-3 sm:grid-cols-[34px_1fr] sm:gap-4">
      <div className="flex flex-col items-center">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-[#9cfb51]/35 bg-[#9cfb51]/10 font-['PT_Root_UI',sans-serif] text-[13px] font-bold text-[#9cfb51] sm:size-[34px] sm:text-[14px]">
          {number}
        </span>
        {!last ? <span className="my-2 min-h-5 w-px flex-1 bg-white/12" aria-hidden="true" /> : null}
      </div>
      <div className={last ? "min-w-0" : "min-w-0 pb-5 sm:pb-6"}>{children}</div>
    </div>
  );
}

function PromptMentionPreview({ platform, placeholder }: { platform: Platform; placeholder: string }) {
  return (
    <div aria-hidden="true" className="mt-4 overflow-hidden rounded-[12px] border border-white/10 bg-[#0d1719] p-4 sm:p-5">
      <div className="flex h-10 items-center justify-center">
        <img
          src={`${ASSET_ROOT}/skill-banner-${platform}.png`}
          alt=""
          width={platform === "claude" ? 40 : 117}
          height={platform === "claude" ? 40 : 46}
          className={platform === "claude" ? "size-10 object-contain" : "h-[40px] w-auto object-contain"}
        />
      </div>
      <div className="mt-4 flex min-h-11 items-center gap-3 rounded-full bg-white/10 py-2 pl-4 pr-2">
        <span className="min-w-0 flex-1 truncate font-['PT_Root_UI',sans-serif] text-[12px] text-white/70 sm:text-[13px]">{placeholder}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#011417]">
          <ArrowUp size={17} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

export default function AiAccessButton() {
  const { lang } = useLang();
  const { account, session, status } = useSpaceAuth();
  const text = copy[lang];
  const [platform, setPlatform] = useState<Platform>("claude");
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle");
  const isChecking = status === "loading";
  const isPro = status === "signed_in" && account?.plan === "pro";

  async function downloadSkill() {
    if (!isPro || !session?.access_token || downloadStatus === "loading") return;
    setDownloadStatus("loading");
    try {
      const response = await fetch("/api/download-skill", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error(`download_skill_${response.status}`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "opten.zip";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setDownloadStatus("success");
    } catch {
      setDownloadStatus("error");
    }
  }

  const lockedLabel = isChecking ? text.checking : text.proOnly;
  const downloadLabel = downloadStatus === "loading"
    ? text.downloading
    : downloadStatus === "success"
      ? text.downloaded
      : text.download;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          data-ai-access-trigger
          className="group inline-flex w-auto max-w-[calc(100vw-40px)] items-center justify-center gap-2 rounded-full bg-white px-[14px] py-[10px] text-[#011417] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(156,251,81,0.18)] focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[#011417] sm:max-w-[390px] sm:gap-3 sm:pl-[10px] sm:pr-6 md:w-[300px]"
        >
          <PlatformIcons />
          <span className="flex min-w-0 flex-col text-left font-['PT_Root_UI',sans-serif] leading-[1.25]">
            <span className="whitespace-nowrap text-[13px] font-normal sm:text-[14px]">{text.buttonEyebrow}</span>
            <span className="whitespace-nowrap text-[17px] font-bold sm:text-[18px]">{text.buttonTitle}</span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="opten-demo-scrollbar !z-[130] !block max-h-[calc(100dvh-24px)] overflow-y-auto !rounded-[18px] !border-white/12 !bg-[#071c1f] !p-0 text-white shadow-[0_28px_90px_rgba(0,0,0,0.62)] sm:!max-w-[640px] [&_[data-slot=dialog-close]]:right-5 [&_[data-slot=dialog-close]]:top-5 [&_[data-slot=dialog-close]]:text-white/70 [&_[data-slot=dialog-close]]:hover:text-white">
        <div className="border-b border-white/10 px-5 pb-5 pt-6 sm:px-14 sm:pb-6 sm:pt-7">
          <DialogTitle className="text-center font-['Unbounded',sans-serif] text-[22px] font-bold leading-[1.15] text-white sm:text-[28px]">
            <span className="block">{text.dialogTitleLine1}</span>
            <span className="block">{text.dialogTitleLine2}</span>
          </DialogTitle>
          <DialogDescription aria-label={text.dialogDescription} className="mx-auto mt-3 max-w-[520px] text-center font-['PT_Root_UI',sans-serif] text-[15px] leading-[1.55] text-white/55 sm:text-[16px]">
            <span className="md:hidden">{text.dialogDescription}</span>
            <span className="hidden md:block">
              <span className="block">{text.dialogDescriptionLine1}</span>
              <span className="block">{text.dialogDescriptionLine2}</span>
            </span>
          </DialogDescription>
        </div>

        <div className="px-4 pb-5 pt-4 sm:px-7 sm:pb-7 sm:pt-5">
          <Tabs value={platform} onValueChange={(value) => setPlatform(value as Platform)} className="gap-0">
            <TabsList aria-label={text.dialogTitle} className="grid h-auto w-full grid-cols-2 gap-1 rounded-full border border-white/10 !bg-[#011417] p-1">
            {(["claude", "chatgpt"] as const).map((item) => (
              <TabsTrigger
                key={item}
                value={item}
                className="h-11 rounded-full border-0 font-['PT_Root_UI',sans-serif] text-[15px] font-bold text-white/60 shadow-none transition hover:bg-white/5 hover:text-white data-[state=active]:!bg-white data-[state=active]:!text-[#011417] data-[state=active]:shadow-none"
              >
                <img src={`${ASSET_ROOT}/${item}.png`} alt="" width="24" height="24" className="size-6 rounded-full" />
                {text[item]}
              </TabsTrigger>
            ))}
            </TabsList>

            <div className="mt-4 rounded-[14px] border border-[#9cfb51]/20 bg-[#9cfb51]/7 p-4 sm:flex sm:items-start sm:gap-3 sm:p-5">
              <span className="mb-3 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#9cfb51]/12 text-[#9cfb51] sm:mb-0">
                <MessagesSquare size={18} />
              </span>
              <div className="min-w-0">
                <p className="font-['PT_Root_UI',sans-serif] text-[16px] font-bold leading-[1.3] text-white">{text.contextTitle}</p>
                <p className="mt-1.5 font-['PT_Root_UI',sans-serif] text-[14px] leading-[1.55] text-white/60 sm:text-[15px]">{text.contextDescription}</p>
              </div>
            </div>

            <TabsContent value={platform} className="mt-6 rounded-[14px] border border-white/10 bg-[#0e2023] p-4 sm:p-5">
            <Step number={1}>
              <p className="font-['PT_Root_UI',sans-serif] text-[17px] font-medium leading-[1.35] text-white sm:text-[18px]">
                {platform === "claude" ? text.claudeStep1 : text.chatgptStep1}
              </p>
              {isPro ? (
                platform === "claude" ? (
                  <button
                    type="button"
                    onClick={downloadSkill}
                    disabled={downloadStatus === "loading"}
                    className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-white px-5 font-['PT_Root_UI',sans-serif] text-[15px] font-bold text-[#011417] transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-70"
                  >
                    {downloadStatus === "success" ? <Check size={19} /> : <Download size={19} />}
                    {downloadLabel}
                  </button>
                ) : (
                  <a
                    href={CHATGPT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-white px-5 font-['PT_Root_UI',sans-serif] text-[15px] font-bold text-[#011417] no-underline transition hover:bg-white/90"
                  >
                    {text.open}
                    <ExternalLink size={19} />
                  </a>
                )
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-3 inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-[10px] bg-white/8 px-5 font-['PT_Root_UI',sans-serif] text-[15px] font-bold text-white/35"
                >
                  <LockKeyhole size={18} />
                  {lockedLabel}
                </button>
              )}
              {platform === "claude" && downloadStatus === "error" ? (
                <p role="alert" className="mt-2 font-['PT_Root_UI',sans-serif] text-[13px] leading-[1.45] text-[#ff8b78]">{text.downloadError}</p>
              ) : null}
            </Step>

            <Step number={2}>
              <p className="font-['PT_Root_UI',sans-serif] text-[17px] font-medium leading-[1.45] text-white/82 sm:text-[18px]">
                {platform === "claude" ? text.claudeStep2 : text.chatgptStep2}
              </p>
            </Step>

            <Step number={3} last>
              <p className="font-['PT_Root_UI',sans-serif] text-[17px] font-medium leading-[1.45] text-white/82 sm:text-[18px]">{text.sharedStep3}</p>
              <PromptMentionPreview platform={platform} placeholder={text.promptExample} />
            </Step>
            </TabsContent>
          </Tabs>

          {!isPro && !isChecking ? (
            <div className="mt-4 rounded-[14px] border border-[#9cfb51]/25 bg-[#9cfb51]/8 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5">
              <div className="flex min-w-0 gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#9cfb51]/12 text-[#9cfb51]">
                  <LockKeyhole size={18} />
                </span>
                <div>
                  <p className="font-['PT_Root_UI',sans-serif] text-[16px] font-bold text-white">{text.gateTitle}</p>
                  <p className="mt-1 font-['PT_Root_UI',sans-serif] text-[14px] leading-[1.5] text-white/55">{text.gateDescription}</p>
                </div>
              </div>
              <LocalizedLink
                to="/pay?source=ai-access-modal"
                className="mt-4 inline-flex h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#9cfb51] px-5 font-['PT_Root_UI',sans-serif] text-[15px] font-bold text-[#011417] no-underline transition hover:bg-[#b5ff76] sm:mt-0 sm:w-auto"
              >
                {text.upgrade}
              </LocalizedLink>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
