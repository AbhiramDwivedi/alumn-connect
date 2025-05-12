"use server"

import { NextRequest, NextResponse } from "next/server"
import { searchAlumni, getAlumniCount, getAlumniById } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createLogger } from "@/lib/logger"

// Create a logger for the alumni API
const apiLogger = createLogger('alumni-api')

export async function GET(request: NextRequest) {
  try {
    // Get user session to check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      apiLogger.warn("Unauthorized access attempt to alumni API")
      return NextResponse.json(
        { error: "You must be signed in to access this resource" },
        { status: 401 }
      )
    }
    
    // Verify user status
    if (session.user.status !== 'approved') {
      apiLogger.warn(`User ${session.user.email} with status ${session.user.status} attempted to access alumni API`);
      return NextResponse.json(
        { error: "Your account must be approved to access this resource" },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = request.nextUrl
    const query = searchParams.get("query") || ""
    const graduationYear = searchParams.get("graduationYear") || ""
    const degree = searchParams.get("degree") || ""
    const major = searchParams.get("major") || ""
    const location = searchParams.get("location") || ""
    const sortBy = searchParams.get("sortBy") || "name"
    const sortDirection = searchParams.get("sortDirection") || "asc"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    try {
      // Get alumni data and count separately to better handle errors
      const alumni = await searchAlumni({
        query,
        graduationYear,
        degree,
        major,
        location,
        limit,
        offset,
        sortBy,
        sortDirection,
      });
      
      const totalCount = await getAlumniCount({
        query,
        graduationYear,
        degree,
        major,
        location,
      });

      // Return alumni with pagination info
      return NextResponse.json({
        alumni,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (dbError) {
      apiLogger.error("Database error in alumni API:", { 
        error: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined      });
      
      return NextResponse.json(
        { 
          error: "Failed to load alumni data",
          message: dbError instanceof Error ? dbError.message : String(dbError) 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    apiLogger.error("Error in alumni API:", { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: "An error occurred while fetching alumni data", 
        message: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
