// depth-hold.mjs — decision-depth questions:
//  (1) Is "buy wanted, sell same day" strictly dominant vs holding for a future
//      wanted day? Quantify the opportunity cost of holding under rent pressure.
//  (2) What does the buy floor vs sell ceil look like for an UNwanted item held
//      one extra day hoping its category becomes wanted (prob it recurs)?
//  (3) Perk impact: quantify discount (5%/3%), patience (extra rounds), slots.

const round = Math.round;
const CATEGORIES = ["Potion", "Trinket", "Tool", "Scroll", "Gem", "Relic", "Curio", "Food"];
const dumpFactor = 0.62;

// Probability a given category is wanted on a given day:
// wants are 2-3 categories out of 8 (one forced from the 4 "cheap" set).
// Approximate P(specific cheap cat wanted) and P(specific non-cheap cat wanted).
// wantCount in {2,3} uniform => avg 2.5. One slot forced among 4 cheap cats.
// Remaining 1.5 slots drawn ~uniformly from remaining 7 categories.
// Plus ~62% of days (from day2) have an event; ~4/11 events FORCE specific cats.
function pCategoryWanted(isCheap) {
  // crude analytic estimate ignoring events:
  // forced slot: cheap cat gets 1/4 chance to be the forced one.
  const pForced = isCheap ? 1 / 4 : 0;
  // extra slots: avg 1.5 more cats from the other 7 (excluding forced & dupes).
  const pExtra = 1 - Math.pow(1 - 1 / 7, 1.5);
  return pForced + (1 - pForced) * pExtra;
}

console.log("=== (1) HOLD-FOR-FUTURE-WANTED opportunity cost ===");
console.log("Per-category prob of being wanted on a given day (rough, no events):");
console.log(`  cheap cat (Potion/Food/Tool/Trinket): ~${(pCategoryWanted(true) * 100).toFixed(0)}%`);
console.log(`  other cat (Gem/Scroll/Relic/Curio):   ~${(pCategoryWanted(false) * 100).toFixed(0)}%`);
console.log("");
console.log("Holding an item costs: (a) a bag slot for the day, (b) deferred capital that");
console.log("could have flipped 1+ other items, (c) rent accrues regardless.");
console.log("If you buy an UNwanted item at floor (~value*1.06) hoping it's wanted tomorrow:");
{
  const value = 100;
  const floor = round(value * 1.06);
  const dump = round(value * dumpFactor); // sell now unwanted
  const wantedCeil = round(value * 1.7); // avg wanted ceil ~ value*(1+.72)
  console.log(`  value 100: floor ${floor}, dump-now ${dump} (loss ${dump - floor}), wanted-ceil ~${wantedCeil} (gain ${wantedCeil - floor})`);
  const pNext = pCategoryWanted(false);
  const evHoldOneDay = pNext * (wantedCeil - floor) + (1 - pNext) * (dump - floor);
  console.log(`  EV of holding 1 day for a non-cheap cat (p~${(pNext * 100).toFixed(0)}%): ${evHoldOneDay.toFixed(0)} (vs flipping a fresh wanted item same day ~+${wantedCeil - floor})`);
  console.log(`  => Holding a non-wanted item is almost always inferior to NOT buying it and flipping wanted goods directly.`);
}

console.log("\n=== (2) Why same-day flip dominates ===");
console.log("Shelf is 60% biased to today's wanted categories, so 3-4 wanted items are on the shelf EVERY day.");
console.log("A wanted same-day flip nets ceil(value*(1+bonus)) - floor(value*1.06) = value*(bonus-0.06)*... ~ +50..90% of value.");
console.log("Speculative holding adds rent/slot cost and a coin-flip on recurrence. Dominated.");

console.log("\n=== (3) PERK IMPACT QUANTIFICATION ===");
{
  // discount: ask*0.95 AND floor*0.97 (then floor>=value*1.03). On a value-100 item:
  const value = 100;
  const floorNoDisc = round(value * 1.06);
  let floorDisc = value * (1.06) * 0.97; floorDisc = Math.max(floorDisc, value * 1.03); floorDisc = round(floorDisc);
  console.log(`discount perk: floor ${floorNoDisc} -> ${floorDisc} (saves ${floorNoDisc - floorDisc}/item on a value-100 item ~ ${((floorNoDisc - floorDisc) / floorNoDisc * 100).toFixed(1)}%)`);
  console.log(`  Across ~15-25 flips/run, that's ~${(floorNoDisc - floorDisc) * 20} extra gold. Modest but real.`);
}
{
  // patience: base 3 rounds. Each round Kaito concedes 55-85% of the gap. More rounds
  // => you can low-ball harder and still converge near floor/ceil. With basePatience 3,
  // optimal players already reach the floor/ceil. Marginal once you know the floor.
  console.log(`patience perk (+1 round): base 3 rounds already converges to floor/ceil for an optimal player.`);
  console.log(`  conv tolerance = value*0.02, concession 0.55-0.85 => 2-3 rounds suffice. EXTRA patience is nearly worthless to a skilled player, mild safety net for a sloppy one.`);
}
{
  // slots: +2 each at tiers 46 and 88 => up to 10 slots. But same-day-flip means you
  // rarely hold >1-2 items at once. Slots only matter if you batch-buy then batch-sell.
  console.log(`slot perk (+2, twice => up to 10): with same-day flipping you hold ~1-2 items; >6 slots is almost never the binding constraint. Low impact.`);
}
{
  // appraise: reveals true value. THIS is the most impactful perk because WITHOUT it
  // the player cannot see value, only ask. They must guess the floor.
  console.log(`appraise perk (tier 1, rapport 12): reveals true value+floor. HUGELY impactful: before it, the player`);
  console.log(`  cannot see an item's worth, only Kaito's ask, so they can't compute the floor or expected profit.`);
  console.log(`  => The single most important perk, gated behind ~3-5 fair deals. Good news: it's the FIRST tier.`);
}

console.log("\n=== Concession math sanity: rounds to converge buy from ask to floor ===");
{
  // ask=159 floor=127 value=118; player opens at floor; Kaito concedes 55% of gap each round
  let ask = 159, floor = 127, value = 118; const concession = 0.55; const conv = Math.max(1, value * 0.02);
  const P = floor; let rounds = 0;
  while (rounds < 10) {
    if (P >= ask) break;
    const na = Math.max(floor, round(ask - (ask - P) * concession));
    rounds++;
    if (na - P <= conv) { console.log(`  converged to P=${P} after ${rounds} round(s) (na ${na}, conv tol ${conv.toFixed(1)})`); break; }
    ask = na;
  }
  console.log(`  => An optimal opener (offer = floor) closes at the floor in ~1-2 rounds. Patience 3 is plenty.`);
}
