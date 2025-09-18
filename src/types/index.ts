// Project Interface
export interface Project {
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

// Experience Interface
export interface Experience {
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

// Skill Interface
export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 1-5 scale
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message Interface
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: Date;
  readAt?: Date;
  repliedAt?: Date;
}

// Resume Interface
export interface Resume {
  id: string;
  filename: string;
  originalName: string;
  fileUrl: string;
  version: string;
  active: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Additional utility types
export type ProjectCategory = "web" | "mobile" | "desktop" | "ai" | "other";
export type ExperienceType = "work" | "internship" | "education";
export type SkillCategory = "frontend" | "backend" | "database" | "tools" | "design" | "other";

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProjectFormData extends Omit<Project, "id" | "createdAt" | "updatedAt"> {
  id?: string;
}

export interface ExperienceFormData extends Omit<Experience, "id" | "createdAt"> {
  id?: string;
}

export interface SkillFormData extends Omit<Skill, "id" | "createdAt" | "updatedAt"> {
  id?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}