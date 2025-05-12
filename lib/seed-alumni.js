import { sql } from "@vercel/postgres"
import CryptoJS from "crypto-js"

async function createSampleAlumni() {
  try {
    console.log("Connected to database")

    // Get count of existing alumni
    const countResult = await sql`SELECT COUNT(*) FROM users WHERE status = 'approved'`
    const count = parseInt(countResult.rows[0].count)

    // Only seed if there are fewer than 5 alumni in the database
    if (count < 5) {
      console.log("Adding sample alumni data...")
      
      // Sample alumni data
      const sampleAlumni = [        {
          name: "Alex Johnson",
          preferred_name: "AJ",
          email: "alex.johnson@example.com",
          password: "securepassword1",
          phone: "+1 555-123-4567",
          location: "San Francisco, CA",
          linkedin_url: "https://linkedin.com/in/alexjohnson",
          graduation_year: 2018,
          degree: "B.Tech",
          major: "Computer Science",
          company: "Google",
          position: "Senior Software Engineer",
          twitter_url: "https://twitter.com/alexj",
          facebook_url: "https://facebook.com/alexjohnson",
          subscribe_to_notifications: true,
          status: "approved"
        },        {
          name: "Priya Sharma",
          email: "priya.sharma@example.com",
          password: "securepassword2",
          phone: "+91 98765-43210",
          location: "Bangalore, India",
          linkedin_url: "https://linkedin.com/in/priyasharma",
          graduation_year: 2015,
          degree: "M.Tech",
          major: "Electronics Engineering",
          company: "Infosys",
          position: "Technical Lead",
          twitter_url: "",
          facebook_url: "",
          instagram_url: "https://instagram.com/priyasharma",
          subscribe_to_notifications: true,
          status: "approved"
        },        {
          name: "David Wilson",
          preferred_name: "Dave",
          email: "david.wilson@example.com",
          password: "securepassword3",
          phone: "+1 555-987-6543",
          location: "New York, NY",
          linkedin_url: "https://linkedin.com/in/davidwilson",
          graduation_year: 2020,
          degree: "PhD",
          major: "Artificial Intelligence",
          company: "IBM Research",
          position: "Principal Research Scientist",
          twitter_url: "https://twitter.com/davidw",
          facebook_url: "",
          instagram_url: "",
          subscribe_to_notifications: false,
          status: "approved"
        },        {
          name: "Aisha Khan",
          email: "aisha.khan@example.com",
          password: "securepassword4",
          phone: "+44 7700 900123",
          location: "London, UK",
          linkedin_url: "https://linkedin.com/in/aishakhan",
          graduation_year: 2017,
          degree: "B.Tech",
          major: "Civil Engineering",
          company: "Arup Engineering",
          position: "Project Engineer",
          twitter_url: "",
          facebook_url: "https://facebook.com/aishakhan",
          instagram_url: "https://instagram.com/aishak",
          subscribe_to_notifications: true,
          status: "approved"
        },        {
          name: "Carlos Rodriguez",
          preferred_name: "Carl",
          email: "carlos.rodriguez@example.com",
          password: "securepassword5",
          phone: "+34 612 345 678",
          location: "Madrid, Spain",
          linkedin_url: "https://linkedin.com/in/carlosrodriguez",
          graduation_year: 2016,
          degree: "M.Tech",
          major: "Mechanical Engineering",
          company: "Siemens",
          position: "Mechanical Design Engineer",
          twitter_url: "https://twitter.com/carlosr",
          facebook_url: "https://facebook.com/carlosrodriguez",
          instagram_url: "https://instagram.com/carlosr",
          subscribe_to_notifications: true,
          status: "approved"
        },        {
          name: "Emma Davis",
          email: "emma.davis@example.com",
          password: "securepassword6",
          phone: "+1 555-234-5678",
          location: "Seattle, WA",
          linkedin_url: "https://linkedin.com/in/emmadavis",
          graduation_year: 2019,
          degree: "BSc",
          major: "Data Science",
          company: "Microsoft",
          position: "Data Scientist",
          twitter_url: "",
          facebook_url: "",
          instagram_url: "",
          subscribe_to_notifications: false,
          status: "approved"
        },        {
          name: "Mohammed Al-Farsi",
          preferred_name: "Mo",
          email: "mohammed.alfarsi@example.com",
          password: "securepassword7",
          phone: "+971 50 123 4567",
          location: "Dubai, UAE",
          linkedin_url: "https://linkedin.com/in/mohammedalfarsi",
          graduation_year: 2014,
          degree: "MBA",
          major: "Business Administration",
          company: "Dubai Holdings",
          position: "Business Development Director",
          twitter_url: "https://twitter.com/moalfarsi",
          facebook_url: "",
          instagram_url: "https://instagram.com/moalfarsi",
          subscribe_to_notifications: true,
          status: "approved"
        },        {
          name: "Sofia Martinez",
          email: "sofia.martinez@example.com",
          password: "securepassword8",
          phone: "+52 55 1234 5678",
          location: "Mexico City, Mexico",
          linkedin_url: "https://linkedin.com/in/sofiamartinez",
          graduation_year: 2021,
          degree: "B.Tech",
          major: "Electrical Engineering",
          company: "General Electric",
          position: "Electrical Engineer",
          twitter_url: "",
          facebook_url: "https://facebook.com/sofiamartinez",
          instagram_url: "https://instagram.com/sofiam",
          subscribe_to_notifications: true,
          status: "approved"
        },        {
          name: "Takashi Yamamoto",
          email: "takashi.yamamoto@example.com",
          password: "securepassword9",
          phone: "+81 90 1234 5678",
          location: "Tokyo, Japan",
          linkedin_url: "https://linkedin.com/in/takashiyamamoto",
          graduation_year: 2013,
          degree: "PhD",
          major: "Robotics",
          company: "Honda Robotics",
          position: "Robotics Engineer",
          twitter_url: "https://twitter.com/takashiy",
          facebook_url: "",
          instagram_url: "",
          subscribe_to_notifications: false,
          status: "approved"
        },        {
          name: "Olivia Brown",
          preferred_name: "Liv",
          email: "olivia.brown@example.com",
          password: "securepassword10",
          phone: "+61 4 1234 5678",
          location: "Sydney, Australia",
          linkedin_url: "https://linkedin.com/in/oliviabrown",
          graduation_year: 2022,
          degree: "MSc",
          major: "Quantum Computing",
          company: "Quantum Computing Inc.",
          position: "Quantum Computing Researcher",
          twitter_url: "",
          facebook_url: "https://facebook.com/oliviabrown",
          instagram_url: "https://instagram.com/livbrown",
          subscribe_to_notifications: true,
          status: "approved"
        },        {
          name: "Ahmed Hassan",
          email: "ahmed.hassan@example.com",
          password: "securepassword11",
          phone: "+20 10 1234 5678",
          location: "Cairo, Egypt",
          linkedin_url: "https://linkedin.com/in/ahmedhassan",
          graduation_year: 2012,
          degree: "B.Tech",
          major: "Chemical Engineering",
          company: "Petronas",
          position: "Process Engineer",
          twitter_url: "https://twitter.com/ahmedh",
          facebook_url: "https://facebook.com/ahmedhassan",
          instagram_url: "",
          subscribe_to_notifications: true,
          status: "approved"
        },        {
          name: "Lisa Wang",
          preferred_name: "",
          email: "lisa.wang@example.com",
          password: "securepassword12",
          phone: "+86 131 2345 6789",
          location: "Shanghai, China",
          linkedin_url: "https://linkedin.com/in/lisawang",
          graduation_year: 2011,
          degree: "MBA",
          major: "International Business",
          company: "Alibaba Group",
          position: "International Business Consultant",
          twitter_url: "",
          facebook_url: "",
          instagram_url: "https://instagram.com/lisawang",
          subscribe_to_notifications: false,
          status: "approved"
        }
      ];

      for (const alumnus of sampleAlumni) {
        // Hash the password
        const hashedPassword = CryptoJS.SHA256(alumnus.password).toString(CryptoJS.enc.Hex);
        
        // Check if alumni with this email already exists
        const existingAlumni = await sql`SELECT id FROM users WHERE email = ${alumnus.email}`
        
        if (existingAlumni.rowCount === 0) {          // Insert the alumnus
          await sql`
            INSERT INTO users 
            (name, preferred_name, email, password, phone, location, linkedin_url, graduation_year, degree, major, company, position, twitter_url, facebook_url, instagram_url, subscribe_to_notifications, status) 
            VALUES (
              ${alumnus.name}, 
              ${alumnus.preferred_name || null}, 
              ${alumnus.email}, 
              ${hashedPassword},
              ${alumnus.phone || null}, 
              ${alumnus.location || null}, 
              ${alumnus.linkedin_url || null}, 
              ${alumnus.graduation_year || null}, 
              ${alumnus.degree || null}, 
              ${alumnus.major || null},
              ${alumnus.company || null},
              ${alumnus.position || null}, 
              ${alumnus.twitter_url || null}, 
              ${alumnus.facebook_url || null}, 
              ${alumnus.instagram_url || null}, 
              ${alumnus.subscribe_to_notifications || false},
              ${alumnus.status || 'pending'}
            )
          `
          console.log(`Added alumnus: ${alumnus.name}`)
        } else {
          console.log(`Alumnus ${alumnus.name} already exists, skipping...`)
        }
      }
      
      console.log("Sample alumni data added successfully!")
    } else {
      console.log("There are already alumni in the database, skipping sample data creation.")
    }
  } catch (err) {
    console.error("Error creating sample alumni:", err)
  }
}

createSampleAlumni()
