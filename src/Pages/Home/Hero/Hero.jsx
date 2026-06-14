import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import BGVideo from "/Backgrounds/HeroBGVideo.mp4";
import LoadingScreen from "../../../Components/LoadingScreen";
import coverPhoto from "/Dialog/Pictures/Cover.webp";
import { SoundContext } from "../../../Context/SoundContext";
import { scrollContext } from "../scrollContext";
import { HERO_INTRO_DURATION_MS } from "../../../timings";

export default function Hero({ isfocus }) {
  isfocus = isfocus === "true";
  const { playSFX } = useContext(SoundContext);
  const { currentSection } = useContext(scrollContext);
  const [UserAuthenticated, setUserAuthenticated] = useState(false);
  const [BGVideoIsLoading, setBGVideoIsLoading] = useState(true);

  const RootRef = useRef(null);

  const AnimPlayHandle = useCallback(
    (e) => {
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
    },
    [playSFX]
  );

  useEffect(() => {
    if (currentSection !== 0 && !UserAuthenticated) {
      setUserAuthenticated(true);
    }
    if (!isfocus) {
      setBGVideoIsLoading(true);
    }
  }, [currentSection, isfocus, UserAuthenticated]);

  // After the intro animation finishes, mark the user as authenticated. Once
  // authenticated the intro DOM unmounts, which removes its animation listener.
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserAuthenticated(true);
    }, HERO_INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = RootRef.current;
    if (!root) return;
    root.addEventListener("animationstart", AnimPlayHandle);
    return () => {
      root.removeEventListener("animationstart", AnimPlayHandle);
    };
  }, [AnimPlayHandle]);

  return (
    <div className={styles.HeroRoot} style={{ height: "100dvh" }}>
      {UserAuthenticated ? (
        <>
          {BGVideoIsLoading ? (
            <>
              <LoadingScreen backgroundColor={"rgba(0, 0, 0, 0.428)"} />
              <div className={styles.grid}>
                <img
                  src="/Backgrounds/Mountains.jpg"
                  alt=""
                  className={styles.backgroundImage}
                ></img>
              </div>
            </>
          ) : (
            <>
              <img
                src={coverPhoto}
                alt="Kaito Sugimura"
                className={styles.coverPhoto}
              ></img>
              <h1 className={styles.name}>Kaito Sugimura</h1>
              <p className={styles.catchphrase}>
                Software engineer in Calgary, building for the web.
              </p>
            </>
          )}

          {isfocus ? (
            <div className={styles.grid}>
              <video
                className={styles.backgroundVideo}
                poster="/Backgrounds/Mountains.jpg"
                onLoadedData={() => {
                  setTimeout(() => {
                    setBGVideoIsLoading(false);
                  }, 300);
                }}
                autoPlay
                muted
                loop
                playsInline
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
          <div className={styles.grid}>
            <img
              src="/Backgrounds/Mountains.jpg"
              className={styles.backgroundImage}
            ></img>
          </div>

          <div className={styles.Warning}></div>
          {/* Separated to make things stable */}
          <div className={styles.WarningInnerText}>
            <p className={styles.unknownUser}>
              <img src="/Home/Icons/Warning.svg" alt=""></img>Unknown User
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
        </div>
      )}
    </div>
  );
}
