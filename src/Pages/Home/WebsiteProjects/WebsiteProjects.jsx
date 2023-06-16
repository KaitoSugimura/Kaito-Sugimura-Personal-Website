import styles from "./WebsiteProjects.module.css";
import Contents from "./WebsiteContents";
import { useContext, useEffect, useRef, useState } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import SelectedView from "./Window/SelectedView";
import FrameOverlay from "./Window/FrameOverlay";
import { SoundContext } from "../../../Context/SoundContext";

export default function WebsiteProjects() {
  const { playButtonClick, playDialogClick } = useContext(SoundContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialIndexRef = useRef(0);
  const MouseXInitialRef = useRef(0);
  const isDragging = useRef(false);
  const mouseIsDown = useRef(false);
  const deviceIsTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  const cachedIndex = useRef(-1);
  const cachedDif = useRef(0);
  // Do not use setter her, please use toggleSelectedView
  const [selectedView, setSelectedView] = useState(false);
  const canToggleSelectedView = useRef(true);

  //RATIO CALCULATION
  const sectionDefaultWidth = 70; // Specify width
  const [sectionRatio, setSectionRatio] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      // Ratio is 16:9
      let width = sectionDefaultWidth;
      let height = sectionDefaultWidth * 0.5625;
      const ratio = window.innerHeight / window.innerWidth;
      if (ratio < 0.5625) {
        width = width * (ratio / 0.5625);
        height = width * 0.5625;
      }
      setSectionRatio({ width: width, height: height });
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //RATIO CALCULATION END

  const getPosIndex = (index) => {
    if (cachedIndex.current === index) {
      return cachedDif.current;
    }
    let dif = index - currentIndex;
    const div2 = Contents.length / 2;
    if (dif > div2) {
      dif -= Contents.length;
    } else if (dif < -div2) {
      dif += Contents.length;
    }
    cachedIndex.current = index;
    cachedDif.current = +dif;
    return +dif;
  };

  const getAbsPosIndex = (index) => {
    return Math.abs(getPosIndex(index));
  };

  const toggleSelectedView = () => {
    if (canToggleSelectedView.current) {
      canToggleSelectedView.current = false;
      setSelectedView((prev) => {
        return !prev;
      });
      setTimeout(() => {
        canToggleSelectedView.current = true;
      }, 200);
    }
  };

  const handleMouseMove = useRef((event) => {
    const { clientX } = (event.touches && event.touches[0]) || event;
    const diff = clientX - MouseXInitialRef.current;
    if (Math.abs(diff) > 25) {
      isDragging.current = true;
    }
    let newIndex =
      (initialIndexRef.current - (diff / window.innerWidth) * 5) %
      Contents.length;
    if (newIndex < 0) {
      newIndex = Contents.length + newIndex;
    }
    setCurrentIndex((prev) => {
      if (Math.floor(prev) != Math.floor(newIndex)) {
        playButtonClick();
        console.log(prev, newIndex, Math.floor(prev), Math.floor(newIndex))
      }
      return newIndex;
    });
    // setCurrentIndex(newIndex);
  });

  const handleMouseUp = (event) => {
    document.removeEventListener(
      deviceIsTouch ? "touchmove" : "mousemove",
      handleMouseMove.current
    );
    document.removeEventListener(
      deviceIsTouch ? "touchend" : "mouseup",
      handleMouseUp
    );

    mouseIsDown.current = false;
    setCurrentIndex((prev) => {
      return Math.round(prev) % Contents.length;
    });
  };

  const handleMouseDown = (event) => {
    isDragging.current = false;
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
      handleMouseMove.current
    );
  };

  const getSelectedWidth = (index) => {
    return mouseIsDown.current || selectedView || getAbsPosIndex(index) > 0.1
      ? sectionRatio.width / 2
      : sectionRatio.width / 1.35;
  };

  const getSelectedHeight = (index) => {
    return mouseIsDown.current || selectedView || getAbsPosIndex(index) > 0.1
      ? sectionRatio.height / 2
      : sectionRatio.height / 1.35;
  };

  return (
    <SectionContainer image={"/Backgrounds/DarkFlames.png"}>
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
          <div className={styles.WebsiteOuterFrame}>
            {Contents.map((content, index) => (
              <div key={index}>
                {getPosIndex(index) == 0 && selectedView && (
                  <SelectedView index={index} sectionRatio={sectionRatio} />
                )}
                {getAbsPosIndex(index) <= 4 &&
                  (selectedView ? getPosIndex(index) == 0 : true) && (
                    <div
                      className={styles.FrameContainer}
                      style={{
                        zIndex: Math.round(-(getAbsPosIndex(index) * 10)),
                        transition: mouseIsDown.current
                          ? "width 0.3s ease-in-out, height 0.3s ease-in-out"
                          : `z-index 0.3s ease-in-out, transform 0.3s ease-in-out, opacity 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out`,
                        transform: selectedView
                          ? `translate(calc(-50% - ${
                              sectionRatio.width / 2.25
                            }vw), -50%)`
                          : "translate(-50%, -50%)",
                        // opacity:
                        //   selectedView && getAbsPosIndex(index) > 0 ? "0" : "1",
                        width: `${getSelectedWidth(index)}vw`,
                        height: `${getSelectedHeight(index)}vw`,
                      }}
                      key={index}
                    >
                      <div
                        className={`${styles.FrameInner}`}
                        style={{
                          transform: `translate3d(${
                            getPosIndex(index) * 100
                          }%, 0, ${-(
                            getAbsPosIndex(index) * 400
                          )}px) rotateX(0deg) rotateY(${
                            -getPosIndex(index) * 25
                          }deg) `,
                          transition: mouseIsDown.current
                            ? "none"
                            : `transform 0.3s ease-in-out`,
                          filter: `brightness(${
                            1 -
                            Math.max(0, Math.min(getAbsPosIndex(index), 0.4))
                          })`,
                        }}
                      >
                        <FrameOverlay
                          index={index}
                          content={content}
                          lastIndex={Contents.length - 1}
                          currentIndex={currentIndex}
                          selectedView={selectedView}
                        />
                        <div
                          className={styles.clickWrapper}
                          style={{
                            width: `${selectedView ? 100 : 85}%`,
                            height: `${selectedView ? 100 : 85}%`,
                            left: selectedView ? "0%" : "7.5%",
                          }}
                          onClick={() => {
                            if (!isDragging.current) {
                              playButtonClick();
                              if (currentIndex == index) {
                                toggleSelectedView();
                              }
                              if (!selectedView) {
                                setCurrentIndex(index);
                              }
                            }
                    
                          }}
                        >
                          {!selectedView && (
                            <>
                              {index == 0 && (
                                <div className={styles.Ribbon}>
                                  <p className={styles.Newest}>Newest</p>
                                </div>
                              )}
                              {index == Contents.length - 1 && (
                                <div className={styles.Ribbon}>
                                  <p className={styles.Oldest}>Oldest</p>
                                </div>
                              )}
                            </>
                          )}
                          <img
                            className={styles.frameImage}
                            src={`/Home/WebsiteProjects/${content.imageFileName}`}
                            onDragStart={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.SelectContainer}>
          <button
            className={styles.SelectButton}
            onClick={() => {
              toggleSelectedView();
              playDialogClick();
            }}
          >
            <p>{selectedView ? "Close View" : "View Selected"}</p>
            <span className={styles.leftTriangle}></span>
            <span className={styles.rightTriangle}></span>
          </button>
        </div>
      </div>
    </SectionContainer>
  );
}
