import { LowStockService } from './lowStockEvent.service';

function makeFakes() {
  const tx = { query: jest.fn(), run: jest.fn() };
  const db = { query: jest.fn() };
  return { tx, db };
}

describe('LowStockService', () => {
  let fakes: ReturnType<typeof makeFakes>;
  let service: LowStockService;

  beforeEach(() => {
    fakes = makeFakes();
    service = new LowStockService(fakes.db as any);
  });

  ///////////////////////////////////////////////////////////
  // syncForPart replaced the old MySQL trigger, so these tests are the
  // "spec" for that business rule: three situations, three outcomes.
  describe('syncForPart', () => {
    it('does nothing when stock is above the minimum', async () => {
      const result = await service.syncForPart(fakes.tx, 7, 10, 4);

      expect(result).toBeNull();
      expect(fakes.tx.query).not.toHaveBeenCalled();
      expect(fakes.tx.run).not.toHaveBeenCalled();
    });

    it('does nothing when stock is exactly at the minimum (only BELOW counts)', async () => {
      const result = await service.syncForPart(fakes.tx, 7, 4, 4);

      expect(result).toBeNull();
      expect(fakes.tx.run).not.toHaveBeenCalled();
    });

    it('creates a new event when stock is below the minimum and none is open', async () => {
      fakes.tx.query.mockResolvedValue([]); // no open event
      fakes.tx.run.mockResolvedValue({ insertId: 99 });

      const result = await service.syncForPart(fakes.tx, 7, 2, 4);

      expect(result).toBe(99);
      expect(fakes.tx.run).toHaveBeenCalledTimes(1);
      expect(fakes.tx.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO lowStockEvents'),
        [7, 2, 4],
      );
    });

    it('updates the existing open event instead of creating a duplicate', async () => {
      fakes.tx.query.mockResolvedValue([{ id: 55 }]);

      const result = await service.syncForPart(fakes.tx, 7, 1, 4);

      expect(result).toBe(55);
      expect(fakes.tx.run).toHaveBeenCalledTimes(1);
      expect(fakes.tx.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE lowStockEvents'),
        [1, 4, 55],
      );
    });

    it('only looks at open events (ordered = 0) for this part', async () => {
      fakes.tx.query.mockResolvedValue([]);
      fakes.tx.run.mockResolvedValue({ insertId: 1 });

      await service.syncForPart(fakes.tx, 7, 0, 4);

      expect(fakes.tx.query).toHaveBeenCalledWith(
        expect.stringContaining('ordered = 0'),
        [7],
      );
    });
  });

  ///////////////////////////////////////////////////////////
  describe('getLowStockPartTableData', () => {
    const tableRow = {
      lowStockId: 1,
      stockLevel: 2,
      minStockLevel: 4,
      quantity: 1,
      urgency: 1,
      requestedBy: 'system',
      sent: 0,
      partId: 7,
      isNewPart: 0,
      name: 'LM317T',
      description: 'Voltage regulator',
      comment: null,
      averagePrice: '0.5000',
      partURL: null,
    };

    it('returns the rows and pagination info', async () => {
      fakes.db.query
        .mockResolvedValueOnce([tableRow])
        .mockResolvedValueOnce([{ total: 16 }]);

      const result = await service.getLowStockPartTableData(1, 15);

      expect(result.data).toEqual([tableRow]);
      expect(result.pagination).toEqual({ page: 1, limit: 15, total: 16, totalPages: 2 });
    });

    it('calculates the OFFSET from page and limit', async () => {
      fakes.db.query.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);

      await service.getLowStockPartTableData(4, 5);

      expect(fakes.db.query.mock.calls[0][1]).toEqual([5, 15]);
    });

    it('hides finished requests but keeps new-part requests (LEFT JOIN)', async () => {
      fakes.db.query.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);

      await service.getLowStockPartTableData();

      const [sql] = fakes.db.query.mock.calls[0];
      expect(sql).toContain('WHERE lsp.ordered = 0');
      expect(sql).toContain('LEFT JOIN parts');
    });
  });

  ///////////////////////////////////////////////////////////
  describe('getLowStockPartById', () => {
    it('returns null when no event has that id', async () => {
      fakes.db.query.mockResolvedValue([]);

      await expect(service.getLowStockPartById(404)).resolves.toBeNull();
    });
  });
});
