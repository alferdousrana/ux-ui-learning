/* ==========================================================================
   Design challenges. Hand-written flagship challenges + a composer that pairs
   real product domains with challenge templates (domain × template), giving
   hundreds of specific, practicable briefs. Daily challenge is picked by date.
   ========================================================================== */
const C = (id, title, difficulty, minutes, skills, problem, users, constraints, screens, ux, ui, checklist) => ({ id, title, difficulty, minutes, skills, problem, users, constraints, screens, ux, ui, checklist, flagship: true });

const FLAGSHIP = [
  C('better-login', 'Design a better login screen', 'Beginner', 30, ['UI', 'Forms', 'Error states'], 'The current login has a Reset button next to Login, no password visibility and hidden recovery. 18% of support tickets are lockouts.', 'Returning users on mobile, many logging in once a month.',
    ['Mobile first (390 px)', 'Must support phone number or email', 'OTP login as an alternative'], ['Login', 'Wrong password state', 'Forgot password'], ['Visible labels', 'Show/hide password', 'Recovery near password field', 'Specific error messages'], ['44 px+ targets', 'One primary action'],
    ['No Reset button', 'Errors explain how to fix', 'Recovery reachable in one tap', 'Works with keyboard and screen reader', 'Contrast ≥ 4.5:1']),
  C('improve-checkout', 'Improve this checkout', 'Intermediate', 45, ['UX research', 'User flow', 'Usability', 'UI'], 'Cart abandonment is 64%. Fees appear at the last step and account creation is required.', 'Busy parents ordering groceries weekly on phones.',
    ['Guest checkout required', 'Cash on delivery must remain', '3 steps maximum'], ['Cart', 'Address', 'Payment', 'Success'], ['Upfront fees', 'Progress indicator', 'Saved address'], ['Sticky total', 'Clear CTA with amount'],
    ['Total cost visible before checkout', 'No forced registration', 'Progress shown', 'Final button states the amount', 'Success screen with order details']),
  C('hospital-appointment', 'Design a hospital appointment flow', 'Intermediate', 60, ['User flow', 'IA', 'Accessibility'], 'Patients (often booking for parents) can\'t find available slots and can\'t book for family members.', 'Adult children aged 25–45 and patients 55+.',
    ['Support booking for others', 'Bangla and English', 'Large text option'], ['Find doctor', 'Choose slot', 'Who is it for?', 'Confirm'], ['Next available slot preselected', 'Family profiles', 'Reminders'], ['48 px time slots', 'High contrast'],
    ['Earliest slot visible without searching', 'Family member flow ≤ 2 steps', 'Confirmation includes reference and directions', 'Readable for older users']),
  C('banking-dashboard', 'Design a banking dashboard', 'Advanced', 60, ['Information hierarchy', 'Data visualization', 'Trust'], 'Users open the app mainly to check balance and recent transactions, but the home screen is filled with promotions.', 'Salaried professionals checking accounts daily.',
    ['Balance can be hidden for privacy', 'Max 4 primary actions', 'Accessible charts'], ['Dashboard', 'Transaction detail'], ['Balance first', 'Recent transactions', 'Quick actions'], ['Tabular numbers', 'Semantic colors with text'],
    ['Balance and last 5 transactions visible above the fold', 'Promotions secondary', 'Privacy toggle', 'Numbers right-aligned', 'Charts not color-only']),
  C('course-registration', 'Design a university course registration system', 'Advanced', 90, ['Service design', 'Error prevention', 'IA'], 'Students discover time clashes only after submitting and register at midnight in panic.', 'Undergraduates on laptops and phones.',
    ['Clash detection before submit', 'Backup sections', 'Staggered windows'], ['Catalog', 'Planner', 'Cart', 'Confirmation'], ['Plan mode', 'Live clash warnings', 'Readable course titles'], ['Weekly calendar', 'Clear seat counts'],
    ['Clashes shown before submission', 'Backups supported', 'Course titles, not only codes', 'Works on mobile', 'Confirmation is printable']),
  C('mobile-navigation', 'Improve this mobile navigation', 'Beginner', 30, ['IA', 'Navigation', 'Mobile'], 'An app uses 7 unlabeled bottom icons; analytics show users rarely visit 4 of them.', 'General consumers.',
    ['Max 5 tabs', 'Labels required'], ['Home with tab bar', 'More/Profile screen'], ['Top tasks in tabs', 'Secondary items grouped'], ['Active state clear'],
    ['≤ 5 labeled tabs', 'Top tasks chosen using data', 'Rest grouped logically', 'Active tab obvious', 'Touch targets ≥ 44 px']),
  C('error-messages', 'Rewrite 6 error messages', 'Beginner', 20, ['UX writing', 'Errors'], 'A payment app shows codes like "ERR_402" and "Invalid input".', 'All users.',
    ['Plain language', 'Bangla and English versions'], ['Error copy sheet'], ['What happened, why, what now'], ['Inline placement'],
    ['No codes shown alone', 'Each message gives a fix', 'No blame', 'Placed near the problem', 'Translated naturally into Bangla']),
  C('empty-states', 'Design empty states for a notes app', 'Beginner', 25, ['States', 'Onboarding'], 'New users see a blank screen and leave.', 'First-time users.',
    ['First use, no search results, cleared trash'], ['3 empty states'], ['Explain and invite action'], ['Light illustration optional'],
    ['Each state explains why it\'s empty', 'Each has one clear action', 'No-results suggests alternatives']),
  C('accessible-form', 'Make a government form accessible', 'Advanced', 60, ['Accessibility', 'Forms'], 'A 6-step form fails screen readers and times out after 5 minutes.', 'Citizens including screen-reader users.',
    ['WCAG 2.2 AA', 'Save progress', 'Slow networks'], ['Overview', 'Step form', 'Review', 'Confirmation'], ['Requirements upfront', 'Timeout warning'], ['Labels, focus states, error summary'],
    ['Every field labeled', 'Error summary links to fields', 'Timeout warning with extend', 'Keyboard-only completion possible', 'Step indicator announced']),
  C('onboarding-budget', 'Design onboarding for a budgeting app', 'Intermediate', 45, ['Onboarding', 'Motivation'], 'Users install the app but never add their first expense.', 'Young professionals.',
    ['≤ 3 screens', 'Skippable', 'First value within 60 s'], ['Welcome', 'Personalize', 'First expense'], ['Ask only what personalizes', 'Zeigarnik checklist'], ['Friendly tone'],
    ['First expense added in ≤ 60 s', 'Skip available', 'Progress visible', 'No account required to try']),
];

