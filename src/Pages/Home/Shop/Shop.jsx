import { useContext, useEffect, useReducer, useRef, useState } from "react";
import styles from "./Shop.module.css";
import { ItemIcon } from "./itemIcons";
import { reduce, createRun, bagSlots, sellProjection, wantFor } from "./shopEngine";
import { RARITY, CONFIG, RAPPORT_TIERS, PERK_LABELS } from "./shopData";
import { scrollContext } from "../scrollContext";
import { SoundContext } from "../../../Context/SoundContext";
import Sections from "../HomeTableOfContents.jsx";

const SECTION_TITLE = "Shop";
const g = (n) => `${Math.round(n)}g`;
const gSigned = (n) => `${n >= 0 ? "+" : "−"}${Math.abs(Math.round(n))}g`;
const LAST_TRADING_DAY = CONFIG.victoryDay - 1; // win = survive to the morning of victoryDay
const portraitSrc = (p) => `/Dialog/Pictures/${p}.webp`;

// ---- persistent records (best run, wins, unlocked story) ---------------------
const RECORDS_KEY = "kaitosCurios.records.v1";
const DEFAULT_RECORDS = {
  bestGold: 0,
  bestRapport: 0,
  bestDay: 0,
  bestStreak: 0,
  wins: 0,
  runs: 0,
  lore: [], // indices of RAPPORT_TIERS the player has ever unlocked
};
function loadRecords() {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (raw) return { ...DEFAULT_RECORDS, ...JSON.parse(raw) };
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

export default function Shop({ isfocus }) {
  isfocus = isfocus === "true";
  const { setScrollable, currentSection, openDialogWithCallback } =
    useContext(scrollContext);
  const { playSFX } = useContext(SoundContext);

  const seedRef = useRef((Date.now() >>> 0) || 1);
  const [state, dispatch] = useReducer(reduce, undefined, () =>
    createRun(seedRef.current)
  );

  // "How to play" panel + "Kaito's story" codex.
  const [showHelp, setShowHelp] = useState(false);
  const [showCodex, setShowCodex] = useState(false);

  // Persistent records (best run, win count, unlocked story) survive across runs
  // and page loads. The engine stays pure; persistence lives here.
  const recordsRef = useRef(null);
  if (recordsRef.current === null) recordsRef.current = loadRecords();
  const [records, setRecords] = useState(recordsRef.current);
  const [newRecords, setNewRecords] = useState(null);

  // Bank a story beat the moment it's revealed, so the codex remembers it.
  useEffect(() => {
    if (!state.pendingTier) return;
    const idx = RAPPORT_TIERS.indexOf(state.pendingTier);
    if (idx < 0 || recordsRef.current.lore.includes(idx)) return;
    const next = { ...recordsRef.current, lore: [...recordsRef.current.lore, idx] };
    recordsRef.current = next;
    setRecords(next);
    saveRecords(next);
  }, [state.pendingTier]);

  // Bank end-of-run stats once per run, flagging anything that beat a best.
  const endRecorded = useRef(false);
  useEffect(() => {
    const terminal = state.phase === "win" || state.phase === "over";
    if (!terminal) {
      endRecorded.current = false; // armed again for the next run
      return;
    }
    if (endRecorded.current) return;
    endRecorded.current = true;
    const prev = recordsRef.current;
    const finalGold = state.stats.finalGold ?? state.gold;
    const flags = {
      gold: finalGold > prev.bestGold,
      rapport: state.stats.bestRapport > prev.bestRapport,
      day: state.stats.daysSurvived > prev.bestDay,
      streak: state.stats.bestStreak > prev.bestStreak,
      firstWin: state.phase === "win" && prev.wins === 0,
    };
    const next = {
      ...prev,
      bestGold: Math.max(prev.bestGold, finalGold),
      bestRapport: Math.max(prev.bestRapport, state.stats.bestRapport),
      bestDay: Math.max(prev.bestDay, state.stats.daysSurvived),
      bestStreak: Math.max(prev.bestStreak, state.stats.bestStreak),
      wins: prev.wins + (state.phase === "win" ? 1 : 0),
      runs: prev.runs + 1,
    };
    recordsRef.current = next;
    setRecords(next);
    setNewRecords(flags);
    saveRecords(next);
  }, [state.phase, state.gold, state.stats]);

  // Intro dialog on first focus (same pattern as the other sections).
  const [dialogState, setDialogState] = useState({ initDialog: true });
  const initDialogOpened = useRef(false);
  useEffect(() => {
    if (
      !initDialogOpened.current &&
      dialogState.initDialog &&
      Sections[currentSection].title === SECTION_TITLE
    ) {
      initDialogOpened.current = true;
      openDialogWithCallback("Shop1", () => setDialogState({ initDialog: false }));
    }
  }, [currentSection, dialogState.initDialog, openDialogWithCallback]);

  // Lock page-snap scrolling while an overlay/modal is up so a stray wheel tick
  // can't yank the player out mid-decision; let them scroll away while browsing.
  useEffect(() => {
    if (!isfocus) {
      setScrollable(true);
      return;
    }
    // Only let page-snap scrolling through when the player is idly browsing the
    // shelf — never while a modal, the help panel, or a story beat is up.
    setScrollable(state.phase === "shop" && !showHelp);
  }, [isfocus, state.phase, showHelp, setScrollable]);

  // Fire the sound cue the engine requested on its last transition.
  const lastSfx = useRef(0);
  useEffect(() => {
    if (state.sfx && state.sfx.n !== lastSfx.current) {
      lastSfx.current = state.sfx.n;
      if (state.sfx.cue) playSFX(state.sfx.cue);
    }
  }, [state.sfx, playSFX]);

  const slots = bagSlots(state);

  return (
    <div className={styles.root} style={{ height: "100dvh" }}>
      <div className={styles.grain} />

      {/* top HUD — kept to the far edges so the site's centered section title shows through */}
      <div className={styles.hud}>
        <div className={styles.hudLeft}>
          <span className={styles.hudDay}>
            DAY {state.day}
            <span className={styles.hudDayGoal}>&nbsp;/ {LAST_TRADING_DAY}</span>
          </span>
          <span className={styles.hudGold} title="Coin on hand">{g(state.gold)}</span>
          {state.streak >= 2 && (
            <span
              className={styles.streakChip}
              title={`Hot streak — ${state.streak} profitable flips in a row. Each one adds a bigger tip; a loss cools it off.`}
            >
              <span className={styles.streakFlame} aria-hidden="true">🔥</span>
              <b>×{state.streak}</b>
            </span>
          )}
        </div>
        <div className={styles.hudRight}>
          <span className={styles.hudRent}>
            RENT&nbsp;<b>{g(state.rent)}</b>
          </span>
          <Rapport state={state} />
          <button
            className={styles.helpBtn}
            onClick={() => {
              playSFX("MenuOpen");
              setShowCodex(true);
            }}
            aria-label="Kaito's story"
            title="Kaito's story"
          >
            📖
          </button>
          <button
            className={styles.helpBtn}
            onClick={() => {
              playSFX("MenuOpen");
              setShowHelp(true);
            }}
            aria-label="How to play"
            title="How to play"
          >
            ?
          </button>
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.leftCol}>
          <KaitoPortrait portrait={state.portrait} quip={state.quip} />
          <WantsBoard wants={state.wants} event={state.event} />
        </div>

        <div className={styles.shelfWrap}>
          <h2 className={styles.shelfTitle}>
            <span>KAITO&rsquo;S WARES</span>
            <span className={styles.shelfHint}>buy low &middot; sell into demand</span>
          </h2>
          <div className={styles.shelf}>
            {state.shelf.map((it) => (
              <ShelfItem
                key={it.uid}
                item={it}
                appraise={state.perks.appraise}
                want={wantFor(state, it.category)}
                affordable={state.gold >= it.floor && state.bag.length < slots}
                onClick={() => {
                  playSFX("MetalClick");
                  dispatch({ type: "START_HAGGLE", side: "buy", uid: it.uid });
                }}
              />
            ))}
            {state.shelf.length === 0 && (
              <p className={styles.soldOut}>Sold out for today — close up shop to end the day.</p>
            )}
          </div>
        </div>
      </div>

      {/* bag + end-of-day */}
      <div className={styles.bagBar}>
        <div className={styles.bagLabel}>
          YOUR BAG <span>{state.bag.length}/{slots}</span>
        </div>
        <div className={styles.bag}>
          {Array.from({ length: slots }).map((_, i) => {
            const it = state.bag[i];
            return it ? (
              <BagItem
                key={it.uid}
                item={it}
                appraise={state.perks.appraise}
                proj={sellProjection(state, it)}
                onClick={() => {
                  playSFX("MetalClick");
                  dispatch({ type: "START_HAGGLE", side: "sell", uid: it.uid });
                }}
              />
            ) : (
              <div key={`empty-${i}`} className={styles.bagEmpty} aria-hidden="true" />
            );
          })}
        </div>
        <button
          className={styles.endDay}
          onClick={() => {
            playSFX("ButtonClick");
            dispatch({ type: "END_DAY" });
          }}
        >
          CLOSE UP SHOP
          <span className={styles.endDaySub}>rent {g(state.rent)} due</span>
        </button>
      </div>

      {state.phase === "haggle" && state.haggle && (
        <HaggleModal state={state} dispatch={dispatch} playSFX={playSFX} />
      )}
      {state.phase === "dayEnd" && <DayEnd state={state} dispatch={dispatch} />}
      {state.phase === "backstory" && state.pendingTier && (
        <Backstory tier={state.pendingTier} dispatch={dispatch} />
      )}
      {(state.phase === "over" || state.phase === "win") && (
        <RunEnd
          state={state}
          dispatch={dispatch}
          records={records}
          newRecords={newRecords}
        />
      )}
      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
      {showCodex && (
        <Codex lore={records.lore} onClose={() => setShowCodex(false)} />
      )}

      <Toast toast={state.toast} />
    </div>
  );
}

