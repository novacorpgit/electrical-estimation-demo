
export interface BomItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  category: string;
  partNumber?: string;
  supplier?: string;
}

export interface BomCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Quote {
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
  subtotalMaterials?: number;
  subtotalLabour?: number;
  marginPercent?: number;
  marginType?: "markup" | "margin";
  additionalCosts?: number;
  discountPercent?: number;
}

// Default categories for electrical components
export const defaultCategories: BomCategory[] = [
  { id: 'breakers', name: 'Circuit Breakers' },
  { id: 'switchgear', name: 'Switchgear' },
  { id: 'enclosures', name: 'Enclosures' },
  { id: 'terminals', name: 'Terminals & Connectors' },
  { id: 'cables', name: 'Cables & Wiring' },
  { id: 'other', name: 'Other Materials' },
  { id: 'labor', name: 'Labor & Services' }
];
