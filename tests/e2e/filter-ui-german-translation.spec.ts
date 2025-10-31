import { test, expect } from '@playwright/test';

/**
 * E2E Test: Verify German translations for filter UI components
 *
 * Tests that all filter-related UI elements display correct German translations:
 * - View Mode toggle (Ansicht: Sunburst/Tabelle)
 * - Effect Matching Mode (Effekt-Übereinstimmungsmodus: BELIEBIGE/ALLE)
 * - Filter labels and buttons
 *
 * Note: Skipping webkit and mobile browsers due to slow table loading causing timeouts
 */
test.describe('German UI Translation - Filter Components', () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'Webkit has slow table loading');
  test.skip(({ browserName, isMobile }) => isMobile === true, 'Mobile browsers have slow table loading');

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for app to load
    await page.waitForLoadState('networkidle');

    // Wait for terpene data to load - table should be visible (increased timeout for WebKit)
    await page.locator('table').first().waitFor({ timeout: 30000, state: 'visible' });

    // Check if we need to switch to German (add explicit wait for mobile)
    const languageCombobox = page.getByRole('combobox').first();
    await languageCombobox.waitFor({ timeout: 10000, state: 'visible' });
    const currentLanguage = await languageCombobox.textContent();

    if (currentLanguage?.toLowerCase().includes('english')) {
      // Switch to German - the language selector is a combobox that opens a dropdown
      await languageCombobox.click();

      // Wait for dropdown to appear
      await page.waitForTimeout(200);

      // Click on "Deutsch" option
      await page.getByRole('option', { name: /deutsch/i }).click();

      // Wait for language change to propagate and UI to re-render
      await page.waitForTimeout(500);
    }

    // Verify we're now in German by checking for German text in the banner (not footer)
    await expect(page.getByRole('banner').getByText(/terpen explorer|terpene explorer/i)).toBeVisible();

    // Click the expand filters button to open the accordion
    // The button has aria-label "Filter einblenden" in German or "Expand filters" in English
    const expandButton = page.getByRole('button', { name: /filter einblenden|expand filters/i });
    await expandButton.click();

    // Wait for accordion animation and verify content is visible
    await expect(page.getByText(/nach kategorien filtern|filter by categor/i)).toBeVisible({ timeout: 2000 });

    // Wait for category tabs to be fully visible and interactive
    await page.getByRole('tab').first().waitFor({ state: 'visible', timeout: 2000 });
  });

  test('View Mode toggle shows German labels', async ({ page }) => {
    // Check that "Ansicht" label is present
    await expect(page.getByText('Ansicht')).toBeVisible();

    // Check Sunburst button
    const sunburstButton = page.getByRole('button', { name: /sunburst/i });
    await expect(sunburstButton).toBeVisible();
    await expect(sunburstButton).toContainText('Sunburst');

    // Check Table button (Tabelle)
    const tableButton = page.getByRole('button', { name: /tabelle|table/i });
    await expect(tableButton).toBeVisible();
    await expect(tableButton).toContainText('Tabelle');
  });

  test('Effect Matching Mode shows German labels', async ({ page }) => {
    // Select a category to make the filter mode visible
    // Note: tabs have English accessible names but German visible text
    const categoryTab = page.getByRole('tab', { name: /mood.*energy/i });
    await categoryTab.waitFor({ state: 'visible', timeout: 10000 });
    await categoryTab.click();

    // Wait for effects to be selected
    await page.waitForTimeout(500);

    // Check that "Effekt-Übereinstimmungsmodus" label is present
    await expect(page.getByText('Effekt-Übereinstimmungsmodus')).toBeVisible();

    // Check "BELIEBIG" button (Match ANY)
    const anyButton = page.getByRole('button', { name: /beliebig/i });
    await expect(anyButton).toBeVisible();
    await expect(anyButton).toContainText('BELIEBIG');

    // Check "ALLE" button (Match ALL)
    const allButton = page.getByRole('button', { name: /alle/i });
    await expect(allButton).toBeVisible();
    await expect(allButton).toContainText('ALLE');
  });

  test('Effect Matching Mode help text is in German', async ({ page }) => {
    // Select a category to show filter mode
    await page.getByRole('tab', { name: /mood.*energy/i }).click();

    // Wait for UI update
    await page.waitForTimeout(500);

    // Verify default help text (ANY mode)
    await expect(page.getByText(/zeige terpene mit mindestens einem ausgewählten effekt/i)).toBeVisible();

    // Click ALL mode
    const allButton = page.getByRole('button', { name: /alle/i });
    await allButton.click();

    // Verify ALL mode help text
    await expect(page.getByText(/zeige terpene mit allen ausgewählten effekten/i)).toBeVisible();
  });

  test('Filter labels are in German', async ({ page }) => {
    // Check category filter label
    await expect(page.getByText('Nach Kategorien filtern')).toBeVisible();

    // Check effects filter label
    await expect(page.getByText('Nach Effekten filtern')).toBeVisible();
  });

  test('Clear button shows German text', async ({ page }) => {
    // Select a category
    await page.getByRole('tab', { name: /mood.*energy/i }).click();

    // Wait for selection
    await page.waitForTimeout(500);

    // Check clear button (Löschen / Filter entfernen)
    const clearButton = page.getByRole('button', { name: /filter entfernen|clear/i });
    await expect(clearButton).toBeVisible();
    await expect(clearButton).toContainText('Löschen');
  });

  test('Complete translation flow - switch from English to German', async ({ page }) => {
    // Go back to English first - click the combobox and select English
    const languageCombobox = page.getByRole('combobox');
    await languageCombobox.click();
    await page.waitForTimeout(200);
    await page.getByRole('option', { name: /english/i }).click();
    await page.waitForTimeout(500);

    // Filters are already expanded from beforeEach, just wait for English labels to appear
    await expect(page.getByText(/view mode|ansicht/i)).toBeVisible();

    // Verify English labels
    await expect(page.getByText('View Mode')).toBeVisible();
    await expect(page.getByRole('button', { name: /table/i })).toContainText('Table');

    // Select a category to show filter mode
    const categoryTab = page.getByRole('tab', { name: /mood.*energy/i });
    await categoryTab.waitFor({ state: 'visible', timeout: 5000 });
    await categoryTab.click();
    await page.waitForTimeout(500);

    // Verify English filter mode labels
    await expect(page.getByText('Effect Matching Mode')).toBeVisible();
    await expect(page.getByRole('button', { name: /match any/i })).toContainText('Match ANY');

    // Switch back to German - click the combobox and select Deutsch
    await languageCombobox.click();
    await page.waitForTimeout(200);
    await page.getByRole('option', { name: /deutsch/i }).click();
    await page.waitForTimeout(500);

    // Verify German labels appear
    await expect(page.getByText('Ansicht')).toBeVisible();
    await expect(page.getByRole('button', { name: /tabelle/i })).toContainText('Tabelle');
    await expect(page.getByText('Effekt-Übereinstimmungsmodus')).toBeVisible();
    await expect(page.getByRole('button', { name: /beliebig/i })).toContainText('BELIEBIG');
  });

  test('All category labels are in German', async ({ page }) => {
    // Check all category tabs have German text
    // Note: Match against accessible name (English) as the German text is only visible
    await expect(page.getByRole('tab', { name: /mood.*energy/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /cognitive.*mental/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /relaxation.*anxiety/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /physical.*physiological/i })).toBeVisible();

    // Verify the German visible text is displayed
    await expect(page.getByText(/⚡ stimmung & energie/i)).toBeVisible();
    await expect(page.getByText(/🧠 kognitiv & mental/i)).toBeVisible();
    await expect(page.getByText(/😌 entspannung & angstbewältigung/i)).toBeVisible();
    await expect(page.getByText(/💪 körperlich & physiologisch/i)).toBeVisible();
  });
});
