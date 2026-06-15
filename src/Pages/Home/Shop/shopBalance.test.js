import { describe, it, expect } from "vitest";
import { reduce, createRun, bagSlots, buyPrice, sellPrice } from "./shopEngine";
import { STORY } from "./shopData";

// ── Monte-Carlo balance harness ───────────────────────────────────────────────
// Drives the REAL reducer (no re-implementation) with scripted auto-players so a
// balance change can be measured, not guessed. Two policies bracket real play:
//   • "optimal" — buys every profitable wanted ware it can afford, banks rent.
//   • "fair"    — same idea but skips thin margins and keeps a fatter rent buffer.
// We assert win-rate BANDS so the economy stays winnable-by-skill but not solved.
// Tune the engine knobs (shopData/shopEngine), never these assertions.

const SEEDS = 1000;
const SAFETY = 400; // global action cap — guards against any infinite loop

// Greedy skill draft: take the highest-priority skill on offer.
const DRAFT_PRIORITY = ["connoisseur", "discount", "bag", "stipend", "appraise", "salvage", "forecast", "luckyFind", "restock"];
function pickDraft(s) {
  for (const id of DRAFT_PRIORITY) {
    if (s.draft.some((d) => d.id === id)) return id;
  }
  return s.draft[0].id;
}

function playDay(s, p) {
  let guard = 0;
  while (s.phase === "shop" && guard++ < 60) {
    const slots = bagSlots(s);

    // 1) sell any bag ware that turns a profit now (best first).
    const sellable = s.bag
      .map((it) => ({ it, sp: sellPrice(s, it) }))
      .filter((x) => x.sp.profit > 0)
      .sort((a, b) => b.sp.profit - a.sp.profit);
    if (sellable.length) {
      s = reduce(s, { type: "SELL", uid: sellable[0].it.uid });
      continue;
    }

    // 2) if the bag is full and nothing's profitable, recoup the best price to
    //    free a slot (a real player never sits on a clogged bag).
    if (s.bag.length >= slots) {
      const best = s.bag.map((it) => ({ it, sp: sellPrice(s, it) })).sort((a, b) => b.sp.price - a.sp.price)[0];
      s = reduce(s, { type: "SELL", uid: best.it.uid });
      continue;
    }

    // 3) buy the fattest-margin wanted ware we can afford while keeping the rent
    //    buffer (never spend into bankruptcy).
    const reserve = Math.round(s.rent * p.reserve);
    const buyable = s.shelf
      .map((it) => {
        const price = buyPrice(s, it);
        const margin = sellPrice(s, { ...it, paid: price }).profit;
        return { it, price, margin };
      })
      .filter((x) => x.price <= s.gold - reserve && x.margin > x.it.value * p.minMargin)
      .sort((a, b) => b.margin - a.margin);
    if (buyable.length) {
      s = reduce(s, { type: "BUY", uid: buyable[0].it.uid });
      continue;
    }
    break;
  }
  return s;
}

function playRun(seed, p) {
  let s = createRun(seed);
  let guard = 0;
  while (s.phase !== "win" && s.phase !== "over" && guard++ < SAFETY) {
    if (s.phase === "shop") {
      s = playDay(s, p);
      s = reduce(s, { type: "END_DAY" });
    } else if (s.phase === "dayEnd") {
      s = reduce(s, { type: "SLEEP" });
    } else if (s.phase === "story") {
      s = reduce(s, { type: "ACK_STORY" });
    } else if (s.phase === "draft") {
      s = reduce(s, { type: "PICK_SKILL", id: pickDraft(s) });
    } else {
      break;
    }
  }
  return {
    won: s.phase === "win",
    bust: s.phase === "over",
    gold: s.stats.finalGold ?? s.gold,
    deals: s.stats.deals,
    days: s.stats.daysSurvived,
    skills: Object.values(s.skills).reduce((a, n) => a + n, 0),
  };
}

function summarize(p) {
  const runs = [];
  for (let i = 0; i < SEEDS; i++) runs.push(playRun(i * 2654435761 + 1, p));
  const n = runs.length;
  const mean = (f) => runs.reduce((a, r) => a + f(r), 0) / n;
  const pct = (f) => (runs.filter(f).length / n) * 100;
  return {
    winPct: pct((r) => r.won),
    bustPct: pct((r) => r.bust),
    meanGold: Math.round(mean((r) => r.gold)),
    meanDeals: +mean((r) => r.deals).toFixed(1),
    meanDays: +mean((r) => r.days).toFixed(1),
    meanSkills: +mean((r) => r.skills).toFixed(1),
  };
}

const POLICIES = {
  // skilled: takes every profitable buy, keeps just the rent in reserve.
  optimal: { name: "optimal", reserve: 1, minMargin: 0 },
  // sensible-but-imperfect: keeps a modest rent buffer and skips only the
  // thinnest margins — a realistic "decent human" proxy, not an optimiser.
  fair: { name: "fair", reserve: 1.15, minMargin: 0.04 },
};

describe("economy balance", () => {
  for (const key of Object.keys(POLICIES)) {
    it(`plays ${SEEDS} seeds — ${key}`, () => {
      const r = summarize(POLICIES[key]);
      console.log(
        `[${key}] win ${r.winPct.toFixed(1)}% · bust ${r.bustPct.toFixed(1)}% · ` +
          `gold ${r.meanGold} · deals ${r.meanDeals} · days ${r.meanDays} · skills ${r.meanSkills}`
      );
      // Win-rate bands: skilled play wins most of the time but not always;
      // sensible play wins a clear majority; neither is a solved ~100% coast.
      // Bands are wide enough to absorb minor content tweaks but tight enough to
      // catch a real regression (a re-solved economy, or an unwinnable one).
      // Re-run the sim and adjust deliberately if you retune the knobs.
      if (key === "optimal") {
        expect(r.winPct).toBeGreaterThan(60);
        expect(r.winPct).toBeLessThan(92);
      } else {
        expect(r.winPct).toBeGreaterThan(48);
        expect(r.winPct).toBeLessThan(82);
      }
    });
  }

  it("a winning run hears every story beat (milestone payoff)", () => {
    // The story is unlocked by surviving days, so any win that reaches the final
    // morning has, by construction, passed every STORY_DAYS threshold.
    expect(STORY.length).toBe(6);
    let sawAll = false;
    for (let seed = 1; seed <= 60 && !sawAll; seed++) {
      const r = playRun(seed, POLICIES.optimal);
      if (r.won) sawAll = r.days >= STORY.length; // survived past the last beat day
    }
    expect(sawAll).toBe(true);
  });
});
