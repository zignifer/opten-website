import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export const matches = (query: string, ...values: unknown[]) => values.join(" ").toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"));
export function Notice({ children }: { children: ReactNode }) { return <div className="ds-notice">{children}</div>; }
export function Empty() { return <Notice>Совпадений нет. Попробуйте другое название или исходник.</Notice>; }
export function Source({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  return <button className="ds-source" title="Скопировать путь к исходнику" onClick={() => {
    void navigator.clipboard.writeText(path).then(() => setCopied(true)).catch(() => setCopied(false));
  }}>{copied ? <Check size={12} /> : <Copy size={12} />}<code>{path}</code></button>;
}
