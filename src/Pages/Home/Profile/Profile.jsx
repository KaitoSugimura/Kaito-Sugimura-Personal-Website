import { useEffect, useRef, useState } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import styles from "./Profile.module.css";
import Draggable from "../../../Tools/Draggable";
import forms from "./Forms";

export default function Profile() {
  const nextZIndex = useRef(0);
  const [overlapID, setOverlapID] = useState(null);
  const getOverlapCoords = () => {
    return {
      x: window.innerWidth * (3 / 20),
      y: window.innerHeight / 2,
    };
  };
  const [overlapCoords, setOverlapCoords] = useState(getOverlapCoords());
  const [openForms, setOpenForms] = useState({});
  const spawnOffset = useRef(-1);
  const offsetReservations = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      setOverlapCoords(getOverlapCoords());
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
        {/* Development */}
        <div className={styles.informationContainer}>
          <div className={styles.mainTextContainer}>
            <h1 className={styles.title}>
              Bachelor of Science <br />
              in Software Engineering
            </h1>
            <h2 className={styles.subTitle}>Grade: 3.957/4 GPA, 4th year</h2>
            <span className={styles.date}>09/2020 — 04/2024</span>
          </div>

          <ul className={styles.NavListContainer}>
            <li className={styles.NavListItem}>About</li>
            <li className={styles.NavListItem}>Software and Computer</li>
            <li className={styles.NavListItem}>Electrical and Circuits</li>
            <li className={styles.NavListItem}>Physics and Chemistry</li>
            <li className={styles.NavListItem}>Mathematics</li>
            <li className={styles.NavListItem}>Art</li>
            <li className={styles.NavListItem}>Other</li>
          </ul>

          <div className={styles.whiteSquare}>
            <span className={styles.decoLineHorizontal}></span>
            <span className={styles.decoLineVertical}></span>
            <h2 className={styles.WSTitle}>University of Calgary</h2>
            <p className={styles.desc}>
              Finished my 3rd year this winter 2023. I am currently looking for
              Internships to gain experience!!
            </p>
            <img className={styles.subjectPicture} src="/Photos/UofC.jpg"></img>
          </div>
        </div>

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
