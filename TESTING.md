# Testing

## Running tests

```
npm test               # backend: run every *.spec.ts once
npm run test:watch     # backend: re-run affected tests when you save a file
npm run test:cov       # backend: also print a coverage table (files/lines the tests touch)

cd src/frontend
npm test               # frontend: Create React App's watch mode (press "a" to run all, "q" to quit)
```

Jest is already in `devDependencies`, so `npm install` is all you need.
Run a single file with `npx jest parts.service` (matches part of the file name).

## What Jest is

Jest runs small pieces of code (tests) that call *your* code and check the result. If a check is wrong, the test fails and tells you which line and what it got instead.
Why bother: a test run takes a few seconds and re-checks everything you've ever written a test for, so changing code stops being scary.

### The four things you'll see in every test

```ts
describe('PartService', () => {            // a group of related tests
  it('refuses to go below 0', () => {      // one test: a sentence that should be true
    expect(add(1, 2)).toBe(3);             // the check: "I expect this to be that"
  });
});
```

- `describe` / `it` - just labels. They show up in the output, so write them as plain sentences.
- `expect(actual).toBe(expected)` - a "matcher". Common ones:
  - `toBe(5)` exact value (numbers, strings, `true`/`false`)
  - `toEqual({ a: 1 })` objects/arrays compared by contents
  - `toBeNull()`, `toBeUndefined()`, `toHaveLength(3)`, `toContain('x')`
  - `toThrow(SomeError)` the code should throw (wrap the call: `expect(() => fn()).toThrow()`)
  - `await expect(promise).rejects.toThrow(...)` / `.resolves.toBe(...)` for async code
  - `.not` flips any of them: `expect(x).not.toBeNull()`
- `beforeEach(() => { ... })` - runs before every test in the group so tests don't affect each other.
- Each test follows **Arrange -> Act -> Assert**: set things up, call the code, check the result.

### Mocks (the idea that makes backend tests possible)

A *unit* test checks one piece (say `PartService`). But `PartService` needs a database, and we don't want a real database in a unit test: it's slow, needs a server, and failures could be the database's fault.
So we hand it a **fake** that we control:

```ts
const db = { query: jest.fn() };                 // jest.fn() = a fake function that records its calls
db.query.mockResolvedValue([{ total: 31 }]);     // "when called, return this"
const service = new PartService(db as any, ...);

await service.getAllParts(1, 15);

expect(db.query).toHaveBeenCalledWith(expect.any(String), [15, 0]);  // how was the fake called?
```

So a service test asks: *given the database says X, does the service do Y?*
Other tools used in this repo:

- `jest.mock('./password')` - replaces a whole file with fakes.
- `jest.spyOn(global, 'fetch')` - fakes `fetch` so DigiKey tests never touch the internet.
- `jest.useFakeTimers()` + `jest.setSystemTime(...)` - you control the clock, so "token expires after 60 seconds" runs instantly.
- `it.each([...])` - runs the same test for many inputs.

### What these tests do NOT prove

Unit tests with a fake database can't catch a typo in your SQL or a wrong column name - the fake never runs it.
That's the job of the `database` CI job (builds the real schema on a real MySQL) and, later, integration tests against a real MySQL.

## Where the tests live

| Kind | Location | Example |
| --- | --- | --- |
| Backend unit tests | next to the file, `name.spec.ts` | `src/backend/parts/parts.service.spec.ts` |
| Frontend unit tests | next to the file, `name.test.ts` | `src/frontend/src/functions.test.ts` |
| Backend end-to-end | `test/*.e2e-spec.ts` (`npm run test:e2e`) | currently commented out |

When you add a new service/controller/helper, add a `.spec.ts` next to it. Two rules of thumb: test the rules (what should happen when stock goes below the minimum), and for every "it works" test add a "what if the input is bad" test.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request: backend build + tests, lint, frontend tests + build, and a MySQL job that proves `DatabaseSchema.sql` creates the database (and that running `db:migrate` twice is safe).

## Next steps (not done yet)

- Frontend component tests need `@testing-library/react`, `@testing-library/jest-dom` and `@testing-library/user-event` (`cd src/frontend && npm i -D ...`).
- End-to-end tests of the API (`test/app.e2e-spec.ts` is still the commented-out Nest template).
- A deploy workflow once the Oracle server exists.
