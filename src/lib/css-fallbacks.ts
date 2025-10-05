/**
 * CSS Fallback Utilities
 * Provides CSS property fallbacks for better browser compatibility
 */

import type { CSSProperties } from 'react';

/**
 * Get backdrop-filter with vendor prefixes
 */
export function getBackdropFilter(value: string): CSSProperties {
  return {
    backdropFilter: value,
    WebkitBackdropFilter: value,
  } as CSSProperties;
}

/**
 * Get transform with vendor prefixes
 */
export function getTransform(value: string): CSSProperties {
  return {
    transform: value,
    WebkitTransform: value,
    MozTransform: value,
    msTransform: value,
  } as CSSProperties;
}

/**
 * Get transition with vendor prefixes
 */
export function getTransition(value: string): CSSProperties {
  return {
    transition: value,
    WebkitTransition: value,
    MozTransition: value,
  } as CSSProperties;
}

/**
 * Get user-select with vendor prefixes
 */
export function getUserSelect(value: 'none' | 'auto' | 'text' | 'all'): CSSProperties {
  return {
    userSelect: value,
    WebkitUserSelect: value,
    MozUserSelect: value,
    msUserSelect: value,
  } as CSSProperties;
}

/**
 * Get appearance with vendor prefixes
 */
export function getAppearance(value: 'none' | 'auto'): CSSProperties {
  return {
    appearance: value,
    WebkitAppearance: value,
    MozAppearance: value,
  } as CSSProperties;
}

/**
 * Get backdrop-filter style with fallback
 */
export function getBackdropFilterStyle(blur: string, fallbackBg: string): CSSProperties {
  // Check if backdrop-filter is supported
  const isSupported =
    typeof window !== 'undefined' &&
    typeof CSS !== 'undefined' &&
    (CSS.supports('backdrop-filter', blur) || CSS.supports('-webkit-backdrop-filter', blur));

  if (isSupported) {
    return getBackdropFilter(blur);
  }

  // Fallback: use opaque background
  return {
    background: fallbackBg,
  };
}

/**
 * Get glass morphism styles with fallback
 */
export interface GlassMorphismOptions {
  blur?: string;
  background?: string;
  fallbackBackground?: string;
  border?: string;
}

export function getGlassMorphismStyles(options: GlassMorphismOptions = {}): CSSProperties {
  const {
    blur = 'blur(12px)',
    background = 'rgba(255, 255, 255, 0.1)',
    fallbackBackground = 'rgba(255, 255, 255, 0.8)',
    border = '1px solid rgba(255, 255, 255, 0.18)',
  } = options;

  const isBackdropSupported =
    typeof window !== 'undefined' &&
    typeof CSS !== 'undefined' &&
    (CSS.supports('backdrop-filter', blur) || CSS.supports('-webkit-backdrop-filter', blur));

  if (isBackdropSupported) {
    return {
      background,
      backdropFilter: blur,
      WebkitBackdropFilter: blur,
      border,
    } as CSSProperties;
  }

  // Fallback for browsers without backdrop-filter support
  return {
    background: fallbackBackground,
    border,
  };
}

/**
 * Get clip-path with vendor prefixes
 */
export function getClipPath(value: string): CSSProperties {
  return {
    clipPath: value,
    WebkitClipPath: value,
  } as CSSProperties;
}

/**
 * Get mask with vendor prefixes
 */
export function getMask(value: string): CSSProperties {
  return {
    mask: value,
    WebkitMask: value,
  } as CSSProperties;
}

/**
 * Get sticky position with fallback
 */
export function getStickyPosition(top = 0): CSSProperties {
  return {
    position: 'sticky',
    WebkitPosition: 'sticky',
    top,
  } as CSSProperties;
}

/**
 * Get scrollbar styles for webkit browsers
 */
export function getScrollbarStyles(_width = '8px', thumbColor = 'rgba(0,0,0,0.3)'): CSSProperties {
  return {
    scrollbarWidth: 'thin' as const,
    scrollbarColor: `${thumbColor} transparent`,
    // WebKit scrollbar styles need to be in CSS, not inline
    // This returns the base properties only
  } as CSSProperties;
}

/**
 * Check if a CSS property is supported
 */
export function isCSSPropertySupported(property: string, value: string): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.supports) {
    return false;
  }

  return CSS.supports(property, value);
}

/**
 * Get safe CSS property value with fallback
 */
export function getSafeCSSProperty(
  property: string,
  value: string,
  fallbackValue: string
): string {
  if (isCSSPropertySupported(property, value)) {
    return value;
  }
  return fallbackValue;
}
