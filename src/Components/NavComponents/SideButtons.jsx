import styles from "./SideButtons.module.css";
import Sections from "../../Pages/Home/HomeTableOfContents.jsx";

export default function SideButtons({
  navIsOpen,
  scrollTo,
  currentSectionIndex,
}) {
  return (
    <div
      className={`${styles.sideButtonsRoot}`}
      style={{
        backgroundColor: navIsOpen ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 0.4)",
      }}
    >
      {!navIsOpen &&
        Sections.map((section, index) => (
          <div className={styles.flex} key={section.title}>
            <button
              className={styles.buttonPaddingWrapper}
              onClick={() => {
                scrollTo(index);
              }}
              aria-label={`Go to ${section.title}`}
              aria-current={index === currentSectionIndex ? "true" : undefined}
            >
              <div
                className={`${styles.sectionButtonBorder} ${
                  index === currentSectionIndex ? styles.selected : ""
                }`}
              >
                <span className={styles.ButtonInnerColor}></span>
              </div>
            </button>
            <div className={styles.sectionName}>{section.title} </div>
          </div>
        ))}
    </div>
  );
}
