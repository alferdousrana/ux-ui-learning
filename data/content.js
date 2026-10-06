/* ==========================================================================
   Content registry. Loads every data module (in parallel, cached by the
   service worker), normalizes them into one addressable graph of "keys"
   (type:id), builds the learning path, question bank and search documents.
   ========================================================================== */
export const C = { ready: false };

const TAG_LABELS = {
  'ux-basics': ['UX fundamentals', '#/learn/fundamentals'], usability: ['Usability', '#/lesson/usability'], mindset: ['Design mindset', '#/learn/mindset'],
  process: ['Design process', '#/lesson/design-thinking'], errors: ['Error prevention & recovery', '#/lesson/error-prevention'], metrics: ['UX metrics', '#/lesson/ut-metrics'],
  hci: ['Human interaction', '#/learn/hci'], affordance: ['Affordances & signifiers', '#/lesson/hci-affordance'], cognition: ['Cognitive psychology', '#/lesson/hci-cognitive-load'],
  memory: ['Memory', '#/lesson/hci-memory'], behavior: ['Human behavior', '#/lesson/hci-behavior'], 'mental-models': ['Mental models', '#/lesson/hci-mental-models'],
  feedback: ['Feedback & system status', '#/lesson/hci-feedback'], attention: ['Attention', '#/lesson/hci-attention'], decision: ['Decision making', '#/lesson/hci-decision-making'],
  heuristics: ['Heuristic evaluation', '#/method/heuristic-evaluation'], gestalt: ['Gestalt principles', '#/lesson/hci-perception'], research: ['UX research', '#/research'],
  interviews: ['User interviews', '#/method/user-interviews'], 'usability-testing': ['Usability testing', '#/learn/usability'], personas: ['Personas', '#/learn/personas'],
  surveys: ['Surveys', '#/method/surveys'], ia: ['Information architecture', '#/learn/ia'], flow: ['User flows', '#/learn/userflow'], states: ['Screen states', '#/lesson/uf-edge-cases'],
  navigation: ['Navigation', '#/lesson/ia-navigation'], search: ['Search', '#/lesson/ia-search'], wireframe: ['Wireframing', '#/learn/wireframing'], prototype: ['Prototyping', '#/learn/prototyping'],
  a11y: ['Accessibility', '#/learn/accessibility'], typography: ['Typography', '#/learn/typography'], color: ['Color', '#/learn/color'], layout: ['Layout', '#/learn/layout'],
  components: ['Components', '#/learn/components'], 'design-systems': ['Design systems', '#/learn/design-systems'], tokens: ['Design tokens', '#/lesson/ds-tokens'],
  theming: ['Theming & dark mode', '#/lesson/color-dark-mode'], forms: ['Forms', '#/lesson/a11y-forms'], buttons: ['Buttons', '#/lesson/cmp-buttons'], figma: ['Figma', '#/figma'],
  mobile: ['Mobile design', '#/lesson/wf-mobile'], trust: ['Trust & credibility', '#/lesson/credibility'], emotion: ['Emotion', '#/lesson/hci-emotion'], career: ['Career', '#/career'],
};

const TRACKS = [
  ['foundations', 'UX Foundations', ['mindset', 'fundamentals']],
  ['hci', 'Human Interaction', ['hci']],
  ['laws', 'UX Laws', ['laws']],
  ['research', 'UX Research', ['research-fundamentals', 'research-methods', 'personas']],
  ['process', 'UX Process', ['ia', 'userflow', 'wireframing', 'prototyping', 'usability', 'accessibility']],
  ['ui', 'UI Design', ['typography', 'color', 'layout', 'components', 'design-systems']],
  ['figma', 'Figma', ['figma-beginner', 'figma-intermediate', 'figma-advanced']],
  ['cases', 'Case Studies', ['__cases']],
  ['career', 'Career', ['career']],
];

