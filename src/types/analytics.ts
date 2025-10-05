/**
 * Analytics Type Definitions
 *
 * Type-safe interfaces for Firebase Analytics events and parameters.
 * NO any types - strict TypeScript enforcement.
 */

import type { Analytics } from 'firebase/analytics'

// Core Analytics Types
export interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
}

export interface AnalyticsContextValue {
  analytics: Analytics | null
  isInitialized: boolean
  trackEvent: <T extends AnalyticsEventName>(
    eventName: T,
    params?: AnalyticsEventParams[T]
  ) => void
  trackPageView: (pagePath: string, pageTitle?: string) => void
  trackError: (error: Error, context?: string) => void
  setUserProperty: (propertyName: string, value: string) => void
}

// Custom Event Names
export type AnalyticsEventName =
  // Page tracking
  | 'page_view'
  // Project events
  | 'project_view'
  | 'project_filter_change'
  | 'project_link_click'
  // Contact events
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'contact_form_error'
  // Resume events
  | 'resume_download'
  | 'resume_view'
  // Theme events
  | 'theme_change'
  // 3D interaction events
  | '3d_interaction'
  | '3d_element_click'
  | '3d_element_hover'
  // Navigation events
  | 'cta_click'
  | 'social_link_click'
  | 'nav_link_click'
  // Filter events
  | 'filter_change'
  | 'search_query'
  // Error events
  | 'error'
  | 'api_error'

// Event Parameters by Event Name
export interface AnalyticsEventParams {
  // Page tracking
  page_view: {
    page_path: string
    page_title?: string
    page_location?: string
  }

  // Project events
  project_view: {
    project_id: string
    project_title: string
    project_category: string
  }
  project_filter_change: {
    filter_type: string
    filter_value: string
  }
  project_link_click: {
    project_id: string
    project_title: string
    link_type: 'live' | 'github'
    link_url: string
  }

  // Contact events
  contact_form_submit: {
    form_location: string
  }
  contact_form_success: {
    form_location: string
    subject: string
  }
  contact_form_error: {
    form_location: string
    error_message: string
    error_type: string
  }

  // Resume events
  resume_download: {
    resume_id: string
    resume_version: string
    download_count: number
  }
  resume_view: {
    resume_id: string
    resume_version: string
  }

  // Theme events
  theme_change: {
    theme_mode: 'light' | 'dark' | 'system'
    previous_theme?: 'light' | 'dark' | 'system'
  }

  // 3D interaction events
  '3d_interaction': {
    interaction_type: 'click' | 'hover' | 'drag' | 'scroll'
    element_type: string
    element_id?: string
  }
  '3d_element_click': {
    element_type: string
    element_id?: string
    position_x?: number
    position_y?: number
  }
  '3d_element_hover': {
    element_type: string
    element_id?: string
  }

  // Navigation events
  cta_click: {
    cta_text: string
    cta_location: string
    cta_destination: string
  }
  social_link_click: {
    platform: string
    link_url: string
    link_location: string
  }
  nav_link_click: {
    link_text: string
    link_destination: string
  }

  // Filter events
  filter_change: {
    filter_category: string
    filter_value: string
    filter_location: string
  }
  search_query: {
    search_term: string
    search_location: string
    results_count?: number
  }

  // Error events
  error: {
    error_message: string
    error_context?: string
    error_stack?: string
  }
  api_error: {
    api_endpoint: string
    error_message: string
    status_code?: number
  }
}

// User Properties
export interface UserProperties {
  theme_preference?: 'light' | 'dark' | 'system'
  device_type?: 'desktop' | 'mobile' | 'tablet'
  supports_3d?: 'yes' | 'no'
  performance_tier?: 'high' | 'medium' | 'low'
}

// Analytics Event Log (for custom tracking in Firestore)
export interface AnalyticsEventLog {
  id: string
  eventName: AnalyticsEventName
  eventParams: Record<string, string | number | boolean>
  timestamp: Date
  userId?: string
  sessionId?: string
  userAgent?: string
  page?: string
}
