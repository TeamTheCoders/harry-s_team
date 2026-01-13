export interface HeroImage {
  id: string;
  title?: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}