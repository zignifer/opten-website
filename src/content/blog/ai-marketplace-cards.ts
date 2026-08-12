import type { BlogPost, BlogPostLocale } from "./types";

const PUBLISHED = "2026-08-13";
const COURSE_URL = "/learn/courses/ai-content-marketing-2026";

const COVER_RU = {
  src: "/blog/ai-marketplace-cards/cover.jpg",
  width: 1600,
  height: 900,
  alt: "Нейросети для маркетплейсов: предметная съемка и подготовка карточек товаров",
};

const COVER_EN = {
  src: COVER_RU.src,
  width: COVER_RU.width,
  height: COVER_RU.height,
  alt: "AI product photography workflow for marketplace product cards",
};

const ru: BlogPostLocale = {
  slug: "ai-marketplace-cards",
  title: "Нейросети для маркетплейсов: карточки товаров, описания и визуалы",
  excerpt:
    "Нейросети для маркетплейсов ускоряют визуалы и описания. Разбираем, как нейросети для карточек товаров сохраняют факты и внешний вид продукта.",
  description:
    "Как использовать нейросети для маркетплейсов: подготовить фото, серию карточек, описание и рекламу, сохранив внешний вид товара и проверенные свойства.",
  category: "guide",
  tags: ["ai-image-gen", "prompt-engineering", "workflow"],
  cover: COVER_RU,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ["ai-ugc-for-brands", "gpt-image-2", "prompt-structure"],
  body: {
    intro:
      "Нейросети для маркетплейсов помогают быстро подготовить главное фото, серию кадров, описание и рекламные варианты, но не заменяют исходные данные о товаре. Надежный процесс начинается с реальных фотографий и характеристик, затем фиксирует неизменяемые детали продукта, собирает визуальную серию и заканчивается ручной проверкой правил площадки.",
    steps: [
      {
        title: "Соберите исходники и правила до генерации",
        body:
          "Начните не с промпта, а с папки исходников. Положите туда фронтальный снимок, два ракурса, крупный план маркировки, размеры, материал, комплектацию и документ с разрешенными формулировками. Отдельно отметьте, что модель менять не имеет права: форму, цвет, пропорции, логотип, количество деталей и надписи на упаковке. Если у товара есть варианты, не смешивайте их в одном наборе референсов. Затем откройте действующие требования нужной площадки. Wildberries, например, просит показывать товар полностью, держать его в фокусе и не добавлять на фото цены, QR-коды, скидки и неподтвержденные превосходные формулировки. Правила и размеры могут обновляться, поэтому проверяйте кабинет продавца перед экспортом, а не копируйте старый шаблон. Такой короткий аудит сразу разделяет три задачи: что обязано остаться правдой, что можно изменить визуально и что площадка не пропустит.",
        imageSrc: "/blog/ai-marketplace-cards/ru/step-1.jpg",
      },
      {
        title: "Зафиксируйте товар в референсах и промпте",
        body:
          "Нейросеть для карточек маркетплейса должна редактировать реальный продукт, а не заново придумывать его по описанию. Прикрепите лучшие исходные фото и разделите запрос на три блока: задача, неизменяемые детали, допустимые изменения. Практический кейс для этой статьи: у GPT Image 2 первый запрос «сделай дорогую карточку термобутылки на темном фоне» дал аккуратный кадр, но изменил высоту крышки и потерял нижнюю маркировку. Исправление было точным: 'Edit the supplied product photo. Change only the background and lighting. Preserve the bottle silhouette, lid height, stainless rim, matte dark-green finish, capacity mark and proportions. No redesign, no extra accessories, no logo.' В следующем результате сохранились силуэт, стальная крышка и матовое покрытие, а поменялись только сцена и свет. Приемка здесь простая: наложите генерацию на исходник с полупрозрачностью и проверьте контур, крышку, маркировку и цвет. Если хотя бы одна товарная деталь дрейфует, это новый черновик, а не готовая карточка.",
        imageSrc: "/blog/ai-marketplace-cards/ru/step-2.jpg",
      },
      {
        title: "Соберите серию: как работает нейросеть для карточек маркетплейса",
        body:
          "Одна картинка не должна одновременно объяснять внешний вид, размер, материал, сценарий использования и все преимущества. Соберите серию ролей. Первый кадр показывает товар целиком без визуального шума. Второй приближает фактуру или важную деталь. Третий дает понятный масштаб через руку, интерьер или соседний предмет с известным размером. Четвертый показывает один реальный сценарий: бутылка на рабочем столе, сумка в поездке или светильник у кровати. Для каждого кадра пишите отдельный запрос и повторяйте блок сохранения продукта. Так нейросети для карточек товаров дают связную историю, а не четыре случайные стилизации. Не заполняйте каждый кадр текстом. Если визуал уже показывает крышку крупно, подпись должна объяснить один факт, а не дублировать то, что видно. Держите одинаковыми товар, палитру, обработку и типографику, но меняйте ракурс и смысл кадра.",
        imageSrc: "/blog/ai-marketplace-cards/ru/step-3.jpg",
      },
      {
        title: "Пишите описание из фактов, а не из изображения",
        body:
          "Генератор текста не знает, сколько товар держит тепло, выдерживает ли посудомоечную машину и какая гарантия действует. Дайте модели таблицу подтвержденных характеристик и попросите для каждой строки пройти цепочку «характеристика → доказательство → польза». Если доказательства нет, польза не попадает в описание. Например, объем 500 мл можно связать с компактностью только после проверки реальных размеров; слово «экологичный» нельзя добавлять из-за зеленого цвета упаковки. Рабочий запрос звучит так: «Напиши описание до 900 знаков по приложенным фактам. Не добавляй материалы, сертификаты, сроки, сравнения и обещания, которых нет в таблице. Отдельно перечисли спорные места для проверки человеком». Такой процесс полезен, когда нейросети для бизнеса готовят десятки похожих карточек: модель ускоряет структуру и варианты формулировок, а источник правды остается у команды. Финальный текст сравните с паспортом товара, упаковкой и юридически согласованными обещаниями.",
        imageSrc: "/blog/ai-marketplace-cards/ru/step-4.jpg",
      },
      {
        title: "Сделайте рекламные варианты и проверьте публикацию",
        body:
          "Нейросеть для рекламы полезна после того, как готова честная базовая карточка. Создавайте варианты по одной переменной: другой фон, один новый сценарий, более крупный товар или короткий заголовок. Не меняйте одновременно композицию, оффер, цвет и текст, иначе вы не поймете, что повлияло на результат. Перед загрузкой пройдите три проверки: товар совпадает с исходником, текст читается на телефоне, требования площадки соблюдены. Затем откройте карточку в кабинете продавца и еще раз проверьте обрезку, порядок кадров и описание. Opten можно использовать как предварительную проверку промпта: он помогает превратить короткую идею в запрос под выбранную модель и замечает пропущенные ограничения. Но решение о фактах, правах на материалы и публикации остается за человеком.",
        promoBanner: {
          eyebrow: "Курс Opten",
          title: "Соберите карточки товара как часть полного ИИ-проекта",
          body:
            "На курсе вы связываете промпты, изображения, видео, сайт и рекламные материалы в один проверяемый проект, а не набор разрозненных генераций.",
          ctaLabel: "Посмотреть программу курса",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Курс Opten: рабочий процесс от промпта до визуалов и рекламных материалов",
          },
        },
      },
    ],
    faq: [
      {
        q: "Какие нейросети подходят для карточек товаров?",
        a: "Для работы с референсами подходят модели, которые умеют редактировать изображение и сохранять объект, например GPT Image 2, Nano Banana 2 или Nano Banana Pro. Выбирайте не по списку эффектов, а по качеству сохранения формы, маркировки, цвета и текста вашего товара.",
      },
      {
        q: "Можно ли полностью сгенерировать товар без фотосъемки?",
        a: "Для концепта или еще не произведенного продукта — да. Для карточки конкретного товара безопаснее начинать с реальных фотографий: покупатель должен получить тот же цвет, форму, комплектацию и детали, которые увидел на странице.",
      },
      {
        q: "Как написать промпт для нейросети для карточек товаров?",
        a: "Укажите задачу кадра, приложите референсы, перечислите неизменяемые свойства и отдельно назовите допустимые изменения. Завершите запрос запретами на редизайн, случайные логотипы, лишние предметы, неподтвержденный текст и изменение пропорций.",
      },
      {
        q: "Как проверить описание товара, созданное нейросетью?",
        a: "Сопоставьте каждое число, материал, срок, совместимость и обещание с паспортом товара, упаковкой или согласованной таблицей характеристик. Формулировка без источника удаляется или возвращается на проверку.",
      },
      {
        q: "Заменят ли нейросети дизайнера карточек маркетплейса?",
        a: "Они ускоряют варианты фона, композиции, текста и рекламы, но не принимают ответственность за точность товара, права на изображения, требования площадки и итоговую визуальную систему. Эти решения остаются у специалиста.",
      },
    ],
  },
};

