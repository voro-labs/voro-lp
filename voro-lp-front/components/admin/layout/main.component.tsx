"use client"

import type React from "react"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loading } from "../../loading/loading.component"
import { useAuth } from "@/contexts/auth.context"
import { routesAllowed } from "@/lib/allowed-utils"
import { Navbar } from "./navbar.component"
import { Sidebar } from "./sidebar.component"

interface MainProps {
  children: React.ReactNode
}

export function Main({ children }: MainProps) {
  const { user, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  if (loading) {
    return <Loading />
  }

  if (!user?.token) {
    // Redirecionar para sign-in se não estiver na página inicial
    if (typeof window !== "undefined" && !routesAllowed.some(item => window.location.pathname.startsWith(item))) {
      router.push("/admin/sign-in")
      return <Loading />
    }

    // Layout público (não autenticado)
    return (
      <div className="min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  if (pathname === "/") {
    return (
      <div className="min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  // Layout autenticado
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-1">
          <Navbar isOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
