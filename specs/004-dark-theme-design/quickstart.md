# Quickstart: Implementing the Comfortably Dark Theme

**Feature**: 004-dark-theme-design  
**Date**: October 26, 2025  
**Target Audience**: Developers implementing the dark theme system

## Overview

This guide provides step-by-step instructions for implementing the comfortably dark theme system in the Terpene Explorer application. Follow these steps in order to ensure consistent application of the theme across all components.

## Prerequisites

- Node.js >=24.0.0
- pnpm >=10.0.0
- Familiarity with React, TypeScript, and Material-UI
- Understanding of the [data-model.md](./data-model.md) theme structure

## Implementation Checklist

### Phase 1: Update Theme Configuration

- [ ] **Step 1.1**: Update `/src/theme/darkTheme.ts` with new palette values
- [ ] **Step 1.2**: Add component styleOverrides for focus indicators
- [ ] **Step 1.3**: Verify theme exports in `/src/theme/themeConfig.ts`
- [ ] **Step 1.4**: Run type checking: `pnpm run type-check`

### Phase 2: Update Layout Components

- [ ] **Step 2.1**: Update `MainLayout.tsx` with background and padding
- [ ] **Step 2.2**: Update `Header.tsx` with sticky positioning and dark green background
- [ ] **Step 2.3**: Convert components to floating cards with proper elevation
- [ ] **Step 2.4**: Test responsive layout on mobile/desktop breakpoints

### Phase 3: Update Interactive Components

- [ ] **Step 3.1**: Update `SearchBar.tsx` with focus styles and border radius
- [ ] **Step 3.2**: Update `FilterChips.tsx` with selected/unselected states
- [ ] **Step 3.3**: Update `ToggleButtons.tsx` with active state styling
- [ ] **Step 3.4**: Update `DataTable.tsx` with header, zebra stripes, and selection

### Phase 4: Testing & Validation

- [ ] **Step 4.1**: Write unit tests for theme application
- [ ] **Step 4.2**: Write integration tests for component interactions
- [ ] **Step 4.3**: Run accessibility tests: `pnpm run test:a11y`
- [ ] **Step 4.4**: Run E2E tests: `pnpm run test:e2e`
- [ ] **Step 4.5**: Manual contrast ratio verification

## Detailed Instructions

### Step 1.1: Update Theme Palette

**File**: `/src/theme/darkTheme.ts`

Replace the existing palette configuration with the new values:

```typescript
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    
    // Background colors
    background: {
      default: '#121212',  // ← UPDATE: Main page background
      paper: '#1e1e1e',    // ← UPDATE: Card surfaces
    },
    
    // Primary colors (Green brand)
    primary: {
      main: '#4caf50',     // ← UPDATE: Bright green for active elements
      dark: '#388e3c',     // ← UPDATE: Dark green for structural branding
      contrastText: '#ffffff',
    },
    
    // Secondary colors (Orange accent)
    secondary: {
      main: '#ffb300',     // ← UPDATE: Vibrant orange for focus/selection
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    
    // Text colors
    text: {
      primary: '#ffffff',                // ← UPDATE: White primary text
      secondary: 'rgba(255, 255, 255, 0.7)',  // ← UPDATE: 70% white secondary text
    },
    
    // Action states
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',     // ← UPDATE: Hover state
      selected: 'rgba(255, 255, 255, 0.16)',  // ← UPDATE: Selected state
    },
  },
  
  // Shape configuration
  shape: {
    borderRadius: 8,  // ← VERIFY: 8px corners
  },
  
  // ... keep existing typography, spacing, etc.
});
```

**Verification**: Run `pnpm run type-check` - should have no errors.

---

### Step 1.2: Add Focus Indicator Overrides

**File**: `/src/theme/darkTheme.ts`

Add or update the `components` section in `createTheme()`:

