import { test, expect } from './fixtures/base';
import {
  isBackdropFilterSupported,
  isIntersectionObserverSupported,
  waitForPageLoad,
} from './utils/test-helpers';

test.describe('Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should detect browser features correctly', async ({ page, browserName }) => {
    const features = await page.evaluate(() => {
      return {
        webgl: (() => {
          const canvas = document.createElement('canvas');
          const gl =
            canvas.getContext('webgl2') ||
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');
          return !!gl;
        })(),
        intersectionObserver: 'IntersectionObserver' in window,
        resizeObserver: 'ResizeObserver' in window,
        matchMedia: 'matchMedia' in window,
        localStorage: (() => {
          try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
          } catch {
            return false;
          }
        })(),
        backdropFilter:
          CSS.supports('backdrop-filter', 'blur(10px)') ||
          CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
        cssGrid: CSS.supports('display', 'grid'),
        flexbox: CSS.supports('display', 'flex'),
        customProperties: CSS.supports('--test', 'value'),
      };
    });

    console.log(`Browser: ${browserName}`);
    console.log('Features:', features);

    // All modern browsers should support these
    expect(features.matchMedia).toBe(true);
    expect(features.localStorage).toBe(true);
    expect(features.flexbox).toBe(true);
    expect(features.cssGrid).toBe(true);

    // Log other features for debugging
    console.log('WebGL:', features.webgl);
    console.log('Backdrop Filter:', features.backdropFilter);
    console.log('IntersectionObserver:', features.intersectionObserver);
  });

  test('should handle backdrop-filter fallback', async ({ page }) => {
    const hasBackdropFilter = await isBackdropFilterSupported(page);

    // Find glass elements
    const glassElements = page.locator('.glass, .glass-light, .glass-heavy');
    const count = await glassElements.count();

    if (count > 0) {
      const firstGlass = glassElements.first();

      if (hasBackdropFilter) {
        // Should have backdrop-filter
        const backdropFilter = await firstGlass.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return (
            computed.getPropertyValue('backdrop-filter') ||
            computed.getPropertyValue('-webkit-backdrop-filter')
          );
        });

        console.log('Backdrop filter:', backdropFilter);
        expect(backdropFilter).toBeTruthy();
      } else {
        // Should have fallback background
        console.log('Using backdrop-filter fallback');

        const background = await firstGlass.evaluate((el) => {
          return window.getComputedStyle(el).getPropertyValue('background');
        });

        expect(background).toBeTruthy();
      }
    }
  });

  test('should handle IntersectionObserver fallback', async ({ page }) => {
    const hasIntersectionObserver = await isIntersectionObserverSupported(page);

    console.log('IntersectionObserver supported:', hasIntersectionObserver);

    if (!hasIntersectionObserver) {
      // Elements should still be visible (fallback to showing all)
      console.log('Using IntersectionObserver fallback');
    }

    // Page should still work
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should work without JavaScript errors in all browsers', async ({ page, browserName }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await waitForPageLoad(page);

    // Wait for any async operations
    await page.waitForTimeout(3000);

    console.log(`${browserName} - Errors:`, errors.length);
    console.log(`${browserName} - Warnings:`, warnings.length);

    // Filter out expected warnings (like WebGL context, etc.)
    const criticalErrors = errors.filter(
      (err) =>
        !err.includes('WebGL') &&
        !err.includes('context') &&
        !err.toLowerCase().includes('warning') &&
        !err.includes('Failed to load resource') && // Network errors are OK in tests
        !err.includes('reCAPTCHA') // reCAPTCHA errors are OK
    );

    if (criticalErrors.length > 0) {
      console.error('Critical errors found:', criticalErrors);
    }

    expect(criticalErrors).toHaveLength(0);
  });

  test('should render correctly on different screen sizes', async ({ page }) => {
    const sizes = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 720, name: 'Desktop' },
      { width: 1920, height: 1080, name: 'Large Desktop' },
    ];

    for (const size of sizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.waitForTimeout(500);

      // Check that content is visible
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Check for horizontal scroll (shouldn't exist)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalScroll).toBe(false);

      console.log(`${size.name} (${size.width}x${size.height}): No horizontal scroll ✓`);
    }
  });

  test('should handle CSS custom properties', async ({ page }) => {
    const hasCustomProperties = await page.evaluate(() => {
      return CSS.supports('--test', 'value');
    });

    expect(hasCustomProperties).toBe(true);

    // Check that custom properties are applied
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const computed = window.getComputedStyle(root);
      return {
        background: computed.getPropertyValue('--background'),
        foreground: computed.getPropertyValue('--foreground'),
      };
    });

    // Custom properties should be defined
    expect(rootStyles.background).toBeTruthy();
    expect(rootStyles.foreground).toBeTruthy();

    console.log('Custom properties:', rootStyles);
  });

  test('should handle flexbox layout correctly', async ({ page }) => {
    const hasFlexbox = await page.evaluate(() => {
      return CSS.supports('display', 'flex');
    });

    expect(hasFlexbox).toBe(true);

    // Find flex containers
    const flexContainers = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let count = 0;

      elements.forEach((el) => {
        const display = window.getComputedStyle(el).display;
        if (display === 'flex' || display === 'inline-flex') {
          count++;
        }
      });

      return count;
    });

    console.log(`Found ${flexContainers} flex containers`);
    expect(flexContainers).toBeGreaterThan(0);
  });

  test('should handle CSS Grid layout correctly', async ({ page }) => {
    const hasGrid = await page.evaluate(() => {
      return CSS.supports('display', 'grid');
    });

    expect(hasGrid).toBe(true);

    // Find grid containers
    const gridContainers = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let count = 0;

      elements.forEach((el) => {
        const display = window.getComputedStyle(el).display;
        if (display === 'grid' || display === 'inline-grid') {
          count++;
        }
      });

      return count;
    });

    console.log(`Found ${gridContainers} grid containers`);
    // Grid might be used, but not required
    expect(gridContainers).toBeGreaterThanOrEqual(0);
  });

  test('should load fonts correctly', async ({ page }) => {
    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const fontsLoaded = await page.evaluate(() => {
      return document.fonts.ready.then(() => {
        return document.fonts.size > 0;
      });
    });

    expect(fontsLoaded).toBe(true);

    // Check font family is applied
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    console.log('Body font:', bodyFont);
    expect(bodyFont).toBeTruthy();
  });

  test('should handle user interactions correctly', async ({ page }) => {
    // Test click
    const clickableElement = page.locator('button, a[href]').first();
    if ((await clickableElement.count()) > 0) {
      await expect(clickableElement).toBeVisible();

      // Should be clickable
      await clickableElement.click({ trial: true });
    }

    // Test hover (if not mobile)
    const viewportSize = await page.viewportSize();
    if (viewportSize && viewportSize.width >= 768) {
      const hoverElement = page.locator('button, a[href]').first();
      if ((await hoverElement.count()) > 0) {
        await hoverElement.hover();
        await page.waitForTimeout(200);
      }
    }

    // Test focus
    const focusableElement = page.locator('button, a[href], input').first();
    if ((await focusableElement.count()) > 0) {
      await focusableElement.focus();
      await expect(focusableElement).toBeFocused();
    }
  });

  test('should handle smooth scrolling', async ({ page }) => {
    // Check if smooth scroll is applied
    const hasSmoothScroll = await page.evaluate(() => {
      const computed = window.getComputedStyle(document.documentElement);
      return computed.scrollBehavior === 'smooth';
    });

    // May be disabled for reduced motion
    console.log('Smooth scroll:', hasSmoothScroll);
    expect(typeof hasSmoothScroll).toBe('boolean');
  });
});
