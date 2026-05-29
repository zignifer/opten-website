---
tags: [opten-seo, keywords, clusters, homepage, general]
kind: keyword-clusters
scope: homepage and brand-level keywords
date: 2026-05-29
source: cleaned from 2026-05-21/2026-05-22 general keyword snapshots
---

# Homepage Keyword Clusters

Этот файл нужен только для ранжирования brand-level ключей Opten. Он не содержит
готовых формулировок, продуктовых сообщений или инструкций по реализации.
Основной контент-бриф для статей — `blog-automation.md`.

## Как читать данные

- EN volume = Bing BroadImpressions за 31 день, все страны.
- RU volume = Yandex Wordstat broad, регион 225, /мес.
- Broad volume показывает общий спрос; exact volume показывает более точный
  спрос по формулировке.
- Высокий объем не равен высокому приоритету: career, courses, free-only,
  enterprise/devtools и чужая brand-navigation понижаются или исключаются.

## Правило ранжирования

Приоритет ключа = volume + product-fit + transactional intent + winnability.

| Вес | Фактор | Как применять |
| ---: | --- | --- |
| 30 | Search volume | Broad + exact, без переоценки слишком широких heads |
| 30 | Product-fit | Prompt enhancer / optimizer / scorer / extension выше общих запросов |
| 20 | Intent quality | Transactional и problem-solving выше info/career/free-only |
| 10 | Winnability | Низкая конкуренция и точный long-tail выше перегретого head |
| 10 | Cross-page value | Подходит и главной, и блогу, и FAQ |

## Кластеры

| Кластер | Смысл | Intent | Product-fit | Роль |
| --- | --- | --- | ---: | --- |
| `HG-enhance` | enhance / improve / улучшить промпт | transactional | 97 | основной high-fit кластер |
| `HG-optimizer` | prompt optimizer / optimization | transactional | 98 | основной high-fit кластер |
| `HG-scorer` | prompt scorer / checker / оценка промпта | transactional | 96 | продукт-точный кластер |
| `HG-extension` | prompt extension / browser extension | transactional | 96 | дифференциатор |
| `HG-generator` | prompt generator / maker / builder | transactional | 90 | высокий объем, высокая конкуренция |
| `HG-helper` | prompt helper / assistant | transactional/info | 88 | поддерживающий кластер |
| `HG-howto` | how to write prompts / как писать промпты | guide | 55 | блог/FAQ, не ядро главной |
| `HG-info` | what is prompt / готовые промпты | info | 40 | FAQ и educational-секции |
| `HG-platform-help` | platform + prompt/help | problem-solving | 70 | потенциальные страницы под платформы |
| `X-offtopic` | career, courses, вакансии, enterprise/devtools, unrelated builders | mixed | 10 | исключать |

## EN — топовые ключи

| Broad | Exact | Keyword | Кластер | Приоритет |
| ---: | ---: | --- | --- | --- |
| 18 287 | 8 028 | prompt generator | `HG-generator` | высокий объем, вторичный |
| 8 108 | 1 451 | ai prompt | `HG-info` | широкий, вторичный |
| 3 930 | 2 880 | ai prompt generator | `HG-generator` | высокий объем, вторичный |
| 1 043 | 1 031 | prompt generator ai | `HG-generator` | высокий объем, вторичный |
| 819 | null | prompt optimizer | `HG-optimizer` | primary high-fit |
| 732 | 556 | prompt enhancer | `HG-enhance` | primary high-fit |
| 601 | 521 | ai prompt engineering | `X-offtopic` | исключать career/learn |
| 370 | 140 | prompt generator free | `HG-generator` | понижать free-seeker |
| 196 | 168 | prompt builder | `HG-generator` | secondary |
| 187 | 187 | prompt generator for chatgpt | `HG-generator` | platform-specific secondary |
| 138 | 0 | prompt extension | `HG-extension` | primary niche |
| 111 | 96 | prompt improver | `HG-enhance` | primary high-fit |
| 94 | 94 | ai image prompt generator | `HG-generator` | high-fit secondary |
| 64 | 64 | ai prompt maker | `HG-generator` | secondary |
| 47 | null | ai prompt optimizer | `HG-optimizer` | high-fit secondary |
| 37 | 37 | ai video prompt generator | `HG-generator` | high-fit secondary |
| 33 | null | prompt checker | `HG-scorer` | high-fit secondary |
| 25 | 25 | how to write ai prompts | `HG-howto` | blog/FAQ |

