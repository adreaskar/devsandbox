"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
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
import { toast } from "sonner";
import { createTemplate } from "@/actions/createTemplate";

const BASE_IMAGES = [
  { value: "ubuntu-22.04", label: "Ubuntu 22.04 LTS" },
  { value: "ubuntu-24.04", label: "Ubuntu 24.04 LTS" },
  { value: "alpine-3.19", label: "Alpine 3.19" },
  { value: "alpine-3.20", label: "Alpine 3.20" },
  { value: "debian-12", label: "Debian 12" },
  { value: "node-20", label: "Node.js 20 LTS" },
  { value: "node-22", label: "Node.js 22" },
  { value: "node-24", label: "Node.js 24" },
  { value: "python-3.11", label: "Python 3.11" },
  { value: "python-3.12", label: "Python 3.12" },
  { value: "python-3.13", label: "Python 3.13" },
];

function CreateTemplateButton({ userId }) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    stackId: "",
    name: "",
    description: "",
    icon: "",
    baseImage: "",
    technologies: [],
  });
  const [techInput, setTechInput] = useState("");

  const handleAddTechnology = () => {
    if (
      techInput.trim() &&
      !newTemplate.technologies.includes(techInput.trim())
    ) {
      setNewTemplate({
        ...newTemplate,
        technologies: [...newTemplate.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTechnology = (tech) => {
    setNewTemplate({
      ...newTemplate,
      technologies: newTemplate.technologies.filter((t) => t !== tech),
    });
  };

  const handleCreateTemplate = async () => {
    // Validation
    if (!newTemplate.stackId.trim()) {
      toast.error("Please enter a stack ID");
      return;
    }
    if (!newTemplate.name.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (!newTemplate.description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!newTemplate.icon.trim()) {
      toast.error("Please enter an emoji icon");
      return;
    }
    if (!newTemplate.baseImage) {
      toast.error("Please select a base image");
      return;
    }
    if (newTemplate.technologies.length === 0) {
      toast.error("Please add at least one technology");
      return;
    }

    setIsCreating(true);

    const createPromise = createTemplate({
      stackId: newTemplate.stackId.trim(),
      name: newTemplate.name.trim(),
      description: newTemplate.description.trim(),
      icon: newTemplate.icon.trim(),
      technologies: newTemplate.technologies,
      baseImage: newTemplate.baseImage,
      userId,
    });

    toast.promise(createPromise, {
      loading: "Creating template...",
      success: (result) => {
        if (result.success) {
          setCreateDialogOpen(false);
          setNewTemplate({
            stackId: "",
            name: "",
            description: "",
            icon: "",
            baseImage: "",
            technologies: [],
          });
          setIsCreating(false);
          setTimeout(() => window.location.reload(), 1000);
          return `Template "${result.template.name}" created successfully!`;
        } else {
          setIsCreating(false);
          throw new Error(result.error);
        }
      },
      error: (err) => {
        setIsCreating(false);
        return err.message || "Failed to create template";
      },
    });
  };

  return (
    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 py-3 md:py-5">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Custom Template</span>
          <span className="sm:hidden">Create Template</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Template</DialogTitle>
          <DialogDescription>
            Define a reusable environment template for your workspaces
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-5 pt-3 md:pt-4">
          {/* Icon Preview */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl gradient-primary flex items-center justify-center text-2xl md:text-3xl">
              {newTemplate.icon || "❓"}
            </div>
            <div className="flex-1">
              <Label htmlFor="icon">Emoji Icon</Label>
              <Input
                id="icon"
                placeholder="e.g., 🐍 or 📦 or ⚛️"
                value={newTemplate.icon}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, icon: e.target.value })
                }
                className="mt-1"
                maxLength={4}
              />
            </div>
          </div>

          {/* Stack ID */}
          <div className="space-y-2">
            <Label htmlFor="stackId">
              Stack ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="stackId"
              placeholder="e.g., pythonml, nodeexpress, reactvite"
              value={newTemplate.stackId}
              onChange={(e) =>
                setNewTemplate({
                  ...newTemplate,
                  stackId: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, ""),
                })
              }
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Lowercase alphanumeric only, no spaces or special characters
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Template Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Python Machine Learning, Node.js + Express"
              value={newTemplate.name}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
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
            <Label htmlFor="baseImage">
              Base Image <span className="text-red-500">*</span>
            </Label>
            <Select
              value={newTemplate.baseImage}
              onValueChange={(value) =>
                setNewTemplate({ ...newTemplate, baseImage: value })
              }
            >
              <SelectTrigger id="baseImage">
                <SelectValue placeholder="Select a base image" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {BASE_IMAGES.map((image) => (
                  <SelectItem key={image.value} value={image.value}>
                    {image.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This will be used to generate the Dockerfile
            </p>
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label htmlFor="technologies">
              Technologies <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="technologies"
                placeholder="e.g., Express, MongoDB, JWT"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTechnology();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTechnology}
              >
                Add
              </Button>
            </div>
            {newTemplate.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newTemplate.technologies.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 w-full"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 w-full"
              onClick={handleCreateTemplate}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTemplateButton;
