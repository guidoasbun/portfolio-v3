'use client'

import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import type { Project, Experience, Skill } from '@/types'

interface ClientSectionsProps {
  projects: Project[]
  experiences: Experience[]
  skills: Skill[]
}

export default function ClientSections({ projects, experiences, skills }: ClientSectionsProps) {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experiences} />
      <SkillsSection skills={skills} />
      <ContactSection />
    </>
  )
}
