### Three.js Components
- `HeroBackground` - 3D animated background
- `ProjectCard3D` - 3D project thumbnails
- `SkillsVisualization` - 3D skills display
- `ParticleSystem` - Floating particles
- `InteractiveElements` - Mouse-responsive 3D objects# Portfolio Website Documentation

## Project Overview

A modern, responsive portfolio website for a Computer Science senior to showcase projects, experience, and skills to potential employers. Features a glass morphism design inspired by Apple's design language.

## Technology Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** (for styling and glass morphism effects)
- **Framer Motion** (for animations)
- **React Hook Form** (for forms)

### Backend & Services
- **Next.js API Routes** (serverless functions)
- **Firebase**
  - Authentication (admin login)
  - Firestore (database)
  - Storage (file uploads)
- **Vercel** (deployment)

### Additional Libraries
- **React Icons** (icon library)
- **React PDF** (resume viewer)
- **Sharp** (image optimization)
- **Three.js & React Three Fiber** (3D graphics)
- **React Three Drei** (R3F helpers)
- **React Spring Three** (3D animations)

## Features Specification

### Public Features
1. **Hero Section**
   - Professional photo
   - Name and title
   - Brief introduction
   - Social links (LinkedIn, GitHub)
   - **Interactive 3D background with floating particles**

2. **About Section**
   - Detailed bio
   - Skills showcase with 3D visualization
   - Education information

3. **Projects Showcase**
   - Grid layout with project cards
   - **3D project thumbnails with hover effects**
   - Filter by technology/category
   - Project details modal/page
   - Live demo and GitHub links

4. **Experience Timeline**
   - Work experience
   - Internships
   - Education milestones

5. **Resume Section**
   - Online resume viewer
   - Download PDF functionality
   - Print-friendly format

6. **Contact Form**
   - Contact information
   - Message form with validation
   - Social media links

### Admin Features
1. **Authentication**
   - Secure admin login
   - Protected admin routes

2. **Dashboard**
   - Overview of portfolio stats
   - Recent messages
   - Quick actions

3. **Project Management**
   - Add/edit/delete projects
   - Image upload for projects
   - Technology tags management

4. **Experience Management**
   - Add/edit work experience
   - Education timeline
   - Skills management

5. **Resume Management**
   - Upload new resume versions
   - Resume content editing
   - Download analytics

6. **Messages Management**
   - View contact form submissions
   - Mark as read/unread
   - Response functionality

## Database Schema

### Collections in Firestore

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
  type: 'work' | 'internship' | 'education';
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

#### Skills
```typescript
interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 1-5
  featured: boolean;
}
```

#### Messages
```typescript
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
```

#### Resume
```typescript
interface Resume {
  id: string;
  version: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: Date;
  active: boolean;
}
```

## File Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── projects/
│   │   ├── resume/
│   │   ├── contact/
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── projects/
│   │   │   ├── experience/
│   │   │   ├── messages/
│   │   │   └── resume/
│   │   └── api/
│   │       ├── auth/
│   │       ├── projects/
│   │       ├── experience/
│   │       ├── messages/
│   │       └── resume/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── admin/           # Admin-specific components
│   │   ├── sections/        # Page sections
│   │   ├── forms/           # Form components
│   │   └── three/           # Three.js components
│   ├── lib/
│   │   ├── firebase.ts      # Firebase configuration
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── db.ts            # Database utilities
│   │   └── utils.ts         # General utilities
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── styles/
├── public/
│   ├── images/
│   ├── icons/
│   └── resume/
├── docs/
└── config files (package.json, tailwind.config.js, etc.)
```

## Design System

### Glass Morphism Theme
- **Primary Colors**: Whites and grays with transparency
- **Accent Colors**: Subtle blues and purples
- **Background**: Gradient backgrounds with blur effects
- **Cards**: Transparent with backdrop-blur
- **Borders**: Subtle borders with low opacity

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
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
      }
    }
  }
}
```

## Development Phases

### Phase 1: Setup & Basic Structure (Week 1)
- [ ] Initialize Next.js project
- [ ] Set up Firebase
- [ ] Configure Tailwind CSS
- [ ] Create basic layout and navigation
- [ ] Implement authentication

