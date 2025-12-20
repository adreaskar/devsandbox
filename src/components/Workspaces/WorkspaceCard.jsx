'use client'

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Cpu, HardDrive, MemoryStick, Play, Square, Trash, Terminal, Loader2, SquareTerminal } from "lucide-react";
import { toggleContainer } from "@/actions/workspaceControls";
import { deleteWorkspace } from "@/actions/deleteWorkspace";
import { toast } from "sonner";

function WorkspaceCard({ workspace }) {
    const { name, description, container, stack, _id, owner } = workspace;

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Handle Start/Stop
    const handleControl = (action) => {
        startTransition(async () => {
            const result = await toggleContainer(_id, action);
            if (!result.success) {
                toast.error(result.error);
            } else {
                action === 'start' ? toast.success("Workspace is now running!") : toast.success("Workspace has stopped!");
                router.refresh();
            }
        });
    };

    // Handle Delete
    const handleDelete = () => {
        // Prevent accidental clicks
        if (!confirm("Delete this workspace permanently? This cannot be undone.")) return;

        startTransition(async () => {
            await deleteWorkspace(_id, owner);
            toast.success("Workspace has been deleted!");
            router.refresh();
        });
    };

    return (
        <Card className="rounded-md bg-primary border-border/50">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold">{name}</CardTitle>
                    <StatusBadge status={container.status} />
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-1">{description}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Resource Usage */}
                    {/* <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">CPU:</span>
                            <span className="font-medium">{workspace.cpu}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MemoryStick className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">RAM:</span>
                            <span className="font-medium">{workspace.memory}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Disk:</span>
                            <span className="font-medium">{workspace.disk}%</span>
                        </div>
                    </div> */}

                    <hr className="opacity-60" />

                    {/* Base technologies used */}
                    <div className="text-sm font-mono text-muted-foreground">
                        $ Base technologies: <span className="font-medium">{workspace.technologies}</span>
                    </div>

                    {/* Available URLs */}
                    <div className="space-y-1">
                        {container.status === "running" && container.urls ? (
                            <div className="font-mono">
                                <p className="inline text-sm text-muted-foreground mr-1">$ Access App:</p>
                                <Link
                                    href={container.urls[0]}
                                    target="_blank"
                                    className="text-sm text-accent hover:underline break-all"
                                >
                                    {container.urls[0]}
                                </Link>

                            </div>
                        ) : (
                            <div className="font-mono">
                                <p className="inline text-sm text-muted-foreground mr-1">$ Start workspace to access the app</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                        {container.status === "running" ? (
                            <>
                                <Button size="sm" variant="default" className="flex-1" onClick={() => handleControl('stop')} disabled={isPending}>
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4 mr-1" />}
                                    Stop
                                </Button>
                                <Link href={container.urls?.[1]} className="flex-1" target="_blank">
                                    <Button size="sm" variant="secondary" className="w-full">
                                        <SquareTerminal color="var(--background)" className="w-4 h-4 mr-1" />
                                        Open IDE
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Button size="sm" variant="default" className="flex-1" onClick={() => handleControl('start')} disabled={isPending}>
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
                                    Start
                                </Button>
                                <Button size="sm" variant="secondary" className="flex-1" onClick={handleDelete} disabled={isPending}>
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash color="var(--background)" className="w-4 h-4 mr-1" />}
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card >
    );
};

export default WorkspaceCard;