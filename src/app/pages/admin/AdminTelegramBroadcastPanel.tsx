import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import {
  AdminApiError,
  deleteAdminTelegramBroadcast,
  fetchAdminTelegramBroadcasts,
  sendAdminTelegramBroadcast,
  uploadAdminTelegramPhoto,
  type AdminTelegramBroadcastRecord,
  type AdminTelegramBroadcastResult,
  type AdminTelegramBroadcastSegment,
} from "../../../lib/adminApi";

const SEGMENT_OPTIONS: Array<{ value: AdminTelegramBroadcastSegment; label: string }> = [
  { value: "all", label: "Все" },
  { value: "subscribed", label: "Подписались" },
  { value: "access_granted", label: "Получили доступ" },
  { value: "access_granted_not_paid", label: "Доступ без оплаты" },
];

const MAX_UPLOAD_BYTES = 1_572_864;
const MAX_UPLOAD_EDGE = 1600;
const VALID_UPLOAD_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function AdminTelegramBroadcastPanel({
  accessToken,
  onSent,
}: {
  accessToken: string;
  onSent: () => void;
}) {
  const [segment, setSegment] = useState<AdminTelegramBroadcastSegment>("access_granted_not_paid");
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [preview, setPreview] = useState<AdminTelegramBroadcastResult | null>(null);
  const [result, setResult] = useState<AdminTelegramBroadcastResult | null>(null);
  const [deleteResult, setDeleteResult] = useState<string | null>(null);
  const [history, setHistory] = useState<AdminTelegramBroadcastRecord[]>([]);
  const [state, setState] = useState<"idle" | "previewing" | "sending">("idle");
  const [uploadState, setUploadState] = useState<"idle" | "uploading">("idle");
  const [historyState, setHistoryState] = useState<"idle" | "loading" | "refreshing">("idle");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const draftKey = useMemo(
    () => JSON.stringify({ segment, text: text.trim(), photoUrl: photoUrl.trim(), buttonText: buttonText.trim(), buttonUrl: buttonUrl.trim() }),
    [buttonText, buttonUrl, photoUrl, segment, text],
  );
  const [previewKey, setPreviewKey] = useState("");

  const loadHistory = useCallback(
    async (background = false) => {
      if (!accessToken) return;
      setHistoryState(background ? "refreshing" : "loading");
      try {
        const response = await fetchAdminTelegramBroadcasts(accessToken);
        setHistory(response.broadcasts);
      } catch (err) {
        setError(resolveBroadcastError(err));
      } finally {
        setHistoryState("idle");
      }
    },
    [accessToken],
  );

  useEffect(() => {
    void loadHistory(false);
  }, [loadHistory]);

  const textLength = [...text.trim()].length;
  const hasPhoto = Boolean(photoUrl.trim());
  const textLimit = hasPhoto ? 1024 : 4096;
  const invalidButton = Boolean(buttonText.trim()) !== Boolean(buttonUrl.trim());
  const emptyMessage = !text.trim() && !photoUrl.trim();
  const tooLong = textLength > textLimit;
  const canPreview = !emptyMessage && !invalidButton && !tooLong && state === "idle";
  const canSend = Boolean(preview && previewKey === draftKey && preview.recipients > 0 && state === "idle");

  function updateDraft(mutator: () => void) {
    mutator();
    setPreview(null);
    setResult(null);
    setDeleteResult(null);
    setPreviewKey("");
    setError(null);
  }

  async function handlePreview() {
    if (!canPreview) return;
    setState("previewing");
    setError(null);
    setResult(null);
    setDeleteResult(null);

    try {
      const response = await sendAdminTelegramBroadcast(accessToken, {
        text: text.trim(),
        photo_url: photoUrl.trim() || undefined,
        button_text: buttonText.trim() || undefined,
        button_url: buttonUrl.trim() || undefined,
        segment,
        dry_run: true,
      });
      setPreview(response);
      setPreviewKey(draftKey);
    } catch (err) {
      setError(resolveBroadcastError(err));
    } finally {
      setState("idle");
    }
  }

  async function handleSend() {
    if (!canSend || !preview) return;
    const confirmed = window.confirm(`Отправить Telegram broadcast для ${formatNumber(preview.recipients)} получателей?`);
    if (!confirmed) return;

    setState("sending");
    setError(null);
    setDeleteResult(null);

    try {
      const response = await sendAdminTelegramBroadcast(accessToken, {
        text: text.trim(),
        photo_url: photoUrl.trim() || undefined,
        button_text: buttonText.trim() || undefined,
        button_url: buttonUrl.trim() || undefined,
        segment,
        dry_run: false,
        confirm: true,
        confirm_recipients: preview.recipients,
      });
      setResult(response);
      setPreview(null);
      setPreviewKey("");
      await loadHistory(true);
      onSent();
    } catch (err) {
      setError(resolveBroadcastError(err));
    } finally {
      setState("idle");
    }
  }

  async function handleDelete(record: AdminTelegramBroadcastRecord) {
    if (!canDeleteBroadcast(record) || deletingId) return;
    const confirmed = window.confirm(`Удалить broadcast ${formatShortId(record.id)} из Telegram для ${formatNumber(record.sent - record.deleted)} сообщений?`);
    if (!confirmed) return;

    setDeletingId(record.id);
    setError(null);
    setDeleteResult(null);

    try {
      const response = await deleteAdminTelegramBroadcast(accessToken, record.id);
      setDeleteResult(`Удалено: ${formatNumber(response.deleted)}, failed: ${formatNumber(response.failed)}`);
      await loadHistory(true);
      onSent();
    } catch (err) {
      setError(resolveBroadcastError(err));
    } finally {
      setDeletingId(null);
    }
  }

  async function handlePhotoFile(file: File | undefined) {
    if (!file || uploadState !== "idle") return;
    setUploadState("uploading");
    setError(null);
    setDeleteResult(null);

    try {
      const prepared = await prepareTelegramPhoto(file);
      const dataBase64 = await blobToBase64(prepared.blob);
      const response = await uploadAdminTelegramPhoto(accessToken, {
        file_name: prepared.fileName,
        content_type: prepared.contentType,
        data_base64: dataBase64,
      });
      updateDraft(() => setPhotoUrl(response.url));
    } catch (err) {
      setError(resolveUploadError(err));
    } finally {
      setUploadState("idle");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <section className="rounded-[8px] border border-[#dce4d9] bg-white p-[16px] shadow-[0_1px_0_rgba(14,23,20,0.04)]">
      <div className="flex flex-col gap-[10px] border-b border-[#eef2eb] pb-[14px] md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="m-0 text-[18px] font-semibold leading-tight tracking-[0] text-[#101a18]">Broadcast</h2>
          <p className="m-0 mt-[5px] max-w-[620px] text-[13px] leading-[1.45] text-[#66756f]">
            Реальная отправка доступна только после dry-run preview. Фото отправляется через Telegram sendPhoto по HTTPS URL.
          </p>
        </div>
        <span className="inline-flex h-[28px] items-center gap-[6px] self-start rounded-[8px] bg-[#edf4e7] px-[9px] text-[12px] font-semibold text-[#315d24]">
          <CheckCircle2 size={14} aria-hidden="true" />
          owner-gated
        </span>
      </div>

      <div className="mt-[14px] grid gap-[14px] lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-[12px]">
          <label className="grid gap-[6px] text-[13px] font-semibold text-[#34423e]">
            Сегмент
            <select
              value={segment}
              onChange={(event) => updateDraft(() => setSegment(event.target.value as AdminTelegramBroadcastSegment))}
              className="h-[40px] rounded-[8px] border border-[#cbd6c9] bg-white px-[11px] text-[14px] font-medium text-[#101a18] outline-none transition focus:border-[#75c83f] focus:ring-2 focus:ring-[#9cfb51]/30"
            >
              {SEGMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-[6px] text-[13px] font-semibold text-[#34423e]">
            Текст
            <textarea
              value={text}
              onChange={(event) => updateDraft(() => setText(event.target.value))}
              rows={7}
              className="min-h-[150px] resize-y rounded-[8px] border border-[#cbd6c9] bg-white px-[11px] py-[10px] text-[14px] leading-[1.5] text-[#101a18] outline-none transition focus:border-[#75c83f] focus:ring-2 focus:ring-[#9cfb51]/30"
            />
          </label>

          <div className="grid gap-[10px] md:grid-cols-2">
            <IconField icon={<ImageIcon size={15} aria-hidden="true" />} label="Фото">
              <div className="grid gap-[8px]">
                <div className="flex gap-[8px]">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(event) => updateDraft(() => setPhotoUrl(event.target.value))}
                    placeholder="https://..."
                    className="h-[40px] min-w-0 flex-1 rounded-[8px] border border-[#cbd6c9] bg-white px-[11px] text-[14px] text-[#101a18] outline-none transition placeholder:text-[#9aa6a1] focus:border-[#75c83f] focus:ring-2 focus:ring-[#9cfb51]/30"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadState === "uploading"}
                    className="inline-flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[7px] rounded-[8px] border border-[#cbd6c9] bg-white px-[11px] text-[13px] font-semibold text-[#17211f] transition hover:border-[#9bb195] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75c83f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadState === "uploading" ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <ImageIcon size={15} aria-hidden="true" />}
                    Загрузить
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    void handlePhotoFile(event.target.files?.[0]);
                  }}
                />
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt=""
                    className="h-[90px] w-full rounded-[8px] border border-[#e4ebe0] object-cover"
                  />
                ) : null}
              </div>
            </IconField>

            <IconField icon={<LinkIcon size={15} aria-hidden="true" />} label="Button URL">
              <input
                type="url"
                value={buttonUrl}
                onChange={(event) => updateDraft(() => setButtonUrl(event.target.value))}
                placeholder="https://opten.space/..."
                className="h-[40px] w-full rounded-[8px] border border-[#cbd6c9] bg-white px-[11px] text-[14px] text-[#101a18] outline-none transition placeholder:text-[#9aa6a1] focus:border-[#75c83f] focus:ring-2 focus:ring-[#9cfb51]/30"
              />
            </IconField>
          </div>

          <label className="grid gap-[6px] text-[13px] font-semibold text-[#34423e]">
            Button text
            <input
              type="text"
              value={buttonText}
              onChange={(event) => updateDraft(() => setButtonText(event.target.value))}
              className="h-[40px] rounded-[8px] border border-[#cbd6c9] bg-white px-[11px] text-[14px] text-[#101a18] outline-none transition focus:border-[#75c83f] focus:ring-2 focus:ring-[#9cfb51]/30"
            />
          </label>
        </div>

        <aside className="rounded-[8px] border border-[#eef2eb] bg-[#fbfcf8] p-[12px]">
          <div className="flex items-center justify-between gap-[10px]">
            <span className="text-[13px] font-semibold text-[#34423e]">Проверка</span>
            <span className={`text-[12px] font-semibold ${tooLong ? "text-[#b33a26]" : "text-[#66756f]"}`}>
              {formatNumber(textLength)} / {formatNumber(textLimit)}
            </span>
          </div>

          <div className="mt-[12px] grid gap-[8px] text-[13px] text-[#50615b]">
            <StatusRow ok={!emptyMessage} label="Есть текст или фото" />
            <StatusRow ok={!invalidButton} label="Кнопка заполнена парой" />
            <StatusRow ok={!tooLong} label={hasPhoto ? "Caption до 1024 символов" : "Message до 4096 символов"} />
          </div>

          {preview ? (
            <div className="mt-[14px] rounded-[8px] border border-[#d6e8cf] bg-[#f2faee] p-[11px]">
              <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#497160]">Preview</p>
              <p className="m-0 mt-[5px] tabular-nums text-[26px] font-semibold leading-none text-[#101a18]">
                {formatNumber(preview.recipients)}
              </p>
              <p className="m-0 mt-[5px] text-[12px] text-[#66756f]">получателей в текущем сегменте</p>
            </div>
          ) : null}

          {result ? (
            <div className="mt-[14px] rounded-[8px] border border-[#d6e8cf] bg-[#f2faee] p-[11px] text-[13px] text-[#315d24]">
              Отправлено: {formatNumber(result.sent ?? 0)}, blocked: {formatNumber(result.blocked ?? 0)}, failed: {formatNumber(result.failed ?? 0)}
            </div>
          ) : null}

          {deleteResult ? (
            <div className="mt-[14px] rounded-[8px] border border-[#d6e8cf] bg-[#f2faee] p-[11px] text-[13px] text-[#315d24]">
              {deleteResult}
            </div>
          ) : null}

          {error ? <BroadcastError message={error} /> : null}

          <div className="mt-[14px] grid gap-[8px]">
            <button
              type="button"
              onClick={handlePreview}
              disabled={!canPreview}
              className="inline-flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-[#cbd6c9] bg-white px-[13px] text-[14px] font-semibold text-[#17211f] transition hover:border-[#9bb195] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75c83f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "previewing" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              Preview
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="inline-flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-transparent bg-[#9cfb51] px-[13px] text-[14px] font-semibold text-[#0a1614] transition hover:bg-[#8cec48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75c83f] disabled:cursor-not-allowed disabled:border-[#d7dfd4] disabled:bg-[#e8efe4] disabled:text-[#98a69f]"
            >
              {state === "sending" ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
              Отправить
            </button>
          </div>
        </aside>
      </div>

      <div className="mt-[16px] border-t border-[#eef2eb] pt-[14px]">
        <div className="flex flex-wrap items-center justify-between gap-[10px]">
          <h3 className="m-0 text-[16px] font-semibold leading-tight tracking-[0] text-[#101a18]">История broadcast</h3>
          <button
            type="button"
            onClick={() => loadHistory(false)}
            disabled={historyState !== "idle"}
            className="inline-flex h-[34px] cursor-pointer items-center justify-center gap-[7px] rounded-[8px] border border-[#cbd6c9] bg-white px-[11px] text-[13px] font-semibold text-[#17211f] transition hover:border-[#9bb195] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75c83f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={14} className={historyState !== "idle" ? "animate-spin" : ""} aria-hidden="true" />
            Обновить
          </button>
        </div>
        <BroadcastHistoryTable history={history} deletingId={deletingId} loading={historyState === "loading"} onDelete={handleDelete} />
      </div>
    </section>
  );
}

