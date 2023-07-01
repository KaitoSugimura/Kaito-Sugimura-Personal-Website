import styles from "./InitHero.module.css";

export default function Hero({ currentDialogID }) {
  return (
    <div className={styles.HeroRoot}
    style={{
      height: `${window.innerHeight}px`,
    }}
    >
      <div className={styles.backgroundImage}>
        {currentDialogID == null && <div className={styles.backFilter}></div>}
      </div>
    </div>
  );
}
