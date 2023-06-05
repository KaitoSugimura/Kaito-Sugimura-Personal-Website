import styles from "./WebsiteProjects.module.css";
import Contents from "./WebsiteContents";
import { useEffect, useRef, useState } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import CornerBorder from "../../../Components/NavComponents/CornerBorder";
import SelectedView from "./SelectedView";

export default function WebsiteProjects() {
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
    if (Math.abs(diff) > 100) {
      isDragging.current = true;
    }
    let newIndex =
      (initialIndexRef.current - (diff / window.innerWidth) * 5) %
      Contents.length;
    if (newIndex < 0) {
      newIndex = Contents.length + newIndex;
    }
    setCurrentIndex(newIndex);
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
      return Math.round(prev);
    });
  };

  const handleMouseDown = (event) => {
    if (selectedView) return;
    mouseIsDown.current = true;
    isDragging.current = false;
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

  return (
    <SectionContainer image={"/Backgrounds/Desk.png"}>
      <div className={styles.WebsiteProjectsRoot}>
        <div
          className={`${styles.WebsiteFrameContainer} ${
            selectedView ? "NoUserSelect" : ""
          }`}
          onMouseDown={deviceIsTouch ? null : handleMouseDown}
          onTouchStart={deviceIsTouch ? handleMouseDown : null}
          onDrag={() => {
            handleMouseUp();
          }}
        >
          <div className={styles.WebsiteOuterFrame}>
            {Contents.map((content, index) => (
              <>
                {getPosIndex(index) == 0 && selectedView && (
                  <SelectedView index={index} />
                )}
                {getAbsPosIndex(index) <= 4 && (
                  <div
                    className={`${styles.FrameContainer}  ${
                      getPosIndex(index) == 0 ? "forceUserSelect" : ""
                    }`}
                    style={{
                      zIndex: Math.round(-(getAbsPosIndex(index) * 10)),
                      transition: mouseIsDown.current
                        ? "none"
                        : `z-index 0.3s ease-in-out, transform 0.3s ease-in-out, opacity 0.3s ease-in-out`,
                      transform: selectedView
                        ? "translateX(calc(-50% + -26vw))"
                        : "translateX(-50%)",
                      opacity:
                        selectedView && getAbsPosIndex(index) > 0 ? "0" : "1",
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
                        }deg)`,
                        transition: mouseIsDown.current
                          ? "none"
                          : `transform 0.3s ease-in-out`,
                        filter: `brightness(${
                          1 - Math.max(0, Math.min(getAbsPosIndex(index), 0.5))
                        })`,
                      }}
                      onClick={() => {
                        if (!isDragging.current) {
                          if (currentIndex == index) {
                            toggleSelectedView();
                          }
                          if (!selectedView) {
                            setCurrentIndex(index);
                          }
                        }
                      }}
                    >
                      <div>
                        {/* Put inside div because this stupid thing wont stop dragging */}
                        <img
                          draggable={false}
                          src={`/Home/WebsiteProjects/${content.imageFileName}`}
                          style={{
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></img>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
        <div className={styles.SelectContainer}>
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
        </div>
      </div>
    </SectionContainer>
  );
}
