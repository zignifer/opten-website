// Phase 4.1 W12a: per-language body data for /about. EN entry populated in W12b.
// Mirrors src/content/guides/gpt-image-2.ts pattern (per-language object literals consumed via useLang()).
//
// Filename note: this file uses the .tsx extension (deviates from the captured-decisions seed
// which named it .ts) because the data structure contains inline JSX (<a>, <strong>,
// <LocalizedLink>) per D-Wave-12a — "no AST renderer". TS files cannot contain JSX, so .tsx
// is the practical constraint. AboutPage imports as `from "../../content/about"` (no extension)
// and TS resolves either .ts or .tsx automatically.
//
// EN body is intentionally `null` here — Wave 12b will populate it with an approved EN translation.
// Until then, consumers should fall back to `aboutContent.ru` (see AboutPage.tsx).

import type { ReactNode } from "react";
import LocalizedLink from "../app/components/LocalizedLink";

export interface AboutSection {
  heading: string;
  body: ReactNode;
}

export interface AboutContent {
  sections: AboutSection[];
}

const ru: AboutContent = {
  sections: [
    {
      heading: "Откуда взялся Opten",
      body: (
        <>
          <p className="mb-[14px]">
            Я Влад Воронежцев — снимаю YouTube Shorts про нейросети для генерации картинок и видео
            (канал <a href="https://youtube.com/@v.voronezhtsev" target="_blank" rel="noopener noreferrer" className="text-[#9cfb51] underline hover:text-white transition-colors">@v.voronezhtsev</a>,
            4 500+ подписчиков, 54 ролика, около 7 млн просмотров за год). По профессии я веб-дизайнер,
            а с 2024-го года ушёл в AI-креатив с головой: Midjourney, Kling, Veo, Sora, Nano Banana,
            Seedance — пробовал почти всё, что вышло.
          </p>
          <p className="mb-[14px]">
            Чем больше я делал контент, тем чаще видел один и тот же паттерн: люди заходят в Syntx,
            Higgsfield или Freepik, пишут промпт «в лоб», получают посредственный результат — и думают,
            что это нейросеть плохая. Хотя на самом деле под капотом сидит мощная модель, но она не
            понимает, чего от неё хотят. Промпт — это навык. Просто никто его толком не учит.
          </p>
          <p className="mb-[14px]">
            Opten я начал делать осенью 2025-го для себя — нужен был инструмент, который покажет
            в реальном времени, насколько мой промпт «попадает» в конкретную модель и что в нём улучшить.
            Из личного эксперимента быстро вышло, что эта же боль есть у тысяч моих зрителей. Так появилось
            расширение для Chrome.
          </p>
        </>
      ),
    },
    {
      heading: "Почему именно про промпты",
      body: (
        <>
          <p className="mb-[14px]">
            Главная проблема, которую закрывает Opten — <strong className="text-white font-semibold">каждая модель пишется по-своему</strong>.
            Kling реагирует на одну формулировку движения, Sora — на другую, Midjourney любит технические
            термины из кинематографа, Nano Banana — короткие, плотные описания без воды. Универсальных
            «10 советов как писать промпт» не существует: то, что работает в Flux, в Imagen даёт мусор.
          </p>
          <p className="mb-[14px]">
            Я собрал 60 skill-файлов под конкретные модели — Seedance (все версии), Seedream,
            Kling с motion-control, Midjourney 7/8/niji/video, GPT Image, Flux, Nano Banana, Imagen,
            Luma Ray, Sora 2, Veo 3/3.1, Runway, MiniMax Hailuo, Pixverse, LTX, Wan, Qwen, Grok Imagine
            и другие. Плюс два fallback-режима на случай если вы пробуете что-то редкое. Каждый skill —
            это правила, склеенные из официальной документации конкретной модели и моего собственного
            опыта генераций.
          </p>
          <p className="mb-[14px]">
            Сам Opten не просто оценивает промпт по 0–100 и подсвечивает до пяти конкретных проблем.
            Он умеет <strong className="text-white font-semibold">auto-enhance</strong> — одним кликом переписывает промпт под выбранную модель.
            Параллельный rewrite — нажал, через секунду получил улучшенную версию.
          </p>
        </>
      ),
    },
    {
      heading: "Что вы получаете",
      body: (
        <>
          <p className="mb-[14px]">
            Установил расширение → зашёл в любимый AI-генератор (Syntx, Higgsfield, Freepik — поддержка
            ширится) → пишешь промпт как обычно → Opten молча его оценивает прямо в интерфейсе, не уводя
            в отдельное окно.
          </p>
          <p className="mb-[14px]">Что получаешь:</p>
          <ul className="mt-[8px] mb-[16px] pl-[24px] list-disc">
            <li className="mb-[8px]"><strong className="text-white font-semibold">Оценка 0–100</strong> по правилам конкретной модели — видно сразу, насколько промпт сильный.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">До пяти конкретных замечаний</strong> с иконками pass/fail/neutral. Не «попробуй ещё раз», а «не указан стиль освещения, добавь soft daylight».</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Auto-enhance</strong> — улучшенный промпт за один клик. Никаких «вот десять советов» — сразу готовый текст, который можно скопировать или применить кнопкой.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Multimodal</strong> — Opten учитывает референсные изображения, которые вы уже приложили. Не предлагает добавить то, что и так висит в превью.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Автоопределение модели</strong> — не нужно вручную говорить «это Kling»; Opten смотрит на URL и DOM-разметку страницы.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Privacy</strong> — ваши промпты и референсы <strong className="text-white font-semibold">не сохраняются на серверах Opten</strong>. Анализ идёт через Claude Haiku 4.5 за приватным Vercel-прокси, чисто транзитом.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">RU / EN</strong> — интерфейс сам подхватывает язык браузера.</li>
          </ul>
          <p className="mb-[14px]">
            По цене: <strong className="text-white font-semibold">установка и регистрация бесплатны</strong>. Pro — 199 ₽/мес с автопродлением
            через ЮKassa, либо 299 ₽ разово без подписки на месяц. Для платежей в долларах — Paddle,
            около $2.99/мес или $4.99 разово. Это в пять раз дешевле PromptPerfect ($9.99), и при этом
            Opten работает в десятках интерфейсов, а не только в собственном чате.
          </p>
        </>
      ),
    },
    {
      heading: "Контакты",
      body: (
        <>
          <p className="mb-[14px]">
            Если хотите связаться лично, написать про баг, попросить добавить поддержку конкретной модели
            или просто обсудить генерации — мне удобнее всего в Telegram:{" "}
            <a href="https://t.me/v_voronezhtsev" target="_blank" rel="noopener noreferrer" className="text-[#9cfb51] underline hover:text-white transition-colors">@v_voronezhtsev</a>.
            Там же мой канал «Влад Воронежцев | Про нейросети» — туда я выкладываю длинные разборы, промпты,
            ссылки и закулисье.
          </p>
          <p className="mb-[14px]">
            YouTube — <a href="https://youtube.com/@v.voronezhtsev" target="_blank" rel="noopener noreferrer" className="text-[#9cfb51] underline hover:text-white transition-colors">@v.voronezhtsev</a>.
            Там короткие туториалы и тренды.
          </p>
          <p className="mb-[14px]">
            <strong className="text-white font-semibold">Юридически</strong> Opten работает в России от ИП Воронежцев Владислав Павлович,
            ИНН 723016676391, Тюмень. Для международных платежей через Paddle — IE Nikolai Shupletsov
            как Merchant of Record (это стандартная схема для Paddle, к самому продукту отношения не имеет).
            Полные реквизиты, оферта и политика возврата — в{" "}
            <LocalizedLink to="/terms" className="text-[#9cfb51] underline hover:text-white transition-colors">Условиях использования</LocalizedLink> и{" "}
            <LocalizedLink to="/refund" className="text-[#9cfb51] underline hover:text-white transition-colors">Политике возврата</LocalizedLink>.
          </p>
        </>
      ),
    },
  ],
};

// EN body intentionally `null` in W12a — populated in W12b after the user-approved translation lands.
// Consumers MUST guard with `aboutContent[lang] ?? aboutContent.ru` so the EN render path falls
// through to RU until W12b lands. Once W12b populates this, the fallback becomes a no-op.
const en: AboutContent | null = null;

export const aboutContent = { ru, en } as const;
