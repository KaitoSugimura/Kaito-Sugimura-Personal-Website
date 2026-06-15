// KAITO'S CURIOS — game engine.
//
// A pure, framework-free reducer for the buy/sell roguelite. The component holds
// the state via useReducer and renders it; all rules live here. Randomness is a
// seeded PRNG threaded through state so a run is deterministic and re-render-safe.
//
// Loop: each morning the player drafts 1-of-3 stacking skills, buys wares off the
// shelf at a marked price, and sells them back into the day's DEMAND for a
// premium. Pay an escalating nightly rent. Survive a trading day and Kaito reveals
// the next beat of who he really is. Reach the final morning = win.

import {
  CONFIG,
  RARITY,
  ITEMS,
  CATEGORIES,
  CHEAP_CATEGORIES,
  SKILLS,
  SKILL_BY_ID,
  PORTRAITS,
  QUIPS,
  STORY,
  STORY_DAYS,
} from "./shopData";

const round = Math.round;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// --- seeded PRNG (mulberry32), threaded via an integer state -------------------
function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (n) => Math.floor(next() * n),
    range: (lo, hi) => lo + next() * (hi - lo),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    get state() {
      return a >>> 0;
    },
  };
}

function shuffled(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rng.int(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- skill helpers ------------------------------------------------------------
// state.skills is a map id -> level (>=1). "once" skills sit at level 1.
export function skillLevel(state, id) {
  return (state.skills && state.skills[id]) || 0;
}

// --- pure UI selectors --------------------------------------------------------
export function bagSlots(state) {
  return CONFIG.startSlots + skillLevel(state, "bag") * CONFIG.bagStep;
}

// Kaito's marked buy price for a shelf ware (the "Friendly Regular" skill shaves
// it; fancier rarities cost a touch more).
export function buyPrice(state, inst) {
  const r = RARITY[inst.rarity];
  const markup = Math.max(
    CONFIG.buyMarkupFloor,
    CONFIG.buyMarkup + (r ? r.greed : 0) - skillLevel(state, "discount") * CONFIG.discountStep
  );
  return round(inst.value * markup);
}

// Today's demand entry for a category (or null).
export function wantFor(state, category) {
  return (state.wants || []).find((w) => w.category === category) || null;
}

// What a bag ware sells back to Kaito for TODAY, with the profit vs. what you paid.
// Wanted categories pay value*(1+bonus) sweetened by Connoisseur; everything else
// dumps at value*dumpFactor lifted by Salvage. Free finds (paid 0) are pure profit.
// The wanted premium SATURATES: each same-category sale already made today shrinks
// the next one, so flooding one category in a day pays less and less — spread
// sales across days (and value bag slots) instead of dumping a stack.
export function sellPrice(state, inst) {
  const w = wantFor(state, inst.category);
  const wanted = w != null;
  let frac;
  if (wanted) {
    const sold = (state.daySales && state.daySales[inst.category]) || 0;
    const bonus = (w.bonus + skillLevel(state, "connoisseur") * CONFIG.connoisseurStep) * Math.pow(CONFIG.saturationDecay, sold);
    frac = 1 + bonus;
  } else {
    frac = Math.min(CONFIG.dumpCap, CONFIG.dumpFactor + skillLevel(state, "salvage") * CONFIG.salvageStep);
  }
  const price = round(inst.value * frac);
  const basis = inst.paid != null ? inst.paid : inst.value;
  return { wanted, frac, price, basis, profit: price - basis };
}

// --- face / sfx / toast helpers (deterministic via rng) -----------------------
function pickQuip(rng, key, last) {
  const pool = QUIPS[key] || [];
  if (pool.length === 0) return last || "";
  if (pool.length === 1) return pool[0];
  const fresh = pool.filter((q) => q !== last);
  return rng.pick(fresh.length ? fresh : pool);
}

function setFace(state, rng, moodKey, quipKey) {
  state.mood = moodKey;
  state.portrait = rng.pick(PORTRAITS[moodKey] || PORTRAITS.idle);
  if (quipKey) {
    state.quip = pickQuip(rng, quipKey, state.lastQuip);
    state.lastQuip = state.quip;
  }
}

function sfx(state, cue) {
  state.sfx = { cue, n: (state.sfx ? state.sfx.n : 0) + 1 };
}

function toast(state, text) {
  state.toast = { text, n: (state.toast ? state.toast.n : 0) + 1 };
}

// --- per-day generation -------------------------------------------------------
// Roll a day's demand: a few categories with a sell premium. Always leads with a
// cheap, starter-friendly category so an affordable flip exists every day.
function rollWants(rng) {
  const count = clamp(
    CONFIG.wantsMin + rng.int(CONFIG.wantsMax - CONFIG.wantsMin + 1),
    CONFIG.wantsMin,
    CONFIG.wantsMax
  );
  const cats = [rng.pick(CHEAP_CATEGORIES)];
  for (const c of shuffled(CATEGORIES, rng)) {
    if (cats.length >= count) break;
    if (!cats.includes(c)) cats.push(c);
  }
  return cats.map((category) => ({
    category,
    bonus: round(rng.range(CONFIG.wantBonusMin, CONFIG.wantBonusMax) * 100) / 100,
  }));
}

function makeInstance(item, value) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    rarity: item.rarity,
    flavor: item.flavor,
    value,
  };
}

