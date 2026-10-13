import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { ArrowUpRight, Blocks, BookOpen, Check, ChevronRight, Code2, Copy, Download, FileText, Image, Layers, LayoutDashboard, Menu, Monitor, Palette, Search, ShieldCheck, Sparkles, Type, X } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import website from "./generated/website.json";
import extension from "./generated/extension.json";
import { catalogIcons } from "./generated/icons";
import { websiteDemos, type WebsiteDemo } from "./catalog";
import WebsiteFrame from "./WebsiteFrame";
import ExtensionSpecimen from "./ExtensionSpecimen";
import designDocument from "../../DESIGN.md?raw";
import integrationDocument from "../../docs/INTEGRATION-CONTRACT.md?raw";
import techDocument from "../../docs/TECH.md?raw";
import pageWorkflowDocument from "../../docs/page-workflow/README.md?raw";
import creativeDirectorDocument from "../../docs/page-workflow/02-CREATIVE-DIRECTOR.md?raw";
import startPageDocument from "../../docs/page-workflow/03-START-PAGE.md?raw";
import mediaProtocolDocument from "../../docs/page-workflow/MEDIA-PROTOCOL.md?raw";
import MarkdownDocument from "./MarkdownDocument";
import "./workspace.css";

const TelegramArchive = lazy(() => import("../app/pages/admin/AdminTelegramArchive"));
type Surface = "website" | "extension";
const sections = [
  { id: "colors", label: "Цвета", icon: Palette },
  { id: "typography", label: "Шрифты и текст", icon: Type },
  { id: "effects", label: "Геометрия и эффекты", icon: Sparkles },
  { id: "icons", label: "Иконки", icon: Blocks },
  { id: "elements", label: "Мелкие компоненты", icon: Code2 },
  { id: "components", label: "Крупные компоненты", icon: Layers },
  { id: "images", label: "Изображения", icon: Image },
  { id: "coverage", label: "Покрытие библиотеки", icon: Check },
] as const;
const figureUrl = "https://www.figma.com/design/KRDykjGReot4r3lvb1u6Ju/Opten--2-?node-id=3613-17";
const matches = (query: string, ...values: unknown[]) => values.join(" ").toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"));
const date = (value: string) => new Date(value).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function AdminWorkspace({ preview, accessToken, email }: { preview: boolean; accessToken: string; email: string | null }) {
  const location = useLocation(); const { lang, setLang } = useLang();
  const [group, rawSection] = location.hash.slice(1).split("/");
  const surface: Surface = group === "extension" ? "extension" : "website";
  const section = group === "project" && ["overview", "docs", "telegram"].includes(rawSection) ? rawSection : sections.some(item => item.id === rawSection) ? rawSection : "overview";
  const [query, setQuery] = useState(""); const [menu, setMenu] = useState(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => { setQuery(""); setMenu(false); window.scrollTo({ top: 0, left: 0, behavior: "auto" }); }, [location.hash]);
  const href = (groupName: string, id: string) => `/admin${location.search}#${groupName}/${id}`;
  const heading = section === "overview" ? "Библиотека проекта" : section === "docs" ? "Документация" : section === "telegram" ? "Архив Telegram" : sections.find(item => item.id === section)?.label || "Библиотека";
  const data = surface === "website" ? website : extension;
  const getCount = (id: string) => {
    if (id === "colors") return surface === "website" ? website.colors.length : extension.variables.length;
    if (id === "typography") return data.typography.length;
    if (id === "effects") return data.effects.length;
    if (id === "icons") return surface === "website" ? website.icons.length : extension.assets.filter(item => item.format === "svg").length;
    if (id === "images") return data.assets.filter(item => item.format !== "woff2").length;
    if (id === "coverage") return surface === "website" ? website.components.length : extension.demos.length;
    return (surface === "website" ? websiteDemos : extension.demos).filter(item => item.level === (id === "elements" ? "primitive" : "composite")).length;
  };
  return <div className="opten-workspace">
    <a className="ds-skip" href="#workspace-content">К содержимому</a>
    {menu && <button className="ds-backdrop" aria-label="Закрыть навигацию" onClick={() => setMenu(false)} />}
    <aside className={`ds-sidebar ${menu ? "is-open" : ""}`}>
      <Link className="ds-brand" to={href("project", "overview")}><img src="/logo.svg" alt="Opten" width="62" height="20" /><span>Admin</span><span className="ds-owner"><ShieldCheck size={11} /> owner</span></Link>
      <div className="ds-sidebar-scroll">
        <p className="ds-nav-label">Проект</p>
        <nav aria-label="Разделы проекта">
          <NavLink to={href("project", "overview")} active={section === "overview"} icon={<LayoutDashboard size={17} />}>Обзор</NavLink>
          <NavLink to={href("project", "docs")} active={section === "docs"} icon={<BookOpen size={17} />}>Документация</NavLink>
        </nav>
        <p className="ds-nav-label ds-library-label">Библиотека компонентов</p>
        <div className="ds-surface-switch" role="group" aria-label="Интерфейс библиотеки">
          <Link to={href("website", section === "overview" || section === "docs" || section === "telegram" ? "colors" : section)} aria-current={surface === "website" ? "true" : undefined}><Monitor size={15} /> Сайт</Link>
          <Link to={href("extension", section === "overview" || section === "docs" || section === "telegram" ? "colors" : section)} aria-current={surface === "extension" ? "true" : undefined}><Blocks size={15} /> Расширение</Link>
        </div>
        <nav aria-label={`Библиотека: ${surface === "website" ? "сайт" : "расширение"}`}>
          {sections.map(item => <NavLink key={item.id} to={href(surface, item.id)} active={section === item.id} icon={<item.icon size={17} />} count={getCount(item.id)}>{item.label}</NavLink>)}
        </nav>
        <p className="ds-nav-label ds-library-label">История</p>
        {preview ? <p className="ds-archive-disabled">Архив Telegram доступен<br />после входа владельца</p> : <NavLink to={href("project", "telegram")} active={section === "telegram"} icon={<FileText size={17} />}>Архив Telegram</NavLink>}
      </div>
      <footer className="ds-sidebar-footer"><span className="ds-status-dot" /><div><strong>{preview ? "Локальная витрина" : "Аккаунт владельца"}</strong><span title={email || undefined}>{email || "Просмотр дизайн-системы"}</span></div><Link to="/" aria-label="Открыть сайт"><ArrowUpRight size={18} /></Link></footer>
    </aside>
    <div className="ds-workarea">
      <header className="ds-topbar"><div><button className="ds-menu-toggle" onClick={() => setMenu(value => !value)} aria-expanded={menu} aria-label="Навигация">{menu ? <X size={21} /> : <Menu size={21} />}</button><span>Opten</span><ChevronRight size={13} /><strong>{section === "docs" || section === "overview" || section === "telegram" ? "Проект" : surface === "website" ? "Сайт" : "Расширение"}</strong></div><div><span className="ds-preview-tag">{preview ? "DEV PREVIEW" : "OWNER WORKSPACE"}</span><a href={figureUrl} target="_blank" rel="noreferrer">Figma <ArrowUpRight size={13} /></a></div></header>
      <main className="ds-main" id="workspace-content" ref={main} tabIndex={-1}>
        <div className="ds-content">
          <div className="ds-page-heading"><div><p className="ds-eyebrow">{section === "overview" ? "OPTEN / DESIGN SYSTEM" : section === "docs" ? "PROJECT / GUIDELINES" : surface === "website" ? "WEBSITE / LIBRARY" : "EXTENSION / LIBRARY"}</p><h1>{heading}</h1><p>{section === "overview" ? "Визуальная основа, реальные компоненты и правила развития Opten." : section === "docs" ? "Контекст проекта и правила, к которым можно вернуться в любой момент." : section === "telegram" ? "Исторические данные остановленного бота." : surface === "website" ? "Образцы и значения из текущего сайта. Главная страница задаёт визуальный язык." : `Снимок расширения v${extension.version} · ${extension.revision}. Собственные стили и компоненты popup.`}</p></div></div>
          {!['overview','docs','telegram'].includes(section) && <div className="ds-toolbar"><label className="ds-search"><Search size={17} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Найти по названию или исходнику" aria-label="Поиск в текущем разделе" />{query && <button aria-label="Очистить поиск" onClick={() => setQuery("")}><X size={15} /></button>}</label><div className="ds-toolbar-actions"><div className="ds-locale" role="group" aria-label="Язык образцов">{(["ru","en"] as const).map(value => <button key={value} onClick={() => setLang(value)} aria-pressed={lang === value}>{value.toUpperCase()}</button>)}</div><span className="ds-revision">Снимок {date(data.observedAt)}</span><button className="ds-icon-button" title="Скачать реестр" aria-label="Скачать реестр текущей библиотеки" onClick={() => downloadJson(data, `${surface}-inventory.json`)}><Download size={16} /></button></div></div>}
          {section === "overview" && <Overview href={href} />}
          {section === "docs" && <Documentation />}
          {section === "telegram" && (preview ? <Notice>Архивные операции доступны только после проверки владельца.</Notice> : <div className="ds-archive"><Suspense fallback={<Notice>Загружаем архив…</Notice>}><TelegramArchive /></Suspense></div>)}
          {section === "colors" && <Colors surface={surface} query={query} />}
          {section === "typography" && <Typography surface={surface} query={query} />}
          {section === "effects" && <Effects surface={surface} query={query} />}
          {section === "icons" && <Icons surface={surface} query={query} />}
          {section === "images" && <AssetGallery key={surface + query} surface={surface} query={query} />}
          {(section === "elements" || section === "components") && <ComponentGallery key={surface + section} surface={surface} query={query} level={section === "elements" ? "primitive" : "composite"} lang={lang} />}
          {section === "coverage" && <Coverage surface={surface} query={query} />}
          <footer className="ds-page-footer"><span>Opten · библиотека существующего продукта</span><span>Сайт и расширение развиваются вместе</span></footer>
        </div>
      </main>
    </div>
  </div>;
}

function NavLink({ to, active, icon, count, children }: { to: string; active: boolean; icon: ReactNode; count?: number; children: ReactNode }) { return <Link className="ds-nav-item" to={to} aria-current={active ? "page" : undefined}>{icon}<span>{children}</span>{count !== undefined && <small>{count}</small>}</Link>; }
function Notice({ children }: { children: ReactNode }) { return <div className="ds-notice">{children}</div>; }
function Source({ path }: { path: string }) { const [copied, setCopied] = useState(false); return <button className="ds-source" title="Скопировать путь к исходнику" onClick={() => { void navigator.clipboard.writeText(path).then(() => { setCopied(true); }).catch(() => setCopied(false)); }}>{copied ? <Check size={12} /> : <Copy size={12} />}<code>{path}</code></button>; }
function Empty() { return <Notice>Совпадений нет. Попробуйте другое название или исходник.</Notice>; }
function downloadJson(value: unknown, name: string) { const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url); }
function Overview({ href }: { href: (group: string, id: string) => string }) {
  return <>
    <section className="ds-cover"><div className="opten-footer-gradient" aria-hidden="true" /><div className="ds-cover-copy"><span className="ds-pill">Источник — текущий продукт</span><h2>Одна система.<br /><span>Два интерфейса.</span></h2><p>Сайт и расширение — части Opten.<br />У каждого свои компоненты, вместе — общий визуальный язык.</p><Link className="ds-primary-link" to={href("website", "components")}>Открыть компоненты <ArrowUpRight size={18} /></Link></div><div className="ds-cover-art" aria-hidden="true"><img src="/assets/landing-design/optenicon.svg" width="140" height="140" alt="" /><span>OPTEN</span><p>WEBSITE + EXTENSION</p></div></section>
    <div className="ds-surface-cards"><Link to={href("website", "colors")}><div className="ds-card-icon"><Monitor size={22} /></div><span className="ds-card-arrow"><ArrowUpRight size={20} /></span><h2>Сайт</h2><p>Unbounded + PT Root UI. Главная, Learn, блог и продуктовые страницы.</p><div className="ds-card-stats"><strong>{websiteDemos.length}<small>живых семейств</small></strong><strong>{website.typography.length}<small>текстовых ролей</small></strong><strong>{website.assets.length}<small>медиафайлов</small></strong></div></Link><Link to={href("extension", "elements")}><div className="ds-card-icon"><Blocks size={22} /></div><span className="ds-card-arrow"><ArrowUpRight size={20} /></span><h2>Расширение</h2><p>Inter. Popup, статусы, кредиты, ИИ-агрегаторы и быстрый режим.</p><div className="ds-card-stats"><strong>{extension.demos.length}<small>семейств</small></strong><strong>{extension.demos.reduce((sum, item) => sum + item.variants.length, 0)}<small>состояний</small></strong><strong>v{extension.version}<small>версия исходника</small></strong></div></Link></div>
    <h2 className="ds-section-heading">Основа для следующего шага</h2><div className="ds-foundation-grid">{sections.slice(0,7).map(item => <Link to={href("website", item.id)} key={item.id}><item.icon size={20} /><h3>{item.label}</h3><p>{item.id === "images" ? "Файлы, размеры и места использования" : item.id === "typography" ? "Семейства, роли и адаптивные размеры" : item.id === "effects" ? "Тени, градиенты, скругления и интервалы" : item.id === "components" ? "Карточки, секции и оболочки страниц" : item.id === "elements" ? "Кнопки, бейджи и поля" : item.id === "icons" ? "Реальные импорты и локальные SVG" : "Палитра и значения из исходников"}</p></Link>)}</div>
    <Notice>Библиотека фиксирует существующий интерфейс. Новая админка ожидает вашего просмотра. Образцы расширения — изолированный снимок HTML/CSS, без Chrome API и запросов.</Notice>
  </>;
}

