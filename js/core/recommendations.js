/* ==========================================================================
   Daily learning engine. Builds a stable plan per day from:
   due reviews → weak topics → next lesson in path → a UX law → Figma → case
   study → MCQ revision. The plan is frozen in user.daily so it doesn't shift
   as the learner completes things during the day. Works fully offline.
   ========================================================================== */
import { store } from './state.js';
import { dateKey, seeded, pick } from './utils.js';
import { C, byKey } from '../../data/content.js';
import { isDone, reviewQueue, weakTopics } from './progress.js';

const firstUndone = (keys) => keys.find((k) => !isDone(k));

export function buildPlan() {
  const today = dateKey();
  const rand = seeded('plan-' + today);
  const plan = [];
  const add = (key, kind, minutes, routeOverride, titleOverride) => {
    if (!key || plan.some((p) => p.key === key)) return;
    const r = key.startsWith('task:') ? null : byKey(key);
    if (!r && !routeOverride) return;
    plan.push({ key, kind, minutes, title: titleOverride || r.title, route: routeOverride || r.route });
  };

  // 1. Spaced revision (max 2)
  reviewQueue().slice(0, 2).forEach((r) => add(r.key, 'Review', 5, '#/review', `Review: ${r.title || byKey(r.key)?.title || r.key}`));

  // 2. Weak topic → a lesson/law tagged with it that isn't done
  const weak = weakTopics(2, 3);
  for (const w of weak) {
    const cand = C.path.find((k) => !isDone(k) && (byKey(k)?.item.tags || []).includes(w.tag));
    if (cand) { add(cand, 'Weak area', 15); break; }
  }

  // 3. Next UX theory lesson along the path (non-Figma, non-law)
  add(firstUndone(C.path.filter((k) => k.startsWith('lesson:') && !k.startsWith('lesson:fg-'))), 'UX Theory', 15);

  // 4. A UX law
  add(firstUndone(C.laws.map((l) => 'law:' + l.id)), 'UX Law', 15);

  // 5. Figma practice
  add(firstUndone(C.path.filter((k) => k.startsWith('lesson:fg-'))), 'Figma Practice', 20);

  // 6. Case study or comparison
  const cs = firstUndone(C.cases.map((c) => 'case:' + c.id));
  if (cs) add(cs, 'Case Study', 10); else add('compare:' + pick(C.comparisons, rand).id, 'Good vs Bad', 10);

  // 7. Revision MCQs
  plan.push({ key: 'task:mcq-' + today, kind: 'Revision', minutes: 10, title: '10 revision questions', route: '#/practice/quiz?n=10' });
  return plan;
}

/** Today's frozen plan (regenerated once per calendar day). */
export function todaysPlan() {
  const today = dateKey();
  let d = store.user.daily;
  if (d.date !== today || !Array.isArray(d.plan)) {
    const plan = buildPlan();
    store.update((u) => { u.daily = { date: today, plan, checks: {} }; }, { silent: true });
    d = store.user.daily;
  }
  return d.plan.map((p) => ({ ...p, done: !!d.checks[p.key] || isDone(p.key) }));
}

export function togglePlanItem(key, value) {
  store.update((u) => { u.daily.checks[key] = value; });
}

export function dailyChallenge() {
  const list = C.challenges;
  const r = seeded('challenge-' + dateKey());
  // prefer flagship challenges every few days
  const flag = list.filter((c) => c.flagship);
  return r() < 0.35 ? pick(flag, r) : pick(list, r);
}
