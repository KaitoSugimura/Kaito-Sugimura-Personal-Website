# KAITO'S CURIOS — Deep Audit & Revamp Plan

_Generated from a 9-lens multi-agent audit (engine, balance, architecture, game design, UX, visual/CSS, accessibility, responsive/integration, content) with adversarial verification of every high-signal finding. 124 standing findings (4 critical, 26 high), 2 refuted. Empirical balance numbers from `_audit/*.mjs` simulations._

Raw artifacts: `_audit/_findings.json` (all findings + verdicts), `_audit/_plan.json`, `_audit/_critique.json`, and the runnable sims `day1-check.mjs`, `depth-hold.mjs`, `rapport-softlock.mjs`, `reveal-schedule.mjs`.

---

## Vision

The Shop becomes the self-aware showpiece of the portfolio: a cozy haggling **trading puzzle** (not a roguelike) whose 8-day arc genuinely escalates, whose haggle mini-game rewards reading the merchant, and — above all — whose core promise lands: **dealing with Kaito reveals who Kaito actually is.** A hiring manager who plays for five minutes should come away thinking: _this person can design a system, balance an economy, ship polished and accessible UX, and tell a story about themselves._

Keep what's genuinely good: the pure seeded engine, the from-scratch SVG art, the conscientious a11y, the cozy art direction. Fix what's broken, deepen what's shallow, and **guarantee the story payoff** — then point the visitor at the rest of the site.

---

## Current-state assessment

**Real strengths (verified — keep wholesale)**
- `shopEngine.js` is a clean, pure, deterministic reducer with a mulberry32 PRNG threaded through `state.rngState`. Re-render-safe and trivially testable. The mid-haggle "can't afford" soft-lock is genuinely unreachable; React StrictMode double-invoke is handled.
- The cozy wood/parchment art direction, the 23-icon from-scratch inline-SVG set, and the rapport/backstory writing are above portfolio average.
- Accessibility is unusually conscientious: real focus trap with restoration, `role="dialog"`/`aria-modal`, `role="progressbar"`, reduced-motion + coarse-pointer coverage, an AA-clearing palette.

