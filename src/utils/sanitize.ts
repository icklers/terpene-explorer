/**
 * Input Sanitization Utilities
 *
 * Functions to sanitize user input and prevent XSS attacks (NFR-SEC-001).
 * All user-provided strings should be sanitized before use in the application.
 *
 * @see tasks.md T095
 */

/**
 * Sanitize general user input to prevent XSS attacks
 *
 * Removes HTML tags, script elements, and dangerous attributes.
 * This is a basic sanitization - for complex HTML, use DOMPurify library.
 *
 * @param input - Raw user input
 * @returns Sanitized string safe for display
 */
export function sanitizeInput(input: unknown): string {
  // Handle null/undefined
  if (input === null || input === undefined) {
    return '';
  }

  // Convert to string
  const str = String(input);

  // Remove HTML tags and script content
  let sanitized = str
    // Remove script tags and their content (case-insensitive)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove other dangerous tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*>/gi, '')
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove event handlers (onerror, onclick, etc.)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: URIs (potential XSS vector)
    .replace(/data:text\/html/gi, '')
    // Remove SQL-like patterns
    .replace(/['"].*?['"]\s*=\s*['"].*?['"]/g, '')
    // Decode HTML entities to prevent double-escaping
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Re-encode to prevent XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized;
}

/**
 * Sanitize search query input
 *
 * More permissive than general sanitization to allow search-friendly characters
 * while still preventing XSS attacks. Trims whitespace and normalizes spaces.
 *
 * @param query - Search query string
 * @returns Sanitized search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) {
    return '';
  }

  // First, apply general sanitization to remove XSS vectors
  let sanitized = sanitizeInput(query);

  // Decode HTML entities for search (user expects to search for actual characters)
  sanitized = sanitized
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Normalize multiple spaces to single space
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Enforce maximum length (prevent DoS via extremely long queries)
  const MAX_QUERY_LENGTH = 500;
  if (sanitized.length > MAX_QUERY_LENGTH) {
    sanitized = sanitized.substring(0, MAX_QUERY_LENGTH);
  }

  return sanitized;
}

/**
 * Sanitize HTML for safe display
 *
 * Escapes HTML entities to prevent XSS when displaying user content.
 * Use this when you need to display user input as-is but safely.
 *
 * @param html - HTML string to escape
 * @returns Escaped HTML safe for innerHTML
 */
export function escapeHtml(html: string): string {
  if (!html) {
    return '';
  }

  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize URL
 *
 * Ensures URLs are safe and well-formed. Blocks dangerous protocols.
 *
 * @param url - URL string to validate
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) {
    return '';
  }

  const sanitized = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(sanitized)) {
    return '';
  }

  // Only allow http, https, mailto
  const allowedProtocols = /^(https?:|mailto:|\/)/i;
  if (!allowedProtocols.test(sanitized) && !sanitized.startsWith('#')) {
    return '';
  }

  return sanitized;
}
