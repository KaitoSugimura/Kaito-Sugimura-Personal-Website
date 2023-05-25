import React, { useEffect, useRef, useState } from "react";
import styles from "./Navigation.module.css";
import SettingsIcon from "/Home/Icons/Settings.svg";
import Close from "/Home/Icons/Close.svg";
import Menu from "/Home/Icons/Menu.svg";
import Sections from "../Pages/Home/HomeTableOfContents.jsx";

export default function Navigation() {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const rootRef = useRef(null);

  // useEffect(() => {
  //   function handleWheel(event) {
  //     if (navIsOpen) {
  //       event.preventDefault();
  //     }
  //   }

  //   if (rootRef.current) rootRef.current.addEventListener("wheel", handleWheel);

  //   return () => {
  //     if (rootRef.current)
  //       rootRef.current.removeEventListener("wheel", handleWheel);
  //   };
  // }, [navIsOpen]);

  // useEffect(() => {
  //   function handleClick(event) {
  //     setNavIsOpen(false);
  //   }

  //   if (rootRef.current) rootRef.current.addEventListener("click", handleClick);

  //   return () => {
  //     if (rootRef.current)
  //       rootRef.current.removeEventListener("click", handleClick);
  //   };
  // }, [navIsOpen]);

  const scrollTo = (sectionName) => {
    document.getElementById(sectionName).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.navigationRoot} ref={rootRef}>
      <div className={styles.TopbarContainer}>
        <button
          className={styles.OpenNavButton}
          onClick={() => {
            setNavIsOpen(!navIsOpen);
          }}
          style={{
            transform: navIsOpen
              ? "translateX(calc(97vw - 100%))"
              : "translateX(0)",
          }}
        >
          <img src={navIsOpen ? Close : Menu} className={styles.SettingsIcon} />
        </button>
      </div>
      <div
        className={`${styles.navigationRootContainer} ${
          navIsOpen ? "" : "NoUserSelect"
        }`}
        style={{
          opacity: navIsOpen ? "1" : "0",
        }}
      >
        <div className={styles.sidebarContainer}>
          <h1
            className={styles.Title}
            style={{
              transform: navIsOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            Kaito Sugimura
          </h1>
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
              {section.title}
            </li>
            ))}
          </ul>
          <ul
            className={`${styles.credList} ${styles.list}`}
            style={{
              transform: navIsOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <li className={`${styles.credItem} ${styles.listItem}`}>
              Developed from scratch using: REACT, JS, CSS, HTML
            </li>
            <li className={`${styles.credItem} ${styles.listItem}`}>
              By: Kaito Sugimura
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
