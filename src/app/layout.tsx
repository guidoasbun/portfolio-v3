import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { RecaptchaProvider } from "@/components/providers/recaptcha-provider";
import { AuthProvider } from "@/context/auth-context";
import { AnalyticsProvider } from "@/context/analytics-context";
import { Layout } from "@/components/layout";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = defaultMetadata;

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// NOTE: Service Worker registration is available but currently disabled
// To enable offline support in production, add the following to a client component:
// import { registerServiceWorker } from '@/lib/sw-register'
// useEffect(() => {
//   registerServiceWorker({
//     onSuccess: () => console.log('Service Worker: Content cached'),
//     onUpdate: () => console.log('Service Worker: New content available'),
//   })
// }, [])

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="portfolio-theme"
        >
          <AnalyticsProvider>
            <RecaptchaProvider>
              <AuthProvider>
                <Layout>{children}</Layout>
              </AuthProvider>
            </RecaptchaProvider>
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
