import { useContext, useRef, useState } from "react";
import styles from "./DialogMain.module.css";
import Dialogs from "./Dialogs";
import { SoundContext } from "../../Context/SoundContext";
import SoundSetting from "../../Tools/SoundSetting";

export default function DialogMain({ DialogID, eventFinishedCallback }) {
  const { playDialogClick, playMusic } = useContext(SoundContext);
  const [currentTextNo, setCurrentTextNo] = useState(0);

  const handleDialogClick = () => {
    playDialogClick();
    if (currentTextNo + 1 == Dialogs[DialogID].length) {
      eventFinishedCallback();
    } else {
      setCurrentTextNo((prev) => {
        ++prev;
        return prev;
      });
    }
  };

  const skipDialog = () => {
    let musicToPlay = null;
    for (let i = currentTextNo+1; i < Dialogs[DialogID].length; ++i) {
      const obj = Dialogs[DialogID][i];
      if (obj.music) {
        musicToPlay = obj.music;
      }
    }
    playMusic(musicToPlay);
    eventFinishedCallback();
  };

  return (
    <div className={styles.DialogRoot}>
      <SoundSetting
        style={{
          top: "3rem",
          left: "3rem",
        }}
      />
      <button className={styles.SkipButton} onClick={skipDialog}>
        <img
          className={styles.SoundIcon}
          src="/Home/Icons/Skip.svg"
          onDrag={(e) => {
            e.preventDefault();
          }}
        />
      </button>
      <div className={styles.DialogClickArea} onClick={handleDialogClick}>
        <div className={styles.DialogContainer}>
          <div className={styles.DownTriangle}></div>
          {currentTextNo < Dialogs[DialogID].length && (
            <p className={styles.DialogText} key={currentTextNo}>
              {Dialogs[DialogID][currentTextNo].text}
              {playMusic(Dialogs[DialogID][currentTextNo].music)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
