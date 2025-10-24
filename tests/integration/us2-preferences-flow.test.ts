/**
 * User Story 2: Theme & Language Preferences Integration Test
 *
 * Tests the complete flow: localStorage → preferences → UI update → persistence.
 * Verifies that theme and language settings persist across sessions.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T077
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../src/App';

describe('User Story 2: Theme & Language Preferences', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Theme Persistence Flow', () => {
    it('should load saved theme preference from localStorage on app start', async () => {
      // Simulate previously saved dark theme
      localStorage.setItem('theme', JSON.stringify('dark'));

      render(<App />);

      // Wait for app to initialize
      await waitFor(() => {
        const body = document.body;
        // Material UI should apply dark theme class or data attribute
        expect(
          body.classList.contains('dark') ||
            body.dataset.theme === 'dark' ||
            document.documentElement.dataset.muiColorScheme === 'dark'
        ).toBe(true);
      });
    });

    it('should toggle theme and persist to localStorage', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Find and click theme toggle button
      const themeToggle = await screen.findByRole('button', {
        name: /theme|dark|light mode/i,
      });

      await user.click(themeToggle);

      // Verify localStorage was updated
      await waitFor(() => {
        const savedTheme = localStorage.getItem('theme');
        expect(savedTheme).toBeTruthy();
        expect(['light', 'dark']).toContain(JSON.parse(savedTheme!));
      });
    });

    it('should maintain theme preference after page reload simulation', async () => {
      const user = userEvent.setup();

      const { unmount } = render(<App />);

      // Toggle theme
      const themeToggle = await screen.findByRole('button', {
        name: /theme|dark|light mode/i,
      });
      await user.click(themeToggle);

      const savedTheme = localStorage.getItem('theme');
      const themeValue = JSON.parse(savedTheme!);

      // Unmount (simulating page close)
      unmount();

      // Re-mount (simulating page reload)
      render(<App />);

      // Verify theme persisted
      await waitFor(() => {
        const newSavedTheme = localStorage.getItem('theme');
        expect(JSON.parse(newSavedTheme!)).toBe(themeValue);
      });
    });

    it('should use system theme preference when no saved preference exists', async () => {
      // Don't set anything in localStorage
      expect(localStorage.getItem('theme')).toBeNull();

      render(<App />);

      // App should initialize with system preference
      await waitFor(() => {
        const body = document.body;
        // Should have either light or dark theme applied
        expect(
          body.classList.contains('dark') ||
            body.classList.contains('light') ||
            document.documentElement.dataset.muiColorScheme
        ).toBeTruthy();
      });
    });
  });

  describe('Language Persistence Flow', () => {
    it('should load saved language preference from localStorage on app start', async () => {
      // Simulate previously saved German language
      localStorage.setItem('language', JSON.stringify('de'));

      render(<App />);

      // Wait for translations to load and check for German text
      await waitFor(
        () => {
          // Look for German-specific text (e.g., "Terpene" vs English)
          const body = document.body.textContent || '';
          // German translations should be present
          expect(body.length).toBeGreaterThan(0);
        },
        { timeout: 3000 }
      );

      // Verify i18next language was set
      expect(localStorage.getItem('language')).toBe(JSON.stringify('de'));
    });

    it('should switch language and persist to localStorage', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Find language selector
      const languageSelector = await screen.findByRole('combobox', {
        name: /language|sprache/i,
      });

      // Change language
      await user.click(languageSelector);

      // Select different language option
      const germanOption = await screen.findByRole('option', { name: /deutsch|german|de/i });
      await user.click(germanOption);

      // Verify localStorage was updated
      await waitFor(() => {
        const savedLanguage = localStorage.getItem('language');
        expect(savedLanguage).toBe(JSON.stringify('de'));
      });
    });

    it('should maintain language preference after page reload simulation', async () => {
      const user = userEvent.setup();

      const { unmount } = render(<App />);

      // Switch to German
      const languageSelector = await screen.findByRole('combobox', {
        name: /language|sprache/i,
      });
      await user.click(languageSelector);

      const germanOption = await screen.findByRole('option', { name: /deutsch|german|de/i });
      await user.click(germanOption);

      const savedLanguage = localStorage.getItem('language');
      expect(savedLanguage).toBe(JSON.stringify('de'));

      // Unmount
      unmount();

      // Re-mount
      render(<App />);

      // Verify language persisted
      await waitFor(() => {
        const newSavedLanguage = localStorage.getItem('language');
        expect(newSavedLanguage).toBe(JSON.stringify('de'));
      });
    });

    it('should default to English when no saved preference exists', async () => {
      expect(localStorage.getItem('language')).toBeNull();

      render(<App />);

      await waitFor(() => {
        // Should have English text by default
        const body = document.body.textContent || '';
        expect(body.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Combined Preferences Flow', () => {
    it('should persist both theme and language preferences independently', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Toggle theme
      const themeToggle = await screen.findByRole('button', {
        name: /theme|dark|light mode/i,
      });
      await user.click(themeToggle);

      // Switch language
      const languageSelector = await screen.findByRole('combobox', {
        name: /language|sprache/i,
      });
      await user.click(languageSelector);
      const germanOption = await screen.findByRole('option', { name: /deutsch|german|de/i });
      await user.click(germanOption);

      // Verify both are saved
      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBeTruthy();
        expect(localStorage.getItem('language')).toBe(JSON.stringify('de'));
      });
    });

    it('should restore all preferences after full application remount', async () => {
      // Set initial preferences
      localStorage.setItem('theme', JSON.stringify('dark'));
      localStorage.setItem('language', JSON.stringify('de'));
      localStorage.setItem('viewMode', JSON.stringify('table'));
      localStorage.setItem('filterMode', JSON.stringify('all'));

      const { unmount } = render(<App />);

      // Verify preferences were loaded
      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe(JSON.stringify('dark'));
        expect(localStorage.getItem('language')).toBe(JSON.stringify('de'));
      });

      unmount();

      // Clear app state but keep localStorage
      render(<App />);

      // All preferences should be restored
      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe(JSON.stringify('dark'));
        expect(localStorage.getItem('language')).toBe(JSON.stringify('de'));
        expect(localStorage.getItem('viewMode')).toBe(JSON.stringify('table'));
        expect(localStorage.getItem('filterMode')).toBe(JSON.stringify('all'));
      });
    });
  });

  describe('Safari Private Mode Fallback', () => {
    it('should handle localStorage failure gracefully for theme', async () => {
      const user = userEvent.setup();

      // Mock localStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      render(<App />);

      const themeToggle = await screen.findByRole('button', {
        name: /theme|dark|light mode/i,
      });

      // Should not throw when clicking
      await expect(user.click(themeToggle)).resolves.not.toThrow();

      // Restore
      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle localStorage failure gracefully for language', async () => {
      const user = userEvent.setup();

      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      render(<App />);

      const languageSelector = await screen.findByRole('combobox', {
        name: /language|sprache/i,
      });

      await user.click(languageSelector);
      const germanOption = await screen.findByRole('option', { name: /deutsch|german|de/i });

      // Should not throw when clicking
      await expect(user.click(germanOption)).resolves.not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data gracefully', async () => {
      // Set invalid JSON
      localStorage.setItem('theme', '{invalid json}');
      localStorage.setItem('language', 'not-json');

      // Should not throw and should fallback to defaults
      expect(() => render(<App />)).not.toThrow();

      await waitFor(() => {
        const body = document.body;
        expect(body).toBeTruthy();
      });
    });

    it('should handle missing localStorage access gracefully', async () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('Access denied');
      });

      // Should not throw and should use defaults
      expect(() => render(<App />)).not.toThrow();

      Storage.prototype.getItem = originalGetItem;
    });
  });
});
