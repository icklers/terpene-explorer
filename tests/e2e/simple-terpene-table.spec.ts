import { test, expect } from '@playwright/test';

test.describe('Terpene Table Translation', () => {
  test('should display terpene data in table when language is German', async ({ page }) => {
    console.log('Testing German terpene table...');

    // Set German language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'de');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with German language');

    // Take a screenshot to see what's actually on the page
    await page.screenshot({ path: 'test-results/german-terpene-table.png' });

    // Check if table exists
    const table = page.locator('role=table');
    await expect(table).toBeVisible({ timeout: 10000 });
    console.log('✓ Table is visible');

    // Check if table has content
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();
    console.log(`✓ Found ${rowCount} rows in table`);

    expect(rowCount).toBeGreaterThan(0);

    // Check for German language indicators
    // Look for any German text that would indicate the translation is working
    const germanIndicators = ['Limonen', 'Stimmungsaufhellend', 'Entspannend', 'Sedierend', 'Energetisierend'];

    let foundGermanContent = false;
    for (const text of germanIndicators) {
      const element = page.locator(`text=${text}`);
      if ((await element.count()) > 0) {
        console.log(`✓ Found German content: ${text}`);
        foundGermanContent = true;
        break;
      }
    }

    expect(foundGermanContent).toBe(true);
    console.log('German terpene table translation test completed');
  });

  test('should display terpene data in table when language is English', async ({ page }) => {
    console.log('Testing English terpene table...');

    // Set English language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with English language');

    // Take a screenshot to see what's actually on the page
    await page.screenshot({ path: 'test-results/english-terpene-table.png' });

    // Check if table exists
    const table = page.locator('role=table');
    await expect(table).toBeVisible({ timeout: 10000 });
    console.log('✓ Table is visible');

    // Check if table has content
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();
    console.log(`✓ Found ${rowCount} rows in table`);

    expect(rowCount).toBeGreaterThan(0);

    // Check for English language indicators
    const englishIndicators = ['Limonene', 'Mood enhancing', 'Relaxing', 'Sedative', 'Energizing'];

    let foundEnglishContent = false;
    for (const text of englishIndicators) {
      const element = page.locator(`text=${text}`);
      if ((await element.count()) > 0) {
        console.log(`✓ Found English content: ${text}`);
        foundEnglishContent = true;
        break;
      }
    }

    expect(foundEnglishContent).toBe(true);
    console.log('English terpene table translation test completed');
  });
});