/* Domain × template composer */
const DOMAINS = [
  ['food delivery app', 'hungry office workers ordering lunch on phones'], ['pharmacy app', 'caregivers ordering medicine for elderly parents'],
  ['ride-sharing app', 'commuters booking rides in traffic'], ['online grocery', 'parents doing weekly shopping'],
  ['mobile wallet', 'small traders receiving payments'], ['school portal', 'parents checking results and fees'],
  ['job portal', 'fresh graduates applying for first jobs'], ['bus ticketing site', 'travelers booking intercity buses during Eid'],
  ['clinic booking app', 'patients booking specialists'], ['e-learning platform', 'students learning after classes'],
  ['real estate site', 'families searching rental flats'], ['news app', 'readers catching up on commutes'],
  ['fitness app', 'beginners starting home workouts'], ['government e-service', 'citizens applying for certificates'],
  ['SaaS invoicing tool', 'freelancers billing clients'],
];
const TEMPLATES = [
  ['onboarding', 'Design the onboarding for a {d}', 'Beginner', 30, ['Onboarding', 'Learnability'], 'New users of a {d} drop off before reaching value.', ['≤ 3 screens', 'Skippable'], ['Welcome', 'Personalization', 'First action'], ['Reach first value fast', 'Ask only essential questions'], ['First value within 60 s', 'Skip available', 'Progress shown']],
  ['search', 'Design search and filters for a {d}', 'Intermediate', 45, ['IA', 'Search'], 'Users of a {d} can\'t find what they need in a long list.', ['Typo tolerance', 'Filters on mobile'], ['Search', 'Results', 'Filters', 'No results'], ['Suggestions', 'Applied filter chips', 'Helpful zero results'], ['Counts on filters', 'No dead ends', 'Filters removable in one tap']],
  ['checkout', 'Design the payment flow for a {d}', 'Intermediate', 45, ['Flow', 'Trust'], 'Payment in a {d} feels risky and users abandon it.', ['Show total early', 'Local payment methods'], ['Review', 'Payment method', 'Processing', 'Success/Failure'], ['Transparent cost', 'Clear status'], ['Total visible before paying', 'Failure explains whether money was taken', 'Receipt with reference']],
  ['empty-error', 'Design empty, loading and error states for a {d}', 'Beginner', 30, ['States', 'Feedback'], 'A {d} shows blank screens when loading or empty.', ['Slow network', 'Offline'], ['Empty', 'Loading skeleton', 'Error', 'Offline'], ['Explain state', 'Offer action'], ['Every state has a next action', 'Skeleton matches layout', 'Offline message is calm and specific']],
  ['dashboard', 'Design the home dashboard for a {d}', 'Advanced', 60, ['Hierarchy', 'Data'], 'The home screen of a {d} shows everything with equal weight.', ['Max 4 key metrics/actions'], ['Home', 'Detail'], ['Prioritize top tasks (Pareto)'], ['Top tasks above the fold', 'Clear hierarchy', 'Numbers readable']],
  ['accessibility-audit', 'Run an accessibility redesign for a {d}', 'Advanced', 60, ['Accessibility'], 'A key screen of a {d} fails WCAG AA.', ['WCAG 2.2 AA'], ['Before', 'After', 'Annotations'], ['Contrast, labels, focus, targets'], ['Contrast ≥ 4.5:1', 'Targets ≥ 44 px', 'Focus order annotated', 'No color-only meaning']],
  ['notifications', 'Design notification settings for a {d}', 'Intermediate', 30, ['Settings', 'Control'], 'Users of a {d} uninstall because of too many notifications.', ['Granular control', 'Quiet hours'], ['Settings', 'Permission prompt'], ['Ask permission in context'], ['Categories understandable', 'Quiet hours available', 'Permission asked at a meaningful moment']],
  ['profile', 'Design profile and account management for a {d}', 'Beginner', 30, ['IA', 'Forms'], 'Users of a {d} can\'t find how to edit details or delete their account.', ['Account deletion must be findable'], ['Profile', 'Edit', 'Delete account'], ['Group settings logically'], ['Edit in ≤ 2 taps', 'Deletion clear but protected', 'Grouped sections']],
  ['feedback-review', 'Design ratings and reviews for a {d}', 'Intermediate', 40, ['Trust', 'Forms'], 'A {d} gets few reviews and users don\'t trust ratings.', ['Quick rating', 'Optional text'], ['Prompt', 'Rating form', 'Review list'], ['Ask at the right moment (peak-end)'], ['Rating in one tap', 'Reviews show recency', 'Prompt appears after success']],
  ['responsive', 'Adapt a key screen of a {d} for mobile, tablet and desktop', 'Advanced', 60, ['Responsive', 'Layout'], 'A {d} was designed only for desktop.', ['3 breakpoints'], ['Mobile', 'Tablet', 'Desktop'], ['Reflow, don\'t shrink'], ['Navigation adapts per breakpoint', 'Content priority preserved', 'Targets sized for touch']],
];

