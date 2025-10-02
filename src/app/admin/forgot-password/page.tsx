/**
 * Forgot Password Page
 *
 * Allows users to request a password reset email.
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@/hooks/useAuth'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/ui/FormField'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { FiMail, FiCheckCircle, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'

// Forgot password form validation schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
})

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const { resetPassword, error: authError, clearError } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true)
      clearError()
      await resetPassword(data.email)
      setEmail(data.email)
      setIsSuccess(true)
    } catch (error) {
      // Error is already set in auth context
      console.error('Password reset failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container size="sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 mb-4">
              <FiCheckCircle className="w-8 h-8 text-white" />
            </div>
            <Heading as="h1" className="mb-2">
              Check Your Email
            </Heading>
            <p className="text-muted-foreground">
              Password reset instructions sent
            </p>
          </div>

          <GlassCard>
            <div className="space-y-4 text-center">
              <p className="text-foreground">
                We&apos;ve sent password reset instructions to:
              </p>
              <p className="font-semibold text-blue-500">
                {email}
              </p>
              <p className="text-sm text-muted-foreground">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <div className="pt-4 border-t border-foreground/10">
                <p className="text-sm text-muted-foreground mb-4">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setIsSuccess(false)}
                    className="flex-1"
                  >
                    Send Again
                  </Button>
                  <Link href="/admin/login" className="flex-1">
                    <Button variant="primary" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <FiArrowLeft size={14} />
              Back to Home
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <FiMail className="w-8 h-8 text-white" />
          </div>
          <Heading as="h1" className="mb-2">
            Forgot Password?
          </Heading>
          <p className="text-muted-foreground">
            Enter your email to receive reset instructions
          </p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Email Address"
              error={errors.email?.message}
              required
            >
              <Input
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                {...register('email')}
              />
            </FormField>

            {authError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {authError}
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <Link href="/admin/login" className="block">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                >
                  <FiArrowLeft size={16} className="mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </form>
        </GlassCard>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <FiArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </Container>
    </div>
  )
}
