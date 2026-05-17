// Phase 4 D-01 / D-02: RU-only E-E-A-T page. /en/about deferred to Phase 4.1.
// SSR-eligible: no localStorage/window/navigator access at render time. Body content
// is human-curated (sourced from C:/Projects/Obsidian/Vlad/ — author's vault) and
// approved by user 2026-05-17 per D-07 (no LLM-generated body on E-E-A-T pages).
// Hero renders initials placeholder per locked decision option (c) — photo deferred.

import { useT } from "../../i18n/LangContext";
import LangSwitcher from "../components/LangSwitcher";
import LocalizedLink from "../components/LocalizedLink";

export default function AboutPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-black font-['PT_Root_UI',sans-serif]">
      {/* Header chrome (mirrors LegalLayout) */}
      <header className="flex items-center justify-between max-w-[800px] mx-auto px-[20px] py-[24px]">
        <LocalizedLink to="/" className="text-white text-[20px] font-bold no-underline hover:opacity-80 transition-opacity">
          Opten
        </LocalizedLink>
        <div className="flex items-center gap-[16px]">
          <LangSwitcher className="text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-['PT_Root_UI',sans-serif]" />
          <LocalizedLink to="/" className="text-[rgba(255,255,255,0.5)] text-[14px] no-underline hover:text-white transition-colors">
            {t("about.backLink")}
          </LocalizedLink>
        </div>
      </header>

      {/* Hero — initials placeholder (locked decision option c — photo deferred to Phase 4.1+ hotfix) */}
      <section className="max-w-[800px] mx-auto px-[20px] pt-[16px] pb-[40px] flex flex-col md:flex-row gap-[24px] md:gap-[32px] items-center md:items-start">
        <div className="shrink-0 size-[96px] md:size-[120px] rounded-full bg-gradient-to-br from-[#9cfb51] to-[#5fb821] flex items-center justify-center">
          <span className="font-['Unbounded',sans-serif] text-[36px] md:text-[44px] font-bold text-[#011417] tracking-[-1px] select-none" aria-hidden="true">
            ВВ
          </span>
        </div>
        <div className="flex flex-col items-center md:items-start gap-[8px] text-center md:text-left">
          <h1 className="text-white text-[32px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.8px]">
            Влад Воронежцев
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-[16px] md:text-[18px] leading-[1.5]">
            {t("about.tagline")}
          </p>
          <a
            href="https://t.me/v_voronezhtsev"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[12px] inline-flex items-center gap-[8px] rounded-[100px] bg-white px-[20px] py-[10px] font-['PT_Root_UI',sans-serif] text-[14px] font-bold text-[#011417] no-underline hover:opacity-90 transition-opacity"
          >
            {t("about.contactCta")}
          </a>
        </div>
      </section>

      {/* Body content — human-written, sourced from author's Obsidian vault, approved by user 2026-05-17.
          Section headings inlined (RU-only page; no useT for headings — keeps body translatable as one unit later). */}
      <main className="max-w-[800px] mx-auto px-[20px] pb-[80px]">
        <article className="about-content text-[rgba(255,255,255,0.78)] text-[16px] leading-[1.7]">
          <h2>Откуда взялся Opten</h2>
          <p>
            Я Влад Воронежцев — снимаю YouTube Shorts про нейросети для генерации картинок и видео
            (канал <a href="https://youtube.com/@v.voronezhtsev" target="_blank" rel="noopener noreferrer">@v.voronezhtsev</a>,
            4 500+ подписчиков, 54 ролика, около 7 млн просмотров за год). По профессии я веб-дизайнер,
            а с 2024-го года ушёл в AI-креатив с головой: Midjourney, Kling, Veo, Sora, Nano Banana,
            Seedance — пробовал почти всё, что вышло.
          </p>
          <p>
            Чем больше я делал контент, тем чаще видел один и тот же паттерн: люди заходят в Syntx,
            Higgsfield или Freepik, пишут промпт «в лоб», получают посредственный результат — и думают,
            что это нейросеть плохая. Хотя на самом деле под капотом сидит мощная модель, но она не
            понимает, чего от неё хотят. Промпт — это навык. Просто никто его толком не учит.
          </p>
          <p>
            Opten я начал делать осенью 2025-го для себя — нужен был инструмент, который покажет
            в реальном времени, насколько мой промпт «попадает» в конкретную модель и что в нём улучшить.
            Из личного эксперимента быстро вышло, что эта же боль есть у тысяч моих зрителей. Так появилось
            расширение для Chrome.
          </p>

          <h2>Почему именно про промпты</h2>
          <p>
            Главная проблема, которую закрывает Opten — <strong>каждая модель пишется по-своему</strong>.
            Kling реагирует на одну формулировку движения, Sora — на другую, Midjourney любит технические
            термины из кинематографа, Nano Banana — короткие, плотные описания без воды. Универсальных
            «10 советов как писать промпт» не существует: то, что работает в Flux, в Imagen даёт мусор.
          </p>
          <p>
            Я собрал 60 skill-файлов под конкретные модели — Seedance (все версии), Seedream,
            Kling с motion-control, Midjourney 7/8/niji/video, GPT Image, Flux, Nano Banana, Imagen,
            Luma Ray, Sora 2, Veo 3/3.1, Runway, MiniMax Hailuo, Pixverse, LTX, Wan, Qwen, Grok Imagine
            и другие. Плюс два fallback-режима на случай если вы пробуете что-то редкое. Каждый skill —
            это правила, склеенные из официальной документации конкретной модели и моего собственного
            опыта генераций.
          </p>
          <p>
            Сам Opten не просто оценивает промпт по 0–100 и подсвечивает до пяти конкретных проблем.
            Он умеет <strong>auto-enhance</strong> — одним кликом переписывает промпт под выбранную модель.
            Параллельный rewrite — нажал, через секунду получил улучшенную версию.
          </p>

          <h2>Что вы получаете</h2>
          <p>
            Установил расширение → зашёл в любимый AI-генератор (Syntx, Higgsfield, Freepik — поддержка
            ширится) → пишешь промпт как обычно → Opten молча его оценивает прямо в интерфейсе, не уводя
            в отдельное окно.
          </p>
          <p>Что получаешь:</p>
          <ul>
            <li><strong>Оценка 0–100</strong> по правилам конкретной модели — видно сразу, насколько промпт сильный.</li>
            <li><strong>До пяти конкретных замечаний</strong> с иконками pass/fail/neutral. Не «попробуй ещё раз», а «не указан стиль освещения, добавь soft daylight».</li>
            <li><strong>Auto-enhance</strong> — улучшенный промпт за один клик. Никаких «вот десять советов» — сразу готовый текст, который можно скопировать или применить кнопкой.</li>
            <li><strong>Multimodal</strong> — Opten учитывает референсные изображения, которые вы уже приложили. Не предлагает добавить то, что и так висит в превью.</li>
            <li><strong>Автоопределение модели</strong> — не нужно вручную говорить «это Kling»; Opten смотрит на URL и DOM-разметку страницы.</li>
            <li><strong>Privacy</strong> — ваши промпты и референсы <strong>не сохраняются на серверах Opten</strong>. Анализ идёт через Claude Haiku 4.5 за приватным Vercel-прокси, чисто транзитом.</li>
            <li><strong>RU / EN</strong> — интерфейс сам подхватывает язык браузера.</li>
          </ul>
          <p>
            По цене: <strong>10 проверок в месяц бесплатно</strong>. Pro — 199 ₽/мес с автопродлением
            через ЮKassa, либо 299 ₽ разово без подписки на месяц. Для платежей в долларах — Paddle,
            около $2.99. Это в пять раз дешевле PromptPerfect ($9.99), и при этом Opten работает в десятках
            интерфейсов, а не только в собственном чате.
          </p>

          <h2>Контакты</h2>
          <p>
            Если хотите связаться лично, написать про баг, попросить добавить поддержку конкретной модели
            или просто обсудить генерации — мне удобнее всего в Telegram:{" "}
            <a href="https://t.me/v_voronezhtsev" target="_blank" rel="noopener noreferrer">@v_voronezhtsev</a>.
            Там же мой канал «Влад Воронежцев | Про нейросети» — туда я выкладываю длинные разборы, промпты,
            ссылки и закулисье.
          </p>
          <p>
            YouTube — <a href="https://youtube.com/@v.voronezhtsev" target="_blank" rel="noopener noreferrer">@v.voronezhtsev</a>.
            Там короткие туториалы и тренды.
          </p>
          <p>
            <strong>Юридически</strong> Opten работает в России от ИП Воронежцев Владислав Павлович,
            ИНН 723016676391, Тюмень. Для международных платежей через Paddle — IE Nikolai Shupletsov
            как Merchant of Record (это стандартная схема для Paddle, к самому продукту отношения не имеет).
            Полные реквизиты, оферта и политика возврата — в{" "}
            <LocalizedLink to="/terms">Условиях использования</LocalizedLink> и{" "}
            <LocalizedLink to="/refund">Политике возврата</LocalizedLink>.
          </p>
        </article>
      </main>

      {/* Footer chrome (mirrors LegalLayout) */}
      <footer className="max-w-[800px] mx-auto px-[20px] py-[32px] border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-wrap gap-[24px] text-[14px] text-[rgba(255,255,255,0.4)]">
          <LocalizedLink to="/privacy" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.privacy")}</LocalizedLink>
          <LocalizedLink to="/terms" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.terms")}</LocalizedLink>
          <LocalizedLink to="/refund" className="hover:text-white transition-colors no-underline text-inherit">{t("legal.footer.refund")}</LocalizedLink>
          <span>{t("legal.footer.copyright")}</span>
        </div>
      </footer>

      <style>{`
        .about-content h2 {
          color: white;
          font-size: 24px;
          font-weight: 500;
          margin-top: 48px;
          margin-bottom: 18px;
          line-height: 1.3;
          letter-spacing: -0.4px;
        }
        .about-content h2:first-child {
          margin-top: 0;
        }
        .about-content p {
          margin-bottom: 14px;
        }
        .about-content ul {
          margin-top: 8px;
          margin-bottom: 16px;
          padding-left: 24px;
          list-style-type: disc;
        }
        .about-content li {
          margin-bottom: 8px;
        }
        .about-content a {
          color: #9cfb51;
          text-decoration: underline;
        }
        .about-content a:hover {
          color: white;
        }
        .about-content strong {
          color: white;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
