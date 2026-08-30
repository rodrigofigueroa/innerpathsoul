/* ═══════════════════════════════════════════════════════════
   INNER PATH — Suite de pruebas
   1. Visión general   2. Funcionales   3. Integración
   4. Rendimiento      5. Regresión
   ═══════════════════════════════════════════════════════════ */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const PAGES = ['index.html', ...fs.readdirSync('pages').filter(f => f.endsWith('.html')).map(f => 'pages/' + f)];
const SITEJS = fs.readFileSync('js/site.js', 'utf8');

let PASS = 0, FAIL = 0, WARN = 0;
const failures = [];

function t(suite, name, cond, detail) {
  if (cond === 'warn') { WARN++; console.log(`  ⚠️  ${name}${detail ? ' — ' + detail : ''}`); return; }
  if (cond) { PASS++; console.log(`  ✅ ${name}`); }
  else { FAIL++; failures.push(`[${suite}] ${name}${detail ? ' — ' + detail : ''}`); console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`); }
}
function head(n) { console.log('\n' + '═'.repeat(70) + '\n  ' + n + '\n' + '═'.repeat(70)); }
function sub(n) { console.log('\n── ' + n + ' ' + '─'.repeat(Math.max(0, 66 - n.length))); }

/* Monta una página en jsdom con los scripts ejecutados */
function mount(file) {
  const dom = new JSDOM(fs.readFileSync(file, 'utf8'), {
    runScripts: 'outside-only', url: 'https://innerpath.com/' + file, pretendToBeVisual: true
  });
  const { window } = dom, doc = window.document;
  window.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  const errors = [];
  [...doc.querySelectorAll('script:not([src])')]
    .filter(s => !s.type || s.type === 'text/javascript')
    .forEach(s => { try { window.eval(s.textContent); } catch (e) { errors.push(e.message); } });
  try { window.eval(SITEJS); } catch (e) { errors.push('site.js: ' + e.message); }
  doc.dispatchEvent(new window.Event('DOMContentLoaded'));
  return { window, doc, errors };
}
const click = (win, el) => el.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
const key = (win, doc, k) => doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: k, bubbles: true }));

/* ═══════════════ 1. VISIÓN GENERAL ═══════════════ */
head('1. VISIÓN GENERAL (smoke tests)');

sub('Inventario');
console.log(`  Páginas HTML : ${PAGES.length}`);
console.log(`  Hojas CSS    : ${fs.readdirSync('css').length} (${fs.readdirSync('css').join(', ')})`);
console.log(`  Scripts JS   : ${fs.readdirSync('js').length} (${fs.readdirSync('js').join(', ')})`);

sub('Cada página carga sin errores de JS');
PAGES.forEach(p => {
  const { errors } = mount(p);
  t('general', `${p} sin errores JS`, errors.length === 0, errors[0]);
});

sub('Estructura mínima presente');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const ok = /<!DOCTYPE html>/i.test(h) && /<html lang=/.test(h) && /<main/.test(h) && /<footer/.test(h) && (h.match(/<h1/g) || []).length === 1;
  t('general', `${p} estructura (doctype/lang/main/footer/1×h1)`, ok);
});

/* ═══════════════ 2. FUNCIONALES ═══════════════ */
head('2. PRUEBAS FUNCIONALES');

sub('Menú móvil — abre, cierra, bloquea scroll');
PAGES.forEach(p => {
  const { window, doc } = mount(p);
  const ham = doc.getElementById('nav-hamburger'), ov = doc.getElementById('nav-overlay');
  click(window, ham);
  const abre = ov.classList.contains('is-open') && doc.body.style.overflow === 'hidden' && ham.getAttribute('aria-expanded') === 'true';
  click(window, ham);
  const cierra = !ov.classList.contains('is-open') && doc.body.style.overflow === '' && ham.getAttribute('aria-expanded') === 'false';
  t('func', `${p} menú abre y cierra`, abre && cierra, !abre ? 'no abre' : 'no cierra');
});

sub('Acordeón de submenús');
PAGES.forEach(p => {
  const { window, doc } = mount(p);
  const trigs = [...doc.querySelectorAll('.nav-primary__trigger')];
  let ok = trigs.length >= 2;
  trigs.forEach(tr => {
    const pn = doc.getElementById(tr.getAttribute('aria-controls'));
    click(window, tr);
    if (!pn.classList.contains('is-open') || tr.getAttribute('aria-expanded') !== 'true') ok = false;
    click(window, tr);
    if (pn.classList.contains('is-open')) ok = false;
  });
  t('func', `${p} acordeón (${trigs.length} paneles)`, ok);
});

sub('Solo un submenú abierto a la vez (exclusividad)');
PAGES.forEach(p => {
  const { window, doc } = mount(p);
  const [a, b] = [...doc.querySelectorAll('.nav-primary__trigger')];
  if (!b) { t('func', `${p} exclusividad`, true); return; }
  click(window, a); click(window, b);
  const pa = doc.getElementById(a.getAttribute('aria-controls'));
  const pb = doc.getElementById(b.getAttribute('aria-controls'));
  t('func', `${p} al abrir uno se cierra el otro`, !pa.classList.contains('is-open') && pb.classList.contains('is-open'));
});

sub('Escape cierra el menú');
PAGES.forEach(p => {
  const { window, doc } = mount(p);
  const ham = doc.getElementById('nav-hamburger'), ov = doc.getElementById('nav-overlay');
  click(window, ham); key(window, doc, 'Escape');
  t('func', `${p} Escape cierra`, !ov.classList.contains('is-open'));
});

sub('Clic en enlace del menú lo cierra (evita quedar atrapado)');
PAGES.forEach(p => {
  const { window, doc } = mount(p);
  const ham = doc.getElementById('nav-hamburger'), ov = doc.getElementById('nav-overlay');
  click(window, ham);
  const link = ov.querySelector('a');
  click(window, link);
  t('func', `${p} clic en enlace cierra overlay`, !ov.classList.contains('is-open'));
});

sub('Switch de idioma EN ⇄ ES');
PAGES.forEach(p => {
  const { window, doc } = mount(p);
  const nodes = [...doc.querySelectorAll('[data-i18n]')];
  const antes = nodes.map(n => n.textContent.trim());
  window.IP.applyLang('es');
  const despues = nodes.map(n => n.textContent.trim());
  const cambiaron = antes.filter((v, i) => v !== despues[i]).length;
  const langAttr = doc.documentElement.getAttribute('lang') === 'es';
  window.IP.applyLang('en');
  const vuelta = nodes.map(n => n.textContent.trim());
  const reversible = vuelta.every((v, i) => v === antes[i]);
  t('func', `${p} traduce (${cambiaron}/${nodes.length}) + lang + reversible`, cambiaron > 0 && langAttr && reversible,
    !reversible ? 'no reversible' : !langAttr ? 'lang no cambia' : '');
});

sub('Botones de idioma sincronizados (navbar + overlay)');
PAGES.forEach(p => {
  const { window, doc } = mount(p);
  const btns = [...doc.querySelectorAll('[data-lang]')];
  const es = btns.filter(b => b.dataset.lang === 'es');
  click(window, es[0]);
  const ok = es.every(b => b.classList.contains('is-active') && b.getAttribute('aria-pressed') === 'true') &&
             btns.filter(b => b.dataset.lang === 'en').every(b => !b.classList.contains('is-active'));
  t('func', `${p} ${btns.length} botones idioma sincronizan`, ok);
});

sub('Componentes interactivos de la portada');
{
  const { window, doc } = mount('index.html');
  // Breathwork toggle
  const tog = doc.getElementById('bwc-toggle'), sub2 = doc.getElementById('bwc-subrow');
  click(window, tog);
  t('func', 'index: toggle breathwork abre (has-visible + aria)', sub2.classList.contains('has-visible') && tog.getAttribute('aria-expanded') === 'true');
  click(window, tog);
  t('func', 'index: toggle breathwork cierra', tog.getAttribute('aria-expanded') === 'false');

  // Carrusel
  const next = doc.getElementById('next-btn'), prev = doc.getElementById('prev-btn'), track = doc.getElementById('s-track');
  t('func', 'index: carrusel arranca con prev deshabilitado', prev.disabled === true);
  click(window, next);
  t('func', 'index: carrusel avanza', /translateX\(-100%\)/.test(track.style.transform));
  const dots = doc.querySelectorAll('.s-dot');
  t('func', `index: se generan ${dots.length} indicadores`, dots.length === doc.querySelectorAll('.s-slide').length);
  t('func', 'index: indicador activo sigue al slide', dots[1] && dots[1].classList.contains('on'));

  // Video
  const mute = doc.getElementById('mute-btn'), play = doc.getElementById('play-btn');
  t('func', 'index: controles de video presentes con aria-label', !!mute && !!play && !!mute.getAttribute('aria-label'));
}

/* ═══════════════ 3. INTEGRACIÓN ═══════════════ */
head('3. PRUEBAS DE INTEGRACIÓN');

sub('Enlaces internos resuelven a archivos reales');
{
  let roto = [];
  PAGES.forEach(p => {
    const h = fs.readFileSync(p, 'utf8'), base = path.dirname(p);
    const ids = new Set([...h.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
    [...h.matchAll(/href="([^"]+)"/g)].map(m => m[1]).forEach(href => {
      if (/^(https?:|mailto:|tel:)/.test(href) || href === '#') return;
      if (href.startsWith('#')) { if (!ids.has(href.slice(1))) roto.push(`${p} ancla ${href}`); return; }
      const f = href.split('#')[0];
      if (f && !fs.existsSync(path.normalize(path.join(base, f)))) roto.push(`${p} → ${href}`);
    });
  });
  t('integ', `enlaces internos (${roto.length} rotos)`, roto.length === 0, roto.slice(0, 3).join(' | '));
}

sub('Recursos CSS/JS referenciados existen y en orden correcto');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8'), base = path.dirname(p);
  const links = [...h.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map(m => m[1]);
  const scripts = [...h.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map(m => m[1]);
  const existen = [...links, ...scripts].every(r => r.startsWith('http') || fs.existsSync(path.normalize(path.join(base, r))));
  const iBase = h.indexOf('base.css'), iPage = h.indexOf('page.css'), iStyle = h.indexOf('<style>');
  const orden = iBase === -1 || ((iPage === -1 || iBase < iPage) && (iStyle === -1 || iBase < iStyle));
  t('integ', `${p} recursos existen y base.css va primero`, existen && orden);
});

sub('Navegación cruzada: cada terapia es alcanzable desde cualquier página');
{
  const destinos = ['soul-channeling', 'soul-mapping', 'soul-tantra-activation', 'soul-breathwork',
                    'earth-breathwork', 'mirror-breathwork', 'water-breathwork', 'soul-guidance',
                    'soul-oracle-reading', 'retiro'];
  PAGES.forEach(p => {
    const h = fs.readFileSync(p, 'utf8');
    const faltan = destinos.filter(d => !h.includes(d + '.html'));
    t('integ', `${p} enlaza las 10 páginas`, faltan.length === 0, faltan.join(','));
  });
}

sub('Diccionario i18n ↔ HTML (sin claves huérfanas)');
{
  const definidas = new Set([...SITEJS.matchAll(/'([\w.\-]+)':\s*\{\s*en:/g)].map(m => m[1]));
  const usadas = new Set();
  PAGES.forEach(p => [...fs.readFileSync(p, 'utf8').matchAll(/data-i18n="([^"]+)"/g)].forEach(m => usadas.add(m[1])));
  const huerfanas = [...usadas].filter(k => !definidas.has(k));
  t('integ', `claves i18n usadas existen (${usadas.size} usadas / ${definidas.size} definidas)`, huerfanas.length === 0, huerfanas.join(','));
}

sub('Persistencia de idioma entre páginas (localStorage)');
{
  const { window } = mount('index.html');
  window.IP.applyLang('es');
  const guardado = window.localStorage.getItem('ip_lang');
  t('integ', 'idioma se persiste en localStorage', guardado === 'es', 'valor=' + guardado);
}

sub('Cobertura CSS: toda clase del HTML tiene regla');
{
  const sels = css => {
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const out = new Set();
    [...css.matchAll(/([^{}]+)\{[^{}]*\}/g)].forEach(m => {
      const s = m[1].trim(); if (s.startsWith('@')) return;
      s.split(',').forEach(x => out.add(x.trim()));
    });
    return out;
  };
  const clases = set => { const o = new Set(); set.forEach(s => [...s.matchAll(/\.([\w-]+)/g)].forEach(m => o.add(m[1]))); return o; };
  const inline = p => (fs.readFileSync(p, 'utf8').match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1];
  const base = sels(fs.readFileSync('css/base.css', 'utf8'));
  const page = sels(fs.readFileSync('css/page.css', 'utf8'));
  PAGES.forEach(p => {
    const propio = sels(inline(p));
    const disp = new Set([...base, ...(p === 'index.html' ? [] : page), ...propio]);
    const def = clases(disp);
    const usadas = new Set();
    [...fs.readFileSync(p, 'utf8').matchAll(/class="([^"]+)"/g)].forEach(m => m[1].split(/\s+/).forEach(c => usadas.add(c)));
    const sinCSS = [...usadas].filter(c => !def.has(c));
    t('integ', `${p} clases con CSS (${usadas.size} usadas)`, sinCSS.length === 0, sinCSS.slice(0, 5).join(','));
  });
}

/* ═══════════════ 4. RENDIMIENTO ═══════════════ */
head('4. PRUEBAS DE RENDIMIENTO');

sub('Peso de la carga inicial');
{
  const kb = n => (n / 1024).toFixed(1) + ' KB';
  const cssBase = fs.statSync('css/base.css').size;
  const cssPage = fs.statSync('css/page.css').size;
  const js = fs.statSync('js/site.js').size;
  console.log(`  base.css ${kb(cssBase)} | page.css ${kb(cssPage)} | site.js ${kb(js)}`);
  let total = 0;
  PAGES.forEach(p => {
    const html = fs.statSync(p).size;
    const compartido = p === 'index.html' ? cssBase + js : cssBase + cssPage + js;
    const t0 = html + compartido;
    total += t0;
    const ok = t0 < 250 * 1024;
    t('perf', `${p} carga ${kb(t0)} (<250KB)`, ok, kb(t0));
  });
  console.log(`  Promedio por página: ${kb(total / PAGES.length)}`);
}

sub('Recursos que bloquean el render');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const scriptsSinDefer = [...h.matchAll(/<script[^>]+src="[^"]+"[^>]*>/g)].filter(s => !/defer|async/.test(s[0]));
  t('perf', `${p} scripts con defer/async`, scriptsSinDefer.length === 0, `${scriptsSinDefer.length} bloqueantes`);
});

sub('Preconnect a orígenes externos');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const ok = h.includes('rel="preconnect"') && h.includes('fonts.gstatic.com');
  t('perf', `${p} preconnect a Google Fonts`, ok);
});

sub('CLS — imágenes con dimensiones explícitas');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const imgs = [...h.matchAll(/<img([^>]*)>/g)].map(m => m[1]);
  const sinDim = imgs.filter(i => !/width=/.test(i) || !/height=/.test(i));
  t('perf', `${p} ${imgs.length} imgs con width/height`, sinDim.length === 0, `${sinDim.length} sin dimensiones`);
});

sub('Lazy loading en imágenes fuera del viewport');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const imgs = [...h.matchAll(/<img([^>]*)>/g)].map(m => m[1]);
  const sinLoading = imgs.filter(i => !/loading=/.test(i));
  const eager = imgs.filter(i => /loading="eager"/.test(i));
  t('perf', `${p} loading declarado (${eager.length} eager = LCP)`, sinLoading.length === 0, `${sinLoading.length} sin loading`);
});

sub('Número de peticiones HTTP por página');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const css = (h.match(/<link[^>]+\.css/g) || []).length;
  const js2 = (h.match(/<script[^>]+src=/g) || []).length;
  const fonts = (h.match(/fonts\.googleapis\.com/g) || []).length;
  const imgs = (h.match(/<img/g) || []).length;
  const total = css + js2 + fonts + imgs;
  t('perf', `${p} ${total} peticiones (css:${css} js:${js2} fuentes:${fonts} img:${imgs})`, total <= 20, String(total));
});

sub('Duplicación de CSS entre archivos (bytes desperdiciados)');
{
  const sels = css => {
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const m = new Map();
    [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].forEach(x => {
      const s = x[1].trim(); if (s.startsWith('@')) return;
      m.set(s.split(/\s+/).join(' '), x[2].trim());
    });
    return m;
  };
  const base = sels(fs.readFileSync('css/base.css', 'utf8'));
  const page = sels(fs.readFileSync('css/page.css', 'utf8'));
  const idx = sels((fs.readFileSync('index.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1]);
  const dupBP = [...base.keys()].filter(k => page.has(k));
  const dupBI = [...base.keys()].filter(k => idx.has(k));
  t('perf', `base.css ∩ page.css: ${dupBP.length} selectores repetidos`, dupBP.length <= 5, dupBP.slice(0, 4).join(', '));
  t('perf', `base.css ∩ index inline: ${dupBI.length} selectores repetidos`, dupBI.length === 0, dupBI.slice(0, 4).join(', '));
}

sub('Animaciones respetan prefers-reduced-motion');
{
  const base = fs.readFileSync('css/base.css', 'utf8');
  t('perf', 'base.css declara prefers-reduced-motion', base.includes('prefers-reduced-motion'));
}

/* ═══════════════ 5. REGRESIÓN ═══════════════ */
head('5. PRUEBAS DE REGRESIÓN (bugs corregidos que no deben volver)');

sub('R1 — Doble listener del menú (menú no abría en móvil)');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const inlineJS = [...h.matchAll(/<script(?![^>]*src)(?![^>]*type=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const dup = h.includes('site.js') && /getElementById\('nav-hamburger'\)/.test(inlineJS);
  t('regr', `${p} sin lógica de nav duplicada`, !dup, 'inline JS + site.js manejan el mismo botón');
});

sub('R2 — textContent borraba los SVG al traducir');
PAGES.forEach(p => {
  const { window, doc } = mount(p);
  const antes = doc.querySelectorAll('[data-i18n] svg').length;
  window.IP.applyLang('es'); window.IP.applyLang('en'); window.IP.applyLang('es');
  const despues = doc.querySelectorAll('[data-i18n] svg').length;
  t('regr', `${p} SVG sobreviven (${antes}→${despues})`, antes === despues);
});

sub('R3 — matchMedia sin guard rompía WebViews antiguos');
{
  const todos = [SITEJS, ...PAGES.map(p => fs.readFileSync(p, 'utf8'))].join('\n');
  const usos = [...todos.matchAll(/window\.matchMedia\(/g)].length;
  const sinGuard = [...todos.matchAll(/(?<!window\.matchMedia \? )(?<!window\.matchMedia && )window\.matchMedia\(/g)].length;
  t('regr', `matchMedia protegido (${usos} usos)`, /window\.matchMedia \?|window\.matchMedia &&/.test(todos));
}

sub('R4 — CSS del footer apuntaba a h4 tras renombrar a h3');
{
  const cssAll = fs.readFileSync('css/base.css', 'utf8') + (fs.readFileSync('index.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1];
  const htmlUsa = PAGES.every(p => /<h3[^>]*data-i18n="footer\./.test(fs.readFileSync(p, 'utf8')));
  t('regr', 'CSS .ft__col h3 coincide con el HTML', cssAll.includes('.ft__col h3') && !cssAll.includes('.ft__col h4') && htmlUsa);
}

sub('R5 — has-visible nunca se añadía (cards pegadas)');
{
  const { window, doc } = mount('index.html');
  const tog = doc.getElementById('bwc-toggle'), sr = doc.getElementById('bwc-subrow');
  click(window, tog);
  t('regr', 'index: subrow recibe has-visible al abrir', sr.classList.contains('has-visible'));
}

sub('R6 — CSS de bwc/sm borrado por accidente en el refactor');
{
  const idx = (fs.readFileSync('index.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1];
  ['.bwc__card-main', '.bwc__subrow', '.sm__card', '.sm__grid', '.rm-bw'].forEach(sel => {
    t('regr', `index conserva ${sel}`, idx.includes(sel));
  });
}

sub('R7 — Bloques <style>/:root duplicados');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const styles = (h.replace(/\/\*[\s\S]*?\*\//g, '').match(/<style>/g) || []).length;
  const roots = (h.match(/:root\s*\{/g) || []).length;
  t('regr', `${p} ≤1 <style> y ≤1 :root`, styles <= 1 && roots <= 1, `style:${styles} root:${roots}`);
});

sub('R8 — Rutas rotas del footer y autoenlaces');
{
  const idx = fs.readFileSync('index.html', 'utf8');
  t('regr', 'index: footer usa prefijo pages/', !/href="\.\/(soul|earth|mirror|water)-[\w-]*\.html"/.test(idx));
  const ret = fs.readFileSync('pages/retiro.html', 'utf8');
  t('regr', 'retiro: sin autoenlace pages/retiro.html', !ret.includes('href="pages/retiro.html"'));
}

sub('R9 — SEO: hreflang y meta description');
PAGES.forEach(p => {
  const h = fs.readFileSync(p, 'utf8');
  const d = (h.match(/name="description" content="([^"]+)"/) || [, ''])[1];
  t('regr', `${p} hreflang + description ${d.length} chars`, h.includes('hreflang') && d.length >= 50 && d.length <= 160);
});

sub('R10 — Jerarquía de encabezados sin saltos');
PAGES.forEach(p => {
  const lv = [...fs.readFileSync(p, 'utf8').matchAll(/<h([1-6])/g)].map(m => +m[1]);
  const salto = lv.some((v, i) => i > 0 && v - lv[i - 1] > 1);
  t('regr', `${p} jerarquía continua`, !salto);
});

sub('R11 — Cobertura i18n completa (sin texto sin traducir)');
{
  const MARCAS = new Set(['Inner Path', 'Soul Channeling', 'Soul Mapping', 'Soul Tantra Activation', 'Soul Breathwork',
    'Earth Breathwork', 'Mirror Breathwork', 'Water Breathwork', 'Soul Guidance', 'Soul Oracle Reading',
    'Soul Personal Retreat', 'Soul Therapy', 'Body, Heart and Soul', 'Mónica Schekaibán Assad', 'EN', 'ES',
    'WhatsApp', 'Email', '+52 55 5106 3488', 'hola@innerpath.com', 'Soul Is', 'Soul Is&hellip;', 'Soul Therapies',
    '— Mónica Schekaibán Assad', '4,000 USD', '7,000 USD', '4,500 USD', '8,000 USD']);
  PAGES.forEach(p => {
    let h = fs.readFileSync(p, 'utf8')
      .replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
    const sin = [];
    [...h.matchAll(/<([a-z0-9]+)([^>]*)>([^<>]+)<\/\1>/gi)].forEach(m => {
      const tag = m[1], attrs = m[2], txt = m[3].replace(/\s+/g, ' ').trim();
      if (!txt || txt.length < 2 || tag === 'title') return;
      if (MARCAS.has(txt) || /^[\d\W]+$/.test(txt)) return;
      if (/data-i18n|aria-hidden/.test(attrs)) return;
      sin.push(txt.slice(0, 40));
    });
    t('regr', `${p} sin texto fuera del i18n`, sin.length === 0, sin.slice(0, 3).join(' | '));
  });
}


sub('R12 — Nav dejó de ser transparente sobre el hero');
{
  const base = fs.readFileSync('css/base.css', 'utf8');
  const barra = (base.match(/\.nav-bar \{[^}]*\}/) || [''])[0];
  t('regr', 'base.css: .nav-bar arranca transparente', /background:\s*transparent/.test(barra), barra.slice(0,90));
  t('regr', 'base.css: existe variante sólida (.scrolled / --solid)', /\.nav-bar\.scrolled[\s\S]{0,60}\.nav-bar--solid|\.nav-bar--solid/.test(base));
  t('regr', 'base.css: logo blanco por defecto', /\.nav-logo \{[^}]*color:\s*var\(--white\)/.test(base));
  t('regr', 'base.css: hamburguesa blanca por defecto', /\.nav-hamburger span \{[^}]*background:\s*var\(--white\)/.test(base));

  // Páginas con hero claro deben pedir el estado sólido
  PAGES.forEach(p => {
    const h = fs.readFileSync(p, 'utf8');
    const heroClaro = /rgba\(231,217,184/.test(h);          // scrim crema = hero claro
    const pideSolido = /nav-bar nav-bar--solid|nav-bar--solid/.test(h);
    if (heroClaro) t('regr', `${p} hero claro → nav sólido`, pideSolido, 'texto blanco sería ilegible');
    else t('regr', `${p} hero oscuro → nav transparente`, !pideSolido);
  });
}

/* ═══════════════ RESUMEN ═══════════════ */
head('RESUMEN');
console.log(`  ✅ Pasadas : ${PASS}`);
console.log(`  ❌ Fallidas: ${FAIL}`);
console.log(`  ⚠️  Avisos  : ${WARN}`);
console.log(`  Total      : ${PASS + FAIL}`);
console.log(`  Tasa éxito : ${((PASS / (PASS + FAIL)) * 100).toFixed(1)}%`);
if (failures.length) {
  console.log('\n  FALLOS:');
  failures.forEach(f => console.log('   • ' + f));
}
process.exit(FAIL ? 1 : 0);
