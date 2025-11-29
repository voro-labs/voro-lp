import { API_CONFIG, secureApiCall } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { LandingPageConfigDto } from "@/types/DTOs/landingPageConfigDto.interface";

export function useLandingPageConfig(slug: string) {
  const [LandingPageConfig, setLandingPageConfig] =
    useState<LandingPageConfigDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLandingPageConfig = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/landing/${slug}`);
      const config = await res.json();
      setLandingPageConfig(config);
    } catch (err) {
      setError("Erro ao carregar configurações do site");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Atualizar configurações do site
  const updateLandingPageConfig = useCallback(
    async (LandingPageConfig: LandingPageConfigDto) => {
      try {
        setLandingPageConfig((prev) =>
          prev ? { ...prev, ...LandingPageConfig } : LandingPageConfig
        );

        const response = await secureApiCall(
          `${API_CONFIG.ENDPOINTS.LANDING_PAGE_CONFIG}/${LandingPageConfig.slug}`,
          {
            method: "PATCH",
            body: JSON.stringify(LandingPageConfig),
          }
        );

        if (response.hasError)
          throw new Error(response.message ?? "Erro desconhecido");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        // rollback local
        setLandingPageConfig((prev) =>
          prev ? { ...prev, ...LandingPageConfig } : LandingPageConfig
        );
      }
    },
    []
  );

  useEffect(() => {
    fetchLandingPageConfig();
  }, ["home"]);

  return {
    LandingPageConfig,
    loading,
    error,
    clearError: () => setError(null),
    updateLandingPageConfig,
  };
}
