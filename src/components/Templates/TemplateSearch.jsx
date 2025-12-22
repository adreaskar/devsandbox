"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useContext } from "react";
import { TemplateSearchContext } from "@/context/TemplateSearch";

function TemplateSearch() {
  const { searchQuery, setSearchQuery } = useContext(TemplateSearchContext);

  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
        color="var(--muted-foreground)"
      />
      <Input
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 border-border/50 border bg-primary"
      />
    </div>
  );
}

export default TemplateSearch;
