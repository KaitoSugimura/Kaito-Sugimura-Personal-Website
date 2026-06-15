import { useContext, useEffect, useReducer, useRef, useState } from "react";
import styles from "./Shop.module.css";
import { ItemIcon } from "./itemIcons";
import { reduce, createRun, bagSlots, buyPrice, sellPrice, skillLevel } from "./shopEngine";
import { RARITY, CONFIG, STORY, SKILLS, SKILL_BY_ID } from "./shopData";
import { useRecords } from "./useRecords";
import { g, gSigned, portraitSrc, useEscape } from "./shopUi";
import Scrim from "./Scrim";
import { scrollContext } from "../scrollContext";
import { SoundContext, VolumeContext } from "../../../Context/SoundContext";
import Sections from "../HomeTableOfContents.jsx";

const SECTION_TITLE = "Shop";
// Where the win-screen fourth-wall CTA sends the visitor (Kaito's real work).
// Resolved lazily: HomeTableOfContents imports Shop, so reading its default
// export at module-eval time hits the temporal dead zone (circular import).
const projectsSection = () => Sections.findIndex((s) => s.title === "Projects");
const LAST_TRADING_DAY = CONFIG.victoryDay - 1; // win = survive to the morning of victoryDay

export default function Shop({ isfocus }) {
  isfocus = isfocus === "true";
  const { setScrollable, goToSection, currentSection, openDialogWithCallback, chromeHidden, setChromeHidden } =
    useContext(scrollContext);
  const { playSFX } = useContext(SoundContext);
  const { volume, setVolume } = useContext(VolumeContext);
  const muted = volume === 0;
  const prevVolume = useRef(volume || 0.5);
  const toggleMute = () => {
    if (muted) {
      setVolume(prevVolume.current || 0.5);
    } else {
      prevVolume.current = volume;
      setVolume(0);
    }
  };

  const seedRef = useRef((Date.now() >>> 0) || 1);
  const [state, dispatch] = useReducer(reduce, undefined, () => createRun(seedRef.current));

  // The run begins when the player first reaches the Shop — not at page load
  // (every section mounts up front). Re-seed once on first focus so rent isn't
  // ticking on a run nobody has seen. Scrolling away and back does NOT reset it.
  const startedRef = useRef(false);
  useEffect(() => {
    if (isfocus && !startedRef.current) {
      startedRef.current = true;
      dispatch({ type: "RESTART", seed: (Date.now() >>> 0) || 1 });
    }
  }, [isfocus]);

  const [showHelp, setShowHelp] = useState(false);
  const [showCodex, setShowCodex] = useState(false);

  // Persistent records (best run, win count, unlocked story) survive across runs.
  const [records, mutateRecords] = useRecords();
  const [newRecords, setNewRecords] = useState(null);

  // Bank the story beat the moment it's revealed, so the codex remembers it even
  // if the player never reaches that day again. Idempotent under StrictMode.
  const loreIdx = state.pendingStory ? state.pendingStory.idx : null;
  useEffect(() => {
    if (loreIdx == null) return;
    mutateRecords((r) => (r.lore.includes(loreIdx) ? r : { ...r, lore: [...r.lore, loreIdx] }));
  }, [loreIdx, mutateRecords]);

  // Bank end-of-run stats once per run, flagging anything that beat a best.
  const endRecorded = useRef(false);
  useEffect(() => {
    const terminal = state.phase === "win" || state.phase === "over";
    if (!terminal) {
      endRecorded.current = false;
      return;
    }
    if (endRecorded.current) return;
    endRecorded.current = true;
    const won = state.phase === "win";
    const finalGold = state.stats.finalGold ?? state.gold;
    let flags;
    mutateRecords((prev) => {
      flags = {
        gold: finalGold > prev.bestGold,
        day: state.stats.daysSurvived > prev.bestDay,
        firstWin: won && prev.wins === 0,
      };
      return {
        ...prev,
        bestGold: Math.max(prev.bestGold, finalGold),
        bestDay: Math.max(prev.bestDay, state.stats.daysSurvived),
        wins: prev.wins + (won ? 1 : 0),
        runs: prev.runs + 1,
        // A win means hearing his whole story — guarantee every beat is readable
        // in the Codex afterwards, even for a player who lost story-card nights.
        lore: won ? STORY.map((_, i) => i) : prev.lore,
      };
    });
    setNewRecords(flags);
  }, [state.phase, state.gold, state.stats, mutateRecords]);

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

  // Any full-screen modal (a phase modal, help, or codex) owns the screen.
  const modalUp = showHelp || showCodex || state.phase !== "shop";

  // Lock page-snap scrolling while an overlay/modal is up so a stray wheel tick
  // can't yank the player out mid-decision; let them scroll away while browsing.
  useEffect(() => {
    if (!isfocus) {
      setScrollable(true);
      return;
    }
    setScrollable(!modalUp);
  }, [isfocus, modalUp, setScrollable]);

  // A phase modal takes precedence over the help / codex panels — close those so
  // two scrims can't stack and double-darken.
  useEffect(() => {
    if (state.phase !== "shop") {
      setShowHelp(false);
      setShowCodex(false);
    }
  }, [state.phase]);

  // Fire the sound cue the engine requested on its last transition.
  const lastSfx = useRef(0);
  useEffect(() => {
    if (state.sfx && state.sfx.n !== lastSfx.current) {
      lastSfx.current = state.sfx.n;
      if (state.sfx.cue) playSFX(state.sfx.cue);
    }
  }, [state.sfx, playSFX]);

  // Briefly flourish the coin counter whenever it ticks up (a sale, a stipend).
  const [goldUp, setGoldUp] = useState(false);
  const prevGold = useRef(state.gold);
  useEffect(() => {
    if (state.gold > prevGold.current) {
      setGoldUp(true);
      const id = setTimeout(() => setGoldUp(false), 600);
      prevGold.current = state.gold;
      return () => clearTimeout(id);
    }
    prevGold.current = state.gold;
  }, [state.gold]);

  const slots = bagSlots(state);
  const hasForecast = skillLevel(state, "forecast") > 0;

  // Surface a dead-end: nothing affordable to buy AND nothing in the bag to sell.
  const canBuy = state.bag.length < slots && state.shelf.some((it) => state.gold >= buyPrice(state, it));
  const canSell = state.bag.length > 0;
  const stuck = state.phase === "shop" && !canBuy && !canSell;
  const cantMakeRent = state.gold < state.rent;

  return (
    <div className={styles.root} data-active={isfocus} style={{ height: "100dvh" }}>
      <div className={styles.grain} />

      <div className={styles.hud}>
        <div className={styles.hudLeft}>
          {state.day === LAST_TRADING_DAY ? (
            <span
              className={`${styles.hudDay} ${styles.hudDayFinal}`}
              title="The last trading day — rent spikes tonight. Make it count."
            >
              FINAL DAY
            </span>
          ) : (
            <span className={styles.hudDay}>
              DAY {state.day}
              <span className={styles.hudDayGoal}>&nbsp;/ {LAST_TRADING_DAY}</span>
            </span>
          )}
          <span className={`${styles.hudGold} ${goldUp ? styles.hudGoldUp : ""}`} title="Coin on hand">
            {g(state.gold)}
          </span>
          <SkillsStrip skills={state.skills} />
        </div>
        <div className={styles.hudRight}>
          <span className={styles.hudRent}>
            RENT&nbsp;<b>{g(state.rent)}</b>
          </span>
          <button className={styles.helpBtn} onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Unmute" : "Mute"}>
            {muted ? "🔇" : "🔊"}
          </button>
          {setChromeHidden && (
            <button
              className={styles.helpBtn}
              onClick={() => {
                playSFX("MenuOpen");
                setChromeHidden((v) => !v);
              }}
              aria-label={chromeHidden ? "Show site menu" : "Hide site menu"}
              title={chromeHidden ? "Show site menu" : "Hide site menu"}
              aria-pressed={!chromeHidden}
            >
              ≡
            </button>
          )}
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
          <KaitoPortrait portrait={state.portrait} quip={state.quip} muted={modalUp} />
          <WantsBoard wants={state.wants} forecast={hasForecast ? state.forecast : null} />
        </div>

        <div className={styles.shelfWrap}>
          <h2 className={styles.shelfTitle}>
            <span>KAITO&rsquo;S WARES</span>
            <span className={styles.shelfTitleRight}>
              <span className={styles.shelfHint}>buy low &middot; sell into demand</span>
              {state.restocksLeft > 0 && (
                <button
                  className={styles.restockBtn}
                  onClick={() => dispatch({ type: "RESTOCK" })}
                  title="Refresh the shelf with new wares"
                >
                  🔄 Restock ({state.restocksLeft})
                </button>
              )}
            </span>
          </h2>
          <div className={styles.shelf}>
            {state.shelf.map((it, i) => (
              <ShelfItem
                key={it.uid}
                item={it}
                price={buyPrice(state, it)}
                appraise={skillLevel(state, "appraise") > 0}
                want={state.wants.find((w) => w.category === it.category)}
                affordable={state.gold >= buyPrice(state, it) && state.bag.length < slots}
                bagFull={state.bag.length >= slots}
                style={{ animationDelay: `${Math.min(i, 7) * 45}ms` }}
                onClick={() => dispatch({ type: "BUY", uid: it.uid })}
              />
            ))}
            {state.shelf.length === 0 && (
              <p className={styles.soldOut}>Sold out for today — close up shop to end the day.</p>
            )}
          </div>
        </div>
      </div>

      {stuck && (
        <div className={`${styles.stuckHint} ${cantMakeRent ? styles.stuckHintWarn : ""}`} role="status">
          {cantMakeRent
            ? "Low on coin and nothing left to trade — you may not make rent tonight."
            : "You've traded all you can today — close up shop to turn in."}
        </div>
      )}

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
                proj={sellPrice(state, it)}
                appraise={skillLevel(state, "appraise") > 0}
                onClick={() => dispatch({ type: "SELL", uid: it.uid })}
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

      {/* Modals portal to a fixed body-level layer, so gate them on focus. */}
      {isfocus && (
        <>
          {state.phase === "draft" && state.draft && <SkillDraft state={state} dispatch={dispatch} playSFX={playSFX} />}
          {state.phase === "dayEnd" && <DayEnd state={state} dispatch={dispatch} hasForecast={hasForecast} />}
          {state.phase === "story" && state.pendingStory && <StoryCard state={state} dispatch={dispatch} />}
          {(state.phase === "over" || state.phase === "win") && (
            <RunEnd
              state={state}
              dispatch={dispatch}
              records={records}
              newRecords={newRecords}
              onShowStory={() => {
                playSFX("MenuOpen");
                setShowCodex(true);
              }}
              onSeeProjects={
                goToSection
                  ? () => {
                      playSFX("ButtonClick");
                      goToSection(projectsSection());
                    }
                  : null
              }
            />
          )}
          {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
          {showCodex && <Codex lore={records.lore} onClose={() => setShowCodex(false)} />}
        </>
      )}

      <Toast toast={state.toast} />
    </div>
  );
}

// ---- HUD bits ----------------------------------------------------------------
function SkillsStrip({ skills }) {
  const owned = SKILLS.filter((s) => (skills[s.id] || 0) > 0);
  if (owned.length === 0) return null;
  return (
    <div className={styles.skillsStrip} aria-label="Skills you've drafted this run">
      {owned.map((s) => {
        const lvl = skills[s.id];
        return (
          <span
            key={s.id}
            className={styles.skillChip}
            title={`${s.name}${lvl > 1 ? ` ×${lvl}` : ""} — ${s.desc}`}
          >
            <span aria-hidden="true">{s.icon}</span>
            {lvl > 1 && <b>×{lvl}</b>}
            <span className={styles.srOnly}>
              {s.name}
              {lvl > 1 ? ` level ${lvl}` : ""}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function KaitoPortrait({ portrait, quip, muted }) {
  return (
    <div className={styles.kaito}>
      <div className={styles.bubble} aria-hidden={muted} style={muted ? { visibility: "hidden" } : undefined}>
        {quip}
      </div>
      <div className={styles.portraitFrame}>
        <img className={styles.portrait} src={portraitSrc(portrait)} alt="Kaito the shopkeeper" draggable={false} />
      </div>
      <div className={styles.nameplate}>KAITO</div>
    </div>
  );
}

function WantsBoard({ wants, forecast }) {
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
      {forecast && forecast.length > 0 && (
        <div className={styles.forecast}>
          <h4 className={styles.forecastTitle}>
            TOMORROW <span aria-hidden="true">→</span>
          </h4>
          <ul className={styles.wantsList}>
            {forecast.map((w) => (
              <li key={w.category} className={styles.wantRow}>
                <span className={styles.forecastCat}>{w.category}</span>
                <span className={styles.forecastBonus}>~+{Math.round(w.bonus * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function rarityPip(rarity) {
  return RARITY[rarity] ? RARITY[rarity].hue : "#8a7a5c";
}

function ShelfItem({ item, price, appraise, want, affordable, bagFull, onClick, style }) {
  const reason = affordable ? "" : bagFull ? " Your bag is full." : " Not enough coin.";
  const label = `${item.name}, ${item.rarity} ${item.category}, costs ${g(price)}.${
    appraise ? ` Worth about ${g(item.value)}.` : ""
  }${want ? ` In demand today — sells for about +${Math.round(want.bonus * 100)}%.` : ""}${reason}${
    affordable ? " Buy." : ""
  }`;
  return (
    <button
      className={`${styles.card} ${want ? styles.shelfWanted : ""} ${affordable ? "" : styles.cardLocked}`}
      style={style}
      onClick={onClick}
      disabled={!affordable}
      title={item.flavor + (want ? ` In demand today (+${Math.round(want.bonus * 100)}%).` : "")}
      aria-label={label}
    >
      {want && (
        <span className={styles.flipTag} aria-hidden="true">
          ★ +{Math.round(want.bonus * 100)}%
        </span>
      )}
      <span
        className={`${styles.rarityPip} ${item.rarity === "legendary" ? styles.rarityPipTop : ""}`}
        style={{ backgroundColor: rarityPip(item.rarity) }}
        role="img"
        aria-label={`${item.rarity} rarity`}
      />
      <ItemIcon id={item.id} className={styles.icon} />
      <span className={styles.cardName}>{item.name}</span>
      <span className={styles.cardPrice}>{g(price)}</span>
      {appraise && <span className={styles.cardWorth}>worth ~{g(item.value)}</span>}
    </button>
  );
}

function BagItem({ item, proj, appraise, onClick }) {
  const { wanted, price, profit } = proj;
  const profitClass = profit >= 0 ? styles.profitPos : styles.profitNeg;
  const label = wanted
    ? `${item.name} — in demand. Sells for ${g(price)} (${gSigned(profit)} vs the ${g(item.paid)} you paid). Tap to sell.`
    : `${item.name} — not in demand; sells for ${g(price)} (${gSigned(profit)}). Hold it for a day Kaito wants ${item.category}, or tap to sell now.`;
  return (
    <button
      className={`${styles.card} ${styles.bagCard} ${wanted ? styles.wantedCard : ""}`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {wanted && <span className={styles.wantedTag}>★ WANTED</span>}
      <span
        className={`${styles.rarityPip} ${item.rarity === "legendary" ? styles.rarityPipTop : ""}`}
        style={{ backgroundColor: rarityPip(item.rarity) }}
        role="img"
        aria-label={`${item.rarity} rarity`}
      />
      <ItemIcon id={item.id} className={styles.icon} />
      <span className={styles.cardName}>{item.name}</span>
      <span className={styles.cardPrice}>{g(price)}</span>
      <span className={`${styles.bagProfit} ${profitClass}`}>{gSigned(profit)}</span>
      {appraise && <span className={styles.cardWorth}>worth ~{g(item.value)}</span>}
    </button>
  );
}

// ---- skill draft -------------------------------------------------------------
function SkillDraft({ state, dispatch, playSFX }) {
  return (
    <Scrim>
      <div className={`${styles.panel} ${styles.draftPanel}`} role="dialog" aria-modal="true" aria-label="Choose a skill">
        <h2 className={styles.panelTitle}>A TRICK OF THE TRADE</h2>
        <p className={styles.draftLede}>Pick one — it sticks for the rest of the run.</p>
        <div className={styles.draftCards}>
          {state.draft.map((opt, i) => {
            const def = SKILL_BY_ID[opt.id];
            const stacking = def.kind === "stack";
            return (
              <button
                key={opt.id}
                className={styles.draftCard}
                autoFocus={i === 0}
                onClick={() => {
                  playSFX("SelectConfirm");
                  dispatch({ type: "PICK_SKILL", id: opt.id });
                }}
              >
                <span className={styles.draftIcon} aria-hidden="true">
                  {def.icon}
                </span>
                <span className={styles.draftName}>
                  {def.name}
                  {stacking && <span className={styles.draftLevel}> Lv {opt.nextLevel}</span>}
                </span>
                <span className={styles.draftDesc}>{def.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Scrim>
  );
}

// ---- day / run overlays ------------------------------------------------------
function DayEnd({ state, dispatch, hasForecast }) {
  const canPay = state.gold >= state.rent;
  return (
    <Scrim>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label={`End of day ${state.day}`}>
        <h2 className={styles.panelTitle}>CLOSING TIME — DAY {state.day}</h2>
        <div className={styles.ledger}>
          {state.dayDeals > 0 && (
            <Line k={`Sold today (${state.dayDeals} ${state.dayDeals === 1 ? "deal" : "deals"})`} v={`+${g(state.dayTakings)}`} good />
          )}
          <Line k="Coin on hand" v={g(state.gold)} />
          <Line k="Rent due" v={g(state.rent)} warn={!canPay} />
          <Line k="After rent" v={g(state.gold - state.rent)} warn={!canPay} />
        </div>
        {canPay && hasForecast && state.forecast && state.forecast.length > 0 && (
          <p className={styles.forecastLine}>
            <b>Tomorrow&rsquo;s demand:</b>{" "}
            {state.forecast.map((w) => `${w.category} +${Math.round(w.bonus * 100)}%`).join(" · ")}.
          </p>
        )}
        {!canPay && <p className={styles.warnText}>You can&rsquo;t cover rent — this ends your run.</p>}
        <button className={styles.btnPrimary} onClick={() => dispatch({ type: "SLEEP" })} autoFocus>
          {canPay ? "Pay rent & turn in" : "Face the landlord"}
        </button>
      </div>
    </Scrim>
  );
}

function StoryCard({ state, dispatch }) {
  const beat = state.pendingStory;
  const willWin = state.day >= CONFIG.victoryDay;
  useEscape(() => dispatch({ type: "ACK_STORY" }));
  return (
    <Scrim>
      <div className={`${styles.panel} ${styles.storyPanel}`} role="dialog" aria-modal="true" aria-label={beat.title}>
        <img className={styles.storyPortrait} src={portraitSrc(beat.portrait)} alt="Kaito" draggable={false} />
        <h2 className={styles.storyTitle}>{beat.title}</h2>
        <p className={styles.storyText}>&ldquo;{beat.text}&rdquo;</p>
        <button className={styles.btnPrimary} onClick={() => dispatch({ type: "ACK_STORY" })} autoFocus>
          {willWin ? "Continue" : "On to tomorrow"}
        </button>
      </div>
    </Scrim>
  );
}

// A flavourful end-of-run rank. A win clears Silver; a coin-heavy, skill-rich run
// reaches Master. Losses land Apprentice/Bronze by how long you lasted.
function rankFor({ win, finalGold, days, skills }) {
  if (!win) {
    return days >= 4 ? { label: "Bronze Trader", key: "bronze" } : { label: "Apprentice", key: "apprentice" };
  }
  const score = finalGold + skills * 30 + days * 25;
  if (score >= 700) return { label: "Master Merchant", key: "master" };
  if (score >= 450) return { label: "Gold Trader", key: "gold" };
  return { label: "Silver Trader", key: "silver" };
}
const RANK_TONE = {
  master: styles.rankMaster,
  gold: styles.rankGold,
  silver: styles.rankSilver,
  bronze: styles.rankBronze,
  apprentice: styles.rankApprentice,
};

function RunEnd({ state, dispatch, records, newRecords, onShowStory, onSeeProjects }) {
  const win = state.phase === "win";
  const nr = newRecords || {};
  const finalGold = state.stats.finalGold ?? state.gold;
  const storyCount = records ? records.lore.length : 0;
  const skillCount = Object.values(state.skills).reduce((a, n) => a + n, 0);
  const rank = rankFor({ win, finalGold, days: state.stats.daysSurvived, skills: skillCount });
  const restart = () => dispatch({ type: "RESTART", seed: (Date.now() >>> 0) || 1 });
  return (
    <Scrim>
      <div className={`${styles.panel} ${win ? styles.winPanel : styles.overPanel}`} role="dialog" aria-modal="true" aria-label={win ? "You win" : "Game over"}>
        <h2 className={styles.panelTitle}>{win ? "A FINE PARTNERSHIP" : "OUT OF BUSINESS"}</h2>
        <div className={`${styles.rankBadge} ${RANK_TONE[rank.key] || ""}`}>
          <span className={styles.rankLabel}>RANK</span>
          <b>{rank.label}</b>
        </div>
        <img className={styles.endPortrait} src={portraitSrc(win ? "ThumbsUp" : "Embarrassed")} alt="Kaito" draggable={false} />
        <p className={styles.endBlurb}>
          {win
            ? "You survived the season and earned Kaito's trust. He's offered you a stake in the shop — partners!"
            : "Couldn't make rent. Kaito waves you off with a sympathetic smile — the shop's doors will always be open."}
        </p>
        <div className={styles.ledger}>
          <Line k="Days survived" v={String(state.stats.daysSurvived)} badge={nr.day} />
          <Line k="Coin in hand" v={g(finalGold)} badge={nr.gold} />
          <Line k="Coin earned" v={g(state.stats.earned)} />
          <Line k="Skills learned" v={String(skillCount)} />
          <Line k="Deals struck" v={String(state.stats.deals)} />
        </div>
        {records && (
          <p className={styles.recordsLine}>
            Best run {g(records.bestGold)} · {records.wins} {records.wins === 1 ? "win" : "wins"} in {records.runs}{" "}
            {records.runs === 1 ? "run" : "runs"} · story {storyCount}/{STORY.length}
          </p>
        )}
        {win && onSeeProjects ? (
          <>
            {/* Fourth-wall close: Kaito IS the developer — send the visitor to his
                real work. This is the recruiter-conversion moment. */}
            <div className={styles.fourthWall}>
              <p>
                Kaito&rsquo;s told you his story &mdash; the code, the games, the karate. The rest of this site is the
                real thing he&rsquo;s built.
              </p>
              <button type="button" className={styles.btnPrimary} onClick={onSeeProjects} autoFocus>
                See what Kaito&rsquo;s built &rarr;
              </button>
            </div>
            <div className={styles.endActions}>
              {onShowStory && (
                <button type="button" className={styles.btnSecondary} onClick={onShowStory}>
                  📖 Re-read his story
                </button>
              )}
              <button type="button" className={styles.btnGhost} onClick={restart}>
                Play again
              </button>
            </div>
          </>
        ) : (
          <>
            {win && onShowStory && (
              <button type="button" className={styles.btnSecondary} onClick={onShowStory}>
                📖 Hear the rest of his story
              </button>
            )}
            <button className={styles.btnPrimary} onClick={restart} autoFocus>
              New run
            </button>
          </>
        )}
      </div>
    </Scrim>
  );
}

function HelpPanel({ onClose }) {
  useEscape(onClose);
  return (
    <Scrim onBackdrop={onClose}>
      <div className={`${styles.panel} ${styles.helpPanel}`} role="dialog" aria-modal="true" aria-label="How to play Kaito's Curios">
        <h2 className={styles.panelTitle}>HOW TO PLAY</h2>
        <p className={styles.helpLede}>
          You&rsquo;re a travelling trader; Kaito runs the curio shop. Buy low, sell into the day&rsquo;s demand, and
          survive the rent. Deal long enough and he&rsquo;ll tell you who he really is.
        </p>
        <ul className={styles.helpList}>
          <li>
            <b>Sell into demand.</b> Each day a few categories are <span className={styles.helpStar}>★ in demand</span>{" "}
            (see the board) and pay a premium. Wares not in demand only sell for scraps.
          </li>
          <li>
            <b>Buy low.</b> Tap a ware on the shelf to buy it at the marked price; tap one in your bag to sell it. No
            haggling &mdash; the prices are what they are.
          </li>
          <li>
            <b>Draft a skill each morning.</b> Kaito offers three tricks of the trade &mdash; pick one. They stack all
            run: cheaper buys, bigger bags, fatter demand bonuses, and more.
          </li>
          <li>
            <b>Hold or flip.</b> A ware not wanted today can wait in your bag for a day its category <i>is</i> wanted
            &mdash; if you can spare the slot.
          </li>
          <li>
            <b>Pay the rent.</b> Rent comes due every night and keeps climbing. Can&rsquo;t pay &mdash; the run ends.
          </li>
          <li>
            <b>Survive {LAST_TRADING_DAY} days.</b> Make it to the end and you&rsquo;ve earned a partnership &mdash; and
            heard Kaito&rsquo;s whole story.
          </li>
        </ul>
        <div className={styles.helpLegend}>
          <span className={styles.helpLegendTitle}>Rarity</span>
          {Object.entries(RARITY).map(([key, r]) => (
            <span key={key} className={styles.helpLegendItem}>
              <span
                className={`${styles.helpLegendPip} ${key === "legendary" ? styles.rarityPipTop : ""}`}
                style={{ backgroundColor: r.hue }}
                aria-hidden="true"
              />
              {r.label}
            </span>
          ))}
        </div>
        <button className={styles.btnPrimary} onClick={onClose} autoFocus>
          Let&rsquo;s trade
        </button>
      </div>
    </Scrim>
  );
}

function Codex({ lore, onClose }) {
  useEscape(onClose);
  return (
    <Scrim onBackdrop={onClose}>
      <div className={`${styles.panel} ${styles.codexPanel}`} role="dialog" aria-modal="true" aria-label="Kaito's story">
        <h2 className={styles.panelTitle}>KAITO&rsquo;S STORY</h2>
        <p className={styles.codexSub}>
          {lore.length} of {STORY.length} memories earned — survive more days to hear more.
        </p>
        <div className={styles.codexList}>
          {STORY.map((t, i) => {
            const got = lore.includes(i);
            return (
              <div key={i} className={`${styles.codexCard} ${got ? "" : styles.codexLocked}`}>
                {got ? (
                  <img className={styles.codexPortrait} src={portraitSrc(t.portrait)} alt="" draggable={false} />
                ) : (
                  <div className={styles.codexLockIcon} aria-hidden="true">
                    🔒
                  </div>
                )}
                <div className={styles.codexText}>
                  <div className={styles.codexCardTitle}>{got ? t.title : "A memory not yet shared"}</div>
                  <p>{got ? `“${t.text}”` : `Survive day ${i + 1} to unlock.`}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button className={styles.btnPrimary} onClick={onClose} autoFocus>
          Close
        </button>
      </div>
    </Scrim>
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
  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {shown}
    </div>
  );
}
