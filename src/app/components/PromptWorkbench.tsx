import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CircleAlert,
  LoaderCircle,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { PROMPT_WORKBENCH_MODELS, type PromptWorkbenchType } from "../../content/promptWorkbenchModels";
import { useLang } from "../../i18n/LangContext";
import { useSpaceAuth } from "./space/SpaceAuthProvider";

interface ReferenceImage {
  id: number;
  status: "loading" | "loaded";
  base64: string | null;
  mediaType: "image/jpeg";
}

interface ApiResponse {
  error?: string;
  result?: { prompt: string };
  retry_after?: number;
}

const MAX_PROMPT_CHARS = 6_000;
const MIN_PROMPT_CHARS = 20;
const MAX_REFERENCES = 8;
const MAX_REFERENCE_BYTES = 10 * 1024 * 1024;
const REFERENCE_MAX_EDGE = 512;
const REFERENCE_JPEG_QUALITY = 0.7;
const DEFAULT_MODEL_BY_TYPE = {
  image: "nano-banana-2",
  video: "seedance-2.0",
} as const;

const copy = {
  ru: {
    title: "Генератор промптов Opten",
    placeholder: "Промпт или идея 20+ символов...",
    image: "Изображение",
    video: "Видео",
    improve: "Улучшить",
    improving: "Улучшаем",
    copyPrompt: "Скопировать",
    copiedPrompt: "Скопировано",
    copyFailed: "Не удалось скопировать промпт.",
    updated: "Последнее обновление: ",
    inputLabel: "Промпт",
    typeLabel: "Тип генерации",
    modelLabel: "Модель генерации",
    addReference: "Добавить референс",
    addPhoto: "Загрузить фото",
    removeReference: "Удалить референс",
    empty: "Сначала введите промпт",
    tooShort: "Введите не меньше 20 символов",
    tooLong: "Сократите промпт до 6 000 символов",
    refsMax: "Можно добавить не больше 8 референсов",
    refTooLarge: "Файл больше 10 МБ и не был добавлен",
    refUnsupported: "Не удалось обработать изображение",
    unavailable: "Модель временно не ответила. Попробуйте ещё раз.",
    genericError: "Не удалось улучшить промпт. Попробуйте ещё раз.",
    proLimit: "Лимит Pro-операций закончился. Проверьте аккаунт.",
    authRequired: "Войдите в аккаунт, чтобы улучшить промпт.",
    proRequired: "Улучшение доступно только с подпиской Pro.",
    authChecking: "Проверяем аккаунт. Попробуйте ещё раз.",
    entitlementUnavailable: "Не удалось проверить подписку. Попробуйте ещё раз.",
  },
  en: {
    title: "Opten prompt generator",
    placeholder: "Prompt or idea, 20+ characters...",
    image: "Image",
    video: "Video",
    improve: "Improve",
    improving: "Improving",
    copyPrompt: "Copy",
    copiedPrompt: "Copied",
    copyFailed: "The prompt could not be copied.",
    updated: "Last updated: ",
    inputLabel: "Prompt",
    typeLabel: "Generation type",
    modelLabel: "Generation model",
    addReference: "Add reference",
    addPhoto: "Add photo",
    removeReference: "Remove reference",
    empty: "Enter a prompt first",
    tooShort: "Enter at least 20 characters",
    tooLong: "Shorten the prompt to 6,000 characters",
    refsMax: "You can add up to 8 references",
    refTooLarge: "The file is larger than 10 MB and was not added",
    refUnsupported: "The image could not be processed",
    unavailable: "The model did not respond. Please try again.",
    genericError: "We could not improve the prompt. Please try again.",
    proLimit: "Your Pro operation limit has been reached. Check your account.",
    authRequired: "Sign in to improve the prompt.",
    proRequired: "Prompt improvement requires a Pro subscription.",
    authChecking: "Checking your account. Please try again.",
    entitlementUnavailable: "We could not verify your subscription. Please try again.",
  },
} as const;

function errorMessage(error: string | undefined, lang: "ru" | "en") {
  const text = copy[lang];
  if (error === "pro_limit_reached") return text.proLimit;
  if (error === "authentication_required") return text.authRequired;
  if (error === "pro_required") return text.proRequired;
  if (error === "entitlement_unavailable") return text.entitlementUnavailable;
  if (error === "prompt_too_short") return text.tooShort;
  if (error === "prompt_too_long") return text.tooLong;
  if (error === "provider_unavailable" || error === "provider_timeout" || error === "AbortError" || error === "provider_failed") return text.unavailable;
  return text.genericError;
}

async function writeClipboardText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("clipboard_unavailable");
}

