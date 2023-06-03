import styles from "./SelectedView.module.css";
import Contents from "./WebsiteContents";

export default function SelectedView({ index }) {
  return (
    <div className={styles.SelectedViewRoot}>
      <p className={styles.description}>{Contents[index].desc}</p>
      <div className={styles.id}>
        <span>
          0{index}
          <h1>{Contents[index].title}</h1>
        </span>
      </div>
    </div>
  );
}
