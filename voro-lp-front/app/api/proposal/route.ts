import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { CreateProposalDto, ProposalListItemDto } from "@/types/DTOs/proposalDto.interface"
import { randomUUID } from "crypto"
import { ProposalStatusEnum } from "@/types/Enums/proposalStatusEnum.enum"

const sql = neon(process.env.NEON_DATABASE_URL!)

// GET - Listar propostas
export async function GET(request: NextRequest) {
  try {
    const rows = await sql`
      SELECT 
        "Id" as id,
        "ClientName" AS client_name,
        "ClientCompany" AS client_company,
        "ClientEmail" AS client_email,
        "ClientPhone" AS client_phone,
        "ProposalNumber" AS proposal_number,
        "ProposalDate" AS proposal_date,
        "ValidUntil" AS valid_until,
        "Status" AS status,
        "ProjectTitle" AS project_title,
        "ProjectDescription" AS project_description,
        "ProjectPackage" AS project_package,
        "ProjectDuration" AS project_duration,
        "ProjectStartDate" AS project_start_date,
        "ProjectDeliveryDate" AS project_delivery_date,
        "Scope" AS scope,
        "Timeline" AS timeline,
        "Deliverables" AS deliverables,
        "InvestmentDevelopment" AS investment_development,
        "InvestmentInfrastructure" AS investment_infrastructure,
        "InvestmentTraining" AS investment_training,
        "InvestmentSupport" AS investment_support,
        "InvestmentTotal" AS investment_total,
        "InvestmentCurrency" AS investment_currency,
        "PaymentTerms" AS payment_terms,
        "ContactId" AS contact_id,
        "CreatedAt" AS created_at,
        "UpdatedAt" AS updated_at
      FROM "LandingPageProposals" 
      ORDER BY "CreatedAt" DESC
    `

    const proposals: ProposalListItemDto[] = rows.map((row: any) => ({
      id: row.id,
      proposalNumber: row.proposal_number,
      status: row.status,
      clientName: row.client_name,
      clientCompany: row.client_company,
      clientEmail: row.client_email,
      projectTitle: row.project_title,
      investmentTotal: Number(row.investment_total) || 0,
      investmentCurrency: row.investment_currency || "R$",
      proposalDate: new Date(row.proposal_date).toISOString(),
      validUntil: new Date(row.valid_until).toISOString(),
      createdAt: new Date(row.created_at).toISOString()
    }))
    
    return NextResponse.json({ proposals: proposals })
  } catch (error) {
    console.error("[v0] Error fetching proposals:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas" }, { status: 500 })
  }
}

// POST - Criar proposta
export async function POST(request: NextRequest) {
  try {
    const data: CreateProposalDto = await request.json()

    // Gerar número da proposta
    const year = new Date().getFullYear()
    const guid = randomUUID();
    const proposalNumber = `PROP-${year}-${guid}`

    // Calcular total
    const total =
      (data.investmentDevelopment || 0) +
      (data.investmentInfrastructure || 0) +
      (data.investmentTraining || 0) +
      (data.investmentSupport || 0)

    const result = await sql`
      INSERT INTO "LandingPageProposals" (
        "Id",
        "ProposalNumber",
        "ClientName",
        "ClientCompany",
        "ClientEmail",
        "ClientPhone",
        "ValidUntil",
        "ProjectTitle",
        "ProjectDescription",
        "ProjectPackage",
        "ProjectDuration",
        "ProjectStartDate",
        "ProjectDeliveryDate",
        "ProposalDate",
        "CreatedAt",
        "UpdatedAt",
        "Scope",
        "Timeline",
        "Deliverables",
        "InvestmentDevelopment",
        "InvestmentInfrastructure",
        "InvestmentTraining",
        "InvestmentSupport",
        "InvestmentTotal",
        "InvestmentCurrency",
        "PaymentTerms",
        "ContactId",
        "Status"
      ) VALUES (
        ${guid},
        ${proposalNumber},
        ${data.clientName},
        ${data.clientCompany || ''},
        ${data.clientEmail},
        ${data.clientPhone || ''},
        ${data.validUntil},
        ${data.projectTitle},
        ${data.projectDescription || null},
        ${data.projectPackage || null},
        ${data.projectDuration || null},
        ${data.projectStartDate || null},
        ${data.projectDeliveryDate || null},
        ${new Date().toISOString()},
        ${new Date().toISOString()},
        ${new Date().toISOString()},
        ${JSON.stringify(data.scope || [])},
        ${JSON.stringify(data.timeline || [])},
        ${JSON.stringify(data.deliverables || [])},
        ${data.investmentDevelopment || 0},
        ${data.investmentInfrastructure || 0},
        ${data.investmentTraining || 0},
        ${data.investmentSupport || 0},
        ${total},
        ${data.investmentCurrency || "R$"},
        ${JSON.stringify(data.paymentTerms || [])},
        ${data.contactId || null},
        ${ProposalStatusEnum.Pending}
      )
      RETURNING "Id", "ProposalNumber"
    `

    return NextResponse.json({
      success: true,
      id: result[0].Id,
      proposalNumber: result[0].ProposalNumber,
    })
  } catch (error) {
    console.error("[v0] Error creating proposal:", error)
    return NextResponse.json({ error: "Erro ao criar proposta" }, { status: 500 })
  }
}

// DELETE - Excluir proposta
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    await sql`DELETE FROM "LandingPageProposals" WHERE "Id" = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting proposal:", error)
    return NextResponse.json({ error: "Erro ao excluir proposta" }, { status: 500 })
  }
}
