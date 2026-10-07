/* ==========================================================================
   Centralized state. One observable store with two documents:
   - settings (small, localStorage)
   - user     (learner data, IndexedDB)
   All writes go through store.update() so persistence + sync stay consistent.
   ========================================================================== */
import { localStore, settingsStore } from './storage.js';
import { debounce } from './utils.js';

export const SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS = Object.freeze({
  lang: 'bn',          // interface language
  contentLang: 'bn',   // lesson explanation language (lesson switch)
  theme: 'light',
  fontSize: 'md',
  dailyGoalMin: 30,
  weeklyGoalXp: 700,
  reminders: false,
  reduceMotion: false,
  sidebarGroups: {},
  lastVersion: null,
});

export function defaultUser() {
  const now = Date.now();
  return {
    schema: SCHEMA_VERSION,
    profile: { name: '', createdAt: now },
    xp: 0,
    completed: {},     // "type:id" -> timestamp
    streak: { count: 0, best: 0, last: null },
    activity: {},      // "YYYY-MM-DD" -> { xp, items, minutes }
    history: [],       // recent { key, title, route, ts }
    bookmarks: {},     // key -> { key, type, title, route, ts }
    notes: {},         // key -> [{ id, text, ts }]
    exams: [],         // exam attempts
    quiz: {},          // questionId -> { correct, ts, tries }
    topicStats: {},    // tag -> { c, t }
    reviews: {},       // key -> { stage, due, title, route }
    personas: [],
    flows: [],
    challenges: {},    // id -> { done, checks, ts }
    critiques: {},     // id -> { answer, ts }
    projects: {},      // id -> { steps: {stepIdx:true}, notes: {} }
    toolkit: {},       // checklist states
    badges: {},        // id -> ts
    daily: { date: null, checks: {} },
    updatedAt: now,
  };
}

class Store {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.user = defaultUser();
    this.listeners = new Set();
    this.ready = false;
    this._persist = debounce(() => this.flush(), 250);
    this.dirty = false;
  }

  async init() {
    this.settings = { ...DEFAULT_SETTINGS, ...settingsStore.load() };
    await localStore.init();
    const saved = await localStore.get('user').catch(() => null);
    this.user = migrate(saved);
    this.ready = true;
    return this;
  }

  /** Mutate the user doc in place via fn(user), then persist + notify. */
  update(fn, { silent = false } = {}) {
    const r = fn(this.user);
    this.user.updatedAt = Date.now();
    this.dirty = true;
    this._persist();
    if (!silent) this.emit('user');
    return r;
  }

  setSetting(key, value) {
    this.settings[key] = value;
    settingsStore.save(this.settings);
    this.emit('settings', key);
  }

  async flush() {
    if (!this.dirty) return;
    this.dirty = false;
    try { await localStore.set('user', this.user); }
    catch (e) { console.warn('Persist failed', e); this.dirty = true; }
  }

  async replaceUser(doc) {
    this.user = migrate(doc);
    this.dirty = true;
    await this.flush();
    this.emit('user');
  }

  async reset() {
    this.user = defaultUser();
    this.dirty = true;
    await this.flush();
    this.emit('user');
  }

  async clearAll() {
    await localStore.clear();
    settingsStore.clear();
    this.settings = { ...DEFAULT_SETTINGS };
    this.user = defaultUser();
    this.emit('settings');
    this.emit('user');
  }

  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit(kind, detail) { this.listeners.forEach((fn) => { try { fn(kind, detail); } catch (e) { console.error(e); } }); }
}

/** Forward-compatible migration: fill any missing fields from defaults. */
export function migrate(doc) {
  const base = defaultUser();
  if (!doc || typeof doc !== 'object') return base;
  const out = { ...base, ...doc };
  for (const k of Object.keys(base)) {
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
      out[k] = { ...base[k], ...(doc[k] || {}) };
    }
    if (Array.isArray(base[k]) && !Array.isArray(doc[k])) out[k] = base[k];
  }
  out.schema = SCHEMA_VERSION;
  return out;
}

export const store = new Store();
export const S = () => store.settings;
export const U = () => store.user;
