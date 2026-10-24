import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ---------------------------------------------------------------------
// JEST 101 - read this one first, it's the smallest test in the project.
//
//   describe('name', () => { ... })   groups related tests together
//   it('does something', () => { ... })   ONE test (a sentence that should be true)
//   expect(actual).toBe(expected)     the check - if it's wrong, the test fails
//   beforeEach(() => { ... })         runs before every test in the group,
//                                     so each test starts from a clean slate
//
// Test.createTestingModule is NestJS's helper for building a tiny version of
// your app that contains only the pieces this test needs.
// ---------------------------------------------------------------------
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
