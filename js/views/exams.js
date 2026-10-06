import { store } from '../core/state.js';
import { t } from '../core/i18n.js';
import { esc, $, fmt } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C, tagInfo } from '../../data/content.js';
import { buildExam, scoreAttempt, isAnswered } from '../core/exam.js';
import { addXp, recordAnswer, levelInfo } from '../core/progress.js';
import { pageHead, diffBadge, questionHtml, nextAnswer, confirmDialog, progressBar, emptyState, toast } from '../ui/components.js';
import { notFound } from './learn.js';

const poolFor = (def) => (def.tags || def.types ? buildExam({ ...def, count: 1e9 }, C.questions) : C.questions);

export function renderExams(root) {
  const att = store.user.exams;
  root.innerHTML = `${pageHead({ title: t('exams'), lead: 'Timed, randomized exams with explanations, topic breakdowns and XP. Pass mark is shown on each card.' })}
    <div class="grid grid-3">${C.exams.map((e) => { const mine = att.filter((a) => a.examId === e.id); const best = mine.length ? Math.max(...mine.map((a) => a.percent)) : null; const n = Math.min(e.count, poolFor(e).length);
      return `<a class="card card-link" href="#/exam/${e.id}"><div class="card-top">${diffBadge(e.level)}${best != null ? `<span class="badge ${best >= e.pass ? 'badge-good' : 'badge-bad'}">Best ${best}%</span>` : ''}</div><h3>${esc(e.title)}</h3><p>${esc(e.desc)}</p>
        <div class="card-meta"><span class="tiny muted">${n} questions · ${e.minutes} min · pass ${e.pass}%</span>${mine.length ? `<span class="tiny muted">${mine.length} attempt${mine.length > 1 ? 's' : ''}</span>` : ''}</div></a>`; }).join('')}</div>
    <section class="section"><div class="section-head"><h2>Exam history</h2></div>
      ${att.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Exam</th><th>Score</th><th>Result</th><th>Time</th><th>Date</th></tr></thead><tbody>${att.slice().reverse().slice(0, 20).map((a) => `<tr><td>${esc(a.title)}</td><td>${a.correct}/${a.total} (${a.percent}%)</td><td><span class="badge ${a.passed ? 'badge-good' : 'badge-bad'}">${a.passed ? 'Passed' : 'Not passed'}</span></td><td>${Math.floor(a.seconds / 60)}m ${a.seconds % 60}s</td><td>${new Date(a.ts).toLocaleDateString()}</td></tr>`).join('')}</tbody></table></div>`
        : emptyState({ ico: '📝', title: 'No exams taken yet', text: 'Start with UX Fundamentals — 15 questions, 12 minutes.', action: '<a class="btn btn-primary" href="#/exam/ux-fundamentals">Start UX Fundamentals exam</a>' })}</section>`;
}

export function renderExam(root, { params }) {
  const def = C.examMap.get(params.id); if (!def) return notFound(root);
  const n = Math.min(def.count, poolFor(def).length);
  root.innerHTML = `${pageHead({ crumbs: [[t('exams'), '#/exams'], [def.title]], title: `${def.title} exam`, lead: esc(def.desc) })}
    <div class="card"><div class="grid grid-4 grid-stats"><div class="stat"><span class="val">${n}</span><span class="lbl">Questions</span></div><div class="stat"><span class="val">${def.minutes}</span><span class="lbl">Minutes</span></div><div class="stat"><span class="val">${def.pass}%</span><span class="lbl">To pass</span></div><div class="stat"><span class="val">≈${n * 5 + 30}</span><span class="lbl">XP available</span></div></div>
    <ul class="prose small mt-6"><li>Questions and options are shuffled every attempt.</li><li>You can move between questions and change answers before submitting.</li><li>When time runs out, the exam submits automatically.</li></ul>
    <button class="btn btn-primary btn-lg mt-6" id="ex-start">${icon('play')} Start exam</button></div>`;
  $('#ex-start', root).addEventListener('click', () => run(root, def));
}

function run(root, def) {
  const qs = buildExam(def, C.questions);
  const answers = new Array(qs.length).fill(undefined);
  let cur = 0, left = def.minutes * 60, finished = false;
  const started = Date.now();
  const fmtT = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  root.innerHTML = `<div class="exam-bar" role="region" aria-label="Exam status"><strong>${esc(def.title)}</strong><div class="progress" id="ex-prog" style="flex:1"><span></span></div><span class="timer" id="ex-timer" role="timer" aria-live="off">${fmtT(left)}</span><button class="btn btn-primary btn-sm" id="ex-submit">Submit</button></div>
    <div class="split"><div><div class="card" id="ex-q"></div><div class="row-between mt-4"><button class="btn btn-secondary" id="ex-prev">← ${t('prev')}</button><button class="btn btn-primary" id="ex-next">${t('next')} →</button></div></div>
    <aside class="card"><h2 style="font-size:var(--fs-md)">Questions</h2><div class="qnav mt-2" id="ex-nav" role="group" aria-label="Jump to question"></div><p class="tiny muted mt-4" id="ex-ans"></p></aside></div>`;
  const draw = () => {
    $('#ex-q', root).innerHTML = questionHtml(qs[cur], answers[cur], { idx: cur });
    $('#ex-nav', root).innerHTML = qs.map((q, i) => `<button class="${isAnswered(q, answers[i]) ? 'answered' : ''}" aria-current="${i === cur}" data-go="${i}" aria-label="Question ${i + 1}${isAnswered(q, answers[i]) ? ', answered' : ''}">${i + 1}</button>`).join('');
    const done = qs.filter((q, i) => isAnswered(q, answers[i])).length;
    $('#ex-ans', root).textContent = `${done} of ${qs.length} answered`;
    $('#ex-prog span', root).style.width = `${(done / qs.length) * 100}%`;
    $('#ex-prev', root).disabled = cur === 0;
    $('#ex-next', root).textContent = cur === qs.length - 1 ? 'Review & submit' : `${t('next')} →`;
  };
  const timer = setInterval(() => {
    if (!root.isConnected || finished) { clearInterval(timer); return; }
    left--; const el = $('#ex-timer', root); el.textContent = fmtT(left); el.classList.toggle('low', left <= 60);
    if (left === 60) toast('1 minute left', { ico: '⏱️' });
    if (left <= 0) { clearInterval(timer); finish(true); }
  }, 1000);
  const finish = (timeout = false) => {
    if (finished) return; finished = true; clearInterval(timer);
    const res = scoreAttempt(def, qs, answers, Math.round((Date.now() - started) / 1000));
    qs.forEach((q, i) => { if (isAnswered(q, answers[i])) recordAnswer(q.id, res.detail[i].ok, q.tags); });
    store.update((u) => { u.exams.push({ ...res, detail: undefined }); if (u.exams.length > 200) u.exams.shift(); });
    addXp(res.xp, def.title + ' exam');
    result(root, def, qs, answers, res, timeout);
  };
  root.querySelector('#ex-q').addEventListener('click', (e) => { const a = nextAnswer(qs[cur], answers[cur], e.target); if (a === undefined) return; answers[cur] = a; draw(); root.querySelector(`#ex-q [data-opt="${e.target.closest('[data-opt]')?.dataset.opt}"]`)?.focus(); });
  root.querySelector('#ex-q').addEventListener('change', (e) => { answers[cur] = nextAnswer(qs[cur], answers[cur], e.target); draw(); });
  $('#ex-prev', root).addEventListener('click', () => { cur = Math.max(0, cur - 1); draw(); });
  $('#ex-next', root).addEventListener('click', () => { if (cur < qs.length - 1) { cur++; draw(); } else $('#ex-submit', root).click(); });
  $('#ex-nav', root).addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) { cur = +b.dataset.go; draw(); } });
  $('#ex-submit', root).addEventListener('click', async () => {
    const un = qs.filter((q, i) => !isAnswered(q, answers[i])).length;
    if (await confirmDialog('Submit exam?', un ? `${un} question${un > 1 ? 's are' : ' is'} unanswered and will count as skipped.` : 'You answered every question.', { confirm: 'Submit exam' })) finish();
  });
  root.addEventListener('keydown', (e) => { if (e.target.closest('input, textarea, select')) return; if (e.key === 'ArrowRight') $('#ex-next', root).click(); if (e.key === 'ArrowLeft' && cur > 0) $('#ex-prev', root).click(); });
  draw();
}

