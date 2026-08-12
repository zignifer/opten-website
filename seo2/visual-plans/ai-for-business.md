# Visual plan: ai-for-business

## Art direction

- **Series concept:** a physical business operations desk where one translucent task token moves from a customer request to a reviewed result. The same lime-edged token, dark paper system, clear acrylic rails, and small human approval stamp recur across every frame.
- **Medium/materials:** cinematic tabletop photography with real dark paper, smoked glass, clear acrylic, printed labels, metal clips, and thin editorial diagram lines integrated into the photographed scene.
- **Background and light:** deep teal-black `#011417`, restrained studio haze, cool side light, and exact lime accents `#9CFB51`.
- **Texture:** subtle film grain, paper fibers, soft glass reflections, and practical desk wear; no glossy 3D dashboard treatment.
- **Typography:** every visible word is rendered in the generated raster in Bebas Neue, condensed uppercase display sans-serif with tall narrow letters. Text stays flat and printed/integrated, never extruded, embossed, metallic, or added in post.
- Typography treatment: flat printed Bebas Neue integrated into the raster; never extruded, embossed, metallic, or added in post.
- Card/grid frames: 1
- **Line language:** thin 3 px lime rails, right-angle brackets, small round checkpoints, and sparse arrows.
- **Recurring motif:** a single translucent task token with a lime edge advances through the operation while human review remains a visible physical gate.
- **Continuity:** preserve the task token, palette, flat Bebas Neue text, line weight, practical tabletop materials, cool light, grain, and lime approval mark. Change the layout, camera, and composition archetype between frames.

## Cover

- **Story beat:** one controlled AI workflow connects a customer request, verified facts, content production, and a reviewed business result.
- Visual proof: a wide dark operations table with one lime-edged task token traveling along a clear acrylic rail from a customer message card through a fact sheet to a stamped approved output.
- Composition: cinematic wide process landscape, three physical stations arranged diagonally, shallow perspective, generous negative space, no UI.
- Text mode: none.
- **Semantic job:** signals practical business operations and controlled automation without pretending to show a real CRM or analytics product.
- **Generation prompt:** Minimal cinematic physical business operations table, deep teal-black `#011417`, exact lime-green `#9CFB51` accents, one translucent task token with a glowing lime edge traveling on a clear acrylic rail, starting at a customer message card, passing a verified fact sheet, ending at a human-stamped approved output, dark paper, smoked glass, metal clips, subtle grain and studio haze, wide 16:9, no text, no logos, no UI, no charts, no score indicator, no watermark.

## Frame 1: find the bottleneck

- **Story beat:** choose one repeated operation where time and rework are visible.
- Visual proof: one large lime-edged task token is stopped inside a narrow acrylic rail, with three physical callouts identifying repeated work, queue, and revisions.
- Composition: anatomy / single hero process object with three callouts.
- **RU text:** `НАЙДИ УЗКОЕ МЕСТО`; callouts `ПОВТОРЫ`, `ОЧЕРЕДЬ`, `ПРАВКИ`.
- **EN text:** `FIND THE BOTTLENECK`; callouts `REPEATS`, `QUEUE`, `REWORK`.
- Text mode: annotated-explainer
- Style continuity: this RU frame is the style anchor for the series. It defines flat Bebas Neue typography, lime rail weight, task-token identity, tabletop materials, lighting, grain, and color grading.
- **Semantic job:** makes the first AI use case a visible operational constraint rather than a tool-shopping exercise.

## Frame 2: customer reply flow

- **Story beat:** move from a customer request to a grounded draft and a human review gate.
- Visual proof: four different physical stations show the same token moving through a message envelope, verified fact sheet, printed draft, and final hand-stamped review gate.
- Composition: horizontal physical sequence / production rail.
- **RU text:** `ОТ ЗАПРОСА ДО ОТВЕТА`; sequence `ЗАПРОС → ФАКТЫ → ЧЕРНОВИК → ПРОВЕРКА`.
- **EN text:** `FROM REQUEST TO REPLY`; sequence `REQUEST → FACTS → DRAFT → REVIEW`.
- Text mode: sequence
- Style continuity: inherit the style anchor's medium, color grading, typography physics, task-token identity, line weight, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** shows that a fast answer remains connected to approved facts and human review.

## Frame 3: one source, four formats

- **Story beat:** adapt one verified source into channel-specific content without duplicating or inventing facts.
- Visual proof: one central fact sheet distributes four lime rails to four distinct physical outputs: a social post, email, product card, and short-video script.
- Composition: radial hub-and-spoke / overhead content workbench.
- **RU text:** `ОДИН ИСТОЧНИК — 4 ФОРМАТА`; labels `ПОСТ`, `ПИСЬМО`, `КАРТОЧКА`, `СЦЕНАРИЙ`.
- **EN text:** `ONE SOURCE — 4 FORMATS`; labels `POST`, `EMAIL`, `PRODUCT CARD`, `SCRIPT`.
- Text mode: annotated-explainer
- Style continuity: inherit the style anchor's medium, color grading, flat Bebas Neue treatment, task-token identity, line weight, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** makes source consistency across sales and content channels immediately legible.

## Frame 4: fourteen-day pilot

- **Story beat:** test one workflow with one owner and one metric before scaling.
- Visual proof: a top-down fourteen-day experiment board has one process lane, one metric dial, one owner marker, sparse day ticks, and a lime decision gate at the end.
- Composition: top-down experiment board / compact checklist matrix.
- **RU text:** `ПИЛОТ НА 14 ДНЕЙ`; checks `1 ПРОЦЕСС`, `1 МЕТРИКА`, `1 ВЛАДЕЛЕЦ`.
- **EN text:** `14-DAY PILOT`; checks `1 PROCESS`, `1 METRIC`, `1 OWNER`.
- Text mode: annotated-explainer
- Style continuity: inherit the style anchor's medium, color grading, flat Bebas Neue treatment, task-token identity, line weight, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** turns adoption into a bounded measurement exercise instead of indefinite experimentation.

## Pairing and production rules

1. Generate the cover separately without text.
2. Generate RU frame 1 with `seo2/Reference/bebas-neue-font-reference.png` as the only initial reference and inspect every Cyrillic word.
3. Use approved RU frame 1 as the style reference for RU frames 2-4, explicitly forbidding layout, camera, and composition copying.
4. Create each EN frame as a localization edit of its approved RU sibling: change only the text, preserve the object, layout, camera, light, lines, grain, and color.
5. Resize, compress, and convert only. Never add, replace, or redraw text after generation.
