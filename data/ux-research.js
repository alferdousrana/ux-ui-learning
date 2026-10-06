/* UX Research: fundamentals (lessons), methods (rich records), toolkit templates. */

export const MODULES = [
  { id: 'research-fundamentals', track: 'research', level: 'Level 3', icon: 'flask', title: 'Research Fundamentals', titleBn: 'রিসার্চের ভিত্তি',
    desc: { bn: 'কেন, কখন আর কোন ধরনের রিসার্চ।', en: 'Why, when and which kind of research.' } },
  { id: 'research-methods', track: 'research', level: 'Level 3', icon: 'flask', title: 'Research Methods', titleBn: 'রিসার্চ পদ্ধতি',
    desc: { bn: 'ইন্টারভিউ থেকে A/B টেস্ট — ধাপে ধাপে।', en: 'From interviews to A/B tests, step by step.' } },
  { id: 'personas', track: 'research', level: 'Level 3', icon: 'user', title: 'Personas', titleBn: 'পারসোনা',
    desc: { bn: 'রিসার্চকে মানুষের রূপ দেওয়া।', en: 'Turning research into people the team can design for.' } },
];

const rf = 'research-fundamentals', pe = 'personas';

export const LESSONS = [
  { id: 'rs-what', module: rf, title: 'What is UX research?', titleBn: 'UX রিসার্চ কী?', level: 'Beginner', minutes: 9, tags: ['research'],
    bn: 'UX রিসার্চ হলো পদ্ধতিগতভাবে ব্যবহারকারীদের সম্পর্কে জানা — তারা কে, কী চায়, কীভাবে কাজ করে, কোথায় সমস্যায় পড়ে। অনুমানের বদলে প্রমাণ দিয়ে ডিজাইন সিদ্ধান্ত নেওয়াই এর উদ্দেশ্য।',
    en: 'UX research is the systematic study of users, their needs, behaviors and contexts, to inform and evaluate design decisions. It reduces risk by replacing assumptions with evidence.',
    takeaway: { bn: 'অনুমান নয়, প্রমাণ।', en: 'Evidence over assumptions.' } },
  { id: 'rs-why', module: rf, title: 'Why research matters', level: 'Beginner', minutes: 7, tags: ['research'],
    bn: 'ভুল জিনিস তৈরি করা সবচেয়ে ব্যয়বহুল ভুল। ডেভেলপমেন্টের পরে সমস্যা ঠিক করতে ডিজাইন পর্যায়ের চেয়ে অনেক গুণ বেশি খরচ হয়। রিসার্চ শুরুতেই ঝুঁকি কমায়।',
    en: 'Fixing problems after release costs far more than during design. Research aligns teams, prioritizes what matters, uncovers unmet needs and provides a baseline to measure improvement.',
    takeaway: { bn: 'আগে শিখুন, পরে বানান।', en: 'Learn before you build.' } },
  { id: 'rs-qual-quant', module: rf, title: 'Qualitative vs quantitative', level: 'Beginner', minutes: 10, tags: ['research'], visual: { svg: 'researchQuadrant' },
    bn: 'Qualitative রিসার্চ "কেন?" এর উত্তর দেয় — কম মানুষ, গভীর বোঝাপড়া (ইন্টারভিউ, পর্যবেক্ষণ)। Quantitative রিসার্চ "কতটা? কতজন?" এর উত্তর দেয় — বেশি মানুষ, সংখ্যা (সার্ভে, অ্যানালিটিক্স, A/B টেস্ট)।',
    en: 'Qualitative research generates insights about why and how (small samples, rich data). Quantitative research measures how many and how much (large samples, statistical confidence). Strong programs combine both.',
    compare: 'Qual: 5–12 interviews revealing why checkout feels risky. Quant: analytics showing 68% drop at the payment step.',
    takeaway: { bn: 'সংখ্যা বলে "কী", কথা বলে "কেন"।', en: 'Numbers say what; conversations say why.' },
    quiz: [['Which method is quantitative?', ['Contextual inquiry', 'A/B test', 'User interview', 'Diary study'], 1, 'A/B testing measures differences in behavior with statistical samples.']] },
  { id: 'rs-gen-eval', module: rf, title: 'Generative vs evaluative', level: 'Beginner', minutes: 8, tags: ['research'],
    bn: 'Generative রিসার্চ নতুন সুযোগ ও সমস্যা খোঁজে — কী বানানো উচিত। Evaluative রিসার্চ বিদ্যমান ডিজাইন যাচাই করে — যা বানিয়েছি তা কি কাজ করছে।',
    en: 'Generative (exploratory) research discovers problems and opportunities before solutions exist. Evaluative research assesses a design or product against goals. Use generative early, evaluative throughout.',
    takeaway: { bn: 'Generative: কী বানাব? Evaluative: ঠিক বানিয়েছি?', en: 'Generative: what to build? Evaluative: did we build it right?' } },
  { id: 'rs-primary-secondary', module: rf, title: 'Primary vs secondary research', level: 'Beginner', minutes: 6, tags: ['research'],
    bn: 'Primary রিসার্চ আপনি নিজে সংগ্রহ করেন (ইন্টারভিউ, সার্ভে)। Secondary রিসার্চ আগে থেকে থাকা তথ্য (রিপোর্ট, প্রতিযোগীর বিশ্লেষণ, সরকারি পরিসংখ্যান)। সস্তা ও দ্রুত হওয়ায় secondary দিয়ে শুরু করা ভালো।',
    en: 'Primary research collects new data directly from users. Secondary research uses existing sources: industry reports, academic papers, support tickets, analytics and competitor products. Start with secondary to avoid re-learning known facts.',
    takeaway: { bn: 'আগে যা জানা আছে, তা আগে পড়ুন।', en: 'Read what is already known first.' } },
  { id: 'rs-plan', module: rf, title: 'Writing a research plan', level: 'Intermediate', minutes: 10, tags: ['research'],
    bn: 'রিসার্চ প্ল্যানে থাকবে: প্রেক্ষাপট, লক্ষ্য, রিসার্চ প্রশ্ন, পদ্ধতি, অংশগ্রহণকারী, সময়সূচি ও ফলাফল কীভাবে ব্যবহার হবে। এটি দলকে একমত করে।',
    en: 'A research plan states background, objectives, research questions, methods, participants, timeline, deliverables and how findings will drive decisions. It aligns stakeholders before fieldwork.',
    how: ['Background & problem', 'Objectives', 'Research questions', 'Method & rationale', 'Participants & recruiting', 'Timeline & roles', 'Deliverables'],
    takeaway: { bn: 'ভালো প্রশ্নই ভালো রিসার্চ।', en: 'Good questions make good research.' } },
  { id: 'rs-synthesis', module: rf, title: 'Synthesis & affinity mapping', level: 'Intermediate', minutes: 10, tags: ['research', 'synthesis'],
    bn: 'রিসার্চ শেষে অনেক নোট জমে। Affinity mapping-এ প্রতিটি পর্যবেক্ষণ একটি স্টিকি নোটে লিখে মিল অনুযায়ী দলবদ্ধ করা হয়, তারপর প্রতিটি দলের অর্থ (insight) লেখা হয়।',
    en: 'Synthesis turns raw data into insights. Affinity mapping clusters atomic observations bottom-up into themes; each theme is summarized as an insight: an observation plus its implication for design.',
    takeaway: { bn: 'তথ্য → প্যাটার্ন → অন্তর্দৃষ্টি → সিদ্ধান্ত।', en: 'Data → patterns → insights → decisions.' } },
  { id: 'rs-ethics', module: rf, title: 'Research ethics & consent', level: 'Beginner', minutes: 7, tags: ['research', 'ethics'],
    bn: 'অংশগ্রহণকারীর সম্মতি নিন, রেকর্ডিংয়ের অনুমতি নিন, ব্যক্তিগত তথ্য সুরক্ষিত রাখুন, আর যেকোনো সময় থামার অধিকার দিন।',
    en: 'Ethical research requires informed consent, recording permission, data minimization, anonymization, secure storage, the right to withdraw, and fair compensation.',
    takeaway: { bn: 'অংশগ্রহণকারীর আস্থা সবার আগে।', en: 'Participant trust comes first.' } },
  { id: 'persona-what', module: pe, title: 'What is a persona?', titleBn: 'পারসোনা কী?', level: 'Beginner', minutes: 9, tags: ['personas', 'research'],
    bn: 'পারসোনা হলো রিসার্চ থেকে তৈরি একটি কাল্পনিক কিন্তু বাস্তবভিত্তিক চরিত্র, যে একদল ব্যবহারকারীর লক্ষ্য, আচরণ ও সমস্যাকে প্রতিনিধিত্ব করে। দল তখন বলে "রুমানা কি এটা বুঝবে?" — "ইউজার" না বলে।',
    en: 'A persona is a fictional, research-based archetype representing a user segment\'s goals, behaviors, contexts and pain points. Personas create shared empathy and help teams make consistent decisions.',
    takeaway: { bn: 'পারসোনা রিসার্চের সারাংশ, কল্পনা নয়।', en: 'Personas summarize research; they are not fiction.' },
    related: ['lesson:persona-types'] },
  { id: 'persona-types', module: pe, title: 'Types of personas', level: 'Intermediate', minutes: 8, tags: ['personas'],
    bn: 'Research-based persona: আসল রিসার্চ থেকে। Proto-persona: রিসার্চের আগে দলের অনুমান থেকে, পরে যাচাই করতে হয়। Anti-persona: যাদের জন্য আমরা ডিজাইন করছি না।',
    en: 'Research-based personas derive from qualitative and quantitative data. Proto-personas capture team assumptions as hypotheses to validate. Anti-personas define who the product is not for, sharpening scope.',
    mistake: 'Treating proto-personas as validated truth.',
    takeaway: { bn: 'Proto-persona = যাচাইয়ের জন্য অনুমান।', en: 'A proto-persona is a hypothesis.' } },
  { id: 'persona-journey', module: pe, title: 'Journey maps', level: 'Intermediate', minutes: 10, tags: ['personas', 'journey'], visual: { svg: 'journeyMap' },
    bn: 'Journey map একটি পারসোনার লক্ষ্য পূরণের পুরো যাত্রা দেখায় — ধাপ, কাজ, চিন্তা, অনুভূতি, সমস্যা ও সুযোগ। অনুভূতির রেখা দেখায় কোথায় মানুষ হতাশ হয়।',
    en: 'A customer journey map visualizes a persona\'s experience across stages: actions, touchpoints, thoughts, emotions, pain points and opportunities. The emotion curve highlights where to intervene.',
    takeaway: { bn: 'নিচের বিন্দুগুলোই সুযোগ।', en: 'The low points are the opportunities.' } },
];

