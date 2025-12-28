"use client";

import { CheckCircle2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function TemplateCard({ template, isPopular }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer rounded-md relative overflow-hidden border-border/50 ">
          {isPopular && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" className="gap-1">
                <Star className="w-3 h-3 fill-current" />
                Popular
              </Badge>
            </div>
          )}

          <CardHeader>
            <div className="text-4xl mb-3">{template.icon}</div>
            <CardTitle className="text-xl">{template.name}</CardTitle>
            <CardDescription className="font-mono">
              {template.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {template.technologies.map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-primary"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="text-4xl mb-4">{template.icon}</div>
          <DialogTitle className="text-2xl">{template.name}</DialogTitle>
          <DialogDescription className="text-base">
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">What's included:</h4>
            <div className="space-y-2">
              <FeatureItem text="Pre-configured development environment" />
              <FeatureItem text="Essential packages and dependencies" />
              <FeatureItem text="Integrated debugging tools" />
              <FeatureItem text="Hot reload and live preview" />
              <FeatureItem text="Version control setup" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {template.technologies.map((tech, index) => (
                <Badge key={index} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-mono">
                Popularity
              </p>
              <p
                className={`text-lg font-semibold ${
                  template.popularityScore >= 20 && "text-warning"
                }`}
              >
                {template.popularityScore}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-mono">
                Active Users
              </p>
              <p className="text-lg font-semibold">342</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-mono">
                Avg. Launch
              </p>
              <p className="text-lg font-semibold">28s</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const FeatureItem = ({ text }) => (
  <div className="flex items-start gap-2">
    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
    <span className="text-sm">{text}</span>
  </div>
);

export default TemplateCard;
