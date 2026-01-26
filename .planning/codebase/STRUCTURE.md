# Codebase Structure

**Analysis Date:** 2026-01-26

## Directory Layout

```
engineering-use-case-demonstrator/
├── src/                            # TypeScript source code
│   ├── components/                 # Lit web components
│   ├── types/                      # TypeScript type definitions
│   ├── styles/                     # Global CSS styles
│   ├── assets/                     # Static assets (icons)
│   ├── index.ts                    # Component registration entry point
│   ├── loader.ts                   # Catena-X data loading utility
│   ├── utils.ts                    # Shared utilities and type guards
│   └── visualizer-db.ts            # State management for 3D visualization
├── public/                         # Static files served directly
├── docs/                           # Documentation
├── .github/                        # GitHub workflows and configuration
├── index.html                      # HTML entry point
├── package.json                    # Project metadata and dependencies
├── package-lock.json               # Locked dependency versions
├── tsconfig.json                   # TypeScript compiler configuration
├── webvis.config.json              # WebVis 3D viewer configuration
└── .planning/                      # GSD planning documents
```

## Directory Purposes

**src/:**
- Purpose: All TypeScript source code organized by layer and concern
- Contains: Components, types, utilities, styles, asset loaders
- Key files: `index.ts` (entry point), `loader.ts` (data access), `visualizer-db.ts` (state)

**src/components/:**
- Purpose: Lit web components for UI rendering
- Contains: Custom element class definitions registered via `@customElement` decorator
- Key files: `cx-panel.ts` (root UI component), `cx-tree.ts` (tree view), `cx-tree-item.ts` (recursive tree node)

**src/types/:**
- Purpose: TypeScript type definitions and type declarations
- Contains: App namespace module with AAS, Part, CAD, BOM, ModelData interfaces; WebVis type declarations
- Key files: `app.d.ts` (Catena-X aspect model types), `webvis/webvis-3.10.5.d.ts` (external library types)

**src/styles/:**
- Purpose: Global CSS styling
- Contains: CSS custom properties, layout rules, typography
- Key files: `index.css` (linked from index.html, defines Catena-X color scheme)

**src/assets/:**
- Purpose: Static asset files
- Contains: Icon files for UI components
- Key files: `icons/` directory with SVG or image files

**public/:**
- Purpose: Static files served directly without processing
- Contains: Files copied as-is to build output
- Key files: None critical currently

**docs/:**
- Purpose: Project documentation
- Contains: Markdown files and reference documentation
- Key files: README, guides, technical specifications

**.github/:**
- Purpose: GitHub-specific configuration
- Contains: Workflow files for CI/CD, issue templates
- Key files: Workflows in `.github/workflows/`

## Key File Locations

**Entry Points:**
- `index.html`: HTML document structure, loads styles and module script
- `src/index.ts`: Module entry point, imports all component definitions to register custom elements
- `src/components/cx-panel.ts`: Root component rendering the UI (tabbar + tree view)

**Configuration:**
- `tsconfig.json`: TypeScript compiler settings (ES2020 target, strict mode, bundler resolution)
- `webvis.config.json`: WebVis 3D viewer configuration
- `package.json`: Project metadata, dependencies (lit, typescript, vite), npm scripts

**Core Logic:**
- `src/loader.ts`: Loader class for fetching and parsing AAS JSON files
- `src/visualizer-db.ts`: Map-based state store for WebVis node ID mappings
- `src/utils.ts`: Type guards, manufacturer data, deprecated utilities

**Components (by importance):**
- `src/components/cx-panel.ts`: Layout component with tab bar and tree view (79 lines)
- `src/components/cx-tree.ts`: Tree view root component with AAS loading (119 lines)
- `src/components/cx-tree-item.ts`: Recursive tree node component, largest file (564 lines)
- `src/components/cx-tabbar.ts`: Tab selection component (97 lines)
- `src/components/cx-icon-button.ts`: Icon button with size/type variants (131 lines)
- `src/components/cx-icon.ts`: Icon display component
- `src/components/cx-spinner.ts`: Loading spinner animation
- `src/components/cx-loading-indicator.ts`: Loading state UI

