import styles from "./CameraUI.module.css";
import CornerBorder from "./CornerBorder";
import Sections from "../../Pages/Home/HomeTableOfContents.jsx";
import { useEffect, useRef, useState } from "react";

// Reveals `text` one character at a time, terminal style. Returns the partial
// string plus whether it's still printing so the caret can show only while typing.
//
// The first reveal after mount types immediately (boot title, and the remount
// after a dialog closes). A title change while already mounted waits `startDelay`
// before typing — longer than the dialog open delay (300ms in Overlay) — so when
// scrolling onto a section that opens a dialog, the HUD unmounts before the title
// ever appears instead of flashing the title for a moment first.
function useTypewriter(text, { speed = 65, startDelay = 400 } = {}) {
  const [display, setDisplay] = useState("");
  const [typing, setTyping] = useState(false);
  const hasTypedRef = useRef(false);

  useEffect(() => {
    if (text == null) {
      setDisplay("");
      setTyping(false);
      return;
    }

    const delay = hasTypedRef.current ? startDelay : 0;
    hasTypedRef.current = true;

    setDisplay("");
    setTyping(false);
    let i = 0;
    let interval;
    const startTimer = setTimeout(() => {
      setTyping(true);
      interval = setInterval(() => {
        i++;
        setDisplay(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setTyping(false);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { display, typing };
}

export default function CameraUI({ navIsOpen, currentSectionIndex, initDone, hideChrome }) {
  const sectionTitle = initDone ? Sections[currentSectionIndex].title : null;
  const { display: typedTitle, typing } = useTypewriter(sectionTitle);

  const BorderStyle = {
    width: navIsOpen ? "12vmin" : "22vmin",
    height: navIsOpen ? "12vmin" : "22vmin",
    borderWidth: "1.5px",
  };
  const StaticBorder = {
    width: "1.5vmin",
    height: "1.5vmin",
    borderColor: "#fffd",
    borderWidth: "1px",
  };

  return (
    <div className={styles.cameraUIRoot}>
      <div
        className={`${styles.cameraUIContainer} ${
          initDone ? "" : styles.UIanim
        } ${hideChrome ? styles.chromeHidden : ""}`}
      >
        <CornerBorder style={BorderStyle} />
        {!navIsOpen && (
          <div className={`${styles.cameraUIMainContainer}`}>
            <div
              className={`${styles.MainSection} ${
                initDone ? styles.MainSectionDefault : styles.MainSectionAnim
              }`}
            >
              <CornerBorder style={StaticBorder} />
              <div className={styles.MainSectionBackground}>
                <p className={styles.MainSectionText}>
                  {initDone ? (
                    <>
                      {typedTitle}
                      {typing && <span className={styles.titleCaret}></span>}
                    </>
                  ) : (
                    "Initializing"
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className={styles.cameraUITopRightContainer}>
          {initDone && (
            <p className={styles.fadeInAnim}>
              Page {currentSectionIndex + 1}/{Sections.length}
            </p>
          )}
        </div>
        {initDone && (
          <div className={styles.SSList}>
            <a
              className={styles.SSItem}
              href="https://www.youtube.com/@sugimurakaito"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Home/Icons/SS/Youtube.svg"
                alt="YouTube"
                className={styles.SSImage}
                onDrag={(e) => {
                  e.preventDefault();
                }}
              />
            </a>
            <a
              className={styles.SSItem}
              href="https://github.com/KaitoSugimura"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Home/Icons/SS/Github.svg"
                alt="GitHub"
                className={styles.SSImage}
                onDrag={(e) => {
                  e.preventDefault();
                }}
              />
            </a>

            <a
              className={styles.SSItem}
              href="https://www.linkedin.com/in/kaitosugimura/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Home/Icons/SS/Linkedin.svg"
                alt="LinkedIn"
                className={styles.SSImage}
                onDrag={(e) => {
                  e.preventDefault();
                }}
              />
            </a>
          </div>
        )}
        <div className={styles.cameraUIBottomLeftContainer}>
          {!initDone && (
            <>
              <div className={styles.typingWrapping1}>
                <p>System access</p>
              </div>
              <div className={styles.typingWrapping2}>
                <p>Initialization complete</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
