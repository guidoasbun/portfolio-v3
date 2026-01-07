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
  batchUpdateDocuments,
} from '@/lib/firebase/db-admin'

/**
 * Get all projects sorted by order field (ascending), then by creation date (newest first)
 *
 * @returns Promise resolving to array of all projects
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const projects = await getProjects()
 * console.log(projects.length) // e.g., 10
 */
export const getProjects = async (): Promise<Project[]> => {
  const projects = await getCollection<Project>(COLLECTIONS.PROJECTS)
  // Sort by order field (ascending), then by creation date (newest first) as fallback
  return projects.sort((a, b) => {
    // If both have order field, sort by order
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    }
    // If only one has order, prioritize the one with order
    if (typeof a.order === 'number') return -1
    if (typeof b.order === 'number') return 1
    // Fallback to creation date (newest first)
    const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
    const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
    return bDate.getTime() - aDate.getTime()
  })
}

/**
 * Get a single project by ID
 *
 * @param id - The project ID to retrieve
 * @returns Promise resolving to project object or null if not found
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const project = await getProject('abc123')
 * if (project) {
 *   console.log(project.title)
 * }
 */
export const getProject = async (id: string): Promise<Project | null> => {
  const project = await getDocument<Project>(COLLECTIONS.PROJECTS, id)
  return project
}

/**
 * Get featured projects only (where featured flag is true)
 *
 * @returns Promise resolving to array of featured projects
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const featured = await getFeaturedProjects()
 * // Returns only projects with featured: true
 */
export const getFeaturedProjects = async (): Promise<Project[]> => {
  const projects = await getProjects()
  return projects.filter(project => project.featured)
}

/**
 * Get projects filtered by category
 *
 * @param category - The category to filter by ('web', 'mobile', 'desktop', 'ai', 'other', or 'all')
 * @returns Promise resolving to array of projects in the specified category
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const webProjects = await getProjectsByCategory('web')
 * const allProjects = await getProjectsByCategory('all')
 */
export const getProjectsByCategory = async (category: string): Promise<Project[]> => {
  if (category === 'all') {
    return getProjects()
  }
  const projects = await getProjects()
  return projects.filter(project => project.category === category)
}

/**
 * Add a new project to the database
 *
 * @param data - Project data matching ProjectFormData interface
 * @returns Promise resolving to the new project ID
 * @throws {ValidationError} If data validation fails
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const projectId = await addProject({
 *   title: "Portfolio Website",
 *   description: "Modern portfolio...",
 *   longDescription: "Full description...",
 *   technologies: ["Next.js", "TypeScript"],
 *   category: "web",
 *   images: ["https://..."],
 *   featured: true
 * })
 */
export const addProject = async (data: ProjectFormData): Promise<string> => {
  // Get current max order to place new project at the end
  const existingProjects = await getProjects()
  const maxOrder = existingProjects.reduce((max, p) => {
    return typeof p.order === 'number' ? Math.max(max, p.order) : max
  }, -1)

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
    order: maxOrder + 1, // Place new project at the end
  }

  const id = await addDocument(COLLECTIONS.PROJECTS, projectData)
  return id
}

/**
 * Update an existing project (partial updates supported)
 *
 * @param id - The project ID to update
 * @param data - Partial project data to update
 * @returns Promise resolving when update completes
 * @throws {NotFoundError} If project with given ID doesn't exist
 * @throws {ValidationError} If data validation fails
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * await updateProject('abc123', {
 *   title: "Updated Title",
 *   featured: true
 * })
 */
export const updateProject = async (
  id: string,
  data: Partial<ProjectFormData>
): Promise<void> => {
  await updateDocument<Project>(COLLECTIONS.PROJECTS, id, data)
}

/**
 * Delete a project from the database
 *
 * @param id - The project ID to delete
 * @returns Promise resolving when deletion completes
 * @throws {NotFoundError} If project with given ID doesn't exist
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * await deleteProject('abc123')
 */
export const deleteProject = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.PROJECTS, id)
}

/**
 * Search projects by title, description, or technologies (case-insensitive)
 *
 * @param searchTerm - The search query string
 * @returns Promise resolving to array of matching projects
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const results = await searchProjects('react')
 * // Returns projects with "react" in title, description, or technologies
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

/**
 * Reorder projects by updating their order field
 *
 * @param projectIds - Array of project IDs in the desired order
 * @returns Promise resolving when reorder completes
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * await reorderProjects(['id1', 'id2', 'id3'])
 * // id1 will have order: 0, id2 will have order: 1, etc.
 */
export const reorderProjects = async (projectIds: string[]): Promise<void> => {
  const updates = projectIds.map((id, index) => ({
    id,
    data: { order: index },
  }))

  await batchUpdateDocuments<Project>(COLLECTIONS.PROJECTS, updates)
}
