
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubProjectForm } from "./SubProjectForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// Mocked sub-project data
const mockSubProjects = [
  {
    id: "SP001",
    name: "DB-01",
    quantity: 1,
    panelType: "DB",
    formType: "Form 1",
    installationType: "Indoor",
    boardRating: "100A",
    ipRating: "IP54",
    shortCircuitRating: "10kA",
    status: "In Progress",
  },
  {
    id: "SP002",
    name: "MSB-01",
    quantity: 1,
    panelType: "MSB",
    formType: "Form 4",
    installationType: "Indoor",
    boardRating: "1000A",
    ipRating: "IP54",
    shortCircuitRating: "50kA",
    status: "Draft",
  },
  {
    id: "SP003",
    name: "PLC-01",
    quantity: 2,
    panelType: "Control",
    formType: "Form 2",
    installationType: "Indoor",
    boardRating: "63A",
    ipRating: "IP55",
    shortCircuitRating: "10kA",
    status: "Completed",
  },
];

interface SubProjectsViewProps {
  projectId: string;
  projectName: string;
}

export const SubProjectsView = ({ projectId, projectName }: SubProjectsViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateSubProject, setShowCreateSubProject] = useState(false);
  const [selectedSubProjects, setSelectedSubProjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Filter sub-projects based on search term and active tab
  const filteredSubProjects = mockSubProjects.filter(subProject => {
    const matchesSearch = 
      subProject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subProject.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subProject.panelType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "inProgress") return matchesSearch && subProject.status === "In Progress";
    if (activeTab === "completed") return matchesSearch && subProject.status === "Completed";
    if (activeTab === "draft") return matchesSearch && subProject.status === "Draft";
    
    return matchesSearch;
  });

  const handleSelectSubProject = (subProjectId: string) => {
    setSelectedSubProjects(prev => {
      if (prev.includes(subProjectId)) {
        return prev.filter(id => id !== subProjectId);
      } else {
        return [...prev, subProjectId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSubProjects.length === filteredSubProjects.length) {
      setSelectedSubProjects([]);
    } else {
      setSelectedSubProjects(filteredSubProjects.map(p => p.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Sub-Projects</h2>
          <p className="text-sm text-gray-500">Project: {projectName} ({projectId})</p>
        </div>
        <Button onClick={() => setShowCreateSubProject(true)}>Create Sub-Project</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3">
              <Input
                placeholder="Search sub-projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline">BOM Management</Button>
              <Button variant="outline">Quote Generation</Button>
              <Button variant="outline" disabled={selectedSubProjects.length === 0}>
                Bulk Actions
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Sub-Projects</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={selectedSubProjects.length === filteredSubProjects.length && filteredSubProjects.length > 0} 
                            onCheckedChange={handleSelectAll}
                          />
                          <span>ID</span>
                        </div>
                      </th>
                      <th className="h-10 px-4 text-left">Name</th>
                      <th className="h-10 px-4 text-left">Panel Type</th>
                      <th className="h-10 px-4 text-left">Form Type</th>
                      <th className="h-10 px-4 text-left">Board Rating</th>
                      <th className="h-10 px-4 text-left">Quantity</th>
                      <th className="h-10 px-4 text-left">Status</th>
                      <th className="h-10 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubProjects.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="h-24 text-center text-muted-foreground">
                          No sub-projects found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubProjects.map((subProject) => (
                        <tr key={subProject.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                checked={selectedSubProjects.includes(subProject.id)}
                                onCheckedChange={() => handleSelectSubProject(subProject.id)}
                              />
                              <span>{subProject.id}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium">{subProject.name}</td>
                          <td className="p-4">{subProject.panelType}</td>
                          <td className="p-4">{subProject.formType}</td>
                          <td className="p-4">{subProject.boardRating}</td>
                          <td className="p-4">{subProject.quantity}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(subProject.status)}`}>
                              {subProject.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Layout</Button>
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

      {showCreateSubProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create New Sub-Project</CardTitle>
            </CardHeader>
            <CardContent>
              <SubProjectForm 
                projectId={projectId} 
                onCancel={() => setShowCreateSubProject(false)} 
                onSuccess={() => {}} 
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
