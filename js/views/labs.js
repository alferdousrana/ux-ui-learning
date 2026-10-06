/* User Flow Lab — draggable nodes, connectors, save/load, keyboard support. */
import { store } from '../core/state.js';
import { t } from '../core/i18n.js';
import { esc, $, $$, uid, downloadFile } from '../core/utils.js';
import { icon } from '../core/icons.js';
import { complete, XP_RULES } from '../core/progress.js';
import { pageHead, modal, toast, confirmDialog } from '../ui/components.js';

const TYPES = { start: 'Start', screen: 'Screen', decision: 'Decision', error: 'Error', end: 'End' };
const TEMPLATE = () => ({ id: uid('f'), name: 'Password reset flow', nodes: [
  { id: 'a', type: 'start', label: 'Forgot password', x: 30, y: 40 }, { id: 'b', type: 'screen', label: 'Enter email', x: 210, y: 40 },
  { id: 'c', type: 'decision', label: 'Email registered?', x: 400, y: 40 }, { id: 'd', type: 'screen', label: 'Check inbox', x: 400, y: 200 },
  { id: 'e', type: 'error', label: '"No account — sign up?"', x: 600, y: 40 }, { id: 'f', type: 'end', label: 'Password changed', x: 400, y: 340 }],
  edges: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['c', 'e'], ['d', 'f']] });

