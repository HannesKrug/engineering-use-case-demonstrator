# External Integrations

**Analysis Date:** 2026-01-26

## APIs & External Services

**instant3Dhub (webvis 3D Viewer):**
- Service - 3D model visualization and manipulation
  - SDK/Client: `webvis` JavaScript SDK loaded from external CDN
  - Entry: `http://cluster1-node0.threedy.io:31967/repo/webvis/webvis.js` (line 31 in `index.html`)
  - Configuration: `webvis.config.json` provides `hubURL` for hub instance connection
  - TypeScript types: `src/types/webvis/webvis-3.10.5.d.ts`
  - Global access via `window.webvis` object

**Catena-X Data Source (mocked JSON files):**
- Service - Asset Administration Shell (AAS) and aspect models data
  - URL base: Configured via `VITE_CX_DATA_URL` environment variable
  - Client: Native `fetch()` API in `src/loader.ts`
  - Data format: JSON files containing AAS, Part, CAD, BOM, and ModelData aspect models
  - Files loaded:
    - `AAS_P1.json`, `AAS_P2.json`, `AAS_P3.json`, `AAS_P4.json`, `AAS_P5.json` (Asset Administration Shells)
    - Submodel descriptors point to relative paths for PartTypeInformation, 3dData, SingleLevelBOM data
    - 3D model files referenced in 3dModel aspect models

## Data Storage

**Databases:**
- Not used - This is a frontend-only application without persistent backend storage

**File Storage:**
- Local filesystem only - Mocked Catena-X data served via HTTP from static files directory
  - Configured path: `VITE_CX_DATA_URL` environment variable
  - Example participants' data location: `public/` directory (inferred from common Vite patterns)

**Caching:**
- Browser default caching via HTTP headers
- In-memory caching via Lit reactive properties
- Map-based cache in `src/visualizer-db.ts` for webvis node ID tracking
  - `visDB: Map<string, VisDBValue>` - Tracks loaded 3D models

## Authentication & Identity

**Auth Provider:**
- None - No authentication required for this demo application
- Participants are selected via UI tabs in `cx-panel` component
- Access control is enforced client-side based on participant selection (Catena-X "one-up, one-down principle")

## Monitoring & Observability

**Error Tracking:**
- None - No external error tracking service

**Logs:**
- Browser console via `console.error()` in error handling paths
  - `src/components/cx-tree.ts` line 112 - AAS loading errors
  - Error messages logged include path context and error details

## CI/CD & Deployment

**Hosting:**
- Not specified - Intended to run locally or on static hosting
- No backend services defined

**CI Pipeline:**
- GitHub Actions workflows in `.github/workflows/`:
  - `eclipse-dash.yml` - Dependency license checking via Eclipse Dash
    - Triggers on `package.json` or `package-lock.json` changes
    - Scans `package-lock.json` for restricted licenses
  - `trufflehog.yml` - Secret scanning
    - Runs on push to main, PRs to main, and daily schedule
    - Scans for exposed credentials and secrets

**Build Process:**
- Vite-based build in CI (inferred from package.json scripts)
- TypeScript compilation enabled with strict type checking
- No Docker/container configuration present

## Environment Configuration

**Required env vars:**
- `VITE_CX_DATA_URL` - Base URL/path for Catena-X mocked data files
  - Example: `http://localhost:5173/data/` or `./data/`
  - Used in `src/components/cx-tree.ts` line 45
  - Must be accessible from client browser

**Secrets location:**
- No secrets required for this demo
- webvis hubURL is hardcoded in `webvis.config.json` (development instance)

## Webhooks & Callbacks

**Incoming:**
- None - Application is frontend-only

**Outgoing:**
- webvis context callbacks in `src/components/cx-panel.ts` line 75
  - `webvis.addContextCreatedListener()` - Called when webvis context is initialized
  - Used to trigger AAS loading for first participant
- webvis property change callbacks in component load/unload handlers
  - `webvis.getContext()?.setProperty()` - For coloring 3D models by participant ownership

## API Integration Patterns

**Data Loading (`src/loader.ts`):**
```typescript
// Fetch-based loading with error handling
const response = await fetch(this.joinWithBase(aasPath));
const aas = await response.json();
```

**webvis Integration (`src/components/cx-panel.ts`):**
```typescript
// Context listener registration
webvis.addContextCreatedListener(async () => {
  await this._handleTabClick(0);
});

// Model property manipulation
await webvis.getContext()?.clear();
await webvis.getContext()?.setProperty(0, webvis.Property.GHOSTED, false);
```

**3D Model Loading (`src/components/cx-tree-item.ts`):**
- Uses webvis API to load 3D models from URL
- Applies participant color coding via webvis property system
- Tracks loaded models in `visDB` Map for state management

---

*Integration audit: 2026-01-26*
