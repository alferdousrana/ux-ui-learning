/* ==========================================================================
   GOOD vs BAD Visual Lab. Each comparison is declarative: mock UI specs are
   rendered by js/ui/mock.js, so 1000+ examples cost only data, not images.
   Schema: { id, title, category, principles[], laws[], tags[],
             good:{frame, nodes, points[]}, bad:{frame, nodes, points[]},
             whyGood, whyBad, fix }
   ========================================================================== */
export const COMPARE_CATEGORIES = ['Forms', 'Buttons', 'Navigation', 'Checkout', 'Login', 'Feedback', 'Errors', 'Search', 'Onboarding', 'Cards', 'Accessibility', 'Layout', 'Typography'];

const X = (id, title, category, principles, laws, good, bad, whyGood, whyBad, fix, tags = []) => ({ id: 'cmp-' + id, title, category, principles, laws, good, bad, whyGood, whyBad, fix, tags });

export const COMPARISONS = [
  X('form-labels', 'Form labels', 'Forms', ['Recognition over recall', 'Error prevention'], ['proximity'],
    { frame: 'phone', nodes: [['h', { t: 'Delivery address' }], ['label', { t: 'Full name', req: 1 }], ['input', { val: 'Rahim Uddin' }], ['label', { t: 'Phone', req: 1 }], ['input', { ph: '01XXX-XXXXXX' }], ['hint', { t: 'For the rider to call you' }], ['label', { t: 'Area' }], ['input', { val: 'Mirpur 10 ▾' }], ['btn', { t: 'Save address', v: 'primary', full: 1 }]], points: ['Labels always visible above fields', 'Helper text explains why', 'Required fields marked'] },
    { frame: 'phone', nodes: [['h', { t: 'Address' }], ['input', { val: 'Rahim Uddin' }], ['input', { ph: 'Phone' }], ['input', { ph: 'Area' }], ['input', { ph: 'Details' }], ['btn', { t: 'Submit', v: 'primary', full: 1 }]], points: ['Placeholders vanish when typing', 'Filled fields lose their meaning', 'Generic "Submit" label'] },
    'Persistent labels let users check what each field means after typing, and helper text reduces doubt.', 'Placeholder-only labels disappear, forcing users to remember (recall) and causing errors when reviewing.', 'Put a visible label above every field; use placeholders only for format examples; label the button with the outcome.', ['forms', 'a11y']),

  X('contrast', 'Text contrast', 'Accessibility', ['Perceivable (WCAG 1.4.3)'], ['aesthetic-usability'],
    { frame: 'component', nodes: [['h', { t: 'Your appointment' }], ['p', { t: 'Tuesday, 14 Oct at 10:30 AM with Dr. Jahan, Room 204.' }], ['btn', { t: 'Add to calendar', v: 'primary' }]], points: ['Body text ≥ 4.5:1 contrast', 'Readable in sunlight', 'Button text clearly visible'] },
    { frame: 'component', nodes: [['h', { t: 'Your appointment' }], ['p', { t: 'Tuesday, 14 Oct at 10:30 AM with Dr. Jahan, Room 204.', lowc: 1 }], ['btn', { t: 'Add to calendar', v: 'lowc' }]], points: ['Pale grey text fails WCAG', 'Unreadable outdoors or for low vision', 'Button looks disabled'] },
    'Sufficient contrast keeps essential information readable for everyone, including people with low vision and anyone outdoors.', 'Light grey on white looks "clean" but fails 4.5:1 and hides critical details.', 'Check every text/background pair with a contrast checker and use semantic text tokens that pass AA.', ['a11y', 'color']),

  X('error-message', 'Error messages', 'Errors', ['Help users recognize, diagnose and recover from errors'], ['postel'],
    { frame: 'phone', nodes: [['h', { t: 'Send money' }], ['label', { t: 'Recipient number' }], ['input', { val: '0171234567', err: 1 }], ['hint', { t: 'This number has 10 digits. Bangladeshi mobile numbers have 11 (e.g. 01712345678).', err: 1 }], ['label', { t: 'Amount' }], ['input', { val: '৳ 500' }], ['btn', { t: 'Continue', v: 'primary', full: 1 }]], points: ['Error appears next to the field', 'Says what is wrong and how to fix it', 'Input is preserved'] },
    { frame: 'phone', nodes: [['alert', { t: 'ERROR 0x8004: INVALID_PARAM msisdn', kind: 'raw' }], ['h', { t: 'Send money' }], ['input', { ph: 'Recipient number' }], ['input', { ph: 'Amount' }], ['btn', { t: 'Continue', v: 'primary', full: 1 }]], points: ['Technical code users can\'t understand', 'Far from the problem field', 'Fields were cleared'] },
    'A specific, plain-language message placed at the source lets users fix the problem immediately.', 'Cryptic codes blame the user, don\'t explain the fix, and clearing input forces retyping.', 'Write: what happened + how to fix, place it inline, keep input, and accept flexible formats (Postel).', ['errors', 'forms']),

  X('dashboard-clutter', 'Dashboard density', 'Layout', ['Minimalist design', 'Visual hierarchy'], ['hick', 'miller'],
    { frame: 'desktop', nodes: [['h', { t: 'Today' }], ['row', {}, [['card', {}, [['p', { t: 'Orders' }], ['h', { t: '128' }]]], ['card', {}, [['p', { t: 'Revenue' }], ['h', { t: '৳82k' }]]], ['card', {}, [['p', { t: 'Pending' }], ['h', { t: '6' }]]]]], ['bars', { v: [30, 45, 40, 60, 72] }], ['btn', { t: 'Review 6 pending orders', v: 'primary' }]], points: ['3 key metrics first', 'One chart answers one question', 'Clear next action'] },
    { frame: 'desktop', nodes: [['mess', { n: 34 }], ['row', {}, [['btn', { t: 'A', v: 'primary', size: 'sm' }], ['btn', { t: 'B', v: 'primary', size: 'sm' }], ['btn', { t: 'C', v: 'primary', size: 'sm' }], ['btn', { t: 'D', v: 'primary', size: 'sm' }]]], ['mess', { n: 24 }]], points: ['Everything has equal weight', 'No obvious starting point', 'High extraneous cognitive load'] },
    'Prioritized metrics and a single next action let managers understand status in seconds.', 'Showing every number at once overwhelms working memory and hides what matters.', 'Pick the 3–5 metrics tied to decisions, push the rest to detail pages, and add one clear action.', ['cognition', 'layout']),

  X('loading-feedback', 'Loading feedback', 'Feedback', ['Visibility of system status'], ['doherty'],
    { frame: 'phone', nodes: [['h', { t: 'Paying ৳1,510' }], ['spinner'], ['p', { t: 'Contacting bKash… don\'t close the app.' }], ['progress', { v: 60 }], ['btn', { t: 'Processing…', v: 'disabled', full: 1 }]], points: ['Immediate visual response', 'Explains what\'s happening', 'Button disabled to prevent double charge'] },
    { frame: 'phone', nodes: [['h', { t: 'Checkout' }], ['kv', { k: 'Total', v: '৳1,510', total: 1 }], ['btn', { t: 'Pay now', v: 'primary', full: 1 }], ['spacer', { h: 40 }], ['p', { t: '(nothing changes after tapping)' }]], points: ['No response after tap', 'Users tap again → double payment', 'Anxiety about money'] },
    'Instant feedback within ~100 ms and a clear status message keep users confident during waits.', 'Silent waits make users repeat actions or abandon — especially dangerous for payments.', 'Show pressed state immediately, disable the button, explain the wait, and confirm the result.', ['feedback', 'performance']),

  X('button-affordance', 'Button affordance', 'Buttons', ['Affordance & signifiers'], ['von-restorff', 'fitts'],
    { frame: 'component', nodes: [['p', { t: 'Ready to publish your course?' }], ['row', {}, [['btn', { t: 'Publish course', v: 'primary' }], ['btn', { t: 'Save draft', v: 'secondary' }]]]], points: ['Looks clickable (shape, fill)', 'Clear primary vs secondary', 'Verb labels'] },
    { frame: 'component', nodes: [['p', { t: 'Ready to publish your course?' }], ['p', { t: 'publish   draft   cancel' }]], points: ['Plain text — no signifier', 'No hierarchy', 'Ambiguous lowercase words'] },
    'Visual shape, fill and hierarchy communicate what is clickable and which action matters most.', 'Text that is secretly a button fails affordance; users don\'t know where to click.', 'Use your button component with clear hierarchy and verb-first labels.', ['buttons', 'affordance']),

  X('desktop-nav-hidden', 'Hidden desktop navigation', 'Navigation', ['Visibility', 'Recognition over recall'], ['jakob'],
    { frame: 'desktop', nodes: [['nav', { items: ['ShopBD', 'Women', 'Men', 'Kids', 'Home', 'Deals'], active: 1, brand: 1 }], ['p', { t: 'Category page…' }]], points: ['Sections visible at a glance', 'Current section highlighted', 'One click to any category'] },
    { frame: 'desktop', nodes: [['header', { t: 'ShopBD' }], ['p', { t: 'Category page…' }]], points: ['Wide screen yet menu hidden', 'Users don\'t discover sections', 'Extra click every time'] },
    'Visible navigation shows the scope of the site and supports discovery.', 'Hiding navigation behind a hamburger on desktop reduces discoverability and engagement.', 'Show top-level navigation on wide screens; reserve the hamburger for small screens or secondary items.', ['navigation']),

  X('mobile-nav', 'Mobile navigation', 'Navigation', ['Visibility', 'Consistency'], ['fitts', 'jakob'],
    { frame: 'phone', nodes: [['h', { t: 'Home' }], ['card', {}, [['p', { t: 'Continue: UX Laws' }], ['progress', { v: 45 }]]], ['tabbar', { items: ['Home', 'Learn', 'Practice', 'Profile'], active: 0 }]], points: ['4 labeled tabs', 'Reachable by thumb', 'Active tab obvious'] },
    { frame: 'phone', nodes: [['header', { t: 'App' }], ['card', {}, [['p', { t: 'Continue: UX Laws' }]]], ['tabbar', { items: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], active: 2, nolabel: 1 }]], points: ['7 unlabeled icons', 'Hard to guess meanings', 'Targets too small'] },
    'A few labeled destinations at the bottom are visible, guessable and easy to reach.', 'Too many unlabeled icons force guessing and mis-taps.', 'Limit to 3–5 labeled tabs; move the rest into a "More" or profile area.', ['navigation', 'mobile']),

  X('search', 'Search experience', 'Search', ['Error tolerance', 'Recognition'], ['postel'],
    { frame: 'phone', nodes: [['search', { val: 'bryani', sugg: ['Showing results for <mark>biryani</mark>', 'Kacchi <mark>biryani</mark> · 12 places', 'Chicken <mark>biryani</mark> · 18 places'] }], ['chips', { items: ['Under 30 min', 'Free delivery'] }]], points: ['Typo corrected automatically', 'Suggestions with counts', 'Quick filters'] },
    { frame: 'phone', nodes: [['search', { val: 'bryani' }], ['alert', { t: 'No results found.', kind: 'warn' }]], points: ['No typo tolerance', 'Dead end', 'No suggestions or alternatives'] },
    'Tolerant search meets people where they are and keeps them moving.', 'A strict match on a typo ends the journey.', 'Add spelling correction, synonyms, suggestions and a helpful zero-results page.', ['search', 'ia']),

  X('thumb-zone', 'Thumb-zone actions', 'Layout', ['Efficiency'], ['fitts'],
    { frame: 'phone', nodes: [['h', { t: 'Ride to Gulshan 2' }], ['kv', { k: 'Fare', v: '৳280' }], ['kv', { k: 'Pickup', v: '3 min' }], ['spacer', { h: 70 }], ['btn', { t: 'Confirm ride', v: 'primary', full: 1, size: 'lg' }]], points: ['Primary action at bottom', 'Large target', 'One-handed use'] },
    { frame: 'phone', nodes: [['row', { between: 1 }, [['h', { t: 'Ride' }], ['btn', { t: 'confirm', v: 'ghost', size: 'sm' }]]], ['kv', { k: 'Fare', v: '৳280' }], ['kv', { k: 'Pickup', v: '3 min' }], ['spacer', { h: 90 }]], points: ['Tiny action top-right', 'Needs two hands', 'Easy to miss'] },
    'Large primary actions near the thumb are faster and more accurate (Fitts\'s Law).', 'Small targets far from the thumb slow users and cause mis-taps.', 'Move primary actions to the bottom area with ≥ 48 px height.', ['mobile', 'fitts']),

  X('empty-state', 'Empty states', 'Feedback', ['Help and guidance'], ['zeigarnik'],
    { frame: 'phone', nodes: [['h', { t: 'Saved courses' }], ['col', { center: 1 }, [['img', { h: 60, t: '📚' }], ['h', { t: 'Nothing saved yet', size: 'sm' }], ['p', { t: 'Tap the bookmark on any course to find it here later.' }], ['btn', { t: 'Browse courses', v: 'primary' }]]]], points: ['Explains why it\'s empty', 'Teaches how to fill it', 'One clear action'] },
    { frame: 'phone', nodes: [['h', { t: 'Saved courses' }], ['spacer', { h: 40 }], ['p', { t: 'No data' }]], points: ['Feels broken', 'No guidance', 'Dead end'] },
    'A purposeful empty state onboards users and turns a blank screen into a next step.', '"No data" looks like an error and gives no direction.', 'Write what will appear here, how to add it, and offer the action.', ['states']),

  X('touch-target', 'Touch target size', 'Accessibility', ['Operable (WCAG 2.5.8)'], ['fitts'],
    { frame: 'phone', nodes: [['h', { t: 'Quantity' }], ['row', {}, [['btn', { t: '−', v: 'secondary', size: 'lg' }], ['h', { t: '2' }], ['btn', { t: '+', v: 'secondary', size: 'lg' }]]], ['btn', { t: 'Add to cart', v: 'primary', full: 1, size: 'lg' }]], points: ['48 px targets', 'Space between controls', 'Easy for shaky hands'] },
    { frame: 'phone', nodes: [['h', { t: 'Quantity' }], ['row', {}, [['btn', { t: '−', v: 'secondary', size: 'sm' }], ['p', { t: '2' }], ['btn', { t: '+', v: 'secondary', size: 'sm' }], ['btn', { t: 'del', v: 'danger', size: 'sm' }]]], ['btn', { t: 'Add', v: 'primary', size: 'sm' }]], points: ['Tiny targets', 'Delete next to +', 'High mis-tap risk'] },
    'Large, spaced targets reduce errors for everyone, especially older users and people on the move.', 'Small, crowded targets cause mis-taps — sometimes destructive ones.', 'Use ≥ 44–48 px targets and separate destructive actions.', ['a11y', 'mobile']),

  X('type-hierarchy', 'Typographic hierarchy', 'Typography', ['Visual hierarchy'], ['von-restorff'],
    { frame: 'component', nodes: [['h', { t: 'Exam results published', size: 'lg' }], ['p', { t: 'HSC 2026 results are now available.' }], ['p', { t: 'Check your result with your roll number and board.' }], ['btn', { t: 'Check result', v: 'primary' }]], points: ['Clear headline', 'Supporting text smaller', 'Obvious action'] },
    { frame: 'component', nodes: [['p', { t: 'Exam results published' }], ['p', { t: 'HSC 2026 results are now available.' }], ['p', { t: 'Check your result with your roll number and board.' }], ['p', { t: 'Check result' }]], points: ['Everything same size', 'No entry point', 'Action looks like text'] },
    'Size and weight tell readers what matters first.', 'Uniform text forces reading everything to find the point.', 'Use a type scale with 3–4 levels and a distinct action style.', ['typography']),

  X('form-spacing', 'Spacing and grouping', 'Forms', ['Visual grouping'], ['proximity', 'common-region'],
    { frame: 'phone', nodes: [['h', { t: 'Payment' }], ['card', { flat: 1 }, [['label', { t: 'Card number' }], ['input', { val: '4242 4242 4242 4242' }], ['row', {}, [['col', {}, [['label', { t: 'Expiry' }], ['input', { val: '08/28' }]]], ['col', {}, [['label', { t: 'CVC' }], ['input', { val: '123' }]]]]]]], ['spacer', { h: 6 }], ['card', { flat: 1 }, [['label', { t: 'Name on card' }], ['input', { val: 'NUSRAT JAHAN' }]]]], points: ['Labels close to their inputs', 'Related fields grouped', 'Clear sections'] },
    { frame: 'phone', nodes: [['h', { t: 'Payment' }], ['label', { t: 'Card number' }], ['spacer', { h: 10 }], ['input', { val: '4242424242424242' }], ['spacer', { h: 10 }], ['label', { t: 'Expiry' }], ['spacer', { h: 10 }], ['input', { val: '08/28' }], ['spacer', { h: 10 }], ['label', { t: 'CVC' }], ['spacer', { h: 10 }], ['input', { val: '123' }]], points: ['Equal gaps everywhere', 'Labels float between fields', 'No grouping'] },
    'Tighter spacing within groups and larger spacing between groups make structure obvious.', 'Equal spacing removes grouping cues, so labels look attached to the wrong fields.', 'Use a spacing scale: ~4–8 px label-to-field, 16–24 px between fields, 32 px between sections.', ['layout', 'gestalt']),

  X('choice-overload', 'Choice overload', 'Checkout', ['Simplicity'], ['hick', 'von-restorff'],
    { frame: 'component', nodes: [['h', { t: 'Choose a plan', size: 'sm' }], ['row', {}, [['card', {}, [['p', { t: 'Basic' }], ['h', { t: '৳199' }]]], ['card', {}, [['badge', { t: 'BEST VALUE' }], ['p', { t: 'Standard' }], ['h', { t: '৳399' }]]], ['card', {}, [['p', { t: 'Family' }], ['h', { t: '৳699' }]]]]]], points: ['3 options', 'Recommended highlighted', 'Easy comparison'] },
    { frame: 'component', nodes: [['h', { t: 'Choose a plan', size: 'sm' }], ['list', { dense: 1, items: ['Lite ৳99', 'Lite+ ৳149', 'Basic ৳199', 'Basic Plus ৳249', 'Standard ৳399', 'Standard XL ৳449', 'Premium ৳599', 'Premium+ ৳649', 'Family ৳699', 'Family Max ৳799'] }]], points: ['10 similar plans', 'No guidance', 'Decision paralysis'] },
    'Few, distinct options with a recommendation shorten decision time.', 'Many near-identical choices slow decisions and increase abandonment.', 'Reduce to 3–4 plans, differentiate them clearly, and highlight one.', ['decision']),

  X('chunking', 'Chunking numbers', 'Forms', ['Recognition over recall'], ['miller'],
    { frame: 'component', nodes: [['label', { t: 'bKash number' }], ['input', { val: '01712 345 678' }], ['label', { t: 'Transaction ID' }], ['input', { val: 'ABX9 K2LM 7QPD' }]], points: ['Grouped digits', 'Easy to verify', 'Fewer copy errors'] },
    { frame: 'component', nodes: [['label', { t: 'bKash number' }], ['input', { val: '01712345678' }], ['label', { t: 'Transaction ID' }], ['input', { val: 'ABX9K2LM7QPD' }]], points: ['Long unbroken strings', 'Hard to compare', 'Typos go unnoticed'] },
    'Chunks fit working memory, making numbers easy to read and verify.', 'Long strings overload memory and hide mistakes.', 'Format numbers in groups of 3–4 as users type; accept input with or without spaces.', ['memory']),

  X('unconventional-nav', 'Conventional patterns', 'Navigation', ['Consistency and standards'], ['jakob'],
    { frame: 'desktop', nodes: [['nav', { items: ['🛒 BazaarBD', 'Categories', 'Deals', 'Orders', 'Cart (2)'], active: 1, brand: 1 }], ['search', { ph: 'Search products' }]], points: ['Logo left, cart right', 'Search prominent', 'Familiar = fast'] },
    { frame: 'desktop', nodes: [['p', { t: '⟳ spin the wheel to navigate ⟳' }], ['row', {}, [['icons', { n: 5 }]]], ['p', { t: 'Cart is in the footer' }]], points: ['Novel nav must be learned', 'Cart hidden in footer', 'Users feel lost'] },
    'Following conventions lets users rely on existing mental models.', 'Novelty forces users to learn your site before shopping.', 'Use standard patterns; innovate only where it clearly helps and test it.', ['navigation', 'mental-models']),

  X('success-state', 'Success moments', 'Feedback', ['Visibility of status'], ['peak-end'],
    { frame: 'phone', nodes: [['col', { center: 1 }, [['img', { h: 50, t: '✓' }], ['h', { t: 'Appointment booked' }], ['p', { t: 'Dr. Jahan · Tue 14 Oct · 10:30 AM' }], ['p', { t: 'Ref: APT-4821. SMS sent to 017•••678.' }], ['btn', { t: 'Add to calendar', v: 'primary', full: 1 }], ['btn', { t: 'Get directions', v: 'secondary', full: 1 }]]]], points: ['Clear confirmation', 'Key details and reference', 'Useful next steps'] },
    { frame: 'phone', nodes: [['h', { t: 'Home' }], ['p', { t: 'Find a doctor…' }], ['p', { t: '(returned to home after booking — no confirmation)' }]], points: ['No confirmation', 'User unsure if it worked', 'Weak ending'] },
    'A clear, helpful ending becomes the memorable peak of the experience.', 'Dropping users without confirmation creates doubt and support calls.', 'Design a success screen with summary, reference and next actions.', ['emotion', 'states']),

  X('cta-emphasis', 'Primary action emphasis', 'Buttons', ['Visual hierarchy'], ['von-restorff', 'hick'],
    { frame: 'component', nodes: [['h', { t: 'Enroll in UX Basics', size: 'sm' }], ['btn', { t: 'Enroll for free', v: 'primary', full: 1 }], ['row', {}, [['btn', { t: 'Preview', v: 'ghost' }], ['btn', { t: 'Share', v: 'ghost' }]]]], points: ['One clear primary', 'Secondary actions quiet', 'Obvious next step'] },
    { frame: 'component', nodes: [['h', { t: 'Enroll in UX Basics', size: 'sm' }], ['row', {}, [['btn', { t: 'Enroll', v: 'primary' }], ['btn', { t: 'Preview', v: 'primary' }], ['btn', { t: 'Share', v: 'primary' }], ['btn', { t: 'Wishlist', v: 'primary' }]]]], points: ['Four equal buttons', 'Nothing stands out', 'Slower decision'] },
    'A single emphasized action guides attention.', 'When everything is emphasized, nothing is.', 'Keep one primary per view; style others as secondary or tertiary.', ['buttons']),

  X('profile-progress', 'Progress toward completion', 'Onboarding', ['Visibility'], ['zeigarnik', 'goal-gradient'],
    { frame: 'phone', nodes: [['h', { t: 'Set up your shop' }], ['progress', { v: 60 }], ['p', { t: '3 of 5 done' }], ['check', { t: 'Add shop name', on: 1 }], ['check', { t: 'Add first product', on: 1 }], ['check', { t: 'Set delivery area', on: 1 }], ['check', { t: 'Connect bKash' }], ['check', { t: 'Share your shop link' }]], points: ['Visible checklist', 'Progress motivates', 'Each step clear'] },
    { frame: 'phone', nodes: [['h', { t: 'Dashboard' }], ['p', { t: 'Welcome!' }], ['p', { t: '(setup steps hidden in Settings)' }]], points: ['No guidance', 'Setup forgotten', 'Low activation'] },
    'Showing what\'s done and what remains motivates completion.', 'Hidden setup tasks are never finished.', 'Add a dismissible checklist with honest progress on the home screen.', ['motivation', 'onboarding']),

  X('phone-input', 'Flexible input formats', 'Forms', ['Error prevention'], ['postel', 'tesler'],
    { frame: 'component', nodes: [['label', { t: 'Mobile number' }], ['input', { val: '০১৭১২ ৩৪৫৬৭৮', ok: 1 }], ['hint', { t: 'Got it: 01712-345678' }]], points: ['Accepts Bangla digits & spaces', 'Normalizes automatically', 'Confirms interpretation'] },
    { frame: 'component', nodes: [['label', { t: 'Mobile number' }], ['input', { val: '01712 345678', err: 1 }], ['hint', { t: 'Invalid. Use digits only, no spaces.', err: 1 }]], points: ['Rejects valid input', 'Pushes work to user', 'Frustrating'] },
    'Accepting variations and normalizing them moves complexity from the user to the system.', 'Strict formats reject correct information for trivial reasons.', 'Strip spaces/dashes, convert Bangla numerals, and show the normalized value.', ['forms', 'errors']),

  X('checkout', 'Checkout', 'Checkout', ['Transparency', 'Minimize steps'], ['tesler', 'goal-gradient'],
    { frame: 'phone', nodes: [['steps', { items: ['Cart', 'Address', 'Pay'], cur: 2 }], ['check', { t: 'bKash', on: 1 }], ['check', { t: 'Cash on delivery' }], ['kv', { k: 'Subtotal', v: '৳1,450' }], ['kv', { k: 'Delivery', v: '৳60' }], ['kv', { k: 'Total', v: '৳1,510', total: 1 }], ['btn', { t: 'Pay ৳1,510', v: 'primary', full: 1 }]], points: ['Progress visible', 'All fees shown upfront', 'Button states the amount'] },
    { frame: 'phone', nodes: [['h', { t: 'Create an account to continue' }], ['input', { ph: 'Email' }], ['input', { ph: 'Password' }], ['input', { ph: 'Confirm password' }], ['p', { t: '+ service fee and VAT calculated later', small: 1 }], ['btn', { t: 'Next', v: 'primary', full: 1 }]], points: ['Forced registration', 'Hidden fees', 'Unknown number of steps'] },
    'Guest checkout, upfront costs and progress reduce anxiety and abandonment.', 'Forced sign-up and surprise fees are top reasons for abandoned carts.', 'Offer guest checkout, show the full price early, and label the final button with the amount.', ['checkout', 'trust']),

  X('login', 'Login screen', 'Login', ['Error recovery', 'Visibility'], ['jakob', 'fitts'],
    { frame: 'phone', nodes: [['h', { t: 'Sign in' }], ['label', { t: 'Phone or email' }], ['input', { val: '01712345678' }], ['label', { t: 'Password' }], ['input', { val: '••••••••  👁' }], ['btn', { t: 'Forgot password?', v: 'ghost' }], ['btn', { t: 'Sign in', v: 'primary', full: 1 }], ['btn', { t: 'Sign in with OTP instead', v: 'secondary', full: 1 }]], points: ['Show-password toggle', 'Recovery link next to password', 'Alternative OTP method'] },
    { frame: 'phone', nodes: [['h', { t: 'LOGIN' }], ['input', { ph: 'Username' }], ['input', { ph: 'Password' }], ['row', { between: 1 }, [['btn', { t: 'Reset', v: 'secondary', size: 'sm' }], ['btn', { t: 'Login', v: 'primary', size: 'sm' }]]], ['spacer', { h: 30 }], ['p', { t: 'forgot? contact admin', tiny: 1 }]], points: ['"Reset" clears the form', 'Recovery hidden', 'Small targets'] },
    'Recovery options and password visibility reduce lockouts.', 'A Reset button next to Login wipes input by accident; recovery is buried.', 'Remove Reset, add show/hide, put "Forgot password?" by the field, offer OTP.', ['forms', 'auth']),

  X('product-card', 'Product card', 'Cards', ['Consistency', 'Hierarchy'], ['common-region', 'proximity'],
    { frame: 'component', nodes: [['card', {}, [['img', { h: 80, t: 'Photo' }], ['p', { t: 'Cotton Panjabi — Navy' }], ['row', {}, [['h', { t: '৳1,450', size: 'sm' }], ['p', { t: '★ 4.6 (212)' }]]], ['btn', { t: 'Add to cart', v: 'primary', full: 1 }]]]], points: ['Price prominent', 'Social proof', 'One clear action'] },
    { frame: 'component', nodes: [['card', {}, [['p', { t: 'COTTON PANJABI NAVY BLUE PREMIUM QUALITY 100% NEW ARRIVAL!!!' }], ['img', { h: 50 }], ['p', { t: 'price: 1450', tiny: 1 }], ['row', {}, [['btn', { t: 'Buy', v: 'primary', size: 'sm' }], ['btn', { t: 'Cart', v: 'primary', size: 'sm' }], ['btn', { t: 'Wish', v: 'primary', size: 'sm' }], ['btn', { t: 'Share', v: 'primary', size: 'sm' }]]]]]], points: ['Shouty title', 'Price tiny', 'Four competing buttons'] },
    'Consistent anatomy lets shoppers compare cards quickly.', 'Noise and competing actions make scanning and comparing hard.', 'Concise title, prominent price, rating, one primary action.', ['cards']),

  X('onboarding', 'Onboarding', 'Onboarding', ['Learnability'], ['hick', 'tesler'],
    { frame: 'phone', nodes: [['h', { t: 'What do you want to learn?' }], ['chips', { items: ['UX Research', 'UI Design', 'Figma'], active: 0 }], ['p', { t: 'We\'ll suggest a 15-minute daily plan.' }], ['btn', { t: 'Start learning', v: 'primary', full: 1 }], ['btn', { t: 'Skip', v: 'ghost' }]], points: ['One question', 'Immediate value', 'Skippable'] },
    { frame: 'phone', nodes: [['dots', { n: 7, on: 0 }], ['img', { h: 70 }], ['p', { t: 'Welcome to the most amazing learning experience…' }], ['btn', { t: 'Next (1/7)', v: 'primary', full: 1 }]], points: ['7 slides before value', 'No skip', 'Generic marketing copy'] },
    'Personalizing with one question gets users to value fast.', 'Long tours delay value and are mostly skipped or forgotten.', 'Ask only what you need to personalize; teach in context later.', ['onboarding']),

  X('mobile-menu', 'Mobile menu', 'Navigation', ['Visibility', 'Hierarchy'], ['serial-position', 'miller'],
    { frame: 'phone', nodes: [['header', { t: 'Menu' }], ['p', { t: 'Shop' }], ['list', { items: ['Women ›', 'Men ›', 'Kids ›'] }], ['p', { t: 'Account' }], ['list', { items: ['Orders', 'Wishlist'] }]], points: ['Grouped sections', 'Chevrons show depth', 'Short list'] },
    { frame: 'phone', nodes: [['header', { t: 'Menu' }], ['list', { dense: 1, items: ['Home', 'About', 'Women', 'Careers', 'Men', 'Blog', 'Kids', 'Press', 'Orders', 'Investors', 'Wishlist', 'Policies', 'Help', 'Sitemap'] }]], points: ['14 mixed items', 'No grouping', 'Shopping mixed with corporate links'] },
    'Grouping and signifiers make long menus scannable.', 'An unordered list mixes tasks and buries what shoppers need.', 'Group by user goal, put top tasks first, move corporate links to the footer.', ['navigation', 'ia']),
];

