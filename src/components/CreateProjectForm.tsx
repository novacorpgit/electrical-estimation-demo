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

// Types
type ProjectFormData = {
  projectName: string;
  clientName: string;
  salesRep: string;
  address: string;
  state: string;
  classification: string;
  startDate: string;
  poNumber: string;
  refNumber: string;
  priority: string;
  status: string;
  description: string;
  notes: string;
  estimatorHours: string; // New field
  estimatorId: string; // Added field for estimator assignment
  estimationDate: string; // Added field for estimation date
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
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: initialData?.projectName || "",
    clientName: initialData?.clientName || "",
    salesRep: "",
    address: "",
    state: "",
    classification: "Direct",
    startDate: "",
    poNumber: "",
    refNumber: "",
    priority: "Normal",
    status: "Draft",
    description: "",
    notes: "",
    estimatorHours: "",
    estimatorId: "",
    // New field with empty default
    estimationDate: "" // New field with empty default
  });

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
    const {
      name,
      value
    } = e.target;
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
  };
  const handleEstimatorSelect = (date: string, estimatorId: string) => {
    setFormData(prev => ({
      ...prev,
      estimationDate: date,
      estimatorId: estimatorId
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure we have the required fields
    if (!formData.projectName || !formData.clientName || !formData.state) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
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
  return <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="clientName">Client Name *</Label>
              <Input id="clientName" name="clientName" placeholder="Enter client name" value={formData.clientName} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesRep">Sales Rep</Label>
              <Input id="salesRep" name="salesRep" placeholder="Enter sales rep name" value={formData.salesRep} onChange={handleChange} />
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
              <Label htmlFor="poNumber">Customer PO Number</Label>
              <Input id="poNumber" name="poNumber" placeholder="Enter PO number" value={formData.poNumber} onChange={handleChange} />
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

          {formData.estimatorId && formData.estimationDate && <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-medium text-green-800">Estimator Assigned</h3>
              <p className="text-green-700">
                The project will be assigned for estimation on {format(new Date(formData.estimationDate), 'MMMM d, yyyy')}
              </p>
            </div>}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background p-4 border-t mt-8">
        <Button variant="outline" onClick={onCancel} type="button" size="lg">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>;
};