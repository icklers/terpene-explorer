# Mobile Optimization Proposal: Terpene Explorer

**World-Class UX/UI Design Strategy**

---

## Executive Summary

After comprehensive analysis of the Terpene Explorer codebase, I've identified significant opportunities to transform this application into
a **best-in-class mobile experience**. While the app has basic responsive considerations (breakpoints at `sm: 600px`), it lacks the
sophisticated mobile-first optimizations that define exceptional mobile applications in 2025.

This proposal outlines a strategic, multi-tiered approach to achieve **world-class mobile compatibility** without compromising the desktop
experience.

---

## Current State Analysis

### ✅ What's Working

1. **Basic Responsive Breakpoints**: `useMediaQuery(theme.breakpoints.down('sm'))` implemented in key components
2. **Mobile Accordion UI**: CategoryTabs component has mobile-specific accordion implementation
3. **Viewport Meta Tag**: Properly configured in `index.html`
4. **Material UI Foundation**: Strong base for responsive design
5. **Dark Theme**: Already optimized for mobile battery conservation

### ❌ Critical Mobile UX Gaps

#### 1. **AppBar Responsive Issues**

- **Problem**: Search bar, language selector, and theme toggle cramped on mobile
- **Impact**: Poor usability, text overlap, tiny touch targets (< 44px WCAG minimum)
- **Location**: `src/components/layout/AppBar.tsx`

#### 2. **Table Horizontal Overflow**

- **Problem**: TerpeneTable with 4 columns (Name, Aroma, Effects, Sources) requires horizontal scrolling on mobile
- **Impact**: Frustrating UX, hidden content, difficult navigation
- **Location**: `src/components/visualizations/TerpeneTable.tsx`

#### 3. **Modal/Dialog Not Mobile-Optimized**

- **Problem**: TerpeneDetailModal uses fixed maxWidth="md" and may overflow small screens
- **Impact**: Content cutoff, difficult scrolling, poor readability
- **Location**: `src/components/visualizations/TerpeneDetailModal.tsx`

#### 4. **Filter Controls Complexity**

- **Problem**: While CategoryTabs has mobile UI, the overall filter section can be overwhelming
- **Impact**: Cognitive overload, difficult to understand filtering system
- **Location**: `src/pages/Home.tsx`, `src/components/filters/FilterControls.tsx`

#### 5. **Touch Interaction Gaps**

- **Problem**: No swipe gestures, long-press menus, or pull-to-refresh
- **Impact**: Doesn't feel native, misses mobile conventions
- **Global Impact**: Across all interactive elements

#### 6. **Performance Concerns**

- **Problem**: No virtual scrolling enabled, full data rendering
- **Impact**: Lag on older devices, battery drain
- **Location**: `TerpeneTable.tsx` (virtualization commented out)

#### 7. **Typography & Spacing**

- **Problem**: Fixed font sizes and spacing not optimized for mobile reading
- **Impact**: Readability issues on small screens
- **Global Impact**: Theme configuration

---

## Proposed Solutions: 3-Tier Approach

### 🥇 **Option A: Progressive Enhancement (Recommended)**

**Best balance of effort and impact. Delivers 90% of mobile excellence with 40% of effort.**

#### Phase 1: Foundation (Week 1)

**Goal: Fix critical mobile blockers**

1. **Mobile-First AppBar Redesign**
   - Implement hamburger menu for mobile (< 600px)
   - Move search to expandable full-width bar
   - Create bottom navigation sheet for settings (theme, language)
   - Touch targets minimum 44x44px

   ```tsx
   // Mobile AppBar Structure
   <AppBar>
     <IconButton> {/* Hamburger Menu */}
     <SearchIcon onClick={expandSearch} />
     <Spacer />
     <MoreVertIcon /> {/* Settings Sheet */}
   </AppBar>
   ```

2. **Card-Based Table Alternative**
   - Detect mobile and render card grid instead of table
   - Each terpene as a card with key info
   - Tap card to open detail modal
   - No horizontal scrolling required

   ```tsx
   {
     isMobile ? <TerpeneCardGrid terpenes={filteredTerpenes} /> : <TerpeneTable terpenes={filteredTerpenes} />;
   }
   ```

3. **Full-Screen Mobile Modal**
   - Use `fullScreen` prop on mobile
   - Slide-up animation
   - Close button in header
   - Better content flow

4. **Typography Scale Adjustments**
   - Fluid typography using `clamp()`
   - Mobile-optimized line-height
   - Increased base font size (16px → 18px on mobile)

5. **Touch-Friendly Spacing**
   - Increase padding on interactive elements
   - Minimum 8px spacing between clickable items
   - Larger chip sizes on mobile (medium → large)

#### Phase 2: Enhancement (Week 2)

**Goal: Native-feeling interactions**

6. **Swipe Gestures**
   - Swipe to close modal
   - Swipe between filter categories
   - Pull-to-refresh data
   - Library: `react-swipeable` or native touch events

7. **Bottom Sheet for Filters**
   - Collapsible bottom sheet UI
   - Drag handle indicator
   - Partial/full expand states
   - Library: Material UI `Drawer` with anchor="bottom"

