import styles from "./SectionContainer.module.css";

export default function SectionContainer({ image, children }) {
  return (
    <div
      className={styles.SectionRoot}
      style={{
        backgroundImage: `url(${image})`,
        height: `${window.innerHeight}px`,
      }}
    >
      {children}
    </div>
  );
}
