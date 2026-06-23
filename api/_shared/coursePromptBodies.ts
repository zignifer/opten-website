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

const promptTextToVideoLatteArt = `Cinematic macro close-up inside a dim specialty coffee bar. A black ceramic cup of espresso is held at a slight angle by a barista’s hand while a stainless steel milk pitcher enters from the upper left. Steamed milk begins as a thin white stream, blooming into the caramel-brown crema. The barista lowers the spout and gently rocks the pitcher, drawing concentric pale arcs that expand into a rosetta tulip latte-art pattern across the glossy surface. The camera stays tightly above the cup with subtle handheld motion, shallow depth of field, warm tungsten highlights, dark blurred background, realistic foam texture, soft film grain. Near the end, the pitcher lifts and pulls a clean final white line through the pattern, finishing a crisp layered leaf. Sound: quiet cafe room tone, soft milk pour, faint espresso-machine hum; the scene remains wordless.`;

const promptImageToVideoIcedCoffee = `Slow smooth camera push-in as the barista gently pours espresso into the milk and ice. Coffee stream flows naturally with subtle ripples. Keep background static; preserve cup shape, logo, composition, lighting; no new objects.`;

const promptKeyframeMenuTransition = `Smooth continuous pull-back from the coffee-pouring close-up, then a slow rightward pan/slide toward the wall menu, with a gentle rack focus shifting from the cup and barista’s hand to the menu board, ending locked on the final keyframe.`;

const promptKlingMultishot = `Multi shot Prompt 1: Extreme close-up of the barista’s hands pouring fresh espresso from a small metal pitcher into a clear plastic cup filled with milk and ice. The espresso stream is the main focus, swirling into the milk and creating rich brown gradients. The “NOVA cafe” logo on the cup is clearly visible and sharp. Metal espresso machine on the left edge of frame, warm golden light, deep shadows, macro coffee texture. Camera makes a very slow push-in, almost still, natural handheld feel. Ambient espresso machine hiss and soft café room tone. Duration: 3 seconds.

Multi shot Prompt 2: Close-up of the barista placing the metal pitcher down on the textured counter, then picking up a clear plastic lid and gently pressing it onto the finished iced coffee cup. Only hands are visible, no face. The camera pulls back slightly to reveal more of the bar counter and the warm café interior. The cup remains centered, “NOVA cafe” logo facing camera, ice and espresso layers visible. Smooth cinematic motion, realistic shadows, soft clink of metal pitcher, subtle lid snap. Duration: 3 seconds.

Multi shot Prompt 3: Medium close-up of the finished iced coffee cup standing near the edge of the bar counter in sharp focus. The “NOVA cafe” logo stays readable and clean. In the softly blurred background, the café door opens and a customer enters, visible only as a warm backlit silhouette. Focus stays on the cup while the background moves gently. Warm yellow light, strong contrast shadows, cozy premium mood, shallow depth of field, slow natural camera drift. Door chime and quiet café ambience. Duration: 3 seconds.

Multi shot Prompt 4: Close-up of the customer’s hand reaching in and picking up the iced coffee cup from the counter. The cup and logo remain the hero object, centered and clearly visible as the hand lifts it. In the background, the barista softly smiles, slightly out of focus, wearing the same brown apron. Warm golden café lighting, textured countertop, realistic hand motion, shallow depth of field. Camera follows the cup with a subtle handheld tracking movement. Soft ice clink inside the cup. Duration: 3 seconds.

Multi shot Prompt 5: Interior café shot from behind the bar counter. The customer walks toward the exit holding the iced coffee cup with the “NOVA cafe” logo facing slightly toward camera. Warm sunlight pours through the doorway, creating a glowing silhouette and long soft shadows. The bar counter remains in the foreground, cozy coffee shop details in soft focus. Camera stays inside the café and gently holds as the customer leaves, creating a calm takeaway coffee feeling. Natural motion, cinematic contrast, soft handheld camera, ambient café sounds fading with the door chime. Duration: 3 seconds.`;

