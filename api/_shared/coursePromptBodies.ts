export type CoursePromptBody = {
  id: string;
  courseSlug: string;
  lessonSlug: string;
  body: string;
  sourceLabel?: string;
  language: "text" | "markdown" | "bash";
};

const COURSE_SLUG = "ai-content-marketing-2026";

function prompt(id: string, lessonSlug: string, body: string, sourceLabel?: string): CoursePromptBody {
  return {
    id,
    courseSlug: COURSE_SLUG,
    lessonSlug,
    body,
    sourceLabel,
    language: "text",
  };
}

const promptNovaFormulaImage = `Задача:
Сгенерировать фотореалистичное hero-изображение для кофейни NOVA, которое можно использовать на сайте и в рекламном посте.

Контекст:
NOVA - современная городская кофейня для людей, которые приходят работать с ноутбуком, пить хороший кофе и спокойно фокусироваться. Бренд должен ощущаться тёплым, умным и не пафосным.

Сцена:
Утренний интерьер кофейни. На переднем плане матовый чёрный стакан кофе с аккуратным логотипом "NOVA" стоит на тёплой деревянной стойке. На фоне бариста готовит кофе, рядом гость работает за ноутбуком. Через большое окно видно мягкий городской свет и лёгкие отражения на стекле.

Стиль:
Фотореалистичная коммерческая съёмка, естественный свет, тёплая древесина, матовый чёрный, кремовые оттенки, небольшой неоново-лаймовый акцент бренда. Камера на уровне глаз, 35mm lens, shallow depth of field, natural skin texture, realistic reflections, subtle steam from coffee.

Ограничения:
Без мультяшного 3D, без глянцевого AI-look, без лишнего текста, без искажённого логотипа, без пластиковых лиц, без лишних пальцев, без водяных знаков. Сохранить спокойное рабочее настроение, не превращать кофейню в люксовый отель.

Формат:
16:9, 4K, горизонтальный кадр. Основной объект слева по правилу третей, справа оставить чистое пространство под заголовок сайта.`;

const promptCofe1Photo = `Photorealistic square-format product lifestyle photograph, 1:1 aspect ratio. A clear glass cup filled with fresh coffee sits on a café counter while a barista’s hand pours a smooth stream of coffee into it. Bright yellow color accents dominate the scene: warm yellow background details, golden reflections on the glass, subtle yellow café decor. Strong contrast between warm highlights and deep shadows, cinematic chiaroscuro lighting, realistic steam rising from the coffee, rich brown coffee tones, crisp glass texture, shallow depth of field, 50mm lens, eye-level close-up composition, natural realistic look, high detail, professional coffee photography. No text, no letters, no numbers, no logos, no watermark.`;

const promptCharacterReferenceSheet = `Создай один цельный лист раскадровки / character reference sheet на основе загруженных фотографий персонажа с помощью GPT Image 2, сделай это в 4K качества, выбери режим Высокой детализации.

Главная задача: сохранить личность персонажа максимально точно. Используй загруженные фото как строгий референс лица, формы головы, пропорций, носа, губ, глаз, бровей, ушей, линии челюсти, причёски и общего возраста. Strict identity preservation. No morphing, no face replacement, no beautification, no changing ethnicity, age, hairstyle, facial structure or body type.

Формат изображения:
- Один широкий лист на чистом светло-сером или белом студийном фоне.
- Аккуратная сетка из 7 кадров, как professional character turnaround sheet.
- Верхний ряд: 4 крупных портрета головы и плеч:
  1. Вид спереди, нейтральное выражение.
  2. Левый профиль.
  3. Правый профиль.
  4. Вид сзади, затылок и причёска.
- Нижний ряд: 3 полнофигурных кадра:
  5. Вид спереди, персонаж стоит прямо.
  6. Вид в 3/4 или боковой ракурс.
  7. Вид сзади, полный рост.

Одежда:
Простая нейтральная одежда без логотипов: чёрная футболка, чёрные брюки, белые кроссовки. Одежда должна быть одинаковой во всех кадрах.

Стиль:
Ultra-realistic studio photography, clean professional casting reference sheet, even softbox lighting, sharp facial details, natural skin texture, realistic hair, accurate anatomy, consistent proportions across all views, no cinematic shadows, no dramatic lighting, no stylization.

Композиция:
Все кадры ровно выровнены, персонаж одного масштаба внутри соответствующих кадров, без перекрытий, без лишних предметов, без текста, без подписей, без водяных знаков, без логотипов.

Negative:
Do not change the person’s identity. Do not make the face more handsome or generic. Do not alter hairstyle, facial hair, facial proportions, age, race, body shape, or expression style. No cartoon, no illustration, no AI glossy skin, no fashion editorial look, no background scene.`;

