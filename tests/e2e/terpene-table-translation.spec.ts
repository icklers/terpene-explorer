import { test, expect } from '@playwright/test';

test.describe('Terpene Table Translation', () => {
  test('should display German terpene content when language is set to German', async ({ page }) => {
    console.log('Testing German terpene table translation...');

    // Set German language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'de');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with German language');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/german-terpene-content.png' });

    // Check that we have table content
    const tableCells = page.locator('td');
    const cellCount = await tableCells.count();
    console.log(`Found ${cellCount} table cells`);

    // Check that there's content in the table (more than just headers)
    expect(cellCount).toBeGreaterThan(10);

    // Check for specific German content that we know should be in the UI
    // Look for German translations in the UI elements
    const germanUITexts = [
      'Entdecken und filtern Sie Terpene nach ihren Wirkungen und Eigenschaften', // German translation of the subtitle
      'Nach Kategorien filtern', // German for "Filter by Categories"
      'Suche', // German for "Search"
      'Effekte', // German for "Effects"
      'Filter', // German for "Filters"
    ];

    let foundGermanContent = false;
    for (const text of germanUITexts) {
      const element = page.locator(`text=${text}`);
      if ((await element.count()) > 0) {
        console.log(`✓ Found German UI text: ${text}`);
        foundGermanContent = true;
        break;
      }
    }

    // Also check for translated effect names in the table
    const germanEffectNames = [
      'Stimmungsaufhellend', // German for "Mood enhancing"
      'Entspannend', // German for "Relaxing"
      'Energetisierend', // German for "Energizing"
      'Sedierend', // German for "Sedative"
      'Stressabbau', // German for "Stress relief"
    ];

    // Check if any German effect names appear in the table cells
    for (const effect of germanEffectNames) {
      const effectElement = page.locator(`text=${effect}`);
      if ((await effectElement.count()) > 0) {
        console.log(`✓ Found German effect: ${effect}`);
        foundGermanContent = true;
        break;
      }
    }

    expect(foundGermanContent).toBe(true);
    console.log('German terpene content test completed successfully');
  });

  test('should display English terpene content when language is set to English', async ({ page }) => {
    console.log('Testing English terpene table translation...');

    // Set English language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with English language');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/english-terpene-content.png' });

    // Check that we have table content
    const tableCells = page.locator('td');
    const cellCount = await tableCells.count();
    console.log(`Found ${cellCount} table cells`);

    // Check that there's content in the table (more than just headers)
    expect(cellCount).toBeGreaterThan(10);

    // Check for English content that we know should be in the UI
    const englishUITexts = [
      'Discover and filter terpenes by their effects and properties', // English subtitle
      'Filter by Categories', // English filter label
      'Search', // English search
      'Effects', // English effects
      'Filters', // English filters
    ];

    let foundEnglishContent = false;
    for (const text of englishUITexts) {
      const element = page.locator(`text=${text}`);
      if ((await element.count()) > 0) {
        console.log(`✓ Found English UI text: ${text}`);
        foundEnglishContent = true;
        break;
      }
    }

    // Also check for English effect names in the table
    const englishEffectNames = ['Mood enhancing', 'Relaxing', 'Energizing', 'Sedative', 'Stress relief'];

    // Check if any English effect names appear in the table cells
    for (const effect of englishEffectNames) {
      const effectElement = page.locator(`text=${effect}`);
      if ((await effectElement.count()) > 0) {
        console.log(`✓ Found English effect: ${effect}`);
        foundEnglishContent = true;
        break;
      }
    }

    expect(foundEnglishContent).toBe(true);
    console.log('English terpene content test completed successfully');
  });
});
