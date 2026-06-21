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

const promptSkillExplanation = `Объясни новичку, что такое skill для промптинга.

Контекст:
- зритель видит расширение Opten;
- я хочу объяснить это простыми словами в уроке;
- не надо технической документации.

Смысл:
Skill - это набор инструкций под конкретную модель или задачу. Например, для Nano Banana Pro skill помнит, что модель хорошо держит внешность и текст, но любит делать картинку слишком глянцевой. Для Kling 3 skill помнит, что нужно отдельно описывать движение камеры и звук.

Сформулируй 3 коротких варианта объяснения в стиле спокойного YouTube-урока Влада.`;

const promptNanoIdea = `Модель: Nano Banana Pro.

Задача: превратить короткое ТЗ в промпт для фотореалистичного hero-изображения локальной кофейни.

Исходная идея:
Современная кофейня для людей с ноутбуками. Уютный интерьер, тёплый свет, деревянная стойка, стакан кофе с логотипом "NOVA", бариста на фоне, вечерний город за окном.

Нужно:
- фотореализм, не мультяшный 3D;
- формат 16:9 для hero-секции сайта;
- оставить место справа под текст лендинга;
- избегать глянцевого AI-look;
- сделать сцену коммерческой, но живой, как реальная фотография.

Собери финальный промпт на английском по правилам Nano Banana Pro.`;

const promptNanoHero = `A photorealistic commercial hero image for a modern local coffee shop called "NOVA". Warm evening interior with a walnut wood counter, matte black espresso machine, small branded takeaway cups, a few people quietly working on laptops, and a calm barista in the background. The right side of the frame has clean negative space for website headline text. Large street-facing window with soft city lights outside, realistic reflections on glass, warm tungsten practical lights, shallow depth of field, 35mm lens, natural skin texture, real wood grain, subtle steam from coffee, documentary commercial photography.

Composition: wide 16:9 website hero, main coffee counter on the left third, negative space on the right third, eye-level camera, natural perspective, no fisheye.

Style: grounded realism, muted warm palette, no glossy AI render look, no over-polished glamour, no cartoonish 3D, no fake luxury hotel feeling.

Output: 4K, photorealistic, clean enough for a website hero section.`;

const promptBaristaIdentity = `Use Image 1 as the strict identity reference for the barista. Preserve the same face shape, eyes, nose, mouth, hairline, skin tone, age range, and natural facial asymmetry. Do not beautify or redesign the face.

Create a photorealistic portrait of the same barista working inside the NOVA coffee shop. The barista is holding a matte black takeaway cup with a small "NOVA" logo, standing behind a warm wooden counter. Soft window light from the left, subtle rim light from practical lamps, natural skin texture with visible pores, realistic hands, relaxed friendly expression, 50mm lens, shallow depth of field, commercial lifestyle photography.

Keep the brand palette: warm wood, matte black, cream, small neon lime accent. No plastic skin, no extra fingers, no distorted cup, no unreadable logo, no AI glamour.

Format: vertical 4:5 for social post.`;

const promptGptPoster = `Create a clean vertical poster for a local coffee shop called NOVA.

Background and scene: a photorealistic close-up of a takeaway coffee cup on a dark wooden counter, soft morning light, laptop corner visible, small neon lime accent reflection, warm urban coffee shop mood.

Design style: modern editorial poster, Swiss grid, premium but not luxury, calm work-focused atmosphere. Use a restrained palette: matte black, cream, warm brown, small neon lime accent.

Text must be exact, in Russian, no extra characters:
Headline text, large and bold: "КОФЕ ДЛЯ ФОКУСА"
Subtext: "NOVA"
Small footer text: "утро, ноутбук, нормальный эспрессо"

Typography: clean sans-serif, strong hierarchy, readable Cyrillic, headline centered in the upper third, subtext under it, footer at the bottom. Keep the cup visible in the lower half.

Constraints: no misspelled text, no extra text, no watermark, no fake logo variations, no overdecorated layout.

Format: 1024x1536, high quality.`;

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
  prompt("l1-business-name", "lesson-1-prompting", "Придумай название для моего бизнеса."),
  prompt("l1-opten-image-prompt", "lesson-1-prompting", "Opten, сделай мне промпт для GPT Image."),
  prompt("l1-skill-explanation", "lesson-1-prompting", promptSkillExplanation, "course-v2-prompt-pack.md"),
  prompt("l3-opten-recraft-logo", "lesson-3-logo-generation", "Сделай промпт для Recraft, нужен векторный логотип кофейни NOVA в стиле загруженного референса."),
  prompt("l3-recraft-logo", "lesson-3-logo-generation", promptRecraftLogo, "course-v2-prompt-pack.md"),
  prompt("l4-nano-idea", "lesson-4-photo-generation", promptNanoIdea, "course-v2-prompt-pack.md"),
  prompt("l4-nano-hero", "lesson-4-photo-generation", promptNanoHero, "course-v2-prompt-pack.md"),
  prompt("l4-gpt-poster", "lesson-4-photo-generation", promptGptPoster, "course-v2-prompt-pack.md"),
  prompt("l5-opten-references", "lesson-5-references", "Сделай промпт для сохранения внешности человека по нескольким референсам. Сцена: бариста кофейни NOVA стоит за барной стойкой, слегка улыбается и готовит."),
  prompt("l5-nano-barista-identity", "lesson-5-references", promptBaristaIdentity, "course-v2-prompt-pack.md"),
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
