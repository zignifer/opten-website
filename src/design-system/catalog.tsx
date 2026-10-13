import { useT } from "../i18n/LangContext";
import InstallButton from "../app/components/InstallButton";
import AiAccessButton from "../app/components/AiAccessButton";
import PromptWorkbench from "../app/components/PromptWorkbench";
import FaqBlock from "../app/components/FaqBlock";
import SiteHeader from "../app/components/SiteHeader";
import SiteFooter from "../app/components/SiteFooter";
import BlogPostCard from "../app/components/BlogPostCard";
import LearnLessonCard from "../app/components/space/learn/LearnLessonCard";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import { Textarea } from "../app/components/ui/textarea";
import { Badge } from "../app/components/ui/badge";
import { Switch } from "../app/components/ui/switch";
import { Checkbox } from "../app/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../app/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../app/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../app/components/ui/accordion";
import { Hero, Accent, SectionTitle, Step, PrivacyItem, PlanCard, FeatureCard, FeatureCards, Partners, Privacy, Pricing, SoonBadge, InlinePlanet, InlineStars } from "../app/components/landing/LandingSections";
import { publicLearnLessons } from "../content/space/learn";
import { post } from "../content/blog/gpt-image-2";
import models from '../../public/assets/landing-design/feature-models.png?w=400;1100&format=webp;png&as=picture';
import interfaceRu from '../../public/assets/landing-design/feature-interface-ru.png?w=400;1100&format=webp;png&as=picture';
import interfaceEn from '../../public/assets/landing-design/feature-interface-en.png?w=400;1100&format=webp;png&as=picture';
import credits from '../../public/assets/landing-design/feature-credits.png?w=400;1100&format=webp;png&as=picture';
import enhanceRu from '../../public/assets/landing-design/feature-enhance-ru.png?w=400;1100&format=webp;png&as=picture';
import enhanceEn from '../../public/assets/landing-design/feature-enhance-en.png?w=400;1100&format=webp;png&as=picture';
import { useLang } from "../i18n/LangContext";
import type { ReactNode } from "react";

export type WebsiteDemo = { id: string; title: string; source: string; symbol: string; level: "primitive" | "composite"; variants: string[]; note: string; parts: string[]; scaffold?: boolean; render: (variant: string) => ReactNode };
const landing = "src/app/components/landing/LandingSections.tsx";
function FeatureDemo({ variant }: { variant: string }) {
  const t = useT(); const { lang } = useLang();
  const index = Number(variant) || 1;
  const images = [models, lang === "ru" ? interfaceRu : interfaceEn, credits, lang === "ru" ? enhanceRu : enhanceEn];
  return <FeatureCard title={t(`features.card${index}.title`)} desc={t(`features.card${index}.desc`)} alt={t(`features.card${index}.alt`)} imgData={images[index - 1]} imgWidth={1100} imgHeight={index === 4 ? 372 : 424} imageFirst={index === 2} />;
}
function PlanDemo({ variant }: { variant: string }) {
  const t = useT(); const dark = variant === "free"; const key = dark ? "onetime" : "pro";
  return <PlanCard dark={dark} title={t(`pricing.${key}.subtitle`)} price={t(`pricing.${key}.price`)} period={dark ? undefined : t("pricing.pro.period")} features={[1,2,3,4,5].map(index => t(`pricing.${key}.feature${index}`))} buttonText={t(`pay.${key}.tryBtn`)} />;
}
function BlogDemo() { const { lang } = useLang(); return <BlogPostCard post={{ ...post[lang], slug: post.slug }} />; }
function LearnDemo({ description }: { description: boolean }) { const { lang } = useLang(); return <LearnLessonCard lesson={publicLearnLessons.find(lesson => lesson.slug === "actual-ai-tools-2026") || publicLearnLessons[0]} lang={lang} showDescription={description} />; }
const primitive = (id: string, title: string, symbol: string, variants: string[], render: WebsiteDemo["render"], note = "Наведение и фокус проверяются на живом компоненте."): WebsiteDemo => ({ id, title, symbol, source: landing, level: "primitive", variants, render, note, parts: [] });
const composite = (id: string, title: string, symbol: string, variants: string[], render: WebsiteDemo["render"], parts: string[], note: string, source = landing): WebsiteDemo => ({ id, title, symbol, source, level: "composite", variants, render, note, parts });
const ui = (id: string, title: string, symbol: string, variants: string[], render: WebsiteDemo["render"]): WebsiteDemo => ({ ...primitive(id, title, symbol, variants, render), source: `src/app/components/ui/${id}.tsx`, scaffold: true, note: "Существующий Radix/UI-примитив. Его наличие в коде не означает использование в маркетинге." });

