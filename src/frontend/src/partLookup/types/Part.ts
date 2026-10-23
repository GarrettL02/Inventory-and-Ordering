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
  categoryId?: number | null;
  storageLocationId: number;
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
  createdAt?: string | null;
  partURL?: string | null;
  filename?: string | null;
  storageLocationName: string;
  manufacturerName?: string | null;
  manufacturerPartNumber?: string | null;
}
