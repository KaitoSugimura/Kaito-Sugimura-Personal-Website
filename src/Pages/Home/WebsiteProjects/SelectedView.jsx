import { useState } from "react";
import styles from "./SelectedView.module.css";
import Contents from "./WebsiteContents";
import YouTube from "react-youtube";

export default function SelectedView({ index }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.SelectedViewRoot}>
      {isLoading && <div className={styles.loading}>Loading...</div>}
{/* 
      <div className={styles.youtubeVideo}>
        <YouTube
          videoId="J1YpuKkc3ng"
          onReady={() => {
            setIsLoading(false);
          }}
        />
      </div> */}

      <img src="/Backgrounds/Classroom.png" className={`${styles.showcaseGeneral} ${styles.showcaseImage1}`}></img>
      <img src="/Backgrounds/MagicalRoom.png" className={`${styles.showcaseGeneral} ${styles.showcaseImage2}`}></img>
      <img src="/Backgrounds/Techno.png" className={`${styles.showcaseGeneral} ${styles.showcaseImage3}`}></img>

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
