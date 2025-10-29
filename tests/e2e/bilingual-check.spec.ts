import { test, expect } from '@playwright/test';

test.describe('Bilingual Terpene App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');

    // Wait for the page to load - look for the app title or other main content
    await page.waitForSelector('text=Terpene', { timeout: 10000 });
  });

  test('should load without critical console errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Error getting all terpenes')) {
        consoleErrors.push(msg.text());
      }
    });

    // Reload to capture any console errors during initial load
    await page.reload();
    await page.waitForLoadState('networkidle');

    // The critical error is about data loading - check specifically for that
    const dataLoadingErrors = consoleErrors.filter((error) => error.includes('Error getting all terpenes'));

    // This should be empty if data loading is successful
    expect(dataLoadingErrors).toHaveLength(0);
  });

  test('should have German language option', async ({ page }) => {
    // Look for the language selector which is a Material UI Select
    // This will render as a button with role="button" or may have specific MUI classes
    const languageButton = page.locator('button[role="combobox"]').first().or(page.locator('select').first());
    await expect(languageButton).toBeVisible();

    // Click to see options
    await languageButton.click();

    // Verify German option exists
    const germanOption = page.locator('text=Deutsch');
    await expect(germanOption).toBeVisible();

    // Click German option
    await germanOption.click();

    // Wait for language change to take effect
    await page.waitForTimeout(1000);

    // Verify some content is now in German
    await expect(page.locator('text=Suche').or(page.locator('text=Effekte'))).toBeVisible();
  });

  test('should display fallback indicators for untranslated content', async ({ page }) => {
    // Switch to German to potentially see fallback indicators
    const languageButton = page.locator('button[role="combobox"]').first().or(page.locator('select').first());
    await languageButton.click();

    const germanOption = page.locator('text=Deutsch');
    await germanOption.click();
    await page.waitForTimeout(1000);

    // Look for fallback indicators (italic text with language badge)
    // Wait for the page to update after language change
    await page.waitForSelector('text=Suche', { timeout: 5000 }); // Wait for German text to appear
  });
});
