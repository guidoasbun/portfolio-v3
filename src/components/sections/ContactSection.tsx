'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { FormField } from '@/components/ui/FormField'
import { contactFormSchema, type ContactFormValues } from '@/lib/validations'
import { staggerContainer, staggerItem } from '@/lib/animations'
import {
  FiMail,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiAlertCircle,
} from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface ContactSectionProps {
  className?: string
}

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href?: string
  type: 'email' | 'location' | 'social'
}

const contactInfo: ContactInfo[] = [
  {
    icon: FiMail,
    label: 'Email',
    value: 'your.email@example.com',
    href: 'mailto:your.email@example.com',
    type: 'email',
  },
  {
    icon: FiMapPin,
    label: 'Location',
    value: 'Your City, Country',
    type: 'location',
  },
]

const socialLinks = [
  {
    icon: FiGithub,
    label: 'GitHub',
    href: 'https://github.com/yourusername',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
  },
  {
    icon: FiMail,
    label: 'Email',
    href: 'mailto:your.email@example.com',
  },
]

export function ContactSection({ className }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { executeRecaptcha } = useGoogleReCaptcha()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactFormSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Get reCAPTCHA token if available
      let recaptchaToken: string | undefined
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('contact_form')
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          recaptchaToken,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle specific error messages
        if (response.status === 429) {
          setSubmitError('Too many requests. Please try again later.')
        } else {
          setSubmitError(result.error || 'Failed to send message. Please try again.')
        }
        return
      }

      // Success - redirect to thank you page
      router.push('/contact/thank-you')
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className={cn(
        'relative py-20 md:py-32 overflow-hidden',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            Have a question or want to work together? I&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto"
        >
          {/* Contact Form */}
          <motion.div variants={staggerItem}>
            <GlassCard className="p-6 md:p-8 h-full">
              <h3 className="text-2xl font-semibold mb-6 text-foreground">
                Send a Message
              </h3>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                >
                  <FiAlertCircle className="text-red-500 text-xl flex-shrink-0" />
                  <p className="text-red-500 text-sm">{submitError}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Honeypot field - hidden from users, catches bots */}
                <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={(e) => setValue('name', e.target.value === '' ? 'bot' : '')}
                  />
                </div>
                <FormField
                  label="Name"
                  error={errors.name?.message}
                  required
                >
                  <Input
                    {...register('name')}
                    placeholder="Your name"
                    error={!!errors.name}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  label="Email"
                  error={errors.email?.message}
                  required
                >
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="your.email@example.com"
                    error={!!errors.email}
                    disabled={isSubmitting}
                    icon={<FiMail className="text-muted-foreground" />}
                  />
                </FormField>

                <FormField
                  label="Subject"
                  error={errors.subject?.message}
                  required
                >
                  <Input
                    {...register('subject')}
                    placeholder="What's this about?"
                    error={!!errors.subject}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  label="Message"
                  error={errors.message?.message}
                  required
                >
                  <Textarea
                    {...register('message')}
                    placeholder="Tell me about your project or inquiry..."
                    error={!!errors.message}
                    disabled={isSubmitting}
                    rows={6}
                    showCharCount
                    maxCharCount={1000}
                  />
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="mr-2"
                      >
                        <FiSend />
                      </motion.div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={staggerItem} className="space-y-6">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                const content = (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg glass-light flex items-center justify-center">
                        <Icon className="text-2xl text-accent-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground/60 mb-1">
                          {info.label}
                        </p>
                        <p className="text-foreground font-medium">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </>
                )

                return (
                  <GlassCard
                    key={index}
                    className="p-5 transition-all duration-300 hover:scale-105"
                  >
                    {info.href ? (
                      <a
                        href={info.href}
                        className="block"
                        target={info.type === 'email' ? undefined : '_blank'}
                        rel={info.type === 'email' ? undefined : 'noopener noreferrer'}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </GlassCard>
                )
              })}
            </div>

            {/* Social Links */}
            <GlassCard className="p-6">
              <h4 className="text-lg font-semibold mb-4 text-foreground">
                Connect With Me
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="w-12 h-12 rounded-lg glass-light flex items-center justify-center transition-all duration-300 hover:glass-medium hover:scale-110 hover:text-accent-blue"
                    >
                      <Icon className="text-xl" />
                    </a>
                  )
                })}
              </div>
            </GlassCard>

            {/* Additional Info */}
            <GlassCard className="p-6">
              <h4 className="text-lg font-semibold mb-3 text-foreground">
                Response Time
              </h4>
              <p className="text-foreground/70 text-sm leading-relaxed">
                I typically respond within 24-48 hours. For urgent inquiries,
                please mention it in the subject line.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
