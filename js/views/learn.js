import { store } from '../core/state.js';
import { t, L, T } from '../core/i18n.js';
import { esc } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C, byKey } from '../../data/content.js';
import { isDone, visit } from '../core/progress.js';
import { pageHead, progressBar, itemCard, langSwitch, bookmarkBtn, completeBtn, notesPanel, bindNotes, visualBlock, miniQuiz, bindMiniQuiz, relatedList, diffBadge, emptyState } from '../ui/components.js';
import { moduleStats, trackStats, stats } from './shared.js';

/* ---------- Learn overview ---------- */
export function renderLearn(root, { query }) {
  const tracks = trackStats().filter((tr) => tr.id !== 'cases');
  const active = query.track || 'all';
  const shown = active === 'all' ? tracks : tracks.filter((tr) => tr.id === active);
  root.innerHTML = `${pageHead({ title: t('learn'), lead: store.settings.lang === 'bn' ? 'শূন্য থেকে পেশাদার পর্যন্ত একটি কাঠামোবদ্ধ পথ। যেকোনো মডিউল থেকে শুরু করতে পারেন, তবে ক্রম অনুসরণ করাই ভালো।' : 'A structured path from zero to professional. Start anywhere, but the order is designed to build on itself.', actions: `<a class="btn btn-secondary" href="#/roadmap">${icon('map')} ${t('roadmap')}</a>` })}
    <div class="chips" role="group" aria-label="Filter by track">
      <a class="chip" href="#/learn" aria-pressed="${active === 'all'}">${t('all')}</a>
      ${tracks.map((tr) => `<a class="chip" href="#/learn?track=${tr.id}" aria-pressed="${active === tr.id}">${esc(tr.title)} <span class="count">${tr.pct}%</span></a>`).join('')}
    </div>
    ${shown.map((tr) => `<section class="section" aria-labelledby="tr-${tr.id}"><div class="section-head"><h2 id="tr-${tr.id}">${esc(tr.title)}</h2><span class="small muted">${tr.done}/${tr.total} · ${tr.pct}%</span></div>
      <div class="grid grid-3">${tr.modules.map((mid) => C.moduleMap.get(mid)).filter(Boolean).map(moduleCard).join('')}</div></section>`).join('')}`;
}
function moduleCard(m) {
  const s = moduleStats(m);
  return `<a class="card card-link" href="#/learn/${m.id}"><div class="card-top"><span class="badge badge-primary">${esc(m.level)}</span>${s.pct === 100 ? `<span class="done-mark is-done">${icon('check')}</span>` : ''}</div>
    <h3>${esc(T(m))}</h3><p>${esc(L(m.desc, store.settings.lang))}</p>
    <div class="mt-4">${progressBar(s.pct, '', m.title)}</div><div class="card-meta"><span class="tiny muted">${s.done}/${s.total} completed</span></div></a>`;
}

/* ---------- Module page ---------- */
export function renderModule(root, { params }) {
  const m = C.moduleMap.get(params.id);
  if (!m) return notFound(root);
  const s = moduleStats(m);
  const nextKey = m.items.find((k) => !isDone(k)) || m.items[0];
  const extra = m.id === 'laws' ? `<a class="btn btn-secondary" href="#/laws">${icon('search')} Searchable library</a>` : m.id === 'research-methods' ? `<a class="btn btn-secondary" href="#/toolkit">${icon('wrench')} ${t('toolkit')}</a>` : m.id === 'personas' ? `<a class="btn btn-secondary" href="#/persona">${icon('user')} ${t('persona')}</a>` : m.id === 'userflow' ? `<a class="btn btn-secondary" href="#/flowlab">${icon('flow')} ${t('flowLab')}</a>` : '';
  root.innerHTML = `${pageHead({ crumbs: [[t('learn'), '#/learn'], [m.title]], title: T(m), lead: esc(L(m.desc, store.settings.lang)), actions: `${extra}<a class="btn btn-primary" href="${byKey(nextKey)?.route}">${icon('play')} ${s.done ? 'Continue' : t('start')}</a>` })}
    <div class="card"><div class="row-between"><span class="small"><strong>${s.done}</strong> of ${s.total} completed</span><span class="small muted">${m.level}</span></div><div class="mt-2">${progressBar(s.pct)}</div></div>
    <ol class="stack-sm mt-6" role="list" style="list-style:none;padding:0">${m.items.map((k, i) => { const r = byKey(k); if (!r) return ''; const d = isDone(k); return `<li>
      <a class="card card-link row" href="${r.route}" style="flex-wrap:nowrap;padding:var(--sp-4)">
        <span class="done-mark ${d ? 'is-done' : ''}" aria-label="${d ? 'Completed' : 'Not completed'}">${icon('check')}</span>
        <span style="flex:1;min-width:0"><span class="tiny muted">${String(i + 1).padStart(2, '0')}</span> <strong>${esc(r.title)}</strong>${r.item.titleBn && store.settings.lang === 'bn' ? ` <span class="small muted">· ${esc(r.item.titleBn)}</span>` : ''}</span>
        <span class="hide-mobile">${diffBadge(r.item.level || r.item.difficulty)}</span><span class="tiny muted">${r.minutes || ''} min</span>
      </a></li>`; }).join('')}</ol>`;
}

