import { sql } from '@/lib/db/client';

// Program model
export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Function to get all programs
export const getAllPrograms = async (): Promise<Program[]> => {
  try {
    const result = await sql`
      SELECT
        id,
        title,
        slug,
        description,
        image_url AS imageUrl,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM programs
      ORDER BY created_at DESC
    ` as Program[];
    return result;
  } catch (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
};

// Function to get program by ID
export const getProgramById = async (id: string): Promise<Program | null> => {
  try {
    const result = await sql`
      SELECT
        id,
        title,
        slug,
        description,
        image_url AS imageUrl,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM programs
      WHERE id = ${id}
    ` as Program[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching program by ID:', error);
    return null;
  }
};