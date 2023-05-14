import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import Projects from "./Projects/Projects";
import Education from "./Education/Education";

export default function Home() {

  return (
    <div className={styles.HomeRoot}>
      <div className={styles.tempBuffer}></div>

      <div className={styles.ProjectsContainer} id="Education">
        <Education />
      </div>

      <div className={styles.tempBuffer}></div>

      <div className={styles.ProjectsContainer} id="Projects">
        <Projects />
      </div>

      <div className={styles.tempBuffer}></div>
    </div>
  );
}
