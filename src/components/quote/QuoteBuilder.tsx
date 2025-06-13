import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BomItem } from "./bom/BomTypes";
import { QuotePDFGenerator } from "./QuotePDFGenerator";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Calculator, FileText, DollarSign, ArrowLeft, Building, Zap } from "lucide-react";

export interface QuoteData {
  quoteNumber: string;
  projectName: string;
  clientName: string;
  contactPerson: string;
  address: string;
  phone: string;
  email: string;
  validUntil: string;
  template: "standard" | "detailed" | "modern";
  bomItems: BomItem[];
  materialMarginPercent: number;
  laborMarginPercent: number;
  totalCost: number;
  totalMargin: number;
  finalPrice: number;
  notes: string;
  terms: string;
  subProjects?: any[]; // For sub-project details
}

interface QuoteBuilderProps {
  bomItems: BomItem[];
  subProjectName?: string;
  onBomItemsChange?: (items: BomItem[]) => void;
  onBack?: () => void;
  projectId?: string;
  projectName?: string;
  subProjects?: any[]; // Add sub-projects prop
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  bomItems,
  subProjectName,
  onBomItemsChange,
  onBack,
  projectId,
  projectName,
  subProjects = []
}) => {
  const { toast } = useToast();
  
  const [quoteData, setQuoteData] = useState<QuoteData>({
    quoteNumber: `Q-${Date.now()}`,
    projectName: projectName || subProjectName || "",
    clientName: "",
    contactPerson: "",
    address: "",
    phone: "",
    email: "",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    template: "standard",
    bomItems,
    materialMarginPercent: 15,
    laborMarginPercent: 25,
    totalCost: 0,
    totalMargin: 0,
    finalPrice: 0,
    notes: "",
    terms: "Payment terms: Net 30 days\nValidity: 30 days from quote date\nDelivery: 4-6 weeks from order confirmation",
    subProjects
  });

  // Calculate costs whenever BOM items or margins change
  useEffect(() => {
    const materialCost = bomItems
      .filter(item => item.category !== 'labor')
      .reduce((sum, item) => sum + item.totalCost, 0);
    
    const laborCost = bomItems
      .filter(item => item.category === 'labor')
      .reduce((sum, item) => sum + item.totalCost, 0);
    
    const materialMargin = materialCost * (quoteData.materialMarginPercent / 100);
    const laborMargin = laborCost * (quoteData.laborMarginPercent / 100);
    const totalMargin = materialMargin + laborMargin;
    const totalCost = materialCost + laborCost;
    const finalPrice = totalCost + totalMargin;

    setQuoteData(prev => ({
      ...prev,
      bomItems,
      totalCost,
      totalMargin,
      finalPrice
    }));
  }, [bomItems, quoteData.materialMarginPercent, quoteData.laborMarginPercent]);

  const handleInputChange = (field: keyof QuoteData, value: string | number) => {
    setQuoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveQuote = () => {
    // In a real implementation, this would save to a database
    toast({
      title: "Quote Saved",
      description: `Quote ${quoteData.quoteNumber} has been saved successfully.`,
    });
  };

  const handleGeneratePDF = () => {
    toast({
      title: "Quote Generated",
      description: `Quote ${quoteData.quoteNumber} has been generated and is ready for download.`,
    });
  };

  const materialCost = bomItems
    .filter(item => item.category !== 'labor')
    .reduce((sum, item) => sum + item.totalCost, 0);
  
  const laborCost = bomItems
    .filter(item => item.category === 'labor')
    .reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold">Generate Quote</h2>
            <p className="text-muted-foreground">Create a professional quotation from your project</p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {quoteData.quoteNumber}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Quote Details & Sub-Projects */}
        <div className="space-y-6">
          {/* Quote Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Quote Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={quoteData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quoteNumber">Quote Number</Label>
                  <Input
                    id="quoteNumber"
                    value={quoteData.quoteNumber}
                    onChange={(e) => handleInputChange('quoteNumber', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={quoteData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={quoteData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={quoteData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={quoteData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={quoteData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={quoteData.validUntil}
                    onChange={(e) => handleInputChange('validUntil', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="template">Quote Template</Label>
                  <Select value={quoteData.template} onValueChange={(value: "standard" | "detailed" | "modern") => handleInputChange('template', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sub-Projects Details */}
          {subProjects && subProjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Sub-Projects Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subProjects.map((subProject) => (
                  <div key={subProject.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{subProject.name}</h4>
                      <Badge variant="outline">{subProject.panelType}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-1" />
                        <span>{subProject.boardRating}</span>
                      </div>
                      <div>
                        <span>IP Rating: {subProject.ipRating}</span>
                      </div>
                      <div>
                        <span>Quantity: {subProject.quantity}</span>
                      </div>
                      <div>
                        <span>ID: {subProject.id}</span>
                      </div>
                    </div>
                    {subProject.description && (
                      <p className="text-sm">{subProject.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or special instructions..."
                  value={quoteData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={quoteData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Pricing & BOM Summary */}
        <div className="space-y-6">
          {/* Pricing & Margins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Pricing & Margins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="materialMargin">Material Margin (%)</Label>
                  <Input
                    id="materialMargin"
                    type="number"
                    value={quoteData.materialMarginPercent}
                    onChange={(e) => handleInputChange('materialMarginPercent', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="laborMargin">Labor Margin (%)</Label>
                  <Input
                    id="laborMargin"
                    type="number"
                    value={quoteData.laborMarginPercent}
                    onChange={(e) => handleInputChange('laborMarginPercent', Number(e.target.value))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Material Cost:</span>
                  <span className="font-medium">${materialCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Labor Cost:</span>
                  <span className="font-medium">${laborCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Margin:</span>
                  <span className="font-medium text-green-600">+${quoteData.totalMargin.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Final Price:</span>
                  <span className="text-primary">${quoteData.finalPrice.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BOM Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                BOM Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="font-medium">{bomItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Material Items:</span>
                  <span className="font-medium">{bomItems.filter(item => item.category !== 'labor').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Labor Items:</span>
                  <span className="font-medium">{bomItems.filter(item => item.category === 'labor').length}</span>
                </div>
                <Separator />
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {bomItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="truncate flex-1 mr-2">{item.description}</span>
                      <span className="font-medium">${item.totalCost.toLocaleString()}</span>
                    </div>
                  ))}
                  {bomItems.length > 5 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{bomItems.length - 5} more items
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleSaveQuote} className="w-full" variant="outline">
              Save Quote
            </Button>
            
            <QuotePDFGenerator
              quoteData={quoteData}
              onGenerate={handleGeneratePDF}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
