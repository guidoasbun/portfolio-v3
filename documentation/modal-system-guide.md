# Modal System Guide

Comprehensive documentation for the Modal System implemented in Phase 2.5.

## Overview

The Modal System provides a flexible, accessible, and animated modal solution with multiple components and approaches:

- **Base Modal** - Customizable modal with portal rendering
- **Confirm Modal** - Pre-styled confirmation dialogs
- **Image Modal** - Gallery viewer with navigation
- **useModal Hook** - Simple state management
- **Modal Context** - Global modal management

## Components

### 1. Modal (Base Component)

The foundational modal component with full customization.

#### Features
- Portal rendering (renders outside React tree)
- Framer Motion animations
- Keyboard navigation (ESC to close)
- Backdrop click to close
- Body scroll lock
- Theme-aware styling
- Multiple size variants

#### Props

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean  // default: true
  closeOnEsc?: boolean        // default: true
  showCloseButton?: boolean   // default: true
  className?: string
}
```

#### Usage Example

```tsx
import { Modal, ModalBody, ModalFooter, Button } from '@/components/ui'
import { useModal } from '@/hooks'

function MyComponent() {
  const { isOpen, open, close } = useModal()

  return (
    <>
      <Button onClick={open}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="My Custom Modal"
        size="md"
      >
        <ModalBody>
          <p>Your content goes here...</p>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            // Handle action
            close()
          }}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

### 2. ConfirmModal

Pre-styled confirmation dialog with variants.

#### Features
- Multiple variants (default, danger, warning, success, info)
- Icons for each variant
- Loading state support
- Promise-based API when used with context
- Async action support

#### Props

```typescript
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  message: string
  confirmText?: string       // default: 'Confirm'
  cancelText?: string        // default: 'Cancel'
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}
```

#### Usage Example

```tsx
import { ConfirmModal } from '@/components/ui'
import { useModal } from '@/hooks'

function DeleteButton() {
  const { isOpen, open, close } = useModal()

  const handleDelete = async () => {
    // Perform delete action
    await deleteItem()
    close()
  }

  return (
    <>
      <Button variant="primary" onClick={open}>
        Delete Item
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={close}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this item? This action cannot be undone."
        variant="danger"
      />
    </>
  )
}
```

### 3. ImageModal

Full-screen image viewer with gallery navigation.

#### Features
- Full-screen viewing
- Image navigation (arrow keys, buttons)
- Download functionality
- Loading states
- Image counter
- Smooth animations between images

#### Props

```typescript
interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  initialIndex?: number      // default: 0
  alt?: string              // default: 'Image'
  showDownload?: boolean    // default: true
  onDownload?: (imageUrl: string, index: number) => void
}
```

#### Usage Example

```tsx
import { ImageModal } from '@/components/ui'
import { useModalWithData } from '@/hooks'

function Gallery() {
  const { isOpen, data, open, close } = useModalWithData<number>()

  const images = [
    '/project1.jpg',
    '/project2.jpg',
    '/project3.jpg'
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Project ${idx + 1}`}
          className="cursor-pointer hover:scale-105 transition-transform"
          onClick={() => open(idx)}
        />
      ))}

      <ImageModal
        isOpen={isOpen}
        onClose={close}
        images={images}
        initialIndex={data ?? 0}
        alt="Project Gallery"
      />
    </div>
  )
}
```

## Hooks

### 1. useModal

Simple hook for managing modal open/close state.

```typescript
function useModal(initialState = false): {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}
```

#### Example

```tsx
import { useModal } from '@/hooks'

function Example() {
  const modal = useModal()
  // or with initial state
  const modal = useModal(true) // starts open

  return (
    <>
      <Button onClick={modal.open}>Open</Button>
      <Button onClick={modal.close}>Close</Button>
      <Button onClick={modal.toggle}>Toggle</Button>

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        Content
      </Modal>
    </>
  )
}
```

### 2. useModalWithData

Hook for managing modal state with associated data.

```typescript
function useModalWithData<T>(): {
  isOpen: boolean
  data: T | null
  open: (data?: T) => void
  close: () => void
  toggle: (data?: T) => void
}
```

#### Example

```tsx
import { useModalWithData } from '@/hooks'

interface Project {
  id: string
  title: string
}

function ProjectList() {
  const editModal = useModalWithData<Project>()

  return (
    <>
      {projects.map(project => (
        <Button
          key={project.id}
          onClick={() => editModal.open(project)}
        >
          Edit {project.title}
        </Button>
      ))}

      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title={editModal.data?.title}
      >
        {editModal.data && (
          <EditForm project={editModal.data} />
        )}
      </Modal>
    </>
  )
}
```

## Modal Context (Global Modals)

For app-wide modal management without prop drilling.

### Setup

Add `ModalProvider` to your app layout:

```tsx
// app/layout.tsx
import { ModalProvider } from '@/context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  )
}
```

### useModalContext

Hook for accessing global modal functions.

```typescript
interface ModalContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  alert: (options: AlertOptions) => Promise<void>
  openCustomModal: (content: React.ReactNode, options?: CustomModalOptions) => void
  closeCustomModal: () => void
}
```

### Examples

#### Confirmation Dialog

```tsx
import { useModalContext } from '@/context'

