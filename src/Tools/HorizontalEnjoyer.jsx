import { useState } from "react";
import styles from "./HorizontalEnjoyer.module.css";

export default function HorizontalEnjoyer() {
  const [isVertical, setIsVertical] = useState(
    window.innerWidth < window.innerHeight
  );

  window.addEventListener("resize", () => {
    setIsVertical(window.innerWidth < window.innerHeight);
  });

  // screen.orientation.addEventListener("change", function (e) {
  //   setIsVertical(window.innerWidth < window.innerHeight);
  // });

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