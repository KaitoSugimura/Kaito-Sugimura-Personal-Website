import ImageComponent from "../Tools/ImageComponent";
import styles from "./SectionContainer.module.css";

export default function SectionContainer({ image, children }) {
  return (
    <div className={styles.SectionRoot}>
      <ImageComponent className={styles.BGImage} src={image} />
      <div className={styles.textureImageCover}>{children}</div>
    </div>
  );
}
