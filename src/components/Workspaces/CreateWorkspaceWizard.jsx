"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { createWorkspace } from "@/actions/createWorkspace";
import { validateGitRepo } from "@/actions/validateGitRepo";

export const CreateWorkspaceWizard = ({ onClose, userId, templates = [] }) => {
  const [step, setStep] = useState(1);
  const [selectedStack, setSelectedStack] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [gitRepoName, setGitRepoName] = useState("");
  const description =
    templates.find((s) => s.stackId === selectedStack)?.description || "";
  const technologies =
    templates
      .find((s) => s.stackId === selectedStack)
      ?.technologies?.join(", ") || "";

  const handleCreate = async () => {
    // Validate GitHub repo if provided
    if (gitRepoName && gitRepoName.trim() !== "") {
      const validation = await validateGitRepo(gitRepoName);

      if (!validation.success) {
        toast.error(validation.error);
        return;
      }
    }

    const launchPromise = async () => {
      const result = await createWorkspace(
        userId,
        selectedStack,
        workspaceName,
        description,
        technologies,
        gitRepoName,
      );

      if (!result.success)
        throw new Error(result.error || "Unknown error occurred");
      return result;
    };

    toast.promise(launchPromise(), {
      loading: "Initializing Workspace Environment...",
      success: (data) => {
        // 'data' here is the return value from launchPromise (the result object)
        return `Environment Ready! ID: ${data.containerId.slice(0, 12)}`;
      },
      error: (err) => {
        // 'err' here is the Error we threw in the wrapper
        return `Deployment Failed: ${err.message}`;
      },
    });
    onClose();
  };

  return (
    <div className="space-y-4 md:space-y-6 mt-2 md:mt-3">
      {/* ======================= */}
      {/* --- STEPS INDICATOR --- */}
      {/* ======================= */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
              s === step
                ? "bg-accent text-white"
                : s < step
                  ? "bg-primary border border-border border-dashed text-white"
                  : "bg-white text-background",
            )}
          >
            {s < step ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : s}
          </div>
        ))}
      </div>
      <hr className="opacity-70" />
      {/* ============================ */}
      {/* --- STEP 1: SELECT STACK --- */}
      {/* ============================ */}
      {step === 1 && (
        <div className="space-y-3 md:space-y-4">
          <div className="flex font-mono gap-2 text-xs md:text-sm mb-1 md:mb-2">
            <span className="size-2 rounded-full bg-accent my-auto" />
            <span>STEP 1 :: CHOOSE YOUR STACK</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-mono mb-4 md:mb-10">
            Select a base technology stack for your workspace
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {templates.map((template) => (
              <button
                key={template.stackId}
                onClick={() => setSelectedStack(template.stackId)}
                className={cn(
                  "border border-dashed border-border/80 bg-background p-3 md:p-4 rounded-md text-left transition-all",
                  selectedStack === template.stackId &&
                    "ring-2 ring-accent border-accent border-solid bg-primary ",
                )}
              >
                <div className="text-2xl md:text-3xl mb-2">{template.icon}</div>
                <h4 className="font-semibold mb-1 text-sm md:text-base">
                  {template.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {template.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {template.technologies?.join(", ")}
                </p>
              </button>
            ))}
          </div>

          <p className="text-xs md:text-sm text-muted-foreground font-mono mt-4 md:mt-6 break-all">
            $ devsandbox install{" "}
            <span className="text-accent">
              {selectedStack || "<select a stack>"}
            </span>
          </p>
        </div>
      )}

      {/* ================================= */}
      {/* --- STEP 2: WORKSPACE DETAILS --- */}
      {/* ================================= */}
      {step === 2 && (
        <div className="space-y-3 md:space-y-4">
          <div className="flex font-mono gap-2 text-xs md:text-sm mb-1 md:mb-2">
            <span className="size-2 rounded-full bg-accent my-auto" />
            <span>STEP 2 :: WORKSPACE DETAILS</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-10">
            Provide a name and optional GitHub repository for your workspace
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                placeholder="my-awesome-project"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="repo">Git Repository (Optional)</Label>
              <Input
                id="repo"
                placeholder="https://github.com/username/repo"
                value={gitRepoName}
                onChange={(e) => {
                  setGitRepoName(e.target.value);
                }}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 pt-3 md:pt-4">
        <Button
          variant="ghost"
          onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
          className="w-full sm:w-auto"
        >
          {step > 1 ? "Back" : "Cancel"}
        </Button>

        {step < 2 ? (
          <Button
            variant="default"
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !selectedStack}
            className="w-full sm:w-auto"
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleCreate}
            disabled={!workspaceName}
            className="w-full sm:w-auto"
          >
            Create Workspace
          </Button>
        )}
      </div>
    </div>
  );
};
