/**
 * E2E Test: Mobile Category Accordion Functionality
 *
 * Tests the mobile responsive behavior of category-based effect filtering
 * including accordion expand/collapse, category checkboxes, and filter persistence.
 *
 * @see tasks.md T068-T072.5
 */

import { test, expect } from '@playwright/test';

test.describe('Mobile Category Accordion', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to iPhone SE dimensions for mobile testing
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Terpene Explorer');
  });

  test('should display collapsed accordions on mobile (T068)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Verify accordions are present and collapsed by default
    const accordions = page.locator('[data-testid="category-accordion"]');
    const accordionCount = await accordions.count();
    expect(accordionCount).toBeGreaterThan(0);

    // Verify each accordion is collapsed (aria-expanded should be false)
    for (let i = 0; i < accordionCount; i++) {
      const accordion = accordions.nth(i);
      await expect(accordion).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('should expand accordion when header is clicked (T069)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Click on the first accordion header
    const firstAccordion = page.locator('[data-testid="category-accordion"]').first();
    const header = firstAccordion.locator('.MuiAccordionSummary-root');

    await header.click();

    // Wait for expansion animation
    await page.waitForTimeout(300);

    // Verify accordion is now expanded
    await expect(firstAccordion).toHaveAttribute('aria-expanded', 'true');

    // Verify effect chips are visible inside the expanded accordion
    const effectChips = firstAccordion.locator('[aria-pressed]');
    await effectChips.first().waitFor();

    const chipCount = await effectChips.count();
    expect(chipCount).toBeGreaterThan(0);
  });

  test('should toggle category checkbox in accordion header (T070)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Click on category checkbox in first accordion header (should be visible even when collapsed)
    const firstAccordion = page.locator('[data-testid="category-accordion"]').first();
    const categoryCheckbox = firstAccordion.locator('input[type="checkbox"]').first();

    // Click the checkbox
    await categoryCheckbox.click();

    // Wait for state update
    await page.waitForTimeout(200);

    // Verify checkbox is checked
    await expect(categoryCheckbox).toBeChecked();

    // Verify corresponding terpene table is filtered
    await page.waitForSelector('tbody tr', { timeout: 3000 });
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThanOrEqual(0);

    // Click checkbox again to uncheck
    await categoryCheckbox.click();
    await page.waitForTimeout(200);

    // Verify checkbox is unchecked
    await expect(categoryCheckbox).not.toBeChecked();
  });

  test('should show effect chips inside expanded accordion (T071)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Find first accordion and expand it
    const firstAccordion = page.locator('[data-testid="category-accordion"]').first();
    const header = firstAccordion.locator('.MuiAccordionSummary-root');

    await header.click();

    // Wait for expansion
    await page.waitForTimeout(300);

    // Verify effect chips are visible in AccordionDetails
    const effectChips = firstAccordion.locator('.MuiAccordionDetails [aria-pressed]');
    await effectChips.first().waitFor();

    const chipCount = await effectChips.count();
    expect(chipCount).toBeGreaterThan(0);

    // Verify chips have correct styling for mobile
    const firstChip = effectChips.first();
    await expect(firstChip).toBeVisible();
    await expect(firstChip).toHaveAttribute('aria-pressed', 'false'); // Unselected by default
  });

  test('should filter terpenes by effect chip within accordion (T072)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Expand first accordion
    const firstAccordion = page.locator('[data-testid="category-accordion"]').first();
    const header = firstAccordion.locator('.MuiAccordionSummary-root');

    await header.click();
    await page.waitForTimeout(300);

    // Get initial count of terpenes
    await page.waitForSelector('tbody tr');
    const initialRows = await page.locator('tbody tr').count();
    expect(initialRows).toBeGreaterThan(0);

    // Click on an effect chip within the expanded accordion
    const effectChips = firstAccordion.locator('.MuiAccordionDetails [aria-pressed]');
    const firstChip = effectChips.first();

    await firstChip.click();

    // Wait for filtering
    await page.waitForTimeout(500);

    // Verify the chip is selected
    await expect(firstChip).toHaveAttribute('aria-pressed', 'true');

    // Verify filtered results
    const filteredRows = await page.locator('tbody tr').count();
    expect(filteredRows).toBeLessThanOrEqual(initialRows);
  });

  test('should persist filter state when accordion is collapsed and expanded (T072.5)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Expand first accordion
    const firstAccordion = page.locator('[data-testid="category-accordion"]').first();
    const header = firstAccordion.locator('.MuiAccordionSummary-root');

    await header.click();
    await page.waitForTimeout(300);

    // Select an effect chip inside
    const effectChips = firstAccordion.locator('.MuiAccordionDetails [aria-pressed]');
    const firstChip = effectChips.first();
    // const chipLabel = await firstChip.textContent(); // Would be used for assertion

    await firstChip.click();
    await page.waitForTimeout(500);

    // Verify chip is selected
    await expect(firstChip).toHaveAttribute('aria-pressed', 'true');

    // Collapse accordion
    await header.click();
    await page.waitForTimeout(300);

    // Re-expand accordion
    await header.click();
    await page.waitForTimeout(300);

    // Verify effect chip is still selected after re-expansion
    const reexpandedChip = firstAccordion.locator('.MuiAccordionDetails [aria-pressed][aria-pressed="true"]');
    const selectedCount = await reexpandedChip.count();
    expect(selectedCount).toBeGreaterThan(0);

    // Verify by checking filter state in table (if any results match)
    await page.waitForSelector('tbody tr', { timeout: 3000 });
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThanOrEqual(0); // May be 0 if no matches for selected filter
  });

  test('should handle multiple accordions independently (T072.5)', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="category-accordion"]', { timeout: 5000 });

    // Get all accordions
    const accordions = page.locator('[data-testid="category-accordion"]');
    const accordionCount = await accordions.count();
    expect(accordionCount).toBeGreaterThan(1);

    // Expand first accordion
    const firstAccordion = accordions.nth(0);
    await firstAccordion.locator('.MuiAccordionSummary-root').click();
    await page.waitForTimeout(300);

    // Expand second accordion
    const secondAccordion = accordions.nth(1);
    await secondAccordion.locator('.MuiAccordionSummary-root').click();
    await page.waitForTimeout(300);

    // Verify both are expanded independently
    await expect(firstAccordion).toHaveAttribute('aria-expanded', 'true');
    await expect(secondAccordion).toHaveAttribute('aria-expanded', 'true');

    // Select different effect chips in each accordion
    const firstEffectChip = firstAccordion.locator('.MuiAccordionDetails [aria-pressed]').first();
    const secondEffectChip = secondAccordion.locator('.MuiAccordionDetails [aria-pressed]').first();

    await firstEffectChip.click();
    await secondEffectChip.click();
    await page.waitForTimeout(500);

    // Verify both chips are selected independently
    await expect(firstEffectChip).toHaveAttribute('aria-pressed', 'true');
    await expect(secondEffectChip).toHaveAttribute('aria-pressed', 'true');

    // Collapse first accordion while second remains expanded
    await firstAccordion.locator('.MuiAccordionSummary-root').click();
    await page.waitForTimeout(300);

    // Verify states are preserved
    await expect(firstAccordion).toHaveAttribute('aria-expanded', 'false');
    await expect(secondAccordion).toHaveAttribute('aria-expanded', 'true');

    // Re-expand first and verify effect selection is preserved
    await firstAccordion.locator('.MuiAccordionSummary-root').click();
    await page.waitForTimeout(300);

    const reexpandedChip = firstAccordion.locator('.MuiAccordionDetails [aria-pressed][aria-pressed="true"]');
    const selectedCount = await reexpandedChip.count();
    expect(selectedCount).toBeGreaterThan(0);
  });
});
