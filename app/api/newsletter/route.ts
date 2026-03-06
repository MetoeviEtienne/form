import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { sendNewsletter } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, message } = body

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 },
      )
    }

    const sql = getDb()
    const subscribers = await sql`SELECT email FROM subscribers`

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers to send to." },
        { status: 400 },
      )
    }

    const emails = subscribers.map((s) => s.email as string)
    await sendNewsletter(emails, subject.trim(), message.trim())

    return NextResponse.json({
      message: `Newsletter sent to ${emails.length} subscriber(s).`,
    })
  } catch (error) {
    console.error("Newsletter error:", error)
    return NextResponse.json(
      { error: "Failed to send newsletter." },
      { status: 500 },
    )
  }
}
