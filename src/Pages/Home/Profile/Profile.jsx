import { useEffect, useRef, useState } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import styles from "./Profile.module.css";
import Draggable from "../../../Tools/Draggable";
import forms from "./Forms";

export default function Profile() {
  const nextZIndex = useRef(0);
  const [overlapID, setOverlapID] = useState(null);
  const [overlapCoords, setOverlapCoords] = useState({
    x: window.innerWidth * (8 / 10),
    y: window.innerHeight / 2,
  });
  const [openForms, setOpenForms] = useState({});
  const spawnOffset = useRef(-1);
  const offsetReservations = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      setOverlapCoords({
        x: window.innerWidth * (8 / 10),
        y: window.innerHeight / 2,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const artifactSetHandle = () => {
    ++spawnOffset.current;
  };

  const getSetSpawnOffset = (offset) => {
    // If offset < 0 then get else set
    if (offset < 0) {
      offsetReservations.current[spawnOffset.current] = true;
      return spawnOffset.current;
    } else {
      offsetReservations.current[offset] = false;
      let stopIndex = spawnOffset.current;
      for (let i = spawnOffset.current; i >= 0; --i) {
        if (offsetReservations.current[i]) {
          stopIndex = i;
          break;
        }
        if (i === 0) {
          spawnOffset.current = -1;
          return;
        }
      }
      spawnOffset.current = stopIndex;
    }
  };

  const getNextZIndex = () => {
    return ++nextZIndex.current;
  };

  return (
    <SectionContainer image={"Backgrounds/Classroom.png"}>
      <div className={styles.ProfileRoot}>
        <div
          className={styles.OverLapAreaForArtifact}
          style={{
            top: `${overlapCoords.y}px`,
            left: `${overlapCoords.x}px`,
          }}
        >
          <div className={styles.indicatorCont}></div>
          {overlapID && <div className={styles.rippleEffect}></div>}
        </div>
        <Draggable
          getNextZIndex={getNextZIndex}
          isArtifact={true}
          centerCoords={overlapCoords}
          artifactID={"UofC"}
          setOverlapID={setOverlapID}
          setOpenForms={setOpenForms}
          artifactSetHandle={artifactSetHandle}
        >
          <div className={styles.UofCItemRoot}>
            <img
              src="/Home/Icons/School.svg"
              className={styles.UofCLogoImage}
              onDrag={(event) => {
                event.preventDefault();
              }}
            ></img>
          </div>
        </Draggable>
        <Draggable
          getNextZIndex={getNextZIndex}
          isArtifact={true}
          centerCoords={overlapCoords}
          artifactID={"SelfStudy"}
          setOverlapID={setOverlapID}
          setOpenForms={setOpenForms}
          artifactSetHandle={artifactSetHandle}
        >
          <div className={styles.UofCItemRoot}>
            <img
              src="/Home/Profile/Items/SelfStudy.png"
              className={styles.UofCLogoImage}
            ></img>
          </div>
        </Draggable>
        {Object.entries(openForms).map((formPair) => (
          <Draggable
            getNextZIndex={getNextZIndex}
            artifactID={formPair[1]}
            setOpenForms={setOpenForms}
            id={formPair[0]}
            key={formPair[0]}
            getSetSpawnOffset={getSetSpawnOffset}
          >
            {forms[formPair[1]]}
          </Draggable>
        ))}
      </div>
    </SectionContainer>
  );
}
