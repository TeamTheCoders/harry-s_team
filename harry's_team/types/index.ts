// Common type definitions
export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  location: string;
  imageUrl?: string;
  content?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroImage {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  isActive: boolean;
  orderNum: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  siteTitle?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  updatedAt: string;
}