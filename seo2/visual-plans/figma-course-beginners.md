# Visual plan: figma-course-beginners

## Art direction

- **Series concept:** a dark magnetic layout bench where frosted acrylic modules are held together by one tensioned lime rail. Chrome pins, translucent spacing shims, paper-plant leaves, and a black drafting grid recur as the learner turns loose layers into a resilient interface system.
- **Medium/materials:** cinematic tabletop photography with magnetic steel, frosted acrylic modules, matte-black frames, brushed chrome pins, thin vellum labels, translucent spacing shims, and folded paper leaves.
- **Background and light:** deep teal-black `#011417`, cool edge light on acrylic, restrained top light, and exact lime accents `#9CFB51`.
- **Texture:** fine steel scratches, paper fibers, acrylic edges, subtle fingerprints, and controlled film grain; no glossy dashboard or floating-interface treatment.
- **Typography:** every visible word is rendered in the generated raster in Bebas Neue, condensed uppercase display sans-serif with tall narrow letters. Text stays flat and printed on vellum, never extruded, embossed, metallic, or added in post.
- Typography treatment: flat printed Bebas Neue integrated into the raster; never extruded, embossed, metallic, or added in post.
- Card/grid frames: 0
- **Line language:** 3 px exact `#9CFB51` tension rails, chrome anchor dots, registration crosses, and sparse straight callout lines.
- **Recurring motif:** the lime rail shows which layout rule keeps modules connected when content or width changes.
- **Continuity:** preserve the magnetic bench, frosted acrylic, chrome pins, paper plant, exact palette, flat Bebas Neue text, line weight, cool light, and grain. Change the camera, layout, and composition archetype between frames.

## Cover

- **Story beat:** one loose set of interface layers becomes an organized desktop-and-mobile system.
- Visual proof: a wide magnetic drafting bench holds one large matte-black frame, a smaller phone frame, frosted modules, chrome component tokens, translucent spacing shims, and folded paper leaves connected by one lime tension rail.
- Composition: cinematic wide diagonal workshop landscape with a single project path, no text and no real UI.
- Text mode: none.
- **Semantic job:** signals hands-on Figma learning, layout rules, components, and responsive outputs without showing a software screenshot.
- **Generation prompt:** Cinematic physical interface-layout bench, deep teal-black `#011417`, exact lime-green `#9CFB51` tension rail, one large matte-black desktop frame and one narrow phone frame, frosted acrylic modules, chrome component tokens, translucent spacing shims, folded paper plant leaves, magnetic steel with fine scratches, paper fibers, subtle fingerprints, controlled film grain and cool edge light, wide 16:9, no text, no letters, no logos, no real UI, no score indicator, no watermark.

## Frame 1: understand the frame

- **Story beat:** treat a Figma frame as a meaningful container with boundaries and nested content.
- Visual proof: one large matte-black frame is opened like a technical specimen; frosted content layers sit inside its border while two lime callouts distinguish the frame boundary from nested layers.
- Composition: anatomy / single frame specimen with two callouts.
- **RU text:** `ФРЕЙМ — ЭТО КОНТЕЙНЕР`; callouts `ГРАНИЦЫ`, `СЛОИ ВНУТРИ`.
- **EN text:** `A FRAME IS A CONTAINER`; callouts `BOUNDARIES`, `NESTED LAYERS`.
- Text mode: annotated-explainer
- Style continuity: this RU frame is the style anchor. It defines the magnetic bench, acrylic edge light, chrome pins, paper-plant motif, exact lime line weight, flat Bebas Neue typography, grain, and color grading.
- **Semantic job:** makes the first mental model visible instead of presenting a generic screenshot of the Figma canvas.

## Frame 2: Auto Layout holds the rhythm

- **Story beat:** spacing and resizing rules should absorb longer content without manual repositioning.
- Visual proof: three frosted modules ride on one elastic lime rail; a longer center module stretches the system while equal translucent spacing shims remain fixed between objects.
- Composition: horizontal tension-rail experiment / material sequence.
- **RU text:** `AUTO LAYOUT ДЕРЖИТ РИТМ`; sequence `КОНТЕНТ → ОТСТУП → РАЗМЕР`.
- **EN text:** `AUTO LAYOUT HOLDS THE RHYTHM`; sequence `CONTENT → GAP → SIZE`.
- Text mode: sequence
- Style continuity: inherit the style anchor's materials, flat typography, exact palette, tension rail, chrome anchors, cool light, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** proves that the rule responds to changing content while preserving spacing.

## Frame 3: one component, several states

- **Story beat:** reuse one component source while instances carry different useful states.
- Visual proof: one chrome master token passes along a curved lime track and stamps three related acrylic field instances with distinct physical state indicators, all retaining the same geometry.
- Composition: curved state timeline / master-to-instances process.
- **RU text:** `ОДИН КОМПОНЕНТ — НЕСКОЛЬКО СОСТОЯНИЙ`; sequence `ОБЫЧНО → ФОКУС → ОШИБКА`.
- **EN text:** `ONE COMPONENT — SEVERAL STATES`; sequence `DEFAULT → FOCUS → ERROR`.
- Text mode: sequence
- Style continuity: inherit the style anchor's magnetic materials, flat typography, lime rail, chrome pins, acrylic edges, paper plant, lighting, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** shows why component instances should vary without duplicating the source system.

## Frame 4: AI is one layer

- **Story beat:** generate one bounded illustration and keep the surrounding interface editable in Figma.
- Visual proof: one small folded-paper plant illustration is clipped as a single raster sheet inside a larger physical frame; separate frosted headline, text, and button layers remain visibly movable around it.
- Composition: hero visual / exploded layer stack around one raster asset.
- **RU text:** `ИИ — ОДИН СЛОЙ, НЕ ВЕСЬ ЭКРАН`.
- **EN text:** `AI IS ONE LAYER, NOT THE SCREEN`.
- Text mode: headline-only
- Style continuity: inherit the style anchor's bench, flat typography, exact palette, lime rail, chrome clips, acrylic layers, paper plant, cool light, and grain. Do not copy its layout, camera, or object composition.
- **Semantic job:** directly visualizes the practical case boundary between a generated illustration and editable interface layers.

## Pairing and production rules

1. Generate the cover separately without text.
2. Generate RU frame 1 with `seo2/Reference/bebas-neue-font-reference.png` as the only initial reference and inspect every Cyrillic word.
3. Use approved RU frame 1 as the style reference for RU frames 2-4, explicitly forbidding layout, camera, and composition copying.
4. Create each EN frame as a localization edit of its approved RU sibling: change only the text, preserve the objects, layout, camera, light, tension rails, grain, and color.
5. Resize, compress, and convert only. Never add, replace, or redraw text after generation.
