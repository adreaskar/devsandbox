import { TemplateSearchProvider } from "@/context/TemplateSearch";
import TemplatesTabs from "@/components/Templates/TemplatesTabs";
import CreateTemplateButton from "@/components/Templates/CreateTemplateButton";
import Window from "@/components/Window";
import { getTemplates } from "@/actions/getTemplates";
import { getActiveTemplates } from "@/actions/getTemplates";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const Templates = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.username;

  // Get user details to check admin status
  await dbConnect();
  const user = await User.findById(userId).lean();
  const isAdmin = user?.isAdmin || false;

  const templates = await getTemplates();
  const activeTemplates = await getActiveTemplates();
  const popularTemplates = templates.filter(
    (template) => template.popularityScore >= 20,
  );

  return (
    <TemplateSearchProvider>
      <div className="h-full flex flex-col min-h-0 gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className=" text-xl font-mono font-medium">
              <span className="text-accent">{userName}</span>
              <span className="text-muted-foreground">@devsandbox</span>:
              <span className="text-muted-foreground">~/templates</span>$
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && <CreateTemplateButton userId={userId} />}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Window title="Total" className="border-border/50 border-solid">
            <p className="text-3xl font-bold text-primary-foreground">
              {templates.length.toString()}
            </p>
          </Window>
          <Window title="Active" className="border-border/50 border-solid">
            <p className="text-3xl font-bold text-primary-foreground">
              {activeTemplates}
            </p>
          </Window>
          <Window title="Popular" className="border-border/50 border-solid">
            <p className="text-3xl font-bold text-primary-foreground">
              {popularTemplates.length}
            </p>
          </Window>
          <Window title="Downloads" className="border-border/50 border-solid">
            <p className="text-3xl font-bold text-primary-foreground">2.4k</p>
          </Window>
        </div>

        {/* Templates Tabs */}
        <TemplatesTabs templates={templates} />
      </div>
    </TemplateSearchProvider>
  );
};

export default Templates;
