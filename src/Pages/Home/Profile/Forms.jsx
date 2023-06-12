import styles from "./Forms.module.css";

export default {
  UofC: (
    <div className={styles.form}>
      <img
        className={styles.backgroundLogo}
        src="/Home/Profile/Items/UofCLogo.png"
      ></img>
      <h1 className={styles.title}>Education</h1>
      <h2 className={styles.subtitle}>
        Bachelor of Science in Software Engineering
      </h2>
      <h3 className={styles.University}>University of Calgary</h3>
      <small className={styles.date}>09/2020 - 04/2024</small>
      <p>
        <strong>Grade:</strong> 3.957/4 GPA, 3rd year <br />
        <strong>Predicted year of graduation:</strong> 2025
      </p>
      <h4>
        <strong>Courses Taken</strong>
      </h4>
      <div className="courses-taken-list">
        <h5>Software and Computer:</h5>
        <ul>
          <li>Computer Organization</li>
          <li>Data Structures, Algorithms & Applications</li>
          <li>Principles of Operating Systems</li>
          <li>Principles of Software Design</li>
          <li>Principles of Software Development</li>
          <li>Computing for Engineers</li>
        </ul>
        <div className="taken-courses-show">
          <h5>Electrical and Circuits:</h5>
          <ul>
            <li>Digital Circuits</li>
            <li>Signals and Transforms</li>
            <li>Fundamental Electrical Circuits and Machines</li>
            <li>Embedded System Interfacing</li>
          </ul>
          <h5>Physics:</h5>
          <ul>
            <li>Acoustics, Optics, and Modern Physics</li>
            <li>Electricity and Magnetism</li>
          </ul>
          <h5>Chemistry:</h5>
          <ul>
            <li>Behavior of Liquids, Gases, and Solids</li>
            <li>General Chemistry for Engineers</li>
          </ul>
          <h5>Math and Calculus:</h5>
          <ul>
            <li>Differential Equations for Engineers and Scientists</li>
            <li>University Calculus II</li>
            <li>University Calculus I</li>
            <li>Linear Methods 1</li>
          </ul>
          <h5>Art:</h5>
          <ul>
            <li>History of Video Games</li>
            <li>Digital Sculpture</li>
          </ul>
          <h5>Other engineering related programs:</h5>
          <ul>
            <li>Probability, Statistics and Machine Learning</li>
            <li>Engineering Statics</li>
            <li>Engineering Design & Communication</li>
            <li>Professional and Technical Communication</li>
          </ul>
        </div>
        <button className="show-more-button" title="taken-courses-show">
          Show more
        </button>
      </div>
      <h4>
        <strong>Current Courses</strong>
      </h4>
      <div className="courses-current-list">
        <h5>Software and Computer:</h5>
        <ul>
          <li>Computer Networks</li>
          <li>Data Base Management Systems</li>
          <li>Software Requirements</li>
          <li>Software Architecture</li>
          <li>Software Testing, Reliability, and Quality</li>
        </ul>
      </div>
    </div>
  ),
  SelfStudy: <div className={styles.form}></div>,
};
