'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner"
import stackTemplates from "@/lib/stackTemplates";

import { createWorkspace } from "@/actions/createWorkspace";

export const CreateWorkspaceWizard = ({ onClose, userId }) => {
    const [step, setStep] = useState(1);
    const [selectedStack, setSelectedStack] = useState("");
    const [workspaceName, setWorkspaceName] = useState("");
    const [gitRepoName, setGitRepoName] = useState("");
    const description = stackTemplates.find((s) => s.id === selectedStack)?.description || "";
    const technologies = stackTemplates.find((s) => s.id === selectedStack)?.version || "";

    const handleCreate = () => {
        const launchPromise = async () => {
            const result = await createWorkspace(userId, selectedStack, workspaceName, description, technologies, gitRepoName);

            if (!result.success) throw new Error(result.error || 'Unknown error occurred');
            return result;
        };

        toast.promise(launchPromise(), {
            loading: 'Initializing Workspace Environment...',
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
        <div className="space-y-6 mt-3">
            {/* ======================= */}
            {/* --- STEPS INDICATOR --- */}
            {/* ======================= */}
            <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                            s === step
                                ? "bg-accent text-white"
                                : s < step
                                    ? "bg-primary border border-border border-dashed text-white"
                                    : "bg-white text-background"
                        )}
                    >
                        {s < step ? <Check className="w-4 h-4" /> : s}
                    </div>
                ))}
            </div>
            <hr className="opacity-70" />
            {/* ============================ */}
            {/* --- STEP 1: SELECT STACK --- */}
            {/* ============================ */}
            {step === 1 && (
                <div className="space-y-4">

                    <div className="flex font-mono gap-2 text-sm mb-2">
                        <span className="size-2 rounded-full bg-accent my-auto" />
                        <span>STEP 1 :: CHOOSE YOUR STACK</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono mb-10">
                        Select a base technology stack for your workspace
                    </p>

                    <div className="grid grid-cols-4 gap-4">
                        {stackTemplates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedStack(template.id)}
                                className={cn(
                                    "border border-dashed border-border/80 bg-background p-4 rounded-md text-left transition-all",
                                    selectedStack === template.id && "ring-2 ring-accent border-accent border-solid bg-primary "
                                )}
                            >
                                <div className="text-3xl mb-2">{template.icon}</div>
                                <h4 className="font-semibold mb-1">{template.name}</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                    {template.description}
                                </p>
                                <p className="text-xs text-muted-foreground">{template.version}</p>
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-muted-foreground font-mono mt-6">
                        $ devsandbox install <span className="text-accent">{selectedStack || "<select a stack>"}</span>
                    </p>
                </div>
            )}

            {/* ================================= */}
            {/* --- STEP 2: WORKSPACE DETAILS --- */}
            {/* ================================= */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="flex font-mono gap-2 text-sm mb-2">
                        <span className="size-2 rounded-full bg-accent my-auto" />
                        <span>STEP 2 :: WORKSPACE DETAILS</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-10">
                        Provide a name and optional Git repository for your workspace
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
                                onChange={(e) => { setGitRepoName(e.target.value) }}
                                className="mt-1.5"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* =============================== */}
            {/* --- STEP 3: RESOURCE CONFIG --- */}
            {/* =============================== */}
            {/* {step === 3 && (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Resource Configuration</h3>
                        <p className="text-sm text-muted-foreground">
                            Allocate CPU, memory, and storage
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label>CPU Cores</Label>
                            <div className="flex gap-2 mt-1.5">
                                {[1, 2, 4, 8].map((cpu) => (
                                    <Button
                                        key={cpu}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        {cpu} Core{cpu > 1 ? "s" : ""}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>Memory (GB)</Label>
                            <div className="flex gap-2 mt-1.5">
                                {[2, 4, 8, 16].map((mem) => (
                                    <Button
                                        key={mem}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        {mem} GB
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
                <Button
                    variant="ghost"
                    onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                >
                    {step > 1 ? "Back" : "Cancel"}
                </Button>

                {step < 2 ? (
                    <Button
                        variant="default"
                        onClick={() => setStep(step + 1)}
                        disabled={step === 1 && !selectedStack}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        onClick={handleCreate}
                        disabled={!workspaceName}
                    >
                        Create Workspace
                    </Button>
                )}
            </div>
        </div>
    );
};