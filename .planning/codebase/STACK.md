# Technology Stack

**Analysis Date:** 2026-01-26

## Languages

**Primary:**
- TypeScript 5.7.3 - All source code and component development in `src/`

**Secondary:**
- HTML - Template and page structure in `index.html`
- CSS - Styling for components and pages

## Runtime

**Environment:**
- Node.js (no specific version enforced in lockfile, inferred from npm ecosystem)

**Package Manager:**
- npm - Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Lit 3.2.1 - Web component framework for building custom elements (`src/components/`)
- Vite 6.0.11 - Build tool and development server, configured in `tsconfig.json`

**UI Components:**
- Web Components (custom elements) - Built with Lit
  - `cx-panel` - Main panel container (`src/components/cx-panel.ts`)
  - `cx-tree` - Tree view for AAS visualization (`src/components/cx-tree.ts`)
  - `cx-tree-item` - Individual tree node items (`src/components/cx-tree-item.ts`)
  - `cx-tabbar` - Tab navigation component (`src/components/cx-tabbar.ts`)
  - `cx-icon` - Icon display component (`src/components/cx-icon.ts`)
  - `cx-icon-button` - Clickable icon button (`src/components/cx-icon-button.ts`)
  - `cx-spinner` - Loading spinner (`src/components/cx-spinner.ts`)
  - `cx-loading-indicator` - Loading state indicator (`src/components/cx-loading-indicator.ts`)

**Third-party 3D Viewer:**
- instant3Dhub 3.10.5 (webvis) - 3D visualization library
  - Loaded via external script in `index.html`
  - SDK available at `http://cluster1-node0.threedy.io:31967/repo/webvis/webvis.js`
  - TypeScript definitions: `src/types/webvis/webvis-3.10.5.d.ts`

## Key Dependencies

**Critical:**
- `lit@^3.2.1` - Web component library, provides LitElement base class and decorators
- `lit-html@3.2.1` - HTML templating for Lit components

**Build/Development:**
- `typescript@^5.7.3` - TypeScript compiler for type checking and transpilation
- `vite@^6.0.11` - ES modules bundler with fast HMR development server
- `esbuild@0.24.2` - Bundling engine used by Vite
- `rollup@4.34.2` - Module bundler for production builds

**Transitive:**
- `@lit/reactive-element@2.0.4` - Reactivity base for Lit components
- `@lit-labs/ssr-dom-shim@1.3.0` - DOM shimming for server-side rendering
- Various esbuild platform-specific binaries for cross-platform support

## Configuration

**Environment:**
- Vite configuration: `vite.config.*` (implicit, uses TypeScript defaults)
- TypeScript configuration: `tsconfig.json`
  - Target: ES2020
  - Module: ESNext
  - Strict mode enabled
  - Experimental decorators: enabled (for `@customElement`, `@property` decorators)
- webvis Configuration: `webvis.config.json`
  - `hubURL`: http://cluster1-node0.threedy.io:31967 (points to instant3Dhub instance)

**Build:**
- TypeScript compiler followed by Vite bundler
- Entry point: `src/index.ts` (imports all components)
- HTML entry: `index.html` loads Vite-generated modules and webvis.js script

**Environment Variables:**
- `VITE_CX_DATA_URL` - Base URL/path for loading mocked Catena-X data (AAS JSON files)
  - Used in `src/components/cx-tree.ts` line 45
  - Instantiated in `Loader` class in `src/loader.ts`
  - No `.env` file present; uses build-time configuration

## Platform Requirements

**Development:**
- Node.js with npm
- Modern browser with ES2020 support
- Web Components API support

**Production:**
- Modern browser with Web Components support
- Network access to instant3Dhub instance (HTTP, not HTTPS by default)
- Access to Catena-X AAS JSON data files (via `VITE_CX_DATA_URL`)
- Access to 3D model files referenced in AAS descriptors

## Build & Dev Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # TypeScript compile + Vite production build
npm run preview   # Preview production build locally
```

---

*Stack analysis: 2026-01-26*
