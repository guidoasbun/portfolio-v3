# Firebase Setup Guide

## Phase 5.1 - Firebase Setup Complete ✅

This guide documents the Firebase integration completed for your portfolio project.

## What Was Implemented

### 1. Firebase Dependencies

Installed packages:
- `firebase` (v12.3.0) - Client SDK for browser-side operations
- `firebase-admin` (v13.5.0) - Admin SDK for server-side operations

### 2. Environment Configuration

Updated `.env.local` with:
- **Client-side variables** (NEXT_PUBLIC_*):
  - Firebase API Key
  - Auth Domain
  - Project ID
  - Storage Bucket
  - Messaging Sender ID
  - App ID
  - Measurement ID
  - Admin UID

- **Server-side variables** (for Admin SDK):
  - Admin Project ID
  - Admin Client Email
  - Admin Private Key

### 3. Core Firebase Services

#### Client-side Configuration ([src/lib/firebase/config.ts](../src/lib/firebase/config.ts))
- Initializes Firebase app for client-side use
- Exports `auth`, `db`, `storage` instances
- Validates all required environment variables
- Prevents duplicate initialization

#### Admin SDK ([src/lib/firebase/admin.ts](../src/lib/firebase/admin.ts))
- Server-side only (throws error if used in browser)
- Exports `adminAuth`, `adminDb`, `adminStorage`
- Helper functions:
  - `isAdmin(uid)` - Check if user is admin
  - `verifyIdToken(token)` - Verify Firebase ID tokens
  - `getUserById(uid)` - Get user data

#### Authentication Service ([src/lib/firebase/auth.ts](../src/lib/firebase/auth.ts))
- `signInWithEmail(email, password)` - User login
- `signOut()` - User logout
- `getCurrentUser()` - Get current user
- `onAuthStateChange(callback)` - Listen to auth state
- `getIdToken(forceRefresh)` - Get user ID token
- `isCurrentUserAdmin()` - Check if current user is admin
- `waitForAuth()` - Wait for auth initialization
- Custom `AuthError` class with user-friendly messages

#### Database Service ([src/lib/firebase/db.ts](../src/lib/firebase/db.ts))
- **Type-safe CRUD operations** with TypeScript generics
- Collection constants: `COLLECTIONS.PROJECTS`, `COLLECTIONS.EXPERIENCE`, etc.
- Functions:
  - `getCollection<T>(collectionName, constraints)` - Get all documents
  - `getDocument<T>(collectionName, docId)` - Get single document
  - `addDocument<T>(collectionName, data)` - Add new document
  - `setDocument<T>(collectionName, docId, data)` - Set document
  - `updateDocument<T>(collectionName, docId, data)` - Update document
  - `deleteDocument(collectionName, docId)` - Delete document
- Helpers:
  - `timestampToDate()` - Convert Firestore Timestamp to Date
  - `dateToTimestamp()` - Convert Date to Firestore Timestamp
  - `queryHelpers` - where, orderBy, limit

#### Storage Service ([src/lib/firebase/storage.ts](../src/lib/firebase/storage.ts))
- **File upload/download/deletion** with validation
- Storage paths: `STORAGE_PATHS.PROJECTS`, `STORAGE_PATHS.RESUME`, etc.
- File validation:
  - Type validation (images, PDFs)
  - Size limits (5MB for images, 10MB for PDFs)
- Functions:
  - `uploadFile(file, path, onProgress)` - Upload with progress tracking
  - `uploadMultipleFiles(files, path, onProgress)` - Batch upload
  - `deleteFile(fileUrl)` - Delete single file
  - `deleteMultipleFiles(fileUrls)` - Batch delete
  - `getFileUrl(path)` - Get download URL
- Helpers:
  - `generateUniqueFilename()` - Create unique filenames
  - `isImageFile()`, `isPdfFile()` - File type checks
  - `formatFileSize()` - Format bytes to readable size

### 4. React Hooks

#### useAuth Hook ([src/hooks/useAuth.ts](../src/hooks/useAuth.ts))
Simple hook to access authentication context:
```tsx
const { user, loading, error, signIn, signOut, isAdmin } = useAuth()
```

#### useFirestore Hook ([src/hooks/useFirestore.ts](../src/hooks/useFirestore.ts))
Real-time data fetching with TypeScript generics:
```tsx
// Fetch collection
const { data, loading, error, refetch } = useFirestore<Project>('projects')

// Fetch single document
const { data, loading, error } = useFirestoreDoc<Project>('projects', projectId)
```

### 5. Authentication Context ([src/context/auth-context.tsx](../src/context/auth-context.tsx))

Global authentication provider (similar to your theme-context):
- Manages user state across the app
- Provides authentication methods
- Checks admin status automatically
- Handles errors with user-friendly messages

**Context API:**
```tsx
interface AuthContextState {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  clearError: () => void
}
```

### 6. Security Rules

#### Firestore Rules ([firestore.rules](../firestore.rules))
- **Projects, Experience, Skills, Resume**: Public read, admin-only write
- **Messages**: Public create (contact form), admin-only read/update/delete
- Message validation on creation (email format, field lengths)
- Admin check using UID from `NEXT_PUBLIC_ADMIN_UID` environment variable

**IMPORTANT: Before deploying:**
1. Open `firestore.rules`
2. Replace `YOUR_ADMIN_UID_HERE` with your actual admin UID from `.env.local`
3. Then deploy

**To deploy:**
```bash
# Option 1: Firebase Console
# Go to Firestore Database > Rules > Copy/Paste > Publish

# Option 2: Firebase CLI
firebase deploy --only firestore:rules
```

