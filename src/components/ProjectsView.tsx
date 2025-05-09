
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProjectForm } from "./CreateProjectForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Calendar, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateClientForm } from "./CreateClientForm";
import { EstimatorAvailability } from "./estimators/EstimatorAvailability";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Updated mock project data with fields from image
const mockProjects = [
  {
    id: "P001",
    projectName: "UTS CB15 STAGE 1",
    quoteNumber: "S24-2300M",
    customer: "Blackrock Electrical Contractors",
    priorityLevel: "P+",
    rep: "BRAN",
    description: "UTS CB15 STAGE 1",
    eta: "2025-01-11",
    hours: 1.5,
    status: "COMPLETED",
    reviewedBy: "",
    clientName: "Blackrock Electrical Contractors",
    state: "B",
    startDate: "2025-01-10",
    priority: "High",
    estimatorName: "Bran Smith",
  },
  {
    id: "P002",
    projectName: "21 WRIGHT ROAD KEILOR PARK",
    quoteNumber: "M24-2302M",
    customer: "NORTHSIDE ELECTRICAL",
    priorityLevel: "w/s P+",
    rep: "ANDREW",
    description: "21 WRIGHT ROAD KEILOR PARK",
    eta: "",
    hours: 3,
    status: "COMPLETED",
    reviewedBy: "",
    clientName: "NORTHSIDE ELECTRICAL",
    state: "S",
    startDate: "2025-01-05",
    priority: "Normal",
    estimatorName: "Andrew Johnson",
  },
  {
    id: "P003",
    projectName: "26 TALAVERA ROAD LEVEL 3",
    quoteNumber: "S25-0001M",
    customer: "Blackrock Electrical Contractors",
    priorityLevel: "P+",
    rep: "BRAN",
    description: "26 TALAVERA ROAD LEVEL 3",
    eta: "2025-01-15",
    hours: 1.5,
    status: "COMPLETED",
    reviewedBy: "",
    clientName: "Blackrock Electrical Contractors",
    state: "M",
    startDate: "2025-01-01",
    priority: "Critical",
    estimatorName: "Bran Smith",
  },
  {
    id: "P004",
    projectName: "REECE MONA VALE",
    quoteNumber: "M24-2301M",
    customer: "KEECE ELECTRICAL SERVICES",
    priorityLevel: "W5.7 P+",
    rep: "ANDREW",
    description: "REECE MONA VALE",
    eta: "2024-12-20",
    hours: 1.5,
    status: "COMPLETED",
    reviewedBy: "",
    clientName: "KEECE ELECTRICAL SERVICES",
    state: "P",
    startDate: "2024-12-01",
    priority: "Normal",
    estimatorName: "Andrew Wilson",
  },
  {
    id: "P005",
    projectName: "ST JOSEPHS BORONIA",
    quoteNumber: "M24-1949M",
    customer: "LECKYS ELECTRICAL SUNSHINE",
    priorityLevel: "w/s P+",
    rep: "ANDREW",
    description: "ST JOSEPHS BORONIA ANOTHER OFFER",
    eta: "",
    hours: 0.5,
    status: "NO QUOTE",
    reviewedBy: "",
    clientName: "LECKYS ELECTRICAL SUNSHINE",
    state: "B",
    startDate: "2024-11-25",
    priority: "High",
    estimatorName: "Andrew Davis",
  },
];

// Mock clients for dropdown
const mockClients = [
  { id: "C001", name: "ABC Construction" },
  { id: "C002", name: "XYZ Properties" },
  { id: "C003", name: "State Health Department" },
  { id: "C004", name: "Retail Developers Group" },
  { id: "C005", name: "Industrial Manufacturers" },
];

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

  // Filter projects based on search term and active tab
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "inProgress") return matchesSearch && project.status !== "COMPLETED" && project.status !== "NO QUOTE";
    if (activeTab === "completed") return matchesSearch && project.status === "COMPLETED";
    if (activeTab === "draft") return matchesSearch && project.status === "Draft";
    if (activeTab === "onHold") return matchesSearch && project.status === "On Hold";
    
    return matchesSearch;
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
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "On Hold": return "bg-yellow-100 text-yellow-800";
      case "NO QUOTE": return "bg-red-100 text-red-800";
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

  const openCreateProjectWithValues = () => {
    setSelectedProjectForEdit(null);
    setShowCreateProject(true);
  };

  const openEditProject = (project: any) => {
    setSelectedProjectForEdit(project);
    setShowCreateProject(true);
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
      description: `Client "${clientName}" has been created successfully.`,
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
        description: `Estimator has been assigned to ${selectedProjectForEstimator.projectName} for ${format(new Date(selectedEstimatorDate), 'MMM dd, yyyy')}.`,
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => setShowCreateProject(true)}>Create Project</Button>
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
                  onChange={(e) => setQuickFilterProjectName(e.target.value)}
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
                  onChange={(e) => setQuickFilterClientName(e.target.value)}
                  onFocus={() => {
                    if (quickFilterClientName.trim() !== '') {
                      setShowClientResults(true);
                    }
                  }}
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                
                {/* Client dropdown results */}
                {showClientResults && (
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
          
          {/* Quick results */}
          {showQuickResults && filteredQuickResults.length > 0 && (
            <div className="mt-2 mb-4 p-3 border rounded-md bg-amber-50">
              <h3 className="font-medium mb-2">Similar Projects Found:</h3>
              <ul className="space-y-2">
                {filteredQuickResults.slice(0, 3).map(project => (
                  <li 
                    key={project.id} 
                    className="flex justify-between items-center border-b pb-2 hover:bg-amber-100 cursor-pointer p-2 rounded-md transition-colors"
                    onClick={() => openEditProject(project)}
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
          )}
          
          <div className="flex justify-end">
            <Button onClick={openCreateProjectWithValues}>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0} 
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Quote No.</TableHead>
                    <TableHead>Customer & Priority Level</TableHead>
                    <TableHead>Rep</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>ETA given by Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed By (over $75K)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                        No projects found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => (
                      <TableRow 
                        key={project.id} 
                        className="cursor-pointer"
                        onClick={() => handleViewProject(project.id)}
                      >
                        <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedProjects.includes(project.id)}
                            onCheckedChange={() => handleSelectProject(project.id)}
                          />
                        </TableCell>
                        <TableCell>{project.hours}</TableCell>
                        <TableCell className="font-medium">{project.quoteNumber}</TableCell>
                        <TableCell>
                          <div className={project.customer === 'Blackrock Electrical Contractors' || project.customer === 'KEECE ELECTRICAL SERVICES' ? 'bg-yellow-200 px-2 py-1 rounded' : ''}>
                            {project.customer}
                            <span className="ml-2 text-sm">{project.priorityLevel}</span>
                          </div>
                        </TableCell>
                        <TableCell>{project.rep}</TableCell>
                        <TableCell>{project.description}</TableCell>
                        <TableCell className={project.eta ? 'bg-green-100 text-center' : ''}>
                          {project.eta}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </TableCell>
                        <TableCell>{project.reviewedBy}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="space-x-1">
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              handleViewProject(project.id);
                            }}>
                              View
                            </Button>
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              openEditProject(project);
                            }}>
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals and dialogs */}
      {showCreateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{selectedProjectForEdit ? `Edit Project: ${selectedProjectForEdit.projectName}` : 'Create New Project'}</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      )}

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
              <Button 
                variant="outline" 
                onClick={() => setShowEstimatorAvailability(false)}
              >
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
    </div>
  );
};

