import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import sharp from 'sharp';

const root = process.cwd();
const out = path.join(root, 'src/design-system/generated');
const slash = value => value.replaceAll('\\', '/');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.sort((a, b) => a.name.localeCompare(b.name)).map(entry =>
    entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
async function save(name, value) {
  const file = path.join(out, name);
  const previous = JSON.parse(await fs.readFile(file, 'utf8').catch(() => '{}'));
  const contentHash = hash(JSON.stringify(value));
  const observedAt = previous.contentHash === contentHash ? previous.observedAt : new Date().toISOString();
  await fs.writeFile(file, JSON.stringify({ observedAt, contentHash, ...value }, null, 2) + '\n');
}
function strings(node, result = []) {
  if (ts.isStringLiteralLike(node)) result.push(node.text);
  node.forEachChild(child => { strings(child, result); });
  return result;
}
function refsFor(text, sources) {
  return sources.filter(source => source.text.includes(text)).slice(0, 8).map(source => source.file);
}
function cssInventory(text, source) {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  for (const match of clean.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
    const selector = match[1].trim();
    const properties = {};
    for (const prop of match[2].matchAll(/([\w-]+)\s*:\s*([^;]+);?/g)) properties[prop[1]] = prop[2].trim();
    rules.push({ selector, properties, source });
  }
  return rules;
}
await fs.mkdir(out, { recursive: true });
const sourcePaths = (await walk(path.join(root, 'src'))).filter(file => /\.(tsx?|css)$/.test(file) && !slash(file).includes('/design-system/') && !slash(file).includes('/pages/admin/'));
// Match Git's canonical text format on Windows and Linux, including AST offsets.
const sources = await Promise.all(sourcePaths.map(async file => ({ file: slash(path.relative(root, file)), text: (await fs.readFile(file, 'utf8')).replace(/\r\n/g, '\n') })));
const sourceNames = new Set(sources.map(source => source.file));
const incoming = new Map();
for (const source of sources) {
  const ast = ts.createSourceFile(source.file, source.text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function track(node) {
    const specifier = ts.isImportDeclaration(node) ? node.moduleSpecifier : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword ? node.arguments[0] : null;
    if (specifier && ts.isStringLiteralLike(specifier) && specifier.text.startsWith('.')) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(source.file), specifier.text.split('?')[0]));
      const resolved = [target, target + '.tsx', target + '.ts', target + '/index.tsx', target + '/index.ts'].find(file => sourceNames.has(file));
      if (resolved) { const refs = incoming.get(resolved) || new Set(); refs.add(source.file); incoming.set(resolved, refs); }
    }
    node.forEachChild(track);
  }
  track(ast);
}
const components = [];
const icons = new Map();
const typography = [];
const effects = new Map();
const colors = new Map();
const geometry = new Map();
const roleNames = {
  Hero: 'Hero · главный заголовок', SectionTitle: 'Заголовок секции', Step: 'Шаг установки',
  FeatureCard: 'Карточка возможности', PrivacyItem: 'Блок приватности', PlanCard: 'Тарифная карточка',
  BlogPostCard: 'Карточка статьи', LearnLessonCard: 'Карточка урока', FaqBlock: 'FAQ',
};
for (const source of sources) {
  const ast = ts.createSourceFile(source.file, source.text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const importers = [...(incoming.get(source.file) || [])];
  if (source.file.startsWith('src/app/components/') && source.file.endsWith('.tsx')) {
    components.push({ id: source.file, name: path.basename(source.file, '.tsx'), source: source.file, used: importers.length > 0, usages: importers.slice(0, 8), level: source.file.includes('/ui/') ? 'primitive' : 'composite' });
  }
  function visit(node, symbol = '') {
    if (ts.isFunctionDeclaration(node) && node.name) symbol = node.name.text;
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const library = node.moduleSpecifier.text;
      if (library === 'lucide-react' || library.startsWith('@mui/icons-material')) {
        const names = node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)
          ? node.importClause.namedBindings.elements.filter(item => !item.isTypeOnly).map(item => item.propertyName?.text || item.name.text)
          : [library.split('/').at(-1)];
        for (const name of names) {
          if (!name || name === 'LucideIcon') continue;
          const key = `${library}:${name}`;
          const item = icons.get(key) || { name, library: library.startsWith('@mui') ? '@mui/icons-material' : library, sources: [] };
          item.sources.push(source.file); icons.set(key, item);
        }
      }
    }
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && roleNames[symbol]) {
      const tag = node.tagName.getText(ast);
      const attribute = node.attributes.properties.find(prop => prop.name?.getText(ast) === 'className');
      if (attribute && ['h1', 'h2', 'h3', 'p', 'span', 'dt', 'dd'].includes(tag)) {
        const classes = strings(attribute).join(' ').split(/\s+/).filter(value => /^(?:(?:sm|md|lg|xl):)?(?:font-|text-|leading-|tracking-)/.test(value));
        if (classes.some(value => /text-\[\d/.test(value))) typography.push({ id: `${symbol}-${node.pos}`, name: `${roleNames[symbol]} · ${tag}`, symbol, tag, classes: [...new Set(classes)].join(' '), source: source.file, line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1 });
      }
    }
    node.forEachChild(child => visit(child, symbol));
  }
  visit(ast);
  for (const match of source.text.matchAll(/#[\da-fA-F]{6}\b|#[\da-fA-F]{3}\b/g)) {
    const value = match[0].toLowerCase();
    const item = colors.get(value) || { value, count: 0, sources: [] };
    item.count++; if (!item.sources.includes(source.file)) item.sources.push(source.file);
    colors.set(value, item);
  }
  for (const match of source.text.matchAll(/((?:(?:hover|focus|md|sm|lg):)?shadow-\[[^\]\r\n]+\]|rounded-\[[^\]\r\n]+\]|(?:gap|p[xy]?|m[bt]|min-h|max-w)-\[\d+px\])/g)) {
    const value = match[1];
    const map = value.includes('shadow') ? effects : geometry;
    const item = map.get(value) || { value, sources: [] };
    if (!item.sources.includes(source.file)) item.sources.push(source.file);
    map.set(value, item);
  }
}
const cssRules = sources.filter(source => source.file.endsWith('.css')).flatMap(source => cssInventory(source.text, source.file));
const fonts = cssRules.filter(rule => rule.selector.includes('@font-face')).map(rule => ({ ...rule.properties, source: rule.source }));
const variables = cssRules.filter(rule => rule.selector === ':root').flatMap(rule => Object.entries(rule.properties).filter(([name]) => name.startsWith('--')).map(([name, value]) => ({ name, value, source: rule.source })));
const mediaPaths = (await walk(path.join(root, 'public'))).filter(file => /\.(svg|png|jpe?g|webp|avif|gif)$/i.test(file) && !/\/(generated|design-system-extension)\//.test(slash(file)));
const assets = [];
for (let start = 0; start < mediaPaths.length; start += 10) {
  assets.push(...await Promise.all(mediaPaths.slice(start, start + 10).map(async file => {
    const relative = slash(path.relative(path.join(root, 'public'), file));
    const metadata = await sharp(file).metadata().catch(() => ({}));
    const stat = await fs.stat(file);
    return { id: relative, src: `/${relative}`, name: path.basename(file), family: relative.startsWith('blog/') ? 'blog' : relative.split('/')[1] || 'brand', width: metadata.width || null, height: metadata.height || null, bytes: stat.size, format: path.extname(file).slice(1), sources: refsFor(path.basename(file), sources), status: 'existing' };
  })));
}
const remoteAssets = [...new Set(sources.flatMap(source => [...source.text.matchAll(/https:\/\/(?:i\.ytimg\.com|img\.youtube\.com)[^\s"'`]+/g)].map(match => match[0])))];
await save('website.json', {
  sourceHashes: Object.fromEntries(sources.filter(source => /LandingSections|fonts.css|theme.css/.test(source.file)).map(source => [source.file, hash(source.text)])),
  colors: [...colors.values()].sort((a, b) => b.count - a.count).map(item => ({ ...item, sources: item.sources.slice(0, 6) })),
  variables, fonts, typography, effects: [...effects.values()], geometry: [...geometry.values()],
  cssEffects: cssRules.filter(rule => Object.keys(rule.properties).some(name => /shadow|filter|background-image|transition/.test(name))),
  icons: [...icons.values()].sort((a, b) => a.name.localeCompare(b.name)), components, assets, remoteAssets,
});
const lucideNames = [...new Set([...icons.values()].filter(item => item.library === 'lucide-react').map(item => item.name))].sort();
await fs.writeFile(path.join(out, 'icons.ts'), `// Generated from actual product imports. Run npm run sync:design-system.\nimport { ${lucideNames.join(', ')} } from 'lucide-react';\nexport const catalogIcons = { ${lucideNames.join(', ')} };\n`);

const extensionArgument = process.argv.indexOf('--extension');
if (extensionArgument !== -1) {
  const extensionRoot = path.resolve(process.argv[extensionArgument + 1] || '');
  const read = file => fs.readFile(path.join(extensionRoot, file), 'utf8');
  const files = ['popup/popup.html', 'popup/popup.css', 'popup/popup.js', 'popup/fonts/inter.css', 'content/i18n.js', 'content/content.css', 'manifest.json'];
  const original = Object.fromEntries(await Promise.all(files.map(async file => [file, await read(file)])));
  // Read literal translations with the TS parser; never execute the extension runtime.
  const translationAst = ts.createSourceFile('i18n.js', original['content/i18n.js'], ts.ScriptTarget.Latest, true);
  function literal(node) {
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(prop => [prop.name.text, literal(prop.initializer)]));
    throw new Error('Unsupported non-literal translation');
  }
  let translations;
  function findTranslations(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'PS_STRINGS') translations = literal(node.initializer);
    node.forEachChild(findTranslations);
  }
  findTranslations(translationAst);
  if (!translations?.ru || !translations?.en) throw new Error('Extension translations missing');
  const mappings = {};
  for (const match of original['popup/popup.js'].matchAll(/getElementById\('([^']+)'\)\.textContent\s*=\s*t\('([^']+)'\)/g)) mappings[match[1]] = match[2];
  Object.assign(mappings, { 'ps-chat-improve-text': 'chatImproveBtn', 'ps-chat-type-text': 'chatTypeImage', 'ps-chat-refs-placeholder': 'chatRefsPlaceholder', 'ps-skill-download-btn-text': 'skillDownloadBtn', 'ps-chatgpt-open-btn-text': 'chatgptOpenBtn', 'ps-popup-label-plan': 'yourPlan', 'ps-popup-label-checks': 'checksUsed', 'ps-footer-support': 'footerSupport' });
  const exportRoot = path.join(root, 'public/assets/design-system-extension');
  await fs.mkdir(exportRoot, { recursive: true });
  const extensionMedia = [...(await walk(path.join(extensionRoot, 'popup/assets'))), ...(await walk(path.join(extensionRoot, 'ui'))), ...(await walk(path.join(extensionRoot, 'popup/fonts')))].filter(file => /\.(svg|png|jpe?g|webp|woff2)$/i.test(file));
  const extensionAssets = [];
  for (const file of extensionMedia) {
    const relative = slash(path.relative(extensionRoot, file));
    const target = path.join(exportRoot, relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(file, target);
    const data = await fs.readFile(file);
    const metadata = relative.endsWith('.woff2') ? {} : await sharp(file).metadata().catch(() => ({}));
    extensionAssets.push({ id: relative, name: path.basename(file), src: `/assets/design-system-extension/${relative}`, source: relative, width: metadata.width || null, height: metadata.height || null, bytes: data.length, sha256: hash(data), family: relative.startsWith('ui/') ? 'score-icons' : 'popup', format: path.extname(file).slice(1) });
  }
  const markup = original['popup/popup.html'].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, '').replace(/src="assets\//g, 'src="/assets/design-system-extension/popup/assets/');
  const popupRules = cssInventory(original['popup/popup.css'], 'popup/popup.css');
  const contentRules = cssInventory(original['content/content.css'], 'content/content.css');
  const specimen = (id, title, selector, level, variants = ['default']) => ({ id, title, selector, level, variants, source: 'popup/popup.html', parts: [] });
  const demos = [
    specimen('email-field', 'Email · поле', '.ps-email-field', 'primitive'),
    specimen('email-button', 'Email · кнопка', '.ps-btn-email', 'primitive', ['default', 'disabled']),
    specimen('otp', 'Одноразовый код · 6 ячеек', '.ps-email-code-cells', 'primitive', ['empty', 'filled']),
    specimen('badges', 'Бейджи входа', '.ps-badges-pills', 'primitive'),
    specimen('upgrade', 'Переход на Pro', '.ps-dash-upgrade-btn', 'primitive'),
    specimen('pro-status', 'Статус подписки', '.ps-dash-pro-status', 'primitive', ['pro', 'cancelled']),
    specimen('credit-bar', 'Использование кредитов', '.ps-dash-bar-track', 'primitive', ['remaining', 'exhausted']),
    specimen('tabs', 'Навигация · 4 вкладки', '.ps-popup-tabs', 'primitive', ['aggregators', 'skill', 'chatgpt', 'chat']),
    specimen('site-syntx', 'Syntx · карточка платформы', '#ps-site-syntx', 'primitive'),
    specimen('site-higgsfield', 'Higgsfield · карточка платформы', '#ps-site-higgsfield', 'primitive'),
    specimen('site-freepik', 'Freepik · карточка платформы', '#ps-site-freepik', 'primitive'),
    specimen('type', 'Выбор типа', '#ps-chat-type-btn', 'primitive'),
    specimen('model', 'Выбор модели', '#ps-chat-model-btn', 'primitive', ['disabled', 'selected']),
    specimen('prompt', 'Поле промпта', '.ps-chat-prompt-wrap', 'primitive', ['empty', 'filled', 'error']),
    specimen('references', 'Фотореференсы', '.ps-chat-refs-row', 'primitive'),
    specimen('improve', 'Улучшить · кнопка', '.ps-chat-improve', 'primitive', ['disabled', 'default', 'loading']),
    specimen('download', 'Claude Skill · кнопка', '.ps-skill-download', 'primitive', ['disabled', 'default']),
    specimen('instruction', 'Шаг инструкции', '.ps-inst-item', 'primitive'),
    specimen('footer', 'Поддержка и дата', '.ps-dash-footer', 'primitive'),
    specimen('login', 'Вход по Email', '#ps-popup-logged-out', 'composite', ['email', 'code']),
    specimen('account', 'Аккаунт и кредиты', '.ps-dash-plan-section', 'composite', ['free', 'pro', 'cancelled']),
    specimen('header', 'Шапка аккаунта', '.ps-dash-header', 'composite'),
    specimen('aggregators', 'ИИ-агрегаторы · инструкция', '.ps-inst-section', 'composite'),
    specimen('claude', 'Claude Skill · инструкция', '.ps-skill-section', 'composite', ['disabled', 'default']),
    specimen('chatgpt', 'ChatGPT · инструкция', '.ps-chatgpt-section', 'composite', ['disabled', 'default']),
    specimen('workbench', 'Быстрый режим улучшения', '.ps-chat-section', 'composite', ['empty', 'filled', 'loading', 'error']),
    specimen('promo', 'Баннер библиотеки промптов', '#ps-promo-banner', 'composite'),
  ];
  for (const demo of demos) {
    const token = demo.selector.slice(1);
    const found = demo.selector.startsWith('#') ? markup.includes(`id="${token}"`) : new RegExp(`class="[^"]*\\b${token}\\b`).test(markup);
    if (!found) throw new Error(`Extension specimen selector missing: ${demo.selector}`);
  }
  let revision = 'unknown';
  try { revision = execFileSync('git', ['-C', extensionRoot, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); } catch {}
  // Opaque sandbox frames cannot fetch cross-origin fonts without CORS. Keep
  // the isolation and embed the exact local WOFF2 bytes instead of relaxing it.
  let fontCss = original['popup/fonts/inter.css'];
  for (const font of ['inter-latin.woff2', 'inter-cyrillic.woff2']) {
    const bytes = await fs.readFile(path.join(extensionRoot, 'popup/fonts', font));
    fontCss = fontCss.replace(`url(${font})`, `url(data:font/woff2;base64,${bytes.toString('base64')})`);
  }
  await save('extension.json', {
    version: JSON.parse(original['manifest.json']).version, revision,
    sourceHashes: Object.fromEntries(files.map(file => [file, hash(original[file])])),
    markup, css: original['popup/popup.css'], fontCss,
    translations, mappings, demos, assets: extensionAssets,
    variables: popupRules.filter(rule => rule.selector === ':root').flatMap(rule => Object.entries(rule.properties).map(([name, value]) => ({ name, value, source: rule.source }))),
    typography: popupRules.filter(rule => rule.properties['font-size']).map(rule => ({ ...rule, id: rule.selector })),
    effects: [...popupRules, ...contentRules].filter(rule => Object.keys(rule.properties).some(name => /shadow|radius|transition/.test(name))),
    contentRules: contentRules.filter(rule => Object.keys(rule.properties).some(name => /color|background|shadow|radius/.test(name))),
  });
  console.log(`Extension: ${demos.length} specimens, ${extensionAssets.length} assets; v${JSON.parse(original['manifest.json']).version} / ${revision}`);
}
console.log(`Website: ${components.length} component files, ${typography.length} text roles, ${assets.length} local assets, ${icons.size} imported icons`);
