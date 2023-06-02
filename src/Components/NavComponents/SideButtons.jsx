import styles from "./SideButtons.module.css";
import Sections from "../../Pages/Home/HomeTableOfContents.jsx";

export default function SideButtons({
  navIsOpen,
  scrollTo,
  currentSectionIndex,
}) {
  return (
    <div className={`${styles.sideButtonsRoot}`}>
      {!navIsOpen &&
        Sections.map((section, index) => (
          <button
            className={`${styles.sectionButton} ${
              index == currentSectionIndex ? styles.selected : ""
            }`}
            onClick={() => {
              console.log(section.title);
              scrollTo(index);
            }}
            key={index}
          >
            <span className={styles.ButtonInnerColor}></span>
          </button>
        ))}
    </div>
  );
}
