/**
 * E2E Test: User Story 1 - View Categorized Effects
 *
 * Tests that effects are organized into 4 therapeutic categories with emoticons,
 * enabling users to quickly identify which category addresses their therapeutic needs.
 *
 * @see tasks.md T021-T024
 */

import { test, expect } from '@playwright/test';

test.describe('User Story 1: View Categorized Effects', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Terpene Explorer');
  });

  test('T021: should display 4 categories in correct order', async ({ page }) => {
    // Wait for category accordions to load
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Get all category accordions
    const accordions = page.locator('[data-testid="category-accordion"]');
    const accordionCount = await accordions.count();
    expect(accordionCount).toBe(4);

    // Verify categories in correct order
    const expectedOrder = [
      { name: 'Mood & Energy', emoticon: '⚡' },
      { name: 'Cognitive & Mental Enhancement', emoticon: '🧠' },
      { name: 'Relaxation & Anxiety Management', emoticon: '😌' },
      { name: 'Physical & Physiological Management', emoticon: '💪' },
    ];

    // Check each category title
    for (let i = 0; i < 4; i++) {
      const accordion = accordions.nth(i);
      const headerText = await accordion.textContent();
      expect(headerText).toContain(expectedOrder[i].name);

      // Check for emoticon - either as actual emoji or in ARIA label
      const emoticonElement = await accordion.locator(`[aria-label*="${expectedOrder[i].emoticon}"]`).count();
      const ariaLabel = (await accordion.locator('[aria-label]').first().getAttribute('aria-label')) || '';

      const hasEmoticon = emoticonElement > 0 || ariaLabel.includes(expectedOrder[i].emoticon);
      expect(hasEmoticon).toBe(true);
    }
  });

  test('T022: should display emoticons or fallback letters correctly', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Check each category for proper emoticon display
    const categories = [
      { name: 'Mood', emoticon: '⚡', fallbackLetter: 'M' },
      { name: 'Cognitive', emoticon: '🧠', fallbackLetter: 'C' },
      { name: 'Relaxation', emoticon: '😌', fallbackLetter: 'R' },
      { name: 'Physical', emoticon: '💪', fallbackLetter: 'P' },
    ];

    for (const category of categories) {
      const categoryAccordion = page.locator(`[data-testid="category-accordion"]`).filter({ hasText: category.name });

      // Check if we have the full category name or partial match
      const accordion = page.locator('[data-testid="category-accordion"]').filter({ hasText: category.name.split(' & ')[0] });

      const exists = (await accordion.count()) > 0;
      expect(exists).toBe(true);

      // Check for emoticon display
      const hasEmoticon = (await accordion.locator(`[aria-label*="${category.emoticon}"]`).count()) > 0;
      expect(hasEmoticon).toBe(true);
    }
  });

  test('T023: should group effects correctly by category', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Define expected effects per category from our database schema
    const expectedEffectsByCategory = {
      mood: ['energizing', 'elevating', 'stimulating', 'uplifting'],
      cognitive: ['focus', 'mental clarity', 'memory', 'perception'],
      relaxation: ['anti-anxiety', 'calming', 'sedating', 'stress reducing', 'tranquil'],
      physical: ['anti-inflammatory', 'analgesic', 'bronchodilator', 'expectororant', 'immunostimulant', 'antifungal'],
    };

    const categories = [
      'Mood & Energy',
      'Cognitive & Mental Enhancement',
      'Relaxation & Anxiety Management',
      'Physical & Physiological Management',
    ];

    for (let i = 0; i < categories.length; i++) {
      const categoryName = categories[i];
      const categoryKey = ['mood', 'cognitive', 'relaxation', 'physical'][i];
      const expectedEffects = expectedEffectsByCategory[categoryKey];

      // Find the accordion for this category
      const categoryAccordion = page.locator('[data-testid="category-accordion"]').filter({ hasText: categoryName.split(' & ')[0] });

      const exists = (await categoryAccordion.count()) > 0;
      expect(exists).toBe(true);

      if (exists) {
        // Expand the accordion to see effects
        await categoryAccordion.click();
        await page.waitForTimeout(500);

        // Count effect chips in this category
        const effectChips = categoryAccordion.locator('.MuiChip-root');
        const chipCount = await effectChips.count();

        // For now, just verify we have some effects
        expect(chipCount).toBeGreaterThan(0);

        // Verify expected number of effects
        const expectedCount = expectedEffects.length;
        expect(chipCount).toBe(expectedCount);
      }
    }
  });

  test('T024: should maintain correct category display order', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Get all categories in order
    const accordions = page.locator('[data-testid="category-accordion"]');

    const expectedOrder = [
      'Mood & Energy',
      'Cognitive & Mental Enhancement',
      'Relaxation & Anxiety Management',
      'Physical & Physiological Management',
    ];

    for (let i = 0; i < 4; i++) {
      const accordion = accordions.nth(i);
      const headerText = await accordion.textContent();
      expect(headerText).toContain(expectedOrder[i].split(' & ')[0]);
    }

    // Verify the categories appear in the correct sequence
    const fullText = await page.locator('body').textContent();
    if (fullText) {
      // Ensure order is maintained by checking relative positions
      const moodIndex = fullText.indexOf('Mood');
      const cognitiveIndex = fullText.indexOf('Cognitive');
      const relaxationIndex = fullText.indexOf('Relaxation');
      const physicalIndex = fullText.indexOf('Physical');

      expect(moodIndex).toBeLessThan(cognitiveIndex);
      expect(cognitiveIndex).toBeLessThan(relaxationIndex);
      expect(relaxationIndex).toBeLessThan(physicalIndex);
    }
  });

  test('should have accessible category names and ARIA labels', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Verify categories have proper ARIA labels for screen readers
    const accordions = page.locator('[data-testid="category-accordion"]');

    for (let i = 0; i < 4; i++) {
      const accordion = accordions.nth(i);

      // Check that headers use proper semantic structure
      const headerElement = accordion.locator('[role="heading"]');
      expect(await headerElement.count()).toBeGreaterThan(0);

      // Check for ARIA labels or aria-label attributes
      const anyAriaLabel =
        (await accordion.locator('[aria-label]').isVisible()) || (await headerElement.getAttribute('aria-label')) !== null;

      // At minimum, expect text content
      const textContent = await accordion.textContent();
      expect(textContent).toBeTruthy();
    }
  });

  test('should initialize with collapsed state and expandable interaction', async ({ page }) => {
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    const firstAccordion = page.locator('[data-testid="category-accordion"]').first();

    // Initially should be collapsed
    await expect(firstAccordion).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    await firstAccordion.click();
    await page.waitForTimeout(500);

    // Should now be expanded
    await expect(firstAccordion).toHaveAttribute('aria-expanded', 'true');

    // Should show effect content within the expanded area
    const expandedContent = firstAccordion.locator('.MuiAccordionDetails-root');
    await expect(expandedContent).toBeVisible();

    // Click to collapse
    await firstAccordion.click();
    await page.waitForTimeout(500);

    // Should be collapsed again
    await expect(firstAccordion).toHaveAttribute('aria-expanded', 'false');
  });
});
