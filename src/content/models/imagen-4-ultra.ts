// Phase v2.0 MODELS-B-1 (agent batch 2): generated content for imagen-4-ultra.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Imagen 4 Ultra: структура, ошибки, примеры",
    description:
      "Как писать промпты для Imagen 4 Ultra: SCULPT для длинных описаний, кинематографический стек, послойная композиция, типичные ошибки и примеры до/после.",
    h1: "Imagen 4 Ultra: как писать промпты, которые модель понимает",
    intro:
      "Imagen 4 Ultra — premium-версия Imagen 4 от Google с максимальной детализацией и верностью промпту. Раскрывается на длинных детальных описаниях (100–400 слов), реализует микро-текстуры (поры, нити, швы) и сложные многофигурные сцены. Лучший рендер текста в семействе и самая «послушная» модель Google для production-задач.",
    sections: [
      {
        heading: "Чем Ultra отличается от стандартного Imagen 4",
        body:
          "Imagen 4 Ultra — самая верная промпту модель в семействе. Если описал 15 деталей, она постарается реализовать все 15; стандартный Imagen 4 может упростить или пропустить часть. Ultra рендерит микро-уровень: индивидуальные пряди волос с бликами, поры кожи и веснушки, нити ткани и швы, капли воды с правдоподобным преломлением.\n\nЛучшая типографика в семействе — длинные надписи с корректным кернингом, несколько строк одновременно, разные шрифты в одном кадре. Сложные многофигурные сцены сохраняют детали: батальные сцены с десятками фигур, городские пейзажи с архитектурой, толпы с индивидуальными чертами. Ultra медленнее стандартной версии — приоритет на качество.",
        bullets: [
          "Максимальная верность промпту — реализует ВСЕ описанные детали",
          "Микро-текстуры: поры, веснушки, нити, швы, капли воды",
          "Лучший рендер текста в семействе Imagen",
          "Сложные многофигурные сцены без упрощения",
          "Оптимальная длина промпта — 100–400 слов",
        ],
      },
      {
        heading: "Структура промпта и расширенный SCULPT",
        body:
          "Оптимальный порядок для Ultra: [Тип изображения/стиль/камера] + [Субъект с максимумом деталей] + [Действие/поза] + [Окружение с послойным описанием] + [Освещение с конкретикой] + [Ракурс/композиция/глубина резкости] + [Материалы/текстуры] + [Цветовая палитра] + [Настроение/атмосфера] + [Пост-обработка].\n\nSCULPT для Ultra работает в расширенной форме: Subject — максимально детальное описание («towering 3-meter alien robot with elongated head composed of hundreds of intricate components»), Context — многослойное окружение, Unique details — микро-детали, Lighting — конкретные источники и взаимодействие, Perspective — конкретный объектив и параметры (f/2.0, low-angle wide), Tone/Theme — стилистика + пост-обработка + отсылки.",
      },
      {
        heading: "Послойная композиция и кинематографический стек",
        body:
          "Для сложных сцен Ultra лучше всего работает с послойными описаниями. Структура: «Foreground: [детальное описание]. Middle ground: [субъект и основная сцена]. Background: [удалённые элементы, небо, горизонт]». Это даёт модели понятную композиционную иерархию.\n\nМаксимальный кинематографический стек для Ultra: [Камера] + [Объектив] + [Плёнка/ISO] + [Диафрагма] + [Угол] + [Глубина резкости] + [Color grading] + [Пост-обработка] + [Атмосферные эффекты]. Пример: «Leica M10, 50mm Summilux lens, shot at f/2.0, Cinestill 50D tones, dramatic chiaroscuro lighting, rich textures, 8K resolution, subtle film grain, chromatic aberration». Ultra реализует полный стек точнее стандартной версии.",
      },
      {
        heading: "Типографика и атмосферные эффекты",
        body:
          "Лучшая типографика среди всех Imagen-моделей. Ultra умеет: длинные надписи с корректным кернингом, несколько слов и строк одновременно, разные шрифты в одном кадре. Формула: точный текст в кавычках + стиль шрифта + расположение + контекст. Пример: «A vintage neon sign above the entrance reading \"HOTEL CALIFORNIA\" in warm amber cursive lettering, with a subtle flicker effect».\n\nАтмосферные эффекты Ultra рендерит качественно: частицы («embers, ash, dust swirling in the air»), бог-лучи («volumetric god rays filtering through the canopy»), дым и туман («mist swirls gently, creating depth»), искры («sparks flying from clashing weapons»), свечение («neon tubes with a pinkish glow, amber-lit eyes»).",
      },
      {
        heading: "Сценарии, где Ultra оправдывает выбор",
        body:
          "Ultra — premium-инструмент: имеет смысл выбирать его, когда задача требует максимального качества. Premium-маркетинг: финальные рекламные изображения с типографикой, продуктовые шоты для печати и billboard, editorial-стиль для luxury-брендов. Фэнтези, сай-фай и эпические сцены: батальные сцены с сотнями фигур, детальные существа, космические корабли — длинные промпты 200–400 слов раскрывают потенциал модели.\n\nФотореалистичные портреты: микро-детализация кожи, волос, макияжа; fashion editorial с полным кинематографическим стеком; сложные сцены с несколькими моделями. Концепт-арт: дизайн персонажей с полной экипировкой, архитектурные концепты с детализацией материалов, среды и миры с атмосферными эффектами.",
      },
    ],
    examples: [
      {
        before: "сёгун в золотых доспехах перед храмом",
        after:
          "Immersive, hyperrealistic cinematic scene depicting a powerful shogun seated regally before an ancient, weathered stone Japanese temple. Foreground: the shogun is clad in incredibly complex and detailed golden armor featuring intricate ornamentation, including sculpted golden dragons intertwined with detailed engravings, the armor gleams with a realistic, warm metallic luster. Middle ground: two stoic samurai guards stand on either side, holding ornamental spears. Background: ancient temple with weathered stone walls, traditional curved roof, distant misty mountains. Soft golden morning sunlight bathes the scene with god rays filtering through subtle mist, creating long shadows. Shot on ARRI Alexa with 85mm lens at f/2.0, telephoto compression, shallow depth of field, Cinestill 50D tones, rich warm color grading, Peter Jackson epic style, subtle film grain.",
        note:
          "Послойная композиция (foreground / middle ground / background), полный кинематографический стек, атмосферные эффекты, отсылка к стилю — Ultra реализует всё перечисленное.",
      },
      {
        before: "неоновая вывеска отеля",
        after:
          "A vintage neon sign above the entrance of a 1970s motel reading \"HOTEL CALIFORNIA\" in warm amber cursive lettering, with a subtle flicker effect on the letter 'C'. Below the main sign, a smaller pink neon strip reads \"VACANCY\" in bold sans-serif. The sign is mounted on weathered brick wall with visible mortar lines, paint chips, and traces of rust. Foreground: empty cracked asphalt parking lot with faint puddle reflections of the neon glow. Background: dark desert night sky with stars and a faint silhouette of distant mountains. Shot on 35mm film with anamorphic lens at f/1.4, shallow depth of field, neon glow casts pink and amber color cast on surrounding surfaces, chromatic aberration on bright lights, cinematic Americana mood.",
        note:
          "Два блока текста с разными шрифтами и расположениями, физические детали материалов (brick, mortar, rust), послойная композиция и атмосферные эффекты (neon glow, chromatic aberration).",
      },
      {
        before: "красивый портрет рыжеволосой девушки",
        after:
          "Editorial close-up portrait of a young woman in her late twenties with vibrant copper-red hair styled in soft natural waves, individual strands catching golden hour light with subtle highlights. Visible freckles across her nose and cheekbones, light dusting of subtle makeup, soft natural eyebrows, hazel-green eyes with depth and emotion. She wears a cream cashmere turtleneck with visible knit texture and individual fibers, a delicate gold necklace with iridescent pearl pendant catching the light. Foreground: subtle bokeh of yellow autumn leaves. Background: out-of-focus park with warm late-afternoon golden light, soft layered bokeh. Shot on Leica M10 with 85mm Summilux lens at f/1.4, razor-sharp focus on her eyes, Kodak Portra 400 film tones, rich warm color grading with natural skin tones, subtle film grain, fashion editorial style.",
        note:
          "Микро-детализация (отдельные пряди, веснушки, нити кашемира), полный кинематографический стек, послойный фон, портретный объектив с малой диафрагмой — типичное использование Ultra.",
      },
    ],
    mistakes: [
      {
        title: "Слишком короткий промпт для Ultra",
        explain:
          "Ultra создан для детальных описаний — промпт меньше 15 слов почти всегда означает недоиспользование модели. Если хватает 10 слов, бери стандартный Imagen 4 или Fast. Ultra оправдывается на длинных, хорошо структурированных промптах 100–400 слов с послойной композицией и полным кинематографическим стеком.",
      },
      {
        title: "Промпт без чёткой иерархии важности",
        explain:
          "Даже в длинном промпте модель приоритизирует начало. Если главный субъект зарыт в третьем абзаце среди описаний фона, она возьмёт за основу первое, что увидит — а это может быть деталь окружения. Выноси главный субъект и стиль в первое предложение, дальше уходи в детализацию.",
      },
      {
        title: "Собственные имена из фикшена для фотореализма",
        explain:
          "Ultra верна промпту, но ограничена обучающими данными. «Photorealistic Valyrian lord» она рендерит в стиле книжной иллюстрации. Для фотореалистичного стиля описывай характеристики: «a lord from a glorious titanic city with Greco-Roman architecture, wearing ornate ceremonial robes embroidered with golden thread».",
      },
      {
        title: "Конфликтующие стили в одном промпте",
        explain:
          "«Photorealistic anime surreal pencil sketch» создаёт неконтролируемый микс. Ultra реализует всё, что описано, поэтому конфликтующие инструкции дают худший результат, чем в стандартной версии. Выбирай один основной стиль и используй вспомогательные стилистические маркеры внутри него.",
      },
      {
        title: "Отсутствие освещения в фотореалистичном промпте",
        explain:
          "Для Ultra освещение — критически важный параметр. Без явного указания типа света модель выбирает «нейтральный» вариант, и кадр получается плоским. Указывай конкретный источник и характер: «chiaroscuro with god rays», «golden hour rim light», «soft window light with bounced fill», «volumetric tungsten light from overhead fixture».",
      },
    ],
    faq: [
      {
        q: "Когда использовать Ultra вместо стандартного Imagen 4?",
        a: "Бери Ultra для финальных production-изображений: печать, billboard, premium-маркетинг, обложки, эпические сцены, fashion editorial с микро-детализацией. Для черновиков, A/B-тестов, мокапов и итераций — стандартный Imagen 4 или Fast: они быстрее и дешевле, а Ultra оправдывается на длинных детальных промптах с послойной композицией.",
      },
      {
        q: "Какая оптимальная длина промпта для Ultra?",
        a: "100–400 слов на естественном английском. Меньше 50 — модель недоиспользована, выгоднее взять стандартную версию. Больше 500 без чёткой иерархии — конфликтующие инструкции и потеря фокуса. Сладкая точка — 200–300 слов с послойной композицией (foreground / middle ground / background) и полным кинематографическим стеком.",
      },
      {
        q: "Как использовать послойную композицию?",
        a: "Описывай сцену тремя слоями: Foreground (передний план — детальные элементы, бокэ), Middle ground (главный субъект и основная сцена), Background (удалённые элементы, небо, горизонт). Это даёт Ultra понятную композиционную иерархию, и модель распределяет глубину резкости, освещение и детали по слоям корректнее, чем при «плоском» описании.",
      },
      {
        q: "Поддерживает ли Ultra негативные промпты?",
        a: "Нет, как и вся семья Imagen, Ultra не поддерживает negative prompt. Все формулировки «no», «without», «not» либо игнорируются, либо приводят к обратному эффекту. Описывай позитивно: вместо «no people» — «empty street», вместо «not blurry» — «razor-sharp focus», вместо «no clouds» — «clear blue sky with subtle gradient».",
      },
      {
        q: "Как Ultra рендерит длинный текст?",
        a: "Ultra — лидер по типографике в семействе Imagen. Поддерживает длинные надписи с корректным кернингом, несколько строк и разные шрифты в одном кадре. Формула: точный текст в кавычках + стиль шрифта + расположение + контекст. Для лучшего результата разбивай длинный текст на 2–3 коротких блока с явным расположением каждого — это надёжнее, чем один длинный блок.",
      },
      {
        q: "Можно ли писать промпты на русском?",
        a: "Можно, но качество значительно ниже. Imagen 4 Ultra оптимизирован под английский, особенно для технической кинематографической лексики («ARRI Alexa», «Cinestill 50D», «chromatic aberration»). На русском модель теряет стилистические нюансы и хуже понимает фото/кино-термины. Для premium-задач, ради которых вообще берут Ultra, обязательно переводи промпт на английский.",
      },
      {
        q: "Поддерживается ли Opten для Imagen 4 Ultra?",
        a: "Да, расширение Opten автоматически распознаёт Imagen 4 Ultra внутри ImageFX, Vertex AI, Google AI Studio и Freepik. Оценка учитывает специфику Ultra: проверяет длину промпта (рекомендует расширить до 100+ слов), наличие послойной композиции, полный кинематографический стек, типографику. Одним кликом можно получить rewrite с расширенной структурой SCULPT.",
      },
    ],
  },
  en: {
    title: "Imagen 4 Ultra Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Imagen 4 Ultra: SCULPT for long descriptions, the cinematic stack, layered composition, common mistakes, and before/after examples.",
    h1: "Imagen 4 Ultra: how to write prompts the model actually understands",
    intro:
      "Imagen 4 Ultra is Google's premium Imagen 4 with maximum detail and prompt fidelity. It rewards long, detailed descriptions (100–400 words), renders micro-textures (pores, threads, stitches), and handles complex multi-figure scenes. It has the best text rendering in the family and is the most obedient Google model for production work.",
    sections: [
      {
        heading: "What Ultra adds over standard Imagen 4",
        body:
          "Imagen 4 Ultra is the most prompt-faithful model in the family. Describe 15 details and it will try to render all 15; standard Imagen 4 may simplify or skip some. Ultra renders at a micro level: individual hair strands with highlights, skin pores and freckles, fabric threads and stitching, water droplets with believable refraction.\n\nBest typography in the family — long captions with correct kerning, multiple lines at once, several fonts in one frame. Complex multi-figure scenes retain detail: battle scenes with dozens of figures, urban landscapes with architecture, crowds with individual features. Ultra is slower than the standard version — the priority is quality.",
        bullets: [
          "Maximum prompt fidelity — renders ALL described details",
          "Micro-textures: pores, freckles, threads, stitches, water droplets",
          "Best text rendering in the Imagen family",
          "Complex multi-figure scenes without simplification",
          "Optimal prompt length — 100–400 words",
        ],
      },
      {
        heading: "Prompt structure and extended SCULPT",
        body:
          "Optimal order for Ultra: [Image type/style/camera] + [Subject with maximum detail] + [Action/pose] + [Setting with layered description] + [Lighting with specifics] + [Angle/composition/depth of field] + [Materials/textures] + [Color palette] + [Mood/atmosphere] + [Post-processing].\n\nSCULPT for Ultra runs in extended form: Subject — maximally detailed description («towering 3-meter alien robot with elongated head composed of hundreds of intricate components»), Context — layered environment, Unique details — micro-details, Lighting — specific sources and interactions, Perspective — concrete lens and parameters (f/2.0, low-angle wide), Tone/Theme — style + post-processing + references.",
      },
      {
        heading: "Layered composition and the cinematic stack",
        body:
          "For complex scenes, Ultra works best with layered descriptions. Structure: «Foreground: [detailed description]. Middle ground: [subject and main scene]. Background: [distant elements, sky, horizon]». This gives the model a clear compositional hierarchy.\n\nMaximum cinematic stack for Ultra: [Camera] + [Lens] + [Film/ISO] + [Aperture] + [Angle] + [Depth of field] + [Color grading] + [Post-processing] + [Atmospheric effects]. Example: «Leica M10, 50mm Summilux lens, shot at f/2.0, Cinestill 50D tones, dramatic chiaroscuro lighting, rich textures, 8K resolution, subtle film grain, chromatic aberration». Ultra realises the full stack more accurately than the standard version.",
      },
      {
        heading: "Typography and atmospheric effects",
        body:
          "Best typography among all Imagen models. Ultra handles long captions with correct kerning, multiple words and lines at once, different fonts in one frame. The formula: exact text in quotes + font style + placement + context. Example: «A vintage neon sign above the entrance reading \"HOTEL CALIFORNIA\" in warm amber cursive lettering, with a subtle flicker effect».\n\nAtmospheric effects render cleanly in Ultra: particles («embers, ash, dust swirling in the air»), god rays («volumetric god rays filtering through the canopy»), smoke and mist («mist swirls gently, creating depth»), sparks («sparks flying from clashing weapons»), glow («neon tubes with a pinkish glow, amber-lit eyes»).",
      },
      {
        heading: "Where Ultra is worth the choice",
        body:
          "Ultra is a premium tool: it makes sense to choose it when the task demands maximum quality. Premium marketing: final ad imagery with typography, product shots for print and billboards, editorial style for luxury brands. Fantasy, sci-fi, and epic scenes: battles with hundreds of figures, detailed creatures, spaceships — long prompts of 200–400 words unlock the model's potential.\n\nPhotorealistic portraits: micro-detailing of skin, hair, makeup; fashion editorial with the full cinematic stack; complex scenes with several models. Concept art: character design with full kit, architectural concepts with material detail, environments and worlds with atmospheric effects.",
      },
    ],
    examples: [
      {
        before: "shogun in golden armor in front of a temple",
        after:
          "Immersive, hyperrealistic cinematic scene depicting a powerful shogun seated regally before an ancient, weathered stone Japanese temple. Foreground: the shogun is clad in incredibly complex and detailed golden armor featuring intricate ornamentation, including sculpted golden dragons intertwined with detailed engravings, the armor gleams with a realistic, warm metallic luster. Middle ground: two stoic samurai guards stand on either side, holding ornamental spears. Background: ancient temple with weathered stone walls, traditional curved roof, distant misty mountains. Soft golden morning sunlight bathes the scene with god rays filtering through subtle mist, creating long shadows. Shot on ARRI Alexa with 85mm lens at f/2.0, telephoto compression, shallow depth of field, Cinestill 50D tones, rich warm color grading, Peter Jackson epic style, subtle film grain.",
        note:
          "Layered composition (foreground / middle ground / background), full cinematic stack, atmospheric effects, style reference — Ultra realises all of it.",
      },
      {
        before: "neon hotel sign",
        after:
          "A vintage neon sign above the entrance of a 1970s motel reading \"HOTEL CALIFORNIA\" in warm amber cursive lettering, with a subtle flicker effect on the letter 'C'. Below the main sign, a smaller pink neon strip reads \"VACANCY\" in bold sans-serif. The sign is mounted on a weathered brick wall with visible mortar lines, paint chips, and traces of rust. Foreground: empty cracked asphalt parking lot with faint puddle reflections of the neon glow. Background: dark desert night sky with stars and a faint silhouette of distant mountains. Shot on 35mm film with anamorphic lens at f/1.4, shallow depth of field, neon glow casts pink and amber color cast on surrounding surfaces, chromatic aberration on bright lights, cinematic Americana mood.",
        note:
          "Two text blocks with different fonts and placements, physical material details (brick, mortar, rust), layered composition, and atmospheric effects (neon glow, chromatic aberration).",
      },
      {
        before: "beautiful portrait of a red-haired girl",
        after:
          "Editorial close-up portrait of a young woman in her late twenties with vibrant copper-red hair styled in soft natural waves, individual strands catching golden hour light with subtle highlights. Visible freckles across her nose and cheekbones, light dusting of subtle makeup, soft natural eyebrows, hazel-green eyes with depth and emotion. She wears a cream cashmere turtleneck with visible knit texture and individual fibers, a delicate gold necklace with iridescent pearl pendant catching the light. Foreground: subtle bokeh of yellow autumn leaves. Background: out-of-focus park with warm late-afternoon golden light, soft layered bokeh. Shot on Leica M10 with 85mm Summilux lens at f/1.4, razor-sharp focus on her eyes, Kodak Portra 400 film tones, rich warm color grading with natural skin tones, subtle film grain, fashion editorial style.",
        note:
          "Micro-detailing (individual strands, freckles, cashmere fibers), full cinematic stack, layered background, portrait lens at low aperture — a textbook Ultra prompt.",
      },
    ],
    mistakes: [
      {
        title: "A prompt that's too short for Ultra",
        explain:
          "Ultra is built for detailed descriptions — a prompt under 15 words almost always means the model is underused. If 10 words is enough, use standard Imagen 4 or Fast. Ultra pays off on long, well-structured prompts of 100–400 words with layered composition and the full cinematic stack.",
      },
      {
        title: "Prompt without a clear hierarchy of importance",
        explain:
          "Even in a long prompt, the model prioritizes the opening. If the main subject is buried in the third paragraph among background descriptions, the model anchors on the first thing it reads — which might be a setting detail. Put the main subject and style in the first sentence, then expand into detail.",
      },
      {
        title: "Fictional proper names for photorealism",
        explain:
          "Ultra is prompt-faithful but bound by training data. «Photorealistic Valyrian lord» renders as a book illustration. For a photorealistic style, describe characteristics: «a lord from a glorious titanic city with Greco-Roman architecture, wearing ornate ceremonial robes embroidered with golden thread».",
      },
      {
        title: "Conflicting styles in a single prompt",
        explain:
          "«Photorealistic anime surreal pencil sketch» creates an uncontrolled mix. Ultra renders everything that's described, so conflicting instructions yield worse results than in the standard version. Commit to one primary style and use supporting stylistic markers within it.",
      },
      {
        title: "Missing lighting in a photorealistic prompt",
        explain:
          "For Ultra, lighting is critical. Without an explicit light type the model defaults to a «neutral» option and the frame looks flat. Specify a concrete source and quality: «chiaroscuro with god rays», «golden hour rim light», «soft window light with bounced fill», «volumetric tungsten light from overhead fixture».",
      },
    ],
    faq: [
      {
        q: "When should I use Ultra instead of standard Imagen 4?",
        a: "Pick Ultra for final production imagery: print, billboards, premium marketing, covers, epic scenes, fashion editorial with micro-detail. For drafts, A/B tests, mockups, and iterations, use standard Imagen 4 or Fast — they're faster and cheaper. Ultra justifies itself on long detailed prompts with layered composition.",
      },
      {
        q: "What's the optimal prompt length for Ultra?",
        a: "100–400 words in natural English. Under 50 words the model is underused and the standard version is more cost-effective. Over 500 words without a clear hierarchy causes conflicting instructions and loss of focus. The sweet spot is 200–300 words with layered composition (foreground / middle ground / background) and the full cinematic stack.",
      },
      {
        q: "How do I use layered composition?",
        a: "Describe the scene in three layers: Foreground (detailed elements up close, bokeh), Middle ground (main subject and primary scene), Background (distant elements, sky, horizon). This gives Ultra a clear compositional hierarchy, and the model distributes depth of field, lighting, and detail across layers more correctly than with a «flat» description.",
      },
      {
        q: "Does Ultra support negative prompts?",
        a: "No. Like the rest of the Imagen family, Ultra doesn't support a negative prompt. Phrasings with «no», «without», «not» are either ignored or trigger the opposite effect. Phrase positively: instead of «no people» use «empty street»; instead of «not blurry» use «razor-sharp focus»; instead of «no clouds» use «clear blue sky with subtle gradient».",
      },
      {
        q: "How does Ultra render long text?",
        a: "Ultra leads the Imagen family in typography. It handles long captions with correct kerning, multiple lines, and different fonts in a single frame. The formula: exact text in quotes + font style + placement + context. For best results, split long text into 2–3 short blocks with explicit placement for each — that's more reliable than one long block.",
      },
      {
        q: "Can I write prompts in languages other than English?",
        a: "You can, but quality drops significantly. Imagen 4 Ultra is optimized for English, especially for technical cinematic vocabulary («ARRI Alexa», «Cinestill 50D», «chromatic aberration»). In other languages the model loses stylistic nuance and struggles with photo/film terms. For the premium tasks Ultra is meant for, translate the prompt to English.",
      },
      {
        q: "Does Opten support Imagen 4 Ultra?",
        a: "Yes, the Opten extension auto-detects Imagen 4 Ultra inside ImageFX, Vertex AI, Google AI Studio, and Freepik. Scoring accounts for Ultra's specifics: it checks prompt length (recommending an expansion to 100+ words), the presence of layered composition, the full cinematic stack, and typography. One click delivers a rewrite with the extended SCULPT structure.",
      },
    ],
  },
};
