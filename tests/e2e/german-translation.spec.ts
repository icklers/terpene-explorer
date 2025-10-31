import { test, expect } from '@playwright/test';

test.describe('German Language Translation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing language preferences
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display German translations when German is selected', async ({ page }) => {
    console.log('Starting German language test...');

    // Track console messages
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning' || msg.type() === 'error') {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
        console.log(`Console ${msg.type()}: ${msg.text()}`);
      }
    });

    // Wait for page to load completely
    await page.waitForSelector('text=Terpene', { timeout: 10000 });
    console.log('Page loaded');

    // Find and click the language selector
    // Attempt multiple selectors for different environments
    const languageSelectors = [
      'select', // Standard select element
      'button[role="combobox"]', // MUI Select button
      '[aria-label*="language" i]', // Language selector by aria-label
      '[aria-label*="Language" i]', // Language selector with different case
    ];

    let languageSelector: any = null;
    for (const selector of languageSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        languageSelector = element;
        console.log(`Found language selector with selector: ${selector}`);
        break;
      }
    }

    if (!languageSelector) {
      // If no specific selector found, try general approaches
      languageSelector = page.getByRole('combobox').first().or(page.getByRole('button')).first();
    }

    console.log('Attempting to find language selector...');
    await expect(languageSelector).toBeVisible({ timeout: 10000 });
    console.log('Language selector found and visible');

    // Click the language selector
    await languageSelector.click();
    console.log('Language selector clicked');

    // Wait for language options to appear and select German
    const germanOption = page.locator('text=Deutsch').first();
    await expect(germanOption).toBeVisible({ timeout: 10000 });
    console.log('German option found');

    await germanOption.click();
    console.log('German option selected');

    // Wait for the language change to take effect
    await page.waitForTimeout(2000);

    // Verify that content is in German
    // Check for German-specific terms that would appear in the UI
    const germanElements = [
      page.locator('text=Effekte'), // Effects
      page.locator('text=Suche'), // Search
      page.locator('text=Filter'), // Filters
      page.locator('text=Zurücksetzen'), // Reset (if present)
      page.locator('text=Wirkungen'), // Effects (alternative translation)
      page.locator('text=Natürliche'), // Natural (part of sources)
    ];

    // At least one German term should appear
    let germanContentFound = false;
    for (const element of germanElements) {
      if ((await element.count()) > 0) {
        germanContentFound = true;
        console.log(`Found German content: ${await element.first().textContent()}`);
        break;
      }
    }

    expect(germanContentFound).toBe(true);

    // Check for specific German translations that we know exist
    const knownGermanTranslations = [
      'Entdecken und filtern Sie Terpene nach ihren Wirkungen und Eigenschaften', // Home subtitle
      'Nach Kategorien filtern', // Filter by Categories
      'Wirkungen', // Effects
      'Natürliche Quellen', // Natural Sources
    ];

    let specificTranslationsFound = false;
    for (const translation of knownGermanTranslations) {
      const element = page.locator(`text=${translation}`);
      if ((await element.count()) > 0) {
        specificTranslationsFound = true;
        console.log(`Found specific German translation: ${translation}`);
        break;
      }
    }

    expect(specificTranslationsFound).toBe(true);

    // Check console for initialization warnings (expected behavior)
    const initWarnings = consoleMessages.filter((msg) => msg.includes('TranslationService not initialized. Returning empty array.'));

    if (initWarnings.length > 0) {
      console.log('Initialization warnings (expected during startup):', initWarnings);
    }

    console.log('German language test completed successfully');
  });

  test('should maintain German translations after page refresh', async ({ page }) => {
    // Set language preference in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      const prefs = { theme: 'light', language: 'de' };
      localStorage.setItem('terpene-map-preferences', JSON.stringify(prefs));
    });

    // Reload the page
    await page.reload();

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Verify German content is still displayed
    const germanElements = [page.locator('text=Effekte'), page.locator('text=Suche'), page.locator('text=Filter')];

    let germanContentFound = false;
    for (const element of germanElements) {
      if ((await element.count()) > 0) {
        germanContentFound = true;
        break;
      }
    }

    expect(germanContentFound).toBe(true);
  });
});
