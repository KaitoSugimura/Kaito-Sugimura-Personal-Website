import { useEffect, useRef, useState } from "react";
import DialogMain from "../../../Components/Dialog/DialogMain";
import Navigation from "../../../Components/Navigation";
import Sections from "../HomeTableOfContents.jsx";
export default function Overlay({
  scrollTo,
  setScrollable,
  currentSection,
  initDone,
  setInitDone,
}) {
  // Dialog
  const events = useRef({ Profile1: true, Project1: true });
  const [currentDialogID, setCurrentDialogID] = useState("Home1");

  const handleEventFinished = () => {
    setCurrentDialogID(null);
    setScrollable(true);
    if (!initDone) {
      setTimeout(() => {
        setInitDone(true);
      }, 5000);
    }
  };

  useEffect(() => {
    scrollEventHandler(currentSection);
  }, [currentSection]);

  const scrollEventHandler = (sectionNo) => {
    if (events.current.Project1 && Sections[sectionNo].title == "Projects") {
      events.current.Project1 = false;
      OpenDialogWithDelay("Projects1");
    }
    if (events.current.Profile1 && Sections[sectionNo].title == "Profile") {
      events.current.Profile1 = false;
      OpenDialogWithDelay("Profile1");
    }
  };

  const OpenDialogWithDelay = (DialogID) => {
    setScrollable(false);
    setCurrentDialogID(DialogID);
    // setTimeout(() => {
    // }, 300);
  };

  return (
    <>
      {currentDialogID != null ? (
        <DialogMain
          DialogID={currentDialogID}
          eventFinishedCallback={handleEventFinished}
        />
      ) : (
        <Navigation
          scrollTo={scrollTo}
          currentSectionIndex={currentSection}
          initDone={initDone}
        />
      )}
    </>
  );
}
