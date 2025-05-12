"use strict";

// This script approves a specific user by email

const { sql } = require("@vercel/postgres");
require('dotenv').config();

// Check if POSTGRES_URL is set
if (!process.env.POSTGRES_URL) {
  console.error("Error: POSTGRES_URL environment variable is not set.");
  console.log("Please create a .env file with your database connection string:");
  console.log("POSTGRES_URL=postgres://username:password@hostname:port/database");
  process.exit(1);
}

async function approveUserByEmail(email) {
  if (!email) {
    console.error("Error: Email is required. Usage: node approve-user-by-email.js user@example.com");
    process.exit(1);
  }

  try {
    console.log(`Connecting to database to approve user with email: ${email}...`);
    
    // Approve the specific user
    const result = await sql`
      UPDATE users 
      SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
      WHERE email = ${email}
      RETURNING id, name, email, status
    `;
    
    if (result.rowCount === 0) {
      console.log(`\nNo user found with email: ${email}`);
    } else {
      console.log(`\nSuccess! Updated user to approved status:`);
      result.rows.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Status: ${user.status}`);
      });
      
      console.log("\nThis user can now log in and access the dashboard.");
    }
    
  } catch (error) {
    console.error("Error approving user:", error);
  } finally {
    process.exit(0);
  }
}

// Get email from command line arguments
const email = process.argv[2];
approveUserByEmail(email);
