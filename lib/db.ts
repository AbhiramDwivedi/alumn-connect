import { sql } from "@vercel/postgres"
import { hash } from "bcrypt"

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await sql.query(text, params || [])
  const duration = Date.now() - start
  // Avoid logging sensitive data in production
  const sanitizedText = text.replace(/\s+/g, ' ').trim()
  console.log("Executed query", { 
    text: sanitizedText.substring(0, 50) + (sanitizedText.length > 50 ? '...' : ''), 
    duration, 
    rows: res.rowCount 
  })
  return res
}

export async function getUser(id: string) {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`
  return result.rows[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`
  return result.rows[0]
}

export async function createUser(userData: any) {
  // Input validation and sanitization
  const {
    name,
    email,
    password,
    phone,
    location,
    linkedin_url,
    graduation_year,
    degree,
    major,
    twitter_url,
    facebook_url,
    instagram_url,
    subscribe_to_notifications,
  } = userData

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email format")
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Password validation and hashing
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long")
  }
  
  const hashedPassword = await hash(password, 10)
  
  // Year validation
  const currentYear = new Date().getFullYear()
  const minYear = 1950
  const gradYear = parseInt(graduation_year)
  
  if (isNaN(gradYear) || gradYear < minYear || gradYear > currentYear) {
    throw new Error(`Graduation year must be between ${minYear} and ${currentYear}`)
  }

  // URL validation
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  
  if (linkedin_url && !urlRegex.test(linkedin_url)) {
    throw new Error("Invalid LinkedIn URL format")
  }
  
  if (twitter_url && !urlRegex.test(twitter_url)) {
    throw new Error("Invalid Twitter URL format")
  }
  
  if (facebook_url && !urlRegex.test(facebook_url)) {
    throw new Error("Invalid Facebook URL format")
  }
  
  if (instagram_url && !urlRegex.test(instagram_url)) {
    throw new Error("Invalid Instagram URL format")
  }

  const result = await sql`
    INSERT INTO users 
    (name, email, password, phone, location, linkedin_url, graduation_year, degree, major, twitter_url, facebook_url, instagram_url, subscribe_to_notifications, status) 
    VALUES (${name}, ${email}, ${hashedPassword}, ${phone}, ${location}, ${linkedin_url}, ${graduation_year}, ${degree}, ${major}, ${twitter_url}, ${facebook_url}, ${instagram_url}, ${subscribe_to_notifications}, 'pending') 
    RETURNING id, name, email, phone, location, linkedin_url, graduation_year, degree, major, twitter_url, facebook_url, instagram_url, subscribe_to_notifications, status, created_at, updated_at
  `

  return result.rows[0]
}

export async function updateUserStatus(id: string, status: string) {
  const result = await sql`
    UPDATE users 
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${id} 
    RETURNING *
  `

  return result.rows[0]
}

export async function getPendingUsers() {
  const result = await sql`
    SELECT * FROM users 
    WHERE status = 'pending' 
    ORDER BY created_at DESC
  `
  return result.rows
}

export async function getEvents(limit = 10) {
  const result = await sql`
    SELECT * FROM events 
    ORDER BY event_date ASC 
    LIMIT ${limit}
  `
  return result.rows
}

export async function createEvent(eventData: any) {
  const { creator_id, title, summary, description, event_date, location } = eventData

  const result = await sql`
    INSERT INTO events 
    (creator_id, title, summary, description, event_date, location) 
    VALUES (${creator_id}, ${title}, ${summary}, ${description}, ${event_date}, ${location}) 
    RETURNING *
  `

  return result.rows[0]
}

export async function getJobOpportunities(limit = 10) {
  const result = await sql`
    SELECT * FROM job_opportunities 
    WHERE (expiry_date IS NULL OR expiry_date > CURRENT_TIMESTAMP) 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `
  return result.rows
}

