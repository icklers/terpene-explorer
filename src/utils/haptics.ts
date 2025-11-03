/**
 * Haptic Feedback Utility
 *
 * Provides cross-platform haptic feedback with graceful fallback for
 * devices that don't support the Vibration API.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 * @see tasks.md T001
 */

/**
 * Triggers haptic feedback vibration on supported devices
 *
 * @param duration - Vibration duration in milliseconds (default: 10ms for subtle feedback)
 * @returns void
 *
 * @example
 * ```tsx
 * // Subtle tap feedback
 * triggerHapticFeedback(10);
 *
 * // More pronounced feedback
 * triggerHapticFeedback(25);
 * ```
 */
export function triggerHapticFeedback(duration: number = 10): void {
  // Check if Vibration API is supported
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (error) {
      // Fallback: silent failure on unsupported/restricted devices
      // Some browsers support the API but restrict usage in certain contexts
      console.debug('Haptic feedback not available:', error);
    }
  } else {
    // API not supported - no action needed (graceful degradation)
    console.debug('Vibration API not supported on this device');
  }
}

/**
 * Checks if haptic feedback is available on the current device
 *
 * @returns true if Vibration API is supported, false otherwise
 *
 * @example
 * ```tsx
 * if (isHapticFeedbackSupported()) {
 *   // Show haptic feedback toggle in settings
 * }
 * ```
 */
export function isHapticFeedbackSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Preset haptic patterns for common interactions
 */
export const HapticPattern = {
  /** Subtle tap feedback (10ms) */
  TAP: 10,
  /** Button press feedback (15ms) */
  PRESS: 15,
  /** Success confirmation (25ms) */
  SUCCESS: 25,
  /** Error notification (50ms) */
  ERROR: 50,
  /** Swipe gesture feedback (pattern: 10ms vibrate, 50ms pause, 10ms vibrate) */
  SWIPE: [10, 50, 10],
} as const satisfies Record<string, number | number[]>;
