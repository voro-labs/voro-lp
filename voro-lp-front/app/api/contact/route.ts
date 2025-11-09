import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const sql = neon(process.env.NEON_DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const guid = randomUUID();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const receiveDate = new Date().toISOString();
    
    await sql`
      INSERT INTO "Contacts" ("Id", "Name", "Email", "Message", "IpAddress", "ReceiveDate")
      VALUES (${guid}, ${body.name}, ${body.email}, ${body.message}, ${ip}, ${receiveDate})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao inserir contato:", error);
    return NextResponse.json({ success: false, error: "Erro ao salvar contato" }, { status: 500 });
  }
}