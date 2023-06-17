import React, { useEffect, useRef, useState } from "react";
import styles from "./ProjectDesc.module.css";
import { transform } from "typescript";

export default function ProjectDesc({
  clickEventSub,
  index,
  setSelectionAtIndex,
  desc,
}) {
  let maxWidth = 32.0;
  let [currWidth, setCurrWidth] = useState(0);
  let isRunning = useRef(false);
  let shouldOpen = useRef(true);
  let currWidthRef = useRef(0);

  let [displayInside, setDisplayInside] = useState(false);

  const clickHandler = () => {
    setSelectionAtIndex(shouldOpen.current, index);
    if (isRunning.current) {
      shouldOpen.current = !shouldOpen.current;
    } else {
      isRunning.current = true;
      const Interval = setInterval(() => {
        if (!isRunning.current) {
          return;
        }
        if (shouldOpen.current) {
          setDisplayInside(false);
          currWidthRef.current = Math.min(currWidthRef.current + 1, maxWidth);
          if (currWidthRef.current == maxWidth) {
            shouldOpen.current = false;
            isRunning.current = false;
            clearInterval(Interval);
            setDisplayInside(true);
          }
        } else {
          setDisplayInside(false);
          currWidthRef.current = Math.max(currWidthRef.current - 1, 0);
          if (currWidthRef.current == 0) {
            shouldOpen.current = true;
            isRunning.current = false;
            clearInterval(Interval);
          }
        }
        setCurrWidth(currWidthRef.current);
      }, 10);
    }
  };

  useEffect(() => {
    clickEventSub(clickHandler, index);
  }, []);

  return (
    <div
      className={styles.ProjectDescRoot}
      style={{
        display: currWidth > 0 ? "block" : "none",
      }}
    >
      <div
        className={styles.descContainer}
        style={{
          minWidth: currWidth + "vw",
        }}
      >
        {displayInside && <div
          style={{
            transform: "skewX(7deg)",
          }}
        >
          <p className={styles.desc}>{desc}</p>
        </div>}
      </div>
      {displayInside && (
        <div className={styles.youtubeVideo}>
          <iframe
            src="https://www.youtube.com/embed/J1YpuKkc3ng"
            title="Adding RPG features to my Coin Dozer game | Devlog #4"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          ></iframe>
        </div>
      )}
    </div>
  );
}
