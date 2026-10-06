/* ==========================================================================
   Progress engine: XP, levels, streaks, completion, spaced revision, badges.
   Pure functions over store.user; UI reacts to store events ('xp', 'badge').
   ========================================================================== */
import { store } from './state.js';
import { dateKey, addDays, diffDays } from './utils.js';

export const XP_RULES = {
  lesson: 20, law: 25, method: 25, figma: 15, case: 40, challenge: 50, project: 120,
  compare: 10, critique: 15, quiz: 5, review: 10, persona: 20, flow: 20,
};
/** Spaced-revision intervals in days (stage 0 → 1 day, … stage 4 → 30 days). */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30];
const REVIEWABLE = new Set(['lesson', 'law', 'method', 'case', 'figma']);

const LEVEL_TITLES = [
  [1, 'Curious Beginner'], [3, 'UX Explorer'], [6, 'Interaction Apprentice'], [10, 'Research Practitioner'],
  [15, 'Interface Crafter'], [20, 'Product Thinker'], [28, 'Senior Practitioner'], [36, 'Design Lead'],
];
export const levelFromXp = (xp) => Math.floor(Math.sqrt(Math.max(0, xp) / 40)) + 1;
export const xpForLevel = (l) => 40 * (l - 1) ** 2;
export function levelTitle(l) { let t = LEVEL_TITLES[0][1]; for (const [min, name] of LEVEL_TITLES) if (l >= min) t = name; return t; }
export function levelInfo(xp = store.user.xp) {
  const level = levelFromXp(xp), cur = xpForLevel(level), nxt = xpForLevel(level + 1);
  return { level, title: levelTitle(level), cur, nxt, toNext: nxt - xp, pct: Math.round(((xp - cur) / (nxt - cur)) * 100) };
}

const typeOf = (key) => key.split(':')[0];
export const isDone = (key) => !!store.user.completed[key];

function touchStreak(u) {
  const today = dateKey();
  const s = u.streak;
  if (s.last === today) return;
  if (s.last && diffDays(s.last, today) === 1) s.count += 1; else s.count = 1;
  s.last = today;
  s.best = Math.max(s.best || 0, s.count);
}
/** Streak shown to the user: broken if the last activity was before yesterday. */
export function currentStreak() {
  const s = store.user.streak;
  if (!s.last) return 0;
  return diffDays(s.last, dateKey()) <= 1 ? s.count : 0;
}

function bumpActivity(u, { xp = 0, items = 0, minutes = 0 }) {
  const a = (u.activity[dateKey()] ||= { xp: 0, items: 0, minutes: 0 });
  a.xp += xp; a.items += items; a.minutes += minutes;
}

export function addXp(amount, reason = '') {
  if (!amount) return;
  const before = levelFromXp(store.user.xp);
  store.update((u) => { u.xp += amount; bumpActivity(u, { xp: amount }); touchStreak(u); });
  store.emit('xp', { amount, reason });
  const after = levelFromXp(store.user.xp);
  if (after > before) store.emit('levelup', { level: after, title: levelTitle(after) });
  checkBadges();
}

/** Mark an item complete once. Returns true if newly completed. */
export function complete(key, { title = '', route = '', minutes = 10, xp } = {}) {
  if (isDone(key)) return false;
  const type = typeOf(key);
  const gain = xp ?? XP_RULES[type] ?? 10;
  const before = levelFromXp(store.user.xp);
  store.update((u) => {
    u.completed[key] = Date.now();
    u.xp += gain;
    bumpActivity(u, { xp: gain, items: 1, minutes });
    touchStreak(u);
    if (REVIEWABLE.has(type) && !u.reviews[key]) u.reviews[key] = { stage: 0, due: addDays(dateKey(), REVIEW_INTERVALS[0]), title, route };
  });
  store.emit('xp', { amount: gain, reason: title || 'Completed' });
  const after = levelFromXp(store.user.xp);
  if (after > before) store.emit('levelup', { level: after, title: levelTitle(after) });
  checkBadges();
  return true;
}

export function uncomplete(key) {
  store.update((u) => { delete u.completed[key]; delete u.reviews[key]; });
}

export function visit(key, title, route) {
  store.update((u) => {
    u.history = [{ key, title, route, ts: Date.now() }, ...u.history.filter((h) => h.key !== key)].slice(0, 30);
  }, { silent: true });
}

/* ---------- Spaced revision ---------- */
export function reviewQueue(includeUpcoming = false) {
  const today = dateKey();
  return Object.entries(store.user.reviews)
    .map(([key, r]) => ({ key, ...r, overdue: diffDays(r.due, today) }))
    .filter((r) => r.stage < REVIEW_INTERVALS.length && (includeUpcoming || r.overdue >= 0))
    .sort((a, b) => a.due.localeCompare(b.due));
}
export function reviewItem(key, remembered) {
  store.update((u) => {
    const r = u.reviews[key]; if (!r) return;
    if (remembered) {
      r.stage += 1;
      r.due = r.stage < REVIEW_INTERVALS.length ? addDays(dateKey(), REVIEW_INTERVALS[r.stage]) : null;
      if (!r.due) r.mastered = Date.now();
    } else {
      r.stage = 0; r.due = addDays(dateKey(), REVIEW_INTERVALS[0]);
    }
  });
  addXp(remembered ? XP_RULES.review : 4, 'Review');
}