/* ---------------- Design Critique Lab ---------------- */
export const CRITIQUES = [
  { id: 'cr-signup-wall', title: 'Signup before browsing', mock: { frame: 'phone', nodes: [['h', { t: 'Welcome to FoodNow' }], ['p', { t: 'Create an account to see restaurants.' }], ['input', { ph: 'Full name' }], ['input', { ph: 'Email' }], ['input', { ph: 'Password' }], ['input', { ph: 'Date of birth' }], ['btn', { t: 'Register', v: 'primary', full: 1 }]] },
    options: ['Too many colors', 'Forces registration before showing any value', 'Font is too large', 'The button is green'], answer: 1, laws: ['tesler', 'hick'], principle: 'Value before commitment (reduce friction)',
    reasoning: 'Users can\'t evaluate the app until they give personal data. This creates a high-friction gate, and date of birth isn\'t needed to browse food.', fix: 'Let users browse restaurants immediately; ask for phone/OTP only at checkout, and remove unnecessary fields.',
    better: { frame: 'phone', nodes: [['search', { ph: 'Search restaurants or dishes' }], ['card', {}, [['img', { h: 40 }], ['p', { t: 'Kacchi House · 25 min' }]]], ['card', {}, [['img', { h: 40 }], ['p', { t: 'Pizza Point · 30 min' }]]], ['p', { t: 'Sign in only when you order' }]] } },
  { id: 'cr-delete-proximity', title: 'Dangerous button placement', mock: { frame: 'component', nodes: [['h', { t: 'Edit post', size: 'sm' }], ['row', {}, [['btn', { t: 'Save', v: 'primary' }], ['btn', { t: 'Delete', v: 'primary' }]]]] },
    options: ['Delete looks identical to Save and sits right next to it', 'Title is too short', 'There should be more buttons', 'Buttons need icons'], answer: 0, laws: ['fitts', 'similarity'], principle: 'Error prevention',
    reasoning: 'Similar styling (Law of Similarity) implies similar meaning, and adjacency makes accidental taps likely for an irreversible action.', fix: 'Style Delete as destructive, move it away from Save, and add confirmation or Undo.',
    better: { frame: 'component', nodes: [['h', { t: 'Edit post', size: 'sm' }], ['btn', { t: 'Save changes', v: 'primary' }], ['divider'], ['btn', { t: 'Delete post', v: 'danger' }]] } },
  { id: 'cr-color-only', title: 'Status shown by color only', mock: { frame: 'component', nodes: [['table', { head: ['Order', 'Status'], rows: [['#1042', '●'], ['#1043', '●'], ['#1044', '●']] }], ['p', { t: '(green, red and amber dots)' }]] },
    options: ['Table has too few rows', 'Status uses only color — fails for color-blind users and screen readers', 'Order numbers are too short', 'Needs a chart'], answer: 1, laws: ['similarity'], principle: 'Use of color (WCAG 1.4.1)',
    reasoning: 'About 1 in 12 men have color vision deficiency; dots carry no text for assistive tech.', fix: 'Add text labels and distinct icons: "✓ Delivered", "✕ Cancelled", "⏳ Pending".',
    better: { frame: 'component', nodes: [['table', { head: ['Order', 'Status'], rows: [['#1042', '✓ Delivered'], ['#1043', '✕ Cancelled'], ['#1044', '⏳ Pending']] }]] } },
  { id: 'cr-wall-of-text', title: 'Instructions wall', mock: { frame: 'phone', nodes: [['h', { t: 'Apply for NID correction' }], ['p', { t: 'Before proceeding please ensure all documents are scanned in PDF under 2MB and named correctly and that your mobile is registered and that you have paid the fee via the designated channel and kept the transaction ID which will be required in step 4 of 6 along with…' }], ['btn', { t: 'Start', v: 'primary', full: 1 }]] },
    options: ['Users scan, not read — critical requirements are buried in a paragraph', 'Heading should be red', 'Button too big', 'Needs animation'], answer: 0, laws: ['miller'], principle: 'Recognition over recall, chunking',
    reasoning: 'Dense prose hides requirements; users skip it and fail at step 4.', fix: 'Turn requirements into a short checklist shown before starting, and ask for each item at the step where it\'s needed.',
    better: { frame: 'phone', nodes: [['h', { t: 'Before you start' }], ['check', { t: 'Scanned documents (PDF, < 2 MB)' }], ['check', { t: 'Registered mobile number' }], ['check', { t: 'Fee transaction ID' }], ['p', { t: 'Takes about 10 minutes' }], ['btn', { t: 'I\'m ready — start', v: 'primary', full: 1 }]] } },
  { id: 'cr-hidden-fees', title: 'Surprise at the end', mock: { frame: 'phone', nodes: [['h', { t: 'Review order' }], ['kv', { k: 'Items', v: '৳900' }], ['kv', { k: 'Service fee', v: '৳45' }], ['kv', { k: 'Platform fee', v: '৳30' }], ['kv', { k: 'Small order fee', v: '৳50' }], ['kv', { k: 'Total', v: '৳1,025', total: 1 }], ['btn', { t: 'Pay', v: 'primary', full: 1 }]] },
    options: ['Fees appear only at the final step, damaging trust', 'Too many items', 'Button should say Buy', 'Use a lighter font'], answer: 0, laws: ['peak-end'], principle: 'Credibility and transparency',
    reasoning: 'Fees revealed late feel deceptive and create a negative peak right before payment.', fix: 'Show estimated fees on the menu/cart, explain the small-order threshold and progress toward avoiding it.',
    better: { frame: 'phone', nodes: [['alert', { t: 'Add ৳100 more to avoid the ৳50 small-order fee', kind: 'info' }], ['progress', { v: 90 }], ['kv', { k: 'Items', v: '৳900' }], ['kv', { k: 'Fees (see details)', v: '৳125' }], ['kv', { k: 'Total', v: '৳1,025', total: 1 }], ['btn', { t: 'Pay ৳1,025', v: 'primary', full: 1 }]] } },
  { id: 'cr-icon-only', title: 'Mystery icons', mock: { frame: 'phone', nodes: [['header', { t: 'Files' }], ['icons', { n: 6 }], ['list', { items: ['Report.pdf', 'Budget.xlsx'] }]] },
    options: ['Icons need labels; meaning is ambiguous', 'Too few files', 'Header too small', 'List needs dividers'], answer: 0, laws: ['jakob', 'pragnanz'], principle: 'Recognition over recall',
    reasoning: 'Only a handful of icons are universally understood; the rest require guessing.', fix: 'Add text labels or tooltips; keep icon-only for universal actions (search, close).',
    better: { frame: 'phone', nodes: [['header', { t: 'Files' }], ['row', {}, [['btn', { t: 'Upload', v: 'secondary', size: 'sm' }], ['btn', { t: 'New folder', v: 'secondary', size: 'sm' }], ['btn', { t: 'Share', v: 'secondary', size: 'sm' }]]], ['list', { items: ['Report.pdf', 'Budget.xlsx'] }]] } },
  { id: 'cr-captcha-timer', title: 'Tight time limit', mock: { frame: 'phone', nodes: [['h', { t: 'Enter OTP' }], ['p', { t: 'Expires in 0:15', small: 1 }], ['row', {}, [['input', { val: '' }], ['input', { val: '' }], ['input', { val: '' }], ['input', { val: '' }]]], ['p', { t: 'Resend available after expiry', tiny: 1 }]] },
    options: ['15-second limit with no resend excludes slow typists and SMS delays', 'Too many boxes', 'Should use letters', 'Heading too bold'], answer: 0, laws: ['doherty'], principle: 'Enough time (WCAG 2.2.1), human limitations',
    reasoning: 'SMS can take longer than 15 s to arrive; older users need more time.', fix: 'Allow 2–5 minutes, show a resend option with countdown, support autofill from SMS.',
    better: { frame: 'phone', nodes: [['h', { t: 'Enter the 4-digit code' }], ['p', { t: 'Sent to 017•••678' }], ['row', {}, [['input', { val: '4' }], ['input', { val: '2' }], ['input', { val: '' }], ['input', { val: '' }]]], ['btn', { t: 'Resend code in 0:45', v: 'ghost' }]] } },
  { id: 'cr-carousel-hero', title: 'Auto-rotating hero', mock: { frame: 'desktop', nodes: [['img', { h: 90, t: 'Slide 1 of 6 (auto-advances every 2s)' }], ['dots', { n: 6, on: 0 }]] },
    options: ['Auto-advancing carousel hides content and moves too fast to read', 'Image too wide', 'Dots should be squares', 'Needs a louder color'], answer: 0, laws: ['serial-position'], principle: 'User control, motion accessibility (WCAG 2.2.2)',
    reasoning: 'Most users only see slide 1; auto-motion distracts and can\'t be paused.', fix: 'Use a static hero with one message; if a carousel is necessary, no auto-play and provide controls.',
    better: { frame: 'desktop', nodes: [['h', { t: 'Learn UX in 15 minutes a day' }], ['p', { t: 'Bangla + English lessons, practice and exams.' }], ['btn', { t: 'Start free', v: 'primary' }]] } },
];
