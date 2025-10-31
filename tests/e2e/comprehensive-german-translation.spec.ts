import { test, expect } from '@playwright/test';

test.describe('Comprehensive German Translation Verification', () => {
  test('should translate UI elements to German correctly', async ({ page }) => {
    console.log('Starting comprehensive German translation test...');

    // Set German language and navigate to home page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'de');
    });
    await page.reload();
    await page.waitForTimeout(3000); // Wait for language to fully load

    console.log('Page loaded with German language');

    // Check that the subtitle is properly translated by looking for key German words
    const germanWords = ['Entdecken', 'filtern', 'Terpene', 'Wirkungen', 'Eigenschaften'];

    let foundGermanContent = false;
    for (const word of germanWords) {
      const element = page.locator(`text=${word}`);
      if ((await element.count()) > 0) {
        console.log(`✓ Found German word: ${word}`);
        foundGermanContent = true;
      }
    }

    expect(foundGermanContent).toBe(true);
    console.log('✓ German content detected on page');

    // Check that filter controls are translated
    const filterByCategory = page.locator('text=Nach Kategorien filtern');
    await expect(filterByCategory).toBeVisible();
    console.log('✓ Filter by category label translated to German');

    // Check that table headers are translated
    const nameHeader = page.locator('text=Name');
    const aromaHeader = page.locator('text=Aroma');
    const effectsHeader = page.locator('text=Wirkungen');
    const sourcesHeader = page.locator('text=Natürliche Quellen');

    await expect(nameHeader).toBeVisible();
    await expect(aromaHeader).toBeVisible();
    await expect(effectsHeader).toBeVisible();
    await expect(sourcesHeader).toBeVisible();
    console.log('✓ Table headers translated to German');

    // Check that the language selector shows German is selected
    const languageSelector = page
      .locator('select')
      .first()
      .or(page.locator('button[role="combobox"]').first())
      .or(page.locator('[aria-label*="language" i]').first());

    await expect(languageSelector).toBeVisible();
    const selectorText = await languageSelector.textContent();
    expect(selectorText).toContain('Deutsch');
    console.log('✓ Language selector shows German is selected');

    console.log('Comprehensive German translation test completed successfully');
  });

  test('should switch language dynamically and update UI', async ({ page }) => {
    console.log('Testing dynamic language switching...');

    // Start with English
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('terpene-map-language');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Verify English UI elements
    const englishSubtitle = page.locator('text=Discover and filter terpenes by their effects and properties');
    await expect(englishSubtitle).toBeVisible();
    console.log('✓ English UI elements displayed correctly');

    // Switch to German
    const languageSelector = page
      .locator('select')
      .first()
      .or(page.locator('button[role="combobox"]').first())
      .or(page.locator('[aria-label*="language" i]').first());

    await expect(languageSelector).toBeVisible();
    await languageSelector.click();

    const germanOption = page.locator('text=Deutsch').first();
    await expect(germanOption).toBeVisible();
    await germanOption.click();

    // Wait for language change to take effect
    await page.waitForTimeout(3000);

    // Verify German UI elements
    const germanSubtitle = page.locator('text=Entdecken und filtern Sie Terpene nach ihren Wirkungen und Eigenschaften');
    await expect(germanSubtitle).toBeVisible();
    console.log('✓ German UI elements displayed after language switch');

    // Verify language preference was saved
    const savedLanguage = await page.evaluate(() => localStorage.getItem('terpene-map-language'));
    expect(savedLanguage).toMatch(/de/); // Either "de" or "\"de\""
    console.log('✓ Language preference saved to localStorage');

    console.log('Dynamic language switching test completed successfully');
  });
});
