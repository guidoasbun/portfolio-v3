/**
 * Admin Analytics Dashboard
 *
 * Displays basic analytics overview and links to Firebase Analytics Console.
 * For detailed analytics, admins are directed to the Firebase Console.
 */

'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import {
  FiActivity,
  FiBarChart2,
  FiExternalLink,
  FiEye,
  FiMousePointer,
  FiUsers,
  FiTrendingUp,
} from 'react-icons/fi'
import Link from 'next/link'

interface AnalyticsCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  linkText: string
  linkHref: string
}

function AnalyticsCard({ title, description, icon: Icon, linkText, linkHref }: AnalyticsCardProps) {
  return (
    <GlassCard className="h-full hover:glass-heavy transition-all">
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-lg bg-gradient-to-r from-[#00274C] to-[#E17000] text-white">
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            {linkText}
            <FiExternalLink size={14} />
          </a>
        </div>
      </div>
    </GlassCard>
  )
}

export default function AnalyticsPage() {
  // Get Firebase project ID from environment
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id'

  // Firebase Console URLs
  const firebaseAnalyticsUrl = `https://console.firebase.google.com/project/${projectId}/analytics`
  const firebaseEventsUrl = `https://console.firebase.google.com/project/${projectId}/analytics/app/web/events`
  const firebaseAudienceUrl = `https://console.firebase.google.com/project/${projectId}/analytics/app/web/audience`
  const firebaseDebugUrl = `https://console.firebase.google.com/project/${projectId}/analytics/app/web/debugview`

  const analyticsFeatures = [
    {
      title: 'Real-time Analytics',
      description: 'View real-time user activity, active pages, and live events as they happen on your portfolio.',
      icon: FiActivity,
      linkText: 'View Real-time Dashboard',
      linkHref: firebaseAnalyticsUrl,
    },
    {
      title: 'Events & Conversions',
      description: 'Track custom events like project views, contact form submissions, resume downloads, and theme changes.',
      icon: FiMousePointer,
      linkText: 'View Events Report',
      linkHref: firebaseEventsUrl,
    },
    {
      title: 'User Behavior',
      description: 'Understand user journeys, popular pages, engagement rates, and how visitors interact with your portfolio.',
      icon: FiUsers,
      linkText: 'View Audience Report',
      linkHref: firebaseAudienceUrl,
    },
    {
      title: 'Debug View',
      description: 'Test and debug analytics events in real-time during development. Useful for verifying event tracking.',
      icon: FiBarChart2,
      linkText: 'Open Debug View',
      linkHref: firebaseDebugUrl,
    },
  ]

  const trackedEvents = [
    { name: 'page_view', description: 'Automatic page view tracking' },
    { name: 'project_view', description: 'When users view project details' },
    { name: 'project_filter_change', description: 'When users filter projects' },
    { name: 'contact_form_submit', description: 'Contact form submissions' },
    { name: 'contact_form_success', description: 'Successful form submissions' },
    { name: 'contact_form_error', description: 'Failed form submissions' },
    { name: 'resume_download', description: 'Resume downloads' },
    { name: 'resume_view', description: 'Resume page views' },
    { name: 'theme_change', description: 'Theme preference changes' },
    { name: '3d_interaction', description: '3D element interactions' },
    { name: 'cta_click', description: 'Call-to-action button clicks' },
    { name: 'social_link_click', description: 'Social media link clicks' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Heading as="h1" className="mb-2">
          Analytics Dashboard
        </Heading>
        <p className="text-muted-foreground">
          View detailed analytics and insights about your portfolio visitors and their behavior.
        </p>
      </div>

      {/* Quick Info */}
      <GlassCard className="border-blue-500/20 bg-blue-500/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-500 text-white">
            <FiTrendingUp size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Firebase Analytics Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your portfolio is integrated with Google Analytics 4 (GA4) via Firebase Analytics.
              All user interactions, page views, and custom events are automatically tracked.
            </p>
            <p className="text-sm text-muted-foreground">
              For detailed analytics reports, charts, and insights, visit the Firebase Console using the links below.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Analytics Features */}
      <div>
        <Heading as="h2" className="mb-4">
          Analytics Features
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsFeatures.map((feature) => (
            <AnalyticsCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      {/* Tracked Events */}
      <div>
        <Heading as="h2" className="mb-4">
          Tracked Events
        </Heading>
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <FiEye className="text-[#00274C]" size={24} />
            <h3 className="text-lg font-semibold">Custom Events</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            The following custom events are tracked throughout your portfolio:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trackedEvents.map((event) => (
              <div
                key={event.name}
                className="p-4 rounded-lg glass-light border border-foreground/10"
              >
                <div className="font-mono text-sm text-blue-500 mb-1">
                  {event.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.description}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <a
          href={firebaseAnalyticsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary">
            <FiExternalLink className="mr-2" />
            Open Firebase Analytics
          </Button>
        </a>
        <Link href="/admin">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Help Text */}
      <GlassCard className="border-foreground/10">
        <h4 className="font-semibold mb-2">Need Help?</h4>
        <p className="text-sm text-muted-foreground">
          Analytics data may take 24-48 hours to appear in the Firebase Console after initial setup.
          For debugging, use the DebugView to see events in real-time during development.
        </p>
      </GlassCard>
    </div>
  )
}
