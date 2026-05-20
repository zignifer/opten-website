// Phase v2.0 MODELS-B-1 (agent batch 3): generated content for luma-ray-2.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Luma Ray 2: структура, ошибки, примеры",
    description:
      "Как писать промпты для Luma Ray 2 в Dream Machine: формула субъект+действие+камера, Camera Tags, видео на вход, Ray 2 Flash, ошибки и примеры до/после.",
    h1: "Luma Ray 2: как писать промпты, которые модель понимает",
    intro:
      "Luma Ray 2 — крупномасштабная видеомодель Luma в Dream Machine, обученная напрямую на видеоданных. Понимает естественное движение, реалистичное освещение и физически корректные взаимодействия. Длительность 5 или 10 секунд, нативное 720p и 1080p, апскейл до 4K. Главное улучшение от Ray 1.6 — устранена проблема slow-motion, нативный 10-секундный лимит, Camera Tags в интерфейсе.",
    sections: [
      {
        heading: "Что нового в Ray 2",
        body:
          "Ray 2 — это шаг от Ray 1.6 к реалистичному движению. Ключевые улучшения: реалистичные текстуры, плавная работа камеры, динамичные сцены, нативная длительность до 10 секунд при 720p, сильное понимание текстовых инструкций, поддержка видео на вход. Устранена характерная для Ray 1.6 проблема slow-motion — движение теперь в реальном времени.\n\nRay 2 Flash — ускоренная версия: 3x быстрее, 3x дешевле. Те же возможности (T2V, I2V, аудио, контроль), но с упором на скорость. Подходит для итерации и A/B-тестов; для финальных рендеров используй стандартный Ray 2.\n\nЧто ещё не в Ray 2 (доступно в Ray 3): Character Reference для консистентности персонажа, Draft Mode для быстрой итерации, 16-bit HDR. Если нужны эти возможности — переключайся на Ray 3.",
        bullets: [
          "5 или 10 секунд за один запуск",
          "720p нативно, 1080p, апскейл до 4K",
          "Camera Tags в интерфейсе Dream Machine",
          "Поддержка видео на вход (modify/V2V)",
          "Ray 2 Flash — 3x быстрее и дешевле",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Формула Ray 2: [Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood].\n\nRay 2 — «positive only» модель: негативные промпты контрпродуктивны. Описывай только то, что хочешь видеть. Используй present continuous: «running», «pouring», «spinning» — не «begins to run», «will spin», «starts pouring». Модель работает в настоящем непрерывном и не понимает последовательность во времени.\n\nОптимальная длина — около 100 слов, сфокусированных на действии. Меньше 15 слов — модель додумывает слишком много. Больше 200 слов — перегрузка деталями, модель теряет фокус. Промпт «espresso pouring into a white ceramic cup, steam rising, liquid swirling, macro close-up, warm morning light» работает лучше, чем длинный технический бриф.",
      },
      {
        heading: "Camera Tags и видео на вход",
        body:
          "Camera Tags — специальные теги камерных движений в интерфейсе Dream Machine, доступны только для моделей Ray 2 и Ray 2 Flash. Убедись, что Ray 2 выбран в настройках, иначе теги недоступны. Можно комбинировать несколько тегов для сложных движений (например, push in + tilt up).\n\nВажно: Camera Tags — бонус, не замена текстового описания камеры в промпте. Текст всё ещё важен — теги дополняют, а не заменяют. Пиши конкретное движение в тексте: «camera dollies forward», «slow pan right», «aerial descending shot», и используй теги как точную настройку.\n\nRay 2 может принимать видео на вход — это разблокирует режим Modify (V2V) и Extend для существующих роликов. Описывай конечное состояние, не команды: «cyberpunk neon city at night, rain-slicked streets» работает, «change the sky to blue» нет.",
      },
      {
        heading: "Вторичное движение и keyframes",
        body:
          "Вторичное движение — то, что делает Ray 2 живым: ветер в волосах, поднятая пыль, отражения на мокром асфальте, движение ткани, рябь на воде, пар над напитком, лепестки сакуры в воздухе. Без этих деталей даже движущийся субъект выглядит статично.\n\nПримеры: «dress billowing outward», «hair flowing in the wind», «dust particles catching golden hour sunlight», «steam rising from espresso», «ripples spreading across the pond», «city lights glowing in background, slightly out of focus».\n\nImage-to-Video с keyframes: Start frame обязателен, End frame опционален. С keyframes соотношение сторон берётся из изображения автоматически. Описывай ТОЛЬКО то, что МЕНЯЕТСЯ между кадрами — статичные элементы не переописывай. Подробное описание статики сбивает модель.",
      },
      {
        heading: "Loop и режимы генерации",
        body:
          "Loop — бесшовное зацикленное видео, идеально для продуктовых шоукейсов. Активируется иконкой ∞ в prompt box. Подходит для 360° вращения продуктов, повторяющихся анимаций, бесконечных циклов движения. Описывай движение, которое естественно замыкается: вращение, цикл дыхания, повторяющийся жест.\n\nExtend — продление существующего видео. Выбор между 5 и 10 секунд нового контента. Лимит ~30 секунд суммарно, далее качество деградирует с каждым продлением. Каждое продление = отдельный промпт.\n\nДля выбора между Ray 2 и Ray 2 Flash: используй Flash для итерации, поиска направления, A/B-тестов (3x быстрее, 3x дешевле). Используй стандартный Ray 2 для финальных рендеров, когда нужна максимальная детализация.",
      },
    ],
    examples: [
      {
        before:
          "espresso pouring, hyper-realistic, stunning",
        after:
          "Espresso pouring into a white ceramic cup, steam rising, liquid swirling and forming crema, macro close-up, warm morning light from the left, shallow depth of field.",
        note:
          "«Hyper-realistic» и «stunning» — запрещённые слова, деградирующие качество Ray. Замена: конкретное вторичное движение (steam rising, liquid swirling, forming crema), макро-крупность и направление света (from the left).",
      },
      {
        before:
          "dancer spins on rooftop, will be cinematic",
        after:
          "Dancer spinning on a rooftop at sunset, dress billowing outward, hair flowing, city lights glowing in background, camera orbiting slowly, golden hour cinematic light.",
        note:
          "«Will be cinematic» — временная фраза, которую Ray игнорирует. Решение: present continuous «spinning», конкретное вторичное движение (dress billowing, hair flowing, city lights glowing), описание камеры (orbiting slowly) и света (golden hour cinematic).",
      },
      {
        before:
          "golden retriever in field, no other animals, no people",
        after:
          "A golden retriever running through an empty wheat field at sunset, ears flapping in the wind, dust particles catching golden hour sunlight, camera tracking alongside at the dog's level, warm cinematic light.",
        note:
          "«No other animals, no people» — негативный промпт, который Ray игнорирует. Решение: позитивное «empty wheat field» прямо в описании сцены. Это даёт модели чёткую картинку: пустое поле, один субъект.",
      },
    ],
    mistakes: [
      {
        title: "Запрещённые слова в промпте",
        explain:
          "«Vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» — деградируют качество Ray 2. Замени на конкретные описания: «warm golden light», «soft pastel palette», «sharp focused detail», «cinematic film grain». Эти опоры дают модели визуальную информацию, а не пустые квалификаторы.",
      },
      {
        title: "Временные фразы и будущее время",
        explain:
          "«Begins to», «starts to», «will», «then» — Ray 2 не понимает последовательность во времени. Используй present continuous (running, pouring, spinning) для основного действия. Для последовательных кадров — отдельные промпты с extend, не пытайся уместить storyline в один промпт.",
      },
      {
        title: "Негативные промпты",
        explain:
          "«No text», «without people», «remove clouds» — Ray 2 это «positive only» модель. Замени на позитивное описание желаемого: «clear blue sky» вместо «no clouds», «empty room» вместо «without people», «clean wall» вместо «no graffiti». Модель работает с тем, что есть, а не с тем, чего нет.",
      },
      {
        title: "Пере-описание статики с keyframes",
        explain:
          "При image-to-video не описывай заново то, что уже в кадрах — Start и End frame дают модели визуальный контекст. Описывай только ИЗМЕНЕНИЯ: «hair starts to flow», «camera dollies forward», «light shifts from cool to warm». Подробное описание статичных элементов сбивает модель с фокуса.",
      },
      {
        title: "Конфликтующие камерные движения",
        explain:
          "«Camera zooms in, pans left and orbits» одновременно — модель пытается выполнить всё сразу и даёт хаотичный, нестабильный результат. Выбирай одно основное движение или комбинируй последовательно через extend. Camera Tags в интерфейсе можно комбинировать, но в тексте лучше один тип движения.",
      },
    ],
    faq: [
      {
        q: "Чем Ray 2 отличается от Ray 1.6?",
        a: "Ray 2 даёт реалистичные текстуры, плавную работу камеры, динамичные сцены, нативную длительность до 10 секунд при 720p, сильное понимание текстовых инструкций. Главное улучшение — устранена проблема slow-motion, характерная для Ray 1.6. Также появилась поддержка видео на вход для Modify и Extend, и Camera Tags в интерфейсе.",
      },
      {
        q: "Что такое Ray 2 Flash?",
        a: "Ray 2 Flash — ускоренная версия Ray 2: 3x быстрее, 3x дешевле. Те же возможности (T2V, I2V, аудио, контроль), но с упором на скорость. Стратегия: используй Flash для итерации, поиска направления, A/B-тестов; переключайся на стандартный Ray 2 для финальных рендеров, когда нужна максимальная детализация.",
      },
      {
        q: "Как работают Camera Tags?",
        a: "Camera Tags — специальные теги камерных движений в интерфейсе Dream Machine, доступны только для Ray 2 и Ray 2 Flash. Убедись, что модель выбрана в настройках, иначе теги недоступны. Можно комбинировать несколько тегов. Важно: теги — дополнение к текстовому описанию камеры в промпте, а не замена. Текст и теги работают вместе.",
      },
      {
        q: "Какие слова деградируют качество Ray 2?",
        a: "«Vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» — эмпирически подтверждённый Luma список деградирующих слов. Замени на конкретику. Также деградируют временные фразы («begins to», «starts to», «will», «then») и негативные промпты («no», «without», «remove»). Используй present continuous и позитивное описание.",
      },
      {
        q: "Сколько секунд я могу сгенерировать?",
        a: "5 или 10 секунд за один запуск (выбирается в настройках). Для более длинных видео используй Extend — продолжение существующего ролика. Суммарный лимит ~30 секунд, далее качество деградирует. Каждое продление = отдельный промпт с описанием нового контента. Промпт «длиннее 10 секунд» в одном запросе не сработает — модель отрежет.",
      },
      {
        q: "Поддерживает ли Ray 2 Character Reference для консистентности персонажа?",
        a: "Нет, Character Reference доступен только в Ray 3. В Ray 2 для консистентности персонажа используй start frame с фото персонажа в Image-to-Video режиме. Альтернатива: использовать одинаковый keyframe для нескольких генераций. Если задача требует многошотовой консистентности — переключайся на Ray 3 с Character Reference.",
      },
      {
        q: "Поддерживает ли Opten Luma Ray 2?",
        a: "Да, расширение Opten автоматически распознаёт Ray 2 (и Ray 2 Flash) и оценивает промпты по специфике этой модели. Проверяет отсутствие запрещённых слов и негативных промптов, использование mid-action verbs, конкретное описание камеры и света, вторичное движение, оптимальную длину ~100 слов. Одним кликом получаешь rewrite в positive-only формате с правильной структурой.",
      },
    ],
  },
  en: {
    title: "Luma Ray 2 Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Luma Ray 2 in Dream Machine: subject+action+camera formula, Camera Tags, video input, Ray 2 Flash, mistakes, and before/after examples.",
    h1: "Luma Ray 2: how to write prompts the model actually understands",
    intro:
      "Luma Ray 2 is Luma's large-scale video model in Dream Machine, trained directly on video data. It understands natural motion, realistic lighting, and physically correct interactions. Duration is 5 or 10 seconds, native 720p and 1080p with upscale to 4K. The main upgrade from Ray 1.6 — slow-motion is fixed, native 10-second limit, Camera Tags in the interface.",
    sections: [
      {
        heading: "What's new in Ray 2",
        body:
          "Ray 2 is the step from Ray 1.6 to realistic motion. Key improvements: realistic textures, smooth camera work, dynamic scenes, native duration up to 10 seconds at 720p, strong text-instruction comprehension, video input support. The slow-motion problem characteristic of Ray 1.6 is gone — motion is now real-time.\n\nRay 2 Flash is the accelerated version: 3x faster, 3x cheaper. Same capabilities (T2V, I2V, audio, control), with the focus on speed. Good for iteration and A/B tests; for final renders use standard Ray 2.\n\nWhat's not yet in Ray 2 (available in Ray 3): Character Reference for character consistency, Draft Mode for fast iteration, 16-bit HDR. If you need these, switch to Ray 3.",
        bullets: [
          "5 or 10 seconds per run",
          "720p native, 1080p, upscale to 4K",
          "Camera Tags in the Dream Machine interface",
          "Video input support (modify/V2V)",
          "Ray 2 Flash — 3x faster and cheaper",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Ray 2 formula: [Subject] + [Mid-Action Verb] + [Setting/Environment] + [Secondary Motion/Consequences] + [Camera Movement] + [Lighting/Mood].\n\nRay 2 is a «positive only» model: negative prompts are counter-productive. Describe only what you want to see. Use present continuous: «running», «pouring», «spinning» — not «begins to run», «will spin», «starts pouring». The model works in present continuous and doesn't understand temporal sequence.\n\nOptimal length is around 100 words focused on the action. Under 15 words — the model fills in too much. Over 200 words — detail overload. The prompt «espresso pouring into a white ceramic cup, steam rising, liquid swirling, macro close-up, warm morning light» works better than a long technical brief.",
      },
      {
        heading: "Camera Tags and video input",
        body:
          "Camera Tags are specialized camera-movement tags in the Dream Machine interface, available only for Ray 2 and Ray 2 Flash. Make sure Ray 2 is selected in settings, otherwise the tags are unavailable. You can combine multiple tags for complex movements (e.g. push in + tilt up).\n\nImportant: Camera Tags are a bonus, not a replacement for textual camera description in the prompt. Text still matters — tags complement, they don't replace. Write the specific movement in text: «camera dollies forward», «slow pan right», «aerial descending shot», and use tags as fine-tuning.\n\nRay 2 can accept video as input — this unlocks Modify (V2V) and Extend modes for existing clips. Describe the end state, not commands: «cyberpunk neon city at night, rain-slicked streets» works; «change the sky to blue» doesn't.",
      },
      {
        heading: "Secondary motion and keyframes",
        body:
          "Secondary motion is what makes Ray 2 feel alive: wind in hair, raised dust, reflections on wet asphalt, fabric movement, ripples on water, steam over a drink, sakura petals in the air. Without these details even a moving subject looks static.\n\nExamples: «dress billowing outward», «hair flowing in the wind», «dust particles catching golden hour sunlight», «steam rising from espresso», «ripples spreading across the pond», «city lights glowing in background, slightly out of focus».\n\nImage-to-Video with keyframes: Start frame is required, End frame is optional. With keyframes the aspect ratio is taken from the image automatically. Describe ONLY what CHANGES between frames — don't re-describe static elements. Detailed descriptions of static parts throw the model off.",
      },
      {
        heading: "Loop and generation modes",
        body:
          "Loop — seamless looped video, ideal for product showcases. Activated via the ∞ icon in the prompt box. Good for 360° product rotation, repeating animations, infinite motion cycles. Describe motion that naturally closes back on itself: rotation, breathing cycle, repeating gesture.\n\nExtend — continuation of existing video. Choose between 5 and 10 seconds of new content. Limit is ~30 seconds total, beyond that quality drops with each extension. Each extension is a separate prompt.\n\nChoosing between Ray 2 and Ray 2 Flash: use Flash for iteration, direction-finding, A/B tests (3x faster, 3x cheaper). Use standard Ray 2 for finals when maximum detail matters.",
      },
    ],
    examples: [
      {
        before:
          "espresso pouring, hyper-realistic, stunning",
        after:
          "Espresso pouring into a white ceramic cup, steam rising, liquid swirling and forming crema, macro close-up, warm morning light from the left, shallow depth of field.",
        note:
          "«Hyper-realistic» and «stunning» are forbidden words that degrade Ray quality. Replacement: concrete secondary motion (steam rising, liquid swirling, forming crema), macro framing, and explicit light direction (from the left).",
      },
      {
        before:
          "dancer spins on rooftop, will be cinematic",
        after:
          "Dancer spinning on a rooftop at sunset, dress billowing outward, hair flowing, city lights glowing in background, camera orbiting slowly, golden hour cinematic light.",
        note:
          "«Will be cinematic» is a temporal phrase Ray ignores. The fix: present continuous «spinning», concrete secondary motion (dress billowing, hair flowing, city lights glowing), explicit camera (orbiting slowly) and light (golden hour cinematic).",
      },
      {
        before:
          "golden retriever in field, no other animals, no people",
        after:
          "A golden retriever running through an empty wheat field at sunset, ears flapping in the wind, dust particles catching golden hour sunlight, camera tracking alongside at the dog's level, warm cinematic light.",
        note:
          "«No other animals, no people» is a negative prompt Ray ignores. The fix: positive «empty wheat field» directly in the scene description. This gives the model a clear picture: empty field, one subject.",
      },
    ],
    mistakes: [
      {
        title: "Forbidden words in the prompt",
        explain:
          "«Vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» degrade Ray 2 quality. Replace with concrete descriptions: «warm golden light», «soft pastel palette», «sharp focused detail», «cinematic film grain». These anchors give the model visual information, not empty qualifiers.",
      },
      {
        title: "Temporal phrases and future tense",
        explain:
          "«Begins to», «starts to», «will», «then» — Ray 2 doesn't understand temporal sequence. Use present continuous (running, pouring, spinning) for the main action. For sequential shots use separate prompts with extend; don't try to fit a storyline into one prompt.",
      },
      {
        title: "Negative prompts",
        explain:
          "«No text», «without people», «remove clouds» — Ray 2 is a «positive only» model. Replace with positive description: «clear blue sky» instead of «no clouds», «empty room» instead of «without people», «clean wall» instead of «no graffiti». The model works with what's there, not what isn't.",
      },
      {
        title: "Re-describing static elements with keyframes",
        explain:
          "In image-to-video, don't re-describe what's already in the frames — Start and End frame give the model visual context. Describe only the CHANGES: «hair starts to flow», «camera dollies forward», «light shifts from cool to warm». Detailed descriptions of static elements throw the model off.",
      },
      {
        title: "Conflicting camera moves",
        explain:
          "«Camera zooms in, pans left and orbits» at once — the model tries to do everything simultaneously and produces a chaotic, unstable result. Pick one main movement or combine them sequentially via extend. Camera Tags in the UI can be combined, but in text it's better to stick to one move type.",
      },
    ],
    faq: [
      {
        q: "How is Ray 2 different from Ray 1.6?",
        a: "Ray 2 gives realistic textures, smooth camera work, dynamic scenes, native duration up to 10 seconds at 720p, and strong text-instruction comprehension. The headline upgrade — the slow-motion problem characteristic of Ray 1.6 is fixed. There's also video input support for Modify and Extend, plus Camera Tags in the interface.",
      },
      {
        q: "What is Ray 2 Flash?",
        a: "Ray 2 Flash is the accelerated version of Ray 2: 3x faster, 3x cheaper. Same capabilities (T2V, I2V, audio, control) with the focus on speed. Strategy: use Flash for iteration, direction-finding, A/B tests; switch to standard Ray 2 for finals when maximum detail matters.",
      },
      {
        q: "How do Camera Tags work?",
        a: "Camera Tags are specialized camera-movement tags in the Dream Machine interface, available only for Ray 2 and Ray 2 Flash. Make sure the model is selected in settings, otherwise the tags are unavailable. Multiple tags can be combined. Important: tags supplement text camera descriptions in the prompt, they don't replace them. Text and tags work together.",
      },
      {
        q: "Which words degrade Ray 2 quality?",
        a: "«Vibrant», «whimsical», «hyper-realistic», «beautiful», «amazing», «stunning» — Luma's empirically confirmed list of degrading words. Replace with concrete description. Temporal phrases («begins to», «starts to», «will», «then») and negative prompts («no», «without», «remove») also degrade results. Use present continuous and positive description.",
      },
      {
        q: "How many seconds can I generate?",
        a: "5 or 10 seconds per run (selectable in settings). For longer videos use Extend — continuation of the existing clip. Total limit is ~30 seconds, beyond that quality degrades. Each extension is a separate prompt describing the new content. A prompt for «longer than 10 seconds» in one request won't work — the model will cut it.",
      },
      {
        q: "Does Ray 2 support Character Reference for character consistency?",
        a: "No, Character Reference is only available in Ray 3. In Ray 2, for character consistency use a start frame with a photo of the character in Image-to-Video mode. Alternative: use the same keyframe across multiple generations. If your task needs multi-shot consistency, switch to Ray 3 with Character Reference.",
      },
      {
        q: "Does Opten support Luma Ray 2?",
        a: "Yes, the Opten extension auto-detects Ray 2 (and Ray 2 Flash) and scores prompts by this model's specifics. It checks for absence of forbidden words and negative prompts, use of mid-action verbs, concrete camera and light descriptions, secondary motion, and the optimal ~100-word length. One click gives you a rewrite in the positive-only format with the correct structure.",
      },
    ],
  },
};