// ---- HUD bits ----------------------------------------------------------------
function Rapport({ state }) {
  const next = RAPPORT_TIERS[state.tier];
  const prevAt = state.tier > 0 ? RAPPORT_TIERS[state.tier - 1].at : 0;
  // Fill the bar across the *current* tier's span so progress to the next perk
  // reads at a glance (full + glowing once you've befriended him completely).
  const span = next ? next.at - prevAt : 1;
  const pct = next
    ? Math.max(0, Math.min(100, ((state.rapport - prevAt) / span) * 100))
    : 100;
  const caption = next
    ? `${state.rapport} / ${next.at} → ${PERK_LABELS[next.perk] || "a perk"}`
    : "Trusted friend ♥";
  return (
    <div
      className={styles.rapport}
      title={`Rapport ${state.rapport}. Deal fairly to earn Kaito's trust and unlock perks & his story.`}
    >
      <span className={styles.rapportHeart}>♥</span>
      <span className={styles.rapportCol}>
        <span className={styles.rapportBar}>
          <span
            className={`${styles.rapportFill} ${next ? "" : styles.rapportFull}`}
            style={{ width: `${pct}%` }}
          />
        </span>
        <span className={styles.rapportNext}>{caption}</span>
      </span>
    </div>
  );
}

function KaitoPortrait({ portrait, quip }) {
  return (
    <div className={styles.kaito}>
      <div className={styles.bubble}>{quip}</div>
      <div className={styles.portraitFrame}>
        <img
          className={styles.portrait}
          src={portraitSrc(portrait)}
          alt="Kaito the shopkeeper"
          draggable={false}
        />
      </div>
      <div className={styles.nameplate}>KAITO</div>
    </div>
  );
}

