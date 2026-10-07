import { store } from '../core/state.js';
import { t } from '../core/i18n.js';
import { esc, $, debounce, buildQuery } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C } from '../../data/content.js';
import { isDone, complete, visit } from '../core/progress.js';
import { dailyChallenge } from '../core/recommendations.js';
import { replaceQuery } from '../core/router.js';
import { tokenize } from '../core/search.js';
import { visualBlock, pageHead, diffBadge, pager, emptyState, notesPanel, bindNotes, completeBtn, bookmarkBtn, progressBar, toast } from '../ui/components.js';
import { notFound } from './learn.js';
import { diagram } from '../ui/visuals.js';

const PER = 18;
export function renderChallenges(root, { query }) {
  let st = { q: query.q || '', diff: query.diff || 'all', page: +query.page || 1 };
  const d = dailyChallenge();
  root.innerHTML = `${pageHead({ title: t('challenges'), lead: `${C.challenges.length} design briefs. Each has users, constraints, required screens, UX/UI requirements and a self-evaluation checklist.` })}
    <a class="card card-link hero-plan" style="display:block;padding:var(--sp-6)" href="#/challenge/${d.id}"><span class="badge badge-accent">Today's UX challenge</span><h2 class="mt-2">${esc(d.title)}</h2><p class="mt-2">${esc(d.problem)}</p><div class="row mt-4">${diffBadge(d.difficulty)}<span class="badge">${d.minutes} min</span>${d.skills.map((s) => `<span class="badge">${esc(s)}</span>`).join('')}</div></a>
    <div class="toolbar mt-6"><div class="search-box">${icon('search')}<label for="ch-q" class="sr-only">Search challenges</label><input id="ch-q" class="input" type="search" placeholder="Search: checkout, pharmacy, onboarding…" value="${esc(st.q)}"></div>
      <label for="ch-d" class="sr-only">Difficulty</label><select id="ch-d" class="select"><option value="all">Any difficulty</option>${['Beginner', 'Intermediate', 'Advanced'].map((x) => `<option ${x === st.diff ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    <p class="result-count" id="ch-count" aria-live="polite"></p><div class="grid grid-3" id="ch-grid"></div><div id="ch-pager"></div>`;
  const draw = () => {
    const toks = tokenize(st.q);
    const list = C.challenges.filter((c) => (st.diff === 'all' || c.difficulty === st.diff) && (!toks.length || toks.every((tk) => `${c.title} ${c.problem} ${c.skills.join(' ')}`.toLowerCase().includes(tk))));
    const pages = Math.max(1, Math.ceil(list.length / PER)); st.page = Math.min(st.page, pages);
    $('#ch-count', root).textContent = `${list.length} challenges`;
    $('#ch-grid', root).innerHTML = list.length ? list.slice((st.page - 1) * PER, st.page * PER).map((c) => `<a class="card card-link" href="#/challenge/${c.id}"><div class="card-top">${diffBadge(c.difficulty)}${isDone('challenge:' + c.id) ? `<span class="done-mark is-done">${icon('check')}</span>` : ''}</div><h3>${esc(c.title)}</h3><p>${esc(c.problem)}</p><div class="card-meta"><span class="tiny muted">${c.minutes} min</span></div></a>`).join('')
      : `<div style="grid-column:1/-1">${emptyState({ ico: '🏁', title: 'No matching challenges', text: 'Try a product type like "bank" or a skill like "search".' })}</div>`;
    $('#ch-pager', root).innerHTML = pager(st.page, pages, list.length, PER);
    replaceQuery('#/challenges' + buildQuery({ ...st, page: st.page > 1 ? st.page : '' }));
  };
  $('#ch-q', root).addEventListener('input', debounce((e) => { st.q = e.target.value; st.page = 1; draw(); }, 150));
  $('#ch-d', root).addEventListener('change', (e) => { st.diff = e.target.value; st.page = 1; draw(); });
  root.addEventListener('click', (e) => { const p = e.target.closest('[data-page]'); if (p && !p.disabled) { st.page = +p.dataset.page; draw(); } });
  draw();
}

export function renderChallenge(root, { params }) {
  const c = C.challengeMap.get(params.id); if (!c) return notFound(root);
  const key = 'challenge:' + c.id, route = '#/challenge/' + c.id;
  visit(key, c.title, route);
  const state = store.user.challenges[c.id] || { checks: {} };
  const list = (a) => `<ul class="prose">${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  root.innerHTML = `${pageHead({ crumbs: [[t('challenges'), '#/challenges'], [c.title]], title: c.title, actions: bookmarkBtn(key, c.title, route) })}
    <div class="lesson-meta">${diffBadge(c.difficulty)}<span class="badge">${icon('clock')} ${c.minutes} min</span>${c.skills.map((s) => `<span class="badge">${esc(s)}</span>`).join('')}</div>
    <div class="split"><article class="lesson-body">
      <div class="callout primary"><h4>Problem</h4><p>${esc(c.problem)}</p></div>
      ${(() => { const v = C.challengeVisuals[c.id] || C.challengeVisuals[c.id.split('--')[0]] || C.visualForText(c.title); return `<section><h2 style="font-size:var(--fs-lg)">Related visual example</h2><div class="mt-4">${visualBlock(v, c.title)}</div></section>`; })()}
      <div class="qa-grid"><div class="callout"><h4>Target users</h4><p>${esc(c.users)}</p></div><div class="callout"><h4>Constraints</h4>${list(c.constraints)}</div><div class="callout"><h4>Required screens</h4>${list(c.screens)}</div><div class="callout info"><h4>UX requirements</h4>${list(c.ux)}</div></div>
      <div class="callout"><h4>Optional UI requirements</h4>${list(c.ui)}</div>
      <section class="card" aria-labelledby="ev-h"><h2 id="ev-h" style="font-size:var(--fs-lg)">Self-evaluation checklist</h2><p class="small muted">Tick each item your design satisfies.</p>
        <ul class="checklist mt-2">${c.checklist.map((x, i) => `<li><label><input type="checkbox" data-ck="${i}" ${state.checks[i] ? 'checked' : ''}> ${esc(x)}</label></li>`).join('')}</ul>
        <div class="mt-4" id="ev-bar">${progressBar(Math.round((Object.values(state.checks).filter(Boolean).length / c.checklist.length) * 100), 'good')}</div>
        <div class="row mt-4">${completeBtn(key, c.title, route, c.minutes)}</div></section>
      ${notesPanel(key)}
    </article>
    <aside class="card card-flat"><h2 style="font-size:var(--fs-md)">How to approach it</h2><ol class="prose small mt-2"><li>Restate the problem in one sentence</li><li>Define the user and their goal</li><li>Sketch the flow before screens</li><li>Wireframe the required screens</li><li>Check against the list and iterate</li></ol><p class="small mt-4">Build in Figma, then paste a link or reflection into your notes.</p></aside></div>`;
  bindNotes(root);
  root.addEventListener('change', (e) => {
    const ck = e.target.closest('[data-ck]'); if (!ck) return;
    store.update((u) => { const s = (u.challenges[c.id] ||= { checks: {} }); s.checks[ck.dataset.ck] = ck.checked; });
    const s = store.user.challenges[c.id]; const n = Object.values(s.checks).filter(Boolean).length;
    $('#ev-bar', root).innerHTML = progressBar(Math.round((n / c.checklist.length) * 100), 'good');
    if (n === c.checklist.length && !isDone(key)) { complete(key, { title: c.title, route, minutes: c.minutes }); toast('All criteria met — challenge complete!', { ico: '🏁' }); const b = $('[data-action="complete"]', root); if (b) { b.className = 'btn btn-secondary'; b.setAttribute('aria-pressed', 'true'); b.querySelector('span').textContent = t('completedLbl'); } }
  });
}

/* ---------- Projects ---------- */
export function renderProjects(root) {
  root.innerHTML = `${pageHead({ title: 'Project-based learning', lead: 'Ten end-to-end projects. Each guides you through 12 stages from research to a finished case study for your portfolio.' })}
    <div class="grid grid-2">${C.projects.map((p, i) => { const s = store.user.projects[p.id]?.steps || {}; const n = Object.values(s).filter(Boolean).length; const pc = Math.round((n / C.projectSteps.length) * 100); return `<a class="card card-link" href="#/project/${p.id}"><div class="card-top"><span class="badge badge-primary">Project ${i + 1}</span>${diffBadge(p.difficulty)}</div><h3>${esc(p.title)}</h3><p>${esc(p.goal)}</p><div class="mt-4">${progressBar(pc)}</div><p class="tiny muted mt-2">${n}/${C.projectSteps.length} stages</p></a>`; }).join('')}</div>`;
}
export function renderProject(root, { params }) {
  const p = C.projectMap.get(params.id); if (!p) return notFound(root);
  const key = 'project:' + p.id;
  visit(key, p.title, '#/project/' + p.id);
  const st = store.user.projects[p.id] || { steps: {}, notes: {} };
  root.innerHTML = `${pageHead({ crumbs: [[t('projects'), '#/projects'], [p.title]], title: p.title, lead: esc(p.goal) })}
    <div class="card" id="pj-bar"></div>
    <div class="stack mt-6">${C.projectSteps.map(([name, desc], i) => `<details class="acc" ${!st.steps[i] && !Object.keys(st.steps).length && i === 0 ? 'open' : ''}><summary><span class="num">${i + 1}</span>${esc(name)} ${st.steps[i] ? '<span class="badge badge-good">Done</span>' : ''}</summary><div class="acc-body">
      <figure class="figure">${diagram(C.projectStepVisuals[i])}</figure><p class="mt-4">${esc(desc)}</p><div class="field mt-4"><label for="pj-${i}">Your work / link / reflection</label><textarea class="textarea" id="pj-${i}" data-pnote="${i}" rows="3">${esc(st.notes?.[i] || '')}</textarea></div>
      <label class="toggle mt-4"><input type="checkbox" data-pstep="${i}" ${st.steps[i] ? 'checked' : ''}><span class="track"></span><span>Stage complete</span></label></div></details>`).join('')}</div>`;
  const bar = () => { const s = store.user.projects[p.id]?.steps || {}; const n = Object.values(s).filter(Boolean).length; $('#pj-bar', root).innerHTML = `<div class="row-between"><span class="small"><strong>${n}</strong> of ${C.projectSteps.length} stages</span>${n === C.projectSteps.length ? '<span class="badge badge-good">Project complete</span>' : ''}</div><div class="mt-2">${progressBar(Math.round((n / C.projectSteps.length) * 100))}</div>`; return n; };
  bar();
  root.addEventListener('change', (e) => {
    const s = e.target.closest('[data-pstep]');
    if (s) { store.update((u) => { const pr = (u.projects[p.id] ||= { steps: {}, notes: {} }); pr.steps[s.dataset.pstep] = s.checked; }); if (bar() === C.projectSteps.length) complete(key, { title: p.title, route: '#/project/' + p.id, minutes: 60 }); }
  });
  root.addEventListener('input', debounce((e) => { const n = e.target.closest('[data-pnote]'); if (n) store.update((u) => { const pr = (u.projects[p.id] ||= { steps: {}, notes: {} }); (pr.notes ||= {})[n.dataset.pnote] = n.value; }, { silent: true }); }, 400));
}

/* ---------- Career ---------- */
export function renderCareer(root) {
  const m = C.moduleMap.get('career');
  root.innerHTML = `${pageHead({ title: 'Become a Professional UX/UI Designer', lead: 'Skills by stage, how to build a portfolio, work with teams and prepare for interviews.', actions: `<a class="btn btn-primary" href="#/learn/career">${icon('play')} Career lessons</a>` })}
    <section><h2>Beginner → Junior → Mid-level → Senior</h2><div class="grid grid-4 mt-4">${C.careerLevels.map((l) => `<div class="card"><span class="badge badge-primary">${esc(l.time)}</span><h3 class="mt-2">${esc(l.level)}</h3><ul class="prose small mt-2">${l.skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>`).join('')}</div></section>
    <section class="section"><h2>Career lessons</h2><div class="grid grid-3 mt-4">${m.items.map((k) => { const l = C.lessons.get(k.split(':')[1]); return `<a class="card card-link" href="#/lesson/${l.id}"><h3>${esc(l.title)}</h3><p>${esc(l.en)}</p></a>`; }).join('')}</div></section>
    <section class="section"><h2>Interview question bank</h2><div class="mt-4">${Object.entries(C.interviewQuestions).map(([k, qs]) => `<details class="acc"><summary>${esc(k)} questions (${qs.length})</summary><div class="acc-body"><ol class="prose">${qs.map((q) => `<li>${esc(q)}</li>`).join('')}</ol><p class="small muted mt-2">Practice answering out loud in 2 minutes using: context → action → result → learning.</p></div></details>`).join('')}</div></section>`;
}
