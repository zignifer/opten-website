# Visual plan: ai-for-designers

## Art direction

- **Series concept:** a dark physical designer's light table where a silver crop frame and one lime grease-pencil stroke guide a project from brief to handoff. Vellum sheets, registration pins, paper swatches, and one unbranded folded-paper sculpture recur across the series.
- **Medium/materials:** cinematic overhead and close tabletop photography with translucent vellum, matte black card, brushed aluminum crop frames, steel pins, tracing paper, and real grease-pencil marks.
- **Background and light:** deep teal-black `#011417`, cool light rising through the table, restrained edge glow, and exact lime accents `#9CFB51`.
- **Texture:** visible paper fibers, fine scratches on metal, subtle film grain, and soft falloff; no glossy dashboard or floating-interface treatment.
- **Typography:** every visible word is rendered in the generated raster in Bebas Neue, condensed uppercase display sans-serif with tall narrow letters. Text stays flat and printed on paper or vellum, never extruded, embossed, metallic, or added in post.
- Typography treatment: flat printed Bebas Neue integrated into the raster; never extruded, embossed, metallic, or added in post.
- Card/grid frames: 1
- **Line language:** 3 px lime grease-pencil strokes, crop corners, registration crosses, and sparse straight arrows.
- **Recurring motif:** the silver crop frame marks what the designer controls, while the lime stroke connects each AI output to a deliberate design decision.
- **Continuity:** preserve the light-table materials, folded-paper sculpture, silver crop frame, exact palette, flat Bebas Neue text, grease-pencil line weight, cool light, and grain. Change the camera, layout, and composition archetype between frames.

## Cover

- **Story beat:** a designer turns a client brief and references into a controlled set of visual directions.
- Visual proof: a wide physical light table holds one brief card, three reference fragments, a silver crop frame, an unbranded folded-paper sculpture, and several blank composition sheets connected by one lime grease-pencil line.
- Composition: cinematic wide studio landscape, shallow diagonal perspective, sculpture in the right third, useful negative space on the left, no UI.
- Text mode: none.
- **Semantic job:** signals real design production, reference handling, and visual exploration without pretending to show software screens.
- **Generation prompt:** Minimal cinematic physical designer light table, deep teal-black `#011417`, exact lime-green `#9CFB51` grease-pencil accents, one client brief card with abstract unreadable lines, three reference fragments without brands, brushed aluminum crop frame, registration pins, one unbranded folded-paper sculpture in the right third, several blank composition sheets, paper fibers, subtle grain and cool underlight, wide 16:9, no text, no letters, no logos, no UI, no score indicator, no watermark.

## Frame 1: lock the project frame

- **Story beat:** define the assignment, format, and exclusions before generating an image.
- Visual proof: one physical brief sheet is locked inside a large silver crop frame, with three lime callout strokes pointing to its purpose block, aspect-ratio mask, and exclusion strip.
- Composition: anatomy / single hero brief sheet with three callouts.
- **RU text:** `ЗАФИКСИРУЙ РАМКИ`; callouts `ЗАДАЧА`, `ФОРМАТ`, `ЗАПРЕТЫ`.
- **EN text:** `LOCK THE PROJECT FRAME`; callouts `JOB`, `FORMAT`, `EXCLUSIONS`.
- Text mode: annotated-explainer
- Style continuity: this RU frame is the style anchor for the series. It defines flat Bebas Neue typography, vellum and metal materials, lime grease-pencil line weight, crop-frame geometry, cool underlight, grain, and color grading.
- **Semantic job:** makes constraints visible as design inputs rather than a paragraph of generic prompt advice.

## Frame 2: references guide the direction

- **Story beat:** separate reusable visual properties from copying a finished design.
- Visual proof: a top-down moodboard sends three lime grease-pencil lines from a color swatch, a light study, and a composition crop into one new blank concept sheet containing the recurring folded-paper sculpture.
- Composition: overhead moodboard / three-source convergence.
- **RU text:** `РЕФЕРЕНСЫ ЗАДАЮТ НАПРАВЛЕНИЕ`; labels `ЦВЕТ`, `СВЕТ`, `КОМПОЗИЦИЯ`.
- **EN text:** `REFERENCES SET DIRECTION`; labels `COLOR`, `LIGHT`, `COMPOSITION`.
- Text mode: annotated-explainer
- Style continuity: inherit the style anchor's materials, color grading, flat typography, grease-pencil line, crop-frame geometry, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** demonstrates how references contribute separate decisions to an original output.

## Frame 3: controlled variants

- **Story beat:** explore one design hypothesis by changing one visual variable at a time.
- Visual proof: one small hypothesis sheet feeds three distinct physical prints of the same folded-paper sculpture; a movable silver crop frame selects one print at the end.
- Composition: diagonal branching sequence / physical print fan.
- **RU text:** `ОДНА ИДЕЯ — ТРИ ВАРИАНТА`; sequence `ГИПОТЕЗА → ВАРИАНТЫ → ВЫБОР`.
- **EN text:** `ONE IDEA — THREE VARIANTS`; sequence `HYPOTHESIS → VARIANTS → CHOICE`.
- Text mode: sequence
- Style continuity: inherit the style anchor's light-table medium, color grading, flat Bebas Neue treatment, folded-paper sculpture, lime line weight, metal crop frame, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** turns iteration into a controlled design decision instead of a pile of unrelated generations.

## Frame 4: client handoff check

- **Story beat:** verify copy, production dimensions, and rights before exporting client files.
- Visual proof: a compact top-down delivery station holds one final print, crop ruler, spelling loupe, rights tag, and three checked paper slips inside a silver export tray.
- Composition: top-down delivery station / compact checklist matrix.
- **RU text:** `ПРОВЕРЬ ПЕРЕД ПЕРЕДАЧЕЙ`; checks `ТЕКСТ`, `РАЗМЕРЫ`, `ПРАВА`.
- **EN text:** `CHECK BEFORE HANDOFF`; checks `COPY`, `DIMENSIONS`, `RIGHTS`.
- Text mode: annotated-explainer
- Style continuity: inherit the style anchor's materials, color grading, flat Bebas Neue treatment, lime grease-pencil marks, crop-frame geometry, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** makes the final professional responsibility visible and separate from image generation.

## Pairing and production rules

1. Generate the cover separately without text.
2. Generate RU frame 1 with `seo2/Reference/bebas-neue-font-reference.png` as the only initial reference and inspect every Cyrillic word.
3. Use approved RU frame 1 as the style reference for RU frames 2-4, explicitly forbidding layout, camera, and composition copying.
4. Create each EN frame as a localization edit of its approved RU sibling: change only the text, preserve the object, layout, camera, light, grease-pencil lines, grain, and color.
5. Resize, compress, and convert only. Never add, replace, or redraw text after generation.
