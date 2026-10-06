import { store } from '../core/state.js';
import { t, T, L } from '../core/i18n.js';
import { esc, $, debounce, buildQuery } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C } from '../../data/content.js';
import { isDone, visit } from '../core/progress.js';
import { replaceQuery } from '../core/router.js';
import { tokenize } from '../core/search.js';
import { pageHead, itemCard, progressBar, diffBadge, pager, emptyState, bookmarkBtn, completeBtn, notesPanel, bindNotes } from '../ui/components.js';
import { renderMock } from '../ui/mock.js';
import { moduleStats } from './shared.js';
import { notFound } from './learn.js';

export function renderFigma(root, { params }) {
  const levels = ['figma-beginner', 'figma-intermediate', 'figma-advanced'].map((id) => C.moduleMap.get(id));
  const focus = params.level ? levels.find((m) => m.id === 'figma-' + params.level) : null;
  const list = focus ? [focus] : levels;
  root.innerHTML = `${pageHead({ title: 'Figma Master Roadmap', lead: 'From your first frame to design systems and Dev Mode. Every lesson has beginner-friendly, numbered steps.', actions: `<a class="btn btn-secondary" href="#/figma/items">${icon('grid')} ${C.figmaItems.length.toLocaleString()} learning items</a><a class="btn btn-secondary" href="#/plugins">${icon('puzzle')} ${C.plugins.length} plugins</a>` })}
    <div class="grid grid-3">${levels.map((m) => { const s = moduleStats(m); return `<a class="card card-link" href="#/figma/${m.id.replace('figma-', '')}" aria-current="${focus === m ? 'page' : 'false'}"><span class="badge badge-primary">${esc(m.level)}</span><h3 class="mt-2">${esc(T(m))}</h3><p>${esc(L(m.desc, store.settings.lang))}</p><div class="mt-4">${progressBar(s.pct)}</div><p class="tiny muted mt-2">${s.done}/${s.total}</p></a>`; }).join('')}</div>
    ${list.map((m) => `<section class="section"><div class="section-head"><h2>${esc(m.title)}</h2><a href="#/learn/${m.id}">Open module</a></div><div class="grid grid-3">${m.items.map((k) => itemCard(k)).join('')}</div></section>`).join('')}`;
}

