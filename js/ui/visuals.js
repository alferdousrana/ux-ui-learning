/* ==========================================================================
   SVG instructional diagrams, generated in code so they work offline and
   follow the current theme via CSS classes (sv-*).
   ========================================================================== */
const t = (x, y, s, cls = 'sv-t', anchor = 'middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}</svg>`;

const D = {
  fitts: () => svg(600, 240, `
    <circle cx="70" cy="120" r="10" class="sv-ink"/>${t(70, 150, 'Cursor / thumb')}
    <line x1="85" y1="120" x2="250" y2="70" class="sv-lp" stroke-width="2" stroke-dasharray="5 5"/>
    <rect x="250" y="45" width="140" height="50" rx="10" class="sv-g"/>${t(320, 76, 'Large + near', 'sv-tw')}
    <line x1="85" y1="125" x2="540" y2="190" class="sv-lb" stroke-width="2" stroke-dasharray="5 5"/>
    <rect x="540" y="182" width="36" height="16" rx="4" class="sv-b"/>${t(520, 220, 'Small + far = slow, error-prone')}
    ${t(320, 120, 'Fast to hit')}${t(300, 30, 'MT = a + b · log₂(2D / W)', 'sv-tb')}`, "Fitts's Law: larger, closer targets are faster to reach"),
  hick: () => {
    const bars = [1, 2, 4, 8, 16, 32].map((n, i) => { const h = 20 + Math.log2(n + 1) * 28; return `<rect x="${60 + i * 85}" y="${200 - h}" width="50" height="${h}" rx="6" class="${i < 2 ? 'sv-g' : i > 3 ? 'sv-b' : 'sv-a'}"/>${t(85 + i * 85, 222, n + ' options')}`; }).join('');
    return svg(600, 240, `${bars}${t(300, 28, 'Decision time grows with the number of choices', 'sv-tb')}<line x1="40" y1="200" x2="580" y2="200" class="sv-l"/>`, "Hick's Law chart");
  },
  miller: () => svg(600, 200, `${t(300, 30, 'Chunking makes information easier to hold', 'sv-tb')}
    <rect x="40" y="60" width="520" height="40" rx="8" class="sv-bs"/>${t(300, 86, '0 1 7 1 2 3 4 5 6 7 8')}
    <rect x="40" y="120" width="140" height="40" rx="8" class="sv-gs"/>${t(110, 146, '01712')}
    <rect x="200" y="120" width="140" height="40" rx="8" class="sv-gs"/>${t(270, 146, '345')}
    <rect x="360" y="120" width="140" height="40" rx="8" class="sv-gs"/>${t(430, 146, '678')}`, "Miller's Law chunking example"),
  jakob: () => svg(600, 200, `${t(300, 28, 'Users expect your product to work like others they know', 'sv-tb')}
    ${[0, 1, 2].map((i) => `<rect x="${40 + i * 190}" y="50" width="160" height="120" rx="10" class="sv-s2"/><rect x="${52 + i * 190}" y="62" width="30" height="12" rx="3" class="sv-p"/><rect x="${160 + i * 190}" y="62" width="28" height="12" rx="3" class="sv-a"/><rect x="${52 + i * 190}" y="90" width="136" height="8" rx="3" class="sv-s3"/><rect x="${52 + i * 190}" y="106" width="100" height="8" rx="3" class="sv-s3"/>`).join('')}
    ${t(120, 190, 'Site A')}${t(310, 190, 'Site B')}${t(500, 190, 'Your site')}`, "Jakob's Law: consistent layouts across sites"),
  doherty: () => svg(600, 180, `${t(300, 28, 'Response time and user attention', 'sv-tb')}
    <rect x="40" y="60" width="110" height="40" rx="6" class="sv-g"/>${t(95, 86, '< 100 ms', 'sv-tw')}${t(95, 120, 'Feels instant')}
    <rect x="160" y="60" width="140" height="40" rx="6" class="sv-p"/>${t(230, 86, '< 400 ms', 'sv-tw')}${t(230, 120, 'Flow is kept')}
    <rect x="310" y="60" width="120" height="40" rx="6" class="sv-a"/>${t(370, 86, '1 s')}${t(370, 120, 'Notice delay')}
    <rect x="440" y="60" width="120" height="40" rx="6" class="sv-b"/>${t(500, 86, '10 s +', 'sv-tw')}${t(500, 120, 'Attention lost')}
    ${t(300, 160, 'Use skeletons, progress and optimistic UI when you can\'t be fast')}`, 'Doherty Threshold timeline'),
  peakEnd: () => svg(600, 220, `${t(300, 26, 'Memory is shaped by the peak and the end', 'sv-tb')}<line x1="40" y1="120" x2="570" y2="120" class="sv-l"/>
    <polyline points="40,120 120,110 200,150 280,170 360,100 440,60 560,80" class="sv-lp" stroke-width="3"/>
    <circle cx="280" cy="170" r="7" class="sv-b"/>${t(280, 195, 'Negative peak')}
    <circle cx="440" cy="60" r="7" class="sv-g"/>${t(440, 48, 'Positive peak')}
    <circle cx="560" cy="80" r="7" class="sv-p"/>${t(540, 105, 'End')}`, 'Peak-End Rule emotion curve'),
  serialPosition: () => {
    const v = [90, 75, 55, 40, 35, 38, 50, 72, 88];
    return svg(600, 220, `${t(300, 26, 'Recall by position in a list', 'sv-tb')}${v.map((h, i) => `<rect x="${50 + i * 58}" y="${190 - h * 1.5}" width="36" height="${h * 1.5}" rx="5" class="${i < 2 || i > 6 ? 'sv-p' : 'sv-s3'}"/>`).join('')}${t(90, 212, 'Primacy')}${t(510, 212, 'Recency')}`, 'Serial position curve');
  },
  vonRestorff: () => svg(600, 160, `${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${70 + i * 90}" cy="80" r="26" class="${i === 3 ? 'sv-a' : 'sv-s3'}"/>`).join('')}${t(340, 140, 'The different one is noticed and remembered', 'sv-t')}`, 'Von Restorff isolation effect'),
  zeigarnik: () => svg(600, 160, `${t(300, 30, 'Incomplete tasks stay on our mind', 'sv-tb')}<rect x="60" y="70" width="480" height="20" rx="10" class="sv-s3"/><rect x="60" y="70" width="320" height="20" rx="10" class="sv-p"/>${t(300, 120, '3 of 5 steps done — 2 to go')}`, 'Zeigarnik progress bar'),
  proximity: () => svg(600, 180, `${t(150, 26, 'Equal spacing: no groups', 'sv-tb')}${t(450, 26, 'Proximity: two groups', 'sv-tb')}
    ${Array.from({ length: 12 }, (_, i) => `<circle cx="${50 + (i % 4) * 66}" cy="${60 + Math.floor(i / 4) * 40}" r="12" class="sv-s3"/>`).join('')}
    ${Array.from({ length: 12 }, (_, i) => `<circle cx="${360 + (i % 4) * 30 + (i % 4 > 1 ? 70 : 0)}" cy="${60 + Math.floor(i / 4) * 40}" r="12" class="sv-p"/>`).join('')}`, 'Gestalt proximity'),
  similarity: () => svg(600, 160, `${t(300, 26, 'Similar things are seen as a group', 'sv-tb')}${Array.from({ length: 16 }, (_, i) => `<rect x="${60 + (i % 8) * 62}" y="${50 + Math.floor(i / 8) * 50}" width="30" height="30" rx="${i % 2 ? 15 : 4}" class="${i % 2 ? 'sv-p' : 'sv-s3'}"/>`).join('')}`, 'Gestalt similarity'),
  commonRegion: () => svg(600, 160, `${t(300, 26, 'A shared boundary creates a group', 'sv-tb')}<rect x="40" y="45" width="230" height="90" rx="14" class="sv-ps"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${80 + i * 70}" cy="90" r="14" class="sv-p"/>`).join('')}`, 'Gestalt common region'),
  pragnanz: () => svg(600, 180, `${t(300, 26, 'We see the simplest shapes', 'sv-tb')}${[0, 1, 2].map((i) => `<circle cx="${230 + i * 70}" cy="${95 + (i % 2) * 25}" r="40" class="sv-lp" stroke-width="5"/>`).join('')}`, 'Law of Prägnanz'),
  tesler: () => svg(600, 180, `${t(300, 26, 'Complexity is conserved — who carries it?', 'sv-tb')}<rect x="60" y="60" width="200" height="80" rx="10" class="sv-bs"/>${t(160, 95, 'User handles it')}${t(160, 115, '(more fields, more effort)')}<rect x="340" y="60" width="200" height="80" rx="10" class="sv-gs"/>${t(440, 95, 'System handles it')}${t(440, 115, '(defaults, inference)')}`, "Tesler's Law"),
  uxVsUi: () => svg(600, 220, `<circle cx="230" cy="115" r="90" class="sv-ps"/><circle cx="370" cy="115" r="90" class="sv-as" opacity=".85"/>
    ${t(185, 100, 'UX', 'sv-tb')}${t(185, 122, 'Research, flows')}${t(185, 140, 'IA, testing')}
    ${t(415, 100, 'UI', 'sv-tb')}${t(415, 122, 'Type, color')}${t(415, 140, 'Components')}
    ${t(300, 110, 'Interaction')}${t(300, 128, 'design')}`, 'UX vs UI Venn diagram'),
  designThinking: () => {
    const s = ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'];
    return svg(620, 170, s.map((x, i) => `<rect x="${12 + i * 122}" y="60" width="108" height="50" rx="25" class="${i === 0 ? 'sv-p' : 'sv-ps'}"/>${t(66 + i * 122, 90, x, i === 0 ? 'sv-tw' : 'sv-t')}${i < 4 ? `<path d="M${120 + i * 122} 85 l12 0" class="sv-li" stroke-width="2"/>` : ''}`).join('') + `<path d="M560 115 C 560 160, 70 160, 70 115" class="sv-lp" stroke-width="2" stroke-dasharray="5 5"/>${t(310, 160, 'Iterate')}`, 'Design thinking phases');
  },
  honeycomb: () => {
    const f = [['Useful', 300, 50], ['Usable', 210, 100], ['Desirable', 390, 100], ['Valuable', 300, 120], ['Findable', 210, 170], ['Accessible', 390, 170], ['Credible', 300, 190]];
    return svg(600, 240, f.map(([n, x, y], i) => `<polygon points="${[0, 1, 2, 3, 4, 5].map((k) => `${x + 46 * Math.cos(Math.PI / 3 * k)},${y + 40 * Math.sin(Math.PI / 3 * k)}`).join(' ')}" class="${i === 3 ? 'sv-p' : 'sv-ps'}"/>${t(x, y + 5, n, i === 3 ? 'sv-tw' : 'sv-t')}`).join(''), 'UX honeycomb');
  },
  iaTree: () => svg(600, 220, `<rect x="250" y="20" width="100" height="34" rx="8" class="sv-p"/>${t(300, 42, 'Home', 'sv-tw')}
    ${['Courses', 'Admissions', 'Research'].map((x, i) => `<line x1="300" y1="54" x2="${110 + i * 190}" y2="90" class="sv-l"/><rect x="${55 + i * 190}" y="90" width="110" height="32" rx="8" class="sv-ps"/>${t(110 + i * 190, 111, x)}`).join('')}
    ${[['CSE', 'BBA'], ['Apply', 'Fees'], ['Labs', 'Papers']].map((pair, i) => pair.map((x, j) => `<line x1="${110 + i * 190}" y1="122" x2="${80 + i * 190 + j * 60}" y2="160" class="sv-l"/><rect x="${55 + i * 190 + j * 60}" y="160" width="52" height="28" rx="6" class="sv-s2"/>${t(81 + i * 190 + j * 60, 179, x)}`).join('')).join('')}`, 'Sitemap tree'),
  userFlow: () => svg(640, 200, `<rect x="10" y="80" width="90" height="40" rx="20" class="sv-p"/>${t(55, 105, 'Start', 'sv-tw')}<path d="M100 100 h30" class="sv-li" stroke-width="2"/>
    <rect x="130" y="80" width="100" height="40" rx="6" class="sv-s2"/>${t(180, 105, 'Login')}<path d="M230 100 h30" class="sv-li" stroke-width="2"/>
    <polygon points="310,70 360,100 310,130 260,100" class="sv-as"/>${t(310, 104, 'Valid?')}
    <path d="M360 100 h30" class="sv-lg" stroke-width="2"/>${t(375, 92, 'yes')}<rect x="390" y="80" width="100" height="40" rx="6" class="sv-s2"/>${t(440, 105, 'Home')}<path d="M490 100 h30" class="sv-li" stroke-width="2"/><rect x="520" y="80" width="90" height="40" rx="20" class="sv-p"/>${t(565, 105, 'Done', 'sv-tw')}
    <path d="M310 130 v30" class="sv-lb" stroke-width="2"/>${t(325, 150, 'no', 'sv-t', 'start')}<rect x="250" y="160" width="120" height="34" rx="6" class="sv-bs"/>${t(310, 182, 'Show error')}`, 'User flow with a decision'),
  fidelity: () => svg(600, 190, ['Low-fi', 'Mid-fi', 'Hi-fi'].map((x, i) => `<rect x="${30 + i * 195}" y="20" width="150" height="130" rx="10" class="${i === 2 ? 'sv-s' : 'sv-s2'}" stroke="var(--line-strong)"/>
    <rect x="${45 + i * 195}" y="35" width="${i ? 120 : 80}" height="10" rx="3" class="${i === 2 ? 'sv-ink' : 'sv-s3'}"/><rect x="${45 + i * 195}" y="55" width="120" height="40" rx="4" class="${i === 2 ? 'sv-ps' : 'sv-s3'}"/>
    <rect x="${45 + i * 195}" y="110" width="120" height="22" rx="${i === 2 ? 6 : 2}" class="${i === 2 ? 'sv-p' : i ? 'sv-mut' : 'sv-s3'}"/>${t(105 + i * 195, 175, x, 'sv-tb')}`).join(''), 'Wireframe fidelity levels'),
  typeScale: () => { const s = [12, 14, 16, 20, 25, 31, 39]; let y = 10; return svg(600, 260, s.map((z) => { y += z + 10; return `<text x="20" y="${y}" style="font-size:${z}px" class="sv-ink" font-family="var(--font-display)">Aa ${z}px</text>`; }).join('') + t(420, 140, 'Ratio 1.25 (major third)', 'sv-tb'), 'Type scale'); },
  gridLayout: () => svg(600, 200, `${Array.from({ length: 12 }, (_, i) => `<rect x="${30 + i * 46}" y="20" width="38" height="160" class="sv-ps"/>`).join('')}<rect x="30" y="40" width="176" height="60" rx="6" class="sv-p" opacity=".9"/><rect x="214" y="40" width="176" height="60" rx="6" class="sv-p" opacity=".9"/><rect x="398" y="40" width="176" height="60" rx="6" class="sv-p" opacity=".9"/>${t(300, 140, '12 columns · 8 px gutters · content spans 4 cols each')}`, '12-column grid'),
  autoLayout: () => svg(600, 200, `<rect x="40" y="40" width="260" height="56" rx="10" class="sv-s2" stroke="var(--primary)" stroke-dasharray="4 4"/><rect x="56" y="54" width="28" height="28" rx="6" class="sv-p"/><rect x="96" y="58" width="120" height="20" rx="4" class="sv-s3"/>
    ${t(170, 120, 'padding 16 · gap 12 · hug')}<rect x="340" y="40" width="220" height="140" rx="10" class="sv-s2" stroke="var(--primary)" stroke-dasharray="4 4"/>${[0, 1, 2].map((i) => `<rect x="356" y="${56 + i * 40}" width="188" height="28" rx="6" class="sv-ps"/>`).join('')}${t(450, 195, 'vertical · fill width')}`, 'Auto Layout'),
  variants: () => svg(600, 180, ['Default', 'Hover', 'Pressed', 'Disabled'].map((x, i) => `<rect x="${30 + i * 140}" y="60" width="120" height="40" rx="8" class="${i === 3 ? 'sv-s3' : 'sv-p'}" opacity="${[1, 0.85, 0.7, 1][i]}"/>${t(90 + i * 140, 85, x, i === 3 ? 'sv-t' : 'sv-tw')}`).join('') + t(300, 140, 'Button · Type=Primary · Size=Medium · State=…'), 'Component variants'),
  researchQuadrant: () => svg(600, 260, `<line x1="300" y1="20" x2="300" y2="240" class="sv-l"/><line x1="40" y1="130" x2="560" y2="130" class="sv-l"/>
    ${t(300, 14, 'Behavioral (what people do)')}${t(300, 256, 'Attitudinal (what people say)')}${t(70, 125, 'Qualitative', 'sv-t', 'start')}${t(530, 125, 'Quantitative', 'sv-t', 'end')}
    ${t(170, 70, 'Usability tests')}${t(170, 90, 'Contextual inquiry')}${t(430, 70, 'Analytics')}${t(430, 90, 'A/B tests')}${t(170, 180, 'Interviews')}${t(170, 200, 'Focus groups')}${t(430, 180, 'Surveys')}${t(430, 200, 'Card sorting (online)')}`, 'Research methods landscape'),
  journeyMap: () => svg(620, 220, `${['Discover', 'Compare', 'Book', 'Pay', 'Visit'].map((x, i) => `${t(70 + i * 120, 30, x, 'sv-tb')}`).join('')}<line x1="20" y1="120" x2="600" y2="120" class="sv-l"/>
    <polyline points="70,90 190,110 310,170 430,150 550,70" class="sv-lp" stroke-width="3"/>${[[70, 90, 'g'], [190, 110, 'g'], [310, 170, 'b'], [430, 150, 'b'], [550, 70, 'g']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="8" class="sv-${c}"/>`).join('')}${t(310, 200, 'Pain point → opportunity')}`, 'Journey map emotion curve'),
};

export function diagram(name) { const fn = D[name]; return fn ? fn() : ''; }
export const hasDiagram = (n) => !!D[n];
