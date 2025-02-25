import { useRef, useState } from "react";
import styles from "./XDragScroller.module.css";
import MouseIcon from "/Tools/Mouse.svg";


export default function XDragScroller({ style, children, setIsDragging }) {
  const MouseXPrevRef = useRef(0);
  const containerRef = useRef(null);
  const [clickedOnce, setClickedOnce] = useState(false);
  const deviceIsTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  const setFalseTimeoutRef = useRef(null);

  const handleMouseMove = useRef((event) => {
    const { clientX } = (event.touches && event.touches[0]) || event;
    const diff = clientX - MouseXPrevRef.current;
    if (Math.abs(diff) > 10) setIsDragging(true);

    containerRef.current.scrollLeft -= diff;
    MouseXPrevRef.current = clientX;
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
  };

  const handleMouseDown = (event) => {
    const { clientX } = (event.touches && event.touches[0]) || event;
    MouseXPrevRef.current = clientX;
    setIsDragging(false);

    document.addEventListener(
      deviceIsTouch ? "touchend" : "mouseup",
      handleMouseUp
    );
    document.addEventListener(
      deviceIsTouch ? "touchmove" : "mousemove",
      handleMouseMove.current
    );
    setClickedOnce(true);
    clearTimeout(setFalseTimeoutRef.current);
    setFalseTimeoutRef.current = setTimeout(() => {
      setFalseTimeoutRef.current = null;
      setClickedOnce(false);
    }, 15000);
  };

  return (
    <div className={styles.DragRoot}>
      {!clickedOnce && (
        <div className={styles.DragAreaPos}>
          <div className={styles.DragAnimContainer}>
            <div className={styles.MouseLineContainer}>
              <div className={styles.leftSpan}></div>
              <div className={styles.MouseImageContainer}>
                {!deviceIsTouch && (
                  <img className={styles.MouseImage} src={MouseIcon}></img>
                )}

                <p>DRAG</p>
              </div>
              <div className={styles.rightSpan}></div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`${styles.DragArea}`}
        style={style}
        onMouseDown={deviceIsTouch ? null : handleMouseDown}
        onTouchStart={deviceIsTouch ? handleMouseDown : null}
        ref={containerRef}
      >
        {children}
      </div>
    </div>
  );
}
