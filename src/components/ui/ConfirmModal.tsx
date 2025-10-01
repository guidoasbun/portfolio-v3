'use client'

import React from 'react'
import { Modal, ModalBody, ModalFooter } from './Modal'
import { Button } from './Button'
import { IoWarningOutline, IoCheckmarkCircleOutline, IoInformationCircleOutline, IoAlertCircleOutline } from 'react-icons/io5'

type ConfirmVariant = 'default' | 'danger' | 'warning' | 'success' | 'info'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  size = 'sm',
  loading = false
}: ConfirmModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
    } finally {
      setIsProcessing(false)
    }
  }

  // Variant configurations
  const variantConfig = {
    default: {
      icon: IoInformationCircleOutline,
      iconColor: 'text-blue-500',
      title: title || 'Confirm Action'
    },
    danger: {
      icon: IoAlertCircleOutline,
      iconColor: 'text-red-500',
      title: title || 'Confirm Deletion'
    },
    warning: {
      icon: IoWarningOutline,
      iconColor: 'text-yellow-500',
      title: title || 'Warning'
    },
    success: {
      icon: IoCheckmarkCircleOutline,
      iconColor: 'text-green-500',
      title: title || 'Confirm'
    },
    info: {
      icon: IoInformationCircleOutline,
      iconColor: 'text-blue-500',
      title: title || 'Information'
    }
  }

  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      size={size}
      closeOnBackdrop={!isProcessing && !loading}
      closeOnEsc={!isProcessing && !loading}
      showCloseButton={!isProcessing && !loading}
    >
      <ModalBody>
        <div className="flex gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-foreground/80 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="ghost"
          size="md"
          onClick={onClose}
          disabled={isProcessing || loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'primary' : 'primary'}
          size="md"
          onClick={handleConfirm}
          disabled={isProcessing || loading}
          className={variant === 'danger' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : ''}
        >
          {isProcessing || loading ? 'Processing...' : confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
