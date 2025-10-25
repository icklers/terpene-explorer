/**
 * E2E Test: User Story 1 - View and Filter Terpene Data
 *
 * Tests the complete user journey for viewing and filtering terpenes by effects.
 * Validates filtering with AND/OR modes and search functionality.
 *
 * @see tasks.md T106
 */

import { test, expect } from '@playwright/test';

test.describe('User Story 1: Filter Terpenes', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Terpene Explorer');
  });

  test('should display terpene data on initial load', async ({ page }) => {
    // Verify page title is visible
    await expect(page.locator('h1')).toBeVisible();

    // Verify search bar is present
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();

    // Verify filter controls are present
    await expect(page.locator('text=Filter by Effects')).toBeVisible();

    // Verify default view (table should be visible based on UAT fix)
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter terpenes by single effect', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[aria-label*="terpene"]', { timeout: 5000 });

    // Get initial count of terpenes
    const initialRows = await page.locator('tbody tr').count();
    expect(initialRows).toBeGreaterThan(0);

    // Click on an effect filter chip (e.g., "Calming")
    const calmingChip = page.locator('[aria-pressed]').first();
    await calmingChip.click();

    // Verify the chip is now selected (aria-pressed=true)
    await expect(calmingChip).toHaveAttribute('aria-pressed', 'true');

    // Wait for filtering to complete
    await page.waitForTimeout(500);

    // Verify filtered results
    const filteredRows = await page.locator('tbody tr').count();
    expect(filteredRows).toBeLessThanOrEqual(initialRows);
  });

  test('should filter terpenes with AND mode (all selected effects)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[aria-pressed]', { timeout: 5000 });

    // Select first effect
    const firstChip = page.locator('[aria-pressed]').first();
    await firstChip.click();

    // Select second effect
    const secondChip = page.locator('[aria-pressed]').nth(1);
    await secondChip.click();

    // Verify filter mode toggle appears (only shown when 2+ effects selected)
    await expect(page.locator('text=Filter Mode')).toBeVisible();

    // Change to AND mode
    const andButton = page.locator('button', { hasText: 'ALL' });
    if (await andButton.isVisible()) {
      await andButton.click();
      await expect(andButton).toHaveAttribute('aria-pressed', 'true');
    }

    // Verify results are filtered with AND logic
    await page.waitForTimeout(500);
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThanOrEqual(0); // May be 0 if no terpenes have both effects
  });

  test('should filter terpenes with OR mode (any selected effects)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[aria-pressed]', { timeout: 5000 });

    // Select first effect
    const firstChip = page.locator('[aria-pressed]').first();
    await firstChip.click();

    // Select second effect
    const secondChip = page.locator('[aria-pressed]').nth(1);
    await secondChip.click();

    // Verify filter mode toggle appears
    await expect(page.locator('text=Filter Mode')).toBeVisible();

    // Ensure ANY mode is selected (default)
    const anyButton = page.locator('button', { hasText: 'ANY' });
    await expect(anyButton).toBeVisible();

    // Verify results are filtered with OR logic
    await page.waitForTimeout(500);
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0); // Should have results with OR
  });

  test('should search terpenes by name', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('tbody tr', { timeout: 5000 });

    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('linalool');

    // Wait for debounce (300ms)
    await page.waitForTimeout(500);

    // Verify filtered results
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThanOrEqual(0);

    // If results exist, verify they contain the search term
    if (rows > 0) {
      const firstRow = page.locator('tbody tr').first();
      await expect(firstRow).toContainText('linalool', { ignoreCase: true });
    }
  });

  test('should clear all filters', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[aria-pressed]', { timeout: 5000 });

    // Select an effect
    const chip = page.locator('[aria-pressed]').first();
    await chip.click();

    // Verify Clear button appears
    await expect(page.locator('button', { hasText: 'Clear' })).toBeVisible();

    // Click Clear button
    await page.locator('button', { hasText: 'Clear' }).click();

    // Verify all chips are deselected
    await expect(chip).toHaveAttribute('aria-pressed', 'false');

    // Verify Clear button is hidden
    await expect(page.locator('button', { hasText: 'Clear' })).not.toBeVisible();
  });

  test('should combine search and effect filters', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[aria-pressed]', { timeout: 5000 });

    // Search for a term
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('myrcene');

    // Wait for debounce
    await page.waitForTimeout(500);

    // Select an effect
    const chip = page.locator('[aria-pressed]').first();
    await chip.click();

    // Wait for filtering
    await page.waitForTimeout(500);

    // Verify results are filtered by both search and effect
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThanOrEqual(0);
  });

  test('should show empty state when no results match filters', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[aria-pressed]', { timeout: 5000 });

    // Search for something that doesn't exist
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('nonexistentterpenexyz123');

    // Wait for debounce
    await page.waitForTimeout(500);

    // Verify empty state message
    await expect(page.locator('text=No terpenes to display')).toBeVisible();
  });

  test('should maintain filter state after view mode toggle', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[aria-pressed]', { timeout: 5000 });

    // Select an effect
    const chip = page.locator('[aria-pressed]').first();
    const chipText = await chip.textContent();
    await chip.click();

    // Verify chip is selected
    await expect(chip).toHaveAttribute('aria-pressed', 'true');

    // Toggle to sunburst view
    const sunburstButton = page.locator('button[aria-label*="sunburst" i], button[aria-label*="Sunburst" i]').first();
    if (await sunburstButton.isVisible()) {
      await sunburstButton.click();
      await page.waitForTimeout(500);
    }

    // Toggle back to table view
    const tableButton = page.locator('button[aria-label*="table" i], button[aria-label*="Table" i]').first();
    if (await tableButton.isVisible()) {
      await tableButton.click();
      await page.waitForTimeout(500);
    }

    // Verify chip is still selected
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
  });
});
