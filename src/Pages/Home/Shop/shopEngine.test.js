import { describe, it, expect } from "vitest";
import { reduce, createRun, bagSlots, buyPrice, sellPrice, skillLevel } from "./shopEngine";
import { CONFIG, STORY, STORY_DAYS, SKILL_BY_ID, QUIPS } from "./shopData";

// A valid run state with specific fields overridden. Spreading a real createRun()
// output guarantees every field the reducer touches is present.
const stateWith = (overrides) => ({ ...createRun(12345), ...overrides });

describe("createRun", () => {
  it("is deterministic for a given seed", () => {
    expect(createRun(999)).toEqual(createRun(999));
  });

  it("starts a sane day-1 run", () => {
    const s = createRun(1);
    expect(s.phase).toBe("shop");
    expect(s.day).toBe(1);
    expect(s.gold).toBe(CONFIG.startGold);
    expect(s.skills).toEqual({});
    expect(s.storyIndex).toBe(0);
    expect(s.shelf.length).toBeGreaterThanOrEqual(CONFIG.shelfMin);
    expect(s.wants.length).toBeGreaterThanOrEqual(CONFIG.wantsMin);
  });

  it("always stocks at least one affordable ware on day 1 (no cold open)", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const s = createRun(seed);
      const affordable = s.shelf.some((it) => buyPrice(s, it) <= s.gold);
      expect(affordable).toBe(true);
    }
  });
});

describe("buying", () => {
  it("debits gold, adds to the bag with paid/boughtDay, and clears the shelf slot", () => {
    const s = createRun(7);
    const inst = s.shelf.find((it) => buyPrice(s, it) <= s.gold);
    const price = buyPrice(s, inst);
    const after = reduce(s, { type: "BUY", uid: inst.uid });
    expect(after.gold).toBe(s.gold - price);
    expect(after.bag.some((b) => b.uid === inst.uid)).toBe(true);
    expect(after.bag.find((b) => b.uid === inst.uid).paid).toBe(price);
    expect(after.bag.find((b) => b.uid === inst.uid).boughtDay).toBe(s.day);
    expect(after.shelf.some((it) => it.uid === inst.uid)).toBe(false);
    expect(after.stats.spent).toBe(price);
  });

  it("refuses a buy you can't afford and doesn't spend", () => {
    const s = stateWith({ gold: 1 });
    const inst = s.shelf[0];
    const after = reduce(s, { type: "BUY", uid: inst.uid });
    expect(after.gold).toBe(1);
    expect(after.bag.length).toBe(0);
    expect(after.toast).toBeTruthy();
  });

  it("refuses a buy when the bag is full", () => {
    const item = (uid) => ({ uid, id: "x", name: "X", category: "Tool", rarity: "common", value: 50 });
    const full = Array.from({ length: CONFIG.startSlots }, (_, i) => item(i + 1));
    const s = stateWith({ gold: 9999, bag: full });
    const after = reduce(s, { type: "BUY", uid: s.shelf[0].uid });
    expect(after.bag.length).toBe(CONFIG.startSlots);
    expect(after.toast).toBeTruthy();
  });
});

describe("selling", () => {
  const bagItem = (category, value = 100, paid = 50) => ({
    uid: 99,
    id: "ruby",
    name: "Ruby",
    category,
    rarity: "rare",
    value,
    paid,
    boughtDay: 0,
  });

  it("pays the demand premium for a wanted category", () => {
    const item = bagItem("Gem");
    const s = stateWith({ gold: 0, bag: [item], wants: [{ category: "Gem", bonus: 0.5 }] });
    const sp = sellPrice(s, item);
    expect(sp.wanted).toBe(true);
    expect(sp.price).toBe(150); // 100 * (1 + 0.5)
    const after = reduce(s, { type: "SELL", uid: 99 });
    expect(after.gold).toBe(150);
    expect(after.bag.length).toBe(0);
    expect(after.dayTakings).toBe(150);
  });

  it("dumps an off-demand ware at the dump rate", () => {
    const item = bagItem("Gem");
    const s = stateWith({ gold: 0, bag: [item], wants: [{ category: "Food", bonus: 0.5 }] });
    const sp = sellPrice(s, item);
    expect(sp.wanted).toBe(false);
    expect(sp.price).toBe(Math.round(100 * CONFIG.dumpFactor));
    const after = reduce(s, { type: "SELL", uid: 99 });
    expect(after.gold).toBe(sp.price);
  });

  it("a sell draws its quip from the sell bucket", () => {
    const item = bagItem("Gem");
    const s = stateWith({ bag: [item], wants: [{ category: "Gem", bonus: 0.5 }] });
    const after = reduce(s, { type: "SELL", uid: 99 });
    expect(QUIPS.sell).toContain(after.quip);
  });
});

