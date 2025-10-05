import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import ThankYouPageClient from './thank-you-client'

// SEO Metadata
export const metadata: Metadata = createMetadata({
  title: 'Thank You',
  description: 'Thank you for contacting me. Your message has been received and I will respond shortly.',
  noIndex: true, // Don't index thank you pages
})

export default function ThankYouPage() {
  return <ThankYouPageClient />
}
