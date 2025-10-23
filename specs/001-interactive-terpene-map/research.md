# Research: Interactive Terpene Map Technical Decisions

**Feature**: 001-interactive-terpene-map
**Date**: 2025-10-23
**Status**: Complete

## Overview

This document consolidates research findings for building an interactive terpene visualization application using React, Material UI 5, D3.js, and i18next. Each topic includes recommended approaches, rationale, and alternatives considered to support informed implementation decisions.

---

## 1. Material UI 5 Theming Best Practices

### Topic: Light/Dark Mode Theming with System Preference Detection and WCAG 2.1 Level AA Compliance

### Decision: Use Material UI 5 `colorSchemes` with `CssVarsProvider` and `useColorScheme` Hook

**Recommended Approach:**

```javascript
import { CssVarsProvider, useColorScheme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// Create theme with colorSchemes for light and dark modes
const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#1976d2' },
        background: { default: '#ffffff', paper: '#f5f5f5' },
        text: { primary: 'rgba(0, 0, 0, 0.87)' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#90caf9' },
        background: { default: '#121212', paper: '#1e1e1e' },
        text: { primary: '#ffffff' },
      },
    },
  },
  // Set contrast threshold to 4.5 for WCAG AA compliance
  palette: {
    contrastThreshold: 4.5,
  },
});

function App() {
  return (
    <CssVarsProvider theme={theme} defaultMode="system">
      <AppContent />
    </CssVarsProvider>
  );
}

// Theme toggle component
function ThemeToggle() {
  const { mode, setMode, systemMode } = useColorScheme();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton onClick={toggleTheme} aria-label="Toggle theme">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
```

**System Preference Detection:**

```javascript
// Use useColorScheme hook to access system preference
const { mode, systemMode } = useColorScheme();

// systemMode will be 'light' or 'dark' based on prefers-color-scheme media query
// mode will be the active mode (can be manually set or 'system')
```

**WCAG 2.1 Level AA Contrast Implementation:**

```javascript
const theme = createTheme({
  palette: {
    // Set contrast threshold to 4.5 for WCAG AA (4.5:1 ratio)
    contrastThreshold: 4.5,

    // Define colors with sufficient contrast
    primary: {
      main: '#1976d2', // Ensure contrast ratio >= 4.5:1 against backgrounds
    },

    // Material UI will automatically calculate contrast text colors
    // using getContrastText() based on contrastThreshold
  },
});

// For custom colors, validate contrast ratios
import { getContrastRatio } from '@mui/material/styles';

const validateContrast = (foreground, background) => {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA standard
};
```

**Server-Side Rendering (SSR) Support:**

```javascript
// Add InitColorSchemeScript to prevent flash of incorrect theme
import { InitColorSchemeScript } from '@mui/material/styles';

function MyApp() {
  return (
    <html>
      <body>
        <InitColorSchemeScript />
        <CssVarsProvider theme={theme} defaultMode="system">
          <App />
        </CssVarsProvider>
      </body>
    </html>
  );
}
```

### Rationale

1. **CSS Variables Approach**: The `CssVarsProvider` uses CSS custom properties, enabling dynamic theme switching without full re-renders, improving performance and eliminating theme flicker during SSR.

2. **Built-in System Detection**: Setting `defaultMode="system"` automatically detects user OS preference via `prefers-color-scheme` media query, providing a seamless out-of-box experience.

3. **WCAG Compliance**: The `contrastThreshold: 4.5` setting ensures all automatically generated contrast text colors meet WCAG 2.1 Level AA requirements (4.5:1 minimum ratio).

4. **Accessibility First**: Material UI's `getContrastText()` automatically calculates accessible text colors for backgrounds, reducing manual color management and accessibility testing burden.

5. **User Control**: The `useColorScheme` hook provides both automatic system detection and manual override capability, following 2025 best practices of "let the user choose."

6. **Modern API**: This approach uses Material UI 5's latest theme API, replacing the older `ThemeProvider` with `createMuiTheme` pattern.

### Alternatives Considered

#### Alternative 1: Manual Theme Switching with Context API

```javascript
// Custom theme context without CSS variables
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => createTheme({
    palette: { mode }
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
```

**Why Not Chosen:**
- Requires full component tree re-render on theme change, impacting performance
- No built-in system preference detection
- Manual implementation needed for SSR flicker prevention
- More boilerplate code to maintain
- No automatic CSS variable generation for dynamic styling

#### Alternative 2: Using `useMediaQuery` with Manual Theme Creation

```javascript
function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
      },
    }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <AppContent />
    </ThemeProvider>
  );
}
```

**Why Not Chosen:**
- Cannot override system preference without additional state management
- Creates new theme object on every preference change
- No built-in localStorage persistence
- Requires custom toggle button implementation
- More complex to handle SSR scenarios

#### Alternative 3: Third-Party Theme Management (e.g., `next-themes`)

**Why Not Chosen:**
- Adds extra dependency when Material UI provides native solution
- May conflict with Material UI's theming system
- Less integration with Material UI's component styling
- Additional learning curve for team members familiar with Material UI

### Material UI Component Recommendations

**High Contrast Components for Accessibility:**

```javascript
import {
  Button,        // Automatic contrast text with contrastThreshold
  Paper,         // Elevation creates visual hierarchy
  Alert,         // Built-in color variants with sufficient contrast
  Chip,          // Border and color variants for emphasis
  TextField,     // Outlined variant provides clear boundaries
} from '@mui/material';

// Use outlined variants for better contrast
<Button variant="outlined" color="primary">
  Action
</Button>

<TextField variant="outlined" label="Search" />
```

**Theme Testing Utilities:**

```javascript
// Validate custom colors meet WCAG standards
import { getContrastRatio } from '@mui/material/styles';

const customColor = '#1976d2';
const backgroundColor = '#ffffff';
const ratio = getContrastRatio(customColor, backgroundColor);

console.log(`Contrast ratio: ${ratio.toFixed(2)}:1`);
console.log(`WCAG AA compliant: ${ratio >= 4.5}`);
console.log(`WCAG AAA compliant: ${ratio >= 7}`);
```

### Implementation Checklist

