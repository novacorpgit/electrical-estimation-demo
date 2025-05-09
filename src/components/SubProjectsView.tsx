
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubProjectForm } from "./SubProjectForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Eye, Clipboard, LayoutGrid, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for sub-projects
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
    lastUpdated: "2025-04-15",
    progress: 65
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
    lastUpdated: "2025-04-12",
    progress: 30
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
    lastUpdated: "2025-04-20",
    progress: 100
  },
];

// Mock data for projects (for duplication target)
const mockProjects = [
  { id: "P001", name: "Building A - Electrical Upgrade" },
  { id: "P002", name: "Office Tower - New Installation" },
  { id: "P003", name: "Shopping Mall Renovation" },
  { id: "P004", name: "Hospital Extension" }
];

interface SubProjectsViewProps {
  projectId: string;
  projectName: string;
}

export const SubProjectsView = ({ projectId, projectName }: SubProjectsViewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddSubProject, setShowAddSubProject] = useState(false);
  const [selectedSubProject, setSelectedSubProject] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubProjects, setSelectedSubProjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subProjectToDelete, setSubProjectToDelete] = useState<string | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState<string>(projectId);

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

  const handleAddSubProject = () => {
    setSelectedSubProject(null);
    setIsEditMode(false);
    setShowAddSubProject(true);
  };

  const handleEditSubProject = (subProject: any) => {
    setSelectedSubProject(subProject);
    setIsEditMode(true);
    setShowAddSubProject(true);
  };

  const handleDeleteSubProject = (subProjectId: string) => {
    setSubProjectToDelete(subProjectId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // In a real app, this would be an API call
    toast({
      title: "Panel deleted",
      description: "The panel has been deleted successfully.",
    });
    setShowDeleteConfirm(false);
    setSubProjectToDelete(null);
  };

  const handleDuplicateSubProject = (subProject: any) => {
    setSelectedSubProject(subProject);
    setShowDuplicateDialog(true);
  };

  const executeDuplication = () => {
    // In a real app, this would be an API call to duplicate the panel
    toast({
      title: "Panel duplicated",
      description: `The panel has been duplicated ${targetProjectId !== projectId ? 'to another project' : 'within this project'}.`,
    });
    setShowDuplicateDialog(false);
  };

  const handleView2DLayout = (subProject: any) => {
    navigate(`/panel-layout/${subProject.id}`, { 
      state: { 
        subProject,
        projectId,
        projectName
      }
    });
  };

  const handleManageBom = (subProjectId: string, subProject: any) => {
    navigate(`/bom/${subProjectId}`, { 
      state: { 
        subProject,
        projectId,
        projectName
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Total Sub-Projects</div>
            <div className="text-3xl font-bold mt-2">{mockSubProjects.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Completed</div>
            <div className="text-3xl font-bold mt-2 text-green-600">
              {mockSubProjects.filter(sp => sp.status === "Completed").length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">In Progress</div>
            <div className="text-3xl font-bold mt-2 text-blue-600">
              {mockSubProjects.filter(sp => sp.status === "In Progress").length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Average Progress</div>
            <div className="text-3xl font-bold mt-2 text-amber-600">
              {Math.round(mockSubProjects.reduce((acc, sp) => acc + sp.progress, 0) / mockSubProjects.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search panels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <Button 
                variant="default" 
                className="flex items-center space-x-2"
                onClick={handleAddSubProject}
              >
                <Plus className="h-4 w-4" />
                <span>Add Panel</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Panels</TabsTrigger>
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
                      <th className="h-10 px-4 text-left">Status</th>
                      <th className="h-10 px-4 text-left">Progress</th>
                      <th className="h-10 px-4 text-left">Last Updated</th>
                      <th className="h-10 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubProjects.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="h-24 text-center text-muted-foreground">
                          No panels found. Click "Add Panel" to create one.
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
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(subProject.status)}`}>
                              {subProject.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getProgressColor(subProject.progress)}`} 
                                  style={{ width: `${subProject.progress}%` }}
                                ></div>
                              </div>
                              <span>{subProject.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-500">{subProject.lastUpdated}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditSubProject(subProject)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteSubProject(subProject.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDuplicateSubProject(subProject)}
                                title="Duplicate"
                                className="text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleView2DLayout(subProject)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                title="2D Layout"
                              >
                                <LayoutGrid className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleManageBom(subProject.id, subProject)}
                                className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                title="Create/Manage BOM"
                              >
                                <Clipboard className="h-4 w-4" />
                              </Button>
                            </div>
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

      {/* Add/Edit Sub-Project Dialog */}
      <Dialog open={showAddSubProject} onOpenChange={setShowAddSubProject}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>
              {isEditMode ? `Edit Panel: ${selectedSubProject?.name}` : "Add New Panel"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {isEditMode ? "update" : "create"} a panel.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <SubProjectForm 
              projectId={projectId}
              onCancel={() => setShowAddSubProject(false)}
              onSuccess={() => {
                // In a real app, this would refresh the data
                setShowAddSubProject(false);
                toast({
                  title: isEditMode ? "Panel updated" : "Panel added",
                  description: isEditMode 
                    ? `Panel ${selectedSubProject?.name} has been updated successfully.` 
                    : "New panel has been added successfully.",
                });
              }}
              initialData={selectedSubProject}
              isEditMode={isEditMode}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the panel
              and all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duplicate Sub-Project Dialog */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Duplicate Panel</DialogTitle>
            <DialogDescription>
              Create a copy of this panel with all its specifications.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="target-project" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Target Project</label>
              <Select value={targetProjectId} onValueChange={setTargetProjectId}>
                <SelectTrigger id="target-project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                      {project.id === projectId ? " (Current)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Details to be duplicated:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li>Panel specifications and configurations</li>
                <li>All components and connections</li>
                <li>Layout and technical details</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>Cancel</Button>
            <Button onClick={executeDuplication}>Duplicate Panel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add NotesPanel for sub-projects */}
      {selectedSubProject && (
        <NotesPanel 
          entityId={selectedSubProject.id} 
          entityType="subProject" 
          entityName={selectedSubProject.name}
        />
      )}
      
      {/* When no sub-project is selected, show project notes */}
      {!selectedSubProject && (
        <NotesPanel 
          entityId={projectId} 
          entityType="project"
          entityName={projectName}
        />
      )}
    </div>
  );
};
