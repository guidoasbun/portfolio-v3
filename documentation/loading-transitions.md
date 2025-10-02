# Loading & Transitions System

## Overview

This document describes the loading and transitions system implemented for the portfolio, focusing on smooth 3D scene loading, page transitions, and progressive enhancement.

## Components

### 1. LoadingAnimation3D

**Location:** `src/components/three/LoadingAnimation3D.tsx`

A 3D loading animation using Three.js with a rotating torus and particles.

**Features:**
- Theme-aware colors (adapts to light/dark mode)
- Configurable size and speed
- Particle system around the torus
- Smooth rotation animations

**Usage:**
```tsx
import { LoadingRing } from '@/components/three'
import { Scene } from '@/components/three'

<Scene>
  <LoadingRing size={1} speed={1} />
</Scene>
```

### 2. PageTransition

**Location:** `src/components/transitions/PageTransition.tsx`

Provides smooth transitions between page views using Framer Motion.

**Features:**
- Fade and slide animations
- AnimatePresence for exit animations
- Pathname-based key for route changes
- Section-level transitions with viewport detection

**Usage:**
```tsx
import { PageTransition, SectionTransition } from '@/components/transitions'

// Wrap entire page
<PageTransition>
  <YourPage />
</PageTransition>

// Wrap individual sections
<SectionTransition>
  <YourSection />
</SectionTransition>
```

### 3. SceneTransition

**Location:** `src/components/transitions/SceneTransition.tsx`

Handles smooth mounting and unmounting of 3D scenes.

**Components:**
- `SceneTransition` - Main wrapper with loading delay
- `CanvasFadeIn` - Simple fade-in for canvas elements

**Features:**
- Configurable loading delay
- Fallback support during initialization
- Smooth opacity transitions

**Usage:**
```tsx
import { SceneTransition } from '@/components/transitions'

<SceneTransition fallback={<Loading />} loadingDelay={100}>
  <Your3DScene />
</SceneTransition>
```

### 4. SkeletonLoader3D

**Location:** `src/components/loading/SkeletonLoader3D.tsx`

Loading placeholder for 3D content with gradient animation.

**Features:**
- Theme-aware gradients
- Animated shimmer effect
- Optional loading spinner
- Customizable height
- Minimal variant for better performance

**Usage:**
```tsx
import { SkeletonLoader3D, MinimalSkeleton } from '@/components/loading'

// Full skeleton with spinner
<SkeletonLoader3D height="h-screen" showSpinner />

// Minimal skeleton (better performance)
<MinimalSkeleton className="h-64" />
```

## Hooks

### useLazyThree

**Location:** `src/hooks/useLazyThree.ts`

Hook for lazy loading Three.js components with performance detection.

**Features:**
- Automatic performance tier detection
- Configurable delay for progressive loading
- Error handling
- Loading states management

**Return Values:**
```typescript
{
  shouldLoad: boolean      // Whether 3D should be loaded
  isLoading: boolean      // Loading state
  isReady: boolean        // Ready to render
  performanceTier: PerformanceTier  // Device capability
  error: Error | null     // Any loading errors
}
```

**Usage:**
```tsx
import { useLazyThree } from '@/hooks/useLazyThree'

function MyComponent() {
  const { shouldLoad, isReady, performanceTier } = useLazyThree(100)

  if (!shouldLoad || !isReady) {
    return <SkeletonLoader3D />
  }

  return <My3DScene tier={performanceTier} />
}
```

### useLazyThreeInView

Variant that only loads when the element enters the viewport (for advanced use cases).

## Updated Components

### Scene Component

**Updates:**
- Integrated `CanvasFadeIn` for smooth mounting
- Shows `MinimalSkeleton` during SSR and initialization
- Added `isReady` state for smoother transitions
- 150ms delay before showing canvas for better UX

### HeroBackground Component

**Updates:**
- Uses `dynamic` imports for code splitting
- Implements `useLazyThree` hook for lazy loading
- Shows `SkeletonLoader3D` while loading
- Optimized bundle size by lazy loading:
  - Scene component
  - ParticleSystem component
  - PerspectiveCamera from drei

## Performance Optimizations

### Bundle Splitting

All Three.js components are now lazy-loaded:
- Reduces initial bundle size
- Improves Time to Interactive (TTI)
- Better Core Web Vitals scores

### Progressive Enhancement

1. **SSR Phase:** Shows minimal skeleton
2. **Client Mount:** Detects 3D capability
3. **Performance Check:** Determines optimal settings
4. **Lazy Load:** Loads 3D components if supported
5. **Render:** Fades in 3D scene smoothly

### Loading Sequence

```
SSR → Skeleton → Capability Check → Load 3D → Fade In → Ready
```

## Theme Integration

All loading and transition components integrate with the theme context:

- Loading animations use theme colors
- Skeletons adapt to light/dark mode
- 3D scenes receive theme prop for consistent styling

## Best Practices

### 1. Use Dynamic Imports for 3D

```tsx
const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <SkeletonLoader3D />
})
```

### 2. Add Loading States

```tsx
const { shouldLoad, isReady } = useLazyThree()

if (!shouldLoad) return <Fallback2D />
if (!isReady) return <SkeletonLoader3D />

return <Scene3D />
```

### 3. Progressive Delays

Stagger 3D component loading to avoid blocking:

```tsx
const hero = useLazyThree(0)      // Load immediately
const projects = useLazyThree(500) // Load after 500ms
const skills = useLazyThree(1000)  // Load after 1000ms
```

### 4. Fallback Strategies

Always provide fallbacks for:
- No WebGL support
- Low-performance devices
- Prefers-reduced-motion users
- Loading errors

## TypeScript Types

All components are fully typed with no `any` types:

```typescript
interface SceneTransitionProps {
  children: React.ReactNode
  className?: string
  fallback?: React.ReactNode
  loadingDelay?: number
}

interface UseLazyThreeReturn {
  shouldLoad: boolean
  isLoading: boolean
  isReady: boolean
  performanceTier: PerformanceTier
  error: Error | null
}
```

## Testing

To verify the loading and transitions system:

1. **Build the project:** `npm run build`
2. **Check bundle sizes** in `.next/analyze`
3. **Test on slow network** (DevTools throttling)
4. **Test on low-end devices** (CPU throttling)
5. **Verify smooth transitions** between pages/sections

## Metrics

Expected improvements:
- **Initial Bundle Size:** -40% (Three.js lazy loaded)
- **Time to Interactive:** < 3s (progressive loading)
- **First Contentful Paint:** < 1.5s (skeleton shows immediately)
- **Smooth Animations:** 60fps transitions

## Future Enhancements

Potential improvements:
- Preloading 3D assets on hover
- Service worker caching for 3D bundles
- Further chunk optimization
- Intersection Observer for viewport-based loading
- Loading progress indicators with percentage