## RU — топовые ключи

| Volume | Keyword | Кластер | Приоритет |
| ---: | --- | --- | --- |
| 3 798 | промпт инжиниринг | `X-offtopic` | исключать career/learn |
| 1 748 | промпт инженер | `X-offtopic` | исключать career/learn |
| 1 726 | улучшить промт | `HG-enhance` | primary high-fit |
| 1 135 | как писать промпты | `HG-howto` | blog/FAQ |
| 1 124 | написать промпт для нейросети | `HG-howto` | blog/FAQ |
| 1 072 | улучшение промптов | `HG-enhance` | primary high-fit |
| 868 | генератор промптов | `HG-generator` | secondary |
| 570 | промпт для нейросети для фото | `HG-info` | high-fit secondary |
| 442 | промпт генератор | `HG-generator` | secondary |
| 389 | готовые промпты для нейросетей | `HG-info` | secondary / FAQ |
| 378 | промт улучшить качество фото | `HG-enhance` | high-fit secondary |
| 330 | генератор промтов для нейросетей | `HG-generator` | secondary |
| 144 | как писать промпты для нейросетей | `HG-howto` | blog/FAQ |
| 129 | улучшить промт для нейросети | `HG-enhance` | primary high-fit |

## Platform / Audience Signals

Эти ключи помогают понимать аудиторию, но не всегда подходят как primary для
главной: часть запросов является brand-navigation чужих платформ.

| Keyword | Volume | Тип | Решение |
| --- | ---: | --- | --- |
| higgsfield ai | 48 627 | platform-nav | не primary для Opten |
| magnific ai | 2 793 | platform-nav | не primary для Opten |
| freepik ai | 2 637 | platform-nav | не primary для Opten |
| syntx ai | 220 | platform-nav | не primary для Opten |
| `<platform> prompt` | null | platform-help | можно использовать как support intent |
| `<platform> prompt help` | null | platform-help | можно использовать как support intent |

## Competitor / Alternative Signals

Низкий объем, но высокий intent. Использовать как future comparison topics, не
как ядро главной.

| Keyword pattern | Кластер | Решение |
| --- | --- | --- |
| promptperfect alternative | `HG-competitor` | comparison candidate |
| prompthero alternative | `HG-competitor` | comparison candidate |
| promptbase alternative | `HG-competitor` | comparison candidate |

## Pain Signals

Suggest-подтвержденный спрос без стабильного volume. Использовать как support
для FAQ и troubleshooting-контента.

| Keyword | Language | Intent |
| --- | --- | --- |
| ai not following prompt | EN | prompt troubleshooting |
| model not following prompt | EN | prompt troubleshooting |
| нейросеть рисует не то | RU | prompt troubleshooting |
| нейросеть не понимает промпт | RU | prompt troubleshooting |

## Итоговая очередь кластеров

1. `HG-optimizer`, `HG-enhance`, `HG-scorer` — strongest product-fit.
2. `HG-extension` — strongest differentiation, lower volume.
3. `HG-generator` — largest volume, use as secondary because competition is high.
4. `HG-howto`, `HG-info` — support for blog, FAQ and educational blocks.
5. `HG-platform-help`, `HG-competitor`, `HG-pain` — supporting content and future
   long-tail opportunities.
6. `X-offtopic` — exclude.

## Исключать или понижать

| Тип | Паттерны | Решение |
| --- | --- | --- |
| Career / education | `промпт инженер`, `промпт инжиниринг`, `prompt engineering course`, вакансии, зарплата | исключать |
| Free-only | `free`, `no restrictions`, `no sign up`, `без регистрации` | понижать |
| Enterprise/devtools | Salesforce, Agentforce, VS Code prompt builder | исключать |
| Third-party platform navigation | direct searches for Higgsfield, Freepik, Magnific, Syntx | не использовать как primary |
| Competitor marketplaces | PromptHero, PromptBase without alternative intent | понижать |

## Использование в статьях

- Используй `homepage-clusters.md` только для продуктовой калибровки Opten.
- Primary keyword статьи выбирай из `blog-clusters.md`, если статья editorial.
- Brand-level terms из этого файла можно использовать как secondary keywords:
  `prompt enhancer`, `prompt optimizer`, `prompt improver`, `prompt extension`,
  `улучшить промт`, `улучшение промптов`.
- Не превращай статью в homepage copy: этот файл помогает выбрать словарь, а не
  структуру материала.
