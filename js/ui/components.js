/* ==========================================================================
   Reusable UI components (string renderers + small behaviors).
   Views compose these; global data-action handlers live in app.js.
   ========================================================================== */
import { esc, html, raw, $, $$, timeAgo, uid } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { store } from '../core/state.js';
import { t, L } from '../core/i18n.js';
import { isDone, complete, uncomplete, recordAnswer, addXp, XP_RULES } from '../core/progress.js';
import { C, byKey } from '../../data/content.js';
import { renderMock } from './mock.js';
import { diagram } from './visuals.js';
import { figmaStepVisuals, figmaEditor, stepSpec } from './figma-visual.js';
import { grade } from '../core/exam.js';

/* ---------- Toast ---------- */
export function toast(message, { kind = '', ico = '', icon: icoAlt = '', timeout = 3200 } = {}) {
  const host = $('#toasts');
  if (!host) return;
  ico = ico || icoAlt;
  while (host.children.length >= 3) host.firstElementChild.remove();
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `${ico ? `<span class="t-ico" aria-hidden="true">${esc(ico)}</span>` : ''}<span>${message}</span>`;
  host.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 320); }, timeout);
}

/* ---------- Modal (focus-trapped, Esc to close) ---------- */
export function modal({ title, body, actions = [], onClose } = {}) {
  const prev = document.activeElement;
  const ov = document.createElement('div');
  ov.className = 'overlay';
  const id = uid('m');
  ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="${id}">
    <div class="modal-head"><h2 id="${id}">${esc(title)}</h2><button class="icon-btn" data-close aria-label="Close">${icon('x')}</button></div>
    <div class="modal-body">${body}</div>
    ${actions.length ? `<div class="modal-foot">${actions.map((a, i) => `<button class="btn ${a.cls || 'btn-secondary'}" data-act="${i}">${esc(a.label)}</button>`).join('')}</div>` : ''}
  </div>`;
  document.body.appendChild(ov);
  const box = $('.modal', ov);
  const close = () => { ov.remove(); document.removeEventListener('keydown', onKey); prev?.focus?.(); onClose?.(); };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', box).filter((x) => !x.disabled);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  ov.addEventListener('click', (e) => {
    if (e.target === ov || e.target.closest('[data-close]')) close();
    const a = e.target.closest('[data-act]');
    if (a) { const r = actions[+a.dataset.act].onClick?.(box); if (r !== false) close(); }
  });
  setTimeout(() => ($('input, textarea, [data-act]', box) || $('[data-close]', box)).focus(), 30);
  return { close, el: box };
}
export function confirmDialog(title, text, { confirm = 'Confirm', danger = false } = {}) {
  return new Promise((res) => {
    let done = false;
    modal({ title, body: `<p>${esc(text)}</p>`, actions: [
      { label: 'Cancel', onClick: () => { done = true; res(false); } },
      { label: confirm, cls: danger ? 'btn-danger' : 'btn-primary', onClick: () => { done = true; res(true); } },
    ], onClose: () => { if (!done) res(false); } });
  });
}

/* ---------- Layout bits ---------- */
export function pageHead({ crumbs = [], title, lead = '', actions = '', sub = '' }) {
  return `<header class="page-head"><div>
    ${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([label, href], i) => (href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`) + (i < crumbs.length - 1 ? '<span aria-hidden="true">›</span>' : '')).join('')}</nav>` : ''}
    <h1 tabindex="-1">${esc(title)}</h1>${sub ? `<p class="muted">${esc(sub)}</p>` : ''}${lead ? `<p class="lead">${lead}</p>` : ''}
  </div>${actions ? `<div class="row">${actions}</div>` : ''}</header>`;
}

export const progressBar = (pct, cls = '', label = '') => `<div class="progress ${cls}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" ${label ? `aria-label="${esc(label)}"` : ''}><span style="width:${Math.max(0, Math.min(100, pct))}%"></span></div>`;

export function emptyState({ ico = '🗂️', title, text = '', action = '' }) {
  return `<div class="empty"><div class="e-ico" aria-hidden="true">${ico}</div><h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}${action}</div>`;
}

export const diffBadge = (d) => `<span class="badge ${d === 'Beginner' ? 'badge-good' : d === 'Intermediate' ? 'badge-info' : 'badge-warn'}">${esc(d || '')}</span>`;
const TYPE_ICONS = { lesson: '📘', law: '⚖️', method: '🔬', figma: '🎨', plugin: '🧩', case: '🗂️', challenge: '🏁', term: '📖', compare: '↔️', critique: '🔍', project: '🚀', exam: '📝', module: '🧭' };
export const typeIcon = (type) => TYPE_ICONS[type] || '•';
export const typeLabel = (type) => ({ lesson: 'Lesson', law: 'UX Law', method: 'Research method', figma: 'Figma', plugin: 'Plugin', case: 'Case study', challenge: 'Challenge', term: 'Glossary', compare: 'Good vs Bad', critique: 'Critique', project: 'Project', exam: 'Exam', module: 'Module' }[type] || type);

/* ---------- Pagination ---------- */
export function pager(page, pages, total, perPage) {
  if (pages <= 1) return '';
  const from = (page - 1) * perPage + 1, to = Math.min(total, page * perPage);
  return `<nav class="pager" aria-label="Pagination">
    <button class="btn btn-secondary btn-sm" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>${icon('back')} Previous</button>
    <span class="info">${from}–${to} of ${total.toLocaleString()} · page ${page}/${pages}</span>
    <button class="btn btn-secondary btn-sm" data-page="${page + 1}" ${page >= pages ? 'disabled' : ''}>Next ${icon('chevron')}</button></nav>`;
}

/* ---------- Generic item card from a key ---------- */
export function itemCard(key, { showSub = true, desc = '' } = {}) {
  const r = byKey(key); if (!r) return '';
  const done = isDone(key);
  return `<a class="card card-link" href="${r.route}">
    <div class="card-top"><span class="badge">${typeIcon(r.type)} ${esc(typeLabel(r.type))}</span>${done ? `<span class="done-mark is-done" aria-label="Completed">${icon('check')}</span>` : ''}</div>
    <h3>${esc(r.title)}</h3>${desc ? `<p>${esc(desc)}</p>` : ''}
    ${showSub && r.sub ? `<div class="card-meta"><span class="tiny muted">${esc(r.sub)}</span>${r.minutes && r.minutes < 200 ? `<span class="tiny muted">${r.minutes} min</span>` : ''}</div>` : ''}
  </a>`;
}

/* ---------- Language switch for lesson content ---------- */
export function langSwitch() {
  const l = store.settings.contentLang;
  return `<div class="lang-switch" role="group" aria-label="Lesson language">
    <button data-action="content-lang" data-lang="bn" aria-pressed="${l === 'bn'}">বাংলা</button>
    <button data-action="content-lang" data-lang="en" aria-pressed="${l === 'en'}">English</button></div>`;
}

/* ---------- Bookmark & complete buttons ---------- */
export function bookmarkBtn(key, title, route) {
  const on = !!store.user.bookmarks[key];
  return `<button class="btn btn-secondary btn-sm" data-action="bookmark" data-key="${esc(key)}" data-title="${esc(title)}" data-route="${esc(route)}" aria-pressed="${on}">${icon('bookmark')} <span>${on ? t('bookmarked') : t('bookmark')}</span></button>`;
}
export function completeBtn(key, title, route, minutes = 10) {
  const done = isDone(key);
  return `<button class="btn ${done ? 'btn-secondary' : 'btn-primary'}" data-action="complete" data-key="${esc(key)}" data-title="${esc(title)}" data-route="${esc(route)}" data-min="${minutes}" aria-pressed="${done}">${icon('check')} <span>${done ? t('completedLbl') : t('markComplete')}</span></button>`;
}
export function handleComplete(btn) {
  const { key, title, route, min } = btn.dataset;
  if (isDone(key)) { uncomplete(key); toast('Marked as not complete'); }
  else complete(key, { title, route, minutes: +min || 10 });
  const done = isDone(key);
  btn.className = `btn ${done ? 'btn-secondary' : 'btn-primary'}`;
  btn.setAttribute('aria-pressed', done);
  btn.querySelector('span').textContent = done ? t('completedLbl') : t('markComplete');
}
export function handleBookmark(btn) {
  const { key, title, route } = btn.dataset;
  const on = !store.user.bookmarks[key];
  store.update((u) => { if (on) u.bookmarks[key] = { key, title, route, type: key.split(':')[0], ts: Date.now() }; else delete u.bookmarks[key]; });
  btn.setAttribute('aria-pressed', on);
  btn.querySelector('span').textContent = on ? t('bookmarked') : t('bookmark');
  toast(on ? `Bookmarked “${esc(title)}”` : 'Bookmark removed', { ico: on ? '🔖' : '' });
}

/* ---------- Notes ---------- */
export function notesPanel(key) {
  const notes = store.user.notes[key] || [];
  return `<section class="card" data-notes="${esc(key)}" aria-labelledby="notes-h">
    <h3 id="notes-h" class="notes-title">${icon('note')} ${t('notes')}</h3>
    <div class="stack-sm mt-2" data-notes-list>${notes.length ? notes.map(noteItem).join('') : '<p class="small muted" data-empty>No notes yet. Write what you want to remember in your own words.</p>'}</div>
    <div class="field mt-4"><label for="note-${esc(key)}" class="sr-only">${t('addNote')}</label>
    <textarea id="note-${esc(key)}" class="textarea" data-note-input placeholder="${t('addNote')}…" rows="3"></textarea></div>
    <div class="row mt-2"><button class="btn btn-secondary btn-sm" data-action="note-save">${icon('plus')} ${t('saveNote')}</button></div>
  </section>`;
}
const noteItem = (n) => `<div class="note" data-note-id="${n.id}">${esc(n.text)}<div class="note-meta"><span>${timeAgo(n.ts)}</span><button class="btn btn-ghost btn-sm" data-action="note-del" aria-label="Delete note">${icon('trash')}</button></div></div>`;
export function bindNotes(root) {
  root.addEventListener('click', (e) => {
    const panel = e.target.closest('[data-notes]'); if (!panel) return;
    const key = panel.dataset.notes;
    if (e.target.closest('[data-action="note-save"]')) {
      const ta = $('[data-note-input]', panel); const text = ta.value.trim();
      if (!text) { ta.setAttribute('aria-invalid', 'true'); ta.focus(); return; }
      ta.removeAttribute('aria-invalid');
      const n = { id: uid('n'), text, ts: Date.now() };
      store.update((u) => { (u.notes[key] ||= []).unshift(n); });
      $('[data-empty]', panel)?.remove();
      $('[data-notes-list]', panel).insertAdjacentHTML('afterbegin', noteItem(n));
      ta.value = ''; toast('Note saved', { ico: '📝' });
    }
    const del = e.target.closest('[data-action="note-del"]');
    if (del) {
      const id = del.closest('[data-note-id]').dataset.noteId;
      store.update((u) => { u.notes[key] = (u.notes[key] || []).filter((n) => n.id !== id); if (!u.notes[key].length) delete u.notes[key]; });
      del.closest('.note').remove();
    }
  });
}

/* ---------- Visual rendering (svg | compare | mock) ---------- */
export function visualBlock(v, caption = '', ctx = {}) {
  if (!v) return '';
  if (v.pair) return `<figure class="pair" aria-label="Visual example: ${esc(caption)}">
    <div class="p-good"><h4>✓ Good UX</h4><div class="compare-stage">${renderMock(v.pair.good, { label: 'Good example' })}</div>${ctx.good ? `<p>${esc(L(ctx.good))}</p>` : ''}</div>
    <div class="p-bad"><h4>✕ Bad UX</h4><div class="compare-stage">${renderMock(v.pair.bad, { label: 'Bad example' })}</div>${ctx.bad ? `<p>${esc(L(ctx.bad))}</p>` : ''}</div></figure>`;
  if (v.figma) return `<figure class="figure">${figmaEditor(stepSpec(v.figma), 1, v.figma)}<figcaption>In Figma: ${esc(v.figma)}</figcaption></figure>`;
  if (v.svg) return `<figure class="figure">${diagram(v.svg)}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
  if (v.compare) { const c = C.compareMap.get(v.compare); return c ? compareView(c, { compact: true }) : ''; }
  if (v.mock) return `<figure class="figure"><div class="compare-stage">${renderMock(v.mock)}</div>${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
  return '';
}

/** Step-by-step Figma pictures: each step shows the editor with the exact spot highlighted. */
export function figmaSteps(steps, ctx = {}) {
  const shots = figmaStepVisuals(steps, ctx);
  return `<ol class="fg-steps">${shots.map((s) => `<li class="fg-step">${s.svg}<p>${esc(s.text)}</p></li>`).join('')}</ol>
    <div class="fg-legend"><span>Highlighted = where to click in Figma</span></div>`;
}
/** Small diagram thumbnail for cards. */
export const thumb = (name) => (name ? `<div class="thumb-visual" aria-hidden="true">${diagram(name)}</div>` : '');

/* ---------- GOOD | BAD comparison ---------- */
export function compareView(c, { compact = false } = {}) {
  const lawLinks = c.laws.map((id) => { const l = C.lawMap.get(id); return l ? `<a class="badge badge-primary" href="#/law/${id}">${esc(l.name)}</a>` : ''; }).join(' ');
  const side = (kind, s) => `<div class="compare-side ${kind}"><div class="compare-label"><span class="mk" aria-hidden="true">${kind === 'good' ? '✓' : '✕'}</span>${kind === 'good' ? 'GOOD UX' : 'BAD UX'}</div>
    <div class="compare-stage">${renderMock(s, { label: `${kind} example: ${c.title}` })}</div>
    <ul class="compare-points">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`;
  return `<section aria-label="Good versus bad: ${esc(c.title)}">
    <div class="compare">${side('good', c.good)}${side('bad', c.bad)}</div>
    <div class="compare-explain">
      <div class="callout good"><h4>Why good?</h4><p>${esc(c.whyGood)}</p></div>
      <div class="callout bad"><h4>Why bad?</h4><p>${esc(c.whyBad)}</p></div>
      <div class="callout key"><h4>What should the designer change?</h4><p>${esc(c.fix)}</p></div>
    </div>
    ${compact ? '' : ''}
    <div class="row mt-4"><span class="small muted">Principle:</span>${c.principles.map((p) => `<span class="badge">${esc(p)}</span>`).join('')}<span class="small muted">UX law:</span>${lawLinks}</div>
  </section>`;
}

/* ---------- Question renderer (shared by mini quiz, practice, exams) ---------- */
const KEYS = 'ABCDEFGH';
export function questionHtml(q, ans, { reveal = false, idx = null } = {}) {
  const head = `${q.scenario ? `<div class="quiz-scenario"><strong>Scenario:</strong> ${esc(q.scenario)}</div>` : ''}
    ${q.mock ? `<div class="compare-stage">${renderMock(q.mock, { label: 'Design to critique' })}</div>` : ''}
    <p class="quiz-q" id="q-${esc(q.id)}">${idx != null ? `${idx + 1}. ` : ''}${esc(q.q)}</p>`;
  let body = '';
  const cls = (i, picked) => {
    if (!reveal) return '';
    const correct = q.type === 'multi' ? q.answer.includes(i) : q.type === 'tf' ? (i === 0) === q.answer : i === q.answer;
    return correct ? 'correct' : picked ? 'wrong' : '';
  };
  if (q.type === 'tf') {
    body = `<div class="options" role="radiogroup" aria-labelledby="q-${esc(q.id)}">${['True', 'False'].map((o, i) => { const picked = ans === (i === 0); return `<button class="option ${cls(i, picked)}" role="radio" aria-checked="${picked}" data-opt="${i}" ${reveal ? 'disabled' : ''}><span class="key">${o[0]}</span><span>${o}</span></button>`; }).join('')}</div>`;
  } else if (q.type === 'match') {
    const rights = q.rightOptions || q.pairs.map((p) => p[1]);
    body = `<div>${q.pairs.map(([l], i) => { const v = ans?.[l] || ''; const ok = reveal && v === q.pairs[i][1]; return `<div class="match-row"><label for="m-${esc(q.id)}-${i}"><strong>${esc(l)}</strong></label>
      <div><select class="select" id="m-${esc(q.id)}-${i}" data-match="${esc(l)}" ${reveal ? 'disabled' : ''}><option value="">Choose…</option>${rights.map((r) => `<option ${v === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select>
      ${reveal ? `<div class="tiny ${ok ? '' : 'field-error'}" style="${ok ? 'color:var(--good)' : ''}">${ok ? '✓ Correct' : `Correct: ${esc(q.pairs[i][1])}`}</div>` : ''}</div></div>`; }).join('')}</div>`;
  } else {
    const multi = q.type === 'multi';
    body = `${multi ? '<p class="small muted">Select all that apply.</p>' : ''}<div class="options" role="${multi ? 'group' : 'radiogroup'}" aria-labelledby="q-${esc(q.id)}">${q.options.map((o, i) => { const picked = multi ? (ans || []).includes(i) : ans === i; return `<button class="option ${cls(i, picked)}" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${picked}" data-opt="${i}" ${reveal ? 'disabled' : ''}><span class="key">${KEYS[i]}</span><span>${esc(o)}</span></button>`; }).join('')}</div>`;
  }
  let fb = '';
  if (reveal) {
    const ok = grade(q, ans);
    fb = `<div class="feedback ${ok ? 'ok' : 'no'}" role="status"><strong>${ok ? '✓ Correct' : ans == null ? 'Skipped' : '✕ Not quite'}</strong><p>${esc(q.explain || '')}</p></div>`;
  }
  return `<div class="quiz" data-qid="${esc(q.id)}">${head}${body}${fb}</div>`;
}
/** Read a click/change on a question into a new answer value. */
export function nextAnswer(q, prev, target) {
  if (q.type === 'match') { const sel = target.closest('[data-match]'); if (!sel) return prev; return { ...(prev || {}), [sel.dataset.match]: sel.value }; }
  const opt = target.closest('[data-opt]'); if (!opt) return undefined;
  const i = +opt.dataset.opt;
  if (q.type === 'tf') return i === 0;
  if (q.type === 'multi') { const s = new Set(prev || []); s.has(i) ? s.delete(i) : s.add(i); return [...s].sort(); }
  return i;
}

/* ---------- Mini quiz (inside lessons / laws) ---------- */
export function miniQuiz(quiz, prefix, tags = []) {
  if (!quiz?.length) return '';
  const qs = quiz.map(([q, options, answer, explain], i) => ({ id: `${prefix}-${i}`, type: 'mcq', q, options, answer, explain, tags }));
  return `<section class="card" data-miniquiz='${esc(JSON.stringify(qs))}' aria-labelledby="mq-h"><h3 id="mq-h">${t('quiz')}</h3><div class="stack mt-4">${qs.map((q) => `<div data-mq="${esc(q.id)}">${questionHtml(q, null)}</div>`).join('')}</div></section>`;
}
export function bindMiniQuiz(root) {
  $$('[data-miniquiz]', root).forEach((sec) => {
    const qs = JSON.parse(sec.dataset.miniquiz);
    sec.addEventListener('click', (e) => {
      const wrap = e.target.closest('[data-mq]'); if (!wrap) return;
      const q = qs.find((x) => x.id === wrap.dataset.mq);
      if (wrap.dataset.answered) return;
      const a = nextAnswer(q, null, e.target); if (a === undefined) return;
      wrap.dataset.answered = '1';
      const ok = grade(q, a);
      wrap.innerHTML = questionHtml(q, a, { reveal: true });
      const first = !store.user.quiz[q.id];
      recordAnswer(q.id, ok, q.tags);
      if (ok && first) addXp(XP_RULES.quiz, 'Quiz');
    });
  });
}

/* ---------- Related items ---------- */
export function relatedList(keys = []) {
  const items = keys.map(byKey).filter(Boolean);
  if (!items.length) return '';
  return `<section><h2>${t('related')}</h2><div class="grid grid-3 mt-4">${items.map((r) => itemCard(r.type + ':' + r.id)).join('')}</div></section>`;
}

/* ---------- Bilingual text block ---------- */
export const B = (v) => esc(L(v));
export { raw, html };
