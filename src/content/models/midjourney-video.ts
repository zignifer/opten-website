// Phase v2.0 MODELS-B-1 (agent batch 4): generated content for midjourney-video.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Midjourney Video: структура, ошибки, примеры",
    description:
      "Как писать промпты для Midjourney Video: формула Image-to-Video, движение субъекта и камеры, типичные ошибки и примеры до/после без описания внешности.",
    h1: "Midjourney Video: как писать промпты, которые модель понимает",
    intro:
      "Midjourney Video — Image-to-Video модель Midjourney для короткой анимации статичных изображений. Чистый Text-to-Video не поддерживается: референсное изображение обязательно. Промпт описывает что движется и как движется камера, а не внешность субъекта — это уже задано картинкой. Английский — основной язык, оптимальная длина 20-60 слов.",
    sections: [
      {
        heading: "Что умеет Midjourney Video",
        body:
          "Midjourney Video — новая модель Midjourney, специализированная на анимации одного статичного изображения в короткий клип. Это принципиально другой инструмент по сравнению с Midjourney V7 или Niji: там модель генерирует кадр с нуля по тексту, здесь — оживляет уже готовый кадр.\n\nКомпозиция, цветовая палитра, стиль и внешность субъекта определяются референсным изображением. Промпт задаёт движение субъекта (поворот головы, ходьба, развевающиеся волосы), движение камеры (push in, pan, orbit, static) и атмосферу (slowly, dramatic, peaceful). Короткие клипы, оптимальная длина промпта 20-60 слов, документация ограничена.",
        bullets: [
          "Только Image-to-Video — нужен референсный кадр",
          "Промпт описывает движение, не внешность",
          "Камера: push in, pan, orbit, static, tracking",
          "Оптимально 20-60 слов; 1-3 предложения",
          "Изображение определяет стартовый кадр и стиль",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Оптимальная формула: [Движение/действие субъекта] + [Движение камеры] + [Темп/Настроение].\n\nПример: «The woman slowly turns her head toward the camera, wind gently blowing her hair, slow dolly push in, soft ambient light». Главное — не дублируй то, что уже видно на картинке. Если на фото девушка в красной куртке — не пиши «girl in red jacket». Это пустые токены, которые могут конфликтовать с тем, что модель уже считала с изображения.\n\nКраткость и фокус на движении дают лучший результат, чем длинные описания. Одно основное движение — не загружай тремя действиями одновременно.",
      },
      {
        heading: "Движения субъекта",
        body:
          "Конкретное физическое действие даёт предсказуемую анимацию: «turns her head», «walks forward», «waves ripple», «hair blowing in the wind», «dress flowing», «leaves falling». Абстрактные глаголы вроде «something happens» или «she does something» дают хаотичный результат.\n\nДля портретов работают мелкие движения — моргание (blinks), лёгкий поворот головы (slight head turn), улыбка (subtle smile). Для природы — ветер, вода, облака, огонь. Для объектов — вращение, парение, падение, растворение. Чем точнее глагол, тем меньше артефактов на границах движения.",
      },
      {
        heading: "Движения камеры",
        body:
          "Без указания камеры результат часто получается статичным или хаотичным — модель сама выбирает. Базовые камерные движения: push in, pull out, dolly in, dolly out, zoom in, zoom out (наезд/отъезд); pan left, pan right, pan up, pan down (панорама); tracking shot, follow shot (трекинг); orbit, rotating around (орбита); crane up, crane down (подъём/спуск); static camera, locked off (статика).\n\nТемп камеры тоже важен — «slowly» и «gently» дают кинематографичный результат, «suddenly» и «rapidly» — динамичный, иногда с артефактами. Не комбинируй конфликтующие движения: «zoom in and zoom out simultaneously» или «pan + orbit + tracking одновременно».",
      },
      {
        heading: "Качество референсного изображения",
        body:
          "Видео настолько хорошее, насколько хорош референсный кадр. Высокое разрешение, чёткость, читаемая композиция — основа стабильной анимации. Сложные шумные изображения с множеством мелких деталей дают артефакты на границах движения.\n\nКомпозиция изображения определяет стартовый кадр видео — модель не «перерисовывает» сцену, она экстраполирует движение от того, что видит. Если на фото фигура наполовину обрезана, и просишь «she walks forward», результат будет странным. Для портретов лучше midshot/medium close-up; для природы — широкий план с понятной глубиной; для продукта — контрастный фон.",
      },
    ],
    examples: [
      {
        before:
          "красивая девушка идёт по улице",
        after:
          "The woman slowly walks forward toward the camera, hair gently swaying with each step. Slow dolly push in, shallow depth of field. Soft cinematic atmosphere, peaceful tempo.",
        note:
          "Внешность убрана — она уже на референсе. Описано только: движение субъекта, движение камеры, темп. Один основной экшен (ходьба) + одно движение камеры (push in).",
      },
      {
        before:
          "природа красиво",
        after:
          "Tall grass and wildflowers gently sway in the wind, soft afternoon light filtering through the trees. Slow lateral tracking shot from left to right. Peaceful, dreamlike atmosphere, gradual light shifting from warm to cool.",
        note:
          "«Природа красиво» — абстрактно. Здесь конкретное движение элементов среды (трава, цветы), конкретное движение камеры (lateral tracking), темп (slow) и атмосферный сдвиг света.",
      },
      {
        before:
          "продукт крутится",
        after:
          "The bottle slowly rotates 360 degrees on its axis, catching the studio light on its glossy surface. Static camera, locked off frame. Smooth even tempo, commercial product showcase aesthetic.",
        note:
          "Указано конкретное движение (rotation 360°), направление (on its axis), камера (static locked off) и темп (smooth even). Без камеры модель могла бы добавить случайный pan и испортить product shot.",
      },
    ],
    mistakes: [
      {
        title: "Описание внешности субъекта",
        explain:
          "Внешность уже задана референсом — повторное описание бесполезно и может конфликтовать с тем, что модель видит. «Beautiful young woman with blonde hair in red dress walks forward» — пустые токены до «walks forward». Пиши только движение и камеру.",
      },
      {
        title: "Попытка text-to-video без изображения",
        explain:
          "Midjourney Video не поддерживает чистый T2V. Модель требует референсный кадр. Если ты пишешь только текст без загрузки изображения, генерация невозможна. Это не баг промпта, а архитектурное ограничение версии.",
      },
      {
        title: "Слишком длинный промпт (>60 слов)",
        explain:
          "Модель теряет фокус на длинных промптах: движения становятся хаотичными, могут появляться артефакты. Оптимально 1-3 предложения, 20-60 слов. Если описание не помещается — сократи до одного основного движения субъекта + одного движения камеры + темпа.",
      },
      {
        title: "Конфликтующие движения",
        explain:
          "«Walks left while running right», «zoom in and zoom out simultaneously», «pan + orbit + tracking одновременно» — модель не может разрешить конфликт и даёт хаотичный результат с дрожанием. Одно основное движение субъекта + одно движение камеры. Если нужно несколько камерных действий — описывай последовательно, через «then».",
      },
      {
        title: "Спам качества и tag soup",
        explain:
          "«cinematic, masterpiece, 8K, ultra detailed, best quality, trending on artstation» — мусор, который засоряет промпт и не влияет на результат. Качество видео определяется качеством референса и точностью описания движения. Лучше потратить токены на конкретный глагол и конкретное камерное движение.",
      },
    ],
    faq: [
      {
        q: "Чем Midjourney Video отличается от Midjourney V7?",
        a: "V7 — image-генератор, который рисует кадр с нуля по тексту, с фирменным синтаксисом (`--ar`, `--style`, `--chaos`). Midjourney Video — отдельная модель, оживляющая готовое изображение. Параметры V7 здесь не работают: формат задаётся референсом, стиль задан референсом, промпт описывает только движение. Это два разных инструмента под одной маркой.",
      },
      {
        q: "Можно ли сгенерировать видео только по тексту?",
        a: "Нет, Midjourney Video — строго Image-to-Video. Референсное изображение обязательно. Если нужно T2V — сначала сгенерируй кадр в V7 или Niji (или в другой image-модели), затем подай его в Midjourney Video с промптом на движение. Это двухэтапный пайплайн: image → video.",
      },
      {
        q: "Зачем описывать движение камеры, если есть только субъект?",
        a: "Без указания камеры модель сама выбирает поведение, и часто это либо статика, либо случайный pan, который ломает композицию. Явное «slow dolly push in» или «static camera» даёт предсказуемый кадр. Это особенно критично для product shots и портретов — без статичной камеры product может «уплыть» из кадра, а у портрета съедет ракурс.",
      },
      {
        q: "Какая длина промпта оптимальна?",
        a: "20-60 слов, 1-3 предложения. Слишком короткий промпт (<10 слов) даёт хаотичную анимацию — модель додумает. Слишком длинный (>60 слов) приводит к потере фокуса и артефактам. Формула «движение субъекта + движение камеры + темп» в 2-3 предложениях покрывает большинство сценариев.",
      },
      {
        q: "Можно ли просить дождь, ветер или огонь, которых нет на фото?",
        a: "Можно, но рискованно. Если на референсе нет дождя, и ты просишь «rain falls», модель попытается добавить дождь поверх существующей сцены — часто с артефактами на границах. Лучше подходит для атмосферных правок, согласованных с фото: если на фото облачно — «light wind picks up» сработает; если солнечный день — «sudden rain» даст странный результат.",
      },
      {
        q: "Как добиться кинематографичного результата?",
        a: "Стек: медленный темп (slowly, gently, gradually) + явное камерное движение (slow dolly push in, slow lateral tracking) + одна атмосферная деталь (soft ambient light, gentle wind, light shifting). Анти-стек — «suddenly», «rapidly», «explosive», «chaotic» — даёт динамику, но часто с дрожанием и артефактами. Для кино держи медленный темп и одно движение.",
      },
      {
        q: "Поддерживается ли Opten для Midjourney Video?",
        a: "Да, расширение Opten автоматически распознаёт Midjourney Video и оценивает промпты по структуре выше: проверяет, что есть референсное изображение, отсутствует описание внешности (она на картинке), указано конкретное движение субъекта и движение камеры, оптимальная длина 20-60 слов. Одним кликом получаешь rewrite в правильной формуле «движение + камера + темп».",
      },
    ],
  },
  en: {
    title: "Midjourney Video Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Midjourney Video: the Image-to-Video formula, subject and camera motion, the optimal 20-60 word length, mistakes, and examples.",
    h1: "Midjourney Video: how to write prompts the model actually understands",
    intro:
      "Midjourney Video is Midjourney's Image-to-Video model for short animations of still images. Pure Text-to-Video isn't supported: a reference image is mandatory. The prompt describes what moves and how the camera moves — not the subject's appearance, which is already set by the image. English is the primary language; optimal length 20-60 words.",
    sections: [
      {
        heading: "What Midjourney Video does",
        body:
          "Midjourney Video is Midjourney's new model, specialized in animating a single still image into a short clip. It's a fundamentally different tool from Midjourney V7 or Niji: there the model generates a frame from scratch from text, here it brings an existing frame to life.\n\nComposition, color palette, style, and the subject's appearance are all defined by the reference image. The prompt sets subject motion (head turn, walking, hair blowing), camera motion (push in, pan, orbit, static), and atmosphere (slowly, dramatic, peaceful). Short clips, optimal prompt length 20-60 words, documentation is limited.",
        bullets: [
          "Image-to-Video only — a reference frame is required",
          "Prompt describes motion, not appearance",
          "Camera: push in, pan, orbit, static, tracking",
          "Optimal 20-60 words; 1-3 sentences",
          "Image defines the starting frame and the style",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Optimal formula: [Subject motion/action] + [Camera motion] + [Tempo/Mood].\n\nExample: «The woman slowly turns her head toward the camera, wind gently blowing her hair, slow dolly push in, soft ambient light.» The main rule — don't restate what's already visible in the image. If the photo shows a girl in a red jacket, don't write «girl in red jacket.» Those are empty tokens that can conflict with what the model has already parsed from the reference.\n\nBrevity and a focus on motion deliver better results than long descriptions. One primary action — don't load three simultaneous moves.",
      },
      {
        heading: "Subject motion",
        body:
          "A concrete physical action gives predictable animation: «turns her head», «walks forward», «waves ripple», «hair blowing in the wind», «dress flowing», «leaves falling.» Abstract verbs like «something happens» or «she does something» yield chaotic results.\n\nFor portraits, small motions work — blinking, slight head turn, subtle smile. For nature — wind, water, clouds, fire. For objects — rotation, floating, falling, dissolving. The more precise the verb, the fewer artifacts at the edges of motion.",
      },
      {
        heading: "Camera motion",
        body:
          "Without a camera call, the result often comes out static or chaotic — the model picks for you. Core camera moves: push in, pull out, dolly in, dolly out, zoom in, zoom out (in/out); pan left, pan right, pan up, pan down (pan); tracking shot, follow shot (tracking); orbit, rotating around (orbit); crane up, crane down (rise/fall); static camera, locked off (static).\n\nCamera tempo matters too — «slowly» and «gently» give cinematic results; «suddenly» and «rapidly» give dynamic but sometimes artifact-prone output. Don't combine conflicting moves: «zoom in and zoom out simultaneously» or «pan + orbit + tracking at the same time.»",
      },
      {
        heading: "Reference image quality",
        body:
          "The video is only as good as the reference frame. High resolution, sharpness, readable composition — these are the foundation of stable animation. Complex, noisy images with lots of small details produce artifacts at motion boundaries.\n\nThe image's composition defines the starting frame of the video — the model doesn't «repaint» the scene, it extrapolates motion from what it sees. If the figure is half-cropped on the photo and you ask «she walks forward,» the result will be off. For portraits, prefer mid-shot/medium close-up; for nature, a wide shot with clear depth; for products, a contrasting background.",
      },
    ],
    examples: [
      {
        before: "beautiful girl walks down the street",
        after:
          "The woman slowly walks forward toward the camera, hair gently swaying with each step. Slow dolly push in, shallow depth of field. Soft cinematic atmosphere, peaceful tempo.",
        note:
          "Appearance is dropped — it's already on the reference. Only described: subject motion, camera motion, tempo. One primary action (walking) + one camera move (push in).",
      },
      {
        before: "beautiful nature",
        after:
          "Tall grass and wildflowers gently sway in the wind, soft afternoon light filtering through the trees. Slow lateral tracking shot from left to right. Peaceful, dreamlike atmosphere, gradual light shifting from warm to cool.",
        note:
          "«Beautiful nature» is abstract. This has concrete motion of environmental elements (grass, flowers), a concrete camera move (lateral tracking), tempo (slow), and an atmospheric light shift.",
      },
      {
        before: "product spinning",
        after:
          "The bottle slowly rotates 360 degrees on its axis, catching the studio light on its glossy surface. Static camera, locked off frame. Smooth even tempo, commercial product showcase aesthetic.",
        note:
          "Concrete motion (360° rotation), direction (on its axis), camera (static locked off), tempo (smooth even). Without an explicit camera, the model might add a random pan and ruin a product shot.",
      },
    ],
    mistakes: [
      {
        title: "Describing the subject's appearance",
        explain:
          "Appearance is already locked in the reference — restating it is useless and can conflict with what the model sees. «Beautiful young woman with blonde hair in red dress walks forward» is empty tokens up to «walks forward.» Write only motion and camera.",
      },
      {
        title: "Trying text-to-video without an image",
        explain:
          "Midjourney Video doesn't support pure T2V. The model requires a reference frame. If you submit text-only without uploading an image, generation isn't possible. This isn't a prompt bug — it's an architectural limit of the version.",
      },
      {
        title: "Prompt too long (>60 words)",
        explain:
          "The model loses focus on long prompts: motions become chaotic and artifacts can appear. Optimal is 1-3 sentences, 20-60 words. If your description won't fit — trim to one primary subject motion + one camera move + tempo.",
      },
      {
        title: "Conflicting motions",
        explain:
          "«Walks left while running right», «zoom in and zoom out simultaneously», «pan + orbit + tracking at the same time» — the model can't resolve the conflict and outputs chaotic, shaky results. One primary subject motion + one camera move. If you need multiple camera moves, describe them sequentially with «then.»",
      },
      {
        title: "Quality spam and tag soup",
        explain:
          "«cinematic, masterpiece, 8K, ultra detailed, best quality, trending on artstation» — noise that clogs the prompt and doesn't affect output. Video quality is determined by reference quality and motion-description precision. Spend tokens on a concrete verb and a concrete camera move instead.",
      },
    ],
    faq: [
      {
        q: "How is Midjourney Video different from Midjourney V7?",
        a: "V7 is an image generator that draws a frame from text using Midjourney's signature syntax (`--ar`, `--style`, `--chaos`). Midjourney Video is a separate model that animates a finished image. V7 parameters don't work here: aspect ratio is set by the reference, style is set by the reference, and the prompt describes motion only. They're two different tools under one brand.",
      },
      {
        q: "Can I generate video from text alone?",
        a: "No, Midjourney Video is strictly Image-to-Video. A reference image is mandatory. If you need T2V, first generate a frame in V7 or Niji (or another image model), then feed it into Midjourney Video with a motion prompt. It's a two-stage pipeline: image → video.",
      },
      {
        q: "Why describe camera motion if I only have a subject?",
        a: "Without a camera call the model picks behavior on its own — often static, or a random pan that breaks the composition. An explicit «slow dolly push in» or «static camera» yields a predictable shot. This is especially critical for product shots and portraits — without a static camera the product may drift out of frame, and a portrait's angle may shift.",
      },
      {
        q: "What's the optimal prompt length?",
        a: "20-60 words, 1-3 sentences. Too short (<10 words) gives chaotic animation — the model fills in. Too long (>60 words) leads to lost focus and artifacts. The formula «subject motion + camera motion + tempo» in 2-3 sentences covers most scenarios.",
      },
      {
        q: "Can I ask for rain, wind, or fire that aren't in the photo?",
        a: "You can, but it's risky. If there's no rain on the reference and you ask «rain falls,» the model will try to overlay rain on the existing scene — often with edge artifacts. It works better for atmospheric tweaks consistent with the photo: an overcast photo + «light wind picks up» works; a sunny day + «sudden rain» yields odd output.",
      },
      {
        q: "How do I get a cinematic result?",
        a: "Stack: slow tempo (slowly, gently, gradually) + an explicit camera move (slow dolly push in, slow lateral tracking) + one atmospheric detail (soft ambient light, gentle wind, light shifting). The anti-stack — «suddenly», «rapidly», «explosive», «chaotic» — gives energy but often with shake and artifacts. For cinematic, hold the slow tempo and one motion.",
      },
      {
        q: "Does Opten support Midjourney Video?",
        a: "Yes, the Opten extension auto-detects Midjourney Video and scores prompts against the structure above: it checks that a reference image is present, that appearance isn't restated (it's on the image), that subject motion and camera motion are explicit, and that length is within 20-60 words. One click gives you a rewrite in the correct «motion + camera + tempo» formula.",
      },
    ],
  },
};
