// Database utilities for the admin dashboard
// This file will contain functions to interact with the PostgreSQL database

import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Set to true in production with proper certificates
  },
});

// Function to execute a query
export const executeQuery = async (query: string, params?: any[]) => {
  try {
    const client = await pool.connect();
    const result = await client.query(query, params);
    client.release();
    return result;
  } catch (error: any) {
    console.error('Database query error:', error);
    throw new Error(error.message || 'Database query failed');
  }
};

// Function to initialize the database schema
export const initializeDatabase = async () => {
  try {
    // Create the admin table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Create the hero_images table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS hero_images (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        image_url TEXT NOT NULL,
        alt_text VARCHAR(255) NOT NULL,
        caption TEXT,
        position INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the team_members table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        bio TEXT,
        photo_url TEXT,
        email VARCHAR(255),
        phone VARCHAR(50),
        social_links JSONB,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
};

// Function to get admin by email
export const getAdminByEmail = async (email: string) => {
  const result = await executeQuery(
    'SELECT * FROM admins WHERE email = $1 AND is_active = TRUE',
    [email]
  );
  return result.rows[0] || null;
};

// Function to update admin's last login
export const updateAdminLastLogin = async (email: string) => {
  await executeQuery(
    'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE email = $1',
    [email]
  );
};