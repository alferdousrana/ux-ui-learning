/* ==========================================================================
   UX-UI — application bootstrap.
   Shell (sidebar, header, bottom nav), routing, global actions, search
   dropdown, toasts for XP/badges, theme, offline + PWA install.
   ========================================================================== */
import { store } from './core/state.js';
import { t } from './core/i18n.js';
import { $, $$, esc, debounce, fmt } from './core/utils.js';
import { icon } from './core/icons.js';
import { route, fallback, start, navigate, resolve } from './core/router.js';
import { loadContent } from '../data/content.js';
import { search, highlight, warm } from './core/search.js';
import { levelInfo, currentStreak, todayActivity } from './core/progress.js';
import { toast, modal, handleBookmark, handleComplete, typeIcon, typeLabel } from './ui/components.js';

/* ---------- Theme & settings on <html> ---------- */
function applySettings() {
  const s = store.settings, h = document.documentElement;
  h.dataset.theme = s.theme; h.dataset.fs = s.fontSize; h.lang = s.lang === 'bn' ? 'bn' : 'en';
  $('meta[name="theme-color"]')?.setAttribute('content', s.theme === 'dark' ? '#0D1311' : '#F3F5F4');
}

/* ---------- Navigation model ---------- */
const NAV = () => [
  { href: '#/', label: t('dashboard'), ico: 'home' },
  { label: t('learnUx'), ico: 'book', key: 'learn', children: [
    ['#/learn/mindset', t('mindset')], ['#/learn/fundamentals', t('fundamentals')], ['#/learn/hci', t('hci')], ['#/research', t('research')], ['#/laws', t('laws')],
    ['#/learn/ia', t('ia')], ['#/learn/userflow', t('userflow')], ['#/learn/wireframing', t('wireframing')], ['#/learn/prototyping', t('prototyping')],
    ['#/learn/usability', t('usability')], ['#/learn/accessibility', t('accessibility')]] },
  { label: t('uiDesign'), ico: 'layout', key: 'ui', children: [['#/learn/typography', t('typography')], ['#/learn/color', t('color')], ['#/learn/layout', t('layout')], ['#/learn/components', t('components')], ['#/learn/design-systems', t('designSystems')]] },
  { label: t('figma'), ico: 'figma', key: 'figma', children: [['#/figma/beginner', t('beginner')], ['#/figma/intermediate', t('intermediate')], ['#/figma/advanced', t('advanced')], ['#/figma/items', '2,600+ ' + t('figmaItems')], ['#/plugins', t('plugins')]] },
  { href: '#/cases', label: t('cases'), ico: 'briefcase' },
  { href: '#/practice', label: t('practice'), ico: 'target' },
  { href: '#/challenges', label: t('challenges'), ico: 'flag' },
  { href: '#/exams', label: t('exams'), ico: 'clipboard' },
  { sep: true },
  { href: '#/roadmap', label: t('roadmap'), ico: 'map' },
  { href: '#/projects', label: t('projects'), ico: 'sparkle' },
  { href: '#/career', label: t('career'), ico: 'career' },
  { href: '#/glossary', label: t('glossary'), ico: 'list' },
  { href: '#/bookmarks', label: t('bookmarks'), ico: 'bookmark' },
  { href: '#/progress', label: t('progress'), ico: 'chart' },
  { href: '#/settings', label: t('settings'), ico: 'settings' },
];
const BOTTOM = () => [['#/', t('home'), 'home'], ['#/learn', t('learn'), 'book'], ['#/practice', t('practice'), 'target'], ['#/cases', t('cases'), 'briefcase'], ['#/profile', t('profile'), 'user']];

