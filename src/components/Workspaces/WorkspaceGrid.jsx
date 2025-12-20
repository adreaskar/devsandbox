"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkspaceCard from "@/components/Workspaces/WorkspaceCard";
import { WorkspaceViewContext } from "@/context/WorkspaceView";
import Image from "next/image";

function WorkspaceGrid({ workspaces }) {
  const router = useRouter();
  const { view } = useContext(WorkspaceViewContext);
  const cloudAscii = String.raw`
+------------------------------+
|  [ DATA CENTER CABINET 01 ]  |
+------------------------------+
| [==========================] |
| | ::  ::  ::  ::    POWER  | |
| [==========================] |
|                              |
| [==========================] |
| | ||||||||||||||||  HDD 1  | |
| [==========================] |
|                              |
| [==========================] |
| | ||||||||||||||||  HDD 2  | |
| [==========================] |
|                              |
|      ... DEVSANDBOX ...      |
+------------------------------+
  `;

  useEffect(() => {
    console.log("🔌 Workspace Grid listening for updates...");
    const eventSource = new EventSource("/api/docker-events");

    eventSource.onmessage = (event) => {
      console.log("⚡ Change detected. Refreshing list...");
      router.refresh();
    };

    return () => {
      eventSource.close();
    };
  }, [router]);

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className=" text-center py-10 grow flex flex-col justify-center rounded-md cross">
        <p className="font-mono text-muted-foreground">
          No workspaces found. Create one to get started!
        </p>
        <div className="mt-6">
          <pre className="select-none font-mono text-xs text-accent-light opacity-65">
            {cloudAscii}
          </pre>
        </div>
      </div>
    );
  }

  return (
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
  );
}

export default WorkspaceGrid;
