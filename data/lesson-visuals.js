/* ==========================================================================
   Visual for every lesson that doesn't define one inline.
   { svg: name } → diagram from js/ui/visuals.js
   { pair: { good: mock, bad: mock } } → side-by-side mock UIs tied to the
     lesson's own "Good UX / Bad UX" text
   { compare: id } → full Good vs Bad Lab example
   Figma lessons get step-by-step editor visuals automatically.
   ========================================================================== */
const ph = (nodes) => ({ frame: 'phone', nodes });
const cm = (nodes) => ({ frame: 'component', nodes });
const dk = (nodes) => ({ frame: 'desktop', nodes });
const pair = (good, bad) => ({ pair: { good, bad } });

export const LESSON_VISUALS = {
  /* Level 0 */
  'what-is-design': { svg: 'designDefinition' },
  'what-is-ux': { svg: 'uxJourney' },
  'what-is-ui': pair(cm([['h', { t: 'Save your changes?', size: 'sm' }], ['row', {}, [['btn', { t: 'Save', v: 'primary' }], ['btn', { t: 'Discard', v: 'secondary' }]]]]), cm([['h', { t: 'Save your changes?', size: 'sm' }], ['row', {}, [['btn', { t: 'Save', v: 'primary' }], ['btn', { t: 'Discard', v: 'primary' }], ['btn', { t: 'Cancel', v: 'primary' }], ['btn', { t: 'Help', v: 'primary' }]]]])),
  'ux-vs-product-design': { svg: 'productScope' },
  'ux-vs-graphic-design': { svg: 'graphicVsUx' },
  'ux-vs-hci': { svg: 'fitts' },
  'human-centered-design': { svg: 'hcdCycle' },
  'problem-solving': { svg: 'fiveWhys' },
  'empathy': { svg: 'empathyMap' },
  'observation': { svg: 'sayDo' },
  'critical-thinking': { svg: 'evidenceScale' },
  'design-mindset': { svg: 'hcdCycle' },
  'designer-responsibilities': pair(ph([['h', { t: 'Cancel subscription' }], ['p', { t: 'You\'ll keep access until 30 Nov.' }], ['btn', { t: 'Cancel subscription', v: 'danger', full: 1 }], ['btn', { t: 'Keep my plan', v: 'secondary', full: 1 }]]), ph([['h', { t: 'Account' }], ['list', { items: ['Profile', 'Payments', 'Rewards'] }], ['spacer', { h: 80 }], ['p', { t: 'to cancel contact support via form 7B', tiny: 1, lowc: 1 }]])),
  /* Level 1 */
  'utility': { svg: 'usefulEq' },
  'desirability': { svg: 'desirability' },
  'findability': { svg: 'labels' },
  'credibility': { svg: 'credibilitySignals' },
  'learnability': pair(ph([['h', { t: 'Home' }], ['card', {}, [['p', { t: 'Tip: tap ＋ to add your first expense' }]]], ['tabbar', { items: ['Home', 'Add', 'Stats'], active: 0 }]]), ph([['dots', { n: 7, on: 0 }], ['h', { t: 'Tutorial 1 of 7' }], ['p', { t: 'Before you begin, learn all features…' }], ['btn', { t: 'Next', v: 'primary', full: 1 }]])),
  'memorability': pair(ph([['h', { t: 'Welcome back' }], ['p', { t: 'Continue where you left off' }], ['card', {}, [['p', { t: 'Tax return 2025 — 60% done' }], ['progress', { v: 60 }]]], ['tabbar', { items: ['Home', 'Returns', 'Help'], active: 0 }]]), ph([['header', { t: '' }], ['p', { t: '(swipe up with 3 fingers to open returns)', tiny: 1 }]])),
  'efficiency': pair(ph([['h', { t: 'Send money' }], ['p', { t: 'Recent' }], ['row', {}, [['avatar'], ['avatar'], ['avatar']]], ['input', { val: 'Amma · 01712-345678' }], ['btn', { t: 'Send ৳3,000', v: 'primary', full: 1 }]]), ph([['h', { t: 'Send money' }], ['input', { ph: 'Number' }], ['input', { ph: 'Name' }], ['input', { ph: 'Amount' }], ['input', { ph: 'Reference' }], ['input', { ph: 'Purpose' }], ['btn', { t: 'Next', v: 'primary', full: 1 }]])),
  'user-satisfaction': { svg: 'satisfactionScale' },
  /* HCI */
  'hci-behavior': { svg: 'fPattern' },
  'hci-memory': { svg: 'workingMemory' },
  'hci-attention': { svg: 'spotlight' },
  'hci-mental-models': { svg: 'mentalModel' },
  'hci-decision-making': { compare: 'cmp-choice-overload' },
  'hci-motivation': { svg: 'foggModel' },
  'hci-emotion': { svg: 'emotionLevels' },
  'hci-habit': { svg: 'habitLoop' },
  'hci-signifiers': pair(cm([['list', { items: ['Inbox ›', 'Sent ›', 'Archive ›'] }]]), cm([['list', { items: ['Inbox', 'Sent', 'Archive'] }], ['p', { t: '(rows open on tap — no hint)', tiny: 1 }]])),
  'hci-constraints': pair(cm([['label', { t: 'Check-in date' }], ['chips', { items: ['12 Oct ✕', '13 Oct', '14 Oct', '15 Oct'], active: 1 }], ['hint', { t: 'Past dates unavailable' }]]), cm([['label', { t: 'Check-in date' }], ['input', { val: '31/02/2024' }], ['hint', { t: 'Accepted ✓ (invalid date!)', err: 1 }]])),
  'hci-mapping': { svg: 'stoveMapping' },
  'hci-consistency': { svg: 'consistency' },
  'hci-discoverability': pair(ph([['list', { items: ['Message from Ayesha', 'Invoice #203'] }], ['alert', { t: 'Tip: swipe left on a message to archive', kind: 'info' }]]), ph([['list', { items: ['Message from Ayesha', 'Invoice #203'] }], ['p', { t: '(long-press needed — never explained)', tiny: 1 }]])),
  'hci-error-tolerance': { svg: 'errorRecovery' },
  'hci-limitations': { svg: 'limitations' },
  /* IA & flows */
  'ia-hierarchy': { svg: 'invertedPyramid' },
  'ia-sitemap': { svg: 'breadthDepth' },
  'ia-taxonomy': { svg: 'facets' },
  'ia-labels': { svg: 'labels' },
  'ia-filters': pair(ph([['search', { val: 'shirt' }], ['chips', { items: ['Under ৳1000 ×', 'Cotton ×', 'Clear all'], active: 0 }], ['p', { t: '42 results' }]]), ph([['search', { val: 'shirt' }], ['p', { t: 'Results' }], ['p', { t: '(3 filters active — but not shown)', tiny: 1 }]])),
  'uf-task-flow': { svg: 'taskVsUser' },
  'uf-happy-path': { svg: 'userFlow' },
  'uf-edge-cases': { svg: 'screenStates' },
  'uf-error-states': { compare: 'cmp-error-message' },
  'uf-decision-points': { svg: 'userFlow' },
  /* Wireframing */
  'wf-mid-fi': { svg: 'fidelity' },
  'wf-hi-fi': { svg: 'fidelity' },
  'wf-desktop': { svg: 'gridLayout' },
  'wf-responsive': { svg: 'responsiveReflow' },
  /* Prototyping */
  'proto-fundamentals': { svg: 'prototypeLadder' },
  'proto-clickable': { svg: 'prototypeLadder' },
  'proto-transitions': { svg: 'transitions' },
  'proto-micro': { svg: 'microInteraction' },
  'proto-success': { compare: 'cmp-success-state' },
  /* Usability */
  'ut-planning': { svg: 'testPlan' },
  'ut-recruiting': { svg: 'fiveUsers' },
  'ut-tasks': pair(cm([['p', { t: 'Task 2' }], ['h', { t: '"You\'re getting alerts at night. Show me how you\'d stop them."', size: 'sm' }]]), cm([['p', { t: 'Task 2' }], ['h', { t: '"Go to Settings › Notifications and turn off Night alerts."', size: 'sm' }]])),
  'ut-moderated': { svg: 'moderation' },
  'ut-think-aloud': { svg: 'thinkAloud' },
  'ut-observation': { svg: 'severity' },
  'ut-metrics': { svg: 'metricsQuad' },
  'ut-reporting': { svg: 'reportTop3' },
  /* Accessibility */
  'a11y-wcag': { svg: 'pour' },
  'a11y-typography': { svg: 'lineHeight' },
  'a11y-keyboard': { svg: 'keyboardOrder' },
  'a11y-focus': { svg: 'focusRing' },
  'a11y-screen-readers': { svg: 'screenReader' },
  'a11y-alt-text': { svg: 'altText' },
  'a11y-motion': { svg: 'motionPref' },
  'a11y-cognitive': { svg: 'plainLanguage' },
  'a11y-inclusive': { svg: 'personaSpectrum' },
  /* Research */
  'rs-what': { svg: 'researchQuadrant' },
  'rs-why': { svg: 'evidenceScale' },
  'rs-gen-eval': { svg: 'genEval' },
  'rs-primary-secondary': { svg: 'primarySecondary' },
  'rs-plan': { svg: 'researchPlan' },
  'rs-synthesis': { svg: 'affinity' },
  'rs-ethics': { svg: 'ethicsConsent' },
  'persona-what': { svg: 'personaCard' },
  'persona-types': { svg: 'personaTypes' },
  /* UI */
  'type-families': { svg: 'typeFamilies' },
  'type-pairing': { svg: 'typePairing' },
  'type-line-height': { svg: 'lineHeight' },
  'type-letter-spacing': { svg: 'letterSpacing' },
  'type-readability': { svg: 'lineLength' },
  'color-theory': { svg: 'colorHSL' },
  'color-primary': { svg: 'colorRoles' },
  'color-neutral': { svg: 'neutralRamp' },
  'color-semantic': { svg: 'semanticColors' },
  'color-systems': { svg: 'tokenTiers' },
  'color-dark-mode': { svg: 'darkElevation' },
  'layout-alignment': { svg: 'alignment' },
  'layout-containers': { svg: 'containerWidth' },
  'layout-columns': { svg: 'columnsForms' },
  'layout-responsive': { svg: 'responsiveReflow' },
  'cmp-sidebar': { mock: dk([['row', {}, [['list', { items: ['Overview', 'Projects', 'Reports', 'Team', 'Settings'] }], ['col', {}, [['h', { t: 'Projects', size: 'sm' }], ['card', {}, [['p', { t: 'Clinic app redesign' }], ['progress', { v: 60 }]]]]]]]]) },
  'cmp-dropdown': { mock: cm([['row', { end: 1 }, [['btn', { t: '⋯', v: 'secondary' }]]], ['list', { items: ['Rename', 'Duplicate', 'Move to…'] }], ['divider'], ['btn', { t: 'Delete', v: 'ghost' }]]) },
  'cmp-avatar': { mock: cm([['row', {}, [['avatar'], ['col', {}, [['h', { t: 'Rahima Akter', size: 'sm' }], ['p', { t: 'Commented 2 h ago' }]]]]], ['row', {}, [['avatar'], ['avatar'], ['avatar'], ['badge', { t: '+3' }]]]]) },
  'cmp-calendar': { mock: cm([['h', { t: 'October 2026', size: 'sm' }], ['chips', { items: ['10 ✕', '11 ✕', '12', '13', '14', '15'], active: 2 }], ['hint', { t: 'Greyed dates are unavailable · today: 12' }]]) },
  'ds-what': { svg: 'dsLayers' },
  'ds-tokens': { svg: 'tokenTiers' },
  'ds-variables': { svg: 'darkElevation' },
  'ds-components': { svg: 'reuse' },
  'ds-states': { svg: 'stateMatrix' },
  'ds-naming': { svg: 'namingTree' },
  'ds-documentation': { svg: 'docsPage' },
  'ds-consistency': { svg: 'reuse' },
  /* Career */
  'cr-practice': { svg: 'practiceRoutine' },
  'cr-portfolio': { svg: 'portfolio' },
  'cr-case-writing': { svg: 'caseStructure' },
  'cr-presenting': { svg: 'presentPie' },
  'cr-critique': { svg: 'critiqueLoop' },
  'cr-developers': { svg: 'collabTriangle' },
  'cr-pms': { svg: 'collabTriangle' },
  'cr-communicating': { svg: 'decisionDefend' },
  'cr-feedback': { svg: 'feedbackReceive' },
  'cr-interviews': { svg: 'careerPath' },
  'cr-whiteboard': { svg: 'whiteboard' },
  'cr-freelance-agency-product': { svg: 'workModes' },
};

