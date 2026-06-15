import { useCallback, useRef, useState } from "react";
import { STORY } from "./shopData";

// ---- persistent records (best run, wins, unlocked story) ---------------------
// Versioned so the schema can grow without corrupting a returning player's save.
// Bump RECORDS_VERSION and add a step to migrateRecords() whenever the shape
// changes; loadRecords() upgrades any older blob before it's used or re-saved.
const RECORDS_VERSION = 3;
const RECORDS_KEY = `kaitosCurios.records.v${RECORDS_VERSION}`;
const LEGACY_RECORDS_KEYS = ["kaitosCurios.records.v2", "kaitosCurios.records.v1"];
const DEFAULT_RECORDS = {
  version: RECORDS_VERSION,
  bestGold: 0,
  bestDay: 0,
  wins: 0,
  runs: 0,
  lore: [], // indices of STORY beats the player has ever unlocked
};

// Bring a stored blob of any prior version up to the current shape. Steps are
// small and additive; this never throws (callers fall back to DEFAULT_RECORDS).
function migrateRecords(stored) {
  let r = stored && typeof stored === "object" ? { ...stored } : {};
  // v1/v2 carried haggle-era fields (bestRapport, bestStreak). v3 drops them —
  // the spread keeps any stragglers harmless; the kept fields below are canonical.
  if (!r.version || r.version < 3) {
    r = {
      version: 3,
      bestGold: typeof r.bestGold === "number" ? r.bestGold : 0,
      bestDay: typeof r.bestDay === "number" ? r.bestDay : 0,
      wins: typeof r.wins === "number" ? r.wins : 0,
      runs: typeof r.runs === "number" ? r.runs : 0,
      lore: r.lore,
    };
  }
  // Defensive: lore must be a deduped array of in-range story-beat indices.
  r.lore = Array.isArray(r.lore)
    ? [...new Set(r.lore)].filter((i) => Number.isInteger(i) && i >= 0 && i < STORY.length)
    : [];
  return r;
}

function loadRecords() {
  try {
    let raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) {
      // Adopt a save from an older key once; it is re-persisted under the
      // current key on the next save.
      for (const k of LEGACY_RECORDS_KEYS) {
        const legacy = localStorage.getItem(k);
        if (legacy) {
          raw = legacy;
          break;
        }
      }
    }
    if (raw) return { ...DEFAULT_RECORDS, ...migrateRecords(JSON.parse(raw)) };
  } catch {
    /* storage unavailable or corrupt — fall back to a fresh record */
  }
  return { ...DEFAULT_RECORDS };
}

function saveRecords(r) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(r));
  } catch {
    /* storage unavailable (private mode / blocked) — best-effort only */
  }
}

// Persistence hook. Returns `[records, mutate]`. `mutate(updater)` applies the
// updater to the LATEST records (via an internal ref, so there's no stale-closure
// drift between effects firing in the same tick), then persists and re-renders —
// all in one step. Returning the same object from the updater is a no-op (skips
// the write), which keeps the lore-banking and end-of-run effects idempotent
// under React StrictMode's double-invoke. This is the single home for any future
// records field: add it to DEFAULT_RECORDS and migrateRecords, write it here.
export function useRecords() {
  const ref = useRef(null);
  if (ref.current === null) ref.current = loadRecords();
  const [records, setRecords] = useState(ref.current);
  const mutate = useCallback((updater) => {
    const next = updater(ref.current);
    if (next === ref.current) return ref.current;
    ref.current = next;
    setRecords(next);
    saveRecords(next);
    return next;
  }, []);
  return [records, mutate];
}
