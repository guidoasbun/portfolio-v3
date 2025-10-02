/**
 * Resume Database Service
 *
 * Provides typed database operations for resume management.
 * All methods use Firebase Firestore through the db utility layer.
 */

import type { Resume } from '@/types'
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
 * Get all resumes
 */
export const getResumes = async (): Promise<Resume[]> => {
  const constraints = [queryHelpers.orderBy('createdAt', 'desc')]

  const resumes = await getCollection<Resume>(COLLECTIONS.RESUME, constraints)
  return resumes
}

/**
 * Get a single resume by ID
 */
export const getResume = async (id: string): Promise<Resume | null> => {
  const resume = await getDocument<Resume>(COLLECTIONS.RESUME, id)
  return resume
}

/**
 * Get the active resume
 */
export const getActiveResume = async (): Promise<Resume | null> => {
  const constraints = [
    queryHelpers.where('active', '==', true),
    queryHelpers.limit(1),
  ]

  const resumes = await getCollection<Resume>(COLLECTIONS.RESUME, constraints)
  return resumes.length > 0 ? resumes[0] : null
}

/**
 * Add a new resume
 */
export const addResume = async (data: {
  filename: string
  originalName: string
  fileUrl: string
  version: string
  active: boolean
}): Promise<string> => {
  const resumeData: Omit<Resume, 'id'> = {
    filename: data.filename,
    originalName: data.originalName,
    fileUrl: data.fileUrl,
    version: data.version,
    active: data.active,
    downloadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // If this resume is being set as active, deactivate all others first
  if (data.active) {
    await deactivateAllResumes()
  }

  const id = await addDocument<Omit<Resume, 'id'>>(COLLECTIONS.RESUME, resumeData)
  return id
}

/**
 * Update an existing resume
 */
export const updateResume = async (
  id: string,
  data: Partial<Resume>
): Promise<void> => {
  const updateData: Partial<Resume> = {
    ...data,
    updatedAt: new Date(),
  }

  // If this resume is being set as active, deactivate all others first
  if (data.active === true) {
    await deactivateAllResumes()
  }

  await updateDocument<Resume>(COLLECTIONS.RESUME, id, updateData)
}

/**
 * Delete a resume
 */
export const deleteResume = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.RESUME, id)
}

/**
 * Set a resume as active (and deactivate all others)
 */
export const setActiveResume = async (id: string): Promise<void> => {
  // First, deactivate all resumes
  await deactivateAllResumes()

  // Then activate the specified resume
  await updateDocument<Resume>(COLLECTIONS.RESUME, id, {
    active: true,
    updatedAt: new Date(),
  })
}

/**
 * Deactivate all resumes
 */
export const deactivateAllResumes = async (): Promise<void> => {
  const resumes = await getResumes()

  // Update all active resumes to inactive
  const updatePromises = resumes
    .filter((r) => r.active)
    .map((r) =>
      updateDocument<Resume>(COLLECTIONS.RESUME, r.id, {
        active: false,
        updatedAt: new Date(),
      })
    )

  await Promise.all(updatePromises)
}

/**
 * Increment download count for a resume
 */
export const incrementDownloadCount = async (id: string): Promise<void> => {
  const resume = await getResume(id)

  if (resume) {
    await updateDocument<Resume>(COLLECTIONS.RESUME, id, {
      downloadCount: resume.downloadCount + 1,
      updatedAt: new Date(),
    })
  }
}

/**
 * Get total download count across all resumes
 */
export const getTotalDownloads = async (): Promise<number> => {
  const resumes = await getResumes()
  return resumes.reduce((total, resume) => total + resume.downloadCount, 0)
}
