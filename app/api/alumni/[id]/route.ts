"use server"

import { NextRequest, NextResponse } from "next/server"
import { getAlumniById } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session to check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to access this resource" },
        { status: 401 }
      )
    }

    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: "Alumni ID is required" },
        { status: 400 }
      )
    }

    // Get alumni by ID
    const alumnus = await getAlumniById(id)
    
    if (!alumnus) {
      return NextResponse.json(
        { error: "Alumnus not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ alumnus })
  } catch (error) {
    console.error("Error in alumni API:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching alumnus" },
      { status: 500 }
    )
  }
}
