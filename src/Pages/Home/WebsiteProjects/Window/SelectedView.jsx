import { lazy, Suspense, useContext, useState } from "react";
import styles from "./SelectedView.module.css";
import Contents from "../WebsiteContents";

import PlayVideoIcon from "/Home/Icons/PlayVideo.svg";
import MovieIcon from "/Home/Icons/Movie.svg";
import { SoundContext } from "../../../../Context/SoundContext";

// Lazy so react-modal + react-youtube only download when a video is opened.
const PopUpContainer = lazy(() => import("./VideoPopup"));

export default function SelectedView({ index, sectionRatio }) {
  const { stopMusic, playMusic } = useContext(SoundContext);
  const project = Contents[index];
  const videoId = project && project.youtubeID;
  const websiteLink = project && project.websiteLink;
  const extraImages = project && project.extraImages;
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
      {showModal && videoId && (
        <Suspense fallback={null}>
          <PopUpContainer
            handleCloseModal={handleCloseModal}
            videoId={videoId}
            key={`Popup${index}`}
            id={index}
          />
        </Suspense>
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

        {/* A project either has a video to watch or a live site to visit. */}
        {videoId ? (
          <div className={styles.videoContainer} onClick={handleOpenModal}>
            <div className={styles.videoContainerRemoveSelect}>
              <div
                className={styles.videoImage}
                style={{
                  backgroundImage: `url(https://img.youtube.com/vi/${videoId}/0.jpg)`,
                }}
              >
                <img src={PlayVideoIcon} alt="" className={styles.playVideoIcon}></img>
              </div>
              <div className={styles.videoTextContainer}>
                <img src={MovieIcon} alt="" className={styles.playMovieIcon}></img>
                <p className={styles.videoText}>Watch video</p>
              </div>
            </div>
          </div>
        ) : (
          websiteLink && (
            <a
              className={styles.videoContainer}
              href={websiteLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.videoContainerRemoveSelect}>
                <div
                  className={styles.videoImage}
                  style={{
                    backgroundImage: `url(${project.imageMain})`,
                  }}
                ></div>
                <div className={styles.videoTextContainer}>
                  <p className={styles.videoText}>Visit site ↗</p>
                </div>
              </div>
            </a>
          )
        )}

        {extraImages && (
          <>
            <img
              src={extraImages[0]}
              alt=""
              className={`${styles.showcaseGeneral} ${styles.showcaseImage1}`}
            ></img>
            <img
              src={extraImages[1]}
              alt=""
              className={`${styles.showcaseGeneral} ${styles.showcaseImage2}`}
            ></img>
            <img
              src={extraImages[2]}
              alt=""
              className={`${styles.showcaseGeneral} ${styles.showcaseImage3}`}
            ></img>
          </>
        )}
        <div className={styles.id}>
          <span>
            {String(index).padStart(2, "0")}
            {project && <h1>{project.title}</h1>}
          </span>
        </div>
      </div>
    </>
  );
}
