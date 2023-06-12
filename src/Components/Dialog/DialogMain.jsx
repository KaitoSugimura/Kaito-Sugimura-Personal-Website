import { useContext, useRef, useState } from "react";
import styles from "./DialogMain.module.css";
import Dialogs from "./Dialogs";
import { SoundContext } from "../../Context/SoundContext";
import SoundSetting from "../../Tools/SoundSetting";

export default function DialogMain({ DialogID, eventFinishedCallback }) {
  const [currentTextNo, setCurrentTextNo] = useState(0);
  const { playDialogClick, playMusic } = useContext(SoundContext);

  const handleDialogClick = () => {
    playDialogClick();
    setCurrentTextNo((prev) => {
      ++prev;
      if (prev == Dialogs[DialogID].length) {
        eventFinishedCallback();
      }
      return prev;
    });
  };

  return (
    <div className={styles.DialogRoot}>

      <div className={styles.DialogClickArea} onClick={handleDialogClick}>
        <div className={styles.DialogContainer}>
          <div className={styles.DownTriangle}></div>
          <p className={styles.DialogText} key={currentTextNo}>
            {Dialogs[DialogID][currentTextNo].text}{playMusic(Dialogs[DialogID][currentTextNo].music)}
          </p>
        </div>
      </div>
    </div>
  );
}
