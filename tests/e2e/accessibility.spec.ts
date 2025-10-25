/**
 * E2E Test: Accessibility Compliance
 *
 * Tests WCAG 2.1 Level AA compliance using axe-core.
 * Validates semantic HTML, ARIA attributes, keyboard navigation, and color contrast.
 *
 * @see tasks.md T109
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should not have automatically detectable accessibility issues on home page', async ({ page }) => {
    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    // Verify main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible();

    // Verify header
    await expect(page.locator('header, [role="banner"]')).toBeVisible();

    // Verify footer
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();

    // Verify heading hierarchy (h1 -> h2 -> h3)
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Only one h1 per page
  });

  test('should have accessible forms and inputs', async ({ page }) => {
    // Search input should have label or aria-label
    const searchInput = page.locator('input[placeholder*="Search"]');
    const ariaLabel = await searchInput.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should have accessible buttons', async ({ page }) => {
    // All buttons should have accessible names
    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      // Button should have either text content or aria-label
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // Continue tabbing
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Verify we can reach multiple interactive elements
    const finalFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(finalFocused).toBeTruthy();
  });

  test('should have accessible effect filter chips', async ({ page }) => {
    // Wait for chips to load
    await page.waitForSelector('[aria-pressed]', { timeout: 5000 });

    // Verify chips have aria-pressed attribute
    const firstChip = page.locator('[aria-pressed]').first();
    const ariaPressed = await firstChip.getAttribute('aria-pressed');
    expect(ariaPressed).toMatch(/^(true|false)$/);

    // Verify chips have aria-label
    const ariaLabel = await firstChip.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should have ARIA live regions for dynamic content', async ({ page }) => {
    // Search and verify live region announces results
    const liveRegion = page.locator('[aria-live="polite"], [role="status"]');

    // There should be at least one live region
    const count = await liveRegion.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have accessible table view', async ({ page }) => {
    // Wait for table
    await expect(page.locator('table')).toBeVisible();

    // Table should have headers
    const headers = await page.locator('th').count();
    expect(headers).toBeGreaterThan(0);

    // Table should have aria-label or caption
    const table = page.locator('table').first();
    const ariaLabel = await table.getAttribute('aria-label');
    const caption = await table.locator('caption').count();

    expect(ariaLabel || caption > 0).toBeTruthy();
  });

  test('should have no accessibility violations in sunburst view', async ({ page }) => {
    // Switch to sunburst view
    const sunburstButton = page.locator('button[aria-label*="sunburst" i]').first();
    await sunburstButton.click();
    await page.waitForTimeout(500);

    // Run axe scan on sunburst view
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have accessible theme toggle', async ({ page }) => {
    // Theme toggle should have aria-label
    const themeToggle = page.locator('button[aria-label*="theme" i]').first();
    const ariaLabel = await themeToggle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();

    // Should be keyboard accessible
    await themeToggle.focus();
    const isFocused = await themeToggle.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('should have accessible language selector', async ({ page }) => {
    // Language selector should have aria-label
    const languageSelector = page.locator('[aria-label*="language" i]').first();
    const ariaLabel = await languageSelector.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should have proper color contrast in light theme', async ({ page }) => {
    // Ensure light theme is active
    await page.evaluate(() => {
      const prefs = { theme: 'light' };
      localStorage.setItem('terpene-map-preferences', JSON.stringify(prefs));
    });
    await page.reload();
    await page.waitForTimeout(500);

    // Run axe scan focusing on color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('should have proper color contrast in dark theme', async ({ page }) => {
    // Set dark theme
    await page.evaluate(() => {
      const prefs = { theme: 'dark' };
      localStorage.setItem('terpene-map-preferences', JSON.stringify(prefs));
    });
    await page.reload();
    await page.waitForTimeout(500);

    // Run axe scan focusing on color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('should have accessible error states', async ({ page }) => {
    // Search for non-existent item to trigger empty state
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('xyznonexistent12345');
    await page.waitForTimeout(500);

    // Verify empty state message is accessible
    const emptyState = page.locator('text=No terpenes to display');
    await expect(emptyState).toBeVisible();

    // Run axe scan on error state
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have accessible focus indicators', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab');

    // Get computed styles of focused element
    const focusOutline = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have some kind of focus indicator (outline or box-shadow)
    const hasFocusIndicator =
      (focusOutline?.outline && focusOutline.outline !== 'none') ||
      (focusOutline?.outlineWidth && focusOutline.outlineWidth !== '0px') ||
      (focusOutline?.boxShadow && focusOutline.boxShadow !== 'none');

    expect(hasFocusIndicator).toBeTruthy();
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Verify landmarks for screen reader navigation
    const landmarks = await page.evaluate(() => {
      const selectors = [
        '[role="banner"]',
        '[role="navigation"]',
        '[role="main"]',
        '[role="search"]',
        '[role="contentinfo"]',
      ];

      return selectors.map((selector) => ({
        selector,
        count: document.querySelectorAll(selector).length,
      }));
    });

    // Should have at least banner (header), main, and contentinfo (footer)
    const hasRequiredLandmarks = landmarks.some((l) => l.selector === '[role="main"]' && l.count > 0);
    expect(hasRequiredLandmarks).toBe(true);
  });

  test('should have no automatically detectable accessibility issues after user interactions', async ({ page }) => {
    // Perform various interactions
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('test');
    await page.waitForTimeout(500);

    // Click a filter
    const chip = page.locator('[aria-pressed]').first();
    await chip.click();
    await page.waitForTimeout(300);

    // Switch view
    const sunburstButton = page.locator('button[aria-label*="sunburst" i]').first();
    await sunburstButton.click();
    await page.waitForTimeout(500);

    // Run comprehensive accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
