
import styles from "./VideoPopup.module.css";
import Modal from "react-modal";
import YouTube from "react-youtube";

// Bind the modal to the app root for accessibility (hides background from
// screen readers while open and silences react-modal's setAppElement warning).
const appRoot = document.getElementById("root");
if (appRoot) {
  Modal.setAppElement(appRoot);
}

export default function VideoPopup({ handleCloseModal, videoId }) {
  return (
    <Modal
      isOpen={true}
      onRequestClose={handleCloseModal}
      contentLabel="Project video"
      className={styles.Modal}
      overlayClassName={styles.Overlay}
    >
      <div className={styles.youtubeVideo}>
        <YouTube videoId={videoId} />
      </div>
    </Modal>
  );
}
