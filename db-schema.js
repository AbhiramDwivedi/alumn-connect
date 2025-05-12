import { sql } from "@vercel/postgres"

async function setupDatabase() {
  try {
    console.log("Connected to database")

    // Create users table
    await sql`      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        preferred_name VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        linkedin_url VARCHAR(255),
        graduation_year INTEGER,
        degree VARCHAR(50),
        major VARCHAR(100),
        twitter_url VARCHAR(255),
        facebook_url VARCHAR(255),
        instagram_url VARCHAR(255),
        subscribe_to_notifications BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'pending',
        is_admin BOOLEAN DEFAULT false,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Users table created")

    // Create events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_id UUID REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        description TEXT,
        event_date TIMESTAMP WITH TIME ZONE NOT NULL,
        location VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Events table created")

    // Create job opportunities table
    await sql`
      CREATE TABLE IF NOT EXISTS job_opportunities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        poster_id UUID REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        description TEXT,
        contact_details TEXT,
        job_url VARCHAR(255),
        expiry_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Job opportunities table created")

    // Create feed table
    await sql`
      CREATE TABLE IF NOT EXISTS feed (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        content_type VARCHAR(50) NOT NULL,
        content_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Feed table created")

    // Create user devices table for device registration and session management
    await sql`
      CREATE TABLE IF NOT EXISTS user_devices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        device_id VARCHAR(255) NOT NULL,
        device_name VARCHAR(255),
        user_agent TEXT,
        last_used TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, device_id)
      )
    `
    console.log("User devices table created")

    console.log("All tables created successfully")
  } catch (err) {
    console.error("Error setting up database:", err)
  }
}

setupDatabase()
