import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import Sections from "./HomeTableOfContents.jsx";
import Navigation from "../../Components/Navigation";

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const blockScroll = useRef(false);
  const TouchMoveStartY = useRef(0);
  const TouchMoveStartTime = useRef(0);
  const scrollTo = (index) => {
    setCurrentSection(index);
  };

  useEffect(() => {
    const handleScroll = (event) => {
      if (!blockScroll.current) {
        setCurrentSection((prev) => {
          if (event.deltaY > 0) {
            return Math.min(Math.max(++prev, 0), Sections.length - 1);
          } else {
            return Math.min(Math.max(--prev, 0), Sections.length - 1);
          }
        });
        blockScroll.current = true;
        setTimeout(() => {
          blockScroll.current = false;
        }, 200);
      }
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      const currentY = touch.pageY;
      const currentTime = Date.now();

      const deltaY = currentY - TouchMoveStartY.current;
      const deltaTime = currentTime - TouchMoveStartTime.current;

      const velocityY = deltaY / deltaTime;

      TouchMoveStartY.current = touch.pageY;
      TouchMoveStartTime.current = currentTime;

      if (Math.abs(velocityY) > 0.5 && !blockScroll.current) {
        setCurrentSection((prev) => {
          if (velocityY < 0.5) {
            return Math.min(Math.max(++prev, 0), Sections.length - 1);
          } else if(velocityY > 0.5) {
            return Math.min(Math.max(--prev, 0), Sections.length - 1);
          }
        });
        blockScroll.current = true;
        setTimeout(() => {
          blockScroll.current = false;
        }, 200);
      }
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      TouchMoveStartY.current = touch.pageY;
      TouchMoveStartTime.current = Date.now();
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <div className={styles.HomeScroller}>
      <Navigation scrollTo={scrollTo} currentSectionIndex={currentSection} />
      <div className={styles.HomeRoot}>
        {Sections.map((section, index) => (
          <div
            className={styles.SectionContainer}
            id={section.title}
            key={index}
            style={{
              transform: `translateY(-${currentSection * 100}vh)`,
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {section.XML}
          </div>
        ))}
      </div>
    </div>
  );
}