function result(root, def, qs, answers, r, timeout) {
  const lv = levelInfo();
  const topics = Object.entries(r.topics).map(([tag, s]) => ({ tag, ...s, acc: Math.round((s.c / s.t) * 100) })).sort((a, b) => a.acc - b.acc);
  const recs = r.weak.slice(0, 4).map((w) => tagInfo(w.tag));
  root.innerHTML = `${pageHead({ crumbs: [[t('exams'), '#/exams'], [def.title]], title: `${def.title} — result` })}
    ${timeout ? '<div class="callout key"><h4>Time\'s up</h4><p>The exam was submitted automatically.</p></div>' : ''}
    <section class="card result-hero mt-4"><div class="ring" style="--p:${r.percent};--size:140px"><span>${r.percent}%</span></div>
      <div><h2>${r.passed ? 'Passed 🎉' : 'Not passed yet'}</h2><p class="mt-2">Score <strong>${r.correct}/${r.total}</strong> · pass mark ${def.pass}% · +${r.xp} XP earned</p>
      <div class="grid grid-4 grid-stats mt-4"><div class="stat"><span class="val">${r.correct}</span><span class="lbl">Correct</span></div><div class="stat"><span class="val">${r.incorrect}</span><span class="lbl">Incorrect</span></div><div class="stat"><span class="val">${r.skipped}</span><span class="lbl">Skipped</span></div><div class="stat"><span class="val">${Math.floor(r.seconds / 60)}:${String(r.seconds % 60).padStart(2, '0')}</span><span class="lbl">Time</span></div></div>
      <p class="small mt-4">Level ${lv.level} · ${esc(lv.title)} — ${fmt(lv.toNext)} XP to next level</p>${progressBar(lv.pct, 'accent')}</div></section>
    <div class="row mt-6"><button class="btn btn-secondary" id="rv">${icon('eye')} Review answers</button>${r.weak.length ? `<a class="btn btn-primary" href="#/practice/quiz?weak=1">${icon('target')} Study weak topics</a>` : ''}<a class="btn btn-secondary" href="#/exam/${def.id}?r=${Date.now()}">${icon('refresh')} Retake</a></div>
    <div class="split section"><section><h2>Topic performance</h2><div class="stack-sm mt-4">${topics.map((tp) => `<div class="progress-row"><a href="${tagInfo(tp.tag).route}">${esc(tagInfo(tp.tag).label)}</a>${progressBar(tp.acc, tp.acc >= 70 ? 'good' : '')}<span class="pct">${tp.c}/${tp.t}</span></div>`).join('')}</div></section>
      <aside class="card"><h2 style="font-size:var(--fs-lg)">${t('weakAreas')}</h2>${r.weak.length ? `<ul class="stack-sm mt-2" role="list">${r.weak.map((w) => `<li class="row-between"><span>${esc(tagInfo(w.tag).label)}</span><span class="badge badge-bad">${w.acc}%</span></li>`).join('')}</ul><h3 class="mt-6" style="font-size:var(--fs-md)">Recommended revision</h3><ul class="stack-sm mt-2" role="list">${recs.map((x) => `<li><a href="${x.route}">${esc(x.label)}</a></li>`).join('')}</ul>` : '<p class="small mt-2">No weak topics in this attempt. Try a harder exam.</p>'}</aside></div>
    <section id="review" class="section" hidden><h2>Answer review</h2><div class="stack mt-4">${qs.map((q, i) => `<div class="card">${questionHtml(q, answers[i], { reveal: true, idx: i })}</div>`).join('')}</div></section>`;
  $('#rv', root).addEventListener('click', () => { const s = $('#review', root); s.hidden = false; s.scrollIntoView({ behavior: 'smooth' }); });
  $('h1', root)?.focus();
}