const MODULE_ORDER = ['mindset', 'fundamentals', 'hci', 'laws', 'research-fundamentals', 'research-methods', 'personas', 'ia', 'userflow', 'wireframing', 'prototyping', 'usability', 'accessibility', 'typography', 'color', 'layout', 'components', 'design-systems', 'figma-beginner', 'figma-intermediate', 'figma-advanced', 'career'];

export async function loadContent() {
  if (C.ready) return C;
  const [ux, proc, rs, ui, fg, cr, lw, pl, cs, qs, gl, ch, cp, qb1] = await Promise.all([
    import('./curriculum-ux.js'), import('./curriculum-process.js'), import('./ux-research.js'), import('./ui.js'), import('./figma.js'),
    import('./career.js'), import('./ux-laws.js'), import('./figma-plugins.js'), import('./case-studies.js'), import('./questions.js'),
    import('./glossary.js'), import('./challenges.js'), import('./comparisons.js'), import('./questions-b1.js'),
  ]);

  /* Lessons */
  const lessons = [...ux.LESSONS, ...proc.LESSONS, ...rs.LESSONS, ...ui.LESSONS, ...fg.LESSONS, ...cr.LESSONS];
  C.lessons = new Map(lessons.map((l) => [l.id, l]));
  C.laws = lw.LAWS; C.lawMap = new Map(lw.LAWS.map((l) => [l.id, l])); C.lawCategories = lw.LAW_CATEGORIES;
  C.methods = rs.METHODS; C.methodMap = new Map(rs.METHODS.map((m) => [m.id, m])); C.toolkit = rs.TOOLKIT;
  C.figmaItems = fg.getFigmaItems(); C.figmaMap = new Map(C.figmaItems.map((x) => [x.id, x])); C.figmaCategories = fg.FIGMA_CATEGORIES; C.figmaBases = fg.FIGMA_BASES;
  C.plugins = pl.PLUGINS; C.pluginMap = new Map(pl.PLUGINS.map((p) => [p.id, p])); C.pluginCategories = pl.PLUGIN_CATEGORIES; C.pluginUseCases = pl.PLUGIN_USE_CASES; C.pluginNote = pl.PLUGIN_NOTE;
  C.cases = cs.CASES; C.caseMap = new Map(cs.CASES.map((c) => [c.id, c])); C.caseCategories = cs.CASE_CATEGORIES; C.caseSections = cs.CASE_SECTIONS;
  C.glossary = gl.GLOSSARY.slice().sort((a, b) => a.term.localeCompare(b.term)); C.termMap = new Map(gl.GLOSSARY.map((g) => [g.id, g]));
  C.challenges = ch.getChallenges(); C.challengeMap = new Map(C.challenges.map((c) => [c.id, c]));
  C.projects = ch.PROJECTS; C.projectMap = new Map(ch.PROJECTS.map((p) => [p.id, p])); C.projectSteps = ch.PROJECT_STEPS;
  C.comparisons = cp.COMPARISONS; C.compareMap = new Map(cp.COMPARISONS.map((x) => [x.id, x])); C.compareCategories = cp.COMPARE_CATEGORIES;
  C.critiques = cp.CRITIQUES; C.critiqueMap = new Map(cp.CRITIQUES.map((x) => [x.id, x]));
  C.exams = qs.EXAMS; C.examMap = new Map(qs.EXAMS.map((e) => [e.id, e]));
  C.careerLevels = cr.CAREER_LEVELS; C.interviewQuestions = cr.INTERVIEW_QUESTIONS;

  /* Modules (+ virtual ones for laws and methods), in learning-path order */
  const mods = [...ux.MODULES, ...proc.MODULES, ...rs.MODULES, ...ui.MODULES, ...fg.MODULES, ...cr.MODULES,
    { id: 'laws', track: 'laws', level: 'Level 2', icon: 'scale', title: 'UX Laws', titleBn: 'UX ল\'জ', desc: { bn: 'মানুষের আচরণভিত্তিক ডিজাইনের সূত্র।', en: 'Principles of human behavior that shape good design.' } }];
  const modMap = new Map(mods.map((m) => [m.id, { ...m, items: [] }]));
  lessons.forEach((l) => modMap.get(l.module)?.items.push('lesson:' + l.id));
  modMap.get('laws').items = lw.LAWS.map((l) => 'law:' + l.id);
  modMap.get('research-methods').items = rs.METHODS.map((m) => 'method:' + m.id);
  C.modules = MODULE_ORDER.map((id) => modMap.get(id)).filter(Boolean);
  C.moduleMap = new Map(C.modules.map((m) => [m.id, m]));
  C.path = C.modules.flatMap((m) => m.items);
  C.tracks = TRACKS.map(([id, title, mids]) => ({ id, title, modules: mids, items: mids[0] === '__cases' ? C.cases.map((c) => 'case:' + c.id) : mids.flatMap((mid) => C.moduleMap.get(mid)?.items || []) }));
  C.keyModule = new Map(); C.modules.forEach((m) => m.items.forEach((k) => C.keyModule.set(k, m.id)));

  /* Question bank: dedicated questions + every lesson/law/method mini quiz */
  const bank = [...qs.QUESTIONS, ...qb1.QUESTIONS_B1];
  const addQuiz = (src, prefix, tags) => (src.quiz || []).forEach(([q, options, answer, explain], i) => bank.push({ id: `${prefix}-${src.id}-${i}`, type: 'mcq', q, options, answer, explain, tags, source: prefix }));
  lessons.forEach((l) => addQuiz(l, 'lq', l.tags || []));
  lw.LAWS.forEach((l) => addQuiz(l, 'wq', l.tags || [l.id]));
  rs.METHODS.forEach((m) => addQuiz(m, 'mq', m.tags || ['research']));
  C.questions = bank; C.questionMap = new Map(bank.map((q) => [q.id, q]));

  C.searchDocs = buildDocs();
  C.ready = true;
  return C;
}

