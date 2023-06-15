import { useState } from "react";
import styles from "./HorizontalEnjoyer.module.css";

export default function HorizontalEnjoyer() {
  const [isVertical, setIsVertical] = useState(
    window.innerWidth < window.innerHeight
  );

  window.addEventListener("resize", () => {
    if (window.innerWidth < window.innerHeight) {
      setIsVertical(true);
    }
  });

  return (
    <>
      {isVertical && (
        <div className={styles.HoriRoot}>
          <p className={styles.message}>
            Please tilt/adjust your device/screen Horizontally for optimal
            viewing
          </p>
          <img className={styles.Image} src="/Home/Horizontal.png"></img>
        </div>
      )}
    </>
  );
}
