# Coding Conventions

**Analysis Date:** 2026-01-26

## Naming Patterns

**Files:**
- Component files: kebab-case with `cx-` prefix for custom elements: `cx-panel.ts`, `cx-tree-item.ts`, `cx-icon-button.ts`
- Utility/service files: camelCase: `loader.ts`, `utils.ts`, `visualizer-db.ts`
- Type definition files: `app.d.ts`, `webvis-3.10.5.d.ts` in `src/types/`

**Functions:**
- Private methods: camelCase with leading underscore: `_handleTabClick`, `_renderTree`, `_getOwnerColor`, `_loadChildItems`
- Public/exported functions: camelCase: `getManufacturerData()`, `loadAAS()`, `loadModel()`
- Event handlers: camelCase prefixed with `_handle`: `_handleTabClick = async (index: number) => {}`

**Variables:**
- Local variables: camelCase: `aasPath`, `nodeId`, `childItem`, `isLoading`
- State variables: camelCase with `@state()` decorator: `aasPath`, `root`, `isLoading`, `hasError`
- Properties: camelCase with `@property()` decorator: `aasPath`, `loader`, `data`, `depth`
- Private fields: camelCase with leading underscore: `_data`, `_counter`
- Constants: camelCase: `nodePathHandleMap`, or PascalCase for class names

**Types:**
- Namespaced types from declaration files: `App.AAS`, `App.Part`, `App.BOM`, `App.CAD`, `App.ModelData`
- Type guards are functions starting with lowercase `is`: `isAAS()`, `isPart()`, `isBOM()`, `isCAD()`, `isModelData()`

## Code Style

**Formatting:**
- No formatter configured (no .eslintrc, .prettierrc detected)
- Follow TypeScript strict mode as enforced in `tsconfig.json`
- Use semicolons at end of statements

**Linting:**
- TypeScript `strict` mode enabled in `tsconfig.json`
- `noUnusedLocals: true` - all local variables must be used
- `noUnusedParameters: true` - all function parameters must be used
- `noFallthroughCasesInSwitch: true` - switch cases must have break/return
- `noUncheckedSideEffectImports: true` - side effect imports must be explicit

## Import Organization

**Order:**
1. Lit framework imports: `import { css, html, LitElement } from "lit"`
2. Lit decorators: `import { customElement, property, state } from "lit/decorators.js"`
3. Lit directives: `import { classMap } from "lit/directives/class-map.js"`
4. Local utilities/services: `import { Loader } from "../loader"`
5. Local utilities/helpers: `import { getManufacturerData } from "../utils"`
6. Local state/db: `import { visDB } from "../visualizer-db"`

**Path Aliases:**
- No path aliases configured
- Use relative imports: `import { Loader } from "../loader"`, `import { getManufacturerData } from "../utils"`

## Error Handling

**Patterns:**
- Try/catch blocks wrap async operations and data fetching:
  ```typescript
  try {
    this.root = await this.loader.loadAAS(this.aasPath);
  } catch (error) {
    console.error(error);
    this.hasError = true;
  } finally {
    this.isLoading = false;
  }
  ```
- Error messages are descriptive and contextual: `throw new Error("Error loading AAS from ${aasPath}: ${error}")`
- Errors are wrapped with additional context information when re-throwing
- Null/undefined checks before accessing properties: `if (response === undefined)`, `if (this.loader === undefined)`
- Guard clauses for early returns in conditional rendering

## Logging

**Framework:** `console` object directly

**Patterns:**
- `console.error()` for errors: `console.error(error)` or `console.error("CatenaX ID is undefined")`
- Minimal logging - only errors are logged
- No debug/info logging observed
- Errors logged at catch points during data loading

## Comments

**When to Comment:**
- JSDoc comments for public methods and classes: `/** This component displays a panel with a tab bar and a tree view. */`
- JSDoc for class properties with decorators: `/** The path to the AAS that is currently selected. */`
- Section comments for logical groupings: `//---------- Type Guards for the Catena-X aspect models`
- `@deprecated` annotations for deprecated functions

**JSDoc/TSDoc:**
- Full JSDoc style for all public exports
- `@param` tags for function parameters
- `@returns` tags describing return values
- `@see` tags for related components: `@see cx-tree`
- File-level Apache 2.0 license headers on all source files (18 lines)

Example from `cx-tree.ts`:
```typescript
/**
 * This component displays a tree visualization of an AAS and the linked Catena-X aspect models
 * within it as `cx-tree-item` components.
 */
```

## Function Design

**Size:**
- Methods range from 5-30 lines typically
- Larger methods (100+ lines) break into private helper methods: `_renderContent()`, `_loadChildItems()`
- Private render methods are named `_render<Type>()`: `_renderAAS()`, `_renderPart()`, `_renderBOM()`, `_renderCAD()`, `_renderModelData()`

**Parameters:**
- Decorated properties act as component parameters via Lit's `@property` decorator
- Methods use positional parameters for simplicity: `_handleTabClick(index: number)`
- Private helpers keep parameter count minimal

**Return Values:**
- Async methods return Promises: `async update(): Promise<void>`
- Render methods return `TemplateResult | nothing` from Lit
- Type guard functions return type predicates: `data is App.AAS`
- Loaders return strongly typed data: `Promise<App.AAS>`, `Promise<T>`

## Module Design

**Exports:**
- Default exports for custom element classes: `export default class CxIcon extends LitElement`
- Named exports for utility functions: `export function isAAS(data: unknown): data is App.AAS`
- Named exports for constants: `export const visDB: Map<string, VisDBValue> = new Map()`
- Classes registered via `@customElement` decorator: `@customElement("cx-panel")`

**Barrel Files:**
- Entry point `src/index.ts` imports all custom element components to register them
- No re-exports of utilities in barrel file, only side-effect imports

---

*Convention analysis: 2026-01-26*