- [ ] Configure `CssVarsProvider` with `colorSchemes` for light/dark modes
- [ ] Set `contrastThreshold: 4.5` in theme configuration
- [ ] Implement `InitColorSchemeScript` for SSR support
- [ ] Create theme toggle component using `useColorScheme` hook
- [ ] Test all color combinations with contrast ratio validator
- [ ] Verify system preference detection on different OS/browsers
- [ ] Test theme persistence across page reloads
- [ ] Validate WCAG AA compliance with automated tools (axe-core, Lighthouse)

---

## 2. D3.js Integration with React and Material UI

### Topic: D3.js Sunburst Chart Integration in React with Material UI Styling

### Decision: Use React for DOM Rendering, D3.js for Math/Layout Only (useRef + useEffect Pattern)

**Recommended Approach:**

```javascript
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Paper, useTheme } from '@mui/material';

function SunburstChart({ data, width = 600, height = 600, onSliceClick }) {
  const svgRef = useRef(null);
  const theme = useTheme(); // Access Material UI theme
  const [hoveredSlice, setHoveredSlice] = useState(null);

  useEffect(() => {
    if (!svgRef.current || !data?.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const radius = Math.min(width, height) / 2;

    // Setup SVG with responsive container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create hierarchy from flat data
    const root = d3.hierarchy({ children: data })
      .sum(d => d.value || 1)
      .sort((a, b) => b.value - a.value);

    // D3 partition layout (math/calculation only)
    const partition = d3.partition()
      .size([2 * Math.PI, radius]);

    partition(root);

    // Arc generator with padding
    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    // Use Material UI theme colors
    const colorScale = d3.scaleOrdinal()
      .domain(root.descendants().map(d => d.data.name))
      .range([
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.error.main,
      ]);

    // Create path elements
    const paths = svg.selectAll('path')
      .data(root.descendants().filter(d => d.depth))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.name))
      .attr('stroke', theme.palette.background.paper)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onSliceClick) onSliceClick(d.data);
      })
      .on('mouseenter', (event, d) => {
        setHoveredSlice(d.data);
        d3.select(event.currentTarget)
          .style('opacity', 0.8);
      })
      .on('mouseleave', (event) => {
        setHoveredSlice(null);
        d3.select(event.currentTarget)
          .style('opacity', 1);
      });

    // Add labels for larger slices
    svg.selectAll('text')
      .data(root.descendants().filter(d => d.depth && (d.x1 - d.x0) > 0.15))
      .enter()
      .append('text')
      .attr('transform', d => {
        const angle = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const radius = (d.y0 + d.y1) / 2;
        return `rotate(${angle - 90}) translate(${radius},0) rotate(${angle < 180 ? 0 : 180})`;
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', theme.palette.text.primary)
      .attr('font-size', '12px')
      .attr('pointer-events', 'none')
      .text(d => d.data.name);

  }, [data, width, height, theme, onSliceClick]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <svg
        ref={svgRef}
        role="img"
        aria-label="Sunburst chart visualization"
        style={{ display: 'block' }}
      />
      {hoveredSlice && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <strong>{hoveredSlice.name}</strong>
        </div>
      )}
    </Paper>
  );
}

export default SunburstChart;
```

**Responsive Sizing with ResizeObserver:**

```javascript
function ResponsiveSunburstChart({ data, onSliceClick }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        setDimensions({ width, height: width }); // Square aspect ratio
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: 800 }}>
      <SunburstChart
        data={data}
        width={dimensions.width}
        height={dimensions.height}
        onSliceClick={onSliceClick}
      />
    </div>
  );
}
```

**Event Handling with React State:**

```javascript
function TerpeneExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const handleSliceClick = useCallback((sliceData) => {
    setSelectedCategory(sliceData.name);
    // Filter main data view based on selection
    setFilteredData(terpenes.filter(t =>
      t.category === sliceData.name ||
      t.effects.includes(sliceData.name)
    ));
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <SunburstChart
          data={hierarchicalData}
          onSliceClick={handleSliceClick}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TerpeneList data={filteredData} />
      </Grid>
    </Grid>
  );
}
```

### Rationale

1. **Clear Separation of Concerns**: React handles DOM manipulation and component lifecycle, while D3.js handles mathematical calculations (layouts, scales, arcs). This follows the principle of using each library for its strengths.

2. **React Virtual DOM Compatibility**: By using `useRef` to access the actual DOM node and letting D3 manipulate it within `useEffect`, we avoid conflicts with React's virtual DOM reconciliation.

3. **Performance Optimization**: The dependency array in `useEffect` ensures the chart only re-renders when necessary (data, dimensions, or theme changes), preventing excessive re-calculations.

4. **Material UI Theme Integration**: Accessing the theme via `useTheme()` hook ensures chart colors automatically adapt to light/dark mode and maintain consistency with the application's design system.

5. **Accessibility**: Using semantic SVG elements with proper ARIA attributes (`role="img"`, `aria-label`) and providing keyboard event handlers ensures the chart is accessible.

6. **Responsive Design**: ResizeObserver-based responsive sizing ensures the chart adapts to container size changes without requiring manual window resize listeners.

### Alternatives Considered

#### Alternative 1: React-Only Visualization (Recharts, Victory)

```javascript
// Using Recharts instead of D3.js
import { PieChart, Pie, Cell } from 'recharts';

function SunburstAlternative({ data }) {
  return (
    <PieChart width={600} height={600}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={250}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]} />
        ))}
      </Pie>
    </PieChart>
  );
}
```

**Why Not Chosen:**
- Recharts doesn't provide native sunburst chart support (only basic pie charts)
- Less flexible for complex hierarchical visualizations
- Sunburst requires D3's partition layout algorithm
- Limited customization compared to D3.js
- The specification explicitly requires D3.js (TC-001 constraint)

#### Alternative 2: Full D3 Rendering with React Wrapper

```javascript
// Let D3 control all rendering, including event handlers
function D3OnlyChart({ data }) {
  const containerRef = useRef();

  useEffect(() => {
    const container = d3.select(containerRef.current);

    // D3 creates all elements, handles all events
    container.selectAll('button')
      .data(['Light', 'Dark'])
      .enter()
      .append('button')
      .text(d => d)
      .on('click', (event, d) => {
        // D3 manages state changes
        container.attr('data-theme', d.toLowerCase());
      });
  }, [data]);

  return <div ref={containerRef} />;
}
```

