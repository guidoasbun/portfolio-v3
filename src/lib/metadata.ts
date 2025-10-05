/**
 * Shared SEO Metadata Configuration
 *
 * Centralized metadata for consistent SEO across the portfolio site.
 */

import type { Metadata } from "next";

// Site configuration
export const siteConfig = {
  name: "Portfolio - Full Stack Developer",
  title: "Portfolio - Full Stack Developer",
  description:
    "Modern portfolio showcasing web development projects with glass morphism design and 3D animations. Specialized in React, Next.js, and TypeScript.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://guido-asbun.com",
  author: {
    name: "Guido Asbun",
    email: "guido@asbun.io",
    url: "https://guido-asbun.com",
  },
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Frontend Developer",
    "Backend Developer",
    "Portfolio",
    "Software Engineer",
    "3D Web Design",
    "Glass Morphism",
    "Modern Web Development",
  ],
  social: {
    github: "https://github.com/guidoasbun",
    linkedin: "https://www.linkedin.com/in/guidoasbun/",
    twitter: "https://twitter.com/yourhandle",
  },
};

// Default metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@yourhandle",
    images: [`${siteConfig.url}/og-image.png`],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

// Page-specific metadata generators
export function createMetadata({
  title,
  description,
  image,
  type = "website",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description: description || siteConfig.description,
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      type,
      url: siteConfig.url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title || siteConfig.title,
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      images: image ? [image] : (defaultMetadata.twitter?.images as string[]),
    },
  };
}

// Structured data generators
export function createPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    email: siteConfig.author.email,
    jobTitle: "Full Stack Developer",
    description: siteConfig.description,
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };
}

export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function createArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${siteConfig.url}/og-image.png`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  };
}
