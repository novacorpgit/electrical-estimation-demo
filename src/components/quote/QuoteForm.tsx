
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type QuoteFormData = {
  quoteNumber: string;
  subProjectId: string;
  currency: string;
  subtotalMaterials: number;
  subtotalLabour: number;
  marginPercent: number;
  marginType: "markup" | "margin";
  additionalCosts: number;
  discountPercent: number;
  finalQuotedValue: number;
  approvalStatus: string;
  offerExpiryDate: string;
  notes: string;
};

interface QuoteFormProps {
  subProjectId: string;
  subProjectName: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const QuoteForm = ({ 
  subProjectId, 
  subProjectName, 
  onCancel, 
  onSuccess 
}: QuoteFormProps) => {
  const { toast } = useToast();
  
  // Generate a mock quote number using the format in the requirements
  const generateQuoteNumber = (): string => {
    const state = "B"; // Brisbane
    const year = new Date().getFullYear().toString().slice(-2);
    const sequential = Math.floor(1000 + Math.random() * 9000).toString();
    const office = "M";
    const estimator = "DJ";
    
    return `${state}${year}-${sequential}${office}-${estimator}`;
  };
  
  const [formData, setFormData] = useState<QuoteFormData>({
    quoteNumber: generateQuoteNumber(),
    subProjectId: subProjectId,
    currency: "AUD",
    subtotalMaterials: 0,
    subtotalLabour: 0,
    marginPercent: 15,
    marginType: "margin",
    additionalCosts: 0,
    discountPercent: 0,
    finalQuotedValue: 0,
    approvalStatus: "Draft",
    offerExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
    notes: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric fields
    if (['subtotalMaterials', 'subtotalLabour', 'marginPercent', 'additionalCosts', 'discountPercent'].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: parsedValue };
      
      // Recalculate final value whenever any input changes
      const subtotal = updatedData.subtotalMaterials + updatedData.subtotalLabour;
      let marginAmount = 0;
      
      if (updatedData.marginType === "markup") {
        marginAmount = subtotal * (updatedData.marginPercent / 100);
      } else {
        // Margin calculation
        marginAmount = subtotal / (1 - (updatedData.marginPercent / 100)) - subtotal;
      }
      
      const afterMargin = subtotal + marginAmount + updatedData.additionalCosts;
      const discount = afterMargin * (updatedData.discountPercent / 100);
      const finalValue = afterMargin - discount;
      
      return { ...updatedData, finalQuotedValue: parseFloat(finalValue.toFixed(2)) };
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      
      // Recalculate if margin type changed
      if (name === "marginType") {
        const subtotal = updatedData.subtotalMaterials + updatedData.subtotalLabour;
        let marginAmount = 0;
        
        if (value === "markup") {
          marginAmount = subtotal * (updatedData.marginPercent / 100);
        } else {
          // Margin calculation
          marginAmount = subtotal / (1 - (updatedData.marginPercent / 100)) - subtotal;
        }
        
        const afterMargin = subtotal + marginAmount + updatedData.additionalCosts;
        const discount = afterMargin * (updatedData.discountPercent / 100);
        const finalValue = afterMargin - discount;
        
        return { ...updatedData, finalQuotedValue: parseFloat(finalValue.toFixed(2)) };
      }
      
      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Quote created",
          description: `Quote ${formData.quoteNumber} has been created successfully.`,
        });
        setIsSubmitting(false);
        onSuccess?.();
      }, 1000);
    } catch (error) {
      console.error("Error creating quote:", error);
      toast({
        title: "Error creating quote",
        description: "There was an error creating the quote. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Quote Information</h3>
        <p className="text-sm text-muted-foreground">Creating quote for {subProjectName}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quoteNumber">Quote Number</Label>
            <Input
              id="quoteNumber"
              name="quoteNumber"
              value={formData.quoteNumber}
              readOnly
              className="bg-muted/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => handleSelectChange("currency", value)}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUD">AUD</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="NZD">NZD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtotalMaterials">Materials Subtotal</Label>
            <Input
              id="subtotalMaterials"
              name="subtotalMaterials"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.subtotalMaterials}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtotalLabour">Labour Subtotal</Label>
            <Input
              id="subtotalLabour"
              name="subtotalLabour"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.subtotalLabour}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marginType">Margin Type</Label>
            <Select
              value={formData.marginType}
              onValueChange={(value) => handleSelectChange("marginType", value as "markup" | "margin")}
            >
              <SelectTrigger id="marginType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markup">Markup %</SelectItem>
                <SelectItem value="margin">Margin %</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marginPercent">
              {formData.marginType === "markup" ? "Markup %" : "Margin %"}
            </Label>
            <Input
              id="marginPercent"
              name="marginPercent"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={formData.marginPercent}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalCosts">Additional Costs</Label>
            <Input
              id="additionalCosts"
              name="additionalCosts"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.additionalCosts}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discountPercent">Discount %</Label>
            <Input
              id="discountPercent"
              name="discountPercent"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={formData.discountPercent}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="finalQuotedValue">Final Quoted Value</Label>
            <Input
              id="finalQuotedValue"
              name="finalQuotedValue"
              type="number"
              step="0.01"
              value={formData.finalQuotedValue}
              readOnly
              className="bg-muted/50 font-bold"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="approvalStatus">Approval Status</Label>
            <Select
              value={formData.approvalStatus}
              onValueChange={(value) => handleSelectChange("approvalStatus", value)}
            >
              <SelectTrigger id="approvalStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="offerExpiryDate">Offer Expiry Date</Label>
            <Input
              id="offerExpiryDate"
              name="offerExpiryDate"
              type="date"
              value={formData.offerExpiryDate}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Enter any notes about this quote..."
            value={formData.notes}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Quote"}
        </Button>
      </div>
    </form>
  );
};