```typescript
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        '&:focus-visible': {
          outline: '3px solid',
          outlineColor: '#ffb300',  // ← ADD: Orange focus ring
          outlineOffset: '2px',
        },
      },
    },
  },
  
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,  // ← ADD: Rounded corners
          '&.Mui-focused fieldset': {
            borderColor: '#ffb300',  // ← ADD: Orange focus border
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: '#ffb300',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
  
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: '#ffb300',  // ← ADD: Orange focus ring
          outlineOffset: '2px',
        },
      },
    },
  },
  
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: '#ffb300',  // ← ADD: Orange focus ring
          outlineOffset: '-2px',
        },
      },
    },
  },
}
```

**Verification**: Tab through the UI with keyboard - all elements should show orange focus rings.

---

### Step 2.1: Update Main Layout

**File**: `/src/components/layout/MainLayout.tsx` (or `/src/pages/Home.tsx` if layout is there)

Wrap the main content in a Box with the dark background:

```typescript
import Box from '@mui/material/Box';

export function MainLayout({ children }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',  // #121212
        minHeight: '100vh',
        p: { xs: 2, md: 4 },  // 16px mobile, 32px desktop
      }}
    >
      {children}
    </Box>
  );
}
```

**Verification**: Page background should be #121212 with appropriate padding.

---

### Step 2.2: Update Header Component

**File**: `/src/components/layout/Header.tsx`

Apply sticky positioning and dark green background:

```typescript
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'primary.dark',  // #388e3c dark green
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',  // Elevation
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 2, md: 4 },  // Align with page padding
        }}
      >
        {/* Header content */}
      </Toolbar>
    </AppBar>
  );
}
```

**Verification**: Header should have dark green background and float above content.

---

### Step 2.3: Convert Components to Floating Cards

**Pattern for all card components**:

```typescript
import Paper from '@mui/material/Paper';

export function MyCardComponent() {
  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',  // #1e1e1e
        borderRadius: 2,  // 8px
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        p: 3,   // 24px internal padding
        mb: 3,  // 24px margin bottom (spacing between cards)
      }}
    >
      {/* Component content */}
    </Paper>
  );
}
```

**Apply to**:
- Filter card component
- Table wrapper
- Any detail/info cards

**Verification**: All major UI elements should appear as elevated cards with consistent styling.

---

### Step 3.1: Update Search Bar

**File**: `/src/components/filters/SearchBar.tsx`

Add focus styling:

```typescript
import TextField from '@mui/material/TextField';

export function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search terpenes..."
      value={value}
      onChange={onChange}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,  // 8px (uses theme.shape.borderRadius)
          '&.Mui-focused fieldset': {
            borderColor: 'secondary.main',  // Orange focus border
          },
        },
      }}
    />
  );
}
```

**Verification**: Search bar should have rounded corners and orange focus border.

---

### Step 3.2: Update Filter Chips

**File**: `/src/components/filters/FilterChips.tsx`

Implement selected/unselected states:

```typescript
import Chip from '@mui/material/Chip';

export function FilterChip({ label, selected, onClick }) {
  return (
    <Chip
      label={label}
      onClick={onClick}
      sx={{
        // Unselected state
        ...(!selected && {
          bgcolor: 'background.paper',  // #1e1e1e dark
          border: '2px solid',
          borderColor: 'transparent',  // Prevents layout shift
        }),
        
        // Selected state
        ...(selected && {
          bgcolor: 'action.selected',  // rgba(255,255,255,0.16) light
          border: '2px solid',
          borderColor: 'primary.main',  // #4caf50 green border
        }),
      }}
    />
  );
}
```

**Verification**: Selected chips should have light background + green border. Unselected chips should be dark. No layout shift when toggling.

---

### Step 3.3: Update Toggle Buttons

**File**: `/src/components/common/ToggleButtons.tsx`

Apply active state styling:

```typescript
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export function ViewModeToggle({ value, onChange }) {
  return (
    <ToggleButtonGroup value={value} exclusive onChange={onChange}>
      <ToggleButton
        value="sunburst"
        sx={{
          '&.Mui-selected': {
            bgcolor: 'primary.main',       // #4caf50 bright green
            color: 'primary.contrastText', // #ffffff white
            '&:hover': {
              bgcolor: 'primary.main',  // Keep same color on hover
            },
          },
        }}
      >
        Sunburst
      </ToggleButton>
      
      <ToggleButton
        value="table"
        sx={{
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.main',
            },
          },
        }}
      >
        Table
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
```

**Verification**: Selected toggle button should have bright green background.

---

### Step 3.4: Update Data Table

**File**: `/src/components/visualizations/DataTable.tsx`

Implement header styling, zebra stripes, and selection:

```typescript
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';

export function DataTable({ data }) {
  const [selectedTerpene, setSelectedTerpene] = useState<string | null>(null);
  
  return (
    <Paper
      sx={{
        bgcolor: '#272727',  // Slightly lighter than default paper
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                bgcolor: 'primary.dark',      // #388e3c dark green
                color: 'primary.contrastText', // #ffffff white
                fontWeight: 600,
              }}
            >
              Name
            </TableCell>
            {/* More header cells... */}
          </TableRow>
        </TableHead>
        
        {/* Table Body */}
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              selected={selectedTerpene === row.id}
              onClick={() => setSelectedTerpene(row.id)}
              sx={{
                cursor: 'pointer',
                
                // Zebra striping
                '&:nth-of-type(odd)': {
                  bgcolor: 'action.hover',  // rgba(255,255,255,0.08)
                },
                '&:nth-of-type(even)': {
                  bgcolor: 'transparent',
                },
                
                // Hover state
                '&:hover': {
                  bgcolor: 'action.selected',  // rgba(255,255,255,0.16)
                },
                
                // Selected state
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  borderLeft: '4px solid',
                  borderColor: 'secondary.main',  // #ffb300 orange
                },
                
                // Selected + hover (prevent darker color)
                '&.Mui-selected:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <TableCell>{row.name}</TableCell>
              {/* More cells... */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
```

**Verification**: 
- Table header should be dark green
- Odd rows should have subtle background (zebra stripes)
- Hovering should show lighter background
- Clicking a row should add orange left border

---

## Testing

### Step 4.1: Unit Tests

Create `/tests/unit/components/theme.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { darkTheme } from '@/theme/darkTheme';
import { passesWCAGAA } from '@/specs/004-dark-theme-design/contracts/theme-contract';

describe('Dark Theme Configuration', () => {
  it('should have correct background colors', () => {
    expect(darkTheme.palette.background.default).toBe('#121212');
    expect(darkTheme.palette.background.paper).toBe('#1e1e1e');
  });
  
  it('should have correct brand colors', () => {
    expect(darkTheme.palette.primary.main).toBe('#4caf50');
    expect(darkTheme.palette.primary.dark).toBe('#388e3c');
    expect(darkTheme.palette.secondary.main).toBe('#ffb300');
  });
  
  it('should have 8px border radius', () => {
    expect(darkTheme.shape.borderRadius).toBe(8);
  });
  
  it('should pass WCAG AA contrast requirements', () => {
    // White text on #121212 background: 15.8:1
    expect(passesWCAGAA(15.8, 'normal')).toBe(true);
    
    // White text on #388e3c background: 4.8:1
    expect(passesWCAGAA(4.8, 'normal')).toBe(true);
  });
});
```

Run: `pnpm run test:unit`

---

### Step 4.2: Integration Tests

Create `/tests/integration/theme-component-integration.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@/theme/darkTheme';
import { DataTable } from '@/components/visualizations/DataTable';

describe('Theme Integration with Components', () => {
  it('should apply dark theme to DataTable', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <DataTable data={[{ id: '1', name: 'Test' }]} />
      </ThemeProvider>
    );
    
    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
    
    // Verify theme is applied (check computed styles)
    const tableRow = screen.getByRole('row', { name: /test/i });
    const styles = window.getComputedStyle(tableRow);
    expect(styles.cursor).toBe('pointer');
  });
});
```