export const websiteDemos: WebsiteDemo[] = [
  { ...primitive("install", "Установка расширения", "InstallButton", ["full", "compact"], variant => <InstallButton compact={variant === "compact"} />), source: "src/app/components/InstallButton.tsx" },
  { ...primitive("ai-access", "Claude и ChatGPT · CTA + модальное окно", "AiAccessButton", ["default"], () => <AiAccessButton />, "Откройте окно: вкладки Claude/ChatGPT и состояние доступа берутся из настоящего компонента."), source: "src/app/components/AiAccessButton.tsx" },
  primitive("accent", "Акцент в тексте", "Accent", ["default"], () => <p className="font-['Unbounded',sans-serif] text-[28px]"><Accent>Не сливай кредиты</Accent><br />на плохие промпты</p>),
  primitive("section-title", "Заголовок секции", "SectionTitle", ["default"], () => <SectionTitle>Твои промпты<br /><Accent>могут больше</Accent></SectionTitle>),
  primitive("soon", "Бейдж «Скоро»", "SoonBadge", ["default"], () => <SoonBadge />),
  primitive("inline-icons", "Планета и звёзды в строке", "InlinePlanet", ["default"], () => <p className="text-[28px]">Нажми <InlinePlanet /> и улучши <InlineStars /></p>),
  ui("button", "UI · кнопка", "Button", ["default", "outline", "secondary", "ghost", "destructive", "link", "disabled"], variant => <Button variant={variant === "disabled" ? "default" : variant as "default"} disabled={variant === "disabled"}>Действие</Button>),
  ui("input", "UI · поле ввода", "Input", ["default", "disabled"], variant => <Input placeholder="Email" aria-label="Пример поля Email" disabled={variant === "disabled"} />),
  ui("textarea", "UI · многострочное поле", "Textarea", ["default", "disabled"], variant => <Textarea placeholder="Введите текст" aria-label="Пример многострочного поля" disabled={variant === "disabled"} />),
  ui("badge", "UI · бейдж", "Badge", ["default", "secondary", "outline", "destructive"], variant => <Badge variant={variant as "default"}>Opten</Badge>),
  ui("switch", "UI · переключатель", "Switch", ["off", "on", "disabled"], variant => <Switch key={variant} defaultChecked={variant === "on"} disabled={variant === "disabled"} aria-label="Пример переключателя" />),
  ui("checkbox", "UI · чекбокс", "Checkbox", ["off", "on", "disabled"], variant => <Checkbox key={variant} defaultChecked={variant === "on"} disabled={variant === "disabled"} aria-label="Пример чекбокса" />),
  composite("step", "Шаг установки", "Step", ["01", "02"], variant => <Step num={variant} title={variant === "01" ? "Установи расширение" : <>Оцени промпт <InlinePlanet /></>} desc="Текст и графика соединяются в одном шаге инструкции." />, ["InlinePlanet"], "Номер, заголовок, встроенная иконка и описание."),
  composite("privacy-item", "Пункт приватности", "PrivacyItem", ["divider", "last"], variant => <PrivacyItem title="Твои данные — только твои" desc="Текстовое семейство из секции приватности главной страницы." last={variant === "last"} />, ["InlineStars"], "Варианты с разделителем и последний пункт."),
  composite("feature-card", "Карточка возможности", "FeatureCard", ["1", "2", "3", "4"], variant => <FeatureDemo variant={variant} />, ["Picture"], "Все четыре изображения и порядка текста/медиа из главной страницы."),
  composite("plan-card", "Тарифная карточка", "PlanCard", ["free", "pro"], variant => <PlanDemo variant={variant} />, ["Accent"], "Тёмная и акцентная поверхность. Текст и цена берутся из текущих переводов."),
  composite("blog-card", "Карточка статьи", "BlogPostCard", ["default"], () => <BlogDemo />, ["ResponsiveImage", "LocalizedLink"], "Реальная статья: обложка, категория, заголовок, описание, дата.", "src/app/components/BlogPostCard.tsx"),
  composite("lesson-card", "Карточка урока", "LearnLessonCard", ["compact", "description"], variant => <LearnDemo description={variant === "description"} />, ["ResponsiveImage", "LocalizedLink"], "Два существующих варианта карточки Learn.", "src/app/components/space/learn/LearnLessonCard.tsx"),
  composite("workbench", "Генератор промптов", "PromptWorkbench", ["default"], () => <PromptWorkbench preview />, ["CopyPromptIcon"], "Выбор типа/модели, ввод, копирование и фото работают; ИИ-запрос отключён в витрине.", "src/app/components/PromptWorkbench.tsx"),
  composite("faq", "FAQ", "FaqBlock", ["default"], () => <FaqBlock id="catalog-faq" items={[{ q: "Как устроена библиотека?", a: "Здесь подключены текущие компоненты проекта. Стили обновляются вместе с исходниками." }]} />, [], "Нынешний FAQ — открытый список вопросов и ответов.", "src/app/components/FaqBlock.tsx"),
  composite("header", "Шапка сайта", "SiteHeader", ["default"], () => <><SiteHeader /><div style={{ height: 88 }} /></>, ["LangSwitcher", "CurrencySwitcher", "HeaderMobileMenu"], "Внутри отдельного viewport: мобильное меню и desktop-навигация.", "src/app/components/SiteHeader.tsx"),
  composite("footer", "Футер и зелёный градиент", "SiteFooter", ["full", "linksOnly"], variant => <SiteFooter variant={variant as "full"} />, ["InstallButton", "LocalizedLink"], "Рабочий CSS-градиент из сайта, полная и компактная версии.", "src/app/components/SiteFooter.tsx"),
  composite("features", "Главная · возможности", "FeatureCards", ["default"], () => <FeatureCards />, ["FeatureCard", "SectionTitle", "InstallButton"], "Целая секция с текущими текстами, декорацией и четырьмя карточками."),
  composite("hero", "Главная · Hero и генератор", "Hero", ["default"], () => <Hero preview />, ["Accent", "PromptWorkbench", "AiAccessButton"], "Первый экран главной с текущим заголовком, акцентом и CTA. ИИ-запрос отключён в витрине."),
  composite("partners", "Главная · установка и партнёры", "Partners", ["default"], () => <Partners />, ["Step", "PartnerLogo", "SoonBadge", "InstallButton"], "Целая секция с логотипами и иллюстрацией popup."),
  composite("privacy", "Главная · приватность", "Privacy", ["default"], () => <Privacy />, ["PrivacyItem"], "Секция с асимметричной desktop-композицией."),
  composite("pricing", "Главная · тарифы", "Pricing", ["default"], () => <Pricing />, ["PlanCard", "SectionTitle"], "Целая секция тарифов из текущего сайта."),
  { ...ui("tabs", "UI · вкладки", "Tabs", ["default"], () => <Tabs defaultValue="one"><TabsList><TabsTrigger value="one">Первая</TabsTrigger><TabsTrigger value="two">Вторая</TabsTrigger></TabsList><TabsContent value="one">Содержимое первой вкладки</TabsContent><TabsContent value="two">Содержимое второй вкладки</TabsContent></Tabs>), level: "composite" },
  { ...ui("dialog", "UI · диалог", "Dialog", ["default"], () => <Dialog><DialogTrigger asChild><Button>Открыть диалог</Button></DialogTrigger><DialogContent><DialogTitle>Пример диалога</DialogTitle><DialogDescription>Существующий Radix Dialog. Закройте крестиком или Escape.</DialogDescription></DialogContent></Dialog>), level: "composite" },
  { ...ui("accordion", "UI · аккордеон", "Accordion", ["default"], () => <Accordion type="single" collapsible><AccordionItem value="one"><AccordionTrigger>Раскрыть пример</AccordionTrigger><AccordionContent>Содержимое существующего UI-компонента.</AccordionContent></AccordionItem></Accordion>), level: "composite" },
];
