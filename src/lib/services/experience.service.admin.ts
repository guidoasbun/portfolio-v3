/**
 * Experience Database Service (Admin SDK)
 *
 * Provides typed database operations for experience management using Firebase Admin SDK.
 * Use this ONLY in API routes and server-side code.
 */

import type { Experience, ExperienceFormData, ExperienceType } from '@/types'
import {
  COLLECTIONS,
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/db-admin'

/**
 * Get all experiences
 */
export const getExperiences = async (): Promise<Experience[]> => {
  const experiences = await getCollection<Experience>(COLLECTIONS.EXPERIENCE)
  // Sort by current first, then by start date descending
  return experiences.sort((a, b) => {
    if (a.current && !b.current) return -1
    if (!a.current && b.current) return 1
    const aDate = a.startDate instanceof Date ? a.startDate : new Date(a.startDate)
    const bDate = b.startDate instanceof Date ? b.startDate : new Date(b.startDate)
    return bDate.getTime() - aDate.getTime()
  })
}

/**
 * Get a single experience by ID
 */
export const getExperience = async (id: string): Promise<Experience | null> => {
  const experience = await getDocument<Experience>(COLLECTIONS.EXPERIENCE, id)
  return experience
}

/**
 * Get current/ongoing experiences
 */
export const getCurrentExperiences = async (): Promise<Experience[]> => {
  const experiences = await getExperiences()
  return experiences.filter(exp => exp.current)
}

/**
 * Get experiences by type
 */
export const getExperiencesByType = async (type: ExperienceType): Promise<Experience[]> => {
  const experiences = await getExperiences()
  return experiences.filter(exp => exp.type === type)
}

/**
 * Add a new experience
 */
export const addExperience = async (data: ExperienceFormData): Promise<string> => {
  const experienceData = {
    type: data.type,
    title: data.title,
    company: data.company,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate, // Will be filtered out if undefined
    current: data.current,
    description: data.description,
    technologies: data.technologies,
  }

  const id = await addDocument(COLLECTIONS.EXPERIENCE, experienceData)
  return id
}

/**
 * Update an existing experience
 */
export const updateExperience = async (
  id: string,
  data: Partial<ExperienceFormData>
): Promise<void> => {
  await updateDocument<Experience>(COLLECTIONS.EXPERIENCE, id, data)
}

/**
 * Delete an experience
 */
export const deleteExperience = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.EXPERIENCE, id)
}

/**
 * Get work experiences only
 */
export const getWorkExperiences = async (): Promise<Experience[]> => {
  return getExperiencesByType('work')
}

/**
 * Get internships only
 */
export const getInternships = async (): Promise<Experience[]> => {
  return getExperiencesByType('internship')
}

/**
 * Get education only
 */
export const getEducation = async (): Promise<Experience[]> => {
  return getExperiencesByType('education')
}
