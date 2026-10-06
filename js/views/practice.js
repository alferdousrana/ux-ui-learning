import { store } from '../core/state.js';
import { t } from '../core/i18n.js';
import { esc, $, shuffle } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C, byKey, tagInfo } from '../../data/content.js';
import { isDone, complete, recordAnswer, addXp, XP_RULES, reviewQueue, reviewItem, weakTopics, visit } from '../core/progress.js';
import { prepare, grade } from '../core/exam.js';
import { pageHead, compareView, questionHtml, nextAnswer, emptyState, itemCard, completeBtn, toast, progressBar } from '../ui/components.js';
import { renderMock } from '../ui/mock.js';
import { notFound } from './learn.js';

export function renderPractice(root) {
  const due = reviewQueue().length;
  const card = (href, ico, title, text, extra = '') => `<a class="card card-link" href="${href}"><span style="font-size:28px" aria-hidden="true">${ico}</span><h3 class="mt-2">${title}</h3><p>${text}</p>${extra}</a>`;
  root.innerHTML = `${pageHead({ title: t('practice'), lead: 'Practice is where knowledge becomes skill. Pick a mode — every one saves your progress.' })}
    <div class="grid grid-3">
      ${card('#/practice/quiz?n=10', '✅', 'Quick quiz', `10 random questions from a bank of ${C.questions.length}.`)}
      ${card('#/practice/quiz?weak=1', '🎯', 'Weak-topic drill', 'Questions focused on topics below 70% accuracy.')}
      ${card('#/review', '🔁', 'Spaced review', `${due} item${due === 1 ? '' : 's'} due today.`)}
      ${card('#/compare', '↔️', t('compareLab'), `${C.comparisons.length} side-by-side examples with explanations.`)}
      ${card('#/critique', '🔍', t('critiqueLab'), 'Find what\'s wrong, why, and how to fix it.')}
      ${card('#/flowlab', '🔀', t('flowLab'), 'Build user flows with draggable nodes.')}
      ${card('#/persona', '🧑‍💼', t('persona'), 'Create and save research-based personas.')}
      ${card('#/challenges', '🏁', t('challenges'), `${C.challenges.length} design briefs with evaluation checklists.`)}
      ${card('#/projects', '🚀', t('projects'), '10 guided end-to-end projects.')}
    </div>`;
}

/* ---------- Quick quiz / weak drill ---------- */
export function renderQuiz(root, { query }) {
  const weak = query.weak ? weakTopics(1, 8).map((w) => w.tag) : [];
  let pool = C.questions;
  if (weak.length) pool = pool.filter((q) => q.tags?.some((tg) => weak.includes(tg)));
  if (query.tag) pool = pool.filter((q) => q.tags?.includes(query.tag));
  const n = Math.min(+query.n || 10, pool.length || 10);
  const qs = shuffle(pool.length ? pool : C.questions).slice(0, n).map(prepare);
  let i = 0, score = 0; const answers = [];
  const title = weak.length ? 'Weak-topic drill' : query.tag ? `Quiz: ${tagInfo(query.tag).label}` : 'Quick quiz';
  const draw = () => {
    if (i >= qs.length) {
      const pctv = Math.round((score / qs.length) * 100);
      root.innerHTML = `${pageHead({ crumbs: [[t('practice'), '#/practice'], [title]], title: `${score} / ${qs.length} correct` })}
        <div class="card"><div class="row"><div class="ring" style="--p:${pctv}"><span>${pctv}%</span></div><p>${pctv >= 70 ? 'Solid work. These topics will come back in spaced review.' : 'Keep going — missed topics now count toward your weak areas so the dashboard can target them.'}</p></div>
        <div class="row mt-6"><a class="btn btn-primary" href="#/practice/quiz?n=${n}${query.weak ? '&weak=1' : ''}&r=${Date.now()}">Another round</a><a class="btn btn-secondary" href="#/">Back to dashboard</a></div></div>`;
      return;
    }
    const q = qs[i];
    root.innerHTML = `${pageHead({ crumbs: [[t('practice'), '#/practice'], [title]], title })}
      ${weak.length ? `<p class="small muted">Focusing on: ${weak.map((w) => esc(tagInfo(w).label)).join(', ')}</p>` : ''}
      <div class="exam-bar"><span class="small"><strong>${i + 1}</strong> / ${qs.length}</span>${progressBar(Math.round((i / qs.length) * 100))}<span class="small muted">Score ${score}</span></div>
      <div class="card" id="qbox">${questionHtml(q, answers[i])}</div>
      <div class="row mt-4"><button class="btn btn-primary" id="qcheck">${t('checkAnswer')}</button></div>`;
    const box = $('#qbox', root);
    box.addEventListener('click', (e) => { if (box.dataset.locked) return; const a = nextAnswer(q, answers[i], e.target); if (a === undefined) return; answers[i] = a; box.innerHTML = questionHtml(q, a); });
    box.addEventListener('change', (e) => { const a = nextAnswer(q, answers[i], e.target); answers[i] = a; });
    $('#qcheck', root).addEventListener('click', (e) => {
      if (box.dataset.locked) { i++; draw(); return; }
      if (answers[i] == null) { toast('Choose an answer first'); return; }
      const ok = grade(q, answers[i]);
      if (ok) { score++; if (!store.user.quiz[q.id]?.correct) addXp(XP_RULES.quiz, 'Quiz'); }
      recordAnswer(q.id, ok, q.tags);
      box.dataset.locked = '1'; box.innerHTML = questionHtml(q, answers[i], { reveal: true });
      e.target.textContent = i === qs.length - 1 ? 'See result' : `${t('next')} question`; e.target.focus();
    });
  };
  draw();
}

