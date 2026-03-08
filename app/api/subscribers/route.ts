import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const sql = getDb()
    const subscribers = await sql`
      SELECT id, name, email, phone, level, motivation, created_at
      FROM subscribers
      ORDER BY created_at DESC
    `
    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnés :", error)
    return NextResponse.json(
      { error: "Impossible de récupérer les abonnés." },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant de l'abonné est requis." },
        { status: 400 },
      )
    }

    const sql = getDb()
    await sql`DELETE FROM subscribers WHERE id = ${id}`

    return NextResponse.json({ message: "Abonné supprimé." })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'abonné :", error)
    return NextResponse.json(
      { error: "Impossible de supprimer l'abonné." },
      { status: 500 },
    )
  }
}


// import { NextResponse } from "next/server"
// import { getDb } from "@/lib/db"

// export async function GET() {
//   try {
//     const sql = getDb()
//     const subscribers = await sql`
//       SELECT id, name, email, phone, level, motivation, created_at
//       FROM subscribers
//       ORDER BY created_at DESC
//     `
//     return NextResponse.json({ subscribers })
//   } catch (error) {
//     console.error("Fetch subscribers error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch subscribers." },
//       { status: 500 },
//     )
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get("id")

//     if (!id) {
//       return NextResponse.json(
//         { error: "Subscriber ID is required." },
//         { status: 400 },
//       )
//     }

//     const sql = getDb()
//     await sql`DELETE FROM subscribers WHERE id = ${id}`

//     return NextResponse.json({ message: "Subscriber deleted." })
//   } catch (error) {
//     console.error("Delete subscriber error:", error)
//     return NextResponse.json(
//       { error: "Failed to delete subscriber." },
//       { status: 500 },
//     )
//   }
// }
