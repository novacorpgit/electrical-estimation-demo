
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuoteBuilder } from "./QuoteBuilder";
import { BomItem } from "./bom/BomTypes";

interface QuoteGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  projectName?: string;
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({
  open,
  onOpenChange,
  projectId,
  projectName
}) => {
  // Mock BOM items - in a real app, these would be fetched from the project
  const mockBomItems: BomItem[] = [
    { 
      id: "1", 
      description: "100A Main Switch", 
      quantity: 1, 
      unitCost: 450, 
      totalCost: 450, 
      category: "switchgear",
      partNumber: "MS-100A",
      supplier: "Electric Components Ltd"
    },
    { 
      id: "2", 
      description: "63A MCCB", 
      quantity: 4, 
      unitCost: 250, 
      totalCost: 1000, 
      category: "breakers",
      partNumber: "MCCB-63A",
      supplier: "Circuit Pro"
    },
    { 
      id: "3", 
      description: "Installation Labor", 
      quantity: 8, 
      unitCost: 120, 
      totalCost: 960, 
      category: "labor",
      supplier: "Internal"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Generate Quote - {projectName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <QuoteBuilder
            bomItems={mockBomItems}
            projectId={projectId}
            projectName={projectName}
            onBack={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