const promptBaristaIdentity = `Create a photorealistic premium advertising image for NOVA cafe using the uploaded reference images.
Use @image_1 @image_2 @image_3 as identity references for the same person. Keep the person’s facial features exactly the same as in the references: same face shape, eyes, eyebrows, nose, lips, jawline, skin tone, hairstyle, hair color, and natural proportions. This is an identity-locked portrait scene, so do not redesign the person or make him look like a different model.
Use @image_4 as the exact NOVA cafe logo reference. Place the logo naturally in the cafe environment, either as a large wall sign behind the barista or on the front of the coffee bar counter. The logo should read exactly “NOVA” with “cafe” vertically placed, matching the uploaded logo’s bold typographic style and yellow-black color identity.
Scene: the referenced person is standing behind a modern coffee bar counter as a barista inside NOVA cafe. He is slightly smiling in a calm, confident, natural way while preparing coffee — holding a portafilter, steaming milk, or pouring latte art. The cafe interior is modern, stylish, and brand-focused, with bright yellow accents, dark coffee equipment, warm wood or stone textures, ceramic cups, coffee beans, and professional bar tools.
Lighting and mood: bright saturated yellow brand atmosphere with dramatic shadow contrast, bold warm highlights, deep cinematic shadows, and strong commercial visual impact. Keep the image energetic and sunny, but preserve rich dark shadows and avoid a flat over-bright look.
Camera and quality: shot on a Sony A7III with an 85mm f/1.4 lens, medium shot at eye level, shallow depth of field, crisp detail, natural skin texture with visible pores, realistic hair strands, realistic hands, high-fidelity 4K commercial photography. Aspect ratio 4:5, suitable for a social media brand campaign.
Avoid: changing the person’s identity, airbrushed plastic skin, distorted hands, extra fingers, misspelled logo text, extra random text, extra logos, watermark, cartoon style, AI-glossy look.`;

const promptRecraftLogo = `A clean vector logotype for a modern local coffee shop named "NOVA". Minimal geometric wordmark, editable SVG style, structured layers, strong negative space, simple cup icon integrated with a small star spark. Brand mood: calm focus, coffee for people working on laptops, modern but not corporate.

Use a sans-serif geometric type style, balanced spacing, matte black main color, cream background, tiny neon lime accent. The icon must work alone as a favicon and social avatar.

No 3D, no gradients, no photorealistic texture, no complex illustration, no extra words, no mockup scene.

Negative prompt:
blurry, photorealistic, 3d render, mockup, extra text, misspelled letters, coffee beans everywhere, vintage badge, overly complex icon`;

const promptKlingI2v = `Subtle steam rises from the coffee cup, warm reflections shift on the window glass, people in the background make tiny natural movements, camera performs a slow smooth push-in toward the counter, cozy ambient cafe sounds, soft cup clinks, no music.`;

const promptVeoVertical = `Vertical 9:16 commercial video for a modern local coffee shop called NOVA.

Scene: morning inside a warm minimalist coffee shop. A calm barista in a black apron places a matte black takeaway cup on the counter. A young freelancer opens a laptop nearby, city street visible through the window.

Action: the barista slides the cup forward, steam rises, the freelancer takes the cup and smiles slightly, then the camera pushes in to the cup logo.

Camera: handheld commercial realism, close-up product shot, slow push-in, shallow depth of field, natural vertical composition.

Lighting: soft morning window light, warm practical lamps, realistic reflections on glass.

Audio: ambient cafe sounds, espresso machine hiss, ceramic cup clink, quiet street outside. No music.

Mood: calm, focused, premium but approachable.

(no subtitles!)`;

