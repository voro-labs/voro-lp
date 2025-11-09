"use client"

import { useAuth } from "@/contexts/auth.context"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, GraduationCap, CreditCard, BarChart3, LogOut, User } from "lucide-react"
import { rolesAllowed } from "@/lib/allowed-utils"
import { toTitleCase } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const getRoleBadge = (roles: string[]) => {
    switch (roles[0]) {
      case "Admin":
        return { text: "Admin", class: "bg-blue-100 text-blue-800" }
      default:
        return { text: "User", class: "bg-green-100 text-green-800" }
    }
  }

  const badge = getRoleBadge(user?.roles?.map(role => role.name) ?? [])

  const isActive = (href: string) => {
    return pathname === href;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 min-h-screen bg-background/80 backdrop-blur-lg border-b border-border shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0 lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo/Title */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-center text-white-200">VoroLabs</h1>
          <p className="text-sm text-center text-white mt-2">Olá, {toTitleCase(`${user.firstName} ${user.lastName}`)}</p>
          <div className="flex justify-center mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
              {badge.text}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          <Link
            href="/"
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                isActive("/")
                  ? "bg-blue-100 text-blue-700"
                  : "text-white-700 hover:bg-gray-600 hover:text-white-200"
              }
            `}
          >
            <Home size={20} />
            Início
          </Link>

          {(user.roles?.some(role => rolesAllowed.some(allowedRole => allowedRole === role.name))) && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="px-3 text-xs font-semibold text-white-500 uppercase tracking-wider">Área de administrador</h3>
              </div>
              <Link
                href="/admin/dashboard"
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive("/admin/dashboard")
                      ? "bg-blue-100 text-blue-700"
                      : "text-white-700 hover:bg-gray-600 hover:text-white-200"
                  }
                `}
              >
                <CreditCard size={20} />
                Dashboard
              </Link>
              <Link
                href="/admin/reports"
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive("/admin/reports")
                      ? "bg-blue-100 text-blue-700"
                      : "text-white-700 hover:bg-gray-600 hover:text-white-200"
                  }
                `}
              >
                <BarChart3 size={20} />
                Relatórios
              </Link>
              <Link
                href="/admin/settings"
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive("/admin/settings")
                      ? "bg-blue-100 text-blue-700"
                      : "text-white-700 hover:bg-gray-600 hover:text-white-200"
                  }
                `}
              >
                <CreditCard size={20} />
                Configurações
              </Link>
            </>
          )}

          <div className="border-t border-gray-200 my-4"></div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white-700 hover:bg-gray-600 hover:text-white-200 transition-colors w-full text-left"
          >
            <LogOut size={20} />
            Sair
          </button>
        </nav>
      </aside>
    </>
  )
}
