/* ==========================================================================
   Exam question bank (lesson & law mini-quizzes are merged in automatically
   by content.js). Types: mcq, tf, multi, match, scenario, law, critique.
   ========================================================================== */
let n = 0;
const id = () => 'q' + (++n).toString().padStart(3, '0');
const mcq = (q, options, answer, explain, tags) => ({ id: id(), type: 'mcq', q, options, answer, explain, tags });
const tf = (q, answer, explain, tags) => ({ id: id(), type: 'tf', q, answer, explain, tags });
const multi = (q, options, answer, explain, tags) => ({ id: id(), type: 'multi', q, options, answer, explain, tags });
const match = (q, pairs, explain, tags) => ({ id: id(), type: 'match', q, pairs, explain, tags });
const sc = (scenario, q, options, answer, explain, tags) => ({ id: id(), type: 'scenario', scenario, q, options, answer, explain, tags });
const law = (scenario, answer, explain, tags, opts = ["Fitts's Law", "Hick's Law", "Jakob's Law", "Miller's Law"]) => ({ id: id(), type: 'law', scenario, q: 'Which UX law best explains this?', options: opts, answer, explain, tags });
const crit = (mock, q, options, answer, explain, tags) => ({ id: id(), type: 'critique', mock, q, options, answer, explain, tags });

