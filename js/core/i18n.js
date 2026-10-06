/* Interface strings (Bangla default, English). Lesson content carries its own
   bilingual fields and is resolved with L(). */
import { store } from './state.js';

const dict = {
  bn: {
    dashboard: 'ড্যাশবোর্ড', learnUx: 'UX শিখুন', fundamentals: 'Fundamentals', hci: 'Human Interaction', research: 'UX Research',
    laws: 'UX Laws', ia: 'Information Architecture', userflow: 'User Flow', wireframing: 'Wireframing', prototyping: 'Prototyping',
    usability: 'Usability Testing', accessibility: 'Accessibility', uiDesign: 'UI Design', typography: 'Typography', color: 'Color',
    layout: 'Layout', components: 'Components', designSystems: 'Design Systems', figma: 'Figma', beginner: 'Beginner',
    intermediate: 'Intermediate', advanced: 'Advanced', figmaItems: 'Figma Library', plugins: 'Plugins', cases: 'কেস স্টাডি',
    practice: 'অনুশীলন', challenges: 'চ্যালেঞ্জ', exams: 'পরীক্ষা', glossary: 'শব্দকোষ', bookmarks: 'বুকমার্ক', progress: 'অগ্রগতি',
    settings: 'সেটিংস', profile: 'প্রোফাইল', home: 'হোম', learn: 'শিখুন', mindset: 'Design Mindset', career: 'ক্যারিয়ার',
    projects: 'প্রজেক্ট', roadmap: 'রোডম্যাপ', toolkit: 'রিসার্চ টুলকিট', compareLab: 'Good vs Bad Lab', critiqueLab: 'Critique Lab',
    flowLab: 'User Flow Lab', persona: 'Persona Builder', review: 'রিভিশন',
    searchPh: 'লেসন, UX law, plugin খুঁজুন…', streak: 'স্ট্রিক', days: 'দিন', xp: 'XP', level: 'লেভেল',
    goodMorning: 'শুভ সকাল', goodAfternoon: 'শুভ অপরাহ্ন', goodEvening: 'শুভ সন্ধ্যা',
    todaysLearning: 'আজকের পড়া', startToday: 'আজকের পড়া শুরু করুন', estTime: 'আনুমানিক সময়', minutes: 'মিনিট',
    overall: 'সামগ্রিক অগ্রগতি', weakAreas: 'দুর্বল বিষয়', improveWeak: 'দুর্বল বিষয় উন্নত করুন', recent: 'সম্প্রতি পড়া',
    dueReview: 'রিভিউ বাকি', dailyGoal: 'দৈনিক লক্ষ্য', weeklyGoal: 'সাপ্তাহিক লক্ষ্য', completed: 'সম্পন্ন', remaining: 'বাকি',
    markComplete: 'সম্পন্ন হিসেবে চিহ্নিত করুন', completedLbl: 'সম্পন্ন হয়েছে', bookmark: 'বুকমার্ক', bookmarked: 'বুকমার্ক করা',
    addNote: 'নোট যোগ করুন', notes: 'নোট', saveNote: 'নোট সেভ করুন', next: 'পরবর্তী', prev: 'আগের', quiz: 'মিনি কুইজ',
    checkAnswer: 'উত্তর যাচাই করুন', related: 'সম্পর্কিত', offline: 'আপনি অফলাইনে আছেন — সব লেসন এখনও কাজ করবে।',
    noResults: 'কিছু পাওয়া যায়নি', install: 'অ্যাপ ইনস্টল করুন', viewAll: 'সব দেখুন', start: 'শুরু করুন', all: 'সব',
  },
  en: {
    dashboard: 'Dashboard', learnUx: 'Learn UX', fundamentals: 'Fundamentals', hci: 'Human Interaction', research: 'UX Research',
    laws: 'UX Laws', ia: 'Information Architecture', userflow: 'User Flow', wireframing: 'Wireframing', prototyping: 'Prototyping',
    usability: 'Usability Testing', accessibility: 'Accessibility', uiDesign: 'UI Design', typography: 'Typography', color: 'Color',
    layout: 'Layout', components: 'Components', designSystems: 'Design Systems', figma: 'Figma', beginner: 'Beginner',
    intermediate: 'Intermediate', advanced: 'Advanced', figmaItems: 'Figma Library', plugins: 'Plugins', cases: 'Case Studies',
    practice: 'Practice', challenges: 'Challenges', exams: 'Exams', glossary: 'Glossary', bookmarks: 'Bookmarks', progress: 'Progress',
    settings: 'Settings', profile: 'Profile', home: 'Home', learn: 'Learn', mindset: 'Design Mindset', career: 'Career',
    projects: 'Projects', roadmap: 'Roadmap', toolkit: 'Research Toolkit', compareLab: 'Good vs Bad Lab', critiqueLab: 'Critique Lab',
    flowLab: 'User Flow Lab', persona: 'Persona Builder', review: 'Review',
    searchPh: 'Search lessons, UX laws, plugins…', streak: 'Streak', days: 'days', xp: 'XP', level: 'Level',
    goodMorning: 'Good morning', goodAfternoon: 'Good afternoon', goodEvening: 'Good evening',
    todaysLearning: "Today's learning", startToday: "Start today's learning", estTime: 'Estimated time', minutes: 'min',
    overall: 'Overall progress', weakAreas: 'Weak areas', improveWeak: 'Improve weak areas', recent: 'Recently studied',
    dueReview: 'Due for review', dailyGoal: 'Daily goal', weeklyGoal: 'Weekly goal', completed: 'Completed', remaining: 'Remaining',
    markComplete: 'Mark as complete', completedLbl: 'Completed', bookmark: 'Bookmark', bookmarked: 'Bookmarked',
    addNote: 'Add note', notes: 'Notes', saveNote: 'Save note', next: 'Next', prev: 'Previous', quiz: 'Mini quiz',
    checkAnswer: 'Check answer', related: 'Related', offline: "You're offline — every lesson still works.",
    noResults: 'Nothing found', install: 'Install app', viewAll: 'View all', start: 'Start', all: 'All',
  },
};

export const t = (key) => dict[store.settings.lang]?.[key] ?? dict.en[key] ?? key;

/** Resolve bilingual content: {bn, en} | string. Falls back gracefully. */
export function L(v, lang = store.settings.contentLang) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v;
  return v[lang] ?? v.en ?? v.bn ?? '';
}
/** Title in interface language, keeping English technical names. */
export function T(item) {
  if (!item) return '';
  const lang = store.settings.lang;
  if (lang === 'bn' && item.titleBn) return item.titleBn;
  return typeof item.title === 'string' ? item.title : L(item.title, lang);
}
