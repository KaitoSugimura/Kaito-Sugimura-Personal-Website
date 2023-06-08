import styles from "./FrameOverlay.module.css";

export default function FrameOverlay({ index, lastIndex, selectedView }) {
  return (
    <div className={styles.FrameOverlay}>
      {!selectedView && (index == 0 || index == lastIndex) && (
        <div className={styles.Ribbon}>
          {index == 0 && <p className={styles.Newest}>Newest</p>}
          {index == lastIndex && <p className={styles.Oldest}>Oldest</p>}
        </div>
      )}
    </div>
  );
}
