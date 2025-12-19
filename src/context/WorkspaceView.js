"use client";

import { useState, createContext } from "react";

export const WorkspaceViewContext = createContext({
  view: "grid",
  setView: () => {},
});

export function WorkspaceViewProvider({ children }) {
  const [view, setView] = useState("grid");
  return (
    <WorkspaceViewContext.Provider
      value={{
        view,
        setView,
      }}
    >
      {children}
    </WorkspaceViewContext.Provider>
  );
}
