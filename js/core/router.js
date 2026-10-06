/* Minimal hash router with :params. Views are loaded lazily (code-splitting
   friendly) and receive { params, query }. */
import { parseHash } from './utils.js';

const routes = [];
let notFound = null;
let onChange = null;

export function route(pattern, loader, name = pattern) {
  routes.push({ parts: pattern.split('/').filter(Boolean), loader, name });
}
export function fallback(loader) { notFound = loader; }

function match(path) {
  for (const r of routes) {
    if (r.parts.length !== path.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < r.parts.length; i++) {
      const p = r.parts[i];
      if (p.startsWith(':')) params[p.slice(1)] = path[i];
      else if (p !== path[i]) { ok = false; break; }
    }
    if (ok) return { ...r, params };
  }
  return null;
}

export function resolve() {
  const { path, query } = parseHash();
  if (!path.length) return { loader: routes[0].loader, params: {}, query, name: routes[0].name, path };
  const m = match(path);
  if (m) return { loader: m.loader, params: m.params, query, name: m.name, path };
  return { loader: notFound, params: {}, query, name: '404', path };
}

export function start(handler) {
  onChange = handler;
  window.addEventListener('hashchange', () => onChange(resolve()));
  onChange(resolve());
}

export const navigate = (hash) => { if (location.hash === hash) onChange?.(resolve()); else location.hash = hash; };
/** Update query string without adding history noise or re-rendering. */
export function replaceQuery(hashWithQuery) {
  history.replaceState(null, '', hashWithQuery);
}
