export const APP_CONFIG = {
  name: "Portfolio",
  description:
    "A modern portfolio website with glass morphism design and 3D animations",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  author: {
    name: "Guido Asbun",
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 1000,
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

export const STORAGE_KEYS = {
  theme: "portfolio-theme",
  reducedMotion: "portfolio-reduced-motion",
  authToken: "portfolio-auth-token",
} as const;

export const API_ENDPOINTS = {
  projects: "/api/projects",
  experience: "/api/experience",
  skills: "/api/skills",
  messages: "/api/messages",
  resume: "/api/resume",
  auth: "/api/auth",
} as const;

export const CONTACT_INFO = {
  email: "your.email@example.com",
  phone: "+1 (555) 123-4567",
  location: "Your City, Country",
  timezone: "UTC-5",
} as const;

export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/yourusername",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/yourusername",
    icon: "linkedin",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/yourusername",
    icon: "twitter",
  },
  {
    name: "Email",
    url: "mailto:your.email@example.com",
    icon: "mail",
  },
] as const;

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "Design",
  "Tools",
] as const;

export const PROJECT_CATEGORIES = [
  "Web Application",
  "Mobile Application",
  "Desktop Application",
  "API/Backend",
  "Library/Package",
  "Game",
  "Other",
] as const;

export const EXPERIENCE_TYPES = [
  "work",
  "internship",
  "education",
  "freelance",
  "volunteer",
] as const;

export const MESSAGE_STATUS = [
  "unread",
  "read",
  "replied",
  "archived",
] as const;

export const PERFORMANCE_CONFIG = {
  enableThreeJS: true,
  maxParticles: 100,
  minFPS: 30,
  targetFPS: 60,
  enableMotionBlur: false,
  enableShadows: true,
  pixelRatio: Math.min(
    2,
    typeof window !== "undefined" ? window.devicePixelRatio : 1
  ),
} as const;

export const THREE_JS_CONFIG = {
  antialias: true,
  alpha: true,
  powerPreference: "high-performance" as const,
  stencil: false,
  depth: true,
} as const;

export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedDocumentTypes: ["application/pdf"],
  maxImages: 10,
} as const;

export const FORM_VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  minPasswordLength: 8,
  maxTextLength: 1000,
  maxNameLength: 50,
} as const;
