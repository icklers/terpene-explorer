/**
 * useSwipeToClose Hook
 *
 * Custom hook for implementing swipe-down-to-close gesture on mobile modals.
 * Detects vertical swipe gestures with velocity threshold for dismissal.
 *
 * @see tasks.md T003
 */

import { useState, useCallback, useRef } from 'react';

interface UseSwipeToCloseOptions {
  /** Minimum drag distance in pixels to trigger close (default: 100px) */
  distanceThreshold?: number;
  /** Minimum velocity in px/ms to trigger close (default: 0.5px/ms) */
  velocityThreshold?: number;
  /** Callback when swipe-to-close is triggered */
  onClose: () => void;
  /** Whether swipe-to-close is enabled (default: true) */
  enabled?: boolean;
}

interface UseSwipeToCloseReturn {
  /** Current Y-axis drag distance in pixels */
  deltaY: number;
  /** Whether swipe gesture is currently active */
  isDragging: boolean;
  /** Opacity value for visual feedback during swipe (0.5-1.0) */
  opacity: number;
  /** Touch start event handler */
  handleTouchStart: (e: React.TouchEvent) => void;
  /** Touch move event handler */
  handleTouchMove: (e: React.TouchEvent) => void;
  /** Touch end event handler */
  handleTouchEnd: () => void;
}

/**
 * Hook for managing swipe-to-close gesture detection
 *
 * @param options - Configuration options
 * @returns Swipe state and event handlers
 *
 * @example
 * ```tsx
 * function Modal({ onClose }) {
 *   const { deltaY, opacity, handleTouchStart, handleTouchMove, handleTouchEnd } =
 *     useSwipeToClose({ onClose });
 *
 *   return (
 *     <Box
 *       onTouchStart={handleTouchStart}
 *       onTouchMove={handleTouchMove}
 *       onTouchEnd={handleTouchEnd}
 *       sx={{
 *         transform: `translateY(${Math.max(0, deltaY)}px)`,
 *         opacity,
 *         transition: deltaY === 0 ? 'all 0.3s ease' : 'none'
 *       }}
 *     >
 *       {/ * modal content * /}
 *     </Box>
 *   );
 * }
 * ```
 */
export function useSwipeToClose(options: UseSwipeToCloseOptions): UseSwipeToCloseReturn {
  const {
    distanceThreshold = 100,
    velocityThreshold = 0.5,
    onClose,
    enabled = true,
  } = options;

  const [deltaY, setDeltaY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Refs to track touch state without causing re-renders
  const startY = useRef(0);
  const startTime = useRef(0);
  const currentY = useRef(0);

  /**
   * Handle touch start event
   */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      const touch = e.touches[0];
      if (!touch) return;

      startY.current = touch.clientY;
      startTime.current = Date.now();
      currentY.current = touch.clientY;
      setIsDragging(true);
    },
    [enabled]
  );

  /**
   * Handle touch move event
   */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !isDragging) return;

      const touch = e.touches[0];
      if (!touch) return;

      currentY.current = touch.clientY;
      const delta = currentY.current - startY.current;

      // Only allow downward swipe (positive delta)
      if (delta > 0) {
        setDeltaY(delta);
      }
    },
    [enabled, isDragging]
  );

  /**
   * Handle touch end event
   */
  const handleTouchEnd = useCallback(() => {
    if (!enabled) return;

    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - startTime.current;
    const distance = deltaY;

    // Calculate velocity (px/ms)
    const velocity = touchDuration > 0 ? distance / touchDuration : 0;

    // Trigger close if either threshold is met:
    // 1. Distance threshold: dragged far enough
    // 2. Velocity threshold: fast swipe
    const shouldClose = distance > distanceThreshold || velocity > velocityThreshold;

    if (shouldClose) {
      onClose();
    }

    // Reset state
    setDeltaY(0);
    setIsDragging(false);
    startY.current = 0;
    startTime.current = 0;
    currentY.current = 0;
  }, [enabled, deltaY, distanceThreshold, velocityThreshold, onClose]);

  // Calculate opacity for visual feedback
  // As user drags down, opacity reduces from 1.0 to 0.5
  // Formula: opacity = max(0.5, 1 - (deltaY / distanceThreshold) * 0.5)
  const opacity = Math.max(0.5, 1 - (deltaY / (distanceThreshold * 2)));

  return {
    deltaY,
    isDragging,
    opacity,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
