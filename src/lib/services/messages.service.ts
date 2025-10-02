/**
 * Messages Database Service
 *
 * Provides typed database operations for contact message management.
 * All methods use Firebase Firestore through the db utility layer.
 */

import type { Message } from '@/types'
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
 * Get all messages with optional filtering
 */
export const getMessages = async (
  read?: boolean,
  replied?: boolean
): Promise<Message[]> => {
  const constraints = []

  if (read !== undefined) {
    constraints.push(queryHelpers.where('read', '==', read))
  }

  if (replied !== undefined) {
    constraints.push(queryHelpers.where('replied', '==', replied))
  }

  // Order by creation date, newest first
  constraints.push(queryHelpers.orderBy('createdAt', 'desc'))

  const messages = await getCollection<Message>(COLLECTIONS.MESSAGES, constraints)
  return messages
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
  return getMessages(false)
}

/**
 * Get unreplied messages
 */
export const getUnrepliedMessages = async (): Promise<Message[]> => {
  return getMessages(undefined, false)
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
  const messageData: Omit<Message, 'id'> = {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    read: false,
    replied: false,
    createdAt: new Date(),
    readAt: undefined,
    repliedAt: undefined,
  }

  const id = await addDocument<Omit<Message, 'id'>>(COLLECTIONS.MESSAGES, messageData)
  return id
}

/**
 * Mark a message as read
 */
export const markAsRead = async (id: string): Promise<void> => {
  await updateDocument<Message>(COLLECTIONS.MESSAGES, id, {
    read: true,
    readAt: new Date(),
  })
}

/**
 * Mark a message as unread
 */
export const markAsUnread = async (id: string): Promise<void> => {
  await updateDocument<Message>(COLLECTIONS.MESSAGES, id, {
    read: false,
    readAt: undefined,
  })
}

/**
 * Mark a message as replied
 */
export const markAsReplied = async (id: string): Promise<void> => {
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
 * Get message statistics
 */
export const getMessageStats = async (): Promise<{
  total: number
  unread: number
  unreplied: number
}> => {
  const allMessages = await getMessages()
  const unreadMessages = allMessages.filter((m) => !m.read)
  const unrepliedMessages = allMessages.filter((m) => !m.replied)

  return {
    total: allMessages.length,
    unread: unreadMessages.length,
    unreplied: unrepliedMessages.length,
  }
}
