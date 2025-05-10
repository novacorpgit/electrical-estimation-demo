import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubProjectsView } from "@/components/SubProjectsView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PanelboardDashboard } from "@/components/PanelboardDashboard";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { QuoteGenerator } from "@/components/quote/QuoteGenerator";
import { ChevronLeft, MoreVertical, Clock, Calendar, MapPin, Briefcase, User, Tag, FileSpreadsheet, AlertTriangle, ClipboardCheck, Copy, Download, FileDown } from 'lucide-react';

// Mock project data
const mockProjects = {
  "P001": {
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
    description: "Complete electrical upgrade for Building A",
    quotationStatus: "Draft"
  },
  "P002": {
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
    description: "New electrical installation for office tower",
    quotationStatus: "In Review"
  },
  "P003": {
    id: "P003",
    projectName: "Hospital Wing - Panel Replacement",
    clientName: "State Health Department",
    salesRep: "David Wilson",
    address: "789 Health Blvd",
    state: "M",
    classification: "Direct",
    status: "Completed",
    startDate: "2025-03-01",
    priority: "Critical",
    poNumber: "PO-34567",
    refNumber: "REF-003",
    estimatorHours: "32",
    estimatorName: "Michael Brown",
    description: "Replacement of main electrical panels in hospital wing",
    quotationStatus: "Complete"
  },
  "P003-R1": {
    id: "P003-R1",
    projectName: "Hospital Wing - Panel Replacement (Revision)",
    clientName: "State Health Department",
    salesRep: "David Wilson",
    address: "789 Health Blvd",
    state: "M",
    classification: "Direct",
    status: "In Progress",
    startDate: "2025-03-01",
    priority: "Critical",
    poNumber: "PO-34567",
    refNumber: "REF-003",
    estimatorHours: "32",
    estimatorName: "Michael Brown",
    description: "Revision of main electrical panels in hospital wing",
    originalProjectId: "P003",
    quotationStatus: "Complete"
  },
  "P004": {
    id: "P004",
    projectName: "Shopping Mall - Main Switchboard",
    clientName: "Retail Developers Group",
    salesRep: "Michelle Adams",
    address: "101 Retail Way",
    state: "P",
    classification: "Tender",
    status: "On Hold",
    startDate: "2025-06-20",
    priority: "Normal",
    poNumber: "PO-45678",
    refNumber: "REF-004",
    estimatorHours: "48",
    estimatorName: "Sarah Wilson",
    description: "Installation of new main switchboard for shopping mall",
    quotationStatus: "Draft"
  }
};
const ProjectDashboard = () => {
  const navigate = useNavigate();
  const {
    projectId
  } = useParams();
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState("subprojects");
  const [showCompletedDialog, setShowCompletedDialog] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false);

  // Get project data based on projectId
  const project = projectId ? mockProjects[projectId as keyof typeof mockProjects] : null;

  // Check if this is a completed project
  const isCompleted = project?.status === "Completed";

  // Check if this is a revision
  const isRevision = project?.id.includes("-R");

  // Check if quotation is complete
  const isQuotationComplete = project?.quotationStatus === "Complete";
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 border-blue-200 text-blue-800";
      case "Completed":
        return "bg-green-100 border-green-200 text-green-800";
      case "Draft":
        return "bg-gray-100 border-gray-200 text-gray-800";
      case "On Hold":
        return "bg-yellow-100 border-yellow-200 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-orange-100 border-orange-200 text-orange-800";
      case "Critical":
        return "bg-red-100 border-red-200 text-red-800";
      case "Normal":
        return "bg-blue-100 border-blue-200 text-blue-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };
  const handleBack = () => {
    navigate('/projects');
  };
  const handleEditProject = () => {
    if (isCompleted) {
      // For completed projects, show the revision dialog
      setShowRevisionDialog(true);
    } else {
      // Here you would typically navigate to an edit form for the project
      toast({
        title: "Edit Project",
        description: "In a real application, this would open an edit form for the project."
      });
    }
  };
  const handleToggleCompleted = () => {
    if (project) {
      if (project.status === "Completed") {
        setShowCompletedDialog(true);
      } else {
        // In a real app, we would update the project status in the database
        toast({
          title: "Project Completed",
          description: "Project has been marked as completed."
        });
      }
    }
  };
  const handleGenerateQuote = () => {
    setShowQuoteGenerator(true);
  };
  const handleCreateRevision = () => {
    if (project) {
      // In a real app, we would call an API to create a revision of the project
      const revisionProjectId = `${projectId}-R1`;

      // Create a copy of the project with revision status
      // This would normally be done via an API call
      const revisionProject = {
        ...project,
        id: revisionProjectId,
        status: "In Progress"
      };
      toast({
        title: "Project revision created",
        description: `A new revision (${revisionProjectId}) of the project has been created with status set to 'In Progress'`
      });
      setShowRevisionDialog(false);

      // Navigate to the new revision
      navigate(`/project/${revisionProjectId}`);
    }
  };
  const handleDownloadQuotation = () => {
    toast({
      title: "Downloading Quotation",
      description: `Quotation for ${project?.projectName} is being downloaded.`
    });

    // In a real app, this would trigger a file download
    // For now we'll just show a toast message
  };

  // If project not found
  if (!projectId || !project) {
    return <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="mb-6">The project you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle={project.projectName} />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={handleBack} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Button>
          
          <div className="flex items-center space-x-2">
            {isRevision && <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                Revision
              </Badge>}
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            
            {/* Quote generation button - Moved to be right after status badge */}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
              onClick={handleGenerateQuote}
            >
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Generate Quote
            </Button>
            
            <Badge className={getPriorityColor(project.priority)}>
              {project.priority}
            </Badge>
            
            {/* Add download button when quotation is complete */}
            {isQuotationComplete && <Button variant="outline" size="sm" className="flex items-center bg-green-50 text-green-700 border-green-200 hover:bg-green-100" onClick={handleDownloadQuotation}>
                <Download className="h-4 w-4 mr-1" />
                Download Quotation
              </Button>}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditProject}>
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleCompleted}>
                  {project.status === "Completed" ? "Mark As In Progress" : "Mark As Completed"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGenerateQuote}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Generate Quote
                </DropdownMenuItem>
                {project.status === "Completed" && <DropdownMenuItem onClick={() => setShowRevisionDialog(true)}>
                    Create Revision
                  </DropdownMenuItem>}
                {isQuotationComplete && <DropdownMenuItem onClick={handleDownloadQuotation} className="text-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Quotation
                  </DropdownMenuItem>}
                <DropdownMenuItem>
                  Export Project Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-4">{project.projectName}</h2>
                <p className="text-gray-500 mb-4">{project.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Customer: <strong>{project.clientName}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Address: <strong>{project.address}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Classification: <strong>{project.classification}</strong></span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Sales Rep: <strong>{project.salesRep}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Estimator: <strong>{project.estimatorName}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Start Date: <strong>{project.startDate}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Estimator Hours: <strong>{project.estimatorHours}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">PO Number: <strong>{project.poNumber}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Ref Number: <strong>{project.refNumber}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isCompleted && <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-amber-800 font-medium">This project is marked as completed and cannot be modified.</span>
            </div>
            <Button variant="outline" className="bg-white" onClick={() => setShowRevisionDialog(true)}>
              <Copy className="h-4 w-4 mr-2" />
              Create Revision
            </Button>
          </div>}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            {/* Reordered tabs - Sub-Projects first, Overview last */}
            <TabsTrigger value="subprojects">Sub-Projects</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            {/* New Download Quotation tab that only shows when quotation is complete */}
            <TabsTrigger value="download-quotation" hideTab={!isQuotationComplete}>
              Download Quotation
            </TabsTrigger>
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subprojects" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sub-Projects</CardTitle>
                <CardDescription>Manage all sub-projects associated with this project.</CardDescription>
              </CardHeader>
              <CardContent>
                <SubProjectsView projectId={projectId} projectName={project.projectName} isProjectCompleted={isCompleted} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Project notes and comments.</CardDescription>
              </CardHeader>
              <CardContent>
                <NotesPanel entityId={projectId} entityType="project" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent actions and changes to this project.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center text-gray-500">
                  Activity logging will be implemented in a future update.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* New Download Quotation tab content */}
          <TabsContent value="download-quotation" className="mt-4" hideTab={!isQuotationComplete}>
            <Card>
              <CardHeader>
                <CardTitle>Download Quotation</CardTitle>
                <CardDescription>Export or download the completed quotation for this project.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-green-50 border border-green-100 rounded-lg">
                  <div className="text-center mb-6">
                    <FileDown className="h-16 w-16 text-green-600 mx-auto mb-3" />
                    <h3 className="text-xl font-medium text-green-800">Quotation Ready for Download</h3>
                    <p className="text-green-700 mt-2">
                      The quotation for this project has been finalized and is ready for download.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-green-200 mb-6">
                    <h4 className="font-medium text-green-800 mb-2">Quotation Details:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Project:</span>
                        <span className="font-medium">{project.projectName}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{project.clientName}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium">{project.refNumber}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">Complete</span>
                      </li>
                      {isRevision && <li className="flex justify-between">
                          <span className="text-gray-600">Version:</span>
                          <span className="font-medium">Revision {project.id.split('-R')[1]}</span>
                        </li>}
                    </ul>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Button size="lg" className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700" onClick={handleDownloadQuotation}>
                      <Download className="h-5 w-5 mr-2" />
                      Download Quotation (PDF)
                    </Button>
                    <div className="flex space-x-3">
                      <Button variant="outline" className="w-full flex-1" onClick={handleDownloadQuotation}>
                        Download as DOCX
                      </Button>
                      <Button variant="outline" className="w-full flex-1" onClick={handleDownloadQuotation}>
                        Download as XLSX
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>A summary of this project's status and details.</CardDescription>
              </CardHeader>
              <CardContent>
                <PanelboardDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          
          
          <Card className="flex-1">
            
            <CardContent>
              
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Complete/Uncomplete Dialog */}
      <Dialog open={showCompletedDialog} onOpenChange={setShowCompletedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Project Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this project as "In Progress"? This will allow modification of project details.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-10 w-10 text-yellow-500" />
              <div>
                <p className="font-medium">Project is currently marked as Completed</p>
                <p className="text-sm text-gray-500 mt-1">
                  Changing the status will allow further modifications to the project. All sub-projects will remain unchanged.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompletedDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
            toast({
              title: "Project Status Updated",
              description: `Project has been marked as "In Progress"`
            });
            setShowCompletedDialog(false);
          }}>
              Change to In Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Revision Dialog */}
      <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Project Revision</DialogTitle>
            <DialogDescription>
              Creating a revision will make a copy of this project that you can modify.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-start space-x-3 mb-4">
              <ClipboardCheck className="h-10 w-10 text-green-500" />
              <div>
                <p className="font-medium">The original project will remain unchanged</p>
                <p className="text-sm text-gray-500 mt-1">
                  A new copy will be created with status "In Progress" that you can modify.
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center space-x-2">
                <Switch id="copy-subprojects" defaultChecked />
                <Label htmlFor="copy-subprojects">Include sub-projects in revision</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="copy-quotes" defaultChecked />
                <Label htmlFor="copy-quotes">Include quotations</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="copy-notes" defaultChecked />
                <Label htmlFor="copy-notes">Include notes</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevisionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRevision}>
              Create Revision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Quote Generator Dialog */}
      <QuoteGenerator 
        open={showQuoteGenerator}
        onOpenChange={setShowQuoteGenerator}
        projectId={projectId}
        projectName={project.projectName}
      />
    </div>;
};
export default ProjectDashboard;
