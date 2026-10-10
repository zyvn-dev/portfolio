import { z } from "zod";

export const ProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  greetingName: z.string().min(1, "Greeting name is required"),
  headline: z.string().min(1, "Headline is required"),
  shortIntro: z.string().min(1, "Short intro is required"),
  bioParagraphs: z.array(z.string()).default([]),
  avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  availableForHire: z.boolean().default(true),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  socials: z.object({
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
  }).default({}),
});

export const EducationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  degreeLevel: z.string().min(1, "Degree / Level is required"),
  fieldOfStudy: z.string().optional().or(z.literal("")),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().min(1, "End year is required"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  order: z.number().default(0),
});

export const CertificationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  issuingOrganization: z.string().min(1, "Issuing organization is required"),
  issueYear: z.string().min(1, "Issue year is required"),
  credentialUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  badgeImageUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().default(0),
});

export const ProjectLinkSchema = z.object({
  label: z.string().min(1, "Link label is required"),
  url: z.string().url("Must be a valid URL"),
});

export const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  coverImageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  galleryUrls: z.array(z.string().url()).optional().default([]),
  tags: z.array(z.string()).default([]),
  links: z.array(ProjectLinkSchema).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const ContactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const SiteSettingsSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  seoDescription: z.string().min(1, "SEO description is required"),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().url().optional().or(z.literal("")),
  faviconUrl: z.string().url().optional().or(z.literal("")),
  visibility: z.object({
    hero: z.boolean().default(true),
    about: z.boolean().default(true),
    education: z.boolean().default(true),
    certifications: z.boolean().default(true),
    projects: z.boolean().default(true),
    contact: z.boolean().default(true),
  }),
  themeMode: z.enum(["auto", "dawn", "day", "dusk", "night"]).default("auto"),
});
