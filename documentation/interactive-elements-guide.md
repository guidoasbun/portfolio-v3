# Interactive Elements Guide

## Overview

The `InteractiveElements` component provides mouse-responsive, scroll-triggered, and touch-interactive 3D objects that can be added to any section of your portfolio. This component is part of Phase 4.6 of the Three.js integration.

## Features

- **Mouse Following**: Objects smoothly follow the mouse cursor with physics-based movement
- **Touch Support**: Full touch interaction support for mobile devices with swipe gestures
- **Scroll Animations**: Objects animate based on scroll position
- **Parallax Effects**: Different layers of depth with parallax movement
- **Theme Integration**: Automatically adapts colors to light/dark theme
- **Performance Optimized**: Reduced interactions on mobile for better performance
- **Multiple Object Types**: Box, Sphere, Tetrahedron, and Torus geometries

## Components

### InteractiveElements

The core component that renders interactive 3D objects.

```tsx
import { InteractiveElements } from '@/components/three'

<InteractiveElements
  theme="dark"
  enableScrollAnimation={true}
  enableParallax={true}
  objectCount={8}
/>
```

**Props:**

- `theme` (required): `'light' | 'dark'` - Theme mode
- `enableScrollAnimation` (optional): `boolean` - Enable scroll-based animations (default: `true`)
- `enableParallax` (optional): `boolean` - Enable parallax effect (default: `true`)
- `objectCount` (optional): `number` - Number of interactive objects (default: `8`)

### InteractiveScene

A ready-to-use wrapper that includes the Scene component and theme integration.

```tsx
import { InteractiveScene } from '@/components/three'

<InteractiveScene
  className="fixed inset-0 -z-10"
  objectCount={8}
  enableScrollAnimation={true}
  enableParallax={true}
/>
```

**Props:**

- `className` (optional): `string` - CSS classes for the canvas (default: `'w-full h-full'`)
- `objectCount` (optional): `number` - Number of interactive objects (default: `8`)
- `enableScrollAnimation` (optional): `boolean` - Enable scroll animations (default: `true`)
- `enableParallax` (optional): `boolean` - Enable parallax effect (default: `true`)

**Important Note**: When using in pages with existing layouts, wrap in a positioned container to control z-index:

```tsx
<div className="fixed inset-0 z-0">
  <InteractiveScene className="w-full h-full" />
</div>
```

## Usage Examples

### Example 1: Full-Page Background

Add interactive elements as a full-page background:

```tsx
'use client'

import { InteractiveScene } from '@/components/three'

export default function Page() {
  return (
    <div className="relative min-h-screen">
      {/* Interactive 3D background - wrap in positioned container */}
      <div className="fixed inset-0 z-0">
        <InteractiveScene className="w-full h-full" />
      </div>

      {/* Your content - higher z-index */}
      <div className="relative z-10">
        <h1>Your Content</h1>
      </div>
    </div>
  )
}
```

### Example 2: Section Background

Add interactive elements to a specific section:

```tsx
'use client'

import { InteractiveScene } from '@/components/three'

export function HeroSection() {
  return (
    <section className="relative h-screen">
      {/* Interactive elements for this section only */}
      <InteractiveScene
        className="absolute inset-0"
        objectCount={5}
      />

      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1>Welcome to My Portfolio</h1>
      </div>
    </section>
  )
}
```

### Example 3: Manual Scene Setup

For more control, use the components directly:

```tsx
'use client'

import { Scene, InteractiveElements } from '@/components/three'
import { useTheme } from '@/context/theme-context'

export function CustomInteractiveBackground() {
  const { actualTheme } = useTheme()

  return (
    <Scene
      className="fixed inset-0 -z-10"
      config={{
        antialias: true,
        alpha: true
      }}
    >
      <InteractiveElements
        theme={actualTheme as 'light' | 'dark'}
        objectCount={12}
        enableScrollAnimation={true}
        enableParallax={true}
      />
    </Scene>
  )
}
```

### Example 4: Disable Features on Mobile

Create a responsive version that reduces features on mobile:

```tsx
'use client'

import { InteractiveScene } from '@/components/three'
import { useState, useEffect } from 'react'

export function ResponsiveInteractiveBackground() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <InteractiveScene
      objectCount={isMobile ? 4 : 8}
      enableScrollAnimation={!isMobile}
      enableParallax={!isMobile}
    />
  )
}
```

## Performance Considerations

### Object Count

- **Desktop**: 8-12 objects work well
- **Mobile**: 4-6 objects recommended
- **Low-end devices**: 2-4 objects

### Enabling/Disabling Features

You can improve performance by disabling certain features:

