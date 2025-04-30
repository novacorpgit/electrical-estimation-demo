
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreateClientForm } from "./CreateClientForm";
import { ClientsTable, Client } from "./client/ClientsTable";

// Mocked client data
const mockClients: Client[] = [
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
              <ClientsTable 
                clients={filteredClients}
                selectedClients={selectedClients}
                onSelectClient={handleSelectClient}
                onSelectAll={handleSelectAll}
              />
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
