import * as yup from 'yup'

// Contact Form Validation Schema
export const contactFormSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  subject: yup
    .string()
    .required('Subject is required')
    .min(3, 'Subject must be at least 3 characters')
    .max(100, 'Subject must be less than 100 characters')
    .trim(),
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
})

export type ContactFormValues = yup.InferType<typeof contactFormSchema>

// Project Form Validation Schema
export const projectFormSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  longDescription: yup
    .string()
    .required('Long description is required')
    .min(50, 'Long description must be at least 50 characters')
    .max(5000, 'Long description must be less than 5000 characters')
    .trim(),
  technologies: yup
    .array()
    .of(yup.string().required())
    .min(1, 'At least one technology is required')
    .required('Technologies are required'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(['web', 'mobile', 'desktop', 'ai', 'other'], 'Invalid category'),
  images: yup
    .array()
    .of(yup.string().url('Must be a valid URL').required())
    .min(1, 'At least one image is required')
    .required('Images are required'),
  liveUrl: yup.string().url('Must be a valid URL').notRequired(),
  githubUrl: yup.string().url('Must be a valid URL').notRequired(),
  featured: yup.boolean().required('Featured status is required'),
})

// Manually define the type to handle optional fields properly
export interface ProjectFormValues {
  title: string
  description: string
  longDescription: string
  technologies: string[]
  category: string
  images: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

// Experience Form Validation Schema
export const experienceFormSchema = yup.object({
  type: yup
    .string()
    .required('Type is required')
    .oneOf(['work', 'internship', 'education'], 'Invalid type'),
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  company: yup
    .string()
    .required('Company/Institution is required')
    .min(2, 'Company/Institution must be at least 2 characters')
    .max(100, 'Company/Institution must be less than 100 characters')
    .trim(),
  location: yup
    .string()
    .required('Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .trim(),
  startDate: yup.date().required('Start date is required'),
  endDate: yup
    .date()
    .optional()
    .when('current', {
      is: false,
      then: (schema) => schema.required('End date is required when not current'),
      otherwise: (schema) => schema.optional(),
    }),
  current: yup.boolean().required('Current status is required'),
  description: yup
    .array()
    .of(yup.string().required())
    .min(1, 'At least one description point is required')
    .required('Description is required'),
  technologies: yup.array().of(yup.string().required()).optional(),
})

export type ExperienceFormValues = yup.InferType<typeof experienceFormSchema>

// Skill Form Validation Schema
export const skillFormSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(1, 'Name must be at least 1 character')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(
      ['frontend', 'backend', 'database', 'tools', 'design', 'other'],
      'Invalid category'
    ),
  proficiency: yup
    .number()
    .transform((value, originalValue) => {
      // Handle empty string or NaN
      if (originalValue === '' || originalValue === null || originalValue === undefined || isNaN(value)) {
        return undefined
      }
      return value
    })
    .optional()
    .min(1, 'Proficiency must be at least 1')
    .max(5, 'Proficiency must be at most 5'),
  icon: yup
    .string()
    .transform((value) => (value === '' || value === null) ? undefined : value)
    .optional(),
  color: yup
    .string()
    .transform((value) => (value === '' || value === null) ? undefined : value)
    .optional(),
  featured: yup
    .boolean()
    .transform((value, originalValue) => {
      // Handle checkbox values
      if (originalValue === '' || originalValue === 'false' || originalValue === null || originalValue === undefined) {
        return false
      }
      return Boolean(value)
    })
    .default(false),
})

export type SkillFormValues = yup.InferType<typeof skillFormSchema>

// Message Validation Schema (for contact form submissions)
export const messageSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  subject: yup
    .string()
    .required('Subject is required')
    .min(3, 'Subject must be at least 3 characters')
    .max(100, 'Subject must be less than 100 characters')
    .trim(),
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
})

export type MessageValues = yup.InferType<typeof messageSchema>

// Resume Validation Schema
export const resumeFormSchema = yup.object({
  filename: yup
    .string()
    .required('Filename is required')
    .min(1, 'Filename must not be empty')
    .trim(),
  originalName: yup
    .string()
    .required('Original name is required')
    .min(1, 'Original name must not be empty')
    .trim(),
  fileUrl: yup
    .string()
    .url('Must be a valid URL')
    .required('File URL is required'),
  version: yup
    .string()
    .required('Version is required')
    .min(1, 'Version must not be empty')
    .trim(),
  active: yup.boolean().required('Active status is required'),
})

export type ResumeFormValues = yup.InferType<typeof resumeFormSchema>

// Resume Update Schema (partial - for PATCH/PUT updates)
export const resumeUpdateSchema = yup.object({
  filename: yup.string().min(1, 'Filename must not be empty').trim().optional(),
  originalName: yup.string().min(1, 'Original name must not be empty').trim().optional(),
  fileUrl: yup.string().url('Must be a valid URL').optional(),
  version: yup.string().min(1, 'Version must not be empty').trim().optional(),
  active: yup.boolean().optional(),
})

export type ResumeUpdateValues = yup.InferType<typeof resumeUpdateSchema>
