import { useContext, useRef, useState } from "react";
import styles from "./DialogMain.module.css";
import Dialogs from "./Dialogs";
import { SoundContext } from "../../Context/SoundContext";
import SoundSetting from "../../Tools/SoundSetting";

export default function DialogMain({ DialogID, eventFinishedCallback }) {
  const { playSFX, playMusic } = useContext(SoundContext);
  const [currentTextNo, setCurrentTextNo] = useState(0);

  const handleDialogClick = () => {
    playSFX("DialogClick");
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
    for (let i = currentTextNo + 1; i < Dialogs[DialogID].length; ++i) {
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
          top: "7vmin",
          left: "10vmin",
        }}
      />
      <button className={styles.SkipContainer} onClick={skipDialog}>
        <span>Skip</span>
        <img
          className={styles.SkipIcon}
          src="/Home/Icons/Skip.svg"
          onDrag={(e) => {
            e.preventDefault();
          }}
        />
      </button>
      <div className={styles.DialogClickArea} onClick={handleDialogClick}>
        <div className={styles.DialogContainer}>
          {currentTextNo < Dialogs[DialogID].length && (
            <>
              {/* <h1 className={styles.DialogSpeakerName}>{
              Dialogs[DialogID][currentTextNo].speaker}</h1> */}
              <p className={styles.DialogText} key={currentTextNo}>
                <span>{Dialogs[DialogID][currentTextNo].speaker+": "}</span>
                {Dialogs[DialogID][currentTextNo].text}
                {playMusic(Dialogs[DialogID][currentTextNo].music)}
              </p>
            </>
          )}
          <div className={styles.DownTriangle}></div>
        </div>
        {currentTextNo < Dialogs[DialogID].length &&
          Dialogs[DialogID][currentTextNo].image && (
            <img
              src={`/Dialog/Pictures/${Dialogs[DialogID][currentTextNo].image}`}
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
