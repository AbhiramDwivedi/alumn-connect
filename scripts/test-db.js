"use strict";
// This is a temporary script to test database connectivity and check alumni records

const { sql } = require("@vercel/postgres");

async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    
    // Test basic connectivity
    console.log("Step 1: Checking basic connectivity");
    const usersResult = await sql`SELECT COUNT(*) FROM users`;
    console.log(`Users count: ${usersResult.rows[0].count}`);
    
    // Check for approved users
    console.log("\nStep 2: Checking for approved users");
    const approvedResult = await sql`SELECT COUNT(*) FROM users WHERE status = 'approved'`;
    console.log(`Approved users: ${approvedResult.rows[0].count}`);
    
    // Check user statuses
    console.log("\nStep 3: Checking user statuses");
    const statusResult = await sql`SELECT status, COUNT(*) FROM users GROUP BY status`;
    console.log("User status counts:");
    statusResult.rows.forEach(row => {
      console.log(`- ${row.status}: ${row.count}`);
    });
    
    // Test sample alumni query
    console.log("\nStep 4: Testing a sample alumni search query");
    const alumniResult = await sql`
      SELECT 
        id, name, email, graduation_year, degree, major, status
      FROM users 
      WHERE status = 'approved'
      LIMIT 3
    `;
    
    if (alumniResult.rows.length > 0) {
      console.log(`Found ${alumniResult.rows.length} alumni records:`);
      alumniResult.rows.forEach((alumnus, index) => {
        console.log(`\nAlumnus #${index + 1}:`);
        console.log(JSON.stringify(alumnus, null, 2));
      });
    } else {
      console.log("No approved alumni found in the database. The API will return empty results.");
    }
    
    console.log("\nDatabase connection test complete.");
    
  } catch (error) {
    console.error("Database test failed with error:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
testDatabaseConnection();
