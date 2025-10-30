import { test, expect } from '@playwright/test';

test.describe('Basic App Functionality', () => {
  test('should load the app and display basic content', async ({ page }) => {
    console.log('Testing basic app functionality...');

    // Navigate to the home page
    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for page to load

    console.log('Page loaded');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/basic-app-content.png' });

    // Check that the page loaded successfully by looking for key content
    // Look for the main title or other key elements
    const titleElements = ['Terpene Explorer', 'Interactive Terpene Map', 'Terpene', 'Explorer'];

    let foundTitle = false;
    for (const title of titleElements) {
      const titleElement = page.locator(`text=${title}`);
      if ((await titleElement.count()) > 0) {
        console.log(`✓ Found title element: ${title}`);
        foundTitle = true;
        break;
      }
    }

    expect(foundTitle).toBe(true);
    console.log('Basic app functionality test completed successfully');
  });

  test('should display terpene table with content', async ({ page }) => {
    console.log('Testing terpene table content...');

    // Navigate to the home page
    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for page to load

    console.log('Page loaded');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/terpene-table-content.png' });

    // Look for terpene table elements
    const tableElements = page.locator('table');
    const tableCount = await tableElements.count();
    console.log(`Found ${tableCount} table elements`);

    // Look for table rows
    const tableRows = page.locator('tr');
    const rowCount = await tableRows.count();
    console.log(`Found ${rowCount} table rows`);

    // Look for table cells
    const tableCells = page.locator('td');
    const cellCount = await tableCells.count();
    console.log(`Found ${cellCount} table cells`);

    // Check that there's at least some content in the table
    expect(cellCount).toBeGreaterThan(0);
    console.log('Terpene table content test completed successfully');
  });
});
