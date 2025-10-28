# Component Contract: SearchBar Extension

**Feature**: Table Filter Bar Extension  
**Component**: `src/components/filters/SearchBar.tsx`  
**Created**: 2025-10-28

## Overview

This contract defines the expected behavior of the `SearchBar` component after extending it to support multi-attribute filtering with updated placeholder text and maximum length constraint.

## Component Interface

### Props (Extended)

```typescript
export interface SearchBarProps {
  /** Current search value */
  value: string;
  
  /** Callback when search value changes (after debounce) */
  onChange: (value: string) => void;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** ARIA label for accessibility */
  ariaLabel?: string;
  
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  
  /** Maximum input length (NEW: will be set to 100) */
  maxLength?: number;
  
  /** Results count for ARIA live region */
  resultsCount?: number;
}
```

**Changes**:
- `maxLength` prop: Will be explicitly set to `100` by parent component
- `placeholder` default: Updated via i18next translation key
- **No breaking changes**: All existing props remain compatible

---

## Behavioral Contract

### Placeholder Text

**Before**:
```
"Search terpenes by name, aroma, or effects..."
```

**After**:
```
"Filter terpenes by name, effect, aroma, taste, therapeutic properties..."
```

**Implementation**:
- Update translation key in `src/i18n/locales/en/translation.json`
- Update translation key in `src/i18n/locales/de/translation.json`
- Component code uses `t('search.placeholder')` - no code change needed

### Maximum Length Enforcement

**Requirement**: Input limited to 100 characters

**Implementation**:
- Native HTML `maxLength` attribute on `<input>`
- Enforced at browser level (no custom validation needed)
- User cannot type beyond 100 characters
- Paste operations auto-truncated by browser

**User Experience**:
- No visible error message (silent truncation)
- Character counter **not** required (not in spec)

### Debounce Behavior (No Changes)

- Default: 300ms delay
- User types → local state updates immediately → onChange fires after debounce
- Clear button bypasses debounce (immediate)

### Minimum Length Handling (No UI Changes)

**Note**: 2-character minimum is enforced at **service level** (`filterService.ts`), not component level.

**Component Behavior**:
- Component allows typing 1 character
- `onChange` fires after debounce (even for 1 character)
- Parent receives query, passes to filter service
- Filter service ignores queries < 2 characters
- User sees all results (not an error state)

**Rationale**: Separation of concerns - UI component handles input, business logic handles validation.

---

## Accessibility Contract

### ARIA Labels (Updated)

**Before**:
```typescript
ariaLabel: "Search for terpenes"
```

**After**:
```typescript
ariaLabel: "Filter terpenes by multiple attributes"
```

**Implementation**: Update `search.ariaLabel` translation key

### ARIA Live Region (No Changes)

- Results count announced to screen readers
- `role="status"` with `aria-live="polite"`
- Visually hidden (off-screen positioning)

### Keyboard Navigation (No Changes)

| Key | Behavior |
|-----|----------|
| Tab | Focus input |
| Enter | Submit (no action in current implementation) |
| Escape | Clear input (if clear button visible) |
| Backspace/Delete | Remove characters |

---

## Visual Design

### Material UI Styling (No Changes)

- `variant="outlined"` - outlined TextField
- `borderRadius: 2` (8px) - rounded corners
- `borderColor: 'secondary.main'` on focus - orange accent
- `fullWidth` - responsive width

### Icons (No Changes)

- Start adornment: `<SearchIcon />` (magnifying glass)
- End adornment: `<ClearIcon />` (X button) when input not empty

---

## Testing Contract

### Unit Tests (Extended)

**Test File**: `tests/unit/components/SearchBar.test.tsx`

**Existing Tests (Must Pass)**:
- ✅ Renders search input field
- ✅ Displays placeholder text
- ✅ Handles text input
- ✅ Debounces onChange calls (300ms)
- ✅ Shows clear button when value present
- ✅ Clears input on clear button click
- ✅ Sanitizes input (XSS prevention)

