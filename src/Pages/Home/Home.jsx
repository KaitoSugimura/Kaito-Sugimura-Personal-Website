import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import Projects from "./Projects/Projects";
import Education from "./Education/Education";
import Sections from "./HomeTableOfContents.jsx";

export default function Home() {
  return (
    <div className={styles.HomeRoot}>
      <div className={styles.tempBuffer}></div>

      {Sections.map((section, index) => (
        <>
          <div
            className={styles.SectionContainer}
            id={section.title}
            key={`A_${index}`} // NEED TO BE RE DONE AND CREATE UNQIUE KEYS
          >
            {section.XML}
          </div>

          <div className={styles.tempBuffer} key={`B_${index}`}></div>
        </>
      ))}

      {/* <div className={styles.ProjectsContainer} id="Education">
        <Education />
      </div>

      <div className={styles.tempBuffer}></div>

      <div className={styles.ProjectsContainer} id="Projects">
        <Projects />
      </div> */}

      <div className={styles.tempBuffer}></div>
    </div>
  );
}
