import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import DialogMain from "../../../Components/Dialog/DialogMain";
import Navigation from "../../../Components/Navigation";
import { INTRO_TITLE_EXPAND_MS, DIALOG_OPEN_DELAY_MS } from "../../../timings";

const Overlay = forwardRef(
  ({ scrollTo, setScrollable, currentSection, initDone, setInitDone }, ref) => {
    // Dialog
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
        // Matches the title box expand (initiationTitle, 4.5s in CameraUI) so the
        // typed title + terminal UI come in right as the box finishes — no dead pause.
        setTimeout(() => {
          setInitDone(true);
        }, INTRO_TITLE_EXPAND_MS);
      }

      if(callbackFunction.current){
        callbackFunction.current();
        callbackFunction.current = null;
      }
    };

    const OpenDialogWithDelay = (DialogID) => {
      setScrollable(false);
      setTimeout(() => {
        setCurrentDialogID(DialogID);
      }, DIALOG_OPEN_DELAY_MS);
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
