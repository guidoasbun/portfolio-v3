/**
 * LogoutButton Component
 *
 * Button for signing out the current user.
 * Shows confirmation modal and handles redirect after logout.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { FiLogOut } from 'react-icons/fi'

interface LogoutButtonProps {
  showConfirm?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  redirectTo?: string
}

export function LogoutButton({
  showConfirm = true,
  variant = 'ghost',
  size = 'md',
  className,
  redirectTo = '/'
}: LogoutButtonProps) {
  const { signOut } = useAuth()
  const router = useRouter()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogoutClick = () => {
    if (showConfirm) {
      setIsConfirmOpen(true)
    } else {
      handleLogout()
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await signOut()
      router.push(redirectTo)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
      setIsConfirmOpen(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleLogoutClick}
        disabled={isLoading}
        className={className}
      >
        <FiLogOut className="mr-2" />
        {isLoading ? 'Signing out...' : 'Sign Out'}
      </Button>

      {showConfirm && (
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleLogout}
          title="Sign Out"
          message="Are you sure you want to sign out?"
          confirmText="Sign Out"
          cancelText="Cancel"
          variant="default"
        />
      )}
    </>
  )
}
