import { NextResponse } from "next/server"
import { createUser } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    
    // Validate required fields
    const requiredFields = ["name", "email", "password", "graduation_year", "degree", "major"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }
    
    // Create user in the database
    try {
      const newUser = await createUser(userData)
      
      // Return success without password
      const { password, ...userWithoutPassword } = newUser
      
      return NextResponse.json({
        message: "Registration successful. Your account is pending approval.",
        user: userWithoutPassword
      }, { status: 201 })
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ error: "Error creating user" }, { status: 500 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}