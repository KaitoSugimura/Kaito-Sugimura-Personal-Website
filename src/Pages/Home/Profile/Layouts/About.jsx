import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.aboutRoot}>
      <div className={styles.whiteSquare}>
        <span className={styles.decoLineHorizontal}></span>
        <span className={styles.decoLineVertical}></span>
        <h2 className={styles.WSTitle}>University of Calgary</h2>
        <p className={styles.desc}>
          Finished my 3rd year this winter 2023. I am currently looking for
          Internships to gain experience!!
        </p>
        <img className={styles.subjectPicture} src="/Photos/UofC.jpg"></img>
      </div>
    </div>
  );
}