function CopyPromptIcon({ copied }: { copied: boolean }) {
  return (
    <span className="relative block size-[19px]" aria-hidden="true">
      <svg className={`absolute inset-0 size-[19px] transition-opacity duration-200 ${copied ? "opacity-0" : "opacity-100"}`} viewBox="0 0 19 19" fill="none">
        <path d="M5.54102 7.65288C5.54102 7.09291 5.76346 6.55587 6.15942 6.15991C6.55538 5.76395 7.09242 5.5415 7.65239 5.5415H14.513C14.7902 5.5415 15.0648 5.59612 15.321 5.70222C15.5771 5.80833 15.8099 5.96385 16.0059 6.15991C16.202 6.35597 16.3575 6.58873 16.4636 6.84489C16.5697 7.10105 16.6243 7.37561 16.6243 7.65288V14.5135C16.6243 14.7907 16.5697 15.0653 16.4636 15.3215C16.3575 15.5776 16.202 15.8104 16.0059 16.0064C15.8099 16.2025 15.5771 16.358 15.321 16.4641C15.0648 16.5702 14.7902 16.6248 14.513 16.6248H7.65239C7.37512 16.6248 7.10057 16.5702 6.8444 16.4641C6.58824 16.358 6.35548 16.2025 6.15942 16.0064C5.96336 15.8104 5.80784 15.5776 5.70173 15.3215C5.59563 15.0653 5.54102 14.7907 5.54102 14.5135V7.65288Z" stroke="currentColor" strokeWidth="1.58333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.17617 13.2501C2.93312 13.112 2.73097 12.9121 2.59025 12.6705C2.44954 12.429 2.37527 12.1545 2.375 11.875V3.95833C2.375 3.0875 3.0875 2.375 3.95833 2.375H11.875C12.4688 2.375 12.7918 2.67979 13.0625 3.16667" stroke="currentColor" strokeWidth="1.58333" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className={`absolute inset-0 size-[19px] transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0"}`} viewBox="0 0 19 19" fill="none">
        <path d="M5.54102 7.65288C5.54102 7.09291 5.76346 6.55587 6.15942 6.15991C6.55538 5.76395 7.09242 5.5415 7.65239 5.5415H14.513C14.7902 5.5415 15.0648 5.59612 15.321 5.70222C15.5771 5.80833 15.8099 5.96385 16.0059 6.15991C16.202 6.35597 16.3575 6.58873 16.4636 6.84489C16.5697 7.10105 16.6243 7.37561 16.6243 7.65288V14.5135C16.6243 14.7907 16.5697 15.0653 16.4636 15.3215C16.3575 15.5776 16.202 15.8104 16.0059 16.0064C15.8099 16.2025 15.5771 16.358 15.321 16.4641C15.0648 16.5702 14.7902 16.6248 14.513 16.6248H7.65239C7.37512 16.6248 7.10057 16.5702 6.8444 16.4641C6.58824 16.358 6.35548 16.2025 6.15942 16.0064C5.96336 15.8104 5.80784 15.5776 5.70173 15.3215C5.59563 15.0653 5.54102 14.7907 5.54102 14.5135V7.65288Z" fill="currentColor" stroke="currentColor" strokeWidth="1.58333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.17617 13.2501C2.93312 13.112 2.73097 12.9121 2.59025 12.6705C2.44954 12.429 2.37527 12.1545 2.375 11.875V3.95833C2.375 3.0875 3.0875 2.375 3.95833 2.375H11.875C12.4688 2.375 12.7918 2.67979 13.0625 3.16667" stroke="currentColor" strokeWidth="1.58333" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("read_failed"));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}

function decodeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("decode_failed"));
    image.src = src;
  });
}

