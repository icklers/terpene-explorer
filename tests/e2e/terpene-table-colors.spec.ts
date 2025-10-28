// spec: Check Terpene Table colors (header and zebra rows)
// Note: this test assumes the app is available at the Playwright baseURL (playwright.config.js uses http://localhost:5173)
// and that the main page renders the terpenes table with aria-label "Terpenes table".

import { test, expect } from '@playwright/test';

test.describe('Terpene Table colors', () => {
  test('header uses primary.dark / primary.contrastText and rows show zebra colors', async ({ page }) => {
    // Force dark mode by setting persisted theme before the app loads.
    // The app reads localStorage('theme') during initialization via the useTheme hook.
    await page.addInitScript(() => {
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {
        // ignore (some browsers may restrict storage in certain contexts)
      }
    });

    // Navigate to root (playwright.config.js sets baseURL)
    await page.goto('/');

    // Wait for the table to appear
    const table = page.locator('table[aria-label="Terpenes table"]');
    await table.waitFor({ state: 'visible', timeout: 10_000 });

    // Header row and first header cell (MUI renders head cells as <th>)
    const headerRow = table.locator('thead tr');
    const headerCell = headerRow.locator('th').first();

    // Ensure there is table data to test zebra rows
    const bodyRows = table.locator('tbody tr');
    const rowCount = await bodyRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);

    // Header: background should be primary.dark (#388e3c -> rgb(56, 142, 60))
    await expect(headerCell).toHaveCSS('background-color', 'rgb(56, 142, 60)');

    // Header: text color should be primary.contrastText (#ffffffde -> rgba(255, 255, 255, 0.87))
    await expect(headerCell).toHaveCSS('color', 'rgba(255, 255, 255, 0.87)');

    // Zebra striping: check first two visible rows if they exist.
    if (rowCount >= 2) {
      const firstRow = bodyRows.nth(0);
      const secondRow = bodyRows.nth(1);

      // Odd row (first) is styled with action.hover: rgba(255, 255, 255, 0.08)
      await expect(firstRow).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.08)');

      // Even row (second) is transparent: computed style is usually 'rgba(0, 0, 0, 0)'
      await expect(secondRow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    } else {
      // If only one row is present, assert the first row's background (odd row)
      const firstRow = bodyRows.nth(0);
      await expect(firstRow).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.08)');
    }
  });
});
