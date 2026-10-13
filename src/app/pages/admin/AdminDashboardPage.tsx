import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import { useSpaceAuth } from "../../components/space/SpaceAuthProvider";

const AdminWorkspace = lazy(() => import("../../../design-system/AdminWorkspace"));

export default function AdminDashboardPage() {
  const { status, session } = useSpaceAuth();
  const location = useLocation();
  const token = session?.access_token || "";
  const preview = import.meta.env.DEV && new URLSearchParams(location.search).get("preview") === "design-system";
  const [authorizedToken, setAuthorizedToken] = useState("");
  const [failure, setFailure] = useState<{ token: string; message: string } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    document.title = "Opten Admin · библиотека и документация";
  }, []);

  useEffect(() => {
    if (preview || status !== "signed_in" || !token) return;
    const controller = new AbortController();
    setAuthorizedToken("");
    setFailure(null);
    void fetch("/api/admin/session", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(response.status === 403 ? "Этот аккаунт не имеет доступа к админке." : response.status === 401 ? "Сессия истекла. Войдите снова." : "Не удалось проверить доступ. Попробуйте ещё раз.");
        const result = await response.json();
        if (result.ok !== true) throw new Error("Сервер не подтвердил доступ.");
        if (!controller.signal.aborted) setAuthorizedToken(token);
      }).catch(error => { if (!controller.signal.aborted) setFailure({ token, message: error.message }); });
    return () => controller.abort();
  }, [preview, status, token, attempt]);

  if (preview || (status === "signed_in" && token && authorizedToken === token)) {
    return <Suspense fallback={<AccessState loading title="Открываем библиотеку" />}>
      <AdminWorkspace preview={preview} accessToken={preview ? "" : token} email={preview ? null : session?.user.email || null} />
    </Suspense>;
  }
  if (status === "loading" || (status === "signed_in" && token && failure?.token !== token)) return <AccessState loading title="Проверяем доступ" />;
  const signIn = status !== "signed_in" || !token;
  return <AccessState title={signIn ? "Вход в Opten Admin" : "Доступ не подтверждён"} description={signIn ? "Библиотека проекта доступна через аккаунт владельца." : failure?.message}>
    {signIn ? <Link className="admin-access-button" to={`/login?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`}>Войти по Email</Link> : <><button className="admin-access-button" onClick={() => setAttempt(value => value + 1)}>Проверить ещё раз</button><Link to={`/login?next=${encodeURIComponent(location.pathname + location.hash)}`} style={{ display:"block",marginTop:16,color:"#ffffff99",fontSize:13 }}>Войти заново</Link></>}
  </AccessState>;
}

function AccessState({ title, description, loading, children }: { title: string; description?: string; loading?: boolean; children?: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", background: "#011417", color: "white", fontFamily: "'PT Root UI',sans-serif", display: "grid", placeItems: "center", padding: 24 }}>
    <style>{`.admin-access-button{display:inline-flex;border:0;border-radius:999px;padding:12px 22px;background:#9cfb51;color:#011417;font-weight:700;text-decoration:none;cursor:pointer}.admin-access-button:focus-visible{outline:2px solid white;outline-offset:4px}`}</style>
    <section style={{ width: "100%", maxWidth: 460, border: "1px solid #ffffff1a", borderRadius: 16, padding: 32, background: "#0e2023", textAlign: "center" }}>
      {loading ? <RefreshCw className="animate-spin mx-auto" size={24} /> : <LockKeyhole className="mx-auto" size={24} color="#9cfb51" />}
      <h1 style={{ fontFamily: "Unbounded,sans-serif", fontSize: 24, marginTop: 20, lineHeight: 1.3 }}>{title}</h1>
      {description && <p style={{ opacity: .65, margin: "14px 0 24px" }}>{description}</p>}
      {children}
      <Link to="/" style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24, fontSize: 13, color: "#ffffff99" }}><ShieldCheck size={16} /> На сайт Opten</Link>
    </section>
  </div>;
}
