import { useRef } from "react";
import SectionContainer from "../../../Components/SectionContainer";
import styles from "./Education.module.css";
import Draggable from "../../../Tools/Draggable";

export default function Education() {
  const nextZIndex = useRef(0);

  const getNextZIndex = () => {
    return ++nextZIndex.current;
  };

  return (
    <SectionContainer image={"Backgrounds/Classroom.png"}>
      <div className={styles.EducationRoot}>
        <div className={styles.OverLapAreaForUofCItem}></div>
        <Draggable
          getNextZIndex={getNextZIndex}
          centerCoords={{ x: 1400, y: 450 }}
        >
          <div className={styles.UofCItemRoot}>
            <img
              src="/Home/Education/Items/UofCLogo.png"
              className={styles.UofCLogoImage}
            ></img>
          </div>
        </Draggable>
        <Draggable getNextZIndex={getNextZIndex}>
          <h1 className={styles.title}>Education</h1>
        </Draggable>
      </div>
    </SectionContainer>
  );
}
