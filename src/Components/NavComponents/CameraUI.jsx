import styles from "./CameraUI.module.css";
import CornerBorder from "./CornerBorder";
import Sections from "../../Pages/Home/HomeTableOfContents.jsx";
import { useEffect, useState } from "react";

export default function CameraUI({ navIsOpen, currentSectionIndex, initDone }) {
  const BorderStyle = {
    width: navIsOpen ? "12vh" : "22vh",
    height: navIsOpen ? "12vh" : "22vh",
    borderWidth: "0.15rem",
  };
  const StaticBorder = {
    width: "2rem",
    height: "2rem",
    borderColor: "#fffd",
    borderWidth: "0.2rem",
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
          <div
            className={`${styles.cameraUIMainContainer} ${
              initDone ? "" : styles.mainAnim
            }`}
          >
            {/* <p className={styles.MainNameText}>Kaito Sugimura</p> */}
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
          <p>
            {initDone
              ? `Page ${currentSectionIndex + 1}/${Sections.length}`
              : ""}
          </p>
        </div>
        <div className={styles.cameraUIBottomLeftContainer}>
          {initDone ? (
            <>
              <p>Developed from scratch using: REACT JS, CSS, HTML</p>
              <p>By: Kaito Sugimura</p>
            </>
          ) : (
            <>
              <div className={styles.typingWrapping1}>
                <p>Accessing Kernel...</p>
              </div>
              <div className={styles.typingWrapping2}>
                <p>System all clear</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
