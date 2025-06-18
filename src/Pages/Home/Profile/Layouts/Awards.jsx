import styles from "./Awards.module.css";

export default function Awards({ title, subtitle, desc, dates = null }) {
  return (
    <div className={styles.TopicRoot} key={title}>
      <h3 className={styles.date}>{dates}</h3>
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.subTitle}>{subtitle}</span>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}
