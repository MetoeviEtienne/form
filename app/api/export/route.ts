import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const sql = getDb()
    const subscribers = await sql`
      SELECT name, email, phone, level, motivation, created_at
      FROM subscribers
      ORDER BY created_at DESC
    `

    const headers = ["Name", "Email", "Phone", "Level", "Motivation", "Date"]
    const rows = subscribers.map((s) => [
      s.name,
      s.email,
      s.phone || "",
      s.level || "",
      (s.motivation || "").replace(/"/g, '""'),
      new Date(s.created_at as string).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=subscribers-${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export subscribers." },
      { status: 500 },
    )
  }
}
