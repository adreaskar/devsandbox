"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
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
      <div className=" text-center py-10 grow flex flex-col justify-center rounded-md cross">
        <p className="font-mono text-muted-foreground">
          No workspaces found. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="cross p-5 rounded-md border-debug grow overflow-y-scroll">
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
