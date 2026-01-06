import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { createMetadata, createPersonSchema, createWebSiteSchema } from '@/lib/metadata'
import { getProjects } from '@/lib/services/projects.service.admin'
import { getExperiences } from '@/lib/services/experience.service.admin'
import { getSkills } from '@/lib/services/skills.service.admin'
import type { Project, Experience, Skill } from '@/types'

// SEO Metadata
export const metadata: Metadata = createMetadata({
  title: 'Home',
  description: 'Full Stack Developer specializing in React, Next.js, and TypeScript. View my portfolio, projects, and experience in modern web development with 3D animations and glass morphism design.',
})

// Revalidate the page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60

export default async function Home() {
  // Structured data for SEO
  const personSchema = createPersonSchema()
  const websiteSchema = createWebSiteSchema()

  // Fetch projects from Firebase
  let projects: Project[] = []
  try {
    console.log('[page.tsx] Fetching projects...')
    projects = await getProjects()
    console.log(`[page.tsx] Fetched ${projects.length} projects`)
  } catch (error) {
    console.error('[page.tsx] Failed to fetch projects:', error)
    // Projects will fall back to empty array or mockProjects in component
  }

  // Fetch experiences from Firebase
  let experiences: Experience[] = []
  try {
    console.log('[page.tsx] Fetching experiences...')
    experiences = await getExperiences()
    console.log(`[page.tsx] Fetched ${experiences.length} experiences`)
  } catch (error) {
    console.error('[page.tsx] Failed to fetch experiences:', error)
    // Experiences will fall back to empty array in component
  }

  // Fetch skills from Firebase
  let skills: Skill[] = []
  try {
    console.log('[page.tsx] Fetching skills...')
    skills = await getSkills()
    console.log(`[page.tsx] Fetched ${skills.length} skills`)
  } catch (error) {
    console.error('[page.tsx] Failed to fetch skills:', error)
    // Skills will fall back to empty array in component
  }

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
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experiences} />
      <SkillsSection skills={skills} />
      <ContactSection />
    </>
  )
}
