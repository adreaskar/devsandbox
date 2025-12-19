'use client';

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateWorkspaceWizard } from "@/components/Workspaces/CreateWorkspaceWizard";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function CreateWorkspace() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    return (
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Workspace
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Workspace</DialogTitle>
                    <DialogDescription>
                        Choose your stack and configure your development environment
                    </DialogDescription>
                </DialogHeader>
                <CreateWorkspaceWizard onClose={() => setIsCreateOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

export default CreateWorkspace;