/* Laws that had no diagram */
export const LAW_VISUALS = { 'goal-gradient': 'goalGradient', 'aesthetic-usability': 'aestheticD', 'uniform-connectedness': 'uniformConnected', continuity: 'continuityD', parkinson: 'parkinsonD', postel: 'postelD', pareto: 'paretoD', occam: 'occamD' };

/* Research methods */
export const METHOD_VISUALS = { 'user-interviews': 'interview', surveys: 'survey', 'observation-method': 'observation', 'contextual-inquiry': 'sayDo', 'diary-studies': 'diary', 'focus-groups': 'focusGroup', 'usability-testing': 'usabilityLab', 'ab-testing': 'abTest', 'card-sorting': 'cardSort', 'tree-testing': 'treeTest', 'competitive-analysis': 'compMatrix', 'heuristic-evaluation': 'heuristicsList', 'expert-review': 'heuristicsList', 'analytics-analysis': 'funnel' };

/* Challenge template → related visual */
export const CHALLENGE_VISUALS = { onboarding: { compare: 'cmp-onboarding' }, search: { compare: 'cmp-search' }, checkout: { compare: 'cmp-checkout' }, 'empty-error': { svg: 'screenStates' }, dashboard: { compare: 'cmp-dashboard-clutter' }, 'accessibility-audit': { svg: 'contrastScale' }, notifications: { svg: 'consistency' }, profile: { svg: 'labels' }, 'feedback-review': { svg: 'peakEnd' }, responsive: { svg: 'responsiveReflow' },
  'better-login': { compare: 'cmp-login' }, 'improve-checkout': { compare: 'cmp-checkout' }, 'hospital-appointment': { svg: 'userFlow' }, 'banking-dashboard': { compare: 'cmp-dashboard-clutter' }, 'course-registration': { svg: 'screenStates' }, 'mobile-navigation': { compare: 'cmp-mobile-nav' }, 'error-messages': { compare: 'cmp-error-message' }, 'empty-states': { compare: 'cmp-empty-state' }, 'accessible-form': { compare: 'cmp-form-labels' }, 'onboarding-budget': { compare: 'cmp-onboarding' } };

