'use client'

import { ThemeProvider as NextThemeProvider } from '@/context/theme-context'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemeProvider>) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}