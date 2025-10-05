'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import React from 'react'

interface RecaptchaProviderProps {
  children: React.ReactNode
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  // If no site key is configured, render without reCAPTCHA
  if (!siteKey) {
    console.warn('reCAPTCHA site key not configured. reCAPTCHA will be disabled.')
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
