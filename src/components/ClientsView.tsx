
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateClientForm } from "./CreateClientForm";

// Mocked client data
const mockClients = [
  {
    id: "C001",
    companyName: "ABC Construction",
    clientType: "Contractor",
    address: "123 Main St, Brisbane",
    status: "Active",
    salesRep: "John Smith",
    lastActivityDate: "2025-03-15",
    tags: ["Construction", "Commercial"],
  },
  {
    id: "C002",
    companyName: "XYZ Properties",
    clientType: "Developer",
    address: "456 Park Ave, Sydney",
    status: "Active",
    salesRep: "Sarah Johnson",
    lastActivityDate: "2025-04-10",
    tags: ["Residential", "Commercial"],
  },
  {
    id: "C003",
    companyName: "State Health Department",
    clientType: "Government",
    address: "789 Hospital Rd, Melbourne",
    status: "Active",
    salesRep: "Mike Brown",
    lastActivityDate: "2025-04-20",
    tags: ["Healthcare", "Government"],
  },
  {
    id: "C004",
    companyName: "Retail Developers Group",
    clientType: "Developer",
    address: "101 Mall Ave, Perth",
    status: "Inactive",
    salesRep: "John Smith",
    lastActivityDate: "2025-02-05",
    tags: ["Retail", "Commercial"],
  },
  {
    id: "C005",
    companyName: "Industrial Manufacturers",
    clientType: "Industrial",
    address: "202 Factory Ln, Brisbane",
    status: "Active",
    salesRep: "Sarah Johnson",
    lastActivityDate: "2025-04-25",
    tags: ["Industrial", "Manufacturing"],
  },
];

export const ClientsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Filter clients based on search term and active tab
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = 
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && client.status === "Active";
    if (activeTab === "inactive") return matchesSearch && client.status === "Inactive";
    
    return matchesSearch;
  });

  const handleSelectClient = (clientId: string) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button onClick={() => setShowCreateClient(true)}>Create Client</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3">
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline">Export</Button>
              <Button variant="outline" disabled={selectedClients.length === 0}>
                Bulk Actions
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Clients</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={selectedClients.length === filteredClients.length && filteredClients.length > 0} 
                            onCheckedChange={handleSelectAll}
                          />
                          <span>ID</span>
                        </div>
                      </th>
                      <th className="h-10 px-4 text-left">Company Name</th>
                      <th className="h-10 px-4 text-left">Client Type</th>
                      <th className="h-10 px-4 text-left">Address</th>
                      <th className="h-10 px-4 text-left">Sales Rep</th>
                      <th className="h-10 px-4 text-left">Last Activity</th>
                      <th className="h-10 px-4 text-left">Status</th>
                      <th className="h-10 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="h-24 text-center text-muted-foreground">
                          No clients found.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                checked={selectedClients.includes(client.id)}
                                onCheckedChange={() => handleSelectClient(client.id)}
                              />
                              <span>{client.id}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium">{client.companyName}</td>
                          <td className="p-4">{client.clientType}</td>
                          <td className="p-4">{client.address}</td>
                          <td className="p-4">{client.salesRep}</td>
                          <td className="p-4">{client.lastActivityDate}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(client.status)}`}>
                              {client.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Projects</Button>
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

      {showCreateClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create New Client</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateClientForm 
                onCancel={() => setShowCreateClient(false)} 
                onSuccess={() => {}} 
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