// Stock the shelf, biased toward today's demand so a same-day flip always exists.
function rollShelf(rng, wants, uidFrom) {
  const shelfCount = clamp(
    CONFIG.shelfMin + rng.int(CONFIG.shelfMax - CONFIG.shelfMin + 1),
    CONFIG.shelfMin,
    CONFIG.shelfMax
  );
  const wantCats = wants.map((w) => w.category);
  const wantedPool = ITEMS.filter((i) => wantCats.includes(i.category));
  const otherPool = ITEMS.filter((i) => !wantCats.includes(i.category));
  const nWanted = Math.min(
    wantedPool.length,
    Math.max(CONFIG.shelfWantedMin, Math.round(shelfCount * CONFIG.shelfWantedFrac))
  );
  const chosen = [
    ...shuffled(wantedPool, rng).slice(0, nWanted),
    ...shuffled(otherPool, rng).slice(0, shelfCount - nWanted),
  ];
  // Guarantee an affordable wanted flip: ensure the cheapest ware of the (cheap)
  // lead demand category is on the shelf, so there's never a stone-cold open.
  const leadCat = wants[0] && wants[0].category;
  if (leadCat) {
    const cheapest = ITEMS.filter((i) => i.category === leadCat).sort((a, b) => a.base - b.base)[0];
    if (cheapest && !chosen.some((c) => c.id === cheapest.id)) chosen[chosen.length - 1] = cheapest;
  }
  let uid = uidFrom;
  const shelf = shuffled(chosen, rng).map((it) => {
    const r = RARITY[it.rarity];
    const value = round(it.base * (1 + rng.range(-r.jit, r.jit)));
    return { uid: uid++, ...makeInstance(it, value) };
  });
  return { shelf, uid };
}

// Build a fresh trading day onto `state`: demand, the next forecast, shelf, rent,
// and the start-of-day skill payouts (stipend coin + lucky finds). Re-seeds the
// face/quip draw from the post-roll rng so the greeting stays on-chain.
function generateDay(state) {
  const rng = makeRng(state.rngState);
  const day = state.day;

  // Today's demand honours the forecast rolled at yesterday's close (a reliable
  // contract that "Market Whisper" lets you read); day 1 rolls fresh.
  const wants = state.forecast && state.forecast.length ? state.forecast : rollWants(rng);
  // Pre-roll tomorrow's demand so the closing ledger can forecast it.
  const forecast = rollWants(rng);

  const built = rollShelf(rng, wants, state.uidSeq);
  let uidSeq = built.uid;

  // Rent climbs each day; the final trading day adds a telegraphed season-end tax.
  let rent = CONFIG.baseRent * Math.pow(CONFIG.rentGrowth, day - 1);
  if (day === CONFIG.victoryDay - 1) rent *= CONFIG.seasonEndTax;
  rent = round(rent);

  // Start-of-day skill payouts.
  const gold = state.gold + skillLevel(state, "stipend") * CONFIG.stipendStep;
  let bag = state.bag;
  const slots = bagSlots(state);
  const finds = skillLevel(state, "luckyFind");
  if (finds > 0 && bag.length < slots) {
    bag = bag.slice();
    for (let i = 0; i < finds && bag.length < slots; i++) {
      const it = rng.pick(ITEMS);
      const r = RARITY[it.rarity];
      const value = round(it.base * (1 + rng.range(-r.jit, r.jit)));
      bag.push({ uid: uidSeq++, ...makeInstance(it, value), paid: 0, boughtDay: day });
    }
  }

  const next = {
    ...state,
    rngState: rng.state,
    uidSeq,
    phase: "shop",
    shelf: built.shelf,
    wants,
    forecast,
    rent,
    gold,
    bag,
    restocksLeft: skillLevel(state, "restock"),
    daySales: {}, // per-category wanted sales today → drives demand saturation
    dayTakings: 0,
    daySpent: 0,
    dayDeals: 0,
  };
  // Greeting face/quip, re-seeded from the advanced chain so it's persisted.
  const rng2 = makeRng(next.rngState);
  setFace(next, rng2, "greet", "greet");
  next.rngState = rng2.state;
  return next;
}

