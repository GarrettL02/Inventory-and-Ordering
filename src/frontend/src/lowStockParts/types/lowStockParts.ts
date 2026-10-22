export type LowStockTableRow = {
  lowStockId: number;
  stockLevel: number;
  minStockLevel: number;
  sent: number;
  partId: number;
  name: string;
  description: string;
  comment?: string | null;
  averagePrice: string;
  partURL?: string | null;
};

export type LowStockPart = {
  id: number;
  partId: number;
  stockLevel: number;
  minStockLevel: number;
  triggeredAt: string;
  sent: number;
};
