"use server"

import { NextRequest, NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getToken } from "next-auth/jwt"

export async function GET(request: NextRequest) {
  try {
    // Get user session to check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to access this resource" },
        { status: 401 }
      )
    }
    
    // Also get the JWT token to examine status value
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    // Simple database test query
    const result = await sql`SELECT COUNT(*) FROM users`
    
    // Get status counts for debugging
    const statusResult = await sql`SELECT status, COUNT(*) FROM users GROUP BY status`
    
    // Get a few user records for inspection
    const sampleUsers = await sql`
      SELECT id, name, email, status 
      FROM users 
      LIMIT 5
    `
    
    // Get current user's actual status from the database, not just from token
    let currentUserStatus = null
    if (session.user.id) {
      const userResult = await sql`
        SELECT id, name, email, status
        FROM users
        WHERE id = ${session.user.id}
      `
      if (userResult.rows.length > 0) {
        currentUserStatus = userResult.rows[0]
      }
    }
    
    return NextResponse.json({
      status: "OK",
      dbConnected: true,
      userCount: result.rows[0]?.count || 0,
      statusCounts: statusResult.rows,
      sampleUsers: sampleUsers.rows,
      currentUser: {
        tokenInfo: {
          status: token?.status || null,
          role: token?.role || null,
          id: token?.id || null
        },
        sessionInfo: {
          status: session.user?.status || null,
          id: session.user?.id || null,
          email: session.user?.email || null
        },
        databaseInfo: currentUserStatus
      }
    })
    
  } catch (error) {
    console.error("Database test error:", error)
    
    let errorMessage = "Unknown error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        status: "ERROR", 
        dbConnected: false,
        error: errorMessage,
        details: String(error)
      },
      { status: 500 }
    )
  }
}