function DeleteButton() {
  const { confirm } = useModalContext()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })

    if (confirmed) {
      // Proceed with deletion
      await deleteItem()
    }
  }

  return <Button onClick={handleDelete}>Delete</Button>
}
```

#### Alert Dialog

```tsx
import { useModalContext } from '@/context'

function SaveButton() {
  const { alert } = useModalContext()

  const handleSave = async () => {
    await saveData()

    await alert({
      title: 'Success',
      message: 'Your changes have been saved successfully!',
      variant: 'success',
      confirmText: 'OK'
    })
  }

  return <Button onClick={handleSave}>Save</Button>
}
```

#### Custom Modal

```tsx
import { useModalContext } from '@/context'

function ShareButton() {
  const { openCustomModal, closeCustomModal } = useModalContext()

  const handleShare = () => {
    openCustomModal(
      <div className="space-y-4">
        <h3>Share this project</h3>
        <Input placeholder="Email address" />
        <Button onClick={closeCustomModal}>Send</Button>
      </div>,
      {
        title: 'Share Project',
        size: 'md'
      }
    )
  }

  return <Button onClick={handleShare}>Share</Button>
}
```

## Best Practices

### 1. Choose the Right Approach

- **Local State (useModal)**: For component-specific modals
- **Context (useModalContext)**: For app-wide confirmations/alerts
- **useModalWithData**: When passing data to modal on open

### 2. Accessibility

All modals automatically include:
- ESC key to close
- Focus trap (stays within modal)
- Body scroll lock
- ARIA labels

### 3. Performance

- Modals use portals (render outside component tree)
- Automatic cleanup on unmount
- Optimized animations with Framer Motion
- Lazy content rendering (only when open)

### 4. TypeScript

All components are fully typed. Use generics for data:

```tsx
// Type-safe data passing
const modal = useModalWithData<Project>()
modal.open({ id: '1', title: 'Project' })
// modal.data is typed as Project | null
```

### 5. Nested Modals

While supported, avoid deep nesting. Use context methods or close parent before opening child:

```tsx
// Option 1: Sequential
const handleEdit = async () => {
  closeParent()
  await new Promise(resolve => setTimeout(resolve, 300)) // Wait for animation
  openEdit()
}

// Option 2: Context methods handle this automatically
const { confirm } = useModalContext()
const confirmed = await confirm({ ... })
```

## Animation Customization

Modals use Framer Motion. Customize by wrapping content:

```tsx
import { motion } from 'framer-motion'

<Modal isOpen={isOpen} onClose={close}>
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
  >
    Custom animated content
  </motion.div>
</Modal>
```

## Theme Integration

Modals automatically adapt to light/dark themes using:
- `glass-heavy` backdrop blur
- `text-foreground` for text
- `border-white/20` for borders

## Common Patterns

### Form in Modal

```tsx
function FormModal() {
  const modal = useModal()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await submitForm(data)
      modal.close()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.close} title="Add Project">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <FormField label="Title" />
          <FormField label="Description" />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={modal.close}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
```

### Multi-step Modal

```tsx
function WizardModal() {
  const modal = useModal()
  const [step, setStep] = useState(1)

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)
  const handleClose = () => {
    modal.close()
    setTimeout(() => setStep(1), 300) // Reset after close animation
  }

  return (
    <Modal isOpen={modal.isOpen} onClose={handleClose} title={`Step ${step} of 3`}>
      <ModalBody>
        {step === 1 && <Step1Content />}
        {step === 2 && <Step2Content />}
        {step === 3 && <Step3Content />}
      </ModalBody>
      <ModalFooter>
        {step > 1 && <Button onClick={handleBack}>Back</Button>}
        {step < 3 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleClose}>Finish</Button>
        )}
      </ModalFooter>
    </Modal>
  )
}
```

## Troubleshooting

### Modal not appearing

1. Check ModalProvider is in layout (for context methods)
2. Verify `isOpen` prop is true
3. Check z-index conflicts (modals use z-50)

### Backdrop not blocking

- Ensure no elements have z-index > 50
- Check for CSS isolation issues

### Scroll issues

- Modals automatically lock body scroll
- If issues persist, check for competing scroll locks
- Verify cleanup on unmount

### TypeScript errors

```tsx
// Correct: Explicitly type data
const modal = useModalWithData<MyType>()

// Correct: Optional onDownload
onDownload={(url, idx) => customDownload(url)}

// Correct: Variant types
variant: 'danger' // not 'error'
```

## Component Files

- Base Modal: `src/components/ui/Modal.tsx`
- Confirm Modal: `src/components/ui/ConfirmModal.tsx`
- Image Modal: `src/components/ui/ImageModal.tsx`
- useModal Hook: `src/hooks/useModal.ts`
- Modal Context: `src/context/modal-context.tsx`
