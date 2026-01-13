import { sql } from '@/lib/db/client';

// HeroImage model
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

// Function to get active hero images
export const getActiveHeroImages = async (): Promise<HeroImage[]> => {
  try {
    const result = await sql`
      SELECT
        id,
        title,
        description,
        image_url AS imageUrl,
        is_active AS isActive,
        order_num AS orderNum,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM hero_images
      WHERE is_active = true
      ORDER BY order_num ASC
    ` as HeroImage[];
    return result;
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return [];
  }
};

// Function to get all hero images
export const getAllHeroImages = async (): Promise<HeroImage[]> => {
  try {
    const result = await sql`
      SELECT
        id,
        title,
        description,
        image_url AS imageUrl,
        is_active AS isActive,
        order_num AS orderNum,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM hero_images
      ORDER BY order_num ASC
    ` as HeroImage[];
    return result;
  } catch (error) {
    console.error('Error fetching all hero images:', error);
    return [];
  }
};