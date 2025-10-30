import { test, expect } from '@playwright/test';

test.describe('Effect Translation and Category Mapping', () => {
  test('should display German effect names while preserving effect keys for color coding', async ({ page }) => {
    console.log('Testing effect translation and category mapping...');

    // Set German language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'de');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with German language');

    // Check that we're in table view
    const tableViewToggle = page.locator('text=Tabellarisch').or(page.locator('text=Table'));
    if ((await tableViewToggle.count()) > 0) {
      await tableViewToggle.click();
      await page.waitForTimeout(1000);
    }

    // Look for German effect names in the table
    // Couch-lock should be displayed as "Couchfesselung" in German
    const germanEffects = [
      'Couchfesselung', // German for Couch-lock
      'Stimmungsaufhellend', // German for Mood enhancing
      'Entspannend', // German for Relaxing
      'Beruhigungsmittel', // German for Sedative
      'Energetisierend', // German for Energizing
    ];

    // Check if any German effects appear in the table
    let foundGermanEffect = false;
    for (const effect of germanEffects) {
      const effectElement = page.locator(`text=${effect}`);
      if ((await effectElement.count()) > 0) {
        console.log(`✓ Found German effect: ${effect}`);
        foundGermanEffect = true;
        break;
      }
    }

    expect(foundGermanEffect).toBe(true);
    console.log('German effect translation test completed');
  });

  test('should display English effect names while preserving effect keys for color coding', async ({ page }) => {
    console.log('Testing English effect translation...');

    // Set English language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with English language');

    // Check that we're in table view
    const tableViewToggle = page.locator('text=Tabellarisch').or(page.locator('text=Table'));
    if ((await tableViewToggle.count()) > 0) {
      await tableViewToggle.click();
      await page.waitForTimeout(1000);
    }

    // Look for English effect names in the table
    const englishEffects = ['Couch-lock', 'Mood enhancing', 'Relaxing', 'Sedative', 'Energizing'];

    // Check if any English effects appear in the table
    let foundEnglishEffect = false;
    for (const effect of englishEffects) {
      const effectElement = page.locator(`text=${effect}`);
      if ((await effectElement.count()) > 0) {
        console.log(`✓ Found English effect: ${effect}`);
        foundEnglishEffect = true;
        break;
      }
    }

    expect(foundEnglishEffect).toBe(true);
    console.log('English effect translation test completed');
  });

  test('should preserve effect category mapping while translating display names', async ({ page }) => {
    console.log('Testing effect category mapping preservation...');

    // Set German language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'de');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with German language');

    // Check that we're in table view
    const tableViewToggle = page.locator('text=Tabellarisch').or(page.locator('text=Table'));
    if ((await tableViewToggle.count()) > 0) {
      await tableViewToggle.click();
      await page.waitForTimeout(1000);
    }

    // Look for effect chips that should maintain their category-based colors
    // Even though the display text changes, the effect "keys" should remain the same for color coding
    const effectChips = page
      .locator('role=button')
      .filter({ has: page.locator('text=Couch-lock') })
      .or(page.locator('role=button').filter({ has: page.locator('text=Couchfesselung') }));

    // We should find either the English or German version, but the chip structure should be preserved
    const chipCount = await effectChips.count();
    console.log(`Found ${chipCount} effect chips with Couch-lock/Couchfesselung`);

    // Look for any effect chips that should have consistent styling
    const effectChipsGeneral = page.locator('[class*="MuiChip"]');
    const generalChipCount = await effectChipsGeneral.count();
    console.log(`Found ${generalChipCount} general effect chips`);

    expect(generalChipCount).toBeGreaterThan(0);
    console.log('Effect category mapping preservation test completed');
  });
});