**Why Not Chosen:**
- Duplicates React's state management capabilities
- Harder to integrate with React hooks and context (theme, language)
- Cannot easily use Material UI components for legends, tooltips, or controls
- More difficult to maintain and test
- Team familiarity with React patterns makes this harder to understand

#### Alternative 3: Observable Plot or Vega-Lite

```javascript
import * as Plot from '@observablehq/plot';

function PlotChart({ data }) {
  const plotRef = useRef();

  useEffect(() => {
    const plot = Plot.plot({
      marks: [
        Plot.cell(data, {
          // Observable Plot doesn't have native sunburst support
        })
      ]
    });
    plotRef.current.appendChild(plot);
    return () => plot.remove();
  }, [data]);

  return <div ref={plotRef} />;
}
```

**Why Not Chosen:**
- Observable Plot/Vega-Lite lacks native sunburst chart support
- Would require custom mark implementation, defeating the purpose
- Less community support and examples for sunburst visualizations
- D3.js provides more granular control needed for custom interactions
- Specification explicitly requires D3.js

### Material UI Component Recommendations for D3 Integration

**Chart Container Components:**

```javascript
import { Paper, Card, CardContent, Box, Skeleton } from '@mui/material';

// Loading state
function ChartLoading() {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Skeleton variant="circular" width={600} height={600} />
    </Paper>
  );
}

// Error state
import { Alert } from '@mui/material';

function ChartError({ message }) {
  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      {message}
    </Alert>
  );
}

// Chart with Material UI controls
function ChartWithControls({ data }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Terpene Distribution</Typography>
          <IconButton aria-label="Download chart">
            <DownloadIcon />
          </IconButton>
        </Box>
        <SunburstChart data={data} />
      </CardContent>
    </Card>
  );
}
```

**Tooltip Integration:**

```javascript
import { Tooltip as MuiTooltip } from '@mui/material';

function SunburstWithTooltips({ data }) {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // In D3 event handlers
  .on('mouseenter', (event, d) => {
    setTooltipContent(d.data);
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  })

  return (
    <>
      <svg ref={svgRef} />
      {tooltipContent && (
        <Portal>
          <Paper
            sx={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              p: 1,
              pointerEvents: 'none',
              zIndex: theme.zIndex.tooltip,
            }}
          >
            <Typography variant="body2">{tooltipContent.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              Value: {tooltipContent.value}
            </Typography>
          </Paper>
        </Portal>
      )}
    </>
  );
}
```

### Implementation Checklist

- [ ] Create reusable SunburstChart component with useRef and useEffect
- [ ] Implement D3 partition layout and arc generator
- [ ] Integrate Material UI theme colors via useTheme hook
- [ ] Add click event handlers that update React state
- [ ] Implement ResizeObserver for responsive sizing
- [ ] Add ARIA attributes for accessibility (role, aria-label)
- [ ] Create loading and error states with Material UI components
- [ ] Test chart re-rendering with React.memo and useMemo optimizations
- [ ] Verify no memory leaks (cleanup in useEffect return function)
- [ ] Test keyboard navigation and focus management

---

## 3. Material UI Accessibility Patterns

### Topic: WCAG 2.1 Level AA Compliance in Material UI Applications

### Decision: Use Material UI's Built-in Accessibility Features with Keyboard Navigation and ARIA Enhancements

**Recommended Approach:**

```javascript
import {
  Button,
  TextField,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';

// Accessible form with proper labels and ARIA attributes
function AccessibleForm() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      {/* TextField with proper labeling */}
      <TextField
        id="terpene-search"
        label="Search Terpenes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={!!error}
        helperText={error || 'Search by name, aroma, or effect'}
        inputProps={{
          'aria-describedby': 'search-helper-text',
          'aria-invalid': !!error,
        }}
        fullWidth
        margin="normal"
      />

      {/* Radio group with proper grouping */}
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Filter by Effect Category</FormLabel>
        <RadioGroup
          aria-label="Effect category filter"
          name="effect-filter"
          value={selectedEffect}
          onChange={handleEffectChange}
        >
          <FormControlLabel
            value="calming"
            control={<Radio />}
            label="Calming"
          />
          <FormControlLabel
            value="energizing"
            control={<Radio />}
            label="Energizing"
          />
          <FormControlLabel
            value="all"
            control={<Radio />}
            label="All Effects"
          />
        </RadioGroup>
      </FormControl>

      {/* Button with proper labeling */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        aria-label="Search for terpenes"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
}
```

**Keyboard Navigation Implementation:**

```javascript
import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

function TerpeneList({ terpenes, onSelect }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const listRef = useRef(null);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev =>
          Math.min(prev + 1, terpenes.length - 1)
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(terpenes[focusedIndex]);
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(terpenes.length - 1);
        break;
    }
  };

  // Focus management
  useEffect(() => {
    const focusedElement = listRef.current?.children[focusedIndex];
    focusedElement?.focus();
  }, [focusedIndex]);

  return (
    <List
      ref={listRef}
      role="listbox"
      aria-label="Terpene list"
      onKeyDown={handleKeyDown}
    >
      {terpenes.map((terpene, index) => (
        <ListItemButton
          key={terpene.id}
          selected={index === focusedIndex}
          onClick={() => onSelect(terpene)}
          role="option"
          aria-selected={index === focusedIndex}
          tabIndex={index === focusedIndex ? 0 : -1}
        >
          <ListItemText
            primary={terpene.name}
            secondary={terpene.aroma}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
```

**Focus Management with Skip Links:**

```javascript
// Add skip navigation link for accessibility
function SkipLink() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 999,
        padding: '1em',
        backgroundColor: 'white',
        color: 'black',
        textDecoration: 'none',
      }}
      onFocus={(e) => {
        e.target.style.left = '0';
      }}
      onBlur={(e) => {
        e.target.style.left = '-9999px';
      }}
    >
      Skip to main content
    </a>
  );
}

function App() {
  return (
    <>
      <SkipLink />
      <AppBar position="static">
        <Toolbar>
          {/* Navigation */}
        </Toolbar>
      </AppBar>
      <main id="main-content" tabIndex={-1}>
        {/* Main content */}
      </main>
    </>
  );
}
```

