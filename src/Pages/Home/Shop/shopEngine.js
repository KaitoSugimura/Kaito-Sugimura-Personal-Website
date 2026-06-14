// KAITO'S CURIOS — game engine.
//
// A pure, framework-free reducer for the haggling roguelike. The component holds
// the state via useReducer and renders it; all rules live here. Randomness is a
// seeded PRNG threaded through state so a run is deterministic and re-render-safe.

import {
  CONFIG,
  RARITY,
  ITEMS,
  CATEGORIES,
  EVENTS,
  RAPPORT_TIERS,
  PORTRAITS,
  QUIPS,
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

// --- mood / quip helpers (deterministic via rng) ------------------------------
function setFace(state, rng, moodKey, quipKey) {
  state.mood = moodKey;
  state.portrait = rng.pick(PORTRAITS[moodKey] || PORTRAITS.idle);
  if (quipKey) state.quip = rng.pick(QUIPS[quipKey] || []);
}

function sfx(state, cue) {
  state.sfx = { cue, n: (state.sfx ? state.sfx.n : 0) + 1 };
}

function toast(state, text) {
  state.toast = { text, n: (state.toast ? state.toast.n : 0) + 1 };
}

// --- per-day generation -------------------------------------------------------
function bagSlots(state) {
  return CONFIG.startSlots + (state.perks.slots || 0);
}

function makeInstance(state, item, rng) {
  const r = RARITY[item.rarity];
  const value = round(item.base * (1 + rng.range(-r.jit, r.jit)));
  return {
    uid: state.uidSeq++,
    id: item.id,
    name: item.name,
    category: item.category,
    rarity: item.rarity,
    flavor: item.flavor,
    value,
  };
}

function priceShelfItem(inst, state, event) {
  const r = RARITY[inst.rarity];
  const askRelief = Math.min(0.16, state.rapport * 0.0015);
  let ask = inst.value * (1.3 + r.greed - askRelief);
  if (event && event.effect.shelfDiscount) ask *= 1 - event.effect.shelfDiscount;
  if (state.perks.discount) ask *= 0.95;
  let floor = inst.value * (1.06 + r.greed * 0.3 - state.rapport * 0.0006);
  if (state.perks.discount) floor *= 0.97;
  floor = Math.max(floor, inst.value * 1.03);
  ask = Math.max(ask, floor + Math.max(2, inst.value * 0.06));
  return { ...inst, ask: round(ask), floor: round(floor) };
}

function generateDay(state) {
  const rng = makeRng(state.rngState);
  const day = state.day;

  // event (from day 2): ~60% chance, never repeat the previous one
  let event = null;
  if (day >= 2 && rng.next() < 0.62) {
    const pool = EVENTS.filter((e) => e.id !== state.lastEventId);
    event = rng.pick(pool);
  }

  // today's wants (categories Kaito pays a premium for). Always include one
  // "starter-friendly" cheap category so an affordable flip exists every day.
  let wantCount = clamp(
    CONFIG.wantsMin + rng.int(CONFIG.wantsMax - CONFIG.wantsMin + 1),
    CONFIG.wantsMin,
    CONFIG.wantsMax
  );
  if (event && event.effect.fewerWants) wantCount = Math.max(1, wantCount - event.effect.fewerWants);

  const wantBonus = (event && event.effect.wantBonus) || 0;
  let wantCats;
  if (event && event.effect.categoryWant) {
    wantCats = event.effect.categoryWant.slice(0, wantCount);
  } else {
    const cheap = ["Potion", "Food", "Tool", "Trinket"].filter((c) => CATEGORIES.includes(c));
    wantCats = [rng.pick(cheap)];
    for (const c of shuffled(CATEGORIES, rng)) {
      if (wantCats.length >= wantCount) break;
      if (!wantCats.includes(c)) wantCats.push(c);
    }
  }
  const wants = wantCats.map((category) => ({
    category,
    bonus: round((rng.range(0.55, 0.9) + wantBonus) * 100) / 100,
  }));

  // shelf — biased toward today's wanted categories so there are always flips
  const shelfCount = clamp(
    CONFIG.shelfMin + rng.int(CONFIG.shelfMax - CONFIG.shelfMin + 1),
    CONFIG.shelfMin,
    CONFIG.shelfMax
  );
  const wantedPool = ITEMS.filter((i) => wantCats.includes(i.category));
  const otherPool = ITEMS.filter((i) => !wantCats.includes(i.category));
  const nWanted = Math.min(wantedPool.length, Math.max(2, Math.round(shelfCount * 0.6)));
  const chosen = [
    ...shuffled(wantedPool, rng).slice(0, nWanted),
    ...shuffled(otherPool, rng).slice(0, shelfCount - nWanted),
  ];
  const shelf = shuffled(chosen, rng).map((it) =>
    priceShelfItem(makeInstance(state, it, rng), state, event)
  );

  // rent
  let rent = CONFIG.baseRent * Math.pow(CONFIG.rentGrowth, day - 1);
  if (event && event.effect.rentMult) rent *= event.effect.rentMult;
  rent = round(rent);

  const dayPatienceBonus = (event && event.effect.patience) || 0;

  return {
    ...state,
    rngState: rng.state,
    shelf,
    wants,
    rent,
    event,
    lastEventId: event ? event.id : state.lastEventId,
    dayPatienceBonus,
    dayTakings: 0,
  };
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
    rapport: 0,
    tier: 0,
    perks: { appraise: false, patience: 0, slots: 0, discount: false },
    mood: "greet",
    portrait: "WaveOpenNeck",
    quip: "Welcome to my shop! Take a look around.",
    haggle: null,
    event: null,
    lastEventId: null,
    pendingTier: null,
    dayPatienceBonus: 0,
    dayTakings: 0,
    stats: { earned: 0, spent: 0, deals: 0, daysSurvived: 0, bestRapport: 0 },
    sfx: { cue: null, n: 0 },
    toast: null,
  };
  state = generateDay(state);
  return state;
}

