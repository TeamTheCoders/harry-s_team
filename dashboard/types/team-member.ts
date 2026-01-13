export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}