const strip = (v) => (typeof v === 'string' ? v : v ? `${v.en || ''} ${v.bn || ''}` : '');
const titleOf = (l) => (l.titleBn ? `${l.title}` : l.title);

/** Resolve any key ("type:id") to a uniform record. */
export function byKey(key) {
  const [type, ...rest] = key.split(':'); const id = rest.join(':');
  switch (type) {
    case 'lesson': { const l = C.lessons.get(id); return l && { type, id, item: l, title: titleOf(l), route: `#/lesson/${id}`, minutes: l.minutes, sub: C.moduleMap.get(l.module)?.title }; }
    case 'law': { const l = C.lawMap.get(id); return l && { type, id, item: l, title: l.name, route: `#/law/${id}`, minutes: 12, sub: l.category }; }
    case 'method': { const m = C.methodMap.get(id); return m && { type, id, item: m, title: m.name, route: `#/method/${id}`, minutes: m.minutes, sub: 'Research method' }; }
    case 'figma': { const f = C.figmaMap.get(id); return f && { type, id, item: f, title: f.name, route: `#/figma/item/${id}`, minutes: 15, sub: f.category }; }
    case 'plugin': { const p = C.pluginMap.get(id); return p && { type, id, item: p, title: p.name, route: `#/plugin/${id}`, minutes: 3, sub: p.category }; }
    case 'case': { const c = C.caseMap.get(id); return c && { type, id, item: c, title: c.title, route: `#/case/${id}`, minutes: c.minutes, sub: c.category }; }
    case 'challenge': { const c = C.challengeMap.get(id); return c && { type, id, item: c, title: c.title, route: `#/challenge/${id}`, minutes: c.minutes, sub: c.difficulty }; }
    case 'term': { const g = C.termMap.get(id); return g && { type, id, item: g, title: g.term, route: `#/glossary/${id}`, minutes: 1, sub: 'Glossary' }; }
    case 'compare': { const x = C.compareMap.get(id); return x && { type, id, item: x, title: x.title, route: `#/compare/${id}`, minutes: 5, sub: 'Good vs Bad' }; }
    case 'critique': { const x = C.critiqueMap.get(id); return x && { type, id, item: x, title: x.title, route: `#/critique/${id}`, minutes: 6, sub: 'Critique' }; }
    case 'project': { const p = C.projectMap.get(id); return p && { type, id, item: p, title: p.title, route: `#/project/${id}`, minutes: 600, sub: 'Project' }; }
    case 'exam': { const e = C.examMap.get(id); return e && { type, id, item: e, title: e.title + ' exam', route: `#/exam/${id}`, minutes: e.minutes, sub: 'Exam' }; }
    case 'module': { const m = C.moduleMap.get(id); return m && { type, id, item: m, title: m.title, route: `#/learn/${id}`, minutes: 0, sub: m.level }; }
    default: return null;
  }
}

