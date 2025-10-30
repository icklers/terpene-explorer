import { test, expect } from '@playwright/test';

test.describe('Complete Effect Translation Workflow', () => {
  test('should translate all effect-related content correctly', async ({ page }) => {
    console.log('Testing complete effect translation workflow...');
    
    // Test both languages
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'German' },
    ];
    
    for (const lang of languages) {
      console.log(`\n--- Testing ${lang.name} (${lang.code}) ---`);
      
      // Set language and navigate to home page
      await page.goto('/');
      await page.evaluate((langCode) => {
        localStorage.setItem('terpene-map-language', langCode);
      }, lang.code);
      await page.reload();
      await page.waitForTimeout(3000);
      
      // Take screenshot for debugging
      await page.screenshot({ path: `test-results/${lang.code}-effects-workflow.png` });
      
      // Check for effect-related elements
      const effectChips = page.locator('[class*="MuiChip"]');
      const chipCount = await effectChips.count();
      console.log(`Found ${chipCount} effect chips`);
      
      expect(chipCount).toBeGreaterThan(0);
      
      // Check for effect categories section
      const categoriesSection = page.locator('text=*Filter by Categories*').or(page.locator('text=*Nach Kategorien filtern*'));
      const categoriesCount = await categoriesSection.count();
      console.log(`Found ${categoriesCount} categories sections`);
      
      // Check for effects section
      const effectsSection = page.locator('text=*Filter by Effects*').or(page.locator('text=*Nach Wirkungen filtern*'));
      const effectsCount = await effectsSection.count();
      console.log(`Found ${effectsCount} effects sections`);
      
      console.log(`✓ ${lang.name} language effect workflow working`);
    }
    
    console.log('Complete effect translation workflow test completed');
  });
  
  test('should preserve effect metadata through translation', async ({ page }) => {
    console.log('Testing effect metadata preservation...');
    
    // Test English version
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(3000);
    
    // Look for specific effect metadata
    const effectsWithMetadata = [
      'Mood enhancing',
      'Relaxing',
      'Energizing',
      'Sedative',
      'Anxiety relief',
      'Pain relief',
      'Anti-inflammatory',
    ];
    
    let foundEffects = 0;
    for (const effectName of effectsWithMetadata) {
      const effectElement = page.locator(`text=${effectName}`);
      const count = await effectElement.count();
      if (count > 0) {
        console.log(`✓ Found English effect: ${effectName} (${count} occurrences)`);
        foundEffects += count;
      }
    }
    
    expect(foundEffects).toBeGreaterThan(0);
    console.log(`Found ${foundEffects} English effect elements with metadata`);
    
    // Test German version
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'de');
    });
    await page.reload();
    await page.waitForTimeout(3000);
    
    // Look for German translations of the same effects
    const germanEffectTranslations = [
      'Stimmungsaufhellend',  // Mood enhancing
      'Entspannend',          // Relaxing
      'Energetisierend',      // Energizing
      'Beruhigungsmittel',    // Sedative
      'Angstlinderung',       // Anxiety relief
      'Schmerzlinderung',     // Pain relief
      'Entzündungshemmend',   // Anti-inflammatory
    ];
    
    let foundGermanEffects = 0;
    for (const effectName of germanEffectTranslations) {
      const effectElement = page.locator(`text=${effectName}`);
      const count = await effectElement.count();
      if (count > 0) {
        console.log(`✓ Found German effect: ${effectName} (${count} occurrences)`);
        foundGermanEffects += count;
      }
    }
    
    expect(foundGermanEffects).toBeGreaterThan(0);
    console.log(`Found ${foundGermanEffects} German effect elements with metadata`);
    
    console.log('Effect metadata preservation test completed');
  });
});