import styles from "./HorizontalEnjoyer.module.css";

export default function HorizontalEnjoyer() {
  return (
    <div className={styles.HoriRoot}>
      <p className={styles.message}>
        Please tilt/adjust your device/screen Horizontally for optimal viewing
      </p>
      <img className={styles.Image} src="/Home/Horizontal.png"></img>
    </div>
  );
}
