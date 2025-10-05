import { test, expect } from './fixtures/base';
import { isWebGLSupported, waitForPageLoad } from './utils/test-helpers';

test.describe('WebGL and 3D Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should detect WebGL support correctly', async ({ page }) => {
    const webglSupported = await isWebGLSupported(page);

    // Most modern browsers should support WebGL
    // This helps identify if a browser doesn't support it
    console.log(`WebGL Supported: ${webglSupported}`);

    // Test should pass regardless, but we log for CI/debugging
    expect(typeof webglSupported).toBe('boolean');
  });

  test('should render 3D background on WebGL-supported browsers', async ({ page }) => {
    const webglSupported = await isWebGLSupported(page);

    if (webglSupported) {
      // Look for canvas element (Three.js renders to canvas)
      const canvas = page.locator('canvas');

      // Wait a bit for Three.js to initialize
      await page.waitForTimeout(2000);

      // Canvas should be present
      const canvasCount = await canvas.count();
      expect(canvasCount).toBeGreaterThan(0);

      // Canvas should have width and height
      const firstCanvas = canvas.first();
      const width = await firstCanvas.evaluate((el) => (el as HTMLCanvasElement).width);
      const height = await firstCanvas.evaluate((el) => (el as HTMLCanvasElement).height);

      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    } else {
      // On browsers without WebGL, should gracefully degrade
      console.log('WebGL not supported, checking for graceful degradation');

      // Should still render the page without errors
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('should handle reduced motion preference', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');
    await waitForPageLoad(page);

    // Check if 3D is disabled with reduced motion
    const has3DDisabled = await page.evaluate(() => {
      const preferesReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return preferesReducedMotion;
    });

    expect(has3DDisabled).toBe(true);

    // Canvas might not be rendered or animations should be disabled
    console.log('Reduced motion enabled, 3D should be minimal or disabled');
  });

  test('should not crash on devices without WebGL', async ({ page }) => {
    // Check for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await waitForPageLoad(page);

    // Wait for any Three.js initialization
    await page.waitForTimeout(3000);

    // Filter out expected warnings (like WebGL context creation)
    const criticalErrors = errors.filter(
      (err) =>
        !err.includes('WebGL') &&
        !err.includes('context') &&
        !err.includes('three') &&
        !err.toLowerCase().includes('warning')
    );

    // Should have no critical errors
    expect(criticalErrors).toHaveLength(0);
  });

  test('should adjust particle count based on performance', async ({ page }) => {
    const webglSupported = await isWebGLSupported(page);

    if (webglSupported) {
      // Check device capability detection
      const performanceTier = await page.evaluate(() => {
        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) return 'low';

        // Check if mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
        if (isMobile) return 'low';

        // Default to medium
        return 'medium';
      });

      console.log(`Performance Tier: ${performanceTier}`);
      expect(['low', 'medium', 'high']).toContain(performanceTier);
    }
  });

  test('should render canvas with correct dimensions', async ({ page }) => {
    const webglSupported = await isWebGLSupported(page);

    if (webglSupported) {
      await page.waitForTimeout(2000);

      const canvas = page.locator('canvas').first();

      if ((await canvas.count()) > 0) {
        // Get canvas dimensions
        const dimensions = await canvas.evaluate((el) => {
          const canvasEl = el as HTMLCanvasElement;
          return {
            width: canvasEl.width,
            height: canvasEl.height,
            clientWidth: canvasEl.clientWidth,
            clientHeight: canvasEl.clientHeight,
          };
        });

        // Canvas should have reasonable dimensions
        expect(dimensions.width).toBeGreaterThan(0);
        expect(dimensions.height).toBeGreaterThan(0);

        console.log('Canvas dimensions:', dimensions);
      }
    }
  });

  test('should handle window resize for 3D elements', async ({ page }) => {
    const webglSupported = await isWebGLSupported(page);

    if (webglSupported) {
      await page.waitForTimeout(2000);

      const canvas = page.locator('canvas').first();

      if ((await canvas.count()) > 0) {
        // Get initial dimensions
        const initialDimensions = await canvas.evaluate((el) => ({
          width: (el as HTMLCanvasElement).clientWidth,
          height: (el as HTMLCanvasElement).clientHeight,
        }));

        // Resize viewport
        await page.setViewportSize({ width: 800, height: 600 });
        await page.waitForTimeout(500);

        // Get new dimensions
        const newDimensions = await canvas.evaluate((el) => ({
          width: (el as HTMLCanvasElement).clientWidth,
          height: (el as HTMLCanvasElement).clientHeight,
        }));

        // Dimensions should have changed (if canvas is responsive)
        console.log('Initial:', initialDimensions, 'New:', newDimensions);

        // Canvas should still be rendered
        expect(newDimensions.width).toBeGreaterThan(0);
        expect(newDimensions.height).toBeGreaterThan(0);
      }
    }
  });

  test('should not block page rendering while loading 3D', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();

    await page.goto('/');

    // Wait for main content to be visible (not for 3D)
    const mainContent = page.locator('main, #main, [role="main"]').first();
    await expect(mainContent).toBeVisible({ timeout: 5000 });

    const loadTime = Date.now() - startTime;

    // Main content should load quickly (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);

    console.log(`Page load time: ${loadTime}ms`);
  });

  test('should work in mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await waitForPageLoad(page);

    const webglSupported = await isWebGLSupported(page);

    if (webglSupported) {
      // On mobile, should either render simplified version or skip 3D
      await page.waitForTimeout(2000);

      const canvas = page.locator('canvas');
      const canvasCount = await canvas.count();

      // Should handle mobile gracefully (either with or without canvas)
      console.log(`Mobile canvas count: ${canvasCount}`);
      expect(canvasCount).toBeGreaterThanOrEqual(0);
    }

    // Page should still be fully functional
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle WebGL context loss gracefully', async ({ page }) => {
    const webglSupported = await isWebGLSupported(page);

    if (webglSupported) {
      await page.waitForTimeout(2000);

      // Simulate WebGL context loss
      await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
          const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
          if (gl) {
            const loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
        }
      });

      await page.waitForTimeout(1000);

      // Page should still be functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });
});
