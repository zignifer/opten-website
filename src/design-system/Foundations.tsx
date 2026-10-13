import { useState, type CSSProperties } from "react";
import website from "./generated/website.json";
import extension from "./generated/extension.json";
import coreColors from "./color-roles.json";
import { Empty, matches, Notice, Source } from "./CatalogPrimitives";

type Surface = "website" | "extension";
type Usage = { source: string; line: number; component: string; element: string; property: string; expression: string };
type Token = { value: string; sources: string[]; usages: Usage[] };
type Intent = { group: string; name: string; note: string };

const propertyNames: Record<string, string> = { background: "Фон", backgroundColor: "Фон", color: "Текст", "border-color": "Граница", borderColor: "Граница", "focus-ring": "Фокус", fill: "Заливка SVG", stroke: "Контур SVG", stopColor: "Градиент SVG", "box-shadow": "Тень", decoration: "Декор" };
const componentNames: Record<string, string> = { Hero: "главная · Hero", FeatureCard: "карточка возможности", PlanCard: "тарифная карточка", Step: "шаг установки", InstallButton: "кнопка установки", PromptWorkbench: "генератор", LearnLessonCard: "карточка урока", BlogPostCard: "карточка статьи", CoursePurchaseCard: "форма покупки курса", AccountPage: "аккаунт", PayPage: "оплата", PromptLibraryPage: "библиотека промптов", SpaceHeader: "шапка Space" };
const technical = (source: string) => /src\/(?:imports\/|styles\/theme\.css)|\/components\/ui\//.test(source);
const bestUsage = (item: Token) => item.usages.find(usage => !technical(usage.source)) || item.usages[0];
function intent(item: Token): Intent {
  if ((coreColors as Record<string,Intent>)[item.value]) return coreColors[item.value];
  const usage = bestUsage(item);
  if (item.sources.every(technical)) return { group: "technical", name: propertyNames[usage?.property] || "Значение UI-слоя", note: "Переменная стандартного UI или исходный Figma-импорт. Не новая роль палитры Opten." };
  const platform = item.usages.find(usage => /ChromeIcon|GoogleIcon|YandexIcon/.test(usage.component));
  if (platform) return { group: "platforms", name: `Цвет логотипа ${platform.component.includes("Chrome") ? "Chrome" : platform.component.includes("Google") ? "Google" : "Yandex"}`, note: "Собственная палитра платформы внутри SVG. Не использовать как цвет состояния Opten. Все найденные применения раскрываются ниже." };
  const role = propertyNames[usage?.property] || usage?.property || "CSS";
  return { group: usage?.property === "background" ? "surfaces" : "local", name: `${role} · ${componentNames[usage?.component] || usage?.component}`, note: "Локальное значение существующего компонента. Его область применения зафиксирована в исходниках ниже." };
}
function UsageList({ item }: { item: Token }) {
  const usage = bestUsage(item);
  return <div className="ds-token-usage">
    {usage && <p><strong>{componentNames[usage.component] || usage.component}</strong> · {propertyNames[usage.property] || usage.property}<br /><code>{usage.expression}</code></p>}
    <Source path={usage ? `${usage.source}:${usage.line}` : item.sources[0]} />
    <details><summary>Где и как применяется · {item.sources.length} файлов</summary>
      {item.usages.map((entry, index) => <div className="ds-usage-entry" key={index}><strong>{componentNames[entry.component] || entry.component} · {entry.element}</strong><code>{entry.expression}</code><Source path={`${entry.source}:${entry.line}`} /></div>)}
      {item.sources.filter(source => !item.usages.some(usage => usage.source === source)).map(source => <Source key={source} path={source} />)}
    </details>
  </div>;
}
const colorGroups = [
  { id: "core", title: "01 · Основа Opten", note: "Начните с этих ролей при сборке страницы." },
  { id: "states", title: "02 · Состояния и обратная связь", note: "Наведение, фокус, ошибки и опасные действия. У каждого цвета своя область применения." },
  { id: "platforms", title: "03 · Цвета платформ", note: "Красный, жёлтый и синий внутри Chrome/Google принадлежат логотипам. Они не задают статусы интерфейса." },
  { id: "surfaces", title: "04 · Дополнительные поверхности", note: "Оттенки отдельных экранов и компонентов. Подпись указывает конкретный источник." },
  { id: "local", title: "05 · Локальные акценты и декор", note: "Фильтры, иллюстрации, специализированный текст и отдельные экраны." },
  { id: "technical", title: "Технический UI-слой и старые импорты", note: "Справочные значения исходного UI-слоя; не переносите их автоматически в новую страницу." },
];
export function Colors({ surface, query }: { surface: Surface; query: string }) {
  if (surface === "extension") return <ExtensionColors query={query} />;
  const order = Object.keys(coreColors);
  const items = website.colors.map(item => ({ item, role: intent(item) })).filter(({item,role}) => matches(query,item.value,role.name,role.note,item.sources,JSON.stringify(item.usages))).sort((a,b)=>(order.indexOf(a.item.value)===-1?999:order.indexOf(a.item.value))-(order.indexOf(b.item.value)===-1?999:order.indexOf(b.item.value)));
  return <><Notice>Роль цвета важнее его оттенка. Ниже указаны назначение, реальный компонент, CSS-свойство и место в исходнике. Палитра платформ и технические значения вынесены отдельно.</Notice>
    {colorGroups.map(group => { const entries = items.filter(entry => entry.role.group === group.id); if (!entries.length) return null;
      const content = <><p className="ds-muted">{group.note}</p><div className="ds-token-grid">{entries.map(({item,role}) => <article className="ds-token ds-explained-token" key={item.value}><div className="ds-swatch" style={{background:item.value}} /><h3>{role.name}</h3><code>{item.value.toUpperCase()}</code><p className="ds-token-description">{role.note}</p><UsageList item={item} /></article>)}</div></>;
      return group.id === "technical" ? <details className="ds-details" key={group.id} open={Boolean(query)}><summary>{group.title} · {entries.length}</summary>{content}</details> : <section className="ds-foundation-section" key={group.id}><h2 className="ds-section-heading">{group.title}</h2>{content}</section>;
    })}
    {!items.length && <Empty />}
    <details className="ds-details"><summary>CSS-переменные стандартного UI-слоя</summary><p className="ds-muted">Имена primary, chart и destructive здесь принадлежат базовому UI-слою. Наличие переменной не означает использование в маркетинговом интерфейсе.</p><div className="ds-rule-list">{website.variables.filter(item => matches(query,item.name,item.value)).map(item => <div key={item.name}><code>{item.name}</code><pre>{item.value}</pre><Source path={item.source} /></div>)}</div></details>
  </>;
}
function ExtensionColors({ query }: { query: string }) {
  const groups = [{name:"Фон и поверхности popup",match:/bg|background/},{name:"Текст",match:/text|muted/},{name:"Границы",match:/border/},{name:"Акценты и состояния",match:/accent|green|red|yellow|blue|error|success|warning/}];
  const roles: Record<string,string> = { "--ps-popup-bg":"Основной фон popup", "--ps-popup-header-bg":"Фон шапки popup", "--ps-popup-text":"Основной текст", "--ps-popup-muted":"Приглушённый текст · 30% белого", "--ps-popup-border":"Внешняя граница popup", "--ps-popup-border-inner":"Границы внутренних блоков" };
  const entries = extension.variables.filter(item => matches(query,item.name,item.value,roles[item.name]));
  return <><Notice>Это отдельная палитра расширения. Переменная определяет роль, а CSS-правила ниже показывают, где она используется. Числовые переменные прозрачности не являются отдельными цветами.</Notice>{[...groups,{name:"Другие переменные popup",match:/$a/}].map((group,index) => { const list = entries.filter(item => index === groups.length ? !groups.some(g=>g.match.test(item.name)) : group.match.test(item.name) && !groups.slice(0,index).some(g=>g.match.test(item.name))); if (!list.length) return null; return <section key={group.name}><h2 className="ds-section-heading">{group.name}</h2><div className="ds-token-grid">{list.map(item=><article className="ds-token" key={item.name}><div className="ds-swatch" style={{background:item.value}} /><h3>{roles[item.name] || group.name}</h3><code>{item.name} · {item.value}</code><Source path={`promptscore/${item.source}`} /><details className="ds-token-usage"><summary>Применение переменной</summary>{extension.rules.filter(rule=>Object.values(rule.properties).some(value=>value.includes(`var(${item.name}`))).slice(0,8).map((rule,i)=><div className="ds-usage-entry" key={i}><strong>{rule.selector}</strong><pre>{JSON.stringify(rule.properties,null,2)}</pre></div>)}</details></article>)}</div></section>; })}<details className="ds-details"><summary>Цветовые состояния внедряемого интерфейса</summary><p className="ds-muted">Зелёный, жёлтый и красный различают оценку промпта в интерфейсе агрегатора. Это CSS внедряемого UI, а не новые цвета сайта.</p><div className="ds-rule-list">{extension.contentRules.filter(item=>matches(query,item.selector,JSON.stringify(item.properties))).map((item,index)=><div key={index}><code>{item.selector}</code><pre>{JSON.stringify(item.properties,null,2)}</pre><Source path={`promptscore/${item.source}`} /></div>)}</div></details></>;
}
const stateLabel = (token: string) => {
  const labels: Record<string,string> = {sm:'От 640 px',md:'От 768 px',lg:'От 1024 px',xl:'От 1280 px','2xl':'От 1536 px',hover:'При наведении',focus:'При фокусе','focus-visible':'Клавиатурный фокус','focus-within':'Фокус внутри блока','group-hover':'Наведение на родителя',disabled:'Недоступный контрол',dark:'Тёмная тема'};
  return token.split(':').slice(0,-1).map(state=>labels[state]||state).join(' · ') || 'Базовое значение';
};
const shadowValue = (token: string) => token.includes('[') ? token.slice(token.indexOf('[')+1,-1).replaceAll('_',' ') : 'none';
function geometryInfo(token: string) {
  const bare = token.replace(/^(?:[\w-]+:)*/, '');
  const match = bare.match(/^(rounded(?:-[\w]+)?|p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|max-w|min-h|grid-cols)-(.+)$/)!;
  const prefix = match[1], raw = match[2].replace(/^\[|\]$/g, '').replaceAll('_',' ');
  const value = raw === 'full' ? prefix.startsWith('rounded') ? '9999px' : '100%' : raw === 'none' && prefix.startsWith('rounded') ? '0px' : /^\d+(?:\.\d+)?$/.test(raw) && prefix !== 'grid-cols' ? `${Number(raw)*4}px` : raw;
  const names: Record<string,string> = {p:"Внутри со всех сторон",px:"Внутри слева и справа",py:"Внутри сверху и снизу",pt:"Внутри сверху",pb:"Внутри снизу",pl:"Внутри слева",pr:"Внутри справа",m:"Снаружи со всех сторон",mx:"Снаружи слева и справа",my:"Снаружи сверху и снизу",mt:"Снаружи сверху",mb:"Снаружи снизу",ml:"Снаружи слева",mr:"Снаружи справа",gap:"Между соседними элементами","gap-x":"Между колонками","gap-y":"Между строками","space-x":"Между элементами по горизонтали","space-y":"Между элементами по вертикали","max-w":"Максимальная ширина блока","min-h":"Минимальная высота блока","grid-cols":"Колонки сетки"};
  const group = prefix.startsWith('rounded') ? 'radius' : prefix.startsWith('p') ? 'padding' : prefix.startsWith('m') && !['max-w','min-h'].includes(prefix) ? 'margin' : /gap|space/.test(prefix) ? 'gap' : 'layout';
  const name = group === 'radius' ? raw === 'full' ? 'Капсула / круг' : 'Радиус угла' : names[prefix] || prefix;
  const css: Record<string,string> = {p:'padding',px:'padding-inline',py:'padding-block',pt:'padding-top',pb:'padding-bottom',pl:'padding-left',pr:'padding-right',m:'margin',mx:'margin-inline',my:'margin-block',mt:'margin-top',mb:'margin-bottom',ml:'margin-left',mr:'margin-right',gap:'gap','gap-x':'column-gap','gap-y':'row-gap','space-x':'spacing between children','space-y':'spacing between children','max-w':'max-width','min-h':'min-height','grid-cols':'grid-template-columns'};
  const declaration = `${group === 'radius' ? 'border-radius' : css[prefix] || prefix}: ${prefix === 'grid-cols' && /^\d+$/.test(value) ? `repeat(${value}, minmax(0, 1fr))` : value}`;
  return {group,name,prefix,value,raw,declaration,state:stateLabel(token)};
}
function GeometryDiagram({ info }: { info: ReturnType<typeof geometryInfo> }) {
  const amount = Math.max(8,Math.min(32,parseFloat(info.value)||16));
  const directions: Record<string,string[]> = {x:['Left','Right'],y:['Top','Bottom'],t:['Top'],b:['Bottom'],l:['Left'],r:['Right'],s:['Left'],e:['Right']};
  const axes = directions[info.prefix.slice(1)] || ['Top','Right','Bottom','Left'];
  const spacing = Object.fromEntries(axes.map(side=>[`${info.group}${side}`,amount])) as CSSProperties;
  return <div className={`ds-geometry-diagram is-${info.group}`} aria-label={`${info.name}: ${info.value}`}>
    {info.group === 'radius' ? <div className="ds-radius-box" style={{borderRadius:info.value}}><span>{info.raw === 'full' ? 'Кнопка' : info.value}</span></div> :
      info.group === 'padding' ? <div className="ds-padding-box" style={spacing}><span>Контент</span></div> :
      info.group === 'margin' ? <div className="ds-margin-outline"><div style={spacing}>Блок</div></div> :
      info.group === 'gap' ? <div className="ds-gap-box" style={{gap:amount,flexDirection:/y$/.test(info.prefix)?'column':'row'}}><span>A</span><span>B</span></div> :
      info.prefix === 'grid-cols' ? <div className="ds-grid-box" style={{gridTemplateColumns:/^\d+$/.test(info.value)?`repeat(${info.value},minmax(0,1fr))`:info.value}}>{Array.from({length:/^\d+$/.test(info.value)?Math.min(6,Number(info.value)):3},(_,i)=><span key={i}>{i+1}</span>)}</div> : <div className={`ds-size-box ${info.prefix==='min-h'?'is-height':''}`}><span>{info.prefix === 'max-w' ? 'Ширина ≤' : 'Высота ≥'} {info.value}</span></div>}
  </div>;
}
const geometryGroups = [
  {id:'radius',title:'Скругления',note:'Число — радиус угла, а не размер элемента. rounded-full даёт капсулу у широкой кнопки и круг у квадратной иконки.'},
  {id:'padding',title:'Внутренние отступы · padding',note:'Зелёная область внутри пунктирной границы — расстояние от края блока до контента. px / py задают горизонтальную / вертикальную пару.'},
  {id:'margin',title:'Внешние отступы · margin',note:'Пространство снаружи блока. mt — сверху, mb — снизу; оно не увеличивает внутренний отступ карточки. mx-auto распределяет свободное пространство по бокам и центрирует блок.'},
  {id:'gap',title:'Расстояние между элементами · gap',note:'Промежуток между A и B в flex/grid. gap-x — между колонками, gap-y — между строками.'},
  {id:'layout',title:'Контейнеры, сетка и ограничения',note:'max-width ограничивает ширину, min-height задаёт нижний предел высоты. grid-cols задаёт количество или пропорции колонок.'},
];
function GeometryGroup({ group, items, query }: {group:typeof geometryGroups[number];items:Token[];query:string}) {
  const [all,setAll] = useState(false);
  const list = items.filter(item=>geometryInfo(item.value).group===group.id && matches(query,item.value,group.title,JSON.stringify(item.usages),geometryInfo(item.value).name));
  const sorted = [...list].sort((a,b)=>Number(b.sources.some(source=>source.includes('LandingSections')))-Number(a.sources.some(source=>source.includes('LandingSections'))) || b.sources.length-a.sources.length);
  if (!list.length) return null;
  return <section className="ds-foundation-section"><h2 className="ds-section-heading">{group.title} <small>{list.length}</small></h2><p className="ds-muted">{group.note}</p><div className="ds-token-grid">{(all||query?sorted:sorted.slice(0,6)).map(item=>{const info=geometryInfo(item.value); return <article className="ds-token ds-explained-token" key={item.value}><GeometryDiagram info={info} /><h3>{info.name} · {info.value}</h3><span className="ds-pill">{info.state}</span><p className="ds-token-description">{info.declaration}</p><code>{item.value}</code><UsageList item={item} /></article>;})}</div>{!all&&!query&&list.length>6&&<button className="ds-more" onClick={()=>setAll(true)}>Все значения: {group.title.toLowerCase()} · {list.length}</button>}</section>;
}
export function Effects({ surface, query }: {surface:Surface;query:string}) {
  const list = surface === 'website' ? website.effects.filter(item=>matches(query,item.value,item.sources,JSON.stringify(item.usages))) : extension.effects.filter(item=>matches(query,item.selector,JSON.stringify(item.properties)));
  const geometry = website.geometry.filter(item=>!item.sources.every(technical));
  return <><Notice>Значение читается вместе со свойством, состоянием и компонентом. Схемы отступов и ограничений уменьшены для сравнения; точная величина и единица подписаны рядом. Это реестр существующих применений, а не правило использовать любое число везде.</Notice>
    {surface==='website'&&matches(query,'градиент gradient footer green')&&<article className="ds-gradient-sample"><div className="opten-footer-gradient" aria-hidden="true" /><div><span className="ds-eyebrow">CSS ФУТЕРА</span><h2>Зелёный градиент Opten</h2><p>Световой фон нижней части страницы. Несколько слоёв, реальные размеры и размытие берутся из CSS сайта.</p><Source path="src/styles/theme.css · .opten-footer-gradient" /></div></article>}
    {list.length > 0 && <h2 className="ds-section-heading">Тени и состояния</h2>}{list.length > 0 && <p className="ds-muted">Образец показывает тень в активном виде. Hover / focus — условия включения в настоящем компоненте; путь ниже ведёт к месту использования.</p>}<div className="ds-token-grid">{list.map((item,index)=> 'value' in item ? <article className="ds-token ds-explained-token" key={item.value}><div className="ds-effect-stage"><div style={{boxShadow:shadowValue(item.value)}} /></div><h3>Тень · {componentNames[bestUsage(item)?.component] || bestUsage(item)?.component}</h3><span className="ds-pill">{stateLabel(item.value)}</span><p className="ds-token-description">CSS box-shadow: смещение по X и Y, размытие, растяжение и цвет.</p><code>{item.value}</code><UsageList item={item} /></article> : <article className="ds-token" key={index}><div className="ds-effect-stage"><div style={{boxShadow:item.properties['box-shadow'],borderRadius:item.properties['border-radius'],transition:item.properties.transition}} /></div><h3>{item.selector}</h3><pre>{JSON.stringify(item.properties,null,2)}</pre><Source path={`promptscore/${item.source}`} /></article>)}</div>
    {surface==='website'&&<><h2 className="ds-section-heading">Как читать геометрию</h2><div className="ds-geometry-guide"><p><strong>24 px — величина</strong><br />Свойство указывает, где она действует: внутри блока, снаружи или между соседями.</p><p><strong>md: — условие</strong><br />Значение действует от ширины viewport 768 px. Без префикса — базовый вариант.</p><p><strong>px-6 = 24 px</strong><br />В текущем Tailwind шаг отступов равен 4 px. px-[24px] задаёт величину явно.</p></div>{geometryGroups.map(group=><GeometryGroup key={group.id} group={group} items={geometry} query={query} />)}<details className="ds-details"><summary>Геометрия стандартного UI и старых импортов</summary><p className="ds-muted">Эти классы найдены только в техническом UI-слое или импортированных макетах.</p><div className="ds-rule-list">{website.geometry.filter(item=>item.sources.every(technical)&&matches(query,item.value,item.sources)).map(item=><div key={item.value}><code>{item.value}</code><p>{geometryInfo(item.value).declaration}</p><Source path={item.sources[0]} /></div>)}</div></details></>}
    {!list.length&&query&&surface==='extension'&&<Empty />}
  </>;
}
