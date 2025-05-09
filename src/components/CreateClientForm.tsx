
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClientInfoForm, ClientInfo } from "@/components/client/ClientInfoForm";
import { ContactPersonForm, ContactPerson } from "@/components/client/ContactPersonForm";
import { Plus, User } from "lucide-react";

// Mock data for sales reps
const mockSalesReps = [
  { id: "sr1", name: "Alice Smith" },
  { id: "sr2", name: "Bob Johnson" },
  { id: "sr3", name: "Carol Williams" },
  { id: "sr4", name: "David Brown" }
];

interface CreateClientFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export const CreateClientForm = ({ onCancel, onSuccess }: CreateClientFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClientInfo>({
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

  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([
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
      <ClientInfoForm 
        formData={formData}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        salesReps={mockSalesReps}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Contact Persons</h3>
          <Button type="button" variant="outline" onClick={addContactPerson}>
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </div>

        {contactPersons.map((person, index) => (
          <ContactPersonForm
            key={index}
            person={person}
            index={index}
            onChange={handleContactPersonChange}
            onRemove={removeContactPerson}
            canRemove={contactPersons.length > 1}
          />
        ))}
      </div>

      {/* Display contact persons summary */}
      <div className="mt-6 p-4 border rounded-md bg-gray-50">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <User className="h-4 w-4 mr-1" />
          Contact Persons Summary
        </h4>
        {contactPersons.some(p => p.name) ? (
          <ul className="space-y-2">
            {contactPersons.map((person, index) => (
              person.name ? (
                <li key={index} className="text-sm flex items-center justify-between">
                  <div>
                    <span className="font-medium">{person.name}</span>
                    {person.designation && <span className="text-gray-500 ml-2">({person.designation})</span>}
                    <span className="block text-gray-500 text-xs">{person.email || "No email provided"}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-xs h-7 px-2"
                    onClick={() => {
                      // Scroll to the contact person form
                      document.getElementById(`contact-person-${index}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Edit
                  </Button>
                </li>
              ) : null
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No contact persons added yet.</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background p-4 border-t mt-8">
        <Button variant="outline" onClick={onCancel} type="button" size="lg">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Creating..." : "Create Client"}
        </Button>
      </div>
    </form>
  );
};
