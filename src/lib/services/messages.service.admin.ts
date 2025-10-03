/**
 * Messages Database Service (Admin SDK)
 *
 * Provides typed database operations for contact message management using Firebase Admin SDK.
 * Use this ONLY in API routes and server-side code.
 */

import type { Message } from '@/types'
import {
  COLLECTIONS,
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/db-admin'

/**
 * Get all messages
 */
export const getMessages = async (): Promise<Message[]> => {
  const messages = await getCollection<Message>(COLLECTIONS.MESSAGES)
  // Sort by creation date, newest first
  return messages.sort((a, b) => {
    const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
    const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
    return bDate.getTime() - aDate.getTime()
  })
}

/**
 * Get a single message by ID
 */
export const getMessage = async (id: string): Promise<Message | null> => {
  const message = await getDocument<Message>(COLLECTIONS.MESSAGES, id)
  return message
}

/**
 * Get unread messages only
 */
export const getUnreadMessages = async (): Promise<Message[]> => {
  const messages = await getMessages()
  return messages.filter(msg => !msg.read)
}

/**
 * Get unreplied messages
 */
export const getUnrepliedMessages = async (): Promise<Message[]> => {
  const messages = await getMessages()
  return messages.filter(msg => !msg.replied)
}

/**
 * Add a new message (contact form submission)
 */
export const addMessage = async (data: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<string> => {
  const messageData = {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    read: false,
    replied: false,
  }

  const id = await addDocument(COLLECTIONS.MESSAGES, messageData)
  return id
}

/**
 * Mark a message as read
 */
export const markMessageAsRead = async (id: string): Promise<void> => {
  await updateDocument<Message>(COLLECTIONS.MESSAGES, id, {
    read: true,
    readAt: new Date(),
  })
}

/**
 * Mark a message as replied
 */
export const markMessageAsReplied = async (id: string): Promise<void> => {
  await updateDocument<Message>(COLLECTIONS.MESSAGES, id, {
    replied: true,
    repliedAt: new Date(),
  })
}

/**
 * Update a message
 */
export const updateMessage = async (
  id: string,
  data: Partial<Message>
): Promise<void> => {
  await updateDocument<Message>(COLLECTIONS.MESSAGES, id, data)
}

/**
 * Delete a message
 */
export const deleteMessage = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.MESSAGES, id)
}

/**
 * Get unread message count
 */
export const getUnreadCount = async (): Promise<number> => {
  const unreadMessages = await getUnreadMessages()
  return unreadMessages.length
}
