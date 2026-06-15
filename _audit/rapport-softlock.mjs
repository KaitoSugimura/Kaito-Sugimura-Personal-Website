// rapport-softlock.mjs — deeper analysis of:
//  (A) the ONE-TIER-PER-NIGHT bottleneck on backstory reveals
//  (B) soft-lock risk: can a player reach a no-affordable-profitable-action state?
//  (C) first-day affordability with 140 gold
//  (D) max achievable rapport per run with a rapport-maximizing policy

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
function createRun(seed) { let s = { seed: seed >>> 0, rngState: (seed >>> 0) || 1, uidSeq: 1, day: 1, gold: 140, bag: [], rapport: 0, tier: 0, streak: 0, perks: { appraise: false, patience: 0, slots: 0, discount: false }, lastEventId: null, dayPatienceBonus: 0, won: false, lost: false }; return generateDay(s); }
function maxPatience(s) { return CONFIG.basePatience + (s.perks.patience || 0) + (s.dayPatienceBonus || 0); }
function wantBonusFor(s, c) { const w = s.wants.find((x) => x.category === c); return w ? w.bonus : null; }
function simBuy(s, inst, frac) {
  let ask = inst.ask, floor = inst.floor, value = inst.value, patience = maxPatience(s);
  const concession = clamp(0.55 + s.rapport * 0.003, 0.55, 0.85), conv = Math.max(1, value * 0.02); let rd = 0;
  while (true) {
    const P = Math.max(floor, round(floor + (ask - floor) * frac));
    if (P >= ask) return { dealt: true, price: ask, rd };
    if (P >= floor) { const na = Math.max(floor, round(ask - (ask - P) * concession)); if (na - P <= conv) return { dealt: true, price: P, rd }; ask = na; patience -= 1; }
    else { ask = Math.max(floor, round(ask - (ask - floor) * 0.1)); patience -= 2; rd -= 3; }
    if (patience <= 0) return { dealt: true, price: ask, rd }; // take final word
  }
}
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
function applyBuy(s, inst, price, rd) { s.gold -= price; s.bag.push({ ...inst, paid: price }); s.shelf = s.shelf.filter((x) => x.uid !== inst.uid); const ov = price / inst.value; const gain = ov >= 1.2 ? 3 : ov >= 1.1 ? 2 : 1; s.rapport = Math.min(140, Math.max(0, s.rapport + rd) + gain); }
function applySell(s, inst, price, wanted, ceil, rd) { const basis = inst.paid != null ? inst.paid : inst.value; const profit = price - basis; const streak = profit > 0 ? s.streak + 1 : 0; const tipUnit = Math.max(2, round(inst.value * 0.025)); const tip = streak >= 2 ? Math.min(streak - 1, 5) * tipUnit : 0; s.gold += price + tip; s.bag = s.bag.filter((b) => b.uid !== inst.uid); s.streak = streak; let gain = 1; if (wanted) gain = price <= ceil * 0.96 ? 3 : 1; if (streak >= 3) gain += 1; s.rapport = Math.min(140, Math.max(0, s.rapport + rd) + gain); }
function night(s) { if (s.gold < s.rent) { s.lost = true; return; } s.gold -= s.rent; s.day += 1; if (s.day >= CONFIG.victoryDay) { s.won = true; return; } const td = RAPPORT_TIERS[s.tier]; if (td && s.rapport >= td.at) { s.tier += 1; const p = td.perk; if (p === "appraise") s.perks.appraise = true; else if (p === "patience") s.perks.patience = (s.perks.patience || 0) + 1; else if (p === "slot") s.perks.slots = (s.perks.slots || 0) + 2; else if (p === "discount") s.perks.discount = true; } Object.assign(s, generateDay(s)); }

