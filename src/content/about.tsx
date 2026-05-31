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
  highlights: {
    value: string;
    label: string;
  }[];
  sections: AboutSection[];
}

const ru: AboutContent = {
  highlights: [
    { value: "30 тыс.+", label: "подписчиков в Instagram, Telegram, YouTube, TikTok и VK" },
    { value: "40 млн+", label: "просмотров на контенте про нейросети и AI-креатив" },
    { value: "5 площадок", label: "где я тестирую AI-инструменты и показываю рабочие промпты" },
  ],
  sections: [
    {
      heading: "Откуда взялся Opten",
      body: (
        <>
          <p className="mb-[14px]">
            Я Влад Воронежцев — веб-дизайнер и AI-блогер про нейросети для генерации картинок,
            видео и интерфейсов. Веду контент не только в YouTube Shorts: делаю короткие ролики,
            длинные разборы, посты, промпты и закулисье в Instagram, Telegram, YouTube, TikTok и VK.
            На YouTube меня можно найти как{" "}
            <a href="https://youtube.com/@v.voronezhtsev" target="_blank" rel="noopener noreferrer" className="text-[#9cfb51] underline hover:text-white transition-colors">@v.voronezhtsev</a>, а в Telegram я веду канал «Влад Воронежцев | Про нейросети». С 2024-го года я ушёл
            в AI-креатив с головой: Midjourney, Kling, Veo, Sora, Nano Banana, Seedance — пробовал
            почти всё, что вышло.
          </p>
          <p className="mb-[14px]">
            Чем больше я делал контент, тем чаще видел один и тот же паттерн: люди заходят в Syntx,
            Higgsfield, Freepik или Magnific, пишут промпт «в лоб», получают посредственный результат — и думают,
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
            Я собрал 60+ skill-файлов под конкретные модели — Seedance (все версии), Seedream,
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
            Установил расширение → зашёл в любимый AI-генератор (Syntx, Higgsfield, Freepik, Magnific — поддержка
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
            Там короткие туториалы, тренды и часть длинных разборов. Instagram/Reels я использую как
            параллельный охват для тех же AI- и дизайн-тем.
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

// Phase 4.1 W12b (B-03): EN body populated. Translation reviewed and approved by founder.
// Mirrors the RU structure: 4 sections (origin / why prompts / what you get / contact).
// First-person, founder voice; same register as RU; all factual claims preserved
// (audience stats, supported sites incl. Magnific via Freepik, pricing in both currencies,
// IP / Paddle Merchant of Record details, /terms + /refund LocalizedLinks).
const en: AboutContent = {
  highlights: [
    { value: "30K+", label: "followers across Instagram, Telegram, YouTube, TikTok and VK" },
    { value: "40M+", label: "views on content about neural networks and AI creative work" },
    { value: "5 channels", label: "where I test AI tools and share practical prompts" },
  ],
  sections: [
    {
      heading: "How Opten came to be",
      body: (
        <>
          <p className="mb-[14px]">
            I'm Vlad Voronezhtsev — a web designer and AI blogger covering neural networks for image,
            video and interface generation. I don't only make YouTube Shorts: I publish short videos,
            long-form breakdowns, posts, prompts and behind-the-scenes notes across Instagram,
            Telegram, YouTube, TikTok and VK. On YouTube, you can find me as{" "}
            <a href="https://youtube.com/@v.voronezhtsev" target="_blank" rel="noopener noreferrer" className="text-[#9cfb51] underline hover:text-white transition-colors">@v.voronezhtsev</a>, and on Telegram I run the "Vlad Voronezhtsev | About AI" channel. In 2024 I went all
            in on AI creative work: Midjourney, Kling, Veo, Sora, Nano Banana, Seedance — I tried
            just about everything that shipped.
          </p>
          <p className="mb-[14px]">
            The more content I made, the more I kept seeing the same pattern: people open Syntx,
            Higgsfield, Freepik or Magnific, write a prompt "off the cuff", get a mediocre result —
            and conclude that the model is bad. When in fact there's a powerful model under the hood,
            it just doesn't understand what they want. Prompting is a skill. Nobody really teaches it.
          </p>
          <p className="mb-[14px]">
            I started Opten in fall 2025 for myself — I needed a tool that would show in real time
            how well my prompt "lands" for a specific model and what to improve. The personal experiment
            quickly turned into something bigger: thousands of my viewers had the same pain. That's
            how the Chrome extension came about.
          </p>
        </>
      ),
    },
    {
      heading: "Why prompts specifically",
      body: (
        <>
          <p className="mb-[14px]">
            The core problem Opten solves: <strong className="text-white font-semibold">every model is written differently</strong>.
            Kling reacts to one phrasing of motion, Sora to another, Midjourney loves cinematography
            jargon, Nano Banana wants short dense descriptions with no filler. There are no universal
            "10 tips for writing a prompt": what works for Flux produces garbage in Imagen.
          </p>
          <p className="mb-[14px]">
            I assembled 60+ skill files for specific models — Seedance (all versions), Seedream,
            Kling with motion control, Midjourney 7/8/niji/video, GPT Image, Flux, Nano Banana, Imagen,
            Luma Ray, Sora 2, Veo 3/3.1, Runway, MiniMax Hailuo, Pixverse, LTX, Wan, Qwen, Grok Imagine
            and others. Plus two fallback modes for when you try something rare. Each skill file is
            a set of rules distilled from the model's official documentation and my own generation
            experience.
          </p>
          <p className="mb-[14px]">
            Opten doesn't just score a prompt 0–100 and surface up to five specific issues.
            It also does <strong className="text-white font-semibold">auto-enhance</strong> — one click rewrites the prompt for the selected model.
            Parallel rewrite: hit it, get an improved version a second later.
          </p>
        </>
      ),
    },
    {
      heading: "What you get",
      body: (
        <>
          <p className="mb-[14px]">
            Install the extension → open your favourite AI generator (Syntx, Higgsfield, Freepik,
            Magnific — support is widening) → write a prompt as usual → Opten scores it silently right
            inside the interface, without pulling you into a separate window.
          </p>
          <p className="mb-[14px]">What you get:</p>
          <ul className="mt-[8px] mb-[16px] pl-[24px] list-disc">
            <li className="mb-[8px]"><strong className="text-white font-semibold">0–100 score</strong> against the rules of the specific model — you see immediately how strong the prompt is.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Up to five concrete callouts</strong> with pass/fail/neutral icons. Not "try again", but "no lighting style specified, add soft daylight".</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Auto-enhance</strong> — improved prompt in one click. No "here are ten tips" — just ready text you can copy or apply with a button.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Multimodal</strong> — Opten accounts for the reference images you already attached. It won't suggest adding something that's already in the preview.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Auto-detected model</strong> — no need to tell it "this is Kling" by hand; Opten looks at the page URL and DOM markup.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">Privacy</strong> — your prompts and references <strong className="text-white font-semibold">are not stored on Opten servers</strong>. Analysis runs through Claude Haiku 4.5 behind a private Vercel proxy, pure pass-through.</li>
            <li className="mb-[8px]"><strong className="text-white font-semibold">RU / EN</strong> — the interface picks up the browser language.</li>
          </ul>
          <p className="mb-[14px]">
            On pricing: <strong className="text-white font-semibold">install and registration are free</strong>. Pro is 199 ₽/mo auto-renewed
            through YooKassa, or 299 ₽ one-time without a monthly subscription. For USD payments —
            Paddle, around $2.99/mo or $4.99 one-time. That's five times cheaper than PromptPerfect
            ($9.99), and Opten works across dozens of interfaces rather than just inside its own chat.
          </p>
        </>
      ),
    },
    {
      heading: "Contact",
      body: (
        <>
          <p className="mb-[14px]">
            If you'd like to reach out — bug reports, requests for support of a specific model, or
            just to talk about generation — the easiest way to reach me is Telegram:{" "}
            <a href="https://t.me/v_voronezhtsev" target="_blank" rel="noopener noreferrer" className="text-[#9cfb51] underline hover:text-white transition-colors">@v_voronezhtsev</a>.
            That's also where my channel "Vlad Voronezhtsev | About AI" lives — long-form breakdowns,
            prompts, links and behind-the-scenes go there.
          </p>
          <p className="mb-[14px]">
            YouTube — <a href="https://youtube.com/@v.voronezhtsev" target="_blank" rel="noopener noreferrer" className="text-[#9cfb51] underline hover:text-white transition-colors">@v.voronezhtsev</a>.
            Short tutorials, trends, and some long-form breakdowns. Instagram/Reels is the parallel
            reach channel for the same AI and design topics.
          </p>
          <p className="mb-[14px]">
            <strong className="text-white font-semibold">Legally</strong>, Opten operates in Russia as IE Voronezhtsev Vladislav Pavlovich,
            INN 723016676391, Tyumen. For international payments via Paddle — IE Nikolai Shupletsov
            as Merchant of Record (a standard Paddle arrangement; unrelated to the product itself).
            Full details, terms of service, and refund policy are in the{" "}
            <LocalizedLink to="/terms" className="text-[#9cfb51] underline hover:text-white transition-colors">Terms of Use</LocalizedLink> and{" "}
            <LocalizedLink to="/refund" className="text-[#9cfb51] underline hover:text-white transition-colors">Refund Policy</LocalizedLink>.
          </p>
        </>
      ),
    },
  ],
};

export const aboutContent = { ru, en } as const;
