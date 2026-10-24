import { BadRequestException } from '@nestjs/common';
import { PartController } from './parts.controller';

// Controller tests are small: the controller should only (1) validate the
// request and (2) hand the clean values to the service. We check exactly that.
describe('PartController', () => {
  const partService = {
    getAllParts: jest.fn(),
    getPartById: jest.fn(),
    adjustStock: jest.fn(),
  };
  let controller: PartController;

  beforeEach(() => {
    jest.resetAllMocks();
    controller = new PartController(partService as any);
  });

  describe('getAllParts', () => {
    it('turns the query string into numbers and passes it to the service', async () => {
      partService.getAllParts.mockResolvedValue('result');

      const result = await controller.getAllParts({ page: '2', limit: '5', search: 'diode' });

      expect(partService.getAllParts).toHaveBeenCalledWith(2, 5, 'diode');
      expect(result).toBe('result');
    });

    it('uses the default page and limit when none are sent', async () => {
      await controller.getAllParts({});

      expect(partService.getAllParts).toHaveBeenCalledWith(1, 15, undefined);
    });

    it('answers 400 for a bad page number without calling the service', async () => {
      await expect(controller.getAllParts({ page: '0' })).rejects.toThrow(BadRequestException);
      expect(partService.getAllParts).not.toHaveBeenCalled();
    });
  });

  describe('getPartById', () => {
    it('passes the id to the service', async () => {
      partService.getPartById.mockResolvedValue({ id: 3 });

      await expect(controller.getPartById(3)).resolves.toEqual({ id: 3 });
      expect(partService.getPartById).toHaveBeenCalledWith(3);
    });
  });

  describe('adjustStock', () => {
    const user = { id: 42, username: 'garrett' };

    it('validates the body and passes the logged-in user id along', async () => {
      await controller.adjustStock(3, { delta: -2, reason: 'used on job' }, user);

      expect(partService.adjustStock).toHaveBeenCalledWith(3, 42, {
        delta: -2,
        reason: 'used on job',
      });
    });

    it('fills in the default reason', async () => {
      await controller.adjustStock(3, { delta: 1 }, user);

      expect(partService.adjustStock).toHaveBeenCalledWith(3, 42, {
        delta: 1,
        reason: 'manual',
      });
    });

    it.each([
      ['a delta of 0', { delta: 0 }],
      ['no body', undefined],
      ['a non-integer delta', { delta: 1.5 }],
    ])('answers 400 for %s without calling the service', async (_label, body) => {
      await expect(controller.adjustStock(3, body, user)).rejects.toThrow(BadRequestException);
      expect(partService.adjustStock).not.toHaveBeenCalled();
    });
  });
});
