// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for midjourney.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Midjourney: структура, ошибки, примеры",
    description:
      "Как писать промпты для Midjourney любой версии: иерархия описания, параметры --ar/--s/--no, выбор версии (V7/V8/Niji), типичные ошибки и примеры до/после.",
    h1: "Midjourney: как писать промпты, которые модель понимает",
    intro:
      "Midjourney — серия image-моделей от компании Midjourney, доступная через midjourney.com и Discord. Линейка включает V7 (основная), V8 Alpha (новая, web-only), Niji 6/7 (аниме). Все версии используют общий синтаксис параметров (--ar, --s, --sref) и иерархию промпта, но V7+ требуют естественного языка вместо списков тегов.",
    sections: [
      {
        heading: "Что нужно знать о Midjourney",
        body:
          "Midjourney — закрытая модель с подпиской ($10/$30/$60/$120 в месяц). Все версии выдают 4 вариации на запрос, поддерживают любое соотношение сторон через `--ar`, и оптимизированы под английский язык.\n\nКлючевая ось — выбор версии. V7 — основная, лучший фотореализм, естественный язык. V8 Alpha — буквальная интерпретация, нативное 2K через `--hd`, доступна только на alpha.midjourney.com. Niji 6/7 — специализированная аниме-модель с понимаем терминологии манги и аниме. V5.2/V6 считаются устаревшими и не рекомендуются без специальных причин.",
        bullets: [
          "Версии: V7 (основная), V8 Alpha (web-only), Niji 6/7 (аниме)",
          "Любое соотношение сторон через --ar",
          "Лучше всего работает с английским",
          "4 вариации на запрос, до 6000 символов промпта",
          "Negative prompt --no работает надёжно в V8",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Универсальная иерархия для всех версий: [Субъект] + [Детали субъекта] + [Контекст/среда] + [Стиль/настроение] + [Камера/освещение] + [Параметры].\n\nСлова в начале весят больше — выноси главный субъект в первое предложение. «Beautiful cinematic photo of a woman» (стиль первый) работает хуже, чем «A confident businesswoman in her 40s, standing by floor-to-ceiling windows, soft daylight, 85mm lens».\n\nДля V7 и V8 пиши связными предложениями, как описание для кинооператора. Списки ключевых слов через запятую — антипаттерн: «mountain, fog, sunrise, epic» уступает «A snow-capped mountain emerging from fog at sunrise, dramatic warm light on the peaks».",
      },
      {
        heading: "Основные параметры",
        body:
          "Базовые параметры одинаковы во всех версиях: `--ar` (соотношение сторон), `--v` (версия модели, 7 по умолчанию), `--s` или `--stylize` (0–1000, дефолт 100 — сила интерпретации), `--c` или `--chaos` (0–100, разнообразие 4 вариаций), `--w` или `--weird` (0–3000, экспериментальность), `--no` (негативный промпт), `--seed` для воспроизводимости.\n\nСтилевые: `--style raw` (минимальная художественная обработка), `--p` (персонализация), `--sref [URL]` (style reference) с весом `--sw`, `--iw` (image weight), `--niji` (переключение на аниме-модель). Параметр `--cref` (character reference) работает только в Niji 6, в V7 и V8 удалён.\n\nДиапазон `--s`: 0–50 — продуктовые/технические фото, 50–150 — общее использование (дефолт), 150–300 — атмосферные работы, 300–500 — иллюстрации и концепт-арт, 500–1000 — абстракция и эксперименты.",
      },
      {
        heading: "Выбор версии под задачу",
        body:
          "V7 — выбор по умолчанию для большинства задач: лучший фотореализм, естественный язык, рендеринг текста, персонализация. Доступна и через Discord, и через веб.\n\nV8 Alpha — для задач, где нужно нативное 2K разрешение (--hd), точная буквальная интерпретация без художественного «улучшения», скорость в 5 раз выше V7, или максимально надёжный негативный промпт (--no работает значительно лучше). Доступна только на alpha.midjourney.com, без Discord.\n\nNiji 6/7 — для аниме, манги, восточной иллюстрации. Понимает терминологию: «shoujo heroine», «cel shading», «mahou shoujo», «studio ghibli style». Niji 7 — текущая рекомендуемая версия, Niji 6 нужна только если требуются стилевые пресеты (--style expressive/cute/scenic) или --cref.",
      },
      {
        heading: "Освещение и камера",
        body:
          "Освещение — самый мощный фактор качества. Конкретные описания света радикально улучшают результат: «golden hour», «overcast natural light», «Rembrandt lighting», «volumetric fog with god rays», «neon reflections on wet pavement».\n\nMidjourney V7+ отлично реагирует на фотографические термины. Работают опоры: объективы («85mm f/1.8», «35mm lens», «macro», «anamorphic»), плёнка («Kodak Portra 400», «35mm film grain», «medium format»), ракурсы («bird's eye view», «low angle», «Dutch angle»), глубина резкости («shallow depth of field», «bokeh», «tilt-shift»).\n\nДля концепт-арта и стилизованных работ используй художественные опоры: «oil painting», «watercolor», «concept art», «matte painting», «character design» — эти жанровые маркеры включают соответствующие визуальные паттерны.",
      },
    ],
    examples: [
      {
        before:
          "beautiful, stunning, 8k, detailed, mountain, fog, sunrise, epic, cinematic, masterpiece",
        after:
          "A snow-capped mountain emerging from morning fog at sunrise, dramatic warm light catching the peaks, wide-angle composition, national geographic photography, atmospheric haze --ar 16:9 --s 150 --v 7",
        note:
          "Quality-спам и список тегов — двойной антипаттерн. Связное описание с конкретным светом и жанровой опорой («national geographic photography») даёт стабильно лучший результат.",
      },
      {
        before:
          "anime girl with sword",
        after:
          "A fierce warrior with wild red hair and golden eyes, mid-leap wielding a flaming katana, slashing through dark energy, speed lines and dynamic motion blur, dramatic backlighting, shonen anime style --ar 16:9 --s 300 --niji 7",
        note:
          "Для аниме переключайся на Niji через --niji 7. Niji понимает аниме-специфичную лексику (shonen, speed lines, dynamic motion blur, backlighting) на родном уровне.",
      },
      {
        before:
          "product photograph of watch",
        after:
          "Product photograph of a luxury watch on black marble surface, single overhead softbox light, clean white background, sharp focus, commercial photography --ar 1:1 --s 25 --style raw --v 7",
        note:
          "Продуктовая фотография требует низкого `--s` (25) и `--style raw` — это убирает художественную интерпретацию, которая мешает коммерческому использованию.",
      },
    ],
    mistakes: [
      {
        title: "Списки ключевых слов через запятую",
        explain:
          "Главный антипаттерн V7+. «cat, fluffy, cute, big eyes, garden, flowers, sunny» хуже, чем «A fluffy cat with big curious eyes, sitting among wildflowers in a sunny garden». Версии до V6 терпели запятые, V7 и V8 ожидают связную грамматику.",
      },
      {
        title: "Quality-спам в начале промпта",
        explain:
          "«beautiful, stunning, 8k, masterpiece, best quality» — слова без визуальной информации, которые жгут позиционный вес в начале. V7 и V8 их полностью игнорируют. Замени на конкретные опоры: объектив, тип света, жанр.",
      },
      {
        title: "Стиль перед субъектом",
        explain:
          "«Beautiful cinematic photo of a woman» — стиль на первом месте, субъект на третьем. Модель взвешивает первые слова сильнее всего, и стиль перетянет приоритет на себя. Выноси «кто или что» в начало.",
      },
      {
        title: "Использование устаревших версий без причины",
        explain:
          "V5/V6 значительно уступают V7 в анатомии, фотореализме и понимании промпта. Если нет специфической причины (например, --cref в Niji 6), используй текущую V7 или V8. Старые версии — это технический долг.",
      },
      {
        title: "Смена --ar после нескольких итераций",
        explain:
          "Соотношение сторон критически влияет на композицию. Поменял --ar с 1:1 на 16:9 — фактически начинаешь с нуля, потому что композиция перестраивается полностью. Решай --ar в начале проекта и не меняй посреди итераций.",
      },
    ],
    faq: [
      {
        q: "Какую версию Midjourney выбрать?",
        a: "V7 — выбор по умолчанию для большинства задач: фотореализм, портреты, пейзажи, концепт-арт. V8 Alpha — если нужно нативное 2K (--hd), скорость в 5x выше, или максимально буквальная интерпретация без художественного «улучшения». Niji 7 — для аниме, манги, восточной иллюстрации. V5/V6 — только для обратной совместимости со старыми проектами.",
      },
      {
        q: "Работает ли Midjourney на русском?",
        a: "Модель оптимизирована под английский, на других языках качество заметно ниже. Тестировать короткие промпты на русском можно, но для production-задач переводи на английский — это даёт стабильно лучший результат и доступ ко всей фотографической и художественной лексике, на которую реагирует модель.",
      },
      {
        q: "Что такое параметры --s, --c, --w?",
        a: "`--s` (stylize, 0–1000) — сила художественной интерпретации модели. Низкий для буквальности, высокий для арта. `--c` (chaos, 0–100) — разнообразие между 4 вариациями в одном запросе. Высокий даёт более разные варианты. `--w` (weird, 0–3000) — экспериментальность, добавляет необычные визуальные решения. Используй осознанно, тестируй на одном промпте.",
      },
      {
        q: "Как использовать --sref для переноса стиля?",
        a: "`--sref [URL]` переносит визуальный стиль (палитру, текстуру, освещение, композицию) из референсного изображения. Сила контролируется параметром `--sw` (0–1000, дефолт 100). Стратегия: тестируй при --sw 50, 100, 200 для калибровки. Niji 7 имеет лучшую стабильность --sref с минимальным дрейфом стиля.",
      },
      {
        q: "Чем V8 отличается от V7?",
        a: "V8 — это другая модель, не улучшенная V7. Главные отличия: буквальная интерпретация (без художественного «додумывания»), нативное 2K через --hd, скорость ~5x, надёжный --no для негативного промпта, центральная роль персонализации и Style Creator. V8 требует явного указания освещения и стиля — без них даёт технически точный, но плоский результат.",
      },
      {
        q: "Можно ли использовать --cref в V7?",
        a: "Нет, параметр --cref (Character Reference) удалён в V7 и V8. Он работает только в Niji 6. Для сохранения внешности персонажа в V7 используй --oref (Omni Reference) — новый универсальный референс, который переносит и содержимое, и стиль. В Niji 7 новая система ссылок на персонажей находится в разработке.",
      },
      {
        q: "Поддерживает ли Opten Midjourney?",
        a: "Да, расширение Opten автоматически распознаёт все версии Midjourney (V7, V8, Niji) и оценивает промпты по соответствующей структуре. Проверяет наличие субъекта в начале, связное описание, корректное использование параметров, отсутствие quality-спама. Если задача лучше подходит другой версии (например, аниме-промпт на V7) — Opten порекомендует переключение на Niji.",
      },
    ],
  },
  en: {
    title: "Midjourney Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for any Midjourney version: description hierarchy, --ar/--s/--no parameters, choosing between V7/V8/Niji, common mistakes, and examples.",
    h1: "Midjourney: how to write prompts the model actually understands",
    intro:
      "Midjourney is a family of image models from Midjourney Inc., available via midjourney.com and Discord. The lineup includes V7 (main), V8 Alpha (newest, web-only), Niji 6/7 (anime). All versions share the same parameter syntax (--ar, --s, --sref) and prompt hierarchy, but V7+ require natural language instead of tag lists.",
    sections: [
      {
        heading: "What to know about Midjourney",
        body:
          "Midjourney is a closed model with subscription pricing ($10/$30/$60/$120 per month). All versions return 4 variations per request, support any aspect ratio via `--ar`, and are optimized for English.\n\nThe key axis is version choice. V7 is the main one — best photorealism, natural language, broad availability. V8 Alpha is the literal-interpretation upgrade with native 2K via `--hd`, available only on alpha.midjourney.com. Niji 6/7 is the specialized anime model that understands manga and anime terminology natively. V5.2/V6 are considered legacy and not recommended without specific reason.",
        bullets: [
          "Versions: V7 (main), V8 Alpha (web-only), Niji 6/7 (anime)",
          "Any aspect ratio via --ar",
          "Optimized for English",
          "4 variations per request, up to 6000 characters in a prompt",
          "Negative prompt --no works reliably in V8",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Universal hierarchy for all versions: [Subject] + [Subject details] + [Context/setting] + [Style/mood] + [Camera/lighting] + [Parameters].\n\nOpening words carry more weight — put the main subject in the first sentence. «Beautiful cinematic photo of a woman» (style first) underperforms «A confident businesswoman in her 40s, standing by floor-to-ceiling windows, soft daylight, 85mm lens».\n\nFor V7 and V8 write in coherent sentences, like a brief to a cinematographer. Comma-separated tag lists are an anti-pattern: «mountain, fog, sunrise, epic» loses to «A snow-capped mountain emerging from fog at sunrise, dramatic warm light on the peaks».",
      },
      {
        heading: "Core parameters",
        body:
          "The base parameters are the same across versions: `--ar` (aspect ratio), `--v` (model version, 7 by default), `--s` or `--stylize` (0–1000, default 100 — interpretation strength), `--c` or `--chaos` (0–100, variation diversity), `--w` or `--weird` (0–3000, experimentation), `--no` (negative prompt), `--seed` for reproducibility.\n\nStyle controls: `--style raw` (minimal artistic treatment), `--p` (personalization), `--sref [URL]` (style reference) with `--sw` weight, `--iw` (image weight), `--niji` (switch to anime model). The `--cref` parameter (character reference) works only in Niji 6; it's removed in V7 and V8.\n\n`--s` ranges: 0–50 for product/technical shots, 50–150 for general use (default), 150–300 for atmospheric work, 300–500 for illustration and concept art, 500–1000 for abstract and experimental.",
      },
      {
        heading: "Picking a version for the task",
        body:
          "V7 is the default for most tasks: best photorealism, natural language, text rendering, personalization. Available on both Discord and web.\n\nV8 Alpha is for tasks where you need native 2K via --hd, precise literal interpretation without artistic «enhancement», 5x faster generation than V7, or the most reliable negative prompt (--no works significantly better). Available only on alpha.midjourney.com — no Discord.\n\nNiji 6/7 is for anime, manga, Eastern illustration. It understands terminology: «shoujo heroine», «cel shading», «mahou shoujo», «studio ghibli style». Niji 7 is the current recommended version; Niji 6 is only needed if you require style presets (--style expressive/cute/scenic) or --cref.",
      },
      {
        heading: "Lighting and camera",
        body:
          "Lighting is the most powerful quality lever. Specific descriptions of light radically improve results: «golden hour», «overcast natural light», «Rembrandt lighting», «volumetric fog with god rays», «neon reflections on wet pavement».\n\nMidjourney V7+ responds strongly to photography vocabulary. Anchors that work: lenses («85mm f/1.8», «35mm lens», «macro», «anamorphic»), film stocks («Kodak Portra 400», «35mm film grain», «medium format»), angles («bird's eye view», «low angle», «Dutch angle»), depth of field («shallow depth of field», «bokeh», «tilt-shift»).\n\nFor concept art and stylized work use artistic anchors: «oil painting», «watercolor», «concept art», «matte painting», «character design» — these genre markers activate the matching visual patterns.",
      },
    ],
    examples: [
      {
        before:
          "beautiful, stunning, 8k, detailed, mountain, fog, sunrise, epic, cinematic, masterpiece",
        after:
          "A snow-capped mountain emerging from morning fog at sunrise, dramatic warm light catching the peaks, wide-angle composition, national geographic photography, atmospheric haze --ar 16:9 --s 150 --v 7",
        note:
          "Quality-spam plus a tag list — a double anti-pattern. A coherent description with specific light and a genre anchor («national geographic photography») reliably outperforms.",
      },
      {
        before:
          "anime girl with sword",
        after:
          "A fierce warrior with wild red hair and golden eyes, mid-leap wielding a flaming katana, slashing through dark energy, speed lines and dynamic motion blur, dramatic backlighting, shonen anime style --ar 16:9 --s 300 --niji 7",
        note:
          "For anime, switch to Niji via --niji 7. Niji understands anime-specific vocabulary (shonen, speed lines, dynamic motion blur, backlighting) natively.",
      },
      {
        before:
          "product photograph of watch",
        after:
          "Product photograph of a luxury watch on black marble surface, single overhead softbox light, clean white background, sharp focus, commercial photography --ar 1:1 --s 25 --style raw --v 7",
        note:
          "Product photography needs low `--s` (25) plus `--style raw` — this removes the artistic interpretation that breaks commercial usage.",
      },
    ],
    mistakes: [
      {
        title: "Comma-separated keyword lists",
        explain:
          "The headline V7+ anti-pattern. «cat, fluffy, cute, big eyes, garden, flowers, sunny» is worse than «A fluffy cat with big curious eyes, sitting among wildflowers in a sunny garden». Pre-V6 versions tolerated commas; V7 and V8 expect coherent grammar.",
      },
      {
        title: "Quality-spam at the start of the prompt",
        explain:
          "«beautiful, stunning, 8k, masterpiece, best quality» — words with no visual information that burn positional weight at the front. V7 and V8 ignore them entirely. Replace with concrete anchors: lens, light type, genre.",
      },
      {
        title: "Style before subject",
        explain:
          "«Beautiful cinematic photo of a woman» — style is first, subject is third. The model weights opening words most heavily, and style steals the priority. Move «who or what» to the front.",
      },
      {
        title: "Using legacy versions without reason",
        explain:
          "V5/V6 are significantly weaker than V7 in anatomy, photorealism, and prompt comprehension. Unless you have a specific reason (e.g. --cref in Niji 6), use V7 or V8. Old versions are technical debt.",
      },
      {
        title: "Changing --ar mid-iteration",
        explain:
          "Aspect ratio drives composition. Switch --ar from 1:1 to 16:9 and you're effectively starting over because composition rebuilds entirely. Decide --ar at the start of the project and don't change it mid-iteration.",
      },
    ],
    faq: [
      {
        q: "Which Midjourney version should I use?",
        a: "V7 is the default for most tasks: photorealism, portraits, landscapes, concept art. V8 Alpha if you need native 2K (--hd), 5x faster generation, or the most literal interpretation without artistic enhancement. Niji 7 for anime, manga, Eastern illustration. V5/V6 only for backward compatibility with older projects.",
      },
      {
        q: "Does Midjourney work in languages other than English?",
        a: "The model is optimized for English; in other languages quality drops noticeably. Short experimental prompts in other languages are fine, but for production work translate to English — that gives reliably better results and access to the full photography and art vocabulary the model responds to.",
      },
      {
        q: "What do --s, --c, --w do?",
        a: "`--s` (stylize, 0–1000) is the strength of the model's artistic interpretation. Low for literal, high for art. `--c` (chaos, 0–100) is the variation diversity across the 4 results. High gives more different options. `--w` (weird, 0–3000) is experimentation — adds unusual visual choices. Use them deliberately, testing on one prompt at a time.",
      },
      {
        q: "How do I use --sref for style transfer?",
        a: "`--sref [URL]` transfers visual style (palette, texture, lighting, composition) from a reference image. Strength is controlled by `--sw` (0–1000, default 100). Strategy: test at --sw 50, 100, 200 to calibrate. Niji 7 has the best --sref stability with minimal style drift.",
      },
      {
        q: "How is V8 different from V7?",
        a: "V8 is a different model, not an improved V7. Key differences: literal interpretation (no artistic «filling in»), native 2K via --hd, ~5x faster generation, reliable --no for negatives, central role of personalization and Style Creator. V8 needs explicit lighting and style — without them it gives technically accurate but flat results.",
      },
      {
        q: "Can I use --cref in V7?",
        a: "No, the --cref (Character Reference) parameter is removed in V7 and V8. It only works in Niji 6. For character consistency in V7 use --oref (Omni Reference) — the new universal reference that carries both content and style. Niji 7's new character-reference system is in development.",
      },
      {
        q: "Does Opten support Midjourney?",
        a: "Yes, the Opten extension auto-detects all Midjourney versions (V7, V8, Niji) and scores prompts against the matching structure. It checks for subject up front, coherent description, correct parameter usage, and the absence of quality-spam. If the task fits a different version better (e.g. an anime prompt on V7), Opten will suggest switching to Niji.",
      },
    ],
  },
};
