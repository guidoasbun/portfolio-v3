/**
 * Skills Database Service
 *
 * Provides typed database operations for skills management.
 * All methods use Firebase Firestore through the db utility layer.
 */

import type { Skill, SkillFormData, SkillCategory } from '@/types'
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
 * Get all skills with optional filtering
 */
export const getSkills = async (
  category?: SkillCategory,
  featured?: boolean
): Promise<Skill[]> => {
  const constraints = []

  if (category && category !== 'other') {
    constraints.push(queryHelpers.where('category', '==', category))
  }

  if (featured !== undefined) {
    constraints.push(queryHelpers.where('featured', '==', featured))
  }

  // Order by name alphabetically
  constraints.push(queryHelpers.orderBy('name', 'asc'))

  const skills = await getCollection<Skill>(COLLECTIONS.SKILLS, constraints)
  return skills
}

/**
 * Get a single skill by ID
 */
export const getSkill = async (id: string): Promise<Skill | null> => {
  const skill = await getDocument<Skill>(COLLECTIONS.SKILLS, id)
  return skill
}

/**
 * Get featured skills only
 */
export const getFeaturedSkills = async (): Promise<Skill[]> => {
  return getSkills(undefined, true)
}

/**
 * Get skills by category
 */
export const getSkillsByCategory = async (category: SkillCategory): Promise<Skill[]> => {
  return getSkills(category)
}

/**
 * Add a new skill
 */
export const addSkill = async (data: SkillFormData): Promise<string> => {
  const skillData: Omit<Skill, 'id'> = {
    name: data.name,
    category: data.category,
    proficiency: data.proficiency,
    icon: data.icon,
    color: data.color,
    featured: data.featured,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const id = await addDocument<Omit<Skill, 'id'>>(COLLECTIONS.SKILLS, skillData)
  return id
}

/**
 * Update an existing skill
 */
export const updateSkill = async (
  id: string,
  data: Partial<SkillFormData>
): Promise<void> => {
  const updateData: Partial<Skill> = {
    ...data,
    updatedAt: new Date(),
  }

  await updateDocument<Skill>(COLLECTIONS.SKILLS, id, updateData)
}

/**
 * Delete a skill
 */
export const deleteSkill = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.SKILLS, id)
}

/**
 * Get all unique categories from skills
 */
export const getSkillCategories = async (): Promise<string[]> => {
  const skills = await getSkills()
  const categories = new Set(skills.map((s) => s.category))
  return Array.from(categories).sort()
}
