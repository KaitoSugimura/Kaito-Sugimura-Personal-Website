import React, { useEffect, useRef, useState } from "react";
import styles from "./Navigation.module.css";
import SettingsIcon from "/Home/Icons/Settings.svg";
import Sections from "../Pages/Home/HomeTableOfContents.jsx";
import CameraUI from "./NavComponents/CameraUI";
import NavButtons from "./NavComponents/NavButtons";

export default function Navigation() {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const rootRef = useRef(null);

  const scrollTo = (sectionName) => {
    document.getElementById(sectionName).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.navigationRoot} ref={rootRef}>
      <CameraUI navIsOpen={navIsOpen} />
      <NavButtons navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen} />
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
                  scrollTo(section.title);
                  setNavIsOpen(false);
                }}
                key={index}
              >
                <div className={styles.listInside}>{section.title}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
