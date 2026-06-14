import { useContext, useEffect, useReducer, useRef, useState } from "react";
import styles from "./Shop.module.css";
import { ItemIcon } from "./itemIcons";
import { reduce, createRun, bagSlots } from "./shopEngine";
import { RARITY } from "./shopData";
import { scrollContext } from "../scrollContext";
import { SoundContext } from "../../../Context/SoundContext";
import Sections from "../HomeTableOfContents.jsx";

const SECTION_TITLE = "Shop";
const g = (n) => `${Math.round(n)}g`;
const portraitSrc = (p) => `/Dialog/Pictures/${p}.webp`;

export default function Shop({ isfocus }) {
  isfocus = isfocus === "true";
  const { setScrollable, currentSection, openDialogWithCallback } =
    useContext(scrollContext);
  const { playSFX } = useContext(SoundContext);

  const seedRef = useRef((Date.now() >>> 0) || 1);
  const [state, dispatch] = useReducer(reduce, undefined, () =>
    createRun(seedRef.current)
  );

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
    setScrollable(state.phase === "shop");
  }, [isfocus, state.phase, setScrollable]);

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
          <span className={styles.hudDay}>DAY {state.day}</span>
          <span className={styles.hudGold}>{g(state.gold)}</span>
        </div>
        <div className={styles.hudRight}>
          <span className={styles.hudRent}>
            RENT&nbsp;<b>{g(state.rent)}</b>
          </span>
          <Rapport state={state} />
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
                wanted={state.wants.some((w) => w.category === it.category)}
                onClick={() => {
                  playSFX("MetalClick");
                  dispatch({ type: "START_HAGGLE", side: "sell", uid: it.uid });
                }}
              />
            ) : (
              <div key={`empty-${i}`} className={styles.bagEmpty} />
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
        <RunEnd state={state} dispatch={dispatch} />
      )}

      <Toast toast={state.toast} />
    </div>
  );
}

// ---- HUD bits ----------------------------------------------------------------
function Rapport({ state }) {
  const pct = Math.min(100, (state.rapport / 110) * 100);
  return (
    <div className={styles.rapport} title={`Rapport ${state.rapport}`}>
      <span className={styles.rapportHeart}>♥</span>
      <span className={styles.rapportBar}>
        <span className={styles.rapportFill} style={{ width: `${pct}%` }} />
      </span>
      <span className={styles.rapportTier}>Lv{state.tier}</span>
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

function ShelfItem({ item, appraise, affordable, onClick }) {
  return (
    <button
      className={`${styles.card} ${affordable ? "" : styles.cardLocked}`}
      onClick={onClick}
      disabled={!affordable}
      title={item.flavor}
    >
      <span
        className={styles.rarityPip}
        style={{ background: rarityPip(item.rarity) }}
        role="img"
        aria-label={`${item.rarity} rarity`}
      />
      <ItemIcon id={item.id} className={styles.icon} />
      <span className={styles.cardName}>{item.name}</span>
      <span className={styles.cardPrice}>{g(item.ask)}</span>
      {appraise && <span className={styles.cardWorth}>~{g(item.value)}</span>}
    </button>
  );
}

function BagItem({ item, appraise, wanted, onClick }) {
  return (
    <button
      className={`${styles.card} ${styles.bagCard} ${wanted ? styles.wantedCard : ""}`}
      onClick={onClick}
      title={item.flavor}
      aria-label={`${item.name}${wanted ? " — wanted today, sells at a premium" : ""}`}
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
      {appraise && <span className={styles.cardWorth}>~{g(item.value)}</span>}
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

  return (
    <div className={styles.overlay}>
      <div className={styles.haggle}>
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
              {h.rapportGain >= 2 && (
                <div className={styles.rapportNote}>♥ Kaito warms to you — rapport up</div>
              )}
              <button
                className={styles.btnPrimary}
                onClick={() => dispatch({ type: "CLOSE_HAGGLE" })}
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
                aria-label="Your offer"
              />
              <p className={styles.slideHint}>
                {buy ? "Talk him down — lower is better" : "Push him up — higher is better"}
              </p>

              <div className={styles.haggleBtns}>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    playSFX("ButtonClick");
                    dispatch({ type: "OFFER", price });
                  }}
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

function RunEnd({ state, dispatch }) {
  const win = state.phase === "win";
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
          <Line k="Days survived" v={state.stats.daysSurvived || state.day} />
          <Line k="Coin earned" v={g(state.stats.earned)} />
          <Line k="Best rapport" v={String(state.stats.bestRapport)} />
          <Line k="Deals struck" v={String(state.stats.deals)} />
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => dispatch({ type: "RESTART", seed: (Date.now() >>> 0) || 1 })}
        >
          New run
        </button>
      </div>
    </div>
  );
}

function Line({ k, v, warn }) {
  return (
    <div className={styles.line}>
      <span>{k}</span>
      <span className={warn ? styles.lineWarn : ""}>{v}</span>
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