/* ---------- Spaced review ---------- */
export function renderReview(root) {
  const q = reviewQueue();
  const upcoming = reviewQueue(true).filter((r) => r.overdue < 0).slice(0, 6);
  root.innerHTML = `${pageHead({ title: 'Spaced review', lead: 'Items come back after 1, 3, 7, 14 and 30 days. Recall the key idea before opening — then mark honestly.' })}
    ${q.length ? `<div class="stack">${q.map((r) => { const it = byKey(r.key); return `<div class="card row-between" data-rv="${esc(r.key)}"><div><span class="badge badge-accent">Stage ${r.stage + 1}/5</span><h3 class="mt-2">${esc(it?.title || r.title)}</h3><p class="small muted">Try to recall: what is it, why does it matter, one example?</p></div>
      <div class="row"><a class="btn btn-ghost btn-sm" href="${it?.route || '#/'}">Open</a><button class="btn btn-secondary btn-sm" data-rv-no>Forgot</button><button class="btn btn-primary btn-sm" data-rv-yes>I remembered</button></div></div>`; }).join('')}</div>`
      : emptyState({ ico: '🔁', title: 'Nothing due for review', text: 'Complete lessons and laws — they\'ll return here at the right time to lock them into memory.', action: '<a class="btn btn-primary" href="#/">Back to today\'s plan</a>' })}
    ${upcoming.length ? `<section class="section"><h2 style="font-size:var(--fs-lg)">Coming up</h2><ul class="stack-sm mt-2" role="list">${upcoming.map((r) => `<li class="small">${esc(byKey(r.key)?.title || r.title)} <span class="muted">· ${r.due}</span></li>`).join('')}</ul></section>` : ''}`;
  root.addEventListener('click', (e) => {
    const card = e.target.closest('[data-rv]'); if (!card) return;
    const yes = e.target.closest('[data-rv-yes]'), no = e.target.closest('[data-rv-no]');
    if (!yes && !no) return;
    reviewItem(card.dataset.rv, !!yes);
    card.remove(); toast(yes ? 'Nice — scheduled further out' : 'Scheduled again for tomorrow', { ico: yes ? '🧠' : '🔁' });
  });
}

/* ---------- Good vs Bad Lab ---------- */
export function renderCompareList(root, { query }) {
  const cat = query.cat || 'all';
  const list = C.comparisons.filter((x) => cat === 'all' || x.category === cat);
  root.innerHTML = `${pageHead({ title: t('compareLab'), lead: 'Side-by-side examples. For each: why the good one works, why the bad one fails, which principle and law apply, and what to change. Examples are data-driven, so the lab scales to 1,000+.' })}
    <div class="chips" role="group" aria-label="Filter"><a class="chip" href="#/compare" aria-pressed="${cat === 'all'}">All</a>${C.compareCategories.map((c) => `<a class="chip" href="#/compare?cat=${encodeURIComponent(c)}" aria-pressed="${cat === c}">${esc(c)}</a>`).join('')}</div>
    <div class="grid grid-3 mt-6">${list.map((x) => `<a class="card card-link" href="#/compare/${x.id}"><div class="card-top"><span class="badge">${esc(x.category)}</span>${isDone('compare:' + x.id) ? `<span class="done-mark is-done">${icon('check')}</span>` : ''}</div><h3>Good vs bad: ${esc(x.title)}</h3><p>${esc(x.principles[0])}</p></a>`).join('') || emptyState({ ico: '↔️', title: 'No examples in this category yet' })}</div>`;
}
export function renderCompare(root, { params }) {
  const x = C.compareMap.get(params.id); if (!x) return notFound(root);
  const key = 'compare:' + x.id, route = '#/compare/' + x.id;
  visit(key, 'Good vs bad: ' + x.title, route);
  const i = C.comparisons.indexOf(x), next = C.comparisons[(i + 1) % C.comparisons.length];
  root.innerHTML = `${pageHead({ crumbs: [[t('compareLab'), '#/compare'], [x.title]], title: `Good vs bad: ${x.title}`, actions: completeBtn(key, x.title, route, 5) })}
    ${compareView(x)}<div class="row mt-8"><a class="btn btn-secondary" href="#/compare/${next.id}">Next example: ${esc(next.title)}</a></div>`;
}

