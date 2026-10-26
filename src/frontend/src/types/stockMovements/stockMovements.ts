export interface StockMovementsData {
  id: number;
  delta: number;
  stockLevelAfter: number;
  createdAt: Date; // ISO date string
  reason: string;
  userName: string | null;
}