function BroadcastHistoryTable({
  history,
  deletingId,
  loading,
  onDelete,
}: {
  history: AdminTelegramBroadcastRecord[];
  deletingId: string | null;
  loading: boolean;
  onDelete: (record: AdminTelegramBroadcastRecord) => void;
}) {
  if (loading) {
    return (
      <div className="mt-[12px] flex h-[74px] items-center justify-center gap-[8px] rounded-[8px] border border-[#eef2eb] bg-[#fbfcf8] text-[13px] font-medium text-[#66756f]">
        <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        Загружаем историю
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="mt-[12px] rounded-[8px] border border-[#eef2eb] bg-[#fbfcf8] px-[12px] py-[16px] text-[13px] text-[#66756f]">
        Пока нет сохранённых broadcast.
      </div>
    );
  }

  return (
    <div className="mt-[12px] overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#e1e7dc] text-[11px] uppercase tracking-[0.06em] text-[#6b7972]">
            <th className="py-[9px] pr-[10px] font-semibold">Дата</th>
            <th className="px-[10px] py-[9px] font-semibold">Сегмент</th>
            <th className="px-[10px] py-[9px] font-semibold">Сообщение</th>
            <th className="px-[10px] py-[9px] font-semibold">Статус</th>
            <th className="px-[10px] py-[9px] font-semibold">Итог</th>
            <th className="py-[9px] pl-[10px] font-semibold">Действие</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => {
            const deletable = canDeleteBroadcast(record);
            const isDeleting = deletingId === record.id;
            return (
              <tr key={record.id} className="border-b border-[#eef2eb] last:border-b-0">
                <td className="whitespace-nowrap py-[10px] pr-[10px] text-[#34423e]">{formatDateTime(record.created_at)}</td>
                <td className="whitespace-nowrap px-[10px] py-[10px] text-[#34423e]">{segmentLabel(record.segment)}</td>
                <td className="max-w-[310px] px-[10px] py-[10px] text-[#17211f]">
                  <span className="block truncate">{broadcastTitle(record)}</span>
                  <span className="mt-[2px] block text-[11px] text-[#7a8882]">{formatShortId(record.id)}</span>
                </td>
                <td className="whitespace-nowrap px-[10px] py-[10px] text-[#50615b]">{statusLabel(record.status)}</td>
                <td className="whitespace-nowrap px-[10px] py-[10px] tabular-nums text-[#50615b]">
                  {formatNumber(record.sent)} sent, {formatNumber(record.deleted)} del, {formatNumber(record.failed + record.blocked)} err
                </td>
                <td className="py-[10px] pl-[10px]">
                  <button
                    type="button"
                    onClick={() => onDelete(record)}
                    disabled={!deletable || Boolean(deletingId)}
                    className="inline-flex h-[32px] min-w-[98px] cursor-pointer items-center justify-center gap-[6px] rounded-[8px] border border-[#efc4bb] bg-white px-[10px] text-[12px] font-semibold text-[#8b3728] transition hover:bg-[#fff6f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cf6957] disabled:cursor-not-allowed disabled:border-[#e2e8df] disabled:text-[#9ca9a3]"
                  >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Trash2 size={14} aria-hidden="true" />}
                    Удалить
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IconField({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-[6px] text-[13px] font-semibold text-[#34423e]">
      <span className="inline-flex items-center gap-[6px]">{icon}{label}</span>
      {children}
    </label>
  );
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-[10px]">
      <span>{label}</span>
      <span className={`grid h-[20px] w-[20px] place-items-center rounded-full ${ok ? "bg-[#e6f6e5] text-[#24713b]" : "bg-[#ffe8e2] text-[#b33a26]"}`}>
        {ok ? <CheckCircle2 size={13} aria-hidden="true" /> : <AlertTriangle size={13} aria-hidden="true" />}
      </span>
    </div>
  );
}

function BroadcastError({ message }: { message: string }) {
  return (
    <div className="mt-[14px] flex items-start gap-[8px] rounded-[8px] border border-[#f0c7bf] bg-[#fff6f3] p-[10px] text-[#7a2f21]">
      <AlertTriangle size={16} className="mt-[1px] shrink-0" aria-hidden="true" />
      <p className="m-0 text-[13px] leading-[1.45]">{message}</p>
    </div>
  );
}

function canDeleteBroadcast(record: AdminTelegramBroadcastRecord): boolean {
  return record.sent > record.deleted && record.status !== "deleting" && record.status !== "deleted";
}

function broadcastTitle(record: AdminTelegramBroadcastRecord): string {
  const text = record.text?.trim();
  if (text) return text;
  return record.photo_url ? "Photo broadcast" : "Broadcast";
}

function segmentLabel(segment: AdminTelegramBroadcastSegment): string {
  return SEGMENT_OPTIONS.find((option) => option.value === segment)?.label ?? segment;
}

function statusLabel(status: AdminTelegramBroadcastRecord["status"]): string {
  const labels: Record<AdminTelegramBroadcastRecord["status"], string> = {
    sending: "sending",
    sent: "sent",
    partial: "partial",
    failed: "failed",
    deleting: "deleting",
    deleted: "deleted",
    delete_partial: "delete partial",
  };
  return labels[status] ?? status;
}

function resolveBroadcastError(error: unknown): string {
  if (error instanceof AdminApiError) {
    if (error.status === 403) return "Этот аккаунт не входит в server-side allowlist админки.";
    if (error.status === 401) return "Сессия истекла. Войди снова через /login.";
    if (error.code === "missing_telegram_admin_secret") return "В Vercel не задан TELEGRAM_ADMIN_SECRET.";
    if (error.code === "empty_message") return "Добавь текст или Photo URL.";
    if (error.code === "invalid_button") return "Для кнопки нужны и Button text, и Button URL.";
    if (error.code === "invalid_photo_url") return "Photo URL должен быть HTTPS и не вести на SVG/HTML.";
    if (error.code === "invalid_button_url") return "Button URL должен быть http или https.";
    if (error.code === "caption_too_long") return "Для фото Telegram caption ограничен 1024 символами.";
    if (error.code === "message_too_long") return "Текст Telegram message ограничен 4096 символами.";
    if (error.code === "recipient_count_changed") return "Количество получателей изменилось. Сделай Preview ещё раз.";
    if (error.code === "empty_recipients") return "В этом сегменте сейчас нет получателей.";
    if (error.code === "broadcast_history_unavailable") return "Backend не смог сохранить историю broadcast, отправка остановлена.";
    if (error.code === "broadcast_not_found") return "Broadcast не найден в истории.";
    if (error.code === "invalid_broadcast_id") return "Некорректный broadcast id.";
    if (error.code === "telegram_broadcast_failed") return "Telegram broadcast endpoint отклонил запрос или вернул ошибку.";
    if (error.code === "telegram_broadcast_unavailable") return "Telegram broadcast endpoint сейчас недоступен.";
    if (error.code === "telegram_broadcasts_failed") return "Telegram broadcast history endpoint отклонил запрос или вернул ошибку.";
    if (error.code === "telegram_broadcasts_unavailable") return "Telegram broadcast history endpoint сейчас недоступен.";
  }
  return "Не удалось выполнить broadcast.";
}

function resolveUploadError(error: unknown): string {
  if (error instanceof AdminApiError) {
    if (error.status === 403) return "Этот аккаунт не входит в server-side allowlist админки.";
    if (error.status === 401) return "Сессия истекла. Войди снова через /login.";
    if (error.code === "missing_telegram_admin_secret") return "В Vercel не задан TELEGRAM_ADMIN_SECRET.";
    if (error.code === "invalid_content_type") return "Можно загрузить только JPG, PNG или WEBP.";
    if (error.code === "invalid_image_data") return "Не удалось прочитать файл изображения.";
    if (error.code === "telegram_upload_failed") return "Backend не смог сохранить фото для Telegram.";
    if (error.code === "telegram_upload_unavailable") return "Upload endpoint сейчас недоступен.";
  }
  if (error instanceof Error) return error.message;
  return "Не удалось загрузить фото.";
}

async function prepareTelegramPhoto(file: File): Promise<{
  blob: Blob;
  fileName: string;
  contentType: "image/jpeg" | "image/png" | "image/webp";
}> {
  if (!VALID_UPLOAD_TYPES.has(file.type)) throw new Error("Можно загрузить только JPG, PNG или WEBP.");
  if (file.size <= MAX_UPLOAD_BYTES) {
    return {
      blob: file,
      fileName: file.name || "telegram-photo",
      contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
    };
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_UPLOAD_EDGE / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
  canvas.height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Браузер не смог подготовить фото.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let blob = await canvasToBlob(canvas, "image/jpeg", 0.86);
  if (blob.size > MAX_UPLOAD_BYTES) blob = await canvasToBlob(canvas, "image/jpeg", 0.72);
  if (blob.size > MAX_UPLOAD_BYTES) blob = await canvasToBlob(canvas, "image/jpeg", 0.58);
  if (blob.size > MAX_UPLOAD_BYTES) throw new Error("Фото слишком тяжёлое даже после сжатия. Возьми файл поменьше.");

  return {
    blob,
    fileName: replaceExtension(file.name || "telegram-photo.jpg", "jpg"),
    contentType: "image/jpeg",
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Не удалось открыть изображение."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Не удалось сжать изображение."));
    }, type, quality);
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      const commaIndex = value.indexOf(",");
      resolve(commaIndex >= 0 ? value.slice(commaIndex + 1) : value);
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
    reader.readAsDataURL(blob);
  });
}

function replaceExtension(fileName: string, extension: string): string {
  const clean = fileName.trim() || `telegram-photo.${extension}`;
  return clean.includes(".") ? clean.replace(/\.[^.]+$/, `.${extension}`) : `${clean}.${extension}`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value || 0);
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortId(id: string): string {
  return id.slice(0, 8);
}
