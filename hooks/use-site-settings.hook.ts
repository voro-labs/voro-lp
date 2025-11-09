"use client"

import { API_CONFIG, secureApiCall } from "@/lib/api"
import { SiteSettingsDto } from "@/types/DTOs/siteSettingsDto.interface"
import { useState, useEffect, useCallback } from "react"


export function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApiError = (message: string, err?: unknown) => {
    console.error(message, err)
    setError(message)
  }

  const fetchSiteSettings = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await secureApiCall<SiteSettingsDto[]>(`${API_CONFIG.ENDPOINTS.SITE_SETTINGS}`, {
        method: "GET"
      })

      if (response.hasError) {
        setError(response.message || "Erro ao carregar configurações do site")
        return
      }

      const data = response.data
      setSiteSettings(data ?? [])
    } catch (err) {
      setError("Erro ao carregar configurações do site")
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Atualizar configurações do site
  const updateSiteSettings = useCallback(async (siteSettings: SiteSettingsDto) => {
    try {
      setSiteSettings((prev) => prev.map((t) => (t.hero_title === siteSettings.hero_title ? siteSettings : t)))

      const response = await secureApiCall(`${API_CONFIG.ENDPOINTS.SITE_SETTINGS}/${siteSettings.hero_title}`, {
        method: "PATCH",
        body: JSON.stringify(siteSettings),
      })

      if (response.hasError) throw new Error(response.message ?? "Erro desconhecido")
    } catch (err) {
      handleApiError("Erro ao atualizar configurações do site", err)
      // rollback local
      setSiteSettings((prev) => prev.filter((t) => t.hero_title !== siteSettings.hero_title))
    }
  }, [])

  useEffect(() => {
    fetchSiteSettings()
  }, [])

  return {
    siteSettings,
    loading,
    error,
    clearError: () => setError(null),
    updateSiteSettings
  }
}
