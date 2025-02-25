import { useCallback, useContext, useRef, useState } from "react";
import styles from "./Draggable.module.css";
import CornerBorder from "../Components/NavComponents/CornerBorder";
import forms from "../Pages/Home/Profile/Forms";
import { SoundContext } from "../Context/SoundContext";

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
  const { playSFX } = useContext(SoundContext);
  const initialPos = useRef({ x: 0, y: 0 });
  const initialContPos = useRef({ x: 0, y: 0 });
  const spawnOffset = useRef(getSetSpawnOffset(-1));
  const dragRootRef = useRef(null);
  const currentEventTouch = useRef(false);
  // const deviceIsTouch =
  //   "ontouchstart" in window ||
  //   navigator.maxTouchPoints > 0 ||
  //   navigator.msMaxTouchPoints > 0;
  const [thisZIndex, setThisZIndex] = useState(getNextZIndex());
  const [isDragging, setIsDragging] = useState(false);

  const StaticBorder = {
    width: "5vmin",
    height: "5vmin",
    borderWidth: "2px",
  };

  const handleMouseMove = useCallback((event) => {
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

  const handleMouseUp = (event) => {
    document.removeEventListener(
      currentEventTouch.current ? "touchmove" : "mousemove",
      handleMouseMove
    );
    document.removeEventListener(
      currentEventTouch.current ? "touchend" : "mouseup",
      handleMouseUp
    );

    const dragRef = dragRootRef.current;
    const left = dragRef.offsetLeft - 10;
    const top = dragRef.offsetTop - 10;
    const right = left + dragRef.offsetWidth + 20;
    const bottom = top + dragRef.offsetHeight + 20;

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
          playSFX("EquipArtifact");
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
    playSFX("artifactDrop");
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
          ? `${VHtoPX(artifactStartingPos.y)}px`
          : `${8 + spawnOffset.current * 2}%`,
        left: isArtifact
          ? `${VWtoPX(artifactStartingPos.x)}px`
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
