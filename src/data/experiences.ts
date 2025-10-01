import type { Experience, ExperienceType } from '@/types'

/**
 * Mock experience data for the portfolio
 * In production, this would be fetched from Firebase/database
 */

export const mockExperiences: Experience[] = [
  {
    id: '1',
    type: 'work',
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    startDate: new Date('2023-01-15'),
    endDate: undefined,
    current: true,
    description: [
      'Led development of microservices architecture serving 1M+ daily active users',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
      'Mentored team of 5 junior developers on React and TypeScript best practices',
      'Architected real-time notification system using WebSockets and Redis',
      'Improved application performance by 40% through code optimization and caching strategies',
    ],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Redis',
      'Docker',
      'AWS',
    ],
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    type: 'internship',
    title: 'Software Engineering Intern',
    company: 'StartupXYZ',
    location: 'Remote',
    startDate: new Date('2022-06-01'),
    endDate: new Date('2022-08-31'),
    current: false,
    description: [
      'Developed RESTful APIs using Node.js and Express for mobile application',
      'Built responsive admin dashboard using React and Material-UI',
      'Collaborated with product team to implement user authentication flow',
      'Wrote comprehensive unit tests achieving 85% code coverage',
      'Participated in daily standups and bi-weekly sprint planning',
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Jest', 'Material-UI'],
    createdAt: new Date('2022-06-01'),
  },
  {
    id: '3',
    type: 'work',
    title: 'Frontend Developer',
    company: 'Digital Solutions Ltd.',
    location: 'Austin, TX',
    startDate: new Date('2021-09-01'),
    endDate: new Date('2022-12-31'),
    current: false,
    description: [
      'Built and maintained 15+ client websites using modern web technologies',
      'Implemented responsive designs ensuring cross-browser compatibility',
      'Optimized website performance achieving 95+ Lighthouse scores',
      'Collaborated with designers to translate Figma mockups into pixel-perfect UI',
      'Integrated third-party APIs including Stripe, SendGrid, and Google Analytics',
    ],
    technologies: [
      'React',
      'Vue.js',
      'JavaScript',
      'Tailwind CSS',
      'SCSS',
      'Webpack',
      'Git',
    ],
    createdAt: new Date('2021-09-01'),
  },
  {
    id: '4',
    type: 'education',
    title: 'Bachelor of Science in Computer Science',
    company: 'University of Technology',
    location: 'Boston, MA',
    startDate: new Date('2018-09-01'),
    endDate: new Date('2022-05-15'),
    current: false,
    description: [
      'GPA: 3.8/4.0 - Dean\'s List all semesters',
      'Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development, Software Engineering, Machine Learning',
      'Senior Capstone: Built a real-time collaborative code editor using WebRTC',
      'Member of Computer Science Club and ACM student chapter',
      'Teaching Assistant for Introduction to Programming (Java) course',
    ],
    technologies: ['Java', 'Python', 'C++', 'SQL', 'React', 'Git'],
    createdAt: new Date('2018-09-01'),
  },
  {
    id: '5',
    type: 'internship',
    title: 'Web Development Intern',
    company: 'Marketing Agency Pro',
    location: 'New York, NY',
    startDate: new Date('2021-05-15'),
    endDate: new Date('2021-08-15'),
    current: false,
    description: [
      'Developed landing pages for marketing campaigns using HTML, CSS, and JavaScript',
      'Implemented A/B testing to optimize conversion rates',
      'Worked with content management systems (WordPress, Contentful)',
      'Created email templates and automated marketing workflows',
      'Analyzed website analytics to provide insights for marketing strategy',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'WordPress', 'PHP', 'Google Analytics'],
    createdAt: new Date('2021-05-15'),
  },
  {
    id: '6',
    type: 'work',
    title: 'Junior Web Developer',
    company: 'E-Commerce Solutions',
    location: 'Chicago, IL',
    startDate: new Date('2020-06-01'),
    endDate: new Date('2021-08-31'),
    current: false,
    description: [
      'Maintained and enhanced e-commerce platform serving 50K+ customers',
      'Fixed bugs and implemented new features based on user feedback',
      'Integrated payment gateways including PayPal and Stripe',
      'Improved checkout flow resulting in 15% increase in conversion rate',
      'Participated in code reviews and contributed to team documentation',
    ],
    technologies: [
      'JavaScript',
      'jQuery',
      'PHP',
      'MySQL',
      'Bootstrap',
      'REST APIs',
    ],
    createdAt: new Date('2020-06-01'),
  },
  {
    id: '7',
    type: 'internship',
    title: 'Software Development Intern',
    company: 'Tech Startup Hub',
    location: 'Seattle, WA',
    startDate: new Date('2020-01-10'),
    endDate: new Date('2020-05-15'),
    current: false,
    description: [
      'Assisted in developing internal tools for project management',
      'Created automated scripts for data processing using Python',
      'Learned Agile methodologies and participated in sprint ceremonies',
      'Shadowed senior developers on architecture design sessions',
      'Contributed to open-source projects maintained by the company',
    ],
    technologies: ['Python', 'JavaScript', 'React', 'Flask', 'PostgreSQL'],
    createdAt: new Date('2020-01-10'),
  },
]

/**
 * Get experiences by type
 */
export const getExperiencesByType = (type: ExperienceType): Experience[] => {
  return mockExperiences.filter((exp) => exp.type === type)
}

/**
 * Get current experience (if any)
 */
export const getCurrentExperience = (): Experience | undefined => {
  return mockExperiences.find((exp) => exp.current)
}

/**
 * Get all work experiences
 */
export const getWorkExperiences = (): Experience[] => {
  return getExperiencesByType('work')
}

/**
 * Get all internship experiences
 */
export const getInternshipExperiences = (): Experience[] => {
  return getExperiencesByType('internship')
}

/**
 * Get all education experiences
 */
export const getEducationExperiences = (): Experience[] => {
  return getExperiencesByType('education')
}

/**
 * Get experiences sorted by date (most recent first)
 */
export const getSortedExperiences = (experiences: Experience[] = mockExperiences): Experience[] => {
  return [...experiences].sort((a, b) => {
    // Current positions come first
    if (a.current && !b.current) return -1
    if (!a.current && b.current) return 1

    // Then sort by start date (most recent first)
    return b.startDate.getTime() - a.startDate.getTime()
  })
}

/**
 * Get experience by ID
 */
export const getExperienceById = (id: string): Experience | undefined => {
  return mockExperiences.find((exp) => exp.id === id)
}

/**
 * Format date range for display
 */
export const formatDateRange = (startDate: Date, endDate?: Date, current?: boolean): string => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const start = formatDate(startDate)
  const end = current ? 'Present' : endDate ? formatDate(endDate) : 'Present'

  return `${start} - ${end}`
}

/**
 * Calculate duration between two dates
 */
export const calculateDuration = (startDate: Date, endDate?: Date, current?: boolean): string => {
  const end = current || !endDate ? new Date() : endDate
  const diffTime = Math.abs(end.getTime() - startDate.getTime())
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))

  const years = Math.floor(diffMonths / 12)
  const months = diffMonths % 12

  if (years === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`
  } else if (months === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`
  }
}
