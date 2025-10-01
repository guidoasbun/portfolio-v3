import type { Skill, SkillCategory } from '@/types'

/**
 * Mock skills data for the portfolio
 * In production, this would be fetched from Firebase/database
 */

export const mockSkills: Skill[] = [
  // Frontend Skills
  {
    id: '1',
    name: 'React',
    category: 'frontend',
    icon: 'SiReact',
    color: '#61DAFB',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Next.js',
    category: 'frontend',
    icon: 'SiNextdotjs',
    color: '#000000',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'frontend',
    icon: 'SiTypescript',
    color: '#3178C6',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'JavaScript',
    category: 'frontend',
    icon: 'SiJavascript',
    color: '#F7DF1E',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Tailwind CSS',
    category: 'frontend',
    icon: 'SiTailwindcss',
    color: '#06B6D4',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    name: 'HTML5',
    category: 'frontend',
    icon: 'SiHtml5',
    color: '#E34F26',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '7',
    name: 'CSS3',
    category: 'frontend',
    icon: 'SiCss3',
    color: '#1572B6',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '8',
    name: 'Vue.js',
    category: 'frontend',
    icon: 'SiVuedotjs',
    color: '#4FC08D',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '9',
    name: 'Redux',
    category: 'frontend',
    icon: 'SiRedux',
    color: '#764ABC',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '10',
    name: 'Sass',
    category: 'frontend',
    icon: 'SiSass',
    color: '#CC6699',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Backend Skills
  {
    id: '11',
    name: 'Node.js',
    category: 'backend',
    icon: 'SiNodedotjs',
    color: '#339933',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '12',
    name: 'Python',
    category: 'backend',
    icon: 'SiPython',
    color: '#3776AB',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '13',
    name: 'Express',
    category: 'backend',
    icon: 'SiExpress',
    color: '#000000',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '14',
    name: 'Django',
    category: 'backend',
    icon: 'SiDjango',
    color: '#092E20',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '15',
    name: 'FastAPI',
    category: 'backend',
    icon: 'SiFastapi',
    color: '#009688',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '16',
    name: 'GraphQL',
    category: 'backend',
    icon: 'SiGraphql',
    color: '#E10098',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '17',
    name: 'REST API',
    category: 'backend',
    icon: 'SiPostman',
    color: '#FF6C37',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Database Skills
  {
    id: '18',
    name: 'PostgreSQL',
    category: 'database',
    icon: 'SiPostgresql',
    color: '#4169E1',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '19',
    name: 'MongoDB',
    category: 'database',
    icon: 'SiMongodb',
    color: '#47A248',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '20',
    name: 'Redis',
    category: 'database',
    icon: 'SiRedis',
    color: '#DC382D',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '21',
    name: 'Firebase',
    category: 'database',
    icon: 'SiFirebase',
    color: '#FFCA28',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '22',
    name: 'MySQL',
    category: 'database',
    icon: 'SiMysql',
    color: '#4479A1',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '23',
    name: 'Prisma',
    category: 'database',
    icon: 'SiPrisma',
    color: '#2D3748',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Tools Skills
  {
    id: '24',
    name: 'Git',
    category: 'tools',
    icon: 'SiGit',
    color: '#F05032',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '25',
    name: 'Docker',
    category: 'tools',
    icon: 'SiDocker',
    color: '#2496ED',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '26',
    name: 'AWS',
    category: 'tools',
    icon: 'SiAmazonaws',
    color: '#FF9900',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '27',
    name: 'Vercel',
    category: 'tools',
    icon: 'SiVercel',
    color: '#000000',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '28',
    name: 'GitHub',
    category: 'tools',
    icon: 'SiGithub',
    color: '#181717',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '29',
    name: 'VS Code',
    category: 'tools',
    icon: 'SiVisualstudiocode',
    color: '#007ACC',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '30',
    name: 'Webpack',
    category: 'tools',
    icon: 'SiWebpack',
    color: '#8DD6F9',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '31',
    name: 'Vite',
    category: 'tools',
    icon: 'SiVite',
    color: '#646CFF',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '32',
    name: 'Jest',
    category: 'tools',
    icon: 'SiJest',
    color: '#C21325',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '33',
    name: 'Postman',
    category: 'tools',
    icon: 'SiPostman',
    color: '#FF6C37',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Design Skills
  {
    id: '34',
    name: 'Figma',
    category: 'design',
    icon: 'SiFigma',
    color: '#F24E1E',
    featured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '35',
    name: 'Adobe XD',
    category: 'design',
    icon: 'SiAdobexd',
    color: '#FF61F6',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '36',
    name: 'Photoshop',
    category: 'design',
    icon: 'SiAdobephotoshop',
    color: '#31A8FF',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

/**
 * Get skills by category
 */
export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return mockSkills.filter((skill) => skill.category === category)
}

/**
 * Get featured skills
 */
export const getFeaturedSkills = (): Skill[] => {
  return mockSkills.filter((skill) => skill.featured)
}

/**
 * Get all frontend skills
 */
export const getFrontendSkills = (): Skill[] => {
  return getSkillsByCategory('frontend')
}

/**
 * Get all backend skills
 */
export const getBackendSkills = (): Skill[] => {
  return getSkillsByCategory('backend')
}

/**
 * Get all database skills
 */
export const getDatabaseSkills = (): Skill[] => {
  return getSkillsByCategory('database')
}

/**
 * Get all tool skills
 */
export const getToolSkills = (): Skill[] => {
  return getSkillsByCategory('tools')
}

/**
 * Get all design skills
 */
export const getDesignSkills = (): Skill[] => {
  return getSkillsByCategory('design')
}

/**
 * Get skill by ID
 */
export const getSkillById = (id: string): Skill | undefined => {
  return mockSkills.find((skill) => skill.id === id)
}

/**
 * Get skills grouped by category
 */
export const getSkillsGroupedByCategory = (): Record<SkillCategory, Skill[]> => {
  return {
    frontend: getFrontendSkills(),
    backend: getBackendSkills(),
    database: getDatabaseSkills(),
    tools: getToolSkills(),
    design: getDesignSkills(),
    other: getSkillsByCategory('other'),
  }
}

/**
 * Get count of skills by category
 */
export const getSkillCountByCategory = (category: SkillCategory): number => {
  return getSkillsByCategory(category).length
}
