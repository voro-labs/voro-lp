"use client"

import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Loading } from "@/components/loading/loading.component"
import { AlertCircle } from "lucide-react"
import { useLandingPageConfig } from "@/hooks/use-landing-page-config.hook"

export default function HomePage() {
  const { LandingPageConfig, loading, error, clearError } = useLandingPageConfig("home")

  if (loading) {
    return <Loading />
  }

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
      <Navbar />
      <Hero lpConfig={LandingPageConfig?.sections.find((section) => section.sectionType.toLocaleLowerCase() === "hero".toLocaleLowerCase())} />
      <Services lpConfig={LandingPageConfig?.sections.find((section) => section.sectionType.toLocaleLowerCase() === "services".toLocaleLowerCase())} />
      <Process lpConfig={LandingPageConfig?.sections.find((section) => section.sectionType.toLocaleLowerCase() === "process".toLocaleLowerCase())} />
      <About lpConfig={LandingPageConfig?.sections.find((section) => section.sectionType.toLocaleLowerCase() === "about".toLocaleLowerCase())} />
      <Contact lpConfig={LandingPageConfig?.sections.find((section) => section.sectionType.toLocaleLowerCase() === "contact".toLocaleLowerCase())} />
      <Footer lpConfig={LandingPageConfig?.sections.find((section) => section.sectionType.toLocaleLowerCase() === "footer".toLocaleLowerCase())} />
    </div>
  );
}
