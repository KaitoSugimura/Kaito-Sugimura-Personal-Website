import About from "./Layouts/About";
import Topic from "./Layouts/Topic";

// THE MAIN PAGE SHOULD BE CALL About

export default {
  UofC: {
    type: "Education",
    LabelColor: "#11608eb7",
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
      x: 55,
      y: 22,
    },
    InitCoords: {
      x: 55,
      y: 22,
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
    type: "Self Learn",
    LabelColor: "#189257b7",
    title: <>Self-Taught Developer</>,
    subTitle: <>3 years of dedication, more to come</>,
    date: <>09/2020 — now</>,
    icon: "/Home/Icons/SelfStudy.svg",
    coords: {
      x: 73.5,
      y: 22,
    },
    InitCoords: {
      x: 73.5,
      y: 22,
    },
    contents: {
      ["About"]: (
        <About
          title={"Ongoing Journey"}
          desc={`I self learn using various resources such as books, online courses, and youtube videos. This file contains some of the online courses I have taken.`}
          image={"/Home/Profile/About/KaitoMain.jpg"}
        />
      ),
      ["Web Development"]: (
        <Topic
          title={"Web Development"}
          subtitle={"Codecademy & Udemy"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Web.svg"}
          list={[
            "HTML and CSS",
            "JavaScript",
            "Real-World Websites",
            "React & Firebase",
          ]}
          dates={[
            "Codecademy | 07/2221 – 07/2021",
            "Codecademy | 08/2021 – 08/2021",
            "Udemy | 10/2022 – 10/2022",
            "Udemy | 02/2023 – 05/2023",
          ]}
        />
      ),
      ["Game Development"]: (
        <Topic
          title={"Game Development"}
          subtitle={"Unity Learn & Udemy"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Game.svg"}
          list={[
            "C#",
            "Unity Junior Programmer",
            "UE5 C++ Developer Course",
            "Level Design",
            "Went into focused development after",
          ]}
          dates={[
            "Codecademy | 08/2021 – 08/2021",
            "Unity Learn | 09/2021 – 09/2021",
            "Udemy | 04/2022 – 05/2022",
            "Udemy | 06/2022 – 06/2022",
            "now",
          ]}
        />
      ),
      ["General Programming"]: (
        <Topic
          title={"General Programming"}
          subtitle={"Codecademy & Mosh Hamedani"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/File.svg"}
          list={["Python 3", "Java", "Data Structures & Algorithms"]}
          dates={[
            "Codecademy | 08/2021 – 08/2021",
            "Mosh | 01/2022 – 02/2022",
            "Mosh | 02/2022 – 04/2022",
          ]}
        />
      ),
      ["Source Control"]: (
        <Topic
          title={"Source Control"}
          subtitle={"Udemy"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={["The Ultimate Git Course"]}
          dates={["Udemy | 06/2022 – 06/2022"]}
        />
      ),
    },
  },

  Experience: {
    type: "Experience",
    LabelColor: "#730039b7",
    title: <>Work experience</>,
    subTitle: <>Part time, Full time, and Volunteering</>,
    date: <></>,
    icon: "/Home/Icons/BriefCase.svg",
    coords: {
      x: 55,
      y: 55,
    },
    InitCoords: {
      x: 55,
      y: 55,
    },
    contents: {
      ["About"]: (
        <About
          title={"Positive energy"}
          desc={`Although I take pride in my own work, I value the relationships I build with my coworkers more than anything. I love telling jokes to lighten up the damp morning mood.`}
          image={"/Home/Profile/About/Volunteer.jpg"}
        />
      ),
      ["PCB soldering and Product packaging"]: (
        <Topic
          title={"PCB soldering and Product packaging"}
          subtitle={"Matrix Orbital"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={["The Ultimate Git Course"]}
          dates={["Udemy | 06/2022 – 06/2022"]}
        />
      ),
      ["Retail Clerk"]: (
        <Topic
          title={"PCB soldering and Product packaging"}
          subtitle={"Matrix Orbital"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={["The Ultimate Git Course"]}
          dates={["Udemy | 06/2022 – 06/2022"]}
        />
      ),
      ["Summer camp volunteering"]: (
        <Topic
          title={"PCB soldering and Product packaging"}
          subtitle={"Matrix Orbital"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={["The Ultimate Git Course"]}
          dates={["Udemy | 06/2022 – 06/2022"]}
        />
      ),
    },
  },

  Achievements: {
    type: "Achievements",
    LabelColor: "#ba9a32b7",
    title: <>Achievements</>,
    subTitle: <>Grade: 3.957/4 GPA, 4th year</>,
    date: <>09/2020 — 04/2024</>,
    icon: "/Home/Icons/Trophy.svg",
    coords: {
      x: 73.5,
      y: 55,
    },
    InitCoords: {
      x: 73.5,
      y: 55,
    },
    contents: {
      ["About"]: (
        <About
          title={`"Try everything"`}
          desc={`My mother always says "The reason you can't do it is because you haven't tried it yet". It's a motto I live by.`}
          image={"/Home/Profile/About/Volunteer.jpg"}
        />
      ),
    },
  },
};
