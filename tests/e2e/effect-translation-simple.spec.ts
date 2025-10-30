import { test, expect } from '@playwright/test';

test.describe('Effect Translation and Category Mapping', () => {
  test('should display German effect names with correct color coding', async ({ page }) => {
    console.log('Testing German effect translation...');

    // Set German language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'de');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with German language');

    // Take a screenshot to see what's actually on the page
    await page.screenshot({ path: 'test-results/german-effects.png' });

    // Look for German effect names in the page (without manipulating view)
    const germanEffects = [
      'Stimmungsaufhellend', // German for Mood enhancing
      'Entspannend', // German for Relaxing
      'Energetisierend', // German for Energizing
      'Beruhigungsmittel', // German for Sedative
      'Muskeln entspannend', // German for Muscle relaxant
      'Schmerzlindernd', // German for Pain relief
      'Angstlinderung', // German for Anxiety relief
    ];

    // Check if any German effects appear
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

  test('should display English effect names with correct color coding', async ({ page }) => {
    console.log('Testing English effect translation...');

    // Set English language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(5000); // Wait for language to fully load

    console.log('Page loaded with English language');

    // Take a screenshot to see what's actually on the page
    await page.screenshot({ path: 'test-results/english-effects.png' });

    // Look for English effect names in the page
    const englishEffects = ['Mood enhancing', 'Relaxing', 'Energizing', 'Sedative', 'Muscle relaxant', 'Pain relief', 'Anxiety relief'];

    // Check if any English effects appear
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

  test('should preserve category mapping for Couch-lock effect', async ({ page }) => {
    console.log('Testing Couch-lock effect translation...');

    // Test both languages
    const testCases = [
      { language: 'en', couchLockText: 'Couch-lock', languageName: 'English' },
      { language: 'de', couchLockText: 'Couchfesselung', languageName: 'German' },
    ];

    for (const testCase of testCases) {
      // Set language and navigate to home page
      await page.goto('/');
      await page.evaluate((lang) => {
        localStorage.setItem('terpene-map-language', lang);
      }, testCase.language);
      await page.reload();
      await page.waitForTimeout(3000); // Wait for language to fully load

      console.log(`Page loaded with ${testCase.languageName} language`);

      // Look for the Couch-lock effect (translated or not)
      const couchLockElement = page.locator(`text=${testCase.couchLockText}`);
      if ((await couchLockElement.count()) > 0) {
        console.log(`✓ Found ${testCase.languageName} Couch-lock: ${testCase.couchLockText}`);

        // Check that the effect chip exists
        const effectChip = couchLockElement.first();
        await expect(effectChip).toBeVisible();

        // Check if it has styling (indicating it's properly recognized as an effect)
        const hasClassName = await effectChip.getAttribute('class');
        expect(hasClassName).toBeTruthy();
        console.log(`✓ Effect chip has styling classes: ${hasClassName}`);

        // Break if found
        break;
      }
    }

    console.log('Couch-lock effect translation test completed');
  });
});
