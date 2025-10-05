import { test, expect } from './fixtures/base';
import { getCurrentTheme, getLocalStorageItem, hasClass } from './utils/test-helpers';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page, cleanStorage }) => {
    // Clean storage is handled by fixture
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should default to system theme', async ({ page }) => {
    const storedTheme = await getLocalStorageItem(page, 'portfolio-theme');

    // Should either be null (not set) or 'system'
    if (storedTheme) {
      expect(storedTheme).toBe('system');
    }

    // Check if html has either light or dark class based on system preference
    const currentTheme = await getCurrentTheme(page);
    expect(['light', 'dark']).toContain(currentTheme);
  });

  test('should switch to light theme', async ({ page }) => {
    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await themeToggle.click();

    // Click light theme option
    const lightOption = page.locator('button[role="menuitemradio"]').filter({ hasText: 'Light' });
    await lightOption.click();

    // Wait for theme to apply
    await page.waitForTimeout(500);

    // Verify localStorage
    const storedTheme = await getLocalStorageItem(page, 'portfolio-theme');
    expect(storedTheme).toBe('light');

    // Verify HTML class
    const hasLightClass = await hasClass(page, 'html', 'light');
    expect(hasLightClass).toBe(true);

    // Verify background color is light
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Light theme should have white or very light background
    // RGB values for white or near-white
    expect(bgColor).toMatch(/rgb\((255|25[0-4]),\s*(255|25[0-4]),\s*(255|25[0-4])\)/);
  });

  test('should switch to dark theme', async ({ page }) => {
    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await themeToggle.click();

    // Click dark theme option
    const darkOption = page.locator('button[role="menuitemradio"]').filter({ hasText: 'Dark' });
    await darkOption.click();

    // Wait for theme to apply
    await page.waitForTimeout(500);

    // Verify localStorage
    const storedTheme = await getLocalStorageItem(page, 'portfolio-theme');
    expect(storedTheme).toBe('dark');

    // Verify HTML class
    const hasDarkClass = await hasClass(page, 'html', 'dark');
    expect(hasDarkClass).toBe(true);

    // Verify background color is dark
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Dark theme should have dark background
    // RGB values for very dark colors (near black)
    expect(bgColor).toMatch(/rgb\((1?\d|[0-2]\d),\s*(1?\d|[0-2]\d),\s*(1?\d|[0-2]\d)\)/);
  });

  test('should persist theme across page reloads', async ({ page }) => {
    // Set dark theme
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await themeToggle.click();

    const darkOption = page.locator('button[role="menuitemradio"]').filter({ hasText: 'Dark' });
    await darkOption.click();

    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify theme persisted
    const storedTheme = await getLocalStorageItem(page, 'portfolio-theme');
    expect(storedTheme).toBe('dark');

    const hasDarkClass = await hasClass(page, 'html', 'dark');
    expect(hasDarkClass).toBe(true);
  });

  test('should show correct theme icon in toggle', async ({ page }) => {
    // Check initial icon (should be system, light, or dark)
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    const initialText = await themeToggle.textContent();
    expect(['Light', 'Dark', 'System']).toContain(initialText?.trim());

    // Switch to light
    await themeToggle.click();
    const lightOption = page.locator('button[role="menuitemradio"]').filter({ hasText: 'Light' });
    await lightOption.click();
    await page.waitForTimeout(300);

    // Verify toggle shows "Light"
    const lightText = await themeToggle.textContent();
    expect(lightText?.trim()).toBe('Light');

    // Switch to dark
    await themeToggle.click();
    const darkOption = page.locator('button[role="menuitemradio"]').filter({ hasText: 'Dark' });
    await darkOption.click();
    await page.waitForTimeout(300);

    // Verify toggle shows "Dark"
    const darkText = await themeToggle.textContent();
    expect(darkText?.trim()).toBe('Dark');
  });

  test('should handle keyboard navigation in theme menu', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');

    // Focus and open menu with Enter
    await themeToggle.focus();
    await page.keyboard.press('Enter');

    // Wait for menu to open
    await page.waitForTimeout(200);

    // Verify menu is open
    const menu = page.locator('[role="menuitemradio"]').first();
    await expect(menu).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');

    // Wait for menu to close
    await page.waitForTimeout(200);

    // Verify menu is closed
    await expect(menu).not.toBeVisible();
  });

  test('should support system theme preference changes', async ({ page }) => {
    // Set to system theme
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await themeToggle.click();

    const systemOption = page.locator('button[role="menuitemradio"]').filter({ hasText: 'System' });
    await systemOption.click();

    await page.waitForTimeout(500);

    // Verify stored as system
    const storedTheme = await getLocalStorageItem(page, 'portfolio-theme');
    expect(storedTheme).toBe('system');

    // Theme should match system preference
    const systemPrefersDark = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const hasDarkClass = await hasClass(page, 'html', 'dark');
    expect(hasDarkClass).toBe(systemPrefersDark);
  });

  test('should apply theme without hydration errors', async ({ page }) => {
    // Collect console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Set theme
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await themeToggle.click();

    const darkOption = page.locator('button[role="menuitemradio"]').filter({ hasText: 'Dark' });
    await darkOption.click();

    await page.waitForTimeout(1000);

    // Check for hydration errors
    const hydrationErrors = errors.filter(
      (err) => err.includes('hydration') || err.includes('Hydration')
    );

    expect(hydrationErrors).toHaveLength(0);
  });

  test('should work correctly in mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Theme toggle should be accessible
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();

    // Should be able to change theme
    await themeToggle.click();
    const darkOption = page.locator('button[role="menuitemradio"]').filter({ hasText: 'Dark' });
    await darkOption.click();

    await page.waitForTimeout(500);

    // Verify theme changed
    const hasDarkClass = await hasClass(page, 'html', 'dark');
    expect(hasDarkClass).toBe(true);
  });
});
