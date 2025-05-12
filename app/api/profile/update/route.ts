"use server"

import { NextRequest, NextResponse } from "next/server"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { updateUserProfile } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    // Get user session to check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to update your profile" },
        { status: 401 }
      )
    }

    // Get the current user's email
    const userEmail = session.user.email
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      )
    }

    // Get the profile update data from the request body
    const data = await request.json()

    // List of allowed fields to update
    const allowedFields = [
      "name",
      "preferred_name",
      "phone",
      "location",
      "linkedin_url",
      "twitter_url",
      "facebook_url",
      "instagram_url",
      "company",
      "position"
    ]

    // Filter out fields that should not be updated
    const filteredData: any = {}
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        filteredData[field] = data[field]
      }
    }

    // Update the user profile
    const updatedUser = await updateUserProfile(userEmail, filteredData)

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        preferred_name: updatedUser.preferred_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        linkedin_url: updatedUser.linkedin_url,
        twitter_url: updatedUser.twitter_url,
        facebook_url: updatedUser.facebook_url,
        instagram_url: updatedUser.instagram_url,
        graduation_year: updatedUser.graduation_year,
        degree: updatedUser.degree,
        major: updatedUser.major,
        company: updatedUser.company,
        position: updatedUser.position
      }
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "An error occurred while updating profile" },
      { status: 500 }
    )
  }
}