**Real weaknesses (verified)**
1. **The story — the entire point — is unreachable for players who play well.** Two engine bugs (win-night returns *before* the tier-reveal block; only one tier reveals per night) plus a rapport design that *rewards anti-profit play* mean profit-optimal winners reach the final tier in ≈0% of runs. Even under a rapport-*maximizing* policy, only **45.9%** of winning runs see the final Finofo card.
2. **The economy is solved.** Buy-near-floor / sell-into-demand yields a fixed ~50–70% margin that compounds while rent grows only 18%/day. Win rate ≈**96.7%**. Difficulty *inverts* (rapport lowers ask/floor and raises Kaito's concession; perks pile up). Holding inventory is strictly dominated yet taught in two copy sites.
3. **The haggle — the core mini-game — is one deterministic concession curve** (`0.55 + rapport*0.003`) with no item/mood/event variance. Rote after ~10 plays.
4. **Production gaps:** no React error boundary anywhere (a Shop render throw white-screens the *entire* portfolio, since all sections mount at load); `loadRecords` is a shallow merge against a hardcoded `.v1` key with no migration; zero tests on a pure engine begging for them; vmin-only sizing renders 4–7px text on small landscape; the haggle is silent to screen readers; zero instrumentation to know whether the recruiter-conversion thesis works.
5. **Content is thin** (23 items; Relic has 1 item, Food 2) and replayability collapses once the story is consumed.

**Key empirical numbers (from the committed sims)**
| Metric | Value | Source |
|---|---|---|
| Win rate (rapport-max policy, 3000 seeds) | **96.7%** | `rapport-softlock.mjs` |
| Winning runs that see ALL 6 backstory cards | **45.9%** | `reveal-schedule.mjs` |
| Winning runs that see the final (Finofo) card | **45.9%** | `reveal-schedule.mjs` |
| Day-1 cold opens with no profitable wanted flip | 2.78% | `day1-check.mjs` |
| Runs hitting a can't-make-rent dead-end (sensible policy) | 3.8% | `rapport-softlock.mjs` |
| EV of holding a non-wanted item one day | **−22** (vs +64 for a fresh same-day flip) | `depth-hold.mjs` |
| Perk impact | appraise = huge; patience/slots ≈ worthless to a skilled player; discount ≈ +60g/run | `depth-hold.mjs` |

---

## Themes

1. **Make the story reachable and the payoff guaranteed.** Everything is downstream of "the player meets the real Kaito."
2. **Don't let the showpiece take down the portfolio, and don't corrupt returning players** (error boundary + records migration).
3. **Put survival genuinely at stake** — winnable but not solved — as *one atomic* economy change.
4. **Skill expression and decision depth** in the haggle and the hold/flip decision.
5. **Communicate state at the moment it happens** (live regions, split feedback channels, inflection-point cues).
6. **Honest framing, a graded close, and a measured conversion** back to the rest of the site.
7. **Legibility and reach across screens — cheaply** (clamp type scale, dimension-aware gate).

---

## Roadmap

### Phase 0 — Critical correctness + production safety (MANDATORY, single coordinated effort)
**Goal:** every player who deals with Kaito reaches the payoff; no earned content/perk is ever silently lost; a Shop crash can never white-screen the portfolio; returning saves can't corrupt; the load-bearing engine path is locked by tests in the same commit.

- **Error boundary** (NEW, verified none exist): wrap each section (at minimum the Shop) in a React error boundary (`getDerivedStateFromError` + `componentDidCatch`) rendering a graceful fallback card instead of a white screen.
- **Story reachability** (`shopEngine.js:442-462`): move the rapport tier-resolution **above** the victory check in `sleep()`, and replace the single `if` with a **while-loop draining all crossed tiers** — apply each perk off `next.perks` (not `state.perks`), push each crossed tier onto a `pendingTiers` array, then run the victory/`generateDay` branch.
- **Win-night routing** (`ackBackstory`): when `pendingTiers` empties **and** `day >= victoryDay`, route to `win`, not `generateDay` (which would wrongly build a day-9 board).
- **Backstory queue UI** (`Shop.jsx`): replace single `pendingTier` with the queue; ACK shifts the head and stays in `backstory` until empty; bank each card into `records.lore` as revealed.
- **Guarantee the payoff on win** (`RunEnd`): add a "Hear the rest" button revealing every still-locked beat in sequence; make the Codex render locked cards readable after any win. The 3.94 GPA + Finofo lines must never be missed.
- **Records migration scaffold** (`Shop.jsx:115-123`): add an explicit `migrate(stored)` step and bump the version *before* any new field shape is written. Hard prerequisite for the Phase-2 `useRecords` extraction and all later records writes.
- **Vitest harness lands with the fix:** in the *same PR*, write the multi-tier-drain test, the win-night-card test, the perks-stack-off-`next.perks` test, and the lore-banking idempotency test.
- **Determinism leaks** (`shopEngine.js:464-488`): extract `enterShopAfterDayGen(next)` that re-seeds rng from the *post-`generateDay`* state and persists it; use in both `sleep()` and `ackBackstory()`.
- **Streak on break-even** (`shopEngine.js:370`): `profit > 0` → `profit >= 0` (matches the tooltip).
- **Touch-scroll bug** (`Home.jsx:109-110`): guard the unconditional `preventDefault()` with `if (!isScrollable.current) return;` so finger-scrolling works inside Codex/Help.

### Phase 1 — Economy & difficulty rebalance (MANDATORY, ONE atomic PR gated on the balance sim)
**Goal:** a skilled player wins ~60–70% and a careless one loses; difficulty rises toward day 8; rapport perks and inventory decisions matter. These levers move the win rate *together* — ship as a single non-divisible merge.

- **Rebuild + commit the balance sim first** (hard prerequisite — the canonical `economy-sim.mjs` never existed): a deterministic N-seed Monte-Carlo harness that imports the **real engine** and runs scripted greedy-fair and profit-optimal policies, asserting win-rate bands. Commit as a vitest balance-regression test.
- **Decouple rapport from anti-profit** (`shopEngine.js:352-357,389-392`): stop rewarding overpaying/underselling. Any non-insulting buy = +2, else +1; any wanted sell = +2, unwanted = +1; +1 if closed on the first offer; keep the −3 insult penalty. Re-tune `RAPPORT_TIERS` thresholds **by simulation** so a clean ~16–20-deal winning run organically reaches tier 6.
- **Kill the instant same-day re-flip + reconciled opening-offer fix** (`shopEngine.js:348,244,247,502` — same code path): tag bought instances with `boughtDay`; suppress the wanted bonus when `boughtDay === state.day` (fall back to `dumpFactor`). Fold the former "0.38 → ~0.50 opening offer" quick win into this change (design the unwanted opening as `dumpFactor*0.8`).
- **Steepen rent + deflate snowball** (`shopData.js:14`, `shopEngine.js:152,374`): `rentGrowth` 1.18 → ~1.26 and/or a flat escalating step; cap streak tip at `min(streak-1,3)`; add a telegraphed day-8 "season-end tax" (~2.5–3× rent) shown from day 1.
- **Demand forecast** (highest-leverage depth fix): generate day N+1's wants during `sleep()` and surface 1–2 on the day-end card. Makes "hold" genuinely +EV — a hard co-dependency of the re-flip kill.
- **Category saturation** (`completeSell`): decay the wanted bonus per same-category sale that day (`effective *= 0.7^salesOfCategoryToday`). Breaks unbounded churn; makes the +slots perk meaningful.
- **Fix both "hold" copy sites** (`Shop.jsx:1033-1035` help + the in-haggle sell note): don't teach a losing line until forecast + saturation make holding +EV.
- **Rebalance / re-theme perks** (`shopData.js:154-159`): shrink `conv` per patience point (or convert patience into a value-peek); buff discount to ~8%/5% and extend to the sell ceiling; keep appraise at tier 1.
- **Add adversity events** (`shopData.js:139-151`): wire new effect keys (`patienceMod`, `wantBonusMod`, `goldTax`) and add adverse events; bias later days toward adversity (currently 9/11 events are pure upside).
- **Re-run the sim and confirm** (~60–70% sensible / ~85% optimal) before merge.

### Phase 2 — Foundations: enable safe, fast feature work (lean — TS migration & events-queue refactor CUT)
**Goal:** lock behavior with tests, centralize tuning, fix the records lifecycle, decompose only the hotspots that unblock Phase 3.

- **Expand vitest coverage:** seeded `createRun` determinism, scripted buy/sell deltas, insult penalties, patience-exhaustion → final, `sleep` gold<rent → over, `victoryDay` → win.
- **Centralize magic numbers** into structured `CONFIG` (`haggle`, `pricing`, `rapport`, `streak`, `events`); derive `RAPPORT_MAX` from `RAPPORT_TIERS.at(-1).at` instead of the magic 140.
- **Extract `useRecords` with migration** (gated on Phase 0 scaffold): a hook returning `[records, mutateRecords]` that computes-next/persists/setState atomically and owns `migrate`.
- **Defer run creation to first focus** (`Shop.jsx:149-152` + `Home.jsx`): keep the reducer idle until `isfocus` first becomes true, then `RESTART` with a fresh seed.
- **Performance budget** for the always-mounted architecture: pause off-screen infinite animations (`content-visibility:auto` / `animation-play-state` keyed off `isfocus`); homepage TTI/Lighthouse must not regress.
- **Decompose only the haggle hotspot** (`Shop.jsx:609-871`): extract `HaggleModal.jsx` + a `useHaggleOffer(h,gold)` hook; optionally a shared `<Modal>` wrapper. Let tests, not a folder structure, be the safety net.
- **Delete dead code:** `.offerValue` (CSS 1000-1006); wire or delete `dayStartGold`; merge `.flipTag`/`.wantedTag`; add `dayDeals:0` to `createRun`; delete the stale `_audit/contrast.json`.
- **CUT:** no TypeScript migration (JSDoc `@typedef` + `checkJs` if anything); no speculative events queue.

### Phase 3 — Haggle depth & skill expression (cherry-pick by impact; **build within the existing 11 portrait assets**)
**Goal:** no two haggles feel the same; reading Kaito and precise offers are rewarded.

- **Portrait-asset constraint:** moods must map to the existing 11 webp expressions — no bespoke "eager/wary/stubborn" art is authorable in scope.
- **Per-item haggle personality** (`shopData.js` + `shopEngine.js:276`): a data-driven `haggle` profile per item/category (sentimental, overstocked, valueNoise). `concession = clamp(base + rapport*slope + item.haggle + mood.delta, 0.40, 0.90)`.
- **Haggle mood:** roll a mood from the threaded rng, show via an existing portrait expression + distinct quip *before* the first offer, apply ±0.15 concession / ±1 patience.
- **Fuzz the threshold tick** (`Shop.jsx:664-675`): replace the hard floor/ceil tick with a fuzzy band whose width shrinks with rapport/appraise; gate exact `worth` behind a deeper perk.
- **Final-offer / precision rewards:** a real "take it or leave it" commit button; a small "sharp eye" tip when the close lands within `conv` of floor/ceil.

### Phase 4 — Feedback, onboarding & UX legibility
**Goal:** state changes are announced when they happen, for sighted *and* screen-reader players; first-timers learn the loop without text walls; the showpiece stays legible across screens.

- **Haggle live region** (a11y critical): a visually-hidden `aria-live` region (assertive for insults) composing "Kaito now asks {N}. Patience {p} of {max}." / insult / final / deal-with-profit-and-rapport. Add the missing `.srOnly` class. Enrich the slider `aria-valuetext` with band context.
- **Relabel Quick deal + warn on lowball** (`Shop.jsx:853-860`): "Take his offer ({N})" for sells; subtext "his opening — ask up to ~{ceil}".
- **Split the toast channel** (`Shop.jsx:1136-1151`): pulse the day-event in the existing `eventChip` (don't route it through the single toast); give actionable errors a dedicated sticky slot; reserve the toast for transient feedback.
- **First-haggle coachmark:** gated on a localStorage flag; anchor an arrow to the slider; pulse the first affordable shelf card. Cheapest variant: auto-open Help once on first run.
- **Surface inflection points:** tier-up imminent (glow within ~3 of next `.at`); FINAL DAY framing; near-bankruptcy helper line.
- **Clamp type scale:** `--fs-*` tokens as `clamp(min,vmin,max)` on `.root` *and* `.overlay`; cap the grid with `minmax(clamp(120px,13vmin,180px),1fr)`; delete the partial media-query patch.
- **Fix the font-weight bug** (`index.html:30` vs CSS): Fraunces loads only 600/700 but display elements request 800 → faux-bold. Change the 800s to 700 (or add 900 to the font request) + `font-synthesis:none`.

### Phase 5 — Polish, honest framing, replay & the measured fourth-wall close (TRIMMED)
**Goal:** AAA feel where it counts (the haggle moment + the close), enough content to survive a second run, proof the conversion thesis works.

- **Honest label** (do first): drop the "roguelike" claim in copy/intro/Help/MEMORY.
- **Graded RANK + fourth-wall close:** end-of-run RANK (Bronze→Master from gold+rapport+days+streak) with a flourish; a win-screen close with a button to the Projects section and a Codex CTA.
- **Conversion instrumentation** (the single most important missing dimension): fire lightweight events — game-started, story-card-seen (esp. "reached the Finofo card"), win-reached, CTA-clicked-through-to-Projects.
- **Deal-struck moment:** heavier haggle frame; animate `.dealBig`, pulse the patience candles, one-shot coin burst near the gold readout; pair portrait swaps with existing outcome QUIPS.
- **Content floor, not content mill:** floor Relic and Food at 3 items each (+ matching SVGs) and stop. Split the deal quip bucket into `dealBuy`/`dealSell` with a no-repeat guard. **Do not** grow to 40 items or add mechanically-distinct special items.
- **Reorder & frame the story** (`shopData.js:164-206`): hook early (game dev, karate), end personal (Finofo "thanks for being a friend"); intro line teasing "the real Kaito."
- **CUT:** no meta-currency / between-run upgrade shop / ascension-endless; no daily/shareable seed; difficulty modes only if free after Phase-1 CONFIG work. Perk drafting (1-of-3) is the only optional roguelite lever worth keeping, and only if the perk catalog grows — stretch, not core.

### Phase 6 — Reach: cheap mobile gate fix only (full portrait layout CUT)
- **Fix the portrait gate** (`Home.jsx:45-58,160`): replace `innerWidth <= innerHeight` with `matchMedia('(orientation:portrait) and (max-width:700px)')` so iPad/tablet portrait and tall desktop windows aren't hard-blocked; rewrite the copy; make the gate image responsive.
- **Small-viewport tweaks:** `@media(max-height:560px)` lowering the `.portraitFrame` floor and `.bagEmpty` min-height; `dvh`→`vh` fallbacks; switch `100vw` roots to `100%`.
- **CUT:** the bespoke portrait Shop layout.

---

## Quick wins (high impact, low effort)
- Streak survives break-even: `profit > 0` → `profit >= 0` (`shopEngine.js:370`).
- Error boundary around the Shop section (prevents a Shop throw white-screening the whole site).
- Touch-scroll fix: guard `Home.jsx:110`'s `preventDefault` with `if (!isScrollable.current) return;`.
- Font-weight fix: the seven Fraunces `font-weight:800` → 700 (or add 900) + `font-synthesis:none`.
- Relabel "Quick deal" → "Take his offer ({N})" with an "ask up to ~{ceil}" subtext _(the numeric 0.38→0.50 change ships inside the Phase-1 atomic PR, not standalone — same code path)._
- Delete dead code: `.offerValue`, the stale `_audit/contrast.json`, merge `.flipTag`/`.wantedTag`.
- Drop the "roguelike" label.
- Add the `.srOnly` class + a single haggle `aria-live` region (turns the core loop from operable-only to actually playable for screen-reader users).

---

## Risks
- **The Phase-1 economy set is a single non-divisible PR**, not a checklist. Killing the re-flip removes the only currently-viable loop, so the forecast + saturation must ship in the same merge or the game can become unwinnable. Re-simulate before merge.
- **The story-reachability fix touches the most load-bearing engine path** — its tests must land in the *same* commit, or a silent regression re-hides the entire reason the game exists.
- **Records has no migration today** — the `migrate()` scaffold is a hard prerequisite before any new field shape is written.
- **Only 11 portrait expressions exist** — Phase-3 mood/personality features must map to them.
- **Scope creep toward "commercial roguelite" is the dominant risk** and is explicitly disowned (meta-currency, between-run shop, ascension, daily seeds, full TS, bespoke portrait layout, 40-item catalog are all CUT).
- **Conversion is unmeasured today** — without the lightweight instrumentation, there's no way to know whether the showpiece works.
