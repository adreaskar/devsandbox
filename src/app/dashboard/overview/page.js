import WorkspaceViewButton from "@/components/Workspaces/WorkspaceViewButton";
import WorkspaceGrid from "@/components/Workspaces/WorkspaceGrid";
import CreateWorkspaceButton from "@/components/Workspaces/CreateWorkspaceButton";
import StatsGrid from "@/components/Workspaces/StatsGrid";
import { WorkspaceViewProvider } from "@/context/WorkspaceView";
import { getUserWorkspaces } from "@/actions/getWorkspaces";
import { auth } from "@/auth";

const Overview = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.username;

  const workspaces = await getUserWorkspaces(userId);

  return (
    <WorkspaceViewProvider>
      <div className="h-full flex flex-col min-h-0 gap-8">
        <div className="flex items-center justify-between">
          <div>
            <p className=" text-xl font-mono font-medium">
              <span className="text-accent">{userName}</span>
              <span className="text-muted-foreground">@devsandbox</span>:
              <span className="text-muted-foreground">~/workspaces</span>$
            </p>
          </div>

          <div className="flex items-center gap-3">
            <WorkspaceViewButton />
            <CreateWorkspaceButton userId={userId} />
          </div>
        </div>

        <StatsGrid userId={userId} />

        <WorkspaceGrid workspaces={workspaces} />
      </div>
    </WorkspaceViewProvider>
  );
};

export default Overview;