function WantsBoard({ wants, event }) {
  return (
    <div className={styles.wants}>
      <h3 className={styles.wantsTitle}>TODAY&rsquo;S DEMAND</h3>
      <ul className={styles.wantsList}>
        {wants.map((w) => (
          <li key={w.category} className={styles.wantRow}>
            <span className={styles.wantCat}>{w.category}</span>
            <span className={styles.wantBonus}>★ +{Math.round(w.bonus * 100)}%</span>
          </li>
        ))}
      </ul>
      {event && (
        <div className={styles.eventChip}>
          <b>{event.title}</b>
          {event.text}
        </div>
      )}
    </div>
  );
}

function rarityPip(rarity) {
  return RARITY[rarity] ? RARITY[rarity].hue : "#8a7a5c";
}

function ShelfItem({ item, appraise, want, affordable, onClick }) {
  const flipHint = want
    ? ` In demand today — Kaito buys ${item.category} back at +${Math.round(
        want.bonus * 100
      )}%. Buy low, flip it before close.`
    : "";
  return (
    <button
      className={`${styles.card} ${want ? styles.shelfWanted : ""} ${
        affordable ? "" : styles.cardLocked
      }`}
      onClick={onClick}
      disabled={!affordable}
      title={item.flavor + flipHint}
    >
      {want && (
        <span className={styles.flipTag} aria-hidden="true">
          ★ FLIP +{Math.round(want.bonus * 100)}%
        </span>
      )}
      <span
        className={styles.rarityPip}
        style={{ background: rarityPip(item.rarity) }}
        role="img"
        aria-label={`${item.rarity} rarity`}
      />
      <ItemIcon id={item.id} className={styles.icon} />
      <span className={styles.cardName}>{item.name}</span>
      <span className={styles.cardPrice}>{g(item.ask)}</span>
      {appraise && <span className={styles.cardWorth}>worth ~{g(item.value)}</span>}
    </button>
  );
}