8. **Virtual Scrolling**
   - Re-enable `react-window` virtualization
   - Load 20 items at a time
   - Infinite scroll pattern

9. **Optimized Loading States**
   - Skeleton screens matching layout
   - Optimistic UI updates
   - Loading indicators for async actions

#### Phase 3: Polish (Week 3)

**Goal: Delight users**

10. **Haptic Feedback** (PWA-ready)
    - Vibration on selection
    - Confirmation feedback
    - Navigator Vibration API

11. **Gesture Navigation**
    - Swipe left/right between terpene details
    - Pinch to zoom on molecular data (future)
    - Double-tap shortcuts

12. **Mobile-Specific Features**
    - Share functionality (Web Share API)
    - Add to Home Screen prompt
    - Offline mode (Service Worker)
    - Dark mode follows system preference

---

### 🥈 **Option B: Mobile-First Rebuild**

**Comprehensive redesign. Delivers 100% mobile excellence but requires significant effort.**

#### Complete Component Reimagining

1. **Unified Component System**
   - Build every component mobile-first
   - Progressive enhancement for desktop
   - Dedicated mobile component variants
   - Approximate effort: 6-8 weeks

2. **Advanced Features**
   - Native-like page transitions
   - Advanced gesture controls
   - Voice search integration
   - AR terpene visualization (aspirational)

3. **Performance Optimization**
   - Code splitting per route
   - Image lazy loading
   - Tree-shaking optimization
   - Bundle size < 200KB gzipped

**Trade-offs:**

- ✅ Best possible mobile experience
- ✅ Future-proof architecture
- ❌ 2-3 month timeline
- ❌ Risk of breaking existing features
- ❌ High development cost

---

### 🥉 **Option C: Minimal Adaptive Tweaks**

**Quick fixes only. Delivers 50% mobile improvement with minimal effort.**

#### Quick Wins (1-2 Days)

1. **Responsive Grid Layout**
   - Change table to single column list on mobile
   - Stack table rows vertically
   - Simple CSS media queries

2. **Hide Secondary Content**
   - Remove less critical columns on mobile
   - Show only Name and Effects
   - "View More" expands details inline

3. **Simplified Navigation**
   - Remove language selector on mobile
   - Auto-detect language from browser
   - Single theme toggle button

4. **Basic Touch Improvements**
   - Increase all touch targets to 48px
   - Add active states (`:active` pseudo-class)
   - Prevent text selection on controls

**Trade-offs:**

- ✅ Fast implementation
- ✅ Low risk
- ❌ Doesn't solve fundamental issues
- ❌ Still requires horizontal scrolling
- ❌ Doesn't feel native

---

## Detailed Implementation: Option A (Recommended)

### Component-by-Component Breakdown

#### 1. Mobile AppBar (`AppBar.tsx`)

**Current Issues:**

```tsx
// Cramped layout on mobile
<Toolbar sx={{ gap: 2 }}>
  <Typography variant="h6">Terpene Explorer</Typography>
  <Box sx={{ flexGrow: 1 }} />
  <SearchBar width={350} /> {/* Too wide! */}
  <LanguageSelector />
  <ThemeToggle />
</Toolbar>
```

**Proposed Solution:**

```tsx
export function AppBar({ ... }: AppBarProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <MuiAppBar position="sticky">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
            {/* Left: Menu or Logo */}
            <IconButton
              edge="start"
              size="large"
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>

            {/* Center: Title or Search */}
            {!searchExpanded ? (
              <Typography
                variant="h6"
                sx={{
                  flexGrow: 1,
                  fontSize: '1.125rem', // Slightly smaller on mobile
                  fontWeight: 600
                }}
              >
                Terpene Explorer
              </Typography>
            ) : (
              <Box sx={{ flexGrow: 1, px: 2 }}>
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  autoFocus
                  fullWidth
                  size="small"
                />
              </Box>
            )}

            {/* Right: Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="large"
                onClick={() => setSearchExpanded(!searchExpanded)}
                aria-label={searchExpanded ? "Close search" : "Open search"}
              >
                {searchExpanded ? <CloseIcon /> : <SearchIcon />}
              </IconButton>

              <IconButton
                size="large"
                onClick={() => setSettingsOpen(true)}
                aria-label="Open settings"
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </MuiAppBar>

        {/* Bottom Sheet for Settings */}
        <Drawer
          anchor="bottom"
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '60vh'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Drag Handle */}
            <Box
              sx={{
                width: 40,
                height: 4,
                bgcolor: 'divider',
                borderRadius: 2,
                mx: 'auto',
                mb: 2
              }}
            />

            <Typography variant="h6" gutterBottom>
              {t('settings.title', 'Settings')}
            </Typography>

            {/* Theme Toggle */}
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('settings.theme', 'Theme')}
              </Typography>
              <ThemeToggle mode={themeMode} onToggle={onThemeToggle} />
            </Box>

            <Divider />

            {/* Language Selector */}
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('settings.language', 'Language')}
              </Typography>
              <LanguageSelector
                language={language}
                onChange={onLanguageChange}
              />
            </Box>
          </Box>
        </Drawer>
      </>
    );
  }

  // Desktop layout (existing code)
  return <DesktopAppBar {...props} />;
}
```