**Screen Reader Announcements:**

```javascript
import { Alert, Snackbar } from '@mui/material';

function AccessibleNotifications() {
  const [notification, setNotification] = useState(null);

  // Announce results to screen readers
  const announceResults = (count) => {
    setNotification({
      message: `Found ${count} terpenes matching your search`,
      severity: 'info',
    });
  };

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={6000}
      onClose={() => setNotification(null)}
    >
      <Alert
        severity={notification?.severity}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}
```

**Live Regions for Dynamic Content:**

```javascript
function SearchResults({ results, isLoading }) {
  return (
    <div
      role="region"
      aria-live="polite"
      aria-busy={isLoading}
      aria-label="Search results"
    >
      {isLoading ? (
        <CircularProgress aria-label="Loading results" />
      ) : (
        <>
          <Typography
            variant="h6"
            component="h2"
            id="results-heading"
            tabIndex={-1}
          >
            {results.length} Results Found
          </Typography>
          <TerpeneGrid results={results} />
        </>
      )}
    </div>
  );
}
```

**Focus Trap for Modals:**

```javascript
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function AccessibleDialog({ open, onClose, terpene }) {
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    if (open && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        {terpene.name}
      </DialogTitle>
      <DialogContent id="dialog-description">
        <Typography ref={firstFocusableRef} tabIndex={-1}>
          {terpene.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aroma: {terpene.aroma}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

### Rationale

1. **Built-in Accessibility**: Material UI components have built-in ARIA attributes and keyboard support, reducing the need for custom implementations and ensuring consistency.

2. **Semantic HTML**: Material UI uses semantic HTML elements (button, nav, main, etc.) by default, which screen readers can interpret correctly.

3. **Focus Management**: Material UI's Dialog, Modal, and other overlay components automatically manage focus trapping and restoration, preventing keyboard navigation issues.

4. **Color Contrast**: With `contrastThreshold: 4.5`, Material UI automatically generates accessible text colors, ensuring WCAG AA compliance without manual testing.

5. **Keyboard Navigation Patterns**: Following ARIA Authoring Practices Guide (APG) patterns for common widgets (lists, grids, tabs) ensures consistent and expected keyboard behavior.

6. **Screen Reader Support**: Using ARIA live regions (`aria-live`, `role="status"`) ensures dynamic content changes are announced to screen reader users.

### Alternatives Considered

#### Alternative 1: Custom Accessibility Implementation

```javascript
// Manually implementing all ARIA attributes and keyboard handlers
function CustomAccessibleButton({ onClick, children }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(e);
        }
      }}
      aria-pressed={false}
    >
      {children}
    </div>
  );
}
```

**Why Not Chosen:**
- Reinvents the wheel when Material UI provides accessible components
- Higher risk of missing accessibility requirements
- More code to maintain and test
- Inconsistent with Material UI's design system
- Requires deep ARIA expertise for each component type

#### Alternative 2: Third-Party Accessibility Libraries (React ARIA, Reach UI)

```javascript
import { useButton } from '@react-aria/button';

function AriaButton(props) {
  const ref = useRef();
  const { buttonProps } = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}
```

**Why Not Chosen:**
- Creates styling conflicts with Material UI's design system
- Requires custom styling to match Material UI appearance
- Duplicates functionality already in Material UI
- Increases bundle size with redundant libraries
- More complex to maintain two component systems

#### Alternative 3: Headless UI with Custom Styling

```javascript
import { Listbox } from '@headlessui/react';

function HeadlessSelect({ options, value, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <Listbox.Button>
        {value}
      </Listbox.Button>
      <Listbox.Options>
        {options.map(option => (
          <Listbox.Option key={option} value={option}>
            {option}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}
```

**Why Not Chosen:**
- Requires custom styling for every component to match Material UI
- No automatic theme integration
- Cannot leverage Material UI's built-in theming and variants
- More development time for equivalent functionality
- Team familiarity with Material UI makes this harder to adopt

### Material UI Accessibility Component Recommendations

**High-Priority Accessible Components:**

```javascript
// Use these Material UI components for maximum accessibility
import {
  // Form controls with built-in accessibility
  TextField,        // Auto-generates labels, helper text, error messages
  Select,          // Proper combobox ARIA role and keyboard support
  Checkbox,        // Native checkbox with label association
  Radio,           // Proper radio group management
  Switch,          // Toggle with proper state announcements

  // Interactive elements
  Button,          // Proper button role and keyboard handling
  IconButton,      // Icon with aria-label requirement
  Link,            // Proper link semantics

  // Navigation
  Tabs,            // Follows ARIA tabs pattern
  Breadcrumbs,     // Proper navigation landmark

  // Feedback
  Alert,           // Live region announcements
  Snackbar,        // Non-intrusive notifications
  CircularProgress, // Loading state with aria-label

  // Layout
  AppBar,          // Header landmark
  Drawer,          // Side navigation with focus management
  Dialog,          // Modal with focus trap
} from '@mui/material';
```

**Accessibility Testing Utilities:**

```javascript
// Testing with React Testing Library and jest-axe
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';

expect.extend(toHaveNoViolations);

describe('TerpeneSearch Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<TerpeneSearch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', async () => {
    render(<TerpeneSearch />);
    const searchInput = screen.getByRole('textbox', { name: /search/i });

    // Tab to input
    await userEvent.tab();
    expect(searchInput).toHaveFocus();

    // Type search query
    await userEvent.keyboard('Limonene');
    expect(searchInput).toHaveValue('Limonene');

    // Submit with Enter
    await userEvent.keyboard('{Enter}');

    // Verify results announced
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/results found/i);
  });

  it('should have proper ARIA labels', () => {
    render(<TerpeneList terpenes={mockTerpenes} />);

    const list = screen.getByRole('listbox', { name: /terpene list/i });
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('option');
    items.forEach(item => {
      expect(item).toHaveAttribute('aria-selected');
    });
  });
});
```

### Implementation Checklist

- [ ] Use Material UI components with built-in accessibility features
- [ ] Add skip navigation link for keyboard users
- [ ] Implement keyboard navigation patterns (Arrow keys, Enter, Space, Home, End)
- [ ] Add ARIA labels to all icon buttons and visual-only elements
- [ ] Use semantic HTML landmarks (header, nav, main, footer)
- [ ] Implement focus management for modals and dialogs
- [ ] Add live regions for dynamic content announcements
- [ ] Test with keyboard-only navigation (no mouse)
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Run automated accessibility tests (axe-core, Lighthouse)
- [ ] Verify color contrast ratios meet WCAG AA (4.5:1 minimum)
- [ ] Test focus indicators are visible in all themes

---

## 4. i18next with Material UI

### Topic: Internationalization (English/German) in Material UI Applications

### Decision: Use react-i18next with Material UI Localization and Intl API for Date/Number Formatting

**Recommended Approach:**

```javascript
// i18n configuration (src/i18n/config.js)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import deTranslations from './locales/de.json';

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      de: {
        translation: deTranslations,
      },
    },
    fallbackLng: 'en',
    lng: 'en', // Default language

    interpolation: {
      escapeValue: false, // React already escapes values
      format: (value, format, lng) => {
        // Custom formatting for dates and numbers
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng).format(value);
        }
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        return value;
      },
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

