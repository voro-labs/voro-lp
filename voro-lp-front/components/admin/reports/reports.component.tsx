"use client"

import { useLandingPageConfig } from "@/hooks/use-landing-page-config.hook"
import { Loading } from "../../loading/loading.component"
import { AlertCircle } from "lucide-react"


export default function Reports() {
  const { LandingPageConfig, loading, updateLandingPageConfig, error, clearError } = useLandingPageConfig("reports")

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start gap-2">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erro ao carregar reports</p>
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
    <div className="min-h-screen bg-background">
      
    </div>
  )
}
