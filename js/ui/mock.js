/* ==========================================================================
   Mock UI renderer: turns declarative specs into HTML wireframes/UI.
   Spec: { frame: 'phone'|'desktop'|'component', nodes: [[kind, props, children]] }
   Only `t`-style strings flagged as `html` (search suggestions) bypass escaping.
   ========================================================================== */
import { esc } from '../core/utils.js';

const R = {
  h: (p) => `<div class="mk-h ${p.size || ''}">${esc(p.t)}</div>`,
  p: (p) => `<div class="mk-p ${p.tiny ? 'tiny' : ''} ${p.lowc ? 'lowc' : ''}" ${p.small ? 'style="font-size:10px"' : ''}>${esc(p.t)}</div>`,
  label: (p) => `<div class="mk-label">${esc(p.t)}${p.req ? ' <span class="req">*</span>' : ''}</div>`,
  input: (p) => `<div class="mk-input ${p.val ? 'val' : ''} ${p.err ? 'err' : ''} ${p.ok ? 'ok' : ''}">${esc(p.val || p.ph || '')}</div>`,
  hint: (p) => `<div class="mk-hint ${p.err ? 'err' : ''}">${esc(p.t)}</div>`,
  btn: (p) => `<span class="mk-btn ${p.v || 'primary'} ${p.size || ''} ${p.full ? 'full' : ''}">${esc(p.t)}</span>`,
  row: (p, c) => `<div class="mk-row ${p.between ? 'between' : ''} ${p.end ? 'end' : ''}">${c}</div>`,
  col: (p, c) => `<div class="mk-col ${p.center ? 'mk-center' : ''}" style="flex:1;min-width:0">${c}</div>`,
  card: (p, c) => `<div class="mk-card ${p.flat ? 'flat' : ''}" style="flex:1;min-width:0">${c}</div>`,
  img: (p) => `<div class="mk-img" style="height:${p.h || 60}px">${esc(p.t || '')}</div>`,
  nav: (p) => `<div class="mk-nav">${(p.items || []).map((x, i) => (p.brand && i === 0 ? `<b>${esc(x)}</b>` : `<span class="${i === p.active ? 'on' : ''}">${esc(x)}</span>`)).join('')}</div>`,
  tabbar: (p) => `<div class="mk-tabbar ${p.nolabel ? 'nolabel' : ''}">${(p.items || []).map((x, i) => `<span class="${i === p.active ? 'on' : ''}">${esc(x)}</span>`).join('')}</div>`,
  alert: (p) => `<div class="mk-alert ${p.kind || 'info'}">${p.kind === 'error' ? '⚠ ' : p.kind === 'success' ? '✓ ' : p.kind === 'warn' ? '! ' : p.kind === 'raw' ? '' : 'ℹ '}${esc(p.t)}</div>`,
  list: (p) => `<div class="mk-list ${p.dense ? 'dense' : ''}">${(p.items || []).map((x) => `<div>${esc(x)}</div>`).join('')}</div>`,
  chips: (p) => `<div class="mk-chips">${(p.items || []).map((x, i) => `<span class="${i === p.active ? 'on' : ''}">${esc(x)}</span>`).join('')}</div>`,
  divider: () => '<div class="mk-divider"></div>',
  steps: (p) => `<div class="mk-steps">${(p.items || []).map((x, i) => `<span class="${i < p.cur ? 'done' : i === p.cur ? 'cur' : ''}">${esc(x)}</span>`).join('')}</div>`,
  search: (p) => `<div class="mk-search"><div class="mk-input ${p.val ? 'val' : ''}">${esc(p.val || p.ph || '')}</div></div>${p.sugg ? `<div class="mk-sugg">${p.sugg.map((s) => `<div>${sanitizeMark(s)}</div>`).join('')}</div>` : ''}`,
  check: (p) => `<div class="mk-check ${p.on ? 'on' : ''}"><i></i>${esc(p.t)}</div>`,
  kv: (p) => `<div class="mk-kv ${p.total ? 'total' : ''}"><span>${esc(p.k)}</span><span>${esc(p.v)}</span></div>`,
  icons: (p) => `<div class="mk-icons ${p.tiny ? 'tiny' : ''}">${'<i></i>'.repeat(p.n || 4)}</div>`,
  header: (p) => `<div class="mk-header"><span class="hb"></span>${esc(p.t)}</div>`,
  progress: (p) => `<div class="mk-progress"><span style="width:${p.v || 0}%"></span></div>`,
  badge: (p) => `<span class="mk-badge">${esc(p.t)}</span>`,
  dots: (p) => `<div class="mk-dots">${Array.from({ length: p.n || 3 }, (_, i) => `<i class="${i === p.on ? 'on' : ''}"></i>`).join('')}</div>`,
  mess: (p) => `<div class="mk-mess">${Array.from({ length: p.n || 20 }, (_, i) => `<i style="width:${18 + ((i * 37) % 50)}px"></i>`).join('')}</div>`,
  spinner: () => '<div class="mk-spinner" aria-hidden="true"></div>',
  skel: (p) => `<div class="mk-skel" style="width:${p.w || 80}%"></div>`,
  spacer: (p) => `<div style="height:${p.h || 12}px"></div>`,
  table: (p) => `<table class="mk-table"><thead><tr>${p.head.map((h, i) => `<th class="${i === p.head.length - 1 ? 'num' : ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${p.rows.map((r) => `<tr>${r.map((c, i) => `<td class="${i === r.length - 1 ? 'num' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
  toggle: (p) => `<span class="mk-toggle ${p.on ? 'on' : ''}"></span>`,
  avatar: () => '<span class="mk-avatar"></span>',
  modal: (p, c) => `<div class="mk-modal">${c}</div>`,
  scrim: (p, c) => `<div class="mk-scrim">${c}</div>`,
  tooltip: (p) => `<span class="mk-tooltip">${esc(p.t)}</span>`,
  crumbs: (p) => `<div class="mk-crumbs">${p.items.map((x, i) => (i === p.items.length - 1 ? `<b>${esc(x)}</b>` : esc(x))).join(' › ')}</div>`,
  pager: (p) => `<div class="mk-pager"><span>‹</span>${Array.from({ length: p.n || 5 }, (_, i) => `<span class="${i === p.on ? 'on' : ''}">${i + 1}</span>`).join('')}<span>›</span></div>`,
  bars: (p) => {
    const max = Math.max(...p.v); const w = 100 / p.v.length;
    if (p.line) {
      const pts = p.v.map((v, i) => `${i * w + w / 2},${60 - (v / max) * 52}`).join(' ');
      return `<svg viewBox="0 0 100 64" style="width:100%;height:80px"><polyline points="${pts}" fill="none" stroke="var(--mk-primary)" stroke-width="2"/><line x1="0" y1="62" x2="100" y2="62" stroke="var(--mk-line)"/></svg>`;
    }
    return `<svg viewBox="0 0 100 64" style="width:100%;height:80px">${p.v.map((v, i) => `<rect x="${i * w + w * 0.2}" y="${62 - (v / max) * 56}" width="${w * 0.6}" height="${(v / max) * 56}" rx="1.5" fill="var(--mk-primary)" opacity="${i === p.v.length - 1 ? 1 : 0.45}"/>`).join('')}<line x1="0" y1="62" x2="100" y2="62" stroke="var(--mk-line)"/></svg>`;
  },
  swatch: (p) => `<span style="width:44px;height:44px;border-radius:8px;border:1px solid var(--mk-line);background:var(--mk-${p.c})"></span>`,
};

// Allow only <mark> in suggestion strings.
function sanitizeMark(s) { return esc(s).replace(/&lt;mark&gt;/g, '<mark>').replace(/&lt;\/mark&gt;/g, '</mark>'); }

function renderNodes(nodes = []) {
  return nodes.map((n) => {
    const [kind, props = {}, children] = Array.isArray(n) ? n : [n];
    const fn = R[kind];
    if (!fn) return '';
    return fn(props, children ? renderNodes(children) : '');
  }).join('');
}

/** Render a full mock with frame and optional forced theme. */
export function renderMock(spec, { theme, label } = {}) {
  if (!spec) return '';
  const body = renderNodes(spec.nodes);
  const force = theme === 'Dark' ? ' mk-force-dark' : theme === 'Light' ? ' mk-force-light' : '';
  const aria = `role="img" aria-label="${esc(label || 'Interface example')}"`;
  if (spec.frame === 'phone') return `<div class="mk-phone${force}" ${aria}>${body}</div>`;
  if (spec.frame === 'desktop') return `<div class="mk-desktop${force}" ${aria}><div class="mk-chrome"><i></i><i></i><i></i></div><div class="mk-body">${body}</div></div>`;
  return `<div class="mk-component${force}" ${aria}>${body}</div>`;
}
