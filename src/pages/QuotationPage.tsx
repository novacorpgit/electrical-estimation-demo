
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BanknoteIcon, FileText, Printer, Send, Download, Share2, Calendar, Building, User, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QuotationDetails } from "@/components/quote/QuotationDetails";
import { QuotationPreview } from "@/components/quote/QuotationPreview";

// Mock data - in a real app, this would come from your API or state management
const getMockQuoteData = (projectId: string, subProjectId: string) => {
  // Mock client data
  const client = {
    id: "C001",
    name: "ABC Construction",
    address: "123 Building Street, Brisbane, QLD 4000",
    contactName: "John Smith",
    contactEmail: "john.smith@abcconstruction.com",
    contactPhone: "+61 7 1234 5678"
  };

  // Mock project data
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) return null;

  // Mock subproject data
  const subProject = mockSubProjects.find(sp => sp.id === subProjectId);
  if (!subProject) return null;

  // Calculate a mock BOM total
  const bomTotal = 12850.75;
  
  // Generate expiry date (30 days from now)
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return {
    id: `Q${subProjectId.slice(2)}`,
    quoteNumber: `B25-7843M-DJ`,
    client,
    project,
    subProject,
    createdDate: new Date().toISOString().split('T')[0],
    expiryDate,
    subtotalMaterials: bomTotal * 0.8, // 80% of total as materials
    subtotalLabor: bomTotal * 0.2, // 20% of total as labor
    taxRate: 10,
    marginType: "markup",
    marginPercent: 15,
    additionalCosts: 350,
    discountPercent: 2,
    finalQuotedValue: bomTotal + (bomTotal * 0.15) + 350 - (bomTotal * 0.02), // With markup, additional costs, and discount
    currency: "AUD",
    paymentTerms: "50% deposit, 50% on completion",
    status: "Draft",
    notes: "This quotation includes all necessary materials and labor for installation as per specifications.",
    versionHistory: [
      {
        version: 1,
        date: new Date().toISOString().split('T')[0],
        status: "Draft"
      }
    ],
  };
};

// Mocked project data (from ProjectDashboard)
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

// Mocked sub-project data (from ProjectDashboard)
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
];

export const QuotationPage = () => {
  const { projectId, subProjectId } = useParams<{ projectId: string, subProjectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [quoteData, setQuoteData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);

  useEffect(() => {
    if (!projectId || !subProjectId) {
      navigate('/');
      toast({
        title: "Error",
        description: "Missing project or sub-project information.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would fetch the quote data from an API
    const fetchedQuote = getMockQuoteData(projectId, subProjectId);
    if (!fetchedQuote) {
      navigate(`/project/${projectId}`);
      toast({
        title: "Error",
        description: "Could not find the requested quotation data.",
        variant: "destructive",
      });
      return;
    }

    setQuoteData(fetchedQuote);
    setLoading(false);
  }, [projectId, subProjectId, navigate, toast]);

  const handleExport = (type: 'pdf' | 'excel') => {
    setShowExportOptions(false);
    
    // Simulate export
    toast({
      title: `Exporting as ${type.toUpperCase()}`,
      description: `Your quotation is being exported as a ${type.toUpperCase()} file.`,
    });
    
    // In a real implementation, you would generate the file here
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your ${type.toUpperCase()} has been generated successfully.`,
      });
    }, 1500);
  };

  const handleMarkAsSent = () => {
    if (quoteData) {
      setQuoteData(prev => ({
        ...prev,
        status: "Sent",
        versionHistory: [
          ...prev.versionHistory,
          {
            version: prev.versionHistory.length + 1,
            date: new Date().toISOString().split('T')[0],
            status: "Sent"
          }
        ]
      }));
      
      toast({
        title: "Quote marked as sent",
        description: `Quote ${quoteData.quoteNumber} has been marked as sent.`,
      });
    }
  };

  if (loading || !quoteData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/project/${projectId}`)}
              >
                Back to Project
              </Button>
              <h1 className="text-3xl font-bold">Quotation</h1>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                {quoteData.status}
              </span>
            </div>
            <p className="text-gray-500 mt-1">Quote #{quoteData.quoteNumber} for {quoteData.subProject.name}</p>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowExportOptions(true)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="outline" 
              onClick={handleMarkAsSent} 
              disabled={quoteData.status === "Sent"}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Mark as Sent
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
                <SheetHeader>
                  <SheetTitle>Quote Preview</SheetTitle>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto">
                  <QuotationPreview quoteData={quoteData} />
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="default">Edit Quotation</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quotation Summary</CardTitle>
                <CardDescription>Key details about this quotation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created Date
                    </p>
                    <p>{quoteData.createdDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Expiry Date
                    </p>
                    <p>{quoteData.expiryDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      Client
                    </p>
                    <p>{quoteData.client.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Contact
                    </p>
                    <p>{quoteData.client.contactName}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Quoted Value</p>
                      <p className="text-3xl font-bold">
                        {quoteData.finalQuotedValue.toLocaleString('en-AU', {
                          style: 'currency',
                          currency: quoteData.currency
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500">Payment Terms</p>
                      <p className="text-sm">{quoteData.paymentTerms}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="history">Version History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <QuotationDetails quoteData={quoteData} />
              </TabsContent>
              
              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{quoteData.notes || "No notes available for this quotation."}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Version History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quoteData.versionHistory.map((version: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 text-blue-700 h-10 w-10 rounded-full flex items-center justify-center font-medium">
                              v{version.version}
                            </div>
                            <div>
                              <p className="font-medium">Version {version.version}</p>
                              <p className="text-sm text-gray-500">{version.date}</p>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                            {version.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Project Name</p>
                    <p className="font-medium">{quoteData.project.projectName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sub-Project</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        quoteData.subProject.status === 'Completed' ? 'bg-green-500' :
                        quoteData.subProject.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></span>
                      <p>{quoteData.subProject.name} ({quoteData.subProject.status})</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Panel Type</p>
                    <p>{quoteData.subProject.panelType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Form Type</p>
                    <p>{quoteData.subProject.formType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <p>{quoteData.subProject.boardRating} / {quoteData.subProject.shortCircuitRating}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Installation Type</p>
                    <p>{quoteData.subProject.installationType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">IP Rating</p>
                    <p>{quoteData.subProject.ipRating}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-500">Quantity</p>
                    <p className="text-xl font-bold">{quoteData.subProject.quantity} {quoteData.subProject.quantity > 1 ? 'units' : 'unit'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company</p>
                    <p className="font-medium">{quoteData.client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p>{quoteData.client.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Person</p>
                    <p>{quoteData.client.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-blue-600 hover:underline">
                      <a href={`mailto:${quoteData.client.contactEmail}`}>{quoteData.client.contactEmail}</a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{quoteData.client.contactPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <AlertDialog open={showExportOptions} onOpenChange={setShowExportOptions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Choose a format to export your quote
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button 
              variant="outline" 
              onClick={() => handleExport('excel')}
              className="flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button 
              onClick={() => handleExport('pdf')}
              className="flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuotationPage;
