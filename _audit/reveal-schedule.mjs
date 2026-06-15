// reveal-schedule.mjs — model EXACTLY how many backstory tiers get REVEALED to
// the player (not just rapport reached), accounting for:
//   - one reveal per night
//   - the win-night (day8->9) returning before the tier check
// Uses the rapport-max policy and tracks reveals per night.

const CONFIG = { startGold: 140, startSlots: 6, baseRent: 45, rentGrowth: 1.18, shelfMin: 5, shelfMax: 7, wantsMin: 2, wantsMax: 3, victoryDay: 9, basePatience: 3, dumpFactor: 0.62 };
const RARITY = { common: { greed: 0, jit: 0.1 }, uncommon: { greed: 0.05, jit: 0.14 }, rare: { greed: 0.1, jit: 0.18 }, legendary: { greed: 0.16, jit: 0.22 } };
const ITEMS = [
  { id: "health-potion", category: "Potion", base: 28, rarity: "common" }, { id: "mana-elixir", category: "Potion", base: 44, rarity: "common" },
  { id: "luck-tonic", category: "Potion", base: 95, rarity: "rare" }, { id: "silver-ring", category: "Trinket", base: 60, rarity: "common" },
  { id: "jade-pendant", category: "Trinket", base: 115, rarity: "uncommon" }, { id: "pocket-watch", category: "Trinket", base: 150, rarity: "uncommon" },
  { id: "sapphire-amulet", category: "Trinket", base: 205, rarity: "rare" }, { id: "iron-dagger", category: "Tool", base: 48, rarity: "common" },
  { id: "hand-axe", category: "Tool", base: 54, rarity: "common" }, { id: "brass-compass", category: "Tool", base: 120, rarity: "uncommon" },
  { id: "spell-scroll", category: "Scroll", base: 85, rarity: "uncommon" }, { id: "old-tome", category: "Scroll", base: 135, rarity: "uncommon" },
  { id: "treasure-map", category: "Scroll", base: 165, rarity: "rare" }, { id: "ruby", category: "Gem", base: 230, rarity: "rare" },
  { id: "sapphire", category: "Gem", base: 215, rarity: "rare" }, { id: "ancient-coin", category: "Relic", base: 90, rarity: "uncommon" },
  { id: "crystal-skull", category: "Curio", base: 320, rarity: "legendary" }, { id: "music-box", category: "Curio", base: 175, rarity: "rare" },
  { id: "honey-jar", category: "Food", base: 24, rarity: "common" }, { id: "cheese-wheel", category: "Food", base: 30, rarity: "common" },
  { id: "gold-bangle", category: "Trinket", base: 130, rarity: "uncommon" }, { id: "carved-mask", category: "Curio", base: 150, rarity: "rare" },
  { id: "fire-opal", category: "Gem", base: 250, rarity: "legendary" },
];
const CATEGORIES = [...new Set(ITEMS.map((i) => i.category))];
const EVENTS = [
  { id: "festival", effect: { wantBonus: 0.3 } }, { id: "caravan", effect: { shelfDiscount: 0.15 } },
  { id: "gemRush", effect: { categoryWant: ["Gem", "Trinket"], wantBonus: 0.25 } }, { id: "goodMood", effect: { patience: 2 } },
  { id: "taxman", effect: { rentMult: 1.4 } }, { id: "slow", effect: { fewerWants: 1, patience: 1 } },
  { id: "collector", effect: { categoryWant: ["Curio", "Relic"], wantBonus: 0.35 } }, { id: "harvest", effect: { categoryWant: ["Food", "Potion"], wantBonus: 0.28 } },
  { id: "adventurers", effect: { categoryWant: ["Tool", "Scroll"], wantBonus: 0.26 } }, { id: "boom", effect: { wantBonus: 0.18, patience: 1 } },
  { id: "landlordAway", effect: { rentMult: 0.7 } },
];
const RAPPORT_TIERS = [{ at: 12, perk: "appraise" }, { at: 28, perk: "patience" }, { at: 46, perk: "slot" }, { at: 66, perk: "discount" }, { at: 88, perk: "slot" }, { at: 110, perk: "patience" }];
const round = Math.round, clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function makeRng(seed) { let a = seed >>> 0; const next = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; return { next, int: (n) => Math.floor(next() * n), range: (lo, hi) => lo + next() * (hi - lo), pick: (arr) => arr[Math.floor(next() * arr.length)], get state() { return a >>> 0; } }; }
function shuffled(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rng.int(i + 1);[a[i], a[j]] = [a[j], a[i]]; } return a; }
function bagSlots(s) { return CONFIG.startSlots + (s.perks.slots || 0); }
function makeInstance(s, item, rng) { const r = RARITY[item.rarity]; const value = round(item.base * (1 + rng.range(-r.jit, r.jit))); return { uid: s.uidSeq++, id: item.id, category: item.category, rarity: item.rarity, value }; }
function priceShelfItem(inst, s, event) { const r = RARITY[inst.rarity]; const askRelief = Math.min(0.16, s.rapport * 0.0015); let ask = inst.value * (1.3 + r.greed - askRelief); if (event && event.effect.shelfDiscount) ask *= 1 - event.effect.shelfDiscount; if (s.perks.discount) ask *= 0.95; let floor = inst.value * (1.06 + r.greed * 0.3 - s.rapport * 0.0006); if (s.perks.discount) floor *= 0.97; floor = Math.max(floor, inst.value * 1.03); ask = Math.max(ask, floor + Math.max(2, inst.value * 0.06)); return { ...inst, ask: round(ask), floor: round(floor) }; }
function generateDay(s) {
  const rng = makeRng(s.rngState); const day = s.day; let event = null;
  if (day >= 2 && rng.next() < 0.62) { const pool = EVENTS.filter((e) => e.id !== s.lastEventId); event = rng.pick(pool); }
  let wantCount = clamp(CONFIG.wantsMin + rng.int(CONFIG.wantsMax - CONFIG.wantsMin + 1), CONFIG.wantsMin, CONFIG.wantsMax);
  if (event && event.effect.fewerWants) wantCount = Math.max(1, wantCount - event.effect.fewerWants);
  const wantBonus = (event && event.effect.wantBonus) || 0; let wantCats;
  if (event && event.effect.categoryWant) wantCats = event.effect.categoryWant.slice(0, wantCount);
  else { const cheap = ["Potion", "Food", "Tool", "Trinket"].filter((c) => CATEGORIES.includes(c)); wantCats = [rng.pick(cheap)]; for (const c of shuffled(CATEGORIES, rng)) { if (wantCats.length >= wantCount) break; if (!wantCats.includes(c)) wantCats.push(c); } }
  const wants = wantCats.map((category) => ({ category, bonus: round((rng.range(0.55, 0.9) + wantBonus) * 100) / 100 }));
  const shelfCount = clamp(CONFIG.shelfMin + rng.int(CONFIG.shelfMax - CONFIG.shelfMin + 1), CONFIG.shelfMin, CONFIG.shelfMax);
  const wantedPool = ITEMS.filter((i) => wantCats.includes(i.category)); const otherPool = ITEMS.filter((i) => !wantCats.includes(i.category));
  const nWanted = Math.min(wantedPool.length, Math.max(2, Math.round(shelfCount * 0.6)));
  const chosen = [...shuffled(wantedPool, rng).slice(0, nWanted), ...shuffled(otherPool, rng).slice(0, shelfCount - nWanted)];
  const shelf = shuffled(chosen, rng).map((it) => priceShelfItem(makeInstance(s, it, rng), s, event));
  let rent = CONFIG.baseRent * Math.pow(CONFIG.rentGrowth, day - 1); if (event && event.effect.rentMult) rent *= event.effect.rentMult; rent = round(rent);
  const dayPatienceBonus = (event && event.effect.patience) || 0;
  return { ...s, rngState: rng.state, shelf, wants, rent, event, lastEventId: event ? event.id : s.lastEventId, dayPatienceBonus };
}
function createRun(seed) { let s = { seed: seed >>> 0, rngState: (seed >>> 0) || 1, uidSeq: 1, day: 1, gold: 140, bag: [], rapport: 0, tier: 0, streak: 0, perks: { appraise: false, patience: 0, slots: 0, discount: false }, lastEventId: null, dayPatienceBonus: 0, won: false, lost: false, revealed: 0 }; return generateDay(s); }
function maxPatience(s) { return CONFIG.basePatience + (s.perks.patience || 0) + (s.dayPatienceBonus || 0); }
function wantBonusFor(s, c) { const w = s.wants.find((x) => x.category === c); return w ? w.bonus : null; }
function simSell(s, inst, frac) {
  const wb = wantBonusFor(s, inst.category), wanted = wb != null;
  const ceil = round(inst.value * (wanted ? 1 + wb : CONFIG.dumpFactor));
  let offerP = round(inst.value * (wanted ? 0.85 : 0.38)), value = inst.value, patience = maxPatience(s);
  const concession = clamp(0.55 + s.rapport * 0.003, 0.55, 0.85), conv = Math.max(1, value * 0.02); let rd = 0;
  while (true) {
    const P = Math.min(ceil, round(ceil - (ceil - offerP) * frac));
    if (P <= offerP) return { dealt: true, price: offerP, wanted, ceil, rd };
    if (P <= ceil) { const no = Math.min(ceil, round(offerP + (P - offerP) * concession)); if (P - no <= conv) return { dealt: true, price: P, wanted, ceil, rd }; offerP = no; patience -= 1; }
    else { offerP = Math.min(ceil, round(offerP + (ceil - offerP) * 0.1)); patience -= 2; rd -= 3; }
    if (patience <= 0) return { dealt: true, price: offerP, wanted, ceil, rd };
  }
}
function applySell(s, inst, price, wanted, ceil, rd) { const basis = inst.paid != null ? inst.paid : inst.value; const profit = price - basis; const streak = profit > 0 ? s.streak + 1 : 0; const tipUnit = Math.max(2, round(inst.value * 0.025)); const tip = streak >= 2 ? Math.min(streak - 1, 5) * tipUnit : 0; s.gold += price + tip; s.bag = s.bag.filter((b) => b.uid !== inst.uid); s.streak = streak; let gain = 1; if (wanted) gain = price <= ceil * 0.96 ? 3 : 1; if (streak >= 3) gain += 1; s.rapport = Math.min(140, Math.max(0, s.rapport + rd) + gain); }
// EXACT engine sleep(): win returns before tier check; one reveal per night.
function night(s) {
  if (s.gold < s.rent) { s.lost = true; return; }
  s.gold -= s.rent; s.day += 1;
  if (s.day >= CONFIG.victoryDay) { s.won = true; return; } // <-- returns BEFORE tier check
  const td = RAPPORT_TIERS[s.tier];
  if (td && s.rapport >= td.at) {
    s.tier += 1; s.revealed += 1; // a backstory card is shown this night
    const p = td.perk; if (p === "appraise") s.perks.appraise = true; else if (p === "patience") s.perks.patience = (s.perks.patience || 0) + 1; else if (p === "slot") s.perks.slots = (s.perks.slots || 0) + 2; else if (p === "discount") s.perks.discount = true;
    // NOTE: only ONE tier per night, then generateDay anyway (ackBackstory path)
    Object.assign(s, generateDay(s)); return;
  }
  Object.assign(s, generateDay(s));
}
function runRapportMax(seed) {
  let s = createRun(seed); let safety = 0;
  while (!s.won && !s.lost && safety++ < 1000) {
    let acted = true;
    while (acted) {
      acted = false;
      for (const inst of [...s.bag]) {
        const wb = wantBonusFor(s, inst.category); const wanted = wb != null;
        const ceil = round(inst.value * (wanted ? 1 + wb : CONFIG.dumpFactor));
        const basis = inst.paid != null ? inst.paid : inst.value;
        if (ceil - basis > 0 || s.day === CONFIG.victoryDay - 1) { const r = simSell(s, inst, 0.12); if (r.dealt) { applySell(s, inst, r.price, r.wanted, r.ceil, r.rd); acted = true; } }
      }
      let best = null, bs = -Infinity;
      for (const it of s.shelf) { const wb = wantBonusFor(s, it.category); const wanted = wb != null; if (!wanted) continue; const ceil = round(it.value * (1 + wb)); const expBuy = round(it.value * 1.12); if (expBuy > s.gold) continue; if (ceil * 0.9 - expBuy < 4) continue; if (s.bag.length >= bagSlots(s)) continue; const sc = ceil - expBuy; if (sc > bs) { bs = sc; best = { it, expBuy }; } }
      if (best) { const it = best.it; let price = Math.min(best.expBuy, it.ask); price = Math.max(price, it.floor); if (price <= s.gold) { const ov = price / it.value; const gain = ov >= 1.2 ? 3 : ov >= 1.1 ? 2 : 1; s.gold -= price; s.bag.push({ ...it, paid: price }); s.shelf = s.shelf.filter((x) => x.uid !== it.uid); s.rapport = Math.min(140, s.rapport + gain); acted = true; } }
    }
    night(s);
  }
  return { won: s.won, revealed: s.revealed, tier: s.tier, rapport: s.rapport };
}

