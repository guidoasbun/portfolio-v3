import { test as base } from '@playwright/test';

/**
 * Extended test fixture with custom utilities
 */

type CustomFixtures = {
  /**
   * Navigate to home page and wait for it to load
   */
  homePage: void;

  /**
   * Clear all storage before test
   */
  cleanStorage: void;

  /**
   * Set up theme preference
   */
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
};

export const test = base.extend<CustomFixtures>({
  // Navigate to home page
  homePage: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await use();
  },

  // Clear all storage
  cleanStorage: async ({ page }, use) => {
    // Wait for page context to be available
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        // Ignore if storage is not available
      }
    });
    await use();
  },

  // Set theme
  setTheme: async ({ page }, use) => {
    const setThemeFn = async (theme: 'light' | 'dark' | 'system') => {
      await page.evaluate((t) => {
        localStorage.setItem('portfolio-theme', t);
      }, theme);
    };
    await use(setThemeFn);
  },
});

export { expect } from '@playwright/test';