/* ---------------- Research methods ---------------- */
export const METHODS = [
  { id: 'user-interviews', name: 'User interviews', kind: ['Qualitative', 'Generative'], difficulty: 'Beginner', minutes: 15, tags: ['research', 'interviews'],
    bn: 'একজন ব্যবহারকারীর সাথে একান্তে কথা বলে তাদের অভিজ্ঞতা, লক্ষ্য ও সমস্যা জানা। খোলা প্রশ্ন করুন, অতীতের ঘটনা জানতে চান, আর বেশি শুনুন।',
    en: 'One-on-one conversations exploring participants\' experiences, motivations and pain points. Semi-structured interviews follow a guide but allow probing.',
    why: 'Reveal motivations, context and language that analytics cannot.', when: 'Early discovery; before defining features; to understand a domain.',
    how: ['Define goals and research questions', 'Recruit 5–12 participants per segment', 'Write a discussion guide (warm-up → core → wrap-up)', 'Get consent and record', 'Ask open questions about past behavior', 'Probe with "Tell me more", "Why?"', 'Debrief immediately, then synthesize'],
    example: 'Interviewing 8 small shop owners about how they track customer credit (baki khata).',
    questions: ['Tell me about the last time you…', 'Walk me through how you usually…', 'What was the hardest part?', 'What did you do next?', 'If you had a magic wand, what would you change?'],
    mistakes: ['Leading questions ("Wouldn\'t it be great if…?")', 'Asking about future behavior ("Would you use…?")', 'Pitching your solution', 'Talking more than listening'],
    pros: ['Deep understanding', 'Flexible', 'Cheap to start'], cons: ['Self-reported data', 'Time-consuming to analyze', 'Small samples'],
    output: 'Transcripts, notes, quotes, affinity map, insights.',
    project: 'For a pharmacy app, interviews revealed caregivers order for elderly parents — leading to a "family profiles" feature.',
    practice: 'Write 8 open questions for interviewing students about how they find study materials.',
    quiz: [['Which is the best interview question?', ['Would you use a budgeting app?', 'Tell me about the last time you tracked your spending.', 'Do you like our app?', 'Isn\'t saving money important?'], 1, 'Asking about specific past behavior gives reliable data.']] },

  { id: 'surveys', name: 'Surveys', kind: ['Quantitative', 'Evaluative/Generative'], difficulty: 'Beginner', minutes: 12, tags: ['research', 'surveys'],
    bn: 'অনেক মানুষের কাছ থেকে একই প্রশ্নের উত্তর সংগ্রহ। কতজন কী ভাবে বা করে — তা মাপতে ভালো, কিন্তু "কেন" বুঝতে দুর্বল।',
    en: 'Structured questionnaires collecting self-reported data from many respondents. Useful for measuring attitudes, prevalence and satisfaction; weak for discovering unknown problems.',
    why: 'Quantify patterns found in qualitative research.', when: 'After interviews; to size a problem; to track satisfaction over time.',
    how: ['Define what decision the survey informs', 'Write short, neutral questions', 'Use closed questions for measurement, 1–2 open ones', 'Avoid double-barreled questions', 'Pilot with 3–5 people', 'Distribute to the right sample', 'Analyze with segments'],
    example: 'A 6-question survey to 400 riders on how often they schedule rides in advance.',
    questions: ['How often do you…? (Never – Daily)', 'How satisfied are you with…? (1–5)', 'What is the main reason you…?'],
    mistakes: ['Double-barreled questions ("fast and easy?")', 'Leading wording', 'Too long — high drop-off', 'Biased sample'],
    pros: ['Scales cheaply', 'Statistical comparison', 'Tracks change over time'], cons: ['Self-report bias', 'No follow-up', 'Easy to write badly'],
    output: 'Charts, segment comparisons, open-text themes.', project: 'Survey sized how many users needed Bangla interface: 62% preferred it.',
    practice: 'Rewrite this question: "How fast and reliable is our delivery?"',
    quiz: [['"How fast and easy was checkout?" is problematic because it is…', ['Too short', 'Double-barreled', 'Open-ended', 'Quantitative'], 1, 'It asks two things at once.']] },

  { id: 'observation-method', name: 'Observation', kind: ['Qualitative', 'Generative'], difficulty: 'Beginner', minutes: 10, tags: ['research', 'observation'],
    bn: 'মানুষ বাস্তব পরিবেশে কীভাবে কাজ করে তা চুপচাপ দেখা — হস্তক্ষেপ ছাড়া।',
    en: 'Watching people perform activities in their natural environment, documenting behaviors, workarounds and context without intervening.',
    why: 'Captures actual behavior rather than reported behavior.', when: 'Discovery; understanding environments (shops, clinics, field work).',
    how: ['Get permission', 'Define what to observe', 'Observe without interfering', 'Note actions, tools, interruptions, workarounds', 'Photograph the environment (with consent)', 'Follow up with brief questions after'],
    example: 'Observing pharmacy counters during peak hours to see how prescriptions are read.',
    questions: ['(After) I noticed you… could you tell me why?'],
    mistakes: ['Helping participants', 'Recording only what confirms your hypothesis'],
    pros: ['Real behavior', 'Uncovers workarounds'], cons: ['Observer effect', 'Time-intensive'],
    output: 'Field notes, photos, workaround catalog.', project: 'Observed delivery riders checking addresses by phone call — led to a landmark field.',
    practice: 'Observe someone using a vending machine or ticket kiosk for 15 minutes. List 5 behaviors.' },

  { id: 'contextual-inquiry', name: 'Contextual inquiry', kind: ['Qualitative', 'Generative'], difficulty: 'Intermediate', minutes: 12, tags: ['research', 'observation'],
    bn: 'ব্যবহারকারীর কর্মস্থলে গিয়ে কাজ করার সময় পর্যবেক্ষণ ও প্রশ্ন — মাস্টার-শিক্ষানবিশ সম্পর্কের মতো: ব্যবহারকারী শেখান, গবেষক শেখেন।',
    en: 'A hybrid of observation and interview conducted in the user\'s context, using the master–apprentice model: the participant works and teaches; the researcher observes and asks.',
    why: 'Reveals tacit knowledge people can\'t articulate in interviews.', when: 'Complex workflows: clinics, accounting, logistics.',
    how: ['Primer: build rapport and explain', 'Transition to work observation', 'Observe and ask about actions as they happen', 'Validate interpretations with the participant', 'Wrap-up summary'],
    example: 'Sitting with a hospital receptionist through 20 patient check-ins.',
    questions: ['What are you doing now and why?', 'Is this how it usually goes?', 'What would happen if…?'],
    mistakes: ['Turning it into a pure interview', 'Interrupting critical tasks'],
    pros: ['Rich contextual insight', 'Tacit knowledge'], cons: ['Logistically hard', 'Small samples'],
    output: 'Flow models, artifact models, insights.', project: 'Revealed receptionists maintain a paper queue alongside software.',
    practice: 'Plan a contextual inquiry for a school office handling admissions.' },

  { id: 'diary-studies', name: 'Diary studies', kind: ['Qualitative', 'Longitudinal'], difficulty: 'Intermediate', minutes: 10, tags: ['research'],
    bn: 'কয়েকদিন বা সপ্তাহ ধরে অংশগ্রহণকারীরা নিজেদের অভিজ্ঞতা লিখে বা ছবি তুলে জানায় — সময়ের সাথে আচরণ বোঝার জন্য।',
    en: 'Participants self-report experiences over days or weeks via prompts (text, photo, video), capturing behaviors, triggers and context over time.',
    why: 'Understand habits, long journeys and infrequent events.', when: 'Behaviors spanning time: meal planning, learning, commuting.',
    how: ['Define timeframe and prompts', 'Recruit committed participants', 'Brief participants and run a test entry', 'Send reminders', 'Review entries during the study', 'Run exit interviews'],
    example: '2-week diary of how students study for exams.',
    questions: ['What did you do today related to…?', 'What triggered it?', 'How did you feel?'],
    mistakes: ['Too many prompts → fatigue', 'No engagement check-ins'],
    pros: ['Real-time context', 'Longitudinal'], cons: ['Participant drop-off', 'Self-report'],
    output: 'Timelines, patterns, triggers.', project: 'Revealed users budget mostly on payday — led to payday reminders.',
    practice: 'Design 5 daily prompts for a 7-day diary study about online shopping.' },

  { id: 'focus-groups', name: 'Focus groups', kind: ['Qualitative', 'Attitudinal'], difficulty: 'Intermediate', minutes: 8, tags: ['research'],
    bn: '৬-৮ জন মানুষকে একসাথে নিয়ে একটি বিষয়ে আলোচনা। মতামত ও মনোভাব বোঝার জন্য ভালো, তবে usability যাচাইয়ে খারাপ — কারণ দলে একজন প্রভাবশালী হলে বাকিরা তাকেই অনুসরণ করে।',
    en: 'Moderated group discussions (6–8 people) exploring attitudes and perceptions. Useful for concepts and language; unsuitable for usability because of groupthink and dominant voices.',
    why: 'Explore attitudes and reactions quickly.', when: 'Early concept exploration, marketing messages.',
    how: ['Define topics', 'Recruit homogeneous groups', 'Moderate to include all voices', 'Use activities (sorting, ranking)', 'Analyze themes'],
    example: 'Discussing attitudes toward digital health records with parents.',
    questions: ['What comes to mind when you hear…?', 'Who agrees or disagrees, and why?'],
    mistakes: ['Using focus groups for usability testing', 'Letting one person dominate'],
    pros: ['Fast', 'Hear vocabulary and debate'], cons: ['Groupthink', 'Not behavioral'],
    output: 'Attitude themes, vocabulary.', project: 'Revealed parents distrust apps that store children\'s data abroad.',
    practice: 'List 3 reasons a focus group is the wrong method for testing a checkout flow.' },

  { id: 'usability-testing', name: 'Usability testing', kind: ['Qualitative/Quantitative', 'Evaluative'], difficulty: 'Beginner', minutes: 15, tags: ['research', 'usability-testing'],
    bn: 'বাস্তব মানুষকে বাস্তব কাজ দিয়ে দেখা তারা ডিজাইন ব্যবহার করতে পারে কিনা — কোথায় আটকায়, কেন।',
    en: 'Observing representative users attempting realistic tasks with a product or prototype to identify usability problems and measure performance.',
    why: 'The most direct way to find usability problems.', when: 'Throughout design: paper prototypes to live product.',
    how: ['Define goals and tasks', 'Recruit 5 participants per segment', 'Prepare script and prototype', 'Run sessions with think-aloud', 'Observe and log issues', 'Rate severity', 'Report and iterate'],
    example: 'Testing a ride-booking flow with 5 first-time users.',
    questions: ['What do you expect to happen if you tap that?', 'What are you looking for?', 'How would you describe this page?'],
    mistakes: ['Helping participants', 'Leading tasks with UI words', 'Testing with colleagues'],
    pros: ['Direct evidence', 'Works with low-fi prototypes'], cons: ['Lab context', 'Small samples for stats'],
    output: 'Issue list with severity, metrics, clips.', project: '4 of 5 users missed the promo-code field — moved it near the total.',
    practice: 'Write 3 task scenarios for testing a library book-reservation website.',
    quiz: [['How many users typically uncover most usability problems in one qualitative round?', ['1', 'About 5', '50', '500'], 1, 'About 5 users per segment find most major issues; iterate in rounds.']] },

  { id: 'ab-testing', name: 'A/B testing', kind: ['Quantitative', 'Evaluative'], difficulty: 'Intermediate', minutes: 12, tags: ['research', 'metrics'],
    bn: 'একই সময়ে দুটো সংস্করণ (A ও B) ভিন্ন ব্যবহারকারীদের দেখিয়ে কোনটা ভালো ফল দেয় তা সংখ্যা দিয়ে মাপা।',
    en: 'A controlled experiment randomly assigning users to variants to measure the causal effect of a change on a metric, with statistical significance.',
    why: 'Prove which version performs better with real behavior.', when: 'Live products with enough traffic; incremental changes.',
    how: ['Form a hypothesis and choose one primary metric', 'Calculate sample size', 'Randomize assignment', 'Run for full business cycles', 'Don\'t peek and stop early', 'Analyze significance and guardrail metrics'],
    example: 'Variant B shows delivery fee upfront; measure checkout completion.',
    questions: ['Hypothesis: Showing X will increase Y because Z.'],
    mistakes: ['Stopping early on a lucky result', 'Testing many changes at once', 'Too little traffic'],
    pros: ['Causal evidence', 'Real behavior'], cons: ['Needs traffic', 'Doesn\'t explain why', 'Local optimization'],
    output: 'Effect size, confidence interval, decision.', project: 'Upfront fees reduced checkout abandonment.',
    practice: 'Write a hypothesis for testing a shorter signup form.' },

  { id: 'card-sorting', name: 'Card sorting', kind: ['Qualitative/Quantitative', 'Generative'], difficulty: 'Beginner', minutes: 10, tags: ['research', 'ia'],
    bn: 'অংশগ্রহণকারীরা বিষয়বস্তুর কার্ডগুলোকে নিজেদের মতো দলবদ্ধ করে ও নাম দেয় — এতে বোঝা যায় তাদের মনে কনটেন্ট কীভাবে সাজানো।',
    en: 'Participants group content items into categories. Open sorts let them create and name groups; closed sorts use predefined categories; hybrid mixes both. Informs IA and labeling.',
    why: 'Align navigation with users\' mental models.', when: 'Designing or reorganizing navigation.',
    how: ['List 30–60 content items', 'Choose open, closed or hybrid', 'Recruit 15–30 for online sorts', 'Run the sort', 'Analyze similarity matrix and dendrogram', 'Draft IA, then tree test'],
    example: 'Sorting 40 hospital services into groups patients understand.',
    questions: ['Group these in a way that makes sense to you, then name each group.'],
    mistakes: ['Cards with ambiguous labels', 'Skipping validation with tree tests'],
    pros: ['Cheap', 'Reveals mental models'], cons: ['No context of real tasks'],
    output: 'Similarity matrix, category proposals.', project: 'Patients grouped by symptom, not department — navigation reorganized.',
    practice: 'Create 20 cards for a university website and do a sort yourself.' },

  { id: 'tree-testing', name: 'Tree testing', kind: ['Quantitative', 'Evaluative'], difficulty: 'Beginner', minutes: 10, tags: ['research', 'ia'],
    bn: 'শুধু টেক্সটের মেনু-গাছ (কোনো ডিজাইন ছাড়া) দিয়ে মানুষকে কিছু খুঁজতে বলা — দেখা হয় নেভিগেশন কাঠামো কাজ করে কিনা।',
    en: 'Participants find items in a text-only hierarchy, isolating IA from visual design. Measures success, directness and first-click paths.',
    why: 'Validate findability before visual design.', when: 'After card sorting; before redesigning navigation.',
    how: ['Build the hierarchy', 'Write 8–10 find-it tasks', 'Recruit 30–50 participants', 'Run the test', 'Analyze success, directness, paths'],
    example: '"Where would you find the fee for a lost ID card?"',
    questions: ['Where would you go to…?'],
    mistakes: ['Using labels from the task in the tree (giving answers away)'],
    pros: ['Quantitative IA validation', 'Fast'], cons: ['No visual cues'],
    output: 'Success rates, pietree path diagrams.', project: 'Only 34% found "Refunds" under "Account" — moved to "Orders".',
    practice: 'Create a 3-level tree for a bank website and write 5 tasks.' },

  { id: 'competitive-analysis', name: 'Competitive analysis', kind: ['Secondary', 'Generative'], difficulty: 'Beginner', minutes: 10, tags: ['research'],
    bn: 'প্রতিযোগী ও বিকল্প প্রোডাক্টগুলো বিশ্লেষণ করে বোঝা — কী ভালো করছে, কোথায় দুর্বল, কোন সুযোগ খালি।',
    en: 'Systematic evaluation of competitors and alternatives (including non-digital ones) against criteria to identify conventions, gaps and differentiation opportunities.',
    why: 'Learn conventions and find gaps.', when: 'Early in a project; before positioning.',
    how: ['Identify direct, indirect and analogous competitors', 'Define criteria (features, flows, pricing, UX quality)', 'Complete key tasks in each', 'Fill a comparison matrix', 'Summarize patterns and opportunities'],
    example: 'Comparing 5 food delivery apps on reorder, tracking and support.',
    questions: ['How does each handle…?', 'Where did I struggle?'],
    mistakes: ['Copying features without understanding context', 'Only comparing features, not experience'],
    pros: ['Fast', 'Reveals conventions'], cons: ['No user voice'],
    output: 'Comparison matrix, opportunity list.', project: 'No competitor supported cash-on-delivery change requests — opportunity found.',
    practice: 'Compare 3 mobile banking apps on sending money.' },

  { id: 'heuristic-evaluation', name: 'Heuristic evaluation', kind: ['Expert review', 'Evaluative'], difficulty: 'Intermediate', minutes: 12, tags: ['research', 'heuristics'],
    bn: '৩-৫ জন বিশেষজ্ঞ Nielsen-এর ১০টি নীতি (heuristic) দিয়ে ইন্টারফেস পর্যালোচনা করে সমস্যা খুঁজে বের করেন।',
    en: 'Experts independently inspect an interface against established heuristics (Nielsen\'s 10), then merge findings and rate severity. Fast and cheap, but no substitute for user testing.',
    why: 'Catch obvious issues before testing with users.', when: 'Before usability tests; audits.',
    how: ['Pick heuristics and scope', '3–5 evaluators review independently', 'Log issue, heuristic, location, severity', 'Merge and deduplicate', 'Prioritize and recommend'],
    example: 'Audit of a government form portal found 23 issues, 6 severe.',
    questions: ['Visibility of status · Match with real world · User control · Consistency · Error prevention · Recognition over recall · Flexibility · Minimalist design · Error recovery · Help'],
    mistakes: ['Single evaluator', 'Personal taste as "heuristics"'],
    pros: ['Fast', 'Cheap', 'No recruiting'], cons: ['Expert bias', 'Misses domain issues'],
    output: 'Issue list mapped to heuristics with severity.', project: 'Heuristic review found no visible system status during uploads.',
    practice: 'Evaluate any login page against 3 heuristics.' },

  { id: 'expert-review', name: 'Expert review', kind: ['Expert review', 'Evaluative'], difficulty: 'Intermediate', minutes: 8, tags: ['research'],
    bn: 'অভিজ্ঞ UX বিশেষজ্ঞ নিজের জ্ঞান ও best practice দিয়ে পণ্য পর্যালোচনা করেন — heuristic-এর চেয়ে কম কাঠামোবদ্ধ, বেশি প্রেক্ষাপটনির্ভর।',
    en: 'An experienced practitioner reviews a product using broad expertise, guidelines and domain knowledge, often walking through key tasks as specific personas (cognitive walkthrough).',
    why: 'Quick expert diagnosis.', when: 'Audits, early feedback, limited budgets.',
    how: ['Define personas and tasks', 'Walk through each task', 'Document issues and evidence', 'Prioritize recommendations'],
    example: 'Walkthrough of onboarding as a first-time elderly user.',
    questions: ['Will the user know what to do? Will they see how? Will they understand the feedback?'],
    mistakes: ['Presenting opinion as user evidence'],
    pros: ['Fast', 'Context-aware'], cons: ['Subjective'],
    output: 'Prioritized recommendations.', project: 'Cognitive walkthrough revealed OTP screen lacked resend timing.',
    practice: 'Do a cognitive walkthrough of signing up for any app.' },

  { id: 'analytics-analysis', name: 'Analytics analysis', kind: ['Quantitative', 'Behavioral'], difficulty: 'Intermediate', minutes: 10, tags: ['research', 'metrics'],
    bn: 'অ্যানালিটিক্স ডেটা (পেজ ভিউ, ফানেল, ড্রপ-অফ) দেখে বোঝা কোথায় মানুষ আটকে যাচ্ছে। এটি "কোথায়" দেখায়, "কেন" দেখায় না।',
    en: 'Analyzing behavioral data (funnels, retention, events, heatmaps, search logs) to locate problems and measure impact. Shows where and how much — pair with qualitative to learn why.',
    why: 'Find where problems are and how big they are.', when: 'Live products; before and after changes.',
    how: ['Define questions and key metrics', 'Check tracking quality', 'Build funnels for key flows', 'Segment users', 'Identify drop-offs and anomalies', 'Form hypotheses for qualitative follow-up'],
    example: 'Funnel shows 52% drop at address entry on mobile only.',
    questions: ['Where do users drop off?', 'Which segment behaves differently?'],
    mistakes: ['Vanity metrics', 'Confusing correlation with causation'],
    pros: ['Large-scale real behavior'], cons: ['No why', 'Tracking gaps'],
    output: 'Funnel charts, segment insights.', project: 'Search logs showed users searching "refund" 4,000 times/month — added a Refund link.',
    practice: 'List 5 events you would track for a course enrollment flow.' },
];

