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

  const [currentSection, setCurrentSection] = useState(0);
  // const { playMusic } = useContext(SoundContext);
  const TouchMoveStartY = useRef(0);
  const TouchMoveStartTime = useRef(0);

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

  // useEffect(() => {
  //   // Most likely not going to play music with this method (deprecated)
  //   setTimeout(() => {
  //     playMusic(Sections[currentSection].music);
  //   }, 300);
  // }, [currentSection]);

  useEffect(() => {
    const handleScroll = (event) => {
      if (isScrollable.current && initDone) {
        setCurrentSection((prev) => {
          if (event.deltaY > 0) {
            return Math.min(Math.max(++prev, 0), Sections.length - 1);
          } else {
            return Math.min(Math.max(--prev, 0), Sections.length - 1);
          }
        });
        isScrollable.current = false;
        setTimeout(() => {
          isScrollable.current = true;
        }, 300);
      }
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      const currentY = touch.pageY;
      const currentTime = Date.now();

      const deltaY = currentY - TouchMoveStartY.current;
      const deltaTime = currentTime - TouchMoveStartTime.current;

      const velocityY = deltaY / deltaTime;

      TouchMoveStartY.current = touch.pageY;
      TouchMoveStartTime.current = currentTime;

      if (isScrollable.current && Math.abs(velocityY) > 0.5 && initDone) {
        setCurrentSection((prev) => {
          if (velocityY < 0.5) {
            return Math.min(Math.max(++prev, 0), Sections.length - 1);
          } else if (velocityY > 0.5) {
            return Math.min(Math.max(--prev, 0), Sections.length - 1);
          }
        });
        isScrollable.current = false;
        setTimeout(() => {
          isScrollable.current = true;
        }, 300);
      }
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      TouchMoveStartY.current = touch.pageY;
      TouchMoveStartTime.current = Date.now();
    };

    // window.addEventListener("wheel", handleScroll);
    // window.addEventListener("touchmove", handleTouchMove, { passive: false });
    // window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [initDone]);

  return (
    <scrollContext.Provider value={{ setScrollable, currentSection }}>
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
        />

        <div
          className={styles.HomeRoot}
          style={{
            transform: `translateY(-${currentSection * window.innerHeight}px)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {Sections.map((section, index) => (
            <React.Fragment key={section.title}>
              {!initDone && index == 0 ? (
                <InitHero />
              ) : (
                React.cloneElement(section.XML, {isFocus: index == currentSection})
              )}
            </React.Fragment>
          ))}
          {/* {!initDone ? <InitHero /> : Sections[currentSection].XML} */}
        </div>
      </div>
    </scrollContext.Provider>
  );
}
