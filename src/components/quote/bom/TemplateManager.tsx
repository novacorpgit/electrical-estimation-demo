
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Save, FolderOpen } from "lucide-react";
import { BomItem } from "./BomTypes";

// Define template categories
const DEFAULT_TEMPLATE_CATEGORIES = [
  "Main Distribution Boards",
  "Sub Distribution Boards",
  "Motor Control Centers",
  "Lighting Panels",
  "Power Panels",
  "Control Panels",
  "Other",
];

export interface Template {
  id: string;
  name: string;
  category: string;
  items: BomItem[];
  createdAt: string;
  updatedAt: string;
}

interface TemplateManagerProps {
  currentBomItems: BomItem[];
  onLoadTemplate: (items: BomItem[]) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  currentBomItems,
  onLoadTemplate,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState(DEFAULT_TEMPLATE_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Load templates from local storage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("bom-templates");
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Error loading templates:", error);
        toast.error("Failed to load saved templates");
      }
    }
  }, []);

  // Save a new template
  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (currentBomItems.length === 0) {
      toast.error("Cannot save an empty template");
      return;
    }

    const finalCategory = showCustomCategory ? customCategory : newTemplateCategory;
    if (showCustomCategory && !customCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      category: finalCategory,
      items: [...currentBomItems],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    
    // Save to localStorage
    localStorage.setItem("bom-templates", JSON.stringify(updatedTemplates));
    
    setShowSaveDialog(false);
    setNewTemplateName("");
    setNewTemplateCategory(DEFAULT_TEMPLATE_CATEGORIES[0]);
    setCustomCategory("");
    setShowCustomCategory(false);
    
    toast.success(`Template "${newTemplateName}" saved successfully`);
  };

  // Load a template
  const handleLoadTemplate = (template: Template) => {
    onLoadTemplate(template.items);
    toast.success(`Template "${template.name}" loaded`);
  };

  // Get unique categories from saved templates
  const getUniqueCategories = (): string[] => {
    const savedCategories = new Set(templates.map(template => template.category));
    return [...DEFAULT_TEMPLATE_CATEGORIES, ...Array.from(savedCategories)]
      .filter((value, index, self) => self.indexOf(value) === index);
  };

  // Group templates by category
  const templatesByCategory = templates.reduce<Record<string, Template[]>>((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save as Template
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <FolderOpen className="h-4 w-4 mr-2" />
              Load Template
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
            {Object.entries(templatesByCategory).length > 0 ? (
              Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                <React.Fragment key={category}>
                  <div className="px-2 py-1.5 text-sm font-semibold bg-muted/50">{category}</div>
                  {categoryTemplates.map(template => (
                    <DropdownMenuItem 
                      key={template.id}
                      onClick={() => handleLoadTemplate(template)}
                    >
                      {template.name}
                    </DropdownMenuItem>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No saved templates</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save the current BOM as a reusable template.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="Enter template name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="template-category">Category</Label>
              {!showCustomCategory ? (
                <>
                  <Select 
                    value={newTemplateCategory} 
                    onValueChange={setNewTemplateCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniqueCategories().map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="__custom__">+ Add Custom Category</SelectItem>
                    </SelectContent>
                  </Select>
                  {newTemplateCategory === "__custom__" && (
                    <div className="mt-2">
                      <Input
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCustomCategory(false);
                      setCustomCategory("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
