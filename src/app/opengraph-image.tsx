import { ImageResponse } from 'next/og'

/**
 * Open Graph Image Generator
 *
 * Dynamically generates an Open Graph image for the portfolio.
 * This image is used when the site is shared on social media.
 */

export const runtime = 'edge'
export const alt = 'Portfolio - Full Stack Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
        }}
      >
        {/* Glass morphism effect overlay */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #fff 0%, #e0e0e0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            Full Stack Developer
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            Modern Web Development Portfolio
          </div>

          {/* Tech Stack */}
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: 40,
              display: 'flex',
              gap: 20,
            }}
          >
            <span
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
              }}
            >
              React
            </span>
            <span
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
              }}
            >
              Next.js
            </span>
            <span
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
              }}
            >
              TypeScript
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