### Phase 2: Public Pages (Week 2)
- [ ] Hero section with 3D background
- [ ] About section
- [ ] Projects showcase (static data)
- [ ] Experience timeline
- [ ] Contact form

### Phase 3: Admin Dashboard & 3D Enhancements (Week 3)
- [ ] Admin layout and navigation
- [ ] Project management CRUD
- [ ] Experience management
- [ ] Message management
- [ ] Resume management
- [ ] Enhanced 3D project cards

### Phase 4: Polish & Optimization (Week 4)
- [ ] Responsive design
- [ ] Performance optimization (including 3D performance)
- [ ] SEO implementation
- [ ] 3D interaction refinements
- [ ] Testing and bug fixes
- [ ] Deployment

## Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (for server-side)
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PROJECT_ID=

# Other
NEXT_PUBLIC_SITE_URL=
ADMIN_EMAIL=
```

## Key Components to Build

### Reusable UI Components
- `GlassCard` - Main card component with glass effect
- `Button` - Various button styles
- `Modal` - Modal dialogs
- `FormField` - Form input wrapper
- `LoadingSpinner` - Loading indicators

### Section Components
- `HeroSection` - Landing hero
- `ProjectGrid` - Projects showcase
- `ExperienceTimeline` - Experience display
- `ContactForm` - Contact form
- `SkillsCloud` - Skills visualization

### Admin Components
- `AdminLayout` - Admin page wrapper
- `DataTable` - Generic data table
- `ProjectForm` - Project add/edit form
- `ExperienceForm` - Experience add/edit form
- `FileUpload` - File upload component

## API Endpoints

### Projects API
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Experience API
- `GET /api/experience` - Get all experience
- `POST /api/experience` - Create experience
- `PUT /api/experience/[id]` - Update experience
- `DELETE /api/experience/[id]` - Delete experience

### Messages API
- `GET /api/messages` - Get all messages (admin)
- `POST /api/messages` - Send message (public)
- `PUT /api/messages/[id]` - Mark as read

### Resume API
- `GET /api/resume` - Get current resume
- `POST /api/resume` - Upload new resume

## Security Considerations

1. **Authentication**
   - Use Firebase Auth for admin access
   - Implement proper session management
   - Protect admin routes

2. **Data Validation**
   - Validate all form inputs
   - Sanitize user content
   - Use TypeScript for type safety

3. **File Uploads**
   - Validate file types and sizes
   - Use Firebase Storage security rules
   - Scan uploaded files

4. **API Security**
   - Rate limiting on contact form
   - CORS configuration
   - Input validation on all endpoints

## Performance Optimization

1. **Images**
   - Use Next.js Image component
   - Implement lazy loading
   - Optimize image formats

2. **Code Splitting**
   - Dynamic imports for admin sections
   - Route-based code splitting
   - **Lazy load Three.js components**

3. **Caching**
   - Static generation for public pages
   - Cache API responses
   - CDN for static assets

4. **Three.js Optimization**
   - Use lower polygon counts for mobile
   - Implement level-of-detail (LOD)
   - Optimize shader materials
   - Use instanced meshes for repeated objects
   - Implement frustum culling

## SEO Strategy

1. **Meta Tags**
   - Dynamic meta descriptions
   - Open Graph tags
   - Twitter Card tags

2. **Structured Data**
   - JSON-LD for personal info
   - Schema.org markup

3. **Performance**
   - Core Web Vitals optimization
   - Fast loading times
   - Mobile responsiveness

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase security rules set
- [ ] Domain configured
- [ ] SSL certificate
- [ ] Analytics setup
- [ ] Error monitoring
- [ ] Backup strategy

## Future Enhancements

1. **Analytics Dashboard**
   - Visitor statistics
   - Popular projects
   - Contact form analytics

2. **Blog Section**
   - Technical blog posts
   - CMS integration

3. **Testimonials**
   - Client/colleague testimonials
   - Recommendation showcase

4. **Advanced Features**
   - Dark/light mode toggle
   - Multiple language support
   - Project filtering and search