function BagItem({ item, appraise, proj, onClick }) {
  const { wanted, ceil, estProfit } = proj;
  const profitClass = estProfit >= 0 ? styles.profitPos : styles.profitNeg;
  const label = wanted
    ? `${item.name} — in demand today. Sells for up to ~${g(ceil)} (${gSigned(
        estProfit
      )} vs the ${g(item.paid)} you paid). Tap to sell.`
    : `${item.name} — not in demand today; selling now nets ${gSigned(
        estProfit
      )}. Hold it for a day Kaito wants ${item.category}. Tap to sell anyway.`;
  return (
    <button
      className={`${styles.card} ${styles.bagCard} ${wanted ? styles.wantedCard : ""}`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {wanted && <span className={styles.wantedTag}>★ WANTED</span>}
      <span
        className={styles.rarityPip}
        style={{ background: rarityPip(item.rarity) }}
        role="img"
        aria-label={`${item.rarity} rarity`}
      />
      <ItemIcon id={item.id} className={styles.icon} />
      <span className={styles.cardName}>{item.name}</span>
      <span className={`${styles.bagProfit} ${profitClass}`}>{gSigned(estProfit)}</span>
      {appraise && <span className={styles.cardWorth}>worth ~{g(item.value)}</span>}
    </button>
  );
}

// ---- haggle modal ------------------------------------------------------------
function HaggleModal({ state, dispatch, playSFX }) {
  const h = state.haggle;
  const buy = h.side === "buy";
  const gold = state.gold;
  const anchor = buy ? h.ask : h.offer;
  // when buying you can never offer more coin than you hold
  const max = buy ? Math.min(h.ask, gold) : Math.round(h.ceil * 1.4);
  const min = Math.min(buy ? Math.round(h.ask * 0.4) : h.offer, max);
  const step = Math.max(1, Math.round(h.value * 0.02));
  const clampP = (v) => Math.max(min, Math.min(max, v));
  const [price, setPrice] = useState(() => clampP(anchor));

  // Re-anchor the offer to Kaito's price whenever he counters or it opens.
  useEffect(() => {
    setPrice(Math.max(min, Math.min(max, anchor)));
  }, [anchor, min, max, h.inst.uid, h.side]);

  const deal = h.status === "deal";
  const canAffordAnchor = !buy || anchor <= gold;

  // Keyboard: Escape backs out (walk while mid-haggle, dismiss once a deal's struck).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      dispatch({ type: deal ? "CLOSE_HAGGLE" : "WALK" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deal, dispatch]);

  return (
    <div className={styles.overlay}>
      <div
        className={styles.haggle}
        role="dialog"
        aria-modal="true"
        aria-label={`${buy ? "Buying" : "Selling"} ${h.inst.name}`}
      >
        <div className={styles.haggleKaito}>
          <img src={portraitSrc(state.portrait)} alt="Kaito" draggable={false} />
          <p className={styles.haggleQuip}>{state.quip}</p>
        </div>

        <div className={styles.haggleMain}>
          <div className={styles.haggleItem}>
            <ItemIcon id={h.inst.id} className={styles.haggleIcon} />
            <div>
              <div className={styles.haggleName}>{h.inst.name}</div>
              <div className={styles.haggleSub}>
                {buy ? "Kaito is selling" : h.wanted ? "Kaito WANTS this" : "Kaito will take it"}
                {state.perks.appraise && ` · worth ~${g(h.value)}`}
              </div>
            </div>
            <Patience h={h} />
          </div>

          {deal ? (
            <div className={styles.dealRow}>
              <div className={styles.dealBig}>
                {buy ? "BOUGHT" : "SOLD"} for <b>{g(h.price)}</b>
              </div>
              {!buy && (
                <div
                  className={`${styles.dealProfit} ${
                    h.profit >= 0 ? styles.profitPos : styles.profitNeg
                  }`}
                >
                  {h.profit >= 0 ? "Profit " : "Loss "}
                  {gSigned(h.profit)}
                </div>
              )}
              {!buy && h.tip > 0 && (
                <div className={styles.tipNote}>
                  <span aria-hidden="true">🔥</span> Hot-streak tip <b>+{g(h.tip)}</b>
                  &nbsp;· {h.streak} in a row
                </div>
              )}
              {h.rapportGain >= 2 && (
                <div className={styles.rapportNote}>♥ Kaito warms to you — rapport up</div>
              )}
              <button
                className={styles.btnPrimary}
                onClick={() => dispatch({ type: "CLOSE_HAGGLE" })}
                autoFocus
              >
                Continue
              </button>
            </div>
          ) : h.final ? (
            <div className={styles.finalRow}>
              <p className={styles.finalText}>
                Kaito&rsquo;s final word: <b>{g(buy ? h.ask : h.offer)}</b>. Take it or leave it.
              </p>
              <div className={styles.haggleBtns}>
                <button
                  className={styles.btnPrimary}
                  disabled={buy && h.ask > gold}
                  onClick={() => dispatch({ type: "QUICK_DEAL" })}
                >
                  {buy ? `Pay ${g(h.ask)}` : `Accept ${g(h.offer)}`}
                </button>
                <button className={styles.btnGhost} onClick={() => dispatch({ type: "WALK" })}>
                  Walk away
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>
                  {buy ? "Kaito asks" : "Kaito offers"}
                </span>
                <span className={styles.priceAnchor}>{g(anchor)}</span>
              </div>

              <div className={styles.offerRow}>
                <span className={styles.offerLabel}>Your offer</span>
                <div className={styles.stepper}>
                  <button onClick={() => setPrice((p) => clampP(p - step))}>&minus;</button>
                  <span className={styles.offerValue}>{g(price)}</span>
                  <button onClick={() => setPrice((p) => clampP(p + step))}>+</button>
                </div>
              </div>

              <input
                className={styles.slider}
                type="range"
                min={min}
                max={max}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    playSFX("ButtonClick");
                    dispatch({ type: "OFFER", price });
                  }
                }}
                aria-label="Your offer"
              />
              <p className={styles.slideHint}>
                {buy
                  ? "Offer below his ask — but lowball him and he'll bristle."
                  : "Ask above his offer — but push too far and he'll balk."}
              </p>

              <div className={styles.haggleBtns}>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    playSFX("ButtonClick");
                    dispatch({ type: "OFFER", price });
                  }}
                  autoFocus
                >
                  Offer {g(price)}
                </button>
                <button
                  className={styles.btnSecondary}
                  disabled={!canAffordAnchor}
                  onClick={() => dispatch({ type: "QUICK_DEAL" })}
                >
                  Quick deal ({g(anchor)})
                </button>
                <button className={styles.btnGhost} onClick={() => dispatch({ type: "WALK" })}>
                  Walk
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Patience({ h }) {
  return (
    <div
      className={styles.patience}
      title="Patience"
      role="img"
      aria-label={`Kaito's patience: ${h.patience} of ${h.maxPatience}. Bad offers cost patience; at zero he makes a final take-it-or-leave-it offer.`}
    >
      {Array.from({ length: h.maxPatience }).map((_, i) => (
        <span
          key={i}
          className={`${styles.pip} ${i < h.patience ? styles.pipOn : ""}`}
        />
      ))}
    </div>
  );
}

