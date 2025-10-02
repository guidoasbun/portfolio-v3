'use client'

import { InteractiveScene } from '@/components/three'
import { useState } from 'react'

export default function InteractiveElementsDemo() {
  const [objectCount, setObjectCount] = useState(8)
  const [scrollEnabled, setScrollEnabled] = useState(true)
  const [parallaxEnabled, setParallaxEnabled] = useState(true)

  return (
    <div className="relative min-h-screen">
      {/* Interactive 3D Background - higher z-index to be visible */}
      <div className="fixed inset-0 z-0">
        <InteractiveScene
          className="w-full h-full"
          objectCount={objectCount}
          enableScrollAnimation={scrollEnabled}
          enableParallax={parallaxEnabled}
        />
      </div>

      {/* Controls */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 dark:text-white">
              Interactive Elements Demo
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Move your mouse or touch the screen to interact with the 3D objects
            </p>
          </div>

          {/* Controls Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              Controls
            </h2>

            {/* Object Count */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Object Count: {objectCount}
              </label>
              <input
                type="range"
                min="2"
                max="20"
                value={objectCount}
                onChange={(e) => setObjectCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Recommended: 4-6 on mobile, 8-12 on desktop
              </p>
            </div>

            {/* Scroll Animation Toggle */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={scrollEnabled}
                  onChange={(e) => setScrollEnabled(e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Enable Scroll Animation
                </span>
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-8">
                Objects will animate as you scroll down the page
              </p>
            </div>

            {/* Parallax Toggle */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={parallaxEnabled}
                  onChange={(e) => setParallaxEnabled(e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Enable Parallax Effect
                </span>
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-8">
                Creates depth perception with layered movement
              </p>
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              Features
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Mouse Interaction
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Objects smoothly follow your mouse cursor with physics-based movement
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Touch Support
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Full touch and swipe gesture support for mobile devices
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Scroll Animation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Objects react to page scroll with organic sine wave movement
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Parallax Effect
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Different depth layers create a 3D parallax illusion
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Theme Support
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Automatically adapts colors and lighting to light/dark mode
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Performance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Optimized for all devices with automatic capability detection
                </p>
              </div>
            </div>
          </div>

          {/* Object Types Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              Object Types
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-4xl">
                  ▫️
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Box
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-4xl">
                  🔵
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sphere
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-4xl">
                  🔺
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tetrahedron
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-4xl">
                  🍩
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Torus
                </p>
              </div>
            </div>
          </div>

          {/* Spacer for scroll testing */}
          <div className="h-screen flex items-center justify-center">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50">
              <p className="text-center text-slate-600 dark:text-slate-300">
                Scroll down to see scroll-based animations
              </p>
            </div>
          </div>

          <div className="h-screen flex items-center justify-center">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50">
              <p className="text-center text-slate-600 dark:text-slate-300">
                Notice how objects move at different speeds as you scroll
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
