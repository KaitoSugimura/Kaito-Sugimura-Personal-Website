import React, { useContext, useEffect, useRef, useState } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import styles from "./Profile.module.css";
import Draggable from "../../../Tools/Draggable";
import PContents from "./ProfileContents";
import MouseIcon from "/Tools/Mouse.svg";
import { activateOnKey } from "../../../a11y";
import { scrollContext } from "../scrollContext";
import { SoundContext } from "../../../Context/SoundContext";
import Sections from "../HomeTableOfContents.jsx";

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

// Build a fresh id -> {x, y} map seeded from each artifact's InitCoords. Cloned
// so dragging never mutates the imported PContents singleton (which would leak
// positions across navigation and alias coords with InitCoords after a reset).
const buildInitialArtifactCoords = () =>
  Object.fromEntries(
    Object.entries(PContents).map(([id, data]) => [id, { ...data.InitCoords }])
  );

export default function Profile() {
  const { playSFX } = useContext(SoundContext);
  const { setScrollable, currentSection, openDialogWithCallback } =
    useContext(scrollContext);
  const nextZIndex = useRef(0);
  const [overlapID, setOverlapID] = useState(null);
  const overlapCoords = {
    x: VWtoPX(15),
    y: VHtoPX(50),
  };
  const [artifactCoords, setArtifactCoords] = useState(
    buildInitialArtifactCoords
  );
  const [currentContent, setCurrentContent] = useState("About");

  const [currentArtifactCoords, setCurrentArtifactCoords] = useState(null);
  const [finishedFirstQuest, setFinishedFirstQuest] = useState(false);

  const [DialogEvents, setDialogEvents] = useState({ initDialog: true });
  const initDialogOpened = useRef(false);
  useEffect(() => {
    if (
      !initDialogOpened.current &&
      DialogEvents.initDialog &&
      Sections[currentSection].title == "Profile"
    ) {
      initDialogOpened.current = true;
      openDialogWithCallback("Profile1", () => {
        setDialogEvents({ initDialog: false });
      });
    }
  }, [currentSection, DialogEvents.initDialog, openDialogWithCallback]);

  const getNextZIndex = () => {
    return ++nextZIndex.current;
  };

  const onDragEnd = (draggable, artifactID, hasSet) => {
    setScrollable(true);
    if (hasSet) {
      setFinishedFirstQuest(true);
    }
    setCurrentArtifactCoords({
      left: draggable.offsetLeft,
      top: draggable.offsetTop,
      width: draggable.offsetWidth,
      height: draggable.offsetHeight,
    });

    setArtifactCoords((prev) => ({
      ...prev,
      [artifactID]: {
        x: PXtoVW(draggable.offsetLeft),
        y: PXtoVH(draggable.offsetTop),
      },
    }));
  };

  const onDragStart = (draggable) => {
    setScrollable(false);

    if (!finishedFirstQuest) {
      setCurrentArtifactCoords({
        left: draggable.offsetLeft,
        top: draggable.offsetTop,
        width: draggable.offsetWidth,
        height: draggable.offsetHeight,
      });
    }

    setCurrentContent("About");
  };

  const getDragRotation = () => {
    if (!currentArtifactCoords) {
      return 0;
    }
    const angle =
      Math.atan(
        (window.innerHeight / 2 -
          currentArtifactCoords.top -
          currentArtifactCoords.height / 2) /
          (currentArtifactCoords.left - overlapCoords.x)
      ) *
      (-180 / Math.PI);

    if (currentArtifactCoords.left - overlapCoords.x < 0) {
      return angle + 180;
    }
    return angle;
  };

  return (
    <SectionContainer image={"Backgrounds/Buildings.jpg"}>
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
                  (content, index) => (
                    <li
                      className={`${styles.NavListItem} ${
                        content[0] == currentContent && styles.selected
                      }`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setCurrentContent((prev) => {
                          if (prev != content[0]) {
                            playSFX("ProfileClick");
                            return content[0];
                          }
                          return prev;
                        });
                      }}
                      onKeyDown={activateOnKey(() => {
                        setCurrentContent((prev) => {
                          if (prev != content[0]) {
                            playSFX("ProfileClick");
                            return content[0];
                          }
                          return prev;
                        });
                      })}
                      key={index}
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
          {overlapID && (
            <div
              className={styles.rippleEffect}
              style={{
                background: `radial-gradient(circle at 50%, ${PContents[overlapID].LabelColor},  #111c4cb7 14%, #ff000000 75%)`,
              }}
            ></div>
          )}
        </div>

        {overlapID == null && (
          <button
            className={styles.resetPosition}
            onClick={() => {
              setArtifactCoords(buildInitialArtifactCoords());
              setCurrentArtifactCoords(null);
              setFinishedFirstQuest(false);
            }}
          >
            Reset artifacts
          </button>
        )}

        {PContents &&
          Object.entries(PContents).map((section, index) => (
            <React.Fragment key={section[0]}>
              {(overlapID == null || overlapID == section[0]) && (
                <Draggable
                  getNextZIndex={getNextZIndex}
                  artifactStartingPos={artifactCoords[section[0]]}
                  centerCoords={overlapCoords}
                  artifactID={section[0]}
                  setOverlapID={setOverlapID}
                  onDragEnd={onDragEnd}
                  onDragStart={onDragStart}
                >
                  <div className={styles.UofCItemRoot}>
                    <img
                      src={section[1].icon}
                      alt={`${section[1].type} artifact`}
                      className={styles.UofCLogoImage}
                      onDrag={(event) => {
                        event.preventDefault();
                      }}
                    ></img>
                  </div>
                </Draggable>
              )}

              {overlapID == null && (
                <div
                  className={styles.LabelCont}
                  style={{
                    top: `calc(${section[1].InitCoords.y}% + 10vw)`,
                    left: `calc(${section[1].InitCoords.x}% - 2.5vw)`,
                    backgroundColor: `${section[1].LabelColor}`,
                  }}
                >
                  <div className={styles.pos}>
                    <span className={styles.artifactsNum}>0{index}</span>
                    <p className={styles.artifactsText}>{section[1].type}</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

        {!finishedFirstQuest && !DialogEvents.initDialog && (
          <div
            className={styles.dragIndicator}
            style={{
              top: `${overlapCoords.y}px`,
              left: `${overlapCoords.x}px`,
              width: `${
                currentArtifactCoords
                  ? Math.abs(currentArtifactCoords.left - overlapCoords.x)
                  : window.innerWidth / 2.8
              }px`,
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
            <img className={styles.MouseImage} src={MouseIcon} alt=""></img>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
