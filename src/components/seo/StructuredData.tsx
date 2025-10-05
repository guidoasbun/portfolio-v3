/**
 * StructuredData Component
 *
 * Renders JSON-LD structured data for SEO.
 * Used to add schema.org markup to pages for better search engine understanding.
 */

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