/* ---------------- Toolkit templates ---------------- */
export const TOOLKIT = [
  { id: 'interview-template', name: 'Interview guide', kind: 'template', body:
`INTERVIEW GUIDE — [Project name]
Goal: Understand how [user type] [activity]

1. Intro (5 min)
   - Thank you, purpose, no right/wrong answers
   - Consent to record?
2. Warm-up (5 min)
   - Tell me a little about yourself and your work.
3. Core (30 min)
   - Tell me about the last time you [activity].
   - Walk me through it step by step.
   - What was difficult? What did you do then?
   - What tools or people did you use?
   - How did you feel at that point?
4. Wrap-up (5 min)
   - If you could change one thing, what would it be?
   - Anything I should have asked?
Probes: "Tell me more" · "Why was that?" · "Can you show me?"` },
  { id: 'survey-template', name: 'Survey template', kind: 'template', body:
`SURVEY — [Topic]
Intro: This takes about 3 minutes. Answers are anonymous.

Q1. How often do you [behavior]?  (Never / Monthly / Weekly / Daily)
Q2. How satisfied are you with [experience]?  (1 Very dissatisfied – 5 Very satisfied)
Q3. What is the main reason you [behavior]?  (single choice + Other)
Q4. Which of these have you done in the last month?  (multi-select)
Q5. What is the most frustrating part of [experience]?  (open text)
Q6. Demographic / segment question (only what you'll analyze)

Checklist: one idea per question · neutral wording · pilot with 3 people` },
  { id: 'persona-template', name: 'User persona template', kind: 'template', body:
`PERSONA
Name / Age / Occupation / Location
Quote: "…"
Background: 2–3 sentences
Goals: 1. 2. 3.
Frustrations / Pain points: 1. 2. 3.
Behaviors: devices, frequency, habits
Needs: what would make success easier
Motivations: why they care
Technology usage: comfort level, apps used daily
Source: which research supports this persona` },
  { id: 'research-plan', name: 'Research plan', kind: 'template', body:
`RESEARCH PLAN — [Project]
Background:
Objectives:
Research questions:
 1.
 2.
Method & why:
Participants (criteria, number):
Recruiting:
Timeline:
Roles (moderator, note-taker):
Deliverables:
How findings will be used:` },
  { id: 'usability-script', name: 'Usability testing script', kind: 'template', body:
`USABILITY TEST SCRIPT
Intro: "We're testing the design, not you. Please think aloud — say what you're looking at, trying to do, and thinking. I may not answer questions so I can see how it works without help."
Consent: recording OK?
Background questions (2–3)
Tasks:
 T1 Scenario: … Success = …
 T2 Scenario: … Success = …
 T3 Scenario: … Success = …
After each task: "How easy or difficult was that? (1–7)"
Wrap-up: "What was most confusing? What did you like?"
Thank & compensate` },
  { id: 'competitive-template', name: 'Competitive analysis matrix', kind: 'template', body:
`COMPETITIVE ANALYSIS
Criteria          | Comp A | Comp B | Comp C | Ours
Onboarding steps  |        |        |        |
Key task time     |        |        |        |
Pricing clarity   |        |        |        |
Accessibility     |        |        |        |
Unique features   |        |        |        |
Pain points       |        |        |        |
Patterns observed:
Opportunities:` },
  { id: 'affinity-template', name: 'Affinity mapping guide', kind: 'template', body:
`AFFINITY MAPPING
1. Write one observation per note (fact or quote, with participant ID)
2. Spread notes out; read silently
3. Group by similarity — bottom-up, no predefined categories
4. Name each group with a sentence ("Users don't trust delivery estimates")
5. Group the groups into themes
6. For each theme write: Insight → Implication → Opportunity (How might we…?)` },
  { id: 'report-structure', name: 'Research report structure', kind: 'template', body:
`RESEARCH REPORT
1. Executive summary (top 3 findings + recommendations)
2. Background & goals
3. Method & participants
4. Findings (each: insight, evidence, severity/frequency)
5. Recommendations (prioritized)
6. What worked well (keep)
7. Open questions & next steps
Appendix: tasks, quotes, clips` },
  { id: 'consent-checklist', name: 'Consent checklist', kind: 'checklist', items: ['Explained purpose of the study', 'Explained what data is collected', 'Asked permission to record', 'Explained how data will be stored and for how long', 'Confirmed participant can stop anytime', 'Explained compensation', 'Collected signature or verbal consent on recording', 'Anonymized names in notes'] },
  { id: 'observation-checklist', name: 'Observation checklist', kind: 'checklist', items: ['Environment (noise, light, devices)', 'Tools and artifacts used', 'Sequence of actions', 'Hesitations and pauses', 'Errors and recoveries', 'Workarounds', 'Interruptions', 'Emotional reactions', 'Direct quotes', 'Time taken'] },
];
