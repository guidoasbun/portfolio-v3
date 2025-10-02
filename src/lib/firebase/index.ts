/**
 * Firebase Service Barrel Export
 *
 * Central export point for all Firebase services.
 * Import Firebase functionality from this file for cleaner imports.
 */

// Client-side Firebase exports
export * from './config'
export * from './auth'
export * from './db'
export * from './storage'

// Note: admin.ts should only be imported in server-side code (API routes, server components)
// Do not export it here to avoid accidental client-side usage
