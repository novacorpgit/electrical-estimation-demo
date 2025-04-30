
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuoteForm } from "./QuoteForm";

// Mock quote data
const mockQuotes = [
  {
    id: "Q001",
    quoteNumber: "B25-0431M-DJ",
    subProjectId: "SP001",
    subProjectName: "Main Distribution Board",
    currency: "AUD",
    finalValue: 12500.00,
    status: "Draft",
    createdBy: "David Jones",
    createdDate: "2025-04-15",
    expiryDate: "2025-05-15"
  },
  {
    id: "Q002",
    quoteNumber: "S25-0432M-DJ",
    subProjectId: "SP002",
    subProjectName: "Emergency Lighting Panel",
    currency: "AUD",
    finalValue: 4750.00,
    status: "Approved",
    createdBy: "David Jones",
    createdDate: "2025-04-16",
    expiryDate: "2025-05-16"
  },
  {
    id: "Q003",
    quoteNumber: "B25-0433M-DJ",
    subProjectId: "SP003",
    subProjectName: "HVAC Control Panel",
    currency: "AUD",
    finalValue: 8920.00,
    status: "Pending Approval",
    createdBy: "David Jones",
    createdDate: "2025-04-17",
    expiryDate: "2025-05-17"
  },
  {
    id: "Q004",
    quoteNumber: "B25-0434M-DJ",
    subProjectId: "SP004",
    subProjectName: "Basement Distribution Board",
    currency: "USD",
    finalValue: 9500.00,
    status: "Draft",
    createdBy: "David Jones",
    createdDate: "2025-04-18",
    expiryDate: "2025-05-18"
  },
  {
    id: "Q005",
    quoteNumber: "M25-0435M-DJ",
    subProjectId: "SP005",
    subProjectName: "Office Floor DB",
    currency: "AUD",
    finalValue: 6250.00,
    status: "Rejected",
    createdBy: "David Jones",
    createdDate: "2025-04-19",
    expiryDate: "2025-05-19"
  }
];

export const QuotesView = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [selectedSubProject, setSelectedSubProject] = useState({ id: "", name: "" });
  
  // Filter quotes based on search term and active tab
  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesSearch = 
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.subProjectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "draft") return matchesSearch && quote.status === "Draft";
    if (activeTab === "pending") return matchesSearch && quote.status === "Pending Approval";
    if (activeTab === "approved") return matchesSearch && quote.status === "Approved";
    if (activeTab === "rejected") return matchesSearch && quote.status === "Rejected";
    
    return matchesSearch;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Pending Approval": return "bg-yellow-100 text-yellow-800";
      case "Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const handleCreateQuote = (subProjectId: string, subProjectName: string) => {
    setSelectedSubProject({ id: subProjectId, name: subProjectName });
    setShowCreateQuote(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quotes</h2>
        <Button onClick={() => handleCreateQuote("SP006", "New Panel")}>Create Quote</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3">
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Quotes</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left">Quote #</th>
                      <th className="h-10 px-4 text-left">Sub-Project</th>
                      <th className="h-10 px-4 text-left">Currency</th>
                      <th className="h-10 px-4 text-left">Value</th>
                      <th className="h-10 px-4 text-left">Status</th>
                      <th className="h-10 px-4 text-left">Created By</th>
                      <th className="h-10 px-4 text-left">Created Date</th>
                      <th className="h-10 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="h-24 text-center text-muted-foreground">
                          No quotes found.
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map((quote) => (
                        <tr key={quote.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{quote.quoteNumber}</td>
                          <td className="p-4">{quote.subProjectName}</td>
                          <td className="p-4">{quote.currency}</td>
                          <td className="p-4">{quote.finalValue.toLocaleString('en-AU', { 
                            style: 'currency', 
                            currency: quote.currency 
                          })}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(quote.status)}`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="p-4">{quote.createdBy}</td>
                          <td className="p-4">{quote.createdDate}</td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Send</Button>
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

      {showCreateQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <QuoteForm 
                subProjectId={selectedSubProject.id}
                subProjectName={selectedSubProject.name}
                onCancel={() => setShowCreateQuote(false)} 
                onSuccess={() => setShowCreateQuote(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
