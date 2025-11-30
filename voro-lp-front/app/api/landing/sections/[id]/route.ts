import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.NEON_DATABASE_URL!);

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sectionId = id
    const body = await request.json()

    const updates: string[] = []
    const values: any[] = []
    let i = 1

    if (body.htmlContent !== undefined) {
      updates.push(`"HtmlContent" = $${i++}`)
      values.push(body.htmlContent)
    }

    if (body.metaData !== undefined) {
      updates.push(`"MetaData" = $${i++}`)
      values.push(JSON.stringify(body.metaData))
    }

    if (body.isVisible !== undefined) {
      updates.push(`"IsVisible" = $${i++}`)
      values.push(body.isVisible)
    }

    // Sempre atualiza UpdatedAt — sem parâmetros
    updates.push(`"UpdatedAt" = CURRENT_TIMESTAMP`)

    // Adiciona o ID como último parâmetro
    values.push(sectionId)

    const sqlQuery = `
      UPDATE "LandingPageSections"
      SET ${updates.join(", ")}
      WHERE "Id" = $${i}
    `
    
    await sql.query(sqlQuery, values)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update section error:", error)
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 })
  }
}
