/* ==========================================================================
   Exam engine (pure logic). Rendering lives in views/exams.js.
   Question types: mcq, tf, multi, match, scenario, law, critique.
   ========================================================================== */
import { shuffle } from './utils.js';

/** Pick N questions for an exam definition from the bank, randomized. */
export function buildExam(def, bank) {
  let pool = bank;
  if (def.tags?.length) pool = bank.filter((q) => q.tags?.some((t) => def.tags.includes(t)));
  if (def.types?.length) pool = pool.filter((q) => def.types.includes(q.type));
  const picked = shuffle(pool).slice(0, Math.min(def.count, pool.length));
  return picked.map((q) => prepare(q));
}

/** Shuffle options (keeping the answer key aligned) so retakes differ. */
export function prepare(q) {
  const c = { ...q };
  if (['mcq', 'scenario', 'law', 'critique', 'multi'].includes(q.type) && !q.fixedOrder) {
    const order = shuffle(q.options.map((_, i) => i));
    c.options = order.map((i) => q.options[i]);
    if (q.type === 'multi') c.answer = q.answer.map((a) => order.indexOf(a)).sort();
    else c.answer = order.indexOf(q.answer);
  }
  if (q.type === 'match') c.rightOptions = shuffle(q.pairs.map((p) => p[1]));
  return c;
}

export function isAnswered(q, a) {
  if (a == null) return false;
  if (q.type === 'multi') return a.length > 0;
  if (q.type === 'match') return Object.keys(a).length === q.pairs.length && Object.values(a).every(Boolean);
  return true;
}

export function grade(q, a) {
  if (!isAnswered(q, a)) return false;
  switch (q.type) {
    case 'tf': return a === q.answer;
    case 'multi': return a.length === q.answer.length && [...a].sort().every((v, i) => v === q.answer[i]);
    case 'match': return q.pairs.every(([l, r]) => a[l] === r);
    default: return a === q.answer;
  }
}

/** Summarize an attempt into a stored result + topic breakdown. */
export function scoreAttempt(def, questions, answers, seconds) {
  let correct = 0, skipped = 0;
  const topics = {};
  const detail = questions.map((q, i) => {
    const a = answers[i];
    const answered = isAnswered(q, a);
    const ok = answered && grade(q, a);
    if (!answered) skipped++; else if (ok) correct++;
    (q.tags || ['general']).forEach((t) => { const s = (topics[t] ||= { c: 0, t: 0 }); s.t++; if (ok) s.c++; });
    return { id: q.id, ok, answered };
  });
  const total = questions.length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const weak = Object.entries(topics).filter(([, s]) => s.c / s.t < 0.7).map(([t, s]) => ({ tag: t, acc: Math.round((s.c / s.t) * 100) })).sort((a, b) => a.acc - b.acc);
  return {
    examId: def.id, title: def.title, ts: Date.now(), total, correct, incorrect: total - correct - skipped, skipped,
    percent, passed: percent >= def.pass, seconds, topics, weak, detail,
    xp: Math.round(correct * 5 + (percent >= def.pass ? 30 : 0) + (percent === 100 ? 20 : 0)),
  };
}
