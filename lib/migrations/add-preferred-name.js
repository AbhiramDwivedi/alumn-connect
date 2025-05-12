import { sql } from "@vercel/postgres"

async function migrateDatabaseAddPreferredName() {
  try {
    console.log("Connected to database")

    // Check if preferred_name column already exists
    const checkResult = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'preferred_name'
    `

    // If the column doesn't exist, add it
    if (checkResult.rowCount === 0) {
      await sql`
        ALTER TABLE users
        ADD COLUMN preferred_name VARCHAR(255)
      `
      console.log("Added preferred_name column to users table")
    } else {
      console.log("preferred_name column already exists in users table")
    }

    console.log("Migration completed successfully")
  } catch (err) {
    console.error("Error during migration:", err)
  }
}

migrateDatabaseAddPreferredName()
