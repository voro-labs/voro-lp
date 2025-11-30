"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Clock, ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "../input"

interface TimePickerProps {
  value: string // Time string in HH:mm format
  id?: string
  onChange: (time: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  timeStep?: number // minutes step (default: 15)
  minTime?: string // HH:mm format
  maxTime?: string // HH:mm format
}

export function TimePicker({
  value,
  id,
  onChange,
  onBlur,
  placeholder = "hh:mm",
  disabled,
  timeStep = 15,
  minTime,
  maxTime,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayValue, setDisplayValue] = useState("")
  const [selectedHour, setSelectedHour] = useState(9) // Default 9 AM
  const [selectedMinute, setSelectedMinute] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Apply mask hh:mm
  const applyTimeMask = (inputValue: string): string => {
    const numbers = inputValue.replace(/\D/g, "")
    let masked = ""

    for (let i = 0; i < numbers.length && i < 4; i++) {
      if (i === 2) {
        masked += ":"
      }
      masked += numbers[i]
    }

    return masked
  }

  // Validate time string
  const isValidTime = (timeString: string): boolean => {
    if (timeString.length !== 5) return false // hh:mm

    const [hours, minutes] = timeString.split(":").map(Number)
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
  }

  // Format time from HH:mm to display format
  const formatTime = (timeString: string): string => {
    if (!timeString || !isValidTime(timeString)) return ""
    return timeString
  }

  // Parse time from display format
  const parseTime = (displayTime: string): { hour: number; minute: number } | null => {
    if (!displayTime || !isValidTime(displayTime)) return null

    const [hours, minutes] = displayTime.split(":").map(Number)
    return { hour: hours, minute: minutes }
  }

  // Update time and call onChange
  const updateTime = useCallback(
    (hour: number, minute: number) => {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      onChange(timeString)
    },
    [onChange],
  )

  // Sync internal state with external value
  useEffect(() => {
    setDisplayValue(formatTime(value))
    if (value && isValidTime(value)) {
      const parsed = parseTime(value)
      if (parsed) {
        setSelectedHour(parsed.hour)
        setSelectedMinute(parsed.minute)
      }
    }
  }, [value])

  // Handle click outside
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
    const masked = applyTimeMask(e.target.value)
    setDisplayValue(masked)

    if (masked.length === 5 && isValidTime(masked)) {
      const parsed = parseTime(masked)
      if (parsed) {
        setSelectedHour(parsed.hour)
        setSelectedMinute(parsed.minute)
        onChange(masked)
      }
    } else if (masked.length === 0) {
      onChange("")
    }
  }

  const handleInputBlur = () => {
    if (displayValue.length === 5 && !isValidTime(displayValue)) {
      setDisplayValue("")
      onChange("")
    }
    onBlur?.()
  }

  const adjustTime = (type: "hour" | "minute", direction: "up" | "down") => {
    let newHour = selectedHour
    let newMinute = selectedMinute

    if (type === "hour") {
      if (direction === "up") {
        newHour = selectedHour === 23 ? 0 : selectedHour + 1
      } else {
        newHour = selectedHour === 0 ? 23 : selectedHour - 1
      }
    } else {
      if (direction === "up") {
        newMinute = selectedMinute + timeStep
        if (newMinute >= 60) newMinute = 0
      } else {
        newMinute = selectedMinute - timeStep
        if (newMinute < 0) newMinute = 60 - timeStep
      }
    }

    setSelectedHour(newHour)
    setSelectedMinute(newMinute)
    updateTime(newHour, newMinute)
  }

  const setQuickTime = (hour: number, minute: number) => {
    setSelectedHour(hour)
    setSelectedMinute(minute)
    updateTime(hour, minute)
  }

  const setCurrentTime = () => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    setSelectedHour(hour)
    setSelectedMinute(minute)
    updateTime(hour, minute)
  }

  const clearTime = () => {
    onChange("")
    setIsOpen(false)
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
              onClick={() => setQuickTime(time.hour, time.minute)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {time.label}
            </button>
          ))}
        </div>

        {/* Additional quick times */}
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[
            { label: "08:00", hour: 8, minute: 0 },
            { label: "13:00", hour: 13, minute: 0 },
            { label: "16:00", hour: 16, minute: 0 },
            { label: "20:00", hour: 20, minute: 0 },
          ].map((time) => (
            <button
              key={time.label}
              type="button"
              onClick={() => setQuickTime(time.hour, time.minute)}
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
          maxLength={5}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          disabled={disabled}
        >
          <Clock size={18} />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-center px-4 py-2 border-b border-gray-200 bg-blue-50">
            <Clock size={16} className="mr-2 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Seletor de Horário</span>
          </div>

          {/* Time Picker Content */}
          {renderTimePicker()}

          {/* Action Buttons */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setCurrentTime()
                setIsOpen(false)
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Agora
            </button>

            <div className="flex space-x-2">
              <button type="button" onClick={clearTime} className="text-sm text-gray-500 hover:text-gray-700">
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
