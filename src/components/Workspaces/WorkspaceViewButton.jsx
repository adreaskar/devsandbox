"use client";

import React, { useContext } from "react";
import { WorkspaceViewContext } from "@/context/WorkspaceView";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

function WorkspaceViewButton() {
  const { view, setView } = useContext(WorkspaceViewContext);

  return (
    <div className="flex items-center gap-2 p-1 bg-muted border-border border rounded-md">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => setView("list")}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default WorkspaceViewButton;
