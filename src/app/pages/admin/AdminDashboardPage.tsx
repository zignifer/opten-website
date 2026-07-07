import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useSpaceAuth } from "../../components/space/SpaceAuthProvider";
import {
  AdminApiError,
  fetchAdminTelegramStats,
  type AdminTelegramStats,
} from "../../../lib/adminApi";
import { AdminTelegramBroadcastPanel } from "./AdminTelegramBroadcastPanel";

const REFRESH_INTERVAL_MS = 45_000;

export default function AdminDashboardPage() {
  const { status, session, account, refresh } = useSpaceAuth();
  const [stats, setStats] = useState<AdminTelegramStats | null>(null);
  const [statsState, setStatsState] = useState<"idle" | "loading" | "refreshing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const accessToken = session?.access_token || "";

  const loadStats = useCallback(
    async (background = false) => {
      if (!accessToken) return;
      setStatsState(background && stats ? "refreshing" : "loading");
      setError(null);

      try {
        const nextStats = await fetchAdminTelegramStats(accessToken);
        setStats(nextStats);
        setStatsState("idle");
      } catch (err) {
        setStatsState("error");
        setError(resolveAdminError(err));
      }
    },
    [accessToken, stats],
  );

  useEffect(() => {
    if (status !== "signed_in" || !accessToken) return;
    void loadStats(false);
    const timer = window.setInterval(() => void loadStats(true), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [accessToken, loadStats, status]);

  if (status === "loading") {
    return (
      <AdminShell accountEmail={account?.email ?? session?.user.email ?? null}>
        <CenteredState icon={<RefreshCw className="animate-spin" size={22} />} title="Проверяем сессию" />
      </AdminShell>
    );
  }

  if (status === "signed_out" || !session) {
    return (
      <AdminShell accountEmail={null}>
        <CenteredState
          icon={<Lock size={22} />}
          title="Нужен вход в owner-аккаунт"
          description="Админка открывается через обычную website-сессию Opten Space."
          action={<LinkButton to="/login?next=/admin">Войти через Email OTP</LinkButton>}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell accountEmail={account?.email ?? session.user.email}>
      <section className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-[14px] border-b border-[#dbe2d5] pb-[18px] md:flex-row md:items-end md:justify-between">
          <div>
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#497160]">
              Owner dashboard
            </p>
            <h1 className="m-0 mt-[6px] font-['Unbounded',sans-serif] text-[28px] font-semibold leading-[1.12] tracking-[0] text-[#091413] md:text-[34px]">
              Telegram hidden intro
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-[10px]">
            <button
              type="button"
              onClick={() => refresh()}
              className="inline-flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[8px] border border-[#cbd6c9] bg-white px-[13px] text-[14px] font-semibold text-[#17211f] shadow-[0_1px_0_rgba(15,23,20,0.04)] transition hover:border-[#9bb195] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75c83f]"
            >
              <UserCheck size={16} aria-hidden="true" />
              Сессия
            </button>
            <button
              type="button"
              onClick={() => loadStats(false)}
              disabled={statsState === "loading" || statsState === "refreshing"}
              className="inline-flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[8px] border border-transparent bg-[#9cfb51] px-[13px] text-[14px] font-semibold text-[#0a1614] transition hover:bg-[#8cec48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75c83f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                aria-hidden="true"
                className={statsState === "loading" || statsState === "refreshing" ? "animate-spin" : ""}
              />
              Обновить
            </button>
          </div>
        </div>

        {error ? <AdminError message={error} /> : null}

        {stats ? (
          <>
            <AdminStatsView stats={stats} refreshing={statsState === "refreshing"} />
            <AdminTelegramBroadcastPanel accessToken={accessToken} onSent={() => loadStats(true)} />
          </>
        ) : statsState === "loading" ? (
          <CenteredState icon={<RefreshCw className="animate-spin" size={22} />} title="Загружаем статистику" />
        ) : null}
      </section>
    </AdminShell>
  );
}

function AdminStatsView({ stats, refreshing }: { stats: AdminTelegramStats; refreshing: boolean }) {
  const metrics = useMemo(
    () => [
      { label: "Старт", value: stats.funnel.start, icon: Users, tone: "slate" },
      { label: "Подписались", value: stats.funnel.subscription_verified, icon: UserCheck, tone: "green" },
      { label: "Доступ", value: stats.funnel.access_granted, icon: KeyRound, tone: "lime" },
      { label: "Открыли урок", value: stats.funnel.hidden_intro_opened, icon: CheckCircle2, tone: "blue" },
      { label: "Чекауты", value: stats.funnel.checkout_created, icon: ShoppingCart, tone: "amber" },
      { label: "Оплаты", value: stats.funnel.paid, icon: ShieldCheck, tone: "emerald" },
      { label: "Активные claims", value: stats.claims.active, icon: Clock3, tone: "violet" },
      { label: "Блокировки", value: stats.funnel.blocked, icon: AlertTriangle, tone: "red" },
    ],
    [stats],
  );

  return (
    <>
      <div className="grid gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-[14px] xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <section className="rounded-[8px] border border-[#dce4d9] bg-white p-[16px] shadow-[0_1px_0_rgba(14,23,20,0.04)]">
          <PanelHeader title="Воронка" meta={formatDateTime(stats.generated_at)} refreshing={refreshing} />
          <FunnelTable stats={stats} />
        </section>

        <section className="rounded-[8px] border border-[#dce4d9] bg-white p-[16px] shadow-[0_1px_0_rgba(14,23,20,0.04)]">
          <PanelHeader title="Claims и оплаты" meta="курс ai-content-marketing-2026" />
          <div className="mt-[12px] grid grid-cols-2 gap-[10px]">
            <MiniStat label="Claims всего" value={stats.claims.total} />
            <MiniStat label="Использованы" value={stats.claims.used} />
            <MiniStat label="Истекли" value={stats.claims.expired_unused} />
            <MiniStat label="Paid orders" value={stats.orders.paid} />
          </div>
        </section>
      </div>

      <section className="rounded-[8px] border border-[#dce4d9] bg-white p-[16px] shadow-[0_1px_0_rgba(14,23,20,0.04)]">
        <PanelHeader title="События" meta="агрегаты из telegram_hidden_intro_events" />
        <EventsTable events={stats.events} />
      </section>
    </>
  );
}

function AdminShell({ accountEmail, children }: { accountEmail: string | null; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f7f1] text-[#0c1514]" style={{ fontFamily: "'PT Root UI', sans-serif" }}>
      <header className="border-b border-[#0d211f] bg-[#061514] text-white">
        <div className="mx-auto flex min-h-[62px] max-w-[1180px] items-center justify-between gap-[14px] px-[16px] sm:px-[24px]">
          <Link to="/" className="flex items-center gap-[10px] text-white no-underline">
            <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] bg-[#9cfb51] text-[#061514]">
              <ShieldCheck size={17} aria-hidden="true" />
            </span>
            <span className="font-['Unbounded',sans-serif] text-[16px] font-semibold tracking-[0]">Opten Admin</span>
          </Link>
          <div className="flex min-w-0 items-center gap-[8px] text-[13px] text-white/72">
            <span className="hidden h-[8px] w-[8px] rounded-full bg-[#9cfb51] sm:block" aria-hidden="true" />
            <span className="max-w-[190px] truncate">{accountEmail || "signed out"}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-[16px] py-[22px] sm:px-[24px] md:py-[30px]">{children}</main>
    </div>
  );
}

function MetricCard({
  metric,
}: {
  metric: { label: string; value: number; icon: LucideIcon; tone: string };
}) {
  const Icon = metric.icon;
  const toneClass = metricToneClasses[metric.tone] || metricToneClasses.slate;

  return (
    <article className="rounded-[8px] border border-[#dce4d9] bg-white p-[15px] shadow-[0_1px_0_rgba(14,23,20,0.04)]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <p className="m-0 text-[13px] font-medium leading-[1.3] text-[#586862]">{metric.label}</p>
          <p className="m-0 mt-[8px] text-[30px] font-semibold leading-none tracking-[0] text-[#0d1715]">
            {formatNumber(metric.value)}
          </p>
        </div>
        <span className={`grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[8px] ${toneClass}`}>
          <Icon size={17} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function FunnelTable({ stats }: { stats: AdminTelegramStats }) {
  const rows = [
    { label: "Старт бота", value: stats.funnel.start },
    { label: "Подписка подтверждена", value: stats.funnel.subscription_verified },
    { label: "Доступ выдан", value: stats.funnel.access_granted },
    { label: "Урок открыт", value: stats.funnel.hidden_intro_opened },
    { label: "Чекаут создан", value: stats.funnel.checkout_created },
    { label: "Оплата", value: stats.funnel.paid },
  ];

  return (
    <div className="mt-[12px] overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-[#e1e7dc] text-[12px] uppercase tracking-[0.06em] text-[#6b7972]">
            <th className="py-[10px] pr-[12px] font-semibold">Этап</th>
            <th className="px-[12px] py-[10px] font-semibold">Кол-во</th>
            <th className="px-[12px] py-[10px] font-semibold">От старта</th>
            <th className="py-[10px] pl-[12px] font-semibold">От прошлого</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const previous = index > 0 ? rows[index - 1].value : row.value;
            return (
              <tr key={row.label} className="border-b border-[#eef2eb] last:border-b-0">
                <td className="py-[11px] pr-[12px] font-medium text-[#14211f]">{row.label}</td>
                <td className="px-[12px] py-[11px] tabular-nums text-[#14211f]">{formatNumber(row.value)}</td>
                <td className="px-[12px] py-[11px] tabular-nums text-[#50615b]">{formatPercent(row.value, stats.funnel.start)}</td>
                <td className="py-[11px] pl-[12px] tabular-nums text-[#50615b]">{formatPercent(row.value, previous)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EventsTable({ events }: { events: Record<string, number> }) {
  const rows = Object.entries(eventLabels).map(([key, label]) => ({ key, label, value: events[key] ?? 0 }));

  return (
    <div className="mt-[12px] grid gap-[8px] md:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => (
        <div key={row.key} className="flex min-h-[42px] items-center justify-between gap-[12px] rounded-[8px] border border-[#eef2eb] bg-[#fbfcf8] px-[12px] py-[9px]">
          <span className="min-w-0 truncate text-[13px] font-medium text-[#34423e]">{row.label}</span>
          <span className="shrink-0 tabular-nums text-[14px] font-semibold text-[#101a18]">{formatNumber(row.value)}</span>
        </div>
      ))}
    </div>
  );
}

function PanelHeader({ title, meta, refreshing = false }: { title: string; meta: string; refreshing?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-[10px]">
      <h2 className="m-0 text-[18px] font-semibold leading-tight tracking-[0] text-[#101a18]">{title}</h2>
      <div className="flex items-center gap-[7px] text-[12px] text-[#66756f]">
        {refreshing ? <RefreshCw size={13} className="animate-spin" aria-hidden="true" /> : null}
        <span>{meta}</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[8px] border border-[#eef2eb] bg-[#fbfcf8] p-[12px]">
      <p className="m-0 text-[12px] font-medium text-[#64736d]">{label}</p>
      <p className="m-0 mt-[6px] tabular-nums text-[24px] font-semibold leading-none text-[#101a18]">{formatNumber(value)}</p>
    </div>
  );
}

function AdminError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-[10px] rounded-[8px] border border-[#f0c7bf] bg-[#fff6f3] p-[12px] text-[#7a2f21]">
      <AlertTriangle size={18} className="mt-[1px] shrink-0" aria-hidden="true" />
      <p className="m-0 text-[14px] leading-[1.45]">{message}</p>
    </div>
  );
}

function CenteredState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <section className="mx-auto mt-[80px] flex max-w-[440px] flex-col items-center rounded-[8px] border border-[#dce4d9] bg-white p-[22px] text-center shadow-[0_1px_0_rgba(14,23,20,0.04)]">
      <span className="grid h-[42px] w-[42px] place-items-center rounded-[8px] bg-[#edf4e7] text-[#315d24]">{icon}</span>
      <h1 className="m-0 mt-[14px] text-[22px] font-semibold leading-tight tracking-[0] text-[#101a18]">{title}</h1>
      {description ? <p className="m-0 mt-[8px] text-[14px] leading-[1.5] text-[#5c6b65]">{description}</p> : null}
      {action ? <div className="mt-[16px]">{action}</div> : null}
    </section>
  );
}

function LinkButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex h-[40px] items-center justify-center rounded-[8px] bg-[#9cfb51] px-[14px] text-[14px] font-semibold text-[#0a1614] no-underline transition hover:bg-[#8cec48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75c83f]"
    >
      {children}
    </Link>
  );
}

function resolveAdminError(error: unknown): string {
  if (error instanceof AdminApiError) {
    if (error.status === 403) return "Этот аккаунт не входит в server-side allowlist админки.";
    if (error.status === 401) return "Сессия истекла. Войди снова через /login.";
    if (error.code === "missing_telegram_admin_secret") return "В Vercel не задан TELEGRAM_ADMIN_SECRET.";
    if (error.code === "telegram_stats_failed") return "Telegram stats endpoint отклонил запрос или вернул ошибку.";
  }
  return "Не удалось загрузить админскую статистику.";
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value || 0);
}

function formatPercent(value: number, total: number): string {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
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

const metricToneClasses: Record<string, string> = {
  slate: "bg-[#eef2f1] text-[#33413e]",
  green: "bg-[#e6f6e5] text-[#24713b]",
  lime: "bg-[#ecffd9] text-[#315d24]",
  blue: "bg-[#e8f0ff] text-[#315f9b]",
  amber: "bg-[#fff4d8] text-[#8a5b0a]",
  emerald: "bg-[#def7ef] text-[#166b50]",
  violet: "bg-[#f0eaff] text-[#6247a6]",
  red: "bg-[#ffe8e2] text-[#b33a26]",
};

const eventLabels: Record<string, string> = {
  bot_started: "bot_started",
  subscription_check_clicked: "subscription_check_clicked",
  subscription_verified: "subscription_verified",
  subscription_missing: "subscription_missing",
  hidden_intro_access_granted: "hidden_intro_access_granted",
  hidden_intro_opened: "hidden_intro_opened",
  course_payment_created: "course_payment_created",
  course_paid: "course_paid",
  bot_blocked: "bot_blocked",
  broadcast_sent: "broadcast_sent",
  broadcast_failed: "broadcast_failed",
  reminder_sent: "reminder_sent",
};