const promptSeedanceMultishot = `ЛОКАЦИЯ: Современная локальная кофейня NOVA утром. Тёплый деревянный интерьер, матовая чёрная стойка, большое окно на улицу, несколько людей спокойно работают за ноутбуками. Мягкий естественный свет из окна и тёплые практические лампы.

СТИЛЬ: Ultra-photorealistic 4K live-action commercial, grounded realism, subtle film grain, natural skin texture, realistic glass reflections, no glossy AI render look, no cartoonish look, no over-stylization.

СЮЖЕТ: Короткий рекламный hero-ролик показывает настроение кофейни: кофе, фокус, спокойная работа и живой городской ритм.

ПЕРСОНАЖИ: Бариста в чёрном фартуке, спокойное выражение лица, естественная микромимика. Посетитель с ноутбуком, сосредоточенный, но расслабленный.

СТРУКТУРА КАДРОВ (15 СЕК ВСЕГО):

0-4с - [ЗАВЯЗКА]
  Действие: Камера медленно скользит вдоль деревянной стойки, на переднем плане стоит стакан NOVA, от кофе поднимается пар.
  Эмоциональная игра: Бариста на фоне переводит взгляд на стакан, лёгкое движение плеч при вдохе.
  Камера: Низкий боковой dolly, shallow depth of field, product foreground.
  Свет: Мягкий оконный свет слева, тёплый rim light от ламп.
  Звук: Diegetic only - тихий шум кофемашины, стук чашки, городской фон.

4-10с - [ПОВОРОТ]
  Действие: Бариста ставит стакан перед посетителем, посетитель открывает ноутбук, экран мягко отражается в глазах.
  Эмоциональная игра: Сосредоточенный взгляд, небольшая улыбка, естественное моргание.
  Камера: Slow push-in from medium shot to close-up on hands and cup.
  Свет: Реалистичные отражения на стекле, тёплые тени от стойки.

10-15с - [РАЗВЯЗКА]
  Действие: Камера уходит к широкому кадру, видно интерьер, логотип на стакане и спокойную атмосферу работы.
  Эмоциональная игра: Посетитель делает первый глоток и возвращается к ноутбуку.
  Камера: Smooth pull-out to wide hero composition, right side has clean negative space for website text.
  Свет: Утренний свет усиливает пар и текстуру дерева.
  Звук: Diegetic only - кофемашина, шаги, тихий разговор. No music.

No music. Diegetic sound design only. Grounded realism, gritty film grain, no cartoonish look, no AI aesthetic.`;

const promptKlingMotion = `Style the character from the input image as a calm modern coffee shop barista in a black apron over a cream shirt, realistic skin texture, natural grooming, friendly but not exaggerated expression. Place the character inside a warm minimalist coffee shop with a walnut counter, matte black espresso machine, soft daylight through a large window, shallow depth of field, grounded commercial realism, subtle film grain, no glossy AI render look.`;

const promptCodexLanding = `Собери простой лендинг для локальной кофейни NOVA.

Контекст:
- это учебный проект для новичков;
- сайт должен открываться локально без сложной настройки;
- визуальный стиль: warm wood, matte black, cream, neon lime accent;
- нужен современный, аккуратный, не маркетингово-пустой дизайн.

Что должно быть:
- hero-секция с большим изображением кофейни и заголовком "NOVA";
- короткий подзаголовок на русском: "кофе для фокуса, работы и спокойного утра";
- 3 преимущества;
- меню из 4 напитков;
- блок с вертикальным AI-видео 9:16;
- блок "как нас найти";
- адаптив под мобильный.

Технически:
- сделай HTML, CSS и JS без тяжёлых зависимостей;
- изображения и видео пока подключи через локальные placeholder-файлы в папке assets;
- добавь понятные комментарии только в местах, где новичку важно понять структуру;
- после создания объясни, какие файлы получились и как открыть сайт.`;

const promptHiggsfieldMcp = `Используй Higgsfield MCP и инструмент Video Analysis, проанализируй видео, дай промпт на создание такого же. Хочу сделать первый кадр через GPT Image 2.0 а видео сделаю через Seedance 2.0, нужны промпты через скилл оптен. Фото буду генерировать со своим логотипом на стаканчике который загружу в референсы. Видео буду генерировать с этого полученного первого кадра, его обязательно упомянуть как начальный кадр видео.`;

const promptImageToCode = `Используй skill image to code. Сверстай эту страницу для моей кофейни NOVA. Логотипы и фотографии находятся в папке с готовыми генерациями. Если нужны дополнительные иконки или небольшие графические элементы, сгенерируй их в едином стиле, с одинаковой толщиной линий. Сделай адаптив для компьютера, планшета и телефона. После реализации запусти локальный сервер и проверь результат через Playwright: сделай скриншот каждой секции и сравни с референсом.`;

