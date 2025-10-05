'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { motion, type Variants } from 'framer-motion'
import {
  FiDownload,
  FiPrinter,
  FiShare2,
  FiBriefcase,
  FiBook,
  FiCode,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiGithub,
  FiGlobe,
} from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

interface ResumeSection {
  title: string
  company: string
  location: string
  date: string
  description: string[]
  technologies?: string[]
}

interface Education {
  degree: string
  institution: string
  location: string
  date: string
  gpa?: string
}

interface Skill {
  category: string
  items: string[]
}

// Mock data - will be replaced with real data from backend
const mockResumeData = {
  header: {
    name: 'Your Name',
    title: 'Full Stack Developer',
    email: 'your.email@example.com',
    phone: '+1 (123) 456-7890',
    location: 'City, State',
    linkedin: 'linkedin.com/in/yourname',
    github: 'github.com/yourusername',
    website: 'yourwebsite.com',
  },
  summary:
    'Passionate Full Stack Developer with 3+ years of experience building modern web applications. Specialized in React, Next.js, and Node.js with a strong focus on user experience and performance optimization.',
  experience: [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Company',
      location: 'City, State',
      date: 'Jan 2023 - Present',
      description: [
        'Led development of scalable web applications using Next.js and React',
        'Implemented CI/CD pipelines reducing deployment time by 40%',
        'Mentored junior developers and conducted code reviews',
      ],
      technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    },
    {
      title: 'Full Stack Developer',
      company: 'Startup Inc',
      location: 'City, State',
      date: 'Jun 2021 - Dec 2022',
      description: [
        'Built and maintained RESTful APIs serving 10K+ daily users',
        'Developed responsive UI components with React and Tailwind CSS',
        'Optimized database queries improving performance by 60%',
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
    },
  ] as ResumeSection[],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University Name',
      location: 'City, State',
      date: '2017 - 2021',
      gpa: '3.8/4.0',
    },
  ] as Education[],
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'Python', 'Django', 'REST APIs'],
    },
    {
      category: 'Database',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'Firebase'],
    },
    {
      category: 'Tools & Others',
      items: ['Git', 'Docker', 'AWS', 'CI/CD', 'Agile/Scrum'],
    },
  ] as Skill[],
}

export default function ResumePage() {
  const [isSharing, setIsSharing] = useState(false)
  const { trackEvent } = useAnalytics()

  // Track resume view on page load
  useEffect(() => {
    trackEvent('resume_view', {
      resume_id: 'default',
      resume_version: '1.0',
    })
  }, [trackEvent])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const handleDownload = () => {
    // Track resume download
    trackEvent('resume_download', {
      resume_id: 'default',
      resume_version: '1.0',
      download_count: 1,
    })

    // Placeholder - will integrate with backend
    alert('Download functionality will be implemented when resume file is available')
  }

  const handlePrint = () => {
    // Track print action
    trackEvent('resume_download', {
      resume_id: 'default',
      resume_version: '1.0-print',
      download_count: 1,
    })

    window.print()
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${mockResumeData.header.name} - Resume`,
          text: `Check out ${mockResumeData.header.name}'s resume`,
          url: window.location.href,
        })
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Resume link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          {/* Page Header with Actions */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Resume
                </h1>
                <p className="text-foreground/70">
                  Download or view my professional experience
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 print:hidden">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <FiDownload />
                  Download
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handlePrint}
                  className="gap-2"
                >
                  <FiPrinter />
                  Print
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="gap-2"
                >
                  <FiShare2 />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Resume Content */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-8 sm:p-12 print:shadow-none print:border-0">
              {/* Header Section */}
              <div className="mb-8 pb-8 border-b border-foreground/10">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {mockResumeData.header.name}
                </h1>
                <p className="text-xl text-blue-500 mb-4">
                  {mockResumeData.header.title}
                </p>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    <a
                      href={`mailto:${mockResumeData.header.email}`}
                      className="hover:text-blue-500 transition-colors"
                    >
                      {mockResumeData.header.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    <span>{mockResumeData.header.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>{mockResumeData.header.location}</span>
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <a
                    href={`https://${mockResumeData.header.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground/70 hover:text-blue-500 transition-colors"
                  >
                    <FiLinkedin className="w-4 h-4" />
                    {mockResumeData.header.linkedin}
                  </a>
                  <a
                    href={`https://${mockResumeData.header.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground/70 hover:text-blue-500 transition-colors"
                  >
                    <FiGithub className="w-4 h-4" />
                    {mockResumeData.header.github}
                  </a>
                  <a
                    href={`https://${mockResumeData.header.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground/70 hover:text-blue-500 transition-colors"
                  >
                    <FiGlobe className="w-4 h-4" />
                    {mockResumeData.header.website}
                  </a>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <FiUser className="text-blue-500" />
                  Professional Summary
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  {mockResumeData.summary}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-blue-500" />
                  Experience
                </h2>
                <div className="space-y-6">
                  {mockResumeData.experience.map((exp, index) => (
                    <div key={index} className="pb-6 border-b border-foreground/10 last:border-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {exp.title}
                          </h3>
                          <p className="text-foreground/70">
                            {exp.company} · {exp.location}
                          </p>
                        </div>
                        <p className="text-sm text-foreground/60 mt-1 sm:mt-0">
                          {exp.date}
                        </p>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-foreground/80 mb-3">
                        {exp.description.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                      {exp.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FiBook className="text-blue-500" />
                  Education
                </h2>
                <div className="space-y-4">
                  {mockResumeData.education.map((edu, index) => (
                    <div key={index} className="pb-4 border-b border-foreground/10 last:border-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {edu.degree}
                          </h3>
                          <p className="text-foreground/70">
                            {edu.institution} · {edu.location}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-foreground/60 mt-1">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-foreground/60 mt-1 sm:mt-0">
                          {edu.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FiCode className="text-blue-500" />
                  Skills
                </h2>
                <div className="space-y-4">
                  {mockResumeData.skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="text-sm font-semibold text-foreground/70 mb-2">
                        {skillGroup.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-full bg-foreground/5 text-foreground/80 border border-foreground/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* PDF Viewer Placeholder - for future implementation */}
          {/* <motion.div variants={itemVariants} className="mt-8">
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Resume Preview
              </h3>
              <div className="aspect-[8.5/11] bg-foreground/5 rounded-lg flex items-center justify-center">
                <p className="text-foreground/60">
                  PDF viewer will be implemented here
                </p>
              </div>
            </GlassCard>
          </motion.div> */}
        </motion.div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .glass-card {
            background: white !important;
            backdrop-filter: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
