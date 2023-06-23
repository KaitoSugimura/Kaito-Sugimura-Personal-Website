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
    contents: {
      ["About"]: <About />,
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
  SelfStudy: {},
};
