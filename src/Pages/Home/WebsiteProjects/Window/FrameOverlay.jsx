import styles from "./FrameOverlay.module.css";

export default function FrameOverlay({
  index,
  content,
  selectedView,
  currentABSPos,
  mouseDownAndDragging,
}) {
  return (
    <>
      {!selectedView && (
        <div className={styles.FrameOverlay}>
          {!mouseDownAndDragging && 0 == Math.round(currentABSPos) && (
            <div className={styles.leftBottom}>
              <span className={styles.leftTriangle}></span>
              <h1 className={styles.title}>{content.title}</h1>
              <p className={styles.desc}>{content.desc}</p>
            </div>
          )}

          <div className={styles.frameLogoCenterer}>
            <img
              className={styles.frameLogo}
              src={`/Home/WebsiteProjects/Logos/${content.logoPath}`}
              onDragStart={(e) => {
                e.preventDefault();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
