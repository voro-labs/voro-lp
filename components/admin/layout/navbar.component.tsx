"use client"

import { useAuth } from "@/contexts/auth.context"
import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (user == null)
    return

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-xl font-bold text-gray-900">VoroLabs</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <span className="text-sm font-bold">{`${user.firstName} ${user.lastName}`.charAt(0).toUpperCase()}</span>
            </div>
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  Perfil
                </button>
                <button
                  onClick={() => {
                    logout()
                    setIsDropdownOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
