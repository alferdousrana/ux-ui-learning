import { store, DEFAULT_SETTINGS } from '../core/state.js';
import { t } from '../core/i18n.js';
import { esc, $, fmt, dateKey, addDays, downloadFile } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C } from '../../data/content.js';
import { levelInfo, currentStreak, BADGES, examAverage, countDone } from '../core/progress.js';
import { localStore } from '../core/storage.js';
import { exportData, importData } from '../core/transfer.js';
import { sync } from '../firebase/sync.js';
import { pageHead, progressBar, toast, confirmDialog, emptyState } from '../ui/components.js';
import { trackStats, overall } from './shared.js';

export const APP_VERSION = '1.1.0';

function heatmap() {
  const today = dateKey(); const start = addDays(today, -7 * 16 + 1);
  const cells = [];
  for (let i = 0; i < 7 * 16; i++) { const d = addDays(start, i); const a = store.user.activity[d]; const xp = a?.xp || 0; const l = xp === 0 ? 0 : xp < 30 ? 1 : xp < 80 ? 2 : xp < 150 ? 3 : 4; cells.push(`<i data-l="${l}" title="${d}: ${xp} XP"></i>`); }
  return `<div class="heatmap" role="img" aria-label="Activity over the last 16 weeks">${cells.join('')}</div>`;
}
const badgeGrid = () => `<div class="grid grid-auto">${BADGES.map((b) => { const on = store.user.badges[b.id]; return `<div class="ach ${on ? '' : 'locked'}"><span class="a-ico" aria-hidden="true">${b.icon}</span><div><h4>${esc(b.name)}</h4><p class="muted">${on ? 'Earned ' + new Date(on).toLocaleDateString() : esc(b.desc)}</p></div></div>`; }).join('')}</div>`;

export function renderProgress(root) {
  const u = store.user, lv = levelInfo(), ov = overall();
  root.innerHTML = `${pageHead({ title: t('progress'), lead: 'Everything you\'ve done, saved on this device.' })}
    <div class="grid grid-4 grid-stats">
      <div class="card"><div class="stat"><span class="val">${lv.level}</span><span class="lbl">${esc(lv.title)}</span></div><div class="mt-2">${progressBar(lv.pct, 'accent')}</div></div>
      <div class="card"><div class="stat"><span class="val">${fmt(u.xp)}</span><span class="lbl">Total XP</span></div></div>
      <div class="card"><div class="stat"><span class="val">${currentStreak()}</span><span class="lbl">Day streak (best ${u.streak.best || 0})</span></div></div>
      <div class="card"><div class="stat"><span class="val">${ov.pct}%</span><span class="lbl">${ov.done}/${ov.total} items</span></div></div></div>
    <section class="section card"><h2 style="font-size:var(--fs-lg)">Activity</h2><div class="mt-4">${heatmap()}</div><p class="tiny muted mt-2">Darker = more XP that day.</p></section>
    <section class="section"><h2>By track</h2><div class="stack-sm mt-4">${trackStats().map((tr) => `<div class="progress-row"><span>${esc(tr.title)}</span>${progressBar(tr.pct)}<span class="pct">${tr.pct}%</span></div>`).join('')}</div></section>
    <section class="section"><h2>By module</h2><div class="table-wrap mt-4"><table class="table"><thead><tr><th>Module</th><th>Level</th><th>Completed</th><th style="width:30%">Progress</th></tr></thead><tbody>${C.modules.map((m) => { const d = m.items.filter((k) => u.completed[k]).length; const p = Math.round((d / m.items.length) * 100); return `<tr><td><a href="#/learn/${m.id}">${esc(m.title)}</a></td><td>${esc(m.level)}</td><td>${d}/${m.items.length}</td><td>${progressBar(p)}</td></tr>`; }).join('')}</tbody></table></div></section>
    <section class="section"><h2>Achievements</h2><div class="mt-4">${badgeGrid()}</div></section>`;
}

