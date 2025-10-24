/**
 * Input Sanitization Tests
 *
 * Tests for XSS prevention in user input (search, filters, etc.).
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T095 (NFR-SEC-001)
 */

import { describe, it, expect } from 'vitest';

import { sanitizeInput, sanitizeSearchQuery } from '../../../src/utils/sanitize';

describe('sanitizeInput', () => {
  describe('Basic Text Sanitization', () => {
    it('should return plain text unchanged', () => {
      const result = sanitizeInput('hello world');
      expect(result).toBe('hello world');
    });

    it('should preserve numbers and letters', () => {
      const result = sanitizeInput('abc123 XYZ 789');
      expect(result).toBe('abc123 XYZ 789');
    });

    it('should preserve common punctuation', () => {
      const result = sanitizeInput('Hello, world! How are you?');
      expect(result).toBe('Hello, world! How are you?');
    });

    it('should preserve spaces and basic formatting', () => {
      const result = sanitizeInput('  spaced   text  ');
      expect(result).toBe('  spaced   text  ');
    });
  });

  describe('XSS Attack Prevention', () => {
    it('should remove script tags', () => {
      const result = sanitizeInput('<script>alert("XSS")</script>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).not.toContain('alert');
    });

    it('should remove script tags with attributes', () => {
      const result = sanitizeInput('<script type="text/javascript">alert("XSS")</script>');
      expect(result).not.toContain('<script');
      expect(result).not.toContain('alert');
    });

    it('should remove inline event handlers', () => {
      const result = sanitizeInput('<img src="x" onerror="alert(1)">');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
    });

    it('should remove javascript: protocol', () => {
      const result = sanitizeInput('<a href="javascript:alert(1)">click</a>');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('alert');
    });

    it('should remove data: URIs with scripts', () => {
      const result = sanitizeInput('<a href="data:text/html,<script>alert(1)</script>">click</a>');
      expect(result).not.toContain('data:');
      expect(result).not.toContain('alert');
    });

    it('should remove iframe tags', () => {
      const result = sanitizeInput('<iframe src="evil.com"></iframe>');
      expect(result).not.toContain('<iframe');
      expect(result).not.toContain('</iframe>');
    });

    it('should remove object and embed tags', () => {
      const result = sanitizeInput('<object data="evil.swf"></object>');
      expect(result).not.toContain('<object');
      expect(result).not.toContain('</object>');
    });

    it('should handle mixed case tags', () => {
      const result = sanitizeInput('<ScRiPt>alert(1)</ScRiPt>');
      expect(result).not.toContain('ScRiPt');
      expect(result).not.toContain('alert');
    });

    it('should remove event handlers with various casing', () => {
      const result = sanitizeInput('<div OnClick="alert(1)">text</div>');
      expect(result).not.toContain('OnClick');
      expect(result).not.toContain('alert');
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should escape SQL-like patterns', () => {
      const result = sanitizeInput("' OR '1'='1");
      // Should escape or remove dangerous characters
      expect(result).not.toContain("'1'='1");
    });

    it('should handle SQL comments', () => {
      const result = sanitizeInput('test -- comment');
      expect(result).toBeTruthy();
    });
  });

  describe('Special Characters', () => {
    it('should handle HTML entities correctly', () => {
      const result = sanitizeInput('&lt;script&gt;');
      // Should not double-escape or corrupt
      expect(result).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      const result = sanitizeInput('Café résumé 日本語');
      expect(result).toContain('Café');
      expect(result).toContain('résumé');
      expect(result).toContain('日本語');
    });

    it('should handle emoji', () => {
      const result = sanitizeInput('Hello 👋 World 🌍');
      expect(result).toContain('👋');
      expect(result).toContain('🌍');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('should handle whitespace-only string', () => {
      const result = sanitizeInput('   ');
      expect(result).toBe('   ');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const result = sanitizeInput(longString);
      expect(result).toBeTruthy();
      expect(result.length).toBeLessThanOrEqual(10000);
    });

    it('should handle null gracefully', () => {
      const result = sanitizeInput(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined gracefully', () => {
      const result = sanitizeInput(undefined as any);
      expect(result).toBe('');
    });

    it('should handle numbers', () => {
      const result = sanitizeInput(12345 as any);
      expect(result).toBe('12345');
    });
  });
});

describe('sanitizeSearchQuery', () => {
  describe('Search-Specific Sanitization', () => {
    it('should preserve search-friendly characters', () => {
      const result = sanitizeSearchQuery('alpha-beta_gamma');
      expect(result).toBe('alpha-beta_gamma');
    });

    it('should allow parentheses for search', () => {
      const result = sanitizeSearchQuery('terpene (limonene)');
      expect(result).toContain('(');
      expect(result).toContain(')');
    });

    it('should trim whitespace', () => {
      const result = sanitizeSearchQuery('  search term  ');
      expect(result).toBe('search term');
    });

    it('should normalize multiple spaces', () => {
      const result = sanitizeSearchQuery('multiple    spaces');
      expect(result).toBe('multiple spaces');
    });

    it('should remove XSS attempts from search', () => {
      const result = sanitizeSearchQuery('<script>alert(1)</script>terpene');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should preserve legitimate search terms', () => {
      const result = sanitizeSearchQuery('calming energizing');
      expect(result).toBe('calming energizing');
    });

    it('should handle special search operators safely', () => {
      const result = sanitizeSearchQuery('terpene AND limonene');
      expect(result).toContain('terpene');
      expect(result).toContain('limonene');
    });
  });

  describe('Length Limits', () => {
    it('should enforce reasonable length limits', () => {
      const longQuery = 'a'.repeat(1000);
      const result = sanitizeSearchQuery(longQuery);
      expect(result.length).toBeLessThanOrEqual(500);
    });

    it('should handle empty search query', () => {
      const result = sanitizeSearchQuery('');
      expect(result).toBe('');
    });
  });
});
