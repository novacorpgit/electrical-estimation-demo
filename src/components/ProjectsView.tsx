// At the top of the file, ensure the DndProvider and HTML5Backend are properly imported
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProjectForm } from "./CreateProjectForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Calendar, Clock, User, SlidersHorizontal, Copy, Edit, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateClientForm } from "./CreateClientForm";
import { EstimatorAvailability } from "./estimators/EstimatorAvailability";
import { format } from "date-fns";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ProjectsTable } from "./projects/ProjectsTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

// Mocked project data with additional fields
const mockProjects = [{
  id: "P001",
  projectName: "Building A - Electrical Upgrade",
  clientName: "ABC Construction",
  salesRep: "Alice Smith",
  address: "123 Main St",
  state: "B",
  classification: "Direct",
  status: "In Progress",
  startDate: "2025-04-10",
  priority: "High",
  poNumber: "PO-12345",
  refNumber: "REF-001",
  estimatorHours: "24",
  estimatorName: "John Smith",
  description: "Complete electrical upgrade for Building A"
}, {
  id: "P002",
  projectName: "Office Tower - New Installation",
  clientName: "XYZ Properties",
  salesRep: "Bob Johnson",
  address: "456 Market Ave",
  state: "S",
  classification: "Tender",
  status: "Draft",
  startDate: "2025-05-15",
  priority: "Normal",
  poNumber: "PO-23456",
  refNumber: "REF-002",
  estimatorHours: "40",
  estimatorName: "Emily Johnson",
  description: "New electrical installation for office tower"
}, {
  id: "P003",
  projectName: "Hospital Wing - Panel Replacement",
  clientName: "State Health Department",
  state: "M",
  status: "Completed",
  startDate: "2025-03-01",
  priority: "Critical",
  estimatorName: "Michael Brown"
}, {
  id: "P004",
  projectName: "Shopping Mall - Main Switchboard",
  clientName: "Retail Developers Group",
  state: "P",
  status: "On Hold",
  startDate: "2025-06-20",
  priority: "Normal",
  estimatorName: "Sarah Wilson"
}, {
  id: "P005",
  projectName: "Factory Expansion - Distribution Boards",
  clientName: "Industrial Manufacturers",
  state: "B",
  status: "In Progress",
  startDate: "2025-04-25",
  priority: "High",
  estimatorName: "Robert Davis"
}];

// Mock clients for dropdown
const mockClients = [{
  id: "C001",
  name: "ABC Construction"
}, {
  id: "C002",
  name: "XYZ Properties"
}, {
  id: "C003",
  name: "State Health Department"
}, {
  id: "C004",
  name: "Retail Developers Group"
}, {
  id: "C005",
  name: "Industrial Manufacturers"
}];