// ---- day / run overlays ------------------------------------------------------
function DayEnd({ state, dispatch }) {
  const canPay = state.gold >= state.rent;
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>CLOSING TIME — DAY {state.day}</h2>
        <div className={styles.ledger}>
          {state.dayDeals > 0 && (
            <Line
              k={`Sold today (${state.dayDeals} ${state.dayDeals === 1 ? "deal" : "deals"})`}
              v={`+${g(state.dayTakings)}`}
              good
            />
          )}
          <Line k="Coin on hand" v={g(state.gold)} />
          <Line k="Rent due" v={g(state.rent)} warn={!canPay} />
          <Line k="After rent" v={g(state.gold - state.rent)} warn={!canPay} />
        </div>
        {!canPay && (
          <p className={styles.warnText}>
            You can&rsquo;t cover rent — this ends your run.
          </p>
        )}
        <button
          className={styles.btnPrimary}
          onClick={() => dispatch({ type: "SLEEP" })}
        >
          {canPay ? "Pay rent & turn in" : "Face the landlord"}
        </button>
      </div>
    </div>
  );
}

function Backstory({ tier, dispatch }) {
  return (
    <div className={styles.overlay}>
      <div className={`${styles.panel} ${styles.storyPanel}`}>
        <img className={styles.storyPortrait} src={portraitSrc(tier.portrait)} alt="Kaito" draggable={false} />
        <h2 className={styles.storyTitle}>{tier.title}</h2>
        <p className={styles.storyText}>&ldquo;{tier.text}&rdquo;</p>
        <button className={styles.btnPrimary} onClick={() => dispatch({ type: "ACK_BACKSTORY" })}>
          Open the shop
        </button>
      </div>
    </div>
  );
}

