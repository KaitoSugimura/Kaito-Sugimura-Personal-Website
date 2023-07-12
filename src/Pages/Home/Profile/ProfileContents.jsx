import About from "./Layouts/About";
import Topic from "./Layouts/Topic";
import Work from "./Layouts/Work";

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
      ["Thousand Hour Games"]: (
        <Work
          title={"Game Programmer and Quality Assurance"}
          subtitle={"Thousand Hour Games"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={[
            "Developed and polished the main combat of Gates of Everforge.",
            "Collaborated and brainstormed game concepts, design elements, key features with the team.",
            "Optimized and refactored code for better performance and readability.",
          ]}
          dates={["April 2023 - Present"]}
        />
      ),
      ["Matrix Orbital"]: (
        <Work
          title={"Soldering Technician (Seasonal)"}
          subtitle={"Matrix Orbital"}
          Work={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={[
            "Uploaded software and assured quality assurance for a 500 display per week throughput.",
            "Soldered, Inspected and Packaged over 1,500 displays and made delivery deadlines over a one-month period.",
            "Actively participated in safety initiatives to ensure workplace safety.",
          ]}
          dates={["August 2017 - August 2021"]}
        />
      ),
      ["Loblaws"]: (
        <Work
          title={"Sales Associate"}
          subtitle={"Loblaws"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={[
            "Greeted customers as they entered the store and ensuring a pleasant customer shopping experience.",
            "Maintained knowledge of current sales and promotions and adhered to policies regarding payment and exchanges.",
            "Maintained detailed records of stock levels of over 150 items.",
          ]}
          dates={["September 2019 - March 2020"]}
        />
      ),
      ["Summer camp volunteering"]: (
        <Work
          title={"Summer camp volunteer"}
          subtitle={"The City of Calgary Recreation"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={["Leading groups and looking after small children in the camp.", "Thinking of fun games for children.", "Learn communication and organization skills with peer volunteers and leaders."]}
          dates={["August 2015 & August 2016"]}
        />
      ),
    },
  },

  Achievements: {
    type: "Achievements",
    LabelColor: "#ba9a32b7",
    title: <>Achievements</>,
    subTitle: <>This section is still work in progress</>,
    date: null,
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
          image={"/Home/Profile/About/KarateWin.jpg"}
        />
      ),
    },
  },
};
