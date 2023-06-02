import styles from "./SectionContainer.module.css";

export default function SectionContainer({ image, children }) {
  return (
    <div className={styles.SectionRoot}>
      <div
        className={styles.BGImage}
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
      <div className={styles.textureImageCover}>{children}</div>
    </div>
  );
}