// --- haggle setup -------------------------------------------------------------
function maxPatience(state) {
  return CONFIG.basePatience + (state.perks.patience || 0) + (state.dayPatienceBonus || 0);
}

function wantBonusFor(state, category) {
  const w = state.wants.find((x) => x.category === category);
  return w ? w.bonus : null;
}

function startHaggle(state, side, uid) {
  const rng = makeRng(state.rngState);
  let next = { ...state, rngState: rng.state };

  if (side === "buy") {
    if (state.bag.length >= bagSlots(state)) {
      toast(next, "Your bag is full — sell something first.");
      sfx(next, "BackClick");
      return next;
    }
    const inst = state.shelf.find((s) => s.uid === uid);
    if (!inst) return next;
    next.haggle = {
      side: "buy",
      inst,
      value: inst.value,
      ask: inst.ask,
      floor: inst.floor,
      patience: maxPatience(state),
      maxPatience: maxPatience(state),
      price: inst.ask,
      lastOffer: null,
      status: "active",
      final: false,
      wanted: false,
    };
    setFace(next, rng, "greet", "buyGreet");
  } else {
    const inst = state.bag.find((b) => b.uid === uid);
    if (!inst) return next;
    const wb = wantBonusFor(state, inst.category);
    const wanted = wb != null;
    const ceil = round(inst.value * (wanted ? 1 + wb : CONFIG.dumpFactor));
    const offer = round(inst.value * (wanted ? 0.85 : 0.38));
    next.haggle = {
      side: "sell",
      inst,
      value: inst.value,
      offer,
      ceil,
      patience: maxPatience(state),
      maxPatience: maxPatience(state),
      price: offer,
      lastOffer: null,
      status: "active",
      final: false,
      wanted,
    };
    setFace(next, rng, "greet", "sellGreet");
  }
  next.phase = "haggle";
  next.rngState = rng.state; // persist the advance from the greeting face/quip pick
  return next;
}

