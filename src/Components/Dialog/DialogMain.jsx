import { useContext, useEffect, useState } from "react";
import styles from "./DialogMain.module.css";
import Dialogs from "./Dialogs";
import { SoundContext } from "../../Context/SoundContext";
import SoundSetting from "../../Tools/SoundSetting";

export default function DialogMain({ DialogID, eventFinishedCallback }) {
  const { playSFX, playMusic } = useContext(SoundContext);
  const [currentTextNo, setCurrentTextNo] = useState(0);

  // Guard against an unknown DialogID so indexing/`.length` can never throw.
  const lines = Dialogs[DialogID] ?? [];

  // Play the music cue (if any) for the current dialog line. Kept in an effect
  // so it doesn't fire as a side effect during render.
  const currentLine = lines[currentTextNo];
  useEffect(() => {
    if (currentLine?.music) {
      playMusic(currentLine.music);
    }
  }, [currentLine, playMusic]);

  const handleDialogClick = () => {
    playSFX("DialogClick");
    if (currentTextNo + 1 === lines.length) {
      eventFinishedCallback();
    } else {
      setCurrentTextNo((prev) => prev + 1);
    }
  };

  const skipDialog = () => {
    let musicToPlay = null;
    for (let i = currentTextNo + 1; i < lines.length; ++i) {
      if (lines[i].music) {
        musicToPlay = lines[i].music;
      }
    }
    playMusic(musicToPlay);
    eventFinishedCallback();
  };

  return (
    <div className={styles.DialogRoot}>
      <SoundSetting
        style={{
          top: "7vmin",
          left: "10vmin",
        }}
      />
      <button className={styles.SkipContainer} onClick={skipDialog}>
        <span>Skip</span>
        <img
          className={styles.SkipIcon}
          src="/Home/Icons/Skip.svg"
          alt=""
          onDrag={(e) => {
            e.preventDefault();
          }}
        />
      </button>
      <div className={styles.DialogClickArea} onClick={handleDialogClick}>
        <div className={styles.DialogContainer}>
          {currentLine && (
            <p className={styles.DialogText} key={currentTextNo}>
              <span>{currentLine.speaker + ": "}</span>
              {currentLine.text}
            </p>
          )}
          <div className={styles.DownTriangle}></div>
        </div>
        {currentLine && currentLine.image && (
          <img
            src={`/Dialog/Pictures/${currentLine.image}`}
            alt={currentLine.speaker}
            className={styles.DialogImage}
            onDrag={(e) => {
              e.preventDefault();
            }}
          ></img>
        )}
      </div>
    </div>
  );
}
