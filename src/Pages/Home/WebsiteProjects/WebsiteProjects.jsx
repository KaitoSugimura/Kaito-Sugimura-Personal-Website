import styles from "./WebsiteProjects.module.css";
import Contents from "./WebsiteContents";
import { useEffect, useRef, useState } from "react";

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

  const getPosIndex = (index) => {
    let dif = index - currentIndex;
    const div2 = Contents.length / 2;
    if (dif > div2) {
      dif -= Contents.length;
    } else if (dif < -div2) {
      dif += Contents.length;
    }
    return +dif;
  };

  const getAbsPosIndex = (index) => {
    return Math.abs(getPosIndex(index));
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
    <div className={styles.WebsiteProjectsRoot}>
      <div className={styles.WebsiteProjectsTitleContainer}>
        <h1 className={styles.WebsiteProjectsTitle}>Website Projects</h1>
      </div>

      <div
        className={styles.WebsiteFrameContainer}
        onMouseDown={deviceIsTouch ? null : handleMouseDown}
        onTouchStart={deviceIsTouch ? handleMouseDown : null}
        onDrag={() => {
          handleMouseUp();
        }}
      >
        <div className={styles.WebsiteOuterFrame}>
          {Contents.map((content, index) => (
            <div
              className={styles.FrameContainer}
              style={{
                zIndex: Math.round(-(getAbsPosIndex(index) * 400)),
                transition: mouseIsDown.current
                  ? "none"
                  : `z-index 0.3s ease-in-out`,
              }}
              key={index}
            >
              <div
                className={`${styles.FrameInner}`}
                style={{
                  transform: `translate3d(${getPosIndex(index) * 100}%, 0, ${-(
                    getAbsPosIndex(index) * 400
                  )}px) rotateX(0deg) rotateY(${-getPosIndex(index) * 20}deg)`,
                  transition: mouseIsDown.current
                    ? "none"
                    : `transform 0.3s ease-in-out`,
                }}
                onClick={() => {
                  if (!isDragging.current) {
                    setCurrentIndex(index);
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
          ))}
        </div>
      </div>
    </div>
  );
}
