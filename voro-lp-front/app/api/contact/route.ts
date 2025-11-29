import { LandingPageContactDto } from "@/types/DTOs/landingPageContactDto.interface"
import { neon } from "@neondatabase/serverless"
import { randomUUID } from "crypto"
import { NextResponse } from "next/server"

export const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET() {
  try {
    const rows = await sql`
      SELECT 
        "Id" AS id,
        "Name" AS name,
        "Email" AS email,
        "Message" AS message,
        "IpAddress" AS ip_address,
        "ReceiveDate" AS receive_date,
        "IsRead" AS is_read,
        "CreatedAt" AS created_at
      FROM "LandingPageContacts"
      ORDER BY "ReceiveDate" DESC
    `

    if (rows.length === 0) return NextResponse.json(null);

    const messages: LandingPageContactDto[] = [
      ...rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        message: r.message,
        ipAddress: r.ip_address,
        receiveDate: r.receive_date,
        isRead: r.is_read,
        createdAt: r.created_at
      }))
    ];

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, isRead } = await req.json()

    await sql`
      UPDATE "LandingPageContacts"
      SET "IsRead" = ${isRead}
      WHERE "Id" = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar mensagem:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await sql`
      DELETE FROM "LandingPageContacts"
      WHERE "Id" = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar mensagem:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const guid = randomUUID();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const receiveDate = new Date().toISOString();

    if (body.company && body.company.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 }); 
    }
    
    if (isGibberish(body.name) || isGibberish(body.message)) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    await sql`
      INSERT INTO "LandingPageContacts" ("Id", "Name", "Email", "Message", "IpAddress", "ReceiveDate", "IsRead", "CreatedAt")
      VALUES (${guid}, ${body.name}, ${body.email}, ${body.message}, ${ip}, ${receiveDate}, false, ${receiveDate})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao inserir contato:", error);
    return NextResponse.json({ success: false, error: "Erro ao salvar contato" }, { status: 500 });
  }
}

function isGibberish(text: string) {
  return /^[A-Za-z]{14,}$/.test(text)
}