async function compressReference(file: File): Promise<string> {
  const source = await fileToDataUrl(file);
  const image = await decodeImage(source);
  let width = image.naturalWidth;
  let height = image.naturalHeight;
  if (!width || !height) throw new Error("decode_failed");

  if (width > REFERENCE_MAX_EDGE || height > REFERENCE_MAX_EDGE) {
    if (width >= height) {
      height = Math.round(height * REFERENCE_MAX_EDGE / width);
      width = REFERENCE_MAX_EDGE;
    } else {
      width = Math.round(width * REFERENCE_MAX_EDGE / height);
      height = REFERENCE_MAX_EDGE;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas_failed");
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", REFERENCE_JPEG_QUALITY).split(",")[1] || "";
}

function formatLocalDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

export default function PromptWorkbench() {
  const { lang } = useLang();
  const { account, refresh, session, status } = useSpaceAuth();
  const text = copy[lang];
  const isPro = status === "signed_in" && account?.plan === "pro";
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<PromptWorkbenchType>("image");
  const [model, setModel] = useState(DEFAULT_MODEL_BY_TYPE.image);
  const [references, setReferences] = useState<ReferenceImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState(() => new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const referenceCounter = useRef(0);
  const cancelledReferences = useRef(new Set<number>());
  const copyResetTimer = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const models = PROMPT_WORKBENCH_MODELS[type];
  const promptReady = prompt.trim().length >= MIN_PROMPT_CHARS
    && prompt.length <= MAX_PROMPT_CHARS
    && !references.some((reference) => reference.status === "loading");
  useEffect(() => () => {
    mountedRef.current = false;
    if (copyResetTimer.current !== null) window.clearTimeout(copyResetTimer.current);
  }, []);

  useEffect(() => {
    let timer = 0;
    const scheduleNextDay = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = window.setTimeout(() => {
        setToday(new Date());
        scheduleNextDay();
      }, Math.max(1_000, nextDay.getTime() - now.getTime() + 100));
    };
    scheduleNextDay();
    return () => window.clearTimeout(timer);
  }, []);

  function changeType(nextType: PromptWorkbenchType) {
    setType(nextType);
    setModel(DEFAULT_MODEL_BY_TYPE[nextType]);
    setError(null);
  }

  async function copyPrompt() {
    if (!prompt) return;
    try {
      await writeClipboardText(prompt);
      setCopied(true);
      setError(null);
      if (copyResetTimer.current !== null) window.clearTimeout(copyResetTimer.current);
      copyResetTimer.current = window.setTimeout(() => {
        setCopied(false);
        copyResetTimer.current = null;
      }, 500);
    } catch {
      setCopied(false);
      setError(text.copyFailed);
    }
  }

  function removeReference(id: number) {
    cancelledReferences.current.add(id);
    setReferences((current) => current.filter((reference) => reference.id !== id));
  }

  function addReferences(files: FileList | null) {
    if (!files?.length) return;
    const available = MAX_REFERENCES - references.length;
    const picked = Array.from(files);
    if (picked.length > available) setError(text.refsMax);

    picked.slice(0, available).forEach((file) => {
      if (file.size > MAX_REFERENCE_BYTES) {
        setError(text.refTooLarge);
        return;
      }

      const id = ++referenceCounter.current;
      setReferences((current) => [...current, {
        id,
        status: "loading",
        base64: null,
        mediaType: "image/jpeg",
      }]);

      void compressReference(file)
        .then((base64) => {
          if (!mountedRef.current || !base64 || cancelledReferences.current.has(id)) return;
          setReferences((current) => current.map((reference) => reference.id === id
            ? { ...reference, status: "loaded", base64 }
            : reference));
        })
        .catch(() => {
          if (!mountedRef.current || cancelledReferences.current.has(id)) return;
          setReferences((current) => current.filter((reference) => reference.id !== id));
          setError(text.refUnsupported);
        });
    });
  }

  async function improvePrompt() {
    if (prompt.trim().length < MIN_PROMPT_CHARS) {
      setError(prompt.trim() ? text.tooShort : text.empty);
      return;
    }
    if (prompt.length > MAX_PROMPT_CHARS) {
      setError(text.tooLong);
      return;
    }
    if (status === "loading") {
      setError(text.authChecking);
      return;
    }
    if (status !== "signed_in" || !session?.access_token) {
      setError(text.authRequired);
      return;
    }
    if (!isPro) {
      setError(text.proRequired);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/prompt-workbench", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: "improve",
          prompt,
          model,
          images: references
            .filter((reference) => reference.status === "loaded" && reference.base64)
            .map((reference) => ({ data: reference.base64, mediaType: reference.mediaType })),
        }),
      });
      const payload = await response.json().catch(() => ({})) as ApiResponse;
      if (!response.ok || !payload.result?.prompt) throw new Error(payload.error || "request_failed");
      setPrompt(payload.result.prompt);
      void refresh();
    } catch (requestError) {
      setError(errorMessage(requestError instanceof Error ? requestError.message : undefined, lang));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full pt-5 text-left font-['PT_Root_UI',sans-serif]">
      <div className="w-full rounded-[20px] border border-white/10 bg-[#0b2023]/95 px-[13px] py-[13px] shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl md:px-[21px]">
        <div className="flex flex-col gap-3 pb-[18px] pt-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[18px] font-medium leading-[26px] text-white">{text.title}</p>
            <button
              type="button"
              aria-label={copied ? text.copiedPrompt : text.copyPrompt}
              title={copied ? text.copiedPrompt : text.copyPrompt}
              disabled={!prompt}
              onClick={() => void copyPrompt()}
              className="grid size-8 shrink-0 place-items-center rounded-[8px] border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#9cfb51]/45 disabled:cursor-not-allowed disabled:opacity-25 md:hidden"
            >
              <CopyPromptIcon copied={copied} />
            </button>
          </div>
          <div className="grid w-full grid-cols-2 gap-2.5 md:w-auto">
            <div className="relative md:w-[219px]">
              <select
                aria-label={text.typeLabel}
                value={type}
                onChange={(event) => changeType(event.target.value === "video" ? "video" : "image")}
                className="h-10 w-full appearance-none rounded-full border border-white/10 bg-white/[0.06] pl-4 pr-10 text-[14px] text-white outline-none transition hover:border-white/20 focus:border-[#9cfb51]/45 focus:ring-2 focus:ring-[#9cfb51]/10"
              >
                <option value="image" className="bg-[#102528]">{text.image}</option>
                <option value="video" className="bg-[#102528]">{text.video}</option>
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/55" />
            </div>
            <div className="relative md:w-[219px]">
              <select
                aria-label={text.modelLabel}
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="h-10 w-full appearance-none rounded-full border border-white/10 bg-white/[0.06] pl-4 pr-10 text-[14px] text-white outline-none transition hover:border-white/20 focus:border-[#9cfb51]/45 focus:ring-2 focus:ring-[#9cfb51]/10"
              >
                {models.map((item) => <option key={item.slug} value={item.slug} className="bg-[#102528]">{item.label}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/55" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-white/[0.07] bg-[#07191c] transition focus-within:border-[#9cfb51]/30">
          <label htmlFor="hero-prompt" className="sr-only">{text.inputLabel}</label>
          <textarea
            id="hero-prompt"
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setError(null);
            }}
            placeholder={text.placeholder}
            maxLength={MAX_PROMPT_CHARS + 1}
            className="block min-h-[210px] w-full resize-none bg-transparent px-5 pb-3 pt-5 text-[17px] leading-[26px] text-white outline-none placeholder:text-white/30 md:min-h-[250px]"
          />

          <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] px-4 pb-4 pt-[17px]">
            <div className="flex min-w-0 items-center gap-[6px] overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {references.map((reference) => (
                <div
                  key={reference.id}
                  className="group relative grid size-[26px] shrink-0 place-items-center overflow-hidden rounded-[4px] border border-white/10 bg-white/[0.06]"
                >
                  {reference.status === "loaded" && reference.base64 ? (
                    <img
                      alt=""
                      src={`data:${reference.mediaType};base64,${reference.base64}`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin text-white/60" />
                  )}
                  <button
                    type="button"
                    aria-label={text.removeReference}
                    title={text.removeReference}
                    onClick={() => removeReference(reference.id)}
                    className="absolute inset-0 hidden place-items-center bg-black/55 text-white group-hover:grid group-focus-within:grid"
                  >
                    <X aria-hidden="true" className="size-3" />
                  </button>
                </div>
              ))}
              {references.length < MAX_REFERENCES ? (
                <>
                  <button
                    type="button"
                    aria-label={text.addReference}
                    title={text.addReference}
                    onClick={() => fileInputRef.current?.click()}
                    className="grid size-[26px] shrink-0 place-items-center rounded-[4px] border border-white/10 bg-white/[0.06] text-white/55 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#9cfb51]/55"
                  >
                    <Plus aria-hidden="true" className="size-5" strokeWidth={1.5} />
                  </button>
                  {references.length === 0 ? (
                    <span className="shrink-0 pl-1 text-[12px] text-white/25">{text.addPhoto}</span>
                  ) : null}
                </>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                tabIndex={-1}
                className="fixed left-[-9999px] size-px opacity-0"
                onChange={(event) => {
                  addReferences(event.target.files);
                  event.target.value = "";
                }}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              <button
                type="button"
                disabled={!prompt}
                onClick={() => void copyPrompt()}
                className="hidden h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 text-[14px] font-bold text-white/75 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#07191c] disabled:cursor-not-allowed disabled:opacity-30 md:inline-flex"
              >
                <CopyPromptIcon copied={copied} />
                {copied ? text.copiedPrompt : text.copyPrompt}
              </button>
              <button
                type="button"
                disabled={!promptReady || busy}
                onClick={() => void improvePrompt()}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#9cfb51] px-4 text-[14px] font-bold text-[#011417] transition hover:-translate-y-0.5 hover:bg-[#b5ff76] focus:outline-none focus:ring-2 focus:ring-[#9cfb51]/60 focus:ring-offset-2 focus:ring-offset-[#07191c] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Sparkles aria-hidden="true" className="size-4" />}
                {busy ? text.improving : text.improve}
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-h-8 items-center justify-between gap-3 px-2 pb-1 pt-2 text-[12px]">
          {error ? (
            <p role="alert" className="flex min-w-0 items-center gap-1.5 text-[#ff9a8d]">
              <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="truncate">{error}</span>
            </p>
          ) : (
            <p className="text-white/30">{prompt.length.toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} / {MAX_PROMPT_CHARS.toLocaleString()}</p>
          )}
          <p suppressHydrationWarning className="shrink-0 text-white/30">
            {text.updated}{formatLocalDate(today)}
          </p>
        </div>
      </div>
    </div>
  );
}