Run: `pnpm run test:integration`

---

### Step 4.3: Accessibility Tests

Update `/tests/e2e/accessibility.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Dark Theme Accessibility', () => {
  test('should pass axe accessibility checks', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });
  
  test('should have correct contrast ratios', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await injectAxe(page);
    
    const results = await checkA11y(page, null, {
      rules: ['color-contrast'],
    });
    
    expect(results.violations).toHaveLength(0);
  });
});
```

Run: `pnpm run test:e2e`

---

### Step 4.4: Manual Verification

Use browser DevTools to verify:

1. **Contrast Ratios**: Right-click text → Inspect → Check contrast ratio in Styles panel
2. **Focus Indicators**: Tab through UI - all elements should show orange outline
3. **Responsive Layout**: Resize browser - cards should maintain 16px/32px padding
4. **Dark Mode**: Check that theme applies correctly on page load

**Tools**:
- Chrome DevTools Color Picker (shows contrast ratio)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser accessibility tree (DevTools → Accessibility tab)

---

## Common Issues & Solutions

### Issue: Focus rings not appearing

**Solution**: Check that `:focus-visible` is supported in your browser. For older browsers, add a fallback:

```typescript
'&:focus-visible, &:focus': {
  outline: '3px solid',
  outlineColor: theme.palette.secondary.main,
}
```

---

### Issue: Layout shift when selecting chips

**Solution**: Ensure transparent border on unselected chips:

```typescript
border: '2px solid',
borderColor: 'transparent',  // Must be present
```

---

### Issue: Contrast ratio violations

**Solution**: Double-check color values match specification:
- Main background: `#121212`
- Card background: `#1e1e1e`
- Primary text: `#ffffff`
- Secondary text: `rgba(255,255,255,0.7)`

Run automated tests: `pnpm run test:a11y`

---

### Issue: Cards not floating/elevating

**Solution**: Verify box-shadow is applied:

```typescript
boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
```

Check that backdrop-filter is NOT used (limited browser support).

---

## Performance Optimization

### Avoid Re-renders

Use memoization for theme-dependent components:

```typescript
import { memo } from 'react';

export const DataTable = memo(function DataTable({ data }) {
  // ... component code
});
```

### Use CSS for Animations

Avoid JavaScript animations - use CSS transitions:

```typescript
sx={{
  transition: 'background-color 300ms ease',
  '&:hover': {
    bgcolor: 'action.selected',
  },
}}
```

---

## Validation Checklist

Before considering the implementation complete:

- [ ] All colors match specification (verify with DevTools)
- [ ] All contrast ratios >= 4.5:1 for normal text
- [ ] Focus indicators visible on all interactive elements
- [ ] No layout shift during interactions
- [ ] Zebra striping visible in tables
- [ ] Selected states clearly distinguishable
- [ ] Responsive padding works on mobile/desktop
- [ ] All automated tests pass
- [ ] Manual accessibility audit complete
- [ ] TypeScript compilation successful
- [ ] No console errors or warnings

---

## Next Steps

After completing this implementation:

1. Create pull request with all changes
2. Request code review focusing on accessibility
3. Run full test suite in CI/CD pipeline
4. Deploy to staging for user testing
5. Gather feedback on eye strain reduction
6. Document any issues in GitHub issue tracker

---

## Resources

- [Material-UI Theming Guide](https://mui.com/material-ui/customization/theming/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Feature Specification](./spec.md)
- [Data Model](./data-model.md)
- [Type Contracts](./contracts/theme-contract.ts)

---

**Questions or Issues?** Refer to the [data-model.md](./data-model.md) for entity definitions or consult the development team.
