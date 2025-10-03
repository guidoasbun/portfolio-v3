/**
 * Projects Database Service (Admin SDK)
 *
 * Provides typed database operations for project management using Firebase Admin SDK.
 * Use this ONLY in API routes and server-side code.
 */

import type { Project, ProjectFormData } from '@/types'
import {
  COLLECTIONS,
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/db-admin'

/**
 * Get all projects
 */
export const getProjects = async (): Promise<Project[]> => {
  const projects = await getCollection<Project>(COLLECTIONS.PROJECTS)
  // Sort by creation date, newest first
  return projects.sort((a, b) => {
    const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
    const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
    return bDate.getTime() - aDate.getTime()
  })
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
  const projects = await getProjects()
  return projects.filter(project => project.featured)
}

/**
 * Get projects by category
 */
export const getProjectsByCategory = async (category: string): Promise<Project[]> => {
  if (category === 'all') {
    return getProjects()
  }
  const projects = await getProjects()
  return projects.filter(project => project.category === category)
}

/**
 * Add a new project
 */
export const addProject = async (data: ProjectFormData): Promise<string> => {
  const projectData = {
    title: data.title,
    description: data.description,
    longDescription: data.longDescription,
    technologies: data.technologies,
    category: data.category,
    images: data.images,
    liveUrl: data.liveUrl, // Will be filtered out if undefined
    githubUrl: data.githubUrl, // Will be filtered out if undefined
    featured: data.featured,
  }

  const id = await addDocument(COLLECTIONS.PROJECTS, projectData)
  return id
}

/**
 * Update an existing project
 */
export const updateProject = async (
  id: string,
  data: Partial<ProjectFormData>
): Promise<void> => {
  await updateDocument<Project>(COLLECTIONS.PROJECTS, id, data)
}

/**
 * Delete a project
 */
export const deleteProject = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.PROJECTS, id)
}

/**
 * Search projects by title or description
 */
export const searchProjects = async (searchTerm: string): Promise<Project[]> => {
  const projects = await getProjects()
  const lowerSearch = searchTerm.toLowerCase()

  return projects.filter(project =>
    project.title.toLowerCase().includes(lowerSearch) ||
    project.description.toLowerCase().includes(lowerSearch) ||
    project.technologies.some(tech => tech.toLowerCase().includes(lowerSearch))
  )
}
