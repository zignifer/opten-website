import { useEffect, useState } from "react";
import { useT } from "../../i18n/LangContext";
import LocalizedLink from "../components/LocalizedLink";

const EXTENSION_IDS = [
  "iphkppgbobpilmphloffcalicmejacfl",  // Chrome Web Store
  "kcmcaeenfmfnpiaihicecnfnagejpcog",  // Local dev
];

type Status =
  | "detecting"
  | "no_extension"
  | "no_auth"
  | "checking"
  | "downloading"
  | "success"
  | "not_pro"
  | "error";

export default function DownloadSkillPage() {
  const t = useT();
  const [status, setStatus] = useState<Status>("detecting");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    void start();
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    const chrome = (window as any).chrome;
    if (!chrome?.runtime?.sendMessage) {
      setStatus("no_extension");
      return;
    }

    // Mirror AccountPage detection: try each extension ID, accept first valid response.
    let tried = 0;
    let resolved = false;
    for (const id of EXTENSION_IDS) {
      try {
        chrome.runtime.sendMessage(id, { type: "GET_AUTH_TOKEN" }, (response: any) => {
          tried++;
          if (resolved) return;
          if (chrome.runtime.lastError || !response) {
            if (tried >= EXTENSION_IDS.length) {
              setStatus("no_extension");
            }
            return;
          }
          if (!response.token) {
            resolved = true;
            setStatus("no_auth");
            return;
          }
          resolved = true;
          void downloadZip(response.token);
        });
      } catch {
        tried++;
        if (tried >= EXTENSION_IDS.length && !resolved) {
          setStatus("no_extension");
        }
      }
    }
  }

  async function downloadZip(token: string) {
    setStatus("checking");
    try {
      const response = await fetch("/api/download-skill", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 403) {
        setStatus("not_pro");
        return;
      }
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        setErrorMsg(`${response.status} ${errBody.error || "unknown"}`);
        setStatus("error");
        return;
      }

      setStatus("downloading");
      const blob = await response.blob();
      // Trigger native download via temporary anchor.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "opten.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Free Blob URL after click.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("success");
    } catch (e: any) {
      setErrorMsg(e?.message || "network_error");
      setStatus("error");
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{t("download.title")}</h1>
        {status === "detecting" && <p style={msgStyle}>{t("download.detecting")}</p>}
        {status === "no_extension" && (
          <>
            <p style={msgStyle}>{t("download.noExtensionLine1")}</p>
            <p style={msgStyle}>
              <a
                href="https://chromewebstore.google.com/detail/opten-%E2%80%94-ai-prompt-scorer/iphkppgbobpilmphloffcalicmejacfl"
                style={linkStyle}
              >
                {t("download.installExt")}
              </a>
            </p>
          </>
        )}
        {status === "no_auth" && <p style={msgStyle}>{t("download.noAuth")}</p>}
        {status === "checking" && <p style={msgStyle}>{t("download.checking")}</p>}
        {status === "downloading" && <p style={msgStyle}>{t("download.preparing")}</p>}
        {status === "success" && (
          <>
            <p style={msgStyle}>{t("download.successLine1")}</p>
            <p style={{ ...msgStyle, marginTop: 18, fontWeight: 600, color: "#ffffff" }}>
              {t("download.successHeading")}
            </p>
            <ol style={stepsListStyle}>
              <li style={stepItemStyle}>{t("download.successStep1")}</li>
              <li style={stepItemStyle}>{t("download.successStep2")}</li>
              <li style={stepItemStyle}>{t("download.successStep3")}</li>
              <li style={stepItemStyle}>{t("download.successStep4")}</li>
            </ol>
            <p style={{ ...msgStyle, marginTop: 16, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              {t("download.successFooter")}
            </p>
          </>
        )}
        {status === "not_pro" && (
          <>
            <p style={msgStyle}>{t("download.notProLine1")}</p>
            <p style={msgStyle}>
              <LocalizedLink to="/account?upgrade=skill" style={linkStyle}>
                {t("download.upgrade")}
              </LocalizedLink>
            </p>
          </>
        )}
        {status === "error" && (
          <p style={msgStyle}>
            {t("download.errorPrefix")}: {errorMsg}. {t("download.errorSuffix")}
          </p>
        )}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0a0a0a",
  color: "#ffffff",
  fontFamily: "Inter, sans-serif",
  padding: "24px",
};

const cardStyle: React.CSSProperties = {
  maxWidth: 540,
  width: "100%",
  background: "#171717",
  border: "1px solid #262626",
  borderRadius: 12,
  padding: "32px 28px",
  textAlign: "center",
};

const stepsListStyle: React.CSSProperties = {
  textAlign: "left",
  margin: "8px 0 0 0",
  paddingLeft: 22,
  color: "rgba(255,255,255,0.85)",
  fontSize: 14,
  lineHeight: 1.55,
};

const stepItemStyle: React.CSSProperties = {
  marginBottom: 10,
};

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  margin: "0 0 16px 0",
};

const msgStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.5,
  margin: "12px 0",
  color: "rgba(255,255,255,0.85)",
};

const linkStyle: React.CSSProperties = {
  color: "#9CFB51",
  textDecoration: "underline",
};
