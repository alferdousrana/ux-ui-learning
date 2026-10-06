import { store } from '../core/state.js';
import { t, L } from '../core/i18n.js';
import { esc, debounce, $, buildQuery } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C } from '../../data/content.js';
import { isDone, visit } from '../core/progress.js';
import { replaceQuery } from '../core/router.js';
import { tokenize } from '../core/search.js';
import { pageHead, langSwitch, bookmarkBtn, completeBtn, notesPanel, bindNotes, compareView, miniQuiz, bindMiniQuiz, diffBadge, emptyState } from '../ui/components.js';
import { diagram, hasDiagram } from '../ui/visuals.js';
import { notFound } from './learn.js';

export function renderLaws(root, { query }) {
  let q = query.q || '', cat = query.cat || 'all';
  root.innerHTML = `${pageHead({ title: 'UX Laws', lead: 'A searchable library of the laws and principles that describe how people perceive, decide and act. Each card includes Bangla and English explanations, examples and a quiz.' })}
    <div class="toolbar"><div class="search-box">${icon('search')}<label class="sr-only" for="law-q">Search UX laws</label><input id="law-q" class="input" type="search" placeholder="Search laws, e.g. Fitts, memory, buttons" value="${esc(q)}"></div>
    <label class="sr-only" for="law-cat">Category</label><select id="law-cat" class="select"><option value="all">All categories</option>${C.lawCategories.map((c) => `<option ${c === cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
    <p class="result-count" id="law-count" aria-live="polite"></p><div class="grid grid-3" id="law-grid"></div>`;
  const draw = () => {
    const toks = tokenize(q);
    const list = C.laws.filter((l) => (cat === 'all' || l.category === cat) && (!toks.length || toks.every((tk) => `${l.name} ${l.short} ${l.tags.join(' ')} ${l.category} ${l.web} ${l.mobile}`.toLowerCase().includes(tk))));
    $('#law-count', root).textContent = `${list.length} of ${C.laws.length} laws`;
    $('#law-grid', root).innerHTML = list.length ? list.map((l) => `<a class="card card-link" href="#/law/${l.id}"><div class="card-top"><span class="badge badge-primary">${esc(l.category)}</span>${isDone('law:' + l.id) ? `<span class="done-mark is-done" aria-label="Completed">${icon('check')}</span>` : ''}</div><h3>${esc(l.name)}</h3><p>${esc(l.short)}</p><div class="card-meta">${diffBadge(l.difficulty)}</div></a>`).join('')
      : `<div style="grid-column:1/-1">${emptyState({ ico: '🔎', title: `No laws match “${q}”`, text: 'Try a broader word such as "memory", "choice" or "touch", or clear the category filter.', action: '<button class="btn btn-secondary" data-clear>Clear filters</button>' })}</div>`;
    replaceQuery('#/laws' + buildQuery({ q, cat }));
  };
  $('#law-q', root).addEventListener('input', debounce((e) => { q = e.target.value; draw(); }, 150));
  $('#law-cat', root).addEventListener('change', (e) => { cat = e.target.value; draw(); });
  root.addEventListener('click', (e) => { if (e.target.closest('[data-clear]')) { q = ''; cat = 'all'; $('#law-q', root).value = ''; $('#law-cat', root).value = 'all'; draw(); } });
  draw();
}

export function renderLaw(root, { params }) {
  const l = C.lawMap.get(params.id); if (!l) return notFound(root);
  const key = 'law:' + l.id, route = '#/law/' + l.id;
  visit(key, l.name, route);
  const lang = store.settings.contentLang;
  const cmp = l.compare ? C.compareMap.get(l.compare) : null;
  const i = C.laws.indexOf(l), next = C.laws[i + 1], prev = C.laws[i - 1];
  const box = (title, v, cls = '') => (v ? `<div class="callout ${cls}"><h4>${title}</h4><p>${esc(v)}</p></div>` : '');
  root.innerHTML = `${pageHead({ crumbs: [['UX Laws', '#/laws'], [l.name]], title: l.name, lead: esc(l.short) })}
    <div class="lesson-meta">${diffBadge(l.difficulty)}<span class="badge badge-primary">${esc(l.category)}</span></div>
    <div class="row-between">${langSwitch()}<div class="lesson-actions">${bookmarkBtn(key, l.name, route)}${completeBtn(key, l.name, route, 12)}</div></div>
    <article class="lesson-body mt-6">
      <section><h2>${lang === 'bn' ? 'বাংলা' : 'English'}</h2><p class="explain mt-2" lang="${lang}">${esc(lang === 'bn' ? l.bn : l.en)}</p>
        <details class="acc mt-4"><summary>${lang === 'bn' ? 'English' : 'বাংলা'}</summary><div class="acc-body"><p>${esc(lang === 'bn' ? l.en : l.bn)}</p></div></details></section>
      ${l.visual && hasDiagram(l.visual) ? `<figure class="figure">${diagram(l.visual)}</figure>` : ''}
      <div class="qa-grid">${box('Why it matters', l.why, 'info')}${box('Human behavior behind it', l.behavior, 'info')}</div>
      <div class="qa-grid">${box('Real-world example', l.realWorld)}${box('Website example', l.web)}${box('Mobile app example', l.mobile)}${box('Design recommendation (summary)', l.recommendation?.[0])}</div>
      <div class="qa-grid">${box('✓ Good UX', l.good, 'good')}${box('✕ Bad UX', l.bad, 'bad')}</div>
      ${cmp ? `<section><h2>Before vs after</h2><div class="mt-4">${compareView(cmp)}</div></section>` : ''}
      <section><h2>Apply it — checklist</h2><ul class="checklist mt-4">${l.recommendation.map((r, k) => { const ck = !!store.user.toolkit[`law-${l.id}-${k}`]; return `<li><label><input type="checkbox" data-ck="law-${l.id}-${k}" ${ck ? 'checked' : ''}> ${esc(r)}</label></li>`; }).join('')}</ul></section>
      <div class="qa-grid">${box('When to use it', l.whenUse, 'primary')}${box('When NOT to overuse it', l.whenNot, 'key')}</div>
      ${box('Common mistake', l.mistake, 'bad')}
      <section><h2>Related UX laws</h2><div class="chips mt-4">${l.related.map((r) => C.lawMap.get(r)).filter(Boolean).map((r) => `<a class="chip" href="#/law/${r.id}">${esc(r.name)}</a>`).join('')}</div></section>
      ${miniQuiz(l.quiz, 'wq-' + l.id, l.tags)}
      ${notesPanel(key)}
    </article>
    <nav class="lesson-nav">${prev ? `<a href="#/law/${prev.id}"><span class="dir">← ${t('prev')}</span><span class="ttl">${esc(prev.name)}</span></a>` : '<span></span>'}${next ? `<a href="#/law/${next.id}" style="text-align:right"><span class="dir">${t('next')} →</span><span class="ttl">${esc(next.name)}</span></a>` : ''}</nav>`;
  bindNotes(root); bindMiniQuiz(root);
  root.addEventListener('change', (e) => { const c = e.target.closest('[data-ck]'); if (c) store.update((u) => { u.toolkit[c.dataset.ck] = c.checked; }); });
}
