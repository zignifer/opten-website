// Phase v2.0 MODELS-B-1 (agent batch 5): generated content for reve.
import type { ModelContent } from "./types";

export const content: ModelContent = {
  ru: {
    title: "Промпты для Reve Image: структура, ошибки, примеры",
    description:
      "Как писать промпты для Reve Image 1.0: фотографический стиль, 98% точности текста, гиперреалистичные портреты, multi-reference, типичные ошибки и примеры.",
    h1: "Reve Image: как писать промпты, которые модель понимает",
    intro:
      "Reve Image 1.0 — image-модель от Reve AI с 12 миллиардами параметров, нативным 2048×2048 и 4K upscaling. #1 на Artificial Analysis Image Arena (ELO 1167) — выше Midjourney v6.1, Imagen 3, Flux Pro 1.1 и Recraft V3. Сильнейшая верность промпту, 98% точность текста, гиперреалистичные портреты. Полные коммерческие права.",
    sections: [
      {
        heading: "Что умеет Reve Image",
        body:
          "Главная сила Reve — исключительная верность промпту: модель строит ровно то, что описано, без «творческих переосмыслений». Это редкое свойство — большинство топовых моделей добавляют от себя композицию, освещение, мелкие детали. Reve следует промпту буквально.\n\nВторая фича — проприетарный Typography Engine, обученный на 50M font samples: 98% точности текста, что выше любого конкурента. Третья — гиперреалистичные портреты, особенно сильны с разнообразными этническими чертами и celebrity likeness. Четвёртая — полные коммерческие права на всё output, без ограничений.\n\nДоступна на двух платформах: preview.reve.art (официальная) и Higgsfield (unlimited generations на подписке). Архитектура — Hybrid Diffusion с relational attention.",
        bullets: [
          "12B параметров, нативные 2048×2048, 4K upscaling (4096×4096)",
          "#1 на Artificial Analysis Image Arena (ELO 1167)",
          "98% точность текста через Typography Engine",
          "Исключительная верность промпту — строит ровно описанное",
          "Полные коммерческие права на output",
        ],
      },
      {
        heading: "Структура промпта",
        body:
          "Фотографический стиль промптинга работает лучше всего. Базовая формула: [Photographic framing] + [Subject with details] + [Lighting/atmosphere] + [Texture/materials] + [Camera/lens hints].\n\nНачинай с чёткого фотографического кадрирования: «A high-resolution, photorealistic studio portrait, captured with shallow depth of field...». Это сразу задаёт композицию и качество. Дальше — субъект с конкретными деталями, освещение и атмосфера, текстуры и материалы, фотографические подсказки по камере.\n\nReve хорошо понимает фотографический язык: «shift focus to the man», «render as if shot at 1.8 f-stop», «captured at 85mm». Это не декорация — модель действительно учитывает эти параметры в композиции и фокусе.",
      },
      {
        heading: "Фотографический язык",
        body:
          "Камера: studio portrait, shallow DoF, 1.8 f-stop, 85mm, wide-angle, macro. Освещение: warm side light, foggy dusk, golden hour, studio softbox, rim light, hard flash. Текстуры: skin pores, fabric weave, weathered wood, brushed metal, frosted glass. Настроение: cinematic, editorial, intimate, dramatic, serene, melancholic.\n\nЭти термины Reve обрабатывает как реальный фотограф — каждый параметр влияет на финальный кадр. Конкретные «warm side light, foggy dusk atmosphere» даёт совсем другой результат, чем «nice lighting». Чем точнее язык, тем точнее результат — это сильная сторона именно Reve.",
      },
      {
        heading: "Текст и Typography Engine",
        body:
          "Typography Engine с 50M font samples даёт 98% точности — это лучший показатель в индустрии. Для рендеринга текста указывай его явно в промпте: «A storefront sign reading \"Bloom & Co\" in serif gold lettering». Чем конкретнее тип шрифта, цвет и расположение, тем стабильнее результат.\n\nДля брендинга и упаковки это решающая фича: можно генерировать постеры, вывески, этикетки с production-уровнем текста без отдельного typography-этапа. Поддерживается латиница, цифры, основные европейские диакритики. Для CJK и арабского лучше Qwen Image или GPT Image 2.",
      },
      {
        heading: "Multi-reference и I2I",
        body:
          "Reve поддерживает T2I, I2I (style matching), multi-reference (2–3 изображения) и sketch-to-image. Multi-reference — мощный инструмент для стилевого совмещения: подгружаешь 2–3 источника и в промпте описываешь, как их совместить.\n\nAspect ratios: 3:2, 16:9, максимум 2560px по длинной стороне. Sketch-to-image превращает рисунок в готовое изображение, сохраняя композицию sketch'а — полезно для концепт-арта и продукт-дизайна.\n\nCelebrity likeness поддерживается и не блокируется, в отличие от OpenAI. Это даёт свободу для editorial-фотографии, но требует ответственного использования — коммерческое использование celebrity likeness обычно требует разрешения от самого лица.",
      },
    ],
    examples: [
      {
        before:
          "красивый портрет девушки в студии",
        after:
          "A high-resolution, photorealistic studio portrait of a young woman with auburn hair and soft freckles, captured with shallow depth of field. Warm side light from camera left, soft falloff into deep shadow on the right cheek. Visible skin texture, fine pores, natural makeup. Cream linen background, gentle bokeh. Shot at 85mm, f/1.8, intimate framing from collarbone up.",
        note: "Фотографический язык во всём: «studio portrait», «shallow DoF», «85mm, f/1.8», «warm side light». Конкретные текстуры (skin pores, fine pores), материалы (cream linen). Это сильная сторона именно Reve — фотореализм без AI-look.",
      },
      {
        before:
          "вывеска кофейни с надписью Bloom & Co",
        after:
          "A photorealistic storefront facade at golden hour. Vintage cafe with a glass door and a wooden window frame. Brass storefront sign mounted above the door (EXACT text): \"Bloom & Co\" in elegant serif gold lettering with subtle aging patina. Soft warm light spilling from inside, slight reflections on the glass. Captured at 35mm, slight low angle, cinematic warm color palette.",
        note: "Точный текст в кавычках с EXACT, указан шрифт (serif gold), материал (brass with patina), фотографические параметры (35mm, low angle). Typography Engine даст 98% точности на текст «Bloom & Co».",
      },
      {
        before:
          "продуктовое фото бутылки парфюма",
        after:
          "Macro product photography of a frosted glass perfume bottle on a polished marble surface. Side light from a softbox at camera left, subtle rim light highlighting the bottle's curve. Visible frosted glass texture, brushed gold cap, single drop of condensation on the bottle's shoulder. Shallow depth of field, focus on the cap engraving. Cream background gradient, editorial composition.",
        note: "«Macro product photography» сразу задаёт жанр, конкретные материалы (frosted glass, polished marble, brushed gold), указание элементов в фокусе (cap engraving), композиционные термины (editorial). Reve строит ровно это.",
      },
    ],
    mistakes: [
      {
        title: "Минималистичный промпт для коммерческой работы",
        explain:
          "Reve справляется и с короткими промптами благодаря сильному inference, но для коммерческого результата конкретика всегда даёт лучший результат. «A portrait of a woman» сгенерирует что-то приличное, но «A photorealistic studio portrait of a woman with auburn hair, captured at 85mm f/1.8, warm side light» даёт production-уровень за одну итерацию.",
      },
      {
        title: "Сложные прозрачные объекты",
        explain:
          "Полный бокал вина, кристаллы, стеклянные структуры с множеством преломлений — слабая сторона Reve. Модель может неправильно отрендерить оптику жидкости и поверхностей. Если задача требует сложного стекла, либо упрощай сцену (пустой бокал), либо комбинируй с другой моделью на финальной стадии.",
      },
      {
        title: "Конкретные вымышленные персонажи",
        explain:
          "«Mario from Mario Bros», «Pikachu», «character from Fortnite» — Reve обычно даёт generic результат, потому что не знает всех franchise. Celebrity likeness работает хорошо (Reve обучена на реальных лицах), но узнаваемые IP-персонажи — слабее. Для franchise-контента описывай персонажа физически, не по имени.",
      },
      {
        title: "Multi-object compositions",
        explain:
          "Сцены с 5+ объектами и сложным расположением Reve может рендерить с неправильными пространственными отношениями. Сильная сторона модели — простые центрированные сцены с одним главным субъектом. Для сложных композиций либо упрощай, либо используй ControlNet через другую модель и затем переноси стиль на Reve через I2I.",
      },
      {
        title: "Оценочные прилагательные вместо описаний",
        explain:
          "«Beautiful», «stunning», «amazing» — это шум для Reve. Модель ценит фотографическую точность выше эмоциональных оценок. Замени «beautiful portrait» на «studio portrait with warm side light and shallow DoF, captured at 85mm». Это даст конкретный кадр вместо случайного «красивого» результата.",
      },
    ],
    faq: [
      {
        q: "Чем Reve отличается от Midjourney и Flux?",
        a: "Reve — #1 на Artificial Analysis Image Arena (ELO 1167), выше всех топовых моделей. Главное отличие — исключительная верность промпту: Reve строит ровно описанное, без «творческих переосмыслений», которые делают Midjourney. По точности текста (98% через Typography Engine) Reve обходит большинство конкурентов. Полные коммерческие права — преимущество над Midjourney с ограничениями.",
      },
      {
        q: "Какое разрешение и aspect ratios доступны?",
        a: "Нативное 2048×2048 с upscaling до 4K (4096×4096). Aspect ratios: 3:2, 16:9, максимум 2560px по длинной стороне. Для печатных материалов 4K upscaling даёт production-уровень разрешения. Если нужны нестандартные пропорции (квадрат 1:1, экстремальный widescreen 21:9) — проверяй документацию платформы, поддержка варьируется.",
      },
      {
        q: "Где можно использовать Reve?",
        a: "Две основные платформы: preview.reve.art — официальный preview от Reve AI (Palo Alto, ex-Google Brain и NVIDIA), и Higgsfield (higgsfield.ai) — с unlimited generations на подписке. Higgsfield обычно выгоднее для активной работы, preview.reve.art — для тестирования и официального API доступа.",
      },
      {
        q: "Поддерживается ли celebrity likeness?",
        a: "Да, Reve генерирует узнаваемые лица без блокировок, в отличие от OpenAI (где celebrity likeness в GPT Image 2 заблокирован политикой). Это даёт свободу для editorial-фотографии и концепт-арта. При коммерческом использовании обычно требуется разрешение от самого лица — это юридическое требование, не техническое ограничение модели.",
      },
      {
        q: "Какие коммерческие права у Reve?",
        a: "Полные коммерческие права на всё output без ограничений. Можно использовать в коммерческих продуктах, продавать сгенерированный контент, встраивать в paid services. Это конкурентное преимущество над Midjourney (где коммерческое использование требует Pro-подписки) и Stability AI моделями (где лицензии варьируются по версии).",
      },
      {
        q: "Как использовать multi-reference?",
        a: "Multi-reference принимает 2–3 изображения как источники стиля или композиции. В промпте описываешь, как их совместить: «Style of reference 1, subject from reference 2, lighting from reference 3». Это мощный инструмент для брендового контента — можно зафиксировать визуальный язык компании через 2–3 reference и генерировать новые материалы в том же стиле.",
      },
      {
        q: "Поддерживается ли Opten для Reve Image?",
        a: "Да, расширение Opten распознаёт Reve внутри preview.reve.art и higgsfield.ai. Оценивает промпты по структуре, специфичной для модели: проверяет наличие фотографического кадрирования, точного текста в кавычках, конкретики текстур и материалов, отсутствие оценочных прилагательных вместо описаний. Одним кликом можно получить rewrite с правильной фотографической структурой.",
      },
    ],
  },
  en: {
    title: "Reve Image Prompts: Structure, Mistakes, Examples",
    description:
      "How to write prompts for Reve Image 1.0: photographic style, 98% text accuracy, hyperrealistic portraits, multi-reference, common mistakes and examples.",
    h1: "Reve Image: how to write prompts the model actually understands",
    intro:
      "Reve Image 1.0 is an image model from Reve AI with 12 billion parameters, native 2048×2048, and 4K upscaling. It's #1 on Artificial Analysis Image Arena (ELO 1167) — above Midjourney v6.1, Imagen 3, Flux Pro 1.1, and Recraft V3. Strongest prompt fidelity, 98% text accuracy, hyperrealistic portraits. Full commercial rights.",
    sections: [
      {
        heading: "What Reve Image does well",
        body:
          "Reve's core strength is exceptional prompt fidelity: the model builds exactly what's described, without «creative reinterpretation». That's a rare property — most top models add their own composition, lighting, and incidental details. Reve follows the prompt literally.\n\nSecond feature: a proprietary Typography Engine trained on 50M font samples, delivering 98% text accuracy — higher than any competitor. Third: hyperrealistic portraits, especially strong with diverse ethnic features and celebrity likeness. Fourth: full commercial rights on all output, no restrictions.\n\nAvailable on two platforms: preview.reve.art (official) and Higgsfield (unlimited generations on subscription). Architecture: Hybrid Diffusion with relational attention.",
        bullets: [
          "12B parameters, native 2048×2048, 4K upscaling (4096×4096)",
          "#1 on Artificial Analysis Image Arena (ELO 1167)",
          "98% text accuracy via Typography Engine",
          "Exceptional prompt fidelity — builds exactly what you describe",
          "Full commercial rights on output",
        ],
      },
      {
        heading: "Prompt structure",
        body:
          "Photographic-style prompting works best. Base formula: [Photographic framing] + [Subject with details] + [Lighting/atmosphere] + [Texture/materials] + [Camera/lens hints].\n\nLead with clear photographic framing: «A high-resolution, photorealistic studio portrait, captured with shallow depth of field...». That locks composition and quality immediately. Then subject with concrete detail, lighting and atmosphere, textures and materials, photographic hints about the camera.\n\nReve understands photography language well: «shift focus to the man», «render as if shot at 1.8 f-stop», «captured at 85mm». These aren't decoration — the model actually factors them into composition and focus.",
      },
      {
        heading: "Photography language",
        body:
          "Camera: studio portrait, shallow DoF, 1.8 f-stop, 85mm, wide-angle, macro. Lighting: warm side light, foggy dusk, golden hour, studio softbox, rim light, hard flash. Textures: skin pores, fabric weave, weathered wood, brushed metal, frosted glass. Mood: cinematic, editorial, intimate, dramatic, serene, melancholic.\n\nReve processes these terms like a real photographer — every parameter influences the final frame. Specific «warm side light, foggy dusk atmosphere» yields a very different result than «nice lighting». The more precise the language, the more precise the result — that's a Reve strength.",
      },
      {
        heading: "Text and the Typography Engine",
        body:
          "The Typography Engine with 50M font samples delivers 98% accuracy — the best in the industry. To render text, specify it explicitly in the prompt: «A storefront sign reading \"Bloom & Co\" in serif gold lettering». The more specific the font type, color, and placement, the more stable the result.\n\nFor branding and packaging this is a deciding feature: you can generate posters, signage, and labels with production-grade text in a single pass, no separate typography step. Latin, digits, and main European diacritics are supported. For CJK and Arabic, Qwen Image or GPT Image 2 are stronger.",
      },
      {
        heading: "Multi-reference and I2I",
        body:
          "Reve supports T2I, I2I (style matching), multi-reference (2–3 images), and sketch-to-image. Multi-reference is a powerful tool for style blending: upload 2–3 sources and describe in the prompt how to combine them.\n\nAspect ratios: 3:2, 16:9, max 2560px on the long side. Sketch-to-image turns a sketch into a finished image while preserving the sketch's composition — useful for concept art and product design.\n\nCelebrity likeness is supported and not blocked, unlike OpenAI. This grants editorial freedom but demands responsible use — commercial use of celebrity likeness typically requires permission from the person.",
      },
    ],
    examples: [
      {
        before: "beautiful portrait of a girl in a studio",
        after:
          "A high-resolution, photorealistic studio portrait of a young woman with auburn hair and soft freckles, captured with shallow depth of field. Warm side light from camera left, soft falloff into deep shadow on the right cheek. Visible skin texture, fine pores, natural makeup. Cream linen background, gentle bokeh. Shot at 85mm, f/1.8, intimate framing from collarbone up.",
        note: "Photography language throughout: «studio portrait», «shallow DoF», «85mm, f/1.8», «warm side light». Concrete textures (skin pores, fine pores), materials (cream linen). This is a Reve strength — photorealism without the AI look.",
      },
      {
        before: "coffee shop sign with the words Bloom & Co",
        after:
          "A photorealistic storefront facade at golden hour. Vintage cafe with a glass door and a wooden window frame. Brass storefront sign mounted above the door (EXACT text): \"Bloom & Co\" in elegant serif gold lettering with subtle aging patina. Soft warm light spilling from inside, slight reflections on the glass. Captured at 35mm, slight low angle, cinematic warm color palette.",
        note: "Exact text in quotes with EXACT marker, font specified (serif gold), material (brass with patina), photography parameters (35mm, low angle). The Typography Engine yields 98% accuracy on «Bloom & Co».",
      },
      {
        before: "product shot of a perfume bottle",
        after:
          "Macro product photography of a frosted glass perfume bottle on a polished marble surface. Side light from a softbox at camera left, subtle rim light highlighting the bottle's curve. Visible frosted glass texture, brushed gold cap, single drop of condensation on the bottle's shoulder. Shallow depth of field, focus on the cap engraving. Cream background gradient, editorial composition.",
        note: "«Macro product photography» locks the genre, concrete materials (frosted glass, polished marble, brushed gold), focus elements specified (cap engraving), compositional terms (editorial). Reve builds exactly that.",
      },
    ],
    mistakes: [
      {
        title: "Minimal prompts for commercial work",
        explain:
          "Reve handles short prompts well thanks to strong inference, but for commercial results specificity always wins. «A portrait of a woman» yields something decent; «A photorealistic studio portrait of a woman with auburn hair, captured at 85mm f/1.8, warm side light» yields production grade in one iteration.",
      },
      {
        title: "Complex transparent objects",
        explain:
          "A full wine glass, crystals, glass structures with many refractions — Reve's weak spot. The model can render the optics of liquid and surfaces incorrectly. If the task demands complex glass, either simplify the scene (empty glass) or combine Reve with another model at the final stage.",
      },
      {
        title: "Specific fictional characters",
        explain:
          "«Mario from Mario Bros», «Pikachu», «character from Fortnite» — Reve usually yields generic results because it doesn't know every franchise. Celebrity likeness works well (Reve was trained on real faces), but recognizable IP characters are weaker. For franchise content, describe the character physically rather than by name.",
      },
      {
        title: "Multi-object compositions",
        explain:
          "Scenes with 5+ objects and complex placement can come out with wrong spatial relations on Reve. The model's strength is simple centered scenes with one main subject. For complex compositions, either simplify or use ControlNet via another model and then transfer the style to Reve via I2I.",
      },
      {
        title: "Evaluative adjectives instead of descriptions",
        explain:
          "«Beautiful», «stunning», «amazing» are noise for Reve. The model values photographic precision over emotional adjectives. Replace «beautiful portrait» with «studio portrait with warm side light and shallow DoF, captured at 85mm». That gives a concrete frame instead of a random «beautiful» result.",
      },
    ],
    faq: [
      {
        q: "How does Reve differ from Midjourney and Flux?",
        a: "Reve is #1 on Artificial Analysis Image Arena (ELO 1167), above every top model. The key difference is exceptional prompt fidelity: Reve builds exactly what's described, without the «creative reinterpretation» that Midjourney does. On text accuracy (98% via Typography Engine) Reve beats most competitors. Full commercial rights are an advantage over Midjourney's restrictions.",
      },
      {
        q: "What resolutions and aspect ratios are available?",
        a: "Native 2048×2048 with upscaling to 4K (4096×4096). Aspect ratios: 3:2, 16:9, max 2560px on the long side. For print materials, 4K upscaling delivers production-grade resolution. If you need non-standard ratios (1:1 square, extreme 21:9 widescreen), check the platform docs — support varies.",
      },
      {
        q: "Where can I use Reve?",
        a: "Two main platforms: preview.reve.art — the official preview from Reve AI (Palo Alto, ex-Google Brain and NVIDIA), and Higgsfield (higgsfield.ai) — with unlimited generations on subscription. Higgsfield is usually better value for active work; preview.reve.art is for testing and official API access.",
      },
      {
        q: "Is celebrity likeness supported?",
        a: "Yes, Reve generates recognizable faces without blocks, unlike OpenAI (where celebrity likeness in GPT Image 2 is policy-blocked). This grants freedom for editorial photography and concept art. For commercial use, permission from the person is typically required — that's a legal requirement, not a technical limit of the model.",
      },
      {
        q: "What are Reve's commercial rights?",
        a: "Full commercial rights on all output, no restrictions. You can use it in commercial products, sell generated content, embed it in paid services. This is a competitive edge over Midjourney (where commercial use requires Pro subscription) and Stability AI models (where licenses vary by version).",
      },
      {
        q: "How do I use multi-reference?",
        a: "Multi-reference accepts 2–3 images as sources of style or composition. In the prompt you describe how to combine them: «Style of reference 1, subject from reference 2, lighting from reference 3». This is a powerful tool for brand content — you can lock a company's visual language via 2–3 references and generate new materials in the same style.",
      },
      {
        q: "Does Opten support Reve Image?",
        a: "Yes, the Opten extension recognizes Reve inside preview.reve.art and higgsfield.ai. It scores prompts against the model-specific structure: checks for photographic framing, exact text in quotes, concrete textures and materials, and the absence of evaluative adjectives in place of descriptions. One click yields a rewrite in the proper photographic structure.",
      },
    ],
  },
};
