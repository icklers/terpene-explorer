# Data Service Contract

**Feature**: 002-terpene-data-model
**Date**: 2025-10-25
**Type**: Internal Service Interface (TypeScript)

## Overview

This contract defines the interface for the terpene data service layer. Since this is a static frontend application, there is no REST/GraphQL API. Instead, this document specifies the TypeScript service interface that components will use to access terpene data.

## Service Interface

### Module: `services/terpeneData.ts`

#### Function: `loadTerpeneDatabase()`

**Description**: Loads and validates the terpene database from static JSON file.

**Signature**:
```typescript
function loadTerpeneDatabase(): Promise<Terpene[]>
```

**Parameters**: None

**Returns**: `Promise<Terpene[]>`
- Resolves to array of validated `Terpene` objects
- Rejects with `Error` if load or validation fails

**Behavior**:
1. Dynamically imports `data/terpene-database.json`
2. Validates entire database structure using `TerpeneDatabaseSchema`
3. Extracts and returns `entries` array
4. Throws descriptive error if validation fails

**Error Conditions**:
- File not found: `Error('Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues')`
- Invalid schema: `Error('Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues')` with Zod error details logged to console
- Network error (unlikely for static file): `Error('Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues')`

**Note**: All error messages are identical to provide consistent user guidance (per clarification session 2025-10-25)

**Example Usage**:
```typescript
try {
  const terpenes = await loadTerpeneDatabase();
  console.log(`Loaded ${terpenes.length} terpenes`);
} catch (error) {
  console.error('Database load failed:', error);
  // Show error UI
}
```

**Performance**:
- Expected execution time: <50ms (JSON parsing + validation)
- Caching: Not implemented (load once per app lifecycle)

---

#### Function: `getTerpeneById()`

**Description**: Retrieves a single terpene by its ID.

**Signature**:
```typescript
function getTerpeneById(terpenes: Terpene[], id: string): Terpene | undefined
```

**Parameters**:
- `terpenes: Terpene[]` - Array of terpenes (from `loadTerpeneDatabase()`)
- `id: string` - Terpene ID (e.g., "terp-001")

**Returns**: `Terpene | undefined`
- `Terpene` object if found
- `undefined` if not found

**Behavior**:
1. Searches `terpenes` array for matching `id`
2. Returns first match (IDs are unique per validation)
3. Returns `undefined` if no match

**Example Usage**:
```typescript
const terpene = getTerpeneById(terpenes, 'terp-001');
if (terpene) {
  console.log(`Found: ${terpene.name}`);
}
```

**Performance**:
- O(n) linear search (acceptable for <500 items)
- Expected execution time: <1ms

---

#### Function: `searchTerpenes()`

**Description**: Filters terpenes based on search query (name, aroma, effects, therapeuticProperties).

**Signature**:
```typescript
function searchTerpenes(
  terpenes: Terpene[],
  query: string,
  options?: SearchOptions
): Terpene[]
```

**Parameters**:
- `terpenes: Terpene[]` - Array of terpenes to search
- `query: string` - Search query (case-insensitive)
- `options?: SearchOptions` - Optional search configuration
  - `fields?: ('name' | 'aroma' | 'effects' | 'therapeuticProperties')[]` - Fields to search (default: all)
  - `caseSensitive?: boolean` - Case-sensitive search (default: false)

**Returns**: `Terpene[]`
- Filtered array of terpenes matching query
- Empty array if no matches
- Original array if query is empty

**Behavior**:
1. Sanitizes query using existing `sanitizeSearchQuery()` utility
2. Converts to lowercase if case-insensitive (default)
3. Searches specified fields for partial matches
4. Returns all matches (no ranking/scoring)

**Example Usage**:
```typescript
const results = searchTerpenes(terpenes, 'citrus');
// Returns all terpenes with "citrus" in name, aroma, effects, or therapeuticProperties

const nameOnly = searchTerpenes(terpenes, 'myrcene', { fields: ['name'] });
// Returns terpenes with "myrcene" in name only
```

**Performance**:
- Expected execution time: <50ms for 500 terpenes
- Debouncing handled by SearchBar component (300ms)

---

#### Function: `filterByCategory()`

