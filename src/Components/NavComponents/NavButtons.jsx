import { useContext } from "react";
import styles from "./NavButtons.module.css";
import Close from "/Home/Icons/Close.svg";
import Menu from "/Home/Icons/Menu.svg";
import { SoundContext } from "../../Context/SoundContext";

export default function NavButtons({ navIsOpen, setNavIsOpen }) {
  const { playSFX } = useContext(SoundContext);
  const BorderStyle = {
    width: navIsOpen ? "15%" : "30%",
    height: navIsOpen ? "15%" : "30%",
    borderWidth: "1px",
  };

  return (
    <div className={styles.ButtonsContainer}>
      <button
        className={styles.OpenNavButton}
        onClick={() => {
          setNavIsOpen(!navIsOpen);
          playSFX("MenuOpen");
        }}
        style={{
          transform: navIsOpen
            ? "translateX(calc(96vw - 100%))"
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
