/* ==========================================================================
   SyncManager: bridges LOCAL data (store / IndexedDB) and REMOTE data
   (RemoteStore). Merge strategy is per-field and conflict-tolerant:
   - completed/bookmarks/badges/reviews: union, newest timestamp wins
   - notes: union by note id
   - xp: max; exams: union by timestamp; streak: max best/count
   ========================================================================== */
import { store } from '../core/state.js';
import { NullRemoteStore } from './remote-store.js';

export function mergeLearner(local, remote) {
  if (!remote) return local;
  const out = structuredClone(local);
  const newer = (a, b) => ((a?.ts || a || 0) >= (b?.ts || b || 0) ? a : b);
  for (const k of ['completed', 'bookmarks', 'badges', 'reviews', 'quiz', 'challenges', 'critiques', 'projects', 'activity']) {
    out[k] = { ...(remote[k] || {}), ...(local[k] || {}) };
    for (const id of Object.keys(remote[k] || {})) if (local[k]?.[id]) out[k][id] = newer(local[k][id], remote[k][id]);
  }
  out.notes = { ...remote.notes };
  for (const [key, list] of Object.entries(local.notes || {})) { const ids = new Set((out.notes[key] || []).map((n) => n.id)); out.notes[key] = [...(out.notes[key] || []), ...list.filter((n) => !ids.has(n.id))]; }
  out.xp = Math.max(local.xp || 0, remote.xp || 0);
  const ts = new Set((local.exams || []).map((e) => e.ts)); out.exams = [...local.exams, ...(remote.exams || []).filter((e) => !ts.has(e.ts))].sort((a, b) => a.ts - b.ts);
  out.streak = (local.streak?.last || '') >= (remote.streak?.last || '') ? local.streak : remote.streak;
  out.streak.best = Math.max(local.streak?.best || 0, remote.streak?.best || 0);
  out.updatedAt = Date.now();
  return out;
}

class SyncManager {
  constructor(remote = new NullRemoteStore()) { this.remote = remote; this.state = 'disabled'; this.lastSync = null; }
  statusLabel() { return this.remote.available ? (this.lastSync ? `Synced ${new Date(this.lastSync).toLocaleTimeString()}` : this.state) : 'Not connected (offline-only)'; }
  async syncNow() {
    if (!this.remote.available) return false;
    const user = await this.remote.currentUser(); if (!user) return false;
    this.state = 'syncing';
    const merged = mergeLearner(store.user, await this.remote.pull(user.uid));
    await store.replaceUser(merged);
    await this.remote.push(user.uid, merged);
    this.lastSync = Date.now(); this.state = 'synced';
    return true;
  }
}
export const sync = new SyncManager();
