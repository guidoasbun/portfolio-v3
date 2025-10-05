# Component Library

Comprehensive documentation for all reusable components in the portfolio application.

## Table of Contents

- [UI Components](#ui-components)
- [Layout Components](#layout-components)
- [Section Components](#section-components)
- [Admin Components](#admin-components)
- [Three.js Components](#threejs-components)
- [Theme Integration](#theme-integration)
- [Accessibility](#accessibility)

---

## UI Components

### Button

Versatile button component with multiple variants and sizes.

**Import:**
```typescript
import { Button } from '@/components/ui/Button'
```

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'  // Default: 'primary'
  size?: 'sm' | 'md' | 'lg'                    // Default: 'md'
  children: React.ReactNode
  // + all standard button HTML attributes
}
```

**Variants:**
- `primary` - Gradient background (blue to purple)
- `secondary` - Glass morphism style with border
- `ghost` - Transparent with hover effect

**Sizes:**
- `sm` - 40px min-height (touch-friendly)
- `md` - 44px min-height (recommended)
- `lg` - 48px min-height (prominent CTAs)

**Examples:**
```tsx
{/* Primary button */}
<Button variant="primary" size="md">
  Submit
</Button>

{/* Secondary ghost button */}
<Button variant="ghost" onClick={handleClick}>
  Cancel
</Button>

{/* Disabled state */}
<Button disabled>
  Loading...
</Button>
```

**Features:**
- ✅ Accessible (ARIA labels, focus states)
- ✅ Responsive touch targets (44px+ minimum)
- ✅ Smooth animations (scale on hover/click)
- ✅ Theme-aware colors
- ✅ Disabled state support

---

### GlassCard

Card component with glass morphism effect.

**Import:**
```typescript
import { GlassCard } from '@/components/ui/GlassCard'
```

**Props:**
```typescript
interface GlassCardProps {
  variant?: 'light' | 'medium' | 'heavy'  // Default: 'medium'
  hover?: boolean                          // Default: false
  children: React.ReactNode
  // + all standard div HTML attributes
}
```

**Variants:**
- `light` - Subtle transparency
- `medium` - Balanced glass effect (default)
- `heavy` - Strong backdrop blur

**Examples:**
```tsx
{/* Basic card */}
<GlassCard>
  <h3>Title</h3>
  <p>Content</p>
</GlassCard>

{/* Hoverable card */}
<GlassCard variant="light" hover>
  Hover for effect
</GlassCard>

{/* Heavy glass with custom class */}
<GlassCard variant="heavy" className="p-8">
  Prominent content
</GlassCard>
```

---

### Modal

Accessible modal dialog with portal rendering.

**Import:**
```typescript
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
```

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'  // Default: 'md'
  closeOnBackdrop?: boolean                   // Default: true
  closeOnEsc?: boolean                        // Default: true
  showCloseButton?: boolean                   // Default: true
  className?: string
}
```

**Examples:**
```tsx
{/* Basic modal */}
<Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
  <ModalBody>
    Are you sure you want to proceed?
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>

{/* Full-screen modal */}
<Modal size="full" isOpen={isOpen} onClose={handleClose}>
  {/* Content */}
</Modal>
```

**Features:**
- ✅ Portal rendering (appended to body)
- ✅ Focus trap (accessibility)
- ✅ Escape key to close
- ✅ Backdrop click to close
- ✅ Body scroll lock
- ✅ Smooth animations (Framer Motion)
- ✅ Responsive sizes

---

### Input

Form input with glass morphism styling.

**Import:**
```typescript
import { Input } from '@/components/ui/Input'
```

**Props:**
```typescript
interface InputProps {
  label?: string
  error?: string
  helperText?: string
  // + all standard input HTML attributes
}
```

**Examples:**
```tsx
{/* With label */}
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
/>

{/* With error */}
<Input
  label="Password"
  type="password"
  error="Password is required"
/>

{/* With helper text */}
<Input
  label="Username"
  helperText="Minimum 3 characters"
/>
```

---

### Textarea

Multi-line text input with glass morphism styling.

**Import:**
```typescript
import { Textarea } from '@/components/ui/Textarea'
```

**Props:**
```typescript
interface TextareaProps {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
  maxLength?: number
  // + all standard textarea HTML attributes
}
```

**Examples:**
```tsx
{/* With character count */}
<Textarea
  label="Message"
  maxLength={500}
  showCharCount
  placeholder="Enter your message"
/>
```

---

### FormField

Wrapper component for form inputs with validation.

**Import:**
```typescript
import { FormField } from '@/components/ui/FormField'
```

**Props:**
```typescript
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}
```

**Examples:**
```tsx
<FormField label="Email" error={errors.email} required>
  <Input
    type="email"
    {...register('email')}
  />
</FormField>
```

---

### Badge

Small label component for status indicators.

**Import:**
```typescript
import { Badge } from '@/components/ui/Badge'
```

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error'
  children: React.ReactNode
}
```

**Examples:**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>
<Badge>New</Badge>
```

---

### LoadingSpinner

Animated loading indicator.

**Import:**
```typescript
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
```

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'     // Default: 'md'
  className?: string
}
```

**Examples:**
```tsx
<LoadingSpinner size="lg" />
```

---

### Toast

Notification toast component.

**Import:**
```typescript
import { Toast } from '@/components/ui/Toast'
```

**Props:**
```typescript
interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number  // ms, default: 3000
  onClose?: () => void
}
```

---

### ThemeToggle

Theme switcher component (dark/light/system).

**Import:**
```typescript
import { ThemeToggle } from '@/components/ui/ThemeToggle'
```

**Usage:**
```tsx
<ThemeToggle />
```

Automatically integrates with theme context.

---

## Layout Components

### Navbar

Main navigation bar with glass morphism.

**Import:**
```typescript
import { Navbar } from '@/components/layout/Navbar'
```

**Features:**
- Logo/brand
- Navigation links
- Mobile menu toggle
- Theme toggle
- Responsive design

---

### MobileMenu

Mobile navigation drawer.

**Import:**
```typescript
import { MobileMenu } from '@/components/layout/MobileMenu'
```

**Features:**
- Slide-in animation
- Navigation links
- Close button
- Theme toggle
- Social links

---

### Footer

Site footer with links and social icons.

**Import:**
```typescript
import { Footer } from '@/components/layout/Footer'
```

**Sections:**
- Quick links
- Contact info
- Social media links
- Copyright

---

### Layout

Main layout wrapper component.

**Import:**
```typescript
import { Layout } from '@/components/layout/Layout'
```

**Features:**
- Navbar integration
- Footer integration
- Gradient background
- Theme provider
- Analytics provider

---

## Section Components

### HeroSection

Landing hero section with 3D background.

**Import:**
```typescript
import { HeroSection } from '@/components/sections/HeroSection'
```

**Features:**
- Animated text
- CTA buttons
- Social links
- 3D particle background
- Scroll indicator

---

### AboutSection

About/bio section.

**Import:**
```typescript
import { AboutSection } from '@/components/sections/AboutSection'
```

**Features:**
- Bio text
- Education info
- Current status
- Interests grid
- Resume download

---

### ProjectsSection

Projects showcase grid.

**Import:**
```typescript
import { ProjectsSection } from '@/components/sections/ProjectsSection'
```

**Features:**
- Category filters
- Project cards
- Modal details
- Image gallery
- Responsive grid

---

### ExperienceSection

Timeline of work/education experience.

**Import:**
```typescript
import { ExperienceSection } from '@/components/sections/ExperienceSection'
```

**Features:**
- Timeline design
- Type filters (work/internship/education)
- Technology tags
- Date formatting
- Current position badge

---

### SkillsSection

Skills showcase grid.

**Import:**
```typescript
import { SkillsSection } from '@/components/sections/SkillsSection'
```

**Features:**
- Category filters
- Skill cards
- Hover effects
- Responsive grid
- Search functionality

---

### ContactSection

Contact form section.

**Import:**
```typescript
import { ContactSection } from '@/components/sections/ContactSection'
```

**Features:**
- Contact form
- Form validation
- reCAPTCHA integration
- Email/social links
- Success/error states

---

## Admin Components

### AdminSidebar

Admin dashboard sidebar navigation.

**Import:**
```typescript
import { AdminSidebar } from '@/components/admin/AdminSidebar'
```

**Features:**
- Navigation menu
- Active route highlighting
- User info
- Logout button
- Responsive drawer

---

### AdminHeader

Admin dashboard header.

**Import:**
```typescript
import { AdminHeader } from '@/components/admin/AdminHeader'
```

**Features:**
- Breadcrumb navigation
- Mobile menu toggle
- User menu

---

### ProjectsTable

Admin table for managing projects.

**Import:**
```typescript
import { ProjectsTable } from '@/components/admin/ProjectsTable'
```

**Features:**
- Desktop table view
- Mobile card view
- Edit/Delete actions
- Category filters
- Responsive design

---

### ImageUploadField

Image upload component with drag-and-drop.

**Import:**
```typescript
import { ImageUploadField } from '@/components/admin/ImageUploadField'
```

**Props:**
```typescript
interface ImageUploadFieldProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  label?: string
  error?: string
}
```

**Features:**
- Drag-and-drop
- Multiple uploads
- Progress tracking
- Preview thumbnails
- Remove images
- Firebase Storage integration

---

### TagsInput

Input for adding/removing tags.

**Import:**
```typescript
import { TagsInput } from '@/components/ui/TagsInput'
```

**Props:**
```typescript
interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  label?: string
}
```

**Features:**
- Add tags on Enter
- Remove with backspace or click
- Visual tag pills
- Validation

---

## Three.js Components

### HeroBackground

3D particle background for hero section.

**Import:**
```typescript
import { HeroBackground } from '@/components/three/HeroBackground'
```

**Features:**
- Floating particles
- Mouse interaction
- Performance optimization
- Device capability detection
- Theme-aware colors

---

### Scene

Wrapper for Three.js canvas.

**Import:**
```typescript
import { Scene } from '@/components/three/Scene'
```

**Props:**
```typescript
interface SceneProps {
  children: React.ReactNode
  camera?: Partial<PerspectiveCameraProps>
  className?: string
}
```

**Features:**
- SSR safety (client-side only)
- Performance detection
- Fallback for low-end devices
- WebGL support check

---

### LoadingAnimation3D

3D loading animation.

**Import:**
```typescript
import { LoadingAnimation3D } from '@/components/loading/LoadingAnimation3D'
```

**Features:**
- Rotating torus
- Particle effects
- Theme integration

---

## Theme Integration

All components support theme modes:
- 🌙 Dark mode
- ☀️ Light mode
- 🔄 System mode

### Using Theme Context

```tsx
import { useTheme } from '@/context/theme-context'

function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme()

  return (
    <button onClick={() => setTheme('dark')}>
      Switch to Dark
    </button>
  )
}
```

### Theme Classes

Components use these CSS classes:
- `glass` - Medium glass effect
- `glass-light` - Light glass effect
- `glass-heavy` - Heavy glass effect
- `text-foreground` - Theme-aware text color
- `bg-background` - Theme-aware background

---

## Accessibility

### Keyboard Navigation

All interactive components support keyboard navigation:
- `Tab` - Focus next
- `Shift+Tab` - Focus previous
- `Enter/Space` - Activate
- `Escape` - Close modals/menus

### Screen Reader Support

- Semantic HTML elements
- ARIA labels and roles
- Focus management
- Live regions for dynamic content

### Focus Management

- Visible focus indicators (`:focus-visible`)
- Focus trap in modals
- Skip navigation links
- Logical tab order

### Touch Targets

All interactive elements meet WCAG requirements:
- Minimum 44×44px touch target
- Adequate spacing between elements
- Large enough tap areas

### Reduced Motion

Components respect `prefers-reduced-motion`:

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion'

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { x: 100 }}
    >
      Content
    </motion.div>
  )
}
```

