
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
type SubProjectFormData = {
  name: string;
  quantity: number;
  panelType: string;
  formType: string;
  installationType: 'Indoor' | 'Outdoor';
  tiers: string;
  boardRating: string;
  ipRating: string;
  shortCircuitRating: string;
  poleCapacity: string;
  switchboardName: string;
  status: string;
  notes: string;
};

interface SubProjectFormProps {
  projectId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const SubProjectForm = ({ projectId, onCancel, onSuccess }: SubProjectFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SubProjectFormData>({
    name: "",
    quantity: 1,
    panelType: "DB",
    formType: "Form 1",
    installationType: "Indoor",
    tiers: "",
    boardRating: "",
    ipRating: "IP54",
    shortCircuitRating: "",
    poleCapacity: "",
    switchboardName: "",
    status: "Draft",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure we have the required fields
    if (!formData.name || !formData.panelType) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
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
          title: "Sub-project created",
          description: `Sub-project "${formData.name}" has been created successfully.`,
        });
        setIsSubmitting(false);
        onSuccess?.();
        onCancel();
      }, 1000);
    } catch (error) {
      console.error("Error creating sub-project:", error);
      toast({
        title: "Error creating sub-project",
        description: "There was an error creating your sub-project. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Sub-Project Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., DB-01"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity of Panels *</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleNumberChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="panelType">Panel Type *</Label>
          <Select
            value={formData.panelType}
            onValueChange={(value) => handleSelectChange("panelType", value)}
          >
            <SelectTrigger id="panelType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DB">Distribution Board (DB)</SelectItem>
              <SelectItem value="MSB">Main Switchboard (MSB)</SelectItem>
              <SelectItem value="Control">Control Panel</SelectItem>
              <SelectItem value="MCC">Motor Control Center (MCC)</SelectItem>
              <SelectItem value="PLC">PLC Panel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="formType">Form Type *</Label>
          <Select
            value={formData.formType}
            onValueChange={(value) => handleSelectChange("formType", value)}
          >
            <SelectTrigger id="formType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Form 1">Form 1</SelectItem>
              <SelectItem value="Form 2">Form 2</SelectItem>
              <SelectItem value="Form 3">Form 3</SelectItem>
              <SelectItem value="Form 3B">Form 3B</SelectItem>
              <SelectItem value="Form 4">Form 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="installationType">Installation Type *</Label>
          <Select
            value={formData.installationType}
            onValueChange={(value) => handleSelectChange("installationType", value as 'Indoor' | 'Outdoor')}
          >
            <SelectTrigger id="installationType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Indoor">Indoor</SelectItem>
              <SelectItem value="Outdoor">Outdoor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tiers">Number of Tiers</Label>
          <Input
            id="tiers"
            name="tiers"
            type="number"
            placeholder="Enter number of tiers"
            value={formData.tiers}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="boardRating">Board Rating (A) *</Label>
          <Input
            id="boardRating"
            name="boardRating"
            placeholder="Enter rating in Amps"
            value={formData.boardRating}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ipRating">IP Rating *</Label>
          <Select
            value={formData.ipRating}
            onValueChange={(value) => handleSelectChange("ipRating", value)}
          >
            <SelectTrigger id="ipRating">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IP20">IP20</SelectItem>
              <SelectItem value="IP54">IP54</SelectItem>
              <SelectItem value="IP55">IP55</SelectItem>
              <SelectItem value="IP65">IP65</SelectItem>
              <SelectItem value="IP66">IP66</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortCircuitRating">Short Circuit Rating (kA) *</Label>
          <Input
            id="shortCircuitRating"
            name="shortCircuitRating"
            placeholder="Enter kA rating"
            value={formData.shortCircuitRating}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poleCapacity">Pole Capacity</Label>
          <Input
            id="poleCapacity"
            name="poleCapacity"
            placeholder="Enter pole capacity"
            value={formData.poleCapacity}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="switchboardName">Switchboard Name</Label>
          <Input
            id="switchboardName"
            name="switchboardName"
            placeholder="e.g., Main DB"
            value={formData.switchboardName}
            onChange={handleChange}
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
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Enter any notes or instructions"
          value={formData.notes}
          onChange={handleChange}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Sub-Project"}
        </Button>
      </div>
    </form>
  );
};
