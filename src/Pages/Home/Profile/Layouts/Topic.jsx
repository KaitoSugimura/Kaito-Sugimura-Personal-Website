import styles from "./Topic.module.css";

export default function Topic({
  title,
  subtitle,
  topic,
  img,
  list,
  dates = null,
}) {
  return (
    <div className={styles.TopicRoot} key={title}>
      <div className={styles.topContainer}>
        <img className={styles.imageIcon} src={img}></img>
        <div className={styles.circleAnim}></div>
      </div>
      <div className={styles.vertical}>
        <span className={styles.subTitle}>{subtitle}</span>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.topicCont}>
        <div className={styles.triangle}></div>
        <h3 className={styles.topic}>{topic}</h3>
      </div>
      <div className={styles.whiteSquare}>
        {/* Need to manually order cause overflow is hidden */}
        <ul className={styles.list}>
          {list &&
            list.map((item, index) => (
              <li
                className={styles.listItem}
                style={{
                  animationDelay: `${index * 0.1 + 0.9}s`,
                }}
                key={index}
              >
      
                  {index + 1}. {item}{" "}
                  <span>{dates && `[${dates[index]}]`}</span>
          
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