function buildNav() {
  const open = store.settings.sidebarGroups || {};
  $('#nav').innerHTML = NAV().map((n) => {
    if (n.sep) return '<div class="nav-sep" role="separator"></div>';
    if (n.children) return `<details class="nav-group" data-group="${n.key}" ${open[n.key] !== false ? 'open' : ''}><summary>${icon(n.ico)}<span>${esc(n.label)}</span>${icon('chevron', 'chev')}</summary>
      <div class="nav-sub">${n.children.map(([h, l]) => `<a class="nav-link" href="${h}">${esc(l)}</a>`).join('')}</div></details>`;
    return `<a class="nav-link" href="${n.href}">${icon(n.ico)}<span>${esc(n.label)}</span></a>`;
  }).join('');
  $('#bottom-nav').innerHTML = BOTTOM().map(([h, l, i]) => `<a href="${h}">${icon(i)}<span>${esc(l)}</span></a>`).join('');
  $('#nav').addEventListener('toggle', (e) => { const g = e.target.closest('[data-group]'); if (g) store.setSetting('sidebarGroups', { ...store.settings.sidebarGroups, [g.dataset.group]: g.open }); }, true);
}

function markActive() {
  const cur = location.hash.split('?')[0] || '#/';
  const match = (links) => {
    let best = null, len = -1;
    links.forEach((a) => { const h = a.getAttribute('href'); a.removeAttribute('aria-current'); if ((cur === h || (h !== '#/' && cur.startsWith(h + '/')) || (h === '#/' && (cur === '#/' || cur === '#'))) && h.length > len) { best = a; len = h.length; } });
    best?.setAttribute('aria-current', 'page');
  };
  match($$('#nav .nav-link'));
  match($$('#bottom-nav a'));
  if (!$('#bottom-nav [aria-current]')) {
    const map = { '#/lesson': '#/learn', '#/law': '#/learn', '#/laws': '#/learn', '#/research': '#/learn', '#/method': '#/learn', '#/figma': '#/learn', '#/case': '#/cases', '#/exam': '#/practice', '#/challenge': '#/practice', '#/compare': '#/practice', '#/critique': '#/practice', '#/review': '#/practice', '#/flowlab': '#/practice', '#/settings': '#/profile', '#/progress': '#/profile', '#/bookmarks': '#/profile', '#/glossary': '#/profile' };
    const k = Object.keys(map).find((p) => cur === p || cur.startsWith(p + '/') || cur.startsWith(p + 's'));
    if (k) $(`#bottom-nav a[href="${map[k]}"]`)?.setAttribute('aria-current', 'page');
  }
}

