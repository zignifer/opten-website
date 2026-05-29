---
tags: [opten-seo, keywords, blog, clusters]
kind: keyword-clusters
scope: blog editorial keywords
date: 2026-05-29
source: cleaned from 2026-05-23 blog keyword snapshot
---

# Blog Keyword Clusters

Этот файл нужен только для выбора и ранжирования ключей блога. Он не задает
структуру статьи, готовые формулировки, продуктовые сообщения или визуальный
стиль. Основной контент-бриф — `blog-automation.md`.

## Как читать данные

- EN volume = Bing BroadImpressions за 31 день, все страны.
- RU volume = Yandex Wordstat broad, регион 225, /мес.
- Ключи без объема оставлены как подтвержденный Suggest-хвост.
- При выборе темы учитывай не только объем, но и intent-fit: насколько запрос
  связан с промптами, генерацией изображений/видео, выбором модели и улучшением
  результата.

## Правило ранжирования

Приоритет темы = объем + intent-fit + близость к Opten + свежесть + отсутствие
дубля.

| Вес | Фактор | Как применять |
| ---: | --- | --- |
| 35 | Search volume | Чем выше реальный спрос, тем выше очередь |
| 25 | Opten-fit | Промптинг, улучшение результата, выбор модели выше общих AI-тем |
| 20 | Intent quality | How-to, comparison, workflow и model-specific выше free-seeker |
| 10 | Freshness | Для news-кластера свежие релизы выше старых тем |
| 10 | Coverage gap | Не закрытые ранее темы выше повторов |

## Сводка кластеров

| Кластер | Роль | Фраз | EN/RU | Топовый сигнал | Приоритет |
| --- | --- | ---: | --- | --- | --- |
| `BL-news` | релизы, новости, сравнения | 249 | 148/101 | `nano banana` 122 138; RU `нейросеть для видео` 55 862 | высокий, если инфоповод свежий |
| `BL-technique` | how-to и техники | 199 | 154/45 | `image to video ai` 9 897; `ai face swap` 7 355 | высокий, evergreen |
| `BL-usecase` | прикладные сценарии | 190 | 121/69 | `ai logo generator` 5 586; `ai headshot generator` 1 339 | высокий, коммерческий интент |
| `BL-prompting` | промптинг | 136 | 110/26 | `what is a prompt` 545; RU `негативный промпт` 468 | высокий, максимальный Opten-fit |

## BL-news — топовые ключи

### EN

| Volume | Keyword | Комментарий |
| ---: | --- | --- |
| 122 138 | nano banana | head, очень конкурентный |
| 34 374 | gpt image 2 | model-release |
| 17 184 | nano banana ai | variant |
| 13 019 | sora 2 | model-release |
| 11 404 | seedance 2.0 | model-release |
| 10 378 | nano banana pro | model-release / pro intent |
| 8 500 | nano banana 2 | variant |
| 5 474 | veo 3.1 | model-release |
| 4 080 | nano banana gemini | platform/model association |
| 2 458 | kling 3.0 | model-release |
| 2 109 | gpt image 2.0 | variant |
| 623 | flux 2 | model-release |
| 194 | kling 3 | variant |
| 99 | flux 2 pro | variant |
| 84 | midjourney v8 | model-release |
| 75 | sora 2 pro | variant |

### RU

| Volume | Keyword | Комментарий |
| ---: | --- | --- |
| 55 862 | нейросеть для видео | head, broad |
| 18 644 | бесплатная нейросеть для видео | free-seeker, осторожно |
| 8 728 | бесплатная нейросеть для создания видео | free-seeker, осторожно |
| 5 451 | бесплатная нейросеть для генерации видео | free-seeker, осторожно |
| 3 837 | нейросеть для видео из фото | high-fit |
| 3 353 | veo 3 нейросеть | model-specific |
| 2 689 | лучшая нейросеть для фото | comparison |
| 2 676 | лучшая нейросеть для видео | comparison |
| 2 228 | сравнение нейросетей | broad comparison |
| 1 943 | нейросеть для видео онлайн | tool intent |
| 1 639 | лучшая нейросеть для генерации изображений | comparison |
| 1 583 | нейросеть для видео без регистрации | free-seeker, осторожно |
| 1 101 | лучшая нейросеть для создания видео | comparison |
| 1 047 | нейросеть для видео sora | model-specific |

### Comparison tail

`sora vs veo`, `sora 2 vs veo 3.1`, `kling vs sora`, `kling vs sora 2`,
`kling ai vs sora 2`, `kling or sora`.

## BL-technique — топовые ключи

### EN

