
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuoteForm } from "./QuoteForm";

interface QuoteGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

export const QuoteGenerator = ({ open, onOpenChange, projectId, projectName }: QuoteGeneratorProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Quotation</DialogTitle>
          <DialogDescription>
            Create a detailed quotation for {projectName}
          </DialogDescription>
        </DialogHeader>
        
        <QuoteForm 
          subProjectId={projectId} 
          subProjectName={projectName} 
          onCancel={handleClose}
          onSuccess={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
