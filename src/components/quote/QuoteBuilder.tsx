
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BomItem } from "./bom/BomTypes";
import { QuoteTemplate } from "./QuoteTemplate";
import { QuotePDFGenerator } from "./QuotePDFGenerator";
import { Calculator, FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuoteBuilderProps {
  bomItems: BomItem[];
  subProjectName?: string;
  onBomItemsChange?: (items: BomItem[]) => void;
}

export interface QuoteData {
  id: string;
  quoteNumber: string;
  customerName: string;
  projectName: string;
  subProjectName: string;
  materialsCost: number;
  laborCost: number;
  marginType: "markup" | "margin";
  marginPercentage: number;
  additionalCosts: number;
  discountPercentage: number;
  taxRate: number;
  totalCost: number;
  validityDays: number;
  paymentTerms: string;
  notes: string;
  template: "standard" | "detailed" | "modern";
  bomItems: BomItem[];
  createdDate: string;
  expiryDate: string;
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  bomItems,
  subProjectName = "",
  onBomItemsChange
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [showPreview, setShowPreview] = useState(false);
  
  const [quoteData, setQuoteData] = useState<QuoteData>({
    id: `Q-${Date.now()}`,
    quoteNumber: generateQuoteNumber(),
    customerName: "",
    projectName: "",
    subProjectName,
    materialsCost: 0,
    laborCost: 0,
    marginType: "margin",
    marginPercentage: 15,
    additionalCosts: 0,
    discountPercentage: 0,
    taxRate: 10,
    totalCost: 0,
    validityDays: 30,
    paymentTerms: "50% deposit, 50% on completion",
    notes: "",
    template: "standard",
    bomItems,
    createdDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  function generateQuoteNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const sequential = Math.floor(1000 + Math.random() * 9000);
    return `QT${year}${month}-${sequential}`;
  }

  // Calculate costs when BOM items change
  useEffect(() => {
    const materialsCost = bomItems
      .filter(item => item.category !== 'labor')
      .reduce((sum, item) => sum + item.totalCost, 0);
    
    const laborCost = bomItems
      .filter(item => item.category === 'labor')
      .reduce((sum, item) => sum + item.totalCost, 0);

    setQuoteData(prev => ({
      ...prev,
      materialsCost,
      laborCost,
      bomItems
    }));
  }, [bomItems]);

  // Recalculate total when pricing parameters change
  useEffect(() => {
    const subtotal = quoteData.materialsCost + quoteData.laborCost;
    let marginAmount = 0;

    if (quoteData.marginType === "markup") {
      marginAmount = subtotal * (quoteData.marginPercentage / 100);
    } else {
      marginAmount = subtotal / (1 - (quoteData.marginPercentage / 100)) - subtotal;
    }

    const afterMargin = subtotal + marginAmount + quoteData.additionalCosts;
    const discount = afterMargin * (quoteData.discountPercentage / 100);
    const afterDiscount = afterMargin - discount;
    const tax = afterDiscount * (quoteData.taxRate / 100);
    const totalCost = afterDiscount + tax;

    setQuoteData(prev => ({
      ...prev,
      totalCost: Math.round(totalCost * 100) / 100
    }));
  }, [
    quoteData.materialsCost,
    quoteData.laborCost,
    quoteData.marginType,
    quoteData.marginPercentage,
    quoteData.additionalCosts,
    quoteData.discountPercentage,
    quoteData.taxRate
  ]);

  const handleInputChange = (field: keyof QuoteData, value: any) => {
    setQuoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveQuote = () => {
    // In a real app, this would save to database
    toast({
      title: "Quote Saved",
      description: `Quote ${quoteData.quoteNumber} has been saved successfully.`
    });
  };

  const handleGeneratePDF = () => {
    toast({
      title: "Generating PDF",
      description: "Your quote PDF is being generated..."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Quote Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Quote Details</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Margins</TabsTrigger>
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quoteNumber">Quote Number</Label>
                  <Input
                    id="quoteNumber"
                    value={quoteData.quoteNumber}
                    onChange={(e) => handleInputChange("quoteNumber", e.target.value)}
                    className="bg-muted/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={quoteData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={quoteData.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validityDays">Validity (Days)</Label>
                  <Input
                    id="validityDays"
                    type="number"
                    value={quoteData.validityDays}
                    onChange={(e) => handleInputChange("validityDays", parseInt(e.target.value) || 30)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Textarea
                  id="paymentTerms"
                  value={quoteData.paymentTerms}
                  onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                  placeholder="Enter payment terms"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={quoteData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes or terms"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Materials Cost:</span>
                      <span className="font-medium">
                        ${quoteData.materialsCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor Cost:</span>
                      <span className="font-medium">
                        ${quoteData.laborCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Subtotal:</span>
                      <span className="font-medium">
                        ${(quoteData.materialsCost + quoteData.laborCost).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Pricing Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Margin Type</Label>
                      <Select
                        value={quoteData.marginType}
                        onValueChange={(value: "markup" | "margin") => 
                          handleInputChange("marginType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="margin">Margin %</SelectItem>
                          <SelectItem value="markup">Markup %</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {quoteData.marginType === "markup" ? "Markup" : "Margin"} %
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={quoteData.marginPercentage}
                        onChange={(e) => 
                          handleInputChange("marginPercentage", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Costs</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={quoteData.additionalCosts}
                        onChange={(e) => 
                          handleInputChange("additionalCosts", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Discount %</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={quoteData.discountPercentage}
                        onChange={(e) => 
                          handleInputChange("discountPercentage", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tax Rate %</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={quoteData.taxRate}
                        onChange={(e) => 
                          handleInputChange("taxRate", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Label className="text-lg">Total Quote Value</Label>
                    <div className="text-3xl font-bold text-primary mt-2">
                      ${quoteData.totalCost.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="template" className="space-y-4">
              <QuoteTemplate
                selectedTemplate={quoteData.template}
                onTemplateChange={(template) => handleInputChange("template", template)}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Quote Preview</h3>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                    <Eye className="mr-2 h-4 w-4" />
                    {showPreview ? "Hide" : "Show"} Preview
                  </Button>
                  <QuotePDFGenerator 
                    quoteData={quoteData}
                    onGenerate={handleGeneratePDF}
                  />
                </div>
              </div>

              {showPreview && (
                <Card>
                  <CardContent className="p-8">
                    <div className="bg-white border rounded-lg p-8 space-y-6">
                      <div className="text-center border-b pb-4">
                        <h1 className="text-2xl font-bold">QUOTATION</h1>
                        <p className="text-lg">{quoteData.quoteNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {quoteData.createdDate} | Valid until: {quoteData.expiryDate}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-semibold mb-2">Quote For:</h3>
                          <p>{quoteData.customerName}</p>
                          <p>{quoteData.projectName}</p>
                          {quoteData.subProjectName && <p>{quoteData.subProjectName}</p>}
                        </div>
                        <div className="text-right">
                          <h3 className="font-semibold mb-2">Company Details</h3>
                          <p>Your Company Name</p>
                          <p>Address Line 1</p>
                          <p>City, State, ZIP</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Items</h3>
                        <table className="w-full border-collapse border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border p-2 text-left">Description</th>
                              <th className="border p-2 text-center">Qty</th>
                              <th className="border p-2 text-right">Unit Price</th>
                              <th className="border p-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quoteData.bomItems.map((item, index) => (
                              <tr key={index}>
                                <td className="border p-2">{item.description}</td>
                                <td className="border p-2 text-center">{item.quantity}</td>
                                <td className="border p-2 text-right">
                                  ${item.unitCost.toLocaleString()}
                                </td>
                                <td className="border p-2 text-right">
                                  ${item.totalCost.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${(quoteData.materialsCost + quoteData.laborCost).toLocaleString()}</span>
                          </div>
                          {quoteData.discountPercentage > 0 && (
                            <div className="flex justify-between">
                              <span>Discount ({quoteData.discountPercentage}%):</span>
                              <span>-${((quoteData.materialsCost + quoteData.laborCost) * quoteData.discountPercentage / 100).toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Tax ({quoteData.taxRate}%):</span>
                            <span>${(quoteData.totalCost * quoteData.taxRate / (100 + quoteData.taxRate)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>${quoteData.totalCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                        <p className="text-sm">{quoteData.paymentTerms}</p>
                        <p className="text-sm">Quote valid for {quoteData.validityDays} days from date of issue.</p>
                        {quoteData.notes && (
                          <div className="mt-2">
                            <h4 className="font-semibold">Notes:</h4>
                            <p className="text-sm">{quoteData.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4 border-t">
            <div className="space-x-2">
              <Button variant="outline" onClick={handleSaveQuote}>
                <FileText className="mr-2 h-4 w-4" />
                Save Quote
              </Button>
            </div>
            <div className="space-x-2">
              <Button onClick={handleGeneratePDF}>
                <Download className="mr-2 h-4 w-4" />
                Generate PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
