import { sql } from "@vercel/postgres"

async function addCompanyAndPositionFields() {
  try {
    console.log("Connected to database")

    // Check if company column already exists
    const checkCompanyResult = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'company'
    `

    // If the column doesn't exist, add it
    if (checkCompanyResult.rowCount === 0) {
      await sql`
        ALTER TABLE users
        ADD COLUMN company VARCHAR(255)
      `
      console.log("Added company column to users table")
    } else {
      console.log("company column already exists in users table")
    }

    // Check if position column already exists
    const checkPositionResult = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'position'
    `

    // If the column doesn't exist, add it
    if (checkPositionResult.rowCount === 0) {
      await sql`
        ALTER TABLE users
        ADD COLUMN position VARCHAR(255)
      `
      console.log("Added position column to users table")
    } else {
      console.log("position column already exists in users table")
    }

    console.log("Migration completed successfully")
  } catch (err) {
    console.error("Error during migration:", err)
  }
}

addCompanyAndPositionFields()
