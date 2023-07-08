import styles from "./InitHero.module.css";

export default function Hero() {
  return (
    <div className={styles.HeroRoot}
    style={{
      height: `${window.innerHeight}px`,
    }}
    >
      <div className={styles.backgroundImage}>
      </div>
    </div>
  );
}
