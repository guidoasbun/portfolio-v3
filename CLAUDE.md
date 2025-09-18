# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.3 portfolio website project featuring glass morphism design and 3D animations with Three.js. The project is in early development phase - currently has basic Next.js setup with Tailwind CSS and TypeScript.

## Technology Stack

- **Next.js 15.5.3** with App Router and Turbopack
- **React 19.1.0**
- **TypeScript 5**
- **Tailwind CSS 4**
- **ESLint 9** with Next.js configuration

### Planned Additional Libraries

- **Firebase** (Authentication, Firestore, Storage)
- **Framer Motion** (animations)
- **React Hook Form** (forms)
- **Three.js & React Three Fiber** (3D graphics)
- **React Three Drei** (R3F helpers)

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

```
portfolio/
├── src/
│   └── app/           # Next.js App Router pages
│       ├── layout.tsx # Root layout with Geist fonts
│       ├── page.tsx   # Home page (currently default Next.js starter)
│       └── globals.css
├── Documentation/     # Comprehensive project planning and specifications
├── public/           # Static assets
└── config files
```

## Planned Architecture (From Documentation)

### Frontend Features

- **Glass morphism design system** with transparent cards and backdrop blur
- **3D animations** with Three.js/React Three Fiber for interactive backgrounds
- **Responsive design** for mobile/desktop
- **Interactive project showcases** with 3D project cards
- **Admin dashboard** for content management

### Backend Integration (Planned)

- **Firebase Authentication** for admin access
- **Firestore database** for projects, experience, skills, messages
- **Firebase Storage** for file uploads
- **Next.js API routes** for CRUD operations

### Key Planned Components

#### Three.js Components

- `HeroBackground` - 3D animated background with floating particles
- `ProjectCard3D` - Interactive 3D project thumbnails with hover effects
- `SkillsVisualization` - 3D skills display in orbital pattern
- `ParticleSystem` - Floating particles for hero section
- `InteractiveElements` - Mouse-responsive 3D objects

#### UI Components

- `GlassCard` - Main card component with glass morphism effects
- `Scene` - Three.js Canvas wrapper with performance optimization
- `Modal`, `Button`, `FormField` - Standard UI components
- `LoadingSpinner` - Loading indicators

#### Section Components

- `HeroSection` - Landing hero with 3D background
- `ProjectGrid` - Projects showcase with 3D cards
- `ExperienceTimeline` - Experience display
- `ContactForm` - Contact form with validation
- `SkillsCloud` - 3D skills visualization

### Database Schema (Planned)

#### Projects

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Experience

```typescript
interface Experience {
  id: string;
  type: "work" | "internship" | "education";
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string[];
  technologies?: string[];
  createdAt: Date;
}
```

## Design System Guidelines

### Glass Morphism Theme

- **Primary Colors**: Whites and grays with transparency
- **Accent Colors**: Subtle blues and purples
- **Background**: Gradient backgrounds with blur effects
- **Cards**: Transparent with backdrop-blur
- **Borders**: Subtle borders with low opacity

### Tailwind Configuration (Planned)

```javascript
colors: {
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.1)',
  }
},
backdropBlur: {
  xs: '2px',
},
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.5s ease-out',
  'float': 'float 6s ease-in-out infinite',
}
```

## Three.js Implementation Strategy

### React 18+ Compatibility

- React Three Fiber (R3F) is fully React 18 compatible
- Next.js 14+ fully supports Three.js with App Router
- All concurrent features work seamlessly

### Performance Optimization

- **Dynamic imports** with `ssr: false` for all 3D components
- **Device capability detection** to disable 3D on low-power devices
- **Level of Detail (LOD)** for complex 3D scenes
- **Responsive pixel ratio** based on device capabilities
- **Prefers-reduced-motion** support for accessibility

### Development Approach

1. **Start Simple**: Basic particle background first
2. **Progressive Enhancement**: Add complexity gradually
3. **Performance First**: Always test on mobile devices
4. **Fallback Strategy**: Have non-3D versions ready

## Current Status

The project is currently at the initial Next.js setup stage with:

- Basic Next.js 15.5.3 installation
- Tailwind CSS 4 configured
- TypeScript enabled
- ESLint configured with Next.js rules
- Default starter page content

## Development Phases (From Documentation)

### Phase 1: Setup & Basic Structure

- Initialize Next.js project ✅
- Set up Firebase
- Configure Tailwind CSS
- Create basic layout and navigation
- Implement authentication

### Phase 2: Public Pages

- Hero section with 3D background
- About section
- Projects showcase (static data)
- Experience timeline
- Contact form

### Phase 3: Admin Dashboard & 3D Enhancements

- Admin layout and navigation
- Project management CRUD
- Experience management
- Message management
- Resume management
- Enhanced 3D project cards

### Phase 4: Polish & Optimization

- Responsive design
- Performance optimization (including 3D performance)
- SEO implementation
- 3D interaction refinements
- Testing and bug fixes
- Deployment

## Key Implementation Notes

- Use **Turbopack** for faster development and builds
- Always use **dynamic imports** for Three.js components to avoid SSR issues
- Implement **performance detection** before rendering 3D content
- Follow **glass morphism design patterns** for UI consistency
- Refer to detailed specifications in `Documentation/` for implementation details
- Test 3D performance across different devices early and often
