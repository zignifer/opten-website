// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for midjourney-niji.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Midjourney Niji: структура, ошибки, примеры",
    description:
      "Как писать промпты для Midjourney Niji 7 и Niji 6: аниме-терминология, --sref, чистые линии, типы персонажей, стилевые пресеты и подробные примеры до и после.",
    h1: "Midjourney Niji: как писать промпты, которые модель понимает",
    intro:
      "Midjourney Niji — специализированная модель Midjourney для аниме, манги и восточной иллюстрации. Текущая рекомендуемая версия — Niji 7 (с 9 января 2026): чистые плоские линии, кристально чёткие глаза, лучший в семействе --sref с минимальным дрейфом стиля, поддержка персонализации. Niji 6 — legacy для случаев, когда нужны стилевые пресеты (--style expressive/cute/scenic) или --cref.",
    sections: [
      {
        heading: "Что такое Niji",
        body:
          "Niji обучена преимущественно на аниме и манге, поэтому понимает специфическую терминологию лучше, чем обычные модели Midjourney. Японские термины («shoujo», «seinen», «chibi», «bishounen», «mahou shoujo») работают как стилевые маркеры — модель распознаёт их и активирует соответствующие визуальные паттерны. Западные стилевые маркеры («Marvel», «Disney Pixar») конфликтуют с эстетикой Niji и дают нестабильный гибрид.\n\nДля аниме-задач Niji даёт чище линии, более выразительные глаза, родную манга-стилистику и лучше работает со стилевыми ссылками (--sref) — минимальный дрейф стиля по сравнению с обычной V7. Для фотореализма Niji не предназначена — там нужны обычные V7 или V8. Смешивание аниме и реализма допустимо только как осознанный стилистический приём.",
        bullets: [
          "Niji 7 — текущая рекомендуемая версия (с января 2026)",
          "Кристально чистые глаза и плоские линии",
          "Понимает аниме/манга-терминологию: shoujo, chibi, cel shading",
          "--sref лучшая стабильность в семействе",
          "Персонализация (--p) поддерживается с февраля 2026",
        ],
      },
      {
        heading: "Niji 7 vs Niji 6",
        body:
          "Niji 7 — выбор по умолчанию. Сильные стороны: кристально чёткие глаза, отражения и мелкие детали фона, улучшенная когерентность для сложных поз, более буквальная интерпретация (точно следует описаниям цвета одежды, причёсок, поз), фирменные чистые плоские линии, улучшенный рендеринг текста, минимальный дрейф --sref, персонализация.\n\nОграничения Niji 7: параметр `--cref` НЕ поддерживается (новая система ссылок на персонажей в разработке), стилевые пресеты (--style expressive/cute/scenic) НЕ работают, интерпретация более буквальная — «вайбовые» промпты нужно корректировать.\n\nNiji 6 нужна только в двух случаях: 1) рабочий процесс зависит от --cref (Character Reference), 2) нужны стилевые пресеты --style expressive/cute/scenic/original. В остальных случаях Niji 7 даёт лучший результат. Niji 5 — устаревшая, использовать не рекомендуется.",
      },
      {
        heading: "Структура аниме-промпта",
        body:
          "Иерархия для Niji: [Персонаж/субъект] + [Внешность/одежда] + [Действие/поза] + [Окружение/фон] + [Стиль аниме] + [Настроение/атмосфера] + [Параметры].\n\nАниме-промпт отличается от фотореалистичного: детали внешности (цвет волос, глаз, одежда) важнее освещения, фон часто не менее важен, чем персонаж, а явное указание стиля («anime style», «cel shaded», «studio ghibli inspired») необходимо — без этого Niji использует дефолт, который может не совпасть с ожиданиями.\n\nДля динамичных сцен описывай позу и движение: «mid-leap», «sword slash motion blur», «casting magic, energy swirling», «running with dramatic perspective». Niji 7 буквально следует описаниям, поэтому конкретные детали («long flowing silver hair», «twin tails with red ribbons», «heterochromia») реализуются точно.",
      },
      {
        heading: "Аниме-терминология, которая работает",
        body:
          "Типы персонажей: `shoujo heroine` (романтика, эмоциональность), `shonen protagonist` (энергия, боевой дух), `seinen character` (зрелость), `chibi` (суперстилизованный маленький), `bishounen`/`bishoujo` (красивый юноша/девушка), `mecha pilot`, `magical girl`.\n\nСтили рисовки: `cel shading` (классическая анимационная заливка), `flat color` (без градиентов), `watercolor anime`, `ink wash`, `line art`, `thick outlines`, `soft shading`, `screentone` (точечная заливка манги).\n\nЖанровые маркеры: `isekai` (попаданчество), `slice of life`, `mecha`, `mahou shoujo`, `dark fantasy`, `cyberpunk anime`, `studio ghibli style`, `ufotable style`, `mappa style`. Эффекты: `sparkles`, `glowing particles`, `cherry blossom petals falling`, `speed lines`, `dramatic backlighting`, `ethereal glow`, `magical circle`.",
      },
      {
        heading: "Параметры Niji",
        body:
          "Niji 7: `--niji 7` (версия), `--ar` (соотношение сторон), `--s` (0–1000, дефолт 100), `--c` (chaos), `--w` (weird), `--no` (негативный промпт), `--sref [URL]` (style reference) с весом `--sw`, `--p` (персонализация с февраля 2026), `--seed`, `--style raw`, `--exp`.\n\nNiji 6 (дополнительно к базовым): `--style expressive` (динамичный, стилизованный), `--style cute` (кавайная эстетика), `--style scenic` (акцент на окружении), `--style original` (классический стиль Niji), `--cref [URL]` (Character Reference, сохранение внешности), `--cw` (вес character reference).\n\nРекомендации `--s` для Niji: 100–150 для slice of life и нежных сцен, 200–250 для портретов и стандартных задач, 300+ для боевых сцен и драматичных кадров, 500+ для экспериментальной стилизации.",
      },
    ],
    examples: [
      {
        before:
          "anime girl with sword, beautiful, detailed",
        after:
          "A fierce warrior with wild red hair and golden eyes, mid-leap wielding a flaming katana, slashing through dark energy, speed lines and dynamic motion blur, dramatic backlighting, intense expression, shonen anime style --ar 16:9 --s 300 --niji 7",
        note:
          "Generic «anime girl» в Niji 7 даёт плоский результат. Конкретные детали (red hair, golden eyes, flaming katana), аниме-эффекты (speed lines, motion blur, backlighting) и жанровый якорь (shonen anime style) — это то, на что Niji реагирует лучше всего.",
      },
      {
        before:
          "anime portrait of girl in kimono",
        after:
          "A serene young woman with long silver hair and deep blue eyes, wearing an elegant dark kimono with crane patterns, standing under a blooming cherry blossom tree, soft pink petals falling, gentle wind, watercolor anime style, dreamy atmosphere --ar 3:4 --s 200 --niji 7",
        note:
          "Аниме-портрет требует деталей внешности (silver hair, blue eyes, crane patterns на кимоно), окружения (cherry blossom tree, falling petals) и стилевого якоря (watercolor anime, dreamy atmosphere). Niji 7 буквально следует этим описаниям.",
      },
      {
        before:
          "chibi witch in forest",
        after:
          "An adorable chibi witch with oversized hat and sparkling green eyes, sitting on a giant mushroom, colorful forest with glowing mushrooms, whimsical, cute anime style, pastel colors --ar 1:1 --s 200 --niji 7",
        note:
          "Chibi-стиль намеренно упрощает пропорции — это специфическая аниме-эстетика, которую Niji понимает. Якоря (oversized hat, sparkling eyes, glowing mushrooms, pastel colors) дают модели чёткое стилевое направление.",
      },
    ],
    mistakes: [
      {
        title: "Фотореалистические термины в аниме-промпте",
        explain:
          "«Shot on Canon R5, 85mm lens, bokeh, shallow depth of field» бессмысленны для аниме-стиля — Niji не делает фотореалистичные кадры. Эти опоры работают в V7, но в Niji их нужно заменить на аниме-специфичные: «cel shading», «soft shading», «line art», «watercolor anime style».",
      },
      {
        title: "Использование --cref в Niji 7",
        explain:
          "Параметр --cref (Character Reference) не поддерживается в Niji 7 — новая система ссылок на персонажей в разработке. Если копируешь промпт из Niji 6 и оставляешь --cref в Niji 7 — он будет проигнорирован. Для консистентности персонажа в Niji 7 используй --sref с одинаковым стилевым референсом.",
      },
      {
        title: "Стилевые пресеты с Niji 7",
        explain:
          "`--style expressive`, `--style cute`, `--style scenic`, `--style original` работают ТОЛЬКО с Niji 6. В Niji 7 они проигнорированы. Если нужны эти пресеты — переключайся на --niji 6. Альтернатива в Niji 7: достигай нужного стиля через текст промпта («expressive dynamic pose», «cute kawaii aesthetic», «scenic landscape focus»).",
      },
      {
        title: "Западные стилевые маркеры в Niji",
        explain:
          "«Marvel style», «Disney Pixar», «Western comic book style» конфликтуют с аниме-эстетикой Niji. Модель обучена на восточной иллюстрации — западные опоры дают нестабильный, гибридный результат. Замени на аниме-эквиваленты: вместо «Disney» — «studio ghibli style», вместо «Marvel» — «shonen action anime style».",
      },
      {
        title: "Отсутствие явного аниме-контекста",
        explain:
          "Промпт «a woman in a garden» без аниме-маркеров даст невыразительный результат — Niji не знает, какой стиль аниме ты хочешь. Всегда добавляй явные стилевые опоры: «anime style», «manga illustration», «cel shaded», или стиль конкретной студии («studio ghibli style», «ufotable style», «mappa style»).",
      },
    ],
    faq: [
      {
        q: "Какую версию Niji выбрать — 6 или 7?",
        a: "Niji 7 — выбор по умолчанию. Лучшие глаза, чистые линии, буквальная интерпретация, минимальный дрейф --sref, персонализация. Niji 6 нужна только в двух случаях: если зависишь от --cref (Character Reference, в Niji 7 удалён) или если нужны стилевые пресеты --style expressive/cute/scenic/original (тоже только в Niji 6). Niji 5 — устаревшая, не рекомендуется.",
      },
      {
        q: "Можно ли использовать Niji через --niji в обычном V7-промпте?",
        a: "Да, переключение на Niji делается параметром `--niji 7` в конце промпта. Это указывает Midjourney использовать аниме-модель вместо стандартной V7. Стиль резко меняется — даже одинаковый текст промпта даст разные результаты под --v 7 и --niji 7. Если задача про аниме — всегда добавляй --niji.",
      },
      {
        q: "Какие японские термины работают в Niji?",
        a: "Niji понимает аниме/манга-терминологию как стилевые маркеры: типы персонажей (shoujo, shonen, seinen, chibi, bishounen, bishoujo, mecha pilot, magical girl), стили рисовки (cel shading, screentone, watercolor anime, ink wash), жанры (isekai, slice of life, mahou shoujo, dark fantasy, cyberpunk anime), стили студий (studio ghibli style, ufotable style, mappa style). Это даёт более точное попадание в нужную эстетику, чем общие описания.",
      },
      {
        q: "Как добиться консистентности персонажа без --cref в Niji 7?",
        a: "В Niji 7 --cref не работает. Альтернативы: 1) Использовать --sref с одинаковым стилевым референсом для всех кадров серии — даст консистентный визуальный стиль. 2) Использовать --seed (фиксированный seed) при одинаковом промпте — даст похожие вариации. 3) Подробно описывать внешность персонажа в каждом промпте (цвет волос, причёска, глаза, одежда) — Niji 7 буквальна, поэтому повторяющиеся описания дают похожий результат.",
      },
      {
        q: "Подходит ли Niji для фотореалистичных задач?",
        a: "Нет, Niji специализирована на аниме и манге — для фотореализма она не предназначена. Если промпт «photorealistic anime» — это противоречие, которое даст странный гибрид. Для фотореализма используй V7 или V8. Смешивание аниме и реализма допустимо только если это осознанный выбор (например, «anime characters in a photorealistic city» как стилистический приём).",
      },
      {
        q: "Какой --s рекомендуется для аниме-промптов?",
        a: "`--s 100–150` для slice of life, нежных сцен, кавайных кадров. `--s 200–250` для портретов, стандартных задач, scenic-пейзажей. `--s 300–400` для боевых сцен, динамичных кадров, концепт-арта. `--s 500+` для экспериментальной стилизации, абстракции. Niji 7 более буквальна, чем предыдущие версии, поэтому --s влияет мягче, чем в V7.",
      },
      {
        q: "Поддерживает ли Opten Midjourney Niji?",
        a: "Да, расширение Opten автоматически распознаёт Niji 6 и Niji 7, оценивает аниме-промпты по специфике этих моделей. Проверяет наличие аниме-контекста (явный стиль или жанр), правильность параметров (--cref только в Niji 6, стилевые пресеты только в Niji 6), использование аниме-терминологии, отсутствие фотореалистичных опор и западных стилевых маркеров. Если задача про фотореализм на --niji — Opten предложит переключение на V7.",
      },
    ],
  },
  en: {
    title: "Midjourney Niji Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Midjourney Niji 7 and Niji 6: anime terminology, --sref, clean linework, character types, style presets, before/after examples.",
    h1: "Midjourney Niji: how to write prompts the model actually understands",
    intro:
      "Midjourney Niji is the specialized Midjourney model for anime, manga, and Eastern illustration. The current recommended version is Niji 7 (released January 9, 2026): clean flat linework, crystal-clear eyes, the best --sref stability in the family with minimal style drift, personalization support. Niji 6 is legacy — used only when you need style presets (--style expressive/cute/scenic) or --cref.",
    sections: [
      {
        heading: "What Niji is",
        body:
          "Niji is trained primarily on anime and manga, so it understands specialized terminology better than general Midjourney models. Japanese terms («shoujo», «seinen», «chibi», «bishounen», «mahou shoujo») work as style markers — the model recognizes them and activates the matching visual patterns. Western style markers («Marvel», «Disney Pixar») conflict with Niji's aesthetic and produce an unstable hybrid.\n\nFor anime tasks Niji gives cleaner linework, more expressive eyes, native manga styling, and better style-reference behavior (--sref) — minimal style drift compared to regular V7. For photorealism Niji is not the right choice — for that, use regular V7 or V8. Mixing anime and realism is acceptable only as a deliberate stylistic device.",
        bullets: [
          "Niji 7 — current recommended version (since January 2026)",
          "Crystal-clear eyes and flat linework",
          "Understands anime/manga terminology: shoujo, chibi, cel shading",
          "Best --sref stability in the family",
          "Personalization (--p) supported since February 2026",
        ],
      },
      {
        heading: "Niji 7 vs Niji 6",
        body:
          "Niji 7 is the default. Strengths: crystal-clear eyes, reflections, and fine background details; improved coherence on complex poses; more literal interpretation (precisely follows descriptions of clothing color, hair, poses); signature clean flat linework; improved text rendering; minimal --sref drift; personalization support.\n\nNiji 7 limitations: the `--cref` parameter is NOT supported (a new character-reference system is in development), style presets (--style expressive/cute/scenic) do NOT work, interpretation is more literal — «vibe-only» prompts need correcting.\n\nNiji 6 is needed in two cases only: 1) your workflow depends on --cref (Character Reference), 2) you need the --style expressive/cute/scenic/original presets. Otherwise Niji 7 produces better results. Niji 5 is legacy and not recommended.",
      },
      {
        heading: "Anime prompt structure",
        body:
          "Hierarchy for Niji: [Character/subject] + [Appearance/clothing] + [Action/pose] + [Setting/background] + [Anime style] + [Mood/atmosphere] + [Parameters].\n\nAn anime prompt is different from a photorealistic one: appearance details (hair color, eye color, clothing) matter more than lighting, the background is often as important as the character, and an explicit style anchor («anime style», «cel shaded», «studio ghibli inspired») is required — without it Niji uses a default that may not match your intent.\n\nFor dynamic scenes describe pose and motion: «mid-leap», «sword slash motion blur», «casting magic, energy swirling», «running with dramatic perspective». Niji 7 follows descriptions literally, so concrete details («long flowing silver hair», «twin tails with red ribbons», «heterochromia») render exactly.",
      },
      {
        heading: "Anime terminology that works",
        body:
          "Character types: `shoujo heroine` (romance, emotion), `shonen protagonist` (energy, fighting spirit), `seinen character` (mature, grounded), `chibi` (super-stylized small), `bishounen`/`bishoujo` (beautiful boy/girl), `mecha pilot`, `magical girl`.\n\nDrawing styles: `cel shading` (classic animation fill), `flat color` (no gradients), `watercolor anime`, `ink wash`, `line art`, `thick outlines`, `soft shading`, `screentone` (manga dot fill).\n\nGenre anchors: `isekai` (otherworld), `slice of life`, `mecha`, `mahou shoujo`, `dark fantasy`, `cyberpunk anime`, `studio ghibli style`, `ufotable style`, `mappa style`. Effects: `sparkles`, `glowing particles`, `cherry blossom petals falling`, `speed lines`, `dramatic backlighting`, `ethereal glow`, `magical circle`.",
      },
      {
        heading: "Niji parameters",
        body:
          "Niji 7: `--niji 7` (version), `--ar` (aspect ratio), `--s` (0–1000, default 100), `--c` (chaos), `--w` (weird), `--no` (negative prompt), `--sref [URL]` (style reference) with `--sw` weight, `--p` (personalization, since February 2026), `--seed`, `--style raw`, `--exp`.\n\nNiji 6 (additional to base): `--style expressive` (dynamic, stylized), `--style cute` (kawaii aesthetic), `--style scenic` (background focus), `--style original` (classic Niji style), `--cref [URL]` (Character Reference, appearance retention), `--cw` (character reference weight).\n\n`--s` recommendations for Niji: 100–150 for slice of life and gentle scenes, 200–250 for portraits and standard work, 300+ for battle scenes and dramatic shots, 500+ for experimental stylization.",
      },
    ],
    examples: [
      {
        before:
          "anime girl with sword, beautiful, detailed",
        after:
          "A fierce warrior with wild red hair and golden eyes, mid-leap wielding a flaming katana, slashing through dark energy, speed lines and dynamic motion blur, dramatic backlighting, intense expression, shonen anime style --ar 16:9 --s 300 --niji 7",
        note:
          "Generic «anime girl» yields a flat result in Niji 7. Concrete details (red hair, golden eyes, flaming katana), anime effects (speed lines, motion blur, backlighting), and a genre anchor (shonen anime style) are what Niji responds to best.",
      },
      {
        before:
          "anime portrait of girl in kimono",
        after:
          "A serene young woman with long silver hair and deep blue eyes, wearing an elegant dark kimono with crane patterns, standing under a blooming cherry blossom tree, soft pink petals falling, gentle wind, watercolor anime style, dreamy atmosphere --ar 3:4 --s 200 --niji 7",
        note:
          "An anime portrait needs appearance details (silver hair, blue eyes, crane patterns on the kimono), setting (cherry blossom tree, falling petals), and a style anchor (watercolor anime, dreamy atmosphere). Niji 7 follows these literally.",
      },
      {
        before:
          "chibi witch in forest",
        after:
          "An adorable chibi witch with oversized hat and sparkling green eyes, sitting on a giant mushroom, colorful forest with glowing mushrooms, whimsical, cute anime style, pastel colors --ar 1:1 --s 200 --niji 7",
        note:
          "Chibi style deliberately simplifies proportions — a specific anime aesthetic Niji understands. The anchors (oversized hat, sparkling eyes, glowing mushrooms, pastel colors) give the model a sharp style target.",
      },
    ],
    mistakes: [
      {
        title: "Photorealistic terms in an anime prompt",
        explain:
          "«Shot on Canon R5, 85mm lens, bokeh, shallow depth of field» is meaningless for anime — Niji doesn't do photorealism. These anchors work in V7 but in Niji they need anime-specific replacements: «cel shading», «soft shading», «line art», «watercolor anime style».",
      },
      {
        title: "Using --cref in Niji 7",
        explain:
          "The --cref (Character Reference) parameter is not supported in Niji 7 — a new character-reference system is in development. If you copy a Niji 6 prompt with --cref into Niji 7, it's ignored. For character consistency in Niji 7 use --sref with the same style reference.",
      },
      {
        title: "Style presets with Niji 7",
        explain:
          "`--style expressive`, `--style cute`, `--style scenic`, `--style original` work ONLY with Niji 6. In Niji 7 they're ignored. If you need these presets, switch to --niji 6. Alternative in Niji 7: achieve the style via prompt text («expressive dynamic pose», «cute kawaii aesthetic», «scenic landscape focus»).",
      },
      {
        title: "Western style markers in Niji",
        explain:
          "«Marvel style», «Disney Pixar», «Western comic book style» conflict with Niji's anime aesthetic. The model is trained on Eastern illustration — Western anchors yield unstable hybrid results. Use anime equivalents: instead of «Disney» say «studio ghibli style»; instead of «Marvel» say «shonen action anime style».",
      },
      {
        title: "No explicit anime context",
        explain:
          "A prompt like «a woman in a garden» without anime markers yields a bland result — Niji doesn't know which anime style you want. Always add explicit style anchors: «anime style», «manga illustration», «cel shaded», or a specific studio style («studio ghibli style», «ufotable style», «mappa style»).",
      },
    ],
    faq: [
      {
        q: "Which Niji version should I use — 6 or 7?",
        a: "Niji 7 is the default. Better eyes, cleaner linework, literal interpretation, minimal --sref drift, personalization. Niji 6 is needed in two cases only: when you depend on --cref (Character Reference, removed in Niji 7) or when you need the --style expressive/cute/scenic/original presets (also Niji 6 only). Niji 5 is legacy and not recommended.",
      },
      {
        q: "Can I use Niji via --niji inside a regular V7 prompt?",
        a: "Yes, you switch to Niji with `--niji 7` at the end of the prompt. This tells Midjourney to use the anime model instead of standard V7. The style changes sharply — even the same prompt text gives different results under --v 7 versus --niji 7. For anime tasks, always include --niji.",
      },
      {
        q: "Which Japanese terms work in Niji?",
        a: "Niji understands anime/manga terminology as style markers: character types (shoujo, shonen, seinen, chibi, bishounen, bishoujo, mecha pilot, magical girl), drawing styles (cel shading, screentone, watercolor anime, ink wash), genres (isekai, slice of life, mahou shoujo, dark fantasy, cyberpunk anime), studio styles (studio ghibli style, ufotable style, mappa style). These give a sharper hit on the intended aesthetic than generic descriptions.",
      },
      {
        q: "How do I keep character consistency without --cref in Niji 7?",
        a: "In Niji 7 --cref doesn't work. Alternatives: 1) Use --sref with the same style reference across all frames of a series — produces a consistent visual style. 2) Use --seed (fixed seed) with the same prompt — gives similar variations. 3) Describe the character's appearance in detail in every prompt (hair color, style, eyes, clothing) — Niji 7 is literal, so repeated descriptions yield similar results.",
      },
      {
        q: "Is Niji good for photorealistic tasks?",
        a: "No, Niji is specialized for anime and manga — photorealism is not its purpose. A «photorealistic anime» prompt is a contradiction that produces a strange hybrid. For photorealism use V7 or V8. Mixing anime and realism is OK only as a deliberate choice (e.g. «anime characters in a photorealistic city» as a stylistic device).",
      },
      {
        q: "What --s is recommended for anime prompts?",
        a: "`--s 100–150` for slice of life, gentle scenes, kawaii frames. `--s 200–250` for portraits, standard work, scenic landscapes. `--s 300–400` for battle scenes, dynamic shots, concept art. `--s 500+` for experimental stylization, abstraction. Niji 7 is more literal than previous versions, so --s has a softer effect than in V7.",
      },
      {
        q: "Does Opten support Midjourney Niji?",
        a: "Yes, the Opten extension auto-detects Niji 6 and Niji 7 and scores anime prompts against the specifics of these models. It checks for explicit anime context (style or genre), correct parameter use (--cref only in Niji 6, style presets only in Niji 6), use of anime terminology, and absence of photorealistic anchors or Western style markers. If a task targets photorealism on --niji, Opten will suggest switching to V7.",
      },
    ],
  },
};