const COURSE_PROMPT_BODIES: CoursePromptBody[] = [
  prompt("l1-nova-formula-image", "lesson-1-prompting", promptNovaFormulaImage),
  prompt("l3-opten-recraft-logo", "lesson-3-logo-generation", "Сделай промпт для Recraft, нужен векторный логотип кофейни NOVA в стиле загруженного референса."),
  prompt("l3-recraft-logo", "lesson-3-logo-generation", promptRecraftLogo, "course-v2-prompt-pack.md"),
  prompt("l4-cofe1-photo", "lesson-4-photo-generation", promptCofe1Photo),
  prompt("l5-character-reference-sheet", "lesson-5-references", promptCharacterReferenceSheet),
  prompt("l5-opten-references", "lesson-5-references", "Сделай промпт для сохранения внешности человека по нескольким референсам. Сцена: бариста кофейни NOVA стоит за барной стойкой, слегка улыбается и готовит."),
  prompt("l5-nano-barista-identity", "lesson-5-references", promptBaristaIdentity),
  prompt("l6-remove-text", "lesson-6-image-editing", "Убери текст."),
  prompt("l6-remove-logos", "lesson-6-image-editing", "Убери логотипы с фартука и стаканчиков."),
  prompt("l7-kling-i2v", "lesson-7-ai-video", promptKlingI2v, "course-v2-prompt-pack.md"),
  prompt("l7-veo-vertical", "lesson-7-ai-video", promptVeoVertical, "course-v2-prompt-pack.md"),
  prompt("l8-keyframe-transition", "lesson-8-frames", "Плавное движение камеры между первым и последним кадром. Сохранить стиль, свет, объект и композицию. Добавить лёгкий push-in, естественное движение пара и мягкие отражения. Без резких смен сцены."),
  prompt("l9-seedance-multishot", "lesson-9-storytelling", promptSeedanceMultishot, "course-v2-prompt-pack.md"),
  prompt("l9-idea-15s", "lesson-9-storytelling", "Сгенерируй идею на 15 секунд, 5 кадров."),
  prompt("l9-storyboard", "lesson-9-storytelling", "Сделай раскадровку для идеи и проставь ссылки на референсы через @."),
  prompt("l11-midjourney-opten", "lesson-11-ai-avatars", "Сделай промпт для Midjourney 8.1. Персонаж в стиле Pixar, используй референсы для понимания стиля нашей кофейни, опиши её в промпте и конвертируй это всё в стиль Pixar. Персонаж стоит за стойкой баристы, улыбается и смотрит в камеру."),
  prompt("l12-kling-motion", "lesson-12-motion-control", promptKlingMotion, "course-v2-prompt-pack.md"),
  prompt("l12-short-replace-person", "lesson-12-motion-control", "Заменить человека, сохранить свет и положение тела."),
  prompt("l14-higgsfield-auth", "lesson-14-codex", "Я подключил Higgsfield MCP, давай авторизуемся."),
  prompt("l14-install-skill", "lesson-14-codex", "Установи этот skill."),
  prompt("l14-check-mcp", "lesson-14-codex", "Проверь соединение MCP."),
  prompt("l14-opten-codex", "lesson-14-codex", "Opten, улучши prompt."),
  prompt("l15-higgsfield-mcp-video-analysis", "lesson-15-higgsfield-mcp", promptHiggsfieldMcp, "course-10-lessons.v5.draft.md"),
  prompt("l16-codex-landing", "lesson-16-nova-website", promptCodexLanding, "course-v2-prompt-pack.md"),
  prompt("l16-image-to-code", "lesson-16-nova-website", promptImageToCode, "course-10-lessons.v5.draft.md"),
];

const COURSE_PROMPT_BODY_INDEX = new Map(COURSE_PROMPT_BODIES.map((body) => [keyFor(body.courseSlug, body.lessonSlug, body.id), body]));

export function findCoursePromptBody(courseSlug: string | undefined, lessonSlug: string | undefined, promptId: string | undefined) {
  if (!courseSlug || !lessonSlug || !promptId) return undefined;
  return COURSE_PROMPT_BODY_INDEX.get(keyFor(courseSlug, lessonSlug, promptId));
}

function keyFor(courseSlug: string, lessonSlug: string, promptId: string) {
  return `${courseSlug}:${lessonSlug}:${promptId}`;
}
