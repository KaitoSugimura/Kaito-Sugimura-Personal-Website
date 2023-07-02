import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Home.module.css";
import Sections from "./HomeTableOfContents.jsx";
import Navigation from "../../Components/Navigation";
import { SoundContext } from "../../Context/SoundContext";
import DialogMain from "../../Components/Dialog/DialogMain";
import InitHero from "./Hero/InitHero";
import HorizontalEnjoyer from "../../Tools/HorizontalEnjoyer";

export const scrollContext = createContext();

export default function Home() {
  // Context variables (May be moved to a separate file if needed)
  const isScrollable = useRef(false);

  const [currentSection, setCurrentSection] = useState(0);
  const { playMusic } = useContext(SoundContext);
  const blockScroll = useRef(false);
  const TouchMoveStartY = useRef(0);
  const TouchMoveStartTime = useRef(0);

  // Dialog
  const [currentDialogID, setCurrentDialogID] = useState("Home1");
  const events = useRef({ Profile1: true, Project1: true });

  const [initDone, setInitDone] = useState(false);

  const OpenDialogWithDelay = (DialogID) => {
    setScrollable(false);
    setTimeout(() => {
      setCurrentDialogID(DialogID);
    }, 300);
  };

  const handleEventFinished = () => {
    setCurrentDialogID(null);
    setScrollable(true);
    if (!initDone) {
      setTimeout(() => {
        setInitDone(true);
      }, 5000);
    }
  };

  const setScrollable = (value) => {
    isScrollable.current = value;
  };

  const scrollEventHandler = (sectionNo) => {
    if (events.current.Project1 && Sections[sectionNo].title == "Projects") {
      events.current.Project1 = false;
      OpenDialogWithDelay("Projects1");
    }
    if (events.current.Profile1 && Sections[sectionNo].title == "Profile") {
      events.current.Profile1 = false;
      OpenDialogWithDelay("Profile1");
    }
  };

  useEffect(() => {
    scrollEventHandler(currentSection);
  }, [currentSection]);

  // Scroll
  const scrollTo = (index) => {
    if (isScrollable.current && initDone) {
      setCurrentSection(index);
    }
  };

  useEffect(() => {
    // Most likely not going to play music with this method (deprecated)
    setTimeout(() => {
      playMusic(Sections[currentSection].music);
    }, 300);
  }, [currentSection]);

  useEffect(() => {
    const handleScroll = (event) => {
      if (!blockScroll.current && isScrollable.current && initDone) {
        setCurrentSection((prev) => {
          if (event.deltaY > 0) {
            return Math.min(Math.max(++prev, 0), Sections.length - 1);
          } else {
            return Math.min(Math.max(--prev, 0), Sections.length - 1);
          }
        });
        blockScroll.current = true;
        setTimeout(() => {
          blockScroll.current = false;
        }, 200);
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

      if (
        isScrollable.current &&
        Math.abs(velocityY) > 0.5 &&
        !blockScroll.current &&
        initDone
      ) {
        setCurrentSection((prev) => {
          if (velocityY < 0.5) {
            return Math.min(Math.max(++prev, 0), Sections.length - 1);
          } else if (velocityY > 0.5) {
            return Math.min(Math.max(--prev, 0), Sections.length - 1);
          }
        });
        blockScroll.current = true;
        setTimeout(() => {
          blockScroll.current = false;
        }, 200);
      }
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      TouchMoveStartY.current = touch.pageY;
      TouchMoveStartTime.current = Date.now();
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [initDone]);

  return (
    <scrollContext.Provider value={{ setScrollable }}>
      <div
        className={styles.HomeScroller}
        style={{
          height: `${window.innerHeight}px`,
        }}
      >
        <HorizontalEnjoyer />
        {currentDialogID != null ? (
          <DialogMain
            DialogID={currentDialogID}
            eventFinishedCallback={handleEventFinished}
          />
        ) : (
          <Navigation
            scrollTo={scrollTo}
            currentSectionIndex={currentSection}
            initDone={initDone}
          />
        )}
        <div className={styles.HomeRoot}>
          {Sections.map((section, index) =>
            !initDone && index == 0 ? (
              <InitHero currentDialogID={currentDialogID} key={index} />
            ) : (
              <div
                className={styles.SectionContainer}
                id={section.title}
                key={section.title}
                style={{
                  transform: `translateY(-${currentSection * window.innerHeight}px)`,
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                {section.XML}
              </div>
            )
          )}
        </div>
      </div>
    </scrollContext.Provider>
  );
}
