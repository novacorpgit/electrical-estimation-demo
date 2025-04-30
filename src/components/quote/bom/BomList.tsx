
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BomItem, BomCategory, defaultCategories } from "./BomTypes";
import { BomItemForm } from "./BomItemForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";

interface BomListProps {
  items: BomItem[];
  onItemsChange: (items: BomItem[]) => void;
  readOnly?: boolean;
}

export const BomList: React.FC<BomListProps> = ({ items, onItemsChange, readOnly = false }) => {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BomItem | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddItem = (newItem: BomItem) => {
    if (editingItem) {
      // Update existing item
      const updatedItems = items.map(item => 
        item.id === newItem.id ? newItem : item
      );
      onItemsChange(updatedItems);
    } else {
      // Add new item
      onItemsChange([...items, newItem]);
    }
    
    setShowAddItemForm(false);
    setEditingItem(undefined);
  };

  const handleEditItem = (item: BomItem) => {
    setEditingItem(item);
    setShowAddItemForm(true);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    onItemsChange(updatedItems);
  };

  // Filter items based on active tab and search term
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.partNumber && item.partNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    
    return matchesSearch && item.category === activeTab;
  });

  // Calculate totals
  const totalMaterialCost = filteredItems
    .filter(item => item.category !== 'labor')
    .reduce((sum, item) => sum + item.totalCost, 0);
  
  const totalLaborCost = filteredItems
    .filter(item => item.category === 'labor')
    .reduce((sum, item) => sum + item.totalCost, 0);
  
  const grandTotal = totalMaterialCost + totalLaborCost;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Bill of Materials</h3>
        {!readOnly && (
          <Button onClick={() => setShowAddItemForm(true)}>Add Item</Button>
        )}
      </div>

      {showAddItemForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingItem ? "Edit Item" : "Add New Item"}</CardTitle>
          </CardHeader>
          <CardContent>
            <BomItemForm 
              onAddItem={handleAddItem} 
              onCancel={() => {
                setShowAddItemForm(false);
                setEditingItem(undefined);
              }}
              editItem={editingItem}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="w-1/3">
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Items</TabsTrigger>
                {defaultCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            
              <TabsContent value={activeTab}>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left">Description</th>
                        <th className="h-10 px-4 text-left">Category</th>
                        <th className="h-10 px-4 text-left">Part #</th>
                        <th className="h-10 px-4 text-left">Supplier</th>
                        <th className="h-10 px-4 text-right">Qty</th>
                        <th className="h-10 px-4 text-right">Unit Cost</th>
                        <th className="h-10 px-4 text-right">Total</th>
                        {!readOnly && <th className="h-10 px-4 text-center">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan={readOnly ? 7 : 8} className="h-24 text-center text-muted-foreground">
                            No items found.
                          </td>
                        </tr>
                      ) : (
                        filteredItems.map((item) => {
                          const category = defaultCategories.find(c => c.id === item.category);
                          
                          return (
                            <tr key={item.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">{item.description}</td>
                              <td className="p-4">{category?.name || item.category}</td>
                              <td className="p-4">{item.partNumber || "-"}</td>
                              <td className="p-4">{item.supplier || "-"}</td>
                              <td className="p-4 text-right">{item.quantity}</td>
                              <td className="p-4 text-right">
                                {item.unitCost.toLocaleString('en-AU', { 
                                  style: 'currency', 
                                  currency: 'AUD' 
                                })}
                              </td>
                              <td className="p-4 text-right font-medium">
                                {item.totalCost.toLocaleString('en-AU', { 
                                  style: 'currency', 
                                  currency: 'AUD' 
                                })}
                              </td>
                              {!readOnly && (
                                <td className="p-4 text-center">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEditItem(item)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t bg-muted/50">
                        <td colSpan={6} className="px-4 py-2 text-right font-medium">
                          Materials Subtotal:
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          {totalMaterialCost.toLocaleString('en-AU', { 
                            style: 'currency', 
                            currency: 'AUD' 
                          })}
                        </td>
                        {!readOnly && <td></td>}
                      </tr>
                      <tr className="bg-muted/50">
                        <td colSpan={6} className="px-4 py-2 text-right font-medium">
                          Labor Subtotal:
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          {totalLaborCost.toLocaleString('en-AU', { 
                            style: 'currency', 
                            currency: 'AUD' 
                          })}
                        </td>
                        {!readOnly && <td></td>}
                      </tr>
                      <tr className="border-t bg-muted/50">
                        <td colSpan={6} className="px-4 py-2 text-right font-bold">
                          Grand Total:
                        </td>
                        <td className="px-4 py-2 text-right font-bold">
                          {grandTotal.toLocaleString('en-AU', { 
                            style: 'currency', 
                            currency: 'AUD' 
                          })}
                        </td>
                        {!readOnly && <td></td>}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