**Translation Files Structure:**

```json
// src/i18n/locales/en.json
{
  "app": {
    "title": "Terpene Explorer",
    "tagline": "Discover the world of terpenes"
  },
  "search": {
    "placeholder": "Search by name, aroma, or effect...",
    "noResults": "No terpenes found matching your search",
    "resultsCount": "{{count}} terpene found",
    "resultsCount_plural": "{{count}} terpenes found"
  },
  "terpene": {
    "name": "Name",
    "aroma": "Aroma",
    "effects": "Effects",
    "sources": "Natural Sources",
    "description": "Description"
  },
  "filters": {
    "all": "All Effects",
    "calming": "Calming",
    "energizing": "Energizing",
    "filterBy": "Filter by effect category"
  },
  "theme": {
    "toggle": "Toggle theme",
    "light": "Light mode",
    "dark": "Dark mode"
  },
  "views": {
    "sunburst": "Sunburst Chart",
    "table": "Table View",
    "grid": "Grid View"
  }
}
```

```json
// src/i18n/locales/de.json
{
  "app": {
    "title": "Terpen-Explorer",
    "tagline": "Entdecken Sie die Welt der Terpene"
  },
  "search": {
    "placeholder": "Suche nach Name, Aroma oder Wirkung...",
    "noResults": "Keine Terpene gefunden, die Ihrer Suche entsprechen",
    "resultsCount": "{{count}} Terpen gefunden",
    "resultsCount_plural": "{{count}} Terpene gefunden"
  },
  "terpene": {
    "name": "Name",
    "aroma": "Aroma",
    "effects": "Wirkungen",
    "sources": "Natürliche Quellen",
    "description": "Beschreibung"
  },
  "filters": {
    "all": "Alle Wirkungen",
    "calming": "Beruhigend",
    "energizing": "Energetisierend",
    "filterBy": "Nach Wirkungskategorie filtern"
  },
  "theme": {
    "toggle": "Design wechseln",
    "light": "Heller Modus",
    "dark": "Dunkler Modus"
  },
  "views": {
    "sunburst": "Sunburst-Diagramm",
    "table": "Tabellenansicht",
    "grid": "Rasteransicht"
  }
}
```

**Material UI Integration with i18next:**

```javascript
// App.js - Integrate both Material UI theme and i18n
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssVarsProvider } from '@mui/material/styles';
import { deDE, enUS } from '@mui/material/locale';
import { useTranslation } from 'react-i18next';
import './i18n/config'; // Import i18n configuration

function App() {
  const { i18n } = useTranslation();

  // Get Material UI locale based on i18n language
  const getMuiLocale = () => {
    return i18n.language === 'de' ? deDE : enUS;
  };

  const theme = createTheme(
    {
      colorSchemes: {
        light: { /* ... */ },
        dark: { /* ... */ },
      },
    },
    getMuiLocale() // Apply Material UI translations
  );

  // Update HTML lang attribute for accessibility
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <CssVarsProvider theme={theme} defaultMode="system">
      <AppContent />
    </CssVarsProvider>
  );
}
```

**Language Switcher Component:**

```javascript
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="language-select-label">
        <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        {t('language.select')}
      </InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={i18n.language}
        onChange={handleLanguageChange}
        aria-label="Select language"
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="de">Deutsch</MenuItem>
      </Select>
    </FormControl>
  );
}
```

**Using Translations in Components:**

```javascript
import { useTranslation } from 'react-i18next';
import { TextField, Typography, Button } from '@mui/material';

function TerpeneSearch() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('app.title')}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {t('app.tagline')}
      </Typography>

      <TextField
        label={t('search.placeholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />

      {results.length === 0 ? (
        <Typography color="text.secondary">
          {t('search.noResults')}
        </Typography>
      ) : (
        <Typography>
          {t('search.resultsCount', { count: results.length })}
        </Typography>
      )}
    </Box>
  );
}
```

**Date and Number Formatting:**

```javascript
// Using Intl API with i18n locale
import { useTranslation } from 'react-i18next';

function TerpeneDetails({ terpene }) {
  const { i18n } = useTranslation();

  // Format date based on locale
  const formatDate = (date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Format number based on locale
  const formatNumber = (number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Updated: {formatDate(terpene.updatedAt)}
        </Typography>
        <Typography variant="body1">
          Concentration: {formatNumber(terpene.concentration)}%
        </Typography>
      </CardContent>
    </Card>
  );
}
```

**RTL Support (for future expansion beyond English/German):**

```javascript
import { createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl'; // Get text direction from i18n

  // Create RTL cache for Emotion
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const cacheLtr = createCache({
    key: 'muiltr',
  });

  const theme = createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
    // ... other theme options
  });

  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  return (
    <CacheProvider value={isRTL ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <AppContent />
      </ThemeProvider>
    </CacheProvider>
  );
}
```

### Rationale

1. **react-i18next Integration**: The most popular and actively maintained React i18n solution with 10M+ weekly downloads, providing hooks-based API that integrates seamlessly with React's component model.

2. **Material UI Localization**: Material UI provides built-in translations for component labels, error messages, and pagination through locale objects (deDE, enUS), ensuring consistent translation of UI components.