const en: BlogPostLocale = {
  slug: "ai-marketplace-cards",
  title: "AI product photography for marketplace cards: images, copy, and ads",
  excerpt:
    "AI product photography speeds up product cards, copy, and ad variants. Use this five-step workflow to keep product identity and claims tied to source data.",
  description:
    "AI product photography workflow for accurate product cards: lock references, build a four-shot set, write factual copy, create ad variants, and review.",
  category: ru.category,
  tags: ru.tags,
  cover: COVER_EN,
  readingTimeMin: 8,
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  related: ru.related,
  body: {
    intro:
      "AI product photography can speed up a hero image, supporting shots, product copy, and ad variants, but it can't replace source data. A reliable workflow starts with real photos and verified specifications, locks the product details that must not change, builds a purposeful image set, and ends with a manual marketplace review.",
    steps: [
      {
        title: "Collect source material and marketplace rules first",
        body:
          "Don't start with a prompt. Start with a source folder: front view, two angles, close-ups of labels and hardware, dimensions, materials, included parts, and a list of approved claims. Mark the properties the model can't change, including shape, color, proportions, logo placement, component count, and packaging copy. Keep variants in separate reference sets. Next, read the current image rules in the seller portal you plan to use. Wildberries, for example, asks sellers to keep the product fully visible and in focus, and it prohibits prices, QR codes, discounts, and unsupported superiority claims in product images. Specifications and moderation rules can change, so check them again before export. This small audit separates three questions early: what must remain factually true, what the model may change, and what the marketplace will reject.",
        imageSrc: "/blog/ai-marketplace-cards/en/step-1.jpg",
      },
      {
        title: "Lock product identity with references and constraints",
        body:
          "A model making AI product cards should edit the real item, not reconstruct it from a short description. Attach the strongest source images, then divide the prompt into the job, invariants, and allowed changes. In the practical GPT Image 2 case for this article, the first request, “make a premium marketplace card for this insulated bottle on a dark background,” looked polished but changed the lid height and lost the lower mark. The correction was specific: 'Edit the supplied product photo. Change only the background and lighting. Preserve the bottle silhouette, lid height, stainless rim, matte dark-green finish, capacity mark and proportions. No redesign, no extra accessories, no logo.' The next result kept the silhouette, steel lid, and matte finish while changing only the scene and light. For review, place the generation over the source at partial opacity and inspect the outline, lid, markings, and color. Any product drift means the image is still a draft.",
        imageSrc: "/blog/ai-marketplace-cards/en/step-2.jpg",
      },
      {
        title: "Build AI product cards as a four-shot set",
        body:
          "One image shouldn't carry appearance, scale, material, use case, and every benefit. Give each shot one role. The hero frame shows the whole product with minimal noise. A detail frame moves close to texture or hardware. A scale frame uses a hand, room, or familiar object. The final frame shows one believable use case, such as the bottle beside a laptop or inside a travel bag. Write a separate prompt for each shot and repeat the product-preservation block every time. This turns AI product cards into a coherent sequence instead of four unrelated stylizations. Don't overload every image with copy. When a close-up already proves the lid detail, the caption should add one verified fact instead of describing what buyers can see. Keep product identity, palette, color treatment, and typography consistent while changing the camera and the job of the frame.",
        imageSrc: "/blog/ai-marketplace-cards/en/step-3.jpg",
      },
      {
        title: "Write product copy from verified facts",
        body:
          "A copy model doesn't know how long a bottle keeps drinks warm, whether it is dishwasher-safe, or which warranty applies. Give it a table of verified specifications and require each claim to move through a simple chain: spec, proof, benefit. If proof is missing, the benefit doesn't enter the product description. A 500 ml capacity can support a compactness claim only after the real dimensions are checked. Green packaging doesn't prove that a product is sustainable. A useful prompt is: “Write a product description under 900 characters using only the attached facts. Do not invent materials, certificates, durations, comparisons, or guarantees. List uncertain statements separately for human review.” This is where AI product photography and copy can support a broader business workflow: the model speeds up structure and wording across a catalog, while the team's source table remains authoritative. Compare the final text with the product sheet, packaging, and approved legal claims.",
        imageSrc: "/blog/ai-marketplace-cards/en/step-4.jpg",
      },
      {
        title: "Create ad variants and run a publication check",
        body:
          "Use AI for ad variants only after the accurate base card is ready. Change one variable at a time: background, use case, product scale, or headline. If composition, offer, color, and copy all change together, the test won't tell you which choice mattered. Before upload, run three checks: the product still matches the source, text is readable on a phone, and current marketplace rules pass. Then preview the listing inside the seller portal and review cropping, image order, and copy again. Opten can work as a prompt preflight: it expands a rough idea for the selected model and catches missing constraints. Human review still owns product claims, rights to source material, and the publication decision.",
        promoBanner: {
          eyebrow: "Opten course",
          title: "Build product cards inside a complete AI project",
          body:
            "The course connects prompts, images, video, a website, and campaign assets into one reviewable project instead of a stack of unrelated generations.",
          ctaLabel: "View the course program",
          href: COURSE_URL,
          image: {
            src: "/blog/_banners/course-workflow.jpg",
            width: 1600,
            height: 560,
            alt: "Opten course workflow from prompts to visuals and campaign assets",
          },
        },
      },
    ],
    faq: [
      {
        q: "Which AI tools work for product cards?",
        a: "Use image models that accept references and support object-preserving edits, such as GPT Image 2, Nano Banana 2, or Nano Banana Pro. Judge them by how well they retain your product's shape, markings, color, and printed text, not by the number of visual effects.",
      },
      {
        q: "Can AI product photography replace a real product shoot?",
        a: "It can replace or extend backgrounds, produce concepts, and create supporting scenes. For a real product listing, start with real source photos so the item buyers receive matches the color, shape, included parts, and details shown online.",
      },
      {
        q: "How do you prompt AI for marketplace product cards?",
        a: "State the job of the frame, attach references, list product properties that must remain unchanged, and name the changes you allow. End with constraints against redesign, random logos, extra objects, unsupported copy, and altered proportions.",
      },
      {
        q: "How should AI-written product copy be checked?",
        a: "Match every number, material, duration, compatibility statement, and promise against the product sheet, packaging, or an approved claims table. Remove or escalate any sentence that has no source.",
      },
      {
        q: "Will AI product cards replace marketplace designers?",
        a: "They speed up backgrounds, layouts, copy, and ad variants, but they don't own product accuracy, image rights, marketplace compliance, or the final visual system. A designer or operator still makes those decisions.",
      },
    ],
  },
};

export const post: BlogPost = { ru, en };
