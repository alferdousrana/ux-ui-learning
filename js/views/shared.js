/* Shared view helpers: progress statistics across tracks/modules. */
import { C } from '../../data/content.js';
import { isDone } from '../core/progress.js';
import { pct } from '../core/utils.js';

export function stats(items) { const done = items.filter(isDone).length; return { done, total: items.length, pct: pct(done, items.length) }; }
export const trackStats = () => C.tracks.map((tr) => ({ ...tr, ...stats(tr.items) }));
export const moduleStats = (m) => stats(m.items);
export function overall() { return stats([...C.path, ...C.cases.map((c) => 'case:' + c.id)]); }
export function greeting(t) { const h = new Date().getHours(); return h < 12 ? t('goodMorning') : h < 17 ? t('goodAfternoon') : t('goodEvening'); }
