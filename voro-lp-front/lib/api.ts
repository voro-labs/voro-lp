import type { ResponseViewModel } from "@/types/response.interface"

// Configurações centralizadas da API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    SIGNIN: "/auth/sign-in",
    RESET_PASSWORD: "/auth/reset-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    LANDING_PAGE_CONFIG: "/landing-page-config"
  },
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}

// Função para obter o token do localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("vorolabs_lp_token")
}

// Função para remover o token (logout)
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vorolabs_lp_token")
  }
}

// Função para salvar o token
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("vorolabs_lp_token", token)
  }
}

// Função helper para fazer chamadas à API com ResponseViewModel
export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ResponseViewModel<T>> {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`
    const token = getAuthToken()

    const headers = {
      ...API_CONFIG.HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const status = response.status

    // Se for 401 (Unauthorized), remover token e redirecionar para login
    if (status === 401) {
      removeAuthToken()
      if (typeof window !== "undefined") {
        window.location.href = "/admin/sign-in"
      }
      return {
        status,
        message: "Sessão expirada. Faça login novamente.",
        data: null,
        hasError: true
      }
    }

    if (!response.ok) {
      let errorMessage = "Erro na requisição"

      try {
        const errorData = await response.json()
        // Se a API retorna no formato ResponseViewModel
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch {
        errorMessage = `Erro ${status}: ${response.statusText}`
      }

      return {
        status,
        message: errorMessage,
        data: null,
        hasError: true
      }
    }

    const data: ResponseViewModel<T> = await response.json()

    // Se a API já retorna no formato ResponseViewModel, use diretamente
    return data
  } catch (error) {
    let errorMessage = "Erro de conexão"

    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        errorMessage = "Não foi possível conectar com o servidor. Verifique se a API está rodando."
      } else {
        errorMessage = error.message
      }
    }

    return {
      status: 0,
      message: errorMessage,
      data: null,
      hasError: true
    }
  }
}

// Função específica para chamadas autenticadas (alias para apiCall, já que agora sempre inclui token)
export async function authenticatedApiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ResponseViewModel<T>> {
  return apiCall<T>(endpoint, options)
}

// Interceptor para verificar se o token existe antes de fazer chamadas autenticadas
export async function secureApiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ResponseViewModel<T>> {
  const token = getAuthToken()

  if (!token) {
    // Se não há token, redirecionar para login
    if (typeof window !== "undefined") {
      window.location.href = "/admin/sign-in"
    }
    return {
      status: 401,
      message: "Token de autenticação não encontrado. Faça login novamente.",
      data: null,
      hasError: true
    }
  }

  return apiCall<T>(endpoint, options)
}
