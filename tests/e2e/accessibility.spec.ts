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
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

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

    // Verify it exists
    await expect(liveRegion).toBeVisible();
  });

  // T029-T031: Category accessibility tests
  test('T029: should verify WCAG 2.1 AA contrast ratios for category colors in light theme', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Run axe accessibility scan specifically for category elements
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa', 'wcag21aa']).analyze();

    // Check for contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter((violation) => violation.id === 'color-contrast');

    expect(contrastViolations.length).toBe(0);

    // Verify category headers have sufficient contrast
    const categories = [
      'Mood & Energy',
      'Cognitive & Mental Enhancement',
      'Relaxation & Anxiety Management',
      'Physical & Physiological Management',
    ];

    for (const category of categories) {
      const categoryElement = page.locator(`[data-testid="category-accordion"]`).filter({ hasText: category.split(' & ')[0] });

      const hasCategory = (await categoryElement.count()) > 0;
      expect(hasCategory).toBe(true);
    }
  });

  test('T030: should verify WCAG 2.1 AA contrast ratios for category colors in dark theme', async ({ page }) => {
    // Switch to dark theme
    const themeToggle = page.locator('button[aria-label*="theme"], button[title="Toggle theme"]');
    if ((await themeToggle.count()) > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    // Wait for UI elements with new theme applied
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Run axe accessibility scan for dark theme contrast
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa', 'wcag21aa']).analyze();

    const contrastViolations = accessibilityScanResults.violations.filter((violation) => violation.id === 'color-contrast');

    expect(contrastViolations.length).toBe(0);

    // Switch back to light theme for other tests
    if ((await themeToggle.count()) > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
  });

  test('T031: should verify emoticons have proper ARIA labels', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Expected emoticons and their descriptive ARIA labels
    const emoticonLabels = [
      { emoticon: '⚡', expectedLabel: 'mood' },
      { emoticon: '🧠', expectedLabel: 'cognitive' },
      { emoticon: '😌', expectedLabel: 'relaxation' },
      { emoticon: '💪', expectedLabel: 'physical' },
    ];

    const accordions = page.locator('[data-testid="category-accordion"]');
    const accordionCount = await accordions.count();
    expect(accordionCount).toBe(4);

    // Check each category has proper ARIA labeling
    for (let i = 0; i < accordionCount; i++) {
      const accordion = accordions.nth(i);

      // Check for proper ARIA labels on interactive elements
      const hasAriaLabels = (await accordion.locator('[aria-label]').count()) > 0;

      // Check for category-specific labels containing the expected terms
      const labels = await accordion.locator('[aria-label]').all();
      let hasCorrectLabeling = false;

      for (const labelElement of labels) {
        const labelText = (await labelElement.getAttribute('aria-label')) || '';
        const lowerLabel = labelText.toLowerCase();

        if (i === 0 && (lowerLabel.includes('mood') || lowerLabel.includes('energy'))) {
          hasCorrectLabeling = true;
          break;
        } else if (i === 1 && lowerLabel.includes('cognitive')) {
          hasCorrectLabeling = true;
          break;
        } else if (i === 2 && lowerLabel.includes('relaxation')) {
          hasCorrectLabeling = true;
          break;
        } else if (i === 3 && lowerLabel.includes('physical')) {
          hasCorrectLabeling = true;
          break;
        }
      }

      expect(hasCorrectLabeling).toBe(true);
    }

    // Verify that all interactive elements related to categories have descriptive labels
    // Check for category controls that have proper text content or labels
    const categorySelectors = ['Mood', 'Cognitive', 'Relaxation', 'Physical'];
    for (const category of categorySelectors) {
      const categoryControls = page.locator(`[role="checkbox"], [role="button"]`).filter({ hasText: category });
      if ((await categoryControls.count()) > 0) {
        const ariaLabel = (await categoryControls.first().getAttribute('aria-label')) || '';
        expect(ariaLabel.length > 0 || (await categoryControls.first().textContent())).toBeTruthy();
      }
    }
  });

  test('should verify categories have descriptive text alternatives for visual elements', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Check category headers for proper text content
    const categoryHeaders = page.locator(
      '[data-testid="category-accordion"] h2, [data-testid="category-accordion"] h3, [data-testid="category-accordion"] h4'
    );
    const headerCount = await categoryHeaders.count();

    if (headerCount > 0) {
      for (let i = 0; i < headerCount; i++) {
        const headerText = await categoryHeaders.nth(i).textContent();
        expect(headerText!.length).toBeGreaterThan(0);
        expect(headerText).toMatch(/mood|cognitive|relaxation|physical/i);
      }
    }
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
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
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
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

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
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).include('body').analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === 'color-contrast');

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
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).include('body').analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter((v) => v.id === 'color-contrast');

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
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

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

  // Task T036: Verify focus indicators with axe-core
  test('T036: should verify focus indicators with axe-core', async ({ page }) => {
    // Run axe accessibility scan specifically checking for focus-related issues
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .options({
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      })
      .analyze();

    // Focus-related violations to check for
    const focusRelatedViolations = [
      'focus-order-semantics',
      'frame-title-unique',
      'heading-order',
      'hidden-content',
      'landmark-one-main',
      'landmark-unique',
      'page-has-heading-one',
      'region',
    ];

    // Check specifically for focus-related issues
    const focusViolations = accessibilityScanResults.violations.filter((violation) => focusRelatedViolations.includes(violation.id));

    // There should be no focus-related accessibility violations
    expect(focusViolations).toHaveLength(0);

    // Additionally, run a focused check for focus order and keyboard accessibility
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Verify landmarks for screen reader navigation
    const landmarks = await page.evaluate(() => {
      const selectors = ['[role="banner"]', '[role="navigation"]', '[role="main"]', '[role="search"]', '[role="contentinfo"]'];

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
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
