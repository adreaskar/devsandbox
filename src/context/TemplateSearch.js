"use client";

import { useState, createContext } from "react";

export const TemplateSearchContext = createContext({
  searchQuery: "",
  setSearchQuery: () => {},
});

export function TemplateSearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <TemplateSearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </TemplateSearchContext.Provider>
  );
}