/* ---------- Header stats ---------- */
function updateHeader() {
  const lv = levelInfo();
  $('#hdr-streak').innerHTML = `<span class="ico" aria-hidden="true">🔥</span>${currentStreak()}<span class="sr-only"> day streak</span>`;
  $('#hdr-xp').innerHTML = `<span class="ico" aria-hidden="true">⭐</span>${fmt(store.user.xp)}<span class="sr-only"> XP, level ${lv.level}</span>`;
  $('#hdr-xp').title = `Level ${lv.level} · ${lv.title}`;
  $('#theme-btn').innerHTML = icon(store.settings.theme === 'dark' ? 'sun' : 'moon');
  $('#theme-btn').setAttribute('aria-label', store.settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

/* ---------- Routes (lazy view modules) ---------- */
const V = {
  dashboard: () => import('./views/dashboard.js'), learn: () => import('./views/learn.js'), laws: () => import('./views/laws.js'), research: () => import('./views/research.js'),
  figma: () => import('./views/figma.js'), cases: () => import('./views/cases.js'), practice: () => import('./views/practice.js'), labs: () => import('./views/labs.js'),
  challenges: () => import('./views/challenges.js'), exams: () => import('./views/exams.js'), library: () => import('./views/library.js'), me: () => import('./views/me.js'),
};
const R = (pattern, mod, fn, title) => route(pattern, async () => ({ fn: (await V[mod]())[fn], title }), pattern);
R('', 'dashboard', 'render', 'Dashboard');
R('learn', 'learn', 'renderLearn', 'Learn'); R('learn/:id', 'learn', 'renderModule', 'Module'); R('lesson/:id', 'learn', 'renderLesson', 'Lesson'); R('roadmap', 'learn', 'renderRoadmap', 'Roadmap');
R('laws', 'laws', 'renderLaws', 'UX Laws'); R('law/:id', 'laws', 'renderLaw', 'UX Law');
R('research', 'research', 'renderResearch', 'UX Research'); R('method/:id', 'research', 'renderMethod', 'Research method'); R('toolkit', 'research', 'renderToolkit', 'Research toolkit'); R('persona', 'research', 'renderPersona', 'Persona builder');
R('figma', 'figma', 'renderFigma', 'Figma'); R('figma/items', 'figma', 'renderFigmaItems', 'Figma library'); R('figma/item/:id', 'figma', 'renderFigmaItem', 'Figma item'); R('figma/:level', 'figma', 'renderFigma', 'Figma');
R('plugins', 'figma', 'renderPlugins', 'Figma plugins'); R('plugin/:id', 'figma', 'renderPlugin', 'Plugin');
R('cases', 'cases', 'renderCases', 'Case studies'); R('case/:id', 'cases', 'renderCase', 'Case study');
R('practice', 'practice', 'renderPractice', 'Practice'); R('practice/quiz', 'practice', 'renderQuiz', 'Quiz'); R('review', 'practice', 'renderReview', 'Review');
R('compare', 'practice', 'renderCompareList', 'Good vs Bad Lab'); R('compare/:id', 'practice', 'renderCompare', 'Good vs Bad'); R('critique', 'practice', 'renderCritiqueList', 'Critique Lab'); R('critique/:id', 'practice', 'renderCritique', 'Critique');
R('flowlab', 'labs', 'renderFlowLab', 'User Flow Lab');
R('challenges', 'challenges', 'renderChallenges', 'Challenges'); R('challenge/:id', 'challenges', 'renderChallenge', 'Challenge'); R('projects', 'challenges', 'renderProjects', 'Projects'); R('project/:id', 'challenges', 'renderProject', 'Project'); R('career', 'challenges', 'renderCareer', 'Career');
R('exams', 'exams', 'renderExams', 'Exams'); R('exam/:id', 'exams', 'renderExam', 'Exam');
R('glossary', 'library', 'renderGlossary', 'Glossary'); R('glossary/:id', 'library', 'renderGlossary', 'Glossary'); R('bookmarks', 'library', 'renderBookmarks', 'Bookmarks'); R('search', 'library', 'renderSearch', 'Search');
R('progress', 'me', 'renderProgress', 'Progress'); R('profile', 'me', 'renderProfile', 'Profile'); R('settings', 'me', 'renderSettings', 'Settings');
fallback(async () => ({ fn: (await V.learn()).notFound, title: 'Not found' }));

let renderSeq = 0;
async function onRoute(r) {
  const seq = ++renderSeq;
  document.body.classList.remove('drawer-open'); $('.drawer-overlay')?.remove();
  closeSearch();
  const main = $('#main');
  const view = document.createElement('div');
  view.className = 'view'; view.id = 'view';
  try {
    const { fn, title } = await r.loader();
    if (seq !== renderSeq) return; // a newer navigation won
    main.replaceChildren(view);
    await fn(view, { params: r.params, query: r.query });
    const h1 = $('h1', view)?.textContent?.trim();
    document.title = `${h1 || title} · UX-UI`;
  } catch (e) {
    console.error(e);
    main.replaceChildren(view);
    view.innerHTML = `<div class="empty"><div class="e-ico">⚠️</div><h3>This page couldn't load</h3><p>${esc(e.message)}</p><a class="btn btn-primary" href="#/">Go to dashboard</a></div>`;
  }
  markActive();
  window.scrollTo(0, 0);
  if (sessionStorage.getItem('uxui.nav')) $('h1', view)?.focus({ preventScroll: true });
  sessionStorage.setItem('uxui.nav', '1');
}

/* ---------- Header search with grouped dropdown ---------- */
let sel = -1;
function closeSearch() { const p = $('#search-pop'); if (p) p.hidden = true; $('#hsearch')?.setAttribute('aria-expanded', 'false'); $('.header-search')?.classList.remove('mobile-open'); }
function initSearch() {
  const input = $('#hsearch'), pop = $('#search-pop');
  const draw = () => {
    const q = input.value.trim();
    if (!q) { closeSearch(); return; }
    const res = search(q, { limit: 40 });
    const groups = {};
    res.forEach((r) => { (groups[r.type] ||= []).length < 4 && groups[r.type].push(r); });
    const flat = Object.values(groups).flat();
    sel = -1;
    pop.innerHTML = flat.length ? Object.entries(groups).map(([type, list]) => `<div class="search-group" role="group" aria-label="${esc(typeLabel(type))}"><h3>${esc(typeLabel(type))}</h3>${list.map((r) => `<a class="search-item" role="option" href="${r.route}" id="so-${flat.indexOf(r)}"><span class="type-ico" aria-hidden="true">${typeIcon(r.type)}</span><span style="min-width:0"><span class="st">${highlight(r.title, q)}</span><span class="ss">${esc(r.sub || '')}</span></span></a>`).join('')}</div>`).join('')
      + `<a class="search-item" href="#/search?q=${encodeURIComponent(q)}" id="so-${flat.length}"><span class="type-ico">${icon('search')}</span><span class="st">See all results for “${esc(q)}”</span></a>`
      : `<div class="empty" style="border:0"><h3>${t('noResults')}</h3><p>Try “Fitts”, “persona” or “Auto Layout”.</p></div>`;
    pop.hidden = false; input.setAttribute('aria-expanded', 'true');
  };
  input.addEventListener('input', debounce(draw, 140));
  input.addEventListener('focus', () => { if (input.value.trim()) draw(); });
  input.addEventListener('keydown', (e) => {
    const opts = $$('.search-item', pop);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length; opts.forEach((o, i) => o.setAttribute('aria-selected', i === sel)); input.setAttribute('aria-activedescendant', opts[sel]?.id || ''); opts[sel]?.scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'Enter') { e.preventDefault(); const o = opts[sel]; navigate(o ? o.getAttribute('href') : `#/search?q=${encodeURIComponent(input.value)}`); input.blur(); }
    if (e.key === 'Escape') { closeSearch(); input.blur(); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.header-search') && !e.target.closest('[data-action="mobile-search"]')) closeSearch(); });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !e.target.closest('input, textarea, select, [contenteditable]'))) { e.preventDefault(); $('.header-search').classList.add('mobile-open'); input.focus(); input.select(); }
  });
}

/* ---------- Global delegated actions ---------- */
let deferredPrompt = null;
function initActions() {
  document.addEventListener('click', async (e) => {
    const a = e.target.closest('[data-action]'); if (!a) return;
    const act = a.dataset.action;
    if (act === 'bookmark') handleBookmark(a);
    if (act === 'complete') handleComplete(a);
    if (act === 'content-lang') { store.setSetting('contentLang', a.dataset.lang); onRoute(currentRoute()); }
    if (act === 'theme') { store.setSetting('theme', store.settings.theme === 'dark' ? 'light' : 'dark'); }
    if (act === 'ui-lang') { store.setSetting('lang', store.settings.lang === 'bn' ? 'en' : 'bn'); buildNav(); $('#hsearch').placeholder = t('searchPh'); $('#lang-btn').textContent = store.settings.lang === 'bn' ? 'EN' : 'বাং'; onRoute(currentRoute()); }
    if (act === 'menu') toggleDrawer(true);
    if (act === 'mobile-search') { $('.header-search').classList.add('mobile-open'); $('#hsearch').focus(); }
    if (act === 'install') install();
  });
}
const currentRoute = () => resolve();

function toggleDrawer(open) {
  document.body.classList.toggle('drawer-open', open);
  if (open) {
    const ov = document.createElement('div'); ov.className = 'drawer-overlay'; ov.addEventListener('click', () => toggleDrawer(false)); document.body.appendChild(ov);
    $('#sidebar .nav-link')?.focus();
  } else { $('.drawer-overlay')?.remove(); $('[data-action="menu"]')?.focus(); }
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) toggleDrawer(false); });