---

## Usage Examples

### Complete Form

```tsx
import { FormField, Input, Textarea, Button } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email().required('Email is required'),
  message: yup.string().min(10).required('Message is required'),
})

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Name" error={errors.name?.message} required>
        <Input {...register('name')} placeholder="Your name" />
      </FormField>

      <FormField label="Email" error={errors.email?.message} required>
        <Input {...register('email')} type="email" placeholder="your@email.com" />
      </FormField>

      <FormField label="Message" error={errors.message?.message} required>
        <Textarea {...register('message')} rows={5} />
      </FormField>

      <Button type="submit" variant="primary" size="lg">
        Send Message
      </Button>
    </form>
  )
}
```

### Modal with Confirmation

```tsx
import { Modal, ModalBody, ModalFooter, Button } from '@/components/ui'
import { useState } from 'react'

function DeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = () => {
    // Delete logic
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <ModalBody>
          Are you sure you want to delete this item? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

### Custom Glass Card

```tsx
import { GlassCard } from '@/components/ui'

function ProjectCard({ project }) {
  return (
    <GlassCard variant="light" hover className="p-6">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-foreground/80">{project.description}</p>
      <div className="flex gap-2 mt-4">
        {project.tags.map(tag => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </GlassCard>
  )
}
```

---

## Styling Conventions

### Tailwind CSS

All components use Tailwind CSS with:
- Utility classes for styling
- Glass morphism utilities
- Responsive prefixes (`sm:`, `md:`, `lg:`)
- Theme-aware colors

### Custom Utilities

```css
/* Glass morphism */
.glass {
  @apply bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20;
}

.glass-light {
  @apply bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10;
}

.glass-heavy {
  @apply bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/30;
}

/* Theme colors */
.text-foreground {
  @apply text-gray-900 dark:text-gray-100;
}

.bg-background {
  @apply bg-white dark:bg-gray-950;
}
```

---

## TypeScript Types

Import types from components:

```typescript
import type { ButtonProps } from '@/components/ui/Button'
import type { ModalProps } from '@/components/ui/Modal'
import type { GlassCardProps } from '@/components/ui/GlassCard'
```

All components are fully typed with TypeScript interfaces.

---

## Testing

Components can be tested with React Testing Library:

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

---

## Further Reading

- [Design System Guidelines](../CLAUDE.md#design-system-guidelines)
- [Accessibility Guide](./phase-7.6-accessibility.md)
- [Theme System](../src/context/theme-context.tsx)
- [Tailwind Configuration](../tailwind.config.ts)

---

**Last Updated**: Phase 8.6 - Documentation Complete
