// DTOs para Proposta Comercial

import { ProposalStatusEnum } from "../Enums/proposalStatusEnum.enum"

export interface ProposalClientDto {
  name: string
  company?: string
  email: string
  phone?: string
}

export interface ProposalInfoDto {
  number: string
  date: string
  validUntil: string
  status: ProposalStatusEnum
}

export interface ProposalProjectDto {
  title: string
  description?: string
  package?: string
  duration?: string
  startDate?: string
  deliveryDate?: string
}

export interface ProposalScopeItemDto {
  category: string
  items: string[]
}

export interface ProposalTimelinePhaseDto {
  phase: string
  duration: string
  tasks: string[]
}

export interface ProposalInvestmentDto {
  development: number
  infrastructure: number
  training: number
  support: number
  total: number
  currency: string
  paymentTerms: string[]
}

export interface ProposalDto {
  id?: string
  client: ProposalClientDto
  proposal: ProposalInfoDto
  project: ProposalProjectDto
  scope: ProposalScopeItemDto[]
  timeline: ProposalTimelinePhaseDto[]
  deliverables: string[]
  investment: ProposalInvestmentDto
  contactId?: string
  createdAt?: string
  updatedAt?: string
}

// DTO para criação de proposta (formulário)
export interface CreateProposalDto {
  // Cliente
  clientName: string
  clientCompany?: string
  clientEmail: string
  clientPhone?: string

  // Proposta
  validUntil: string

  // Projeto
  projectTitle: string
  projectDescription?: string
  projectPackage?: string
  projectDuration?: string
  projectStartDate?: string
  projectDeliveryDate?: string

  // Escopo
  scope: ProposalScopeItemDto[]

  // Timeline
  timeline: ProposalTimelinePhaseDto[]

  // Entregáveis
  deliverables: string[]

  // Investimento
  investmentDevelopment: number
  investmentInfrastructure: number
  investmentTraining: number
  investmentSupport: number
  investmentCurrency: string
  paymentTerms: string[]

  // Referência à mensagem
  contactId?: string
}

// DTO para listagem de propostas
export interface ProposalListItemDto {
  id: number
  proposalNumber: string
  status: ProposalStatusEnum
  clientName: string
  clientCompany?: string
  clientEmail: string
  projectTitle: string
  investmentTotal: number
  investmentCurrency: string
  proposalDate: string
  validUntil: string
  createdAt: string
}