**Description**: Filters terpenes by category tier.

**Signature**:
```typescript
function filterByCategory(
  terpenes: Terpene[],
  category: 'Core' | 'Secondary' | 'Minor'
): Terpene[]
```

**Parameters**:
- `terpenes: Terpene[]` - Array of terpenes to filter
- `category: 'Core' | 'Secondary' | 'Minor'` - Category to filter by

**Returns**: `Terpene[]`
- Filtered array of terpenes in specified category
- Empty array if no matches

**Example Usage**:
```typescript
const coreTerpenes = filterByCategory(terpenes, 'Core');
console.log(`${coreTerpenes.length} core terpenes`);
```

**Performance**:
- O(n) linear filter
- Expected execution time: <5ms

---

#### Function: `sortTerpenes()`

**Description**: Sorts terpenes by specified field and direction.

**Signature**:
```typescript
function sortTerpenes(
  terpenes: Terpene[],
  sortBy: 'name' | 'category' | 'aroma',
  direction: 'asc' | 'desc'
): Terpene[]
```

**Parameters**:
- `terpenes: Terpene[]` - Array of terpenes to sort
- `sortBy: 'name' | 'category' | 'aroma'` - Field to sort by
- `direction: 'asc' | 'desc'` - Sort direction

**Returns**: `Terpene[]`
- New sorted array (does not mutate original)

**Behavior**:
1. Creates shallow copy of array
2. Sorts using `localeCompare` for string fields
3. Returns sorted copy

**Example Usage**:
```typescript
const sorted = sortTerpenes(terpenes, 'name', 'asc');
```

**Performance**:
- O(n log n) sort
- Expected execution time: <10ms for 500 items

## React Hook Interface

### Module: `hooks/useTerpeneData.ts`

#### Hook: `useTerpeneData()`

**Description**: Custom React hook for loading and managing terpene data.

**Signature**:
```typescript
function useTerpeneData(): UseTerpeneDataResult
```

**Returns**: `UseTerpeneDataResult`
```typescript
interface UseTerpeneDataResult {
  terpenes: Terpene[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}
```

**Fields**:
- `terpenes: Terpene[]` - Loaded terpenes (empty array while loading)
- `loading: boolean` - True during initial load
- `error: Error | null` - Error if load failed, null otherwise
- `reload: () => Promise<void>` - Function to reload data

**Behavior**:
1. Loads data on mount using `loadTerpeneDatabase()`
2. Sets `loading: true` during load
3. Sets `terpenes` and `loading: false` on success
4. Sets `error` and `loading: false` on failure
5. Provides `reload()` function to retry

**Example Usage**:
```typescript
function TerpeneTable() {
  const { terpenes, loading, error, reload } = useTerpeneData();

  if (loading) return <CircularProgress />;
  if (error) return <ErrorBoundary error={error} onRetry={reload} />;

  return <Table data={terpenes} />;
}
```

## Component Props Contracts

### Component: `TerpeneDetailModal`

**Props Interface**:
```typescript
interface TerpeneDetailModalProps {
  open: boolean;
  terpene: Terpene | null;
  onClose: () => void;
}
```

**Prop Specifications**:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | boolean | Yes | - | Controls modal visibility |
| `terpene` | Terpene \| null | Yes | - | Terpene to display (null when closed) |
| `onClose` | () => void | Yes | - | Callback when user closes modal |

**Behavior**:
- Modal renders when `open === true`
- If `terpene === null`, modal shows loading state or closes
- Calls `onClose()` when backdrop clicked, ESC pressed, or close button clicked
- **When `terpene` prop changes while modal is open, content updates in place** (no close/reopen animation per clarification 2025-10-25)
- Modal remains mounted as single instance for smooth transitions

**Example Usage**:
```typescript
<TerpeneDetailModal
  open={isOpen}
  terpene={selectedTerpene}
  onClose={() => setIsOpen(false)}
/>
```

---

### Component: `TerpeneTable`

**Props Interface**:
```typescript
interface TerpeneTableProps {
  terpenes: Terpene[];
  onTerpeneClick: (terpene: Terpene) => void;
  searchQuery?: string;
}
```

