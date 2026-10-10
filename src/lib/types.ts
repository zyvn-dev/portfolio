export type TimePeriod = "dawn" | "day" | "dusk" | "night";

export interface TimeAtmosphereState {
  period: TimePeriod;
  label: string;
  greeting: string; // "Good morning", "Good afternoon", "Good evening", "Good night"
  hour: number;
  timeString: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    glow: string;
    gradient: string;
  };
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

export interface ProfileData {
  fullName: string;
  greetingName: string;
  headline: string;
  shortIntro: string;
  bioParagraphs: string[];
  avatarUrl: string;
  email: string;
  location: string;
  availableForHire: boolean;
  resumeUrl?: string;
  socials: SocialLinks;
  updatedAt?: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  degreeLevel: string;
  fieldOfStudy?: string;
  startYear: string;
  endYear: string; // or "Present"
  logoUrl?: string;
  description?: string;
  order: number;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuingOrganization: string;
  issueYear: string;
  credentialUrl?: string;
  badgeImageUrl?: string;
  order: number;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  fullDescription: string;
  coverImageUrl: string;
  galleryUrls?: string[];
  tags: string[];
  links: ProjectLink[];
  featured: boolean;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
  read: boolean;
  replied?: boolean;
}

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  education: boolean;
  certifications: boolean;
  projects: boolean;
  contact: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  seoDescription: string;
  keywords: string[];
  ogImage?: string;
  faviconUrl?: string;
  visibility: SectionVisibility;
  themeMode: "auto" | "dawn" | "day" | "dusk" | "night";
}
