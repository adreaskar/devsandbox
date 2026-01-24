"use client";

import { useContext } from "react";
import TemplateCard from "./TemplateCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { TemplateSearchContext } from "@/context/TemplateSearch";
import TemplateSearch from "./TemplateSearch";

function TemplatesTabs({ templates, isAdmin = false }) {
  const { searchQuery } = useContext(TemplateSearchContext);

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const popularTemplates = templates.filter(
    (template) => template.popularityScore >= 20,
  );

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-10 flex-1 flex flex-col justify-center rounded-md cross">
        <Search
          className="w-10 h-10 mx-auto mb-6"
          color="var(--muted-foreground)"
        />
        <h3 className="text-lg mb-2 text-muted-foreground font-mono">
          No <span className="text-white/80">$TEMPLATES</span> found
        </h3>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col">
      <Tabs defaultValue="all" className="flex flex-col h-full space-y-6">
        <div className="flex items-center gap-6 shrink-0">
          <TabsList className="border border-border/50">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TemplateSearch />
        </div>

        <div className="cross p-5 rounded-md flex-1 overflow-y-auto">
          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.stackId}
                  template={template}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularTemplates.map((template) => (
                <TemplateCard
                  key={template.stackId}
                  template={template}
                  isPopular
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default TemplatesTabs;
