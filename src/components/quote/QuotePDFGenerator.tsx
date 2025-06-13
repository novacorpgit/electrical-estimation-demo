
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Settings } from "lucide-react";
import { QuoteData } from "./QuoteBuilder";
import { useToast } from "@/hooks/use-toast";

interface QuotePDFGeneratorProps {
  quoteData: QuoteData;
  onGenerate: () => void;
}

export const QuotePDFGenerator: React.FC<QuotePDFGeneratorProps> = ({
  quoteData,
  onGenerate
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    format: "A4",
    orientation: "portrait",
    includeItemDetails: true,
    includeCostBreakdown: true,
    includeTerms: true,
    includeNotes: true,
    watermark: false,
    logoUrl: ""
  });

  const handleGeneratePDF = () => {
    // In a real implementation, this would generate the actual PDF
    // using libraries like jsPDF, Puppeteer, or a backend service
    
    toast({
      title: "PDF Generated",
      description: `Quote ${quoteData.quoteNumber} has been exported as PDF.`,
    });
    
    onGenerate();
    setIsOpen(false);
    
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `Quote-${quoteData.quoteNumber}.pdf`;
    // In real implementation: link.href = pdfBlobUrl;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const handleOptionChange = (option: string, value: any) => {
    setPdfOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            PDF Export Options
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Page Format</Label>
              <Select 
                value={pdfOptions.format} 
                onValueChange={(value) => handleOptionChange("format", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Orientation</Label>
              <Select 
                value={pdfOptions.orientation} 
                onValueChange={(value) => handleOptionChange("orientation", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">Include Sections</Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeItemDetails"
                  checked={pdfOptions.includeItemDetails}
                  onCheckedChange={(checked) => 
                    handleOptionChange("includeItemDetails", checked)
                  }
                />
                <Label htmlFor="includeItemDetails" className="text-sm">
                  Item Details & Descriptions
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCostBreakdown"
                  checked={pdfOptions.includeCostBreakdown}
                  onCheckedChange={(checked) => 
                    handleOptionChange("includeCostBreakdown", checked)
                  }
                />
                <Label htmlFor="includeCostBreakdown" className="text-sm">
                  Cost Breakdown & Margins
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTerms"
                  checked={pdfOptions.includeTerms}
                  onCheckedChange={(checked) => 
                    handleOptionChange("includeTerms", checked)
                  }
                />
                <Label htmlFor="includeTerms" className="text-sm">
                  Terms & Conditions
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeNotes"
                  checked={pdfOptions.includeNotes}
                  onCheckedChange={(checked) => 
                    handleOptionChange("includeNotes", checked)
                  }
                />
                <Label htmlFor="includeNotes" className="text-sm">
                  Additional Notes
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="watermark"
                  checked={pdfOptions.watermark}
                  onCheckedChange={(checked) => 
                    handleOptionChange("watermark", checked)
                  }
                />
                <Label htmlFor="watermark" className="text-sm">
                  Add Draft Watermark
                </Label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-3">
              <strong>Quote Summary:</strong>
              <br />
              Items: {quoteData.bomItems.length}
              <br />
              Total Value: ${quoteData.totalCost.toLocaleString()}
              <br />
              Template: {quoteData.template}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleGeneratePDF} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Generate PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
