import styles from "./WebsiteProjects.module.css";
import Contents from "./WebsiteContents";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import SelectedView from "./Window/SelectedView";
import { SoundContext } from "../../../Context/SoundContext";
import { scrollContext } from "../scrollContext";
import Sections from "../HomeTableOfContents.jsx";
import { activateOnKey } from "../../../a11y";

export default function WebsiteProjects() {
  const { playSFX } = useContext(SoundContext);
  const { setScrollable, currentSection, openDialogWithCallback } =
    useContext(scrollContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialIndexRef = useRef(0);
  const MouseXInitialRef = useRef(0);
  const isDragging = useRef(false);
  const mouseIsDown = useRef(false);
  const currentEventTouch = useRef(false);
  // Do not use this setter directly, please use toggleSelectedView
  const [selectedView, setSelectedView] = useState(false);

  //RATIO CALCULATION
  const sectionDefaultWidth = 70; // Specify width
  const getSectionRatio = () => {
    // Ratio is 16:9
    let width = sectionDefaultWidth;
    let height = sectionDefaultWidth * 0.5625;
    const ratio = window.innerHeight / window.innerWidth;
    if (ratio < 0.5625) {
      width = width * (ratio / 0.5625);
      height = width * 0.5625;
    }
    return { width: width, height: height };
  };
  const [sectionRatio, setSectionRatio] = useState(getSectionRatio());

  const [DialogEvents, setDialogEvents] = useState({ initDialog: true });
  const initDialogOpened = useRef(false);
  useEffect(() => {
    if (
      !initDialogOpened.current &&
      DialogEvents.initDialog &&
      Sections[currentSection].title == "Projects"
    ) {
      initDialogOpened.current = true;
      openDialogWithCallback("Projects1", () => {
        setDialogEvents({ initDialog: false });
      });
    }
  }, [currentSection, DialogEvents.initDialog, openDialogWithCallback]);

  useEffect(() => {
    function handleResize() {
      setSectionRatio(getSectionRatio());
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //RATIO CALCULATION END

  const getPosIndex = useCallback(
    (index) => {
      let dif = index - currentIndex;
      const div2 = Contents.length * 0.5;
      if (dif > div2) {
        dif -= Contents.length;
      } else if (dif < -div2) {
        dif += Contents.length;
      }
      return +dif;
    },
    [currentIndex]
  );

  const getAbsPosIndex = useCallback(
    (index) => {
      return Math.abs(getPosIndex(index));
    },
    [getPosIndex]
  );

  const toggleSelectedView = useCallback(() => {
    setSelectedView((prev) => {
      if (!prev) playSFX("MetalClick");
      else playSFX("BackClick");
      return !prev;
    });
  }, [playSFX]);

  const handleMouseMove = useCallback(
    (event) => {
      const { clientX } = (event.touches && event.touches[0]) || event;
      const diff = clientX - MouseXInitialRef.current;
      if (Math.abs(diff) > 25) {
        isDragging.current = true;
        setScrollable(false);
      }

      let newIndex =
        (initialIndexRef.current - (diff / window.innerWidth) * 5) %
        Contents.length;
      if (newIndex < 0) {
        newIndex = Contents.length + newIndex;
      }
      setCurrentIndex((prev) => {
        if (Math.floor(prev) !== Math.floor(newIndex) && isDragging.current) {
          playSFX("ButtonClick");
        }
        return newIndex;
      });
    },
    [playSFX, setScrollable]
  );

  const handleMouseUp = useCallback(() => {
    setScrollable(true);
    document.removeEventListener(
      currentEventTouch.current ? "touchmove" : "mousemove",
      handleMouseMove
    );
    document.removeEventListener(
      currentEventTouch.current ? "touchend" : "mouseup",
      handleMouseUp
    );

    mouseIsDown.current = false;
    setCurrentIndex((prev) => {
      return Math.round(prev) % Contents.length;
    });
  }, [handleMouseMove, setScrollable]);

  const handleMouseDown = useCallback(
    (event) => {
      isDragging.current = false;
      if (selectedView) return;
      mouseIsDown.current = true;

      const { clientX } = (event.touches && event.touches[0]) || event;
      MouseXInitialRef.current = clientX;
      initialIndexRef.current = currentIndex;

      document.addEventListener(
        currentEventTouch.current ? "touchend" : "mouseup",
        handleMouseUp
      );
      document.addEventListener(
        currentEventTouch.current ? "touchmove" : "mousemove",
        handleMouseMove
      );
    },
    [selectedView, currentIndex, handleMouseUp, handleMouseMove]
  );

  return (
    <SectionContainer image={"/Backgrounds/City.jpg"}>
      <div className={styles.WebsiteProjectsRoot}>
        <div
          className={`${styles.WebsiteFrameContainer} ${
            selectedView ? `NoUserSelect ${styles.selectedView}` : ""
          }`}
          onMouseDown={(event) => {
            currentEventTouch.current = false;
            handleMouseDown(event);
          }}
          onTouchStart={(event) => {
            currentEventTouch.current = true;
            handleMouseDown(event);
          }}
          onDragStart={(e) => {
            e.preventDefault();
          }}
        >
          {selectedView && (
            <SelectedView
              index={parseInt(currentIndex)}
              sectionRatio={sectionRatio}
            />
          )}

          <div className={styles.WebsiteOuterFrame}>
            {Contents.map((content, index) => (
              <div
                key={index}
                className={styles.FrameContainer}
                style={{
                  opacity: selectedView && getPosIndex(index) !== 0 ? 0 : 1,
                  zIndex: `${Math.round(-(getAbsPosIndex(index) * 10))}`,
                  transition: mouseIsDown.current
                    ? "width 0.3s ease-in-out, height 0.3s ease-in-out"
                    : `z-index 0.3s ease-in-out, transform 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out`,
                  transform:
                    selectedView && getPosIndex(index) == 0
                      ? `translate(calc(-50% - ${
                          sectionRatio.width / 2.25
                        }vw), -50%)`
                      : "translate(-50%, -50%)",
                  width: `${sectionRatio.width * 0.5}vw`,
                  height: `${sectionRatio.height * 0.5}vw`,
                }}
              >
                <div
                  className={`${styles.FrameInner}`}
                  style={{
                    transform: `translate3d(${
                      getPosIndex(index) * 100
                    }%, 0, ${-(
                      getAbsPosIndex(index) *
                      window.innerWidth *
                      0.2
                    )}px)
                     rotateX(0deg) rotateY(${-getPosIndex(index) * 25}deg) 
                    `,
                    transition: mouseIsDown.current
                      ? "none"
                      : `transform 0.3s ease-in-out`,
                  }}
                >
                  <div
                    className={`${styles.clickWrapper} ${
                      selectedView && getPosIndex(index) != 0
                        ? "NoUserSelect"
                        : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={content.title}
                    style={{
                      transform: `scale(${
                        getPosIndex(index) == 0
                          ? selectedView
                            ? 1
                            : 1.25
                          : 0.85
                      })`,
                      filter: `brightness(${
                        1 - Math.min(getAbsPosIndex(index), 0.8) * 0.3
                      })`,
                      transition: mouseIsDown.current
                        ? "transform 0.3s ease-in-out"
                        : `transform 0.3s ease-in-out, filter 0.3s ease-in-out`,
                    }}
                    onClick={() => {
                      if (!isDragging.current) {
                        if (parseInt(currentIndex) == index) {
                          toggleSelectedView();
                        } else if (!selectedView) {
                          setCurrentIndex(index);
                          playSFX("ButtonClick");
                        }
                      }
                    }}
                    onKeyDown={activateOnKey(() => {
                      if (parseInt(currentIndex) == index) {
                        toggleSelectedView();
                      } else if (!selectedView) {
                        setCurrentIndex(index);
                        playSFX("ButtonClick");
                      }
                    })}
                  >
                    {!selectedView && (
                      <>
                        {index == 0 && (
                          <div className={styles.RibbonOverlay}>
                            <div className={styles.Ribbon}>
                              <p className={styles.Newest}>Newest</p>
                            </div>
                          </div>
                        )}
                        {index == Contents.length - 1 && (
                          <div className={styles.RibbonOverlay}>
                            <div className={styles.Ribbon}>
                              <p className={styles.Oldest}>Oldest</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <img
                      className={styles.frameImage}
                      src={content.imageMain}
                      alt={content.title}
                      onDragStart={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!selectedView && Contents[currentIndex] && !DialogEvents.initDialog && (
        <div className={styles.FrameOverlay}>
          <h1 className={styles.BackTitle}>{Contents[currentIndex].title}</h1>
          <div className={styles.leftBottom}>
            <h1 className={styles.title}>{Contents[currentIndex].title}</h1>
            <p className={styles.desc}>{Contents[currentIndex].desc}</p>
          </div>

          <div className={styles.frameLogoCenterer}>
            <img
              className={styles.frameLogo}
              src={`/Home/WebsiteProjects/Logos/${Contents[currentIndex].logoPath}`}
              alt=""
              onDragStart={(e) => {
                e.preventDefault();
              }}
            />
          </div>
        </div>
      )}

      <button
        className={styles.SelectButton}
        onClick={() => {
          toggleSelectedView();
        }}
      >
        <p>{selectedView ? "Close View" : "View Selected"}</p>
        <span className={styles.leftTriangle}></span>
        <span className={styles.rightTriangle}></span>
      </button>
    </SectionContainer>
  );
}
