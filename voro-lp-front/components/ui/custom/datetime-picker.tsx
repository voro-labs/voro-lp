"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "../input"

interface DateTimePickerProps {
  value: string // ISO datetime string
  id?: string
  onChange: (datetime: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  minDate?: string
  maxDate?: string
  timeStep?: number // minutes step (default: 15)
}

export function DateTimePicker({
  value,
  id,
  onChange,
  onBlur,
  placeholder = "dd/mm/aaaa hh:mm",
  disabled,
  minDate,
  maxDate,
  timeStep = 15,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"date" | "time">("date")
  const [displayValue, setDisplayValue] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date().getUTCMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getUTCFullYear())
  const [selectedHour, setSelectedHour] = useState(9) // Default 9 AM
  const [selectedMinute, setSelectedMinute] = useState(0)
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

  // Format datetime to Brazilian format (dd/MM/yyyy hh:mm)
  const formatDateTimeToBR = (isoDateTime: string): string => {
    if (!isoDateTime) return ""
    try {
      const date = new Date(isoDateTime)
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
      const year = date.getUTCFullYear()
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
      return `${day}/${month}/${year} ${hours}:${minutes}`
    } catch (error) {
      return ""
    }
  }

  // Apply mask dd/MM/yyyy hh:mm
  const applyDateTimeMask = (inputValue: string): string => {
    const numbers = inputValue.replace(/\D/g, "")
    let masked = ""

    for (let i = 0; i < numbers.length && i < 12; i++) {
      if (i === 2 || i === 4) {
        masked += "/"
      } else if (i === 8) {
        masked += " "
      } else if (i === 10) {
        masked += ":"
      }
      masked += numbers[i]
    }

    return masked
  }

  // Validate datetime string
  const isValidDateTime = (dateTimeString: string): boolean => {
    if (dateTimeString.length !== 16) return false // dd/MM/yyyy hh:mm

    const [datePart, timePart] = dateTimeString.split(" ")
    if (!datePart || !timePart) return false

    // Validate date part
    const [day, month, year] = datePart.split("/").map(Number)
    if (!day || !month || !year) return false

    const date = new Date(year, month - 1, day)
    const isValidDate = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getDate() === day

    // Validate time part
    const [hours, minutes] = timePart.split(":").map(Number)
    const isValidTime = hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59

    return isValidDate && isValidTime
  }

  // Convert BR format to ISO datetime
  const formatDateTimeToISO = (brDateTime: string): string => {
    if (!brDateTime || !isValidDateTime(brDateTime)) return ""

    try {
      const [datePart, timePart] = brDateTime.split(" ")
      const [day, month, year] = datePart.split("/").map(Number)
      const [hours, minutes] = timePart.split(":").map(Number)

      const date = new Date(year, month - 1, day, hours, minutes)
      return date.toISOString()
    } catch (error) {
      return ""
    }
  }

  useEffect(() => {
    setDisplayValue(formatDateTimeToBR(value))
    if (value) {
      const date = new Date(value)
      setCurrentMonth(date.getUTCMonth())
      setCurrentYear(date.getUTCFullYear())
      setSelectedHour(date.getHours())
      setSelectedMinute(date.getMinutes())
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyDateTimeMask(e.target.value)
    setDisplayValue(masked)

    if (masked.length === 16 && isValidDateTime(masked)) {
      const isoDateTime = formatDateTimeToISO(masked)
      onChange(isoDateTime)
    } else if (masked.length === 0) {
      onChange("")
    }
  }

  const handleInputBlur = () => {
    if (displayValue.length === 16 && !isValidDateTime(displayValue)) {
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
    const selectedDate = new Date(currentYear, currentMonth, day, selectedHour, selectedMinute)
    onChange(selectedDate.toISOString())
    setActiveTab("time")
  }

  const handleTimeChange = () => {
    if (value) {
      const currentDate = new Date(value)
      const newDate = new Date(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getDate(),
        selectedHour,
        selectedMinute,
      )
      onChange(newDate.toISOString())
    }
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

  const adjustTime = (type: "hour" | "minute", direction: "up" | "down") => {
    if (type === "hour") {
      let newHour = selectedHour
      if (direction === "up") {
        newHour = selectedHour === 23 ? 0 : selectedHour + 1
      } else {
        newHour = selectedHour === 0 ? 23 : selectedHour - 1
      }
      setSelectedHour(newHour)
      if (value) {
        const currentDate = new Date(value)
        const newDate = new Date(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getDate(),
          newHour,
          selectedMinute,
        )
        onChange(newDate.toISOString())
      }
    } else {
      let newMinute = selectedMinute
      if (direction === "up") {
        newMinute = selectedMinute + timeStep
        if (newMinute >= 60) newMinute = 0
      } else {
        newMinute = selectedMinute - timeStep
        if (newMinute < 0) newMinute = 60 - timeStep
      }
      setSelectedMinute(newMinute)
      if (value) {
        const currentDate = new Date(value)
        const newDate = new Date(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getDate(),
          selectedHour,
          newMinute,
        )
        onChange(newDate.toISOString())
      }
    }
  }

  // useEffect(() => {
  //   handleTimeChange()
  // }, [selectedHour, selectedMinute])

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
                : "text-gray-700 hover:text-blue-600"
          }`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const renderTimePicker = () => {
    return (
      <div className="p-4">
        <div className="text-center mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selecionar Horário</h4>
        </div>

        <div className="flex items-center justify-center space-x-4">
          {/* Hour Picker */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => adjustTime("hour", "up")}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronUp size={16} />
            </button>
            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg font-mono text-lg font-semibold">
              {selectedHour.toString().padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={() => adjustTime("hour", "down")}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronDown size={16} />
            </button>
            <span className="text-xs text-gray-500 mt-1">Hora</span>
          </div>

          <div className="text-2xl font-bold text-gray-400">:</div>

          {/* Minute Picker */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => adjustTime("minute", "up")}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronUp size={16} />
            </button>
            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg font-mono text-lg font-semibold">
              {selectedMinute.toString().padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={() => adjustTime("minute", "down")}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronDown size={16} />
            </button>
            <span className="text-xs text-gray-500 mt-1">Min</span>
          </div>
        </div>

        {/* Quick time buttons */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "09:00", hour: 9, minute: 0 },
            { label: "12:00", hour: 12, minute: 0 },
            { label: "14:00", hour: 14, minute: 0 },
            { label: "18:00", hour: 18, minute: 0 },
          ].map((time) => (
            <button
              key={time.label}
              type="button"
              onClick={() => {
                setSelectedHour(time.hour)
                setSelectedMinute(time.minute)
                if (value) {
                  const currentDate = new Date(value)
                  const newDate = new Date(
                    currentDate.getUTCFullYear(),
                    currentDate.getUTCMonth(),
                    currentDate.getDate(),
                    time.hour,
                    time.minute,
                  )
                  onChange(newDate.toISOString())
                }
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>
    )
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
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          maxLength={16}
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
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[320px]">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("date")}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "date"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Calendar size={16} className="inline mr-2" />
              Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("time")}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "time"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Clock size={16} className="inline mr-2" />
              Horário
            </button>
          </div>

          {/* Content */}
          {activeTab === "date" ? (
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
                  <select
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(Number(e.target.value))}
                    className="text-sm font-medium bg-transparent border-none focus:outline-none cursor-pointer"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(Number(e.target.value))}
                    className="text-sm font-medium bg-transparent border-none focus:outline-none cursor-pointer"
                  >
                    {Array.from({ length: 20 }, (_, i) => currentYear - 10 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
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
                  <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar */}
              <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            </div>
          ) : (
            renderTimePicker()
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                const now = new Date()
                onChange(now.toISOString())
                setCurrentMonth(now.getUTCMonth())
                setCurrentYear(now.getUTCFullYear())
                setSelectedHour(now.getHours())
                setSelectedMinute(now.getMinutes())
                setIsOpen(false)
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Agora
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
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
