import { useRef, useState } from "react";
import styles from "./Draggable.module.css";

export default function Draggable({
  children,
  getNextZIndex,
  centerCoords,
  isArtifact,
}) {
  const initialPos = useRef({ x: 0, y: 0 });
  const initialContPos = useRef({ x: 0, y: 0 });
  const dragRootRef = useRef(null);
  const deviceIsTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  const [thisZIndex, setThisZIndex] = useState(getNextZIndex());

  const handleMouseMove = useRef((event) => {
    const dragCont = dragRootRef.current;
    const { clientX, clientY } = (event.touches && event.touches[0]) || event;
    const newX = clientX - initialPos.current.x + initialContPos.current.x;
    const newY = clientY - initialPos.current.y + initialContPos.current.y;
    dragCont.style.left = `${Math.max(
      isArtifact ? 0 : -dragCont.offsetWidth + 50,
      Math.min(
        newX,
        isArtifact
          ? window.innerWidth - dragCont.offsetWidth
          : window.innerWidth - 50
      )
    )}px`;
    dragCont.style.top = `${Math.max(
      isArtifact ? 0 : -dragCont.offsetHeight + 50,
      Math.min(
        newY,
        isArtifact
          ? window.innerHeight - dragCont.offsetHeight
          : window.innerHeight - 50
      )
    )}px`;
  });

  const handleMouseDown = (event) => {
    const { clientX, clientY } = (event.touches && event.touches[0]) || event;
    initialPos.current = { x: clientX, y: clientY };
    initialContPos.current = {
      x: dragRootRef.current.offsetLeft,
      y: dragRootRef.current.offsetTop,
    };

    document.addEventListener(
      deviceIsTouch ? "touchend" : "mouseup",
      handleMouseUp
    );
    document.addEventListener(
      deviceIsTouch ? "touchmove" : "mousemove",
      handleMouseMove.current
    );
    setThisZIndex(getNextZIndex());
  };

  const handleMouseUp = (event) => {
    document.removeEventListener(
      deviceIsTouch ? "touchmove" : "mousemove",
      handleMouseMove.current
    );
    document.removeEventListener(
      deviceIsTouch ? "touchend" : "mouseup",
      handleMouseUp
    );

    const dragRef = dragRootRef.current;
    const left = dragRef.offsetLeft;
    const top = dragRef.offsetTop;
    const right = left + dragRef.offsetWidth;
    const bottom = top + dragRef.offsetHeight;
    if (
      isArtifact &&
      centerCoords.x > left &&
      centerCoords.x < right &&
      centerCoords.y > top &&
      centerCoords.y < bottom
    ) {
      dragRef.style.left = `${centerCoords.x - dragRef.offsetWidth / 2}px`;
      dragRef.style.top = `${centerCoords.y - dragRef.offsetHeight / 2}px`;
    }
  };

  return (
    <div
      className={styles.DraggableContainer}
      ref={dragRootRef}
      onMouseDown={deviceIsTouch ? null : handleMouseDown}
      onTouchStart={deviceIsTouch ? handleMouseDown : null}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      style={{
        zIndex: thisZIndex,
      }}
    >
      {children}
    </div>
  );
}
