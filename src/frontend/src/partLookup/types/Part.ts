export interface PartTableData {
  id: number;
  name: string;
  description: string;
  comment?: string | null;
  averagePrice: string;
  storageLocation?: string | null;
  stockLevel: number;
}

export interface PartDetails {
  id: number;
  category_id?: number | null;
  footprint_id?: string | null;
  name: string;
  description: string;
  comment?: string | null;
  stockLevel: number;
  minStockLevel: number;
  averagePrice: string;
  status?: string | null;
  needsReview?: number | null;
  partCondition?: string | null;
  internalPartNumber?: string | null;
  removals: number;
  lowStock: number;
  metaPart: number;
  partUnit_id: number;
  storageLocation_id: number;
  partURL?: string | null;
  filename?: string | null;
  storageLocationName: string;
  manufacturerName?: string | null;
  manufacturerPartNumber?: string | null;
}
