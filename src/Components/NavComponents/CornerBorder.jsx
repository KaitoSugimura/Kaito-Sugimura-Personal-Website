import styles from "./CornerBorder.module.css";

export default function CornerBorder({style}) {
  return (
    <>
      <span className={styles.TopLeft} style={style}></span>
      <span className={styles.TopRight} style={style}></span>
      <span className={styles.BottomLeft} style={style}></span>
      <span className={styles.BottomRight} style={style}></span>
    </>
  );
}
