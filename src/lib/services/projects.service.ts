/**
 * Projects Database Service
 *
 * Provides typed database operations for project management.
 * All methods use Firebase Firestore through the db utility layer.
 */

import type { Project, ProjectFormData } from '@/types'
import {
  COLLECTIONS,
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  queryHelpers,
} from '@/lib/firebase/db'

/**
 * Get all projects with optional filtering
 */
export const getProjects = async (
  category?: string,
  featured?: boolean
): Promise<Project[]> => {
  const constraints = []

  if (category && category !== 'all') {
    constraints.push(queryHelpers.where('category', '==', category))
  }

  if (featured !== undefined) {
    constraints.push(queryHelpers.where('featured', '==', featured))
  }

  // Order by creation date, newest first
  constraints.push(queryHelpers.orderBy('createdAt', 'desc'))

  const projects = await getCollection<Project>(COLLECTIONS.PROJECTS, constraints)
  return projects
}

/**
 * Get a single project by ID
 */
export const getProject = async (id: string): Promise<Project | null> => {
  const project = await getDocument<Project>(COLLECTIONS.PROJECTS, id)
  return project
}

/**
 * Get featured projects only
 */
export const getFeaturedProjects = async (): Promise<Project[]> => {
  return getProjects(undefined, true)
}

/**
 * Get projects by category
 */
export const getProjectsByCategory = async (category: string): Promise<Project[]> => {
  if (category === 'all') {
    return getProjects()
  }
  return getProjects(category)
}

/**
 * Add a new project
 */
export const addProject = async (data: ProjectFormData): Promise<string> => {
  // Get current max order to place new project at the end
  const existingProjects = await getProjects()
  const maxOrder = existingProjects.reduce((max, p) => {
    return typeof p.order === 'number' ? Math.max(max, p.order) : max
  }, -1)

  const projectData: Omit<Project, 'id'> = {
    title: data.title,
    description: data.description,
    longDescription: data.longDescription,
    technologies: data.technologies,
    category: data.category,
    images: data.images,
    liveUrl: data.liveUrl,
    githubUrl: data.githubUrl,
    featured: data.featured,
    order: maxOrder + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const id = await addDocument<Omit<Project, 'id'>>(COLLECTIONS.PROJECTS, projectData)
  return id
}

/**
 * Update an existing project
 */
export const updateProject = async (
  id: string,
  data: Partial<ProjectFormData>
): Promise<void> => {
  const updateData: Partial<Project> = {
    ...data,
    updatedAt: new Date(),
  }

  await updateDocument<Project>(COLLECTIONS.PROJECTS, id, updateData)
}

/**
 * Delete a project
 */
export const deleteProject = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.PROJECTS, id)
}

/**
 * Get all unique categories from projects
 */
export const getProjectCategories = async (): Promise<string[]> => {
  const projects = await getProjects()
  const categories = new Set(projects.map((p) => p.category))
  return Array.from(categories).sort()
}
