import { useContext, useEffect, useRef, useState } from "react";
import styles from "./SelectedView.module.css";
import Contents from "../WebsiteContents";

import PlayVideoIcon from "/Home/Icons/PlayVideo.svg";
import MovieIcon from "/Home/Icons/Movie.svg";
import PopUpContainer from "./VideoPopup";
import { SoundContext } from "../../../../Context/SoundContext";

export default function SelectedView({ index, sectionRatio }) {
  const { stopMusic,playMusic  } = useContext(SoundContext);
  const videoId = Contents[index].youtubeID;
  const extraImages = Contents[index].extraImages;
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    playMusic("resume");
    setShowModal(false);
  };

  const handleOpenModal = () => {
    stopMusic();
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <PopUpContainer handleCloseModal={handleCloseModal} videoId={videoId} key={`Popup${index}`} id={index} />
      )}
        <div
          className={styles.SelectedViewRoot}
          style={{
            width: `${sectionRatio.width}vw`,
            height: `${sectionRatio.height}vw`,
          }}
          key={`ViewRoot${index}`}
        >
          <div className={styles.PopUpRoot}></div>
          <div className={styles.videoContainer} onClick={handleOpenModal}>
            <div className={styles.videoContainerRemoveSelect}>
              <div
                className={styles.videoImage}
                style={{
                  backgroundImage: `url(http://img.youtube.com/vi/${videoId}/0.jpg)`,
                }}
              >
                <img src={PlayVideoIcon} className={styles.playVideoIcon}></img>
              </div>
              <div className={styles.videoTextContainer}>
                <img src={MovieIcon} className={styles.playMovieIcon}></img>
                <p className={styles.videoText}>Watch video</p>
              </div>
            </div>
          </div>

          <img
            src={extraImages[0]}
            className={`${styles.showcaseGeneral} ${styles.showcaseImage1}`}
          ></img>
          <img
            src={extraImages[1]}
            className={`${styles.showcaseGeneral} ${styles.showcaseImage2}`}
          ></img>
          <img
            src={extraImages[2]}
            className={`${styles.showcaseGeneral} ${styles.showcaseImage3}`}
          ></img>
          <div className={styles.id}>
            <span>
              0{index}
              <h1>{Contents[index].title}</h1>
            </span>
          </div>
        </div>
    </>
  );
}
