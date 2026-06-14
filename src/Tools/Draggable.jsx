import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Draggable.module.css";
import CornerBorder from "../Components/NavComponents/CornerBorder";
import { SoundContext } from "../Context/SoundContext";

// Default no-op for optional callback props.
const noop = () => {
  /* intentionally empty */
};

// Input in units of vw
const VWtoPX = (width) => {
  return width * window.innerWidth * 0.01;
};
// Input in units of vh
const VHtoPX = (height) => {
  return height * window.innerHeight * 0.01;
};

export default function Draggable({
  children,
  getNextZIndex,
  artifactStartingPos = { x: 0, y: 0 },
  centerCoords = { x: 0, y: 0 },
  artifactID = null,
  setOverlapID = noop,
  onDragEnd = noop,
  onDragStart = noop,
}) {
  const { playSFX } = useContext(SoundContext);
  const initialPos = useRef({ x: 0, y: 0 });
  const initialContPos = useRef({ x: 0, y: 0 });
  const dragRootRef = useRef(null);
  const currentEventTouch = useRef(false);
  // Track the exact listener references attached on the active drag so they can
  // be torn down if the component unmounts mid-drag (avoids a leaked listener).
  const activeMoveRef = useRef(null);
  const activeUpRef = useRef(null);
  const [thisZIndex, setThisZIndex] = useState(getNextZIndex());
  const [isDragging, setIsDragging] = useState(false);

  const StaticBorder = {
    width: "5vmin",
    height: "5vmin",
    borderWidth: "2px",
  };

  const handleMouseMove = (event) => {
    const dragCont = dragRootRef.current;
    const { clientX, clientY } = (event.touches && event.touches[0]) || event;
    const newX = clientX - initialPos.current.x + initialContPos.current.x;
    const newY = clientY - initialPos.current.y + initialContPos.current.y;
    dragCont.style.left = `${Math.max(
      0,
      Math.min(newX, window.innerWidth - dragCont.offsetWidth)
    )}px`;
    dragCont.style.top = `${Math.max(
      0,
      Math.min(newY, window.innerHeight - dragCont.offsetHeight)
    )}px`;
  };

  const handleMouseDown = (event) => {
    const { clientX, clientY } = (event.touches && event.touches[0]) || event;
    initialPos.current = { x: clientX, y: clientY };
    initialContPos.current = {
      x: dragRootRef.current.offsetLeft,
      y: dragRootRef.current.offsetTop,
    };

    activeUpRef.current = handleMouseUp;
    activeMoveRef.current = handleMouseMove;
    document.addEventListener(
      currentEventTouch.current ? "touchend" : "mouseup",
      handleMouseUp
    );
    document.addEventListener(
      currentEventTouch.current ? "touchmove" : "mousemove",
      handleMouseMove
    );
    setThisZIndex(getNextZIndex());
    setOverlapID((prev) => {
      if (prev === artifactID) {
        return null;
      }
      return prev;
    });
    setIsDragging(true);
    onDragStart(dragRootRef.current, artifactID);
    playSFX("artifactPickup");
  };

  const handleMouseUp = () => {
    document.removeEventListener(
      currentEventTouch.current ? "touchmove" : "mousemove",
      handleMouseMove
    );
    document.removeEventListener(
      currentEventTouch.current ? "touchend" : "mouseup",
      handleMouseUp
    );
    activeMoveRef.current = null;
    activeUpRef.current = null;

    const dragRef = dragRootRef.current;
    const left = dragRef.offsetLeft - 10;
    const top = dragRef.offsetTop - 10;
    const right = left + dragRef.offsetWidth + 20;
    const bottom = top + dragRef.offsetHeight + 20;

    if (
      centerCoords.x > left &&
      centerCoords.x < right &&
      centerCoords.y > top &&
      centerCoords.y < bottom
    ) {
      // Dropped artifact into the equip area
      setOverlapID((prev) => {
        if (prev === null) {
          playSFX("EquipArtifact");
          dragRef.style.left = `${centerCoords.x - dragRef.offsetWidth / 2}px`;
          dragRef.style.top = `${centerCoords.y - dragRef.offsetHeight / 2}px`;
          onDragEnd(dragRootRef.current, artifactID, true);
          return artifactID;
        }
        return prev;
      });
    } else {
      onDragEnd(dragRootRef.current, artifactID, false);
    }
    setIsDragging(false);
    playSFX("artifactDrop");
  };

  // Tear down any drag listeners still attached if we unmount mid-drag.
  useEffect(() => {
    return () => {
      if (activeMoveRef.current) {
        document.removeEventListener("mousemove", activeMoveRef.current);
        document.removeEventListener("touchmove", activeMoveRef.current);
      }
      if (activeUpRef.current) {
        document.removeEventListener("mouseup", activeUpRef.current);
        document.removeEventListener("touchend", activeUpRef.current);
      }
    };
  }, []);

  return (
    <div
      className={styles.DraggableContainer}
      ref={dragRootRef}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      style={{
        zIndex: thisZIndex,
        top: `${VHtoPX(artifactStartingPos.y)}px`,
        left: `${VWtoPX(artifactStartingPos.x)}px`,
      }}
    >
      <div
        className={styles.dragArea}
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
        {isDragging && <CornerBorder style={StaticBorder} />}
        {children}
      </div>
    </div>
  );
}