// (D) RAPPORT-MAX policy: buy slightly above value (overpay tier +2/+3), sell FAIR (<=96% ceil for +3),
// keep streaks alive, ALWAYS flip max wanted items. Accept lower profit for rapport.
function runRapportMax(seed) {
  let s = createRun(seed); let safety = 0; let tiersRevealed = 0;
  while (!s.won && !s.lost && safety++ < 1000) {
    let acted = true;
    while (acted) {
      acted = false;
      for (const inst of [...s.bag]) {
        const wb = wantBonusFor(s, inst.category); const wanted = wb != null;
        const ceil = round(inst.value * (wanted ? 1 + wb : CONFIG.dumpFactor));
        const basis = inst.paid != null ? inst.paid : inst.value;
        // sell fair (target ~90% of ceil) to get the +3 wanted rapport, still profit
        if (ceil - basis > 0 || s.day === CONFIG.victoryDay - 1) {
          const r = simSell(s, inst, 0.12); // open ~88% of ceil -> lands <=96% ceil => +3
          if (r.dealt) { applySell(s, inst, r.price, r.wanted, r.ceil, r.rd); acted = true; }
        }
      }
      let best = null, bs = -Infinity;
      for (const it of s.shelf) {
        const wb = wantBonusFor(s, it.category); const wanted = wb != null; if (!wanted) continue;
        const ceil = round(it.value * (1 + wb));
        // buy slightly above value (overpay) for +2/+3 buy rapport, but only if still net profit after fair sell
        const expBuy = round(it.value * 1.12); // overpay -> +2 rapport, must be affordable & < ceil*.9
        if (expBuy > s.gold) continue;
        if (ceil * 0.9 - expBuy < 4) continue; // still profitable
        if (s.bag.length >= bagSlots(s)) continue;
        const score = ceil - expBuy; if (score > bs) { bs = score; best = { it, expBuy }; }
      }
      if (best) {
        // buy by opening at ~value*1.12 (overpay)
        const it = best.it; const target = best.expBuy;
        // craft a custom buy that pays >= value*1.1 for +2 rapport
        const wb = wantBonusFor(s, it.category); const value = it.value;
        // simulate paying `target` if >= ask we just pay ask; else pay target
        let price = Math.min(target, it.ask); price = Math.max(price, it.floor);
        if (price <= s.gold) {
          const ov = price / value; const gain = ov >= 1.2 ? 3 : ov >= 1.1 ? 2 : 1;
          s.gold -= price; s.bag.push({ ...it, paid: price }); s.shelf = s.shelf.filter((x) => x.uid !== it.uid);
          s.rapport = Math.min(140, s.rapport + gain); acted = true;
        }
      }
    }
    night(s);
  }
  return { won: s.won, day: s.day, rapport: s.rapport, tier: s.tier, gold: s.gold };
}

// (B) SOFT-LOCK detector: run sensible policy but instrument states where at the
// START of a trading day the player has: bag full of items that are ALL unwanted
// (would sell at a loss via dumpFactor) AND insufficient gold to buy+flip anything,
// AND can't pay tonight's rent without dumping at a loss that still leaves < rent.
function detectSoftlock(seed) {
  let s = createRun(seed); let safety = 0; let softlocks = 0;
  while (!s.won && !s.lost && safety++ < 1000) {
    // check potential softlock at day start (before acting): is there ANY action
    // that nets positive, given current gold & bag?
    const canBuyFlip = s.shelf.some((it) => {
      const wb = wantBonusFor(s, it.category); const wanted = wb != null;
      const ceil = round(it.value * (wanted ? 1 + wb : CONFIG.dumpFactor));
      return wanted && it.floor <= s.gold && ceil - it.floor > 0;
    });
    const bagSellGain = s.bag.reduce((sum, inst) => {
      const wb = wantBonusFor(s, inst.category); const wanted = wb != null;
      const ceil = round(inst.value * (wanted ? 1 + wb : CONFIG.dumpFactor));
      const offer0 = round(inst.value * (wanted ? 0.85 : 0.38));
      return sum + offer0; // worst-case immediate liquidation value
    }, 0);
    const canPayRent = s.gold + bagSellGain >= s.rent;
    if (!canBuyFlip && !canPayRent) softlocks++;
    // play sensible
    let acted = true;
    while (acted) {
      acted = false;
      for (const inst of [...s.bag]) {
        const wb = wantBonusFor(s, inst.category); const wanted = wb != null;
        const ceil = round(inst.value * (wanted ? 1 + wb : CONFIG.dumpFactor));
        const basis = inst.paid != null ? inst.paid : inst.value;
        if (ceil - basis > 0 || s.day === CONFIG.victoryDay - 1) { const r = simSell(s, inst, 0.05); if (r.dealt) { applySell(s, inst, r.price, r.wanted, r.ceil, r.rd); acted = true; } }
      }
      let best = null, bs = -Infinity;
      for (const it of s.shelf) { const wb = wantBonusFor(s, it.category); const wanted = wb != null; if (!wanted) continue; const ceil = round(it.value * (1 + wb)); const m = ceil - it.floor; if (m < 8) continue; if (it.floor > s.gold) continue; if (s.bag.length >= bagSlots(s)) continue; if (m > bs) { bs = m; best = it; } }
      if (best) { const r = simBuy(s, best, 0.0); if (r.dealt && r.price <= s.gold) { applyBuy(s, best, r.price, r.rd); acted = true; } else { s.shelf = s.shelf.filter((x) => x.uid !== best.uid); } }
    }
    night(s);
  }
  return { softlocks, lost: s.lost, won: s.won };
}

