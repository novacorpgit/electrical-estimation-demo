
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
type ClientFormData = {
  companyName: string;
  clientType: string;
  address: string;
  tags: string[];
  status: string;
  preferredCurrency: string;
  preferredPricingTier: string;
  priorityLevel: string;
  salesRep: string;
  notes: string;
};

interface CreateClientFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export const CreateClientForm = ({ onCancel, onSuccess }: CreateClientFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClientFormData>({
    companyName: "",
    clientType: "Contractor",
    address: "",
    tags: [],
    status: "Active",
    preferredCurrency: "AUD",
    preferredPricingTier: "Standard",
    priorityLevel: "Normal",
    salesRep: "",
    notes: "",
  });

  const [contactPersons, setContactPersons] = useState([
    { name: "", designation: "", email: "", phone: "", preferredCommunication: "Email", doNotContact: false }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactPersonChange = (index: number, field: string, value: any) => {
    const updatedContactPersons = [...contactPersons];
    updatedContactPersons[index] = { ...updatedContactPersons[index], [field]: value };
    setContactPersons(updatedContactPersons);
  };

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      { name: "", designation: "", email: "", phone: "", preferredCommunication: "Email", doNotContact: false }
    ]);
  };

  const removeContactPerson = (index: number) => {
    if (contactPersons.length > 1) {
      setContactPersons(contactPersons.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure we have the required fields
    if (!formData.companyName || !formData.address) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate at least one contact person has name and email
    if (!contactPersons.some(person => person.name && person.email)) {
      toast({
        title: "Missing contact information",
        description: "Please provide at least one contact person with name and email.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real implementation, we'd save to Supabase here
      // For now let's simulate success after a delay
      setTimeout(() => {
        toast({
          title: "Client created",
          description: `Client "${formData.companyName}" has been created successfully.`,
        });
        setIsSubmitting(false);
        onSuccess?.();
        onCancel();
      }, 1000);
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Error creating client",
        description: "There was an error creating the client. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientType">Client Type *</Label>
            <Select
              value={formData.clientType}
              onValueChange={(value) => handleSelectChange("clientType", value)}
            >
              <SelectTrigger id="clientType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Contractor">Contractor</SelectItem>
                <SelectItem value="Consultant">Consultant</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredCurrency">Preferred Currency</Label>
            <Select
              value={formData.preferredCurrency}
              onValueChange={(value) => handleSelectChange("preferredCurrency", value)}
            >
              <SelectTrigger id="preferredCurrency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUD">AUD</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="NZD">NZD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredPricingTier">Preferred Pricing Tier</Label>
            <Select
              value={formData.preferredPricingTier}
              onValueChange={(value) => handleSelectChange("preferredPricingTier", value)}
            >
              <SelectTrigger id="preferredPricingTier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="WS">Wholesale (WS)</SelectItem>
                <SelectItem value="WS+7">Wholesale +7% (WS+7)</SelectItem>
                <SelectItem value="Contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorityLevel">Priority Level</Label>
            <Select
              value={formData.priorityLevel}
              onValueChange={(value) => handleSelectChange("priorityLevel", value)}
            >
              <SelectTrigger id="priorityLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Strategic">Strategic Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salesRep">Assigned Sales Rep</Label>
            <Input
              id="salesRep"
              name="salesRep"
              placeholder="Enter sales rep name"
              value={formData.salesRep}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Client Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Enter any relationship notes, preferences, etc."
            value={formData.notes}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Contact Persons</h3>
          <Button type="button" variant="outline" onClick={addContactPerson}>
            Add Contact
          </Button>
        </div>

        {contactPersons.map((person, index) => (
          <div key={index} className="border p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Contact Person {index + 1}</h4>
              {contactPersons.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeContactPerson(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  placeholder="Enter full name"
                  value={person.name}
                  onChange={(e) => handleContactPersonChange(index, 'name', e.target.value)}
                  required={index === 0}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input
                  placeholder="e.g., Project Manager"
                  value={person.designation}
                  onChange={(e) => handleContactPersonChange(index, 'designation', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={person.email}
                  onChange={(e) => handleContactPersonChange(index, 'email', e.target.value)}
                  required={index === 0}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Enter phone number"
                  value={person.phone}
                  onChange={(e) => handleContactPersonChange(index, 'phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Communication</Label>
                <Select
                  value={person.preferredCommunication}
                  onValueChange={(value) => handleContactPersonChange(index, 'preferredCommunication', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 flex items-end gap-2">
                <Checkbox 
                  id={`doNotContact-${index}`} 
                  checked={person.doNotContact}
                  onCheckedChange={(checked) => handleContactPersonChange(index, 'doNotContact', checked)}
                />
                <Label htmlFor={`doNotContact-${index}`}>Do Not Contact</Label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Client"}
        </Button>
      </div>
    </form>
  );
};
