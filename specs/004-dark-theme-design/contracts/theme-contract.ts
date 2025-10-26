/**
 * Theme Contract: Type Definitions for Comfortably Dark Theme System
 * 
 * This file defines TypeScript interfaces and types for the dark theme configuration.
 * These types ensure type safety when working with theme values across the application.
 * 
 * @feature 004-dark-theme-design
 * @see data-model.md for complete entity definitions
 */

import type { Theme, ThemeOptions } from '@mui/material/styles';

/**
 * Extended palette configuration for the dark theme
 * Includes all custom color values and semantic tokens
 */
export interface DarkThemePaletteConfig {
  mode: 'dark';
  
  background: {
    /** Main page background - very dark gray */
    default: '#121212';
    /** Card surface background - slightly lighter for contrast */
    paper: '#1e1e1e';
  };
  
  primary: {
    /** Bright green for active interactions (selected toggle, chip borders) */
    main: '#4caf50';
    /** Dark green for structural branding (header, table header) */
    dark: '#388e3c';
    /** White text on primary backgrounds */
    contrastText: '#ffffff';
  };
  
  secondary: {
    /** Vibrant orange for focus/selection indicators */
    main: '#ffb300';
    /** Dark text on secondary backgrounds for contrast */
    contrastText: 'rgba(0, 0, 0, 0.87)';
  };
  
  text: {
    /** Primary text - white */
    primary: '#ffffff';
    /** Secondary text - 70% white */
    secondary: 'rgba(255, 255, 255, 0.7)';
  };
  
  action: {
    /** Hover state background (zebra stripes) */
    hover: 'rgba(255, 255, 255, 0.08)';
    /** Selected state background (chips, table rows) */
    selected: 'rgba(255, 255, 255, 0.16)';
  };
}

/**
 * Floating card style configuration
 * Defines visual properties for elevated card components
 */
export interface FloatingCardStyleConfig {
  /** Background color token from theme palette */
  bgcolor: 'background.paper';
  /** Border radius in theme spacing units (2 = 8px) */
  borderRadius: 2;
  /** Box shadow for elevation effect */
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)';
  /** Internal padding in spacing units (3 = 24px) */
  padding: 3;
  /** Margin bottom for card spacing (3 = 24px) */
  marginBottom: 3;
}

/**
 * Interaction state enum
 * Represents possible visual states for interactive elements
 */
export enum InteractionState {
  DEFAULT = 'default',
  HOVER = 'hover',
  FOCUS = 'focus',
  SELECTED = 'selected',
  ACTIVE = 'active',
}

/**
 * Style configuration for a specific interaction state
 */
export interface InteractionStateStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  outlineColor?: string;
  outlineWidth?: string;
  outlineOffset?: string;
}

/**
 * Complete interaction state mapping for a component
 */
export type InteractionStateMap = {
  [K in InteractionState]?: InteractionStateStyle;
};

/**
 * Table row interaction states configuration
 */
export interface TableRowStates {
  /** Default state with zebra striping */
  default: {
    odd: InteractionStateStyle;
    even: InteractionStateStyle;
  };
  /** Hover state */
  hover: InteractionStateStyle;
  /** Selected state with left border indicator */
  selected: InteractionStateStyle & {
    borderLeft: '4px solid';
    borderColor: 'secondary.main';
  };
}

/**
 * Filter chip states configuration
 */
export interface FilterChipStates {
  /** Unselected chip state (dark background, transparent border) */
  unselected: {
    bgcolor: 'background.paper';
    border: '2px solid';
    borderColor: 'transparent';
  };
  /** Selected chip state (light background, green border) */
  selected: {
    bgcolor: 'action.selected';
    border: '2px solid';
    borderColor: 'primary.main';
  };
}

/**
 * Toggle button states configuration
 */
export interface ToggleButtonStates {
  /** Unselected button state */
  unselected: {
    bgcolor: 'transparent';
    color: 'text.primary';
  };
  /** Selected button state (bright green) */
  selected: {
    bgcolor: 'primary.main';
    color: 'primary.contrastText';
  };
}

/**
 * Color role semantic mapping
 * Defines the purpose of each color in the theme
 */
