import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: './.env.local' }); // Load from .env.local file

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const sql = neon(process.env.POSTGRES_URL);

// Migration script to initialize the database tables
export async function initializeDatabase() {
  try {
    // Create events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        description TEXT,
        location VARCHAR(255),
        image_url TEXT,
        content TEXT,
        is_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create programs table
    await sql`
      CREATE TABLE IF NOT EXISTS programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create team_members table
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url TEXT,
        order_num INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create hero_images table
    await sql`
      CREATE TABLE IF NOT EXISTS hero_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255),
        description TEXT,
        image_url TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        order_num INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create site_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        site_title VARCHAR(255),
        site_description TEXT,
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        address TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create contact_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        read_status BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_num);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(order_num);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_hero_images_is_active ON hero_images(is_active);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_messages_read_status ON contact_messages(read_status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);`;

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run the initialization if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  initializeDatabase().catch(console.error);
}