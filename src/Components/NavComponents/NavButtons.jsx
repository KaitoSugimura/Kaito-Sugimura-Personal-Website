import styles from "./NavButtons.module.css";
import Close from "/Home/Icons/Close.svg";
import Menu from "/Home/Icons/Menu.svg";

export default function NavButtons({ navIsOpen, setNavIsOpen }) {
  const BorderStyle = {
    width: navIsOpen ? "15%" : "30%",
    height: navIsOpen ? "15%" : "30%",
  };

  return (
    <div className={styles.ButtonsContainer}>
      <button
        className={styles.OpenNavButton}
        onClick={() => {
          setNavIsOpen(!navIsOpen);
        }}
        style={{
          transform: navIsOpen
            ? "translateX(calc(97vw - 100%))"
            : "translateX(0)",
        }}
      >
        <img src={navIsOpen ? Close : Menu} className={styles.SettingsIcon} />
        <span className={styles.TopLeft} style={BorderStyle}></span>
        <span className={styles.TopRight} style={BorderStyle}></span>
        <span className={styles.BottomLeft} style={BorderStyle}></span>
        <span className={styles.BottomRight} style={BorderStyle}></span>
      </button>
    </div>
  );
}
