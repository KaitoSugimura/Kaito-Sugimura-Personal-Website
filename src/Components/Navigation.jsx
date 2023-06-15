import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Navigation.module.css";
import Sections from "../Pages/Home/HomeTableOfContents.jsx";
import CameraUI from "./NavComponents/CameraUI";
import NavButtons from "./NavComponents/NavButtons";
import SideButtons from "./NavComponents/SideButtons";
import SoundSetting from "../Tools/SoundSetting";

export default function Navigation({
  scrollTo,
  currentSectionIndex,
  initDone,
}) {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const rootRef = useRef(null);

  return (
    <div className={styles.navigationRoot} ref={rootRef}>
      {initDone && (
        <SoundSetting
          style={{
            top: `7vmin`,
            left: `8vmin`,
          }}
        />
      )}

      <CameraUI
        navIsOpen={navIsOpen}
        currentSectionIndex={currentSectionIndex}
        initDone={initDone}
      />

      {initDone && (
        <NavButtons navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen} />
      )}
      {initDone && (
        <SideButtons
          navIsOpen={navIsOpen}
          scrollTo={scrollTo}
          currentSectionIndex={currentSectionIndex}
        />
      )}
      <div
        className={`${styles.navigationContainer} ${
          navIsOpen ? "" : "NoUserSelect"
        }`}
        style={{
          opacity: navIsOpen ? "1" : "0", // This is for the fade in/out animation
        }}
      >
        <h1
          className={styles.Title}
          style={{
            transform: navIsOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          Kaito Sugimura
        </h1>
        <div className={styles.sidebarContainer}>
          <ul
            className={`${styles.NavList} ${styles.list}`}
            style={{
              transform: navIsOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            {Sections.map((section, index) => (
              <li
                className={`${styles.NavItem} ${styles.listItem}`}
                onClick={() => {
                  scrollTo(index);
                  setNavIsOpen(false);
                }}
                key={index}
              >
                <div className={styles.listInside}>{section.title}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.credList}>
          <p>Developed from scratch using: REACT JS, CSS, HTML</p>
          <p>By: Kaito Sugimura</p>
        </div>
      </div>
    </div>
  );
}
