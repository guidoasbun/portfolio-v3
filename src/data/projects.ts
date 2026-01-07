import type { Project } from '@/types'

/**
 * Mock project data for the portfolio
 * In production, this would be fetched from Firebase/database
 */

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce platform with real-time inventory management, payment processing, and admin dashboard.',
    longDescription: `A comprehensive e-commerce solution built with Next.js and TypeScript. Features include:

• Real-time inventory management with automatic stock updates
• Secure payment processing with Stripe integration
• Advanced product filtering and search functionality
• Admin dashboard for managing products, orders, and customers
• Responsive design optimized for mobile shopping
• Email notifications for order confirmations and shipping updates
• Customer reviews and ratings system
• Shopping cart with persistent sessions

The platform handles thousands of products and supports multiple payment methods. Built with performance and scalability in mind, featuring server-side rendering and optimized image delivery.`,
    technologies: [
      'Next.js',
      'TypeScript',
      'React',
      'Tailwind CSS',
      'Stripe',
      'PostgreSQL',
      'Prisma',
      'Redis',
    ],
    category: 'web',
    images: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
    order: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time updates, team workspaces, and advanced filtering.',
    longDescription: `A modern task management solution designed for teams and individuals. Key features:

• Real-time collaboration with live updates
• Multiple workspace support for different teams/projects
• Drag-and-drop task organization with Kanban boards
• Advanced filtering by priority, assignee, due date, and tags
• File attachments and comments on tasks
• Calendar view and timeline visualization
• Activity tracking and audit logs
• Dark mode and customizable themes
• Mobile apps for iOS and Android

Built with React Native for cross-platform mobile support and Firebase for real-time data synchronization. Includes comprehensive unit and integration tests.`,
    technologies: [
      'React Native',
      'TypeScript',
      'Firebase',
      'Redux',
      'Expo',
      'Jest',
    ],
    category: 'mobile',
    images: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
    order: 1,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    title: 'AI Image Generator',
    description:
      'An AI-powered image generation tool using Stable Diffusion with customizable styles and parameters.',
    longDescription: `An innovative AI image generation platform leveraging state-of-the-art diffusion models:

• Multiple AI models: Stable Diffusion, DALL-E, Midjourney
• Customizable generation parameters (style, resolution, iterations)
• Image-to-image transformation capabilities
• Prompt engineering tools and templates
• Gallery of generated images with sharing capabilities
• Batch generation for multiple variations
• Style transfer and inpainting features
• API access for developers
• Credit-based pricing system

The application uses a Python backend with FastAPI for handling AI model inference, while the frontend is built with React for a smooth user experience. Includes image optimization and CDN delivery for fast loading.`,
    technologies: [
      'React',
      'Python',
      'FastAPI',
      'PyTorch',
      'AWS',
      'Docker',
      'PostgreSQL',
    ],
    category: 'ai',
    images: [
      'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=800&q=80',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80',
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
    order: 2,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '4',
    title: 'Weather Dashboard',
    description:
      'A beautiful weather dashboard with real-time data, forecasts, and interactive maps.',
    longDescription: `A comprehensive weather application providing detailed meteorological information:

• Current weather conditions for any location worldwide
• 7-day and hourly forecasts with detailed metrics
• Interactive weather maps (radar, satellite, temperature)
• Severe weather alerts and notifications
• Historical weather data and trends
• Air quality index and pollen count
• UV index and sun/moon times
• Weather widgets for embedding
• Multiple units support (metric/imperial)
• Offline mode with cached data

Built with modern web technologies and integrates multiple weather APIs for accurate data. Features beautiful visualizations using Chart.js and Mapbox for interactive maps.`,
    technologies: [
      'Next.js',
      'TypeScript',
      'Chart.js',
      'Mapbox',
      'Tailwind CSS',
      'SWR',
    ],
    category: 'web',
    images: [
      'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80',
      'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=800&q=80',
    ],
    githubUrl: 'https://github.com',
    featured: false,
    order: 3,
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-04-20'),
  },
  {
    id: '5',
    title: 'Code Editor Desktop App',
    description:
      'A lightweight code editor built with Electron, featuring syntax highlighting and extensions.',
    longDescription: `A fast and extensible code editor for developers:

• Syntax highlighting for 50+ programming languages
• Intelligent code completion and suggestions
• Git integration with visual diff viewer
• Integrated terminal for running commands
• Extension marketplace for adding functionality
• Multiple themes (light, dark, high contrast)
• Split panes and tabs for multitasking
• Find and replace with regex support
• Keyboard shortcuts and customizable keybindings
• Performance optimized for large files

Built with Electron for cross-platform desktop support (Windows, macOS, Linux). Uses Monaco Editor (VS Code's editor) as the foundation with custom enhancements and optimizations.`,
    technologies: [
      'Electron',
      'TypeScript',
      'React',
      'Monaco Editor',
      'Node.js',
    ],
    category: 'desktop',
    images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: false,
    order: 4,
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-05-12'),
  },
  {
    id: '6',
    title: 'Fitness Tracker',
    description:
      'A mobile fitness tracking app with workout plans, progress tracking, and social features.',
    longDescription: `A comprehensive fitness tracking solution for health enthusiasts:

• Custom workout plans tailored to user goals
• Exercise library with video demonstrations
• Progress tracking with charts and statistics
• Calorie and nutrition tracking
• Water intake monitoring
• Weight and body measurement logging
• Social features: share workouts, compete with friends
• Integration with wearable devices (Apple Watch, Fitbit)
• Personal records and achievements
• Reminder notifications for workouts and meals

The app uses React Native for cross-platform development, with Firebase for backend services. Includes offline mode for tracking workouts without internet connection. Features beautiful animations and intuitive UX design.`,
    technologies: [
      'React Native',
      'TypeScript',
      'Firebase',
      'Redux Toolkit',
      'React Navigation',
      'Reanimated',
    ],
    category: 'mobile',
    images: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    ],
    githubUrl: 'https://github.com',
    featured: false,
    order: 5,
    createdAt: new Date('2024-06-18'),
    updatedAt: new Date('2024-06-18'),
  },
  {
    id: '7',
    title: 'Blog CMS Platform',
    description:
      'A headless CMS for blogs with markdown support, SEO optimization, and multi-author collaboration.',
    longDescription: `A modern content management system designed for bloggers and content creators:

• Markdown-based content editing with live preview
• Rich media support (images, videos, embeds)
• SEO optimization tools (meta tags, sitemap, schema)
• Multi-author support with role-based permissions
• Content scheduling and draft management
• Tag and category organization
• Comment moderation system
• Analytics dashboard for post performance
• Custom themes and templates
• REST API and GraphQL support
• Export content to various formats

Built with Next.js for the frontend and a Node.js backend with MongoDB for data storage. Includes full-text search powered by Elasticsearch and image optimization with Cloudinary.`,
    technologies: [
      'Next.js',
      'TypeScript',
      'Node.js',
      'MongoDB',
      'GraphQL',
      'Elasticsearch',
      'Cloudinary',
    ],
    category: 'web',
    images: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: false,
    order: 6,
    createdAt: new Date('2024-07-22'),
    updatedAt: new Date('2024-07-22'),
  },
  {
    id: '8',
    title: 'Sentiment Analysis Tool',
    description:
      'An AI-powered sentiment analysis tool for analyzing customer feedback and social media.',
    longDescription: `An advanced natural language processing tool for sentiment analysis:

• Real-time sentiment analysis of text data
• Support for multiple languages
• Emotion detection (joy, anger, sadness, etc.)
• Entity recognition and keyword extraction
• Batch processing for large datasets
• Integration with Twitter, Reddit, and review platforms
• Customizable sentiment models for specific domains
• Visual dashboards with trend analysis
• Export reports in multiple formats
• API for third-party integrations
• Historical data comparison

Powered by transformer-based models (BERT, RoBERTa) fine-tuned for sentiment classification. The backend uses Python with FastAPI, while the frontend is built with React and TypeScript for interactive visualizations.`,
    technologies: [
      'Python',
      'TypeScript',
      'React',
      'FastAPI',
      'TensorFlow',
      'MongoDB',
      'Redis',
    ],
    category: 'ai',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: false,
    order: 7,
    createdAt: new Date('2024-08-30'),
    updatedAt: new Date('2024-08-30'),
  },
]

/**
 * Get all unique categories from projects
 */
export const getProjectCategories = (): string[] => {
  const categories = new Set(mockProjects.map((project) => project.category))
  return Array.from(categories)
}

/**
 * Get projects by category
 */
export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return mockProjects
  return mockProjects.filter((project) => project.category === category)
}

/**
 * Get featured projects
 */
export const getFeaturedProjects = (): Project[] => {
  return mockProjects.filter((project) => project.featured)
}

/**
 * Get project by ID
 */
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find((project) => project.id === id)
}