**Benefits:**

- ✅ Clean, uncluttered mobile header
- ✅ Full-width search when needed
- ✅ Settings in accessible bottom sheet
- ✅ 56px height (industry standard)
- ✅ Large touch targets (48x48px icons)

---

#### 2. Mobile Card Grid (`TerpeneCardGrid.tsx` - NEW)

**Create New Component:**

```tsx
/**
 * TerpeneCardGrid Component
 *
 * Mobile-optimized card grid for displaying terpenes.
 * Replaces table view on small screens.
 */

interface TerpeneCardGridProps {
  terpenes: Terpene[];
  onTerpeneClick: (terpene: Terpene) => void;
}

export function TerpeneCardGrid({ terpenes, onTerpeneClick }: TerpeneCardGridProps) {
  const { t, i18n } = useTranslation();

  return (
    <Grid container spacing={2}>
      {terpenes.map((terpene) => (
        <Grid item xs={12} sm={6} key={terpene.id}>
          <Card
            onClick={() => onTerpeneClick(terpene)}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:active': {
                transform: 'scale(0.98)',
              },
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              {/* Terpene Name */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {terpene.name}
              </Typography>

              {/* Aroma */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {terpene.aroma}
              </Typography>

              {/* Effects - Horizontal Scroll */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  overflowX: 'auto',
                  pb: 1,
                  '&::-webkit-scrollbar': {
                    height: 4,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'divider',
                    borderRadius: 2,
                  },
                }}
              >
                {terpene.effects.slice(0, 3).map((effect) => {
                  const effectData = getEffectMetadata(effect);
                  const displayName = effectData.displayName[i18n.language as 'en' | 'de'] || effect;

                  return (
                    <Chip
                      key={effect}
                      label={displayName}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  );
                })}
                {terpene.effects.length > 3 && (
                  <Chip
                    label={`+${terpene.effects.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.75rem',
                      height: 24,
                    }}
                  />
                )}
              </Box>

              {/* View Details Link */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('card.viewDetails', 'View Details')} →
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
```

**Integration in `TerpeneTable.tsx`:**

```tsx
export function TerpeneTable({ terpenes }: TerpeneTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return <TerpeneCardGrid terpenes={terpenes} onTerpeneClick={handleRowClick} />;
  }

  // Desktop table (existing code)
  return <TableContainer>...</TableContainer>;
}
```

**Benefits:**

- ✅ No horizontal scrolling
- ✅ Touch-optimized cards
- ✅ Visual hierarchy maintained
- ✅ Quick scanning
- ✅ Feels native

---

#### 3. Full-Screen Mobile Modal (`TerpeneDetailModal.tsx`)

**Update Existing Component:**

```tsx
export const TerpeneDetailModal: React.FC<TerpeneDetailModalProps> = ({ open, terpene, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open && terpene !== null}
      onClose={onClose}
      fullScreen={isMobile} // KEY CHANGE: Full screen on mobile
      maxWidth={isMobile ? false : 'md'}
      fullWidth={!isMobile}
      aria-labelledby="terpene-detail-title"
      keepMounted
      // Mobile-specific transitions
      TransitionComponent={isMobile ? Slide : Fade}
      TransitionProps={isMobile ? { direction: 'up' } : {}}
    >
      {terpene && (
        <>
          {/* Mobile: Custom App Bar Header */}
          {isMobile && (
            <MuiAppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper' }}>
              <Toolbar>
                <IconButton edge="start" onClick={onClose} aria-label={t('terpeneDetails.close', 'Close')} size="large">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }} id="terpene-detail-title">
                  {terpene.name}
                </Typography>
                <IconButton
                  edge="end"
                  aria-label={t('terpeneDetails.share', 'Share')}
                  size="large"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: terpene.name,
                        text: terpene.description,
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Toolbar>
            </MuiAppBar>
          )}

          {/* Desktop: Standard Dialog Title */}
          {!isMobile && <DialogTitle id="terpene-detail-title">{terpene.name}</DialogTitle>}

          <DialogContent
            sx={{
              px: isMobile ? 2 : 3,
              py: isMobile ? 2 : 3,
            }}
          >
            {/* Content sections with mobile-optimized spacing */}
            <Box
              sx={{
                '& > *:not(:last-child)': {
                  mb: isMobile ? 3 : 2,
                },
              }}
            >
              {/* Effects Section - Wrap instead of horizontal scroll */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('terpeneDetails.fields.effects')}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ gap: 1 }} // Better for wrapping
                >
                  {terpene.effects.map((effect: string) => (
                    <Chip
                      key={effect}
                      label={effect}
                      size={isMobile ? 'medium' : 'small'}
                      sx={{
                        minHeight: isMobile ? 32 : 24,
                        fontSize: isMobile ? '0.875rem' : '0.75rem',
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              {/* Other sections with mobile-optimized typography */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                  {t('terpeneDetails.fields.description')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: isMobile ? '1rem' : '0.875rem',
                    lineHeight: isMobile ? 1.6 : 1.5,
                  }}
                >
                  {terpene.description}
                </Typography>
              </Box>

              {/* ... rest of content ... */}
            </Box>
          </DialogContent>

          {/* Desktop only: Dialog Actions */}
          {!isMobile && (
            <DialogActions>
              <Button onClick={onClose} color="primary">
                {t('terpeneDetails.close')}
              </Button>
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};
```

**Benefits:**

- ✅ Immersive full-screen experience on mobile
- ✅ Native app-like navigation
- ✅ Share functionality
- ✅ Better readability
- ✅ No awkward scrolling

---

#### 4. Bottom Sheet Filters (`FilterBottomSheet.tsx` - NEW)

**Create Dedicated Mobile Filter Component:**

```tsx
/**
 * FilterBottomSheet Component
 *
 * Mobile-optimized bottom sheet for filters.
 * Replaces floating card on small screens.
 */

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  effects: Effect[];
  selectedEffects: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onToggleEffect: (effect: string) => void;
  onClearFilters: () => void;
  resultsCount: number;
  filterMode: 'AND' | 'OR';
  onFilterModeToggle: () => void;
}

export function FilterBottomSheet({
  open,
  onClose,
  effects,
  selectedEffects,
  selectedCategories,
  onCategoryToggle,
  onToggleEffect,
  onClearFilters,
  resultsCount,
  filterMode,
  onFilterModeToggle,
}: FilterBottomSheetProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '85vh',
          minHeight: '50vh',
        },
      }}
      // Swipe to close
      ModalProps={{
        keepMounted: true, // Better performance on mobile
      }}
    >
      {/* Drag Handle */}
      <Box
        sx={{
          width: 40,
          height: 4,
          bgcolor: 'divider',
          borderRadius: 2,
          mx: 'auto',
          mt: 1,
          mb: 2,
        }}
        role="presentation"
        aria-hidden="true"
      />

      <Box sx={{ px: 2, pb: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {t('filters.title', 'Filters')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedEffects.length > 0 && (
              <Button size="small" startIcon={<ClearIcon />} onClick={onClearFilters}>
                {t('filters.clear', 'Clear')}
              </Button>
            )}
            <IconButton onClick={onClose} aria-label="Close filters">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Results Count */}
        <Box
          sx={{
            bgcolor: 'action.hover',
            borderRadius: 1,
            p: 1.5,
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }} aria-live="polite">
            {resultsCount === 0
              ? t('filters.noResults', 'No terpenes found')
              : resultsCount === 1
                ? t('filters.oneResult', '1 terpene found')
                : t('filters.results', {
                    defaultValue: '{{count}} terpenes found',
                    count: resultsCount,
                  })}
          </Typography>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ overflowY: 'auto', maxHeight: '60vh' }}>
          <Stack spacing={3}>
            {/* Category Tabs - Mobile Accordion */}
            <CategoryTabs
              selectedCategories={selectedCategories}
              onCategoryToggle={onCategoryToggle}
              categorizedEffects={groupEffectsByCategory(effects)}
              selectedEffects={selectedEffects}
              onToggleEffect={onToggleEffect}
            />

            {/* Filter Mode Toggle */}
            {selectedEffects.length > 1 && <FilterModeToggle mode={filterMode} onChange={onFilterModeToggle} />}
          </Stack>
        </Box>

        {/* Apply Button (Sticky) */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            bgcolor: 'background.paper',
            pt: 2,
            mt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button fullWidth variant="contained" size="large" onClick={onClose} sx={{ minHeight: 48 }}>
            {t('filters.apply', 'Apply Filters')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
```

**Update `Home.tsx`:**

```tsx
export function Home({ searchQuery }: HomeProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Mobile: Floating Action Button for Filters */}
      {isMobile && (
        <>
          <Fab
            color="primary"
            aria-label={t('filters.open', 'Open filters')}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
            onClick={() => setFilterSheetOpen(true)}
          >
            <Badge
              badgeContent={selectedEffects.length}
              color="secondary"
            >
              <FilterListIcon />
            </Badge>
          </Fab>

          <FilterBottomSheet
            open={filterSheetOpen}
            onClose={() => setFilterSheetOpen(false)}
            {...filterProps}
          />
        </>
      )}

      {/* Desktop: Inline Filter Card (existing) */}
      {!isMobile && (
        <Paper sx={{ ... }}>
          <FilterControls {...filterProps} />
        </Paper>
      )}

      {/* Results */}
      <Box ref={visualizationRef}>
        {/* ... */}
      </Box>
    </Container>
  );
}
```

**Benefits:**

- ✅ More screen space for results
- ✅ Native bottom sheet interaction
- ✅ Drag to close
- ✅ Badge shows active filter count
- ✅ Always accessible via FAB

---

#### 5. Typography & Spacing Mobile Theme

**Update `darkTheme.ts` and `lightTheme.ts`:**

```typescript
export const darkTheme = createTheme({
  palette: {
    /* existing */
  },

  typography: {
    // Responsive font sizing using clamp()
    htmlFontSize: 16,
    fontSize: 16,

    h1: {
      fontSize: 'clamp(2rem, 5vw, 2.5rem)', // 32px - 40px
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 'clamp(1.75rem, 4vw, 2rem)', // 28px - 32px
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3.5vw, 1.75rem)', // 24px - 28px
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', // 20px - 24px
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)', // 18px - 20px
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: 'clamp(1rem, 2vw, 1.125rem)', // 16px - 18px
      fontWeight: 500,
      lineHeight: 1.6,
    },

    body1: {
      fontSize: 'clamp(1rem, 2vw, 1rem)', // 16px
      lineHeight: 1.6,
    },
    body2: {
      fontSize: 'clamp(0.875rem, 1.8vw, 0.875rem)', // 14px
      lineHeight: 1.6,
    },

    button: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)', // 14px - 16px
      fontWeight: 600,
      textTransform: 'none',
    },
  },

  // Mobile breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },

  components: {
    // Increase touch targets on mobile
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44, // WCAG minimum
          minWidth: 64,
          padding: '10px 16px',

          '@media (max-width:600px)': {
            minHeight: 48, // Even larger on mobile
            fontSize: '1rem',
          },
        },

        sizeLarge: {
          minHeight: 48,
          padding: '12px 24px',

          '@media (max-width:600px)': {
            minHeight: 56,
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 12,

          '@media (max-width:600px)': {
            padding: 14, // Larger touch target
          },
        },

        sizeLarge: {
          padding: 16,

          '@media (max-width:600px)': {
            padding: 18,
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          height: 28,
          fontSize: '0.8125rem',

          '@media (max-width:600px)': {
            height: 32,
            fontSize: '0.875rem',
          },
        },

        sizeMedium: {
          '@media (max-width:600px)': {
            height: 36,
            fontSize: '0.9375rem',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',

          '@media (max-width:600px)': {
            padding: '12px 8px', // Tighter on mobile tables
          },
        },
      },
    },

    // Container padding
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
    },
  },

  // Responsive spacing
  spacing: (factor: number) => {
    const base = 8;
    return `${base * factor}px`;
  },
});
```

---

### 6. Touch Gestures & Interactions

**Install Dependencies:**

```bash
pnpm add react-swipeable
pnpm add -D @types/react-swipeable
```

**Swipe-to-Close Modal:**

```tsx
import { useSwipeable } from 'react-swipeable';

