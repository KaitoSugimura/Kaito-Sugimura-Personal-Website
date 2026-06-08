import styles from "./InitHero.module.css";

export default function InitHero() {
  return (
    <div className={styles.HeroRoot} style={{ height: "100dvh" }}>
      <div className={styles.backgroundImage}></div>
    </div>
  );
}
