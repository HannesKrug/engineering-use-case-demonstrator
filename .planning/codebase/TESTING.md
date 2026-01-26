# Testing Patterns

**Analysis Date:** 2026-01-26

## Test Framework

**Runner:**
- No test framework detected
- No testing dependencies in `package.json`
- No `jest.config.*`, `vitest.config.*`, or test configuration files

**Assertion Library:**
- Not applicable - no test framework configured

**Run Commands:**
- No test scripts defined in `package.json`
- Build command: `npm run build` (TypeScript + Vite)
- Dev command: `npm run dev` (Vite)
- No test execution available

## Test File Organization

**Location:**
- No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files found in codebase
- No test directory structure (e.g., `__tests__/`, `tests/`)

**Naming:**
- Not applicable - no tests present

**Structure:**
- Not applicable - no tests present

## Test Coverage

**Requirements:**
- None enforced
- Zero test coverage (no tests written)

**View Coverage:**
- Not available

## Testing Strategy

**Current State:**
- **No automated tests** - This is a significant concern for production code
- Only manual/browser-based testing possible through Vite dev server
- Type safety provided by TypeScript strict mode

**What Should Be Tested:**
Based on code structure, future tests should cover:

1. **Loader Tests** (`src/loader.ts`):
   - `loadAAS()` method with valid/invalid AAS paths
   - `loadModel()` method for 3D model loading
   - Error scenarios when fetch fails or JSON is malformed
   - Base directory path joining logic (`joinWithBase()`)

2. **Type Guard Tests** (`src/utils.ts`):
   - `isAAS()` with valid/invalid AAS objects
   - `isPart()` type guard validation
   - `isBOM()` detection with childItems
   - `isCAD()` detection vs BOM distinction
   - `isModelData()` validation
   - Edge cases with `null`, `undefined`, missing properties

3. **Component Integration Tests**:
   - `cx-tree.ts`: Loading AAS, error handling, state transitions
   - `cx-tree-item.ts`: Rendering different data types, tree expansion, 3D model visualization
   - `cx-panel.ts`: Tab switching, AAS loading on context creation
   - `cx-icon.ts`: Dynamic icon import behavior

4. **Utility Tests** (`src/utils.ts`):
   - `getManufacturerData()` returns correct data structure
   - Deprecated functions (if needed for legacy support)

## Code Quality Without Tests

**Compensating Mechanisms:**
- TypeScript `strict: true` enforces type safety
- `noUnusedLocals` and `noUnusedParameters` catch dead code
- Error handling via try/catch blocks in critical paths (`cx-tree.ts`, `loader.ts`)
- Manual testing through browser dev tools required

**Risk Areas:**
- Business logic in components (`cx-tree-item.ts` - 565 lines, complex rendering)
- Async operations (`_loadChildItems()`) without error recovery tests
- Type guards rely on runtime checks - no verification of correctness
- webvis integration (`_visualizeModelData()`, `_unvisualizeModelData()`) untested

## Missing Test Infrastructure

**Dependencies to Add:**
- Test runner: `vitest` or `jest` (recommend vitest for Vite integration)
- Test utilities: `lit-test-utils` or `web-test-runner` for web components
- Assertion library: built-in or `chai`/`expect`

**Configuration Files Needed:**
- `vitest.config.ts` or `jest.config.ts`
- Test setup file with web component registration

**Example Setup (Vitest):**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

## Recommended Testing Approach

**For Web Components (Lit):**
1. Use `vitest` + `jsdom` for fast testing
2. Import and register components before tests
3. Test component lifecycle (render, update, connectedCallback)
4. Use `fixture` pattern from `lit-test-utils`

**Example Pattern:**
```typescript
// src/components/cx-tree.test.ts
import { expect, it, beforeEach } from 'vitest';
import { fixture } from 'lit-test-utils';
import { CxTree } from './cx-tree';
import './cx-tree';  // Register custom element

it('should render loading indicator when isLoading is true', async () => {
  const el: CxTree = await fixture('<cx-tree></cx-tree>');
  el.isLoading = true;
  await el.updateComplete;

  expect(el.shadowRoot?.querySelector('cx-loading-indicator')).toBeTruthy();
});
```

## Mocking Requirements

**What to Mock:**
- `fetch()` calls - intercepted at Loader level or globally
- `webvis` global object - provides 3D visualization context
- File imports in `cx-icon.ts` - dynamic SVG imports

**What NOT to Mock:**
- Type guard functions - test logic directly
- Component rendering - test actual DOM output
- Lit lifecycle methods - test real behavior

**Mocking Pattern:**
```typescript
// Mock webvis global
global.webvis = {
  getContext: () => ({
    add: vi.fn(),
    setProperty: vi.fn(),
    remove: vi.fn(),
  }),
};

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve(new Response(JSON.stringify({ ... })))
);
```

---

*Testing analysis: 2026-01-26*

## Critical Note

**This codebase has zero test coverage.** Before deploying to production:
1. Add test framework (Vitest recommended)
2. Test critical paths: Loader, Type Guards, Component Rendering
3. Mock external dependencies (webvis, fetch)
4. Aim for >80% coverage on business logic
5. Add CI/CD hook to enforce tests pass before merge

See CONCERNS.md for testing coverage gaps.