const promptSeedanceMultishot = `[TITLE & ACT]: NOVA cafe ad, vertical 9:16, 15 seconds, 24fps.
LOCATION: Warm urban coffee shop interior transitioning to the cafe entrance. Golden natural sunlight, deep soft shadows, textured counter, condensation on plastic cup, realistic metal and glass reflections.
REFERENCE ASSIGNMENT: <<<1d4557e8-6199-4727-b62e-91b22abb832b>>> is the full storyboard reference for shot order, framing, timing, warm color grade, and calm pacing. Do not render the storyboard labels or timing text. <<<3783d3dc-2bcd-4b39-96dd-7e6ad8848f38>>> is the exact brand logo reference; preserve it cleanly on the cup, glass reflection, or final hero frame. No morphing, no redesign.
STYLE: Ultra-photorealistic 4K live-action commercial cinema, 35mm documentary advertising look, shallow depth of field, subtle film grain, warm golden sunlight, grounded realism, practical lighting, no glossy AI render look, no cartoonish look, no over-stylization.
STORY: A quiet premium cafe commercial showing the craft of iced coffee preparation, moving from espresso pour to branded hero shot.
CHARACTERS: Barista hands only, calm precise movements, natural skin texture, relaxed fingers. No full faces in focus.
SHOT STRUCTURE (15 SEC TOTAL):
0-3s — [THE ENTRY]
  Action: Start from the first panel of <<<1d4557e8-6199-4727-b62e-91b22abb832b>>>. Barista hands slowly pour espresso into iced milk over ice; coffee swirls through the milk.
  Emotional Acting: Calm precision, steady wrist, relaxed grip.
  Camera: Close-up, gentle push-in, shallow depth of field.
  Lighting: Warm side sunlight and deep cafe shadows.
  Audio Rule: Diegetic only — espresso pour, ice shifting, soft room tone.
3-6s — [PRODUCT REVEAL]
  Action: The finished iced coffee is gently sealed or placed on the counter; <<<3783d3dc-2bcd-4b39-96dd-7e6ad8848f38>>> is visible on the cup.
  Emotional Acting: Smooth controlled hand movement.
  Camera: Close-up lateral slide, focus on condensation and logo.
  Lighting: Golden sunlight stripe across cup and counter.
  Audio Rule: Soft lid touch, cup slide, quiet cafe ambience.
6-9s — [PICKUP]
  Action: A hand picks up the branded iced coffee inside the cafe.
  Emotional Acting: Relaxed fingers, natural wrist turn.
  Camera: Handheld editorial close-up, subtle follow movement.
  Lighting: Warm interior shadows, soft highlights on cup and ice.
  Audio Rule: Hand contact with cup, low cafe ambience.
9-12s — [EXIT LIGHT]
  Action: The drink moves through the cafe entrance into golden street light; <<<3783d3dc-2bcd-4b39-96dd-7e6ad8848f38>>> appears on glass, reflection, or a small brand detail.
  Camera: Smooth tracking shot, gentle exposure shift from shadow to sunlight.
  Lighting: Warm exterior glow, realistic reflections.
  Audio Rule: Door movement, distant street ambience.
12-15s — [PAYOFF]
  Action: Final hero shot: iced coffee stands still in sunlight, <<<3783d3dc-2bcd-4b39-96dd-7e6ad8848f38>>> clear and legible.
  Camera: Locked close-up with very slow push-in.
  Lighting: Warm highlight, soft shadow, minimal premium ending.
  Audio Rule: Quiet ambience only.
No music. Diegetic sound design only. No subtitles, no random text, no watermark, no extra logos, no full faces, no AI aesthetic.`;

const promptPhotoEditBarista = `Use Image 1 as the base photo and Image 2 only as the logo/reference branding. Create a photorealistic high-fidelity edit of Image 1, preserving the person’s identity: keep the same face, facial features, skin tone, hair, body proportions, expression, head angle, hand position, and overall pose exactly the same. Do not beautify, reshape, age, or stylize the face.

Replace the entire room background with a cozy evening coffee-themed brand backdrop: warm muted coffee-brown walls, subtle café atmosphere, soft shadows, and the NOVA cafe logo from Image 2 placed clearly on the background wall as a branded mural/sign. Preserve the logo design, proportions, typography, and black-on-warm-yellow/coffee color identity as accurately as possible. Do not invent a new logo and do not add extra text.

Replace the clothing with a masculine barista outfit: a dark high-quality barista apron in canvas or leather texture over a clean dark shirt, plus black trousers instead of shorts. The clothing should fit naturally on the existing body and pose, with realistic fabric folds, seams, straps, and shadows.

Adjust the lighting to a dim evening café mood: low-key warm ambient light, soft directional highlights, muted desaturated palette, neutral exposure, no auto-brightening, no glossy commercial polish. Keep the image realistic and natural, with visible skin texture, real fabric texture, and believable shadows. Maintain the original vertical portrait framing and camera perspective. No watermark, no extra objects, no extra people, no distorted hands, no changed face, no changed pose.`;

const promptMidjourneyCharacter = `A friendly adult barista character in a Pixar-inspired 3D animated style, standing behind a clean minimalist coffee bar, smiling warmly and looking directly into the camera. The cafe interior is cozy and modern, inspired by a boutique specialty coffee shop with a warm honey-yellow, creamy beige, and soft brown color palette, a smooth brown counter, a brass-toned espresso machine, a simple cream menu board, soft golden sunlight casting long elegant shadows, and a welcoming upscale atmosphere. Keep the scene visually clean and uncluttered: only one single takeaway coffee cup on the counter, no extra cups, no pastry bags, no stacks of packaging, no clutter. Everything is fully unbranded and minimal, with no logos, no labels, no text, no signage lettering. The character has expressive eyes, soft stylized facial features, appealing proportions, and wears a simple warm-brown barista apron. Medium shot, eye-level camera, cinematic warm lighting, polished animated rendering, charming and wholesome mood, clear composition, elegant background detail without visual overload --s 250 --ar 9:16`;