export function renderProfile(root) {
  const u = store.user, lv = levelInfo(), avg = examAverage();
  const examBy = (id) => { const a = u.exams.filter((e) => e.examId === id); return a.length ? Math.max(...a.map((e) => e.percent)) + '%' : '—'; };
  const name = u.profile.name || 'Learner';
  root.innerHTML = `${pageHead({ title: t('profile') })}
    <section class="card persona-card"><div class="avatar-ph" aria-hidden="true">${esc(name[0].toUpperCase())}</div><div>
      <form id="nm" class="row"><label class="sr-only" for="pname">Your name</label><input class="input" id="pname" style="max-width:260px" value="${esc(u.profile.name)}" placeholder="Your name"><button class="btn btn-secondary btn-sm">Save name</button></form>
      <p class="mt-2"><strong>Level ${lv.level}</strong> · ${esc(lv.title)} · ${fmt(u.xp)} XP · 🔥 ${currentStreak()} day streak</p>${progressBar(lv.pct, 'accent')}</div></section>
    <div class="grid grid-4 grid-stats section">
      <div class="card"><div class="stat"><span class="val">${countDone('lesson')}</span><span class="lbl">Lessons completed</span></div></div>
      <div class="card"><div class="stat"><span class="val">${avg == null ? '—' : avg + '%'}</span><span class="lbl">Exam average</span></div></div>
      <div class="card"><div class="stat"><span class="val">${countDone('case')}</span><span class="lbl">Case studies completed</span></div></div>
      <div class="card"><div class="stat"><span class="val">${countDone('challenge')}</span><span class="lbl">Challenges completed</span></div></div></div>
    <section class="section"><h2>Scores</h2><div class="grid grid-4 grid-stats mt-4">${[['UX Research', 'ux-research'], ['UX Laws', 'ux-laws'], ['UI', 'ui-design'], ['Figma', 'figma']].map(([l, id]) => `<div class="card"><div class="stat"><span class="val">${examBy(id)}</span><span class="lbl">${l} (best exam)</span></div></div>`).join('')}</div></section>
    <section class="section"><h2>Badges</h2><div class="mt-4">${badgeGrid()}</div></section>
    <section class="section show-mobile-block"><h2>More</h2><div class="grid grid-2 mt-4">${[['#/glossary', '📖', t('glossary')], ['#/bookmarks', '🔖', t('bookmarks')], ['#/progress', '📈', t('progress')], ['#/exams', '📝', t('exams')], ['#/career', '🎯', t('career')], ['#/settings', '⚙️', t('settings')]].map(([h, i, l]) => `<a class="card card-link" href="${h}"><strong>${i} ${l}</strong></a>`).join('')}</div></section>`;
  $('#nm', root).addEventListener('submit', (e) => { e.preventDefault(); const v = $('#pname', root).value.trim().slice(0, 40); store.update((uu) => { uu.profile.name = v; }); toast('Name saved'); });
}

