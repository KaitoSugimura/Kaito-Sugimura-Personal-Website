import styles from "./About.module.css";

export default function About({title,desc,image}) {
  return (
    <div className={styles.aboutRoot}>
      <div className={styles.whiteSquare}>
        <span className={styles.decoLineHorizontal}></span>
        <span className={styles.decoLineVertical}></span>
        <h2 className={styles.WSTitle}>{title}</h2>
        <p className={styles.desc}>
          {desc}
        </p>
        <img className={styles.subjectPicture} src={image}></img>
      </div>
    </div>
  );
}