export const TerpeneDetailModal: React.FC<TerpeneDetailModalProps> = ({ open, terpene, onClose }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [swipeOffset, setSwipeOffset] = useState(0);

  const swipeHandlers = useSwipeable({
    onSwipedDown: (eventData) => {
      if (eventData.velocity > 0.5) {
        onClose();
      }
    },
    onSwiping: (eventData) => {
      if (eventData.dir === 'Down') {
        setSwipeOffset(Math.min(eventData.deltaY, 100));
      }
    },
    onSwiped: () => {
      setSwipeOffset(0);
    },
    trackMouse: false, // Mobile only
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      PaperProps={{
        ...swipeHandlers,
        style: {
          transform: isMobile ? `translateY(${swipeOffset}px)` : 'none',
          transition: swipeOffset === 0 ? 'transform 0.3s ease' : 'none',
        },
      }}
    >
      {/* Content */}
    </Dialog>
  );
};
```

**Pull-to-Refresh:**

```tsx
export function Home({ searchQuery }: HomeProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload(); // Reload terpene data
    setRefreshing(false);
  };

  const pullHandlers = useSwipeable({
    onSwipedDown: (eventData) => {
      if (window.scrollY === 0 && eventData.velocity > 0.6) {
        handleRefresh();
      }
    },
    trackTouch: true,
  });

  return (
    <Container {...pullHandlers}>
      {refreshing && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Rest of content */}
    </Container>
  );
}
```

---

### 7. Performance Optimizations

**Re-enable Virtual Scrolling:**

```tsx
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export function TerpeneTable({ terpenes }: TerpeneTableProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Desktop: Virtual scrolling for large lists
  if (!isMobile && terpenes.length > 50) {
    return (
      <Paper sx={{ height: 600, overflow: 'hidden' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List height={height} itemCount={terpenes.length} itemSize={80} width={width}>
              {({ index, style }) => (
                <div style={style}>
                  <TerpeneRow terpene={terpenes[index]} />
                </div>
              )}
            </List>
          )}
        </AutoSizer>
      </Paper>
    );
  }

  // Mobile: Card grid (no virtualization needed with pagination)
  return <TerpeneCardGrid terpenes={terpenes} />;
}
```

**Code Splitting:**

```tsx
// Lazy load heavy components
const TerpeneTable = lazy(() =>
  import('./TerpeneTable').then((module) => ({
    default: module.TerpeneTable,
  }))
);

