// Phase v2.0 MODELS-B-1 (agent batch 6): generated content for seedance-1.5-pro.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Seedance 1.5 Pro: структура, ошибки, примеры",
    description:
      "Как писать промпты для Seedance 1.5 Pro от ByteDance: простая раскадровка начало/середина/конец, базовые negative, расширенная камера и примеры.",
    h1: "Seedance 1.5 Pro: как писать промпты, которые модель понимает",
    intro:
      "Seedance 1.5 Pro — промежуточная версия видео-модели ByteDance между поколениями 1.0 и 2.0. Делает 5 или 10 секунд до 1080p, принимает текст и 1–2 изображения. Принесла базовую поддержку negative prompts, простую раскадровку «начало/середина/конец» и расширенный камерный словарь — но без полных @-референсов, звука и точного тайминга по секундам из 2.0.",
    sections: [
      {
        heading: "Место 1.5 Pro в линейке",
        body:
          "1.5 Pro — это «1.0 на стероидах»: та же фиксированная длительность 5/10 секунд, тот же отсутствующий звук, но заметно улучшенная физика движений, лучшее следование промптам и базовая поддержка референс-изображений (1–2 штуки) для сохранения стиля.\n\nКлючевое отличие от 1.0 Pro: появилась простая раскадровка («Start / Middle / End») и базовая поддержка негативных промптов на уровне простых запретов. Камерный словарь расширен — теперь стабильно работают комбинации orbit + zoom (не более двух одновременных движений).\n\nОт 2.0 отделяет: нет тайминг-раскадровки по секундам, нет полного @-синтаксиса с множественными референсами, нет звукового контроля, разрешение ограничено 1080p (в 2.0 — до 2K).",
        bullets: [
          "Длительность 5 или 10 секунд (как в 1.0)",
          "Разрешение до 1080p, 24fps",
          "На вход: текст + 1–2 изображения (базовый reference)",
          "Простая раскадровка Start / Middle / End",
          "Базовые negative prompts работают, сложные — нет",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Базовая формула та же, что в 1.0 Pro: `[Субъект] + [Действие] + [Сцена] + [Камера] + [Стиль]`. Но 1.5 Pro лучше обрабатывает детализированные промпты — можно безопасно расписывать внешность, материалы, освещение в большем объёме.\n\nДля Text-to-Video: «Субъект + Движение + Сцена + Камера + Стиль/Настроение». Для Image-to-Video: «Субъект + Движение, Фон + Движение, Камера + Движение + Стиль». Базовые параметры в конце: «Non-fixed camera, 1080p, 16:9, 10s».\n\nДля 10-секундных видео используй простую раскадровку — это сильная сторона 1.5: «Start: woman sits at a café table, reading a book. Medium shot. Middle: she looks up, sees someone, smiles. Camera slowly zooms in. End: close-up of her face, warm smile, golden hour light.»",
      },
      {
        heading: "Простая раскадровка Start / Middle / End",
        body:
          "1.5 Pro вводит трёхактную структуру без жёсткого тайминга по секундам. Это даёт базовый контроль над нарративом без сложности 2.0.\n\nКаждый блок описывает: что в кадре, какая камера, какое освещение. Между блоками модель сама расставит переходы — не нужно прописывать «cut to» или «camera switching».\n\nПример: «Start: detective sits at his desk, dim light, medium shot. Middle: phone rings, he picks it up, camera slowly pushes in. End: close-up of his eyes widening as he hears the news, warm desk lamp catches one side of his face.» Это работает надёжнее, чем сплошной параграф — модель видит трёхактную структуру и распределяет движение во времени осмысленно.",
      },
      {
        heading: "Базовые negative prompts",
        body:
          "1.5 Pro принимает простые запреты — но не сложные конструкции. Что работает: «No text, no watermarks», «No cartoon style», «No blurry details». Что не работает: длинные негативные списки, негативные описания персонажей, противоречивые ограничения.\n\nЛучший подход: всё, что можно, формулировать позитивно («photorealistic», «sharp focus», «cinematic»), а в negative оставлять только базовые исключения. Несколько простых запретов в одной строке: «No text. No watermarks. No motion blur.» — рабочий формат.\n\nКонфликт между негативом и основным промптом — антипаттерн. Если в промпте написано «detective with a mustache», а в negative — «no facial hair», модель сломается. Сначала привести промпт к непротиворечивому виду, потом добавлять negative.",
      },
      {
        heading: "Расширенная камера и комбинации",
        body:
          "Главный апгрейд 1.5 Pro по сравнению с 1.0 — расширенный камерный словарь и стабильная работа комбинаций. Теперь надёжно работают: orbit + zoom, follow + push in, crane + pan. Лимит — не более 2 одновременных движений.\n\nКлючевые движения: surround / orbit / wrap around, push in / pull out / zoom in/out, pan left / pan right / slow pan, tracking / follow, handheld, aerial, crane shot, Dutch angle. Camera switching стабильнее 1.0 Pro — переходы между шотами выходят аккуратнее.\n\nПереход фокуса: «The camera focuses on the teacher in the background, the girl in the foreground becomes blurred» — рабочий приём для эмоциональных сцен. Wrap around camera для 360°-показа продукта — типичный e-commerce сценарий.",
      },
    ],
    examples: [
      {
        before: "девушка идёт по улице и улыбается",
        after:
          "Start: a young woman in a beige trench coat walks down a rainy Parisian street, medium shot, soft overcast daylight, reflections on wet cobblestones. Middle: she notices something off camera and slows down, camera pushes in slightly, her expression shifts to gentle curiosity. End: close-up of her face breaking into a quiet smile, golden hour light just starting to cut through the clouds. Cinematic, 35mm lens, film grain, shallow depth of field. Non-fixed camera, 1080p, 16:9, 10s.",
        note:
          "Главное отличие: трёхактная Start / Middle / End раскадровка вместо сплошного описания. Модель видит структуру и распределяет движение во времени. Камера, освещение и эмоция уточняются от акта к акту.",
      },
      {
        before: "продуктовый шот часов на столе, обзор со всех сторон",
        after:
          "Luxury silver chronograph watch on a dark walnut surface, soft three-point studio lighting catches the polished case. Camera slowly orbits around the watch over the first 5 seconds, then pushes in for a close-up of the dial and crown over the remaining 5. Subtle reflections on the sapphire crystal, sharp focus on the watch face, smooth depth of field falloff. Commercial product photography aesthetic. No text. No watermarks. Non-fixed camera, 1080p, 16:9, 10s.",
        note:
          "Orbit + push in — рабочая комбинация двух камерных движений в 1.5 Pro. Базовые negative «No text. No watermarks.» здесь работают надёжно — это простые запреты, не сложные конструкции.",
      },
      {
        before: "анимируй фото пейзажа с горами",
        after:
          "Aerial shot, the mountain landscape gradually reveals itself. Start: wide overview of the snow-capped peaks, clouds slowly drifting from left to right. Middle: camera descends and tilts forward, revealing a glacial lake in the valley below, the lake surface ripples gently. End: camera glides above the lake toward a small wooden cabin on the far shore, golden hour light catching the windows. Cinematic, drone aesthetic, 4K-quality, deep focus. Non-fixed camera, 1080p, 16:9, 10s.",
        note:
          "I2V здесь даёт пейзаж как стартовый кадр, а промпт целиком описывает дальнейшую динамику: что движется (облака, поверхность озера), как движется камера (descend, tilt forward, glide). Без описания движения 1.5 Pro оставит сцену почти статичной.",
      },
    ],
    mistakes: [
      {
        title: "Тайминг по секундам в стиле 2.0",
        explain:
          "«0-3с: X, 4-7с: Y» не работает в 1.5 Pro — точная тайминг-раскадровка появилась только в 2.0. Вместо этого — простая Start / Middle / End раскадровка. Если пользователь привык писать тайминг по секундам, преобразуй в трёхактную структуру.",
      },
      {
        title: "Полный @-синтаксис из 2.0",
        explain:
          "@image1, @image2, @video1, @audio1 не работают в 1.5 Pro. Поддерживается базовый reference на 1–2 изображения без префикса. Если промпт содержит множественные @-теги — модель воспримет их как мусор, и качество резко упадёт.",
      },
      {
        title: "Сложные негативные списки",
        explain:
          "«No text. No watermarks. No motion blur.» — рабочий формат. А вот длинные списки из 10+ запретов или сложные конструкции вроде «no facial hair on a man who has stubble» ломают генерацию. Держи negative коротким и непротиворечивым с основным промптом.",
      },
      {
        title: "Три и больше одновременных камерных движения",
        explain:
          "Orbit + zoom — работает. Orbit + zoom + pan — модель захлёбывается. Лимит 1.5 Pro — две одновременные операции с камерой. Если нужен сложный кадр — разбей на этапы через Start / Middle / End («Start: orbit. Middle: zoom in. End: pan right.»).",
      },
      {
        title: "Запрос звука или диалогов",
        explain:
          "Звуковой контроль появился в 2.0 — в 1.5 Pro его нет. «Add dialogue \"Hello\"», «with epic music», «sound of footsteps» — модель просто игнорирует эти инструкции. Видео получится беззвучным; озвучку добавлять отдельно в монтаже.",
      },
    ],
    faq: [
      {
        q: "Чем 1.5 Pro отличается от 1.0 Pro?",
        a: "Пять заметных апгрейдов: улучшенная физика движений, базовая поддержка negative prompts, простая раскадровка Start / Middle / End, поддержка 1–2 reference-изображений вместо одного, и стабильная работа комбинаций камерных движений (orbit + zoom). При этом фиксированная длительность 5/10 секунд и отсутствие звука остались — это всё ещё первое поколение архитектурно.",
      },
      {
        q: "Чем 1.5 Pro отличается от 2.0?",
        a: "2.0 принёс свободную длительность 4–15 секунд, полный @-синтаксис с множественными референсами, звуковой контроль, разрешение до 2K, тайминг-раскадровку по секундам и эмоциональный реализм через микромимику. 1.5 Pro для всех этих случаев — компромисс. Для серьёзного cinematic — 2.0. Для простых 5–10 секундных шотов — 1.5 Pro быстрее.",
      },
      {
        q: "Можно ли использовать reference-изображение для сохранения персонажа?",
        a: "Базово — да, 1.5 Pro поддерживает 1–2 reference-изображения для сохранения стиля или внешности. Но это не полный Consistency Control как в 2.0. Между разными генерациями персонаж может «дрейфовать» — лицо немного меняется, одежда варьируется. Для production-уровня consistency через несколько клипов — нужна 2.0 с @-референсами.",
      },
      {
        q: "Как использовать Start / Middle / End правильно?",
        a: "Каждый блок описывает: что в кадре, какая камера, какое освещение. Между блоками модель сама строит переходы — не нужно «cut to». Не делай блоки слишком разными — должна быть логическая связь. Хорошо: «Start: medium shot. Middle: camera pushes in. End: close-up.» Плохо: «Start: in a forest. Middle: in space. End: underwater.» — модель сломается на резких сменах локации.",
      },
      {
        q: "Какие негативные промпты точно работают?",
        a: "Стабильно работают простые запреты на уровне атрибутов: «No text», «No watermarks», «No motion blur», «No cartoon style», «No extra limbs». До трёх запретов в строке — нормально. Что НЕ работает: сложные негативы про композицию, длинные списки, негативные описания персонажей, конфликт с позитивной частью промпта.",
      },
      {
        q: "Поддерживается ли продление видео в 1.5 Pro?",
        a: "Нет, Video Extension через @video1 появился только в 2.0. В 1.5 Pro можно получить только независимые 5- или 10-секундные клипы. Если нужно длинное видео — приходится монтировать несколько клипов в видеоредакторе, и continuity между ними не гарантируется. Для бесшовного продления — нужна 2.0.",
      },
      {
        q: "Поддерживается ли Opten для Seedance 1.5 Pro?",
        a: "Да, расширение Opten распознаёт Seedance 1.5 Pro внутри syntx.ai и оценивает промпт по структуре промежуточного поколения: проверяет Start / Middle / End раскадровку, корректность базовых negative prompts, отсутствие неработающего @-синтаксиса 2.0, лимит на одновременные камерные движения, отсутствие звуковых инструкций. Одним кликом получишь rewrite, адаптированный именно под 1.5 Pro.",
      },
    ],
  },
  en: {
    title: "Seedance 1.5 Pro Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for ByteDance's Seedance 1.5 Pro: simple Start/Middle/End storyboard, basic negatives, extended camera vocabulary, and examples.",
    h1: "Seedance 1.5 Pro: how to write prompts the model actually understands",
    intro:
      "Seedance 1.5 Pro is ByteDance's intermediate video model between generations 1.0 and 2.0. It produces 5 or 10 second clips up to 1080p and accepts text plus 1–2 images. It introduced basic negative-prompt support, a simple Start / Middle / End storyboard, and an extended camera vocabulary — without the full @-references or sound control of 2.0.",
    sections: [
      {
        heading: "Where 1.5 Pro sits in the line",
        body:
          "1.5 Pro is «1.0 on steroids»: the same fixed 5/10 second duration, the same missing sound, but noticeably improved motion physics, better prompt adherence, and basic support for reference images (1–2) to preserve style.\n\nKey difference from 1.0 Pro: a simple storyboard («Start / Middle / End») arrived along with basic negative-prompt support for simple bans. The camera vocabulary is broader — combinations like orbit + zoom now work reliably (cap of two simultaneous moves).\n\nWhat separates it from 2.0: no second-by-second storyboarding, no full @-syntax with multiple references, no sound control, resolution capped at 1080p (2.0 goes up to 2K).",
        bullets: [
          "Duration 5 or 10 seconds (same as 1.0)",
          "Resolution up to 1080p, 24fps",
          "Input: text + 1–2 images (basic reference)",
          "Simple Start / Middle / End storyboard",
          "Basic negative prompts work, complex ones don't",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Base formula is the same as 1.0 Pro: `[Subject] + [Action] + [Scene] + [Camera] + [Style]`. But 1.5 Pro handles detail better — you can safely flesh out appearance, materials, and lighting in greater depth.\n\nFor Text-to-Video: «Subject + Motion + Scene + Camera + Style/Mood». For Image-to-Video: «Subject + Motion, Background + Motion, Camera + Motion + Style». Base parameters at the end: «Non-fixed camera, 1080p, 16:9, 10s».\n\nFor 10-second videos use the simple storyboard — this is a 1.5 strength: «Start: woman sits at a café table, reading a book. Medium shot. Middle: she looks up, sees someone, smiles. Camera slowly zooms in. End: close-up of her face, warm smile, golden hour light.»",
      },
      {
        heading: "Simple Start / Middle / End storyboard",
        body:
          "1.5 Pro introduces a three-act structure without hard per-second timing. It gives baseline narrative control without the complexity of 2.0.\n\nEach block describes: what is in frame, what the camera does, what the lighting is. The model handles transitions between blocks — no need to spell out «cut to» or «camera switching».\n\nExample: «Start: detective sits at his desk, dim light, medium shot. Middle: phone rings, he picks it up, camera slowly pushes in. End: close-up of his eyes widening as he hears the news, warm desk lamp catches one side of his face.» This is more reliable than a single paragraph — the model sees a three-act shape and distributes motion across time meaningfully.",
      },
      {
        heading: "Basic negative prompts",
        body:
          "1.5 Pro accepts simple bans — but not complex constructions. What works: «No text, no watermarks», «No cartoon style», «No blurry details». What doesn't: long negative lists, negative character descriptions, contradictory constraints.\n\nBest approach: phrase as much as possible positively («photorealistic», «sharp focus», «cinematic») and reserve negatives for basic exclusions only. A handful of simple bans in one line: «No text. No watermarks. No motion blur.» — workable format.\n\nConflict between the negative and the main prompt is an anti-pattern. If the prompt says «detective with a mustache» and the negative says «no facial hair», the model breaks. Make the prompt self-consistent first, then add the negative.",
      },
      {
        heading: "Extended camera vocabulary and combinations",
        body:
          "The main 1.5 Pro upgrade over 1.0 is the extended camera vocabulary and reliable combinations. These now work consistently: orbit + zoom, follow + push in, crane + pan. The cap is two simultaneous moves.\n\nKey moves: surround / orbit / wrap around, push in / pull out / zoom in/out, pan left / pan right / slow pan, tracking / follow, handheld, aerial, crane shot, Dutch angle. Camera switching is more stable than in 1.0 Pro — cuts between shots come out cleaner.\n\nFocus transition: «The camera focuses on the teacher in the background, the girl in the foreground becomes blurred» — a working trick for emotional scenes. Wrap around camera for a 360° product reveal is the canonical e-commerce shot.",
      },
    ],
    examples: [
      {
        before: "girl walking down a street and smiling",
        after:
          "Start: a young woman in a beige trench coat walks down a rainy Parisian street, medium shot, soft overcast daylight, reflections on wet cobblestones. Middle: she notices something off camera and slows down, camera pushes in slightly, her expression shifts to gentle curiosity. End: close-up of her face breaking into a quiet smile, golden hour light just starting to cut through the clouds. Cinematic, 35mm lens, film grain, shallow depth of field. Non-fixed camera, 1080p, 16:9, 10s.",
        note:
          "Key change: three-act Start / Middle / End storyboard instead of a single description. The model sees structure and distributes motion across time. Camera, lighting, and emotion sharpen from act to act.",
      },
      {
        before: "product shot of a watch on a table, view from all angles",
        after:
          "Luxury silver chronograph watch on a dark walnut surface, soft three-point studio lighting catches the polished case. Camera slowly orbits around the watch over the first 5 seconds, then pushes in for a close-up of the dial and crown over the remaining 5. Subtle reflections on the sapphire crystal, sharp focus on the watch face, smooth depth of field falloff. Commercial product photography aesthetic. No text. No watermarks. Non-fixed camera, 1080p, 16:9, 10s.",
        note:
          "Orbit + push in is a working two-move combo in 1.5 Pro. Basic negatives «No text. No watermarks.» work reliably here — these are simple bans, not complex constructions.",
      },
      {
        before: "animate this landscape photo with mountains",
        after:
          "Aerial shot, the mountain landscape gradually reveals itself. Start: wide overview of the snow-capped peaks, clouds slowly drifting from left to right. Middle: camera descends and tilts forward, revealing a glacial lake in the valley below, the lake surface ripples gently. End: camera glides above the lake toward a small wooden cabin on the far shore, golden hour light catching the windows. Cinematic, drone aesthetic, 4K-quality, deep focus. Non-fixed camera, 1080p, 16:9, 10s.",
        note:
          "I2V here uses the landscape as the opening frame, and the prompt fully describes the dynamics: what moves (clouds, lake surface), how the camera moves (descend, tilt forward, glide). Without a motion description 1.5 Pro will leave the scene almost static.",
      },
    ],
    mistakes: [
      {
        title: "Per-second timing in 2.0 style",
        explain:
          "«0-3s: X, 4-7s: Y» does not work in 1.5 Pro — precise timestamp storyboarding only arrived in 2.0. Use a simple Start / Middle / End storyboard instead. If a user is used to per-second timing, convert it to the three-act shape.",
      },
      {
        title: "Full @-syntax from 2.0",
        explain:
          "@image1, @image2, @video1, @audio1 do not work in 1.5 Pro. Basic reference on 1–2 images without a prefix is supported. A prompt with multiple @-tags leaks the tokens into the text as garbage and quality drops sharply.",
      },
      {
        title: "Complex negative lists",
        explain:
          "«No text. No watermarks. No motion blur.» is the working format. Long lists of 10+ bans or complex constructions like «no facial hair on a man who has stubble» break generation. Keep the negative short and non-contradictory with the main prompt.",
      },
      {
        title: "Three or more simultaneous camera moves",
        explain:
          "Orbit + zoom — works. Orbit + zoom + pan — the model chokes. The 1.5 Pro cap is two simultaneous camera operations. If you need a complex shot, split it across acts via Start / Middle / End («Start: orbit. Middle: zoom in. End: pan right.»).",
      },
      {
        title: "Asking for sound or dialogue",
        explain:
          "Sound control arrived in 2.0 — 1.5 Pro doesn't have it. «Add dialogue \"Hello\"», «with epic music», «sound of footsteps» — the model simply ignores these. The clip will be silent; add audio separately in post.",
      },
    ],
    faq: [
      {
        q: "How is 1.5 Pro different from 1.0 Pro?",
        a: "Five noticeable upgrades: improved motion physics, basic negative-prompt support, simple Start / Middle / End storyboard, support for 1–2 reference images instead of just one, and reliable camera-move combinations (orbit + zoom). The fixed 5/10 second duration and absent sound remain — it's still first-generation architecturally.",
      },
      {
        q: "How is 1.5 Pro different from 2.0?",
        a: "2.0 brought free duration 4–15 seconds, full @-syntax with multiple references, sound control, resolution up to 2K, second-precise storyboarding, and emotional realism through micro-acting. For all of these 1.5 Pro is a compromise. For serious cinematic work — use 2.0. For simple 5–10 second shots — 1.5 Pro is faster.",
      },
      {
        q: "Can I use a reference image to preserve a character?",
        a: "Basically — yes, 1.5 Pro supports 1–2 reference images for style or appearance preservation. But this is not full Consistency Control like in 2.0. The character can drift between generations — face shifts slightly, wardrobe varies. For production-grade consistency across multiple clips — you need 2.0 with @-references.",
      },
      {
        q: "How do I use Start / Middle / End correctly?",
        a: "Each block describes: what is in frame, what the camera does, what the lighting is. The model handles transitions — no «cut to» needed. Don't make blocks too different — there must be a logical link. Good: «Start: medium shot. Middle: camera pushes in. End: close-up.» Bad: «Start: in a forest. Middle: in space. End: underwater.» — the model breaks on hard location swaps.",
      },
      {
        q: "Which negative prompts definitely work?",
        a: "Simple attribute-level bans work consistently: «No text», «No watermarks», «No motion blur», «No cartoon style», «No extra limbs». Up to three bans in a line is fine. What does NOT work: complex composition negatives, long lists, negative character descriptions, conflict with the positive part of the prompt.",
      },
      {
        q: "Is video extension supported in 1.5 Pro?",
        a: "No, Video Extension via @video1 only arrived in 2.0. 1.5 Pro produces only independent 5- or 10-second clips. For long video you have to edit multiple clips together in a video editor, and continuity between them is not guaranteed. For seamless extension — you need 2.0.",
      },
      {
        q: "Does Opten support Seedance 1.5 Pro?",
        a: "Yes, the Opten extension detects Seedance 1.5 Pro inside syntx.ai and scores prompts against the intermediate-generation structure: it checks the Start / Middle / End storyboard, basic negative-prompt validity, the absence of non-working 2.0 @-syntax, the simultaneous-camera-move cap, and the absence of sound instructions. One click gives you a rewrite tailored to what 1.5 Pro actually does.",
      },
    ],
  },
};
