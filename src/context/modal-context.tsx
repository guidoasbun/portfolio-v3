'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

type ConfirmVariant = 'default' | 'danger' | 'warning' | 'success' | 'info'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  size?: 'sm' | 'md' | 'lg'
}

interface AlertOptions {
  title?: string
  message: string
  confirmText?: string
  variant?: ConfirmVariant
  size?: 'sm' | 'md' | 'lg'
}

interface CustomModalOptions {
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  showCloseButton?: boolean
}

interface ModalContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  alert: (options: AlertOptions) => Promise<void>
  openCustomModal: (content: React.ReactNode, options?: CustomModalOptions) => void
  closeCustomModal: () => void
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined)

interface ModalProviderProps {
  children: React.ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    options: ConfirmOptions | null
  }>({
    isOpen: false,
    options: null
  })

  const [alertState, setAlertState] = useState<{
    isOpen: boolean
    options: AlertOptions | null
  }>({
    isOpen: false,
    options: null
  })

  const [customModalState, setCustomModalState] = useState<{
    isOpen: boolean
    content: React.ReactNode | null
    options: CustomModalOptions | null
  }>({
    isOpen: false,
    content: null,
    options: null
  })

  // Use refs to store resolve functions to avoid dependency issues
  const confirmResolveRef = useRef<((value: boolean) => void) | null>(null)
  const alertResolveRef = useRef<(() => void) | null>(null)

  // Confirm dialog
  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve
      setConfirmState({
        isOpen: true,
        options
      })
    })
  }, [])

  const handleConfirmClose = useCallback(() => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(false)
      confirmResolveRef.current = null
    }
    setConfirmState({
      isOpen: false,
      options: null
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(true)
      confirmResolveRef.current = null
    }
    setConfirmState({
      isOpen: false,
      options: null
    })
  }, [])

  // Alert dialog
  const alert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      alertResolveRef.current = resolve
      setAlertState({
        isOpen: true,
        options
      })
    })
  }, [])

  const handleAlertClose = useCallback(() => {
    if (alertResolveRef.current) {
      alertResolveRef.current()
      alertResolveRef.current = null
    }
    setAlertState({
      isOpen: false,
      options: null
    })
  }, [])

  // Custom modal
  const openCustomModal = useCallback(
    (content: React.ReactNode, options?: CustomModalOptions) => {
      setCustomModalState({
        isOpen: true,
        content,
        options: options || null
      })
    },
    []
  )

  const closeCustomModal = useCallback(() => {
    setCustomModalState({
      isOpen: false,
      content: null,
      options: null
    })
  }, [])

  const value: ModalContextValue = {
    confirm,
    alert,
    openCustomModal,
    closeCustomModal
  }

  return (
    <ModalContext.Provider value={value}>
      {children}

      {/* Confirm Modal */}
      {confirmState.options && (
        <ConfirmModal
          isOpen={confirmState.isOpen}
          onClose={handleConfirmClose}
          onConfirm={handleConfirm}
          title={confirmState.options.title}
          message={confirmState.options.message}
          confirmText={confirmState.options.confirmText}
          cancelText={confirmState.options.cancelText}
          variant={confirmState.options.variant}
          size={confirmState.options.size}
        />
      )}

      {/* Alert Modal */}
      {alertState.options && (
        <Modal
          isOpen={alertState.isOpen}
          onClose={handleAlertClose}
          title={alertState.options.title || 'Alert'}
          size={alertState.options.size || 'sm'}
        >
          <ModalBody>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {alertState.options.message}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="primary"
              size="md"
              onClick={handleAlertClose}
            >
              {alertState.options.confirmText || 'OK'}
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Custom Modal */}
      {customModalState.content && (
        <Modal
          isOpen={customModalState.isOpen}
          onClose={closeCustomModal}
          title={customModalState.options?.title}
          size={customModalState.options?.size || 'md'}
          closeOnBackdrop={customModalState.options?.closeOnBackdrop ?? true}
          closeOnEsc={customModalState.options?.closeOnEsc ?? true}
          showCloseButton={customModalState.options?.showCloseButton ?? true}
        >
          {customModalState.content}
        </Modal>
      )}
    </ModalContext.Provider>
  )
}

export function useModalContext() {
  const context = useContext(ModalContext)

  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }

  return context
}
