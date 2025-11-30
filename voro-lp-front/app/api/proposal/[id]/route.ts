import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ProposalDto } from "@/types/DTOs/proposalDto.interface"

const sql = neon(process.env.NEON_DATABASE_URL!)

// GET - Buscar proposta por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const proposalNumber = id

    const result = await sql`
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
      WHERE "ProposalNumber" = ${proposalNumber}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 })
    }

    const row = result[0]

    // Formatar datas

    // Montar DTO da proposta
    const proposal: ProposalDto = {
      id: row.id,
      client: {
        name: row.client_name,
        company: row.client_company,
        email: row.client_email,
        phone: row.client_phone,
      },
      proposal: {
        number: row.proposal_number,
        date: new Date(row.proposal_date).toISOString(),
        validUntil: new Date(row.valid_until).toISOString(),
        status: row.status,
      },
      project: {
        title: row.project_title,
        description: row.project_description,
        package: row.project_package,
        duration: row.project_duration,
        startDate: new Date(row.project_start_date).toISOString(),
        deliveryDate: new Date(row.project_delivery_date).toISOString(),
      },
      scope: row.scope || [],
      timeline: row.timeline || [],
      deliverables: row.deliverables || [],
      investment: {
        development: Number.parseFloat(row.investment_development) || 0,
        infrastructure: Number.parseFloat(row.investment_infrastructure) || 0,
        training: Number.parseFloat(row.investment_training) || 0,
        support: Number.parseFloat(row.investment_support) || 0,
        total: Number.parseFloat(row.investment_total) || 0,
        currency: row.investment_currency || "R$",
        paymentTerms: row.payment_terms || [],
      },
      contactId: row.contact_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error("[v0] Error fetching proposal:", error)
    return NextResponse.json({ error: "Erro ao buscar proposta" }, { status: 500 })
  }
}

// PUT - Atualizar status da proposta
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const proposalNumber = id

    const { status } = await request.json()

    await sql`
      UPDATE "LandingPageProposals" 
      SET "Status" = ${status}, "UpdatedAt" = CURRENT_TIMESTAMP 
      WHERE "ProposalNumber" = ${proposalNumber}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating proposal:", error)
    return NextResponse.json({ error: "Erro ao atualizar proposta" }, { status: 500 })
  }
}
