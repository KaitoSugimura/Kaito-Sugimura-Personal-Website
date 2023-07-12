import styles from "./Work.module.css";

export default function Work({
  title,
  subtitle,
  topic,
  img,
  list,
  dates = null,
}) {
  return (
    <div className={styles.TopicRoot} key={title}>
      <h3 className={styles.date}>{dates}</h3>
      <span className={styles.subTitle}>{subtitle}</span>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.list}>
        {list &&
          list.map((item, index) => (
            <li className={styles.listItem} key={index}>
              <p
                className={styles.itemText}
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <span className={styles.dot}>•</span>
                {item}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}
