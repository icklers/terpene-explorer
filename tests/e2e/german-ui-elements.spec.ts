import { test, expect } from '@playwright/test';

test.describe('German UI Translation Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing language preferences and set German as default
    await page.goto('/');
    await page.evaluate(() => {
      const prefs = { theme: 'light', language: 'de' };
      localStorage.setItem('terpene-map-preferences', JSON.stringify(prefs));
    });
    await page.reload();
    await page.waitForTimeout(2000); // Wait for language to load
  });

  test('should display German table headers', async ({ page }) => {
    console.log('Checking German table headers...');

    // Track console messages
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning' || msg.type() === 'error') {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      }
    });

    // Wait for table to load
    await page.waitForSelector('role=table', { timeout: 10000 });

    // Check for German table headers
    const expectedGermanHeaders = ['Name', 'Aroma', 'Wirkungen', 'Natürliche Quellen'];

    for (const header of expectedGermanHeaders) {
      const headerElement = page.locator(`text=${header}`);
      await expect(headerElement).toBeVisible({ timeout: 5000 });
      console.log(`Found German table header: ${header}`);
    }

    // Verify that English headers are NOT present
    const englishHeaders = ['Effects', 'Sources'];

    for (const header of englishHeaders) {
      const headerElement = page.locator(`text=${header}`);
      // These should not be visible (they should be translated)
      if ((await headerElement.count()) > 0) {
        const isVisible = await headerElement.isVisible();
        expect(isVisible).toBe(false);
        console.log(`Verified English header "${header}" is not visible`);
      }
    }

    console.log('German table headers test completed successfully');
  });

  test('should display German filter controls', async ({ page }) => {
    console.log('Checking German filter controls...');

    // Check for German filter labels
    const expectedGermanFilters = [
      'Nach Kategorien filtern', // Filter by Categories
      'Effekte', // Effects
      'Suche', // Search
      'Filter', // Filters
    ];

    for (const filterText of expectedGermanFilters) {
      const filterElement = page.locator(`text=${filterText}`);
      await expect(filterElement).toBeVisible({ timeout: 5000 });
      console.log(`Found German filter element: ${filterText}`);
    }

    console.log('German filter controls test completed successfully');
  });

  test('should display German page content', async ({ page }) => {
    console.log('Checking German page content...');

    // Check for German page elements
    const expectedGermanContent = [
      'Entdecken und filtern Sie Terpene nach ihren Wirkungen und Eigenschaften', // Page subtitle
      'Filter', // Filter panel title
    ];

    for (const contentText of expectedGermanContent) {
      const contentElement = page.locator(`text=${contentText}`);
      await expect(contentElement).toBeVisible({ timeout: 5000 });
      console.log(`Found German page content: ${contentText}`);
    }

    console.log('German page content test completed successfully');
  });
});