| Volume | Keyword | Комментарий |
| ---: | --- | --- |
| 9 897 | image to video ai | head, high-fit |
| 4 466 | text to video ai | head |
| 3 219 | image to video ai free | free-seeker tail |
| 1 550 | text to video ai free | free-seeker tail |
| 984 | image to video ai generator | generator intent |
| 7 355 | ai face swap | head |
| 668 | ai face swap free | free-seeker tail |
| 245 | ai face swap video | video-specific |
| 698 | upscale image ai | technique |
| 231 | ai lip sync | technique |
| 131 | ai photo restoration | technique |
| 29 | consistent character ai | low volume, high-fit |

### RU

| Keyword | Комментарий |
| --- | --- |
| как сделать ии видео | how-to |
| как сделать ии видео из фото | high-fit |
| оживить фото нейросетью | high-fit |
| оживить фото нейросетью онлайн | tool intent |
| анимировать фото нейросетью | high-fit |
| апскейл изображения нейросеть | technique |
| нейросеть для предметной съёмки | use-case / technique |
| как сделать аватар в нейросети | use-case |
| как сделать ai инфлюенсера | use-case |

## BL-usecase — топовые ключи

### EN

| Volume | Keyword | Комментарий |
| ---: | --- | --- |
| 5 586 | ai logo generator | head, commercial |
| 1 339 | ai headshot generator | commercial |
| 913 | ai logo generator free | free-seeker tail |
| 717 | ai influencer | commercial / creator |
| 669 | ai poster maker | commercial |
| 462 | ai interior design | commercial |
| 335 | ai avatar generator | commercial |
| 247 | ai influencer generator | commercial |
| 177 | ai headshot generator free | free-seeker tail |
| 150 | ai profile picture generator | commercial |
| 95 | ai ugc | commercial |
| 24 | ai youtube thumbnail generator | commercial |
| 14 | ai ugc video generator | commercial |

### RU

| Keyword | Комментарий |
| --- | --- |
| нейросеть для логотипа | commercial |
| нейросеть для аватарки | commercial |
| фото для аватарки нейросеть | commercial |
| нейросеть для рекламы | commercial |
| нейросеть для рекламы товара | commercial |
| нейросеть для видео рекламы | commercial |
| нейросеть для рилс | creator |
| нейросеть для монтажа рилс | creator |
| нейросеть для интерьера | commercial |
| нейросеть для постера | commercial |
| нейросеть для тату | commercial |
| нейросеть для видео аватара | commercial |

## BL-prompting — топовые ключи

### EN

| Volume | Keyword | Комментарий |
| ---: | --- | --- |
| 545 | what is a prompt | head, informational |
| 242 | prompt examples | high-fit |
| 142 | what is a prompt in ai | informational |
| 62 | negative prompt | high-fit |
| 12 | prompt structure | high-fit |
| null | ai art prompts | high-fit |
| null | ai art prompt examples | high-fit |
| null | image prompt ideas | high-fit |
| null | best prompts for ai art | high-fit |
| null | aspect ratio prompt | technical |

### RU

| Volume | Keyword | Комментарий |
| ---: | --- | --- |
| 468 | негативный промпт | high-fit |
| 92 | как составить промпт для нейросети | high-fit |
| 80 | как правильно составить промпт | high-fit |
| 39 | негативный промпт это | informational |
| 13 | как составить промпт для midjourney | model-specific |
| null | что такое промпт | informational |
| null | что такое промпт для нейросети | informational |
| null | структура промпта | high-fit |
| null | структура промпта для midjourney | model-specific |
| null | примеры промптов | high-fit |
| null | примеры промптов для sora | model-specific |
| null | примеры промптов для миджорни | model-specific |

## Исключать или понижать

| Тип | Паттерны | Решение |
| --- | --- | --- |
| Free-seeker | `free`, `без регистрации`, `unlimited`, `no sign up` | понижать; брать только если другой intent сильнее |
| Adult / unsafe | `без цензуры`, explicit-хвосты | исключать |
| Career / courses | `prompt engineering course`, `промпт инженер`, вакансии | исключать |
| Coding-only | сравнения нейросетей для программирования | исключать |
| Off-product platforms | enterprise/devtools хвосты без image/video prompt intent | понижать или исключать |

## Выбор набора ключей

- 1 primary keyword.
- 2-4 secondary keywords.
- RU и EN ключи подбираются отдельно, по спросу каждого языка.
- Не брать больше одного head-keyword в качестве primary для одной статьи.
- Если у темы высокий объем, но слабый Opten-fit, ставить ее ниже темы с меньшим
  объемом и сильным prompt/workflow intent.
