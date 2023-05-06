import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import Projects from "./Projects/Projects";

export default function Home() {
  return (
    <div className={styles.HomeRoot}>
      <div className={styles.tempBuffer}></div>

      <div className={styles.ProjectsContainer}>
        <Projects />
      </div>

      <div className={styles.tempBuffer}></div>
    </div>
  );
}
