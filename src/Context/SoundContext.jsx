import { createContext, useCallback, useEffect, useRef, useState } from "react";
// Music
import defaultBGM from "/Dialog/Music/MainMusic.mp3";
import profileBGM from "/Dialog/Music/Flutter.mp3";
import projectsBGM from "/Dialog/Music/Bouquet.mp3";
import WarmLoopBGM from "/Dialog/Music/WarmLoop.wav";
// Sound
import DialogClick from "/Dialog/Sound/DialogClick.mp3";
import ButtonClick from "/Dialog/Sound/click-button.mp3";
import MetalClick from "/Dialog/Sound/MetalClick.mp3";
import MenuOpen from "/Dialog/Sound/MenuOpen.mp3";
import BackClick from "/Dialog/Sound/BackClick.mp3";
import EquipArtifact from "/Dialog/Sound/EquipArtifact.mp3";
import artifactPickup from "/Dialog/Sound/ArtifactPickup.mp3";
import artifactDrop from "/Dialog/Sound/ArtifactDrop.mp3";
import ProfileClick from "/Dialog/Sound/ProfileClick.mp3";
import Typing from "/Dialog/Sound/UI/Typing.mp3";
import BarFill from "/Dialog/Sound/UI/BarFill.mp3";
import AuthOpen from "/Dialog/Sound/UI/AuthOpen.mp3";
import Authenticated from "/Dialog/Sound/UI/Authenticated.mp3";
import WarningInit from "/Dialog/Sound/UI/WarningInit.mp3";
import Welcome from "/Dialog/Sound/UI/Welcome.mp3";
import Select from "/Dialog/Sound/UI/Select.mp3";
import SelectConfirm from "/Dialog/Sound/UI/SelectConfirm.mp3";

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
  const SFXRef = useRef(null);
  const currentTimeRef = useRef(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      SFXRef.current.volume = volume;
      audioRef.current.currentTime = currentTimeRef.current;
      if (volume == 0) audioRef.current.pause();
      else audioRef.current.play();
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    currentTimeRef.current = audioRef.current.currentTime;
  };

  const playSFX = useCallback(
    (sfxName) => {
      if (volume == 0) return;
      const playPath = soundList[sfxName];
      if (playPath) {
        SFXRef.current.src = playPath;
        SFXRef.current.play();
      }
    },
    [volume]
  );

  const playMusic = useCallback(
    (musicName) => {
      if (musicName == null || audioRef.current == null || volume == 0) {
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
    },
    [volume]
  );

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
        ref={audioRef}
        loop="loop"
        onTimeUpdate={handleTimeUpdate}
      />
      <audio ref={SFXRef} />
      {children}
    </SoundContext.Provider>
  );
};