export function renderFlowLab(root, { query }) {
  let flow = query.id ? structuredClone(store.user.flows.find((f) => f.id === query.id) || TEMPLATE()) : TEMPLATE();
  let selected = null, linkFrom = null;
  root.innerHTML = `${pageHead({ title: t('flowLab'), lead: 'Drag nodes to arrange. Select a node then "Connect" and click another node to draw an arrow. Double-click (or press Enter) to rename. Arrow keys move the selected node.' })}
    <div class="toolbar" role="toolbar" aria-label="Flow tools">
      ${Object.entries(TYPES).map(([k, v]) => `<button class="btn btn-secondary btn-sm" data-add="${k}">${icon('plus')} ${v}</button>`).join('')}
      <button class="btn btn-secondary btn-sm" data-act="link" aria-pressed="false">${icon('flow')} Connect</button>
      <button class="btn btn-secondary btn-sm" data-act="del">${icon('trash')} Delete</button>
      <span style="flex:1"></span>
      <label class="sr-only" for="fl-name">Flow name</label><input id="fl-name" class="input" style="max-width:220px" value="${esc(flow.name)}">
      <button class="btn btn-primary btn-sm" data-act="save">${icon('check')} Save flow</button>
      <button class="btn btn-ghost btn-sm" data-act="export">${icon('download')} JSON</button>
      <button class="btn btn-ghost btn-sm" data-act="new">New</button>
    </div>
    <div class="flow-canvas" aria-label="Flow canvas (scrolls on small screens)"><div class="flow-stage" id="canvas"><svg class="edges" aria-hidden="true"><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="var(--ink-2)"/></marker></defs><g id="edges"></g></svg></div></div>
    <p class="small muted mt-2" id="fl-status" aria-live="polite"></p>
    <section class="section"><h2 style="font-size:var(--fs-lg)">Saved flows</h2><div class="stack-sm mt-2" id="fl-saved"></div></section>
    <section class="section card card-flat"><h2 style="font-size:var(--fs-md)">Checklist for a good flow</h2><ul class="prose small mt-2"><li>One clear entry point and goal</li><li>Every decision has all branches</li><li>Every error leads somewhere (no dead ends)</li><li>Happy path is as short as possible</li></ul></section>`;
  const canvas = $('#canvas', root);
  const status = (m) => { $('#fl-status', root).textContent = m; };

  const drawNodes = () => {
    $$('.flow-node', canvas).forEach((n) => n.remove());
    flow.nodes.forEach((n) => {
      const el = document.createElement('div');
      el.className = `flow-node ${n.type} ${selected === n.id ? 'selected' : ''} ${linkFrom === n.id ? 'linking' : ''}`;
      el.style.left = n.x + 'px'; el.style.top = n.y + 'px';
      el.tabIndex = 0; el.dataset.id = n.id; el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `${TYPES[n.type]}: ${n.label}${selected === n.id ? ', selected' : ''}`);
      el.textContent = n.label;
      canvas.appendChild(el);
    });
    drawEdges();
  };
  const center = (id) => { const el = $(`.flow-node[data-id="${id}"]`, canvas); return el ? { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2, w: el.offsetWidth / 2, h: el.offsetHeight / 2 } : null; };
  const drawEdges = () => {
    $('#edges', root).innerHTML = flow.edges.map(([a, b]) => {
      const p = center(a), q = center(b); if (!p || !q) return '';
      const dx = q.x - p.x, dy = q.y - p.y; const k = Math.min(q.w / Math.abs(dx || 1e-6), q.h / Math.abs(dy || 1e-6));
      return `<line x1="${p.x}" y1="${p.y}" x2="${q.x - dx * k}" y2="${q.y - dy * k}" stroke="var(--ink-2)" stroke-width="2" marker-end="url(#arr)"/>`;
    }).join('');
  };
  const select = (id) => { selected = id; drawNodes(); $(`.flow-node[data-id="${id}"]`, canvas)?.focus(); };
  const rename = (id) => {
    const n = flow.nodes.find((x) => x.id === id); if (!n) return;
    modal({ title: 'Rename node', body: `<div class="field"><label for="rn">Label</label><input id="rn" class="input" value="${esc(n.label)}"></div>`, actions: [{ label: 'Cancel' }, { label: 'Save', cls: 'btn-primary', onClick: (box) => { n.label = $('#rn', box).value.trim() || n.label; drawNodes(); } }] });
  };

  /* Pointer dragging (mouse + touch) */
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.flow-node'); if (!el) { selected = null; drawNodes(); return; }
    const id = el.dataset.id;
    if (linkFrom && linkFrom !== id) {
      if (!flow.edges.some(([a, b]) => a === linkFrom && b === id)) flow.edges.push([linkFrom, id]);
      status(`Connected. Select another node to keep linking or press Connect again to stop.`);
      linkFrom = null; $('[data-act="link"]', root).setAttribute('aria-pressed', 'false'); select(id); return;
    }
    const n = flow.nodes.find((x) => x.id === id);
    drag = { n, ox: e.clientX - n.x, oy: e.clientY - n.y, el };
    el.setPointerCapture(e.pointerId); selected = id;
    $$('.flow-node', canvas).forEach((x) => x.classList.toggle('selected', x === el));
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const max = canvas.clientWidth - drag.el.offsetWidth, maxY = canvas.clientHeight - drag.el.offsetHeight;
    drag.n.x = Math.max(0, Math.min(max, e.clientX - drag.ox)); drag.n.y = Math.max(0, Math.min(maxY, e.clientY - drag.oy));
    drag.el.style.left = drag.n.x + 'px'; drag.el.style.top = drag.n.y + 'px'; drawEdges();
  });
  canvas.addEventListener('pointerup', () => { drag = null; });
  canvas.addEventListener('dblclick', (e) => { const el = e.target.closest('.flow-node'); if (el) rename(el.dataset.id); });
  canvas.addEventListener('keydown', (e) => {
    const el = e.target.closest('.flow-node'); if (!el) return;
    const n = flow.nodes.find((x) => x.id === el.dataset.id);
    const step = e.shiftKey ? 40 : 10;
    const mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (mv) { e.preventDefault(); n.x = Math.max(0, n.x + mv[0]); n.y = Math.max(0, n.y + mv[1]); el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; drawEdges(); selected = n.id; }
    if (e.key === 'Enter') rename(n.id);
    if (e.key === ' ') { e.preventDefault(); select(n.id); }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeNode(n.id); }
  });
  const removeNode = (id) => { flow.nodes = flow.nodes.filter((n) => n.id !== id); flow.edges = flow.edges.filter(([a, b]) => a !== id && b !== id); selected = null; drawNodes(); status('Node deleted'); };

  root.addEventListener('click', async (e) => {
    const add = e.target.closest('[data-add]');
    if (add) { const type = add.dataset.add; const n = { id: uid('n'), type, label: TYPES[type], x: 20 + (flow.nodes.length * 37) % 300, y: 20 + (flow.nodes.length * 53) % 260 }; flow.nodes.push(n); select(n.id); status(`${TYPES[type]} node added. Drag to position; double-click to rename.`); return; }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'link') { if (!selected) { status('Select a node first, then press Connect.'); return; } linkFrom = linkFrom ? null : selected; e.target.closest('button').setAttribute('aria-pressed', !!linkFrom); drawNodes(); status(linkFrom ? 'Now click the node to connect to.' : 'Connect cancelled.'); }
    if (act === 'del') { if (selected) removeNode(selected); else status('Select a node to delete.'); }
    if (act === 'save') {
      flow.name = $('#fl-name', root).value.trim() || 'Untitled flow';
      const first = !store.user.flows.length;
      store.update((u) => { const i = u.flows.findIndex((f) => f.id === flow.id); const copy = structuredClone({ ...flow, updated: Date.now() }); if (i >= 0) u.flows[i] = copy; else u.flows.unshift(copy); });
      if (first) complete('flow:first', { title: 'First user flow', xp: XP_RULES.flow });
      toast(`Saved “${esc(flow.name)}”`, { ico: '🔀' }); drawSaved();
    }
    if (act === 'export') downloadFile(`${flow.name.replace(/\W+/g, '-')}.json`, JSON.stringify(flow, null, 2));
    if (act === 'new') { flow = { id: uid('f'), name: 'Untitled flow', nodes: [{ id: uid('n'), type: 'start', label: 'Start', x: 30, y: 40 }], edges: [] }; $('#fl-name', root).value = flow.name; selected = null; drawNodes(); }
    const load = e.target.closest('[data-load]'); if (load) { flow = structuredClone(store.user.flows.find((f) => f.id === load.dataset.load)); $('#fl-name', root).value = flow.name; drawNodes(); status(`Loaded “${flow.name}”`); }
    const del = e.target.closest('[data-delflow]');
    if (del && await confirmDialog('Delete flow?', 'This removes the saved flow from this device.', { confirm: 'Delete flow', danger: true })) { store.update((u) => { u.flows = u.flows.filter((f) => f.id !== del.dataset.delflow); }); drawSaved(); }
  });
  const drawSaved = () => { $('#fl-saved', root).innerHTML = store.user.flows.length ? store.user.flows.map((f) => `<div class="card row-between" style="padding:var(--sp-3) var(--sp-4)"><span><strong>${esc(f.name)}</strong> <span class="tiny muted">${f.nodes.length} nodes · ${f.edges.length} links</span></span><span class="row"><button class="btn btn-secondary btn-sm" data-load="${f.id}">Open</button><button class="btn btn-ghost btn-sm" data-delflow="${f.id}" aria-label="Delete ${esc(f.name)}">${icon('trash')}</button></span></div>`).join('') : '<p class="small muted">No saved flows yet. The example above is a starting point — edit it and press Save.</p>'; };
  drawNodes(); drawSaved();
  new ResizeObserver(drawEdges).observe(canvas);
}