**Prop Specifications**:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `terpenes` | Terpene[] | Yes | - | Array of terpenes to display |
| `onTerpeneClick` | (terpene: Terpene) => void | Yes | - | Callback when row is clicked |
| `searchQuery` | string | No | '' | Current search query (for highlighting) |

**Behavior**:
- Renders table with columns: Name, Aroma, Effects (Sources column removed)
- Calls `onTerpeneClick(terpene)` when row clicked
- Supports sorting by clicking column headers
- Shows empty state if `terpenes.length === 0`

**Example Usage**:
```typescript
<TerpeneTable
  terpenes={filteredTerpenes}
  onTerpeneClick={(t) => openDetailModal(t)}
  searchQuery={searchTerm}
/>
```

## Type Exports

All types are exported from `types/terpene.ts`:

```typescript
// Generated from Zod schemas (auto-inferred)
export type Terpene = z.infer<typeof TerpeneSchema>;
export type MolecularData = z.infer<typeof MolecularDataSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type ResearchTier = z.infer<typeof ResearchTierSchema>;
export type TerpeneDatabase = z.infer<typeof TerpeneDatabaseSchema>;

// UI-specific types
export interface TerpeneDetailModalProps {
  open: boolean;
  terpene: Terpene | null;
  onClose: () => void;
}

export interface TerpeneTableProps {
  terpenes: Terpene[];
  onTerpeneClick: (terpene: Terpene) => void;
  searchQuery?: string;
}

export interface SearchOptions {
  fields?: ('name' | 'aroma' | 'effects' | 'therapeuticProperties')[];
  caseSensitive?: boolean;
}

export interface UseTerpeneDataResult {
  terpenes: Terpene[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}
```

## Error Handling Contract

### Error Types

All errors thrown by data services should be instances of `Error` with the standardized message (per clarification 2025-10-25):

1. **Load Error**: `Error('Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues')`
   - Cause: File not found, network error, or import failure
   - User Action: Show error boundary with message containing GitHub link

2. **Validation Error**: `Error('Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues')`
   - Cause: JSON schema doesn't match Zod schema
   - User Action: Show error message with GitHub link, log details to console for debugging

3. **Search Error**: Should not throw - returns empty array on invalid input

### Error Response Format

Errors should be caught at component level and displayed to user with GitHub link:

```typescript
// services/terpeneData.ts
throw new Error('Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues');

// Console logging for developers
console.error('Detailed Zod validation error:', zodError.errors);
```

**Error Display Component**:
```typescript
<Alert severity="error">
  Data format error. Please open an issue on{' '}
  <Link href="https://github.com/icklers/terpene-explorer/issues" target="_blank" rel="noopener">
    GitHub
  </Link>
</Alert>
```

## Testing Contract

### Unit Tests Required

1. `loadTerpeneDatabase()`:
   - ✅ Successfully loads valid JSON
   - ✅ Throws error for invalid schema
   - ✅ Throws error for missing file

2. `searchTerpenes()`:
   - ✅ Returns matches for valid query
   - ✅ Returns empty array for no matches
   - ✅ Returns all terpenes for empty query
   - ✅ Case-insensitive by default
   - ✅ Respects field filters

3. `useTerpeneData()`:
   - ✅ Sets loading state during load
   - ✅ Sets terpenes on success
   - ✅ Sets error on failure
   - ✅ Reload function works

### Integration Tests Required

1. Table → Detail Modal flow:
   - ✅ Clicking row opens modal
   - ✅ Modal displays correct terpene
   - ✅ Closing modal works

## Performance Contract

All data operations must meet these performance targets:

| Operation | Target | Measured At |
|-----------|--------|-------------|
| Load database | <50ms | `loadTerpeneDatabase()` |
| Search | <50ms | `searchTerpenes()` (500 items) |
| Filter | <5ms | `filterByCategory()` |
| Sort | <10ms | `sortTerpenes()` |
| Render detail modal | <300ms | First paint after click |

## Summary

This contract defines 5 service functions, 1 React hook, 2 component prop interfaces, and 8 TypeScript types. All interfaces are type-safe with Zod validation at the data boundary. Error handling is consistent across all functions with user-friendly messages and detailed console logging.
