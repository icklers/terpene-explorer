/**
 * Version Utility
 *
 * Provides access to application version information
 * Version is defined as a constant for now (can be made dynamic later)
 */

const APP_VERSION = '1.4.0';

/**
 * Get the current application version
 *
 * @returns Version string
 */
export function getAppVersion(): string {
  return APP_VERSION;
}

/**
 * Get formatted version string for display
 *
 * @returns Formatted version string (e.g., "v1.4.0")
 */
export function getFormattedVersion(): string {
  return `v${getAppVersion()}`;
}