export interface ColorRole {
  /** Role identifier */
  role: 'structural' | 'active' | 'focus' | 'background' | 'surface' | 'text';
  /** Palette token path */
  token: string;
  /** Hex color value */
  value: string;
  /** Where this color is applied */
  application: string[];
}

/**
 * Header component theme configuration
 */
export interface HeaderThemeConfig {
  position: 'sticky';
  bgcolor: 'primary.dark';
  toolbar: {
    paddingX: {
      xs: 2;  // 16px mobile
      md: 4;  // 32px desktop
    };
  };
}

/**
 * Search bar component theme configuration
 */
export interface SearchBarThemeConfig {
  borderRadius: 8;  // px
  focus: {
    borderColor: 'secondary.main';
    outlineColor: 'secondary.main';
    outlineWidth: '2px';
    outlineOffset: '2px';
  };
}

/**
 * Data table component theme configuration
 */
export interface DataTableThemeConfig {
  paper: {
    bgcolor: '#272727';
    borderRadius: 2;
  };
  header: {
    bgcolor: 'primary.dark';
    color: 'primary.contrastText';
  };
  row: {
    zebraStripe: {
      odd: 'action.hover';
      even: 'transparent';
    };
    hover: 'action.selected';
    selected: {
      bgcolor: 'action.selected';
      borderLeft: '4px solid';
      borderColor: 'secondary.main';
    };
    cursor: 'pointer';
  };
}

/**
 * Main page layout configuration
 */
export interface MainLayoutConfig {
  container: {
    bgcolor: 'background.default';
    padding: {
      xs: 2;  // 16px mobile
      md: 4;  // 32px desktop
    };
  };
  /** Spacing between cards in theme units (3 = 24px) */
  cardSpacing: 3;
}

/**
 * Focus indicator configuration
 * Applied consistently across all interactive elements
 */
export interface FocusIndicatorConfig {
  /** Focus ring color */
  color: 'secondary.main';  // #ffb300
  /** Outline width */
  width: '2px' | '3px';
  /** Outline offset from element boundary */
  offset: '2px';
  /** CSS selector trigger */
  trigger: ':focus-visible';
}

/**
 * Accessibility contrast verification data
 */
export interface ContrastVerification {
  /** Text color (foreground) */
  foreground: string;
  /** Background color */
  background: string;
  /** Calculated contrast ratio */
  ratio: number;
  /** WCAG Level AA compliance status */
  passes: boolean;
  /** Text size category */
  textSize: 'normal' | 'large';
}

/**
 * Complete theme configuration
 * Combines all theme aspects into a single configuration object
 */
export interface ComfortablyDarkThemeConfig {
  /** MUI theme options */
  theme: ThemeOptions;
  /** Component-specific configurations */
  components: {
    header: HeaderThemeConfig;
    searchBar: SearchBarThemeConfig;
    dataTable: DataTableThemeConfig;
    mainLayout: MainLayoutConfig;
  };
  /** Floating card styling */
  floatingCard: FloatingCardStyleConfig;
  /** Focus indicator settings */
  focusIndicator: FocusIndicatorConfig;
  /** Color role definitions */
  colorRoles: ColorRole[];
  /** Accessibility verification data */
  accessibility: {
    contrastVerifications: ContrastVerification[];
    wcagLevel: 'AA';
  };
}

/**
 * Type guard to check if a theme is the dark theme
 */
export function isDarkTheme(theme: Theme): boolean {
  return theme.palette.mode === 'dark';
}

/**
 * Type guard to check if a contrast ratio passes WCAG AA
 */
export function passesWCAGAA(ratio: number, textSize: 'normal' | 'large'): boolean {
  return textSize === 'normal' ? ratio >= 4.5 : ratio >= 3.0;
}

/**
 * Helper type for sx prop with theme tokens
 */
export type ThemeTokenValue = 
  | 'background.default'
  | 'background.paper'
  | 'primary.main'
  | 'primary.dark'
  | 'primary.contrastText'
  | 'secondary.main'
  | 'secondary.contrastText'
  | 'text.primary'
  | 'text.secondary'
  | 'action.hover'
  | 'action.selected';

/**
 * Export all types for external use
 */
export type {
  Theme,
  ThemeOptions,
} from '@mui/material/styles';