#### Storage Rules ([storage.rules](../storage.rules))
- **All paths**: Public read, admin-only write
- **Projects folder**: Image validation (5MB max, jpeg/jpg/png/webp/gif)
- **Resume folder**: PDF validation (10MB max)
- **Profile folder**: Image validation
- **Temp folder**: Images and PDFs allowed

**To deploy:**
```bash
# Option 1: Firebase Console
# Go to Storage > Rules > Copy/Paste > Publish

# Option 2: Firebase CLI
firebase deploy --only storage
```

## How to Use Firebase in Your App

### 1. Add AuthProvider to Layout

Update [src/app/layout.tsx](../src/app/layout.tsx):

```tsx
import { ThemeProvider } from '@/context/theme-context'
import { AuthProvider } from '@/context/auth-context'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Use Authentication in Components

```tsx
'use client'

import { useAuth } from '@/hooks/useAuth'

export function LoginForm() {
  const { user, loading, error, signIn, signOut, isAdmin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      // Success - user state will update automatically
    } catch (err) {
      // Error is already set in context
      console.error('Login failed:', err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (user) return <div>Welcome {user.email}!</div>

  return <form onSubmit={handleSubmit}>...</form>
}
```

### 3. Fetch Data with Firestore Hooks

```tsx
'use client'

import { useFirestore } from '@/hooks/useFirestore'
import { Project } from '@/types'
import { queryHelpers } from '@/lib/firebase/db'

export function ProjectsList() {
  const { data: projects, loading, error } = useFirestore<Project>(
    'projects',
    [
      queryHelpers.where('featured', '==', true),
      queryHelpers.orderBy('createdAt', 'desc'),
      queryHelpers.limit(10)
    ]
  )

  if (loading) return <div>Loading projects...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!projects) return <div>No projects found</div>

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  )
}
```

### 4. Upload Files

```tsx
'use client'

import { uploadFile, STORAGE_PATHS } from '@/lib/firebase/storage'
import { useState } from 'react'

export function FileUploader() {
  const [progress, setProgress] = useState(0)

  const handleUpload = async (file: File) => {
    try {
      const downloadUrl = await uploadFile(
        file,
        STORAGE_PATHS.PROJECTS,
        (progress) => setProgress(progress)
      )
      console.log('File uploaded:', downloadUrl)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
}
```

### 5. Server-side Operations (API Routes)

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyIdToken, isAdmin } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/firebase/db'

export async function GET(request: NextRequest) {
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.PROJECTS).get()
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decodedToken = await verifyIdToken(token)

    // Check if user is admin
    if (!(await isAdmin(decodedToken.uid))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Add project
    const body = await request.json()
    const docRef = await adminDb.collection(COLLECTIONS.PROJECTS).add(body)

    return NextResponse.json({ id: docRef.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
```

## Next Steps

### Immediate (Required for Firebase to work):
1. **Deploy Security Rules** to Firebase Console
   - Firestore rules: `firestore.rules`
   - Storage rules: `storage.rules`

2. **Add AuthProvider** to your app layout
   - Wrap your app with `<AuthProvider>` in layout.tsx

### Phase 5.2 - Authentication Implementation:
- Create login page ([/admin/login](../src/app/admin))
- Create protected route wrapper
- Add logout functionality
- Implement remember me

### Phase 5.3 - Database Services:
- Create API routes for projects
- Create API routes for experience
- Create API routes for skills
- Create API routes for messages

### Phase 5.4 - File Upload UI:
- Create image upload component
- Create file manager component
- Add drag-and-drop support
- Implement progress indicators

## TypeScript Integration

All Firebase services are **fully typed** with:
- ✅ No `any` types anywhere
- ✅ Generic functions for type safety
- ✅ Proper type imports using `import type`
- ✅ Theme integration support
- ✅ Zero TypeScript errors
- ✅ Zero ESLint warnings

## Build Verification

✅ **Build Status: PASSED**
```
npm run build
✓ Compiled successfully
✓ No TypeScript errors
✓ No ESLint warnings
```

## File Structure

```
portfolio/
├── src/
│   ├── lib/
│   │   └── firebase/
│   │       ├── config.ts      # Client Firebase config
│   │       ├── admin.ts       # Admin SDK (server-side only)
│   │       ├── auth.ts        # Authentication service
│   │       ├── db.ts          # Database service
│   │       ├── storage.ts     # Storage service
│   │       └── index.ts       # Barrel export
│   ├── hooks/
│   │   ├── useAuth.ts         # Auth hook
│   │   └── useFirestore.ts    # Firestore hooks
│   └── context/
│       ├── auth-context.tsx   # Auth provider
│       └── theme-context.tsx  # Theme provider (existing)
├── firestore.rules            # Firestore security rules
├── storage.rules              # Storage security rules
└── .env.local                 # Firebase credentials
```

## Security Checklist

- ✅ Client config uses NEXT_PUBLIC_ prefix
- ✅ Admin SDK only runs server-side
- ✅ Private key stored securely in .env.local
- ✅ .env.local in .gitignore
- ✅ Security rules restrict admin operations
- ✅ File upload validation (type & size)
- ✅ Admin UID verification
- ✅ ID token verification for API routes

## Support

For Firebase documentation:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase Storage Docs](https://firebase.google.com/docs/storage)

For Next.js + Firebase:
- [Next.js Firebase Example](https://github.com/vercel/next.js/tree/canary/examples/with-firebase)

---

**Firebase Setup Completed:** Phase 5.1 ✅
**Build Status:** Passing ✅
**TypeScript:** No errors ✅
**Ready for:** Phase 5.2 - Authentication Implementation
