/* ==========================================================================
   Figma step visualizer. Draws a simplified Figma editor (toolbar, layers,
   canvas, properties panel) as SVG and highlights the exact area a step
   refers to, with the expected result on the canvas. Steps are matched to
   visuals by keywords, so every lesson and all 2,600+ library items get
   step-by-step pictures without hand-drawing each one.
   Colors are fixed to resemble Figma's own UI (independent of app theme).
   ========================================================================== */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const HL = '#F2A000', BLUE = '#0D99FF', DARK = '#2C2C2C', PANEL = '#FFFFFF', LINE = '#E6E6E6', CANVAS = '#F5F5F5', TXT = '#333', MUTED = '#8A8A8A', PURPLE = '#9747FF';
const r = (x, y, w, h, fill, rx = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const tx = (x, y, s, size = 8, fill = TXT, anchor = 'start', weight = 400) => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" font-family="Inter, Arial, sans-serif">${esc(s)}</text>`;

const TOOLS = [['V', 'move'], ['#', 'frame'], ['□', 'shape'], ['✒', 'pen'], ['T', 'text'], ['✋', 'hand'], ['💬', 'comment']];
const SECTIONS = ['Frame', 'Auto layout', 'Layout grid', 'Fill', 'Stroke', 'Effects', 'Export'];

/* Canvas scenes — drawn inside the canvas area (x 110–410, y 30–300) */
const SCENES = {
  empty: () => tx(260, 170, 'Empty canvas', 10, MUTED, 'middle'),
  frame: (o) => `${tx(170, 58, o.device || 'iPhone 14 — 390×844', 7, MUTED)}${r(170, 62, 180, 210, '#fff', 4, `stroke="${BLUE}" stroke-width="1.5"`)}`,
  rect: () => `${r(195, 110, 130, 80, '#D9D9D9', 10, `stroke="${BLUE}" stroke-width="1.5"`)}${[[195, 110], [325, 110], [195, 190], [325, 190]].map(([x, y]) => r(x - 3, y - 3, 6, 6, '#fff', 0, `stroke="${BLUE}"`)).join('')}${r(232, 198, 56, 11, BLUE, 3)}${tx(260, 206, '130 × 80', 7, '#fff', 'middle')}`,
  ellipse: () => `<circle cx="260" cy="150" r="45" fill="#D9D9D9" stroke="${BLUE}" stroke-width="1.5"/>`,
  text: () => `${r(185, 130, 150, 36, 'none', 0, `stroke="${BLUE}" stroke-width="1.5"`)}${tx(192, 154, 'Welcome back', 18, TXT, 'start', 700)}<line x1="320" y1="135" x2="320" y2="161" stroke="${BLUE}" stroke-width="1.5"/>`,
  image: () => `${r(190, 95, 140, 110, '#C7D7E8', 6, `stroke="${BLUE}" stroke-width="1.5"`)}<polygon points="200,195 245,140 275,175 295,155 320,195" fill="#7FA6CC"/><circle cx="300" cy="120" r="10" fill="#F5D07A"/>`,
  pen: () => `<path d="M190 200 C 220 100, 290 100, 330 190" fill="none" stroke="${TXT}" stroke-width="2"/>${[[190, 200], [330, 190]].map(([x, y]) => r(x - 3, y - 3, 6, 6, '#fff', 0, `stroke="${BLUE}"`)).join('')}<line x1="190" y1="200" x2="220" y2="110" stroke="${BLUE}" stroke-dasharray="3 2"/><circle cx="220" cy="110" r="3" fill="${BLUE}"/>`,
  select: () => `${r(180, 100, 70, 50, '#D9D9D9', 6)}${r(270, 120, 70, 50, '#D9D9D9', 6)}${r(175, 95, 170, 80, 'none', 0, `stroke="${BLUE}" stroke-dasharray="4 3"`)}`,
  align: () => `${[0, 1, 2].map((i) => r(180, 95 + i * 40, [120, 80, 100][i], 28, '#D9D9D9', 5)).join('')}<line x1="180" y1="85" x2="180" y2="215" stroke="#F24822" stroke-width="1"/>${tx(186, 228, 'aligned left · 12 px apart', 7, '#F24822')}`,
  autolayout: () => `${r(185, 115, 150, 44, BLUE, 8, 'opacity=".12"')}${r(185, 115, 150, 44, 'none', 8, `stroke="${PURPLE}" stroke-width="1.5"`)}${r(199, 127, 20, 20, '#fff', 4)}${tx(228, 141, 'Button label', 9, TXT, 'start', 600)}${r(185, 115, 14, 44, '#FF7CAE', 0, 'opacity=".35"')}${r(321, 115, 14, 44, '#FF7CAE', 0, 'opacity=".35"')}${tx(260, 178, 'padding 14 · gap 10 · hug', 7, PURPLE, 'middle')}`,
  component: () => `${tx(190, 104, '❖ Button', 8, PURPLE, 'start', 700)}${r(190, 108, 140, 40, '#6C5CE7', 8, `stroke="${PURPLE}" stroke-width="1.5"`)}${tx(260, 132, 'Save changes', 9, '#fff', 'middle', 600)}${tx(190, 178, '◇ instance', 7, PURPLE)}${r(190, 182, 100, 30, '#6C5CE7', 7, 'opacity=".7"')}`,
  variants: () => `${r(170, 75, 180, 160, 'none', 6, `stroke="${PURPLE}" stroke-dasharray="4 3"`)}${['Default', 'Hover', 'Pressed', 'Disabled'].map((s, i) => `${r(185, 88 + i * 36, 110, 26, i === 3 ? '#E0E0E0' : '#6C5CE7', 6, `opacity="${[1, 0.85, 0.7, 1][i]}"`)}${tx(240, 105 + i * 36, s, 8, i === 3 ? MUTED : '#fff', 'middle')}`).join('')}${tx(305, 105, 'State=', 7, PURPLE)}`,
  props: () => `${r(185, 110, 150, 40, '#6C5CE7', 8)}${tx(260, 134, '★ Label', 9, '#fff', 'middle', 600)}${tx(185, 175, '☑ Show icon (boolean)', 7, PURPLE)}${tx(185, 188, 'T Label (text)', 7, PURPLE)}${tx(185, 201, '⇄ Icon (instance swap)', 7, PURPLE)}`,
  constraints: () => `${r(160, 70, 200, 180, '#fff', 4, `stroke="${BLUE}"`)}${r(175, 85, 170, 26, '#D9D9D9', 4)}<line x1="160" y1="98" x2="175" y2="98" stroke="#F24822"/><line x1="345" y1="98" x2="360" y2="98" stroke="#F24822"/>${tx(260, 140, '↔ Left & Right', 8, '#F24822', 'middle')}`,
  grid: () => `${r(165, 70, 190, 180, '#fff', 2)}${[0, 1, 2, 3].map((i) => r(175 + i * 44, 70, 36, 180, '#FF5A5A', 0, 'opacity=".15"')).join('')}${tx(260, 265, '4 columns · 8 gutter', 7, '#E04040', 'middle')}`,
  prototype: () => `${r(150, 90, 90, 140, '#fff', 4, `stroke="${LINE}"`)}${r(160, 190, 70, 18, BLUE, 4)}${r(290, 90, 90, 140, '#fff', 4, `stroke="${LINE}"`)}<path d="M230 199 C 260 199, 260 120, 290 120" fill="none" stroke="${BLUE}" stroke-width="2"/><circle cx="290" cy="120" r="4" fill="${BLUE}"/>${tx(265, 82, 'On tap → Navigate', 7, BLUE, 'middle')}`,
  styles: () => `${['#0E6B5C', '#E8A317', '#16201C', '#F3F5F4'].map((c, i) => `${r(185 + i * 40, 110, 32, 32, c, 6, `stroke="${LINE}"`)}`).join('')}${tx(185, 165, 'brand/primary · brand/accent', 7, MUTED)}${tx(185, 190, 'Heading / H1 — 32 Bold', 9, TXT, 'start', 700)}`,
  variables: (o) => `${r(160, 85, 200, 130, '#fff', 6, `stroke="${LINE}"`)}${tx(170, 102, 'Local variables', 8, TXT, 'start', 700)}${tx(250, 120, o.dark ? 'Light' : 'Light ●', 7, MUTED)}${tx(305, 120, o.dark ? 'Dark ●' : 'Dark', 7, o.dark ? TXT : MUTED)}${['bg/surface', 'text/primary', 'action'].map((s, i) => `${tx(170, 140 + i * 20, s, 7)}${r(250, 132 + i * 20, 12, 12, ['#fff', '#16201C', '#0E6B5C'][i], 2, `stroke="${LINE}"`)}${r(305, 132 + i * 20, 12, 12, ['#141C19', '#E6EEEA', '#4CC2A6'][i], 2, `stroke="${LINE}"`)}`).join('')}`,
  devmode: () => `${r(185, 110, 150, 40, '#0E6B5C', 8)}<line x1="185" y1="165" x2="335" y2="165" stroke="#F24822"/>${tx(260, 178, '150 px', 7, '#F24822', 'middle')}${r(180, 195, 160, 40, '#1E1E1E', 4)}${tx(188, 210, 'padding: 12px 20px;', 7, '#9CDCFE')}${tx(188, 225, 'border-radius: 8px;', 7, '#9CDCFE')}`,
  comment: () => `${r(200, 120, 120, 60, '#D9D9D9', 6)}<circle cx="318" cy="118" r="11" fill="${BLUE}"/>${tx(318, 122, '1', 8, '#fff', 'middle', 700)}${r(330, 108, 70, 30, '#fff', 4, `stroke="${LINE}"`)}${tx(335, 126, '@dev check', 7)}`,
  group: () => `${r(185, 105, 60, 40, '#D9D9D9', 4)}${r(265, 130, 60, 40, '#D9D9D9', 4)}${r(180, 100, 150, 75, 'none', 0, `stroke="${BLUE}"`)}${tx(180, 95, 'Frame (Ctrl+Alt+G)', 7, BLUE)}`,
  boolean: () => `<circle cx="240" cy="150" r="35" fill="#D9D9D9"/><circle cx="280" cy="150" r="35" fill="#B8B8B8" opacity=".9"/>${tx(260, 205, 'Union · Subtract · Intersect', 7, MUTED, 'middle')}`,
  publish: () => `${r(180, 95, 160, 120, '#fff', 6, `stroke="${LINE}"`)}${tx(190, 115, 'Publish library', 9, TXT, 'start', 700)}${['Colors (12)', 'Text styles (8)', 'Components (24)'].map((s, i) => tx(195, 138 + i * 16, '✓ ' + s, 7)).join('')}${r(270, 190, 60, 16, BLUE, 4)}${tx(300, 201, 'Publish', 7, '#fff', 'middle')}`,
  shadow: () => `${r(205, 118, 110, 70, '#000', 10, 'opacity=".08" transform="translate(4,8)"')}${r(205, 115, 110, 70, '#fff', 10, `stroke="${LINE}"`)}${tx(260, 220, 'Drop shadow · Y 8 · Blur 24', 7, MUTED, 'middle')}`,
  pages: () => `${tx(260, 160, 'Pages organise stages of work', 9, MUTED, 'middle')}`,
  button: () => `${r(170, 70, 180, 200, '#fff', 6, `stroke="${LINE}"`)}${r(185, 90, 150, 22, '#F0F0F0', 4)}${r(185, 120, 150, 22, '#F0F0F0', 4)}${r(185, 225, 150, 30, '#0E6B5C', 7, `stroke="${BLUE}" stroke-width="1.5"`)}${tx(260, 244, 'Continue', 9, '#fff', 'middle', 600)}${tx(260, 218, 'Fill width · 44 px', 7, BLUE, 'middle')}`,
  form: () => `${r(170, 65, 180, 210, '#fff', 6, `stroke="${LINE}"`)}${['Email', 'Password'].map((l, i) => `${tx(185, 88 + i * 46, l, 7, TXT, 'start', 600)}${r(185, 92 + i * 46, 150, 24, '#F7F7F7', 4, `stroke="${i === 0 ? BLUE : '#D0D0D0'}"`)}`).join('')}${r(185, 190, 150, 26, '#0E6B5C', 6)}${tx(260, 207, 'Sign in', 8, '#fff', 'middle', 600)}${r(185, 224, 150, 24, '#fff', 6, 'stroke="#C8C8C8"')}${tx(260, 240, 'Use OTP instead', 8, TXT, 'middle')}`,
  cards: () => `${[0, 1, 2].map((i) => `${r(175, 75 + i * 62, 170, 52, '#fff', 8, `stroke="${i === 0 ? BLUE : LINE}"`)}${r(183, 83 + i * 62, 36, 36, '#D9E6F2', 6)}${r(227, 88 + i * 62, 90, 8, '#C8C8C8', 3)}${r(227, 103 + i * 62, 60, 7, '#E0E0E0', 3)}`).join('')}`,
};

/** Keyword → visual spec. Order matters (most specific first). */
const RULES = [
  [/zoom|space \+ drag|\bpan\b|shift\+1|hand tool/i, { hl: 'tool:hand', scene: 'frame' }],
  [/corner points|anchor|edit points|enter to finish|click-drag to create curves/i, { hl: 'tool:pen', scene: 'pen' }],
  [/branch|version history|name versions|compare changes|review changes/i, { hl: 'top:share', scene: 'comment' }],
  [/conditional|set variable|expression|cartcount|\+ 1/i, { hl: 'panel:prototype', scene: 'prototype' }],
  [/clip content/i, { hl: 'panel:design:Frame', scene: 'frame' }],
  [/name it|slashes|naming|reorder|private base|prefix/i, { hl: 'panel:layers', scene: 'component' }],
  [/create a (new )?(design )?file|figma\.com|new file|cover frame/i, { hl: 'canvas', scene: 'empty' }],
  [/input|field|form|sign-in|sign in|login|password|otp|checkbox|radio/i, { hl: 'canvas', scene: 'form' }],
  [/\bbutton|\bcta\b|full-width/i, { hl: 'canvas', scene: 'button' }],
  [/\bcard|list row|\brows?\b|table|feed|\bgrid of/i, { hl: 'canvas', scene: 'cards' }],
  [/dev mode|ready for dev|inspect|code snippet|handoff|annotat/i, { hl: 'top:dev', scene: 'devmode' }],
  [/comment|@mention|mention/i, { hl: 'tool:comment', scene: 'comment' }],
  [/variable|mode\b|modes|collection|alias|token/i, { hl: 'panel:design:Fill', scene: 'variables' }],
  [/publish|library|libraries|accept updates/i, { hl: 'panel:assets', scene: 'publish' }],
  [/variant|state=|style=/i, { hl: 'panel:design:Frame', scene: 'variants' }],
  [/boolean property|instance swap|text property|property/i, { hl: 'panel:design:Frame', scene: 'props' }],
  [/component|ctrl\/cmd \+ alt \+ k|instance|override/i, { hl: 'top:component', scene: 'component' }],
  [/prototype|on tap|navigate|smart animate|interaction|trigger|present|hover|while hovering|flow starting/i, { hl: 'panel:prototype', scene: 'prototype' }],
  [/shift\+a|shift \+ a|auto layout|gap|padding|hug|fill container|space between|wrap|direction|vertical|horizontal|stack/i, { hl: 'panel:design:Auto layout', scene: 'autolayout' }],
  [/constraint|left & right|resize the frame/i, { hl: 'panel:design:Frame', scene: 'constraints' }],
  [/layout grid|columns|grid style|gutter|baseline/i, { hl: 'panel:design:Layout grid', scene: 'grid' }],
  [/shadow|effect|elevation/i, { hl: 'panel:design:Effects', scene: 'shadow' }],
  [/style|text styles?|color style/i, { hl: 'panel:design:Fill', scene: 'styles' }],
  [/boolean|union|subtract/i, { hl: 'top:boolean', scene: 'boolean' }],
  [/ctrl\/cmd\+g|ctrl\/cmd \+ g|group/i, { hl: 'panel:layers', scene: 'group' }],
  [/layer|rename|lock|collapse/i, { hl: 'panel:layers', scene: 'select' }],
  [/page/i, { hl: 'panel:layers', scene: 'pages' }],
  [/press p\b|\bpen\b|vector|curve|bézier|bezier/i, { hl: 'tool:pen', scene: 'pen' }],
  [/press t\b|type the label|\btext\b|\blabel\b|heading|font|line height/i, { hl: 'tool:text', scene: 'text' }],
  [/press o\b|ellipse|circle/i, { hl: 'tool:shape', scene: 'ellipse' }],
  [/image|photo|picture/i, { hl: 'tool:shape', scene: 'image' }],
  [/press f\b|frame|preset|iphone|desktop|390|1440|834|artboard/i, { hl: 'tool:frame', scene: 'frame' }],
  [/align|distribute|tidy|measure/i, { hl: 'panel:design:Frame', scene: 'align' }],
  [/select|shift\+click|shift-click|deep select/i, { hl: 'tool:move', scene: 'select' }],
  [/radius|fill|stroke|border|colou?r|contrast/i, { hl: 'panel:design:Fill', scene: 'rect' }],
  [/press r\b|rectangle|shape|square|draw/i, { hl: 'tool:shape', scene: 'rect' }],
  [/x\/y|w\/h|position|size|width|height/i, { hl: 'panel:design:Frame', scene: 'rect' }],
];

export function stepSpec(text, ctx = {}) {
  const m = matchRule(text);
  return m || { hl: ctx.fallbackHl || 'canvas', scene: ctx.fallback || 'rect' };
}
function matchRule(text) {
  for (const [re, spec] of RULES) if (re.test(text)) {
    const o = { ...spec };
    if (o.scene === 'frame') { const m = text.match(/(\d{3,4})\s*[×x]\s*(\d{3,4})|(\d{3,4})-wide/); if (m) o.device = m[1] ? `Frame — ${m[1]}×${m[2]}` : `Desktop — ${m[3]} wide`; }
    if (o.scene === 'variables') o.dark = /dark/i.test(text);
    return o;
  }
  return null;
}

/** Draw the editor with a highlighted area, step number and caption. */
export function figmaEditor(spec, step = 1, caption = '') {
  const [kind, a, b] = spec.hl.split(':');
  let hl = '';
  // Toolbar
  let bar = r(0, 0, 520, 30, DARK) + TOOLS.map(([g, name], i) => {
    const x = 10 + i * 26; const on = kind === 'tool' && a === name;
    if (on) hl = `<rect x="${x - 3}" y="2" width="26" height="26" rx="5" fill="none" stroke="${HL}" stroke-width="2.5"/>`;
    return `${r(x, 5, 20, 20, on ? BLUE : DARK, 4)}${tx(x + 10, 19, g, 10, '#fff', 'middle')}`;
  }).join('');
  bar += `${r(210, 8, 22, 14, '#444', 3)}${tx(221, 18, '❖', 9, '#fff', 'middle')}${r(236, 8, 22, 14, '#444', 3)}${tx(247, 18, '◑', 9, '#fff', 'middle')}`;
  if (kind === 'top' && a === 'component') hl = `<rect x="207" y="5" width="28" height="20" rx="4" fill="none" stroke="${HL}" stroke-width="2.5"/>`;
  if (kind === 'top' && a === 'boolean') hl = `<rect x="233" y="5" width="28" height="20" rx="4" fill="none" stroke="${HL}" stroke-width="2.5"/>`;
  if (kind === 'top' && a === 'share') hl = `<rect x="433" y="5" width="46" height="20" rx="5" fill="none" stroke="${HL}" stroke-width="2.5"/>`;
  bar += `${r(400, 8, 28, 14, kind === 'top' && a === 'dev' ? '#0FA958' : '#444', 7)}${tx(414, 18, '</>', 7, '#fff', 'middle')}${r(436, 8, 40, 14, BLUE, 4)}${tx(456, 18, 'Share', 7, '#fff', 'middle')}${tx(492, 19, '▶', 10, '#fff', 'middle')}`;
  if (kind === 'top' && a === 'dev') hl = `<rect x="397" y="5" width="34" height="20" rx="6" fill="none" stroke="${HL}" stroke-width="2.5"/>`;
  // Left panel
  const left = `${r(0, 30, 110, 270, PANEL)}<line x1="110" y1="30" x2="110" y2="300" stroke="${LINE}"/>${tx(10, 46, 'Layers', 8, kind === 'panel' && a === 'assets' ? MUTED : TXT, 'start', 700)}${tx(50, 46, 'Assets', 8, kind === 'panel' && a === 'assets' ? TXT : MUTED, 'start', 700)}${tx(10, 66, 'Pages', 7, MUTED)}${tx(14, 80, '◦ UI', 7)}${tx(14, 92, '◦ Components', 7)}<line x1="0" y1="100" x2="110" y2="100" stroke="${LINE}"/>${['# Login', '  ▭ Button', '  T Title', '  ▭ Input'].map((s, i) => tx(10, 116 + i * 14, s, 7, i === 1 ? BLUE : TXT)).join('')}`;
  if (kind === 'panel' && (a === 'layers' || a === 'assets')) hl = `<rect x="3" y="33" width="104" height="${a === 'assets' ? 20 : 150}" rx="5" fill="none" stroke="${HL}" stroke-width="2.5"/>`;
  // Right panel
  const proto = kind === 'panel' && a === 'prototype';
  let right = `${r(410, 30, 110, 270, PANEL)}<line x1="410" y1="30" x2="410" y2="300" stroke="${LINE}"/>${tx(418, 46, 'Design', 8, proto ? MUTED : TXT, 'start', 700)}${tx(460, 46, 'Prototype', 8, proto ? TXT : MUTED, 'start', 700)}`;
  if (proto) {
    right += `${tx(418, 70, 'Interaction', 7, MUTED)}${r(418, 76, 94, 16, '#F0F0F0', 3)}${tx(422, 87, 'On tap', 7)}${r(418, 96, 94, 16, '#F0F0F0', 3)}${tx(422, 107, 'Navigate to: Home', 7)}${r(418, 116, 94, 16, '#F0F0F0', 3)}${tx(422, 127, 'Smart animate', 7)}`;
    hl = `<rect x="413" y="62" width="104" height="76" rx="5" fill="none" stroke="${HL}" stroke-width="2.5"/>`;
  } else {
    SECTIONS.forEach((s, i) => {
      const y = 62 + i * 32;
      right += `${tx(418, y, s, 7, TXT, 'start', 600)}${r(418, y + 5, 94, 14, '#F0F0F0', 3)}${s === 'Fill' ? r(421, y + 8, 8, 8, '#D9D9D9', 1) : ''}${tx(s === 'Fill' ? 433 : 422, y + 15, { Frame: 'X 120  Y 64  W 130', 'Auto layout': '↓  gap 10  pad 14', 'Layout grid': 'Columns 4', Fill: 'D9D9D9  100%', Stroke: '+', Effects: 'Drop shadow', Export: '+ PNG 2x' }[s], 6.5, MUTED)}`;
      if (kind === 'panel' && a === 'design' && b === s) hl = `<rect x="413" y="${y - 10}" width="104" height="32" rx="5" fill="none" stroke="${HL}" stroke-width="2.5"/>`;
    });
  }
  // Canvas
  const canvas = `${r(110, 30, 300, 270, CANVAS)}${(SCENES[spec.scene] || SCENES.rect)(spec)}`;
  if (kind === 'canvas') hl = `<rect x="150" y="70" width="220" height="190" rx="8" fill="none" stroke="${HL}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  // Step badge
  const badge = `<circle cx="${kind === 'tool' || kind === 'top' ? 260 : kind === 'panel' && a !== 'layers' && a !== 'assets' ? 400 : 120}" cy="${kind === 'tool' || kind === 'top' ? 50 : 50}" r="11" fill="${HL}"/>${tx(kind === 'tool' || kind === 'top' ? 260 : kind === 'panel' && a !== 'layers' && a !== 'assets' ? 400 : 120, 54, String(step), 11, '#fff', 'middle', 700)}`;
  return `<svg viewBox="0 0 520 300" role="img" aria-label="Figma step ${step}: ${esc(caption)}" class="fg-shot">${canvas}${left}${right}${bar}${hl}${badge}</svg>`;
}

/** Steps → list of {text, svg}. */
export function figmaStepVisuals(steps, ctx = {}) {
  // Unmatched steps inherit the most recent matched scene, so a lesson stays visually coherent.
  let last = { hl: 'canvas', scene: ctx.fallback || 'rect' };
  return steps.map((s, i) => {
    const m = matchRule(s);
    const spec = m || { hl: 'canvas', scene: last.scene, device: last.device, dark: last.dark };
    if (m) last = m;
    return { text: s, svg: figmaEditor(spec, i + 1, s) };
  });
}
