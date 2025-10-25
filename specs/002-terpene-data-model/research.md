# Research: Enhanced Terpene Data Model with Detailed Info Display

**Feature**: 002-terpene-data-model
**Date**: 2025-10-25
**Phase**: 0 (Outline & Research)

## Overview

This document consolidates research findings for implementing the enhanced terpene data model feature. All technical decisions and patterns are documented here to inform Phase 1 design.

## Research Areas

### 1. Data Model Schema Validation

**Decision**: Use Zod for runtime schema validation of `terpene-database.json`

**Rationale**:
- Zod is already a project dependency (3.24+)
- Provides TypeScript-first schema declaration with automatic type inference
- Runtime validation ensures data integrity when loading JSON files
- Better error messages than manual JSON validation
- Type-safe with zero additional build step

**Alternatives Considered**:
- **JSON Schema + AJV**: More verbose, requires separate schema file, not TypeScript-native
- **Manual validation**: Error-prone, no type safety, harder to maintain
- **io-ts**: Similar to Zod but less ergonomic API and smaller ecosystem

**Implementation Approach**:
```typescript
// Define schema that mirrors terpene-database.json structure
const TerpeneSchema = z.object({
  id: z.string(),
  name: z.string(),
  isomerOf: z.string().nullable(),
  isomerType: z.enum(['Optical', 'Positional', 'Structural']).nullable(),
  category: z.enum(['Core', 'Secondary', 'Minor']),
  // ... additional fields
});

// Type inference for free
type Terpene = z.infer<typeof TerpeneSchema>;
```

### 2. Detail View UI Component Pattern

**Decision**: Use Material UI Dialog component (controlled) with in-place content updates

**Rationale**:
- Dialog provides accessible modal behavior (ARIA, focus management, ESC key)
- Material UI Dialog is WCAG 2.1 AA compliant out of the box
- Responsive design handles mobile/tablet/desktop automatically
- Built-in backdrop click-to-close and keyboard navigation
- Consistent with existing Material UI usage in the project
- **Controlled component pattern enables in-place content updates** (clarification: rapid clicks update content without close/reopen)

**Alternatives Considered**:
- **MUI Drawer**: Better for side panels but less suitable for centered detail view
- **MUI Popover**: No backdrop, less suitable for comprehensive detail display
- **Custom modal component**: Violates DRY principle and constitution (reuse existing components)
- **Uncontrolled modal**: Would require close/reopen on row clicks, slower UX

**Implementation Approach**:
- `TerpeneDetailModal.tsx` wraps MUI Dialog as **controlled component**
- Custom content sections for each field (effects, taste, description, etc.)
- Use MUI Typography, Chip, Divider for consistent styling
- Props: `open: boolean`, `onClose: () => void`, `terpene: Terpene | null`
- **Key**: `terpene` prop updates trigger content re-render without modal close/reopen
- Modal remains open while `terpene` changes (smooth transition for rapid clicks)

### 3. Table Row Click Handling

**Decision**: Add `onClick` handler to TableRow with cursor pointer styling

**Rationale**:
- Simple, familiar pattern for users (clickable rows)
- Material UI TableRow supports onClick natively
- Hover state provides visual feedback (existing hover styles)
- Accessible via keyboard (Enter/Space on focused row)

**Alternatives Considered**:
- **Action button column**: Takes extra space, violates "streamlined table" goal
- **Double-click**: Less discoverable, not standard pattern
- **Context menu**: More complex, not intuitive for primary action

**Implementation Approach**:
```typescript
<TableRow
  hover
  onClick={() => handleRowClick(terpene)}
  sx={{ cursor: 'pointer' }}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRowClick(terpene);
    }
  }}
>
```

### 4. Search Bar Header Integration

**Decision**: Refactor SearchBar into Header component with responsive layout

**Rationale**:
- Header is persistent across all views (always accessible)
- Material UI AppBar/Toolbar provides responsive container
- Search remains functional exactly as before (same debounce, sanitization)
- Follows common web app pattern (search in header)

**Alternatives Considered**:
- **Sticky search bar above table**: Requires custom sticky positioning, less clean
- **Floating search button**: Mobile-first but less discoverable on desktop
- **Separate search page**: Violates single-page app simplicity

