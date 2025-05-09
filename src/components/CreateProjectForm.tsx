
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EstimatorAvailability } from "./estimators/EstimatorAvailability";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for sales reps and estimators
const mockSalesReps = [
  { id: "sr1", name: "Alice Smith" },
  { id: "sr2", name: "Bob Johnson" },
  { id: "sr3", name: "Carol Williams" },
  { id: "sr4", name: "David Brown" }
];

const mockEstimators = [
  { id: "est1", name: "John Smith", initials: "JS" },
  { id: "est2", name: "Emily Johnson", initials: "EJ" },
  { id: "est3", name: "Michael Brown", initials: "MB" },
  { id: "est4", name: "Sarah Wilson", initials: "SW" },
  { id: "est5", name: "Robert Davis", initials: "RD" },
  { id: "est6", name: "David Jones", initials: "DJ" }
];

// Mock client data with contacts
const mockClients = [
  {
    id: "c1",
    companyName: "ABC Construction",
    address: "123 Building St",
    type: "Contractor",
    status: "Active",
    contacts: [
      { id: "con1", name: "John Smith", designation: "Project Manager", email: "john@abc.com" },
      { id: "con2", name: "Sarah Lee", designation: "Finance Director", email: "sarah@abc.com" }
    ]
  },
  {
    id: "c2",
    companyName: "XYZ Properties",
    address: "456 Real Estate Ave",
    type: "Developer",
    status: "Active",
    contacts: [
      { id: "con3", name: "Michael Brown", designation: "CEO", email: "michael@xyz.com" }
    ]
  }
];

// Office codes map
const officeCodes = {
  "B": "M", // Brisbane office
  "P": "P", // Perth office
  "S": "S", // Sydney office
  "M": "M", // Melbourne office
  "T": "T"  // Tasmania office
};

// Types
type ProjectFormData = {
  projectName: string;
  clientName: string;
  clientId: string;
  salesRep: string;
  address: string;
  state: string;
  classification: string;
  startDate: string;
  refNumber: string;
  priority: string;
  status: string;
  description: string;
  notes: string;
  estimatorHours: string; 
  estimatorId: string; 
  estimationDate: string; 
  contactId: string;
  quoteNumber: string;
};

interface CreateProjectFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: {
    projectName?: string;
    clientName?: string;
  };
}

