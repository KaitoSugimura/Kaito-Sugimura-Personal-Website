import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Home.module.css";
import Sections from "./HomeTableOfContents.jsx";
import InitHero from "./Hero/InitHero";
import HorizontalEnjoyer from "../../Tools/HorizontalEnjoyer";
import Overlay from "./Overlays/Overlay";
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

  const [currentSection, setCurrentSection] = useState(0);
  const TouchMoveStartY = useRef(0);

  const [initDone, setInitDone] = useState(false);

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
    () => ({ setScrollable, currentSection, openDialogWithCallback }),
    [setScrollable, currentSection, openDialogWithCallback]
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
          ref={dialogRef}
        />

        <div
          className={styles.HomeRoot}
          style={{
            transform: `translateY(calc(${currentSection} * -100dvh))`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {Sections.map((section, index) => (
            <React.Fragment key={section.title}>
              {!terminalReady && index == 0 ? (
                <InitHero />
              ) : (
                React.cloneElement(section.XML, {
                  isfocus: (index == currentSection).toString(),
                })
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </scrollContext.Provider>
  );
}