// (C) FIRST-DAY affordability: across seeds, how many wanted, flippable items can
// you afford on day 1 with 140 gold, and what is the best single-flip profit?
function firstDayStats(seed) {
  const s = createRun(seed);
  const flips = [];
  for (const it of s.shelf) {
    const wb = wantBonusFor(s, it.category); const wanted = wb != null; if (!wanted) continue;
    const ceil = round(it.value * (1 + wb));
    if (it.floor <= 140) flips.push({ id: it.id, floor: it.floor, ceil, profit: ceil - it.floor, bonus: wb });
  }
  flips.sort((a, b) => b.profit - a.profit);
  return { rent: s.rent, nAffordableWantedFlips: flips.length, bestProfit: flips[0] ? flips[0].profit : 0, best: flips[0] || null };
}

console.log("=== (D) RAPPORT-MAX policy (3000 seeds): can all 6 tiers be reached? ===");
{
  let tiers = [], rapports = [], wins = 0;
  for (let i = 0; i < 3000; i++) { const r = runRapportMax(i + 1); tiers.push(r.tier); rapports.push(r.rapport); if (r.won) wins++; }
  const dist = [0, 1, 2, 3, 4, 5, 6].map((t) => tiers.filter((x) => x === t).length);
  console.log(`win rate ${(wins / 3000 * 100).toFixed(1)}%`);
  console.log(`final tier distribution [t0..t6]: ${dist.join(", ")}`);
  console.log(`max final tier reached across all seeds: ${Math.max(...tiers)}`);
  console.log(`% runs reaching tier 6 (rapport 110, final backstory): ${(dist[6] / 3000 * 100).toFixed(2)}%`);
  console.log(`max raw rapport reached: ${Math.max(...rapports)}  (note: tiers are revealed 1/night, so even high rapport caps reveals at 8 nights = tier <=6, but day-9 win ends before night 8 reveal)`);
}

console.log("\n=== ONE-TIER-PER-NIGHT bottleneck ===");
console.log("Nights before win: day1->2,...,day8->9 = 8 nights. But the day-8->9 'night' triggers WIN and RETURNS before tier check.");
console.log("So tier reveals happen only on nights day1->2 .. day7->8 = at most 7 reveals. Tier 6 reveal would need rapport>=110 by end of day 7.");

console.log("\n=== (B) SOFT-LOCK scan (3000 seeds, sensible policy) ===");
{
  let totalSoftlock = 0, runsWithSoftlock = 0;
  for (let i = 0; i < 3000; i++) { const r = detectSoftlock(i + 1); if (r.softlocks > 0) { runsWithSoftlock++; totalSoftlock += r.softlocks; } }
  console.log(`runs with >=1 detected no-profitable-action+can't-pay-rent state: ${runsWithSoftlock}/3000 (${(runsWithSoftlock / 3000 * 100).toFixed(2)}%)`);
}

console.log("\n=== (C) FIRST-DAY affordability (3000 seeds) ===");
{
  let nflips = [], best = [], rent0 = null;
  for (let i = 0; i < 3000; i++) { const r = firstDayStats(i + 1); nflips.push(r.nAffordableWantedFlips); best.push(r.bestProfit); rent0 = r.rent; }
  const mean = (a) => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2);
  const min = Math.min(...nflips);
  console.log(`day-1 rent always = ${rent0}`);
  console.log(`affordable wanted flips on day 1: mean ${mean(nflips)}, min ${min}  (% with 0 affordable wanted flips: ${(nflips.filter((x) => x === 0).length / 3000 * 100).toFixed(2)}%)`);
  console.log(`best single-flip projected profit day 1: mean ${mean(best)}, min ${Math.min(...best)}, max ${Math.max(...best)}`);
  console.log(`(starting gold 140; one good day-1 flip ~ covers rent 45 several times over)`);
}
