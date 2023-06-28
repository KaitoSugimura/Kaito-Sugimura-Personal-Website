import styles from "./CameraUI.module.css";
import CornerBorder from "./CornerBorder";
import Sections from "../../Pages/Home/HomeTableOfContents.jsx";
import { useEffect, useState } from "react";

export default function CameraUI({ navIsOpen, currentSectionIndex, initDone }) {
  const BorderStyle = {
    width: navIsOpen ? "12vmin" : "22vmin",
    height: navIsOpen ? "12vmin" : "22vmin",
    borderWidth: "1.5px",
  };
  const StaticBorder = {
    width: "1.5vmin",
    height: "1.5vmin",
    borderColor: "#fffd",
    borderWidth: "1px",
  };

  return (
    <div className={styles.cameraUIRoot}>
      <div
        className={`${styles.cameraUIContainer} ${
          initDone ? "" : styles.UIanim
        }`}
      >
        <CornerBorder style={BorderStyle} />
        {!navIsOpen && (
          <div className={`${styles.cameraUIMainContainer}`}>
            <div
              className={`${styles.MainSection} ${
                initDone ? styles.MainSectionDefault : styles.MainSectionAnim
              }`}
            >
              <CornerBorder style={StaticBorder} />
              <div className={styles.MainSectionBackground}>
                <p className={styles.MainSectionText}>
                  {initDone
                    ? Sections[currentSectionIndex].title
                    : "Initializing"}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className={styles.cameraUITopRightContainer}>
          {initDone && (
            <p className={styles.fadeInAnim}>
              Page {currentSectionIndex + 1}/{Sections.length}
            </p>
          )}
        </div>
        {initDone && (
          <div className={styles.SSList}>
            <a
              className={styles.SSItem}
              href="https://www.youtube.com/@sugimurakaito"
              target="_blank"
            >
              <img
                src="/Home/Icons/SS/Youtube.svg"
                className={styles.SSImage}
                onDrag={(e) => {
                  e.preventDefault();
                }}
              />
            </a>
            <a
              className={styles.SSItem}
              href="https://github.com/KaitoSugimura"
              target="_blank"
            >
              <img
                src="/Home/Icons/SS/Github.svg"
                className={styles.SSImage}
                onDrag={(e) => {
                  e.preventDefault();
                }}
              />
            </a>

            <a
              className={styles.SSItem}
              href="https://www.linkedin.com/in/kaito-sugimura-622209226/"
              target="_blank"
            >
              <img
                src="/Home/Icons/SS/Linkedin.svg"
                className={styles.SSImage}
                onDrag={(e) => {
                  e.preventDefault();
                }}
              />
            </a>
          </div>
        )}
        <div className={styles.cameraUIBottomLeftContainer}>
          {initDone ? (
            <>
              {/* <p className={styles.fadeInAnim}>Developed from scratch using: REACT JS, CSS, HTML</p>
              <p className={styles.fadeInAnim}>By: Kaito Sugimura</p> */}
            </>
          ) : (
            <>
              <div className={styles.typingWrapping1}>
                <p>Administrator</p>
              </div>
              <div className={styles.typingWrapping2}>
                <p>System access granted</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