function Colors({ surface, query }: { surface: Surface; query: string }) {
  const [all, setAll] = useState(false);
  const labels: Record<string,string> = { "#011417":"Основной фон сайта", "#0e2023":"Поверхность карточки", "#9cfb51":"Акцент Opten", "#ffffff":"Основной текст", "#fff":"Белый", "#0b2023":"Генератор промптов", "#07191c":"Поле промпта" };
  const items = surface === "website" ? website.colors.filter(item => matches(query,item.value,labels[item.value],item.sources)) : extension.variables.filter(item => matches(query,item.name,item.value));
  return <><Notice>{surface === "website" ? "Основные цвета главной показаны первыми. Остальная палитра отражает существующие страницы и состояния; значения стандартного UI-слоя перечислены отдельно." : "Переменные popup и цветовые состояния внедряемого интерфейса. Цветовая основа расширения отличается от сайта."}</Notice><div className="ds-token-grid">{(surface === "website" ? (all || query ? items : items.slice(0,24)) : items).map((item: any) => <article className="ds-token" key={item.name || item.value}><div className="ds-swatch" style={{ background: item.value }} /><h3>{item.name || labels[item.value] || "Наблюдаемый цвет"}</h3><code>{item.value}</code><Source path={item.source || item.sources[0]} /></article>)}</div>{items.length === 0 && <Empty />}{surface === "website" && !all && !query && <button className="ds-more" onClick={() => setAll(true)}>Показать всю палитру · {items.length}</button>}<details className="ds-details"><summary>{surface === "website" ? "CSS-переменные стандартного UI-слоя" : "CSS-правила цветовых состояний на сайтах"}</summary><div className="ds-rule-list">{(surface === "website" ? website.variables : extension.contentRules).filter(item => matches(query,JSON.stringify(item))).map((item: any, index) => <div key={index}><code>{item.name || item.selector}</code><pre>{item.value || JSON.stringify(item.properties,null,2)}</pre><Source path={item.source} /></div>)}</div></details></>;
}
function TypeSample({ name, className, style, source }: { name: string; className?: string; style?: CSSProperties; source: string }) {
  const ref = useRef<HTMLParagraphElement>(null); const [metrics, setMetrics] = useState("");
  useEffect(() => { const read = () => { if (!ref.current) return; const css = getComputedStyle(ref.current); setMetrics(`${css.fontFamily} · ${css.fontWeight} · ${css.fontSize} / ${css.lineHeight} · ${css.letterSpacing}`); }; read(); document.fonts.ready.then(read); window.addEventListener("resize",read); return () => window.removeEventListener("resize",read); }, [className, style]);
  return <article className="ds-type-sample"><div className="ds-sample-meta"><h3>{name}</h3><Source path={source} /></div><div className="ds-type-stage"><p ref={ref} className={className} style={style}>Сильный промпт<br />A better prompt</p></div><small>{metrics}</small>{className && <code>{className}</code>}</article>;
}
function Typography({ surface, query }: { surface: Surface; query: string }) {
  const list = surface === "website" ? website.typography.filter(item => matches(query,item.name,item.source,item.classes)) : extension.typography.filter(item => matches(query,item.selector,item.properties));
  return <>{surface === "website" ? <div className="ds-font-grid">{website.fonts.filter((font,index,all) => all.findIndex(other => other['font-family'] === font['font-family']) === index && matches(query,font['font-family'])).map(font => <article key={font['font-family']}><span className="ds-eyebrow">LOCAL / WOFF2</span><h2 style={{ fontFamily: font['font-family'] }}>{font['font-family'].replaceAll("'","")}</h2><p style={{ fontFamily: font['font-family'] }}>Аа Бб Вв · Aa Bb Cc · 0123456789</p><div className="ds-font-weights">{[400,500,600,700].map(weight => <span key={weight} style={{ fontFamily:font['font-family'],fontWeight:weight }}>{weight}</span>)}</div><code>weight {font['font-weight']} · {font['font-display']}</code><Source path={font.source} /></article>)}</div> : <Notice>Inter · собственные локальные Latin/Cyrillic WOFF2 · переменный диапазон 100–900. CSS и файлы шрифта включены в снимок. Размеры ниже извлечены из popup.css.</Notice>}<h2 className="ds-section-heading">Роли и сочетания</h2><p className="ds-muted">Метрики под образцом измеряются в браузере. Responsive-классы и значения остаются привязаны к исходнику.</p><div className="ds-stack">{list.map((item: any) => <TypeSample key={item.id} name={item.name || item.selector} className={item.classes} source={`${item.source}${item.line ? ':'+item.line : ''}`} style={item.properties ? { fontFamily:"Inter,sans-serif",fontSize:item.properties['font-size'],fontWeight:item.properties['font-weight'],lineHeight:item.properties['line-height'],letterSpacing:item.properties['letter-spacing'],color:item.properties.color?.startsWith("var(") ? "white" : item.properties.color } : undefined} />)}</div>{list.length === 0 && <Empty />}</>;
}
const cssValue = (value: string) => value.slice(value.indexOf("[")+1,-1).replaceAll("_"," ");
function Effects({ surface, query }: { surface: Surface; query: string }) {
  const list = surface === "website" ? website.effects.filter(item => matches(query,item.value,item.sources)) : extension.effects.filter(item => matches(query,item.selector,JSON.stringify(item.properties)));
  return <>{surface === "website" && matches(query,"градиент gradient footer green") && <article className="ds-gradient-sample"><div className="opten-footer-gradient" aria-hidden="true" /><div><span className="ds-eyebrow">LIVE / PRODUCTION CSS</span><h2>Зелёный градиент Opten</h2><p>Несколько слоёв CSS из настоящего футера.</p><Source path="src/styles/theme.css · .opten-footer-gradient" /></div></article>}<h2 className="ds-section-heading">Тени и состояния</h2><div className="ds-token-grid">{list.map((item: any,index) => <article className="ds-token" key={index}><div className="ds-effect-stage"><div style={item.value ? { boxShadow:cssValue(item.value) } : { boxShadow:item.properties['box-shadow'], borderRadius:item.properties['border-radius'], transition:item.properties.transition }} /></div><code>{item.value || item.selector}</code>{item.properties && <pre>{JSON.stringify(item.properties,null,2)}</pre>}<Source path={item.source || item.sources[0]} /></article>)}</div>{list.length === 0 && query && <Empty />}{surface === "website" && <details className="ds-details" open><summary>Скругления, сетка и интервалы · значения из классов</summary><div className="ds-token-grid">{website.geometry.filter(item => matches(query,item.value,item.sources)).map(item => <article className="ds-token" key={item.value}><div className="ds-effect-stage"><div style={item.value.startsWith("rounded") ? { borderRadius:cssValue(item.value) } : { width: Math.min(180,parseInt(cssValue(item.value)) || 16),height:12 }} /></div><code>{item.value}</code><Source path={item.sources[0]} /></article>)}</div></details>}</>;
}
function Icons({ surface, query }: { surface: Surface; query: string }) {
  const list = surface === "website" ? website.icons.filter(item => matches(query,item.name,item.library,item.sources)) : extension.assets.filter(item => item.format === "svg" && matches(query,item.name,item.source));
  return <><Notice>{surface === "website" ? "Lucide React — фактически импортированные имена. MUI установлен в проекте, текущих импортов иконок MUI не найдено. Брендовые и Figma SVG находятся также в разделе изображений." : "Локальные SVG popup и семейства статусных иконок: Default, Green, Yellow, Red, Loading; версии с тенями и без."}</Notice><div className="ds-icon-grid">{list.map((item: any,index) => { const Icon = (catalogIcons as Record<string,React.ComponentType<any>>)[item.name]; return <article key={index}><div className="ds-icon-sizes">{item.src ? <img src={item.src} alt={item.name} width="48" height="48" loading="lazy" /> : Icon ? <><Icon size={16} /><Icon size={24} /><Icon size={32} /></> : <Code2 size={24} />}</div><h3>{item.name}</h3><small>{item.library || item.source}</small><Source path={item.source || item.sources[0]} /></article>; })}</div>{list.length === 0 && <Empty />}</>;
}

