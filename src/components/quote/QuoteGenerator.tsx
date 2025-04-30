
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuoteGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

export const QuoteGenerator = ({ open, onOpenChange, projectId, projectName }: QuoteGeneratorProps) => {
  const navigate = useNavigate();
  
  const handleNavigateToQuotation = (subProjectId: string) => {
    onOpenChange(false);
    navigate(`/quotation/${projectId}/${subProjectId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Quotation</DialogTitle>
          <DialogDescription>
            Select a sub-project to generate a quotation for {projectName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">Choose a sub-project:</p>
          
          {/* Mock sub-projects - in a real app these would come from props or API */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left" 
              onClick={() => handleNavigateToQuotation("SP001")}
            >
              DB-01
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => handleNavigateToQuotation("SP002")}
            >
              MSB-01
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => handleNavigateToQuotation("SP003")}
            >
              PLC-01
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