/* ---------- Lesson page ---------- */
const SEC = (title, body, cls = '') => (body ? `<div class="callout ${cls}"><h4>${title}</h4>${body}</div>` : '');
const P = (v) => (v ? `<p>${esc(L(v))}</p>` : '');

export function renderLesson(root, { params }) {
  const l = C.lessons.get(params.id);
  if (!l) return notFound(root);
  const key = 'lesson:' + l.id, route = '#/lesson/' + l.id;
  const m = C.moduleMap.get(l.module);
  const lang = store.settings.contentLang;
  visit(key, l.title, route);
  const idx = C.path.indexOf(key);
  const prev = idx > 0 ? byKey(C.path[idx - 1]) : null;
  const next = idx >= 0 && idx < C.path.length - 1 ? byKey(C.path[idx + 1]) : null;
  const ms = m ? moduleStats(m) : null;
  const primary = lang === 'bn' ? l.bn : l.en, secondary = lang === 'bn' ? l.en : l.bn;

  root.innerHTML = `
  ${pageHead({ crumbs: [[t('learn'), '#/learn'], [m?.title || '', `#/learn/${l.module}`], [l.title]], title: l.title, sub: l.titleBn && l.titleBn !== l.title ? l.titleBn : '' })}
  <div class="lesson-meta">${diffBadge(l.level)}<span class="badge">${icon('clock')} ${l.minutes || 8} min</span>${m ? `<span class="badge">${esc(m.level)}</span>` : ''}
    ${ms ? `<span class="small muted" style="margin-left:auto">Module ${ms.done}/${ms.total}</span>` : ''}</div>
  ${ms ? `<div style="margin:-8px 0 var(--sp-5)">${progressBar(ms.pct)}</div>` : ''}
  <div class="row-between"><div class="lesson-actions">${langSwitch()}</div><div class="lesson-actions">${bookmarkBtn(key, l.title, route)}${completeBtn(key, l.title, route, l.minutes)}</div></div>

  <article class="lesson-body mt-6">
    <section aria-label="Explanation"><h2 class="sr-only">Explanation</h2>
      <p class="explain" lang="${lang}">${esc(primary)}</p>
      ${secondary ? `<details class="acc mt-4"><summary>${lang === 'bn' ? 'Professional English explanation' : 'বাংলায় সহজ ব্যাখ্যা'}</summary><div class="acc-body"><p lang="${lang === 'bn' ? 'en' : 'bn'}">${esc(secondary)}</p></div></details>` : ''}
    </section>
    ${visualBlock(l.visual, l.title)}
    ${l.why || l.when ? `<div class="qa-grid">${SEC('Why it matters', P(l.why), 'info')}${SEC('When to use it', P(l.when), 'info')}</div>` : ''}
    ${l.how?.length ? `<section><h2>How to apply it</h2><ol class="steps-list mt-4">${l.how.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></section>` : ''}
    ${l.example || l.digital ? `<div class="qa-grid">${SEC('Real-life example', P(l.example))}${SEC('Digital product example', P(l.digital))}</div>` : ''}
    ${l.good || l.bad ? `<div class="qa-grid">${SEC('✓ Good UX', P(l.good), 'good')}${SEC('✕ Bad UX', P(l.bad), 'bad')}</div>` : ''}
    ${SEC('Comparison', P(l.compare))}
    ${l.mistake || l.test ? `<div class="qa-grid">${SEC('Common mistake', P(l.mistake), 'bad')}${SEC('How to test it', P(l.test), 'info')}</div>` : ''}
    ${SEC('Key takeaway', P(l.takeaway), 'key')}
    ${l.practice ? SEC('Practice', `${P(l.practice)}<p class="small muted mt-2">Write your answer in the notes below — it stays on this device.</p>`, 'primary') : ''}
    ${miniQuiz(l.quiz, 'lq-' + l.id, l.tags)}
    ${notesPanel(key)}
    ${relatedList(l.related)}
  </article>
  <nav class="lesson-nav" aria-label="Lesson navigation">
    ${prev ? `<a href="${prev.route}"><span class="dir">← ${t('prev')}</span><span class="ttl">${esc(prev.title)}</span></a>` : '<span></span>'}
    ${next ? `<a href="${next.route}" style="text-align:right"><span class="dir">${t('next')} →</span><span class="ttl">${esc(next.title)}</span></a>` : ''}
  </nav>`;
  bindNotes(root); bindMiniQuiz(root);
}

/* ---------- Roadmap ---------- */
export function renderRoadmap(root) {
  const stages = [
    ['BEGINNER', null, true], ['UX Fundamentals', ['mindset', 'fundamentals']], ['Human Psychology', ['hci']], ['UX Research', ['research-fundamentals', 'research-methods', 'personas']],
    ['UX Laws', ['laws']], ['Information Architecture', ['ia']], ['User Flow', ['userflow']], ['Wireframing', ['wireframing', 'prototyping']], ['Usability Testing', ['usability', 'accessibility']],
    ['UI Fundamentals', ['typography', 'color', 'layout', 'components']], ['Figma', ['figma-beginner', 'figma-intermediate']], ['Design Systems', ['design-systems', 'figma-advanced']],
    ['Case Studies', '__cases'], ['Real Projects', '__projects'], ['Portfolio', ['career']], ['INTERMEDIATE', null, true], ['ADVANCED', null, true], ['PROFESSIONAL UX/UI DESIGNER', null, true],
  ];
  let current = false;
  const rows = stages.map(([title, mods, milestone]) => {
    if (milestone) return `<li class="rm-step milestone"><span class="rm-title">${esc(title)}</span></li>`;
    const items = mods === '__cases' ? C.cases.map((c) => 'case:' + c.id) : mods === '__projects' ? C.projects.map((p) => 'project:' + p.id) : mods.flatMap((id) => C.moduleMap.get(id)?.items || []);
    const s = stats(items);
    let cls = s.pct === 100 ? 'done' : '';
    if (!cls && !current) { cls = 'current'; current = true; }
    const href = mods === '__cases' ? '#/cases' : mods === '__projects' ? '#/projects' : `#/learn/${mods[0]}`;
    return `<li class="rm-step ${cls}"><a href="${href}"><span class="rm-title">${esc(title)}</span><span class="rm-sub"> · ${s.done}/${s.total}${cls === 'current' ? ' · you are here' : ''}</span>${progressBar(s.pct, s.pct === 100 ? 'good' : '')}</a></li>`;
  }).join('');
  root.innerHTML = `${pageHead({ title: 'UX Mastery Roadmap', lead: 'Each stage builds on the previous. The highlighted stage is where you should focus next.' })}
    <div class="split"><ol class="roadmap" role="list">${rows}</ol>
    <aside class="card"><h2 style="font-size:var(--fs-lg)">How to use the roadmap</h2><ul class="prose mt-2 small"><li>Finish a stage's lessons, then take its exam.</li><li>Keep reviews at zero — spaced revision is how knowledge sticks.</li><li>From "Case Studies" onward, produce real artifacts for your portfolio.</li></ul><a class="btn btn-primary btn-block mt-4" href="#/">Back to today's plan</a></aside></div>`;
}

export function notFound(root) {
  root.innerHTML = emptyState({ ico: '🧭', title: 'Page not found', text: 'This link doesn\'t match any lesson or page. It may have been renamed.', action: '<a class="btn btn-primary" href="#/">Go to dashboard</a> <a class="btn btn-secondary" href="#/search">Search</a>' });
}