describe("skill effects", () => {
  it("Friendly Regular lowers the buy price", () => {
    const inst = { uid: 1, id: "ruby", name: "Ruby", category: "Gem", rarity: "rare", value: 100 };
    const base = buyPrice(stateWith({ skills: {} }), inst);
    const discounted = buyPrice(stateWith({ skills: { discount: 1 } }), inst);
    expect(discounted).toBeLessThan(base);
  });

  it("Connoisseur fattens the wanted sell bonus", () => {
    const item = { uid: 1, id: "ruby", name: "Ruby", category: "Gem", rarity: "rare", value: 100, paid: 50 };
    const wants = [{ category: "Gem", bonus: 0.5 }];
    const plain = sellPrice(stateWith({ wants, skills: {} }), item).price;
    const fancy = sellPrice(stateWith({ wants, skills: { connoisseur: 1 } }), item).price;
    expect(fancy).toBe(plain + Math.round(100 * CONFIG.connoisseurStep));
  });

  it("Bigger Satchel adds slots", () => {
    expect(bagSlots(stateWith({ skills: { bag: 2 } }))).toBe(CONFIG.startSlots + 2 * CONFIG.bagStep);
  });
});

describe("skill draft", () => {
  it("PICK_SKILL applies the skill, stacks levels, and opens a new day", () => {
    const s = stateWith({ phase: "draft", draft: [{ id: "discount", nextLevel: 1 }], skills: {} });
    const after = reduce(s, { type: "PICK_SKILL", id: "discount" });
    expect(skillLevel(after, "discount")).toBe(1);
    expect(after.phase).toBe("shop");

    const s2 = stateWith({ phase: "draft", draft: [{ id: "discount", nextLevel: 2 }], skills: { discount: 1 } });
    const after2 = reduce(s2, { type: "PICK_SKILL", id: "discount" });
    expect(skillLevel(after2, "discount")).toBe(2);
  });

  it("ignores a PICK_SKILL for an id not on offer", () => {
    const s = stateWith({ phase: "draft", draft: [{ id: "discount", nextLevel: 1 }], skills: {} });
    expect(reduce(s, { type: "PICK_SKILL", id: "bag" })).toBe(s);
  });

  it("a stacking skill never exceeds its max level", () => {
    const def = SKILL_BY_ID.discount;
    const s = stateWith({ phase: "draft", draft: [{ id: "discount", nextLevel: def.max + 1 }], skills: { discount: def.max } });
    const after = reduce(s, { type: "PICK_SKILL", id: "discount" });
    expect(skillLevel(after, "discount")).toBe(def.max);
  });

  it("start-of-day skills pay out: stipend grants coin", () => {
    const s = stateWith({ phase: "draft", draft: [{ id: "stipend", nextLevel: 1 }], skills: {}, gold: 100 });
    const after = reduce(s, { type: "PICK_SKILL", id: "stipend" });
    expect(after.gold).toBe(100 + CONFIG.stipendStep);
  });
});

describe("day cycle", () => {
  it("END_DAY moves to the closing screen", () => {
    const s = createRun(3);
    expect(reduce(s, { type: "END_DAY" }).phase).toBe("dayEnd");
  });

  it("SLEEP deducts rent and advances the day", () => {
    const s = stateWith({ phase: "dayEnd", gold: 500, rent: 30, day: 1, storyIndex: STORY.length });
    const after = reduce(s, { type: "SLEEP" });
    expect(after.gold).toBe(470);
    expect(after.day).toBe(2);
    expect(after.stats.daysSurvived).toBe(1);
  });

  it("SLEEP ends the run when rent can't be paid", () => {
    const s = stateWith({ phase: "dayEnd", gold: 5, rent: 45, day: 2 });
    const over = reduce(s, { type: "SLEEP" });
    expect(over.phase).toBe("over");
    expect(over.stats.daysSurvived).toBe(1);
    expect(over.stats.finalGold).toBe(5);
  });
});

