import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { createMetadata, createPersonSchema, createWebSiteSchema } from '@/lib/metadata'
import { getProjects } from '@/lib/services/projects.service.admin'
import { getExperiences } from '@/lib/services/experience.service.admin'
import { getSkills } from '@/lib/services/skills.service.admin'
import type { Project, Experience, Skill } from '@/types'

// NUCLEAR OPTION: Disable SSR for all sections to eliminate hydration mismatches
const ClientSections = dynamic(() => import('@/components/ClientSections'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground/60">Loading...</p>
      </div>
    </div>
  ),
})

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
    projects = await getProjects()
  } catch (error) {
    console.error('Failed to fetch projects:', error)
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

      <ClientSections
        projects={projects}
        experiences={experiences}
        skills={skills}
      />
    </>
  )
}
