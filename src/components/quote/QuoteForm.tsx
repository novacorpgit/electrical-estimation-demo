
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BomItem } from "./bom/BomTypes";
import { BomList } from "./bom/BomList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BanknoteIcon, FileText, Printer, Send, Download } from "lucide-react";

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
  bomItems: BomItem[];
  paymentTerms: string;
  versionHistory: {
    version: number;
    date: string;
    status: string;
  }[];
  taxRate: number;
  validityPeriod: number;
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
  const [showPreview, setShowPreview] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
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
    bomItems: [],
    paymentTerms: "50% deposit, 50% on completion",
    versionHistory: [
      {
        version: 1,
        date: new Date().toISOString().split("T")[0],
        status: "Draft"
      }
    ],
    taxRate: 10, // Default GST for Australia
    validityPeriod: 30,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "bom">("details");

  const handleBomItemsChange = (bomItems: BomItem[]) => {
    setFormData(prev => {
      const newData = { ...prev, bomItems };
      
      // Update subtotals based on BOM items
      const materials = bomItems
        .filter(item => item.category !== 'labor')
        .reduce((sum, item) => sum + item.totalCost, 0);
      
      const labour = bomItems
        .filter(item => item.category === 'labor')
        .reduce((sum, item) => sum + item.totalCost, 0);
      
      // Recalculate final value
      return recalculateTotals({
        ...newData,
        subtotalMaterials: materials,
        subtotalLabour: labour
      });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric fields
    if (['subtotalMaterials', 'subtotalLabour', 'marginPercent', 'additionalCosts', 'discountPercent', 'taxRate', 'validityPeriod'].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: parsedValue };
      return recalculateTotals(updatedData);
    });
  };

  const recalculateTotals = (data: QuoteFormData): QuoteFormData => {
    const subtotal = data.subtotalMaterials + data.subtotalLabour;
    let marginAmount = 0;
    
    if (data.marginType === "markup") {
      marginAmount = subtotal * (data.marginPercent / 100);
    } else {
      // Margin calculation
      marginAmount = subtotal / (1 - (data.marginPercent / 100)) - subtotal;
    }
    
    const afterMargin = subtotal + marginAmount + data.additionalCosts;
    const discount = afterMargin * (data.discountPercent / 100);
    const afterDiscount = afterMargin - discount;
    const tax = afterDiscount * (data.taxRate / 100);
    const finalValue = afterDiscount + tax;
    
    return { ...data, finalQuotedValue: parseFloat(finalValue.toFixed(2)) };
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      
      // Recalculate if margin type changed
      if (name === "marginType") {
        return recalculateTotals(updatedData);
      }
      
      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update version history
      const updatedVersionHistory = [
        ...formData.versionHistory,
        {
          version: formData.versionHistory.length + 1,
          date: new Date().toISOString().split("T")[0],
          status: formData.approvalStatus
        }
      ];
      
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

  const handleExport = (type: 'pdf' | 'excel') => {
    setShowExportOptions(false);
    
    // Simulate export
    toast({
      title: `Exporting as ${type.toUpperCase()}`,
      description: `Your quotation is being exported as a ${type.toUpperCase()} file.`,
    });
    
    // In a real implementation, you would generate the file here
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your ${type.toUpperCase()} has been generated successfully.`,
      });
    }, 1500);
  };

  const handleMarkAsSent = () => {
    setFormData(prev => ({
      ...prev,
      approvalStatus: "Sent",
      versionHistory: [
        ...prev.versionHistory,
        {
          version: prev.versionHistory.length + 1,
          date: new Date().toISOString().split("T")[0],
          status: "Sent"
        }
      ]
    }));
    
    toast({
      title: "Quote marked as sent",
      description: `Quote ${formData.quoteNumber} has been marked as sent.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "details" | "bom")}>
        <TabsList>
          <TabsTrigger value="details">Quote Details</TabsTrigger>
          <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 pt-4">
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
              <Label htmlFor="taxRate">Tax Rate %</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={formData.taxRate}
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
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                placeholder="Payment terms..."
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
                  <SelectItem value="Sent">Sent</SelectItem>
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
            
            <div className="space-y-2">
              <Label htmlFor="validityPeriod">Validity Period (days)</Label>
              <Input
                id="validityPeriod"
                name="validityPeriod"
                type="number"
                value={formData.validityPeriod}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Materials Subtotal</Label>
                  <div className="text-lg">
                    {formData.subtotalMaterials.toLocaleString('en-AU', {
                      style: 'currency',
                      currency: formData.currency
                    })}
                  </div>
                </div>
                <div>
                  <Label>Labour Subtotal</Label>
                  <div className="text-lg">
                    {formData.subtotalLabour.toLocaleString('en-AU', {
                      style: 'currency',
                      currency: formData.currency
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="finalQuotedValue">Final Quoted Value</Label>
                <div className="text-2xl font-bold">
                  {formData.finalQuotedValue.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: formData.currency
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          
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
          
          {formData.versionHistory.length > 1 && (
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Version History</h4>
              <div className="space-y-2">
                {formData.versionHistory.map((version, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>Version {version.version}</span>
                    <span>{version.date}</span>
                    <span className={`px-2 py-1 rounded text-xs ${version.status === 'Draft' ? 'bg-gray-100' : 'bg-blue-100'}`}>
                      {version.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bom">
          <BomList 
            items={formData.bomItems}
            onItemsChange={handleBomItemsChange}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-4 border-t">
        <div className="space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" type="button">
                <FileText className="mr-2 h-4 w-4" />
                Preview Quote
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[600px] md:w-[900px]">
              <SheetHeader>
                <SheetTitle>Quote Preview</SheetTitle>
              </SheetHeader>
              <div className="mt-8 bg-white p-8 border rounded-md">
                <div className="text-right mb-8">
                  <h2 className="text-2xl font-bold">{formData.quoteNumber}</h2>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Valid until: {formData.offerExpiryDate}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-bold mb-2">Quote For:</h3>
                  <p>Client Name</p>
                  <p>Project: {subProjectName}</p>
                </div>
                
                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-right py-2">Quantity</th>
                      <th className="text-right py-2">Unit Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.bomItems.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">
                          {item.unitCost.toLocaleString('en-AU', {
                            style: 'currency',
                            currency: formData.currency
                          })}
                        </td>
                        <td className="text-right py-2">
                          {item.totalCost.toLocaleString('en-AU', {
                            style: 'currency',
                            currency: formData.currency
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between border-b py-2">
                      <span>Subtotal:</span>
                      <span>
                        {(formData.subtotalMaterials + formData.subtotalLabour).toLocaleString('en-AU', {
                          style: 'currency',
                          currency: formData.currency
                        })}
                      </span>
                    </div>
                    {formData.discountPercent > 0 && (
                      <div className="flex justify-between border-b py-2">
                        <span>Discount ({formData.discountPercent}%):</span>
                        <span>
                          {((formData.subtotalMaterials + formData.subtotalLabour) * (formData.discountPercent / 100)).toLocaleString('en-AU', {
                            style: 'currency',
                            currency: formData.currency
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-b py-2">
                      <span>Tax ({formData.taxRate}%):</span>
                      <span>
                        {((formData.finalQuotedValue / (1 + formData.taxRate / 100)) * (formData.taxRate / 100)).toLocaleString('en-AU', {
                          style: 'currency',
                          currency: formData.currency
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold py-2">
                      <span>Total:</span>
                      <span>
                        {formData.finalQuotedValue.toLocaleString('en-AU', {
                          style: 'currency',
                          currency: formData.currency
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-bold mb-2">Terms & Conditions</h3>
                  <p>Payment Terms: {formData.paymentTerms}</p>
                  <p>Quote valid for {formData.validityPeriod} days</p>
                  {formData.notes && (
                    <div className="mt-4">
                      <h4 className="font-bold">Notes:</h4>
                      <p>{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <AlertDialog open={showExportOptions} onOpenChange={setShowExportOptions}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Export Quote</AlertDialogTitle>
                <AlertDialogDescription>
                  Choose a format to export your quote
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('excel')}
                  className="flex items-center"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
                <Button 
                  onClick={() => handleExport('pdf')}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to PDF
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleMarkAsSent()}
            disabled={formData.approvalStatus === 'Sent'}
            className="flex items-center"
          >
            <Send className="mr-2 h-4 w-4" />
            Mark as Sent
          </Button>
          
          <Button 
            variant="outline" 
            type="button"
            onClick={() => setShowExportOptions(true)}
            className="flex items-center"
          >
            <Printer className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex items-center">
            <BanknoteIcon className="mr-2 h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create Quote"}
          </Button>
        </div>
      </div>
    </form>
  );
};
