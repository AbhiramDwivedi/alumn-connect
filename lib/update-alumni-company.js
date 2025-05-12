import { sql } from "@vercel/postgres"

async function updateSampleAlumniWithCompanyPositions() {
  try {
    console.log("Connected to database")

    // Sample company and position data for alumni
    const alumniUpdates = [
      {
        email: "alex.johnson@example.com",
        company: "Google",
        position: "Senior Software Engineer"
      },
      {
        email: "priya.sharma@example.com",
        company: "Infosys",
        position: "Technical Lead"
      },
      {
        email: "david.wilson@example.com",
        company: "IBM Research",
        position: "Principal Research Scientist"
      },
      {
        email: "aisha.khan@example.com",
        company: "Arup Engineering",
        position: "Project Engineer"
      },
      {
        email: "carlos.rodriguez@example.com",
        company: "Siemens",
        position: "Mechanical Design Engineer"
      },
      {
        email: "emma.davis@example.com",
        company: "Microsoft",
        position: "Data Scientist"
      },
      {
        email: "mohammed.alfarsi@example.com",
        company: "Dubai Holdings",
        position: "Business Development Director"
      },
      {
        email: "sofia.martinez@example.com",
        company: "General Electric",
        position: "Electrical Engineer"
      },
      {
        email: "takashi.yamamoto@example.com",
        company: "Honda Robotics",
        position: "Robotics Engineer"
      },
      {
        email: "olivia.brown@example.com",
        company: "Quantum Computing Inc.",
        position: "Quantum Computing Researcher"
      },
      {
        email: "ahmed.hassan@example.com",
        company: "Petronas",
        position: "Process Engineer"
      },
      {
        email: "lisa.wang@example.com",
        company: "Alibaba Group",
        position: "International Business Consultant"
      }
    ];

    let updatedCount = 0;
    for (const update of alumniUpdates) {
      const result = await sql`
        UPDATE users 
        SET 
          company = ${update.company},
          position = ${update.position}
        WHERE 
          email = ${update.email}
          AND status = 'approved'
      `;
      
      if (result.rowCount > 0) {
        updatedCount++;
        console.log(`Updated alumnus: ${update.email}`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} alumni with company and position information`);

  } catch (err) {
    console.error("Error updating alumni:", err);
  }
}

updateSampleAlumniWithCompanyPositions();
