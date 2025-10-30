'use client'

import React from 'react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'

export default function LayoutComponentsDemo() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      {/* Hero Section */}
      <Section id="home" spacing="xl" background="transparent">
        <Container size="lg">
          <div className="text-center space-y-6 py-20">
            <Heading as="h1" className="animate-[slideUp_0.5s_ease-out]">
              Layout Components Demo
            </Heading>
            <Text size="lg" className="max-w-2xl mx-auto animate-[slideUp_0.6s_ease-out]">
              This page demonstrates all the layout components including Navbar,
              MobileMenu, Footer, ScrollToTop, and GradientBackground with glass morphism effects.
            </Text>
            <div className="flex flex-wrap gap-4 justify-center animate-[slideUp_0.7s_ease-out]">
              <Button variant="primary" onClick={() => scrollToSection('features')}>
                Explore Features
              </Button>
              <Button variant="secondary" onClick={() => scrollToSection('components')}>
                View Components
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section id="features" spacing="lg" background="glass">
        <Container size="lg">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Heading as="h2">Layout Features</Heading>
              <Text size="lg" className="text-foreground/60">
                Explore the key features of our layout system
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  N
                </div>
                <Heading as="h3">Navbar</Heading>
                <Text size="sm" className="text-foreground/60">
                  Sticky navigation with glass morphism effect, active section tracking,
                  and smooth scroll navigation.
                </Text>
              </GlassCard>

              <GlassCard className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00274C] to-[#E17000] flex items-center justify-center text-white text-2xl font-bold">
                  M
                </div>
                <Heading as="h3">Mobile Menu</Heading>
                <Text size="sm" className="text-foreground/60">
                  Responsive hamburger menu with animated drawer, backdrop blur,
                  and smooth transitions.
                </Text>
              </GlassCard>

              <GlassCard className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                  F
                </div>
                <Heading as="h3">Footer</Heading>
                <Text size="sm" className="text-foreground/60">
                  Comprehensive footer with social links, quick navigation,
                  and contact information.
                </Text>
              </GlassCard>
            </div>
          </div>
        </Container>
      </Section>

      {/* Components Section */}
      <Section id="components" spacing="lg" background="gradient">
        <Container size="lg">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Heading as="h2">Component Details</Heading>
              <Text size="lg" className="text-foreground/60">
                Technical implementation and features
              </Text>
            </div>

            <div className="space-y-6">
              <GlassCard className="p-8">
                <Heading as="h3" className="mb-4">Gradient Background</Heading>
                <Text className="mb-4 text-foreground/60">
                  The animated gradient background features three floating orbs with
                  smooth animations that create depth and visual interest. The background
                  is theme-aware and adjusts opacity based on light/dark mode.
                </Text>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li>• Animated gradient orbs with Framer Motion</li>
                  <li>• Theme-aware color adjustments</li>
                  <li>• Optional grid pattern overlay</li>
                  <li>• Performance optimized animations</li>
                </ul>
              </GlassCard>

              <GlassCard className="p-8">
                <Heading as="h3" className="mb-4">Scroll to Top</Heading>
                <Text className="mb-4 text-foreground/60">
                  A floating button that appears when you scroll down 300px.
                  Click it to smoothly scroll back to the top. Try scrolling down
                  to see it in action!
                </Text>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li>• Appears after scrolling 300px</li>
                  <li>• Smooth scroll animation</li>
                  <li>• Glass morphism styling</li>
                  <li>• Hover and tap animations</li>
                </ul>
              </GlassCard>

              <GlassCard className="p-8">
                <Heading as="h3" className="mb-4">Glass Morphism Design</Heading>
                <Text className="mb-4 text-foreground/60">
                  All components use the glass morphism design system with backdrop
                  blur, transparency, and subtle borders for a modern look.
                </Text>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="glass-light p-4 rounded-lg text-center">
                    <Text size="sm" className="font-medium">Glass Light</Text>
                  </div>
                  <div className="glass p-4 rounded-lg text-center">
                    <Text size="sm" className="font-medium">Glass Medium</Text>
                  </div>
                  <div className="glass-heavy p-4 rounded-lg text-center">
                    <Text size="sm" className="font-medium">Glass Heavy</Text>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </Container>
      </Section>

      {/* About Section */}
      <Section id="about" spacing="lg" background="transparent">
        <Container size="lg">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Heading as="h2">About This Demo</Heading>
              <Text size="lg" className="text-foreground/60 max-w-3xl mx-auto">
                This demo page showcases the layout components built for Phase 2.3
                of the portfolio development roadmap.
              </Text>
            </div>

            <GlassCard className="p-8 max-w-3xl mx-auto">
              <Heading as="h3" className="mb-4">TypeScript & Type Safety</Heading>
              <Text className="mb-4 text-foreground/60">
                All components are built with proper TypeScript typing:
              </Text>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>• No <code className="px-2 py-1 bg-foreground/10 rounded">any</code> types used</li>
                <li>• Proper React event handler types</li>
                <li>• Interface definitions for all props</li>
                <li>• Extends React HTML attributes where appropriate</li>
                <li>• Full type inference support</li>
              </ul>
            </GlassCard>
          </div>
        </Container>
      </Section>

      {/* Projects Section (placeholder) */}
      <Section id="projects" spacing="lg" background="glass">
        <Container size="lg">
          <div className="text-center space-y-4 py-12">
            <Heading as="h2">Projects Section</Heading>
            <Text size="lg" className="text-foreground/60">
              This section will be populated in Phase 3 with project showcases
            </Text>
          </div>
        </Container>
      </Section>

      {/* Experience Section (placeholder) */}
      <Section id="experience" spacing="lg" background="gradient">
        <Container size="lg">
          <div className="text-center space-y-4 py-12">
            <Heading as="h2">Experience Section</Heading>
            <Text size="lg" className="text-foreground/60">
              Timeline and experience details will be added in Phase 3
            </Text>
          </div>
        </Container>
      </Section>

      {/* Skills Section (placeholder) */}
      <Section id="skills" spacing="lg" background="transparent">
        <Container size="lg">
          <div className="text-center space-y-4 py-12">
            <Heading as="h2">Skills Section</Heading>
            <Text size="lg" className="text-foreground/60">
              Skills visualization will be implemented in Phase 3 and Phase 4
            </Text>
          </div>
        </Container>
      </Section>

      {/* Contact Section (placeholder) */}
      <Section id="contact" spacing="xl" background="glass">
        <Container size="lg">
          <div className="text-center space-y-4 py-12">
            <Heading as="h2">Contact Section</Heading>
            <Text size="lg" className="text-foreground/60 mb-6">
              Contact form will be added in Phase 3
            </Text>
            <Button variant="primary" onClick={() => scrollToSection('home')}>
              Back to Top
            </Button>
          </div>
        </Container>
      </Section>

      {/* Extra content for scroll demonstration */}
      <Section spacing="lg" background="transparent">
        <Container size="lg">
          <div className="py-20 text-center">
            <Text className="text-foreground/40">
              Scroll down to see the &ldquo;Scroll to Top&rdquo; button appear
            </Text>
          </div>
        </Container>
      </Section>
    </>
  )
}
