import { store } from '../core/state.js';
import { t } from '../core/i18n.js';
import { esc, fmt, timeAgo, $ } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C, byKey, tagInfo } from '../../data/content.js';
import { levelInfo, currentStreak, weakTopics, reviewQueue, todayActivity, weekXp, examAverage } from '../core/progress.js';
import { todaysPlan, togglePlanItem, dailyChallenge } from '../core/recommendations.js';
import { progressBar, emptyState, itemCard, diffBadge } from '../ui/components.js';
import { trackStats, overall, greeting } from './shared.js';

export function render(root) {
  const u = store.user, s = store.settings;
  const plan = todaysPlan();
  const mins = plan.reduce((a, p) => a + p.minutes, 0);
  const next = plan.find((p) => !p.done) || plan[0];
  const lv = levelInfo();
  const streak = currentStreak();
  const ov = overall();
  const weak = weakTopics(2, 4);
  const due = reviewQueue();
  const act = todayActivity();
  const wxp = weekXp();
  const avg = examAverage();
  const ch = dailyChallenge();
  const name = u.profile.name ? `, ${u.profile.name}` : '';
  const goalPct = Math.min(100, Math.round((act.minutes / s.dailyGoalMin) * 100));

  root.innerHTML = `
  <section class="hero-plan" aria-labelledby="greet">
    <div>
      <h1 id="greet" tabindex="-1">${esc(greeting(t))}${esc(name)} 👋</h1>
      <p class="greet-sub">${s.lang === 'bn' ? 'আজকের পরিকল্পনা তৈরি — আপনার অগ্রগতি, দুর্বল বিষয় আর রিভিশন দেখে।' : 'Your plan for today, built from your progress, weak topics and reviews.'}</p>
      <div class="row-between mt-6"><h2 style="font-size:var(--fs-lg)">${t('todaysLearning')}</h2><span class="small muted">${t('estTime')}: <strong>${mins} ${t('minutes')}</strong></span></div>
      <ul class="plan-list mt-2" role="list">${plan.map((p) => `
        <li class="plan-item ${p.done ? 'is-done' : ''}">
          <input type="checkbox" id="pl-${esc(p.key)}" data-plan="${esc(p.key)}" ${p.done ? 'checked' : ''} aria-label="Mark “${esc(p.title)}” done">
          <div><a class="plan-title" href="${p.route}">${esc(p.title)}</a><span class="plan-kind">${esc(p.kind)}</span></div>
          <span class="plan-min">${p.minutes} min</span>
        </li>`).join('')}</ul>
      <div class="row mt-4"><a class="btn btn-primary btn-lg" href="${next.route}">${icon('play')} ${t('startToday')}</a><a class="btn btn-ghost" href="#/roadmap">${icon('map')} ${t('roadmap')}</a></div>
    </div>
    <div class="stack">
      <div class="card"><div class="row" style="gap:var(--sp-5)">
        <div class="ring" style="--p:${lv.pct}"><span>${lv.level}</span></div>
        <div class="stat"><span class="lbl">${t('level')} ${lv.level}</span><span class="val" style="font-size:var(--fs-xl)">${esc(lv.title)}</span><span class="tiny muted">${fmt(lv.toNext)} XP to level ${lv.level + 1}</span></div>
      </div></div>
      <div class="grid grid-2">
        <div class="card"><div class="stat"><span class="streak-flame" aria-hidden="true">🔥</span><span class="val">${streak}</span><span class="lbl">${t('streak')} · ${t('days')}</span></div></div>
        <div class="card"><div class="stat"><span class="streak-flame" aria-hidden="true">⭐</span><span class="val">${fmt(u.xp)}</span><span class="lbl">Total XP</span></div></div>
      </div>
      <div class="card"><div class="row-between"><span class="small"><strong>${t('dailyGoal')}</strong></span><span class="small muted">${act.minutes}/${s.dailyGoalMin} ${t('minutes')}</span></div><div class="mt-2">${progressBar(goalPct, 'accent', 'Daily goal')}</div>
        <div class="row-between mt-4"><span class="small"><strong>${t('weeklyGoal')}</strong></span><span class="small muted">${fmt(wxp)}/${fmt(s.weeklyGoalXp)} XP</span></div><div class="mt-2">${progressBar(Math.round((wxp / s.weeklyGoalXp) * 100), 'good', 'Weekly goal')}</div></div>
    </div>
  </section>

  <section class="section"><div class="grid grid-4 grid-stats">
    <div class="card"><div class="stat"><span class="val">${ov.pct}%</span><span class="lbl">${t('overall')}</span></div><div class="mt-2">${progressBar(ov.pct)}</div></div>
    <div class="card"><div class="stat"><span class="val">${ov.done}</span><span class="lbl">${t('completed')}</span></div></div>
    <div class="card"><div class="stat"><span class="val">${ov.total - ov.done}</span><span class="lbl">${t('remaining')}</span></div></div>
    <div class="card"><div class="stat"><span class="val">${avg == null ? '—' : avg + '%'}</span><span class="lbl">Exam average</span></div></div>
  </div></section>

  <div class="split section">
    <div class="stack">
      <section class="card" aria-labelledby="prog-h"><div class="section-head"><h2 id="prog-h">${t('progress')}</h2><a href="#/progress">${t('viewAll')}</a></div>
        <div class="stack-sm">${trackStats().map((tr) => `<div class="progress-row"><a href="${tr.id === 'cases' ? '#/cases' : tr.id === 'laws' ? '#/laws' : '#/learn?track=' + tr.id}">${esc(tr.title)}</a>${progressBar(tr.pct, '', tr.title)}<span class="pct">${tr.pct}%</span></div>`).join('')}</div>
      </section>
      <section class="card" aria-labelledby="ch-h"><div class="section-head"><h2 id="ch-h">Today's UX challenge</h2>${diffBadge(ch.difficulty)}</div>
        <h3 style="font-size:var(--fs-lg)">${esc(ch.title)}</h3><p class="mt-2">${esc(ch.problem)}</p>
        <div class="row mt-4"><span class="small muted">${icon('clock', 'ico')} ${ch.minutes} min</span>${ch.skills.map((x) => `<span class="badge">${esc(x)}</span>`).join('')}</div>
        <a class="btn btn-secondary mt-4" href="#/challenge/${esc(ch.id)}">Open challenge</a></section>
      <section aria-labelledby="recent-h"><div class="section-head"><h2 id="recent-h">${t('recent')}</h2></div>
        ${u.history.length ? `<div class="grid grid-2">${u.history.slice(0, 4).map((h) => `<a class="card card-link" href="${h.route}"><h3>${esc(h.title)}</h3><p class="tiny muted">${timeAgo(h.ts)}</p></a>`).join('')}</div>` : emptyState({ ico: '🧭', title: 'Nothing studied yet', text: 'Start with the first item in today\'s plan — it takes about 10 minutes.', action: `<a class="btn btn-primary" href="${next.route}">Start now</a>` })}
      </section>
    </div>
    <aside class="stack" aria-label="Learning panel">
      <section class="card" aria-labelledby="weak-h"><h2 id="weak-h" style="font-size:var(--fs-lg)">${t('weakAreas')}</h2>
        ${weak.length ? `<ul class="stack-sm mt-2" role="list">${weak.map((w) => { const ti = tagInfo(w.tag); return `<li class="row-between"><a href="${ti.route}">${esc(ti.label)}</a><span class="badge badge-bad">${w.acc}%</span></li>`; }).join('')}</ul>
          <a class="btn btn-primary btn-block mt-4" href="#/practice/quiz?weak=1">${t('improveWeak')}</a>` : `<p class="small muted mt-2">Answer quizzes and exams — topics below 70% accuracy will appear here.</p><a class="btn btn-secondary btn-block mt-4" href="#/practice/quiz?n=10">Take a 10-question check</a>`}
      </section>
      <section class="card" aria-labelledby="due-h"><div class="row-between"><h2 id="due-h" style="font-size:var(--fs-lg)">${t('dueReview')}</h2><span class="badge ${due.length ? 'badge-accent' : ''}">${due.length}</span></div>
        ${due.length ? `<ul class="stack-sm mt-2" role="list">${due.slice(0, 4).map((r) => `<li class="small">${esc(r.title || byKey(r.key)?.title || r.key)}</li>`).join('')}</ul><a class="btn btn-secondary btn-block mt-4" href="#/review">Start review</a>` : '<p class="small muted mt-2">Completed items come back for review after 1, 3, 7, 14 and 30 days.</p>'}
      </section>
      <section class="card" aria-labelledby="bm-h"><div class="row-between"><h2 id="bm-h" style="font-size:var(--fs-lg)">${t('bookmarks')}</h2><a class="small" href="#/bookmarks">${t('viewAll')}</a></div>
        ${Object.values(u.bookmarks).length ? `<ul class="stack-sm mt-2" role="list">${Object.values(u.bookmarks).sort((a, b) => b.ts - a.ts).slice(0, 5).map((b) => `<li><a class="small" href="${b.route}">${esc(b.title)}</a></li>`).join('')}</ul>` : '<p class="small muted mt-2">Use the bookmark button on any lesson to save it here.</p>'}
      </section>
      <section class="card card-flat"><h2 style="font-size:var(--fs-md)">Think → Research → Understand → Design → Test → Improve</h2><p class="small mt-2">Not watch → memorize → forget. Every lesson ends with practice.</p></section>
    </aside>
  </div>`;

  root.addEventListener('change', (e) => {
    const cb = e.target.closest('[data-plan]'); if (!cb) return;
    togglePlanItem(cb.dataset.plan, cb.checked);
    cb.closest('.plan-item').classList.toggle('is-done', cb.checked);
  });
}