**Implementation Approach**:
- Move `<SearchBar />` from table area to `<Header />`
- Lift search state to parent container if needed
- Use Material UI Grid/Stack for responsive layout (desktop: right-aligned, mobile: full-width)

### 5. Data Loading Strategy

**Decision**: Load `terpene-database.json` via dynamic import with specific error messaging

**Rationale**:
- Dynamic import enables code splitting (JSON loaded only when needed)
- Vite handles JSON imports natively with tree-shaking
- Error boundary can catch load failures and show user-friendly message with actionable guidance
- Validation happens after load but before rendering
- **Specific error message guides users to GitHub** (clarification: provide actionable next step)

**Alternatives Considered**:
- **Fetch API**: Adds unnecessary network call for static file
- **Static import**: Always loaded in bundle even if not needed
- **Webpack require**: Not compatible with Vite

**Implementation Approach**:
```typescript
// services/terpeneData.ts
export async function loadTerpeneDatabase() {
  try {
    const data = await import('../data/terpene-database.json');
    const validated = TerpeneDatabaseSchema.parse(data.terpene_database_schema);
    return validated.entries;
  } catch (error) {
    console.error('Failed to load terpene database:', error);
    // Specific error message per clarification
    throw new Error('Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues');
  }
}
```

### 6. Internationalization for Detail Fields

**Decision**: Add translation keys for all 7 detail view field labels

**Rationale**:
- Consistent with existing i18next setup
- Field labels must be translated (effects, taste, description, etc.)
- Data content (terpene names, descriptions) remains in English (scientific content)
- Easy to extend to additional languages later

**Implementation Approach**:
```json
// src/i18n/locales/en/terpene-details.json
{
  "fields": {
    "effects": "Effects",
    "taste": "Taste",
    "description": "Description",
    "therapeuticProperties": "Therapeutic Properties",
    "notableDifferences": "Notable Differences",
    "boilingPoint": "Boiling Point",
    "sources": "Natural Sources"
  }
}
```

### 7. Performance Optimization for Detail View

**Decision**: Memoize modal content and use React.lazy for code splitting

**Rationale**:
- Modal content doesn't change unless `terpene` prop changes (React.memo)
- Lazy loading reduces initial bundle size
- Suspense boundary shows loading state while modal code loads

**Implementation Approach**:
```typescript
const TerpeneDetailModal = React.lazy(() => import('./TerpeneDetailModal'));

// In parent component
<Suspense fallback={<CircularProgress />}>
  <TerpeneDetailModal open={isOpen} terpene={selectedTerpene} onClose={handleClose} />
</Suspense>
```

### 8. Accessibility Considerations for Detail View

**Decision**: Implement comprehensive ARIA labels and focus management

**Rationale**:
- Dialog must announce when opened (MUI Dialog handles this)
- Focus must trap inside modal while open (MUI Dialog handles this)
- Close button must be clearly labeled for screen readers
- Content sections need semantic HTML headings (h2, h3)

**Implementation Approach**:
- Use `aria-labelledby` pointing to terpene name heading
- Use `aria-describedby` pointing to description section
- Ensure all interactive elements (close button) have accessible labels
- Use semantic HTML: `<section>`, `<h2>`, `<ul>` for structured content

## Summary of Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| Schema Validation | Zod | Type safety + runtime validation |
| Detail View UI | MUI Dialog | Accessibility + consistency |
| Table Interaction | Row onClick | Simplicity + familiarity |
| Search Placement | Header integration | Accessibility + UX patterns |
| Data Loading | Dynamic import | Code splitting + validation |
| i18n | Add field labels only | Practicality (scientific content in English) |
| Performance | React.memo + lazy | Reduced bundle size |
| Accessibility | ARIA + focus mgmt | WCAG 2.1 AA compliance |

## Open Questions

None - all technical decisions resolved through research.

## References

- [Material UI Dialog Documentation](https://mui.com/material-ui/react-dialog/)
- [Zod Documentation](https://zod.dev/)
- [React Lazy Loading](https://react.dev/reference/react/lazy)
- [WCAG 2.1 Dialog Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
