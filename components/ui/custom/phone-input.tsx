"use client"


import { applyMask, phoneMasks, removeMask } from "@/lib/mask-utils"
import type React from "react"

import { useState, useEffect } from "react"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  countryCode: string
  placeholder?: string
  disabled?: boolean
}

export function PhoneInput({ value, onChange, onBlur, countryCode, placeholder, disabled }: PhoneInputProps) {
  const [maskedValue, setMaskedValue] = useState("")

  useEffect(() => {
    const currentMask = phoneMasks[countryCode]
    if (currentMask && value) {
      const masked = applyMask(value, currentMask.mask)
      setMaskedValue(masked)
    } else {
      setMaskedValue(value)
    }
  }, [value, countryCode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const currentMask = phoneMasks[countryCode]

    if (currentMask) {
      const masked = applyMask(inputValue, currentMask.mask)
      setMaskedValue(masked)

      // Enviar apenas os números para o componente pai
      const unmasked = removeMask(masked)
      onChange(unmasked)
    } else {
      setMaskedValue(inputValue)
      onChange(inputValue)
    }
  }

  const currentMask = phoneMasks[countryCode]
  const currentPlaceholder = placeholder || (currentMask ? currentMask.placeholder : "Número do telefone")

  return (
    <input
      type="text"
      value={maskedValue}
      onChange={handleInputChange}
      onBlur={onBlur}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={currentPlaceholder}
      disabled={disabled}
    />
  )
}
