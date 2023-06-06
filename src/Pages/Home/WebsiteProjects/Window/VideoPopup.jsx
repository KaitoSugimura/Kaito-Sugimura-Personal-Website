import styles from "./VideoPopup.module.css";
import Modal from "react-modal";
import YouTube from "react-youtube";

export default function VideoPopup({ handleCloseModal, videoId }) {
  return (
    // Not sure if React supports dialog elements yet so making my own
    // <div className={styles.PopUpRoot}></div>
    <Modal
      isOpen={true}
      onRequestClose={handleCloseModal}
      contentLabel="Example Modal"
      className={styles.Modal}
      overlayClassName={styles.Overlay}
    >
      <div className={styles.youtubeVideo}>
        <YouTube
          videoId={videoId}
          onReady={() => {
            setIsLoading(false);
          }}
        />
      </div>
    </Modal>
  );
}
