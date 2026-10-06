/* ==========================================================================
   Global search: an inverted index with prefix matching. Built lazily (idle)
   so start-up stays fast. Scales to tens of thousands of records.
   ========================================================================== */
import { C } from '../../data/content.js';

let index = null;       // Map token -> Set(docIdx)
let tokens = null;      // sorted array of tokens for prefix binary search
let docs = null;

const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are', 'with', 'how', 'what', 'why', 'it', 'its', 'be', 'by', 'as', 'at', 'this', 'that']);

export function tokenize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]s\b/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t && t.length > 1 && !STOP.has(t));
}

export function buildIndex() {
  if (index) return;
  docs = C.searchDocs;
  index = new Map();
  docs.forEach((d, i) => {
    const weighted = [
      [d.title, 3], [d.kw || '', 2], [d.sub || '', 1], [d.text || '', 1],
    ];
    d._title = d.title.toLowerCase();
    for (const [text, w] of weighted) {
      for (const tok of tokenize(text)) {
        let m = index.get(tok);
        if (!m) { m = new Map(); index.set(tok, m); }
        m.set(i, Math.max(m.get(i) || 0, w));
      }
    }
  });
  tokens = Array.from(index.keys()).sort();
}

function prefixTokens(p) {
  let lo = 0, hi = tokens.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (tokens[mid] < p) lo = mid + 1; else hi = mid; }
  const out = [];
  for (let i = lo; i < tokens.length && tokens[i].startsWith(p) && out.length < 60; i++) out.push(tokens[i]);
  return out;
}

/** Returns scored docs; optional `types` filter (Set of type names). */
export function search(query, { limit = 50, types = null } = {}) {
  buildIndex();
  const q = tokenize(query);
  if (!q.length) return [];
  let scores = null;
  for (const term of q) {
    const local = new Map();
    for (const tok of prefixTokens(term)) {
      const exact = tok === term ? 2 : 1;
      for (const [i, w] of index.get(tok)) local.set(i, Math.max(local.get(i) || 0, w * exact));
    }
    if (!scores) scores = local;
    else { // AND semantics across terms
      const next = new Map();
      for (const [i, s] of scores) if (local.has(i)) next.set(i, s + local.get(i));
      scores = next;
    }
    if (!scores.size) return [];
  }
  const ql = query.trim().toLowerCase();
  const res = [];
  for (const [i, s] of scores) {
    const d = docs[i];
    if (types && !types.has(d.type)) continue;
    let score = s + (d._title.startsWith(ql) ? 6 : d._title.includes(ql) ? 3 : 0) + (d.boost || 0);
    res.push({ ...d, score });
  }
  return res.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function highlight(text, query) {
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let out = esc(text);
  const toks = tokenize(query).sort((a, b) => b.length - a.length);
  for (const t of toks) {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    out = out.replace(re, '<mark>$1</mark>');
  }
  return out;
}

/** Warm the index in idle time. */
export function warm() {
  const go = () => { try { buildIndex(); } catch (e) { console.warn(e); } };
  if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 3000 }); else setTimeout(go, 800);
}
