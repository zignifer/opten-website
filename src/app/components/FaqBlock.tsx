// Phase 4 D-08: shared FAQ block — items are passed in (locale-resolved by caller).
// Schema mainEntity match is critical — visible Q/A == JSON-LD mainEntity Q/A (V-10).
// SSR-safe: no window/localStorage/navigator/useEffect at render time. Plain <dl>/<dt>/<dd>
// markup (no Radix Accordion in v1 — collapse UX is a future plan if requested).

import { useT } from "../../i18n/LangContext";

export interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  items: readonly FaqItem[];
  headingKey?: string;
  id?: string;
}

export default function FaqBlock({ items, headingKey = "faq.heading", id = "faq" }: Props) {
  const t = useT();
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="max-w-[800px] mx-auto px-[20px] py-[40px] font-['PT_Root_UI',sans-serif]"
    >
      <h2
        id={`${id}-heading`}
        className="text-white text-[24px] md:text-[28px] font-medium leading-[1.3] tracking-[-0.4px] mb-[24px]"
      >
        {t(headingKey)}
      </h2>
      <dl className="flex flex-col gap-[20px]">
        {items.map((item, i) => (
          <div key={i} className="border-t border-[rgba(255,255,255,0.08)] pt-[20px]">
            <dt className="text-white text-[17px] md:text-[18px] font-medium leading-[1.4] mb-[10px]">
              {item.q}
            </dt>
            <dd className="text-[rgba(255,255,255,0.7)] text-[16px] leading-[1.7]">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