3. **Browser Language Detection**: `i18next-browser-languagedetector` automatically detects user language from browser settings and localStorage, providing a personalized experience without manual configuration.

4. **Intl API for Formatting**: Using native JavaScript Intl API for dates and numbers ensures accurate locale-specific formatting without additional dependencies, supporting proper date formats (DD.MM.YYYY for German vs MM/DD/YYYY for English).

5. **Pluralization Support**: i18next handles pluralization rules automatically (e.g., "1 terpene" vs "5 terpenes" in English, "1 Terpen" vs "5 Terpene" in German) without manual conditionals.

6. **Type Safety**: Translation keys can be type-checked with TypeScript using i18next's type definitions, preventing runtime errors from missing or incorrect keys.

### Alternatives Considered

#### Alternative 1: React-Intl (FormatJS)

```javascript
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl';

function App() {
  return (
    <IntlProvider locale="en" messages={messages}>
      <AppContent />
    </IntlProvider>
  );
}

function Component() {
  return (
    <FormattedMessage
      id="search.placeholder"
      defaultMessage="Search..."
    />
  );
}
```

**Why Not Chosen:**
- More verbose API compared to react-i18next (requires FormattedMessage components)
- Less flexible for dynamic translations and nested keys
- Smaller community and fewer plugins compared to i18next
- More complex setup for language detection and persistence
- No direct integration examples with Material UI's locale system

#### Alternative 2: Custom Context-Based Solution

```javascript
const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState(enTranslations);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    setTranslations(newLang === 'de' ? deTranslations : enTranslations);
  };

  const t = (key) => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

**Why Not Chosen:**
- Reinvents mature i18n features (pluralization, interpolation, nesting)
- No language detection or persistence out of the box
- Manual implementation of date/number formatting
- No nested key support (would require custom parsing)
- Missing advanced features like namespace, lazy loading, backend integration
- More code to maintain and test

#### Alternative 3: LinguiJS

```javascript
import { Trans, t } from '@lingui/macro';
import { I18nProvider } from '@lingui/react';

function Component() {
  return (
    <Trans id="search.placeholder">
      Search...
    </Trans>
  );
}
```

**Why Not Chosen:**
- Requires additional build step with babel-plugin-macros
- Compile-time extraction can be complex with dynamic keys
- Less adoption in Material UI ecosystem
- Smaller community and fewer integration examples
- More complex setup compared to react-i18next

### Material UI Localization Component Recommendations

**Components that Require Locale Configuration:**

```javascript
// Material UI components with built-in translations
import {
  DataGrid,           // Pagination, filtering, column menu labels
  DatePicker,         // Month names, day names, labels
  Pagination,         // "Previous", "Next", page labels
  Table,              // "No rows" message
  Autocomplete,       // "No options" message
} from '@mui/material';

// Example: DataGrid with German locale
import { deDE } from '@mui/x-data-grid';

<DataGrid
  localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
  rows={rows}
  columns={columns}
/>
```

**Testing Translations:**

```javascript
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

describe('TerpeneSearch Localization', () => {
  it('should display English text by default', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TerpeneSearch />
      </I18nextProvider>
    );

    expect(screen.getByText('Terpene Explorer')).toBeInTheDocument();
  });

  it('should display German text when language is changed', async () => {
    await i18n.changeLanguage('de');

    render(
      <I18nextProvider i18n={i18n}>
        <TerpeneSearch />
      </I18nextProvider>
    );

    expect(screen.getByText('Terpen-Explorer')).toBeInTheDocument();
  });

  it('should format dates according to locale', () => {
    const date = new Date('2025-10-23');

    // English format: October 23, 2025
    const enFormat = new Intl.DateTimeFormat('en').format(date);
    expect(enFormat).toBe('10/23/2025');

    // German format: 23.10.2025
    const deFormat = new Intl.DateTimeFormat('de').format(date);
    expect(deFormat).toBe('23.10.2025');
  });
});
```

### Implementation Checklist

- [ ] Install i18next, react-i18next, i18next-browser-languagedetector
- [ ] Create translation JSON files for English and German
- [ ] Configure i18n with language detection and localStorage persistence
- [ ] Integrate Material UI locale providers (enUS, deDE)
- [ ] Create LanguageSwitcher component with Select dropdown
- [ ] Update HTML lang attribute when language changes
- [ ] Use useTranslation hook in all components with user-facing text
- [ ] Implement Intl API for date and number formatting
- [ ] Add RTL support configuration (for future languages)
- [ ] Test all UI text appears in both languages
- [ ] Verify Material UI component labels are translated
- [ ] Test pluralization rules for count-based messages
- [ ] Validate translation files are complete (no missing keys)

---

## 5. Performance Optimization for Material UI

### Topic: Achieving Lighthouse Score ≥90 with Material UI Applications

### Decision: Use Code Splitting, Tree Shaking, and Lazy Loading with Material UI's Modular Imports

**Recommended Approach:**

```javascript
// vite.config.js - Optimized build configuration
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          // Remove prop-types in production
          ['babel-plugin-transform-react-remove-prop-types', { mode: 'remove' }],
        ],
      },
    }),
    visualizer({ open: true, gzipSize: true }), // Bundle analysis
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
          'd3-vendor': ['d3'],
          'i18n-vendor': ['i18next', 'react-i18next'],
        },
      },
    },
    // Enable minification
    minify: 'esbuild',
    target: 'es2020',
    // Source maps for debugging (disable in production for size)
    sourcemap: false,
  },
  // Optimize deps pre-bundling
  optimizeDeps: {
    include: [
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'd3',
    ],
  },
});
```

**Tree Shaking with Named Imports:**

```javascript
// GOOD: Named imports enable tree shaking
import { Button, TextField, Card, CardContent } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import * as d3 from 'd3'; // D3 automatically tree-shakes

function SearchBar() {
  return (
    <Card>
      <CardContent>
        <TextField
          label="Search"
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        <Button variant="contained">
          <FilterIcon />
          Filter
        </Button>
      </CardContent>
    </Card>
  );
}

// BAD: Default imports include entire library
// import Button from '@mui/material/Button';  // Less optimal for bundling
```

**Code Splitting with React.lazy and Suspense:**

```javascript
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Lazy load heavy components
const SunburstChart = lazy(() => import('./components/SunburstChart'));
const TableView = lazy(() => import('./components/TableView'));
const TerpeneGrid = lazy(() => import('./components/TerpeneGrid'));

