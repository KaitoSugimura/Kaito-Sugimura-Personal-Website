import React, { useEffect, useRef, useState } from "react";
import styles from "./Projects.module.css";
import ProjectDesc from "./ProjectDesc";
import Sections from "../HomeTableOfContents.jsx";

import CoinDozer from "/Home/Projects/CoinDozerGame.jpg";
import Immortal from "/Home/Projects/Immortal.jpg";
import NoLongerMe from "/Home/Projects/NoLongerMe.jpg";
import PythonBasics from "/Home/Projects/HackYourLearning.jpg";
import Blender from "/Home/Projects/BlenderModel.jpg";
import BruhGame from "/Home/Projects/BruhGame.jpg";
import ScuffedRPGAdventures from "/Home/Projects/ScuffedRPGAdventures.jpg";
import XDragScroller from "../../../Tools/XDragScroller";
import SectionContainer from "../../../Components/SectionContainer";

export default function Projects() {
  // const containerRef = useRef(null);]
  const [isDragging, setIsDragging] = useState(false);

  const [projects, setProjects] = useState([
    {
      bSelected: false,
      software: "Unreal Engine 5",
      name: "RPG Coin Dozer",
      date: "8/2022 – 9/2022",
      image: CoinDozer,
      type: "Personal Project",
      desc: "A RPG coin dozer game completely made from scratch in Unreal Engine 5! I tried to implement most of my stuff in C++, however a lot of the UI was implemented with blueprints since that made the most sense",
    },
    {
      bSelected: false,
      software: "Unreal Engine 5",
      name: "Immortal",
      date: "7/2022 – 8/2022",
      image: Immortal,
      type: "Personal Project",
    },
    {
      bSelected: false,
      software: "Unreal Engine 5",
      name: "No Longer Me",
      date: "5/2022 – 5/2022",
      image: NoLongerMe,
      type: "Game Jam",
    },
    {
      bSelected: false,
      software: "Unity",
      name: "Python Basics",
      date: "3/2022 – 3/2022",
      image: PythonBasics,
      type: "Hackathon",
    },
    {
      bSelected: false,
      software: "Blender",
      name: "Character Modeling",
      date: "10/2021 – 12/2021",
      image: Blender,
      type: "Hobby",
    },
    {
      bSelected: false,
      software: "Unity",
      name: "Bruh Game",
      date: "09/2021 – 09/2021",
      image: BruhGame,
      type: "Personal Project",
    },
    {
      bSelected: false,
      software: "Unity",
      name: "RPG Adventures",
      date: "09/2021 – 09/2021",
      image: ScuffedRPGAdventures,
      type: "Personal Project",
    },
    {
      bSelected: false,
      software: "",
      name: "",
      date: "",
      image: NoLongerMe,
      type: "",
    },
    {
      bSelected: false,
      software: "",
      name: "",
      date: "",
      image: NoLongerMe,
      type: "",
    },
  ]);

  const [descRefs, setDescRefs] = useState(
    new Array(projects.length).fill(React.createRef())
  );

  // useEffect(() => {
  //   containerRef.current.scrollLeft = 30; // Start with left scroll a bit

  //   function handleWheel(event) {
  //     if (containerRef.current.contains(event.target)) {
  //       if (
  //         (containerRef.current.scrollLeft > 5 && event.deltaY < 0) ||
  //         (containerRef.current.scrollLeft + 5 <
  //           containerRef.current.scrollWidth -
  //             containerRef.current.offsetWidth &&
  //           event.deltaY > 0)
  //       ) {
  //         event.preventDefault();
  //         containerRef.current.scrollLeft += event.deltaY;
  //       }
  //     }
  //   }

  //   containerRef.current.addEventListener("wheel", handleWheel);

  //   return () => {
  //     if (containerRef.current)
  //       containerRef.current.removeEventListener("wheel", handleWheel);
  //   };
  // }, []);

  const clickSubs = useRef(new Array(projects.length));
  const clickEventSub = (f, index) => {
    clickSubs.current[index] = f;
  };

  const setSelectionAtIndex = (b, index) => {
    let p = projects;
    p[index].bSelected = b;
    setProjects([...p]);
  };

  return (
    <SectionContainer image={"/Backgrounds/DarkFlames.jpg"}>
      <div className={styles.projectsContainer}>
        <XDragScroller
          style={{
            width: "100vw",
            height: "60vh",
          }}
          setIsDragging={setIsDragging}
        >
          {projects.map((project, index) => (
            <div className={styles.mapRoot} key={index}>
              <div
                className={`${styles.parallelogram} ${
                  project.bSelected && styles.selected
                } ${isDragging ? styles.Dragging : ""}`}
                onClick={() => {
                  if (!isDragging) {
                    clickSubs.current[index]();
                  }
                  setIsDragging(false);
                }}
              >
                <div className={styles.foregroundMask}>
                  <img className={styles.backgroundIMG} src={project.image} />
                </div>

                <div className={styles.unskewed}>
                  <p className={`${styles.software} NoUserSelect`}>
                    {project.software}
                  </p>
                  <h2
                    className="NoUserSelect"
                    style={{
                      fontSize:
                        project.name.length > 12
                          ? `${
                              5 -
                              Math.floor((project.name.length - 10) / 0.8) / 10
                            }vh`
                          : "5vh",
                    }}
                  >
                    {project.name}
                  </h2>
                  <span className={`${styles.date} NoUserSelect`}>
                    {project.date}
                  </span>

                  <div className={`${styles.ProjectType}`}>
                    <p>{project.type}</p>
                  </div>
                </div>
              </div>
              <ProjectDesc
                clickEventSub={clickEventSub}
                index={index}
                clickEventRef={descRefs[index]}
                setSelectionAtIndex={setSelectionAtIndex}
                desc={project.desc}
              />
            </div>
          ))}
        </XDragScroller>
      </div>
    </SectionContainer>
  );
}
