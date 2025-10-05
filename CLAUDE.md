# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready Next.js 15.5.3 portfolio website featuring glass morphism design, 3D animations with Three.js, and a comprehensive admin dashboard. The project includes a full-stack implementation with Firebase backend, real-time data management, secure authentication, and advanced features like email notifications, analytics, and progressive web app capabilities.

## Technology Stack

- **Next.js 15.5.3** with App Router and Turbopack
- **React 19.1.0**
- **TypeScript 5**
- **Tailwind CSS 4**
- **ESLint 9** with Next.js configuration
- **Firebase Hosting** (deployment platform)

### Additional Libraries

- **Firebase** (Authentication, Firestore, Storage, Hosting, Analytics)
- **Framer Motion** (animations and transitions)
- **React Hook Form + Yup** (forms and validation)
- **Three.js & React Three Fiber** (3D graphics)
- **React Three Drei** (R3F helpers)
- **Nodemailer** (email notifications)
- **Sharp** (image optimization)
- **Playwright** (E2E testing)
- **Google reCAPTCHA v3** (spam protection)

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
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                # Public pages (home)
│   │   ├── admin/                   # Admin dashboard
│   │   │   ├── projects/           # Project management
│   │   │   ├── experience/         # Experience management
│   │   │   ├── skills/             # Skills management
│   │   │   ├── messages/           # Message inbox
│   │   │   ├── resume/             # Resume management
│   │   │   ├── analytics/          # Analytics dashboard
│   │   │   └── login/              # Admin login
│   │   ├── api/                     # API routes (12 endpoints)
│   │   │   ├── projects/           # Project CRUD
│   │   │   ├── experience/         # Experience CRUD
│   │   │   ├── skills/             # Skills CRUD
│   │   │   ├── messages/           # Messages CRUD
│   │   │   └── resume/             # Resume CRUD
│   │   ├── contact/                 # Contact pages
│   │   ├── resume/                  # Resume viewer
│   │   ├── demo/                    # Component demos
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── admin/                   # Admin components (15)
│   │   ├── auth/                    # Auth components (3)
│   │   ├── layout/                  # Layout components (8)
│   │   ├── loading/                 # Loading components (3)
│   │   ├── providers/               # Context providers (3)
│   │   ├── sections/                # Page sections (7)
│   │   ├── seo/                     # SEO components (1)
│   │   ├── three/                   # 3D components (6)
│   │   ├── transitions/             # Transition components (3)
│   │   └── ui/                      # UI components (35+)
│   ├── context/                     # React contexts (4)
│   │   ├── auth-context.tsx        # Authentication
│   │   ├── theme-context.tsx       # Theme management
│   │   ├── modal-context.tsx       # Modal system
│   │   └── analytics-context.tsx   # Analytics
│   ├── hooks/                       # Custom hooks (15+)
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useModal.ts
│   │   ├── useFirestore.ts
│   │   ├── useStorage.ts
│   │   ├── useAnalytics.ts
│   │   └── ... (accessibility, performance, etc.)
│   ├── lib/                         # Core utilities
│   │   ├── analytics/               # Analytics utilities
│   │   ├── firebase/                # Firebase config & services
│   │   ├── services/                # Database services (5)
│   │   ├── three/                   # Three.js utilities
│   │   ├── validations.ts           # Form schemas
│   │   ├── email.ts                 # Email service
│   │   ├── recaptcha.ts             # reCAPTCHA
│   │   ├── rate-limiter.ts          # Rate limiting
│   │   ├── errors.ts                # Error handling
│   │   └── ... (30+ utility files)
│   ├── types/                       # TypeScript types
│   │   ├── index.ts                 # Core types
│   │   ├── admin.ts                 # Admin types
│   │   ├── analytics.ts             # Analytics types
│   │   └── three.ts                 # Three.js types
│   └── data/                        # Static data (mock)
├── documentation/                   # Comprehensive docs (20+ files)
│   ├── README.md                    # Documentation index
│   ├── roadmap.md                   # Development roadmap
│   ├── api-reference.md             # API documentation
│   ├── deployment-guide.md          # Deployment guide
│   ├── environment-variables.md     # Env vars reference
│   ├── component-library.md         # Component docs
│   ├── firebase-setup-guide.md      # Firebase setup
│   └── ... (phase summaries, guides)
├── tests/                           # E2E tests
│   └── e2e/                         # Playwright tests (41 tests)
├── public/                          # Static assets
│   ├── sw.js                        # Service worker
│   ├── manifest.json                # PWA manifest
│   └── ... (images, icons)
├── firestore.rules                  # Firestore security
├── storage.rules                    # Storage security
└── ... (config files)
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

