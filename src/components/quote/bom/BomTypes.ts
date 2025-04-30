
export type BomItemCategory = 'electrical' | 'mechanical' | 'labor' | 'other';

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