export async function createJobOpportunity(jobData: any) {
  const { poster_id, title, company, summary, description, contact_details, job_url, expiry_date } = jobData

  // If no expiry date is provided, set it to 30 days from now
  const finalExpiryDate = expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const result = await sql`
    INSERT INTO job_opportunities 
    (poster_id, title, company, summary, description, contact_details, job_url, expiry_date) 
    VALUES (${poster_id}, ${title}, ${company}, ${summary}, ${description}, ${contact_details}, ${job_url}, ${finalExpiryDate}) 
    RETURNING *
  `

  return result.rows[0]
}

export async function searchAlumni(searchParams: any) {
  const { query, graduationYear, degree, major, location } = searchParams

  // Using parameterized queries with Vercel's sql template literals for safety
  let conditions = []
  let sqlParams: any[] = []
  
  if (query) {
    conditions.push(sql`(
      name ILIKE ${`%${query}%`} OR
      email ILIKE ${`%${query}%`} OR
      location ILIKE ${`%${query}%`} OR
      major ILIKE ${`%${query}%`}
    )`)
  }

  if (graduationYear) {
    conditions.push(sql`graduation_year = ${graduationYear}`)
  }

  if (degree) {
    conditions.push(sql`degree = ${degree}`)
  }

  if (major) {
    conditions.push(sql`major ILIKE ${`%${major}%`}`)
  }

  if (location) {
    conditions.push(sql`location ILIKE ${`%${location}%`}`)
  }
  
  // Base query
  let finalQuery = sql`SELECT * FROM users WHERE status = 'approved'`
  
  // Add conditions if any
  if (conditions.length > 0) {
    for (const condition of conditions) {
      finalQuery = sql`${finalQuery} AND ${condition}`
    }
  }
  
  // Add ordering
  finalQuery = sql`${finalQuery} ORDER BY name ASC`
  
  const result = await finalQuery
  return result.rows
}

/**
 * Store a user's device information in the database
 * @param deviceData Object containing user_id, device_id, and other device details
 * @returns The stored device record
 */
export async function storeUserDevice(deviceData: {
  user_id: string;
  device_id: string;
  last_used: Date;
  user_agent: string;
}) {
  const { user_id, device_id, last_used, user_agent } = deviceData;
  
  try {
    // Check if device already exists for this user
    const existingDevice = await getUserDevice(user_id, device_id);
    
    if (existingDevice) {
      // Update the existing device record
      const result = await sql`
        UPDATE user_devices 
        SET last_used = ${last_used}, user_agent = ${user_agent}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ${user_id} AND device_id = ${device_id}
        RETURNING *
      `;
      return result.rows[0];
    } else {
      // Create a new device record
      const result = await sql`
        INSERT INTO user_devices (user_id, device_id, last_used, user_agent)
        VALUES (${user_id}, ${device_id}, ${last_used}, ${user_agent})
        RETURNING *
      `;
      return result.rows[0];
    }
  } catch (error) {
    console.error("Error storing user device:", error);
    throw error;
  }
}

/**
 * Get a user's device information from the database
 * @param userId The user ID
 * @param deviceId The device ID
 * @returns The device record or null if not found
 */
export async function getUserDevice(userId: string, deviceId: string) {
  try {
    const result = await sql`
      SELECT * FROM user_devices
      WHERE user_id = ${userId} AND device_id = ${deviceId}
    `;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error retrieving user device:", error);
    return null;
  }
}

/**
 * Get all registered devices for a user
 * @param userId The user ID
 * @returns Array of device records
 */
export async function getUserDevices(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM user_devices
      WHERE user_id = ${userId}
      ORDER BY last_used DESC
    `;
    
    return result.rows;
  } catch (error) {
    console.error("Error retrieving user devices:", error);
    return [];
  }
}

/**
 * Delete a user's device from the database
 * @param userId The user ID
 * @param deviceId The device ID
 * @returns Boolean indicating success
 */
export async function removeUserDevice(userId: string, deviceId: string) {
  try {
    const result = await sql`
      DELETE FROM user_devices
      WHERE user_id = ${userId} AND device_id = ${deviceId}
    `;
    
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error removing user device:", error);
    return false;
  }
}
