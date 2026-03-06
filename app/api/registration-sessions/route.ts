// app/api/registration-sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM registration_sessions
    WHERE end_time > NOW()
    ORDER BY start_time DESC
    LIMIT 1
  `;

  if (result.length === 0) return NextResponse.json({ active: false });

  const session = result[0];
  return NextResponse.json({ active: true, end_time: session.end_time });
}

export async function POST(request: NextRequest) {
  const sql = getDb();
  const body = await request.json();
  const { durationMinutes } = body;

  if (!durationMinutes || durationMinutes <= 0) {
    return NextResponse.json({ error: "Durée invalide" }, { status: 400 });
  }

  const endTime = new Date(Date.now() + durationMinutes * 60 * 1000);

  await sql`
    INSERT INTO registration_sessions (end_time)
    VALUES (${endTime})
  `;

  return NextResponse.json({ message: "Session lancée", end_time: endTime });
}

export async function DELETE() {
  const sql = getDb();

  // On supprime ou termine la dernière session active
  const result = await sql`
    SELECT * FROM registration_sessions
    WHERE end_time > NOW()
    ORDER BY start_time DESC
    LIMIT 1
  `;

  if (result.length === 0) {
    return NextResponse.json({ error: "Aucune session active" }, { status: 400 });
  }

  const session = result[0];

  // Ici on peut soit supprimer soit mettre fin immédiatement
  await sql`
    UPDATE registration_sessions
    SET end_time = NOW()
    WHERE id = ${session.id}
  `;

  return NextResponse.json({ message: "Session arrêtée" });
}