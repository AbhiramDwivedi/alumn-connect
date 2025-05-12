"use server"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@vercel/postgres"

export async function POST(request: NextRequest) {
  try {
    // Get user session to check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to use this endpoint" },
        { status: 401 }
      )
    }
    
    // Get the user ID from the query parameters
    const { searchParams } = request.nextUrl
    const userId = searchParams.get("id")
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }
    
    // Update the user's status to approved
    const result = await sql`
      UPDATE users 
      SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${userId} 
      RETURNING id, name, email, status
    `

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: "User approved successfully",
      user: result.rows[0]
    })
    
  } catch (error) {
    console.error("Error approving user:", error)
    return NextResponse.json(
      { error: "An error occurred while approving the user" },
      { status: 500 }
    )
  }
}
