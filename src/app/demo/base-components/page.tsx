'use client'

import React from 'react'
import { Button, GlassCard, Container, Section, Heading, Text, ThemeToggle } from '@/components/ui'

export default function BaseComponentsDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-blue/5 to-accent-orange/5">
      {/* Theme Toggle Header */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Container>
        <Section spacing="xl">
          <div className="text-center mb-16">
            <Heading as="h1" gradient>
              Base Components Demo
            </Heading>
            <Text size="lg" variant="muted" className="mt-4">
              Showcase of all base UI components with glass morphism design and theme switching
            </Text>
          </div>

          {/* Button Components */}
          <Section spacing="md">
            <GlassCard className="p-8" hover>
              <Heading as="h2" className="mb-6">Button Component</Heading>

              <div className="space-y-6">
                <div>
                  <Text className="mb-3 font-medium">Button Variants</Text>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </div>
                </div>

                <div>
                  <Text className="mb-3 font-medium">Button Sizes</Text>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <Text className="mb-3 font-medium">Button States</Text>
                  <div className="flex flex-wrap gap-4">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Section>

          {/* GlassCard Components */}
          <Section spacing="md">
            <GlassCard className="p-8" hover>
              <Heading as="h2" className="mb-6">GlassCard Component</Heading>

              <div className="grid md:grid-cols-3 gap-6">
                <GlassCard variant="light" className="p-6" hover>
                  <Heading as="h3" className="mb-3">Light Glass</Heading>
                  <Text variant="muted">
                    Light glass morphism effect with subtle transparency.
                  </Text>
                </GlassCard>

                <GlassCard variant="medium" className="p-6" hover>
                  <Heading as="h3" className="mb-3">Medium Glass</Heading>
                  <Text variant="muted">
                    Medium glass morphism effect with balanced transparency.
                  </Text>
                </GlassCard>

                <GlassCard variant="heavy" className="p-6" hover>
                  <Heading as="h3" className="mb-3">Heavy Glass</Heading>
                  <Text variant="muted">
                    Heavy glass morphism effect with strong transparency.
                  </Text>
                </GlassCard>
              </div>
            </GlassCard>
          </Section>

          {/* Typography Components */}
          <Section spacing="md">
            <GlassCard className="p-8" hover>
              <Heading as="h2" className="mb-6">Typography Components</Heading>

              <div className="space-y-8">
                <div>
                  <Text className="mb-4 font-medium">Heading Variants</Text>
                  <div className="space-y-4">
                    <Heading as="h1">Heading 1 - Main Title</Heading>
                    <Heading as="h2">Heading 2 - Section Title</Heading>
                    <Heading as="h3">Heading 3 - Subsection Title</Heading>
                  </div>
                </div>

                <div>
                  <Text className="mb-4 font-medium">Gradient Heading</Text>
                  <Heading as="h2" gradient>
                    Beautiful Gradient Text Effect
                  </Heading>
                </div>

                <div>
                  <Text className="mb-4 font-medium">Text Variants</Text>
                  <div className="space-y-3">
                    <Text size="xl">Extra Large Text - Perfect for standout content</Text>
                    <Text size="lg">Large Text - Great for introductions</Text>
                    <Text size="base">Base Text - The standard for body content</Text>
                    <Text size="sm">Small Text - Ideal for captions and notes</Text>
                  </div>
                </div>

                <div>
                  <Text className="mb-4 font-medium">Text Styles</Text>
                  <div className="space-y-3">
                    <Text>Default text with normal appearance</Text>
                    <Text variant="muted">Muted text with reduced opacity</Text>
                    <Text variant="accent">Accent text with gradient colors</Text>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Section>

          {/* Layout Components */}
          <Section spacing="md">
            <GlassCard className="p-8" hover>
              <Heading as="h2" className="mb-6">Layout Components</Heading>

              <div className="space-y-6">
                <div>
                  <Text className="mb-4 font-medium">Container Sizes</Text>
                  <div className="space-y-4">
                    <div className="bg-accent-blue/20 p-2 rounded">
                      <Container size="sm">
                        <Text className="text-center">Small Container (max-w-2xl)</Text>
                      </Container>
                    </div>
                    <div className="bg-accent-orange/20 p-2 rounded">
                      <Container size="md">
                        <Text className="text-center">Medium Container (max-w-4xl)</Text>
                      </Container>
                    </div>
                    <div className="bg-accent-cyan/20 p-2 rounded">
                      <Container size="lg">
                        <Text className="text-center">Large Container (max-w-6xl) - Default</Text>
                      </Container>
                    </div>
                  </div>
                </div>

                <div>
                  <Text className="mb-4 font-medium">Section Backgrounds</Text>
                  <div className="space-y-4">
                    <Section background="transparent" spacing="sm" className="border rounded-lg">
                      <Text className="text-center">Transparent Section</Text>
                    </Section>
                    <Section background="glass" spacing="sm" className="rounded-lg">
                      <Text className="text-center">Glass Section</Text>
                    </Section>
                    <Section background="gradient" spacing="sm" className="rounded-lg">
                      <Text className="text-center">Gradient Section</Text>
                    </Section>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Section>

          {/* Theme System */}
          <Section spacing="md">
            <GlassCard className="p-8" hover>
              <Heading as="h2" className="mb-6">Theme System</Heading>

              <div className="space-y-6">
                <div>
                  <Text className="mb-4 font-medium">Theme Toggle</Text>
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Text variant="muted">
                      Switch between Light, Dark, and System themes using the toggle above.
                    </Text>
                  </div>
                </div>

                <div>
                  <Text className="mb-4 font-medium">Adaptive Components</Text>
                  <Text variant="muted" className="mb-4">
                    All components automatically adapt to the selected theme using CSS variables.
                    The glass morphism effects maintain their visual appeal across all themes.
                  </Text>
                  <div className="grid md:grid-cols-3 gap-4">
                    <GlassCard variant="light" className="p-4">
                      <Text className="text-center text-sm">Light Glass</Text>
                    </GlassCard>
                    <GlassCard variant="medium" className="p-4">
                      <Text className="text-center text-sm">Medium Glass</Text>
                    </GlassCard>
                    <GlassCard variant="heavy" className="p-4">
                      <Text className="text-center text-sm">Heavy Glass</Text>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Section>

          {/* Interactive Examples */}
          <Section spacing="md">
            <GlassCard className="p-8" hover>
              <Heading as="h2" className="mb-6">Interactive Examples</Heading>

              <div className="space-y-6">
                <div>
                  <Text className="mb-4 font-medium">Hover Effects</Text>
                  <div className="grid md:grid-cols-2 gap-4">
                    <GlassCard className="p-6 cursor-pointer" hover>
                      <Text className="text-center">Hover me for scale effect</Text>
                    </GlassCard>
                    <Button className="w-full">Hover me for button effects</Button>
                  </div>
                </div>

                <div>
                  <Text className="mb-4 font-medium">Combined Components</Text>
                  <GlassCard className="p-6" variant="light">
                    <Heading as="h3" className="mb-3">Feature Card Example</Heading>
                    <Text variant="muted" className="mb-4">
                      This demonstrates how multiple components work together to create cohesive UI elements.
                    </Text>
                    <div className="flex gap-3">
                      <Button size="sm">Learn More</Button>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </GlassCard>
          </Section>

          {/* Footer */}
          <Section spacing="md">
            <div className="text-center">
              <Text variant="muted">
                All components feature glass morphism design with responsive behavior and accessibility support.
              </Text>
            </div>
          </Section>
        </Section>
      </Container>
    </div>
  )
}