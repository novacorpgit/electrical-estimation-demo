
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BomItem, defaultCategories } from "./BomTypes";
import { v4 as uuidv4 } from 'uuid';

interface BomItemFormProps {
  onAddItem: (item: BomItem) => void;
  onCancel: () => void;
  editItem?: BomItem;
}

export const BomItemForm: React.FC<BomItemFormProps> = ({ 
  onAddItem, 
  onCancel, 
  editItem 
}) => {
  const [item, setItem] = useState<BomItem>(
    editItem || {
      id: uuidv4(),
      description: "",
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      category: defaultCategories[0].id,
      partNumber: "",
      supplier: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newItem = { ...item, [name]: value };
    
    // Recalculate total cost when quantity or unit cost changes
    if (name === "quantity" || name === "unitCost") {
      const quantity = name === "quantity" ? parseFloat(value) || 0 : item.quantity;
      const unitCost = name === "unitCost" ? parseFloat(value) || 0 : item.unitCost;
      newItem.totalCost = quantity * unitCost;
    }
    
    setItem(newItem);
  };

  const handleCategoryChange = (value: string) => {
    setItem({ ...item, category: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem(item);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={item.description}
            onChange={handleChange}
            required
            placeholder="Item description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={item.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {defaultCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="partNumber">Part Number (Optional)</Label>
          <Input
            id="partNumber"
            name="partNumber"
            value={item.partNumber || ""}
            onChange={handleChange}
            placeholder="Part number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier (Optional)</Label>
          <Input
            id="supplier"
            name="supplier"
            value={item.supplier || ""}
            onChange={handleChange}
            placeholder="Supplier name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            step="1"
            value={item.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitCost">Unit Cost</Label>
          <Input
            id="unitCost"
            name="unitCost"
            type="number"
            min="0"
            step="0.01"
            value={item.unitCost}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <Label>Total Cost</Label>
        <div className="text-xl font-bold">
          {item.totalCost.toLocaleString('en-AU', { 
            style: 'currency', 
            currency: 'AUD' 
          })}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background p-4 border-t">
        <Button variant="outline" onClick={onCancel} type="button" size="lg">
          Cancel
        </Button>
        <Button type="submit" size="lg">
          {editItem ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
};
