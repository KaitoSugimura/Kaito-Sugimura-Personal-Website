import About from "./Layouts/About";
import Awards from "./Layouts/Awards";
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
    subTitle: <>Grade: 3.942 out of 4 GPA</>,
    date: <>09/2020 — 06/2025</>,
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
          desc={`Graduated in May 2025 with a Louise McKinney Scholarship, four consecutive years on the Dean's List, and awarded a Letter of Merit.`}
          image={"/Photos/UofC.jpg"}
        />
      ),
      ["Software Engineering"]: (
        <Topic
          title={"Software Engineering"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/CurlyBraces.svg"}
          list={[
            "Computer Organization (A+)",
            "Principles of Software Design (A+)",
            "Principles of Software Development (A+)",
            "Computing for Engineers (A+)",
            "Software Testing, Reliability, and Quality (A+)",
            "Programming Fundamentals for Software and Computer (A+)",
            "Software Requirements (A)",
            "Software Architecture (A)",
            "Introduction to Virtual Reality (A)",
            "Software Project Management (A)",
            "Software Performance Evaluation (A)",
          ]}
        />
      ),
      ["Computer Science"]: (
        <Topic
          title={"Computer Science"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Server.svg"}
          list={[
            "Data Structures, Algorithms & Applications (A+)",
            "Principles of Operating Systems (A+)",
            "Web Based Systems (A+)",
            "Data Base Management Systems (A)",
            "Principles of Computer Security (A)",
            "Introduction to Distributed Systems (A)",
            "Human-Computer Interaction (A-)",
            "Computer Networks (A-)",
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
            "Digital Circuits (A+)",
            "Embedded System Interfacing (A+)",
            "Fundamental Electrical Circuits and Machines (A+)",
            "Signals and Transforms (A-)",
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
            "Electricity and Magnetism (A+)",
            "Acoustics, Optics, and Modern Physics (A)",
            "Behavior of Liquids, Gases, and Solids (A)",
            "General Chemistry for Engineers (A)",
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
            "University Calculus II (A+)",
            "University Calculus I (A+)",
            "Linear Methods 1 (A+)",
            "Discrete Mathematics (A-)",
            "Differential Equations for Engineers and Scientists (A-)",
          ]}
        />
      ),
      ["Art"]: (
        <Topic
          title={"Art"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Art.svg"}
          list={["History of Video Games (A)", "Digital Sculpture (A)"]}
        />
      ),
      ["Other"]: (
        <Topic
          title={"Other"}
          subtitle={"University of Calgary"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Dot.svg"}
          list={[
            "Engineering Design & Communication (A+)",
            "Engineering Statics (A+)",
            "Software Engineering Capstone Project (A)",
            "Probability, Statistics and Machine Learning (A)",
            "Technology and Society (A)",
            "Engineering Economics (A)",
            "The Role&Resp of the Professional Engg In Society (A-)",
            "Professional and Technical Communication (B+)",
          ]}
        />
      ),
    },
  },

  SelfStudy: {
    type: "Self Learn",
    LabelColor: "#189257b7",
    title: <>Self-Taught Developer</>,
    subTitle: <>3 years of learning, more to come</>,
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
            "AWS Certified Developer Associate",
          ]}
          dates={[
            "Codecademy | 07/2221 – 07/2021",
            "Codecademy | 08/2021 – 08/2021",
            "Udemy | 10/2022 – 10/2022",
            "Udemy | 02/2023 – 05/2023",
            "Udemy | 08/2024 – 87/2024",
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
            "Current",
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
      ["PureWeb"]: (
        <Work
          title={"Software Developer Intern"}
          subtitle={"PureWeb"}
          topic={"Courses Taken"}
          img={"/Home/Icons/Topic/Git.svg"}
          list={[
            "Proposed and led a redesign for a customer facing website console. Improving the overall UI/UX, workflow, software optimization and speed.",
            "Worked and collaborated with stakeholders to gather requirements, delivering demos and presentations to the company.",
            "Diagnosed and resolved critical security vulnerabilities on company servers (CoreWeave and AWS), to ensure compliance and guard sensitive data.",
          ]}
          dates={["Aug 2023 - Aug 2024"]}
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
            "Assured quality assurance for displays.",
            "Soldered, Inspected and Packaged displays.",
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
          list={[
            "Leading groups and looking after small children in the camp.",
            "Thinking of fun games for children.",
            "Learn communication and organization skills with peer volunteers and leaders.",
          ]}
          dates={["August 2015 & August 2016"]}
        />
      ),
    },
  },

  Achievements: {
    type: "Achievements",
    LabelColor: "#ba9a32b7",
    title: <>Achievements</>,
    subTitle: <>Some of my achievements!</>,
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
          title={`Achievements`}
          desc={`This is my list of achievements, awards, and scholarships I have received over the years. `}
          image={"/Home/Profile/About/KarateWin.jpg"}
        />
      ),
      ["Louise McKinney Scholarship"]: (
        <Awards
          title={"Louise McKinney Scholarship"}
          subtitle={"Issued by Government of Alberta"}
          desc={
            "Established in honor of Louise McKinney, the Louise McKinney Post-secondary Scholarship recognizes and rewards students for their academic achievements and encourages them to continue in their undergraduate or professional program of study."
          }
        />
      ),
      ["Dean's List"]: (
        <Awards
          title={"Dean's List"}
          subtitle={
            "Issued by Schulich School of Engineering, University of Calgary"
          }
          desc={
            "The Dean's List recognizes outstanding academic achievement. The Dean’s List is compiled annually at the end of Winter term. A statement of inclusion on the Dean's List is recorded on students’ transcripts."
          }
        />
      ),
      ["Intern of Merit"]: (
        <Awards
          title={"Intern of Merit"}
          subtitle={
            "Issued by Schulich School of Engineering, University of Calgary"
          }
          desc={
            "In the 2023 – 2024 internship year, 15% of interns were recognized by their supervisor for making a significant positive impact on their team/company "
          }
        />
      ),
      ["Stewart Family Bursary in Engineering"]: (
        <Awards
          title={"Stewart Family Bursary in Engineering"}
          subtitle={
            "Issued by Jim, Jeff, Sheila, Rebecca and Lorraine Stewart, Calgary"
          }
          desc={"Undergraduate Competitive Awards"}
        />
      ),
      ["Best Junior Male Contestant ISKF Alberta Provincial Champion"]: (
        <Awards
          title={"Best Junior Male Contestant ISKF Alberta Provincial Champion"}
          subtitle={"Issued by International Shotokan Karate Federation"}
          desc={
            "Won an award for being the 2018 Best Junior Male Contestant ISKF Alberta Provincial Champion as well as 2019 Best Junior Male Contestant ISKF Alberta Provincial Champion."
          }
        />
      ),
    },
  },
};
