/**
 * TerpeneCardGrid Component Contract
 *
 * Mobile-optimized card grid for displaying terpenes.
 * Replaces table view on small screens with touch-friendly cards.
 * Supports virtual scrolling for performance with large datasets.
 */

import { Terpene } from '../../../src/types/terpene';

export interface TerpeneCardGridProps {
  /**
   * Array of terpenes to display (already filtered)
   */
  terpenes: Terpene[];

  /**
   * Handler called when a card is clicked
   * @param terpene - The clicked terpene object
   */
  onTerpeneClick: (terpene: Terpene) => void;

  /**
   * Whether to enable virtual scrolling
   * @default true when terpenes.length > 50
   */
  enableVirtualization?: boolean;

  /**
   * Estimated card height for virtual scrolling
   * @default 180 (px)
   */
  estimatedCardHeight?: number;

  /**
   * Number of cards to render outside viewport (overscan)
   * @default 5
   */
  overscan?: number;
}

/**
 * Card display data (transformed from full Terpene)
 */
export interface TerpeneCardData {
  id: string;
  name: string;
  aroma: string;
  topEffects: string[]; // Max 3 effects shown
  additionalEffectCount: number; // e.g., "+2 more"
}

/**
 * Component Behavior Specifications
 *
 * ## Grid Layout
 * - Mobile (< 600px): 1 column, full width
 * - Tablet (600-960px): 2 columns, 16px gap
 * - Desktop: Falls back to table view (not rendered)
 *
 * ## Card Design
 * - Min height: 120px
 * - Padding: 16px
 * - Border radius: 8px
 * - Elevation: 1 (raised to 4 on hover/active)
 * - Full card is tappable area
 *
 * ## Card Content
 * 1. Terpene name (H6, 18px, bold)
 * 2. Aroma description (Body2, 14px, secondary color)
 * 3. Effect chips (horizontal scroll if >3):
 *    - First 3 effects shown as colored chips
 *    - "+X more" chip if additional effects exist
 * 4. "View Details →" link (bottom-right, caption, primary color)
 *
 * ## Interactions
 *
 * ### Tap Feedback
 * - On touch down: Scale to 0.98, shadow elevation +3
 * - On touch up: Return to normal scale
 * - Duration: 200ms ease-out
 *
 * ### Virtual Scrolling (>50 items)
 * - Only renders visible cards + overscan
 * - Uses TanStack Virtual for smooth performance
 * - Maintains scroll position on re-render
 * - Dynamic row heights supported
 *
 * ## Accessibility
 * - Each card has role="button" and tabindex="0"
 * - Card name has aria-label: "View details for {terpene.name}"
 * - Effect chips have aria-label: "{effect} effect"
 * - Keyboard: Enter or Space activates card
 *
 * ## Performance
 * - Virtual scrolling threshold: 50 terpenes
 * - Card render time budget: <16ms per card (60fps)
 * - Effect translations cached via useMemo
 * - Grid uses CSS Grid for hardware-accelerated layout
 *
 * ## Responsive Breakpoints
 * - xs (0-600px): 1 column, 16px side padding
 * - sm (600-960px): 2 columns, 24px side padding
 * - md+ (960px+): Table view (CardGrid not rendered)
 *
 * @example
 * ```tsx
 * <TerpeneCardGrid
 *   terpenes={filteredTerpenes}
 *   onTerpeneClick={handleOpenModal}
 *   enableVirtualization={filteredTerpenes.length > 50}
 * />
 * ```
 */
export const TerpeneCardGridContract = {
  componentName: 'TerpeneCardGrid',
  version: '1.0.0',
  virtualizationThreshold: 50, // number of items
  estimatedCardHeight: 180, // px
  defaultOverscan: 5, // cards
  minCardHeight: 120, // px
  cardPadding: 16, // px
  cardBorderRadius: 8, // px
  gridGap: 16, // px (mobile) / 24px (tablet)
  transitionDuration: 200, // ms
  columns: {
    mobile: 1,
    tablet: 2,
  },
  effectChips: {
    maxVisible: 3,
    height: 24, // px
    fontSize: 12, // px
  },
} as const;