// --- run lifecycle ------------------------------------------------------------
export function createRun(seed) {
  let state = {
    phase: "shop",
    seed: seed >>> 0,
    rngState: (seed >>> 0) || 1,
    uidSeq: 1,
    day: 1,
    gold: CONFIG.startGold,
    bag: [],
    shelf: [],
    wants: [],
    forecast: null,
    rent: 0,
    skills: {}, // id -> level
    draft: null, // current 1-of-3 offer when phase === "draft"
    storyIndex: 0, // next STORY beat to reveal
    pendingStory: null, // { idx, ...beat } shown when phase === "story"
    restocksLeft: 0,
    mood: "greet",
    portrait: "WaveOpenNeck",
    quip: "Welcome to my shop! Take a look around.",
    lastQuip: null,
    dayTakings: 0,
    daySpent: 0,
    dayDeals: 0,
    stats: { earned: 0, spent: 0, deals: 0, daysSurvived: 0 },
    sfx: { cue: null, n: 0 },
    toast: null,
  };
  state = generateDay(state);
  return state;
}

// --- shop actions -------------------------------------------------------------
function buy(state, uid) {
  if (state.phase !== "shop") return state;
  const inst = state.shelf.find((s) => s.uid === uid);
  if (!inst) return state;
  const rng = makeRng(state.rngState);
  const next = { ...state, rngState: rng.state };
  if (state.bag.length >= bagSlots(state)) {
    toast(next, "Your bag is full — sell something first.");
    sfx(next, "BackClick");
    return next;
  }
  const price = buyPrice(state, inst);
  if (price > state.gold) {
    toast(next, "You don't have the coin for that.");
    sfx(next, "BackClick");
    return next;
  }
  next.gold = state.gold - price;
  next.bag = [...state.bag, { ...inst, paid: price, boughtDay: state.day }];
  next.shelf = state.shelf.filter((s) => s.uid !== uid);
  next.daySpent = (state.daySpent || 0) + price;
  next.stats = { ...state.stats, spent: state.stats.spent + price, deals: state.stats.deals + 1 };
  setFace(next, rng, "deal", "buy");
  sfx(next, "SelectConfirm");
  next.rngState = rng.state;
  return next;
}

function sell(state, uid) {
  if (state.phase !== "shop") return state;
  const inst = state.bag.find((b) => b.uid === uid);
  if (!inst) return state;
  const rng = makeRng(state.rngState);
  const next = { ...state, rngState: rng.state };
  const sp = sellPrice(state, inst);
  next.gold = state.gold + sp.price;
  next.bag = state.bag.filter((b) => b.uid !== uid);
  // Record a wanted sale so the same category saturates (next sale earns less).
  if (sp.wanted) {
    const cat = inst.category;
    next.daySales = { ...(state.daySales || {}), [cat]: ((state.daySales && state.daySales[cat]) || 0) + 1 };
  }
  next.dayTakings = (state.dayTakings || 0) + sp.price;
  next.dayDeals = (state.dayDeals || 0) + 1;
  next.stats = {
    ...state.stats,
    earned: state.stats.earned + sp.price,
    deals: state.stats.deals + 1,
  };
  setFace(next, rng, sp.profit > 0 ? "pleased" : "deal", "sell");
  sfx(next, "SelectConfirm");
  next.rngState = rng.state;
  return next;
}

function restock(state) {
  if (state.phase !== "shop") return state;
  const rng = makeRng(state.rngState);
  const next = { ...state, rngState: rng.state };
  if ((state.restocksLeft || 0) <= 0) {
    toast(next, "No restocks left today.");
    sfx(next, "BackClick");
    return next;
  }
  const built = rollShelf(rng, state.wants, state.uidSeq);
  next.shelf = built.shelf;
  next.uidSeq = built.uid;
  next.restocksLeft = state.restocksLeft - 1;
  sfx(next, "MetalClick");
  next.rngState = rng.state;
  return next;
}

