
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProjectForm } from "./CreateProjectForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// Mocked project data
const mockProjects = [
  {
    id: "P001",
    projectName: "Building A - Electrical Upgrade",
    clientName: "ABC Construction",
    state: "B",
    status: "In Progress",
    startDate: "2025-04-10",
    priority: "High",
  },
  {
    id: "P002",
    projectName: "Office Tower - New Installation",
    clientName: "XYZ Properties",
    state: "S",
    status: "Draft",
    startDate: "2025-05-15",
    priority: "Normal",
  },
  {
    id: "P003",
    projectName: "Hospital Wing - Panel Replacement",
    clientName: "State Health Department",
    state: "M",
    status: "Completed",
    startDate: "2025-03-01",
    priority: "Critical",
  },
  {
    id: "P004",
    projectName: "Shopping Mall - Main Switchboard",
    clientName: "Retail Developers Group",
    state: "P",
    status: "On Hold",
    startDate: "2025-06-20",
    priority: "Normal",
  },
  {
    id: "P005",
    projectName: "Factory Expansion - Distribution Boards",
    clientName: "Industrial Manufacturers",
    state: "B",
    status: "In Progress",
    startDate: "2025-04-25",
    priority: "High",
  },
];

export const ProjectsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Filter projects based on search term and active tab
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "inProgress") return matchesSearch && project.status === "In Progress";
    if (activeTab === "completed") return matchesSearch && project.status === "Completed";
    if (activeTab === "draft") return matchesSearch && project.status === "Draft";
    if (activeTab === "onHold") return matchesSearch && project.status === "On Hold";
    
    return matchesSearch;
  });

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "On Hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      case "Normal": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => setShowCreateProject(true)}>Create Project</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline">Export</Button>
              <Button variant="outline" disabled={selectedProjects.length === 0}>
                Bulk Actions
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="onHold">On Hold</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0} 
                            onCheckedChange={handleSelectAll}
                          />
                          <span>ID</span>
                        </div>
                      </th>
                      <th className="h-10 px-4 text-left">Project Name</th>
                      <th className="h-10 px-4 text-left">Client</th>
                      <th className="h-10 px-4 text-left">State</th>
                      <th className="h-10 px-4 text-left">Status</th>
                      <th className="h-10 px-4 text-left">Priority</th>
                      <th className="h-10 px-4 text-left">Start Date</th>
                      <th className="h-10 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="h-24 text-center text-muted-foreground">
                          No projects found.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((project) => (
                        <tr key={project.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                checked={selectedProjects.includes(project.id)}
                                onCheckedChange={() => handleSelectProject(project.id)}
                              />
                              <span>{project.id}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium">{project.projectName}</td>
                          <td className="p-4">{project.clientName}</td>
                          <td className="p-4">{project.state}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
                              {project.priority}
                            </span>
                          </td>
                          <td className="p-4">{project.startDate}</td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showCreateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateProjectForm onCancel={() => setShowCreateProject(false)} onSuccess={() => {}} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