// Loading fallback component
function LoadingFallback() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
    >
      <CircularProgress aria-label="Loading visualization" />
    </Box>
  );
}

function TerpeneViewer({ viewMode, data }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {viewMode === 'sunburst' && <SunburstChart data={data} />}
      {viewMode === 'table' && <TableView data={data} />}
      {viewMode === 'grid' && <TerpeneGrid data={data} />}
    </Suspense>
  );
}
```

**Lazy Loading Images:**

```javascript
import { Card, CardMedia, CardContent, Skeleton } from '@mui/material';
import { useState } from 'react';

function TerpeneCard({ terpene }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card>
      {!imageLoaded && (
        <Skeleton variant="rectangular" height={200} />
      )}
      <CardMedia
        component="img"
        height="200"
        image={terpene.imageUrl}
        alt={terpene.name}
        loading="lazy" // Native lazy loading
        onLoad={() => setImageLoaded(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
      <CardContent>
        <Typography variant="h6">{terpene.name}</Typography>
      </CardContent>
    </Card>
  );
}
```

**Memoization and Performance Optimization:**

```javascript
import { memo, useMemo, useCallback } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

// Memoize expensive filtering operations
function TerpeneList({ terpenes, filters }) {
  const filteredTerpenes = useMemo(() => {
    return terpenes.filter(terpene => {
      if (filters.effect && !terpene.effects.includes(filters.effect)) {
        return false;
      }
      if (filters.search && !terpene.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [terpenes, filters]);

  return (
    <List>
      {filteredTerpenes.map(terpene => (
        <TerpeneListItem key={terpene.id} terpene={terpene} />
      ))}
    </List>
  );
}

// Memoize list items to prevent unnecessary re-renders
const TerpeneListItem = memo(({ terpene }) => {
  return (
    <ListItem>
      <ListItemText
        primary={terpene.name}
        secondary={terpene.aroma}
      />
    </ListItem>
  );
});
```

**Virtual Scrolling for Large Lists:**

```javascript
import { FixedSizeList } from 'react-window';
import { ListItem, ListItemText, Paper } from '@mui/material';

function VirtualTerpeneList({ terpenes }) {
  const renderRow = ({ index, style }) => {
    const terpene = terpenes[index];

    return (
      <ListItem style={style} key={terpene.id}>
        <ListItemText
          primary={terpene.name}
          secondary={terpene.aroma}
        />
      </ListItem>
    );
  };

  return (
    <Paper>
      <FixedSizeList
        height={600}
        itemCount={terpenes.length}
        itemSize={72}
        width="100%"
      >
        {renderRow}
      </FixedSizeList>
    </Paper>
  );
}
```

**Font Loading Optimization:**

```javascript
// index.html - Preload critical fonts
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Preload critical font with font-display: swap -->
  <link
    rel="preload"
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  >

  <!-- Material Icons with font-display: swap -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
  >
</head>
```

**CSS-in-JS Optimization:**

```javascript
// Use Material UI's sx prop sparingly (creates inline styles)
// Prefer styled components for reusable styles

import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

// GOOD: Styled component (styles extracted to CSS)
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: theme.transitions.create(['box-shadow', 'transform']),
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-4px)',
  },
}));

// BAD: sx prop for every instance (creates inline styles)
function Component() {
  return (
    <Card sx={{
      p: 2,
      mb: 2,
      transition: 'all 0.3s',
      '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' }
    }} />
  );
}
```

**Data Fetching Optimization:**

```javascript
// Use SWR or React Query for efficient data fetching with caching
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(r => r.json());

function useTerpeneData() {
  const { data, error, isLoading } = useSWR('/data/terpenes.json', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
  });

  return {
    terpenes: data,
    isLoading,
    isError: error,
  };
}
```

**Service Worker for Caching:**

```javascript
// vite-plugin-pwa configuration
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
```

### Rationale

1. **Vite for Fast Builds**: Vite provides instant HMR and optimized production builds with esbuild, significantly faster than webpack-based solutions like Create React App.

2. **Manual Code Splitting**: Separating vendor code (React, Material UI, D3.js) into distinct chunks improves caching and parallel loading, reducing load times for repeat visitors.

3. **Tree Shaking**: Named imports from Material UI and D3.js enable bundlers to remove unused code, reducing bundle size by 30-50% compared to default imports.

4. **Lazy Loading**: React.lazy with Suspense defers loading of heavy visualization components until needed, improving initial page load time.

5. **Memoization**: React.memo and useMemo prevent unnecessary re-renders in large lists and complex calculations, improving runtime performance.

6. **Virtual Scrolling**: For 500+ terpenes, react-window renders only visible items, dramatically reducing DOM nodes and improving scroll performance.

7. **Font Optimization**: Preloading critical fonts and using `font-display: swap` prevents layout shifts and text rendering delays (FOIT/FOUT).

### Alternatives Considered

#### Alternative 1: Create React App (CRA) with Webpack

```javascript
// CRA configuration requires ejecting or CRACO
const CracoConfig = {
  webpack: {
    configure: (webpackConfig) => {
      // Manual webpack optimization
      return webpackConfig;
    },
  },
};
```

**Why Not Chosen:**
- Slower build times compared to Vite (3-5x slower for production builds)
- Larger bundle sizes without aggressive optimization
- Requires ejecting or CRACO for advanced configuration
- No native ESM support in development
- HMR performance degrades with project size

#### Alternative 2: Next.js with SSR

```javascript
// Next.js with Material UI SSR
export async function getServerSideProps() {
  const terpenes = await fetchTerpenes();
  return { props: { terpenes } };
}
```

**Why Not Chosen:**
- Adds complexity for static data that doesn't change frequently
- Server infrastructure required (specification states no SSR - out of scope)
- Larger deployment footprint
- Over-engineering for a client-side data visualization app
- Material UI SSR configuration adds complexity

#### Alternative 3: Preact as React Alternative

```javascript
// Using Preact instead of React for smaller bundle size
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
```

**Why Not Chosen:**
- Material UI is built for React, not Preact (compatibility issues)
- D3.js integration examples primarily use React
- Team familiarity with React ecosystem
- React 18 performance improvements (automatic batching, concurrent features)
- Minimal bundle size difference after tree shaking and compression

### Performance Monitoring and Testing

**Lighthouse CI Integration:**

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

**Performance Testing with Playwright:**

```javascript
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load initial page within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('should filter results within 200ms', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const startTime = Date.now();
    await page.click('button:has-text("Calming")');
    await page.waitForSelector('[role="status"]'); // Wait for results update
    const filterTime = Date.now() - startTime;

    expect(filterTime).toBeLessThan(200);
  });

  test('should render sunburst chart within 500ms', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const startTime = Date.now();
    await page.click('button:has-text("Sunburst Chart")');
    await page.waitForSelector('svg[role="img"]');
    const renderTime = Date.now() - startTime;

    expect(renderTime).toBeLessThan(500);
  });
});
```

**Bundle Analysis:**

```bash
# Analyze bundle size with source-map-explorer
npm install -g source-map-explorer
npm run build
source-map-explorer 'dist/assets/*.js'

