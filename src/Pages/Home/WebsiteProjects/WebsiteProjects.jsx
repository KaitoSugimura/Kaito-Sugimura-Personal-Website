import styles from "./WebsiteProjects.module.css";
import Contents from "./WebsiteContents";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import SelectedView from "./Window/SelectedView";
import FrameOverlay from "./Window/FrameOverlay";
import { SoundContext } from "../../../Context/SoundContext";
import { scrollContext } from "../Home";

export default function WebsiteProjects() {
  const { playSFX } = useContext(SoundContext);
  const { setScrollable } = useContext(scrollContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialIndexRef = useRef(0);
  const MouseXInitialRef = useRef(0);
  const isDragging = useRef(false);
  const mouseIsDown = useRef(false);
  const deviceIsTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  // Do not use setter her, please use toggleSelectedView
  const [selectedView, setSelectedView] = useState(false);
  const canToggleSelectedView = useRef(true);

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
    [currentIndex]
  );

  const toggleSelectedView = useCallback(() => {
    if (canToggleSelectedView.current) {
      canToggleSelectedView.current = false;
      setSelectedView((prev) => {
        if (!prev) playSFX("MetalClick");
        else playSFX("BackClick");
        return !prev;
      });
      // setTimeout(() => {
      //   canToggleSelectedView.current = true;
      // }, 200);
      canToggleSelectedView.current = true;
    }
  }, []);

  const handleMouseMove = useCallback((event) => {
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
      if (Math.floor(prev) != Math.floor(newIndex) && isDragging.current) {
        playSFX("ButtonClick");
      }
      return newIndex;
    });
  }, []);

  const handleMouseUp = useCallback((event) => {
    setScrollable(true);
    document.removeEventListener(
      deviceIsTouch ? "touchmove" : "mousemove",
      handleMouseMove
    );
    document.removeEventListener(
      deviceIsTouch ? "touchend" : "mouseup",
      handleMouseUp
    );

    mouseIsDown.current = false;
    setCurrentIndex((prev) => {
      return Math.round(prev) % Contents.length;
    });
  }, []);

  const handleMouseDown = useCallback(
    (event) => {
      isDragging.current = false;
      if (!canToggleSelectedView.current) return;
      if (selectedView) return;
      mouseIsDown.current = true;

      const { clientX } = (event.touches && event.touches[0]) || event;
      MouseXInitialRef.current = clientX;
      initialIndexRef.current = currentIndex;

      document.addEventListener(
        deviceIsTouch ? "touchend" : "mouseup",
        handleMouseUp
      );
      document.addEventListener(
        deviceIsTouch ? "touchmove" : "mousemove",
        handleMouseMove
      );
    },
    [selectedView, currentIndex]
  );

  // const getSelectedWidth = useCallback(
  //   (index) => {
  //     return sectionRatio.width * 0.5;
  //     return (mouseIsDown.current && isDragging.current) ||
  //       selectedView ||
  //       getAbsPosIndex(index) > 0.5
  //       ? sectionRatio.width * 0.5
  //       : sectionRatio.width / 1.35;
  //   },
  //   [sectionRatio, selectedView, currentIndex]
  // );

  // const getSelectedHeight = useCallback(
  //   (index) => {
  //     return sectionRatio.height * 0.5;
  //     return (mouseIsDown.current && isDragging.current) ||
  //       selectedView ||
  //       getAbsPosIndex(index) > 0.5
  //       ? sectionRatio.height * 0.5
  //       : sectionRatio.height / 1.35;
  //   },
  //   [sectionRatio, selectedView, currentIndex]
  // );

  return (
    <SectionContainer image={"/Backgrounds/DarkFlames.jpg"}>
      <div className={styles.WebsiteProjectsRoot}>
        <div
          className={`${styles.WebsiteFrameContainer} ${
            selectedView ? "NoUserSelect" : ""
          }`}
          onMouseDown={deviceIsTouch ? null : handleMouseDown}
          onTouchStart={deviceIsTouch ? handleMouseDown : null}
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
                  // WebkitTransform: "translateZ(0)",
                  // WebkitBackfaceVisibility: "hidden",
                  zIndex: `${Math.round(-(getAbsPosIndex(index) * 10))}`,
                  transition: mouseIsDown.current
                    ? "width 0.3s ease-in-out, opacity 0.3s ease-in-out, height 0.3s ease-in-out"
                    : `z-index 0.3s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out`,
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
                  {/* <FrameOverlay
                    index={index}
                    content={content}
                    currentABSPos={getAbsPosIndex(index)}
                    selectedView={selectedView}
                    mouseDownAndDragging={
                      mouseIsDown.current && isDragging.current
                    }
                  /> */}
                  <div
                    className={`${styles.clickWrapper} ${
                      selectedView && getPosIndex(index) != 0
                        ? "NoUserSelect"
                        : ""
                    }`}
                    style={{
                      width: `${
                        (selectedView && getPosIndex(index) == 0) ||
                        getPosIndex(index) == 0
                          ? 100
                          : 85
                      }%`,
                      height: `${
                        (selectedView && getPosIndex(index) == 0) ||
                        getPosIndex(index) == 0
                          ? 100
                          : 85
                      }%`,
                      // left: selectedView ? "0%" : "7.5%",
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

                        <div className={styles.FrameOverlay}>
                          {!(mouseIsDown.current && isDragging.current) &&
                            0 == getAbsPosIndex(index) && (
                              <div className={styles.leftBottom}>
                                <h1 className={styles.title}>
                                  {content.title}
                                </h1>
                                <p className={styles.desc}>{content.desc}</p>
                              </div>
                            )}

                          <div className={styles.frameLogoCenterer}>
                            <img
                              className={styles.frameLogo}
                              src={`/Home/WebsiteProjects/Logos/${content.logoPath}`}
                              onDragStart={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <img
                      className={styles.frameImage}
                      src={content.imageMain}
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
      <button
        className={styles.SelectButton}
        onClick={() => {
          toggleSelectedView();
          playSFX("DialogClick");
        }}
      >
        <p>{selectedView ? "Close View" : "View Selected"}</p>
        <span className={styles.leftTriangle}></span>
        <span className={styles.rightTriangle}></span>
      </button>
    </SectionContainer>
  );
}
