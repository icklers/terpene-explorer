/**
 * Theme Augmentation
 *
 * Extends Material UI theme with custom category color tokens
 * for the categorized effect filters feature
 */

declare module '@mui/material/styles' {
  interface Palette {
    category: {
      mood: string;
      cognitive: string;
      relaxation: string;
      physical: string;
    };
  }

  interface PaletteOptions {
    category?: {
      mood?: string;
      cognitive?: string;
      relaxation?: string;
      physical?: string;
    };
  }
}

// Ensure the augmentation is properly loaded
export {};
