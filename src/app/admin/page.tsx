/**
 * Admin Dashboard Home Page
 *
 * Main dashboard for admin users with overview and quick links.
 */

'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import {
  FiFolder,
  FiBriefcase,
  FiMail,
  FiFileText,
  FiActivity
} from 'react-icons/fi'

interface QuickLinkCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  href: string
}

function QuickLinkCard({ title, description, icon: Icon, href }: QuickLinkCardProps) {
  return (
    <Link href={href}>
      <GlassCard className="h-full hover:glass-heavy transition-all cursor-pointer group">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform">
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

export default function AdminDashboardPage() {
  const { user } = useAuth()

  const quickLinks = [
    {
      title: 'Projects',
      description: 'Manage your portfolio projects',
      icon: FiFolder,
      href: '/admin/projects'
    },
    {
      title: 'Experience',
      description: 'Update work experience and education',
      icon: FiBriefcase,
      href: '/admin/experience'
    },
    {
      title: 'Messages',
      description: 'View and respond to contact messages',
      icon: FiMail,
      href: '/admin/messages'
    },
    {
      title: 'Resume',
      description: 'Upload and manage resume files',
      icon: FiFileText,
      href: '/admin/resume'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <Heading as="h1" className="mb-2">
          Welcome back, Admin
        </Heading>
        <p className="text-muted-foreground">
          Manage your portfolio content from this dashboard.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Projects</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <FiFolder className="text-blue-500" size={32} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <FiBriefcase className="text-purple-500" size={32} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Messages</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <FiMail className="text-green-500" size={32} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-2xl font-bold">Active</p>
            </div>
            <FiActivity className="text-yellow-500" size={32} />
          </div>
        </GlassCard>
      </div>

      {/* Quick links */}
      <div>
        <Heading as="h2" className="mb-4">
          Quick Links
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.href} {...link} />
          ))}
        </div>
      </div>

      {/* Account info */}
      <GlassCard>
        <Heading as="h3" className="mb-4">
          Account Information
        </Heading>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-foreground/10">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-foreground/10">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-sm">{user?.uid}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Role</span>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
              Administrator
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/">
          <Button variant="secondary">View Public Site</Button>
        </Link>
      </div>
    </div>
  )
}
