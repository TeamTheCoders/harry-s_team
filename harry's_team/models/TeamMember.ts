import { sql } from '@/lib/db/client';

// TeamMember model
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

// Function to get all team members
export const getAllTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        role,
        bio,
        image_url AS imageUrl,
        order_num AS "order",
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM team_members
      ORDER BY order_num ASC
    ` as TeamMember[];
    return result;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

// Function to get team member by ID
export const getTeamMemberById = async (id: string): Promise<TeamMember | null> => {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        role,
        bio,
        image_url AS imageUrl,
        order_num AS "order",
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM team_members
      WHERE id = ${id}
    ` as TeamMember[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching team member by ID:', error);
    return null;
  }
};