
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Check } from "lucide-react";

interface QuoteTemplateProps {
  selectedTemplate: string;
  onTemplateChange: (template: "standard" | "detailed" | "modern") => void;
}

const templates = [
  {
    id: "standard",
    name: "Standard",
    description: "Classic business quotation format with essential information",
    features: ["Basic header and footer", "Simple item table", "Standard terms"]
  },
  {
    id: "detailed",
    name: "Detailed",
    description: "Comprehensive format with detailed breakdowns and specifications",
    features: ["Detailed item descriptions", "Cost breakdowns", "Extended terms", "Technical specifications"]
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with clean layout and visual appeal",
    features: ["Modern styling", "Visual elements", "Professional layout", "Company branding"]
  }
];

export const QuoteTemplate: React.FC<QuoteTemplateProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Quote Template</h3>
        <p className="text-muted-foreground">
          Select a template that best fits your business needs and branding.
        </p>
      </div>

      <RadioGroup 
        value={selectedTemplate} 
        onValueChange={onTemplateChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {templates.map((template) => (
          <div key={template.id} className="relative">
            <RadioGroupItem
              value={template.id}
              id={`template-${template.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`template-${template.id}`}
              className="cursor-pointer"
            >
              <Card className={`border-2 transition-all hover:shadow-md ${
                selectedTemplate === template.id 
                  ? "border-primary shadow-md" 
                  : "border-border hover:border-muted-foreground/20"
              }`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        selectedTemplate === template.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Features:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {template.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="h-24 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Template Preview</span>
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
