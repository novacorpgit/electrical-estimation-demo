
import React from 'react';
import { Navigation } from "@/components/Navigation";
import { ProjectsView } from "@/components/ProjectsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Projects" />
      
      <main className="container mx-auto p-4 mt-4">
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-800" />
          <AlertDescription className="text-blue-800">
            Use the "Hide Completed Projects" toggle to filter out completed projects. For completed projects, use the "Create Revision" button to make changes.
          </AlertDescription>
        </Alert>
        
        <ProjectsView />
      </main>
    </div>
  );
};

export default ProjectsPage;
