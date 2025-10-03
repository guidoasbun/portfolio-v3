/**
 * Resume Database Service (Admin SDK)
 *
 * Provides typed database operations for resume management using Firebase Admin SDK.
 * Use this ONLY in API routes and server-side code.
 */

import type { Resume } from '@/types'
import {
  COLLECTIONS,
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/db-admin'

/**
 * Get all resumes
 */
export const getResumes = async (): Promise<Resume[]> => {
  const resumes = await getCollection<Resume>(COLLECTIONS.RESUME)
  // Sort by creation date, newest first
  return resumes.sort((a, b) => {
    const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
    const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
    return bDate.getTime() - aDate.getTime()
  })
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
  const resumes = await getResumes()
  const activeResume = resumes.find(resume => resume.active)
  return activeResume || null
}

/**
 * Deactivate all resumes
 */
const deactivateAllResumes = async (): Promise<void> => {
  const resumes = await getResumes()
  const updatePromises = resumes.map(resume =>
    updateDocument<Resume>(COLLECTIONS.RESUME, resume.id, { active: false })
  )
  await Promise.all(updatePromises)
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
  const resumeData = {
    filename: data.filename,
    originalName: data.originalName,
    fileUrl: data.fileUrl,
    version: data.version,
    active: data.active,
    downloadCount: 0,
  }

  // If this resume is being set as active, deactivate all others first
  if (data.active) {
    await deactivateAllResumes()
  }

  const id = await addDocument(COLLECTIONS.RESUME, resumeData)
  return id
}

/**
 * Update an existing resume
 */
export const updateResume = async (
  id: string,
  data: Partial<Resume>
): Promise<void> => {
  // If setting this resume as active, deactivate all others first
  if (data.active === true) {
    await deactivateAllResumes()
  }

  await updateDocument<Resume>(COLLECTIONS.RESUME, id, data)
}

/**
 * Delete a resume
 */
export const deleteResume = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.RESUME, id)
}

/**
 * Set a resume as active
 */
export const setActiveResume = async (id: string): Promise<void> => {
  // First, deactivate all resumes
  await deactivateAllResumes()

  // Then activate the specified resume
  await updateDocument<Resume>(COLLECTIONS.RESUME, id, { active: true })
}

/**
 * Increment download count for a resume
 */
export const incrementDownloadCount = async (id: string): Promise<void> => {
  const resume = await getResume(id)
  if (!resume) {
    throw new Error('Resume not found')
  }

  await updateDocument<Resume>(COLLECTIONS.RESUME, id, {
    downloadCount: resume.downloadCount + 1,
  })
}
