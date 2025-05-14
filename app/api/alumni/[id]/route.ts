import { NextRequest, NextResponse } from "next/server"
import { getAlumniById } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createLogger } from "@/lib/logger"

// Create a logger for the alumni API
const apiLogger = createLogger('alumni-detail-api')

// Using the Next.js App Router format for dynamic route handlers
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Get user session to check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      apiLogger.warn("Unauthorized access attempt to alumni detail API")
      return NextResponse.json(
        { error: "You must be signed in to access this resource" },
        { status: 401 }      )
    }
    
    // Verify user status
    if (session.user.status !== 'approved') {
      apiLogger.warn(`User ${session.user.email} with status ${session.user.status} attempted to access alumni detail API`);
      return NextResponse.json(
        { error: "Your account must be approved to access this resource" },
        { status: 403 }
      )
    }

    const id = context.params.id
    
    if (!id) {
      apiLogger.warn("Missing alumni ID in request");
      return NextResponse.json(
        { error: "Alumni ID is required" },
        { status: 400 }
      )
    }
    
    // Get alumni by ID
    const alumnus = await getAlumniById(id)
    
    if (!alumnus) {
      apiLogger.warn(`Alumnus not found for ID: ${id}`);
      return NextResponse.json(
        { error: "Alumnus not found" },
        { status: 404 }
      )
    }

    apiLogger.info(`Alumni data retrieved for ID: ${id}`);
    return NextResponse.json({ alumnus })
  } catch (error) {
    apiLogger.error("Error in alumni detail API:", { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: "An error occurred while fetching alumnus" },
      { status: 500 }
    )
  }
}