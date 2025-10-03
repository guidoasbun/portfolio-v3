/**
 * Skills Database Service (Admin SDK)
 *
 * Provides typed database operations for skills management using Firebase Admin SDK.
 * Use this ONLY in API routes and server-side code.
 */

import type { Skill, SkillFormData, SkillCategory } from '@/types'
import {
  COLLECTIONS,
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
} from '@/lib/firebase/db-admin'

/**
 * Get all skills
 */
export const getSkills = async (): Promise<Skill[]> => {
  const skills = await getCollection<Skill>(COLLECTIONS.SKILLS)
  // Sort by name alphabetically
  return skills.sort((a, b) => a.name.localeCompare(b.name))
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
  const skills = await getSkills()
  return skills.filter(skill => skill.featured)
}

/**
 * Get skills by category
 */
export const getSkillsByCategory = async (category: SkillCategory): Promise<Skill[]> => {
  const skills = await getSkills()
  return skills.filter(skill => skill.category === category)
}

/**
 * Add a new skill
 */
export const addSkill = async (data: SkillFormData): Promise<string> => {
  const skillData = {
    name: data.name,
    category: data.category,
    proficiency: data.proficiency || undefined,
    icon: data.icon || undefined,
    color: data.color || undefined,
    featured: data.featured || false,
  }

  const id = await addDocument(COLLECTIONS.SKILLS, skillData)
  return id
}

/**
 * Update an existing skill
 */
export const updateSkill = async (
  id: string,
  data: Partial<SkillFormData>
): Promise<void> => {
  await updateDocument<Skill>(COLLECTIONS.SKILLS, id, data)
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
