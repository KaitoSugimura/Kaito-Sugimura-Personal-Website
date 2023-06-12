import styles from "./CameraUI.module.css";
import CornerBorder from "./CornerBorder";
import Sections from "../../Pages/Home/HomeTableOfContents.jsx";

export default function CameraUI({ navIsOpen, currentSectionIndex }) {
  const BorderStyle = {
    width: navIsOpen ? "12vh" : "22vh",
    height: navIsOpen ? "12vh" : "22vh",
    borderWidth: "0.15rem",
  };
  const StaticBorder = {
    width: "2rem",
    height: "2rem",
    borderColor: "#fffd",
    borderWidth: "0.2rem",
  };

  return (
    <div className={styles.cameraUIRoot}>
      <div className={styles.cameraUIContainer}>
        <CornerBorder style={BorderStyle} />
        {!navIsOpen && (
          <div className={styles.cameraUIMainContainer}>
            {/* <p className={styles.MainNameText}>Kaito Sugimura</p> */}
            <div className={styles.MainSection}>
              <CornerBorder style={StaticBorder} />
              <div className={styles.MainSectionBackground}>
                <p className={styles.MainSectionText}>
                  {Sections[currentSectionIndex].title}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className={styles.cameraUITopRightContainer}>
          <p>
            Page {currentSectionIndex + 1}/{Sections.length}
          </p>
        </div>
        <div className={styles.cameraUIBottomLeftContainer}>
          <p>Developed from scratch using: REACT JS, CSS, HTML</p>
          <p>By: Kaito Sugimura</p>
        </div>
      </div>
    </div>
  );
}
