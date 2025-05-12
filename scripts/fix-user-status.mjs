/**
 * This script runs the database connection test and fixes user status
 * It uses the built-in Next.js environment for database access
 */

import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function fixUserStatus() {
  try {
    console.log('Connecting to database...');
    
    // List all users and their status
    const usersResult = await sql`
      SELECT id, name, email, status FROM users
    `;
    
    console.log(`Found ${usersResult.rowCount} users:`);
    usersResult.rows.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.status}`);
    });
    
    // Approve all non-approved users
    const updateResult = await sql`
      UPDATE users
      SET status = 'approved', updated_at = CURRENT_TIMESTAMP
      WHERE status != 'approved'
      RETURNING id, name, email, status
    `;
    
    if (updateResult.rowCount > 0) {
      console.log(`\nUpdated ${updateResult.rowCount} users to 'approved' status:`);
      updateResult.rows.forEach(user => {
        console.log(`- ${user.name} (${user.email}): ${user.status}`);
      });
      console.log('\nUsers should now be able to access the alumni directory.');
      console.log('Note: Users will need to sign out and sign back in for token to update.');
    } else {
      console.log('\nNo users needed status updates. All users are already approved.');
    }
  } catch (error) {
    console.error('Error running database operations:', error);
  } finally {
    console.log('\nScript complete.');
    process.exit(0);
  }
}

// Run the function
fixUserStatus();
