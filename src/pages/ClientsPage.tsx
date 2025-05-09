
import React, { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { ClientsView } from "@/components/ClientsView";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateClientForm } from "@/components/CreateClientForm";
import { Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock client data with contacts
const mockClients = [
  {
    id: "c1",
    companyName: "ABC Construction",
    address: "123 Building St",
    type: "Contractor",
    status: "Active",
    contacts: [
      { name: "John Smith", designation: "Project Manager", email: "john@abc.com" },
      { name: "Sarah Lee", designation: "Finance Director", email: "sarah@abc.com" }
    ]
  },
  {
    id: "c2",
    companyName: "XYZ Properties",
    address: "456 Real Estate Ave",
    type: "Developer",
    status: "Active",
    contacts: [
      { name: "Michael Brown", designation: "CEO", email: "michael@xyz.com" }
    ]
  }
];

const ClientsPage = () => {
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showQuickContact, setShowQuickContact] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const { toast } = useToast();

  const handleAddContact = (client: any) => {
    setSelectedClient(client);
    setShowQuickContact(true);
  };

  const handleQuickContactSubmit = () => {
    // Mock function to add a contact
    toast({
      title: "Contact Added",
      description: `A new contact has been added to ${selectedClient?.companyName}.`
    });
    setShowQuickContact(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Clients" />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Button onClick={() => setShowCreateClient(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add New Client
          </Button>
        </div>

        {/* Client cards with contact info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {mockClients.map((client) => (
            <div key={client.id} className="border rounded-lg bg-white shadow-sm p-4">
              <div className="mb-3">
                <h3 className="text-lg font-semibold">{client.companyName}</h3>
                <p className="text-sm text-gray-500">{client.address}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {client.status}
                  </span>
                  <span className="text-xs text-gray-500">{client.type}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Contacts
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs" 
                    onClick={() => handleAddContact(client)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                
                <ul className="space-y-2">
                  {client.contacts.map((contact, idx) => (
                    <li key={idx} className="text-xs bg-gray-50 p-2 rounded">
                      <span className="font-medium block">{contact.name}</span>
                      {contact.designation && (
                        <span className="text-gray-500">{contact.designation}</span>
                      )}
                      <span className="block text-blue-600">{contact.email}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <ClientsView />
      </main>

      {/* Create Client Dialog */}
      <Dialog open={showCreateClient} onOpenChange={setShowCreateClient}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
          </DialogHeader>
          <CreateClientForm 
            onCancel={() => setShowCreateClient(false)} 
            onSuccess={() => {
              toast({
                title: "Client Created",
                description: "New client has been created successfully."
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Quick Add Contact Dialog */}
      <Dialog open={showQuickContact} onOpenChange={setShowQuickContact}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contact to {selectedClient?.companyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="quickContactName">Name *</Label>
                <Input id="quickContactName" placeholder="Enter contact name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickContactEmail">Email *</Label>
                <Input id="quickContactEmail" type="email" placeholder="Enter email address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickContactPhone">Phone</Label>
                <Input id="quickContactPhone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickContactDesignation">Designation</Label>
                <Input id="quickContactDesignation" placeholder="e.g., Project Manager" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowQuickContact(false)}>
                Cancel
              </Button>
              <Button onClick={handleQuickContactSubmit}>
                Add Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;
