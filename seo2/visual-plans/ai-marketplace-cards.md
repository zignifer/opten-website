# Visual plan: ai-marketplace-cards

## Art direction

- **Series concept:** a product-card production desk built around one fictional, unbranded matte dark-green insulated bottle. The same bottle, lid geometry, olive finish, small white capacity mark, and stainless rim recur across every frame.
- **Medium/materials:** cinematic product photography mixed with flat editorial diagram lines integrated into the photographed scene. Real brushed steel, matte powder coating, dark paper, glass, and soft studio haze.
- **Background and light:** deep teal-black `#011417`, low-key studio lighting, one cool rim light and a restrained soft glow. Lime accents are exactly `#9CFB51`.
- **Texture:** subtle film grain and light falloff; no glossy 3D dashboard treatment.
- **Typography:** every visible word is rendered in the generated raster in Bebas Neue, condensed uppercase display sans-serif with tall narrow letters. Text stays flat and printed/integrated, never extruded, embossed, metallic, or added in post.
- Typography treatment: flat printed Bebas Neue integrated into the raster; never extruded, embossed, metallic, or added in post.
- Card/grid frames: 1
- **Line language:** thin 3 px lime measurement lines, right-angle corner brackets, small circular nodes, and sparse arrows. One continuous visual system across the series.
- **Recurring motif:** the bottle is treated as the locked source of truth; lime lines connect product evidence to the next production decision.
- **Continuity:** preserve the bottle identity, palette, flat Bebas Neue text treatment, line thickness, cool key light, warm product edge, grain, and dark workbench atmosphere. Change the layout, camera, and composition archetype between frames.

## Cover

- **Story beat:** AI helps turn one honest source photo into a complete marketplace content set.
- **Visual proof:** the same unbranded bottle appears as the hero object on a dark product-photography table, surrounded by a camera, two reference prints, softbox reflections, and a blank product-card board.
- **Composition:** cinematic wide hero, bottle slightly right of center, shallow perspective, negative space on the left, no UI.
- **Text mode:** none.
- **Semantic job:** instantly signals product photography and marketplace production without pretending to show a real seller dashboard.
- **Generation prompt:** Minimal cinematic dark product-photography studio, deep teal-black background `#011417`, exact lime-green `#9CFB51` edge light and thin graphic accents, one fictional unbranded matte dark-green insulated bottle with stainless rim and small white capacity mark, product camera, two reference prints, softbox reflection, blank product-card board, premium but practical ecommerce production atmosphere, wide 16:9, no text, no logos, no marketplace UI, no score indicator, no watermark.

## Frame 1: lock the product

- **Story beat:** start from real source material and lock the product identity before changing the scene.
- Visual proof: one large bottle is surrounded by three measurement callouts pointing to its lid geometry, body color, and printed mark.
- Composition: anatomy / single hero object with callouts.
- **RU text:** `ЗАФИКСИРУЙ ТОВАР`; callouts `ФОРМА`, `ЦВЕТ`, `МАРКИРОВКА`.
- **EN text:** `LOCK THE PRODUCT`; callouts `SHAPE`, `COLOR`, `MARKINGS`.
- Text mode: annotated-explainer
- Style continuity: this RU frame is the style anchor for the series. It defines flat Bebas Neue typography, lime line weight, lighting, grain, bottle identity, and color grading.
- **Semantic job:** shows which visual properties must survive generation or editing.

## Frame 2: build a four-shot set

- **Story beat:** a useful marketplace card is a sequence, not one overloaded image.
- Visual proof: four distinct camera moments of the same bottle run along one production timeline: hero, lid detail, hand-held scale, and use on a desk.
- Composition: horizontal sequence / contact sheet timeline.
- **RU text:** `СЕРИЯ ИЗ 4 КАДРОВ`; labels `ГЛАВНЫЙ`, `ДЕТАЛЬ`, `МАСШТАБ`, `СЦЕНАРИЙ`.
- **EN text:** `4-SHOT PRODUCT SET`; labels `HERO`, `DETAIL`, `SCALE`, `USE`.
- Text mode: sequence
- Style continuity: inherit the style anchor's medium, color grading, typography physics, bottle identity, line weight, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** makes the role of every image in the card series visible at a glance.

## Frame 3: write copy from facts

- **Story beat:** turn verified product data into useful copy without inventing claims.
- Visual proof: a physical specification tag travels through one lime arrow into a proof checkpoint, then into a clean product-card caption beside the bottle.
- Composition: decision flow / left-to-right transformation.
- **RU text:** `ТЕКСТ ИЗ ФАКТОВ`; sequence `ХАРАКТЕРИСТИКА → ПРОВЕРКА → ПОЛЬЗА`.
- **EN text:** `COPY FROM FACTS`; sequence `SPEC → PROOF → BENEFIT`.
- Text mode: sequence
- Style continuity: inherit the style anchor's medium, color grading, flat Bebas Neue treatment, bottle identity, line weight, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** separates persuasive writing from unsupported product invention.

## Frame 4: pre-publication check

- **Story beat:** review identity, readability, and marketplace rules before upload.
- Visual proof: an overhead inspection desk with the bottle photo under a magnifier, a text crop, and one compact checklist connected to a final publish gate.
- Composition: top-down inspection station / checklist matrix.
- **RU text:** `ПРОВЕРЬ ПЕРЕД ПУБЛИКАЦИЕЙ`; checks `ТОВАР ТОТ ЖЕ`, `ТЕКСТ ЧИТАЕТСЯ`, `ПРАВИЛА СОБЛЮДЕНЫ`.
- **EN text:** `CHECK BEFORE PUBLISHING`; checks `PRODUCT MATCHES`, `TEXT IS CLEAR`, `RULES PASS`.
- Text mode: annotated-explainer
- Style continuity: inherit the style anchor's medium, color grading, flat Bebas Neue treatment, bottle identity, line weight, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** turns the final review into a concrete three-part gate rather than a decorative ending.

## Pairing and production rules

1. Generate the cover separately without text.
2. Generate RU frame 1 with `seo2/Reference/bebas-neue-font-reference.png` as the only initial reference and inspect the exact Cyrillic text.
3. Use approved RU frame 1 as the style reference for RU frames 2-4, explicitly forbidding layout, camera, and composition copying.
4. Create each EN frame as a localization edit of its approved RU sibling: change only the text, preserve the object, layout, camera, light, lines, grain, and color.
5. Resize/compress/convert only. Never add, replace, or redraw text after generation.