export const QUESTIONS = [
  // Fundamentals
  mcq('Which ISO 9241-11 component is measured by "time on task"?', ['Effectiveness', 'Efficiency', 'Satisfaction', 'Accessibility'], 1, 'Efficiency relates to resources (time, effort) used to achieve goals.', ['usability', 'metrics']),
  tf('Usability and utility mean the same thing.', false, 'Utility is whether it does what users need; usability is how easy it is to use. Useful = utility + usability.', ['ux-basics']),
  mcq('Which is the best description of UX design?', ['Choosing colors and fonts', 'Shaping the whole experience of using a product through research, structure and validation', 'Writing front-end code', 'Creating brand logos'], 1, 'UX covers the entire experience, not just visuals.', ['ux-basics']),
  multi('Select the facets of Morville\'s UX honeycomb.', ['Useful', 'Findable', 'Profitable', 'Credible', 'Viral'], [0, 1, 3], 'The facets are useful, usable, desirable, findable, accessible, credible, valuable.', ['ux-basics']),
  tf('A slip is an error caused by a wrong mental model.', false, 'That is a mistake. A slip is an attention or execution error, like a typo.', ['errors']),
  mcq('Which phrase best captures human-centered design?', ['Design what stakeholders request', 'Iterate based on users\' needs and evaluation with real users', 'Follow trends', 'Ship fast, test never'], 1, 'HCD centers users and evaluates iteratively.', ['process']),
  mcq('In design thinking, the Define phase produces…', ['Prototypes', 'A problem statement', 'Survey data', 'Final UI'], 1, 'Define synthesizes research into a clear problem statement.', ['process']),
  // HCI
  mcq('A door with a pull handle that must be pushed has a problem with…', ['Signifiers', 'Color', 'Typography', 'Grid'], 0, 'The handle signals "pull" — a misleading signifier (a "Norman door").', ['affordance']),
  tf('Recognition is generally easier for users than recall.', true, 'Seeing options requires less memory than retrieving them.', ['memory']),
  mcq('Which reduces extraneous cognitive load?', ['Adding decorative animations', 'Using consistent patterns and removing clutter', 'Hiding labels', 'Adding more options'], 1, 'Consistency and simplicity free capacity for the actual task.', ['cognition']),
  match('Match each concept to its example.', [['Affordance', 'A raised button invites pressing'], ['Signifier', 'Underlined link text'], ['Constraint', 'Date picker blocks past dates'], ['Mapping', 'Volume slider: right = louder']], 'These are Norman\'s core interaction concepts.', ['affordance', 'hci']),
  sc('A banking app moved "Send money" from the first tab to a "More" menu in an update. Calls to support doubled.', 'Which human factor was most overlooked?', ['Color perception', 'Habit and established mental models', 'Font loading', 'Screen size'], 1, 'Moving a habitual action breaks muscle memory and mental models.', ['behavior', 'mental-models']),
  mcq('Nielsen\'s first heuristic is…', ['Error prevention', 'Visibility of system status', 'Aesthetic design', 'Help and documentation'], 1, 'Keep users informed through timely feedback.', ['feedback', 'heuristics']),
  tf('Users tend to read web pages word by word.', false, 'They scan, often in F or layer-cake patterns.', ['behavior']),
  // Laws
  law('Designers enlarge the "Pay" button and place it right below the order total on mobile.', 0, 'Bigger, closer targets are faster to acquire.', ['fitts']),
  law('A food app shows 40 cuisine categories on the home screen; users take long to choose.', 1, 'More choices → longer decision time.', ['hick']),
  law('Users expect the logo in the top-left to return to the homepage.', 2, 'Users transfer expectations from other sites.', ['jakob']),
  law('A 16-digit card number is displayed in groups of four.', 3, 'Chunking helps working memory.', ['miller']),
  law('Users remember a hotel stay mostly by the friendly checkout and a broken AC on night two.', 2, 'Peak and end dominate memory.', ['peak-end'], ['Zeigarnik Effect', 'Doherty Threshold', 'Peak-End Rule', 'Serial Position Effect']),
  law('A profile shows "80% complete — add a photo" and many users finish it.', 0, 'Unfinished tasks stay in mind.', ['zeigarnik'], ['Zeigarnik Effect', 'Law of Similarity', "Occam's Razor", "Postel's Law"]),
  law('A form accepts phone numbers with spaces, dashes and Bangla digits.', 3, 'Be liberal in what you accept.', ['postel'], ["Fitts's Law", "Tesler's Law", 'Pareto Principle', "Postel's Law"]),
  law('Users perceive a polished prototype as easier to use even though they failed tasks.', 1, 'Aesthetics inflate perceived usability.', ['aesthetic-usability'], ['Von Restorff Effect', 'Aesthetic-Usability Effect', "Jakob's Law", 'Law of Continuity']),
  law('One pricing plan has a colored border and "Most popular" badge, and it gets noticed most.', 0, 'The distinct item stands out.', ['von-restorff'], ['Von Restorff Effect', "Parkinson's Law", 'Law of Common Region', "Miller's Law"]),
  law('The app detects card type from the number instead of asking.', 1, 'The system absorbs inherent complexity.', ['tesler'], ['Law of Proximity', "Tesler's Law", 'Peak-End Rule', "Hick's Law"]),
  law('Response appears within 300 ms, keeping users in flow.', 2, 'Sub-400 ms responses keep users engaged.', ['doherty'], ['Goal-Gradient Effect', 'Serial Position Effect', 'Doherty Threshold', 'Law of Prägnanz']),
  law('Form labels placed closer to their own input than to others are read correctly.', 0, 'Nearby elements are grouped.', ['proximity', 'gestalt'], ['Law of Proximity', 'Law of Similarity', "Jakob's Law", 'Pareto Principle']),
  law('Settings rows grouped inside rounded boxes are perceived as sections.', 1, 'A shared boundary groups elements.', ['common-region', 'gestalt'], ['Law of Continuity', 'Law of Common Region', 'Zeigarnik Effect', "Fitts's Law"]),
  law('A carousel shows a half-visible card at the edge, so users swipe.', 3, 'The eye follows the line and expects continuation.', ['continuity', 'gestalt'], ['Law of Prägnanz', 'Peak-End Rule', "Occam's Razor", 'Law of Continuity']),
  law('80% of sessions use 4 features; the team prioritizes those.', 2, 'The vital few produce most outcomes.', ['pareto'], ["Hick's Law", "Tesler's Law", 'Pareto Principle', 'Doherty Threshold']),
  law('Coffee card with 2 of 12 stamps pre-filled gets completed faster.', 0, 'Effort increases near the goal.', ['goal-gradient'], ['Goal-Gradient Effect', 'Von Restorff Effect', 'Law of Similarity', "Miller's Law"]),
  law('Users best recall the first and last items of a 9-item navigation bar.', 1, 'Primacy and recency.', ['serial-position'], ['Law of Prägnanz', 'Serial Position Effect', "Postel's Law", 'Doherty Threshold']),
  match('Match each law to its core idea.', [["Fitts's Law", 'Size and distance of targets'], ["Hick's Law", 'Number of choices'], ["Jakob's Law", 'Conventions from other products'], ['Peak-End Rule', 'Memory of experiences']], 'Core definitions of four foundational laws.', ['fitts', 'hick', 'jakob', 'peak-end']),
  tf('Miller\'s Law means navigation menus must never have more than 7 items.', false, 'Visible items don\'t need memorizing; the takeaway is chunking.', ['miller']),
  tf('Hick\'s Law applies equally to scanning an alphabetical list for a known item.', false, 'Searching a sorted list for a known item is not a choice among equally likely options.', ['hick']),
  // Research
  mcq('Which research method best reveals WHY users abandon checkout?', ['Analytics funnel', 'User interviews and usability tests', 'A/B test', 'Server logs'], 1, 'Qualitative methods explain why; analytics show where.', ['research']),
  mcq('Which is a leading question?', ['Tell me about the last time you ordered food.', 'Wouldn\'t it be great to reorder in one tap?', 'What happened next?', 'How did you pay?'], 1, 'It suggests the desired answer.', ['interviews', 'research']),
  multi('Which methods are primarily quantitative?', ['A/B testing', 'Surveys', 'Contextual inquiry', 'Analytics', 'Diary study'], [0, 1, 3], 'They measure with larger samples and numbers.', ['research']),
  tf('Focus groups are a good method for usability testing.', false, 'Groupthink and lack of individual task observation make them unsuitable.', ['research']),
  mcq('Card sorting is mainly used to inform…', ['Visual design', 'Information architecture', 'Pricing', 'Performance'], 1, 'It reveals users\' mental models of categories.', ['ia', 'research']),
  mcq('Tree testing evaluates…', ['Color contrast', 'Findability in a text hierarchy', 'Animation speed', 'Loading time'], 1, 'It isolates IA from visual design.', ['ia', 'research']),
  sc('You have 2 days and no budget to evaluate a new onboarding flow before a usability study.', 'Which method fits best?', ['A/B test with 10,000 users', 'Heuristic evaluation by 3 colleagues', 'Diary study for 2 weeks', 'National survey'], 1, 'Heuristic evaluation is fast and cheap for catching obvious issues first.', ['heuristics', 'research']),
  match('Match method to output.', [['Card sorting', 'Similarity matrix'], ['Usability testing', 'Issue list with severity'], ['Survey', 'Charts of response distribution'], ['Affinity mapping', 'Themes and insights']], 'Each method has characteristic deliverables.', ['research']),
  mcq('About how many participants per segment typically uncover most major usability issues in one qualitative round?', ['1', '5', '50', '500'], 1, 'Run small rounds iteratively.', ['usability-testing']),
  mcq('Which is a proto-persona?', ['A persona from 20 interviews', 'A team\'s assumption-based persona to validate', 'A persona of who you\'re not designing for', 'A celebrity'], 1, 'Proto-personas capture hypotheses.', ['personas']),
  // IA & flows
  mcq('A happy path is…', ['The flow with the most errors', 'The default flow with no errors or exceptions', 'The flow for admins', 'The shortest page'], 1, 'Design it first, then add unhappy paths.', ['flow']),
  multi('Which are good navigation labels?', ['Track order', 'Solutions Hub', 'Pay bills', 'Synergy Center', 'Returns'], [0, 2, 4], 'They use users\' words and are specific.', ['ia']),
  tf('Every screen should be designed for empty, loading, error, partial and ideal states.', true, 'Screens have multiple states beyond the ideal.', ['states', 'flow']),
  mcq('In flow diagrams, a diamond usually represents…', ['A screen', 'A decision point', 'The start', 'An error'], 1, 'Diamonds branch the flow.', ['flow']),
  // A11y
  mcq('WCAG AA minimum contrast for normal body text is…', ['2:1', '3:1', '4.5:1', '7:1'], 2, '4.5:1 for normal text, 3:1 for large text.', ['a11y', 'color']),
  tf('Removing focus outlines is fine if the design looks cleaner.', false, 'Keyboard users need visible focus (WCAG 2.4.7).', ['a11y']),
  multi('Which practices improve form accessibility?', ['Visible labels linked to inputs', 'Placeholder as the only label', 'Error text associated with the field', 'Color-only error indication', 'Autocomplete attributes'], [0, 2, 4], 'Labels, associated errors and autocomplete help everyone.', ['a11y', 'forms']),
  mcq('A decorative image should have…', ['alt="image"', 'alt="" (empty)', 'No alt attribute', 'A long description'], 1, 'Empty alt makes screen readers skip it.', ['a11y']),
  mcq('Minimum recommended touch target per Apple guidelines is…', ['24 pt', '32 pt', '44 pt', '64 pt'], 2, 'Apple HIG recommends 44 pt; Material 48 dp.', ['a11y', 'mobile', 'fitts']),
  sc('A status table shows green and red dots only.', 'What is the main accessibility issue?', ['Dots are too round', 'Color is the only means of conveying information', 'Table too wide', 'Font too thin'], 1, 'WCAG 1.4.1 — add text or icons.', ['a11y', 'color']),
  // UI
  mcq('A good body text line length is roughly…', ['15–25 characters', '45–80 characters', '120–160 characters', 'As wide as the screen'], 1, '45–80 characters supports comfortable reading.', ['typography']),
  mcq('In forms, the best layout is usually…', ['Multi-column', 'Single column', 'Random grid', 'Horizontal scroll'], 1, 'Single columns avoid zig-zag scanning and skipped fields.', ['layout', 'forms']),
  tf('Components should consume semantic tokens (e.g. text/primary) rather than raw colors.', true, 'This enables theming and consistent updates.', ['tokens', 'design-systems']),
  mcq('Which button set has the best hierarchy?', ['Four filled buttons', 'One primary filled, one secondary outlined', 'Three ghost buttons', 'All buttons red'], 1, 'One primary per view; others quieter.', ['components']),
  match('Match the component to its best use.', [['Toggle', 'Immediate on/off setting'], ['Radio buttons', 'Choose one of few visible options'], ['Checkbox', 'Select multiple independent options'], ['Select', 'Choose one from many options']], 'Choosing the right control prevents confusion.', ['components', 'forms']),
  tf('Dark mode should use pure black (#000) surfaces for best results.', false, 'Use dark greys; pure black increases contrast vibration and hides elevation.', ['color', 'theming']),
  mcq('A spacing system based on multiples of 4 or 8 primarily provides…', ['Faster loading', 'Consistency and rhythm', 'Better SEO', 'More colors'], 1, 'Consistent steps make layout decisions faster and coherent.', ['layout']),
  // Figma
  mcq('Which Figma feature behaves most like CSS flexbox?', ['Constraints', 'Auto Layout', 'Masks', 'Boolean groups'], 1, 'Auto Layout arranges children with direction, gap and padding.', ['figma']),
  mcq('Shortcut to create a component in Figma:', ['Ctrl/Cmd + G', 'Ctrl/Cmd + Alt + K', 'Shift + A', 'Ctrl/Cmd + D'], 1, 'Shift+A adds auto layout; Ctrl+G groups.', ['figma']),
  tf('Changing a main component updates all of its instances.', true, 'Instances inherit from the main component, except overrides.', ['figma', 'components']),
  mcq('Figma variable modes are commonly used for…', ['Exporting PNGs', 'Light/Dark themes', 'Version history', 'Comments'], 1, 'Modes switch variable values, e.g. themes.', ['figma', 'tokens']),
  match('Match the Figma shortcut.', [['F', 'Frame tool'], ['R', 'Rectangle'], ['T', 'Text'], ['Shift + A', 'Add Auto Layout']], 'Core Figma shortcuts.', ['figma']),
  mcq('What does "Hug contents" do in Auto Layout?', ['Fills the parent', 'Sizes the frame to fit its children', 'Locks the size', 'Hides overflow'], 1, 'Hug shrinks/grows to fit content.', ['figma']),
  // Critique
  crit({ frame: 'phone', nodes: [['h', { t: 'Checkout' }], ['input', { ph: 'Name' }], ['input', { ph: 'Phone' }], ['row', { between: 1 }, [['btn', { t: 'Reset', v: 'primary', size: 'sm' }], ['btn', { t: 'Order', v: 'primary', size: 'sm' }]]]] }, 'What is the most serious problem?', ['The heading is too short', 'A "Reset" button styled like "Order" sits next to it, risking data loss', 'The inputs are grey', 'There are only two fields'], 1, 'Similar styling and proximity invite accidental resets (error prevention).', ['errors', 'buttons']),
  crit({ frame: 'phone', nodes: [['h', { t: 'Settings' }], ['p', { t: 'Notifications', lowc: 1 }], ['p', { t: 'Privacy', lowc: 1 }], ['p', { t: 'Delete account', lowc: 1 }]] }, 'Identify the design mistake.', ['Too much contrast', 'Text contrast is too low to read', 'Too many settings', 'Missing logo'], 1, 'Low contrast fails WCAG and hurts everyone.', ['a11y', 'color']),
  crit({ frame: 'phone', nodes: [['h', { t: 'Shop' }], ['tabbar', { items: ['1', '2', '3', '4', '5', '6', '7'], active: 0, nolabel: 1 }]] }, 'Identify the design mistake.', ['Tab bar should be at the top', 'Seven unlabeled icon tabs are hard to understand and tap', 'Tabs need gradients', 'Title too large'], 1, 'Limit to 3–5 labeled tabs.', ['navigation', 'mobile']),
  crit({ frame: 'component', nodes: [['label', { t: 'Phone' }], ['input', { val: '01712 345678', err: 1 }], ['hint', { t: 'Invalid input.', err: 1 }]] }, 'What is wrong with this validation?', ['Nothing', 'It rejects a valid number with spaces and gives a vague message', 'The label is above the field', 'The input is too wide'], 1, 'Apply Postel\'s Law and specific messages.', ['postel', 'errors']),

  // Additional Figma
  mcq('Which Auto Layout setting makes a child stretch to the parent\'s width?', ['Hug contents', 'Fill container', 'Fixed width', 'Absolute position'], 1, 'Fill container stretches to available space.', ['figma']),
  tf('Groups in Figma support Auto Layout and clipping just like frames.', false, 'Frames support auto layout, clipping and constraints; groups don\'t.', ['figma']),
  mcq('What is the main benefit of variants?', ['Smaller file size', 'Organizing related component versions under properties', 'Exporting PNGs', 'Adding comments'], 1, 'Variants group component versions (Size, State) in one set.', ['figma', 'components']),
  mcq('Where do developers inspect spacing, CSS and variables?', ['Prototype tab', 'Dev Mode', 'Version history', 'FigJam'], 1, 'Dev Mode is built for inspection and handoff.', ['figma']),
  mcq('Interactive components let you…', ['Animate between variants inside the component itself', 'Write JavaScript', 'Publish websites', 'Import fonts'], 0, 'Interactions defined between variants work in every instance.', ['figma', 'prototype']),
  tf('Constraints control how layers behave when a non-auto-layout parent frame is resized.', true, 'Constraints apply relative to the parent frame.', ['figma']),
  mcq('A good component naming pattern in Figma is…', ['Rectangle 42', 'Button/Primary/Large', 'final_final_v3', 'blue button'], 1, 'Slash naming creates organized, predictable hierarchies.', ['figma', 'design-systems']),
  multi('Which are typical Figma variable types?', ['Color', 'Number', 'String', 'Boolean', 'Image'], [0, 1, 2, 3], 'Figma variables support color, number, string and boolean.', ['figma', 'tokens']),
  // Additional IA / flows / states
  mcq('A broad and shallow navigation structure means…', ['Few top-level items, many levels', 'More top-level items, fewer levels', 'No navigation', 'Only search'], 1, 'Broad and shallow usually improves findability over deep hierarchies.', ['ia', 'navigation']),
  tf('Breadcrumbs should show the user\'s browsing history.', false, 'Breadcrumbs reflect hierarchy (location), not history.', ['navigation', 'ia']),
  mcq('Which zero-results page is best?', ['"0 results."', 'Repeats the query, suggests spelling fixes and popular categories', 'Redirects to home', 'Shows an error code'], 1, 'Zero results should never be a dead end.', ['search', 'states']),
  mcq('Low-fidelity wireframes are most useful for…', ['Testing brand colors', 'Discussing structure and flow quickly', 'Final developer handoff', 'Marketing'], 1, 'They keep feedback on structure, not visuals.', ['wireframe']),
  sc('A prototype only shows screens where everything succeeds. Testing starts tomorrow.', 'What is most important to add?', ['More animations', 'Key error and empty states', 'A dark theme', 'A logo'], 1, 'Unhappy paths reveal the real experience.', ['flow', 'states', 'prototype']),
  // Additional accessibility
  mcq('Which element is keyboard-accessible by default?', ['<div onclick>', '<button>', '<span>', '<img>'], 1, 'Native buttons get focus and Enter/Space activation for free.', ['a11y']),
  tf('Captions help deaf users and people in noisy places.', true, 'Accessible features benefit many situations (curb-cut effect).', ['a11y']),
  mcq('Large text in WCAG needs at least which contrast ratio for AA?', ['2:1', '3:1', '4.5:1', '7:1'], 1, 'Large text (≥24 px or ≥19 px bold) needs 3:1.', ['a11y', 'color']),
  multi('Which respect motion sensitivity?', ['Honoring prefers-reduced-motion', 'Auto-playing parallax', 'Pause control for carousels', 'Flashing 5 times per second'], [0, 2], 'Reduce motion and let users pause; never flash > 3/sec.', ['a11y', 'motion']),
];