export function renderSettings(root) {
  const s = store.settings;
  const seg = (key, opts) => `<div class="segmented" role="group">${opts.map(([v, l]) => `<button type="button" data-set="${key}" data-val="${v}" aria-pressed="${s[key] === v}">${l}</button>`).join('')}</div>`;
  const row = (title, desc, control) => `<div class="row-between" style="padding:var(--sp-4) 0;border-bottom:1px solid var(--line)"><div><strong>${title}</strong>${desc ? `<p class="small muted">${desc}</p>` : ''}</div>${control}</div>`;
  root.innerHTML = `${pageHead({ title: t('settings') })}
    <section class="card"><h2 style="font-size:var(--fs-lg)">Learning</h2>
      ${row('Interface language', 'Menus and labels', seg('lang', [['bn', 'বাংলা'], ['en', 'English']]))}
      ${row('Lesson language', 'Default explanation language in lessons (Bangla is beginner-friendly)', seg('contentLang', [['bn', 'বাংলা'], ['en', 'English']]))}
      ${row('Daily learning goal', 'Minutes per day', `<label class="sr-only" for="dg">Daily goal</label><select id="dg" class="select" style="width:auto" data-num="dailyGoalMin">${[15, 30, 45, 60, 90].map((n) => `<option ${s.dailyGoalMin === n ? 'selected' : ''} value="${n}">${n} min</option>`).join('')}</select>`)}
      ${row('Weekly XP goal', '', `<label class="sr-only" for="wg">Weekly goal</label><select id="wg" class="select" style="width:auto" data-num="weeklyGoalXp">${[300, 500, 700, 1000, 1500].map((n) => `<option ${s.weeklyGoalXp === n ? 'selected' : ''} value="${n}">${n} XP</option>`).join('')}</select>`)}
      ${row('Study reminders', 'Show a reminder banner if you haven\'t studied today (no push notifications are sent)', `<label class="toggle"><input type="checkbox" data-bool="reminders" ${s.reminders ? 'checked' : ''}><span class="track"></span><span class="sr-only">Study reminders</span></label>`)}
    </section>
    <section class="card mt-6"><h2 style="font-size:var(--fs-lg)">Appearance</h2>
      ${row('Theme', '', seg('theme', [['light', 'Light'], ['dark', 'Dark']]))}
      ${row('Font size', '', seg('fontSize', [['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']]))}
    </section>
    <section class="card mt-6"><h2 style="font-size:var(--fs-lg)">Your data</h2>
      ${row('Export progress', 'Download progress, XP, bookmarks, notes, exam results and settings as JSON', `<button class="btn btn-secondary btn-sm" id="exp">${icon('download')} Export JSON</button>`)}
      ${row('Import progress', 'Restore from an exported file (replaces current data)', `<label class="btn btn-secondary btn-sm" for="imp">${icon('upload')} Import JSON</label><input type="file" id="imp" accept="application/json,.json" class="sr-only">`)}
      ${row('Reset progress', 'Clear XP, completions, exams and streak. Keeps settings.', '<button class="btn btn-danger btn-sm" id="rst">Reset progress</button>')}
      ${row('Clear all local data', 'Removes everything this app stored on this device', '<button class="btn btn-danger btn-sm" id="clr">Clear local data</button>')}
    </section>
    <section class="card mt-6"><h2 style="font-size:var(--fs-lg)">About</h2>
      ${row('Version', '', `<span>${APP_VERSION}</span>`)}
      ${row('Offline status', '', `<span id="offst">${navigator.onLine ? 'Online' : 'Offline'} · ${'serviceWorker' in navigator && navigator.serviceWorker.controller ? 'Available offline ✓' : 'Offline cache not active yet'}</span>`)}
      ${row('Storage', '', `<span>${localStore.kind === 'indexeddb' ? 'IndexedDB' : 'localStorage (fallback)'}</span>`)}
      ${row('Cloud sync', 'Firebase sync is prepared but not connected in this version', `<span class="badge">${esc(sync.statusLabel())}</span>`)}
      ${row('Privacy', 'All learning data stays on this device. Nothing is sent to any server.', '')}
      ${row('Install app', 'Use the app full-screen and offline', `<button class="btn btn-secondary btn-sm" data-action="install">${icon('download')} ${t('install')}</button>`)}
    </section>`;
  root.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-set]');
    if (b) { store.setSetting(b.dataset.set, b.dataset.val); b.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b)); if (b.dataset.set === 'lang') location.reload(); }
    if (e.target.closest('#exp')) { downloadFile(`ux-ui-progress-${dateKey()}.json`, JSON.stringify(exportData(), null, 2)); toast('Progress exported', { ico: '💾' }); }
    if (e.target.closest('#rst') && await confirmDialog('Reset progress?', 'XP, completions, exams, streak and reviews will be cleared. Notes, bookmarks and personas are also cleared. Settings stay.', { confirm: 'Reset progress', danger: true })) { await store.reset(); toast('Progress reset'); location.hash = '#/'; }
    if (e.target.closest('#clr') && await confirmDialog('Clear all local data?', 'Everything stored by UX-UI on this device will be removed. Export first if you want a backup.', { confirm: 'Clear everything', danger: true })) { await store.clearAll(); location.hash = '#/'; location.reload(); }
  });
  root.addEventListener('change', async (e) => {
    const n = e.target.closest('[data-num]'); if (n) { store.setSetting(n.dataset.num, +n.value); toast('Saved'); }
    const bo = e.target.closest('[data-bool]'); if (bo) store.setSetting(bo.dataset.bool, bo.checked);
    if (e.target.id === 'imp' && e.target.files[0]) {
      try { const txt = await e.target.files[0].text(); const summary = await importData(JSON.parse(txt)); toast(`Imported: ${summary}`, { ico: '✅', timeout: 5000 }); }
      catch (err) { toast(`Import failed: ${esc(err.message)}`, { ico: '⚠️', timeout: 6000 }); }
      e.target.value = '';
    }
  });
}
