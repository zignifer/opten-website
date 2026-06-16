import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-06-11";

const COVER_RU = {
  src: "/blog/ai-influencer/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Обложка гайда про AI influencer и создание консистентного ИИ-инфлюенсера",
};
const COVER_EN = {
  src: "/blog/ai-influencer/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Cover image for an AI influencer guide about consistent character creation",
};

const ru: BlogPostLocale = {
  slug: "ai-influencer",
  title: "AI influencer: как создать ИИ-инфлюенсера с постоянным лицом",
  excerpt:
    "ИИ-инфлюенсер и workflow в Higgsfield стабильнее, когда у персонажа есть character bible: лицо, стиль, сцены и prompt lock.",
  description:
    "Как создать ИИ-инфлюенсера для Instagram: собрать character bible, стабилизировать сцены, лицо и промпты.",
  category: "guide",
  tags: ["workflow", "ai-image-gen", "ai-video-gen"],
  cover: COVER_RU,
  readingTimeMin: 7,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["consistent-character-ai", "prompt-structure", "negative-prompt"],
  body: {
    intro:
      "AI influencer — это синтетический персонаж, который повторяется в фото, видео и коротких Reels как один и тот же автор. Рабочий результат держится не на красивой аватарке, а на character bible: фиксированных чертах лица, одежде, стиле, сценах и prompt-ограничениях.",
    steps: [
      {
        title: "Начните с character bible, а не с первой картинки",
        body:
          "ИИ-инфлюенсер — это не один удачный портрет. Для серии нужен короткий паспорт персонажа: возрастной диапазон, форма лица, волосы, мимика, базовая одежда, цветовая палитра, типичные локации и запреты. Если этого нет, каждая новая генерация начинает «кастинг» заново: лицо становится мягче, прическа меняется, стиль одежды уезжает в другую нишу.\n\nПрактический минимум: 8-12 строк fixed traits, 3-5 wardrobe anchors и 3 environment rules. Например: `oval face, short black bob, calm expression, graphite bomber jacket, silver ear cuff, night city interiors, no bright daylight, no smiling selfie angle`. Если вы ищете курс по ИИ-инфлюенсерам, этот блок важнее длинной теории: без него любой урок превращается в подбор случайных картинок.",
        before:
          "Создай красивую девушку-инфлюенсера для бренда одежды.",
        after:
          "Character bible: synthetic fashion creator, oval face, short black bob, calm direct gaze, graphite bomber jacket, silver ear cuff, muted streetwear palette. Environment: night city interiors, soft window reflections, 35mm editorial camera. Constraints: same face, same hair length, no celebrity likeness, no bright daylight.",
        imageSrc: "/blog/ai-influencer/ru/step-1.jpg",
      },
      {
        title: "Фиксируйте сцены как сетку, а не как настроение",
        body:
          "Когда вы создаете ИИ-инфлюенсера для контента, модель должна понимать не только внешность, но и набор повторяемых ситуаций. «Сделай lifestyle контент» слишком широко: сегодня получится кафе, завтра пляж, послезавтра глянцевая реклама. Лучше задать scene grid: 4-6 типов кадров, которые можно повторять без потери identity.\n\nПример сетки: street portrait, product-in-hand, mirror prep, night cafe, backstage fitting, vertical video hook. В каждом типе повторяются лицо, волосы, один-два предмета одежды и свет. Так ИИ-инфлюенсер в Instagram выглядит как серия одного автора, а не как набор разных моделей из стока.",
        before:
          "Сделай посты для Инстаграма, чтобы персонаж был разный, но узнаваемый.",
        after:
          "Scene grid: 1) street portrait, 2) product-in-hand, 3) mirror prep, 4) night cafe, 5) backstage fitting. Preserve: same face, short black bob, graphite bomber, calm gaze, green rim light. Change only location and pose.",
        imageSrc: "/blog/ai-influencer/ru/step-2.jpg",
      },
      {
        title: "ИИ-инфлюенсер в Higgsfield: разделяйте фото и движение",
        body:
          "Запросы про ИИ-инфлюенсеров в Higgsfield чаще всего касаются fashion-персонажа, Soul-стиля и коротких video moves. Стабильный workflow лучше делить на два слоя. Сначала соберите image reference: лицо, одежда, ракурс, свет. Потом отдельно пишите motion prompt для DoP или другого video-движка: одно действие, одно движение камеры, один запрет на drift.\n\nКейс: персонаж в черном бомбере стабильно получался в фото, но в видео лицо менялось на повороте головы. Ошибка была в промпте `turns to camera, cinematic`. Исправление: `preserve the same face, short black bob, graphite bomber; slow 3-second head turn; locked 50mm medium shot; no face redesign, no outfit change`. После этого серия стала заметно ровнее.",
        before:
          "Fashion character in Higgsfield, поворот к камере, fashion reel, cinematic.",
        after:
          "Use the approved image reference as identity. Action: slow 3-second head turn toward camera. Camera: locked 50mm medium shot, no zoom. Preserve: same face, short black bob, graphite bomber, silver ear cuff. Constraints: no face redesign, no outfit change, no extra text.",
        imageSrc: "/blog/ai-influencer/ru/step-3.jpg",
      },
      {
        title: "Пишите Reels как короткий storyboard",
        body:
          "Для Reels не нужен сценарий на страницу. Нужны 3-4 beats: hook, действие, product или mood detail, финальный кадр. Если написать все одним абзацем, модель сама решит, когда менять крупность и что можно потерять. Для ИИ-инфлюенсера это риск: на втором beat'е изменится лицо, на третьем — одежда, на четвертом — вообще появится другой человек.\n\nРабочий формат: `0-2s hook`, `2-5s action`, `5-8s detail`, `8-10s close`. В каждом beat'е повторяйте identity lock. Opten можно использовать как preflight перед рендером: он разворачивает идею в production prompt и подсвечивает, где забыты camera path, preserve-блок или запрет на лишний текст.",
        before:
          "Сделай reels про нового ИИ-инфлюенсера, модно, реалистично, красиво.",
        after:
          "0-2s: close portrait, same face and bob haircut, calm gaze.\n2-5s: medium shot, puts on graphite bomber, green rim light.\n5-8s: hand detail with silver ear cuff visible in reflection.\n8-10s: locked hero pose, no face drift, no outfit change, no random text.",
        imageSrc: "/blog/ai-influencer/ru/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "Что такое ИИ-инфлюенсер?",
        a: "ИИ-инфлюенсер — синтетический персонаж для фото, видео и соцсетей. В практическом смысле это не только внешность, а повторяемый набор traits, wardrobe, сцен, prompt-ограничений и правил публикации.",
      },
      {
        q: "Как создать ИИ-инфлюенсера без постоянной смены лица?",
        a: "Сначала зафиксируйте character bible: черты лица, волосы, базовую одежду, свет, камеру и запреты. Затем повторяйте identity lock в каждом фото- и video-промпте. Не просите просто «сделай похожим» — перечисляйте, что именно нельзя менять.",
      },
      {
        q: "Что важно в workflow для ИИ-инфлюенсера в Higgsfield?",
        a: "Разделяйте image reference и движение. В Higgsfield сначала стабилизируйте персонажа на фото, затем для видео задавайте одно действие, один camera move и явный preserve-блок. Так меньше шансов, что лицо или одежда изменятся между кадрами.",
      },
      {
        q: "Можно ли запустить ИИ-инфлюенсера для Instagram за один вечер?",
        a: "Можно собрать первый тест: character bible, 3-5 сцен и несколько Reels prompts. Но полноценный аккаунт требует отбора, перегенераций и правил бренда. Не обещайте себе 100% идентичность: лучше добиться узнаваемой серии и постепенно ужесточать prompt lock.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-influencer",
  title: "AI influencer: consistent character workflow",
  excerpt:
    "An ai influencer and ai influencer higgsfield workflow stay consistent when you lock the character bible, scenes, camera, and prompt constraints.",
  description:
    "AI influencer guide for 2026: create a consistent character bible, plan Instagram Reels, and use prompt locks for Higgsfield-style workflows.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 6,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "An ai influencer is a synthetic character that appears across photos, videos, and short Reels as the same creator. The workflow is not about one pretty avatar. It depends on a character bible: fixed facial traits, wardrobe, visual style, scene rules, and prompt constraints.",
    steps: [
      {
        title: "Start with a character bible, not a first portrait",
        body:
          "A useful ai influencer is not one lucky image. For a series, you need a compact character bible: age range, face shape, hair, expression, core wardrobe, color palette, usual locations, and hard negatives. Without it, every new generation starts casting again. The face softens, hair length changes, and the wardrobe moves into a different niche.\n\nKeep the first version practical: 8-12 fixed traits, 3-5 wardrobe anchors, and 3 environment rules. Example: `oval face, short black bob, calm expression, graphite bomber jacket, silver ear cuff, night city interiors, no bright daylight, no smiling selfie angle`. That block does more for consistency than a long generic ai influencer guide.",
        before:
          "Create a beautiful girl influencer for a clothing brand.",
        after:
          "Character bible: synthetic fashion creator, oval face, short black bob, calm direct gaze, graphite bomber jacket, silver ear cuff, muted streetwear palette. Environment: night city interiors, soft window reflections, 35mm editorial camera. Constraints: same face, same hair length, no celebrity likeness, no bright daylight.",
        imageSrc: "/blog/ai-influencer/en/step-1.jpg",
      },
      {
        title: "Lock scenes as a grid, not a mood",
        body:
          "When you create an ai influencer for content, the model needs more than appearance. It needs repeatable situations. `Make lifestyle content` is too wide: one pass gives a cafe, the next a beach, then a glossy ad. A scene grid works better: 4-6 shot types you can reuse without losing identity.\n\nUse a simple grid: street portrait, product-in-hand, mirror prep, night cafe, backstage fitting, vertical video hook. In each shot type, repeat the face, hair, one or two wardrobe anchors, and lighting. That makes an ai Instagram Reels series feel like one creator instead of a stock-image collage.",
        before:
          "Make Instagram posts where the character is different but recognizable.",
        after:
          "Scene grid: 1) street portrait, 2) product-in-hand, 3) mirror prep, 4) night cafe, 5) backstage fitting. Preserve: same face, short black bob, graphite bomber, calm gaze, green rim light. Change only location and pose.",
        imageSrc: "/blog/ai-influencer/en/step-2.jpg",
      },
      {
        title: "AI influencer Higgsfield: separate image and motion",
        body:
          "The query `ai influencer higgsfield` usually points to fashion characters, Soul-style images, and short video moves. Treat it as two layers. First, build the image reference: face, wardrobe, angle, lighting. Then write the motion prompt for DoP or another video model: one action, one camera move, and one anti-drift rule.\n\nPractical case: a character in a graphite bomber looked stable in stills, but the face changed during a head turn. The broken prompt was `turns to camera, cinematic`. The fix was specific: `preserve the same face, short black bob, graphite bomber; slow 3-second head turn; locked 50mm medium shot; no face redesign, no outfit change`. The result kept motion without recasting the creator.",
        before:
          "AI influencer Higgsfield, turns to camera, fashion reel, cinematic.",
        after:
          "Use the approved image reference as identity. Action: slow 3-second head turn toward camera. Camera: locked 50mm medium shot, no zoom. Preserve: same face, short black bob, graphite bomber, silver ear cuff. Constraints: no face redesign, no outfit change, no extra text.",
        imageSrc: "/blog/ai-influencer/en/step-3.jpg",
      },
      {
        title: "Write Reels as a short storyboard",
        body:
          "A Reel does not need a page-long script. It needs 3-4 beats: hook, action, product or mood detail, final frame. If you write everything in one paragraph, the model decides when to change shot size and which detail can drift. For an ai influencer, that is where the face shifts, the outfit changes, or another person enters the frame.\n\nUse a compact structure: `0-2s hook`, `2-5s action`, `5-8s detail`, `8-10s close`. Repeat the identity lock in each beat. Opten is useful as a preflight before rendering: it expands the idea into a production prompt and catches missing camera path, preserve block, or random-text constraints.",
        before:
          "Make a Reel about a new ai influencer, fashionable, realistic, beautiful.",
        after:
          "0-2s: close portrait, same face and bob haircut, calm gaze.\n2-5s: medium shot, puts on graphite bomber, green rim light.\n5-8s: hand detail with silver ear cuff visible in reflection.\n8-10s: locked hero pose, no face drift, no outfit change, no random text.",
        imageSrc: "/blog/ai-influencer/en/step-4.jpg",
      },
    ],
    faq: [
      {
        q: "What is an ai influencer?",
        a: "An ai influencer is a synthetic character used for images, videos, and social content. In production, it is not just a face. It is a repeatable system of traits, wardrobe, scene rules, prompt constraints, and publishing choices.",
      },
      {
        q: "How do I make an ai influencer in 2026 without face drift?",
        a: "Write a character bible first, then repeat the identity lock in every image and video prompt. Lock face shape, hair, wardrobe, camera, lighting, and what must not change. Vague lines like `keep her similar` are not enough.",
      },
      {
        q: "What matters in an ai influencer higgsfield workflow?",
        a: "Separate the still image reference from motion. Stabilize the character in images first, then give the video model one action, one camera move, and explicit preserve constraints. That reduces face, outfit, and scene drift.",
      },
      {
        q: "Can I use an ai influencer for Instagram Reels?",
        a: "Yes, but plan Reels as short storyboards instead of single prompts. Use a hook, one action, one detail, and a final frame. Keep the same identity rules in every beat and avoid platform logos or misleading real-person cues.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
