/* Export / import of learner data (JSON). Lets users move progress between
   devices before cloud sync exists. Validates shape before replacing data. */
import { store, SCHEMA_VERSION, migrate } from './state.js';
import { settingsStore } from './storage.js';

export function exportData() {
  return { app: 'UX-UI', kind: 'learner-export', schema: SCHEMA_VERSION, exportedAt: new Date().toISOString(), settings: store.settings, user: store.user };
}

export async function importData(json) {
  if (!json || json.app !== 'UX-UI' || json.kind !== 'learner-export') throw new Error('This file is not a UX-UI progress export.');
  if (!json.user || typeof json.user !== 'object') throw new Error('The file has no learner data.');
  if ((json.schema || 0) > SCHEMA_VERSION) throw new Error('This file comes from a newer version of the app. Update the app first.');
  const user = migrate(json.user);
  if (typeof user.xp !== 'number' || user.xp < 0) throw new Error('XP value is invalid.');
  await store.replaceUser(user);
  if (json.settings && typeof json.settings === 'object') { Object.assign(store.settings, json.settings); settingsStore.save(store.settings); store.emit('settings'); }
  return `${Object.keys(user.completed).length} completed items, ${user.xp} XP, ${Object.keys(user.bookmarks).length} bookmarks, ${user.exams.length} exam results`;
}
