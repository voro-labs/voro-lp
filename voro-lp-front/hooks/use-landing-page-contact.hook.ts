import { API_CONFIG, secureApiCall } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { LandingPageContactDto } from "@/types/DTOs/landingPageContactDto.interface";

export function useLandingPageContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (message: string, err?: unknown) => {
    console.error(message, err);
    setError(message);
  };

  // 🔹 Enviar mensagem
  const postLandingPageContact = async (LandingPageContact: LandingPageContactDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(LandingPageContact),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message || "Erro ao enviar a mensagem";
        throw new Error(message);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

  }, []);

  return {
    loading,
    error,
    clearError: () => setError(null),
    postLandingPageContact,
  };
}
