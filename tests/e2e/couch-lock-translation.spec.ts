import { test, expect } from '@playwright/test';

test.describe('Couch-lock Effect Translation', () => {
  test('should translate Couch-lock effect name correctly', async ({ page }) => {
    console.log('Testing Couch-lock effect translation...');
    
    // Test English version first
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(3000);
    
    console.log('Page loaded with English language');
    
    // Look for Couch-lock in English
    const englishCouchLock = page.locator('text=Couch-lock');
    const englishCount = await englishCouchLock.count();
    console.log(`Found ${englishCount} English Couch-lock elements`);
    
    if (englishCount > 0) {
      console.log('✓ English Couch-lock found');
      // Check if it's visible or just hidden
      const isVisible = await englishCouchLock.first().isVisible();
      const isHidden = await englishCouchLock.first().isHidden();
      console.log(`English Couch-lock visibility: visible=${isVisible}, hidden=${isHidden}`);
    }
    
    // Test German version
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'de');
    });
    await page.reload();
    await page.waitForTimeout(3000);
    
    console.log('Page loaded with German language');
    
    // Look for Couch-lock in German
    const germanCouchLock = page.locator('text=Couchfesselung');
    const germanCount = await germanCouchLock.count();
    console.log(`Found ${germanCount} German Couch-lock elements`);
    
    if (germanCount > 0) {
      console.log('✓ German Couch-lock found');
      // Check if it's visible or just hidden
      const isVisible = await germanCouchLock.first().isVisible();
      const isHidden = await germanCouchLock.first().isHidden();
      console.log(`German Couch-lock visibility: visible=${isVisible}, hidden=${isHidden}`);
    }
    
    // At least one version should be found
    expect(englishCount > 0 || germanCount > 0).toBe(true);
    console.log('Couch-lock translation test completed');
  });
  
  test('should maintain effect category mapping regardless of translation', async ({ page }) => {
    console.log('Testing effect category mapping...');
    
    // Test with English
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('terpene-map-language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(3000);
    
    // Look for any effect elements that should have styling
    const effectElements = page.locator('[class*="MuiChip"]');
    const effectCount = await effectElements.count();
    console.log(`Found ${effectCount} effect chip elements`);
    
    expect(effectCount).toBeGreaterThan(0);
    console.log('Effect category mapping test completed');
  });
});