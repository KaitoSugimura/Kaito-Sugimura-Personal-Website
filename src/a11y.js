// Wrap a click handler so non-button elements (with role="button" + tabIndex=0)
// are also operable via keyboard — fired on Enter or Space, matching the native
// <button> activation keys.
export const activateOnKey = (handler) => (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handler(event);
  }
};
