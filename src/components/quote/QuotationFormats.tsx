
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Check } from "lucide-react";

// Define available quotation format templates
const formatTemplates = [
  {
    id: "standard",
    name: "Standard",
    description: "Classic business quotation format with company branding",
    preview: "/quotation-standard.png" // These would be actual preview images in a real app
  },
  {
    id: "detailed",
    name: "Detailed",
    description: "Comprehensive format with detailed line items and terms",
    preview: "/quotation-detailed.png"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with clean layout and visual hierarchy",
    preview: "/quotation-modern.png"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Simplified design focusing on essential information only",
    preview: "/quotation-minimalist.png"
  },
  {
    id: "technical",
    name: "Technical",
    description: "Format optimized for technical specifications and drawings",
    preview: "/quotation-technical.png"
  }
];

interface QuotationFormatsProps {
  selectedFormat: string;
  onSelectFormat: (formatId: string) => void;
}

export const QuotationFormats = ({ selectedFormat, onSelectFormat }: QuotationFormatsProps) => {
  const [hoveredFormat, setHoveredFormat] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <RadioGroup value={selectedFormat} onValueChange={onSelectFormat} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formatTemplates.map((format) => (
          <div key={format.id} className="relative">
            <RadioGroupItem
              value={format.id}
              id={`format-${format.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`format-${format.id}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredFormat(format.id)}
              onMouseLeave={() => setHoveredFormat(null)}
            >
              <Card className={`border-2 transition-all ${
                selectedFormat === format.id 
                  ? "border-primary shadow-md" 
                  : hoveredFormat === format.id 
                  ? "border-muted-foreground/20 shadow-sm" 
                  : "border-transparent"
              }`}>
                <CardContent className="p-4 flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${selectedFormat === format.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{format.name}</p>
                        <p className="text-sm text-muted-foreground">{format.description}</p>
                      </div>
                    </div>
                    {selectedFormat === format.id && (
                      <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="h-32 bg-muted/20 rounded flex items-center justify-center mt-2">
                    <p className="text-sm text-muted-foreground">Format preview</p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
