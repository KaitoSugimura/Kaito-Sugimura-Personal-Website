import { useEffect, useState } from "react";
import styles from "./Hero.module.css";
import BGVideo from "/Backgrounds/HeroBGVideo.mp4";

export default function Hero() {
  const [UserAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setUserAuthenticated(true);
    }, 8500);
  }, []);

  return (
    <div className={styles.HeroRoot}>
      <div className={styles.blackBackground}></div>
      {UserAuthenticated ? (
        <>
          <video
            className={styles.backgroundVideo}
            src={BGVideo}
            autoPlay
            muted
            loop
          />
          <h1 className={styles.name}>Kaito Sugimura</h1>
          <p className={styles.catchphrase}>
            Unleashing Immersive Worlds through Programming and Creativity
          </p>
        </>
      ) : (
        <>
          <div className={styles.backgroundImage}></div>
          <div className={styles.Warning}></div>
          {/* Seperated to make things stable */}
          <p className={styles.WarningInnerText}>
            <p className={styles.unknownUser}>
              <img src="/Home/Icons/Warning.svg"></img>Unknown User
            </p>
            <p className={styles.Authenticated}>Authenticated</p>
          </p>
          <div className={styles.commandPrompt}>
            <div className={styles.cmdT1}>
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "2.4s",
                }}
              >
                {">"} net access sky terminal
              </p>
              <br />
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "2.6s",
                }}
              >
                Access is denied.
              </p>
              <br />
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "3.2s",
                }}
              >
                {">"} /force
              </p>
              <br />
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "3.3s",
                }}
              >
                Updating policy...
              </p>
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "3.8s",
                }}
              >
                Computer policy update has completed successfully.
              </p>
              <br />
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "4.3s",
                }}
              >
                {">"} Install 'Kaito Sugimura'
              </p>
              <br />
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "4.5s",
                }}
              >
                Starting package install..
              </p>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <div className={styles.cmdT2}>
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "6.2s",
                }}
              >
                Successfully installed.
              </p>
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "6.3s",
                }}
              >
                Would you like to replace the current package? (Y/N)
              </p>
              <br />
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "6.8s",
                }}
              >
                {"> Y"}
              </p>
              <br />
              <p
                className={styles.cmdLine}
                style={{
                  animationDelay: "7s",
                }}
              >
                Replacing package...
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
