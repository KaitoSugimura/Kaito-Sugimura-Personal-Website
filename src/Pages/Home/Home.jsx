import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Home.module.css";
import Sections from "./HomeTableOfContents.jsx";
import InitHero from "./Hero/InitHero";
import HorizontalEnjoyer from "../../Tools/HorizontalEnjoyer";
import Overlay from "./Overlays/Overlay";
import ErrorBoundary from "../../Components/ErrorBoundary";
import { scrollContext } from "./scrollContext";
import {
  TERMINAL_REVEAL_DELAY_MS,
  SECTION_SCROLL_COOLDOWN_MS,
} from "../../timings";

export default function Home() {
  // Context variables (May be moved to a separate file if needed)
  const isScrollable = useRef(false);
  const scrollTimerOn = useRef(false);
  const dialogRef = useRef(null);
  const homeRootRef = useRef(null);

  const [currentSection, setCurrentSection] = useState(0);
  const TouchMoveStartY = useRef(0);

  const [initDone, setInitDone] = useState(false);

  // The Shop is a full-screen game; its section collapses the site chrome (HUD
  // brackets, title, page indicator, socials, nav, sound) so it doesn't clutter
  // or paint over the game. A reveal toggle inside the Shop flips this back on.
  // Chrome re-hides automatically every time the player (re)enters the Shop.
  const isShop = Sections[currentSection]?.title === "Shop";
  const [chromeHidden, setChromeHidden] = useState(true);
  useEffect(() => {
    if (isShop) setChromeHidden(true);
  }, [isShop]);

  // Swap InitHero for the real terminal a beat after initDone, so the HUD title
  // gets to play its typewriter/caret animation before the terminal appears.
  const [terminalReady, setTerminalReady] = useState(false);
  useEffect(() => {
    if (!initDone) return;
    const timer = setTimeout(() => setTerminalReady(true), TERMINAL_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [initDone]);

  // Prompt the user to rotate when the viewport is taller than it is wide.
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerWidth <= window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Keep off-screen sections out of the tab order and unclickable. They sit in
  // the DOM (translated away), so without `inert` a keyboard user could Tab into
  // a section that isn't on screen, and stray clicks could hit hidden controls.
  useEffect(() => {
    const root = homeRootRef.current;
    if (!root) return;
    Array.from(root.children).forEach((child, i) => {
      child.inert = i !== currentSection;
    });
    // terminalReady is included so the effect re-runs when section 0 swaps from
    // InitHero to the real Hero (fresh DOM node, inert resets to false).
  }, [currentSection, terminalReady]);

  // Scroll
  const scrollTo = useCallback(
    (index) => {
      if (isScrollable.current && initDone) {
        setCurrentSection(index);
      }
    },
    [initDone]
  );

  const setScrollable = useCallback((value) => {
    isScrollable.current = value;
  }, []);

  // Programmatic, unguarded section navigation (unlike scrollTo, which only fires
  // when free-scrolling is enabled). Used by in-section CTAs — e.g. the Shop's
  // win-screen "see Kaito's projects" button — that must work even while a Shop
  // modal has page-snap locked.
  const goToSection = useCallback((index) => {
    setCurrentSection(Math.min(Math.max(index, 0), Sections.length - 1));
  }, []);

  const openDialogWithCallback = useCallback((id, callback) => {
    dialogRef.current.openDialogWithCallback(id, callback);
  }, []);

  useEffect(() => {
    const startScrollTimer = () => {
      scrollTimerOn.current = true;
      setTimeout(() => {
        scrollTimerOn.current = false;
      }, SECTION_SCROLL_COOLDOWN_MS);
    };

    const handleScroll = (event) => {
      if (isScrollable.current && !scrollTimerOn.current && initDone) {
        setCurrentSection((prev) => {
          const next = event.deltaY > 0 ? prev + 1 : prev - 1;
          return Math.min(Math.max(next, 0), Sections.length - 1);
        });
        startScrollTimer();
      }
    };

    const handleTouchMove = (event) => {
      // Only hijack touch scrolling while page-snap is active. When it's locked
      // off (a modal is open, or pre-init), let the browser scroll normally so
      // content inside an overlay — the Shop's Codex/Help panels — can scroll on
      // touch devices instead of being frozen by a blanket preventDefault.
      if (!isScrollable.current) return;
      event.preventDefault();
      const touch = event.touches[0];
      const currentY = touch.pageY;

      const deltaY = currentY - TouchMoveStartY.current;

      if (
        isScrollable.current &&
        !scrollTimerOn.current &&
        Math.abs(deltaY) > window.innerHeight * 0.2 &&
        initDone
      ) {
        setCurrentSection((prev) => {
          const next = deltaY < 0 ? prev + 1 : prev - 1;
          return Math.min(Math.max(next, 0), Sections.length - 1);
        });
        startScrollTimer();
      }
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      TouchMoveStartY.current = touch.pageY;
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [initDone]);

  const contextValue = useMemo(
    () => ({
      setScrollable,
      goToSection,
      currentSection,
      openDialogWithCallback,
      chromeHidden,
      setChromeHidden,
    }),
    [setScrollable, goToSection, currentSection, openDialogWithCallback, chromeHidden]
  );

  return (
    <scrollContext.Provider value={contextValue}>
      <div className={styles.HomeScroller} style={{ height: "100dvh" }}>
        {isPortrait && <HorizontalEnjoyer />}

        <Overlay
          scrollTo={scrollTo}
          currentSection={currentSection}
          initDone={initDone}
          setScrollable={setScrollable}
          setInitDone={setInitDone}
          chromeHidden={chromeHidden}
          ref={dialogRef}
        />

        <div
          ref={homeRootRef}
          className={styles.HomeRoot}
          style={{
            transform: `translateY(calc(${currentSection} * -100dvh))`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {Sections.map((section, index) => (
            // Each section gets its own boundary so a crash in one (e.g. the
            // interactive Shop) can't white-screen the whole site. ErrorBoundary
            // renders its child with no wrapper element, so the snap-scroll inert
            // logic (one DOM node per section) is unaffected.
            <ErrorBoundary key={section.title}>
              {!terminalReady && index == 0 ? (
                <InitHero />
              ) : (
                React.cloneElement(section.XML, {
                  isfocus: (index == currentSection).toString(),
                })
              )}
            </ErrorBoundary>
          ))}
        </div>
      </div>
    </scrollContext.Provider>
  );
}
