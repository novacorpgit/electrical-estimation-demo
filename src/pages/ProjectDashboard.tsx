
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SubProjectsView } from "@/components/SubProjectsView";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar, Clock, ChartBar, TrendingUp, BanknoteIcon } from "lucide-react";
import { QuoteGenerator } from "@/components/quote/QuoteGenerator";
import { NotesPanel } from "@/components/notes/NotesPanel";

// Mock project data - would be fetched from API in a real app
const getMockProject = (projectId: string) => {
  // Find the project with the given ID
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    return null;
  }
  
  // Count sub-projects by status
  const subProjectsByStatus = mockSubProjects
    .filter(sp => sp.projectId === projectId)
    .reduce((acc, subProject) => {
      acc[subProject.status] = (acc[subProject.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const totalSubProjects = mockSubProjects.filter(sp => sp.projectId === projectId).length;
  const completedSubProjects = subProjectsByStatus['Completed'] || 0;
  const inProgressSubProjects = subProjectsByStatus['In Progress'] || 0;
  const draftSubProjects = subProjectsByStatus['Draft'] || 0;
  
  const progressPercentage = totalSubProjects > 0 
    ? Math.round((completedSubProjects / totalSubProjects) * 100) 
    : 0;
  
  return {
    ...project,
    subProjectStats: {
      total: totalSubProjects,
      completed: completedSubProjects,
      inProgress: inProgressSubProjects,
      draft: draftSubProjects,
      progressPercentage
    }
  };
};

// Mocked project data
const mockProjects = [
  {
    id: "P001",
    projectName: "Building A - Electrical Upgrade",
    clientName: "ABC Construction",
    clientId: "C001",
    state: "B",
    status: "In Progress",
    startDate: "2025-04-10",
    endDate: "2025-07-15",
    priority: "High",
    estimatorName: "John Smith",
    totalValue: 125000,
    description: "Complete electrical upgrade for Building A, including new panelboards and distribution systems."
  },
  {
    id: "P002",
    projectName: "Office Tower - New Installation",
    clientName: "XYZ Properties",
    clientId: "C002",
    state: "S",
    status: "Draft",
    startDate: "2025-05-15",
    endDate: "2025-09-30",
    priority: "Normal",
    estimatorName: "Emily Johnson",
    totalValue: 250000,
    description: "New electrical installation for 20-story office tower, including MSB and multiple distribution boards."
  },
];

// Mocked sub-project data
const mockSubProjects = [
  {
    id: "SP001",
    projectId: "P001",
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
    projectId: "P001",
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
    projectId: "P001",
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
  {
    id: "SP004",
    projectId: "P002",
    name: "DB-Main",
    quantity: 1,
    panelType: "DB",
    formType: "Form 3B",
    installationType: "Indoor",
    boardRating: "630A",
    ipRating: "IP54",
    shortCircuitRating: "25kA",
    status: "Draft",
    lastUpdated: "2025-05-02",
    progress: 15
  },
];

export const ProjectDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false);

  const handleQuoteGeneration = (subProjectId: string) => {
    // Navigate to the quotation page for this sub-project
    navigate(`/quotation/${projectId}/${subProjectId}`);
  };

  useEffect(() => {
    if (!projectId) {
      navigate('/');
      toast({
        title: "Project not found",
        description: "The project you're looking for doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would fetch the project data from an API
    const fetchedProject = getMockProject(projectId);
    if (!fetchedProject) {
      navigate('/');
      toast({
        title: "Project not found",
        description: "The project you're looking for doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    setProject(fetchedProject);
    setLoading(false);
  }, [projectId, navigate, toast]);

  if (loading || !project) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Data for the pie chart
  const chartData = [
    { name: "Completed", value: project.subProjectStats.completed, color: "#10B981" },
    { name: "In Progress", value: project.subProjectStats.inProgress, color: "#3B82F6" },
    { name: "Draft", value: project.subProjectStats.draft, color: "#9CA3AF" }
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                Back to Projects
              </Button>
              <h1 className="text-3xl font-bold">{project.projectName}</h1>
            </div>
            <p className="text-gray-500 mt-1">Client: {project.clientName}</p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">Export Project</Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                // If there are sub-projects available, we'll generate a quote for the first one
                const subProjects = mockSubProjects.filter(sp => sp.projectId === projectId);
                if (subProjects.length > 0) {
                  handleQuoteGeneration(subProjects[0].id);
                } else {
                  toast({
                    title: "No sub-projects found",
                    description: "Please create a sub-project first before generating a quotation.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <BanknoteIcon className="h-4 w-4" />
              Generate Quotation
            </Button>
            <Button variant="default">Edit Project</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sub-projects">Sub-Projects</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Project Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Project ID</p>
                      <p>{project.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        project.status === "Completed" ? "bg-green-100 text-green-800" :
                        project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>{project.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p>{project.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">End Date</p>
                      <p>{project.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Priority</p>
                      <p className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        project.priority === "High" ? "bg-orange-100 text-orange-800" :
                        project.priority === "Critical" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>{project.priority}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estimator</p>
                      <p>{project.estimatorName || "Not assigned"}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">Project Description</p>
                    <p className="text-gray-700">{project.description || "No description provided"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${project.totalValue.toLocaleString()}</div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Overall Completion</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={project.subProjectStats.progressPercentage} className="h-2" />
                      <span className="text-sm font-medium">{project.subProjectStats.progressPercentage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Stats and Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stats Cards */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Total Sub-Projects</p>
                      <p className="text-3xl font-bold text-blue-900">{project.subProjectStats.total}</p>
                    </div>
                    <div className="bg-blue-200 p-3 rounded-full">
                      <ChartBar className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Completed</p>
                      <p className="text-3xl font-bold text-green-900">{project.subProjectStats.completed}</p>
                    </div>
                    <div className="bg-green-200 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-800">In Progress</p>
                      <p className="text-3xl font-bold text-amber-900">{project.subProjectStats.inProgress}</p>
                    </div>
                    <div className="bg-amber-200 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-amber-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} sub-projects`, 'Quantity']} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No data to display</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sub-projects">
            <SubProjectsView projectId={projectId!} projectName={project.projectName} />
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Project Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Document management functionality will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Project Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Quote management functionality will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Add the NotesPanel component */}
      <NotesPanel 
        entityId={projectId || ""} 
        entityType="project" 
        entityName={project.projectName}
      />
    </div>
  );
};

export default ProjectDashboard;
