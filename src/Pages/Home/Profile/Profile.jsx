import { useEffect, useRef, useState } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import styles from "./Profile.module.css";
import Draggable from "../../../Tools/Draggable";
import forms from "./Forms";
import PContents from "./ProfileContents";
import MouseIcon from "/Tools/Mouse.svg";

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
  const [currentContent, setCurrentContent] = useState("About");
  const spawnOffset = useRef(-1);
  const offsetReservations = useRef([]);
  const mainRef = useRef(null);

  const [finishedFirstQuest, setFinishedFirstQuest] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);
  const [mainArtifactCoords, setMainArtifactCoords] = useState({
    left: window.innerWidth / 1.4,
    top: window.innerHeight / 2 - window.innerWidth / 20,
    width: window.innerWidth / 10,
    height: window.innerWidth / 10,
  });

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
    // ++spawnOffset.current;
    setFinishedFirstQuest(true);
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

  const onDragEnd = () => {
    if (!finishedFirstQuest) {
      setMainArtifactCoords(mainRef.current.getBoundingClientRect());
      setShowIndicator(true);
    }
  };

  const onDragStart = () => {
    if (!finishedFirstQuest) {
      setShowIndicator(false);
    }
    setCurrentContent("About");
  };

  const getDragRotation = () => {
    const angle =
      Math.atan(
        (window.innerHeight / 2 -
          mainArtifactCoords.top -
          mainArtifactCoords.width / 2) /
          (mainArtifactCoords.left - overlapCoords.x)
      ) *
      (-180 / Math.PI);

    if (mainArtifactCoords.left - overlapCoords.x < 0) {
      return angle + 180;
    }
    return angle;
  };

  return (
    <SectionContainer image={"Backgrounds/Classroom.jpg"}>
      <div className={styles.ProfileRoot}>
        {/* Development */}
        {overlapID &&
          (PContents[overlapID] && PContents[overlapID].contents ? (
            <div className={styles.informationContainer}>
              <div className={styles.mainTextContainer}>
                <h1 className={styles.title}>{PContents[overlapID].title}</h1>
                <h2 className={styles.subTitle}>
                  {PContents[overlapID].subTitle}
                </h2>
                <span className={styles.date}>{PContents[overlapID].date}</span>
              </div>

              <ul className={styles.NavListContainer}>
                {Object.entries(PContents[overlapID].contents).map(
                  (content) => (
                    <li
                      className={`${styles.NavListItem} ${
                        content[0] == currentContent && styles.selected
                      }`}
                      onClick={() => {
                        setCurrentContent(content[0]);
                      }}
                    >
                      {content[0]}
                    </li>
                  )
                )}
              </ul>

              <div className={styles.contentBox}>
                {PContents[overlapID].contents[currentContent]}
              </div>
            </div>
          ) : (
            <div className={styles.errorMessage}>Error loading contents</div>
          ))}

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

        {overlapID == null && (
          <div className={styles.artifactsContainer}>
            <p className={styles.artifactsText}>Education</p>
            <p className={styles.artifactsText}>Self Study</p>
            <p className={styles.artifactsText}>Achievements</p>
            <p className={styles.artifactsText}>Skills</p>
          </div>
        )}

        <Draggable
          getNextZIndex={getNextZIndex}
          isArtifact={true}
          artifactStartingPos={{
            x: `${mainArtifactCoords.left}px`,
            y: `${mainArtifactCoords.top}px`,
          }}
          centerCoords={overlapCoords}
          artifactID={"UofC"}
          setOverlapID={setOverlapID}
          setOpenForms={setOpenForms}
          artifactSetHandle={artifactSetHandle}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
        >
          <div className={styles.UofCItemRoot} ref={mainRef}>
            <img
              src="/Home/Icons/School.svg"
              className={styles.UofCLogoImage}
              onDrag={(event) => {
                event.preventDefault();
              }}
            ></img>
          </div>
        </Draggable>
        {(overlapID == null || overlapID == "SelfStudy") && (
          <Draggable
            getNextZIndex={getNextZIndex}
            isArtifact={true}
            artifactStartingPos={{
              x: `${window.innerWidth / 10}px`,
              y: `${window.innerHeight / 2 + window.innerWidth / 10}px`,
            }}
            centerCoords={overlapCoords}
            artifactID={"SelfStudy"}
            setOverlapID={setOverlapID}
            setOpenForms={setOpenForms}
            artifactSetHandle={artifactSetHandle}
          >
            <div className={styles.UofCItemRoot}>
              <img
                src="/Home/Icons/SelfStudy.svg"
                className={styles.UofCLogoImage}
                onDrag={(event) => {
                  event.preventDefault();
                }}
              ></img>
            </div>
          </Draggable>
        )}
        {(overlapID == null || overlapID == "SelfStudy") && (
          <Draggable
            getNextZIndex={getNextZIndex}
            isArtifact={true}
            artifactStartingPos={{
              x: `${window.innerWidth / 10}px`,
              y: `${window.innerHeight / 2 + window.innerWidth / 10}px`,
            }}
            centerCoords={overlapCoords}
            artifactID={"SelfStudy"}
            setOverlapID={setOverlapID}
            setOpenForms={setOpenForms}
            artifactSetHandle={artifactSetHandle}
          >
            <div className={styles.UofCItemRoot}>
              <img
                src="/Home/Icons/SelfStudy.svg"
                className={styles.UofCLogoImage}
                onDrag={(event) => {
                  event.preventDefault();
                }}
              ></img>
            </div>
          </Draggable>
        )}
        {(overlapID == null || overlapID == "SelfStudy") && (
          <Draggable
            getNextZIndex={getNextZIndex}
            isArtifact={true}
            artifactStartingPos={{
              x: `${window.innerWidth / 10}px`,
              y: `${window.innerHeight / 2 + window.innerWidth / 10}px`,
            }}
            centerCoords={overlapCoords}
            artifactID={"SelfStudy"}
            setOverlapID={setOverlapID}
            setOpenForms={setOpenForms}
            artifactSetHandle={artifactSetHandle}
          >
            <div className={styles.UofCItemRoot}>
              <img
                src="/Home/Icons/SelfStudy.svg"
                className={styles.UofCLogoImage}
                onDrag={(event) => {
                  event.preventDefault();
                }}
              ></img>
            </div>
          </Draggable>
        )}
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

        {!finishedFirstQuest && showIndicator && (
          <div
            className={styles.dragIndicator}
            style={{
              top: `${overlapCoords.y}px`,
              left: `${overlapCoords.x}px`,
              width: `${Math.abs(mainArtifactCoords.left - overlapCoords.x)}px`,
              transform: `rotate(${getDragRotation()}deg)`,
            }}
          >
            <div className={styles.glowCont}>
              <div className={styles.glow}></div>
              <div
                className={styles.glow}
                style={{
                  animationDelay: "0.5s",
                }}
              ></div>
              <div
                className={styles.glow}
                style={{
                  animationDelay: "1s",
                }}
              ></div>
              <div
                className={styles.glow}
                style={{
                  animationDelay: "1.5s",
                }}
              ></div>
            </div>
            <img className={styles.MouseImage} src={MouseIcon}></img>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
