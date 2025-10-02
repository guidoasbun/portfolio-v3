/**
 * Admin-specific TypeScript types
 */

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AdminStats {
  projectsCount: number;
  experienceCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
}

export interface DashboardData {
  stats: AdminStats;
  loading: boolean;
  error: string | null;
}
