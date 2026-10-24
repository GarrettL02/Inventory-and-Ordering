import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PartService } from './parts.service';

// Services hold the real business logic, so they get the most tests.
// The database is replaced with fakes: we decide what each query "returns"
// and then check what the service did with it.
function makeFakes() {
  // adjustStock() runs inside db.transaction(callback). Our fake transaction
  // simply calls the callback with a fake `tx` - no real database involved.
  const tx = { query: jest.fn(), run: jest.fn() };
  const db = {
    query: jest.fn(),
    transaction: jest.fn((work: (tx: unknown) => Promise<unknown>) => work(tx)),
  };
  const lowStockService = { syncForPart: jest.fn() };

  return { tx, db, lowStockService };
}

const partListRow = {
  id: 1,
  name: 'LM317T',
  description: 'Voltage regulator',
  comment: null,
  averagePrice: '0.5000', // MySQL DECIMAL columns come back as strings
  storageLocation: 'Drawer 3',
  stockLevel: 12,
};

describe('PartService', () => {
  let fakes: ReturnType<typeof makeFakes>;
  let service: PartService;

  beforeEach(() => {
    fakes = makeFakes();
    service = new PartService(fakes.db as any, fakes.lowStockService as any);
  });

  ///////////////////////////////////////////////////////////
  describe('getAllParts', () => {
    // First db.query call = the rows, second = the COUNT(*)
    function mockRowsAndTotal(rows: unknown[], total: number) {
      fakes.db.query.mockResolvedValueOnce(rows).mockResolvedValueOnce([{ total }]);
    }

    it('returns the rows with pagination info', async () => {
      mockRowsAndTotal([partListRow], 31);

      const result = await service.getAllParts(1, 15);

      expect(result.data).toEqual([partListRow]);
      expect(result.pagination).toEqual({ page: 1, limit: 15, total: 31, totalPages: 3 });
    });

    it('has no WHERE clause when there is no search', async () => {
      mockRowsAndTotal([], 0);

      await service.getAllParts(1, 15);

      const [sql, params] = fakes.db.query.mock.calls[0];
      expect(sql).not.toContain('WHERE');
      expect(params).toEqual([15, 0]); // just LIMIT and OFFSET
    });

    it('treats a blank search like no search', async () => {
      mockRowsAndTotal([], 0);

      await service.getAllParts(1, 15, '   ');

      expect(fakes.db.query.mock.calls[0][0]).not.toContain('WHERE');
    });

    it('calculates the OFFSET from the page and limit', async () => {
      mockRowsAndTotal([], 0);

      await service.getAllParts(3, 10);

      expect(fakes.db.query.mock.calls[0][1]).toEqual([10, 20]);
    });

    it('requires every search word to match (AND) in any one of four columns', async () => {
      mockRowsAndTotal([], 0);

      await service.getAllParts(1, 15, 'resistor  10k');

      const [sql, params] = fakes.db.query.mock.calls[0];
      expect(sql.match(/LIKE \?/g)).toHaveLength(8); // 2 words x 4 columns
      expect(sql).toContain(') AND (');
      expect(params).toEqual([
        '%resistor%',
        '%resistor%',
        '%resistor%',
        '%resistor%',
        '%10k%',
        '%10k%',
        '%10k%',
        '%10k%',
        15,
        0,
      ]);
    });

    it('passes the search params to the count query too, but not LIMIT/OFFSET', async () => {
      mockRowsAndTotal([], 0);

      await service.getAllParts(1, 15, 'diode');

      const countParams = fakes.db.query.mock.calls[1][1];
      expect(countParams).toEqual(['%diode%', '%diode%', '%diode%', '%diode%']);
    });

    it('keeps user text out of the SQL itself (SQL injection protection)', async () => {
      mockRowsAndTotal([], 0);

      await service.getAllParts(1, 15, "'; DROP TABLE parts; --");

      const [sql] = fakes.db.query.mock.calls[0];
      expect(sql).not.toContain('DROP TABLE');
    });

    it('throws if the database returns rows in an unexpected shape', async () => {
      mockRowsAndTotal([{ id: 'not-a-number' }], 1);

      await expect(service.getAllParts(1, 15)).rejects.toThrow();
    });
  });

  ///////////////////////////////////////////////////////////
  describe('getPartById', () => {
    const detailsRow = {
      id: 1,
      categoryId: null,
      storageLocationId: 2,
      name: 'LM317T',
      description: 'Voltage regulator',
      comment: null,
      stockLevel: 12,
      minStockLevel: 5,
      averagePrice: '0.5000',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      storageLocationName: 'Drawer 3',
    };

    it('returns the part when it exists', async () => {
      fakes.db.query.mockResolvedValue([detailsRow]);

      await expect(service.getPartById(1)).resolves.toEqual(detailsRow);
      expect(fakes.db.query).toHaveBeenCalledWith(expect.any(String), [1]);
    });

    it('returns null when there is no such part', async () => {
      fakes.db.query.mockResolvedValue([]);

      await expect(service.getPartById(999)).resolves.toBeNull();
    });
  });

  ///////////////////////////////////////////////////////////
  describe('adjustStock', () => {
    const part = { id: 7, stockLevel: 10, minStockLevel: 4 };

    it('updates the stock, logs the movement, and reports the low stock event', async () => {
      fakes.tx.query.mockResolvedValue([part]);
      fakes.lowStockService.syncForPart.mockResolvedValue(55);

      const result = await service.adjustStock(7, 3, { delta: -8, reason: 'used on job' });

      // 10 - 8 = 2, which is below the minimum of 4
      expect(fakes.tx.run).toHaveBeenCalledWith(
        'UPDATE parts SET stockLevel = ? WHERE id = ?',
        [2, 7],
      );
      expect(fakes.tx.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO stockMovements'),
        [7, -8, 2, 'used on job', 3],
      );
      expect(fakes.lowStockService.syncForPart).toHaveBeenCalledWith(fakes.tx, 7, 2, 4);
      expect(result).toEqual({
        partId: 7,
        stockLevel: 2,
        minStockLevel: 4,
        lowStockEventId: 55,
      });
    });

    it('returns a null lowStockEventId when stock is still fine', async () => {
      fakes.tx.query.mockResolvedValue([part]);
      fakes.lowStockService.syncForPart.mockResolvedValue(null);

      const result = await service.adjustStock(7, 3, { delta: 5, reason: 'manual' });

      expect(result.stockLevel).toBe(15);
      expect(result.lowStockEventId).toBeNull();
    });

    it('allows stock to hit exactly 0', async () => {
      fakes.tx.query.mockResolvedValue([part]);
      fakes.lowStockService.syncForPart.mockResolvedValue(1);

      const result = await service.adjustStock(7, 3, { delta: -10, reason: 'manual' });

      expect(result.stockLevel).toBe(0);
    });

    it('accepts a null user (e.g. a change not tied to a login)', async () => {
      fakes.tx.query.mockResolvedValue([part]);
      fakes.lowStockService.syncForPart.mockResolvedValue(null);

      await service.adjustStock(7, null, { delta: 1, reason: 'manual' });

      expect(fakes.tx.run).toHaveBeenCalledWith(
        expect.stringContaining('stockMovements'),
        [7, 1, 11, 'manual', null],
      );
    });

    it('throws NotFoundException for an unknown part and changes nothing', async () => {
      fakes.tx.query.mockResolvedValue([]);

      await expect(
        service.adjustStock(999, 3, { delta: 1, reason: 'manual' }),
      ).rejects.toThrow(NotFoundException);
      expect(fakes.tx.run).not.toHaveBeenCalled();
    });

    it('refuses to take stock below 0 and changes nothing', async () => {
      fakes.tx.query.mockResolvedValue([part]);

      await expect(
        service.adjustStock(7, 3, { delta: -11, reason: 'manual' }),
      ).rejects.toThrow(BadRequestException);
      expect(fakes.tx.run).not.toHaveBeenCalled();
      expect(fakes.lowStockService.syncForPart).not.toHaveBeenCalled();
    });

    it('locks the part row while it works (FOR UPDATE)', async () => {
      fakes.tx.query.mockResolvedValue([part]);
      fakes.lowStockService.syncForPart.mockResolvedValue(null);

      await service.adjustStock(7, 3, { delta: 1, reason: 'manual' });

      expect(fakes.tx.query).toHaveBeenCalledWith(
        expect.stringContaining('FOR UPDATE'),
        [7],
      );
    });
  });
});