```tsx
// Best performance - static objects only
<InteractiveScene
  objectCount={4}
  enableScrollAnimation={false}
  enableParallax={false}
/>

// Balanced - mouse interaction only
<InteractiveScene
  objectCount={6}
  enableScrollAnimation={false}
  enableParallax={true}
/>

// Full features
<InteractiveScene
  objectCount={8}
  enableScrollAnimation={true}
  enableParallax={true}
/>
```

## How It Works

### Mouse Interaction

Objects smoothly follow the mouse with:
- Normalized device coordinates (-1 to +1)
- Smooth interpolation (lerp) for natural movement
- Attraction force that pulls objects toward the mouse
- Automatic return to base position when mouse moves away

### Touch Interaction

On mobile devices:
- Touch and drag to move objects
- Swipe gestures affect object positions
- Objects smoothly return to base position on touch end
- Reduced interaction intensity for better performance

### Scroll Animation

Objects react to page scroll with:
- Sine wave movement based on scroll position
- Different speeds per object for organic feel
- Vertical displacement during scroll

### Parallax Effect

Creates depth perception with:
- Different parallax factors per object
- Objects closer to camera move more
- Objects farther away move less
- Creates 3D depth illusion

## Theming

The component automatically adapts to your theme:

### Dark Theme
- Brighter, more vibrant colors (blue-500, violet-500, etc.)
- Higher opacity (0.7)
- Brighter lighting
- White ambient light

### Light Theme
- Darker, muted colors (blue-700, violet-700, etc.)
- Lower opacity (0.5)
- Softer lighting
- Gray ambient light

## Geometry Types

The component renders 4 types of 3D objects in rotation:

1. **Box** - Cube geometry (0.5 units)
2. **Sphere** - Spherical geometry (0.3 radius, 16 segments)
3. **Tetrahedron** - 4-sided pyramid (0.4 radius)
4. **Torus** - Donut shape (0.3 radius, 0.1 tube)

## Customization

### Adding More Object Types

Edit `InteractiveElements.tsx` in the `geometries` useMemo:

```tsx
const geometries = useMemo(() => {
  const shapes = []
  for (let i = 0; i < objectCount; i++) {
    const type = i % 5  // Changed from 4 to 5
    switch (type) {
      case 0:
        shapes.push(new THREE.BoxGeometry(0.5, 0.5, 0.5))
        break
      // ... existing cases ...
      case 4:
        shapes.push(new THREE.ConeGeometry(0.3, 0.6, 8))
        break
    }
  }
  return shapes
}, [objectCount])
```

### Adjusting Movement Speed

Modify the attraction force in the animation loop:

```tsx
// Current: 0.05 on desktop, 0.03 on mobile
const attraction = isMobile ? 0.03 : 0.05

// Faster movement
const attraction = isMobile ? 0.05 : 0.1

// Slower movement
const attraction = isMobile ? 0.01 : 0.03
```

### Changing Colors

Modify the `colors` array in the component:

```tsx
const colors = useMemo(() => {
  if (theme === 'dark') {
    return ['#ff0000', '#00ff00', '#0000ff'] // Your custom colors
  } else {
    return ['#800000', '#008000', '#000080'] // Your custom colors
  }
}, [theme])
```

## TypeScript Types

```tsx
interface InteractiveElementsProps {
  theme: ThreeTheme // 'light' | 'dark'
  enableScrollAnimation?: boolean
  enableParallax?: boolean
  objectCount?: number
}

interface InteractiveSceneProps {
  className?: string
  objectCount?: number
  enableScrollAnimation?: boolean
  enableParallax?: boolean
}
```

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **WebGL Required**: Falls back gracefully if WebGL is not available
- **Mobile**: iOS Safari 11+, Chrome for Android 60+
- **Performance**: Automatically detects and adjusts for device capability

## Troubleshooting

### Objects Not Appearing

1. Check that WebGL is supported in your browser
2. Verify the Scene component is rendering
3. Check z-index - 3D scene might be behind other elements
4. Ensure theme prop is correctly passed

### Performance Issues

1. Reduce `objectCount`
2. Disable `enableScrollAnimation`
3. Disable `enableParallax`
4. Check for other resource-intensive components

### Mouse Interaction Not Working

1. Verify mouse move events are firing
2. Check if another element is blocking pointer events
3. Ensure viewport is correctly calculated
4. Check browser console for errors

## Next Steps

- Combine with `HeroBackground` for layered 3D effects
- Add custom animations for specific objects
- Integrate with scroll libraries (Framer Motion, GSAP)
- Create themed color palettes
- Add click interactions for individual objects

## Related Documentation

- [Three.js Checklist](./threejs_checklist.md)
- [Implementation Guide](./implementation_guide.md)
- [Roadmap](./roadmap.md)
