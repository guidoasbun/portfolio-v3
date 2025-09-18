# Portfolio Implementation Guide

## Getting Started

### 1. Project Initialization

```bash
# Create Next.js project
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app

# Navigate to project
cd portfolio

# Install additional dependencies
npm install firebase framer-motion react-hook-form react-icons
npm install @hookform/resolvers yup
npm install react-pdf
npm install sharp

# Three.js dependencies
npm install three @react-three/fiber @react-three/drei
npm install @types/three
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Set up Storage

#### Firebase Configuration

```typescript
// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 3. Tailwind Configuration for Glass Morphism

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.2)",
          dark: "rgba(0, 0, 0, 0.1)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
```

## Core Components

### 1. Three.js Configuration

```tsx
// src/components/three/Scene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

interface SceneProps {
  children: React.ReactNode;
  className?: string;
}

export function Scene({ children, className }: SceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Responsive pixel ratio for performance
        performance={{ min: 0.5 }} // Auto-adjust quality
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
```

### 2. Glass Card Component

```tsx
// src/components/ui/GlassCard.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-white/10 border border-white/20 rounded-xl",
        "shadow-lg shadow-black/5",
        hover &&
          "hover:bg-white/20 hover:border-white/30 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
```

### 2. Layout Component

```tsx
// src/components/layout/Layout.tsx
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
```

### 3. Authentication Hook

```tsx
// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
```

### 4. Database Utilities

```typescript
// src/lib/db.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export class DatabaseService {
  // Projects
  static async getProjects() {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async addProject(projectData: any) {
    return await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async updateProject(id: string, projectData: any) {
    const docRef = doc(db, "projects", id);
    return await updateDoc(docRef, {
      ...projectData,
      updatedAt: new Date(),
    });
  }

  static async deleteProject(id: string) {
    const docRef = doc(db, "projects", id);
    return await deleteDoc(docRef);
  }

  // Experience
  static async getExperience() {
    const q = query(collection(db, "experience"), orderBy("startDate", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async addExperience(experienceData: any) {
    return await addDoc(collection(db, "experience"), {
      ...experienceData,
      createdAt: new Date(),
    });
  }

  // Messages
  static async getMessages() {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async addMessage(messageData: any) {
    return await addDoc(collection(db, "messages"), {
      ...messageData,
      read: false,
      createdAt: new Date(),
    });
  }

  static async markMessageAsRead(id: string) {
    const docRef = doc(db, "messages", id);
    return await updateDoc(docRef, { read: true });
  }
}
```

## API Routes Examples

### 1. Projects API

```typescript
// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db";

export async function GET() {
  try {
    const projects = await DatabaseService.getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const docRef = await DatabaseService.addProject(body);
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
```

### 2. Contact Form API

```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Add to database
    await DatabaseService.addMessage(body);

    // Here you could also send an email notification

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

## Three.js Specific Components

### 1. Interactive Project Cards

```tsx
// src/components/three/ProjectCard3D.tsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface ProjectCard3DProps {
  title: string;
  position: [number, number, number];
  image?: string;
}

export function ProjectCard3D({ title, position, image }: ProjectCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(state => {
    if (meshRef.current) {
      // Gentle rotation animation
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[2, 1.2, 0.1]}
        radius={0.05}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={hovered ? "#3b82f6" : "#ffffff"}
          transparent
          opacity={0.9}
          metalness={0.1}
          roughness={0.1}
        />
      </RoundedBox>

      <Text
        position={[0, 0, 0.06]}
        fontSize={0.2}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {title}
      </Text>
    </group>
  );
}
```

### 2. Skills Visualization

```tsx
// src/components/three/SkillsVisualization.tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface Skill {
  name: string;
  level: number; // 1-5
  category: string;
}

interface SkillsVisualizationProps {
  skills: Skill[];
}

export function SkillsVisualization({ skills }: SkillsVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null);

  const skillPositions = useMemo(() => {
    return skills.map((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = 2 + skill.level * 0.5;
      return {
        ...skill,
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius,
        ] as [number, number, number],
      };
    });
  }, [skills]);

  useFrame(state => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: "#3b82f6",
      backend: "#10b981",
      database: "#f59e0b",
      tools: "#8b5cf6",
      default: "#6b7280",
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  return (
    <group ref={groupRef}>
      {skillPositions.map((skill, index) => (
        <group key={skill.name} position={skill.position}>
          <Sphere args={[skill.level * 0.1 + 0.05]}>
            <meshStandardMaterial
              color={getCategoryColor(skill.category)}
              transparent
              opacity={0.8}
              metalness={0.3}
              roughness={0.4}
            />
          </Sphere>
          <Text
            position={[0, skill.level * 0.1 + 0.2, 0]}
            fontSize={0.1}
            color="#374151"
            anchorX="center"
            anchorY="middle"
          >
            {skill.name}
          </Text>
        </group>
      ))}
    </group>
  );
}
```

### 3. Performance Hook for Three.js

```tsx
// src/hooks/useThreePerformance.ts
import { useEffect, useState } from "react";

export function useThreePerformance() {
  const [shouldRender3D, setShouldRender3D] = useState(true);

  useEffect(() => {
    // Check device capabilities
    const isLowPowerDevice = () => {
      // Check for mobile devices
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      const isLowMemory = deviceMemory && deviceMemory < 4;

      return isMobile || prefersReducedMotion || isLowMemory;
    };

    setShouldRender3D(!isLowPowerDevice());
  }, []);

  return shouldRender3D;
}
```

## Key Pages Structure

### 1. Enhanced Home Page with Three.js

```tsx
// src/app/page.tsx
import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

// Dynamically import 3D components to avoid SSR issues
const ProjectsSection3D = dynamic(
  () => import("@/components/sections/ProjectsSection3D"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading Projects...
      </div>
    ),
  }
);

const ExperienceSection = dynamic(
  () => import("@/components/sections/ExperienceSection"),
  {
    ssr: false,
  }
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection3D />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
```

### 2. Admin Dashboard

```tsx
// src/app/admin/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminStats from "@/components/admin/AdminStats";
import RecentMessages from "@/components/admin/RecentMessages";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminStats />
        <RecentMessages />
      </div>
    </div>
  );
}
```

## Development Workflow

### 1. Start with Static Content

Begin by creating the portfolio with static content to establish the design and layout.

### 2. Add Basic Three.js

Implement simple 3D backgrounds and effects before moving to complex interactions.

### 3. Implement Database Integration

Add Firebase and create the admin interface for managing content.

### 4. Enhance with Advanced 3D

Add interactive 3D elements like project cards and skills visualization.

### 5. Optimize and Deploy

Focus on performance, SEO, and deployment to Vercel.

## Three.js Performance Best Practices

### 1. Conditional Rendering

```tsx
// Only render 3D on capable devices
const shouldRender3D = useThreePerformance();

return (
  <div>{shouldRender3D ? <ThreeJSComponent /> : <FallbackComponent />}</div>
);
```

### 2. Level of Detail (LOD)

```tsx
// Use different complexity based on distance
import { Lod } from "@react-three/drei";

<Lod distances={[0, 10, 20]}>
  <HighDetailMesh />
  <MediumDetailMesh />
  <LowDetailMesh />
</Lod>;
```

### 3. Instance Optimization

```tsx
// For repeated objects, use instancing
import { Instances, Instance } from "@react-three/drei";

<Instances limit={1000} range={1000}>
  <boxGeometry />
  <meshStandardMaterial />
  {positions.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>;
```

## Testing Strategy

### 1. Component Testing

```typescript
// Example test with Jest and React Testing Library
import { render, screen } from '@testing-library/react';
import { GlassCard } from '@/components/ui/GlassCard';

describe('GlassCard', () => {
  it('renders children correctly', () => {
    render(<GlassCard>Test Content</GlassCard>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
```

### 2. API Testing

Test your API routes with tools like Postman or write integration tests.

### 3. E2E Testing

Consider using Playwright for end-to-end testing of critical user flows.

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings if needed
4. **Important**: Set Node.js version to 18+ for Three.js compatibility
5. Deploy automatically on push to main branch

### Environment Variables in Vercel

Add all your Firebase configuration variables in the Vercel dashboard under Settings > Environment Variables.

**Note**: Three.js applications may have larger bundle sizes, so monitor your Vercel usage.

## Performance Monitoring

### 1. Analytics

- Google Analytics for visitor tracking
- Vercel Analytics for performance metrics

### 2. Error Monitoring

- Sentry for error tracking
- Console monitoring for Firebase issues

### 3. Performance Optimization

- Lighthouse audits
- Core Web Vitals monitoring
- Image optimization verification

This guide provides a solid foundation for building your portfolio. Start with the basic structure and gradually add features. Focus on getting the MVP working first, then enhance with additional features.
