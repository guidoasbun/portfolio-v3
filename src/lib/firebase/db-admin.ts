/**
 * Firebase Admin Firestore Database Service
 *
 * This file provides type-safe database operations using Firebase Admin SDK.
 * Use this ONLY in API routes and server-side code.
 * The Admin SDK bypasses Firestore security rules.
 */

import type { DocumentData } from 'firebase-admin/firestore'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { adminDb } from './admin'

// Re-export collection names
export const COLLECTIONS = {
  PROJECTS: 'projects',
  EXPERIENCE: 'experience',
  SKILLS: 'skills',
  MESSAGES: 'messages',
  RESUME: 'resume',
} as const

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS]

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export const timestampToDate = (timestamp: Timestamp | Date | undefined): Date | undefined => {
  if (!timestamp) return undefined
  if (timestamp instanceof Date) return timestamp
  if (timestamp instanceof Timestamp) return timestamp.toDate()
  return undefined
}

/**
 * Get all documents from a collection
 */
export const getCollection = async <T extends DocumentData>(
  collectionName: CollectionName
): Promise<(T & { id: string })[]> => {
  try {
    const snapshot = await adminDb.collection(collectionName).get()

    return snapshot.docs.map((doc) => {
      const data = doc.data()

      // Convert Timestamps to Dates
      const convertedData: DocumentData = {}
      Object.keys(data).forEach((key) => {
        const value = data[key]
        if (value instanceof Timestamp) {
          convertedData[key] = value.toDate()
        } else {
          convertedData[key] = value
        }
      })

      return {
        id: doc.id,
        ...convertedData,
      } as T & { id: string }
    })
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw new Error(`Failed to fetch ${collectionName}`)
  }
}

/**
 * Get a single document by ID
 */
export const getDocument = async <T extends DocumentData>(
  collectionName: CollectionName,
  docId: string
): Promise<(T & { id: string }) | null> => {
  try {
    const doc = await adminDb.collection(collectionName).doc(docId).get()

    if (!doc.exists) {
      return null
    }

    const data = doc.data()!
    const convertedData: DocumentData = {}

    Object.keys(data).forEach((key) => {
      const value = data[key]
      if (value instanceof Timestamp) {
        convertedData[key] = value.toDate()
      } else {
        convertedData[key] = value
      }
    })

    return {
      id: doc.id,
      ...convertedData,
    } as T & { id: string }
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionName}:`, error)
    throw new Error(`Failed to fetch document from ${collectionName}`)
  }
}

/**
 * Remove undefined values from an object (Firestore doesn't accept undefined)
 */
const removeUndefined = <T extends DocumentData>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (value !== undefined) {
      cleaned[key as keyof T] = value
    }
  })
  return cleaned
}

/**
 * Add a new document to a collection (auto-generated ID)
 */
export const addDocument = async <T extends DocumentData>(
  collectionName: CollectionName,
  data: T
): Promise<string> => {
  try {
    // Remove undefined values and add timestamps
    const cleanedData = removeUndefined(data)
    const docData = {
      ...cleanedData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    const docRef = await adminDb.collection(collectionName).add(docData)

    return docRef.id
  } catch (error) {
    console.error(`[DB-Admin] Error adding document to ${collectionName}:`, error)
    if (error instanceof Error) {
      console.error(`[DB-Admin] Error message: ${error.message}`)
    }
    throw new Error(`Failed to add document to ${collectionName}`)
  }
}

/**
 * Update an existing document
 */
export const updateDocument = async <T extends DocumentData>(
  collectionName: CollectionName,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    // Remove undefined values and add timestamp
    const cleanedData = removeUndefined(data)
    const updateData = {
      ...cleanedData,
      updatedAt: FieldValue.serverTimestamp(),
    }

    await adminDb.collection(collectionName).doc(docId).update(updateData)
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error)
    throw new Error(`Failed to update document in ${collectionName}`)
  }
}

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: CollectionName,
  docId: string
): Promise<void> => {
  try {
    await adminDb.collection(collectionName).doc(docId).delete()
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error)
    throw new Error(`Failed to delete document from ${collectionName}`)
  }
}

/**
 * Batch update multiple documents (atomic operation)
 */
export const batchUpdateDocuments = async <T extends DocumentData>(
  collectionName: CollectionName,
  updates: { id: string; data: Partial<T> }[]
): Promise<void> => {
  try {
    const batch = adminDb.batch()

    for (const { id, data } of updates) {
      const docRef = adminDb.collection(collectionName).doc(id)
      const cleanedData = removeUndefined(data)
      batch.update(docRef, {
        ...cleanedData,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    await batch.commit()
  } catch (error) {
    console.error(`Error batch updating documents in ${collectionName}:`, error)
    throw new Error(`Failed to batch update documents in ${collectionName}`)
  }
}
