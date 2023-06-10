import Profile from "./Profile/Profile";
import Projects from "./Projects/Projects";
import WebsiteProjects from "./WebsiteProjects/WebsiteProjects";
import Hero from "./Hero/Hero";

export default [
  { title: "Home", XML: <Hero /> },
  { title: "Projects", XML: <WebsiteProjects /> },
  { title: "Profile", XML: <Profile />},
  { title: "ex", XML: <Projects /> },
  
];
