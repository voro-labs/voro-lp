"use client"

import { Navbar } from "@/components/layout/landing/navbar"
import { Hero } from "@/components/layout/landing/hero"
import { Services } from "@/components/layout/landing/services"
import { Process } from "@/components/layout/landing/process"
import { About } from "@/components/layout/landing/about"
import { Contact } from "@/components/layout/landing/contact"
import { Footer } from "@/components/layout/landing/footer"

import { AlertCircle } from "lucide-react"
import { useLandingPageConfig } from "@/hooks/use-landing-page-config.hook"
import { Loading } from "@/components/ui/custom/loading/loading"

export default function HomePage() {
  const { LandingPageConfig, loading, error, clearError } = useLandingPageConfig("home")

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start gap-2">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro ao carregar landing page</p>
            <p className="text-sm">{error}</p>
            <button onClick={clearError} className="text-sm underline mt-1">
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Loading isLoading={loading} />
      {!loading && (
        <>
          <Navbar />
          <Hero
            lpConfig={LandingPageConfig?.sections.find(
              (section) =>
                section.sectionType.toLowerCase() === "hero"
            )}
          />
          <Services
            lpConfig={LandingPageConfig?.sections.find(
              (section) =>
                section.sectionType.toLowerCase() === "services"
            )}
          />
          <Process
            lpConfig={LandingPageConfig?.sections.find(
              (section) =>
                section.sectionType.toLowerCase() === "process"
            )}
          />
          <About
            lpConfig={LandingPageConfig?.sections.find(
              (section) =>
                section.sectionType.toLowerCase() === "about"
            )}
          />
          <Contact
            lpConfig={LandingPageConfig?.sections.find(
              (section) =>
                section.sectionType.toLowerCase() === "contact"
            )}
          />
          <Footer
            lpConfig={LandingPageConfig?.sections.find(
              (section) =>
                section.sectionType.toLowerCase() === "footer"
            )}
          />
        </>
      )}
    </div>
  );
}
