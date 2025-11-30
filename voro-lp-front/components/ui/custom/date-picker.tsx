"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "../input"

interface DatePickerProps {
  value: string // ISO date string
  id?: string
  onChange: (date: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  minDate?: string
  maxDate?: string
}

export function DatePicker({
  value,
  id,
  onChange,
  onBlur,
  placeholder = "dd/mm/aaaa",
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayValue, setDisplayValue] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date().getUTCMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getUTCFullYear())
  const containerRef = useRef<HTMLDivElement>(null)

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const years = Array.from({ length: 20 }, (_, i) => new Date().getUTCFullYear() - 10 + i)

  // Format date to Brazilian format (dd/MM/yyyy)
  const formatDateToBR = (isoDate: string): string => {
    if (!isoDate) return ""
    try {
      const date = new Date(isoDate)
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
      const year = date.getUTCFullYear()
      return `${day}/${month}/${year}`
    } catch (error) {
      return ""
    }
  }

  // Apply mask dd/MM/yyyy
  const applyDateMask = (inputValue: string): string => {
    const numbers = inputValue.replace(/\D/g, "")
    let masked = ""

    for (let i = 0; i < numbers.length && i < 8; i++) {
      if (i === 2 || i === 4) {
        masked += "/"
      }
      masked += numbers[i]
    }

    return masked
  }

  // Validate date string
  const isValidDate = (dateString: string): boolean => {
    if (dateString.length !== 10) return false // dd/MM/yyyy

    const [day, month, year] = dateString.split("/").map(Number)
    if (!day || !month || !year) return false

    const date = new Date(year, month - 1, day)
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getDate() === day
  }

  // Convert BR format to ISO date
  const formatDateToISO = (brDate: string): string => {
    if (!brDate || !isValidDate(brDate)) return ""

    try {
      const [day, month, year] = brDate.split("/").map(Number)
      const date = new Date(year, month - 1, day)
      return date.toISOString()
    } catch (error) {
      return ""
    }
  }

  useEffect(() => {
    setDisplayValue(formatDateToBR(value))
    if (value) {
      const date = new Date(value)
      setCurrentMonth(date.getUTCMonth())
      setCurrentYear(date.getUTCFullYear())
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target instanceof HTMLElement && event.target.closest("[data-radix-popper-content-wrapper]"))
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyDateMask(e.target.value)
    setDisplayValue(masked)

    if (masked.length === 10 && isValidDate(masked)) {
      const isoDate = formatDateToISO(masked)
      onChange(isoDate)
    } else if (masked.length === 0) {
      onChange("")
    }
  }

  const handleInputBlur = () => {
    if (displayValue.length === 10 && !isValidDate(displayValue)) {
      setDisplayValue("")
      onChange("")
    }
    onBlur?.()
  }

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day)
    onChange(selectedDate.toISOString())
    setIsOpen(false)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Empty days at the beginning of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        value &&
        new Date(value).getDate() === day &&
        new Date(value).getUTCMonth() === currentMonth &&
        new Date(value).getUTCFullYear() === currentYear

      const isToday =
        new Date().getDate() === day &&
        new Date().getUTCMonth() === currentMonth &&
        new Date().getUTCFullYear() === currentYear

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`w-8 h-8 text-sm rounded-full hover:bg-blue-100 transition-colors ${
            isSelected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : isToday
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-white-700 hover:text-blue-600"
          }`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          type="text"
          id={id}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 pr-10 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          maxLength={10}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          disabled={disabled}
        >
          <Calendar size={18} />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-accent border border-input rounded-lg shadow-lg z-50 min-w-[320px]">
          <div className="p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth("prev")}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center space-x-2">
                <Select value={`${currentMonth}`} onValueChange={(v) => setCurrentMonth(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={`${index}`}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={`${currentYear}`} onValueChange={(v) => setCurrentYear(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={`${year}`}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <button
                type="button"
                onClick={() => navigateMonth("next")}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-xs font-medium text-white text-center py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                const now = new Date()
                onChange(now.toISOString())
                setCurrentMonth(now.getUTCMonth())
                setCurrentYear(now.getUTCFullYear())
                setIsOpen(false)
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Hoje
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
                className="text-sm text-white hover:text-white-700"
              >
                Limpar
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
