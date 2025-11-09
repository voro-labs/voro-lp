import { LandingPageSectionDto } from "./landingPageSectionDto.interface"

export interface LandingPageConfigDto {
  id: string
  slug: string
  isActive: boolean
  startDate?: string
  endDate?: string
  sections: LandingPageSectionDto[]
}

