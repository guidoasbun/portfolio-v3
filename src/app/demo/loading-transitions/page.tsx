'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scene } from '@/components/three/Scene'
import { LoadingRing } from '@/components/three/LoadingAnimation3D'
import { SkeletonLoader3D, MinimalSkeleton } from '@/components/loading/SkeletonLoader3D'
import { PageTransition, SectionTransition } from '@/components/transitions'
import { SceneTransition, CanvasFadeIn } from '@/components/transitions/SceneTransition'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { useTheme } from '@/context/theme-context'
import { PerspectiveCamera } from '@react-three/drei'

export default function LoadingTransitionsDemo() {
  const { actualTheme } = useTheme()
  const [showLoader1, setShowLoader1] = useState(true)
  const [showLoader2, setShowLoader2] = useState(true)
  const [show3DLoading, setShow3DLoading] = useState(false)
  const [triggerTransition, setTriggerTransition] = useState(0)

  return (
    <PageTransition>
      <Container className="py-20 space-y-12">
        {/* Header */}
        <SectionTransition>
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Loading & Transitions Demo
            </h1>
            <p className="text-lg text-foreground/70">
              Preview all loading states and transition animations
            </p>
          </div>
        </SectionTransition>

        {/* 1. Skeleton Loaders */}
        <SectionTransition>
          <GlassCard className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">1. Skeleton Loaders</h2>
              <p className="text-foreground/70">
                Loading placeholders for 3D content with theme-aware styling
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Skeleton */}
              <div>
                <h3 className="font-semibold mb-3">Full Skeleton (with spinner)</h3>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  {showLoader1 ? (
                    <SkeletonLoader3D height="h-full" showSpinner />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                      <p className="text-lg font-semibold">Content Loaded!</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setShowLoader1(!showLoader1)}
                  className="mt-3 w-full"
                  variant="secondary"
                >
                  {showLoader1 ? 'Show Content' : 'Show Loader'}
                </Button>
              </div>

              {/* Minimal Skeleton */}
              <div>
                <h3 className="font-semibold mb-3">Minimal Skeleton</h3>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  {showLoader2 ? (
                    <MinimalSkeleton className="h-full" />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-lg">
                      <p className="text-lg font-semibold">Content Loaded!</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setShowLoader2(!showLoader2)}
                  className="mt-3 w-full"
                  variant="secondary"
                >
                  {showLoader2 ? 'Show Content' : 'Show Loader'}
                </Button>
              </div>
            </div>
          </GlassCard>
        </SectionTransition>

        {/* 2. 3D Loading Animation */}
        <SectionTransition>
          <GlassCard className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">2. 3D Loading Animation</h2>
              <p className="text-foreground/70">
                Rotating torus with particles - theme-aware colors
              </p>
            </div>

            <div className="h-96 rounded-lg overflow-hidden bg-background/50">
              {show3DLoading ? (
                <Scene className="w-full h-full">
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
                  <ambientLight intensity={0.5} />
                  <LoadingRing size={1.2} speed={1.5} />
                </Scene>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-foreground/50">Click button to show 3D loader</p>
                </div>
              )}
            </div>

            <Button
              onClick={() => setShow3DLoading(!show3DLoading)}
              className="w-full"
              variant="primary"
            >
              {show3DLoading ? 'Hide 3D Loader' : 'Show 3D Loader'}
            </Button>
          </GlassCard>
        </SectionTransition>

        {/* 3. Scene Transitions */}
        <SectionTransition>
          <GlassCard className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">3. Scene Transitions</h2>
              <p className="text-foreground/70">
                Smooth fade-in effects for 3D canvas mounting
              </p>
            </div>

            <SceneTransition
              fallback={<SkeletonLoader3D height="h-96" />}
              loadingDelay={200}
            >
              <div className="h-96 rounded-lg overflow-hidden">
                <CanvasFadeIn>
                  <div className="h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold">Scene Loaded!</p>
                      <p className="text-foreground/70">
                        Notice the smooth fade-in effect
                      </p>
                    </div>
                  </div>
                </CanvasFadeIn>
              </div>
            </SceneTransition>
          </GlassCard>
        </SectionTransition>

        {/* 4. Page Transitions */}
        <SectionTransition>
          <GlassCard className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">4. Page Transitions</h2>
              <p className="text-foreground/70">
                Animated content transitions with stagger effects
              </p>
            </div>

            <motion.div
              key={triggerTransition}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="h-64 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center"
            >
              <div className="text-center space-y-2">
                <p className="text-3xl font-bold">Transition #{triggerTransition + 1}</p>
                <p className="text-foreground/70">Click to see slide animation</p>
              </div>
            </motion.div>

            <Button
              onClick={() => setTriggerTransition((prev) => prev + 1)}
              className="w-full"
              variant="primary"
            >
              Trigger Transition
            </Button>
          </GlassCard>
        </SectionTransition>

        {/* 5. Combined Example */}
        <SectionTransition>
          <GlassCard className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">5. Combined Example</h2>
              <p className="text-foreground/70">
                Real-world usage: Skeleton → 3D Loading → Fade In
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="h-40 rounded-lg mb-2">
                    <MinimalSkeleton className="h-full" />
                  </div>
                  <p className="text-sm font-medium">Step 1: Initial Load</p>
                  <p className="text-xs text-foreground/60">Minimal skeleton</p>
                </div>

                <div className="text-center">
                  <div className="h-40 rounded-lg mb-2 overflow-hidden">
                    <Scene className="w-full h-full">
                      <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={75} />
                      <LoadingRing size={0.6} speed={2} />
                    </Scene>
                  </div>
                  <p className="text-sm font-medium">Step 2: Loading</p>
                  <p className="text-xs text-foreground/60">3D animation</p>
                </div>

                <div className="text-center">
                  <CanvasFadeIn>
                    <div className="h-40 rounded-lg mb-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <p className="font-bold text-lg">✓ Ready</p>
                    </div>
                  </CanvasFadeIn>
                  <p className="text-sm font-medium">Step 3: Complete</p>
                  <p className="text-xs text-foreground/60">Smooth fade-in</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </SectionTransition>

        {/* Theme Info */}
        <SectionTransition>
          <GlassCard className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-foreground/70">
                Current Theme: <span className="font-bold capitalize">{actualTheme}</span>
              </p>
              <p className="text-xs text-foreground/50">
                All loading states adapt to your theme automatically
              </p>
            </div>
          </GlassCard>
        </SectionTransition>

        {/* Navigation */}
        <SectionTransition>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => window.location.href = '/'}
              variant="secondary"
            >
              ← Back to Home
            </Button>
            <Button
              onClick={() => window.location.href = '/demo/interactive-elements'}
              variant="secondary"
            >
              Interactive Elements →
            </Button>
          </div>
        </SectionTransition>
      </Container>
    </PageTransition>
  )
}