// --- haggle resolution --------------------------------------------------------
function offer(state, P) {
  const h = state.haggle;
  if (!h || h.status !== "active") return state;
  const rng = makeRng(state.rngState);
  let next = { ...state, rngState: rng.state, haggle: { ...h, lastOffer: P } };
  const hh = next.haggle;
  const concession = clamp(0.55 + state.rapport * 0.003, 0.55, 0.85);
  const conv = Math.max(1, h.value * 0.02);

  if (h.side === "buy") {
    const { floor, ask } = h;
    if (P >= ask) return completeBuy(next, ask, rng);
    if (P >= floor) {
      const newAsk = Math.max(floor, round(ask - (ask - P) * concession));
      if (newAsk - P <= conv) return completeBuy(next, P, rng);
      hh.ask = newAsk;
      hh.price = newAsk;
      hh.patience -= 1;
      const nearFloor = (newAsk - floor) / Math.max(1, ask - floor) < 0.25;
      setFace(next, rng, nearFloor ? "annoyed" : "think", nearFloor ? "annoyed" : "think");
    } else {
      // insulting lowball
      hh.ask = Math.max(floor, round(ask - (ask - floor) * 0.1));
      hh.price = hh.ask;
      hh.patience -= 2;
      next.rapport = Math.max(0, next.rapport - 3);
      setFace(next, rng, "insult", "insult");
      sfx(next, "BackClick");
    }
  } else {
    const { offer: O, ceil } = h;
    if (P <= O) return completeSell(next, O, rng);
    if (P <= ceil) {
      const newO = Math.min(ceil, round(O + (P - O) * concession));
      if (P - newO <= conv) return completeSell(next, P, rng);
      hh.offer = newO;
      hh.price = newO;
      hh.patience -= 1;
      const nearCeil = (ceil - newO) / Math.max(1, ceil - O) < 0.25;
      setFace(next, rng, nearCeil ? "annoyed" : "think", nearCeil ? "annoyed" : "think");
    } else {
      hh.offer = Math.min(ceil, round(O + (ceil - O) * 0.1));
      hh.price = hh.offer;
      hh.patience -= 2;
      next.rapport = Math.max(0, next.rapport - 3);
      setFace(next, rng, "insult", "insult");
      sfx(next, "BackClick");
    }
  }

  if (next.haggle.patience <= 0) {
    next.haggle.patience = 0;
    next.haggle.final = true;
  }
  next.rngState = rng.state;
  return next;
}

function quickDeal(state) {
  const h = state.haggle;
  if (!h || h.status !== "active") return state;
  const rng = makeRng(state.rngState);
  const next = { ...state, rngState: rng.state };
  return h.side === "buy" ? completeBuy(next, h.ask, rng) : completeSell(next, h.offer, rng);
}

function completeBuy(state, price, rng) {
  const h = state.haggle;
  if (price > state.gold) {
    // can't pay — leave the haggle open so the player can offer lower
    const next = { ...state, rngState: rng.state };
    toast(next, "You don't have the coin for that!");
    sfx(next, "BackClick");
    return next;
  }
  const next = { ...state };
  next.gold = state.gold - price;
  next.bag = [...state.bag, { ...h.inst }];
  next.shelf = state.shelf.filter((s) => s.uid !== h.inst.uid);
  next.stats = { ...state.stats, spent: state.stats.spent + price, deals: state.stats.deals + 1 };
  // fair buyers (who pay Kaito a healthy margin) earn more goodwill
  const overValue = price / h.value;
  const gain = overValue >= 1.2 ? 3 : overValue >= 1.1 ? 2 : 1;
  next.haggle = { ...h, status: "deal", price, rapportGain: gain };
  next.rapport = Math.min(140, next.rapport + gain);
  next.stats.bestRapport = Math.max(next.stats.bestRapport, next.rapport);
  setFace(next, rng, overValue >= 1.25 ? "pleased" : "deal", overValue >= 1.25 ? "overpay" : "deal");
  sfx(next, "SelectConfirm");
  next.rngState = rng.state;
  return next;
}