console.log("=== ACTUAL BACKSTORY CARDS REVEALED to the player (rapport-max policy, 3000 winning-favored seeds) ===");
let revealed = [], wins = 0;
for (let i = 0; i < 3000; i++) { const r = runRapportMax(i + 1); if (r.won) { wins++; revealed.push(r.revealed); } }
const dist = [0, 1, 2, 3, 4, 5, 6].map((n) => revealed.filter((x) => x === n).length);
console.log(`winning runs: ${wins}/3000`);
console.log(`backstory cards SEEN per WINNING run [0..6 cards]: ${dist.join(", ")}`);
console.log(`mean cards seen in a win: ${(revealed.reduce((a, b) => a + b, 0) / revealed.length).toFixed(2)} of 6`);
console.log(`% of winning runs that see ALL 6 backstory cards: ${(dist[6] / wins * 100).toFixed(2)}%`);
console.log(`% of winning runs that see the FINAL (tier 6 / Finofo) card: ${(dist[6] / wins * 100).toFixed(2)}%`);
console.log("\nNOTE: because the win-night returns before the tier check, the 6th card (rapport 110) can only");
console.log("be revealed on the night ending day 7 (day7->8). It requires rapport>=110 by end of day 7 AND");
console.log("every earlier tier already revealed on the preceding nights (one per night).");
