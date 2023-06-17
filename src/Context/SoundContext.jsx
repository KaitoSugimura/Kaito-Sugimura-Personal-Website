import { createContext, useEffect, useRef, useState } from "react";
import DialogClick from "/Dialog/Sound/DialogClick.wav";
import defaultBGM from "/Dialog/Music/Anima_Circulation.mp3";
import profileBGM from "/Dialog/Music/Flutter.mp3";
import projectsBGM from "/Dialog/Music/Bouquet.mp3";
import ButtonClick from "/Dialog/Sound/click-button.mp3";
import PaperFlip from "/Dialog/Sound/page-flipping-foley-sound.mp3";
import MenuOpen from "/Dialog/Sound/interface-soft-abbreviated-click.mp3";
import Spray from "/Dialog/Sound/the-aerosol-spray.mp3";

export const SoundContext = createContext();

export const SoundContextProvider = ({ children }) => {
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const currentTimeRef = useRef(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.currentTime = currentTimeRef.current;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    currentTimeRef.current = audioRef.current.currentTime;
  };

  const playSFX = (sfxName) => {
    let playPath = null;
    switch (sfxName) {
      case "DialogClick":
        playPath = DialogClick;
        break;
      case "ButtonClick":
        playPath = ButtonClick;
        break;
      case "PaperFlip":
        playPath = PaperFlip;
        break;
      case "MenuOpen":
        playPath = MenuOpen;
        break;
      case "Spray":
        playPath = Spray;
        break;
    }
    if (playPath == null) {
      return;
    }

    const audio = new Audio(playPath);
    audio.volume = volume;
    audio.play();
  };

  const playMusic = (musicName) => {
    if (musicName == null || audioRef.current == null) {
      return;
    } 
    audioRef.current.volume = volume;
    if (musicName === "resume") {
      audioRef.current.currentTime = currentTimeRef.current;
      audioRef.current.play();
      return;
    }
    switch (musicName) {
      case "main":
        audioRef.current.src = defaultBGM;
        break;
      case "profile":
        audioRef.current.src = profileBGM;
        break;
      case "projects":
        audioRef.current.src = projectsBGM;
        break;
    }

    audioRef.current.play();
  };

  const stopMusic = () => {
    if (audioRef.current == null) {
      return;
    }
    audioRef.current.pause();
  }

  return (
    <SoundContext.Provider
      value={{
        volume,
        setVolume,
        playMusic,
        stopMusic,
        playSFX,
      }}
    >
      <audio
        src={defaultBGM}
        ref={audioRef}
        loop="loop"
        onTimeUpdate={handleTimeUpdate}
      />
      {children}
    </SoundContext.Provider>
  );
};