function RunEnd({ state, dispatch, records, newRecords }) {
  const win = state.phase === "win";
  const nr = newRecords || {};
  const finalGold = state.stats.finalGold ?? state.gold;
  const storyCount = records ? records.lore.length : 0;
  return (
    <div className={styles.overlay}>
      <div className={`${styles.panel} ${win ? styles.winPanel : styles.overPanel}`}>
        <h2 className={styles.panelTitle}>{win ? "A FINE PARTNERSHIP" : "OUT OF BUSINESS"}</h2>
        <img
          className={styles.endPortrait}
          src={portraitSrc(win ? "ThumbsUp" : "Embarrassed")}
          alt="Kaito"
          draggable={false}
        />
        <p className={styles.endBlurb}>
          {win
            ? "You survived the season and earned Kaito's trust. He's offered you a stake in the shop — partners!"
            : "Couldn't make rent. Kaito waves you off with a sympathetic smile — the shop's doors will always be open."}
        </p>
        <div className={styles.ledger}>
          <Line k="Days survived" v={String(state.stats.daysSurvived)} badge={nr.day} />
          <Line k="Coin in hand" v={g(finalGold)} badge={nr.gold} />
          <Line k="Coin earned" v={g(state.stats.earned)} />
          <Line k="Best rapport" v={`♥ ${state.stats.bestRapport}`} badge={nr.rapport} />
          <Line k="Longest streak" v={`🔥 ${state.stats.bestStreak}`} badge={nr.streak} />
          <Line k="Deals struck" v={String(state.stats.deals)} />
        </div>
        {records && (
          <p className={styles.recordsLine}>
            Best run {g(records.bestGold)} · {records.wins}{" "}
            {records.wins === 1 ? "win" : "wins"} in {records.runs}{" "}
            {records.runs === 1 ? "run" : "runs"} · story {storyCount}/
            {RAPPORT_TIERS.length}
          </p>
        )}
        <button
          className={styles.btnPrimary}
          onClick={() => dispatch({ type: "RESTART", seed: (Date.now() >>> 0) || 1 })}
          autoFocus
        >
          New run
        </button>
      </div>
    </div>
  );
}

