import styles from "./SideButtons.module.css";
import Sections from "../../Pages/Home/HomeTableOfContents.jsx";

export default function SideButtons({
  navIsOpen,
  scrollTo,
  currentSectionIndex
}) {
  return (
    <div className={`${styles.sideButtonsRoot}`}>
      {!navIsOpen &&
        Sections.map((section, index) => (
          <div className={styles.flex} key={index}>
            <button
              className={styles.buttonPaddingWrapper}
              onClick={() => {
                scrollTo(index);
              }}
            >
              <div
                className={`${styles.sectionButtonBorder} ${
                  index == currentSectionIndex ? styles.selected : ""
                }`}
                key={index}
              >
                <span className={styles.ButtonInnerColor}></span>
              </div>
            </button>
            <div className={styles.sectionName}>{Sections[index].title} </div>
          </div>
        ))}
    </div>
  );
}
