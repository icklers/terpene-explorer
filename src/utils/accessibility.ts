/**
 * Accessibility Utilities
 *
 * Provides utilities for ARIA labels, focus management, and screen reader support.
 * Ensures WCAG 2.1 Level AA compliance (NFR-A11Y-001 through NFR-A11Y-004).
 *
 * @see data-model.md for accessibility considerations
 */

import type { Effect } from '../models/Effect';
import type { Terpene } from '../models/Terpene';

/**
 * Generates a generic ARIA label from object properties
 *
 * @param obj - Object containing properties to include in label
 * @returns Human-readable ARIA label string
 */
export function generateAriaLabel(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

/**
 * Generates comprehensive ARIA label for a terpene
 *
 * Provides screen reader users with complete terpene information
 * without needing to navigate through nested elements.
 *
 * @param terpene - Terpene entity
 * @returns Screen-reader friendly description
 *
 * @example
 * "Limonene, a citrus-scented terpene with energizing and mood-enhancing effects, found in lemon peel and orange"
 */
export function generateTerpeneAriaLabel(terpene: Terpene): string {
  const effectsList = formatList(terpene.effects);
  const sourcesList = formatList(terpene.sources);

  const effectText = terpene.effects.length === 1 ? `${effectsList} effect` : `${effectsList} effects`;

  const sourceText = terpene.sources.length === 1 ? `found in ${sourcesList}` : `found in ${sourcesList}`;

  return `${terpene.name}, a ${terpene.aroma}-scented terpene with ${effectText}, ${sourceText}`;
}

/**
 * Generates ARIA label for an effect category
 *
 * @param effect - Effect entity
 * @param language - Current language ('en' or 'de')
 * @returns Accessible effect description with terpene count
 *
 * @example
 * "Calming effect, 5 terpenes"
 */
export function generateEffectAriaLabel(effect: Effect, language: 'en' | 'de' = 'en'): string {
  const displayName = effect.displayName[language];

  if (effect.terpeneCount !== undefined) {
    const countText = effect.terpeneCount === 1 ? `1 terpene` : `${effect.terpeneCount} terpenes`;

    return `${displayName} effect, ${countText}`;
  }

  return `${displayName} effect`;
}

/**
 * Formats an array into a grammatically correct list
 *
 * @param items - Array of strings
 * @param conjunction - Conjunction word ('and' or 'or')
 * @returns Formatted list string
 *
 * @example
 * formatList(['a', 'b', 'c']) => "a, b, and c"
 * formatList(['a', 'b']) => "a and b"
 * formatList(['a']) => "a"
 */
function formatList(items: string[], conjunction: 'and' | 'or' = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1]!;

  return `${allButLast}, ${conjunction} ${last}`;
}

/**
 * Announcement type for live regions
 */
type AnnouncementType = 'filter' | 'search' | 'viewChange' | 'error' | 'success';

/**
 * Generates announcement text for ARIA live regions
 *
 * Used to announce dynamic content changes to screen reader users.
 *
 * @param type - Type of announcement
 * @param data - Data for the announcement
 * @returns Announcement text for aria-live region
 *
 * @example
 * announceLiveRegion('filter', { count: 5, action: 'filtered' })
 * // => "Filtered results: 5 terpenes found"
 */
export function announceLiveRegion(type: AnnouncementType, data: Record<string, unknown>): string {
  const count = data.count as number;
  const query = data.query as string;
  const mode = data.mode as string;

  switch (type) {
    case 'filter': {
      if (count === 0) {
        return 'No terpenes found matching your filters';
      }
      const terpeneText = count === 1 ? 'terpene' : 'terpenes';
      return `Filtered results: ${count} ${terpeneText} found`;
    }

    case 'search': {
      if (count === 0) {
        return `No results found for "${query}"`;
      }
      const searchText = count === 1 ? 'result' : 'results';
      return `Search results: ${count} ${searchText} for "${query}"`;
    }

    case 'viewChange':
      return `View switched to ${mode} mode`;

    case 'error':
      return `Error: ${data.message}`;

    case 'success':
      return `Success: ${data.message}`;

    default:
      return String(data.message || '');
  }
}

/**
 * Focus trap utilities for modal dialogs and overlays
 */
export interface FocusTrap {
  activate: () => void;
  deactivate: () => void;
  getFocusableElements?: () => HTMLElement[];
}

/**
 * Creates a focus trap within a container element
 *
 * Ensures keyboard navigation stays within a specific element,
 * useful for modals and dialogs (WCAG 2.1 - Keyboard Accessible).
 *
 * @param container - Container element to trap focus within
 * @returns Focus trap controller
 *
 * @example
 * const trap = trapFocus(modalElement);
 * trap.activate(); // Trap focus inside modal
 * // ... user interacts with modal
 * trap.deactivate(); // Release focus trap
 */
export function trapFocus(container: HTMLElement): FocusTrap {
  const focusableSelectors =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let firstFocusable: HTMLElement | null = null;
  let lastFocusable: HTMLElement | null = null;

  const updateFocusableElements = () => {
    const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));

    firstFocusable = elements[0] || null;
    lastFocusable = elements[elements.length - 1] || null;

    return elements;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = updateFocusableElements();

    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    // Shift + Tab: moving backwards
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    }
    // Tab: moving forwards
    else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  return {
    activate: () => {
      updateFocusableElements();
      container.addEventListener('keydown', handleKeyDown);
      firstFocusable?.focus();
    },

    deactivate: () => {
      container.removeEventListener('keydown', handleKeyDown);
    },

    getFocusableElements: updateFocusableElements,
  };
}

/**
 * Sets up skip navigation link for keyboard users
 *
 * Allows keyboard users to skip repetitive navigation and jump to main content.
 * Implements WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks).
 *
 * @param targetId - ID of the main content element to skip to
 * @returns Cleanup function to remove event listener
 */
export function setupSkipNavigation(targetId: string): () => void {
  const handleSkip = (e: KeyboardEvent) => {
    // Activate on Alt+S or custom keyboard shortcut
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      const target = document.getElementById(targetId);
      target?.focus();
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  document.addEventListener('keydown', handleSkip);

  return () => {
    document.removeEventListener('keydown', handleSkip);
  };
}

/**
 * Announces content to screen readers without visual display
 *
 * Creates a temporary visually-hidden element with aria-live="polite"
 * to announce dynamic content changes.
 *
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive'
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Assumes .sr-only CSS class exists
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is made
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
