import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.HeroRoot}>
      <div className={styles.backgroundImage}></div>
      {/* <h1 className={styles.name}>Kaito Sugimura</h1>
      <p className={styles.catchphrase}>
        Unleashing Immersive Worlds <br />
        through Programming and Creativity
      </p> */}
    </div>
  );
}
