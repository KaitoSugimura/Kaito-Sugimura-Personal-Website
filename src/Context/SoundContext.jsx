import { createContext, useEffect, useRef, useState } from "react";
// Music
import defaultBGM from "/Dialog/Music/Anima_Circulation.mp3";
import profileBGM from "/Dialog/Music/Flutter.mp3";
import projectsBGM from "/Dialog/Music/Bouquet.mp3";
import WarmLoopBGM from "/Dialog/Music/WarmLoop.wav";
// Sound
import DialogClick from "/Dialog/Sound/DialogClick.wav";
import ButtonClick from "/Dialog/Sound/click-button.mp3";
import MetalClick from "/Dialog/Sound/MetalClick.wav";
import MenuOpen from "/Dialog/Sound/interface-soft-abbreviated-click.mp3";
import BackClick from "/Dialog/Sound/BackClick.wav";
import EquipArtifact from "/Dialog/Sound/EquipArtifact.wav";
import artifactPickup from "/Dialog/Sound/ArtifactPickup.wav";
import artifactDrop from "/Dialog/Sound/ArtifactDrop.wav";
import ProfileClick from "/Dialog/Sound/ProfileClick.wav";
import Typing from "/Dialog/Sound/UI/Typing.wav";
import BarFill from "/Dialog/Sound/UI/BarFill.wav";
import AuthOpen from "/Dialog/Sound/UI/AuthOpen.wav";
import Authenticated from "/Dialog/Sound/UI/Authenticated.wav";
import WarningInit from "/Dialog/Sound/UI/WarningInit.wav";
import Welcome from "/Dialog/Sound/UI/Welcome.wav";
import Select from "/Dialog/Sound/UI/Select.wav";
import SelectConfirm from "/Dialog/Sound/UI/SelectConfirm.wav";

const soundList = {
  DialogClick: DialogClick,
  ButtonClick: ButtonClick,
  MetalClick: MetalClick,
  MenuOpen: MenuOpen,
  BackClick: BackClick,
  EquipArtifact: EquipArtifact,
  artifactPickup: artifactPickup,
  artifactDrop: artifactDrop,
  ProfileClick: ProfileClick,
  Typing: Typing,
  BarFill: BarFill,
  Authenticated: Authenticated,
  WarningInit: WarningInit,
  Welcome: Welcome,
  Select: Select,
  SelectConfirm: SelectConfirm,
  AuthOpen: AuthOpen,
};

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
    const playPath = soundList[sfxName];
    if (playPath) {
      const audio = new Audio(playPath);
      audio.volume = audioRef.current.volume;
      audio.play();
    }
  };

  const playMusic = (musicName) => {
    if (musicName == null || audioRef.current == null) {
      return;
    }
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
      case "warmLoop":
        audioRef.current.src = WarmLoopBGM;
        break;
    }

    audioRef.current.play();
  };

  const stopMusic = () => {
    if (audioRef.current == null) {
      return;
    }
    audioRef.current.pause();
  };

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