export const CreateProjectForm = ({
  onCancel,
  onSuccess,
  initialData
}: CreateProjectFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: initialData?.projectName || "",
    clientName: initialData?.clientName || "",
    clientId: "",
    salesRep: "",
    address: "",
    state: "",
    classification: "Direct",
    startDate: "",
    refNumber: "",
    priority: "Normal",
    status: "Draft",
    description: "",
    notes: "",
    estimatorHours: "",
    estimatorId: "",
    estimationDate: "",
    contactId: "",
    quoteNumber: ""
  });

  // State for client contacts
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientContacts, setClientContacts] = useState<any[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    designation: "",
    email: "",
    phone: ""
  });

  // Track if the form has required fields filled
  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);

  // Update form data if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        projectName: initialData.projectName || prev.projectName,
        clientName: initialData.clientName || prev.clientName
      }));
    }
  }, [initialData]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update contact list when client changes
    if (name === "clientId") {
      const client = mockClients.find(c => c.id === value);
      if (client) {
        setSelectedClient(client);
        setClientContacts(client.contacts);
        // Reset selected contact when client changes
        setFormData(prev => ({
          ...prev,
          contactId: "",
          clientName: client.companyName
        }));
      } else {
        setClientContacts([]);
        setSelectedClient(null);
      }
    }
  };
  
  const handleEstimatorSelect = (date: string, estimatorId: string) => {
    setFormData(prev => ({
      ...prev,
      estimationDate: date,
      estimatorId: estimatorId
    }));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      toast({
        title: "Missing information",
        description: "Name and email are required for a new contact.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would save this to your database
    const newContactWithId = {
      id: `new-${Date.now()}`,
      ...newContact
    };

    // Add contact to the current selected client's contacts
    if (selectedClient) {
      setClientContacts(prev => [...prev, newContactWithId]);
      
      // Select the new contact
      setFormData(prev => ({
        ...prev,
        contactId: newContactWithId.id
      }));

      toast({
        title: "Contact added",
        description: `${newContact.name} has been added as a contact.`
      });

      // Reset the form and close the dialog
      setNewContact({
        name: "",
        designation: "",
        email: "",
        phone: ""
      });
      setShowAddContact(false);
    }
  };
  
  // Generate a quote number based on the specified format
  const generateQuoteNumber = (): string => {
    if (!formData.state || !formData.estimatorId) {
      return "";
    }
    
    const stateCode = formData.state;
    const year = new Date().getFullYear().toString().slice(-2);
    const sequentialNumber = Math.floor(1000 + Math.random() * 9000).toString(); // Mock sequential number
    const officeCode = officeCodes[formData.state as keyof typeof officeCodes] || "M";
    
    const selectedEstimator = mockEstimators.find(est => est.id === formData.estimatorId);
    const estimatorInitials = selectedEstimator ? selectedEstimator.initials : "XX";
    
    return `${stateCode}${year}-${sequentialNumber}${officeCode}-${estimatorInitials}`;
  };
  
  // Check if required fields are filled
  useEffect(() => {
    const isRequired = 
      formData.projectName.trim() !== "" && 
      formData.clientId !== "" && 
      formData.state !== "" &&
      formData.address.trim() !== "";
    
    setRequiredFieldsFilled(isRequired);
    
    // Generate quote number when required fields are filled
    if (isRequired && formData.estimatorId && formData.quoteNumber === "") {
      const newQuoteNumber = generateQuoteNumber();
      setFormData(prev => ({
        ...prev,
        quoteNumber: newQuoteNumber
      }));
    }
  }, [formData.projectName, formData.clientId, formData.state, formData.address, formData.estimatorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure we have the required fields
    if (!formData.projectName || !formData.clientId || !formData.state) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Make sure we have a quote number
    if (formData.quoteNumber === "" && formData.estimatorId) {
      const newQuoteNumber = generateQuoteNumber();
      setFormData(prev => ({
        ...prev,
        quoteNumber: newQuoteNumber
      }));
    }
    
    try {
      // In a real implementation, we'd save to Supabase here
      // For now let's simulate success after a delay
      setTimeout(() => {
        toast({
          title: "Project created",
          description: `Project "${formData.projectName}" has been created successfully.`
        });
        setIsSubmitting(false);
        onSuccess?.();
        onCancel();
      }, 1000);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "There was an error creating your project. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="schedule">Estimator Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input id="projectName" name="projectName" placeholder="Enter project name" value={formData.projectName} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select value={formData.clientId} onValueChange={value => handleSelectChange("clientId", value)}>
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.companyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClient && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="contactId">Contact Person</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddContact(true)}
                    className="h-6 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add New
                  </Button>
                </div>
                <Select value={formData.contactId} onValueChange={value => handleSelectChange("contactId", value)}>
                  <SelectTrigger id="contactId">
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientContacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} {contact.designation ? `(${contact.designation})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="salesRep">Sales Rep</Label>
              <Select value={formData.salesRep} onValueChange={value => handleSelectChange("salesRep", value)}>
                <SelectTrigger id="salesRep">
                  <SelectValue placeholder="Select sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {mockSalesReps.map(rep => (
                    <SelectItem key={rep.id} value={rep.id}>{rep.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" placeholder="Enter address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={value => handleSelectChange("state", value)}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B">Brisbane (B)</SelectItem>
                  <SelectItem value="P">Perth (P)</SelectItem>
                  <SelectItem value="S">Sydney (S)</SelectItem>
                  <SelectItem value="M">Melbourne (M)</SelectItem>
                  <SelectItem value="T">Tasmania (T)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classification">Project Classification</Label>
              <Select value={formData.classification} onValueChange={value => handleSelectChange("classification", value)}>
                <SelectTrigger id="classification">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tender">Tender</SelectItem>
                  <SelectItem value="Direct">Direct</SelectItem>
                  <SelectItem value="Repeat">Repeat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Project Start Date</Label>
              <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatorHours">Estimator Hours</Label>
              <Input id="estimatorHours" name="estimatorHours" type="number" placeholder="Enter estimated hours" value={formData.estimatorHours} onChange={handleChange} min="0" step="0.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatorId">Estimator</Label>
              <Select value={formData.estimatorId} onValueChange={value => handleSelectChange("estimatorId", value)}>
                <SelectTrigger id="estimatorId">
                  <SelectValue placeholder="Select estimator" />
                </SelectTrigger>
                <SelectContent>
                  {mockEstimators.map(estimator => (
                    <SelectItem key={estimator.id} value={estimator.id}>{estimator.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refNumber">Internal Ref Number</Label>
              <Input id="refNumber" name="refNumber" placeholder="Enter reference number" value={formData.refNumber} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={value => handleSelectChange("priority", value)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={value => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quote Number Display */}
          {requiredFieldsFilled && formData.estimatorId && (
            <div className="p-4 border rounded-md bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Quote Number</h3>
                  <p className="text-2xl font-mono font-bold mt-1">{formData.quoteNumber || generateQuoteNumber()}</p>
                </div>
                {formData.quoteNumber && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-800 border-green-200">
                    Auto-generated
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This quote number is automatically generated based on state, year, office, and estimator.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Link</Label>
            <Textarea id="description" name="description" placeholder="Enter project description" value={formData.description} onChange={handleChange} className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Enter internal notes" value={formData.notes} onChange={handleChange} className="min-h-[100px]" />
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <EstimatorAvailability onSelectDate={handleEstimatorSelect} selectedDate={formData.estimationDate} selectedEstimatorId={formData.estimatorId} />

          {formData.estimatorId && formData.estimationDate && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-medium text-green-800">Estimator Assigned</h3>
              <p className="text-green-700">
                The project will be assigned for estimation on {format(new Date(formData.estimationDate), 'MMMM d, yyyy')}
              </p>
              
              {formData.quoteNumber && (
                <div className="mt-2 pt-2 border-t border-green-200">
                  <p className="font-medium text-green-800">Quote Number:</p>
                  <p className="text-xl font-mono font-bold text-green-900">{formData.quoteNumber}</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog for adding new contact */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contact to {selectedClient?.companyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Name *</Label>
              <Input 
                id="contactName" 
                value={newContact.name} 
                onChange={(e) => setNewContact({...newContact, name: e.target.value})} 
                placeholder="Enter contact name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactDesignation">Designation</Label>
              <Input 
                id="contactDesignation" 
                value={newContact.designation} 
                onChange={(e) => setNewContact({...newContact, designation: e.target.value})} 
                placeholder="e.g., Project Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email *</Label>
              <Input 
                id="contactEmail" 
                type="email" 
                value={newContact.email} 
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input 
                id="contactPhone" 
                value={newContact.phone} 
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddContact(false)}>Cancel</Button>
              <Button onClick={handleAddContact}>Add Contact</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background p-4 border-t mt-8">
        <Button variant="outline" onClick={onCancel} type="button" size="lg">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
};
