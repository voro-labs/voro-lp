import { FooterMetaDataDto, LandingPageSectionDto } from "@/types/DTOs/landingPageConfigDto.interface"
import { Github, Instagram, Linkedin } from "lucide-react"

export function Footer({ lpConfig }: { lpConfig: LandingPageSectionDto | undefined }) {
  return (
    <footer className="border-t border-border/50 py-12 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              VoroLabs
            </p>
            <p className="text-sm text-muted-foreground">© 2025 VoroLabs. Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={(lpConfig?.metaData as FooterMetaDataDto)?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={(lpConfig?.metaData as FooterMetaDataDto)?.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary hover:bg-accent/20 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={(lpConfig?.metaData as FooterMetaDataDto)?.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
