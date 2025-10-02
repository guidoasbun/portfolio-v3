/**
 * Admin Login Page
 *
 * Allows administrators to sign in to access the admin dashboard.
 * Redirects to dashboard if already authenticated.
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { FiLock } from 'react-icons/fi'
import Link from 'next/link'

// Login form validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
})

type LoginFormData = yup.InferType<typeof loginSchema>

export default function AdminLoginPage() {
  const { user, loading: authLoading, error: authError, signIn, clearError } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  })

  // Redirect to admin dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin')
    }
  }, [user, authLoading, router])

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true)
      clearError()
      await signIn(data.email, data.password)
      // Redirect is handled by useEffect above
    } catch (error) {
      // Error is already set in auth context
      console.error('Login failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't show login form if already authenticated
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <FiLock className="w-8 h-8 text-white" />
          </div>
          <Heading as="h1" className="mb-2">
            Admin Login
          </Heading>
          <p className="text-muted-foreground">
            Sign in to access the admin dashboard
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

            <FormField
              label="Password"
              error={errors.password?.message}
              required
            >
              <Input
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
                {...register('password')}
              />
            </FormField>

            {authError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {authError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link
              href="/admin/forgot-password"
              className="block text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Forgot your password?
            </Link>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </button>
          </div>
        </GlassCard>
      </Container>
    </div>
  )
}
