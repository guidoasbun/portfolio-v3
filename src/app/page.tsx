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
    console.log('[SERVER] Fetching projects from Firebase...')
    projects = await getProjects()
    console.log('[SERVER] Projects fetched:', projects.length)
    if (projects.length > 0) {
      console.log('[SERVER] First project data:', JSON.stringify(projects[0], null, 2))
      console.log('[SERVER] First project images:', projects[0].images)
    }
  } catch (error) {
    console.error('[SERVER] Failed to fetch projects:', error)
    // Projects will fall back to empty array or mockProjects in component
  }

  // Fetch experiences from Firebase
  let experiences: Experience[] = []
  try {
    experiences = await getExperiences()
  } catch (error) {
    console.error('Failed to fetch experiences:', error)
    // Experiences will fall back to empty array in component
  }

  // Fetch skills from Firebase
  let skills: Skill[] = []
  try {
    skills = await getSkills()
  } catch (error) {
    console.error('Failed to fetch skills:', error)
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
