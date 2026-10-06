import { store } from '../core/state.js';
import { esc, $ } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C } from '../../data/content.js';
import { isDone, visit } from '../core/progress.js';
import { pageHead, diffBadge, bookmarkBtn, completeBtn, notesPanel, bindNotes, emptyState } from '../ui/components.js';
import { renderMock } from '../ui/mock.js';
import { notFound } from './learn.js';

export function renderCases(root, { query }) {
  const cat = query.cat || 'all';
  const counts = Object.fromEntries(C.caseCategories.map((c) => [c, C.cases.filter((x) => x.category === c || x.tags.includes(c.toLowerCase())).length]));
  const list = C.cases.filter((x) => cat === 'all' || x.category === cat || x.tags.includes(cat.toLowerCase()));
  root.innerHTML = `${pageHead({ title: 'UX Case Study Library', lead: 'Each case walks through 20 stages from problem to lessons learned. You\'ll be asked what you would do before the solution is revealed.' })}
    <div class="callout info"><h4>About these cases</h4><p class="small">These are composite teaching cases built on realistic scenarios — not reports of specific companies. Metrics are illustrative. The library is structured to hold 200+ cases across ${C.caseCategories.length} categories.</p></div>
    <div class="chips mt-6" role="group" aria-label="Filter by category"><a class="chip" href="#/cases" aria-pressed="${cat === 'all'}">All <span class="count">${C.cases.length}</span></a>${C.caseCategories.map((c) => `<a class="chip" href="#/cases?cat=${encodeURIComponent(c)}" aria-pressed="${cat === c}">${esc(c)} <span class="count">${counts[c]}</span></a>`).join('')}</div>
    <div class="grid grid-2 mt-6">${list.length ? list.map((x) => `<a class="card card-link" href="#/case/${x.id}"><div class="card-top"><span class="badge badge-primary">${esc(x.category)}</span>${isDone('case:' + x.id) ? `<span class="done-mark is-done">${icon('check')}</span>` : ''}</div><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p><div class="card-meta">${diffBadge(x.difficulty)}<span class="tiny muted">${x.minutes} min</span></div></a>`).join('')
      : `<div style="grid-column:1/-1">${emptyState({ ico: '🗂️', title: `No ${cat} cases yet`, text: 'This category is part of the library structure; cases will be added here. Try another category.', action: '<a class="btn btn-secondary" href="#/cases">Show all cases</a>' })}</div>`}</div>`;
}

export function renderCase(root, { params }) {
  const x = C.caseMap.get(params.id); if (!x) return notFound(root);
  const key = 'case:' + x.id, route = '#/case/' + x.id;
  visit(key, x.title, route);
  const saved = store.user.critiques['case-' + x.id];
  const revealed = !!saved?.revealed;
  root.innerHTML = `${pageHead({ crumbs: [['Case studies', '#/cases'], [x.title]], title: x.title, lead: esc(x.summary) })}
    <div class="row-between"><div class="lesson-meta" style="margin:0">${diffBadge(x.difficulty)}<span class="badge badge-primary">${esc(x.category)}</span><span class="badge">${x.minutes} min</span></div><div class="lesson-actions">${bookmarkBtn(key, x.title, route)}${completeBtn(key, x.title, route, x.minutes)}</div></div>
    <section class="card mt-6" aria-labelledby="wwyd"><h2 id="wwyd" style="font-size:var(--fs-xl)">What would you do?</h2><p class="mt-2">${esc(x.scenario.question)}</p>
      <ul class="prose small mt-2">${x.scenario.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <div class="field mt-4"><label for="wwyd-a">Your approach</label><textarea class="textarea" id="wwyd-a" rows="4" placeholder="What would you research? What would you change and why?">${esc(saved?.answer || '')}</textarea><span class="hint">Writing first, then comparing, is how you build judgment.</span></div>
      <div class="row mt-4"><button class="btn btn-primary" data-reveal>${revealed ? 'Solution shown below' : 'Reveal the case'}</button></div></section>
    <div id="case-body" class="mt-6" ${revealed ? '' : 'hidden'}>${sections(x)}${notesPanel(key)}</div>`;
  bindNotes(root);
  $('[data-reveal]', root).addEventListener('click', () => {
    const answer = $('#wwyd-a', root).value.trim();
    store.update((u) => { u.critiques['case-' + x.id] = { answer, revealed: true, ts: Date.now() }; });
    const body = $('#case-body', root); body.hidden = false; body.querySelector('summary')?.focus();
    $('[data-reveal]', root).textContent = 'Solution shown below';
  });
}

function sections(x) {
  const list = (a) => `<ul class="prose">${a.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const render = (k) => {
    const v = x[k];
    switch (k) {
      case 'persona': return `<div class="persona-card"><div class="avatar-ph" aria-hidden="true">${esc(v.name[0])}</div><div><h3>${esc(v.name)}, ${v.age}</h3><p class="small muted">${esc(v.occupation)}</p><p class="quote mt-4">“${esc(v.quote)}”</p><p class="mt-4"><strong>Goal:</strong> ${esc(v.goal)}</p><p><strong>Frustration:</strong> ${esc(v.frustration)}</p></div></div>`;
      case 'journey': return `<div class="table-wrap"><table class="table"><thead><tr><th>Stage</th><th>Feeling</th><th>Note</th></tr></thead><tbody>${v.map(([s, e, n]) => `<tr><td>${esc(s)}</td><td aria-label="emotion ${e}">${['😣', '🙁', '😐', '🙂', '😀'][e + 2]}</td><td>${esc(n)}</td></tr>`).join('')}</tbody></table></div>`;
      case 'flow': return `<ol class="steps-list">${v.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`;
      case 'ia': return `<pre class="template">${esc(v.join('\n'))}</pre>`;
      case 'wireframe': case 'ui': return `<div class="compare-stage">${renderMock(v, { label: k })}</div>`;
      case 'laws': return `<div class="chips">${v.map((id) => { const l = C.lawMap.get(id); return l ? `<a class="chip" href="#/law/${id}">${esc(l.name)}</a>` : ''; }).join('')}</div>`;
      default: return Array.isArray(v) ? list(v) : `<p>${esc(v)}</p>`;
    }
  };
  return C.caseSections.map(([k, label], i) => `<details class="acc" ${i < 6 ? 'open' : ''}><summary><span class="num">${i + 1}</span>${esc(label)}</summary><div class="acc-body">${render(k)}</div></details>`).join('')
    + (x.outcome ? `<div class="callout key mt-4"><h4>Outcome</h4><p>${esc(x.outcome)}</p></div>` : '');
}
