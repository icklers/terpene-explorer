/**
 * AppBar Component Contract
 *
 * Mobile-aware application header that adapts between mobile and desktop layouts.
 * On mobile: Compact header with expandable search and settings bottom sheet.
 * On desktop: Full-width header with inline controls.
 */

import { ReactNode } from 'react';

export interface AppBarProps {
  /**
   * Current search query text
   */
  searchQuery: string;

  /**
   * Handler called when search query changes
   * @param query - New search query string
   */
  onSearchChange: (query: string) => void;

  /**
   * Current theme mode
   */
  themeMode: 'light' | 'dark';

  /**
   * Handler called when theme toggle is clicked
   */
  onThemeToggle: () => void;

  /**
   * Current application language
   */
  language: 'en' | 'de';

  /**
   * Handler called when language is changed
   * @param language - New language code
   */
  onLanguageChange: (language: 'en' | 'de') => void;

  /**
   * Optional custom logo element
   * @default "Terpene Explorer" text
   */
  logo?: ReactNode;

  /**
   * Optional additional actions to render in header
   */
  actions?: ReactNode;
}

/**
 * Mobile search state (internal to component)
 */
export interface MobileSearchState {
  isExpanded: boolean;
  isFocused: boolean;
}

/**
 * Settings sheet state (internal to component)
 */
export interface SettingsSheetState {
  isOpen: boolean;
}

/**
 * Component Behavior Specifications
 *
 * ## Mobile Layout (< 600px)
 * - Height: 56px (Material Design standard)
 * - Left: Hamburger menu button (44x44px touch target)
 * - Center: App logo OR expanded search input
 * - Right: Search icon + Settings icon (44x44px each)
 *
 * ## Desktop Layout (>= 600px)
 * - Height: 64px
 * - Left: App logo
 * - Center: Full-width search bar (max 600px)
 * - Right: Language selector + Theme toggle
 *
 * ## Interactions
 *
 * ### Mobile Search Expansion
 * 1. User taps search icon
 * 2. Logo fades out, search input fades in with full width
 * 3. Search input receives focus automatically
 * 4. Close icon (X) replaces search icon
 * 5. User taps close icon → collapses back to logo
 *
 * ### Settings Bottom Sheet (Mobile)
 * 1. User taps settings icon (3-dot menu)
 * 2. Bottom sheet slides up from bottom
 * 3. Sheet contains:
 *    - Drag handle (40x4px, centered)
 *    - "Settings" heading
 *    - Theme toggle (Light/Dark/System)
 *    - Language selector (English/Deutsch)
 * 4. User can close by:
 *    - Tapping close button
 *    - Swiping down on drag handle
 *    - Tapping backdrop (outside sheet)
 *
 * ## Accessibility
 * - All icons have aria-labels
 * - Search input has placeholder text
 * - Settings sheet has role="dialog" and aria-labelledby
 * - Keyboard navigation: Tab through all controls, Esc closes sheet
 * - Touch targets: Minimum 44x44px (WCAG 2.1 AA)
 *
 * ## Performance
 * - Search input debounced (300ms) to avoid excessive re-renders
 * - Settings sheet uses keepMounted={false} to save memory when closed
 *
 * @example
 * ```tsx
 * <AppBar
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   themeMode={theme}
 *   onThemeToggle={toggleTheme}
 *   language={language}
 *   onLanguageChange={changeLanguage}
 * />
 * ```
 */
export const AppBarContract = {
  componentName: 'AppBar',
  version: '1.0.0',
  mobileBreakpoint: 600, // px
  desktopHeaderHeight: 64, // px
  mobileHeaderHeight: 56, // px
  minTouchTarget: 44, // px
  searchDebounceMs: 300,
  settingsSheetMaxHeight: '60vh',
  settingsSheetBorderRadius: 16, // px
} as const;
