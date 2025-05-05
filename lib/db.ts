import { sql } from "@vercel/postgres"

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await sql.query(text, params || [])
  const duration = Date.now() - start
  console.log("Executed query", { text, duration, rows: res.rowCount })
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
  const {
    name,
    email,
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

  const result = await sql`
    INSERT INTO users 
    (name, email, phone, location, linkedin_url, graduation_year, degree, major, twitter_url, facebook_url, instagram_url, subscribe_to_notifications) 
    VALUES (${name}, ${email}, ${phone}, ${location}, ${linkedin_url}, ${graduation_year}, ${degree}, ${major}, ${twitter_url}, ${facebook_url}, ${instagram_url}, ${subscribe_to_notifications}) 
    RETURNING *
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

  // Build the query dynamically
  let queryText = `SELECT * FROM users WHERE status = 'approved'`
  const queryParams: any[] = []

  if (query) {
    queryParams.push(`%${query}%`)
    queryText += ` AND (
      name ILIKE $${queryParams.length} OR
      email ILIKE $${queryParams.length} OR
      location ILIKE $${queryParams.length} OR
      major ILIKE $${queryParams.length}
    )`
  }

  if (graduationYear) {
    queryParams.push(graduationYear)
    queryText += ` AND graduation_year = $${queryParams.length}`
  }

  if (degree) {
    queryParams.push(degree)
    queryText += ` AND degree = $${queryParams.length}`
  }

  if (major) {
    queryParams.push(`%${major}%`)
    queryText += ` AND major ILIKE $${queryParams.length}`
  }

  if (location) {
    queryParams.push(`%${location}%`)
    queryText += ` AND location ILIKE $${queryParams.length}`
  }

  queryText += ` ORDER BY name ASC`

  const result = await query(queryText, queryParams)
  return result.rows
}
