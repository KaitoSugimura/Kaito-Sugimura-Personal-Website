import About from "./Layouts/About";
import Topic from "./Layouts/Topic";

// THE MAIN PAGE SHOULD BE CALL About

export default {
  UofC: {
    title: (
      <>
        Bachelor of Science <br />
        in Software Engineering
      </>
    ),
    subTitle: <>Grade: 3.957/4 GPA, 4th year</>,
    date: <>09/2020 — 04/2024</>,
    icon: "/Home/Icons/School.svg",
    coords: {
      x: window.innerWidth / 1.75,
      y: window.innerHeight / 4.3,
    },
    contents: {
      ["About"]: (
        <About
          title={"University of Calgary"}
          desc={`Finished my 3rd year this winter 2023. I am currently looking for Internships to gain experience!!`}
          image={"/Photos/UofC.jpg"}
        />
      ),
      ["Software and Systems"]: (
        <Topic
          title={"Software and Systems"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/CurlyBraces.svg"}
          list={[
            "Computer Organization",
            "Data Structures, Algorithms & Applications",
            "Principles of Operating Systems",
            "Principles of Software Design",
            "Principles of Software Development",
            "Computing for Engineers",
            "Computer Networks",
            "Data Base Management Systems",
            "Software Requirements",
            "Software Architecture",
            "Software Testing, Reliability, and Quality",
          ]}
        />
      ),
      ["Electrical and Circuits"]: (
        <Topic
          title={"Electrical and Circuits"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/CPU.svg"}
          list={[
            "Digital Circuits",
            "Signals and Transforms",
            "Fundamental Electrical Circuits and Machines",
            "Embedded System Interfacing",
          ]}
        />
      ),
      ["Physics and Chemistry"]: (
        <Topic
          title={"Physics and Chemistry"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Chemistry.svg"}
          list={[
            "Acoustics, Optics, and Modern Physics",
            "Electricity and Magnetism",
            "Behavior of Liquids, Gases, and Solids",
            "General Chemistry for Engineers",
          ]}
        />
      ),
      ["Mathematics"]: (
        <Topic
          title={"Mathematics"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Math.svg"}
          list={[
            "Differential Equations for Engineers and Scientists",
            "University Calculus II",
            "University Calculus I",
            "Linear Methods 1",
          ]}
        />
      ),
      ["Art"]: (
        <Topic
          title={"Art"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Art.svg"}
          list={["History of Video Games", "Digital Sculpture"]}
        />
      ),
      ["Other"]: (
        <Topic
          title={"Other"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Dot.svg"}
          list={[
            "Probability, Statistics and Machine Learning",
            "Engineering Statics",
            "Engineering Design & Communication",
            "Professional and Technical Communication",
          ]}
        />
      ),
    },
  },

  SelfStudy: {
    title: (
      <>
        Self-Taught Developer
      </>
    ),
    subTitle: <>3 years of dedication</>,
    date: <>09/2020 — now</>,
    icon: "/Home/Icons/SelfStudy.svg",
    coords: {
      x: window.innerWidth / 1.36,
      y: window.innerHeight / 4.3,
    },
    contents: {
      ["About"]: (
        <About
          title={"University of Calgary"}
          desc={`I self learn using various resources such as books, online courses, and youtube videos. This file contains some of the online courses I have taken.`}
          image={"/Photos/UofC.jpg"}
        />
      ),
      ["Web Development"]: (
        <Topic
          title={"Web Development"}
          subtitle={"Udemy"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Art.svg"}
          list={["HTML and CSS", "Digital Sculpture"]}
          dates={["Codecademy | 07/2021 – 07/2021", "07/2021 – 07/2021"]}
        />
      ),
      ["Game Development"]: (
        <Topic
          title={"Art"}
          subtitle={"Udemy"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Art.svg"}
          list={["History of Video Games", "Digital Sculpture"]}
        />
      ),
    },
  },

  Experience: {
    title: <>Work Experience</>,
    subTitle: <>Grade: 3.957/4 GPA, 4th year</>,
    date: <>09/2020 — 04/2024</>,
    icon: "/Home/Icons/BriefCase.svg",
    coords: {
      x: window.innerWidth / 1.75,
      y: window.innerHeight / 1.88,
    },
    contents: {
      ["About"]: <About />,
    },
  },

  Achievements: {
    title: <>Achievements</>,
    subTitle: <>Grade: 3.957/4 GPA, 4th year</>,
    date: <>09/2020 — 04/2024</>,
    icon: "/Home/Icons/Trophy.svg",
    coords: {
      x: window.innerWidth / 1.36,
      y: window.innerHeight / 1.88,
    },
    contents: {
      ["About"]: <About />,
    },
  },
};
