// This script approves users directly using the same database functions as the app

import { sql } from "@vercel/postgres";

const approveUsers = async () => {
  try {
    console.log("Connecting to database...");
    
    // Get current users and their statuses
    const users = await sql`SELECT id, name, email, status FROM users`;
    
    console.log(`Found ${users.rowCount} users:`);
    users.rows.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.status}`);
    });
    
    // Update all non-approved users to approved
    const result = await sql`
      UPDATE users 
      SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
      WHERE status != 'approved' 
      RETURNING id, name, email, status
    `;
    
    if (result.rowCount > 0) {
      console.log(`\nSuccess! Updated ${result.rowCount} users to approved status:`);
      result.rows.forEach(user => {
        console.log(`- ${user.name} (${user.email}): ${user.status}`);
      });
    } else {
      console.log("\nNo users needed approval. All users are already approved.");
    }
    
  } catch (error) {
    console.error("Error updating users:", error);
  }
};

// Run the function
approveUsers().then(() => {
  console.log("Script completed.");
  process.exit(0);
}).catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});
