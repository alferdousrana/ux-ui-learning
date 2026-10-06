import { store } from '../core/state.js';
import { t, L, T } from '../core/i18n.js';
import { esc, $, $$, uid, copyText, downloadFile } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { C } from '../../data/content.js';
import { isDone, visit, complete, XP_RULES } from '../core/progress.js';
import { pageHead, langSwitch, bookmarkBtn, completeBtn, notesPanel, bindNotes, miniQuiz, bindMiniQuiz, itemCard, diffBadge, toast, emptyState, confirmDialog, progressBar } from '../ui/components.js';
import { diagram } from '../ui/visuals.js';
import { notFound } from './learn.js';
import { navigate } from '../core/router.js';
import { moduleStats } from './shared.js';

export function renderResearch(root) {
  const f = C.moduleMap.get('research-fundamentals'), p = C.moduleMap.get('personas');
  root.innerHTML = `${pageHead({ title: 'UX Research Master Course', lead: 'Learn to replace assumptions with evidence: fundamentals, 14 methods with step-by-step guides, a toolkit of templates, and a persona builder.', actions: `<a class="btn btn-secondary" href="#/toolkit">${icon('wrench')} ${t('toolkit')}</a><a class="btn btn-secondary" href="#/persona">${icon('user')} ${t('persona')}</a>` })}
    <figure class="figure">${diagram('researchQuadrant')}<figcaption>Where common research methods sit: what people do vs say, qualitative vs quantitative.</figcaption></figure>
    <section class="section"><div class="section-head"><h2>Research fundamentals</h2><span class="small muted">${moduleStats(f).done}/${moduleStats(f).total}</span></div><div class="grid grid-3">${f.items.map((k) => itemCard(k)).join('')}</div></section>
    <section class="section"><div class="section-head"><h2>Research methods</h2></div><div class="grid grid-3">${C.methods.map((m) => `<a class="card card-link" href="#/method/${m.id}"><div class="card-top"><span class="badge badge-primary">${esc(m.kind.join(' · '))}</span>${isDone('method:' + m.id) ? `<span class="done-mark is-done">${icon('check')}</span>` : ''}</div><h3>${esc(m.name)}</h3><p>${esc(m.en)}</p><div class="card-meta">${diffBadge(m.difficulty)}</div></a>`).join('')}</div></section>
    <section class="section"><div class="section-head"><h2>Personas</h2></div><div class="grid grid-3">${p.items.map((k) => itemCard(k)).join('')}</div></section>`;
}

