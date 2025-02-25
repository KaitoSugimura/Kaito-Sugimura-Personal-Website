import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import BGVideo from "/Backgrounds/HeroBGVideo.mp4";
import LoadingScreen from "../../../Components/LoadingScreen";
import coverPhoto from "/Dialog/Pictures/Cover.png";
import { SoundContext } from "../../../Context/SoundContext";
import { scrollContext } from "../Home";

export default function Hero({ isfocus }) {
  isfocus = isfocus === "true";
  const { playSFX } = useContext(SoundContext);
  const { currentSection } = useContext(scrollContext);
  const [UserAuthenticated, setUserAuthenticated] = useState(false);
  const [BGVideoIsLoading, setBGVideoIsLoading] = useState(true);

  const RootRef = useRef(null);

  useEffect(() => {
    if (currentSection != 0 && !UserAuthenticated) {
      setUserAuthenticated(true);
      if (RootRef.current) {
        RootRef.current.removeEventListener("animationstart", AnimPlayHandle);
      }
    }
    if (!isfocus) {
      setBGVideoIsLoading(true);
    }
  }, [currentSection]);

  useEffect(() => {
    setTimeout(() => {
      setUserAuthenticated(true);
      if (RootRef.current) {
        RootRef.current.removeEventListener("animationstart", AnimPlayHandle);
      }
    }, 5200);
  }, []);

  const AnimPlayHandle = (e) => {
    switch (e.animationName) {
      case styles.typing:
        playSFX("BackClick");
        break;
      case styles.open:
        playSFX("AuthOpen");
        break;
      case styles.warningInit:
        playSFX("WarningInit");
        break;
      case styles.select:
        playSFX("Select");
        break;
      case styles.authenticated:
        playSFX("Welcome");
        break;
      case styles.typingInput:
        playSFX("Typing");
        break;
      case styles.barFill:
        playSFX("BarFill");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (RootRef.current) {
      RootRef.current.addEventListener("animationstart", AnimPlayHandle);
    }

    return () => {
      if (RootRef.current) {
        RootRef.current.removeEventListener("animationstart", AnimPlayHandle);
      }
    };
  }, []);

  const cmdTexts1 = [
    "> Accessing sky terminal",
    "> Updating policy...",
    "> Computer policy update has completed successfully",
    "> Executing command: 'ksp install'",
    "> Starting package install...",
  ];

  const cmdTexts1Timings = [5, 5.4, 5.8, 5.9, 6];

  const cmdTexts2 = [
    `> Kaito 3.6.0 (default, ${new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })})`,
    "> Successfully installed",
    "> ",
    "> Preparing...",
  ];

  const cmdTexts2Timings = [8, 8.1, 8.15, 8.2];

  return (
    <div
      className={styles.HeroRoot}
      style={{
        height: `${window.innerHeight}px`,
      }}
    >
      {UserAuthenticated ? (
        <>
          {BGVideoIsLoading ? (
            <>
              <LoadingScreen backgroundColor={"rgba(0, 0, 0, 0.428)"} />
              <img
                src="/Backgrounds/Sphere.webp"
                className={styles.backgroundImage}
              ></img>
            </>
          ) : (
            <>
              <img src={coverPhoto} className={styles.coverPhoto}></img>
              <h1 className={styles.name}>Kaito Sugimura</h1>
              <p className={styles.catchphrase}>
                Unleashing Immersive Worlds through Programming and Creativity
              </p>
            </>
          )}

          {isfocus ? (
            <div className={styles.grid}>
              <video
                className={styles.backgroundVideo}
                onLoadedData={() => {
                  setTimeout(() => {
                    setBGVideoIsLoading(false);
                  }, 300);
                }}
                autoPlay
                muted
                loop
              >
                <source src={BGVideo} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className={styles.blackBackground}></div>
          )}
        </>
      ) : (
        <div ref={RootRef}>
          <img
            src="/Backgrounds/Sphere.webp"
            className={styles.backgroundImage}
          ></img>
          <div className={styles.Warning}></div>
          {/* Seperated to make things stable */}
          <div className={styles.WarningInnerText}>
            <p className={styles.unknownUser}>
              <img src="/Home/Icons/Warning.svg"></img>Unknown User
            </p>
            <p className={styles.Authenticated}>Authenticated</p>
          </div>

          <div className={styles.switchUser}>
            <ul className={styles.UsersList}>
              <li
                className={`${styles.User} ${styles.UserNone}`}
                style={{
                  animationDelay: `1.8s`,
                }}
              >
                None
                <span
                  style={{
                    animationDelay: `1.8s`,
                  }}
                >
                  {"< "}
                </span>
              </li>
              <li
                className={`${styles.User} ${styles.UserGuest}`}
                style={{
                  animationDelay: `1.8s`,
                }}
              >
                Guest{" "}
                <span
                  style={{
                    animationDelay: `1.8s`,
                  }}
                >
                  {"< "}
                </span>
              </li>
              <li
                className={`${styles.User} ${styles.UserAdmin}`}
                style={{
                  animationDelay: `1.95s`,
                }}
              >
                Admin{" "}
                <span
                  style={{
                    animationDelay: `1.95s`,
                  }}
                >
                  {"< "}
                </span>
              </li>
            </ul>
            <div className={styles.SignInCont}>
              <div className={styles.SignInItem}>
                USERNAME:
                <div className={styles.InputTextWrapper}>
                  <p className={`${styles.InputText} ${styles.InputTextUser}`}>
                    Kaito Sugimura
                  </p>
                </div>
              </div>
              <div className={styles.SignInItem}>
                PASSWORD:
                <div className={styles.InputTextWrapper}>
                  <p className={`${styles.InputText} ${styles.InputTextPass}`}>
                    *********
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className={styles.commandPrompt}>
            <div className={styles.cmdT1}>
              {cmdTexts1.map((text, index) => {
                return (
                  <div className={styles.cmdLineWrapper} key={index}>
                    <p
                      className={styles.cmdLine}
                      style={{
                        animation: `${styles.typing} 0.1s forwards ${cmdTexts1Timings[index]}s`,
                      }}
                    >
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <div className={styles.cmdT2}>
              {cmdTexts2.map((text, index) => {
                return (
                  <div className={styles.cmdLineWrapper} key={index}>
                    <p
                      className={styles.cmdLine}
                      style={{
                        animation: `${styles.typing} 0.1s forwards ${cmdTexts2Timings[index]}s`,
                      }}
                    >
                      {text}
                    </p>
                  </div>
                );
              })}
  
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
