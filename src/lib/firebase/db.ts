/**
 * Firebase Firestore Database Service
 *
 * This file provides type-safe database operations for Firestore.
 * Includes CRUD operations with TypeScript generics for type safety.
 */

import type {
  QueryConstraint,
  DocumentData,
  CollectionReference,
  DocumentReference,
  QueryDocumentSnapshot,
  WithFieldValue,
  UpdateData,
} from 'firebase/firestore'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'

/**
 * Collection names as constants for type safety
 */
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
 * Convert JavaScript Date to Firestore Timestamp
 */
export const dateToTimestamp = (date: Date | undefined): Timestamp | undefined => {
  if (!date) return undefined
  return Timestamp.fromDate(date)
}

/**
 * Generic type for documents that include Firestore metadata
 */
export interface FirestoreDocument {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Convert Firestore document to typed object
 */
const convertDocument = <T extends DocumentData>(
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): T & { id: string } => {
  const data = docSnapshot.data()

  // Convert all Timestamp fields to Date objects
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
    id: docSnapshot.id,
    ...convertedData,
  } as T & { id: string }
}

/**
 * Get a collection reference with type safety
 */
export const getCollectionRef = <T extends DocumentData>(
  collectionName: CollectionName
): CollectionReference<T> => {
  return collection(db, collectionName) as CollectionReference<T>
}

/**
 * Get a document reference with type safety
 */
export const getDocumentRef = <T extends DocumentData>(
  collectionName: CollectionName,
  docId: string
): DocumentReference<T> => {
  return doc(db, collectionName, docId) as DocumentReference<T>
}

/**
 * Get all documents from a collection
 */
export const getCollection = async <T extends DocumentData>(
  collectionName: CollectionName,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> => {
  try {
    const collectionRef = getCollectionRef<T>(collectionName)
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => convertDocument<T>(doc))
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
    const docRef = getDocumentRef<T>(collectionName, docId)
    const docSnapshot = await getDoc(docRef)

    if (!docSnapshot.exists()) {
      return null
    }

    const data = docSnapshot.data()
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
      id: docSnapshot.id,
      ...convertedData,
    } as T & { id: string }
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionName}:`, error)
    throw new Error(`Failed to fetch document from ${collectionName}`)
  }
}

/**
 * Add a new document to a collection (auto-generated ID)
 */
export const addDocument = async <T extends DocumentData>(
  collectionName: CollectionName,
  data: WithFieldValue<T>
): Promise<string> => {
  try {
    const collectionRef = getCollectionRef<T>(collectionName)

    const docData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collectionRef, docData)
    return docRef.id
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error)
    throw new Error(`Failed to add document to ${collectionName}`)
  }
}

/**
 * Set a document with a specific ID (overwrites if exists)
 */
export const setDocument = async <T extends DocumentData>(
  collectionName: CollectionName,
  docId: string,
  data: WithFieldValue<T>,
  merge = false
): Promise<void> => {
  try {
    const docRef = getDocumentRef<T>(collectionName, docId)

    const docData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await setDoc(docRef, docData, { merge })
  } catch (error) {
    console.error(`Error setting document ${docId} in ${collectionName}:`, error)
    throw new Error(`Failed to set document in ${collectionName}`)
  }
}

/**
 * Update an existing document
 */
export const updateDocument = async <T extends DocumentData>(
  collectionName: CollectionName,
  docId: string,
  data: UpdateData<T>
): Promise<void> => {
  try {
    const docRef = getDocumentRef<T>(collectionName, docId)

    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    }

    await updateDoc(docRef, updateData)
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
    const docRef = getDocumentRef(collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error)
    throw new Error(`Failed to delete document from ${collectionName}`)
  }
}

/**
 * Query helper functions
 */
export const queryHelpers = {
  /**
   * Create a where constraint
   */
  where: (field: string, operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in', value: unknown) =>
    where(field, operator, value),

  /**
   * Create an orderBy constraint
   */
  orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') =>
    orderBy(field, direction),

  /**
   * Create a limit constraint
   */
  limit: (count: number) => limit(count),
}
