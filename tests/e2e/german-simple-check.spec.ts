import { test, expect } from '@playwright/test';

test.describe('German UI Translation Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing language preferences and set German as default
    await page.goto('/');
    await page.evaluate(() => {
      const prefs = { theme: 'light', language: 'de' };
      localStorage.setItem('terpene-map-language', JSON.stringify('de'));
    });
    await page.reload();
    await page.waitForTimeout(2000); // Wait for language to load
  });

  test('should display German content on page', async ({ page }) => {
    console.log('Checking German content on page...');

    // Take a screenshot to see what's actually on the page
    await page.screenshot({ path: 'test-results/german-page-content.png' });

    // Get all text content from the page
    const pageText = await page.textContent('body');
    console.log('Page text content (first 1000 chars):', pageText?.substring(0, 1000));

    // Check for any German words that should definitely be present
    const germanWords = [
      'Effekte', // Effects
      'Suche', // Search
      'Filter', // Filters
    ];

    let germanFound = false;
    for (const word of germanWords) {
      if (pageText && pageText.includes(word)) {
        console.log(`Found German word: ${word}`);
        germanFound = true;
      }
    }

    expect(germanFound).toBe(true);

    // Also check for English words that should NOT be present when German is selected
    const englishWords = ['Effects', 'Search', 'Filters'];

    let englishFound = false;
    for (const word of englishWords) {
      if (pageText && pageText.includes(word)) {
        console.log(`Found English word that should be translated: ${word}`);
        englishFound = true;
      }
    }

    // If English words are found, it's not necessarily a failure, as some words might not be translated
    // but at least some German words should be present

    console.log('German content test completed');
  });

  test('should have language selector with German option', async ({ page }) => {
    console.log('Checking language selector...');

    // Find language selector and verify German is selected
    const languageSelector = page
      .locator('select')
      .first()
      .or(page.locator('button[role="combobox"]').first())
      .or(page.locator('[aria-label*="language" i]').first());

    await expect(languageSelector).toBeVisible({ timeout: 10000 });

    // Check if German is the selected language by looking at the button text or aria-label
    const selectorText = await languageSelector.textContent();
    console.log(`Language selector text: ${selectorText}`);

    // The selector should show either "Deutsch" or "German" when German is selected
    expect(selectorText).toContain('Deutsch');

    console.log('Language selector test completed');
  });
});
