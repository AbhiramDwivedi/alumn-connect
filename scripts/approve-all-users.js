"use strict";

// This script approves all pending users in the database

const { sql } = require("@vercel/postgres");
require('dotenv').config();

// Check if POSTGRES_URL is set
if (!process.env.POSTGRES_URL) {
  console.error("Error: POSTGRES_URL environment variable is not set.");
  console.log("Please create a .env file with your database connection string:");
  console.log("POSTGRES_URL=postgres://username:password@hostname:port/database");
  process.exit(1);
}

async function approveAllPendingUsers() {
  try {
    console.log("Connecting to database...");
    
    // Get all pending users first to show what will be updated
    const pendingUsers = await sql`
      SELECT id, name, email FROM users 
      WHERE status = 'pending'
    `;
    
    console.log(`Found ${pendingUsers.rowCount} pending users:`);
    pendingUsers.rows.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
    
    // Approve all pending users
    const result = await sql`
      UPDATE users 
      SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
      WHERE status = 'pending' 
      RETURNING id, name, email
    `;
    
    console.log(`\nSuccess! Updated ${result.rowCount} users to approved status:`);
    result.rows.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
    
    console.log("\nAll pending users have been approved. They can now log in and access the dashboard.");
    
  } catch (error) {
    console.error("Error approving users:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
approveAllPendingUsers();