export function renderMethod(root, { params }) {
  const m = C.methodMap.get(params.id); if (!m) return notFound(root);
  const key = 'method:' + m.id, route = '#/method/' + m.id;
  visit(key, m.name, route);
  const lang = store.settings.contentLang;
  const list = (arr) => `<ul class="prose">${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const box = (title, body, cls = '') => `<div class="callout ${cls}"><h4>${title}</h4>${body}</div>`;
  root.innerHTML = `${pageHead({ crumbs: [['UX Research', '#/research'], [m.name]], title: m.name, sub: m.kind.join(' · ') })}
    <div class="row-between">${langSwitch()}<div class="lesson-actions">${bookmarkBtn(key, m.name, route)}${completeBtn(key, m.name, route, m.minutes)}</div></div>
    <article class="lesson-body mt-6">
      <section><h2>What it is</h2><p class="explain mt-2" lang="${lang}">${esc(lang === 'bn' ? m.bn : m.en)}</p><details class="acc mt-4"><summary>${lang === 'bn' ? 'English' : 'বাংলা'}</summary><div class="acc-body"><p>${esc(lang === 'bn' ? m.en : m.bn)}</p></div></details></section>
      <div class="qa-grid">${box('Why use it', `<p>${esc(m.why)}</p>`, 'info')}${box('When to use it', `<p>${esc(m.when)}</p>`, 'info')}</div>
      <section><h2>How to conduct it — step by step</h2><ol class="steps-list mt-4">${m.how.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></section>
      ${box('Example', `<p>${esc(m.example)}</p>`)}
      ${box('Sample questions / prompts', list(m.questions), 'primary')}
      <div class="qa-grid">${box('Advantages', list(m.pros), 'good')}${box('Disadvantages', list(m.cons), 'bad')}</div>
      ${box('Common mistakes', list(m.mistakes), 'bad')}
      <div class="qa-grid">${box('Expected output', `<p>${esc(m.output)}</p>`)}${box('Real project example', `<p>${esc(m.project)}</p>`)}</div>
      ${box('Practice exercise', `<p>${esc(m.practice)}</p><p class="small muted mt-2">Write it in your notes below.</p>`, 'key')}
      ${miniQuiz(m.quiz, 'mq-' + m.id, m.tags)}
      ${notesPanel(key)}
    </article>`;
  bindNotes(root); bindMiniQuiz(root);
}

/* ---------- Toolkit ---------- */
export function renderToolkit(root) {
  root.innerHTML = `${pageHead({ crumbs: [['UX Research', '#/research'], [t('toolkit')]], title: t('toolkit'), lead: 'Templates and checklists you can copy, download or tick off — all available offline.' })}
    <div class="stack">${C.toolkit.map((x) => `<details class="acc" id="${x.id}"><summary>${x.kind === 'template' ? '📄' : '☑️'} ${esc(x.name)}</summary><div class="acc-body">
      ${x.kind === 'template' ? `<pre class="template">${esc(x.body)}</pre><div class="row mt-4"><button class="btn btn-secondary btn-sm" data-copy="${x.id}">${icon('copy')} Copy</button><button class="btn btn-secondary btn-sm" data-dl="${x.id}">${icon('download')} Download .txt</button></div>`
        : `<ul class="checklist">${x.items.map((it, i) => `<li><label><input type="checkbox" data-ck="${x.id}-${i}" ${store.user.toolkit[`${x.id}-${i}`] ? 'checked' : ''}> ${esc(it)}</label></li>`).join('')}</ul><button class="btn btn-ghost btn-sm mt-2" data-reset="${x.id}">Reset checklist</button>`}
    </div></details>`).join('')}</div>`;
  root.addEventListener('click', async (e) => {
    const c = e.target.closest('[data-copy]'); if (c) { const x = C.toolkit.find((y) => y.id === c.dataset.copy); toast((await copyText(x.body)) ? 'Copied to clipboard' : 'Copy failed — select the text manually'); }
    const d = e.target.closest('[data-dl]'); if (d) { const x = C.toolkit.find((y) => y.id === d.dataset.dl); downloadFile(`${x.id}.txt`, x.body, 'text/plain'); }
    const r = e.target.closest('[data-reset]'); if (r) { store.update((u) => { Object.keys(u.toolkit).filter((k) => k.startsWith(r.dataset.reset + '-')).forEach((k) => delete u.toolkit[k]); }); $$(`[data-ck^="${r.dataset.reset}-"]`, root).forEach((i) => { i.checked = false; }); }
  });
  root.addEventListener('change', (e) => { const c = e.target.closest('[data-ck]'); if (c) store.update((u) => { u.toolkit[c.dataset.ck] = c.checked; }); });
}

/* ---------- Persona builder ---------- */
const FIELDS = [['name', 'Name', 'input', true], ['age', 'Age', 'input'], ['occupation', 'Occupation', 'input'], ['quote', 'Quote', 'input'], ['goals', 'Goals', 'textarea'], ['frustrations', 'Frustrations', 'textarea'], ['behaviors', 'Behaviors', 'textarea'], ['needs', 'Needs', 'textarea'], ['painPoints', 'Pain points', 'textarea'], ['motivations', 'Motivations', 'textarea'], ['tech', 'Technology usage', 'textarea'], ['source', 'Research source (what evidence supports this?)', 'textarea']];
export function renderPersona(root, { query }) {
  const editing = query.id ? store.user.personas.find((p) => p.id === query.id) : null;
  const v = editing || {};
  const card = (p) => `<article class="card persona-card"><div><div class="avatar-ph" aria-hidden="true">${esc((p.name || '?').trim().charAt(0).toUpperCase())}</div></div><div>
    <div class="row-between"><h3>${esc(p.name)}${p.age ? `, ${esc(p.age)}` : ''}</h3><div class="row"><a class="btn btn-ghost btn-sm" href="#/persona?id=${p.id}">Edit</a><button class="btn btn-ghost btn-sm" data-del="${p.id}" aria-label="Delete persona ${esc(p.name)}">${icon('trash')}</button></div></div>
    <p class="small muted">${esc(p.occupation || '')}</p>${p.quote ? `<p class="quote mt-4">“${esc(p.quote)}”</p>` : ''}
    <div class="qa-grid mt-4">${FIELDS.slice(4).filter(([k]) => p[k]).map(([k, label]) => `<div class="callout"><h4>${label}</h4><p style="white-space:pre-wrap">${esc(p[k])}</p></div>`).join('')}</div></div></article>`;
  root.innerHTML = `${pageHead({ crumbs: [['UX Research', '#/research'], [t('persona')]], title: t('persona'), lead: 'Turn your research into a persona the team can design for. Saved locally on this device and included in data export.' })}
    <div class="split"><form class="card stack" id="pf" novalidate aria-labelledby="pf-h"><h2 id="pf-h" style="font-size:var(--fs-lg)">${editing ? 'Edit persona' : 'New persona'}</h2>
      ${FIELDS.map(([k, label, kind, req]) => `<div class="field"><label for="pf-${k}">${label}${req ? ' *' : ''}</label>${kind === 'input' ? `<input class="input" id="pf-${k}" name="${k}" value="${esc(v[k] || '')}" ${req ? 'required aria-required="true"' : ''}>` : `<textarea class="textarea" id="pf-${k}" name="${k}" rows="2">${esc(v[k] || '')}</textarea>`}${req ? `<span class="field-error" id="err-${k}" hidden>Give your persona a name.</span>` : ''}</div>`).join('')}
      <div class="row"><button class="btn btn-primary" type="submit">${icon('check')} ${editing ? 'Update persona' : 'Save persona'}</button>${editing ? '<a class="btn btn-ghost" href="#/persona">Cancel</a>' : ''}</div></form>
      <aside class="card card-flat"><h2 style="font-size:var(--fs-md)">Good personas are…</h2><ul class="prose small mt-2"><li>Based on research, not stereotypes</li><li>Focused on goals and behaviors, not demographics</li><li>Few — 1 to 3 primary personas</li><li>Used in decisions ("Would Tania understand this?")</li></ul><a class="small" href="#/lesson/persona-types">Learn: types of personas</a></aside></div>
    <section class="section"><div class="section-head"><h2>Your personas (${store.user.personas.length})</h2></div><div class="stack" id="plist">${store.user.personas.length ? store.user.personas.map(card).join('') : emptyState({ ico: '🧑‍💼', title: 'No personas yet', text: 'Fill in the form above to create your first persona.' })}</div></section>`;
  $('#pf', root).addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    const nameEl = $('#pf-name', root);
    if (!fd.name.trim()) { nameEl.setAttribute('aria-invalid', 'true'); nameEl.setAttribute('aria-describedby', 'err-name'); $('#err-name', root).hidden = false; nameEl.focus(); return; }
    store.update((u) => {
      if (editing) Object.assign(u.personas.find((p) => p.id === editing.id), fd, { updated: Date.now() });
      else u.personas.unshift({ id: uid('p'), ...fd, created: Date.now() });
    });
    if (!editing) complete('persona:' + (store.user.personas[0].id), { title: 'Persona: ' + fd.name, xp: XP_RULES.persona });
    toast(editing ? 'Persona updated' : 'Persona saved', { ico: '🧑‍💼' });
    navigate('#/persona');
  });
  root.addEventListener('click', async (e) => {
    const d = e.target.closest('[data-del]'); if (!d) return;
    if (await confirmDialog('Delete persona?', 'This removes it from this device.', { confirm: 'Delete persona', danger: true })) {
      store.update((u) => { u.personas = u.personas.filter((p) => p.id !== d.dataset.del); });
      d.closest('.persona-card').remove(); toast('Persona deleted');
    }
  });
}
