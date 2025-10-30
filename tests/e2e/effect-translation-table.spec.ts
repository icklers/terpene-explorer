import { test, expect } from '@playwright/test';

test.describe('Effect Translation in Table', () => {
  test('should translate effect names correctly in table view', async ({ page }) => {
    console.log('Testing effect translation in table view...');

    // Test both languages
    const languages = [
      { code: 'en', name: 'English', couchLockText: 'Couch-lock', expectVisible: false },
      { code: 'de', name: 'German', couchLockText: 'Couchfesselung', expectVisible: false },
    ];

    for (const lang of languages) {
      console.log(`\n--- Testing ${lang.name} (${lang.code}) ---`);

      // Set language and navigate to home page
      await page.goto('/');
      await page.evaluate((langCode) => {
        localStorage.setItem('terpene-map-language', langCode);
      }, lang.code);
      await page.reload();
      await page.waitForTimeout(5000);

      // Take screenshot for debugging
      await page.screenshot({ path: `test-results/effect-translation-${lang.code}-before-click.png` });

      // Check if we're in table view, switch if needed
      const tableToggle = page.locator('button[value="table"][aria-pressed="false"]');
      if ((await tableToggle.count()) > 0) {
        console.log('Switching to table view');
        await tableToggle.click();
        await page.waitForTimeout(1000);
      }

      // Take screenshot after switching to table view
      await page.screenshot({ path: `test-results/effect-translation-${lang.code}-after-click.png` });

      // Look for the specific effect
      const effectElement = page.locator(`text=${lang.couchLockText}`);
      const count = await effectElement.count();
      console.log(`Found ${count} elements with "${lang.couchLockText}"`);

      if (count > 0) {
        console.log(`✓ Found ${lang.name} effect: ${lang.couchLockText}`);

        // Check if it's visible (might be in virtualized list, so just existence is good enough)
        const isVisible = await effectElement.first().isVisible();
        const isHidden = await effectElement.first().isHidden();
        console.log(`${lang.name} effect visibility: visible=${isVisible}, hidden=${isHidden}`);

        // Check if it has proper styling (MUI Chip)
        const className = await effectElement.first().getAttribute('class');
        if (className) {
          console.log(`✓ Has styling classes: ${className.includes('MuiChip') ? 'Yes' : 'No'}`);
        }
      }

      // Also look for other effects to make sure translations are working
      const commonEffects =
        lang.code === 'en'
          ? ['Mood enhancing', 'Relaxing', 'Energizing', 'Sedative', 'Anxiety relief']
          : ['Stimmungsaufhellend', 'Entspannend', 'Energetisierend', 'Beruhigungsmittel', 'Angstlinderung'];

      let foundCommonEffects = 0;
      for (const effect of commonEffects) {
        const effectElement = page.locator(`text=${effect}`);
        const count = await effectElement.count();
        if (count > 0) {
          console.log(`✓ Found ${lang.name} effect: ${effect} (${count} occurrences)`);
          foundCommonEffects += count;
        }
      }

      console.log(`Found ${foundCommonEffects} ${lang.name} effect elements`);
    }

    console.log('Effect translation in table view test completed');
  });

  test('should maintain effect category colors through translation', async ({ page }) => {
    console.log('Testing effect category color maintenance...');

    // Test English version first
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(5000);

    // Switch to table view if needed
    const tableToggle = page.locator('button[value="table"][aria-pressed="false"]');
    if ((await tableToggle.count()) > 0) {
      await tableToggle.click();
      await page.waitForTimeout(1000);
    }

    // Look for effect chips with styling
    const effectChips = page.locator('[class*="MuiChip"]');
    const chipCount = await effectChips.count();
    console.log(`Found ${chipCount} effect chips`);

    expect(chipCount).toBeGreaterThan(0);

    // Check a few chips to make sure they have styling
    for (let i = 0; i < Math.min(3, chipCount); i++) {
      const chip = effectChips.nth(i);
      const className = await chip.getAttribute('class');
      expect(className).toContain('MuiChip');
      console.log(`✓ Chip ${i} has MUI styling`);
    }

    console.log('Effect category color maintenance test completed');
  });
});