const PER = 24;
export function renderFigmaItems(root, { query }) {
  let st = { q: query.q || '', cat: query.cat || 'all', diff: query.diff || 'all', theme: query.theme || 'all', platform: query.platform || 'all', page: +query.page || 1 };
  root.innerHTML = `${pageHead({ crumbs: [['Figma', '#/figma'], ['Learning library']], title: 'Figma Learning Library', lead: `${C.figmaItems.length.toLocaleString()} items across ${C.figmaCategories.length} categories. Each item: what it is, why it's used, UX & UI purpose, a visual, 9 construction steps for its exact variant, common mistakes and a practice challenge.` })}
    <div class="toolbar"><div class="search-box">${icon('search')}<label for="fi-q" class="sr-only">Search Figma items</label><input id="fi-q" class="input" type="search" placeholder="Search: button, checkout, skeleton…" value="${esc(st.q)}"></div>
      <label class="sr-only" for="fi-cat">Category</label><select id="fi-cat" class="select" data-k="cat"><option value="all">All categories</option>${C.figmaCategories.map((c) => `<option ${c === st.cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
      <label class="sr-only" for="fi-diff">Difficulty</label><select id="fi-diff" class="select" data-k="diff"><option value="all">Any difficulty</option>${['Beginner', 'Intermediate', 'Advanced'].map((d) => `<option ${d === st.diff ? 'selected' : ''}>${d}</option>`).join('')}</select>
      <label class="sr-only" for="fi-pl">Platform</label><select id="fi-pl" class="select" data-k="platform"><option value="all">Any platform</option>${['Mobile', 'Tablet', 'Desktop'].map((d) => `<option ${d === st.platform ? 'selected' : ''}>${d}</option>`).join('')}</select>
      <label class="sr-only" for="fi-th">Theme</label><select id="fi-th" class="select" data-k="theme"><option value="all">Any theme</option>${['Light', 'Dark'].map((d) => `<option ${d === st.theme ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
    <p class="result-count" id="fi-count" aria-live="polite"></p><div class="grid grid-auto" id="fi-grid"></div><div id="fi-pager"></div>`;
  const draw = () => {
    const toks = tokenize(st.q);
    // Filtering 2,600+ records in memory is fast; only one page is rendered to the DOM.
    const list = C.figmaItems.filter((x) => (st.cat === 'all' || x.category === st.cat) && (st.diff === 'all' || x.difficulty === st.diff) && (st.theme === 'all' || x.variant.theme === st.theme) && (st.platform === 'all' || x.variant.platform === st.platform)
      && (!toks.length || toks.every((tk) => `${x.name} ${x.category} ${x.what}`.toLowerCase().includes(tk))));
    const pages = Math.max(1, Math.ceil(list.length / PER)); st.page = Math.min(st.page, pages);
    const slice = list.slice((st.page - 1) * PER, st.page * PER);
    $('#fi-count', root).textContent = `${list.length.toLocaleString()} items`;
    $('#fi-grid', root).innerHTML = slice.length ? slice.map((x) => `<a class="card card-link" href="#/figma/item/${x.id}"><div class="card-top"><span class="badge">${esc(x.category)}</span>${isDone('figma:' + x.id) ? `<span class="done-mark is-done">${icon('check')}</span>` : ''}</div><h3>${esc(x.name)}</h3><p>${esc(x.variant.size)} · ${esc(x.variant.theme)} · ${esc(x.variant.platform)}</p><div class="card-meta">${diffBadge(x.difficulty)}</div></a>`).join('')
      : `<div style="grid-column:1/-1">${emptyState({ ico: '🎨', title: 'No items match these filters', text: 'Remove a filter or search a broader word like "form" or "card".', action: '<button class="btn btn-secondary" data-clear>Clear filters</button>' })}</div>`;
    $('#fi-pager', root).innerHTML = pager(st.page, pages, list.length, PER);
    replaceQuery('#/figma/items' + buildQuery({ ...st, page: st.page > 1 ? st.page : '' }));
  };
  $('#fi-q', root).addEventListener('input', debounce((e) => { st.q = e.target.value; st.page = 1; draw(); }, 180));
  root.addEventListener('change', (e) => { const k = e.target.dataset.k; if (k) { st[k] = e.target.value; st.page = 1; draw(); } });
  root.addEventListener('click', (e) => {
    const p = e.target.closest('[data-page]'); if (p && !p.disabled) { st.page = +p.dataset.page; draw(); $('h1', root).scrollIntoView({ behavior: 'smooth' }); }
    if (e.target.closest('[data-clear]')) { st = { q: '', cat: 'all', diff: 'all', theme: 'all', platform: 'all', page: 1 }; renderFigmaItems(root, { query: {} }); }
  });
  draw();
}

export function renderFigmaItem(root, { params }) {
  const x = C.figmaMap.get(params.id); if (!x) return notFound(root);
  const key = 'figma:' + x.id, route = '#/figma/item/' + x.id;
  visit(key, x.name, route);
  const siblings = C.figmaItems.filter((y) => y.baseId === x.baseId);
  const rel = x.related.map((b) => C.figmaItems.find((y) => y.baseId === b)).filter(Boolean);
  root.innerHTML = `${pageHead({ crumbs: [['Figma', '#/figma'], ['Library', '#/figma/items'], [x.category, `#/figma/items?cat=${encodeURIComponent(x.category)}`], [x.name]], title: x.name, sub: `${x.variant.size} · ${x.variant.theme} · ${x.variant.platform}` })}
    <div class="row-between"><div class="lesson-meta" style="margin:0">${diffBadge(x.difficulty)}<span class="badge">${esc(x.category)}</span></div><div class="lesson-actions">${bookmarkBtn(key, x.name, route)}${completeBtn(key, x.name, route, 15)}</div></div>
    <div class="split mt-6"><article class="lesson-body">
      <figure class="figure"><div class="compare-stage">${renderMock(x.mock, { theme: x.variant.theme, label: x.name })}</div><figcaption>Visual example (${esc(x.variant.theme)} theme)</figcaption></figure>
      <div class="qa-grid"><div class="callout"><h4>What it is</h4><p>${esc(x.what)}</p></div><div class="callout"><h4>Why it is used</h4><p>${esc(x.why)}</p></div><div class="callout info"><h4>UX purpose</h4><p>${esc(x.ux)}</p></div><div class="callout info"><h4>UI purpose</h4><p>${esc(x.ui)}</p></div></div>
      <section><h2>How to create this in Figma</h2><ol class="steps-list mt-4">${x.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></section>
      <div class="callout bad"><h4>Common mistake</h4><p>${esc(x.mistake)}</p></div>
      <div class="callout key"><h4>Practice challenge</h4><p>${esc(x.challenge)}</p></div>
      ${notesPanel(key)}
    </article>
    <aside class="stack"><section class="card"><h2 style="font-size:var(--fs-md)">Other variants (${siblings.length})</h2><div class="stack-sm mt-2" style="max-height:340px;overflow:auto">${siblings.map((y) => `<a class="small" href="#/figma/item/${y.id}" ${y.id === x.id ? 'aria-current="page" style="font-weight:700"' : ''}>${esc(y.variant.style)} · ${esc(y.variant.size)} · ${esc(y.variant.theme)} · ${esc(y.variant.platform)}</a>`).join('')}</div></section>
      ${rel.length ? `<section class="card"><h2 style="font-size:var(--fs-md)">Related items</h2><div class="stack-sm mt-2">${rel.map((y) => `<a class="small" href="#/figma/item/${y.id}">${esc(y.name.split(' — ')[0])}</a>`).join('')}</div></section>` : ''}</aside></div>`;
  bindNotes(root);
}

/* ---------- Plugins ---------- */
export function renderPlugins(root, { query }) {
  let st = { q: query.q || '', cat: query.cat || 'all', level: query.level || 'all', use: query.use || 'all', page: +query.page || 1 };
  root.innerHTML = `${pageHead({ crumbs: [['Figma', '#/figma'], ['Plugins']], title: 'Figma Plugin Library', lead: 'Search by need — try "icons", "remove background", "accessibility", "mockup", "AI", "content", "color" or "wireframe".' })}
    <div class="callout key"><h4>About these records</h4><p class="small">${esc(C.pluginNote)}</p></div>
    <div class="toolbar mt-6"><div class="search-box">${icon('search')}<label class="sr-only" for="pl-q">Search plugins</label><input id="pl-q" class="input" type="search" placeholder="What do you need to do?" value="${esc(st.q)}"></div>
      <label class="sr-only" for="pl-c">Category</label><select id="pl-c" class="select" data-k="cat"><option value="all">All categories</option>${C.pluginCategories.map((c) => `<option ${c === st.cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
      <label class="sr-only" for="pl-l">Difficulty</label><select id="pl-l" class="select" data-k="level"><option value="all">Any level</option>${['Beginner', 'Intermediate', 'Advanced'].map((d) => `<option ${d === st.level ? 'selected' : ''}>${d}</option>`).join('')}</select>
      <label class="sr-only" for="pl-u">Use case</label><select id="pl-u" class="select" data-k="use"><option value="all">Any use case</option>${C.pluginUseCases.map((d) => `<option ${d === st.use ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
    <p class="result-count" id="pl-count" aria-live="polite"></p><div class="grid grid-3" id="pl-grid"></div><div id="pl-pager"></div>`;
  const draw = () => {
    const toks = tokenize(st.q);
    const list = C.plugins.filter((p) => (st.cat === 'all' || p.category === st.cat) && (st.level === 'all' || p.level === st.level) && (st.use === 'all' || p.useCase === st.use || p.workflow === st.use)
      && (!toks.length || toks.every((tk) => `${p.name} ${p.kw} ${p.does} ${p.category}`.toLowerCase().includes(tk))));
    const pages = Math.max(1, Math.ceil(list.length / PER)); st.page = Math.min(st.page, pages);
    $('#pl-count', root).textContent = `${list.length} plugins`;
    $('#pl-grid', root).innerHTML = list.length ? list.slice((st.page - 1) * PER, st.page * PER).map((p) => `<a class="card card-link" href="#/plugin/${p.id}"><div class="card-top"><span class="badge">${esc(p.category)}</span><span class="badge badge-warn" title="Information needs verification">verify</span></div><h3>${esc(p.name)}</h3><p>${esc(p.does)}</p><div class="card-meta">${diffBadge(p.level)}<span class="tiny muted">${esc(p.useCase)}</span></div></a>`).join('')
      : `<div style="grid-column:1/-1">${emptyState({ ico: '🧩', title: `No plugins for “${st.q}”`, text: 'Try describing the task differently, e.g. "contrast" instead of "a11y check".', action: '<button class="btn btn-secondary" data-clear>Clear filters</button>' })}</div>`;
    $('#pl-pager', root).innerHTML = pager(st.page, pages, list.length, PER);
    replaceQuery('#/plugins' + buildQuery({ ...st, page: st.page > 1 ? st.page : '' }));
  };
  $('#pl-q', root).addEventListener('input', debounce((e) => { st.q = e.target.value; st.page = 1; draw(); }, 150));
  root.addEventListener('change', (e) => { const k = e.target.dataset.k; if (k) { st[k] = e.target.value; st.page = 1; draw(); } });
  root.addEventListener('click', (e) => { const p = e.target.closest('[data-page]'); if (p && !p.disabled) { st.page = +p.dataset.page; draw(); } if (e.target.closest('[data-clear]')) renderPlugins(root, { query: {} }); });
  draw();
}

export function renderPlugin(root, { params }) {
  const p = C.pluginMap.get(params.id); if (!p) return notFound(root);
  const key = 'plugin:' + p.id;
  const row = (k, v) => `<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`;
  root.innerHTML = `${pageHead({ crumbs: [['Figma', '#/figma'], ['Plugins', '#/plugins'], [p.name]], title: p.name, actions: bookmarkBtn(key, p.name, '#/plugin/' + p.id) })}
    <div class="table-wrap"><table class="table"><tbody>${row('Category', p.category)}${row('What it does', p.does)}${row('Why useful', p.why)}${row('When to use it', p.when)}${row('Level', p.level)}${row('Related workflow', p.workflow)}${row('Example use case', p.useCase)}${row('Search keywords', p.kw)}${row('Status', p.lastVerified ? `Verified ${p.lastVerified}` : 'Needs verification — check the listing on figma.com/community before relying on details')}${p.note ? row('Note', p.note) : ''}</tbody></table></div>
    <p class="small muted mt-4">Find it in Figma: Resources (Shift+I) → Plugins → search “${esc(p.name)}”.</p>`;
}
