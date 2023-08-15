import React, { createContext, useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import Sections from "./HomeTableOfContents.jsx";
import InitHero from "./Hero/InitHero";
import HorizontalEnjoyer from "../../Tools/HorizontalEnjoyer";
import Overlay from "./Overlays/Overlay";

export const scrollContext = createContext();

export default function Home() {
  // Context variables (May be moved to a separate file if needed)
  const isScrollable = useRef(false);
  const scrollTimerOn = useRef(false);
  const dialogRef = useRef(null);

  const [currentSection, setCurrentSection] = useState(0);
  // const { playMusic } = useContext(SoundContext);
  const TouchMoveStartY = useRef(0);

  const [initDone, setInitDone] = useState(false);

  // Scroll
  const scrollTo = (index) => {
    if (isScrollable.current && initDone) {
      setCurrentSection(index);
    }
  };

  const setScrollable = (value) => {
    isScrollable.current = value;
  };

  const openDialogWithCallback = (id, callback) => {
    dialogRef.current.openDialogWithCallback(id, callback);
  }

  // useEffect(() => {
  //   // Most likely not going to play music with this method (deprecated)
  //   setTimeout(() => {
  //     playMusic(Sections[currentSection].music);
  //   }, 300);
  // }, [currentSection]);

  useEffect(() => {
    const startScrollTimer = () => {
      scrollTimerOn.current = true;
      setTimeout(() => {
        scrollTimerOn.current = false;
      }, 300);
    };

    const handleScroll = (event) => {
      if (isScrollable.current && !scrollTimerOn.current && initDone) {
        setCurrentSection((prev) => {
          if (event.deltaY > 0) {
            return Math.min(Math.max(++prev, 0), Sections.length - 1);
          } else {
            return Math.min(Math.max(--prev, 0), Sections.length - 1);
          }
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
          if (deltaY < 0) {
            return Math.min(Math.max(++prev, 0), Sections.length - 1);
          } else {
            return Math.min(Math.max(--prev, 0), Sections.length - 1);
          }
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

  return (
    <scrollContext.Provider value={{ setScrollable, currentSection, openDialogWithCallback }}>
      <div
        className={styles.HomeScroller}
        style={{
          height: `${window.innerHeight}px`,
        }}
      >
        {/* <HorizontalEnjoyer /> */}

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
            transform: `translateY(-${currentSection * window.innerHeight}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {Sections.map((section, index) => (
            <React.Fragment key={section.title}>
              {!initDone && index == 0 ? (
                <InitHero />
              ) : (
                React.cloneElement(section.XML, {
                  isfocus: (index == currentSection).toString(),
                })
              )}
            </React.Fragment>
          ))}
          {/* {!initDone ? <InitHero /> : Sections[currentSection].XML} */}
        </div>
      </div>
    </scrollContext.Provider>
  );
}
