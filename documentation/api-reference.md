# API Reference

Complete API documentation for all backend endpoints in the portfolio application.

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Projects](#projects)
  - [Experience](#experience)
  - [Skills](#skills)
  - [Messages](#messages)
  - [Resume](#resume)

---

## Base URL

**Local Development**: `http://localhost:3000/api`
**Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require Firebase Authentication. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

**Public Endpoints** (no auth required):
- `POST /api/messages` - Contact form submission
- `GET /api/projects` - Public project listing
- `GET /api/experience` - Public experience listing
- `GET /api/skills` - Public skills listing
- `GET /api/resume/active` - Get active resume

**Protected Endpoints** (auth required):
- All POST/PUT/DELETE operations (except contact form)
- Admin dashboard data endpoints

## Response Format

### Success Response

```typescript
{
  success: true,
  data: T,
  message?: string
}
```

### Error Response

```typescript
{
  success: false,
  error: string
}
```

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

### Error Types

- **ValidationError**: Invalid input data
- **AuthenticationError**: Missing or invalid credentials
- **RateLimitError**: Too many requests
- **NotFoundError**: Resource not found
- **DatabaseError**: Database operation failed

---

## Endpoints

## Projects

### GET /api/projects

Get all projects with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (`web`, `mobile`, `desktop`, `ai`, `other`)
- `featured` (optional): Filter featured projects (`true`/`false`)

**Response:**
```typescript
{
  success: true,
  data: Project[],
  message: "Projects retrieved successfully"
}
```

**Project Type:**
```typescript
interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  technologies: string[]
  category: string
  images: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}
```

**Example:**
```bash
# Get all projects
GET /api/projects

# Get featured projects
GET /api/projects?featured=true

# Get web projects
GET /api/projects?category=web
```

---

### POST /api/projects

Create a new project. **Requires authentication**.

**Request Body:**
```typescript
{
  title: string              // Required, 3-100 chars
  description: string        // Required, 10-500 chars
  longDescription: string    // Required, 50-5000 chars
  technologies: string[]     // Required, min 1 item
  category: string           // Required
  images: string[]           // Required, min 1 URL
  liveUrl?: string          // Optional, valid URL
  githubUrl?: string        // Optional, valid URL
  featured: boolean         // Required
}
```

**Response:**
```typescript
{
  success: true,
  data: { id: string },
  message: "Project created successfully"
}
```

**Example:**
```bash
POST /api/projects
Content-Type: application/json

{
  "title": "Portfolio Website",
  "description": "Modern portfolio with 3D animations",
  "longDescription": "A comprehensive portfolio website...",
  "technologies": ["Next.js", "Three.js", "TypeScript"],
  "category": "web",
  "images": ["https://example.com/image.jpg"],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/user/repo",
  "featured": true
}
```

---

### GET /api/projects/[id]

Get a single project by ID.

**URL Parameters:**
- `id`: Project ID

**Response:**
```typescript
{
  success: true,
  data: Project,
  message: "Project retrieved successfully"
}
```

**Example:**
```bash
GET /api/projects/abc123
```

---

### PUT /api/projects/[id]

Update a project. **Requires authentication**.

**URL Parameters:**
- `id`: Project ID

**Request Body:** Same as POST (partial updates supported)

**Response:**
```typescript
{
  success: true,
  message: "Project updated successfully"
}
```

---

### DELETE /api/projects/[id]

Delete a project. **Requires authentication**.

**URL Parameters:**
- `id`: Project ID

**Response:**
```typescript
{
  success: true,
  message: "Project deleted successfully"
}
```

---

## Experience

### GET /api/experience

Get all experience entries with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by type (`work`, `internship`, `education`)

**Response:**
```typescript
{
  success: true,
  data: Experience[],
  message: "Experience retrieved successfully"
}
```

**Experience Type:**
```typescript
interface Experience {
  id: string
  type: "work" | "internship" | "education"
  title: string
  company: string
  location: string
  startDate: Date
  endDate?: Date
  current: boolean
  description: string[]
  technologies?: string[]
  createdAt: Date
}
```

**Example:**
```bash
# Get all experience
GET /api/experience

# Get work experience only
GET /api/experience?type=work
```

---

### POST /api/experience

Create a new experience entry. **Requires authentication**.

**Request Body:**
```typescript
{
  type: "work" | "internship" | "education"  // Required
  title: string                              // Required
  company: string                            // Required
  location: string                           // Required
  startDate: Date                           // Required
  endDate?: Date                            // Optional
  current: boolean                          // Required
  description: string[]                     // Required, min 1 item
  technologies?: string[]                   // Optional
}
```

**Response:**
```typescript
{
  success: true,
  data: { id: string },
  message: "Experience created successfully"
}
```

---

### GET /api/experience/[id]

Get a single experience entry by ID.

**Response:**
```typescript
{
  success: true,
  data: Experience
}
```

---

### PUT /api/experience/[id]

Update an experience entry. **Requires authentication**.

---

### DELETE /api/experience/[id]

Delete an experience entry. **Requires authentication**.

---

## Skills

### GET /api/skills

Get all skills with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (`frontend`, `backend`, `database`, `tools`, `design`, `other`)
- `featured` (optional): Filter featured skills (`true`/`false`)

**Response:**
```typescript
{
  success: true,
  data: Skill[],
  message: "Skills retrieved successfully"
}
```

**Skill Type:**
```typescript
interface Skill {
  id: string
  name: string
  category: string
  proficiency?: number      // 1-5 scale (not displayed to users)
  icon?: string
  color?: string
  featured?: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

### POST /api/skills

Create a new skill. **Requires authentication**.

**Request Body:**
```typescript
{
  name: string           // Required
  category: string       // Required
  proficiency?: number   // Optional, 1-5
  icon?: string         // Optional
  color?: string        // Optional
  featured?: boolean    // Optional
}
```

---

### GET /api/skills/[id]

Get a single skill by ID.

---

### PUT /api/skills/[id]

Update a skill. **Requires authentication**.

---

### DELETE /api/skills/[id]

Delete a skill. **Requires authentication**.

---

## Messages

### GET /api/messages

Get all messages. **Requires authentication**.

**Query Parameters:**
- `read` (optional): Filter by read status (`true`/`false`)
- `replied` (optional): Filter by replied status (`true`/`false`)

**Response:**
```typescript
{
  success: true,
  data: Message[],
  message: "Messages retrieved successfully"
}
```

**Message Type:**
```typescript
interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  replied: boolean
  createdAt: Date
  readAt?: Date
  repliedAt?: Date
}
```

**Example:**
```bash
# Get all messages
GET /api/messages

# Get unread messages
GET /api/messages?read=false

# Get unreplied messages
GET /api/messages?replied=false
```

---

### POST /api/messages

Submit a contact form message. **Public endpoint**.

**Security Features:**
- Rate limiting: 3 submissions per 15 minutes per IP
- reCAPTCHA v3 verification (optional but recommended)
- Honeypot field detection
- Email notifications (admin + user confirmation)

**Request Body:**
```typescript
{
  name: string              // Required, 2-50 chars
  email: string            // Required, valid email
  subject: string          // Required, 5-100 chars
  message: string          // Required, 10-1000 chars
  recaptchaToken?: string  // Optional reCAPTCHA token
}
```

**Response:**
```typescript
{
  success: true,
  data: { id: string },
  message: "Message sent successfully. We will get back to you soon!"
}
```

**Rate Limit Headers:**
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 2024-01-01T12:00:00.000Z
Retry-After: 900 (seconds, only on 429 error)
```

**Error Response (Rate Limited):**
```typescript
{
  success: false,
  error: "Too many requests. Please try again later."
}
// HTTP 429 with Retry-After header
```

---

### GET /api/messages/[id]

Get a single message by ID. **Requires authentication**.

---

### PUT /api/messages/[id]

Update a message (mark as read/replied). **Requires authentication**.

**Request Body:**
```typescript
{
  read?: boolean
  replied?: boolean
}
```

---

### DELETE /api/messages/[id]

Delete a message. **Requires authentication**.

---

## Resume

### GET /api/resume

Get all resume versions. **Requires authentication**.

**Response:**
```typescript
{
  success: true,
  data: Resume[]
}
```

**Resume Type:**
```typescript
interface Resume {
  id: string
  filename: string
  originalName: string
  fileUrl: string
  version: string
  active: boolean
  downloadCount: number
  createdAt: Date
  updatedAt: Date
}
```

---

### POST /api/resume

Upload a new resume. **Requires authentication**.

**Request Body:**
```typescript
{
  filename: string       // Required
  originalName: string   // Required
  fileUrl: string       // Required (Firebase Storage URL)
  version: string       // Required
  active: boolean       // Required
}
```

---

### GET /api/resume/active

Get the active resume. **Public endpoint**.

**Response:**
```typescript
{
  success: true,
  data: Resume
}
```

---

### GET /api/resume/[id]

Get a specific resume version. **Requires authentication**.

---

### PUT /api/resume/[id]

Update a resume version. **Requires authentication**.

---

### DELETE /api/resume/[id]

Delete a resume version. **Requires authentication**.

---

### POST /api/resume/[id]/download

Track a resume download. **Public endpoint**.

**Response:**
```typescript
{
  success: true,
  message: "Download tracked successfully"
}
```

---

## TypeScript Types

All TypeScript interfaces are available in `src/types/index.ts`:

```typescript
import type {
  Project,
  Experience,
  Skill,
  Message,
  Resume,
  ApiResponse
} from '@/types'
```

## Rate Limiting

Contact form submissions are rate limited to prevent spam:

- **Limit**: 3 submissions per 15 minutes
- **Scope**: Per IP address
- **Storage**: In-memory (resets on server restart)

Rate limit info is included in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Reset timestamp (ISO 8601)
- `Retry-After`: Seconds until reset (on 429 error)

## Security

### Input Validation

All endpoints use Yup schemas for validation:
- Type checking
- Length constraints
- Format validation (email, URL)
- Required fields enforcement

### Authentication

Protected endpoints check for:
- Valid Firebase ID token
- Admin user UID match
- Active session

### CORS

CORS is configured to allow requests from:
- Development: `http://localhost:3000`
- Production: Your custom domain

### reCAPTCHA v3

Contact form supports reCAPTCHA v3:
- Minimum score: 0.5
- Server-side verification
- Optional but recommended

## Error Examples

### Validation Error (400)
```json
{
  "success": false,
  "error": "title is a required field"
}
```

### Rate Limit Error (429)
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Project not found"
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## Testing with cURL

### Create a project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Project",
    "description": "A test project description",
    "longDescription": "This is a longer description...",
    "technologies": ["React", "Node.js"],
    "category": "web",
    "images": ["https://example.com/image.jpg"],
    "featured": false
  }'
```

### Get all projects
```bash
curl http://localhost:3000/api/projects
```

### Submit contact form
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question about your work",
    "message": "I would like to discuss..."
  }'
```

---

## Notes

- All dates are returned as ISO 8601 strings
- File uploads (images, PDFs) are handled via Firebase Storage
- URLs must include protocol (`https://`)
- Arrays must contain at least one item when required
- Partial updates are supported on PUT endpoints
- Soft deletes are not implemented (hard deletes only)

For more information, see:
- [Firebase Setup Guide](./firebase-setup-guide.md)
- [Contact Form Setup](./contact-form-setup-guide.md)
- [Type Definitions](../src/types/index.ts)
