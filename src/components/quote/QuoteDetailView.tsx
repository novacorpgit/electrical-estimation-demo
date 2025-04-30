
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Printer, 
  Edit,
  Save,
  ArrowUp,
  ArrowDown,
  FileText
} from "lucide-react";
import { BomItem, defaultCategories } from "./bom/BomTypes";

interface QuoteDetailViewProps {
  quote: {
    id: string;
    quoteNumber: string;
    subProjectId: string;
    subProjectName: string;
    currency: string;
    finalValue: number;
    status: string;
    createdBy: string;
    createdDate: string;
    expiryDate: string;
    bomItems: BomItem[];
    notes?: string;
  };
  onEdit: () => void;
  onBack: () => void;
}

export const QuoteDetailView: React.FC<QuoteDetailViewProps> = ({
  quote,
  onEdit,
  onBack,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalMaterialsCost = quote.bomItems
    .filter(item => item.category !== 'labor')
    .reduce((sum, item) => sum + item.totalCost, 0);

  const totalLaborCost = quote.bomItems
    .filter(item => item.category === 'labor')
    .reduce((sum, item) => sum + item.totalCost, 0);

  // Group BOM items by category
  const itemsByCategory = quote.bomItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BomItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Back to Quotes
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Quote
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Quote {quote.quoteNumber}</CardTitle>
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                quote.status
              )}`}
            >
              {quote.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Sub-Project</h3>
                <p className="text-lg">{quote.subProjectName}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Created By</h3>
                <p>{quote.createdBy}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Created Date</h3>
                <p>{quote.createdDate}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Quote Value</h3>
                <p className="text-2xl font-bold">
                  {quote.finalValue.toLocaleString('en-AU', { 
                    style: 'currency', 
                    currency: quote.currency 
                  })}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Expiry Date</h3>
                <p>{quote.expiryDate}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Currency</h3>
                <p>{quote.currency}</p>
              </div>
            </div>
          </div>

          {quote.notes && (
            <div>
              <h3 className="font-medium">Notes</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Bill of Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div>
              <p className="font-medium text-sm text-muted-foreground">Materials Total</p>
              <p className="text-lg font-medium">
                {totalMaterialsCost.toLocaleString('en-AU', { 
                  style: 'currency', 
                  currency: quote.currency 
                })}
              </p>
            </div>
            <div>
              <p className="font-medium text-sm text-muted-foreground">Labor Total</p>
              <p className="text-lg font-medium">
                {totalLaborCost.toLocaleString('en-AU', { 
                  style: 'currency', 
                  currency: quote.currency 
                })}
              </p>
            </div>
            <div>
              <p className="font-medium text-sm text-muted-foreground">Total Items</p>
              <p className="text-lg font-medium">{quote.bomItems.length}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {Object.keys(itemsByCategory).length > 0 ? (
            <div className="space-y-6">
              {defaultCategories.map(category => {
                const items = itemsByCategory[category.id];
                if (!items || items.length === 0) return null;
                
                return (
                  <div key={category.id} className="space-y-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="h-10 px-4 text-left">Description</th>
                            <th className="h-10 px-4 text-left">Part No.</th>
                            <th className="h-10 px-4 text-left">Qty</th>
                            <th className="h-10 px-4 text-right">Unit Cost</th>
                            <th className="h-10 px-4 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">{item.description}</td>
                              <td className="p-4">{item.partNumber || "-"}</td>
                              <td className="p-4">{item.quantity}</td>
                              <td className="p-4 text-right">
                                {item.unitCost.toLocaleString('en-AU', { 
                                  style: 'currency', 
                                  currency: quote.currency 
                                })}
                              </td>
                              <td className="p-4 text-right font-medium">
                                {item.totalCost.toLocaleString('en-AU', { 
                                  style: 'currency', 
                                  currency: quote.currency 
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No items in this quote's bill of materials.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
