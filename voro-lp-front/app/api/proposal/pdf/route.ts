import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function POST(req: Request) {
  const { proposal } = await req.json()

  console.log(proposal)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(renderProposalPdfTemplate(proposal), { waitUntil: "networkidle0" })

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm" }
  })

  await browser.close()

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="proposta.pdf"`
    }
  })
}


export function renderProposalPdfTemplate(p: any) {
  let templateHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8"/>
      <style>
        body {
          font-family: "Inter", sans-serif;
          color: #333;
          margin: 40px;
          font-size: 14px;
        }

        h1, h2, h3 {
          font-weight: 600;
        }

        .header {
          border-bottom: 3px solid #111;
          margin-bottom: 30px;
          padding-bottom: 10px;
        }

        .section {
          margin-top: 28px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          padding: 6px 0;
          border-bottom: 1px solid #ccc;
          margin-bottom: 14px;
        }

        ul {
          margin: 0;
          padding-left: 18px;
        }
        
        .row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .col {
          width: 50%;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }

        table td, table th {
          border: 1px solid #ddd;
          padding: 6px;
        }

        table th {
          background: #f3f3f3;
          font-weight: 600;
        }

        .price {
          font-size: 18px;
          font-weight: 700;
        }

        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #555;
        }
      </style>
    </head>

    <body>

      <!-- Header -->
      <div class="header">
        <h1>Proposta Comercial</h1>
        <p><strong>Número:</strong> {{proposal.number}}</p>
        <p><strong>Data:</strong> {{proposal.date}}</p>
        <p><strong>Válida até:</strong> {{proposal.validUntil}}</p>
      </div>

      <!-- Client -->
      <div class="section">
        <div class="section-title">Cliente</div>
        <p><strong>Nome:</strong> {{client.name}}</p>
        <p><strong>Empresa:</strong> {{client.company}}</p>
        <p><strong>Email:</strong> {{client.email}}</p>
        <p><strong>Telefone:</strong> {{client.phone}}</p>
      </div>

      <!-- Project -->
      <div class="section">
        <div class="section-title">Projeto</div>
        <p><strong>Título:</strong> {{project.title}}</p>
        <p><strong>Descrição:</strong> {{project.description}}</p>
        <p><strong>Pacote:</strong> {{project.package}}</p>
        <p><strong>Duração:</strong> {{project.duration}}</p>
        <p><strong>Início previsto:</strong> {{project.startDate}}</p>
        <p><strong>Entrega final:</strong> {{project.deliveryDate}}</p>
      </div>

      <!-- Scope -->
      <div class="section">
        <div class="section-title">Escopo</div>
        {{scopeHtml}}
      </div>

      <!-- Timeline -->
      <div class="section">
        <div class="section-title">Cronograma</div>
        <table>
          <tr>
            <th>Fase</th>
            <th>Duração</th>
            <th>Tarefas</th>
          </tr>
          {{timelineHtml}}
        </table>
      </div>

      <!-- Deliverables -->
      <div class="section">
        <div class="section-title">Entregáveis</div>
        <ul>
          {{deliverablesHtml}}
        </ul>
      </div>

      <!-- Investment -->
      <div class="section">
        <div class="section-title">Investimento</div>

        <table>
          <tr>
            <th>Categoria</th><th>Valor</th>
          </tr>
          {{investmentTableHtml}}
        </table>

        <h3 style="margin-top: 15px;">Condições de Pagamento</h3>
        <ul>
          {{paymentTermsHtml}}
        </ul>
      </div>


      <div class="footer">
        <p>Em caso de dúvidas, estamos à disposição.</p>
        <p>Proposta gerada automaticamente pelo sistema VoroLabs</p>
      </div>

    </body>
    </html>
  `;

  const scopeHtml = p.scope.map((cat: any) => {
    return `
      <h3>${cat.category}</h3>
      <ul>
        ${cat.items.map((i: any) => `<li>${i}</li>`).join("")}
      </ul>
    `
  }).join("")

  const timelineHtml = p.timeline.map((t: any) => {
    return `
      <tr>
        <td>${t.phase}</td>
        <td>${t.duration}</td>
        <td>
          <ul>
            ${t.tasks.map((task: any) => `<li>${task}</li>`).join("")}
          </ul>
        </td>
      </tr>
    `
  }).join("")

  const deliverablesHtml = p.deliverables
    .map((item: any) => `<li>${item}</li>`)
    .join("")

  const paymentTermsHtml = p.investment.paymentTerms
    .map((item: any) => `<li>${item}</li>`)
    .join("")

  const investmentTableHtml = `
    <tr><td>Desenvolvimento</td><td>${p.investment.development}</td></tr>
    <tr><td>Infraestrutura</td><td>${p.investment.infrastructure}</td></tr>
    <tr><td>Treinamento</td><td>${p.investment.training}</td></tr>
    <tr><td>Suporte</td><td>${p.investment.support}</td></tr>
    <tr><td><strong>Total</strong></td><td class="price">${p.investment.total}</td></tr>
  `


  return templateHtml
  .replace("{{client.name}}", p.client.name)
  .replace("{{client.company}}", p.client.company)
  .replace("{{client.email}}", p.client.email)
  .replace("{{client.phone}}", p.client.phone)
  .replace("{{proposal.number}}", p.proposal.number)
  .replace("{{proposal.date}}", p.proposal.date)
  .replace("{{proposal.validUntil}}", p.proposal.validUntil)
  .replace("{{project.title}}", p.project.title)
  .replace("{{project.description}}", p.project.description)
  .replace("{{project.package}}", p.project.package)
  .replace("{{project.duration}}", p.project.duration)
  .replace("{{project.startDate}}", p.project.startDate)
  .replace("{{project.deliveryDate}}", p.project.deliveryDate)
  .replace("{{investment.total}}", p.investment.total)
  .replace("{{scopeHtml}}", scopeHtml)
  .replace("{{timelineHtml}}", timelineHtml)
  .replace("{{deliverablesHtml}}", deliverablesHtml)
  .replace("{{paymentTermsHtml}}", paymentTermsHtml)
  .replace("{{investmentTableHtml}}", investmentTableHtml);
}
