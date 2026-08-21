import Profile from "./Profile/Profile";
import WebsiteProjects from "./WebsiteProjects/WebsiteProjects";
import Hero from "./Hero/Hero";
// Shop is temporarily hidden — re-add the entry below to bring it back.
// import Shop from "./Shop/Shop";

export default [
  { title: "Home", XML: <Hero />, music: null },
  { title: "Projects", XML: <WebsiteProjects />, music: null },
  { title: "Profile", XML: <Profile />, music: null },
  // { title: "Shop", XML: <Shop />, music: null },
];
