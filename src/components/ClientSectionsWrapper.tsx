'use client'

import dynamic from 'next/dynamic'
import type { Project, Experience, Skill } from '@/types'

// Dynamic import with ssr: false must be in a Client Component
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

interface ClientSectionsWrapperProps {
  projects: Project[]
  experiences: Experience[]
  skills: Skill[]
}

export function ClientSectionsWrapper({ projects, experiences, skills }: ClientSectionsWrapperProps) {
  return <ClientSections projects={projects} experiences={experiences} skills={skills} />
}