/* ---------- PWA ---------- */
async function install() {
  if (deferredPrompt) { deferredPrompt.prompt(); const r = await deferredPrompt.userChoice; deferredPrompt = null; if (r.outcome === 'accepted') toast('Installing UX-UI…', { ico: '📲' }); return; }
  if (matchMedia('(display-mode: standalone)').matches) { toast('UX-UI is already installed'); return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  modal({ title: t('install'), body: ios
    ? '<ol class="prose"><li>Open this page in Safari.</li><li>Tap the Share button.</li><li>Choose <strong>Add to Home Screen</strong>.</li></ol>'
    : '<ol class="prose"><li>Chrome / Edge (Windows, macOS, ChromeOS, Android): click the install icon in the address bar, or open the browser menu and choose <strong>Install app</strong>.</li><li>Safari on macOS: File → <strong>Add to Dock</strong>.</li></ol><p class="small muted mt-2">If no option appears, the app must be served over HTTPS (or localhost).</p>' });
}
function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
  if (!window.__UXUI_NO_SW && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./service-worker.js').then((reg) => {
      reg.addEventListener('updatefound', () => { const w = reg.installing; w?.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) toast('Update ready — reload to get the latest version', { ico: '🔄', timeout: 8000 }); }); });
    }).catch((err) => console.info('Service worker not registered:', err.message));
  }
  const net = () => { document.body.classList.toggle('is-offline', !navigator.onLine); $('#net-dot')?.classList.toggle('off', !navigator.onLine); $('#net-label').textContent = navigator.onLine ? 'Online · works offline' : 'Offline mode'; };
  addEventListener('online', net); addEventListener('offline', net); net();
}

