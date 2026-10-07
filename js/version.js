/* Single source of truth for the app version. tools/release.py keeps this
   and the service worker's CACHE_VERSION in sync. */
export const APP_VERSION = '3.0.0';

/* Shown once after an update (newest first). */
export const CHANGELOG = [
  { version: '3.0.0', date: '2026-10', items: [
    'Every lesson, UX law and research method now has a visual example',
    'Figma lessons and all 2,646 Figma items show step-by-step editor pictures with the exact spot highlighted',
    'Glossary expanded to 250 terms, each with a visual example',
    'Challenges and guided project stages now include related visuals',
    'Icons resized consistently (the Notes icon was too large)',
    'Installed apps now detect and apply updates automatically',
  ] },
  { version: '1.1.0', date: '2026-10', items: ['150 new exam questions (question bank: 279)'] },
  { version: '1.0.0', date: '2026-10', items: ['First release'] },
];
