import styles from "./InitHero.module.css";

export default function Hero({ currentDialogID }) {
  return (
    <div
      className={`${styles.HeroRoot} ${
        currentDialogID == null ? styles.anim : ""
      }`}
    >
      {currentDialogID == null && <div className={styles.commandPrompt}></div>}
      <div className={styles.backgroundImage}></div>
    </div>
  );
}
