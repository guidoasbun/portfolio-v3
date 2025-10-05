'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { motion, type Variants } from 'framer-motion'
import {
  FiDownload,
  FiCode,
  FiBookOpen,
  FiMusic,
  FiCamera,
  FiCoffee,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
} from 'react-icons/fi'

interface Education {
  degree: string
  institution: string
  location: string
  startYear: number
  endYear?: number
  current?: boolean
}

interface Interest {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
}

interface AboutSectionProps {
  bio?: string
  education?: Education[]
  availability?: {
    status: 'available' | 'unavailable' | 'open-to-opportunities'
    message: string
  }
  interests?: Interest[]
  resumeUrl?: string
}

const defaultBio = `I'm a passionate Full Stack Developer with a love for creating beautiful,
performant web experiences. With expertise in modern web technologies like React, Next.js,
and TypeScript, I transform ideas into reality through clean, maintainable code.

I believe in continuous learning and staying up-to-date with the latest industry trends.
My approach combines technical excellence with user-centric design, ensuring that every
project not only works flawlessly but also provides an exceptional user experience.`

const defaultEducation: Education[] = [
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University Name',
    location: 'City, State',
    startYear: 2018,
    endYear: 2022,
  },
]

const defaultInterests: Interest[] = [
  {
    icon: FiCode,
    label: 'Open Source',
    description: 'Contributing to open source projects and building developer tools',
  },
  {
    icon: FiBookOpen,
    label: 'Reading',
    description: 'Technical books, sci-fi novels, and philosophy',
  },
  {
    icon: FiMusic,
    label: 'Music',
    description: 'Playing guitar and exploring different genres',
  },
  {
    icon: FiCamera,
    label: 'Photography',
    description: 'Capturing moments and experimenting with composition',
  },
  {
    icon: FiCoffee,
    label: 'Coffee',
    description: 'Exploring different brewing methods and coffee origins',
  },
  {
    icon: FiMapPin,
    label: 'Travel',
    description: 'Discovering new cultures and perspectives',
  },
]

const defaultAvailability = {
  status: 'open-to-opportunities' as const,
  message: 'Open to new opportunities and exciting projects',
}

export function AboutSection({
  bio = defaultBio,
  education = defaultEducation,
  availability = defaultAvailability,
  interests = defaultInterests,
  resumeUrl,
}: AboutSectionProps) {
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

  const getAvailabilityColor = (status: typeof availability.status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500'
      case 'unavailable':
        return 'bg-red-500'
      case 'open-to-opportunities':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleDownloadResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank')
    } else {
      // Placeholder action - you can replace with actual resume URL
      alert('Resume download functionality will be implemented soon!')
    }
  }

  return (
    <section id="about" className="relative py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto px-4 sm:px-0">
              Get to know more about my background, skills, and interests
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Bio Section - Takes 2 columns on large screens */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <GlassCard className="p-5 sm:p-6 md:p-8 h-full">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
                  Introduction
                </h3>
                <div className="text-sm sm:text-base text-foreground/80 leading-relaxed space-y-3 sm:space-y-4">
                  {bio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                </div>

                {/* Download Resume Button */}
                <div className="mt-5 sm:mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleDownloadResume}
                    className="w-full sm:w-auto"
                  >
                    <FiDownload className="mr-2" />
                    Download Resume
                  </Button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Sidebar: Availability & Education */}
            <div className="space-y-6">
              {/* Availability Badge */}
              <motion.div variants={itemVariants}>
                <GlassCard className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-3 h-3 rounded-full ${getAvailabilityColor(
                          availability.status
                        )}`}
                      />
                      <div
                        className={`absolute inset-0 w-3 h-3 rounded-full ${getAvailabilityColor(
                          availability.status
                        )} animate-ping opacity-75`}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Current Status
                      </h4>
                      <p className="text-sm text-foreground/70">
                        {availability.message}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Education */}
              <motion.div variants={itemVariants}>
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                    <FiBookOpen className="text-blue-500" />
                    Education
                  </h3>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="space-y-1">
                        <h4 className="font-semibold text-foreground">
                          {edu.degree}
                        </h4>
                        <p className="text-sm text-foreground/70">
                          {edu.institution}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-foreground/60">
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-3 h-3" />
                            {edu.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {edu.startYear} -{' '}
                            {edu.current ? 'Present' : edu.endYear}
                          </span>
                        </div>
                        {edu.current && (
                          <div className="flex items-center gap-1 mt-2">
                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-500 font-medium">
                              Currently Enrolled
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>

          {/* Interests/Hobbies Grid */}
          <motion.div variants={itemVariants} className="mt-6">
            <GlassCard className="p-6 sm:p-8">
              <h3 className="text-2xl font-semibold mb-6 text-foreground">
                Interests & Hobbies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {interests.map((interest, index) => {
                  const Icon = interest.icon
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-start gap-3 p-4 rounded-lg glass-light hover:glass-medium transition-all duration-300 border border-foreground/10"
                    >
                      <Icon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {interest.label}
                        </h4>
                        <p className="text-sm text-foreground/70">
                          {interest.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
