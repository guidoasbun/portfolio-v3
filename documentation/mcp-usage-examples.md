# MCP Usage Examples for Portfolio Development

## Quick Reference Commands

### Memory MCP - Project Context Storage

**Store Architectural Decisions**:

```
Remember that we use glass morphism design with these specific styles:
- backdrop-blur-md for glass cards
- bg-white/10 for transparent backgrounds
- border-white/20 for subtle borders
- shadow-lg shadow-black/5 for depth
```

**Store Component Patterns**:

```
Remember our Three.js component pattern:
- Always use dynamic imports with ssr: false
- Wrap in Suspense with loading fallback
- Use useThreePerformance hook for device detection
- Implement both 3D and 2D fallback versions
```

**Store Firebase Schema Decisions**:

```
Remember our Firestore collections:
- projects: {id, title, description, technologies[], category, images[], featured, dates}
- experience: {id, type, title, company, location, dates, description[], technologies[]}
- skills: {id, name, category, proficiency, featured}
- messages: {id, name, email, subject, message, read, createdAt}
- resume: {id, version, fileUrl, fileName, active, uploadedAt}
```

### Filesystem MCP - Batch Operations

**Create Component Structure**:

```
Create the following directory structure in src/components:
- ui/ (Button, GlassCard, Modal, Input, etc.)
- sections/ (HeroSection, AboutSection, ProjectsSection, etc.)
- three/ (Scene, HeroBackground, ProjectCard3D, SkillsVisualization)
- admin/ (AdminLayout, ProjectForm, DataTable, etc.)
- forms/ (ContactForm, LoginForm, etc.)
```

**Create Multiple Components at Once**:

```
Create these UI components with TypeScript and glass morphism styling:
1. Button component with variants (primary, secondary, ghost)
2. GlassCard component with hover effects
3. Input component with floating labels
4. Modal component with backdrop blur
```

### GitHub MCP - Project Management

**Create Issues from Roadmap**:

```
Create GitHub issues for Phase 1 tasks from the roadmap:
- Each task should be a separate issue
- Label them with "phase-1" and appropriate priority
- Add them to a "Portfolio Development" project board
- Include acceptance criteria from the roadmap
```

**Manage Feature Branches**:

```
Create feature branches for major development phases:
- feature/design-system
- feature/three-js-integration
- feature/firebase-backend
- feature/admin-dashboard
```

**Set Up Project Milestones**:

```
Create milestones for each development phase:
- Phase 1: Foundation & Setup (Week 1)
- Phase 2: Design System (Week 2)
- Phase 3: Public Pages (Week 3)
- Phase 4: Three.js Integration (Week 4)
- Phase 5: Firebase Backend (Week 5)
- Phase 6: Admin Dashboard (Week 6)
- Phase 7: Advanced Features (Week 7)
- Phase 8: Polish & Deployment (Week 8)
```

### Playwright MCP - Testing

**Test Three.js Performance**:

```
Create a Playwright test that:
1. Loads the homepage with 3D background
2. Measures FPS during particle animation
3. Tests performance on different viewport sizes
4. Verifies fallback works on simulated low-power devices
```

**Test Responsive Design**:

```
Create tests for responsive breakpoints:
- Mobile (375px): Check mobile menu, touch interactions
- Tablet (768px): Verify layout adjustments
- Desktop (1024px+): Test full 3D experience
- Ultra-wide (1440px+): Check content centering
```

**Test Admin Workflows**:

```
Create E2E tests for admin functionality:
1. Login flow with Firebase Auth
2. Create new project with image upload
3. Edit existing experience entry
4. View and mark messages as read
5. Upload new resume version
```

### Fetch MCP - API Testing

**Test API Endpoints**:

```
Test the following API routes:
- GET /api/projects - Should return array of projects
- POST /api/projects - Should create new project with validation
- PUT /api/projects/[id] - Should update existing project
- DELETE /api/projects/[id] - Should remove project
- POST /api/messages - Should save contact form submission
```

**Monitor Performance**:

```
Create performance tests for:
- API response times (should be < 500ms)
- Firebase read/write operations
- Image upload speeds
- Contact form submission speed
```

### SQLite MCP - Local Development

**Create Test Data**:

```
Set up local test database with:
- 5 sample projects with different technologies
- 3 work experiences and 2 education entries
- 15 skills across 4 categories (frontend, backend, tools, design)
- 10 sample contact messages
- 2 resume versions
```

**Test Database Operations**:

```
Create test scenarios for:
- CRUD operations on all entities
- Query performance with large datasets
- Data validation and constraints
- Migration scripts before Firebase deployment
```

## Development Workflow Examples

### Starting a New Feature

1. **Plan with Memory**:

```
Remember that I'm starting work on the Three.js hero background:
- Priority: High
- Dependencies: Basic Scene component must be created first
- Performance target: 60fps on desktop, 30fps on mobile
- Fallback: CSS animation for low-power devices
```

2. **Create Branch with GitHub**:

```
Create a new feature branch called "feature/hero-3d-background" and set up a pull request template for Three.js features
```

3. **Create Files with Filesystem**:

```
Create the Three.js hero components:
- src/components/three/Scene.tsx (base Canvas wrapper)
- src/components/three/HeroBackground.tsx (main component)
- src/components/three/FloatingParticles.tsx (particle system)
- src/components/three/Lighting.tsx (scene lighting)
```

4. **Test Performance with Playwright**:

```
Create performance tests for the hero background that measure FPS and memory usage across different devices
```

### Debugging Issues

1. **Check API Issues**:

```
Use Fetch MCP to test the contact form API:
- Verify POST /api/messages accepts the correct format
- Check response times and error handling
- Test with invalid data to verify validation
```

2. **Database Debugging**:

```
Use SQLite MCP to replicate the issue locally:
- Create test data that reproduces the problem
- Test query performance and results
- Verify data integrity
```

### Code Review Preparation

1. **Document Changes**:

```
Remember the changes made in this feature:
- Added Three.js particle system with 100 particles
- Implemented device detection for performance optimization
- Created fallback CSS animation for low-power devices
- Performance target achieved: 58fps average on test devices
```

2. **Create Tests**:

```
Use Playwright to create tests that verify:
- 3D background loads correctly
- Particles animate smoothly
- Fallback works on simulated mobile devices
- No console errors during animation
```

## Project-Specific Patterns

### Component Development Pattern

1. **Memory**: Store component requirements and patterns
2. **Filesystem**: Create component file structure
3. **GitHub**: Create feature branch and track progress
4. **Playwright**: Write tests for component functionality

### API Development Pattern

1. **Memory**: Store API schema and validation rules
2. **Filesystem**: Create API route files
3. **Fetch**: Test API endpoints thoroughly
4. **SQLite**: Test with local data first
5. **GitHub**: Create PR with API documentation

### Feature Integration Pattern

1. **Memory**: Document integration requirements
2. **Filesystem**: Update related components
3. **Playwright**: Test integration points
4. **GitHub**: Update project board and documentation

## Common MCP Commands for Portfolio

### Daily Development Start

```
Memory: What were the last architectural decisions made?
GitHub: Show me today's assigned issues
Filesystem: Show me the current component structure
```

### Before Committing Code

```
Playwright: Run all tests for the current feature
Fetch: Test any new API endpoints
Memory: Document any new patterns or decisions made
GitHub: Update issue status and add comments
```

### Weekly Review

```
Memory: Summarize this week's architectural decisions
GitHub: Show completed milestones and remaining tasks
Playwright: Generate test coverage report
Fetch: Review API performance metrics
```

This reference guide provides practical examples for using MCPs effectively throughout your portfolio development process.
