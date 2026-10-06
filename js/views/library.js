import { store } from '../core/state.js';
import { t } from '../core/i18n.js';
import { esc, $, debounce, timeAgo } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C, byKey } from '../../data/content.js';
import { search, highlight } from '../core/search.js';
import { replaceQuery } from '../core/router.js';
import { pageHead, emptyState, typeIcon, typeLabel, bookmarkBtn } from '../ui/components.js';

/* ---------- Glossary ---------- */
export function renderGlossary(root, { params, query }) {
  let q = query.q || '';
  const focus = params.id;
  root.innerHTML = `${pageHead({ title: t('glossary'), lead: `${C.glossary.length} UX/UI terms in Bangla and English, each with a simple definition, a professional definition and an example.` })}
    <div class="toolbar"><div class="search-box">${icon('search')}<label class="sr-only" for="gq">Search glossary</label><input id="gq" class="input" type="search" placeholder="Search a term in English or Bangla" value="${esc(q)}"></div></div>
    <nav class="chips" aria-label="Jump to letter" id="az"></nav><p class="result-count mt-4" id="gcount" aria-live="polite"></p><div id="glist" class="stack-sm"></div>`;
  const draw = () => {
    const ql = q.trim().toLowerCase();
    const list = C.glossary.filter((g) => !ql || `${g.term} ${g.bn} ${g.simple} ${g.en}`.toLowerCase().includes(ql));
    const letters = [...new Set(list.map((g) => g.term[0].toUpperCase()))];
    $('#az', root).innerHTML = letters.map((l) => `<a class="chip" href="#/glossary" data-letter="${l}">${l}</a>`).join('');
    $('#gcount', root).textContent = `${list.length} terms`;
    $('#glist', root).innerHTML = list.length ? list.map((g) => `<details class="acc" id="g-${g.id}" data-l="${g.term[0].toUpperCase()}" ${focus === g.id ? 'open' : ''}><summary><span><strong>${esc(g.term)}</strong> <span class="small muted">· ${esc(g.bn)}</span></span></summary><div class="acc-body">
      <div class="qa-grid"><div class="callout"><h4>Simple definition</h4><p>${esc(g.simple)}</p></div><div class="callout info"><h4>Professional definition</h4><p>${esc(g.en)}</p></div></div>
      <div class="callout key mt-4"><h4>Example</h4><p>${esc(g.example)}</p></div>
      ${g.related.length ? `<div class="row mt-4"><span class="small muted">Related:</span>${g.related.map((r) => { const rg = C.glossary.find((x) => x.term === r); return rg ? `<a class="chip" href="#/glossary/${rg.id}">${esc(r)}</a>` : `<span class="badge">${esc(r)}</span>`; }).join('')}</div>` : ''}
      <div class="mt-4">${bookmarkBtn('term:' + g.id, g.term, '#/glossary/' + g.id)}</div></div></details>`).join('')
      : emptyState({ ico: '📖', title: `No term matches “${q}”`, text: 'Try the English term (e.g. "affordance") or part of a word.' });
    replaceQuery('#/glossary' + (focus ? '/' + focus : '') + (q ? '?q=' + encodeURIComponent(q) : ''));
  };
  $('#gq', root).addEventListener('input', debounce((e) => { q = e.target.value; draw(); }, 150));
  root.addEventListener('click', (e) => { const l = e.target.closest('[data-letter]'); if (l) { e.preventDefault(); root.querySelector(`[data-l="${l.dataset.letter}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
  draw();
  if (focus) setTimeout(() => $(`#g-${focus}`, root)?.scrollIntoView({ block: 'center' }), 50);
}

/* ---------- Bookmarks ---------- */
export function renderBookmarks(root) {
  const items = Object.values(store.user.bookmarks).sort((a, b) => b.ts - a.ts);
  const groups = items.reduce((m, b) => ((m[b.type] ||= []).push(b), m), {});
  root.innerHTML = `${pageHead({ title: t('bookmarks'), lead: 'Lessons, laws, case studies, Figma items, plugins and terms you saved. Stored on this device.' })}
    ${items.length ? Object.entries(groups).map(([type, list]) => `<section class="section"><h2 style="font-size:var(--fs-lg)">${typeIcon(type)} ${esc(typeLabel(type))} <span class="muted small">(${list.length})</span></h2>
      <div class="stack-sm mt-4">${list.map((b) => `<div class="card row-between" style="padding:var(--sp-3) var(--sp-4)"><a href="${b.route}"><strong>${esc(b.title)}</strong></a><span class="row"><span class="tiny muted">${timeAgo(b.ts)}</span><button class="btn btn-ghost btn-sm" data-unbm="${esc(b.key)}" aria-label="Remove bookmark ${esc(b.title)}">${icon('x')}</button></span></div>`).join('')}</div></section>`).join('')
      : emptyState({ ico: '🔖', title: 'No bookmarks yet', text: 'Tap "Bookmark" on any lesson, law or case study to keep it here for quick access.', action: '<a class="btn btn-primary" href="#/learn">Browse lessons</a>' })}`;
  root.addEventListener('click', (e) => { const b = e.target.closest('[data-unbm]'); if (!b) return; store.update((u) => { delete u.bookmarks[b.dataset.unbm]; }); renderBookmarksAgain(root); });
}
function renderBookmarksAgain(root) { const fresh = document.createElement('div'); root.replaceWith(fresh); fresh.className = root.className; fresh.id = root.id; renderBookmarks(fresh); }

/* ---------- Global search page ---------- */
const TYPES = ['law', 'lesson', 'method', 'case', 'compare', 'figma', 'plugin', 'term', 'challenge', 'exam', 'project', 'critique', 'module'];
export function renderSearch(root, { query }) {
  let q = query.q || '', type = query.type || 'all';
  root.innerHTML = `${pageHead({ title: 'Search', lead: 'Search lessons, UX laws, research methods, UI components, Figma tutorials, plugins, case studies, exams and the glossary.' })}
    <div class="search-box" style="max-width:640px">${icon('search')}<label class="sr-only" for="sq">Search everything</label><input id="sq" class="input" type="search" placeholder="Try “Fitts”, “empty state”, “card sorting”…" value="${esc(q)}" autocomplete="off"></div>
    <div class="chips mt-4" id="stypes" role="group" aria-label="Filter results by type"></div><p class="result-count mt-4" id="scount" aria-live="polite"></p><div id="sres"></div>`;
  const draw = () => {
    const all = q.trim() ? search(q, { limit: 400 }) : [];
    const counts = all.reduce((m, r) => ((m[r.type] = (m[r.type] || 0) + 1), m), {});
    $('#stypes', root).innerHTML = q.trim() ? `<button class="chip" data-type="all" aria-pressed="${type === 'all'}">All <span class="count">${all.length}</span></button>${TYPES.filter((tp) => counts[tp]).map((tp) => `<button class="chip" data-type="${tp}" aria-pressed="${type === tp}">${typeIcon(tp)} ${typeLabel(tp)} <span class="count">${counts[tp]}</span></button>`).join('')}` : '';
    const list = type === 'all' ? all : all.filter((r) => r.type === type);
    $('#scount', root).textContent = q.trim() ? `${list.length} result${list.length === 1 ? '' : 's'} for “${q}”` : '';
    $('#sres', root).innerHTML = !q.trim() ? `<div class="section"><h2 style="font-size:var(--fs-lg)">Popular searches</h2><div class="chips mt-4">${['Fitts', 'Hick', 'usability testing', 'card sorting', 'empty state', 'Auto Layout', 'contrast', 'persona', 'checkout', 'icons'].map((s) => `<a class="chip" href="#/search?q=${encodeURIComponent(s)}">${s}</a>`).join('')}</div></div>`
      : list.length ? `<div class="stack-sm">${list.slice(0, 100).map((r) => `<a class="search-item card" href="${r.route}"><span class="type-ico" aria-hidden="true">${typeIcon(r.type)}</span><span style="min-width:0"><span class="st">${highlight(r.title, q)}</span><span class="ss">${esc(typeLabel(r.type))}${r.sub ? ' · ' + esc(r.sub) : ''}</span></span></a>`).join('')}</div>`
      : emptyState({ ico: '🔎', title: `No results for “${q}”`, text: 'Check the spelling, use fewer words, or try a related term like "navigation" instead of "menu bar".', action: '<a class="btn btn-secondary" href="#/glossary">Browse the glossary</a>' });
    replaceQuery('#/search' + (q ? `?q=${encodeURIComponent(q)}${type !== 'all' ? '&type=' + type : ''}` : ''));
  };
  $('#sq', root).addEventListener('input', debounce((e) => { q = e.target.value; type = 'all'; draw(); }, 160));
  root.addEventListener('click', (e) => { const c = e.target.closest('[data-type]'); if (c) { type = c.dataset.type; draw(); } });
  draw();
  setTimeout(() => $('#sq', root).focus(), 50);
}
