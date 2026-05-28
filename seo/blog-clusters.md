---
tags: [opten-seo, keywords, blog, clusters]
kind: keyword-clusters
scope: blog (editorial, supported_model=null, cluster_id=BL-*)
date: 2026-05-23
source: scripts 02→03→04→06 (PILOT=blog), seo_keywords (Supabase)
---

# Семантика блога — фразы по темам (BL-*)

Редакционный phrase-bank для статей opten.space. **НЕ привязан к страницам
моделей** — это пул SEO-фраз, которые писатель вплетает в текст под инфоповод.

## Как пользоваться

1. Под статью/инфоповод открой нужный пилар → возьми горячие фразы → вплети в
   `title`, `H1`, `H2`, первый абзац, `alt` картинок и FAQ.
2. **Opten вплетаем органично** (ассистент/оценка/улучшение промпта под модель,
   CTA на расширение) — не спамим, статья должна быть полезной.
3. Этот файл = курируемый срез **топа по объёму**. Полный и свежий список:
   ```sql
   select keyword, language, volume, cluster_id
   from seo_keywords
   where cluster_id like 'BL-%'
   order by cluster_id, volume desc nulls last;
   ```
4. **Объём**: EN — Bing BroadImpressions (31д, все страны); RU — Yandex Wordstat
   (регион 225, broad, /мес). Хвост без цифры = инструменты его не мерят, но это
   реальный спрос из Google Suggest (всё равно бери в текст).

## Сводка (774 фразы в `seo_keywords`)

| Пилар | Кластер | Фраз | EN/RU | Топ-объём | Роль |
|-------|---------|-----:|-------|----------:|------|
| Новости/релизы/сравнения | `BL-news` | 249 | 148/101 | 122 138 (`nano banana`) | Инфоповоды — быстрый трафик |
| Техники / how-to | `BL-technique` | 199 | 154/45 | 9 897 (`image to video ai`) | Вечнозелёные гайды |
| Use-cases / применения | `BL-usecase` | 190 | 121/69 | 5 586 (`ai logo generator`) | Коммерческий интент, конверсия |
| Промптинг как тема | `BL-prompting` | 136 | 110/26 | 545 (`what is a prompt`) | Ядро продукта, основной месседж |

---

## 1. BL-news — новости / релизы / сравнения (инфоповоды)

> Самый горячий и быстро устаревающий пул. Писать **на релиз/новость**, пока
> запрос на пике. Перелинковка на будущие `/models/<slug>`.

**Релизы моделей (EN):** `nano banana` 122 138 · `gpt image 2` 34 374 ·
`nano banana ai` 17 184 · `sora 2` 13 019 · `seedance 2.0` 11 404 ·
`nano banana pro` 10 378 · `nano banana 2` 8 500 · `veo 3.1` 5 474 ·
`nano banana gemini` 4 080 · `kling 3.0` 2 458 · `gpt image 2.0` 2 109 ·
`nano banana free` 1 857 · `nano banana google` 1 128 · `flux 2` 623 ·
`kling 3` 194 · `midjourney v8` 84 · `sora 2 pro` 75 · `flux 2 pro` 99.
Хвост-уточнения (новостной): `release date`, `pricing`, `api`, `flux 2 klein/dev/max`.

**RU «нейросеть для видео/фото» (огромный пул):** `нейросеть для видео` 55 862 ·
`бесплатная нейросеть для видео` 18 644 · `бесплатная нейросеть для создания видео`
8 728 · `бесплатная нейросеть для генерации видео` 5 451 · `нейросеть для видео из
фото` 3 837 · `veo 3 нейросеть` 3 353 · `лучшая нейросеть для фото` 2 689 ·
`лучшая нейросеть для видео` 2 676 · `сравнение нейросетей` 2 228 · `нейросеть для
видео онлайн` 1 943 · `лучшая нейросеть для генерации изображений` 1 639 ·
`нейросеть для видео без регистрации` 1 583 · `лучшая нейросеть для создания видео`
1 101 · `нейросеть для видео sora` 1 047.

**Сравнения (EN, низкий объём / высокий интент):** `sora vs veo (2/3/3.1)` ·
`kling vs sora (2)` · `kling or sora` · `kling ai vs sora 2`.

**Идеи статей:** «Nano Banana: что это и как писать промпты» · «Sora 2 vs Veo 3.1:
что выбрать» · «Лучшие нейросети для видео 2026» (RU, 55k головной) · «Seedance 2.0:
разбор» · «Kling 3.0 — что нового».

---

## 2. BL-technique — техники / how-to гайды

> Вечнозелёный top-of-funnel. В каждом — врезка «промпт решает половину результата →
> Opten оценит и улучшит под модель».

