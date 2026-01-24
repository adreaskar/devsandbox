import WorkspaceViewButton from "@/components/Workspaces/WorkspaceViewButton";
import WorkspaceGrid from "@/components/Workspaces/WorkspaceGrid";
import CreateWorkspaceButton from "@/components/Workspaces/CreateWorkspaceButton";
import StatsGrid from "@/components/Workspaces/StatsGrid";
import DockerMetricsDashboard from "@/components/Admin/DockerMetricsDashboard";
import { WorkspaceViewProvider } from "@/context/WorkspaceView";
import { getUserWorkspaces } from "@/actions/getWorkspaces";
import { getTemplates } from "@/actions/getTemplates";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const Overview = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.username;

  // Get user details to check admin status
  await dbConnect();
  const user = await User.findById(userId).lean();
  const isAdmin = user?.isAdmin || false;

  const workspaces = !isAdmin ? await getUserWorkspaces(userId) : [];
  const templates = !isAdmin ? await getTemplates() : [];

  // Admin View
  if (isAdmin) {
    return (
      <div className="h-full flex flex-col min-h-0 gap-8 overflow-y-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-mono font-medium">
              <span className="text-accent">{userName}</span>
              <span className="text-muted-foreground">@devsandbox</span>:
              <span className="text-muted-foreground">~/admin-overview</span>$
            </p>
          </div>
        </div>

        <DockerMetricsDashboard />
      </div>
    );
  }

  // Regular User View
  return (
    <WorkspaceViewProvider>
      <div className="h-full flex flex-col min-h-0 gap-4 md:gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="overflow-hidden">
            <p className="text-base sm:text-xl font-mono font-medium truncate">
              <span className="text-accent">{userName}</span>
              <span className="text-muted-foreground">@devsandbox</span>:
              <span className="text-muted-foreground">~/workspaces</span>$
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <WorkspaceViewButton />
            <CreateWorkspaceButton userId={userId} templates={templates} />
          </div>
        </div>

        <StatsGrid userId={userId} />

        <WorkspaceGrid workspaces={workspaces} />
      </div>
    </WorkspaceViewProvider>
  );
};

export default Overview;
