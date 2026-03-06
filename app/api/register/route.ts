import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, level, motivation } = body

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      )
    }

    const sql = getDb()

    // Check if email already exists
    const existing = await sql`SELECT id FROM subscribers WHERE email = ${email.trim().toLowerCase()}`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 },
      )
    }

    // Insert new subscriber
    await sql`
      INSERT INTO subscribers (name, email, phone, level, motivation)
      VALUES (
        ${name.trim()},
        ${email.trim().toLowerCase()},
        ${phone?.trim() || null},
        ${level || null},
        ${motivation?.trim() || null}
      )
    `

    // Send emails (non-blocking - don't fail registration if email fails)
    try {
      await Promise.allSettled([
        sendConfirmationEmail(name.trim(), email.trim().toLowerCase()),
        sendAdminNotification(
          name.trim(),
          email.trim().toLowerCase(),
          phone?.trim() || null,
          level || null,
          motivation?.trim() || null,
        ),
      ])
    } catch {
      // Email errors are non-critical
    }

    return NextResponse.json(
      { message: "Registration successful!" },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    )
  }
}
