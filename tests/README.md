# E2E Tests

End-to-end tests for the portfolio using Playwright.

## Quick Start

### Install Playwright Browsers (First Time)

```bash
npx playwright install
```

### Run All Tests

```bash
npm run test:e2e
```

### Run Tests in UI Mode (Recommended for Development)

```bash
npm run test:e2e:ui
```

## Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all tests across all browsers |
| `npm run test:e2e:ui` | Run tests in interactive UI mode |
| `npm run test:e2e:chromium` | Run tests in Chrome only |
| `npm run test:e2e:firefox` | Run tests in Firefox only |
| `npm run test:e2e:webkit` | Run tests in Safari only |
| `npm run test:e2e:mobile` | Run tests on mobile browsers |

## Test Structure

```
tests/
├── e2e/
│   ├── fixtures/
│   │   └── base.ts           # Custom Playwright fixtures
│   ├── utils/
│   │   └── test-helpers.ts   # Test utility functions
│   ├── theme.spec.ts          # Theme switching tests
│   ├── webgl.spec.ts          # WebGL/3D feature tests
│   ├── forms.spec.ts          # Form interaction tests
│   └── browser-compat.spec.ts # Browser compatibility tests
└── README.md                  # This file
```

## Test Coverage

### Theme Tests (`theme.spec.ts`)
- ✅ Default to system theme
- ✅ Switch between light/dark/system themes
- ✅ Theme persistence across page reloads
- ✅ Theme icon display
- ✅ Keyboard navigation
- ✅ System preference changes
- ✅ No hydration errors
- ✅ Mobile viewport support

### WebGL Tests (`webgl.spec.ts`)
- ✅ WebGL support detection
- ✅ 3D background rendering
- ✅ Reduced motion preference handling
- ✅ Performance tier detection
- ✅ Canvas dimensions and resize
- ✅ Page load performance
- ✅ Mobile viewport optimization
- ✅ WebGL context loss recovery

### Form Tests (`forms.spec.ts`)
- ✅ Contact form display
- ✅ Required field validation
- ✅ Email format validation
- ✅ Form submission
- ✅ Character count display
- ✅ Keyboard navigation
- ✅ Error handling
- ✅ Mobile responsiveness
- ✅ Accessibility (labels, ARIA)

### Browser Compatibility Tests (`browser-compat.spec.ts`)
- ✅ Feature detection (WebGL, IntersectionObserver, etc.)
- ✅ Backdrop-filter fallback
- ✅ No JavaScript errors across browsers
- ✅ Responsive design (multiple viewports)
- ✅ CSS Grid and Flexbox support
- ✅ Custom properties support
- ✅ Font loading
- ✅ User interactions

## Browsers Tested

- ✅ **Chrome/Chromium** (Desktop & Mobile)
- ✅ **Firefox** (Desktop)
- ✅ **Safari/WebKit** (Desktop & iOS)
- ✅ **Edge** (Desktop)
- ✅ **Tablet** (iPad Pro)

## Viewing Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Writing New Tests

### Using Custom Fixtures

```typescript
import { test, expect } from './fixtures/base';

test('my test', async ({ page, homePage, cleanStorage }) => {
  // homePage: Already navigated to home
  // cleanStorage: localStorage/sessionStorage cleared

  // Your test code here
});
```

### Using Test Helpers

```typescript
import {
  isWebGLSupported,
  getCurrentTheme,
  waitForPageLoad
} from './utils/test-helpers';

test('example', async ({ page }) => {
  await page.goto('/');
  await waitForPageLoad(page);

  const hasWebGL = await isWebGLSupported(page);
  const theme = await getCurrentTheme(page);

  // Assertions
  expect(hasWebGL).toBe(true);
});
```

## CI/CD Integration

The test suite is configured to run in CI environments:

- Retries failed tests 2 times
- Captures screenshots on failure
- Records video on retry
- Collects traces on first retry
- Runs tests in parallel (configurable workers)

## Debugging Tests

### Debug Mode

Run tests in debug mode:

```bash
npx playwright test --debug
```

### Step Through Tests

Run tests in headed mode (see browser):

```bash
npx playwright test --headed
```

### Slow Motion

Run tests with slow motion:

```bash
npx playwright test --headed --slow-mo=1000
```

### Specific Test

Run a specific test file:

```bash
npx playwright test theme.spec.ts
```

Run a specific test by name:

```bash
npx playwright test -g "should switch to dark theme"
```

## Troubleshooting

### Browsers Not Installed

If you see "Executable doesn't exist" errors:

```bash
npx playwright install
```

### Port Already in Use

If port 3000 is in use, the tests will fail. Stop any dev servers:

```bash
# Kill process on port 3000
npx kill-port 3000
```

### Timeouts

Increase timeout in `playwright.config.ts`:

```typescript
timeout: 60 * 1000, // 60 seconds
```

## Best Practices

1. **Use fixtures** for common setup (`homePage`, `cleanStorage`)
2. **Use test helpers** instead of duplicating code
3. **Wait for elements** before interacting (use `expect().toBeVisible()`)
4. **Check for errors** in console (use error collectors)
5. **Test accessibility** (ARIA labels, keyboard navigation)
6. **Test mobile** viewports for responsive design
7. **Handle async** operations properly (no arbitrary waits)

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Project Documentation](../documentation/phase-8.3-cross-browser-testing.md)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