### Important Design Decisions

- **NO Skill Proficiency Meters**: Do NOT show percentage meters or progress bars for skills (e.g., "78% C++"). Users should never see numerical proficiency indicators as this creates unnecessary expectations. Instead, skills should be displayed as tags or badges without proficiency levels.

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

The project is **COMPLETE** and ready for deployment:

- ✅ Next.js 15.5.3 with App Router and Turbopack
- ✅ Full TypeScript implementation (strict mode)
- ✅ Tailwind CSS 4 with glass morphism design system
- ✅ Firebase integration (Auth, Firestore, Storage, Analytics)
- ✅ Complete admin dashboard with CRUD operations
- ✅ 3D animations with Three.js and React Three Fiber
- ✅ Contact form with email, rate limiting, and reCAPTCHA
- ✅ Comprehensive testing and error handling
- ✅ Full documentation and deployment guides
- ✅ Performance optimization and accessibility features

## Development Phases (COMPLETED)

### Phase 1-2: Foundation & UI (✅ COMPLETE)
- Next.js 15.5.3 setup with Turbopack
- Tailwind CSS 4 with glass morphism
- 35+ reusable UI components
- Layout system and navigation

### Phase 3: Public Pages (✅ COMPLETE)
- Hero, About, Projects, Experience, Skills, Contact sections
- Theme system (dark/light/system)
- Framer Motion animations
- Responsive design

### Phase 4: Three.js Integration (✅ COMPLETE)
- HeroBackground with 1000 particles
- Performance optimization (high/medium/low tiers)
- Device capability detection
- Interactive elements and transitions

### Phase 5: Firebase & Backend (✅ COMPLETE)
- Firebase Auth, Firestore, Storage, Analytics
- 12 API routes with full CRUD
- TypeScript services layer
- Client & Admin SDK integration

### Phase 6: Admin Dashboard (✅ COMPLETE)
- Protected routes with authentication
- Project, Experience, Skills, Messages, Resume management
- Real-time data with Firestore
- File uploads with Firebase Storage

### Phase 7: Advanced Features (✅ COMPLETE)
- Contact form with email, rate limiting, reCAPTCHA
- Search, filtering, pagination
- Analytics integration (GA4)
- SEO (sitemap, robots.txt, OG tags, structured data)
- Accessibility (WCAG compliant)
- Progressive enhancement (PWA, offline, lazy loading)

### Phase 8: Polish & Deployment (✅ COMPLETE)
- Performance optimization (<500KB bundle)
- Cross-browser testing (Playwright)
- Error handling with retry mechanisms
- Comprehensive documentation
- Deployment guides for Firebase Hosting

## Key Implementation Notes

- Use **Turbopack** for faster development and builds
- Always use **dynamic imports** for Three.js components to avoid SSR issues
- Implement **performance detection** before rendering 3D content
- Follow **glass morphism design patterns** for UI consistency
- Refer to detailed specifications in `Documentation/` for implementation details
- Test 3D performance across different devices early and often

## Final Architecture

### Frontend Stack
- **Framework**: Next.js 15.5.3 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS 4 with glass morphism utilities
- **Animations**: Framer Motion + Three.js (React Three Fiber)
- **Forms**: React Hook Form + Yup validation
- **State**: React Context API (Auth, Theme, Modal, Analytics)
- **TypeScript**: Strict mode with comprehensive type definitions

### Backend Stack
- **Authentication**: Firebase Auth (email/password)
- **Database**: Firestore with security rules
- **Storage**: Firebase Storage for images/PDFs
- **Analytics**: Google Analytics 4 (Firebase)
- **Email**: Nodemailer (SMTP) with templates
- **Security**: reCAPTCHA v3, rate limiting, input validation

