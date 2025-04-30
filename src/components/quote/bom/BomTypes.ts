
export type BomItemCategory = 
  'electrical' | 
  'mechanical' | 
  'labor' | 
  'other' | 
  'switchgear' | 
  'breakers' | 
  'circuit-breakers' | 
  'power-supplies' | 
  'enclosures' | 
  'accessories';

export interface BomCategory {
  id: BomItemCategory;
  name: string;
}

export interface BomItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  category: BomItemCategory;
  partNumber?: string;
  supplier?: string;
  inUse?: number;
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
}

// Define the default categories for BOM items
export const defaultCategories: BomCategory[] = [
  { id: 'electrical', name: 'Electrical' },
  { id: 'mechanical', name: 'Mechanical' },
  { id: 'labor', name: 'Labor' },
  { id: 'switchgear', name: 'Switchgear' },
  { id: 'breakers', name: 'Breakers' },
  { id: 'circuit-breakers', name: 'Circuit Breakers' },
  { id: 'power-supplies', name: 'Power Supplies' },
  { id: 'enclosures', name: 'Enclosures' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'other', name: 'Other' }
];