**Image/Text-to-video (EN):** `image to video ai` 9 897 (+`free` 3 219, `generator`
984) · `text to video ai` 4 466 (+`free` 1 550, `generator` 670).
**Face swap (EN):** `ai face swap` 7 355 (+`free` 668, `video` 245, `online` 59).
**Upscale (EN):** `upscale image ai` 698 (+`free` 84, `4k`, `16k`).
**Lip sync (EN):** `ai lip sync` 231 (+`generator` 91). · **Restoration:** `ai photo
restoration` 131. · **Consistent character:** `consistent character ai` 29, `ai
character sheet`.

**RU:** `как сделать ии видео` (+`из фото`, `бесплатно`, `в capcut`, `на телефоне`,
`с озвучкой`, `с танцем`) · `оживить фото нейросетью` (+`онлайн`, `luma`, `алиса`,
`телеграм`) · `анимировать фото нейросетью` · `апскейл изображения нейросеть` ·
`нейросеть для предметной съёмки` · `как сделать аватар в нейросети` ·
`как сделать ai инфлюенсера`.

**Идеи статей:** «Как оживить фото нейросетью (image-to-video)» · «AI face swap:
обзор» · «Как сделать ИИ-видео из фото за 5 минут» · «Консистентный персонаж в AI:
как добиться».

---

## 3. BL-usecase — применения (коммерческий интент)

> Ближе к конверсии: человек хочет результат. CTA на расширение уместен.

**EN:** `ai logo generator` 5 586 (+`free` 913) · `ai headshot generator` 1 339
(+`free` 177) · `ai influencer` 717 (+`generator` 247) · `ai poster maker` 669
(+`free` 140) · `ai interior design` 462 (+`free` 101) · `ai avatar generator` 335 ·
`ai profile picture (generator)` 150 · `ai ugc` 95 (+`video generator` 14, `ads`,
`content`, `creator`) · `ai youtube thumbnail (generator)` 24 · `ai video ads`.

**RU:** `нейросеть для логотипа` · `нейросеть для аватарки` (+`фото для аватарки`) ·
`нейросеть для рекламы` (+`товара`, `одежды`, `видео рекламы`) · `нейросеть для
рилс(ов)` (+`монтажа рилс`, `нарезки рилсов`) · `нейросеть для тату` (+`мастеров`,
`эскизов`, `татуировщиков`) · `нейросеть для интерьера` · `нейросеть для постера` ·
`нейросеть для видео аватара`.

**Идеи статей:** «Лучшие нейросети для логотипа» · «AI-аватарка: как сделать» ·
«Нейросеть для рекламы товара: гайд» · «AI UGC для брендов» · «Нейросеть для тату-
эскизов».

---

## 4. BL-prompting — промптинг как тема (ядро продукта)

> Ближе всего к Opten. Каждая статья естественно ведёт к «оцени/улучши промпт».

**EN:** `what is a prompt` 545 (+`in ai` 142) · `prompt examples` 242 · `negative
prompt` 62 (+`meaning`, `for ai`) · `prompt structure` 12 (+`chart`, `for ai`) ·
`ai art prompts` (+`list`, `pdf`, `gallery`, `examples`) · `image prompt ideas` ·
`best prompts for ai art` · `aspect ratio prompt`.

**RU:** `негативный промпт` 468 (+`это` 39, `как написать`) · `как составить промпт
для нейросети` 92 · `как правильно составить промпт` 80 · `что такое промпт`
(+`для нейросети`, `промптинг`) · `структура промпта` (+`для midjourney`) ·
`примеры промптов` (+`для sora/миджорни/фото`) · `как составить промпт для midjourney` 13.

**Идеи статей:** «Что такое промпт и как его писать» · «Негативный промпт: зачем и
как» · «Структура идеального промпта» · «Примеры промптов для Sora/Midjourney».

---

## Что НЕ брать / осторожно

- **free-seeker хвост** (`free`, `без регистрации`, `reddit`, `без цензуры`,
  `unlimited`) — реальный объём, но плохо конвертит в Pro. Брать только если статья
  честно про бесплатный туллинг (и всё равно вести к Opten как «качество > бесплатно»).
- **Coding-сравнения** (`сравнение нейросетей для программирования/кодинга`) — не наш
  ICP, залетели в `BL-news` через широкий keep. Игнорировать.
- **off-ICP** (карьера/курсы/`prompt engineering course`) — отфильтрованы в
  `X-offtopic`, в `BL-*` не попали.

## Обновление пула

```powershell
cd scripts
PILOT=blog npm run pipeline:suggest      # харвест (база)
SUGGEST_MODIFIERS=1 PILOT=blog npm run pipeline:suggest   # глубже (how/best/vs/2026)
PILOT=blog npm run pipeline:volume       # Bing EN
PILOT=blog npm run pipeline:volume-ru    # Wordstat RU (cap 60)
PILOT=blog npm run pipeline:load         # → seo_keywords (non-destructive)
```
Сид-группы и keep-фильтры — `scripts/02-enrich-suggest.ts` (pilot `blog`).
Классификация `BL-*` — `scripts/06-load-supabase.ts` (`classifyBlog`).
