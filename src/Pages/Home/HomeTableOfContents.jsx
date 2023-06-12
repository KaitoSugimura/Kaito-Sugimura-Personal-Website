import Profile from "./Profile/Profile";
import Projects from "./Projects/Projects";
import WebsiteProjects from "./WebsiteProjects/WebsiteProjects";
import Hero from "./Hero/Hero";

export default [
  { title: "Home", XML: <Hero />, music: null },
  { title: "Projects", XML: <WebsiteProjects />, music: null },
  { title: "Profile", XML: <Profile />, music: null },
  { title: "ex", XML: <Projects />, music: null },
];