/** Human label + route for a topic tag (used by weak areas & exam reports). */
export function tagInfo(tag) {
  const law = C.lawMap?.get(tag);
  if (law) return { label: law.name, route: `#/law/${law.id}` };
  const t = TAG_LABELS[tag];
  if (t) return { label: t[0], route: t[1] };
  const label = tag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { label, route: `#/search?q=${encodeURIComponent(tag)}` };
}

function buildDocs() {
  const docs = [];
  const push = (key, title, sub, text, kw, boost = 0) => { const r = byKey(key); if (r) docs.push({ key, type: key.split(':')[0], title, sub, text, kw, route: r.route, boost }); };
  C.modules.forEach((m) => docs.push({ key: 'module:' + m.id, type: 'module', title: m.title, sub: m.level, text: strip(m.desc), kw: m.titleBn || '', route: `#/learn/${m.id}`, boost: 2 }));
  C.lessons.forEach((l) => push('lesson:' + l.id, l.title, C.moduleMap.get(l.module)?.title, `${strip(l.en)} ${strip(l.example)}`, `${l.titleBn || ''} ${(l.tags || []).join(' ')}`, 2));
  C.laws.forEach((l) => push('law:' + l.id, l.name, l.category, `${l.short} ${l.en}`, `${l.tags.join(' ')} ${l.id}`, 5));
  C.methods.forEach((m) => push('method:' + m.id, m.name, 'Research method', m.en, m.tags.join(' '), 3));
  C.cases.forEach((c) => push('case:' + c.id, c.title, c.category, `${c.summary} ${c.problem}`, `${c.tags.join(' ')} ${c.laws.join(' ')}`, 2));
  C.plugins.forEach((p) => push('plugin:' + p.id, p.name, p.category, p.does, p.kw, 1));
  C.glossary.forEach((g) => push('term:' + g.id, g.term, 'Glossary', g.en, `${g.bn} ${g.simple}`, 2));
  C.comparisons.forEach((x) => push('compare:' + x.id, `Good vs bad: ${x.title}`, x.category, `${x.whyGood} ${x.whyBad}`, `${x.laws.join(' ')} ${x.tags.join(' ')} ${x.principles.join(' ')}`, 1));
  C.critiques.forEach((x) => push('critique:' + x.id, `Critique: ${x.title}`, 'Critique lab', x.reasoning, x.laws.join(' '), 0));
  C.exams.forEach((e) => push('exam:' + e.id, `${e.title} exam`, 'Exam', e.desc, (e.tags || []).join(' '), 1));
  C.projects.forEach((p) => push('project:' + p.id, p.title, 'Guided project', p.goal, '', 1));
  C.challenges.forEach((c) => push('challenge:' + c.id, c.title, `Challenge · ${c.difficulty}`, c.problem, c.skills.join(' '), c.flagship ? 1 : 0));
  // Figma library: one doc per base family (variants are browsed inside), keeps results useful
  const seen = new Set();
  C.figmaItems.forEach((f) => { if (seen.has(f.baseId)) return; seen.add(f.baseId); push('figma:' + f.id, f.name.split(' — ')[0], `Figma · ${f.category}`, `${f.what} ${f.ux}`, `${f.category} figma tutorial`, 0); });
  return docs;
}
