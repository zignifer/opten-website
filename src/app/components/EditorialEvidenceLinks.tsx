import { useT } from "../../i18n/LangContext";
import type { EditorialEvidenceLink } from "../../content/editorialEvidence";
import LocalizedLink from "./LocalizedLink";

function isInternalHref(href: string): boolean {
  return href.startsWith("/");
}

export default function EditorialEvidenceLinks({ links }: { links: EditorialEvidenceLink[] }) {
  const t = useT();
  if (links.length === 0) return null;

  return (
    <section
      className="mt-[40px] border-t border-white/10 pt-[28px]"
      aria-labelledby="editorial-evidence-heading"
    >
      <h2
        id="editorial-evidence-heading"
        className="text-[22px] font-medium leading-[1.3] tracking-[-0.4px] text-white md:text-[24px]"
      >
        {t("content.evidenceHeading")}
      </h2>
      <p className="mt-[10px] text-[14px] leading-[1.6] text-white/55">
        {t("content.evidenceIntro")}
      </p>
      <ul className="mt-[18px] flex flex-col gap-[12px]">
        {links.map((link) => {
          const content = (
            <>
              <span className="text-[11px] font-bold uppercase tracking-[1px] text-[#9cfb51]">
                {t(link.kind === "source" ? "content.sourceLabel" : "content.guideLabel")}
              </span>
              <span className="mt-[3px] block text-[15px] font-medium text-white transition group-hover:text-[#9cfb51]">
                {link.label} ↗
              </span>
              <span className="mt-[3px] block text-[13px] leading-[1.5] text-white/55">
                {link.note}
              </span>
            </>
          );

          return (
            <li key={`${link.kind}:${link.href}`}>
              {isInternalHref(link.href) ? (
                <LocalizedLink
                  to={link.href}
                  className="group block rounded-[8px] border border-white/10 bg-white/[0.03] px-[16px] py-[13px] no-underline transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  {content}
                </LocalizedLink>
              ) : (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-[8px] border border-white/10 bg-white/[0.03] px-[16px] py-[13px] no-underline transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