/* ---------- Boot ---------- */
async function boot() {
  await store.init();
  applySettings();
  $('#boot-msg') && ($('#boot-msg').textContent = 'Loading lessons…');
  await loadContent();
  buildNav();
  $('#hsearch').placeholder = t('searchPh');
  $('#lang-btn').textContent = store.settings.lang === 'bn' ? 'EN' : 'বাং';
  $('.offline-banner').textContent = t('offline');
  updateHeader();
  initSearch(); initActions(); initPWA();
  store.subscribe((kind) => { if (kind === 'user') updateHeader(); if (kind === 'settings') { applySettings(); updateHeader(); } });
  store.subscribe((kind, d) => {
    if (kind === 'xp') toast(`<b>+${d.amount} XP</b> · ${esc(d.reason)}`, { kind: 'xp', ico: '⭐' });
    if (kind === 'levelup') toast(`<b>Level ${d.level}!</b> You're now ${esc(d.title)}`, { kind: 'xp', ico: '🎉', timeout: 5000 });
    if (kind === 'badge') toast(`<b>Achievement:</b> ${esc(d.name)}`, { kind: 'xp', ico: d.icon, timeout: 5000 });
  });
  addEventListener('pagehide', () => store.flush());
  document.addEventListener('visibilitychange', () => { if (document.hidden) store.flush(); });
  start(onRoute);
  warm();
  if (store.settings.reminders && !todayActivity().items && new Date().getHours() >= 17) setTimeout(() => toast('You haven\'t studied today — 15 minutes keeps your streak alive', { ico: '🔔', timeout: 7000 }), 1500);
}
boot().catch((e) => { console.error(e); const m = $('#main'); if (m) m.innerHTML = `<div class="view"><div class="empty"><div class="e-ico">⚠️</div><h3>UX-UI couldn't start</h3><p>${esc(e.message)}</p><button class="btn btn-primary" onclick="location.reload()">Reload</button></div></div>`; });
