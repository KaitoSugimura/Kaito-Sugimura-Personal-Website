import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import Projects from "./Projects/Projects";
import Education from "./Education/Education";
import Sections from "./HomeTableOfContents.jsx";

export default function Home() {
  const currentSectionRef = useRef(0);
  const scrollTo = (sectionName) => {
    document.getElementById(sectionName).scrollIntoView({ behavior: "smooth" });
  };
  const [a, s] = useState(Date.now());

  useEffect(() => {
    const handleScroll = (event) => {
      if (event.deltaY > 0) {
        ++currentSectionRef.current;
      } else {
        --currentSectionRef.current;
      }
      currentSectionRef.current = Math.min(
        Math.max(currentSectionRef.current, 0),
        Sections.length - 1
      );

      s(Date.now());
    };

    // Add the scroll event listener when the component mounts
    window.addEventListener("wheel", handleScroll);
    scrollTo("Home");

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <div className={styles.HomeScroller}>
      <div className={styles.HomeRoot}>
        {Sections.map((section, index) => (
          <div
            className={styles.SectionContainer}
            id={section.title}
            key={index}
            style={{
              transform: `translateY(-${currentSectionRef.current * 100}vh)`,
              transition: "transform 0.3s ease-in-out"
            }}
          >
            {section.XML}
          </div>
        ))}
      </div>
    </div>
  );
}
