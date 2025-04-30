
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus } from "lucide-react";

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
  customPanelLabels: string[];
  bomTemplate: string;
  layoutTemplate: string;
  files: File[];
};

interface SubProjectFormProps {
  projectId: string;
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: Partial<SubProjectFormData>;
  isEditMode?: boolean;
}

export const SubProjectForm = ({ 
  projectId, 
  onCancel, 
  onSuccess, 
  initialData, 
  isEditMode = false 
}: SubProjectFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SubProjectFormData>({
    name: initialData?.name || "",
    quantity: initialData?.quantity || 1,
    panelType: initialData?.panelType || "DB",
    formType: initialData?.formType || "Form 1",
    installationType: initialData?.installationType || "Indoor",
    tiers: initialData?.tiers || "",
    boardRating: initialData?.boardRating || "",
    ipRating: initialData?.ipRating || "IP54",
    shortCircuitRating: initialData?.shortCircuitRating || "",
    poleCapacity: initialData?.poleCapacity || "",
    switchboardName: initialData?.switchboardName || "",
    status: initialData?.status || "Draft",
    notes: initialData?.notes || "",
    customPanelLabels: initialData?.customPanelLabels || [],
    bomTemplate: initialData?.bomTemplate || "none",
    layoutTemplate: initialData?.layoutTemplate || "none",
    files: [],
  });

  const [activeTab, setActiveTab] = useState<string>("details");
  const [labelInput, setLabelInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for templates
  const bomTemplates = [
    { id: "bom1", name: "Standard Distribution Board" },
    { id: "bom2", name: "Main Switchboard Template" },
    { id: "bom3", name: "Control Panel Basic" },
  ];

  const layoutTemplates = [
    { id: "layout1", name: "Single Row Layout" },
    { id: "layout2", name: "Double Row Layout" },
    { id: "layout3", name: "L-Shaped Layout" },
  ];

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

  const handleAddLabel = () => {
    if (labelInput.trim() !== "") {
      setFormData(prev => ({
        ...prev,
        customPanelLabels: [...prev.customPanelLabels, labelInput.trim()]
      }));
      setLabelInput("");
    }
  };

  const handleRemoveLabel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customPanelLabels: prev.customPanelLabels.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...filesArray]
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure we have the required fields
    if (!formData.name || !formData.panelType || !formData.boardRating || !formData.shortCircuitRating) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real implementation, we'd save to a database here
      // For now let's simulate success after a delay
      setTimeout(() => {
        toast({
          title: isEditMode ? "Sub-project updated" : "Sub-project created",
          description: `Sub-project "${formData.name}" has been ${isEditMode ? 'updated' : 'created'} successfully.`,
        });
        setIsSubmitting(false);
        onSuccess?.();
        onCancel();
      }, 1000);
    } catch (error) {
      console.error("Error saving sub-project:", error);
      toast({
        title: `Error ${isEditMode ? 'updating' : 'creating'} sub-project`,
        description: `There was an error ${isEditMode ? 'updating' : 'creating'} your sub-project. Please try again.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="technical">Technical Specs</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">Sub-Project Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., DB-01"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="font-medium">Quantity of Panels *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleNumberChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="panelType" className="font-medium">Panel Type *</Label>
              <Select
                value={formData.panelType}
                onValueChange={(value) => handleSelectChange("panelType", value)}
              >
                <SelectTrigger id="panelType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="DB">Distribution Board (DB)</SelectItem>
                  <SelectItem value="MSB">Main Switchboard (MSB)</SelectItem>
                  <SelectItem value="Control">Control Panel</SelectItem>
                  <SelectItem value="MCC">Motor Control Center (MCC)</SelectItem>
                  <SelectItem value="PLC">PLC Panel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formType" className="font-medium">Form Type *</Label>
              <Select
                value={formData.formType}
                onValueChange={(value) => handleSelectChange("formType", value)}
              >
                <SelectTrigger id="formType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 3B">Form 3B</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installationType" className="font-medium">Installation Type *</Label>
              <Select
                value={formData.installationType}
                onValueChange={(value) => handleSelectChange("installationType", value as 'Indoor' | 'Outdoor')}
              >
                <SelectTrigger id="installationType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Indoor">Indoor</SelectItem>
                  <SelectItem value="Outdoor">Outdoor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="font-medium">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="switchboardName" className="font-medium">Switchboard Name</Label>
              <Input
                id="switchboardName"
                name="switchboardName"
                placeholder="e.g., Main DB"
                value={formData.switchboardName}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="boardRating" className="font-medium">Board Rating (A) *</Label>
              <Input
                id="boardRating"
                name="boardRating"
                placeholder="Enter rating in Amps"
                value={formData.boardRating}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipRating" className="font-medium">IP Rating *</Label>
              <Select
                value={formData.ipRating}
                onValueChange={(value) => handleSelectChange("ipRating", value)}
              >
                <SelectTrigger id="ipRating" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="IP20">IP20</SelectItem>
                  <SelectItem value="IP54">IP54</SelectItem>
                  <SelectItem value="IP55">IP55</SelectItem>
                  <SelectItem value="IP65">IP65</SelectItem>
                  <SelectItem value="IP66">IP66</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortCircuitRating" className="font-medium">Short Circuit Rating (kA) *</Label>
              <Input
                id="shortCircuitRating"
                name="shortCircuitRating"
                placeholder="Enter kA rating"
                value={formData.shortCircuitRating}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiers" className="font-medium">Number of Tiers</Label>
              <Input
                id="tiers"
                name="tiers"
                type="number"
                placeholder="Enter number of tiers"
                value={formData.tiers}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poleCapacity" className="font-medium">Pole Capacity</Label>
              <Input
                id="poleCapacity"
                name="poleCapacity"
                placeholder="Enter pole capacity"
                value={formData.poleCapacity}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Custom Panel Labels</Label>
              <div className="flex space-x-2">
                <Input
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  placeholder="Add panel label..."
                  className="flex-1"
                />
                <Button type="button" size="icon" onClick={handleAddLabel}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.customPanelLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.customPanelLabels.map((label, index) => (
                    <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLabel(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bomTemplate" className="font-medium">BOM Template</Label>
              <Select
                value={formData.bomTemplate}
                onValueChange={(value) => handleSelectChange("bomTemplate", value)}
              >
                <SelectTrigger id="bomTemplate" className="w-full">
                  <SelectValue placeholder="Select a BOM template" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="none">None</SelectItem>
                  {bomTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="layoutTemplate" className="font-medium">Layout Template</Label>
              <Select
                value={formData.layoutTemplate}
                onValueChange={(value) => handleSelectChange("layoutTemplate", value)}
              >
                <SelectTrigger id="layoutTemplate" className="w-full">
                  <SelectValue placeholder="Select a layout template" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="none">None</SelectItem>
                  {layoutTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes" className="font-medium">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter any notes or instructions"
                value={formData.notes}
                onChange={handleChange}
                className="min-h-[100px] w-full"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="font-medium">Upload Files (SLDs, Drawings)</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    id="fileUpload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer w-full"
                  />
                </div>
              </div>
              {formData.files.length > 0 && (
                <div className="mt-4">
                  <Label className="font-medium">Uploaded Files:</Label>
                  <div className="mt-2 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                        <span className="truncate max-w-[300px]">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background p-4 border-t mt-8">
        <Button variant="outline" onClick={onCancel} type="button" size="lg">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Sub-Project" : "Create Sub-Project")}
        </Button>
      </div>
    </form>
  );
};
