import 'reflect-metadata';
import { PartController } from '../parts/parts.controller';
import { LowStockController } from '../lowStockEvent/lowStockEvent.controller';
import { DigikeyController } from '../digikey/digikey.controller';
import { AuthGuard } from './auth.guard';

// The backend README says: "Make sure authentication is required to access
// data". This test enforces that rule. If you add a new controller and forget
// @UseGuards(AuthGuard), add it to this list and the test will tell you.
//
// (@UseGuards stores the guard on the class under the key '__guards__';
// we read it back with Reflect.getMetadata.)
describe('data controllers require a login', () => {
  it.each([
    ['PartController', PartController],
    ['LowStockController', LowStockController],
    ['DigikeyController', DigikeyController],
  ])('%s is protected by AuthGuard', (_name, controller) => {
    const guards: unknown[] = Reflect.getMetadata('__guards__', controller) ?? [];

    expect(guards).toContain(AuthGuard);
  });
});