// --- skill draft --------------------------------------------------------------
// Offer CONFIG.draftSize skills the player hasn't maxed out. Stackable skills can
// recur across mornings; "once" skills drop out of the pool once taken.
function rollDraft(state, rng) {
  const pool = SKILLS.filter((s) => {
    const lvl = skillLevel(state, s.id);
    return s.kind === "once" ? lvl === 0 : lvl < s.max;
  });
  const picks = shuffled(pool, rng).slice(0, CONFIG.draftSize);
  return picks.map((s) => ({ id: s.id, nextLevel: skillLevel(state, s.id) + 1 }));
}

function openDraft(state) {
  const rng = makeRng(state.rngState);
  const next = { ...state, rngState: rng.state };
  const draft = rollDraft(state, rng);
  // No skills left to offer (everything maxed) — skip straight into the day.
  if (draft.length === 0) {
    next.rngState = rng.state;
    return generateDay(next);
  }
  next.draft = draft;
  next.phase = "draft";
  setFace(next, rng, "pleased", "draft");
  next.rngState = rng.state;
  return next;
}

function pickSkill(state, id) {
  if (state.phase !== "draft") return state;
  if (!state.draft || !state.draft.some((d) => d.id === id)) return state;
  const def = SKILL_BY_ID[id];
  if (!def) return state;
  const lvl = skillLevel(state, id);
  const capped = def.kind === "once" ? 1 : def.max;
  const skills = { ...state.skills, [id]: Math.min(capped, lvl + 1) };
  const next = { ...state, skills, draft: null };
  return generateDay(next);
}

// --- day cycle ----------------------------------------------------------------
function endDay(state) {
  if (state.phase !== "shop") return state;
  return { ...state, phase: "dayEnd" };
}

// After a story card (or directly if none), resolve the morning: win if we've
// reached the victory morning, else open the next skill draft.
function resolveMorning(state) {
  if (state.day >= CONFIG.victoryDay) {
    const rng = makeRng(state.rngState);
    const next = { ...state, rngState: rng.state, phase: "win" };
    next.stats = { ...state.stats, daysSurvived: CONFIG.victoryDay - 1, finalGold: state.gold };
    setFace(next, rng, "pleased", null);
    next.rngState = rng.state;
    sfx(next, "Authenticated");
    return next;
  }
  return openDraft(state);
}

function sleep(state) {
  if (state.phase !== "dayEnd") return state;
  const rng = makeRng(state.rngState);
  const next = { ...state, rngState: rng.state };

  if (state.gold < state.rent) {
    next.phase = "over";
    next.stats = {
      ...state.stats,
      daysSurvived: Math.max(0, state.day - 1),
      finalGold: state.gold,
    };
    sfx(next, "WarningInit");
    next.rngState = rng.state;
    return next;
  }

  next.gold = state.gold - state.rent;
  const dayDone = state.day; // the trading day just survived
  next.day = state.day + 1;
  next.stats = { ...state.stats, daysSurvived: dayDone };
  sfx(next, "BarFill");

  // Milestone story: if a beat is mapped to the day just survived, reveal it
  // before resolving the morning (so a card earned on the final night is shown).
  if (state.storyIndex < STORY.length && STORY_DAYS[state.storyIndex] === dayDone) {
    const idx = state.storyIndex;
    next.storyIndex = idx + 1;
    next.pendingStory = { idx, ...STORY[idx] };
    next.phase = "story";
    next.portrait = STORY[idx].portrait;
    next.mood = "pleased";
    next.quip = STORY[idx].text;
    sfx(next, "Welcome");
    next.rngState = rng.state;
    return next;
  }

  next.rngState = rng.state;
  return resolveMorning(next);
}

function ackStory(state) {
  if (state.phase !== "story") return state;
  return resolveMorning({ ...state, pendingStory: null });
}

// --- public reducer -----------------------------------------------------------
export function reduce(state, action) {
  switch (action.type) {
    case "BUY":
      return buy(state, action.uid);
    case "SELL":
      return sell(state, action.uid);
    case "RESTOCK":
      return restock(state);
    case "END_DAY":
      return endDay(state);
    case "SLEEP":
      return sleep(state);
    case "ACK_STORY":
      return ackStory(state);
    case "PICK_SKILL":
      return pickSkill(state, action.id);
    case "RESTART":
      return createRun(action.seed >>> 0);
    default:
      return state;
  }
}
