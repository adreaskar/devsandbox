import WorkspaceViewButton from "@/components/Workspaces/WorkspaceViewButton";
import WorkspaceGrid from "@/components/Workspaces/WorkspaceGrid";
import CreateWorkspace from "@/components/Workspaces/CreateWorkspace";
import StatsGrid from "@/components/StatsGrid";
import { WorkspaceViewProvider } from "@/context/WorkspaceView";
import { getUserWorkspaces } from "@/actions/getWorkspaces";

const Overview = async () => {
  // const session = await auth();
  // const userId = session?.user?.id || "693fbfd8760256e18a9a676f"; // Fallback for dev
  const userId = "693fbfd8760256e18a9a676f"; // Hardcoded for now based on your setup

  const workspaces = await getUserWorkspaces(userId);

  return (
    <WorkspaceViewProvider>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground font-mono mt-1">
              Manage your development environments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <WorkspaceViewButton />

            <CreateWorkspace />
          </div>
        </div>

        <StatsGrid />

        <WorkspaceGrid workspaces={workspaces} />
      </div>
    </WorkspaceViewProvider>
  );
};

export default Overview;
