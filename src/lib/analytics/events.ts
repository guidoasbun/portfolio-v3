/**
 * Analytics Event Helper Functions
 *
 * Convenience functions for tracking common analytics events.
 * These provide a cleaner API than calling trackEvent directly.
 */

import { trackEvent } from '../firebase/analytics'
import type { AnalyticsEventParams } from '@/types/analytics'

/**
 * Project Events
 */
export const analyticsEvents = {
  // Project events
  projectView: (projectId: string, projectTitle: string, projectCategory: string) => {
    trackEvent('project_view', {
      project_id: projectId,
      project_title: projectTitle,
      project_category: projectCategory,
    })
  },

  projectFilterChange: (filterType: string, filterValue: string) => {
    trackEvent('project_filter_change', {
      filter_type: filterType,
      filter_value: filterValue,
    })
  },

  projectLinkClick: (
    projectId: string,
    projectTitle: string,
    linkType: 'live' | 'github',
    linkUrl: string
  ) => {
    trackEvent('project_link_click', {
      project_id: projectId,
      project_title: projectTitle,
      link_type: linkType,
      link_url: linkUrl,
    })
  },

  // Contact form events
  contactFormSubmit: (formLocation: string = 'contact_section') => {
    trackEvent('contact_form_submit', {
      form_location: formLocation,
    })
  },

  contactFormSuccess: (formLocation: string, subject: string) => {
    trackEvent('contact_form_success', {
      form_location: formLocation,
      subject: subject,
    })
  },

  contactFormError: (formLocation: string, errorMessage: string, errorType: string) => {
    trackEvent('contact_form_error', {
      form_location: formLocation,
      error_message: errorMessage,
      error_type: errorType,
    })
  },

  // Resume events
  resumeDownload: (resumeId: string, resumeVersion: string, downloadCount: number) => {
    trackEvent('resume_download', {
      resume_id: resumeId,
      resume_version: resumeVersion,
      download_count: downloadCount,
    })
  },

  resumeView: (resumeId: string, resumeVersion: string) => {
    trackEvent('resume_view', {
      resume_id: resumeId,
      resume_version: resumeVersion,
    })
  },

  // Theme events
  themeChange: (
    themeMode: 'light' | 'dark' | 'system',
    previousTheme?: 'light' | 'dark' | 'system'
  ) => {
    trackEvent('theme_change', {
      theme_mode: themeMode,
      previous_theme: previousTheme,
    })
  },

  // 3D interaction events
  interaction3D: (
    interactionType: 'click' | 'hover' | 'drag' | 'scroll',
    elementType: string,
    elementId?: string
  ) => {
    trackEvent('3d_interaction', {
      interaction_type: interactionType,
      element_type: elementType,
      element_id: elementId,
    })
  },

  element3DClick: (elementType: string, elementId?: string, x?: number, y?: number) => {
    trackEvent('3d_element_click', {
      element_type: elementType,
      element_id: elementId,
      position_x: x,
      position_y: y,
    })
  },

  element3DHover: (elementType: string, elementId?: string) => {
    trackEvent('3d_element_hover', {
      element_type: elementType,
      element_id: elementId,
    })
  },

  // Navigation events
  ctaClick: (ctaText: string, ctaLocation: string, ctaDestination: string) => {
    trackEvent('cta_click', {
      cta_text: ctaText,
      cta_location: ctaLocation,
      cta_destination: ctaDestination,
    })
  },

  socialLinkClick: (platform: string, linkUrl: string, linkLocation: string) => {
    trackEvent('social_link_click', {
      platform: platform,
      link_url: linkUrl,
      link_location: linkLocation,
    })
  },

  navLinkClick: (linkText: string, linkDestination: string) => {
    trackEvent('nav_link_click', {
      link_text: linkText,
      link_destination: linkDestination,
    })
  },

  // Filter events
  filterChange: (filterCategory: string, filterValue: string, filterLocation: string) => {
    trackEvent('filter_change', {
      filter_category: filterCategory,
      filter_value: filterValue,
      filter_location: filterLocation,
    })
  },

  searchQuery: (searchTerm: string, searchLocation: string, resultsCount?: number) => {
    trackEvent('search_query', {
      search_term: searchTerm,
      search_location: searchLocation,
      results_count: resultsCount,
    })
  },

  // Error events
  apiError: (apiEndpoint: string, errorMessage: string, statusCode?: number) => {
    trackEvent('api_error', {
      api_endpoint: apiEndpoint,
      error_message: errorMessage,
      status_code: statusCode,
    })
  },
}

/**
 * Export individual event functions for convenience
 */
export const {
  projectView,
  projectFilterChange,
  projectLinkClick,
  contactFormSubmit,
  contactFormSuccess,
  contactFormError,
  resumeDownload,
  resumeView,
  themeChange,
  interaction3D,
  element3DClick,
  element3DHover,
  ctaClick,
  socialLinkClick,
  navLinkClick,
  filterChange,
  searchQuery,
  apiError,
} = analyticsEvents
