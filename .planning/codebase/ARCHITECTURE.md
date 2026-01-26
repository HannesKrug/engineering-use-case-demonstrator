# Architecture

**Analysis Date:** 2026-01-26

## Pattern Overview

**Overall:** Web Components + Lit-based modular UI architecture with layered data loading and 3D visualization integration.

**Key Characteristics:**
- Web Components as the primary UI abstraction layer
- Lit framework for reactive templating and lifecycle management
- Separation between data loading (Catena-X AAS models) and visualization (WebVis 3D engine)
- Hierarchical tree-based component composition for complex data models
- Integration with external 3D visualization library (WebVis) via global context

## Layers

**Presentation Layer:**
- Purpose: Render UI components and handle user interactions
- Location: `src/components/`
- Contains: Lit-based custom elements (cx-panel, cx-tree, cx-tree-item, cx-tabbar, cx-icon-button, cx-spinner, cx-loading-indicator)
- Depends on: Type definitions (`src/types/app.d.ts`), utilities (`src/utils.ts`), WebVis global API
- Used by: `index.html` entry point, referenced in `src/index.ts`

**Data Access Layer:**
- Purpose: Load and parse Catena-X Asset Administration Shell (AAS) data and associated models
- Location: `src/loader.ts`
- Contains: `Loader` class for fetching AAS, Part, CAD, and BOM data via HTTP
- Depends on: Fetch API, base directory configuration via environment variables
- Used by: `cx-tree` component during AAS initialization

**State Management Layer:**
- Purpose: Maintain application state mappings and transient data
- Location: `src/visualizer-db.ts`, component `@state` decorators
- Contains: Visualizer database map linking WebVis node IDs to Catena-X 3dModel aspect models, component-level reactive state
- Depends on: Type definitions (`src/types/app.d.ts`)
- Used by: `cx-panel`, `cx-tree-item`, and WebVis integration for state synchronization

**Type Definition Layer:**
- Purpose: Define TypeScript interfaces for Catena-X aspect models and application data structures
- Location: `src/types/app.d.ts`, `src/types/webvis/webvis-3.10.5.d.ts`
- Contains: Type definitions for AAS, Part, CAD, BOM, ModelData
- Depends on: None (pure type definitions)
- Used by: All components and data access code

**Utility Layer:**
- Purpose: Provide shared helper functions and type guards
- Location: `src/utils.ts`
- Contains: Manufacturer data retrieval, type guards (isAAS, isPart, isBOM, isCAD, isModelData), deprecated node path mapping
- Depends on: WebVis global API (deprecated function)
- Used by: `cx-panel`, `cx-tree-item` components

**Styling Layer:**
- Purpose: Global and component-scoped styles
- Location: `src/styles/index.css` (global), component `static styles` CSS literals
- Contains: CSS custom properties, layout rules, component-specific styles
- Depends on: None (CSS only)
- Used by: All components and HTML entry point

## Data Flow

**AAS Loading and Tree Rendering:**

1. User clicks tab in `cx-tabbar` component
2. `CxPanel._handleTabClick()` sets new AAS path, clears visualizer database, resets WebVis
3. `CxPanel` renders `cx-tree` with new `aasPath` property
4. `CxTree.update()` detects property change, sets `isLoading = true`
5. `CxTree.loader.loadAAS()` fetches AAS JSON file and submodel descriptors
6. `Loader` parses submodels (part, 3d/cad, single-level-bom), constructs `App.AAS` object
7. `CxTree` renders root `cx-tree-item` with loaded AAS data
8. User expands tree items, triggering child data loading in `CxTreeItem`
9. `CxTreeItem.update()` loads child model data via loader on expand
10. Tree updates visualizer database with node mappings for 3D highlighting

**3D Model Visualization Flow:**

1. `CxTreeItem` represents loaded 3D model data
2. On user interaction (click), component communicates with WebVis context
3. WebVis context loads 3D model file and returns node handles
4. `visDB` (visualizer database) maps Catena-X IDs to WebVis node IDs
5. Component can then manipulate WebVis properties (highlight, ghost, select) via node ID

**State Management:**

- **Component State:** Each Lit component manages its own reactive state via `@state` decorator (expanded, loading, shows3DModel flags)
- **Application State:** `visDB` Map maintains global mapping of loaded models
- **Transient State:** WebVis context maintains internal 3D viewer state outside this application

## Key Abstractions

**Web Component Pattern:**
- Purpose: Create reusable, composable UI elements with encapsulated styles and logic
- Examples: `src/components/cx-panel.ts`, `src/components/cx-tree.ts`, `src/components/cx-tree-item.ts`
- Pattern: Lit `@customElement` decorator with lifecycle methods (connectedCallback, update, render)

**Loader Class:**
- Purpose: Encapsulate AAS data fetching and parsing logic
- Examples: `src/loader.ts`
- Pattern: Class with async methods (loadAAS, loadModel) and internal path resolution

**Type Guards:**
- Purpose: Runtime type narrowing for discriminated union types in data handling
- Examples: `isAAS()`, `isPart()`, `isBOM()`, `isCAD()`, `isModelData()` in `src/utils.ts`
- Pattern: TypeScript type guard functions with `data is T` return type

**Reactive State:**
- Purpose: Automatically trigger re-renders when component state changes
- Examples: `@state() root`, `@state() isLoading`, `@state() expanded` in components
- Pattern: Lit `@state` property decorator with automatic PropertyValues change tracking

**Tree Component Hierarchy:**
- Purpose: Recursive composition of tree nodes with lazy-loaded children
- Examples: `cx-tree` contains `cx-tree-item`, `cx-tree-item` can contain child `cx-tree-item` instances
- Pattern: Parent component passes loader and owner context to children for recursive data loading

## Entry Points

**HTML Entry Point:**
- Location: `index.html`
- Triggers: Browser loads page
- Responsibilities: Define DOM structure with `cx-panel` component and `webvis-full` viewer container, load Vite module and WebVis library

**Module Entry Point:**
- Location: `src/index.ts`
- Triggers: Vite module resolution from `index.html`
- Responsibilities: Import all custom element definitions to register them in the custom element registry

**Component Initialization:**
- Location: `src/components/cx-panel.ts` (connectedCallback)
- Triggers: `cx-panel` element is inserted into DOM
- Responsibilities: Register WebVis context creation listener, initialize tab selection

## Error Handling

**Strategy:** Try-catch with error state propagation

**Patterns:**
- `Loader.loadAAS()` wraps fetch and JSON parsing in try-catch, throws descriptive errors
- `CxTree.update()` catches loader errors, sets `hasError = true` state for UI feedback
- Components render error messages when `hasError` flag is true: `<p>Error loading data.</p>`
- Deprecated `createNodePathMap()` throws explicit errors for null/undefined states

## Cross-Cutting Concerns

**Logging:** Console.error used in error handling (e.g., `CxTree.update()` logs caught errors)

**Validation:** Type guards validate data shape before use in components; Loader validates required fields (part, cad) before returning AAS

**WebVis Integration:** Global `webvis` object accessed via `webvis.getContext()`, used for viewer state manipulation and node path mapping

**Environment Configuration:** `VITE_CX_DATA_URL` environment variable provides base directory for Catena-X data files, resolved in `CxTree` loader initialization

---

*Architecture analysis: 2026-01-26*
