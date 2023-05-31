import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import Projects from "./Projects/Projects";
import Education from "./Education/Education";
import Sections from "./HomeTableOfContents.jsx";

export default function Home() {
  return (
    <>
      <img
        className={styles.backgroundImage}
        src="/Backgrounds/Sphere.png"
      ></img>
      <div className={styles.HomeRoot}>
        {Sections.map((section, index) => (
          <div
            className={styles.SectionContainer}
            id={section.title}
            key={index}
          >
            {section.XML}
          </div>
        ))}
      </div>
    </>
  );
}