const promptHeygenAnimation = `Animate the uploaded character exactly as in the reference image. Preserve the original face design and do not redesign the eyes. The eyes must stay as small simple black oval eyes, without blue irises, without white sclera, without large cartoon pupils, and without extra eye highlights. Keep the same clay / soft 3D character style, same beard, hair, nose, smile, apron, logo, lighting, and cafe background.

The character must face the camera directly, head straight and centered, no head turn, no side angle, no tilting. Eyes look directly into the camera the whole time. Camera is locked and static, no zoom, no pan, no rotation.

Only add very subtle idle animation: gentle breathing, tiny natural micro bob of the head and shoulders, very slight hand/body movement. Keep the expression calm and friendly. No exaggerated facial animation, no big blinking, no eyebrow movement, no talking, no mouth movement.`;

const promptReplaceAppearance = `Замени внешность человека на первом фото на внешность человека со второго фото, сохрани внешность и освещение.`;

const promptInstallSkill = `Установи этот скилл npx skills add higgsfield-ai/skills`;

const promptOptenCodex = `Оптен, сгенерируй промпт для GPT Image 2.0: нужно сделать вертикальный рекламный кадр для кофейни NOVA с бариста, стаканом кофе, тёплым светом и чистым местом под текст. Сохрани логотип, стиль бренда и реалистичную фотографическую подачу.`;

const promptLayoutGrid = `Layout: Desktop viewport 1440px. Centered 1200px max-width container. 120px side gutters. 12-column grid. 24px gutters. No full-width text. Keep text blocks max 560–640px. Keep visible whitespace on both sides. Do not stretch text across the full page width.`;

const promptImageToCode = `Используй skill image to code. Сверстай эту страницу для моей кофейни NOVA. Логотипы и фотографии находятся в папке с готовыми генерациями. Если нужны дополнительные иконки или небольшие графические элементы, сгенерируй их в едином стиле, с одинаковой толщиной линий. Сделай адаптив для компьютера, планшета и телефона. После реализации запусти локальный сервер и проверь результат через Playwright: сделай скриншот каждой секции и сравни с референсом.`;

const COURSE_PROMPT_BODIES: CoursePromptBody[] = [
  prompt("l1-nova-formula-image", "lesson-1-prompting", promptNovaFormulaImage),
  prompt("l3-opten-recraft-logo", "lesson-3-logo-generation", "Сделай промпт для Recraft, нужен векторный логотип кофейни NOVA в стиле загруженного референса."),
  prompt("l3-recraft-logo", "lesson-3-logo-generation", promptRecraftLogo),
  prompt("l4-cofe1-photo", "lesson-4-photo-generation", promptCofe1Photo),
  prompt("l5-character-reference-sheet", "lesson-5-references", promptCharacterReferenceSheet),
  prompt("l5-opten-references", "lesson-5-references", "Сделай промпт для сохранения внешности человека по нескольким референсам. Сцена: бариста кофейни NOVA стоит за барной стойкой, слегка улыбается и готовит."),
  prompt("l5-nano-barista-identity", "lesson-5-references", promptBaristaIdentity),
  prompt("l7-text-to-video-latte-art", "lesson-7-ai-video", promptTextToVideoLatteArt),
  prompt("l7-image-to-video-iced-coffee", "lesson-7-ai-video", promptImageToVideoIcedCoffee),
  prompt("l8-keyframe-menu-transition", "lesson-8-frames", promptKeyframeMenuTransition),
  prompt("l9-kling-multishot", "lesson-9-storytelling", promptKlingMultishot),
  prompt("l9-seedance-multishot", "lesson-9-storytelling", promptSeedanceMultishot),
  prompt("l10-photo-edit-barista", "lesson-10-prompt-library", promptPhotoEditBarista),
  prompt("l11-midjourney-character", "lesson-11-ai-avatars", promptMidjourneyCharacter),
  prompt("l11-heygen-animation", "lesson-11-ai-avatars", promptHeygenAnimation),
  prompt("l12-replace-appearance", "lesson-12-motion-control", promptReplaceAppearance),
  prompt("l14-install-skill", "lesson-14-codex", promptInstallSkill),
  prompt("l14-opten-codex", "lesson-14-codex", promptOptenCodex),
  prompt("l16-layout-grid", "lesson-16-nova-website", promptLayoutGrid),
  prompt("l16-image-to-code", "lesson-16-nova-website", promptImageToCode),
];

const COURSE_PROMPT_BODY_INDEX = new Map(COURSE_PROMPT_BODIES.map((body) => [keyFor(body.courseSlug, body.lessonSlug, body.id), body]));

export function findCoursePromptBody(courseSlug: string | undefined, lessonSlug: string | undefined, promptId: string | undefined) {
  if (!courseSlug || !lessonSlug || !promptId) return undefined;
  return COURSE_PROMPT_BODY_INDEX.get(keyFor(courseSlug, lessonSlug, promptId));
}

function keyFor(courseSlug: string, lessonSlug: string, promptId: string) {
  return `${courseSlug}:${lessonSlug}:${promptId}`;
}