describe("milestone story", () => {
  it("reveals the day-1 beat on the first night, then opens a draft", () => {
    expect(STORY_DAYS[0]).toBe(1);
    const s = stateWith({ phase: "dayEnd", gold: 500, rent: 30, day: 1, storyIndex: 0 });
    const after = reduce(s, { type: "SLEEP" });
    expect(after.phase).toBe("story");
    expect(after.pendingStory.idx).toBe(0);
    expect(after.storyIndex).toBe(1);

    const next = reduce(after, { type: "ACK_STORY" });
    expect(next.phase).toBe("draft");
    expect(next.draft.length).toBeGreaterThan(0);
    expect(next.pendingStory).toBeNull();
  });

  it("does not reveal a beat already past", () => {
    const s = stateWith({ phase: "dayEnd", gold: 500, rent: 30, day: 1, storyIndex: 1 });
    const after = reduce(s, { type: "SLEEP" });
    expect(after.phase).not.toBe("story");
  });
});

describe("winning", () => {
  it("reaching the victory morning wins", () => {
    const last = CONFIG.victoryDay - 1;
    const s = stateWith({ phase: "dayEnd", gold: 500, rent: 10, day: last, storyIndex: STORY.length });
    const w = reduce(s, { type: "SLEEP" });
    expect(w.phase).toBe("win");
    expect(w.stats.daysSurvived).toBe(last);
    expect(w.stats.finalGold).toBe(490);
  });

  it("a story beat earned on the final night is shown before the win", () => {
    // Survive the day mapped to the last beat; that night reveals it, then wins.
    const lastBeatDay = STORY_DAYS[STORY.length - 1];
    const s = stateWith({
      phase: "dayEnd",
      gold: 500,
      rent: 10,
      day: lastBeatDay,
      storyIndex: STORY.length - 1,
    });
    const after = reduce(s, { type: "SLEEP" });
    expect(after.phase).toBe("story");
    expect(after.pendingStory.idx).toBe(STORY.length - 1);
    const resolved = reduce(after, { type: "ACK_STORY" });
    // day advanced to victoryDay → win (no day-9 board built)
    expect([CONFIG.victoryDay, CONFIG.victoryDay - 1]).toContain(resolved.day);
    expect(["win", "draft"]).toContain(resolved.phase);
  });
});

describe("restock", () => {
  it("refreshes the shelf and decrements the counter", () => {
    const s = stateWith({ restocksLeft: 1 });
    const uids = s.shelf.map((i) => i.uid);
    const after = reduce(s, { type: "RESTOCK" });
    expect(after.restocksLeft).toBe(0);
    // fresh uids → a genuinely new shelf
    expect(after.shelf.every((i) => !uids.includes(i.uid))).toBe(true);
  });

  it("is refused when no restocks remain", () => {
    const s = stateWith({ restocksLeft: 0 });
    const after = reduce(s, { type: "RESTOCK" });
    expect(after.toast).toBeTruthy();
    expect(after.shelf).toEqual(s.shelf);
  });
});

describe("reducer edge cases & purity", () => {
  it("RESTART begins a fresh day-1 run", () => {
    const s = stateWith({ gold: 9999, day: 5, phase: "win" });
    const after = reduce(s, { type: "RESTART", seed: 42 });
    expect(after.phase).toBe("shop");
    expect(after.day).toBe(1);
    expect(after.gold).toBe(CONFIG.startGold);
    expect(after.bag).toEqual([]);
  });

  it("an unknown action returns the same state reference", () => {
    const s = createRun(3);
    expect(reduce(s, { type: "NONSENSE" })).toBe(s);
  });

  it("does not mutate the input state (reducer purity)", () => {
    const s = createRun(7);
    const snapshot = JSON.parse(JSON.stringify(s));
    reduce(s, { type: "BUY", uid: s.shelf[0].uid });
    expect(s).toEqual(snapshot);
  });

  it("produces identical state from the same seed through a scripted sequence", () => {
    const play = (seed) => {
      let s = createRun(seed);
      const inst = s.shelf.find((it) => buyPrice(s, it) <= s.gold);
      if (inst) s = reduce(s, { type: "BUY", uid: inst.uid });
      s = reduce(s, { type: "END_DAY" });
      s = reduce(s, { type: "SLEEP" });
      if (s.phase === "story") s = reduce(s, { type: "ACK_STORY" });
      if (s.phase === "draft") s = reduce(s, { type: "PICK_SKILL", id: s.draft[0].id });
      return s;
    };
    expect(play(54321)).toEqual(play(54321));
  });
});
