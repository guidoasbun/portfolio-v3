import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'

// SEO Metadata for admin login page
export const metadata: Metadata = createMetadata({
  title: 'Admin Login',
  description: 'Administrator login for portfolio management.',
  noIndex: true, // Don't index admin pages
})
