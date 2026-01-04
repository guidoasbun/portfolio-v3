import type { Metadata } from 'next'
import { createMetadata, createBreadcrumbSchema } from '@/lib/metadata'
import ContactMeClient from './contact-me-client'

export const metadata: Metadata = createMetadata({
  title: 'Contact Me',
  description: 'Get in touch with me. Have a question or want to work together? Send me a message.',
})

export default function ContactMePage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact Me', url: '/contact-me' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactMeClient />
    </>
  )
}
