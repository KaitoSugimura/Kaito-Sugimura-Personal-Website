import { useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Shop.module.css";
import { useFocusTrap } from "./shopUi";

// Full-screen modal scrim, portaled to #overlay-root (a body-level fixed layer)
// so it escapes the section-scroller's translate transform and paints above the
// site chrome. Traps focus; optionally closes when the backdrop itself is clicked.
export default function Scrim({ children, onBackdrop }) {
  const ref = useRef(null);
  useFocusTrap(ref);
  const tree = (
    <div
      className={styles.overlay}
      ref={ref}
      onMouseDown={
        onBackdrop
          ? (e) => {
              if (e.target === e.currentTarget) onBackdrop();
            }
          : undefined
      }
    >
      {children}
    </div>
  );
  const root =
    typeof document !== "undefined"
      ? document.getElementById("overlay-root")
      : null;
  return root ? createPortal(tree, root) : tree;
}