**New Tests Required**:
- 🆕 Enforces 100-character maximum via maxLength prop
- 🆕 Truncates pasted text over 100 characters
- 🆕 Displays updated placeholder text (multi-attribute)
- 🆕 Displays updated ARIA label (multi-attribute)

**TDD Workflow**:
1. **RED**: Write failing tests for maxLength
2. **GREEN**: Add `maxLength={100}` in parent component usage
3. **REFACTOR**: Verify no regressions in existing tests

---

## Integration Points

### Parent Component Usage

**Current**:
```typescript
<SearchBar
  value={searchQuery}
  onChange={handleSearchChange}
/>
```

**Updated** (add maxLength):
```typescript
<SearchBar
  value={searchQuery}
  onChange={handleSearchChange}
  maxLength={100}
/>
```

### Data Flow

```
User types in SearchBar
  ↓
  Local state updates (immediate)
  ↓
  Debounce timer (300ms)
  ↓
  sanitizeSearchQuery() called
  ↓
  onChange(sanitizedValue) fired
  ↓
  Parent updates FilterState.searchQuery
  ↓
  Filter service processes query
  ↓
  Results update
```

---

## Localization Contract

### Translation Keys

#### English (`en/translation.json`)

```json
{
  "search": {
    "placeholder": "Filter terpenes by name, effect, aroma, taste, therapeutic properties...",
    "ariaLabel": "Filter terpenes by multiple attributes",
    "clear": "Clear filter",
    "oneResult": "1 result found",
    "resultsCount": "{{count}} results found"
  }
}
```

#### German (`de/translation.json`)

```json
{
  "search": {
    "placeholder": "Terpene nach Name, Effekt, Aroma, Geschmack, therapeutischen Eigenschaften filtern...",
    "ariaLabel": "Terpene nach mehreren Attributen filtern",
    "clear": "Filter löschen",
    "oneResult": "1 Ergebnis gefunden",
    "resultsCount": "{{count}} Ergebnisse gefunden"
  }
}
```

**Changes**:
- `placeholder`: Updated to list all searchable attributes
- `ariaLabel`: Updated to reflect multi-attribute capability
- Other keys: Unchanged

---

## Performance Contract

### Rendering Performance

| Metric | Target | Notes |
|--------|--------|-------|
| Initial render | <50ms | Material UI TextField |
| Re-render on input | <16ms | 60 FPS target |
| Debounce execution | 300ms | Configurable |

### Memory Footprint

- No additional memory overhead
- Debounce timer: 1 reference (cleanup on unmount)
- Local state: 1 string value

---

## Error Handling

### Input Validation

| Scenario | Behavior |
|----------|----------|
| Empty input | Shows placeholder, fires onChange with "" |
| 1 character | Accepts input, fires onChange (service ignores) |
| 100 characters | Accepts input (at limit) |
| 101 characters | Browser blocks input (native maxLength) |
| Paste >100 chars | Browser truncates to 100 |
| Special characters | Sanitized by `sanitizeSearchQuery()` |
| XSS attempt | Sanitized before onChange fires |

### Edge Cases

- Component unmounts with pending debounce → timer cleared (no memory leak)
- Rapid typing → only last value after 300ms quiet period emitted
- Clear button clicked during debounce → pending timer cleared, empty string emitted immediately

---

## Backward Compatibility

### API Stability

- **No breaking changes** to component props
- **No removal** of existing props
- **No modification** of existing behavior
- **Additive only**: maxLength prop usage, placeholder text update

### Existing Usage Preserved

All existing `<SearchBar />` usages continue to work without modification. Only the parent component in `Home.tsx` needs to add the `maxLength` prop.

---

## Change Summary

| Aspect | Change Type | Details |
|--------|-------------|---------|
| Component code | Minimal | No logic changes (maxLength prop already exists) |
| Placeholder text | Updated | Via i18next translation keys |
| ARIA label | Updated | Via i18next translation keys |
| maxLength prop | Utilized | Set to 100 in parent component |
| Debounce | Unchanged | Remains 300ms |
| Sanitization | Unchanged | Existing `sanitizeSearchQuery()` |
| Tests | Extended | 4 new test cases |

**Complexity Impact**: Minimal. Configuration change + translation updates only.

