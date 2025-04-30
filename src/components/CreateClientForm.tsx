
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClientInfoForm, ClientInfo } from "@/components/client/ClientInfoForm";
import { ContactPersonForm, ContactPerson } from "@/components/client/ContactPersonForm";

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
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Contact Persons</h3>
          <Button type="button" variant="outline" onClick={addContactPerson}>
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
