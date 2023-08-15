import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import DialogMain from "../../../Components/Dialog/DialogMain";
import Navigation from "../../../Components/Navigation";
import Sections from "../HomeTableOfContents.jsx";

const Overlay = forwardRef(
  ({ scrollTo, setScrollable, currentSection, initDone, setInitDone }, ref) => {
    // Dialog
    const events = useRef({ Project1: true });
    const [currentDialogID, setCurrentDialogID] = useState("Home1");
    const callbackFunction = useRef(null);

    useImperativeHandle(ref, ()=>({
      // Home will send this exact function to scroll context
      openDialogWithCallback(id, callback) {
        OpenDialogWithDelay(id);
        callbackFunction.current = callback;
      }
    }))

    const handleEventFinished = () => {
      setCurrentDialogID(null);
      setScrollable(true);
      if (!initDone) {
        setTimeout(() => {
          setInitDone(true);
        }, 5000);
      }

      if(callbackFunction.current){
        callbackFunction.current();
        callbackFunction.current = null;
      }
    };

    // useEffect(() => {
    //   scrollEventHandler(currentSection);
    // }, [currentSection]);

    // const scrollEventHandler = (sectionNo) => {
    //   if (events.current.Profile1 && Sections[sectionNo].title == "Profile") {
    //     events.current.Profile1 = false;
    //     OpenDialogWithDelay("Profile1");
    //   }
    // };

    const OpenDialogWithDelay = (DialogID) => {
      setScrollable(false);
      setTimeout(() => {
        setCurrentDialogID(DialogID);
      }, 300);
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
);

export default Overlay;
