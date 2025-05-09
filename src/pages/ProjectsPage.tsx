
import React from 'react';
import { Navigation } from "@/components/Navigation";
import { ProjectsView } from "@/components/ProjectsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Projects" />
      
      <main className="container mx-auto p-4 mt-4">
        <ProjectsView />
      </main>
    </div>
  );
};

export default ProjectsPage;
