export interface LandingPageSectionDto {
  id: string
  sectionType: string
  htmlContent?: string
  metaData?: any
  price?: number
  discountPrice?: number
  isVisible: boolean
  order: number
}