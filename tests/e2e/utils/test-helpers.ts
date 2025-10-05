import { Page, expect } from '@playwright/test';

/**
 * Test helper utilities for Playwright tests
 */

/**
 * Wait for page to be fully loaded including all resources
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('load');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * Check if element is visible and enabled
 */
export async function isElementReady(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector);
    await expect(element).toBeVisible({ timeout: 5000 });
    const isEnabled = await element.isEnabled();
    return isEnabled;
  } catch {
    return false;
  }
}

/**
 * Get computed style of an element
 */
export async function getComputedStyle(
  page: Page,
  selector: string,
  property: string
): Promise<string> {
  return page.evaluate(
    ({ sel, prop }) => {
      const element = document.querySelector(sel);
      if (!element) return '';
      return window.getComputedStyle(element).getPropertyValue(prop);
    },
    { sel: selector, prop: property }
  );
}

/**
 * Check if element has class
 */
export async function hasClass(
  page: Page,
  selector: string,
  className: string
): Promise<boolean> {
  const element = page.locator(selector);
  const classes = await element.getAttribute('class');
  return classes ? classes.split(' ').includes(className) : false;
}

/**
 * Wait for animation to complete
 */
export async function waitForAnimation(page: Page, selector: string): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const element = document.querySelector(sel);
      if (!element) return true;
      const animations = element.getAnimations();
      return animations.length === 0;
    },
    selector,
    { timeout: 10000 }
  );
}

/**
 * Check if WebGL is supported in the browser
 */
export async function isWebGLSupported(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  });
}

/**
 * Check if backdrop-filter is supported
 */
export async function isBackdropFilterSupported(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return (
      CSS.supports('backdrop-filter', 'blur(10px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
    );
  });
}

/**
 * Get current theme from document
 */
export async function getCurrentTheme(page: Page): Promise<'light' | 'dark'> {
  return page.evaluate(() => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) return 'dark';
    if (html.classList.contains('light')) return 'light';
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });
}

/**
 * Get localStorage item
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

/**
 * Set localStorage item
 */
export async function setLocalStorageItem(
  page: Page,
  key: string,
  value: string
): Promise<void> {
  await page.evaluate(
    ({ k, v }) => localStorage.setItem(k, v),
    { k: key, v: value }
  );
}

/**
 * Clear localStorage
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Take screenshot with custom name
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  fullPage = false
): Promise<void> {
  await page.screenshot({
    path: `tests/e2e/screenshots/${name}.png`,
    fullPage,
  });
}

/**
 * Check if IntersectionObserver is supported
 */
export async function isIntersectionObserverSupported(page: Page): Promise<boolean> {
  return page.evaluate(() => 'IntersectionObserver' in window);
}

/**
 * Get viewport size
 */
export async function getViewportSize(page: Page): Promise<{ width: number; height: number }> {
  return page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
}

/**
 * Scroll to element
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300); // Wait for scroll animation
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Get console messages
 */
export function collectConsoleMessages(page: Page): { messages: string[]; errors: string[] } {
  const messages: string[] = [];
  const errors: string[] = [];

  page.on('console', (msg) => {
    const text = msg.text();
    messages.push(text);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  return { messages, errors };
}

/**
 * Check for JavaScript errors on the page
 */
export async function checkForJavaScriptErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
}

/**
 * Simulate slow network connection
 */
export async function simulateSlowNetwork(page: Page): Promise<void> {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (500 * 1024) / 8, // 500 kbps
    uploadThroughput: (500 * 1024) / 8,
    latency: 400, // 400ms latency
  });
}

/**
 * Check accessibility violations (basic check)
 */
export async function checkBasicAccessibility(page: Page): Promise<string[]> {
  const violations: string[] = [];

  // Check for images without alt text
  const imagesWithoutAlt = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images
      .filter((img) => !img.alt && !img.getAttribute('aria-label'))
      .map((img) => img.src);
  });

  if (imagesWithoutAlt.length > 0) {
    violations.push(`Found ${imagesWithoutAlt.length} images without alt text`);
  }

  // Check for buttons without accessible labels
  const buttonsWithoutLabel = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons
      .filter(
        (btn) =>
          !btn.textContent?.trim() &&
          !btn.getAttribute('aria-label') &&
          !btn.getAttribute('aria-labelledby')
      )
      .map((btn) => btn.outerHTML);
  });

  if (buttonsWithoutLabel.length > 0) {
    violations.push(`Found ${buttonsWithoutLabel.length} buttons without accessible labels`);
  }

  return violations;
}
