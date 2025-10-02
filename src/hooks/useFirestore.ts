/**
 * useFirestore Hook
 *
 * Custom React hook for real-time Firestore data fetching.
 * Provides loading states, error handling, and automatic cleanup.
 *
 * Usage:
 * ```tsx
 * const { data, loading, error, refetch } = useFirestore<Project>('projects')
 * ```
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DocumentData, QueryConstraint } from 'firebase/firestore'
import { onSnapshot, query } from 'firebase/firestore'
import type { CollectionName } from '@/lib/firebase/db'
import {
  getCollectionRef,
  getDocumentRef,
  timestampToDate,
} from '@/lib/firebase/db'

/**
 * Hook state interface
 */
interface UseFirestoreState<T> {
  data: T[] | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook for fetching a collection with real-time updates
 */
export const useFirestore = <T extends DocumentData>(
  collectionName: CollectionName,
  constraints: QueryConstraint[] = []
): UseFirestoreState<T & { id: string }> => {
  const [data, setData] = useState<(T & { id: string })[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      const collectionRef = getCollectionRef<T>(collectionName)
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map((doc) => {
            const docData = doc.data()
            const convertedData: DocumentData = {}

            // Convert Timestamp fields to Date objects
            Object.keys(docData).forEach((key) => {
              const value = docData[key]
              convertedData[key] = timestampToDate(value) ?? value
            })

            return {
              id: doc.id,
              ...convertedData,
            } as T & { id: string }
          })

          setData(documents)
          setLoading(false)
        },
        (err) => {
          console.error(`Error fetching ${collectionName}:`, err)
          setError(new Error(`Failed to fetch ${collectionName}`))
          setLoading(false)
        }
      )

      // Cleanup listener on unmount
      return () => unsubscribe()
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err)
      setError(new Error(`Failed to set up listener for ${collectionName}`))
      setLoading(false)
    }
  }, [collectionName, constraints, refetchTrigger])

  return { data, loading, error, refetch }
}

/**
 * Hook state interface for single document
 */
interface UseFirestoreDocState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook for fetching a single document with real-time updates
 */
export const useFirestoreDoc = <T extends DocumentData>(
  collectionName: CollectionName,
  docId: string | null
): UseFirestoreDocState<T & { id: string }> => {
  const [data, setData] = useState<(T & { id: string }) | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!docId) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const docRef = getDocumentRef<T>(collectionName, docId)

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const docData = snapshot.data()
            const convertedData: DocumentData = {}

            // Convert Timestamp fields to Date objects
            Object.keys(docData).forEach((key) => {
              const value = docData[key]
              convertedData[key] = timestampToDate(value) ?? value
            })

            setData({
              id: snapshot.id,
              ...convertedData,
            } as T & { id: string })
          } else {
            setData(null)
          }
          setLoading(false)
        },
        (err) => {
          console.error(`Error fetching document ${docId} from ${collectionName}:`, err)
          setError(new Error(`Failed to fetch document from ${collectionName}`))
          setLoading(false)
        }
      )

      // Cleanup listener on unmount
      return () => unsubscribe()
    } catch (err) {
      console.error(`Error setting up listener for document ${docId}:`, err)
      setError(new Error(`Failed to set up listener for document`))
      setLoading(false)
    }
  }, [collectionName, docId, refetchTrigger])

  return { data, loading, error, refetch }
}
