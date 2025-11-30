export interface LandingPageConfigDto {
  id: number
  slug: string
  startDate: Date
  endDate?: Date
  isActive: boolean
  sections: LandingPageSectionDto[]
  createdAt: Date
  updatedAt: Date
}

// DTOs for Landing Page Configuration

export interface HeroMetaDataDto {
  subtitle: string
}

export interface ProcessStepDto {
  icon: string
  title: string
  description: string
}

export interface ProcessMetaDataDto {
  steps: ProcessStepDto[]
}

export interface ServiceItemDto {
  icon: string
  title: string
  description: string
}

export interface ServicesMetaDataDto {
  services: ServiceItemDto[]
}

export interface ContactMetaDataDto {
  whatsapp: string
  email: string
}

export interface FooterMetaDataDto {
  linkedin: string
  instagram: string
  github: string
}

export type SectionMetaData =
  | HeroMetaDataDto
  | ProcessMetaDataDto
  | ServicesMetaDataDto
  | ContactMetaDataDto
  | FooterMetaDataDto

export interface LandingPageSectionDto {
  id: number
  configId: number
  sectionType: "Hero" | "About" | "Process" | "Services" | "Contact" | "Footer"
  htmlContent?: string
  metaData?: SectionMetaData
  isVisible: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface UpdateSectionDto {
  sectionId: number
  htmlContent?: string
  metaData?: SectionMetaData
  isVisible?: boolean
}

