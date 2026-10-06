/* ==========================================================================
   LOCAL DATA LAYER
   - IndexedDB holds structured learner data (progress, notes, exams…).
   - localStorage holds only small settings.
   - If IndexedDB is unavailable (private mode on some browsers), we fall back
     to localStorage so the app still works.
   Remote (Firebase) storage lives in /js/firebase and never touches this file.
   ========================================================================== */

const DB_NAME = 'uxui-db';
const DB_VERSION = 1;
const STORE = 'kv';
const LS_PREFIX = 'uxui.';

class IDBStore {
  constructor() { this.dbp = null; }
  open() {
    if (this.dbp) return this.dbp;
    this.dbp = new Promise((resolve, reject) => {
      if (!('indexedDB' in self)) return reject(new Error('IndexedDB unavailable'));
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('IndexedDB blocked'));
    });
    return this.dbp;
  }
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const s = t.objectStore(STORE);
      const r = fn(s);
      t.oncomplete = () => resolve(r && 'result' in r ? r.result : undefined);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }
  get(key) { return this.tx('readonly', (s) => s.get(key)); }
  set(key, val) { return this.tx('readwrite', (s) => s.put(val, key)); }
  del(key) { return this.tx('readwrite', (s) => s.delete(key)); }
  clear() { return this.tx('readwrite', (s) => s.clear()); }
}

class LSStore {
  get(key) { try { const v = localStorage.getItem(LS_PREFIX + 'db.' + key); return Promise.resolve(v ? JSON.parse(v) : undefined); } catch { return Promise.resolve(undefined); } }
  set(key, val) { try { localStorage.setItem(LS_PREFIX + 'db.' + key, JSON.stringify(val)); } catch { /* quota */ } return Promise.resolve(); }
  del(key) { localStorage.removeItem(LS_PREFIX + 'db.' + key); return Promise.resolve(); }
  clear() { Object.keys(localStorage).filter((k) => k.startsWith(LS_PREFIX + 'db.')).forEach((k) => localStorage.removeItem(k)); return Promise.resolve(); }
}

/** LocalStore picks IndexedDB first and falls back transparently. */
export class LocalStore {
  constructor() { this.backend = null; this.kind = 'none'; }
  async init() {
    try {
      const idb = new IDBStore();
      await idb.open();
      this.backend = idb; this.kind = 'indexeddb';
    } catch {
      this.backend = new LSStore(); this.kind = 'localstorage';
    }
    return this;
  }
  get(k) { return this.backend.get(k); }
  set(k, v) { return this.backend.set(k, v); }
  del(k) { return this.backend.del(k); }
  clear() { return this.backend.clear(); }
}

/** Small settings — synchronous, localStorage only. */
export const settingsStore = {
  key: LS_PREFIX + 'settings',
  load() { try { return JSON.parse(localStorage.getItem(this.key) || '{}'); } catch { return {}; } },
  save(obj) { try { localStorage.setItem(this.key, JSON.stringify(obj)); } catch { /* ignore */ } },
  clear() { localStorage.removeItem(this.key); },
};

export const localStore = new LocalStore();
