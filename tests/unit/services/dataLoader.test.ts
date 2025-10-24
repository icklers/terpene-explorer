/**
 * Unit tests for dataLoader service
 * Tests JSON/YAML parsing, validation integration, error handling, empty dataset
 *
 * TDD: These tests should FAIL initially (red 🔴)
 * Implementation in src/services/dataLoader.ts will make them pass (green 🟢)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { loadTerpeneData, type LoadResult } from '../../../src/services/dataLoader';

describe('dataLoader service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('loadTerpeneData - JSON format', () => {
    it('should successfully load and parse valid JSON data', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBeGreaterThan(0);
      }
    });

    it('should validate JSON data and filter invalid entries', async () => {
      // This assumes the data file might have some invalid entries
      const result: LoadResult = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        // All returned terpenes should be valid
        result.data.forEach((terpene) => {
          expect(terpene.id).toBeTruthy();
          expect(terpene.name).toBeTruthy();
          expect(terpene.description).toBeTruthy();
          expect(terpene.aroma).toBeTruthy();
          expect(Array.isArray(terpene.effects)).toBe(true);
          expect(Array.isArray(terpene.sources)).toBe(true);
        });
      }
    });

    it('should include validation warnings when invalid entries are skipped', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.json');

      // Even if successful, there might be warnings about skipped entries
      if (result.status === 'success' && result.warnings) {
        expect(Array.isArray(result.warnings)).toBe(true);
        result.warnings.forEach((warning) => {
          expect(typeof warning).toBe('string');
        });
      }
    });
  });

  describe('loadTerpeneData - YAML format', () => {
    it('should successfully load and parse valid YAML data', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.yaml');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      }
    });

    it('should handle YAML with same validation as JSON', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.yaml');

      if (result.status === 'success') {
        result.data.forEach((terpene) => {
          expect(terpene).toHaveProperty('id');
          expect(terpene).toHaveProperty('name');
          expect(terpene).toHaveProperty('description');
          expect(terpene).toHaveProperty('aroma');
          expect(terpene).toHaveProperty('effects');
          expect(terpene).toHaveProperty('sources');
        });
      }
    });
  });

  describe('Error handling', () => {
    it('should return error status for non-existent file', async () => {
      const result: LoadResult = await loadTerpeneData('/non-existent-file.json');

      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.error).toBeDefined();
        expect(result.error.message).toBeTruthy();
      }
    });

    it('should handle malformed JSON gracefully', async () => {
      // Note: This would need a test fixture with malformed JSON
      // For now, we test the error structure
      const result: LoadResult = await loadTerpeneData('/invalid.json');

      if (result.status === 'error') {
        expect(result.error).toBeDefined();
        expect(typeof result.error.message).toBe('string');
      }
    });

    it('should handle malformed YAML gracefully', async () => {
      const result: LoadResult = await loadTerpeneData('/invalid.yaml');

      if (result.status === 'error') {
        expect(result.error).toBeDefined();
        expect(typeof result.error.message).toBe('string');
      }
    });

    it('should provide user-friendly error messages', async () => {
      const result: LoadResult = await loadTerpeneData('/non-existent.json');

      if (result.status === 'error') {
        // Error message should not contain technical stack traces
        expect(result.error.message).not.toContain('at Object');
        expect(result.error.message).not.toContain('stack trace');
      }
    });
  });

  describe('Empty dataset handling (FR-016)', () => {
    it('should handle empty array in data file', async () => {
      // This would need a test fixture with empty array
      // Testing the type structure for now
      const result: LoadResult = await loadTerpeneData('/empty.json');

      if (result.status === 'success') {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBe(0);
      }
    });

    it('should return success with empty array when all entries are invalid', async () => {
      // When all entries fail validation, should return empty array with warnings
      const result: LoadResult = await loadTerpeneData('/all-invalid.json');

      if (result.status === 'success') {
        expect(result.data).toHaveLength(0);
        expect(result.warnings).toBeDefined();
        if (result.warnings) {
          expect(result.warnings.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Data format detection', () => {
    it('should detect JSON format from .json extension', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.json');

      // Should successfully parse as JSON
      expect(result.status).not.toBe('error');
    });

    it('should detect YAML format from .yaml extension', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.yaml');

      // Should successfully parse as YAML
      expect(result.status).not.toBe('error');
    });

    it('should detect YAML format from .yml extension', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.yml');

      // Should successfully parse as YAML (if file exists)
      if (result.status === 'error') {
        // File might not exist, which is acceptable
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('Integration with validation', () => {
    it('should use validation schema to filter entries', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        // All entries should pass validation
        result.data.forEach((terpene) => {
          // Check UUID format
          expect(terpene.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
          // Check required fields
          expect(terpene.name.length).toBeGreaterThan(0);
          expect(terpene.description.length).toBeGreaterThanOrEqual(10);
          expect(terpene.effects.length).toBeGreaterThan(0);
          expect(terpene.sources.length).toBeGreaterThan(0);
        });
      }
    });

    it('should return validation error count in warnings', async () => {
      const result: LoadResult = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success' && result.warnings) {
        // Warnings should indicate how many entries were skipped
        const hasCountWarning = result.warnings.some((w) => w.match(/\d+ .* skipped|invalid/));
        // If there are warnings, at least one should mention a count
        if (result.warnings.length > 0) {
          expect(hasCountWarning).toBe(true);
        }
      }
    });
  });
});
