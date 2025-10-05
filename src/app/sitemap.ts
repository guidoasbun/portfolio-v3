import type { MetadataRoute } from 'next'

// Required for static export
export const dynamic = 'force-static'

/**
 * Dynamic Sitemap Generation
 *
 * Generates a sitemap for all public routes in the portfolio.
 * This helps search engines discover and index pages efficiently.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourportfolio.com'

  // Static routes with priorities and change frequencies
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Note: Dynamic routes (like individual projects) can be added here
  // by fetching from the database. Example:
  // const projects = await getProjects()
  // const projectUrls = projects.map(project => ({
  //   url: `${baseUrl}/projects/${project.id}`,
  //   lastModified: project.updatedAt,
  //   changeFrequency: 'monthly',
  //   priority: 0.7,
  // }))
  // return [...routes, ...projectUrls]

  return routes
}
