import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CreateProjectForm } from "./CreateProjectForm";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const PanelboardDashboard = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);

  // Mock data for the dashboard
  const pendingQuotes = 5;
  const currentProjects = 12;
  const completedProjects = 8;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuotes}</div>
            <Progress value={50} className="mt-2" />
          </CardContent>
          <CardFooter className="pt-1">
            <Link to="/quotes" className="text-xs text-blue-600 hover:underline">
              View all quotes
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentProjects}</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => setShowCreateProject(true)}
            >
              Create New Project
            </Button>
            <Button className="w-full" variant="outline">
              View All Projects
            </Button>
            <Link to="/quotes">
              <Button className="w-full" variant="outline">
                View All Quotes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your most recent projects and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock recent projects */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Project {i}</div>
                    <div className="text-sm text-gray-500">Client Name {i}</div>
                  </div>
                  <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    In Progress
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All</Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pending Quotes</CardTitle>
            <CardDescription>
              Quotes waiting for review or submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock pending quotes */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Quote B25-042{i}M-DJ</div>
                    <div className="text-sm text-gray-500">Client Name {i}</div>
                  </div>
                  <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Pending
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Sheet for project creation instead of modal */}
      <Sheet open={showCreateProject} onOpenChange={setShowCreateProject}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto" side="right">
          <SheetHeader>
            <SheetTitle>Create New Project</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CreateProjectForm onCancel={() => setShowCreateProject(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
