"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const TEMPLATE_ICONS = [
  { value: "code", icon: "💻", label: "Code" },
  { value: "database", icon: "🗄️", label: "Database" },
  { value: "globe", icon: "🌐", label: "Web" },
  { value: "rocket", icon: "🚀", label: "Rocket" },
  { value: "cpu", icon: "⚙️", label: "System" },
  { value: "python", icon: "🐍", label: "Python" },
  { value: "node", icon: "📦", label: "Node.js" },
  { value: "react", icon: "⚛️", label: "React" },
];

function CreateTemplateButton({ userId }) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    icon: "code",
    baseImage: "",
    version: "1.0.0",
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (!newTemplate.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    toast.success(`Template "${newTemplate.name}" created successfully!`);
    setCreateDialogOpen(false);
    setNewTemplate({
      name: "",
      description: "",
      icon: "code",
      baseImage: "",
      version: "1.0.0",
    });
  };

  const selectedIconData = TEMPLATE_ICONS.find(
    (i) => i.value === newTemplate.icon,
  );

  return (
    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 py-3 md:py-5">
          <Plus className="w-4 h-4" />
          Create Custom Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Template</DialogTitle>
          <DialogDescription>
            Define a reusable environment template for your workspaces
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Icon Preview */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-3xl">
              {selectedIconData?.icon || "💻"}
            </div>
            <div className="flex-1">
              <Label htmlFor="icon">Template Icon</Label>
              <Select
                value={newTemplate.icon}
                onValueChange={(value) =>
                  setNewTemplate({ ...newTemplate, icon: value })
                }
              >
                <SelectTrigger id="icon" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_ICONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <span className="flex items-center gap-2">
                        <span>{icon.icon}</span>
                        <span>{icon.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g., Python Data Science"
              value={newTemplate.name}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this template includes..."
              rows={3}
              value={newTemplate.description}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, description: e.target.value })
              }
            />
          </div>

          {/* Base Image */}
          <div className="space-y-2">
            <Label htmlFor="baseImage">Base Image</Label>
            <Select
              value={newTemplate.baseImage}
              onValueChange={(value) =>
                setNewTemplate({ ...newTemplate, baseImage: value })
              }
            >
              <SelectTrigger id="baseImage">
                <SelectValue placeholder="Select a base image" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ubuntu-22.04">Ubuntu 22.04 LTS</SelectItem>
                <SelectItem value="debian-12">Debian 12</SelectItem>
                <SelectItem value="alpine-3.18">Alpine 3.18</SelectItem>
                <SelectItem value="node-20">Node.js 20 LTS</SelectItem>
                <SelectItem value="python-3.12">Python 3.12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Version */}
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              placeholder="1.0.0"
              value={newTemplate.version}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, version: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={handleCreateTemplate}
            >
              Create Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTemplateButton;
