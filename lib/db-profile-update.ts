import { sql } from "@vercel/postgres"

export async function updateUserProfile(email: string, data: any) {
  try {
    // Build the update SET clause dynamically
    const setClauses: string[] = [];
    const values: any[] = [email]; // First parameter is the email

    // Add each field to be updated
    Object.keys(data).forEach((key, index) => {
      setClauses.push(`${key} = $${index + 2}`); // +2 because $1 is the email
      values.push(data[key]);
    });

    // Add the updated_at timestamp
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    // If there's nothing to update, return early
    if (setClauses.length === 0) {
      throw new Error("No valid fields to update");
    }

    const setClause = setClauses.join(", ");

    const queryText = `
      UPDATE users 
      SET ${setClause}
      WHERE email = $1
      RETURNING 
        id, name, preferred_name, email, phone, location, 
        linkedin_url, twitter_url, facebook_url, instagram_url,
        graduation_year, degree, major, company, position, status, created_at, updated_at
    `;

    const result = await sql.query(queryText, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
