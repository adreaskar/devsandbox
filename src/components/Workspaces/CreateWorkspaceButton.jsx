"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateWorkspaceWizard } from "@/components/Workspaces/CreateWorkspaceWizard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CreateWorkspaceButton({ userId, templates = [] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 py-3 md:py-5">
          <Plus className="w-4 h-4" />
          Create Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
        <CreateWorkspaceWizard
          onClose={() => setIsCreateOpen(false)}
          userId={userId}
          templates={templates}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkspaceButton;