function HelpPanel({ onClose }) {
  // Close on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.panel} ${styles.helpPanel}`}
        role="dialog"
        aria-modal="true"
        aria-label="How to play Kaito's Curios"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.panelTitle}>HOW TO PLAY</h2>
        <p className={styles.helpLede}>
          You&rsquo;re a travelling trader; Kaito runs the curio shop. Turn a profit
          and survive the rent &mdash; deal kindly and he&rsquo;ll let you in on who he
          really is.
        </p>
        <ul className={styles.helpList}>
          <li>
            <b>Buy low.</b> Tap something on Kaito&rsquo;s shelf and haggle his price
            <i> down</i> toward what it&rsquo;s worth.
          </li>
          <li>
            <b>Sell into demand.</b> Each day Kaito pays a premium for a few
            categories &mdash; the <span className={styles.helpStar}>★ FLIP</span> tag
            marks them. Buy those and sell them back the same day for profit.
          </li>
          <li>
            <b>Hold the rest.</b> Anything <i>not</i> in demand sells at a loss today, so
            stash it and wait for a day Kaito wants it.
          </li>
          <li>
            <b>Mind his patience.</b> Lowball him and the dots drain &mdash; at zero he
            makes one final take-it-or-leave-it offer.
          </li>
          <li>
            <b>Win his trust.</b> Fair, generous deals raise <span className={styles.helpHeart}>♥</span>
            rapport, unlocking perks and real pieces of Kaito&rsquo;s story.
          </li>
          <li>
            <b>Survive {LAST_TRADING_DAY} days.</b> Rent comes due every night and keeps
            climbing. Make it to the end and you&rsquo;ve earned a partnership.
          </li>
        </ul>
        <button className={styles.btnPrimary} onClick={onClose} autoFocus>
          Let&rsquo;s trade
        </button>
      </div>
    </div>
  );
}

function Codex({ lore, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.panel} ${styles.codexPanel}`}
        role="dialog"
        aria-modal="true"
        aria-label="Kaito's story"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.panelTitle}>KAITO&rsquo;S STORY</h2>
        <p className={styles.codexSub}>
          {lore.length} of {RAPPORT_TIERS.length} memories earned — win his trust to
          hear more.
        </p>
        <div className={styles.codexList}>
          {RAPPORT_TIERS.map((t, i) => {
            const got = lore.includes(i);
            return (
              <div
                key={t.at}
                className={`${styles.codexCard} ${got ? "" : styles.codexLocked}`}
              >
                {got ? (
                  <img
                    className={styles.codexPortrait}
                    src={portraitSrc(t.portrait)}
                    alt=""
                    draggable={false}
                  />
                ) : (
                  <div className={styles.codexLockIcon} aria-hidden="true">
                    🔒
                  </div>
                )}
                <div className={styles.codexText}>
                  <div className={styles.codexCardTitle}>
                    {got ? t.title : "A memory not yet shared"}
                  </div>
                  <p>{got ? `“${t.text}”` : `Reach ♥${t.at} rapport to unlock.`}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button className={styles.btnPrimary} onClick={onClose} autoFocus>
          Close
        </button>
      </div>
    </div>
  );
}

function Line({ k, v, warn, good, badge }) {
  return (
    <div className={styles.line}>
      <span>
        {k}
        {badge && <span className={styles.newBadge}>★ BEST</span>}
      </span>
      <span className={warn ? styles.lineWarn : good ? styles.lineGood : ""}>{v}</span>
    </div>
  );
}

function Toast({ toast }) {
  const [shown, setShown] = useState(null);
  const n = toast ? toast.n : 0;
  useEffect(() => {
    if (!toast) return;
    setShown(toast.text);
    const id = setTimeout(() => setShown(null), 3400);
    return () => clearTimeout(id);
  }, [n, toast]);
  if (!shown) return null;
  return <div className={styles.toast}>{shown}</div>;
}
