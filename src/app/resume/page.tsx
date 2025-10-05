import type { Metadata } from 'next'
import { createMetadata, createBreadcrumbSchema } from '@/lib/metadata'
import ResumePageClient from './resume-client'

// SEO Metadata
export const metadata: Metadata = createMetadata({
  title: 'Resume',
  description: 'Download or view my professional resume. Full Stack Developer with expertise in React, Next.js, TypeScript, Node.js, and modern web development.',
})

export default function ResumePage() {
  // Structured data for SEO
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resume', url: '/resume' },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ResumePageClient />
    </>
  )
}