let _all = null;
export function getChallenges() {
  if (_all) return _all;
  const composed = [];
  for (const [key, title, diff, min, skills, problem, cons, screens, ux, checklist] of TEMPLATES) {
    for (const [d, users] of DOMAINS) {
      const slug = d.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      composed.push({ id: `${key}--${slug}`, title: title.replace('{d}', d), difficulty: diff, minutes: min, skills, problem: problem.replace('{d}', d), users: users.charAt(0).toUpperCase() + users.slice(1) + '.', constraints: cons, screens, ux, ui: ['Use your spacing and type scale', 'Design all interactive states'], checklist, domain: d });
    }
  }
  _all = [...FLAGSHIP, ...composed];
  return _all;
}

/* ---------------- Guided projects ---------------- */
export const PROJECT_STEPS = [
  ['Research', 'Plan and run 5 interviews or a competitive analysis. Write 5 key insights.'],
  ['Persona', 'Create 1–2 personas from your research (use the Persona Builder).'],
  ['Problem statement', 'Write: "[User] needs [need] because [insight]." Add 3 How-Might-We questions.'],
  ['User journey', 'Map stages, actions, emotions and pain points.'],
  ['Information architecture', 'Draft a sitemap; validate labels with 5 people.'],
  ['User flow', 'Diagram the main task including decisions and error paths (use the Flow Lab).'],
  ['Wireframe', 'Sketch low-fi, then mid-fi wireframes for key screens.'],
  ['UI', 'Apply type scale, color tokens, spacing and components.'],
  ['Prototype', 'Link screens in Figma for the main task.'],
  ['Testing', 'Test with 5 users; record success rate and issues.'],
  ['Iteration', 'Fix the top 3 issues and re-test the riskiest one.'],
  ['Final case study', 'Write it up: problem, process, decisions, results, learnings.'],
];
export const PROJECTS = [
  ['food-delivery', 'Food Delivery App', 'Help office workers order lunch in under 2 minutes.', 'Intermediate'],
  ['healthcare', 'Healthcare App', 'Let caregivers book and manage appointments for family members.', 'Intermediate'],
  ['university-portal', 'University Portal', 'Make course registration stress-free.', 'Advanced'],
  ['ecommerce', 'E-commerce Website', 'Increase trust and reduce cart abandonment for a fashion store.', 'Intermediate'],
  ['banking', 'Banking App', 'Make everyday transfers fast and error-proof.', 'Advanced'],
  ['lms', 'Learning Management System', 'Help students keep up with assignments and deadlines.', 'Intermediate'],
  ['gov-portal', 'Government Service Portal', 'Make a certificate application accessible to everyone.', 'Advanced'],
  ['hospital-mgmt', 'Hospital Management System', 'Help reception staff manage patient queues.', 'Advanced'],
  ['saas-dashboard', 'SaaS Dashboard', 'Give small business owners a clear daily overview.', 'Advanced'],
  ['social-app', 'Social App', 'Help hobby communities share events without noise.', 'Intermediate'],
].map(([id, title, goal, difficulty]) => ({ id, title, goal, difficulty }));