/* ---------- Questions / topic accuracy ---------- */
export function recordAnswer(qid, correct, tags = []) {
  store.update((u) => {
    const q = (u.quiz[qid] ||= { correct: false, tries: 0, ts: 0 });
    q.tries += 1; q.correct = correct; q.ts = Date.now();
    tags.forEach((t) => { const s = (u.topicStats[t] ||= { c: 0, t: 0 }); s.t += 1; if (correct) s.c += 1; });
  }, { silent: true });
}
/** Tags with ≥ minAttempts and < 70% accuracy, weakest first. */
export function weakTopics(minAttempts = 2, limit = 5) {
  return Object.entries(store.user.topicStats)
    .filter(([, s]) => s.t >= minAttempts && s.c / s.t < 0.7)
    .map(([tag, s]) => ({ tag, acc: Math.round((s.c / s.t) * 100), attempts: s.t }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, limit);
}

/* ---------- Goals ---------- */
export function todayActivity() { return store.user.activity[dateKey()] || { xp: 0, items: 0, minutes: 0 }; }
export function weekXp() {
  let sum = 0; const today = dateKey();
  for (let i = 0; i < 7; i++) sum += store.user.activity[addDays(today, -i)]?.xp || 0;
  return sum;
}
export function countDone(type) {
  return Object.keys(store.user.completed).filter((k) => k.startsWith(type + ':')).length;
}
export function examAverage() {
  const ex = store.user.exams; if (!ex.length) return null;
  return Math.round(ex.reduce((s, e) => s + e.percent, 0) / ex.length);
}

/* ---------- Badges / achievements ---------- */
export const BADGES = [
  { id: 'first-step', icon: '🌱', name: 'First step', desc: 'Complete your first item', test: (u) => Object.keys(u.completed).length >= 1 },
  { id: 'first-law', icon: '⚖️', name: 'First UX Law', desc: 'Complete any UX law', test: () => countDone('law') >= 1 },
  { id: 'ten-lessons', icon: '📘', name: '10 Lessons Completed', desc: 'Finish 10 lessons', test: () => countDone('lesson') >= 10 },
  { id: 'fifty-lessons', icon: '📚', name: '50 Lessons Completed', desc: 'Finish 50 lessons', test: () => countDone('lesson') >= 50 },
  { id: 'laws-master', icon: '🏛️', name: 'UX Laws Master', desc: 'Complete 20 UX laws', test: () => countDone('law') >= 20 },
  { id: 'researcher', icon: '🔬', name: 'UX Researcher', desc: 'Complete 8 research methods', test: () => countDone('method') >= 8 },
  { id: 'figma-beginner', icon: '🎨', name: 'Figma Beginner', desc: 'Complete 5 Figma lessons or items', test: (u) => Object.keys(u.completed).filter((k) => k.startsWith('figma:') || k.startsWith('lesson:fg-')).length >= 5 },
  { id: 'first-case', icon: '🗂️', name: 'Case Study Analyst', desc: 'Complete your first case study', test: () => countDone('case') >= 1 },
  { id: 'first-challenge', icon: '🧩', name: 'First Design Challenge', desc: 'Complete a design challenge', test: () => countDone('challenge') >= 1 },
  { id: 'critic', icon: '🔍', name: 'Sharp Eye', desc: 'Finish 5 design critiques', test: () => countDone('critique') >= 5 },
  { id: 'quiz-100', icon: '✅', name: '100 Quiz Questions', desc: 'Answer 100 questions', test: (u) => Object.values(u.quiz).reduce((s, q) => s + q.tries, 0) >= 100 },
  { id: 'exam-pass', icon: '🎓', name: 'Exam Passed', desc: 'Pass any exam', test: (u) => u.exams.some((e) => e.passed) },
  { id: 'exam-ace', icon: '💯', name: 'Perfect Score', desc: 'Score 100% on an exam', test: (u) => u.exams.some((e) => e.percent === 100) },
  { id: 'streak-7', icon: '🔥', name: '7-Day Streak', desc: 'Learn 7 days in a row', test: (u) => (u.streak.best || 0) >= 7 },
  { id: 'streak-30', icon: '☄️', name: '30-Day Streak', desc: 'Learn 30 days in a row', test: (u) => (u.streak.best || 0) >= 30 },
  { id: 'persona', icon: '🧑‍💼', name: 'Persona Maker', desc: 'Save a persona', test: (u) => u.personas.length >= 1 },
  { id: 'flow', icon: '🔀', name: 'Flow Builder', desc: 'Save a user flow', test: (u) => u.flows.length >= 1 },
  { id: 'project', icon: '🚀', name: 'Project Shipped', desc: 'Complete a guided project', test: () => countDone('project') >= 1 },
  { id: 'xp-1000', icon: '⭐', name: '1,000 XP', desc: 'Earn 1,000 XP', test: (u) => u.xp >= 1000 },
  { id: 'xp-5000', icon: '🌟', name: '5,000 XP', desc: 'Earn 5,000 XP', test: (u) => u.xp >= 5000 },
];
export function checkBadges() {
  const u = store.user;
  const fresh = BADGES.filter((b) => !u.badges[b.id] && b.test(u));
  if (!fresh.length) return;
  store.update((uu) => { fresh.forEach((b) => { uu.badges[b.id] = Date.now(); }); });
  fresh.forEach((b) => store.emit('badge', b));
}
