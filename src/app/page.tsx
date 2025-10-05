import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { createMetadata, createPersonSchema, createWebSiteSchema } from '@/lib/metadata'

// SEO Metadata
export const metadata: Metadata = createMetadata({
  title: 'Home',
  description: 'Full Stack Developer specializing in React, Next.js, and TypeScript. View my portfolio, projects, and experience in modern web development with 3D animations and glass morphism design.',
})

export default function Home() {
  // Structured data for SEO
  const personSchema = createPersonSchema()
  const websiteSchema = createWebSiteSchema()

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