# Or use rollup-plugin-visualizer
npm run build
# Opens interactive treemap of bundle in browser
```

### Material UI Performance Best Practices

**Optimize Material UI Imports:**

```javascript
// BEST: Named imports from @mui/material (single entry point)
import { Button, TextField } from '@mui/material';

// GOOD: Direct imports (slightly more verbose)
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// AVOID: Importing entire library
import * as Mui from '@mui/material'; // Imports everything
```

**Reduce Emotion Style Recalculations:**

```javascript
// Use theme.breakpoints for responsive styles instead of window.innerWidth
import { useTheme, useMediaQuery } from '@mui/material';

function ResponsiveComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        padding: isMobile ? 1 : 3, // Responsive padding
        fontSize: { xs: 14, sm: 16, md: 18 }, // Breakpoint-based sizing
      }}
    >
      Content
    </Box>
  );
}
```

**Minimize Re-renders with Stable References:**

```javascript
// Use useCallback for event handlers passed to child components
const handleClick = useCallback((id) => {
  setSelectedId(id);
}, []); // Stable reference

// Memoize complex calculations
const processedData = useMemo(() => {
  return terpenes.map(t => ({
    ...t,
    effectsCount: t.effects.length,
  }));
}, [terpenes]);
```

### Implementation Checklist

- [ ] Configure Vite with code splitting and tree shaking
- [ ] Implement manual chunks for vendor libraries (React, Material UI, D3.js)
- [ ] Use React.lazy for heavy components (SunburstChart, TableView)
- [ ] Add loading="lazy" to all images
- [ ] Implement virtual scrolling for lists with 100+ items
- [ ] Memoize filtered/sorted data with useMemo
- [ ] Memoize event handlers with useCallback
- [ ] Use React.memo for list item components
- [ ] Optimize font loading with preconnect and font-display
- [ ] Run Lighthouse audits and achieve ≥90 performance score
- [ ] Set up Lighthouse CI in GitHub Actions
- [ ] Analyze bundle with rollup-plugin-visualizer
- [ ] Test INP (Interaction to Next Paint) with real user interactions
- [ ] Implement service worker for asset caching (optional)
- [ ] Measure and optimize Total Blocking Time (TBT)

---

## Summary and Recommendations

### Technology Stack Decision Matrix

| Concern | Recommended Solution | Key Benefits |
|---------|---------------------|--------------|
| **Theming** | Material UI 5 colorSchemes + CssVarsProvider | System detection, WCAG AA, no flicker |
| **D3 Integration** | useRef + useEffect pattern | Clear separation, theme integration, performance |
| **Accessibility** | Material UI built-in + ARIA enhancements | WCAG 2.1 AA, keyboard nav, screen readers |
| **i18n** | react-i18next + Material UI locales | Auto-detection, pluralization, date/number formatting |
| **Performance** | Vite + code splitting + lazy loading | Lighthouse ≥90, fast builds, optimized bundles |

### Implementation Priority

1. **Phase 1 - Foundation**: Set up Vite with Material UI theming and i18next configuration
2. **Phase 2 - Core Features**: Implement data loading, filtering, and basic visualizations
3. **Phase 3 - Accessibility**: Add keyboard navigation, ARIA attributes, and focus management
4. **Phase 4 - Optimization**: Implement code splitting, lazy loading, and performance monitoring
5. **Phase 5 - Testing**: Validate WCAG compliance, Lighthouse scores, and cross-browser support

### Key Success Metrics

- **Performance**: Lighthouse score ≥90, INP <200ms, TBT <300ms
- **Accessibility**: Lighthouse accessibility ≥95, zero axe-core violations, keyboard navigation complete
- **Internationalization**: Full English/German support, automatic language detection, proper date/number formatting
- **Bundle Size**: Initial JS <200KB gzipped, lazy-loaded chunks <100KB each
- **Browser Support**: Chrome, Firefox, Safari, Edge (last 2 versions)

### Common Pitfalls to Avoid

1. **Theme Flicker**: Always use InitColorSchemeScript for SSR or static sites
2. **D3 Memory Leaks**: Return cleanup function in useEffect to remove event listeners
3. **Missing ARIA**: Test with screen reader (NVDA/JAWS) to catch missing labels
4. **Translation Gaps**: Validate all i18n keys exist in both language files
5. **Bundle Bloat**: Regularly audit bundle with visualizer, avoid importing entire libraries
6. **Emotion Performance**: Prefer styled components over sx prop for reusable styles
7. **Contrast Violations**: Use getContrastRatio to validate all custom color combinations

---

## Additional Resources

### Official Documentation
- [Material UI Documentation](https://mui.com/)
- [D3.js Documentation](https://d3js.org/)
- [react-i18next Documentation](https://react.i18next.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Vite Documentation](https://vitejs.dev/)

### Tools and Testing
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Performance monitoring
- [Bundle Visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer) - Bundle analysis
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools) - Performance profiling

### Community Examples
- [Material UI Examples](https://github.com/mui/material-ui/tree/master/examples)
- [D3 + React Gallery](https://d3-graph-gallery.com/)
- [i18next Examples](https://github.com/i18next/react-i18next/tree/master/example)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Next Review**: After Phase 1 implementation
