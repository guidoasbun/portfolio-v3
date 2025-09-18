'use client'

import React, { useState } from 'react'
import {
  Container,
  Section,
  Heading,
  Text,
  GlassCard,
  Button,
  Input,
  Textarea,
  Select,
  Label,
  FormField,
  FormError,
  ThemeToggle,
  type SelectOption
} from '@/components/ui'

export default function FormComponentsDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    newsletter: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showValidation, setShowValidation] = useState(false)

  const categoryOptions: SelectOption[] = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'project', label: 'Project Discussion' },
    { value: 'collaboration', label: 'Collaboration' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowValidation(true)

    if (validateForm()) {
      alert('Form submitted successfully!')
      setFormData({ name: '', email: '', message: '', category: '', newsletter: false })
      setShowValidation(false)
    }
  }

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <Container className="py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Heading as="h1" className="mb-2">Form Components Demo</Heading>
            <Text variant="muted">
              Showcase of all form components with glass morphism design
            </Text>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Interactive Form Demo */}
          <Section>
            <GlassCard className="p-6">
              <Heading as="h2" className="mb-6">Interactive Contact Form</Heading>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Full Name"
                  required
                  error={showValidation ? errors.name : ''}
                  helperText="Enter your first and last name"
                >
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={showValidation && !!errors.name}
                  />
                </FormField>

                <FormField
                  label="Email Address"
                  required
                  error={showValidation ? errors.email : ''}
                >
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={showValidation && !!errors.email}
                    icon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    }
                  />
                </FormField>

                <FormField
                  label="Category"
                  required
                  error={showValidation ? errors.category : ''}
                >
                  <Select
                    placeholder="Select a category"
                    options={categoryOptions}
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    error={showValidation && !!errors.category}
                  />
                </FormField>

                <FormField
                  label="Message"
                  required
                  error={showValidation ? errors.message : ''}
                  helperText="Minimum 10 characters"
                >
                  <Textarea
                    placeholder="Tell us about your project or inquiry..."
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    error={showValidation && !!errors.message}
                    showCharCount
                    maxCharCount={500}
                    rows={4}
                  />
                </FormField>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange('newsletter')}
                    className="rounded border-border-glass"
                  />
                  <Label htmlFor="newsletter" size="sm">
                    Subscribe to newsletter
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Send Message
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setFormData({ name: '', email: '', message: '', category: '', newsletter: false })
                      setErrors({})
                      setShowValidation(false)
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </GlassCard>
          </Section>

          {/* Component Variants Demo */}
          <Section className="space-y-6">
            {/* Input Variants */}
            <GlassCard className="p-6">
              <Heading as="h3" className="mb-4">Input Variants</Heading>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Default Input</Label>
                  <Input placeholder="Default input" />
                </div>

                <div>
                  <Label className="mb-2 block">Ghost Input</Label>
                  <Input variant="ghost" placeholder="Ghost input" />
                </div>

                <div>
                  <Label className="mb-2 block">With Icon</Label>
                  <Input
                    placeholder="Search..."
                    icon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Error State</Label>
                  <Input placeholder="Invalid input" error />
                  <FormError message="This field has an error" />
                </div>

                <div>
                  <Label className="mb-2 block">Disabled</Label>
                  <Input placeholder="Disabled input" disabled />
                </div>
              </div>
            </GlassCard>

            {/* Input Sizes */}
            <GlassCard className="p-6">
              <Heading as="h3" className="mb-4">Input Sizes</Heading>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Small</Label>
                  <Input size="sm" placeholder="Small input" />
                </div>
                <div>
                  <Label className="mb-2 block">Medium (Default)</Label>
                  <Input size="md" placeholder="Medium input" />
                </div>
                <div>
                  <Label className="mb-2 block">Large</Label>
                  <Input size="lg" placeholder="Large input" />
                </div>
              </div>
            </GlassCard>

            {/* Textarea Variants */}
            <GlassCard className="p-6">
              <Heading as="h3" className="mb-4">Textarea Variants</Heading>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Default Textarea</Label>
                  <Textarea placeholder="Enter your message..." />
                </div>

                <div>
                  <Label className="mb-2 block">With Character Count</Label>
                  <Textarea
                    placeholder="Limited to 100 characters..."
                    showCharCount
                    maxCharCount={100}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">No Resize</Label>
                  <Textarea
                    placeholder="Cannot be resized..."
                    resize="none"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Select Variants */}
            <GlassCard className="p-6">
              <Heading as="h3" className="mb-4">Select Variants</Heading>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Default Select</Label>
                  <Select
                    placeholder="Choose an option"
                    options={[
                      { value: 'option1', label: 'Option 1' },
                      { value: 'option2', label: 'Option 2' },
                      { value: 'option3', label: 'Option 3' }
                    ]}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Ghost Select</Label>
                  <Select
                    variant="ghost"
                    placeholder="Choose an option"
                    options={categoryOptions}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">With Option Groups</Label>
                  <Select
                    placeholder="Choose a technology"
                    optionGroups={[
                      {
                        label: 'Frontend',
                        options: [
                          { value: 'react', label: 'React' },
                          { value: 'vue', label: 'Vue.js' },
                          { value: 'angular', label: 'Angular' }
                        ]
                      },
                      {
                        label: 'Backend',
                        options: [
                          { value: 'node', label: 'Node.js' },
                          { value: 'python', label: 'Python' },
                          { value: 'go', label: 'Go' }
                        ]
                      }
                    ]}
                  />
                </div>
              </div>
            </GlassCard>
          </Section>
        </div>
      </Container>
    </div>
  )
}