**Type Definitions:**
- `src/types/app.d.ts`: Catena-X aspect model interfaces (AAS, Part, CAD, BOM, ModelData)
- `src/types/webvis/webvis-3.10.5.d.ts`: WebVis library type declarations

**Styling:**
- `src/styles/index.css`: Global CSS with color tokens and layout rules

## Naming Conventions

**Files:**
- Component files: kebab-case with `cx-` prefix (e.g., `cx-tree-item.ts`, `cx-icon-button.ts`)
- Utility files: camelCase with descriptive name (e.g., `loader.ts`, `visualizer-db.ts`)
- Type definition files: `.d.ts` extension (e.g., `app.d.ts`)
- Style files: `index.css` for global styles

**Directories:**
- Feature directories: lowercase plural (e.g., `components`, `types`, `styles`, `assets`)
- Asset subdirectories: descriptive plural (e.g., `icons`)

**Classes:**
- PascalCase (e.g., `Loader`, `CxPanel`, `CxTree`, `CxTreeItem`)

**Custom Elements:**
- kebab-case with namespace prefix (e.g., `cx-panel`, `cx-tree-item`)

**Functions:**
- camelCase (e.g., `loadAAS()`, `getManufacturerData()`, `isAAS()`)

**Properties and Variables:**
- camelCase (e.g., `aasPath`, `childItems`, `visDB`)
- Private fields: underscore prefix (e.g., `_data`, `_counter`, `_load`, `_renderTree`)

**Constants:**
- UPPERCASE_SNAKE_CASE (none currently in codebase, but would follow this pattern)

## Where to Add New Code

**New Feature (e.g., export, filtering):**
- Primary code: `src/components/` for UI, `src/loader.ts` for data access extensions
- Tests: Create alongside component file if testing framework added
- Types: Add to `src/types/app.d.ts` if new Catena-X model types needed

**New Component/Module:**
- Implementation: `src/components/cx-[feature-name].ts` for presentational components
- State/Logic: `src/[feature-name].ts` for non-presentational logic (like loader.ts pattern)
- Styling: Component-scoped `static styles` CSS in component file, or `src/styles/index.css` for global
- Types: `src/types/app.d.ts` for app-domain types, create `src/types/[feature].d.ts` for feature-specific types

**Utilities and Helpers:**
- Shared functions: `src/utils.ts` for utilities used across multiple components
- Type guards: Add to `src/utils.ts` alongside existing type guards
- Constants: Create `src/constants.ts` if multiple constants needed, or keep in `src/utils.ts`

**Assets:**
- Icons: `src/assets/icons/` directory (referenced by cx-icon component)
- Other media: `src/assets/` subdirectories by type

## Special Directories

**node_modules/:**
- Purpose: NPM package dependencies
- Generated: Yes (via npm install)
- Committed: No (in .gitignore)

**dist/:**
- Purpose: Production build output (Vite compiled bundle)
- Generated: Yes (via npm run build)
- Committed: No (in .gitignore)

**.git/:**
- Purpose: Git repository metadata
- Generated: Yes (git init or clone)
- Committed: No (never committed)

**.planning/codebase/:**
- Purpose: GSD codebase analysis documents
- Generated: Yes (via /gsd:map-codebase orchestrator command)
- Committed: Yes (tracks architecture decisions)
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md as appropriate

## File Size Distribution

Large files (>100 lines):
- `src/components/cx-tree-item.ts` (564 lines): Recursive tree node with complex event handling
- `src/components/cx-icon-button.ts` (131 lines): Icon button with multiple size/type variants
- `src/components/cx-tree.ts` (119 lines): Tree view root with AAS loading logic
- `src/components/cx-tabbar.ts` (97 lines): Tab selection with dynamic rendering

Small utilities:
- `src/visualizer-db.ts` (34 lines): Simple Map-based state store
- `src/utils.ts` (120 lines): Type guards and utility functions
- `src/loader.ts` (126 lines): AAS data loading with error handling

---

*Structure analysis: 2026-01-26*
