"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import WorkspaceCard from "@/components/Workspaces/WorkspaceCard";
import { WorkspaceViewContext } from "@/context/WorkspaceView";

function WorkspaceGrid({ workspaces }) {
  const router = useRouter();
  const { view } = useContext(WorkspaceViewContext);

  useEffect(() => {
    console.log("[FRONTEND] -- Workspace Grid listening for Docker updates...");
    const eventSource = new EventSource("/api/docker-events");

    eventSource.onmessage = (event) => {
      console.log("[FRONTEND] --Docker event received! Refreshing list...");
      router.refresh();
    };

    return () => {
      console.log("[FRONTEND] -- Disconnecting workspace stream.");
      eventSource.close();
    };
  }, [router]);

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className=" text-center py-10 flex-1 flex flex-col justify-center rounded-md cross">
        <Search
          className="w-10 h-10 mx-auto mb-6"
          color="var(--muted-foreground)"
        />
        <h3 className="text-lg mb-2 text-muted-foreground font-mono">
          No <span className="text-white/80">$WORKSPACES</span> found
        </h3>
      </div>
    );
  }

  return (
    <div className="cross p-5 rounded-md flex-1 overflow-y-auto min-h-0">
      <div
        className={
          view === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace._id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
}

export default WorkspaceGrid;