const TerpeneDetailModal = lazy(() =>
  import('./TerpeneDetailModal').then((module) => ({
    default: module.TerpeneDetailModal,
  }))
);
```

**Image Optimization (Future):**

```tsx
// Use WebP with fallback
<picture>
  <source srcSet="/images/terpene.webp" type="image/webp" />
  <img src="/images/terpene.png" alt="Terpene molecule" loading="lazy" decoding="async" />
</picture>
```

---

### 8. PWA Features (Optional but Recommended)

**Add Service Worker:**

```typescript
// sw.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// Precache build assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/data/'),
  new CacheFirst({
    cacheName: 'terpene-data',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);
```

**Update `manifest.json`:**

```json
{
  "name": "Terpene Explorer",
  "short_name": "Terpenes",
  "description": "Discover cannabis terpenes and their effects",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#121212",
  "theme_color": "#4caf50",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["health", "education", "lifestyle"],
  "screenshots": [
    {
      "src": "/screenshots/mobile-home.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/desktop-home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

**Install Prompt:**

```tsx
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <Snackbar
      open={showPrompt}
      message="Install Terpene Explorer on your home screen"
      action={
        <Button color="secondary" onClick={handleInstall}>
          Install
        </Button>
      }
    />
  );
}
```

---

## Testing Strategy

### Device Testing Matrix

| Device Category | Models                   | Screen Sizes        | Priority |
| --------------- | ------------------------ | ------------------- | -------- |
| iPhone          | 13 Mini, 14 Pro, 15 Plus | 375px, 393px, 428px | HIGH     |
| Android         | Pixel 6, Samsung S23     | 412px, 360px        | HIGH     |
| Tablets         | iPad Mini, iPad Pro      | 768px, 1024px       | MEDIUM   |
| Foldables       | Galaxy Fold, Pixel Fold  | 280px - 420px       | LOW      |

### Testing Checklist

#### Visual Testing

- [ ] All text readable without zoom
- [ ] No horizontal scrolling required
- [ ] Touch targets minimum 44x44px
- [ ] Proper spacing between interactive elements
- [ ] Images/icons scale appropriately
- [ ] Dark mode colors suitable for OLED screens

#### Interaction Testing

- [ ] All buttons/links easily tappable
- [ ] Gestures work smoothly (swipe, pull-to-refresh)
- [ ] Modals open/close with appropriate animations
- [ ] Keyboard appears for input fields
- [ ] Form auto-complete works
- [ ] Haptic feedback triggers (if implemented)

#### Performance Testing

- [ ] Initial load < 3 seconds on 3G
- [ ] Time to Interactive < 5 seconds
- [ ] Smooth scrolling (60fps)
- [ ] No jank during animations
- [ ] Memory usage reasonable (< 50MB)
- [ ] Battery drain acceptable

#### Accessibility Testing

- [ ] Screen reader navigation works
- [ ] Voice control compatible
- [ ] Sufficient contrast ratios
- [ ] Focus indicators visible
- [ ] ARIA labels correct
- [ ] Keyboard navigation complete

#### Browser Testing

- [ ] Chrome Mobile (latest)
- [ ] Safari iOS (latest)
- [ ] Firefox Mobile (latest)
- [ ] Samsung Internet (latest)
- [ ] Edge Mobile (latest)

---

## Implementation Timeline

### Phase 1: Foundation (Week 1 - 40 hours)

**Goal: Fix critical blockers**

| Day | Task                   | Hours | Deliverable                             |
| --- | ---------------------- | ----- | --------------------------------------- |
| Mon | Mobile AppBar redesign | 8     | Hamburger menu, bottom sheet settings   |
| Tue | Card grid component    | 8     | TerpeneCardGrid with touch optimization |
| Wed | Full-screen modal      | 6     | Mobile-optimized TerpeneDetailModal     |
| Thu | Typography & spacing   | 6     | Responsive theme updates                |
| Fri | Testing & bug fixes    | 12    | QA across 5 devices                     |

**Deliverables:**

- ✅ No horizontal scrolling
- ✅ All touch targets ≥ 44px
- ✅ Responsive navigation
- ✅ Readable typography

### Phase 2: Enhancement (Week 2 - 40 hours)

**Goal: Native-feeling interactions**

| Day | Task                 | Hours | Deliverable                             |
| --- | -------------------- | ----- | --------------------------------------- |
| Mon | Swipe gestures       | 8     | Modal swipe-to-close, category swipes   |
| Tue | Bottom sheet filters | 8     | FilterBottomSheet + FAB                 |
| Wed | Virtual scrolling    | 6     | Re-enable react-window                  |
| Thu | Loading states       | 6     | Skeleton screens, optimistic UI         |
| Fri | Testing & polish     | 12    | Gesture testing, performance validation |

**Deliverables:**

- ✅ Swipe interactions work
- ✅ Bottom sheet filters
- ✅ Performance optimized
- ✅ Smooth animations

### Phase 3: Polish (Week 3 - 40 hours)

**Goal: Delight users**

| Day | Task                | Hours | Deliverable                          |
| --- | ------------------- | ----- | ------------------------------------ |
| Mon | Haptic feedback     | 4     | Vibration API integration            |
| Tue | Gesture navigation  | 6     | Swipe between details, shortcuts     |
| Wed | PWA features        | 8     | Service worker, install prompt       |
| Thu | Share functionality | 4     | Web Share API                        |
| Fri | Final testing       | 18    | E2E testing, user acceptance testing |

**Deliverables:**

- ✅ PWA installable
- ✅ Offline capability
- ✅ Share integration
- ✅ Haptic feedback

**Total Effort: 120 hours (3 weeks)**

---

## Success Metrics

### Quantitative KPIs

| Metric                        | Current | Target  | Measurement        |
| ----------------------------- | ------- | ------- | ------------------ |
| Mobile bounce rate            | Unknown | < 30%   | Google Analytics   |
| Avg session duration (mobile) | Unknown | > 2 min | GA4                |
| Pages per session (mobile)    | Unknown | > 3     | GA4                |
| Load time (3G)                | Unknown | < 3s    | Lighthouse         |
| Time to Interactive           | Unknown | < 5s    | Lighthouse         |
| Core Web Vitals - LCP         | Unknown | < 2.5s  | PageSpeed Insights |
| Core Web Vitals - FID         | Unknown | < 100ms | PSI                |
| Core Web Vitals - CLS         | Unknown | < 0.1   | PSI                |
| Mobile Lighthouse score       | Unknown | > 90    | Lighthouse         |
| Touch target compliance       | ~60%    | 100%    | Manual audit       |

### Qualitative KPIs

| Metric                    | Method           | Target             |
| ------------------------- | ---------------- | ------------------ |
| User satisfaction         | In-app survey    | 4.5/5 stars        |
| Task completion rate      | Analytics events | > 85%              |
| Feature discovery         | Heatmaps         | > 70% find filters |
| Usability issues          | User testing     | < 3 major issues   |
| App store rating (if PWA) | Reviews          | 4.5+ stars         |

### A/B Testing Plan

**Experiment 1: Filter UI**

- Variant A: FAB + Bottom Sheet (recommended)
- Variant B: Fixed bottom bar
- Metric: Filter usage rate

**Experiment 2: Card vs List**

- Variant A: Card grid (recommended)
- Variant B: Compact list
- Metric: Click-through rate

**Experiment 3: Modal Size**

- Variant A: Full-screen (recommended)
- Variant B: 90% screen
- Metric: Detail view duration

---

## Risk Assessment & Mitigation

### Technical Risks

| Risk                         | Probability | Impact | Mitigation                           |
| ---------------------------- | ----------- | ------ | ------------------------------------ |
| Breaking existing desktop UX | Medium      | High   | Extensive desktop regression testing |
| Performance regression       | Low         | Medium | Performance budgets, monitoring      |
| Browser compatibility issues | Medium      | Medium | Polyfills, progressive enhancement   |
| Touch gesture conflicts      | Low         | Low    | Careful event handling, testing      |
| Virtualization bugs          | Low         | Medium | Fallback to non-virtualized          |

### UX Risks

| Risk                              | Probability | Impact | Mitigation                           |
| --------------------------------- | ----------- | ------ | ------------------------------------ |
| Users confused by new UI          | Medium      | High   | Onboarding tooltips, documentation   |
| Gestures not discoverable         | Medium      | Medium | Subtle visual hints, tutorial        |
| Accessibility regressions         | Low         | High   | Automated a11y testing, manual audit |
| Different behavior desktop/mobile | High        | Medium | Clear visual indicators, consistency |

### Timeline Risks

| Risk                      | Probability | Impact | Mitigation                      |
| ------------------------- | ----------- | ------ | ------------------------------- |
| Underestimated complexity | Medium      | High   | 20% buffer time, phased rollout |
| Dependency issues         | Low         | Medium | Lock versions, test thoroughly  |
| Resource unavailability   | Low         | High   | Cross-training, documentation   |

---

## Future Enhancements (Beyond Scope)

### Advanced Features

1. **Voice Search** - "Hey Terpene, show me energizing effects"
2. **AR Visualization** - View 3D molecular structures
3. **Personalization** - Save favorites, custom collections
4. **Social Features** - Share discoveries, community ratings
5. **Camera Integration** - Scan terpene products for info
6. **Geolocation** - Find local sources
7. **Push Notifications** - New terpene discoveries
8. **Offline Data Sync** - Full offline functionality
9. **Multi-user Accounts** - Profiles, preferences
10. **Integration APIs** - Third-party app connections

### Platform Expansion

- **Native iOS App** (React Native conversion)
- **Native Android App** (React Native conversion)
- **Desktop Apps** (Electron wrapper)
- **Browser Extensions** (Quick lookup)
- **Smart TV App** (Large screen experience)
- **Watch App** (Quick reference)

---

## Recommendations

### Immediate Action (Option A - Recommended)

**Implement Progressive Enhancement approach over 3 weeks**

**Why:**

- ✅ Best ROI (90% improvement, 40% effort)
- ✅ Low risk to existing desktop experience
- ✅ Deliverable in reasonable timeline
- ✅ Iterative improvements possible
- ✅ Proven patterns and best practices

**Start With:**

1. Mobile AppBar redesign (Day 1)
2. Card grid component (Day 2)
3. Full-screen modal (Day 3)
4. Then continue with Phase 2 & 3

### Budget Alternative (Option C)

**If resources are extremely limited**

- Implement minimal adaptive tweaks
- Focus on fixing horizontal scrolling
- Increase touch targets
- Plan for full optimization later

### Premium Option (Option B)

**If aiming for App Store release**

- Full mobile-first rebuild
- Native app-like experience
- Advanced features (AR, voice, etc.)
- Requires 2-3 month commitment

---

## Conclusion

The Terpene Explorer has a solid foundation but needs focused mobile optimization to compete in today's mobile-first world. **Option A
(Progressive Enhancement)** strikes the perfect balance between effort and impact.

By implementing these recommendations, the app will:

- ✅ Feel native on mobile devices
- ✅ Provide smooth, delightful interactions
- ✅ Improve user engagement and retention
- ✅ Meet modern UX standards
- ✅ Be ready for PWA distribution
- ✅ Scale to tablets and foldables

**The mobile web is the future. Let's make Terpene Explorer shine on every device.**

---

## Appendix

### A. Component Changes Summary

| Component                    | Changes                       | Effort | Priority |
| ---------------------------- | ----------------------------- | ------ | -------- |
| `AppBar.tsx`                 | Mobile layout, bottom sheet   | 8h     | HIGH     |
| `TerpeneTable.tsx`           | Card grid alternative         | 8h     | HIGH     |
| `TerpeneDetailModal.tsx`     | Full-screen, swipe            | 6h     | HIGH     |
| `Home.tsx`                   | FAB, bottom sheet integration | 6h     | MEDIUM   |
| `FilterControls.tsx`         | Mobile optimization           | 4h     | MEDIUM   |
| `CategoryTabs.tsx`           | Already good, minor tweaks    | 2h     | LOW      |
| `theme/*.ts`                 | Responsive typography         | 6h     | HIGH     |
| New: `TerpeneCardGrid.tsx`   | Card component                | 8h     | HIGH     |
| New: `FilterBottomSheet.tsx` | Filter drawer                 | 8h     | MEDIUM   |
| New: `InstallPrompt.tsx`     | PWA install                   | 4h     | LOW      |

### B. Dependencies to Add

```json
{
  "dependencies": {
    "react-swipeable": "^7.0.1",
    "workbox-core": "^7.0.0",
    "workbox-precaching": "^7.0.0",
    "workbox-routing": "^7.0.0",
    "workbox-strategies": "^7.0.0"
  },
  "devDependencies": {
    "@types/react-swipeable": "^7.0.1"
  }
}
```

### C. Accessibility Audit Checklist

- [ ] All interactive elements have 44x44px minimum touch target
- [ ] Color contrast ratios meet WCAG 2.1 AA (4.5:1)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces dynamic content changes
- [ ] Keyboard navigation works for all interactions
- [ ] ARIA labels correct and descriptive
- [ ] Form inputs have associated labels
- [ ] Error messages are accessible
- [ ] Modals trap focus correctly
- [ ] Skip links present and functional

### D. Performance Budget

| Metric                 | Budget  | Tool                    |
| ---------------------- | ------- | ----------------------- |
| Total page weight      | < 500KB | Webpack Bundle Analyzer |
| JavaScript bundle      | < 200KB | Rollup Visualizer       |
| CSS bundle             | < 50KB  | Vite Build              |
| Images total           | < 200KB | ImageOptim              |
| Fonts total            | < 100KB | Font Squirrel           |
| Time to Interactive    | < 5s    | Lighthouse              |
| First Contentful Paint | < 2s    | Lighthouse              |

### E. Browser Support Matrix

| Browser          | Version | Support Level | Notes            |
| ---------------- | ------- | ------------- | ---------------- |
| Chrome Android   | 120+    | Full          | Primary target   |
| Safari iOS       | 17+     | Full          | Primary target   |
| Samsung Internet | 23+     | Full          | Secondary target |
| Firefox Android  | 121+    | Full          | Secondary target |
| Edge Mobile      | 120+    | Full          | Secondary target |
| UC Browser       | -       | Best effort   | Fallback only    |
| Opera Mobile     | 76+     | Full          | Secondary target |

### F. Resources & Documentation

#### Libraries

- [Material UI Mobile Best Practices](https://mui.com/material-ui/guides/responsive-ui/)
- [React Swipeable](https://github.com/FormidableLabs/react-swipeable)
- [Workbox Service Worker](https://developers.google.com/web/tools/workbox)
- [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

#### Design Inspiration

- [Material Design Mobile Patterns](https://m3.material.io/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android App Quality](https://developer.android.com/quality)
- [Mobile UX Patterns](https://mobbin.com/)

#### Testing Tools

- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated audits
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing

---

**Document Version:** 1.0  
**Author:** World-Class UX/UI Design Expert  
**Date:** November 1, 2025  
**Status:** Proposal - Awaiting Approval  
**Next Steps:** Review → Approve → Implement Phase 1
