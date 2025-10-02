/**
 * Experience Database Service
 *
 * Provides typed database operations for experience management.
 * All methods use Firebase Firestore through the db utility layer.
 */

import type { Experience, ExperienceFormData, ExperienceType } from '@/types'
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
 * Get all experiences with optional filtering
 */
export const getExperiences = async (type?: ExperienceType | 'all'): Promise<Experience[]> => {
  const constraints = []

  if (type && type !== 'all') {
    constraints.push(queryHelpers.where('type', '==', type))
  }

  // Order by current first, then by start date descending
  constraints.push(queryHelpers.orderBy('startDate', 'desc'))

  const experiences = await getCollection<Experience>(COLLECTIONS.EXPERIENCE, constraints)

  // Sort to put current experiences first
  return experiences.sort((a, b) => {
    if (a.current && !b.current) return -1
    if (!a.current && b.current) return 1
    return b.startDate.getTime() - a.startDate.getTime()
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
  const constraints = [
    queryHelpers.where('current', '==', true),
    queryHelpers.orderBy('startDate', 'desc'),
  ]

  const experiences = await getCollection<Experience>(COLLECTIONS.EXPERIENCE, constraints)
  return experiences
}

/**
 * Get experiences by type
 */
export const getExperiencesByType = async (type: ExperienceType): Promise<Experience[]> => {
  return getExperiences(type)
}

/**
 * Add a new experience
 */
export const addExperience = async (data: ExperienceFormData): Promise<string> => {
  const experienceData: Omit<Experience, 'id'> = {
    type: data.type,
    title: data.title,
    company: data.company,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate,
    current: data.current,
    description: data.description,
    technologies: data.technologies,
    createdAt: new Date(),
  }

  const id = await addDocument<Omit<Experience, 'id'>>(
    COLLECTIONS.EXPERIENCE,
    experienceData
  )
  return id
}

/**
 * Update an existing experience
 */
export const updateExperience = async (
  id: string,
  data: Partial<ExperienceFormData>
): Promise<void> => {
  const updateData: Partial<Experience> = {
    ...data,
  }

  await updateDocument<Experience>(COLLECTIONS.EXPERIENCE, id, updateData)
}

/**
 * Delete an experience
 */
export const deleteExperience = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.EXPERIENCE, id)
}
