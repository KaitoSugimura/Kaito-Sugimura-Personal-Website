import React, { useContext, useRef } from "react";
import styles from "./SoundSetting.module.css";
import { SoundContext } from "../Context/SoundContext";

export default function SoundSetting({ style }) {
  const { volume, setVolume } = useContext(SoundContext);
  const previousVolume = useRef(volume);

  return (
    <div className={styles.SoundSetting} style={style}>
      <button
        className={styles.SoundButton}
        onClick={() => {
          if (volume == 0) {
            setVolume(previousVolume.current);
          } else {
            setVolume(0);
            previousVolume.current = volume;
          }
        }}
      >
        {volume == 0 ? (
          <img
            className={styles.SoundIcon}
            src="/Home/Icons/SoundOff.svg"
            onDrag={(e) => {
              e.preventDefault();
            }}
          />
        ) : (
          <img
            className={styles.SoundIcon}
            src="/Home/Icons/Sound.svg"
            onDrag={(e) => {
              e.preventDefault();
            }}
          />
        )}
      </button>
      <div className={styles.SoundSliderCont}>
        <input
          className={styles.input}
          type="range"
          min="0"
          max="100"
          onChange={(e) => setVolume((e.target.value * 0.01).toFixed(2))}
          value={volume * 100}
        />
        <span className={styles.amount}>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}
