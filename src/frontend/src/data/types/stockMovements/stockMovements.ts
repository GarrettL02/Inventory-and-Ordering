export interface StockMovementsData {
  id: number;
  delta: number;
  stockLevelAfter: number;
  createdAt: Date; // ISO date string
  reason: string;
  userName: string | null;
}

export interface RecentStockMovementsData {
  delta: number;
  createdAt: Date; // ISO date string
  reason: string;
  userName: string | null;
  partName: string;
}