function AssetGallery({ surface, query }: { surface: Surface; query: string }) {
  const [family,setFamily] = useState("all"); const [limit,setLimit] = useState(24);
  const assets = (surface === "website" ? website.assets : extension.assets).filter(item => item.format !== "woff2");
  const families = [...new Set(assets.map(item => item.family))].sort();
  const visible = assets.filter(item => (family === "all" || item.family === family) && matches(query,item.name,item.family,item.src,"sources" in item ? item.sources : item.source));
  const sorted = [...visible].sort((a,b) => Number(b.family === "landing-design") - Number(a.family === "landing-design"));
  return <><div className="ds-family-filter"><label>Семейство <select value={family} onChange={event => {setFamily(event.target.value);setLimit(24);}}><option value="all">Все семейства</option>{families.map(value => <option key={value} value={value}>{value}</option>)}</select></label><span>{visible.length} файлов</span></div><Notice>{surface === "website" ? "Изображения главной — часть визуального кода: продуктовые интерфейсы, RU/EN пары, планета, звёзды и рукописные акценты. Файлы отмечены как уже существующие; новое согласование не предполагается." : "Копии локальных медиа из расширения, с SHA-256 в экспортируемом реестре. Оригиналы остаются в promptscore."}</Notice><div className="ds-asset-grid">{sorted.slice(0,limit).map(item => <article key={item.id}><a className={`ds-asset-preview ${item.format === "svg" ? "is-svg" : ""}`} href={item.src} target="_blank" rel="noreferrer"><img src={item.src} alt={item.name} width={item.width || 300} height={item.height || 180} loading="lazy" /></a><div className="ds-asset-info"><span className="ds-pill">{item.family}</span><h3>{item.name}</h3><small>{item.width || "?"} × {item.height || "?"} · {Math.round(item.bytes/1024)} KB · {item.format.toUpperCase()}</small><Source path={"source" in item ? item.source : `public${item.src}`} />{"sources" in item && <details><summary>Ссылки в исходниках · {item.sources.length}</summary>{item.sources.length ? item.sources.map(source => <Source key={source} path={source} />) : <p>Прямое упоминание имени файла не найдено. Это не основание удалять файл.</p>}</details>}</div></article>)}</div>{visible.length === 0 && <Empty />}{limit < visible.length && <button className="ds-more" onClick={() => setLimit(value => value+24)}>Показать ещё · {visible.length-limit}</button>}{surface === "website" && <Notice>Обложки YouTube в Learn остаются живыми удалёнными URL. Для видео используется внешний источник; локальные копии обложек не создаются.</Notice>}</>;
}
function WebsiteSpecimen({ demo }: { demo: WebsiteDemo }) {
  const [variant,setVariant] = useState(demo.variants[0]); const [width,setWidth] = useState(demo.level === "primitive" ? 390 : 768); const [open,setOpen] = useState(demo.level === "primitive" || ["feature-card","blog-card","lesson-card"].includes(demo.id));
  return <article className="ds-demo"><header><div><span className="ds-pill">{demo.scaffold ? "UI-слой" : "Живой компонент"}</span><h2>{demo.title}</h2><code>{demo.symbol}</code></div><button className="ds-demo-toggle" aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? "Свернуть" : "Открыть образец"}<ChevronRight size={16} /></button></header><p>{demo.note}</p><Source path={demo.source} />{open && <><div className="ds-demo-controls"><label>Вариант <select value={variant} onChange={event => setVariant(event.target.value)}>{demo.variants.map(value => <option key={value}>{value}</option>)}</select></label><label>Viewport <select value={width} onChange={event => setWidth(Number(event.target.value))}>{[360,390,768,1200].map(value => <option key={value} value={value}>{value} px</option>)}</select></label><span>Наведение · фокус · взаимодействия</span></div><WebsiteFrame width={width} title={demo.title}>{<div style={{ padding: ["hero","features","partners","privacy","pricing","header","footer"].includes(demo.id) ? 0 : 24 }} className={demo.scaffold ? "dark" : ""}>{demo.render(variant)}</div>}</WebsiteFrame></>}{demo.parts.length > 0 && <footer className="ds-demo-parts"><span>Состав</span>{demo.parts.map(part => <code key={part}>{part}</code>)}</footer>}</article>;
}
function ExtensionDemoCard({ demo, lang }: { demo: typeof extension.demos[number]; lang: "ru" | "en" }) { const [variant,setVariant] = useState(demo.variants[0]); return <article className="ds-demo"><header><div><span className="ds-pill">HTML/CSS · снимок</span><h2>{demo.title}</h2><code>{demo.selector}</code></div></header><Source path={`promptscore/${demo.source} · ${demo.selector}`} /><div className="ds-demo-controls"><label>Состояние <select value={variant} onChange={event => setVariant(event.target.value)}>{demo.variants.map(value => <option key={value}>{value}</option>)}</select></label><span>420 px · {lang.toUpperCase()}</span></div><ExtensionSpecimen demo={demo} variant={variant} lang={lang} /></article>; }
function ComponentGallery({ surface, query, level, lang }: { surface: Surface; query: string; level: string; lang: "ru" | "en" }) { const list = (surface === "website" ? websiteDemos : extension.demos).filter(item => item.level === level && matches(query,item.title,item.source,"symbol" in item ? item.symbol : item.selector)); return <><p className="ds-muted">{surface === "website" ? "Импортированные компоненты сохраняют собственный CSS. Размер viewport меняет настоящие media queries; у крупных семейств образец открывается отдельно." : "Переключайте состояния в панели образца. Снимки не запускают auth, Chrome API и платные операции."}</p><div className="ds-stack">{list.map(item => surface === "website" ? <WebsiteSpecimen key={item.id} demo={item as WebsiteDemo} /> : <ExtensionDemoCard key={item.id} demo={item as typeof extension.demos[number]} lang={lang} />)}</div>{list.length === 0 && <Empty />}</>; }
function Coverage({ surface, query }: { surface: Surface; query: string }) {
  if (surface === "extension") return <><Notice>Снимок содержит {extension.demos.length} семейств и {extension.demos.reduce((sum,item) => sum+item.variants.length,0)} состояний. Полный popup-runtime и интеграции с агрегаторами в браузере здесь не запускаются. Внедряемый интерфейс покрыт CSS и SVG; поведение проверяется в самом расширении.</Notice><div className="ds-rule-list">{Object.entries(extension.sourceHashes).filter(([source]) => matches(query,source)).map(([source,value]) => <div key={source}><Source path={`promptscore/${source}`} /><code>{value}</code></div>)}</div></>;
  const list = website.components.filter(item => matches(query,item.name,item.source,item.usages));
  return <><Notice>Реестр компонентных файлов шире витрины. «Импорт найден» означает ссылку в исходнике, а не доказательство видимости на каждой странице. Каталог не объявляет все установленные UI-примитивы частью маркетингового дизайна.</Notice><div className="ds-coverage-table"><div className="ds-coverage-row ds-coverage-head"><span>Компонент / исходник</span><span>Витрина</span><span>Использование</span></div>{list.map(item => { const demo = websiteDemos.find(demo => demo.source === item.source); return <div className="ds-coverage-row" key={item.id}><div><strong>{item.name}</strong><Source path={item.source} /></div><span className={`ds-pill ${demo ? "is-live" : ""}`}>{demo ? "Есть образец" : "Реестр"}</span><details><summary>{item.used ? `${item.usages.length} ссылок` : "Не найдено"}</summary>{item.usages.map(source => <Source key={source} path={source} />)}</details></div>; })}</div>{list.length === 0 && <Empty />}</>;
}
function Documentation() {
  const [selected,setSelected] = useState("design");
  const docs = [
    { id:"design",title:"Дизайн-система",source:"DESIGN.md",text:designDocument },
    { id:"workflow",title:"Новые страницы",source:"docs/page-workflow/README.md",text:pageWorkflowDocument },
    { id:"director",title:"Креативный директор",source:"docs/page-workflow/02-CREATIVE-DIRECTOR.md",text:creativeDirectorDocument },
    { id:"builder",title:"Сборка страницы",source:"docs/page-workflow/03-START-PAGE.md",text:startPageDocument },
    { id:"media",title:"Медиа-протокол",source:"docs/page-workflow/MEDIA-PROTOCOL.md",text:mediaProtocolDocument },
    { id:"integration",title:"Контракт интеграции",source:"docs/INTEGRATION-CONTRACT.md",text:integrationDocument },
    { id:"tech",title:"Технологии проекта",source:"docs/TECH.md",text:techDocument },
  ];
  const document = docs.find(item => item.id === selected)!;
  return <><div className="ds-guidelines"><article><span>01</span><h2>Начинай с главной</h2><p>Её типографика, графика, цвета и ритм — основа новых страниц сайта. У popup своя система.</p></article><article><span>02</span><h2>Собирай из компонентов</h2><p>Используй реальные импорты и существующие варианты. Новые семейства добавляй вместе с образцом.</p></article><article><span>03</span><h2>Сверяй с рендером</h2><p>Проверяй шрифты, переносы, изображения, состояния и адаптив. Снимок исходника не заменяет просмотр.</p></article></div><Notice>Текущий стек: React 18 + TypeScript + Vite 6 + Tailwind 4. Из Project Setup взяты организация, источники, витрина и реестры. Astro и ограничения клиентского шаблона сюда не перенесены.</Notice><div className="ds-doc-tabs" role="group" aria-label="Документ">{docs.map(item => <button key={item.id} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id}>{item.title}</button>)}</div><article className="ds-document"><header><h2>{document.title}</h2><Source path={document.source} /></header><MarkdownDocument text={document.text} /></article><div className="ds-rule-list"><div><h3>Обновить реестр сайта</h3><code>npm run sync:design-system</code></div><div><h3>Обновить снимок расширения</h3><code>npm run sync:design-system -- --extension C:\Projects\promptscore</code></div><div><h3>Проверить сборку</h3><code>npm run build</code></div><div><h3>Синхронизировать инструкции</h3><code>npm run sync:agents</code></div></div></>;
}
