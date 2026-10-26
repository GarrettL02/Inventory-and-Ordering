import { useCallback, useState } from 'react';
import { adjustPartStock } from '../../services/stockMovements/stockMovementsService';
import { AdjustStockResult } from '../../schemas/stockMovements/stockMovements.schema';

// Adds or removes stock for a part and tracks the request's loading / error state.
//
//   const { adjustStock, loading, error } = useAdjustStock();
//   const result = await adjustStock(partId, -2);  // AdjustStockResult, or null if it failed
//
// It never throws - on failure it returns null and puts the message in `error`.
export function useAdjustStock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustStock = useCallback(
    async (
      partId: number,
      delta: number,
      reason?: string,
    ): Promise<AdjustStockResult | null> => {
      setLoading(true);
      setError(null); // clear the last failure when trying again
      try {
        return await adjustPartStock(partId, delta, reason);
      } catch (err: any) {
        setError(err.message ?? 'Could not change the stock');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { adjustStock, loading, error };
}
