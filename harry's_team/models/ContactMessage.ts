import { sql } from '@/lib/db/client';

// ContactMessage model
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// Function to create a contact message
export const createContactMessage = async (message: Omit<ContactMessage, 'id' | 'read' | 'createdAt' | 'updatedAt'>): Promise<ContactMessage | null> => {
  try {
    const result = await sql`
      INSERT INTO contact_messages (name, email, subject, message, read_status)
      VALUES (${message.name}, ${message.email}, ${message.subject || null}, ${message.message}, false)
      RETURNING *
    ` as ContactMessage[];
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error creating contact message:', error);
    return null;
  }
};

// Function to get all contact messages
export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        email,
        subject,
        message,
        read_status AS read,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM contact_messages
      ORDER BY created_at DESC
    ` as ContactMessage[];
    return result;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
};

// Function to get unread contact messages
export const getUnreadContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        email,
        subject,
        message,
        read_status AS read,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM contact_messages
      WHERE read_status = false
      ORDER BY created_at DESC
    ` as ContactMessage[];
    return result;
  } catch (error) {
    console.error('Error fetching unread contact messages:', error);
    return [];
  }
};

// Function to mark a message as read
export const markMessageAsRead = async (id: string): Promise<boolean> => {
  try {
    await sql`
      UPDATE contact_messages 
      SET read_status = true 
      WHERE id = ${id}
    `;
    
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
};