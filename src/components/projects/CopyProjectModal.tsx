import React, { useState } from "react";
import { Copy, Search, AlertTriangle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for available projects
const availableProjects = [
  { id: "P002", name: "Office Tower - New Installation", client: "XYZ Properties" },
  { id: "P003", name: "Hospital Wing - Panel Replacement", client: "State Health Department" },
  { id: "P004", name: "Shopping Mall - Main Switchboard", client: "Retail Developers Group" },
  { id: "P005", name: "Airport Terminal B - Upgrade", client: "Regional Airport Authority" },
  { id: "P006", name: "School Building - New Construction", client: "Education Department" },
];

interface CopyProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

const CopyProjectModal: React.FC<CopyProjectModalProps> = ({
  open,
  onOpenChange,
  projectId,
  projectName,
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const [conflictType, setConflictType] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Options for copying
  const [copyOptions, setCopyOptions] = useState({
    layout: true,
    bom: true,
    notes: true,
    attachments: true,
    scheduler: false,
    estimators: true,
  });

  const handleOptionChange = (option: keyof typeof copyOptions) => {
    setCopyOptions({
      ...copyOptions,
      [option]: !copyOptions[option],
    });
  };

  const filteredProjects = availableProjects.filter(project => 
    project.id !== projectId && // Don't include current project
    (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
     project.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleCopyProject = () => {
    // In a real app, check for conflicts here
    // For now, we'll simulate a conflict for BOM if certain projects are selected
    if (selectedProject === "P003" && copyOptions.bom) {
      setConflictType("BOM");
      setShowConflictAlert(true);
      return;
    }

    // Otherwise proceed with copy
    performCopy();
  };

  const performCopy = (conflictResolution?: string) => {
    // In a real app, this would make API calls to copy the project data
    
    // Show success state
    setShowSuccess(true);
    
    // Reset and close after a delay
    setTimeout(() => {
      toast({
        title: "Project Copied Successfully",
        description: `Project data has been copied to the selected project.`,
      });
      
      setShowSuccess(false);
      setSelectedProject(null);
      setSearchTerm("");
      onOpenChange(false);
    }, 1500);
  };

  const handleConflictResolve = (action: string) => {
    setShowConflictAlert(false);
    
    if (action === "cancel") {
      return;
    }
    
    performCopy(action);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Copy Project Data</DialogTitle>
            <DialogDescription>
              Copy data from {projectName} to another project.
            </DialogDescription>
          </DialogHeader>
          
          {!showSuccess ? (
            <>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Select Destination Project</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search projects..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md max-h-60 overflow-y-auto">
                  {filteredProjects.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No matching projects found.
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredProjects.map((project) => (
                        <div 
                          key={project.id} 
                          className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedProject === project.id ? 'bg-blue-50' : ''}`}
                          onClick={() => handleSelectProject(project.id)}
                        >
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-gray-500">{project.client} | {project.id}</p>
                          </div>
                          {selectedProject === project.id && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 mt-4">
                  <Label>Data to Copy</Label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="copy-layout" 
                        checked={copyOptions.layout}
                        onCheckedChange={() => handleOptionChange("layout")}
                      />
                      <label htmlFor="copy-layout" className="text-sm cursor-pointer">
                        2D Layout/Designs
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="copy-bom" 
                        checked={copyOptions.bom}
                        onCheckedChange={() => handleOptionChange("bom")}
                      />
                      <label htmlFor="copy-bom" className="text-sm cursor-pointer">
                        Bill of Materials (BOM)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="copy-notes" 
                        checked={copyOptions.notes}
                        onCheckedChange={() => handleOptionChange("notes")}
                      />
                      <label htmlFor="copy-notes" className="text-sm cursor-pointer">
                        Notes & Tasks
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="copy-attachments" 
                        checked={copyOptions.attachments}
                        onCheckedChange={() => handleOptionChange("attachments")}
                      />
                      <label htmlFor="copy-attachments" className="text-sm cursor-pointer">
                        Attachments & Documents
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="copy-scheduler" 
                        checked={copyOptions.scheduler}
                        onCheckedChange={() => handleOptionChange("scheduler")}
                      />
                      <label htmlFor="copy-scheduler" className="text-sm cursor-pointer">
                        Scheduler Details
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="copy-estimators" 
                        checked={copyOptions.estimators}
                        onCheckedChange={() => handleOptionChange("estimators")}
                      />
                      <label htmlFor="copy-estimators" className="text-sm cursor-pointer">
                        Estimator Assignments
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="sm:justify-between">
                <div className="text-xs text-gray-500 hidden sm:block">
                  A record of this copy will be saved in the project history.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCopyProject}
                    disabled={!selectedProject}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy to Project
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-center">Copy Successful</h3>
              <p className="text-gray-500 text-center mt-1">
                Project data has been copied to the selected project.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Conflict Alert Dialog */}
      <AlertDialog open={showConflictAlert} onOpenChange={setShowConflictAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conflict Detected</AlertDialogTitle>
            <AlertDialogDescription>
              The destination project already contains a {conflictType}. How would you like to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-10 w-10 text-yellow-500" />
              <div>
                <p className="font-medium">Conflicting data found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Choose whether to overwrite existing data or merge with it.
                </p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleConflictResolve("cancel")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConflictResolve("merge")} className="bg-blue-600 hover:bg-blue-700">
              Merge Data
            </AlertDialogAction>
            <AlertDialogAction onClick={() => handleConflictResolve("overwrite")} className="bg-red-600 hover:bg-red-700">
              Overwrite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CopyProjectModal;
