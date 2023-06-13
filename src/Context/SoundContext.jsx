import { createContext, useEffect, useRef, useState } from "react";
import DialogClick from "/Dialog/Sound/DialogClick.wav";
import defaultBGM from "/Dialog/Music/Anima_Circulation.mp3";
import profileBGM from "/Dialog/Music/Flutter.mp3";
import projectsBGM from "/Dialog/Music/Bouquet.mp3";

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

  const playDialogClick = () => {
    const audio = new Audio(DialogClick);
    audio.volume = volume;
    audio.play();
  };

  const playMusic = (musicName) => {
    if (musicName == null || audioRef.current == null) {
      return;
    }
    audioRef.current.volume = volume;
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

  return (
    <SoundContext.Provider
      value={{ volume, setVolume, playDialogClick, playMusic }}
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
