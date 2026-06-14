import { createContext } from "react";

// Shared scroll/section context for the Home page. Lives in its own module so
// component files only export components (keeps React Fast Refresh working).
export const scrollContext = createContext();
