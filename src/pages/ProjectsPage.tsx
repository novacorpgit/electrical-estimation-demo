
import React, { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { ProjectsView } from "@/components/ProjectsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { Card, CardContent } from "@/components/ui/card";

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("view-projects");
  
  const handleProjectCreated = () => {
    // Switch back to projects tab after creation
    setActiveTab("view-projects");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Projects" />
      
      <main className="container mx-auto p-4 mt-4">
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-800" />
          <AlertDescription className="text-blue-800">
            Use the "Hide Completed Projects" toggle to filter out completed projects. 
            For completed projects, use the "Create Revision" button to make changes. 
            You can also duplicate projects to create similar quotations quickly.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="view-projects">Projects</TabsTrigger>
            <TabsTrigger value="create-project">Create New Project</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view-projects">
            <ProjectsView />
          </TabsContent>
          
          <TabsContent value="create-project">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
                <CreateProjectForm 
                  onCancel={() => setActiveTab("view-projects")}
                  onSuccess={handleProjectCreated}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectsPage;