### API Architecture
- **12 REST endpoints** in `/api` routes
- **Server-side**: Firebase Admin SDK
- **Client-side**: Firebase Client SDK
- **Validation**: Yup schemas on client & server
- **Error handling**: Custom error classes with logging
- **Response format**: Standardized `ApiResponse<T>` type

### Database Collections
1. **projects** - Portfolio projects (title, description, technologies, images)
2. **experience** - Work/education history (timeline items)
3. **skills** - Technical skills (categorized, no proficiency displayed)
4. **messages** - Contact form submissions (with read/replied status)
5. **resumes** - Resume versions (PDFs with download tracking)

### Security Implementation
- **Firestore Rules**: Admin-only write access with UID validation
- **Storage Rules**: Public read, admin-only write
- **API Protection**: Authentication checks, input validation
- **Rate Limiting**: IP-based (3 submissions/15min on contact form)
- **reCAPTCHA**: Server-side verification with score threshold
- **Environment Vars**: Client/server separation, no secrets exposed

### Performance Optimizations
- **Code Splitting**: Dynamic imports for 3D components
- **Image Optimization**: Next/Image with Sharp, AVIF/WebP
- **Bundle Size**: 366KB main page (target: <500KB)
- **CSS**: 14.8KB optimized bundle
- **3D Performance**: Tiered particle counts (500-1000)
- **Caching**: 1-year for static assets, stale-while-revalidate
- **Lazy Loading**: Images, 3D components, routes

### Accessibility Features
- **WCAG Compliant**: Semantic HTML, ARIA labels, keyboard nav
- **Focus Management**: Visible indicators, focus trap in modals
- **Screen Readers**: Proper roles, live regions, alt text
- **Touch Targets**: 44×44px minimum (mobile-friendly)
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Skip Navigation**: Skip-to-main-content link

### Testing Strategy
- **E2E Tests**: 41 Playwright tests (92.7% pass rate)
- **Type Safety**: Strict TypeScript, zero `any` types
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: Mobile, tablet, desktop viewports
- **3D Fallbacks**: WebGL detection, performance tiers

### Deployment Architecture
```
┌──────────────────────┐
│   GitHub Repo        │
│   (Source Code)      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   GitHub Actions     │
│   (CI/CD Pipeline)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────┐
│   Firebase Hosting (CDN)         │
│   - Static files (out/)          │
│   - Client-side app              │
│   - Images, fonts, assets        │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   Cloud Functions (Gen 2)        │
│   - API routes (/api/*)          │
│   - Server-side rendering        │
│   - Firebase Admin SDK           │
└──────────┬───────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│   Firebase Services                        │
│   - Firestore (database)                   │
│   - Storage (files)                        │
│   - Authentication (admin)                 │
│   - Analytics (tracking)                   │
└────────────────────────────────────────────┘
```

### Environment Configuration
- **Development**: `.env.local` with localhost URLs
- **Production**: `.env.production` with custom domain
- **CI/CD**: GitHub Secrets for deployment
- **Required Vars**: 20+ environment variables (Firebase, email, reCAPTCHA)
- **Security**: Server-only secrets, client public keys

### Documentation Structure
1. **README.md** - Project overview, setup, features
2. **CLAUDE.md** - Architecture, guidelines (this file)
3. **documentation/** - 20+ detailed guides:
   - API Reference (12 endpoints documented)
   - Deployment Guide (Firebase Hosting)
   - Environment Variables (complete reference)
   - Component Library (35+ components)
   - Firebase Setup Guide
   - Contact Form Setup
   - Phase summaries (1-8)
   - Testing documentation

### Monitoring & Analytics
- **Google Analytics 4**: Page views, events, conversions
- **Custom Events**: Form submissions, downloads, 3D interactions
- **Performance**: Core Web Vitals tracking
- **Error Logging**: Client & server-side error tracking
- **Firebase Console**: Real-time database, auth, storage metrics

### Deployment Strategy

- **Platform**: Firebase Hosting with Cloud Functions (Gen 2)
- **CI/CD**: GitHub Actions (automated via `firebase init hosting:github`)
- **API Routes**: Deployed as Cloud Functions for server-side execution
- **Static Assets**: Served from Firebase Hosting CDN
- **Custom Domain**: SSL/TLS via Let's Encrypt (automatic)
- **Build**: Turbopack for faster production builds
- **Deployment**: `firebase deploy` or GitHub push to main
