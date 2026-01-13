import { sql } from '@/lib/db/client';

// Event model
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

// Function to get active event
export const getActiveEvent = async (): Promise<Event | null> => {
  try {
    const result = await sql`
      SELECT
        id,
        title,
        slug,
        date,
        description,
        location,
        image_url AS imageUrl,
        content,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM events
      WHERE is_active = true
      ORDER BY date DESC
      LIMIT 1
    ` as Event[];

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching active event:', error);
    return null;
  }
};

// Function to get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const result = await sql`
      SELECT
        id,
        title,
        slug,
        date,
        description,
        location,
        image_url AS imageUrl,
        content,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM events
      ORDER BY date DESC
    ` as Event[];

    return result;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Function to get event by ID
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const result = await sql`
      SELECT
        id,
        title,
        slug,
        date,
        description,
        location,
        image_url AS imageUrl,
        content,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM events
      WHERE id = ${id}
    ` as Event[];

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return null;
  }
};