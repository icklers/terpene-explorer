/**
 * useHeaderCollapse Hook
 *
 * Custom hook for implementing scroll-triggered header collapse/expand behavior.
 * Follows iOS Safari pattern: collapse on scroll-down, expand on scroll-up.
 *
 * @see tasks.md T001
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseHeaderCollapseOptions {
  /** Scroll distance threshold to trigger collapse (default: 50px) */
  threshold?: number;
  /** Debounce delay for scroll events (default: 10ms for smooth response) */
  debounceDelay?: number;
}

interface UseHeaderCollapseReturn {
  /** Whether the header should be collapsed */
  isCollapsed: boolean;
  /** Current scroll position in pixels */
  scrollY: number;
}

/**
 * Hook for managing header collapse state based on scroll direction
 *
 * @param options - Configuration options
 * @returns Header collapse state and scroll position
 *
 * @example
 * ```tsx
 * function AppBar() {
 *   const { isCollapsed } = useHeaderCollapse({ threshold: 50 });
 *
 *   return (
 *     <MuiAppBar
 *       sx={{
 *         transform: isCollapsed ? 'translateY(-100%)' : 'translateY(0)',
 *         transition: 'transform 0.3s ease-in-out'
 *       }}
 *     >
 *       {/ * content * /}
 *     </MuiAppBar>
 *   );
 * }
 * ```
 */
export function useHeaderCollapse(options: UseHeaderCollapseOptions = {}): UseHeaderCollapseReturn {
  const { threshold = 50, debounceDelay = 10 } = options;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Track previous scroll position for direction detection
  const prevScrollY = useRef(0);
  const debounceTimer = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Update scroll position
    setScrollY(currentScrollY);

    // Determine scroll direction
    const scrollingDown = currentScrollY > prevScrollY.current;
    const scrollingUp = currentScrollY < prevScrollY.current;

    // Only collapse/expand if scroll distance exceeds threshold
    const hasScrolledEnough = Math.abs(currentScrollY - prevScrollY.current) > threshold;

    if (hasScrolledEnough) {
      if (scrollingDown && currentScrollY > threshold) {
        // Scrolling down past threshold → collapse header
        setIsCollapsed(true);
      } else if (scrollingUp || currentScrollY <= threshold) {
        // Scrolling up OR at top of page → expand header
        setIsCollapsed(false);
      }

      // Update previous scroll position
      prevScrollY.current = currentScrollY;
    }
  }, [threshold]);

  useEffect(() => {
    // Debounced scroll handler for performance
    const debouncedHandleScroll = () => {
      if (debounceTimer.current !== null) {
        window.clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = window.setTimeout(() => {
        handleScroll();
      }, debounceDelay);
    };

    // Add scroll listener
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    // Initial call to set state
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      if (debounceTimer.current !== null) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, [handleScroll, debounceDelay]);

  return { isCollapsed, scrollY };
}
