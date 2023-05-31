import styles from "./CameraUI.module.css";
import CornerBorder from "./CornerBorder";

export default function CameraUI({ navIsOpen }) {
  const BorderStyle = {
    width: navIsOpen ? "5%" : "30%",
    height: navIsOpen ? "5%" : "30%",
  };
  const StaticBorder = {
    width: "2rem",
    height: "2rem",
    borderColor: "#fffd",
  };

  return (
    <div className={styles.cameraUIRoot}>
      <div className={styles.cameraUIContainer}>
        <CornerBorder style={BorderStyle} />
        {!navIsOpen && <div className={styles.cameraUIMainContainer}>
          <p className={styles.MainNameText}>Kaito Sugimura</p>
          <div className={styles.MainSection}>
            <CornerBorder style={StaticBorder} />
            <div className={styles.MainSectionBackground}>
              <p className={styles.MainSectionText}>HOME</p>
            </div>
          </div>
        </div>}
        <div className={styles.cameraUITopRightContainer}>
          <p>Page 1/7</p>
        </div>
        <div className={styles.cameraUIBottomLeftContainer}>
          <p>Developed from scratch using: REACT, JS, CSS, HTML</p>
          <p>By: Kaito Sugimura</p>
        </div>
      </div>
    </div>
  );
}
