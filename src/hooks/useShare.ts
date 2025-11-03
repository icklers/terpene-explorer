/**
 * useShare Hook
 *
 * Custom hook for sharing content using Web Share API with clipboard fallback.
 * Provides cross-platform sharing for terpene information.
 *
 * @see tasks.md T003, T007
 */

import { useState, useCallback } from 'react';

interface ShareData {
  /** Title of the shared content */
  title: string;
  /** Text content to share */
  text: string;
  /** URL to share */
  url?: string;
}

interface UseShareOptions {
  /** Callback when share/copy is successful */
  onSuccess?: () => void;
  /** Callback when share/copy fails */
  onError?: (error: Error) => void;
}

interface UseShareReturn {
  /** Current share status */
  status: 'idle' | 'sharing' | 'success' | 'error';
  /** Error message if status is 'error' */
  error: string | null;
  /** Function to trigger share action */
  share: (data: ShareData) => Promise<void>;
  /** Whether Web Share API is supported */
  isShareSupported: boolean;
}

/**
 * Hook for sharing content with Web Share API and clipboard fallback
 *
 * @param options - Configuration options
 * @returns Share state and trigger function
 *
 * @example
 * ```tsx
 * function ShareButton({ terpene }) {
 *   const { share, status, isShareSupported } = useShare({
 *     onSuccess: () => console.log('Shared!'),
 *     onError: (error) => console.error('Share failed:', error)
 *   });
 *
 *   const handleShare = () => {
 *     share({
 *       title: terpene.name,
 *       text: `${terpene.name} - ${terpene.description}`,
 *       url: window.location.href
 *     });
 *   };
 *
 *   return (
 *     <Button onClick={handleShare}>
 *       {isShareSupported ? 'Share' : 'Copy Link'}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useShare(options: UseShareOptions = {}): UseShareReturn {
  const { onSuccess, onError } = options;

  const [status, setStatus] = useState<'idle' | 'sharing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Check if Web Share API is supported
  const isShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  /**
   * Share content using Web Share API or clipboard fallback
   */
  const share = useCallback(
    async (data: ShareData): Promise<void> => {
      setStatus('sharing');
      setError(null);

      try {
        // Try Web Share API first (mobile devices, some desktop browsers)
        if (isShareSupported && navigator.canShare && navigator.canShare(data)) {
          await navigator.share(data);
          setStatus('success');
          onSuccess?.();
        } else if (isShareSupported) {
          // Share API exists but can't share this data - try anyway
          await navigator.share(data);
          setStatus('success');
          onSuccess?.();
        } else {
          // Fallback to clipboard copy (desktop browsers)
          const textToShare = [data.title, data.text, data.url].filter(Boolean).join('\n');

          if (!navigator.clipboard) {
            throw new Error('Clipboard API not available');
          }

          await navigator.clipboard.writeText(textToShare);
          setStatus('success');
          onSuccess?.();
        }
      } catch (err) {
        // Handle user cancellation (not an error)
        if (err instanceof Error && err.name === 'AbortError') {
          setStatus('idle');
          return;
        }

        // Handle actual errors
        const errorMessage = err instanceof Error ? err.message : 'Failed to share';
        setError(errorMessage);
        setStatus('error');
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    },
    [isShareSupported, onSuccess, onError]
  );

  return {
    status,
    error,
    share,
    isShareSupported,
  };
}