export const ProjectsView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [quickFilterProjectName, setQuickFilterProjectName] = useState("");
  const [quickFilterClientName, setQuickFilterClientName] = useState("");
  const [filteredQuickResults, setFilteredQuickResults] = useState<any[]>([]);
  const [showQuickResults, setShowQuickResults] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<any>(null);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [showClientResults, setShowClientResults] = useState(false);
  const [showEstimatorAvailability, setShowEstimatorAvailability] = useState(false);
  const [selectedEstimatorId, setSelectedEstimatorId] = useState<string | null>(null);
  const [selectedEstimatorDate, setSelectedEstimatorDate] = useState<string | null>(null);
  const [selectedProjectForEstimator, setSelectedProjectForEstimator] = useState<any>(null);
  const [selectedQuickProject, setSelectedQuickProject] = useState<any>(null);
  const [hideCompletedProjects, setHideCompletedProjects] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  
  // Column visibility state - updated to include all fields from CreateProjectForm
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    projectName: true,
    clientName: true,
    salesRep: false,
    address: false,
    estimatorName: true,
    state: true,
    classification: false,
    status: true,
    priority: true,
    startDate: true,
    poNumber: false,
    refNumber: false,
    estimatorHours: false,
    actions: true,
  });

  // Column order state - updated to include all fields
  const [columnOrder, setColumnOrder] = useState([
    "id", "projectName", "clientName", "salesRep", "address", "estimatorName", 
    "state", "classification", "status", "priority", "startDate", 
    "poNumber", "refNumber", "estimatorHours", "actions"
  ]);

  // Group columns by category for the dropdown menu
  const columnGroups = {
    "Basic Info": ["id", "projectName", "clientName", "status", "priority"],
    "Location": ["state", "address"],
    "People": ["salesRep", "estimatorName"],
    "Dates & Schedule": ["startDate", "estimatorHours"],
    "References": ["poNumber", "refNumber", "classification"],
    "Actions": ["actions"]
  };

  // Filter projects based on search term, active tab, and completed filter
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "inProgress" && project.status === "In Progress") ||
      (activeTab === "completed" && project.status === "Completed") ||
      (activeTab === "draft" && project.status === "Draft") ||
      (activeTab === "onHold" && project.status === "On Hold");
    
    // Hide completed projects if the switch is toggled
    const showBasedOnCompletedFilter = !hideCompletedProjects || project.status !== "Completed";
    
    return matchesSearch && matchesTab && showBasedOnCompletedFilter;
  });

  // Quick filter effect for projects
  useEffect(() => {
    if (quickFilterProjectName.trim() === '' && quickFilterClientName.trim() === '') {
      setFilteredQuickResults([]);
      setShowQuickResults(false);
      return;
    }
    
    const results = mockProjects.filter(project => {
      const matchesProjectName = project.projectName.toLowerCase().includes(quickFilterProjectName.toLowerCase());
      const matchesClientName = project.clientName.toLowerCase().includes(quickFilterClientName.toLowerCase());
      return matchesProjectName && (quickFilterClientName.trim() === '' || matchesClientName);
    });
    
    setFilteredQuickResults(results);
    setShowQuickResults(true);
  }, [quickFilterProjectName, quickFilterClientName]);

  // Client filter effect
  useEffect(() => {
    if (quickFilterClientName.trim() === '') {
      setFilteredClients([]);
      setShowClientResults(false);
      return;
    }
    
    const results = mockClients.filter(client => 
      client.name.toLowerCase().includes(quickFilterClientName.toLowerCase())
    );
    
    setFilteredClients(results);
    setShowClientResults(true);
  }, [quickFilterClientName]);

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
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      case "Normal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openCreateProjectWithValues = () => {
    setSelectedProjectForEdit(null);
    setSelectedQuickProject(null);
    setShowCreateProject(true);
  };

  const openEditProject = (project: any) => {
    if (project.status === "Completed") {
      // For completed projects, show the revision dialog instead of directly editing
      setSelectedProjectForEdit(project);
      setShowRevisionDialog(true);
    } else {
      // For non-completed projects, open the edit form as normal
      setSelectedProjectForEdit(project);
      setSelectedQuickProject(null);
      setShowCreateProject(true);
    }
  };
  
  const duplicateProject = (project: any) => {
    // Set up a new project with data from the selected one but clear the ID
    setQuickFilterProjectName(`Copy of ${project.projectName}`);
    setQuickFilterClientName(project.clientName);
    setSelectedQuickProject(null);
    toast({
      title: "Project duplicated",
      description: `Created a copy of "${project.projectName}". You can now edit the details.`,
    });
  };

  const selectQuickProject = (project: any) => {
    setSelectedQuickProject(project);
  };

  const clearQuickSelection = () => {
    setSelectedQuickProject(null);
  };

  const handleCreateClient = () => {
    setShowClientResults(false);
    setShowCreateClient(true);
  };

  const handleClientCreated = (clientName: string) => {
    setShowCreateClient(false);
    setQuickFilterClientName(clientName);
    toast({
      title: "Client Created",
      description: `Client "${clientName}" has been created successfully.`
    });
  };

  const handleAssignEstimator = (project: any) => {
    setSelectedProjectForEstimator(project);
    setShowEstimatorAvailability(true);
  };

  const handleEstimatorSelect = (date: string, estimatorId: string) => {
    setSelectedEstimatorDate(date);
    setSelectedEstimatorId(estimatorId);
  };

  const confirmEstimatorAssignment = () => {
    if (selectedProjectForEstimator && selectedEstimatorId && selectedEstimatorDate) {
      // In a real app, we would save this to the database
      toast({
        title: "Estimator Assigned",
        description: `Estimator has been assigned to ${selectedProjectForEstimator.projectName} for ${format(new Date(selectedEstimatorDate), 'MMM dd, yyyy')}.`
      });
      setShowEstimatorAvailability(false);
      setSelectedEstimatorId(null);
      setSelectedEstimatorDate(null);
      setSelectedProjectForEstimator(null);
    }
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  // Handle column reordering
  const handleColumnReorder = (draggedColumn: string, targetColumn: string) => {
    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumn);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);
    
    setColumnOrder(newOrder);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
      </div>

      {/* Quick Project Creation / Search Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Project Creation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="quickProjectName" className="block text-sm font-medium mb-1">Project Name</label>
              <div className="relative">
                <Input 
                  id="quickProjectName" 
                  placeholder="Enter project name..." 
                  value={quickFilterProjectName} 
                  onChange={e => setQuickFilterProjectName(e.target.value)}
                  disabled={!!selectedQuickProject} 
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="quickClientName" className="block text-sm font-medium mb-1">Client Name</label>
              <div className="relative">
                <Input 
                  id="quickClientName" 
                  placeholder="Enter client name..." 
                  value={quickFilterClientName} 
                  onChange={e => setQuickFilterClientName(e.target.value)} 
                  onFocus={() => {
                    if (quickFilterClientName.trim() !== '') {
                      setShowClientResults(true);
                    }
                  }}
                  disabled={!!selectedQuickProject}
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                
                {/* Client dropdown results */}
                {showClientResults && !selectedQuickProject && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {filteredClients.map(client => (
                        <li 
                          key={client.id} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                          onClick={() => {
                            setQuickFilterClientName(client.name);
                            setShowClientResults(false);
                          }}
                        >
                          {client.name}
                        </li>
                      ))}
                      {filteredClients.length === 0 && (
                        <li 
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-blue-600 flex items-center" 
                          onClick={handleCreateClient}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create new client "{quickFilterClientName}"
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {selectedQuickProject ? (
            <div className="mt-2 mb-4 p-3 border rounded-md bg-blue-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Selected Project:</h3>
                  <p className="text-sm mt-1">
                    <span className="font-medium">{selectedQuickProject.projectName}</span> 
                    <span className="text-gray-600 ml-2">({selectedQuickProject.clientName})</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => duplicateProject(selectedQuickProject)}
                    className="flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditProject(selectedQuickProject)}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearQuickSelection}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            showQuickResults && filteredQuickResults.length > 0 && (
              <div className="mt-2 mb-4 p-3 border rounded-md bg-amber-50">
                <h3 className="font-medium mb-2">Similar Projects Found:</h3>
                <ul className="space-y-2">
                  {filteredQuickResults.slice(0, 3).map(project => (
                    <li 
                      key={project.id} 
                      className="flex justify-between items-center border-b pb-2 hover:bg-amber-100 cursor-pointer p-2 rounded-md transition-colors" 
                      onClick={() => selectQuickProject(project)}
                    >
                      <div>
                        <span className="font-medium">{project.projectName}</span> 
                        <span className="text-sm text-gray-600 ml-2">({project.clientName})</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </li>
                  ))}
                  {filteredQuickResults.length > 3 && (
                    <li className="text-sm text-gray-600 italic">
                      + {filteredQuickResults.length - 3} more projects match your search
                    </li>
                  )}
                </ul>
              </div>
            )
          )}
          
          <div className="flex justify-end">
            <Button onClick={openCreateProjectWithValues} disabled={!!selectedQuickProject}>
              Create New Project
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3">
              <Input 
                placeholder="Search projects..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="space-x-2 flex items-center">
              <div className="flex items-center space-x-2 mr-4">
                <Switch
                  id="hide-completed"
                  checked={hideCompletedProjects}
                  onCheckedChange={setHideCompletedProjects}
                />
                <label htmlFor="hide-completed" className="text-sm text-gray-600">
                  Hide Completed Projects
                </label>
              </div>
              <Button variant="outline">Export</Button>
              <Button variant="outline" disabled={selectedProjects.length === 0}>
                Bulk Actions
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {Object.entries(columnGroups).map(([group, columnIds]) => (
                    <React.Fragment key={group}>
                      <DropdownMenuLabel className="text-xs text-gray-500 py-1">{group}</DropdownMenuLabel>
                      {columnIds.map(columnId => {
                        // Skip the actions column as it should always be visible
                        if (columnId === 'actions') return null;
                        
                        const columnLabels: Record<string, string> = {
                          'id': 'Quote No',
                          'projectName': 'Project Name',
                          'clientName': 'Customer',
                          'salesRep': 'Sales Rep',
                          'estimatorName': 'Estimator',
                          'address': 'Address',
                          'state': 'State',
                          'classification': 'Classification',
                          'status': 'Status',
                          'priority': 'Priority',
                          'startDate': 'Start Date',
                          'poNumber': 'PO Number',
                          'refNumber': 'Ref Number',
                          'estimatorHours': 'Est. Hours'
                        };
                        
                        return (
                          <DropdownMenuCheckboxItem
                            key={columnId}
                            checked={visibleColumns[columnId as keyof typeof visibleColumns]}
                            onCheckedChange={() => toggleColumnVisibility(columnId as keyof typeof visibleColumns)}
                          >
                            {columnLabels[columnId] || columnId}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                      <DropdownMenuSeparator />
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
              <DndProvider backend={HTML5Backend}>
                <ProjectsTable 
                  projects={filteredProjects}
                  visibleColumns={visibleColumns}
                  columnOrder={columnOrder}
                  selectedProjects={selectedProjects}
                  onSelectProject={handleSelectProject}
                  onSelectAll={handleSelectAll}
                  onViewProject={handleViewProject}
                  onEditProject={openEditProject}
                  onAssignEstimator={handleAssignEstimator}
                  onColumnReorder={handleColumnReorder}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              </DndProvider>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sheet for project creation instead of modal */}
      <Sheet open={showCreateProject} onOpenChange={setShowCreateProject}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto" side="right">
          <SheetHeader>
            <SheetTitle>
              {selectedProjectForEdit ? `Edit Project: ${selectedProjectForEdit.projectName}` : 'Create New Project'}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CreateProjectForm 
              onCancel={() => {
                setShowCreateProject(false);
                setSelectedProjectForEdit(null);
              }} 
              onSuccess={() => {
                setSelectedProjectForEdit(null);
              }} 
              initialData={selectedProjectForEdit ? {
                projectName: selectedProjectForEdit.projectName,
                clientName: selectedProjectForEdit.clientName
              } : {
                projectName: quickFilterProjectName,
                clientName: quickFilterClientName
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Client Creation Dialog */}
      <Dialog open={showCreateClient} onOpenChange={setShowCreateClient}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
          </DialogHeader>
          <CreateClientForm 
            onCancel={() => setShowCreateClient(false)} 
            onSuccess={() => handleClientCreated(quickFilterClientName)} 
          />
        </DialogContent>
      </Dialog>

      {/* Estimator Availability Dialog */}
      <Dialog open={showEstimatorAvailability} onOpenChange={setShowEstimatorAvailability}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProjectForEstimator && `Assign Estimator for ${selectedProjectForEstimator.projectName}`}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EstimatorAvailability 
              onSelectDate={handleEstimatorSelect} 
              selectedDate={selectedEstimatorDate || undefined} 
              selectedEstimatorId={selectedEstimatorId || undefined} 
            />
            
            {selectedEstimatorId && selectedEstimatorDate && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-medium text-green-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Estimator Selected
                </h3>
                <p className="text-green-700 flex items-center mt-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Scheduled for {format(new Date(selectedEstimatorDate), 'MMMM d, yyyy')}
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowEstimatorAvailability(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmEstimatorAssignment} 
                disabled={!selectedEstimatorId || !selectedEstimatorDate}
              >
                Assign Estimator
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revision Confirmation Dialog */}
      <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Project Revision</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              This project is marked as complete. Editing it will create a revision copy. 
              Do you want to continue?
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
              <ul className="list-disc pl-5 space-y-1">
                <li>A new project copy will be created with status "Revision"</li>
                <li>The original project will remain unchanged</li>
                <li>You will be redirected to edit the new revision</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowRevisionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakeRevision}>
              Create Revision
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
