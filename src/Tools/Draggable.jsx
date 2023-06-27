import { useRef, useState } from "react";
import styles from "./Draggable.module.css";
import CornerBorder from "../Components/NavComponents/CornerBorder";
import forms from "../Pages/Home/Profile/Forms";

// Input in units of vw
const VWtoPX = (width) => {
  return width * window.innerWidth * 0.01;
};
// Input in units of vh
const VHtoPX = (height) => {
  return height * window.innerHeight * 0.01;
};
// Input in units of px
const PXtoVW = (width) => {
  return (width / window.innerWidth) * 100;
};
// Input in units of px
const PXtoVH = (height) => {
  return (height / window.innerHeight) * 100;
};

export default function Draggable({
  children,
  getNextZIndex,
  isArtifact = false,
  artifactStartingPos = { x: 0, y: 0 },
  centerCoords = null,
  artifactID = null,
  setOverlapID = (doNothing) => {},
  setOpenForms = (doNothing) => {},
  getSetSpawnOffset = (returnZero) => {
    return 0;
  },
  onDragEnd = (doNothing, dn, d) => {},
  onDragStart = (doNothing, dn) => {},
}) {
  const initialPos = useRef({ x: 0, y: 0 });
  const initialContPos = useRef({ x: 0, y: 0 });
  const spawnOffset = useRef(getSetSpawnOffset(-1));
  const dragRootRef = useRef(null);
  const deviceIsTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  const [thisZIndex, setThisZIndex] = useState(getNextZIndex());
  const [isDragging, setIsDragging] = useState(false);

  const StaticBorder = {
    width: "5vmin",
    height: "5vmin",
    borderWidth: "2px",
  };

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
    setOverlapID((prev) => {
      if (prev === artifactID) {
        return null;
      }
      return prev;
    });
    setIsDragging(true);
    onDragStart(dragRootRef.current, artifactID);
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
      // Dropped artifact
      setOverlapID((prev) => {
        if (prev === null) {
          dragRef.style.left = `${centerCoords.x - dragRef.offsetWidth / 2}px`;
          dragRef.style.top = `${centerCoords.y - dragRef.offsetHeight / 2}px`;
          // setOpenForms((prev) => {
          //   return { ...prev, [`${Date.now()}`]: artifactID };
          // });
          onDragEnd(dragRootRef.current, artifactID, true);
          return artifactID;
        }
        return prev;
      });
    } else {
      onDragEnd(dragRootRef.current, artifactID, false);
    }
    setIsDragging(false);
  };

  return (
    <div
      className={styles.DraggableContainer}
      ref={dragRootRef}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      style={{
        zIndex: thisZIndex,
        top: isArtifact
          ? VHtoPX(artifactStartingPos.y)
          : `${8 + spawnOffset.current * 2}%`,
        left: isArtifact
          ? VWtoPX(artifactStartingPos.x)
          : `${4 + spawnOffset.current}%`,
        // border: isDragging ? "2px solid #00ff00" : "2px solid #00000000",
      }}
    >
      {!isArtifact && !isDragging && (
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            setOpenForms((prev) => {
              delete prev[id];
              return { ...prev };
            });
            getSetSpawnOffset(spawnOffset.current);
          }}
        >
          <p>X</p>
        </button>
      )}
      <div
        className={styles.dragArea}
        onMouseDown={deviceIsTouch ? null : handleMouseDown}
        onTouchStart={deviceIsTouch ? handleMouseDown : null}
      >
        {isDragging && <CornerBorder style={StaticBorder} />}
        {children}
      </div>
    </div>
  );
}
