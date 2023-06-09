import styles from "./FrameOverlay.module.css";
import Contents from "../WebsiteContents";

export default function FrameOverlay({ index, selectedView, currentIndex }) {
  const lastIndex = Contents.length - 1;
  return (
    <>
      {!selectedView && (
        <div className={styles.FrameOverlay}>
          {(index == 0 || index == lastIndex) && (
            <div className={styles.overflowHidden}>
            <div className={styles.Ribbon}>
              {index == 0 && <p className={styles.Newest}>Newest</p>}
              {index == lastIndex && <p className={styles.Oldest}>Oldest</p>}
            </div></div>
          )}
          {index == currentIndex && (
            <div className={styles.leftBottom}>
              <span className={styles.leftTriangle}></span>
              <h1 className={styles.title}>{Contents[index].title}</h1>
              <p className={styles.desc}>{Contents[index].desc}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