function completeSell(state, price, rng) {
  const h = state.haggle;
  const next = { ...state };
  next.gold = state.gold + price;
  next.bag = state.bag.filter((b) => b.uid !== h.inst.uid);
  next.stats = { ...state.stats, earned: state.stats.earned + price, deals: state.stats.deals + 1 };
  next.dayTakings = (state.dayTakings || 0) + price;
  // selling fairly into what Kaito wants builds rapport; gouging to the ceiling doesn't
  let gain = 1;
  if (h.wanted) gain = price <= h.ceil * 0.96 ? 3 : 1;
  next.haggle = { ...h, status: "deal", price, rapportGain: gain };
  next.rapport = Math.min(140, next.rapport + gain);
  next.stats.bestRapport = Math.max(next.stats.bestRapport, next.rapport);
  setFace(next, rng, "deal", "deal");
  sfx(next, "SelectConfirm");
  next.rngState = rng.state;
  return next;
}

function walk(state) {
  const rng = makeRng(state.rngState);
  const next = { ...state, rngState: rng.state };
  setFace(next, rng, "walk", "walk");
  next.haggle = null;
  next.phase = "shop";
  sfx(next, "BackClick");
  next.rngState = rng.state;
  return next;
}

function closeHaggle(state) {
  // dismiss a concluded (deal) haggle back to the shop
  return { ...state, haggle: null, phase: "shop" };
}

// --- day cycle ----------------------------------------------------------------
function endDay(state) {
  return { ...state, phase: "dayEnd" };
}

function sleep(state) {
  const rng = makeRng(state.rngState);
  let next = { ...state, rngState: rng.state };
  if (state.gold < state.rent) {
    next.phase = "over";
    next.stats = {
      ...state.stats,
      daysSurvived: Math.max(0, state.day - 1), // last fully rent-paid day
      finalGold: state.gold,
    };
    sfx(next, "WarningInit");
    return next;
  }
  next.gold = state.gold - state.rent;
  const newDay = state.day + 1;
  next.day = newDay;
  sfx(next, "BarFill");

  if (newDay >= CONFIG.victoryDay) {
    next.phase = "win";
    next.stats = { ...state.stats, daysSurvived: state.day, finalGold: next.gold };
    setFace(next, rng, "pleased", null);
    sfx(next, "Authenticated");
    return next;
  }

  // rapport tier crossed? reveal the next backstory card at day-break.
  const tierDef = RAPPORT_TIERS[state.tier];
  if (tierDef && next.rapport >= tierDef.at) {
    next.tier = state.tier + 1;
    next.perks = applyPerk(state.perks, tierDef.perk);
    next.pendingTier = tierDef;
    next.portrait = tierDef.portrait;
    next.mood = "pleased";
    next.quip = tierDef.text;
    next.phase = "backstory";
    sfx(next, "Welcome");
    return next;
  }

  next = generateDay(next);
  next.phase = "shop";
  setFace(next, rng, "greet", null);
  if (next.event) toast(next, `${next.event.title}: ${next.event.text}`);
  return next;
}

function applyPerk(perks, perk) {
  const p = { ...perks };
  if (perk === "appraise") p.appraise = true;
  else if (perk === "patience") p.patience = (p.patience || 0) + 1;
  else if (perk === "slot") p.slots = (p.slots || 0) + 2;
  else if (perk === "discount") p.discount = true;
  return p;
}

function ackBackstory(state) {
  const rng = makeRng(state.rngState);
  let next = { ...state, rngState: rng.state, pendingTier: null };
  next = generateDay(next);
  next.phase = "shop";
  setFace(next, rng, "greet", null);
  if (next.event) toast(next, `${next.event.title}: ${next.event.text}`);
  return next;
}

// --- public reducer -----------------------------------------------------------
export function reduce(state, action) {
  switch (action.type) {
    case "START_HAGGLE":
      return startHaggle(state, action.side, action.uid);
    case "OFFER":
      return offer(state, action.price);
    case "QUICK_DEAL":
      return quickDeal(state);
    case "CLOSE_HAGGLE":
      return closeHaggle(state);
    case "WALK":
      return walk(state);
    case "END_DAY":
      return endDay(state);
    case "SLEEP":
      return sleep(state);
    case "ACK_BACKSTORY":
      return ackBackstory(state);
    case "RESTART":
      return createRun(action.seed >>> 0);
    default:
      return state;
  }
}

export { bagSlots };
