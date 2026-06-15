import { useEffect, useRef } from "react";

// Shared UI utilities for the Shop — coin formatters and focus/keyboard hooks —
// used by Shop.jsx, the haggle modal, and the Scrim. Kept component-free so it
// can be imported anywhere without a circular dependency.

// Coin formatters.
export const g = (n) => `${Math.round(n)}g`;
export const gSigned = (n) => `${n >= 0 ? "+" : "−"}${Math.abs(Math.round(n))}g`;

// Kaito's portrait image path by mood/name.
export const portraitSrc = (p) => `/Dialog/Pictures/${p}.webp`;

const FOCUSABLE =
  'button:not([disabled]),[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

// Close `handler` on Escape, while the bound element/modal is mounted.
export function useEscape(handler) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler]);
}

// Trap Tab focus inside `ref`, and restore focus to the element that opened the
// modal when it closes. The trigger is captured during the first render (before
// React applies the panel's autoFocus), so restoration lands on the shelf/bag
// card or HUD button that opened it — not on the modal's own button.
export function useFocusTrap(ref) {
  const triggerRef = useRef(null);
  if (triggerRef.current === null && typeof document !== "undefined") {
    triggerRef.current = document.activeElement;
  }
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // If the panel's autoFocus didn't land inside, focus the first focusable.
    if (!node.contains(document.activeElement)) {
      const first = node.querySelector(FOCUSABLE);
      if (first) first.focus();
    }
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const els = [...node.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      const t = triggerRef.current;
      if (t && document.contains(t) && typeof t.focus === "function") t.focus();
    };
  }, [ref]);
}
