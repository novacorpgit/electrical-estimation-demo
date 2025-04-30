
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