/* Exam definitions — tags select pools; the engine randomizes per attempt. */
export const EXAMS = [
  { id: 'ux-fundamentals', title: 'UX Fundamentals', desc: 'Usability, utility, honeycomb, errors and design process.', tags: ['ux-basics', 'usability', 'errors', 'process', 'mindset', 'metrics', 'trust', 'emotion', 'memory'], count: 15, minutes: 12, pass: 70, level: 'Beginner' },
  { id: 'ux-laws', title: 'UX Laws', desc: 'Identify and apply the laws of UX.', tags: ['fitts', 'hick', 'jakob', 'miller', 'peak-end', 'zeigarnik', 'postel', 'aesthetic-usability', 'von-restorff', 'tesler', 'doherty', 'proximity', 'common-region', 'continuity', 'pareto', 'goal-gradient', 'serial-position', 'gestalt', 'similarity', 'pragnanz', 'occam', 'parkinson'], count: 20, minutes: 15, pass: 70, level: 'Intermediate' },
  { id: 'hci', title: 'Human Interaction', desc: 'Perception, cognition, affordances and behavior.', tags: ['hci', 'affordance', 'cognition', 'memory', 'behavior', 'mental-models', 'feedback', 'attention', 'decision', 'heuristics'], count: 15, minutes: 12, pass: 70, level: 'Intermediate' },
  { id: 'ux-research', title: 'UX Research', desc: 'Methods, questions, synthesis and personas.', tags: ['research', 'interviews', 'usability-testing', 'personas', 'heuristics', 'surveys', 'metrics'], count: 15, minutes: 12, pass: 70, level: 'Intermediate' },
  { id: 'ia-flows', title: 'IA, Flows & States', desc: 'Navigation, labels, flows and screen states.', tags: ['ia', 'flow', 'states', 'navigation', 'search', 'wireframe', 'prototype'], count: 12, minutes: 10, pass: 70, level: 'Intermediate' },
  { id: 'accessibility', title: 'Accessibility', desc: 'WCAG, contrast, keyboard, forms and inclusive design.', tags: ['a11y'], count: 12, minutes: 10, pass: 70, level: 'Intermediate' },
  { id: 'ui-design', title: 'UI Design', desc: 'Typography, color, layout, components and systems.', tags: ['typography', 'color', 'layout', 'components', 'design-systems', 'tokens', 'theming', 'forms', 'buttons'], count: 15, minutes: 12, pass: 70, level: 'Intermediate' },
  { id: 'figma', title: 'Figma', desc: 'Interface, Auto Layout, components, variables, prototyping.', tags: ['figma'], count: 12, minutes: 10, pass: 70, level: 'Beginner' },
  { id: 'critique', title: 'Design Critique', desc: 'Spot the mistake in real-looking screens.', types: ['critique', 'scenario', 'law'], count: 12, minutes: 12, pass: 70, level: 'Advanced' },
  { id: 'mixed', title: 'Full UX/UI Mock Exam', desc: 'Everything, randomized — a professional readiness check.', count: 30, minutes: 25, pass: 75, level: 'Advanced' },
];