/* ---------- Critique Lab ---------- */
export function renderCritiqueList(root) {
  root.innerHTML = `${pageHead({ title: t('critiqueLab'), lead: 'Inspect a design and decide: what is wrong, why, which principle and law, and how you\'d fix it. Then compare with the reasoning.' })}
    <div class="grid grid-3">${C.critiques.map((x) => `<a class="card card-link" href="#/critique/${x.id}"><div class="card-top"><span class="badge">Critique</span>${isDone('critique:' + x.id) ? `<span class="done-mark is-done">${icon('check')}</span>` : ''}</div><h3>${esc(x.title)}</h3></a>`).join('')}</div>
    <section class="section"><h2 style="font-size:var(--fs-lg)">More critique practice</h2><p class="small mt-2">The <a href="#/exam/critique">Design Critique exam</a> mixes spot-the-mistake, scenario and identify-the-law questions.</p></section>`;
}
export function renderCritique(root, { params }) {
  const x = C.critiqueMap.get(params.id); if (!x) return notFound(root);
  const key = 'critique:' + x.id;
  visit(key, 'Critique: ' + x.title, '#/critique/' + x.id);
  const saved = store.user.critiques[x.id];
  root.innerHTML = `${pageHead({ crumbs: [[t('critiqueLab'), '#/critique'], [x.title]], title: x.title })}
    <div class="split"><div class="stack">
      <figure class="figure"><div class="compare-stage">${renderMock(x.mock, { label: 'Design to critique' })}</div></figure>
      <div class="card"><p class="quiz-q">What is wrong?</p><div class="options mt-4" role="radiogroup">${x.options.map((o, i) => `<button class="option" role="radio" aria-checked="false" data-opt="${i}"><span class="key">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>
        <div class="field mt-4"><label for="cr-why">Why is it wrong, and how would you fix it?</label><textarea id="cr-why" class="textarea" rows="3">${esc(saved?.answer || '')}</textarea></div>
        <button class="btn btn-primary mt-4" id="cr-reveal">Reveal answer</button></div>
      <div id="cr-out" hidden></div></div>
    <aside class="card card-flat"><h2 style="font-size:var(--fs-md)">Critique checklist</h2><ul class="prose small mt-2"><li>What is the user trying to do?</li><li>What gets in the way?</li><li>Which principle is violated?</li><li>Which UX law explains the behavior?</li><li>What's the smallest change that fixes it?</li></ul></aside></div>`;
  let pick = null;
  root.addEventListener('click', (e) => {
    const o = e.target.closest('[data-opt]');
    if (o && !o.disabled) { pick = +o.dataset.opt; root.querySelectorAll('[data-opt]').forEach((b) => b.setAttribute('aria-checked', b === o)); }
  });
  $('#cr-reveal', root).addEventListener('click', (e) => {
    if (pick == null) { toast('Choose what you think is wrong first'); return; }
    const ok = pick === x.answer;
    root.querySelectorAll('[data-opt]').forEach((b, i) => { b.disabled = true; if (i === x.answer) b.classList.add('correct'); else if (i === pick) b.classList.add('wrong'); });
    store.update((u) => { u.critiques[x.id] = { answer: $('#cr-why', root).value, pick, ok, ts: Date.now() }; });
    recordAnswer('crit-' + x.id, ok, x.laws);
    complete(key, { title: 'Critique: ' + x.title, route: '#/critique/' + x.id, minutes: 6 });
    const out = $('#cr-out', root); out.hidden = false;
    out.innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}"><strong>${ok ? '✓ Correct' : '✕ Not quite'}</strong></div>
      <div class="qa-grid mt-4"><div class="callout info"><h4>Reasoning</h4><p>${esc(x.reasoning)}</p></div><div class="callout"><h4>Principle & law</h4><p>${esc(x.principle)}</p><div class="chips mt-2">${x.laws.map((id) => `<a class="chip" href="#/law/${id}">${esc(C.lawMap.get(id)?.name || id)}</a>`).join('')}</div></div></div>
      <div class="callout key mt-4"><h4>Fix</h4><p>${esc(x.fix)}</p></div>
      <figure class="figure mt-4"><div class="compare-stage">${renderMock(x.better, { label: 'Improved design' })}</div><figcaption>Better design</figcaption></figure>`;
    e.target.disabled = true; out.querySelector('.feedback').setAttribute('tabindex', '-1'); out.querySelector('.feedback').focus();
  });
}