/* Guided project stage visuals (by stage index) */
export const PROJECT_STEP_VISUALS = ['interview', 'personaCard', 'fiveWhys', 'journeyMap', 'iaTree', 'userFlow', 'fidelity', 'typeScale', 'prototypeLadder', 'usabilityLab', 'hcdCycle', 'caseStructure'];

/* Keyword → visual, used for glossary terms and anything without a mapping */
export const KEYWORD_VISUALS = [
  /* Specific terms first */
  [/screen reader|assistive tech/i, { svg: 'screenReader' }], [/alt text/i, { svg: 'altText' }], [/focus state|focus ring/i, { svg: 'focusRing' }], [/keyboard/i, { svg: 'keyboardOrder' }],
  [/touch target|fitts/i, { svg: 'fitts' }], [/colou?r blind/i, { svg: 'semanticColors' }], [/plain language/i, { svg: 'plainLanguage' }], [/aria|semantic html/i, { svg: 'screenReader' }], [/captions/i, { svg: 'pour' }],
  [/line height|leading/i, { svg: 'lineHeight' }], [/measure|line length/i, { svg: 'lineLength' }], [/kerning|letter spacing|tracking/i, { svg: 'letterSpacing' }], [/serif|font weight|typeface/i, { svg: 'typeFamilies' }], [/type scale/i, { svg: 'typeScale' }],
  [/dark mode|elevation|shadow/i, { svg: 'darkElevation' }], [/semantic colou?r/i, { svg: 'semanticColors' }], [/8-point|spacing scale/i, { svg: 'spacingScale' }], [/border radius|iconograph/i, { svg: 'stateMatrix' }],
  [/user interview|discussion guide|leading question|stakeholder interview/i, { svg: 'interview' }], [/\bsurvey\b|nps|csat/i, { svg: 'survey' }], [/diary/i, { svg: 'diary' }], [/focus group/i, { svg: 'focusGroup' }],
  [/ethnograph|contextual inquiry|observation/i, { svg: 'observation' }], [/competitive/i, { svg: 'compMatrix' }], [/empathy map/i, { svg: 'empathyMap' }], [/service blueprint|jobs to be done/i, { svg: 'journeyMap' }],
  [/statistical|confidence interval|sample size|a\/b|hypothesis/i, { svg: 'abTest' }], [/screener|recruit/i, { svg: 'fiveUsers' }], [/informed consent/i, { svg: 'ethicsConsent' }], [/synthesis|insight|triangulat/i, { svg: 'affinity' }],
  [/generative|evaluative/i, { svg: 'genEval' }], [/primary research|secondary research/i, { svg: 'primarySecondary' }], [/research plan/i, { svg: 'researchPlan' }], [/cognitive walkthrough|expert review/i, { svg: 'heuristicsList' }],
  [/proto-persona|anti-persona/i, { svg: 'personaTypes' }], [/chunk|miller/i, { svg: 'miller' }], [/working memory|recognition over recall/i, { svg: 'workingMemory' }], [/hick|choice overload/i, { svg: 'hick' }], [/jakob/i, { svg: 'jakob' }],
  [/peak-end|emotional design/i, { svg: 'peakEnd' }], [/banner blind|change blind|attention/i, { svg: 'spotlight' }], [/anchoring|loss aversion|social proof|default effect|satisficing|decision making/i, { svg: 'evidenceScale' }],
  [/flow state/i, { svg: 'emotionLevels' }], [/habit/i, { svg: 'habitLoop' }], [/natural mapping/i, { svg: 'stoveMapping' }], [/undo|slip|error prevention/i, { svg: 'errorRecovery' }], [/discoverab/i, { svg: 'labels' }],
  [/gestalt/i, { svg: 'proximity' }], [/perceived performance|optimistic ui/i, { svg: 'doherty' }], [/double diamond|design thinking/i, { svg: 'designThinking' }], [/lean ux|assumption/i, { svg: 'evidenceScale' }],
  [/agile|sprint|design sprint|backlog|roadmap|user story|acceptance criteria/i, { svg: 'hcdCycle' }], [/problem statement/i, { svg: 'fiveWhys' }],
  [/task success|time on task|error rate|\bseq\b/i, { svg: 'metricsQuad' }], [/kpi|north star|okr|retention|churn|bounce|click-through|activation|product-market/i, { svg: 'funnel' }],
  [/hamburger|tab bar/i, { compare: 'cmp-mobile-nav' }], [/global navigation|local navigation|breadcrumb|mega menu|wayfinding/i, { svg: 'iaTree' }], [/faceted|filter|\bsort\b/i, { svg: 'facets' }],
  [/pagination|infinite scroll/i, { mock: { frame: 'component', nodes: [['list', { items: ['Result 21', 'Result 22', 'Result 23'] }], ['pager', { n: 5, on: 1 }]] } }], [/labeling|information scent|content audit/i, { svg: 'labels' }],
  [/ghost button|primary button/i, { compare: 'cmp-cta-emphasis' }], [/placeholder|input field/i, { compare: 'cmp-form-labels' }], [/toggle switch/i, { mock: { frame: 'component', nodes: [['row', { between: 1 }, [['p', { t: 'Notifications' }], ['toggle', { on: 1 }]]], ['row', { between: 1 }, [['p', { t: 'Dark mode' }], ['toggle', {}]]]] } }],
  [/checkbox|radio button/i, { mock: { frame: 'component', nodes: [['check', { t: 'Standard delivery', on: 1 }], ['check', { t: 'Express — ৳60' }]] } }], [/dropdown/i, { mock: { frame: 'component', nodes: [['label', { t: 'District' }], ['input', { val: 'Dhaka ▾' }], ['list', { items: ['Dhaka', 'Chattogram', 'Khulna'] }]] } }],
  [/tooltip|popover/i, { mock: { frame: 'component', nodes: [['tooltip', { t: 'Download report' }], ['icons', { n: 3 }]] } }], [/drawer|bottom sheet/i, { svg: 'transitions' }],
  [/\bbadge|\bchip/i, { mock: { frame: 'component', nodes: [['chips', { items: ['Under ৳500 ×', 'In stock ×'], active: 0 }], ['row', {}, [['badge', { t: 'NEW' }], ['badge', { t: '3' }]]]] } }],
  [/stepper|progress bar/i, { mock: { frame: 'component', nodes: [['steps', { items: ['Cart', 'Address', 'Pay'], cur: 1 }], ['progress', { v: 60 }]] } }], [/carousel/i, { svg: 'continuityD' }], [/accordion/i, { svg: 'invertedPyramid' }],
  [/\bcard\b/i, { mock: { frame: 'component', nodes: [['card', {}, [['img', { h: 60, t: 'Photo' }], ['h', { t: 'Cotton Panjabi', size: 'sm' }], ['p', { t: '৳1,450 · ★ 4.6' }]]]] } }],
  [/loading state|skeleton/i, { svg: 'screenStates' }], [/success state/i, { svg: 'successScreen' }], [/disabled state|hover state/i, { svg: 'stateMatrix' }], [/easing/i, { svg: 'transitions' }],
  [/portfolio/i, { svg: 'portfolio' }], [/case study/i, { svg: 'caseStructure' }], [/design rationale/i, { svg: 'decisionDefend' }], [/design qa|design review/i, { svg: 'collabTriangle' }], [/whiteboard/i, { svg: 'whiteboard' }],
  /* Figma terms → Figma editor picture */
  [/^frame\b/i, { figma: 'Press F and choose a frame preset' }], [/^group\b/i, { figma: 'Ctrl/Cmd+G group layers' }], [/^layer\b/i, { figma: 'Rename layers in the Layers panel' }], [/pen tool/i, { figma: 'Press P to use the Pen tool' }],
  [/boolean operation/i, { figma: 'Boolean union of two shapes' }], [/^mask\b/i, { figma: 'Use an image inside a shape' }], [/^styles\b/i, { figma: 'Create a color style' }], [/^library\b/i, { figma: 'Publish the library' }],
  [/component property|instance swap/i, { figma: 'Create a boolean property' }], [/smart animate|overlay|interactive component/i, { figma: 'On tap → Navigate with Smart animate' }], [/branching/i, { figma: 'Create a branch for large changes' }],
  [/affordance/i, { compare: 'cmp-button-affordance' }], [/signifier/i, { svg: 'labels' }], [/usability test|think-aloud|\bsus\b/i, { svg: 'usabilityLab' }], [/usability/i, { svg: 'usabilityParts' }],
  [/accessib|wcag|screen reader|alt text|aria/i, { svg: 'pour' }], [/contrast/i, { svg: 'contrastScale' }], [/persona/i, { svg: 'personaCard' }], [/journey/i, { svg: 'journeyMap' }],
  [/user flow|task flow|happy path|edge case|flowchart/i, { svg: 'userFlow' }], [/wireframe|fidelity|sketch/i, { svg: 'fidelity' }], [/prototype|micro-interaction|transition|animation/i, { svg: 'prototypeLadder' }],
  [/information architecture|sitemap|taxonomy|navigation|breadcrumb/i, { svg: 'iaTree' }], [/card sort/i, { svg: 'cardSort' }], [/tree test/i, { svg: 'treeTest' }],
  [/design system|token|variable/i, { svg: 'tokenTiers' }], [/component|instance|variant/i, { svg: 'variants' }], [/auto layout|constraint|frame/i, { svg: 'autoLayout' }],
  [/typograph|font|type scale|kerning|leading|tracking/i, { svg: 'typeScale' }], [/colou?r|palette|hue/i, { svg: 'colorHSL' }], [/grid|gutter|column|layout|spacing|whitespace|alignment/i, { svg: 'gridLayout' }],
  [/responsive|breakpoint|mobile/i, { svg: 'responsiveReflow' }], [/mental model/i, { svg: 'mentalModel' }], [/cognitive|memory|chunk/i, { svg: 'workingMemory' }], [/attention|scan/i, { svg: 'fPattern' }],
  [/feedback|loading|skeleton|spinner|toast/i, { svg: 'doherty' }], [/error|validation/i, { compare: 'cmp-error-message' }], [/empty state/i, { compare: 'cmp-empty-state' }],
  [/a\/b|experiment|conversion|funnel|analytic|metric|kpi|retention|churn/i, { svg: 'funnel' }], [/interview|survey|research|insight|affinity|diary|ethnograph/i, { svg: 'researchQuadrant' }],
  [/heuristic/i, { svg: 'heuristicsList' }], [/dark pattern|ethic|trust|credib/i, { svg: 'credibilitySignals' }], [/onboarding/i, { compare: 'cmp-onboarding' }], [/search|filter|facet/i, { svg: 'facets' }],
  [/checkout|cart|payment/i, { compare: 'cmp-checkout' }], [/button|cta|call to action/i, { compare: 'cmp-cta-emphasis' }], [/form|input|field|label/i, { compare: 'cmp-form-labels' }],
  [/modal|dialog|tooltip|popover|drawer/i, { svg: 'transitions' }], [/handoff|dev mode|developer/i, { svg: 'collabTriangle' }], [/critique|feedback session|stakeholder/i, { svg: 'critiqueLoop' }],
  [/portfolio|case study/i, { svg: 'caseStructure' }], [/design thinking|ideat|empath|define/i, { svg: 'designThinking' }], [/hci|human/i, { svg: 'limitations' }],
];
const matchVisual = (text) => { for (const [re, v] of KEYWORD_VISUALS) if (re.test(text)) return v; return null; };
export function visualForText(text) { return matchVisual(text) || { svg: 'uxVsUi' }; }
/** Glossary: match the term itself first, then its definition and related terms. */
export function visualForTerm(g) { return matchVisual(g.term) || matchVisual(`${g.en} ${g.simple}`) || visualForText(g.related.join(' ')); }
