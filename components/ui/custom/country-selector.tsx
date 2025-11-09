"use client"

import { useState, useEffect } from "react"
import { CountryDto } from "@/types/DTOs/countryDto.interface"

interface CountrySelectorProps {
  value: string
  onChange: (countryCode: string) => void
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const [countries] = useState<CountryDto[]>([
    {
      code: "BR",
      name: "Brasil",
      flagUrl: "https://flagcdn.com/w20/br.png",
      dialCode: "+55",
    },
    {
      code: "US",
      name: "Estados Unidos",
      flagUrl: "https://flagcdn.com/w20/us.png",
      dialCode: "+1",
    },
    {
      code: "GB",
      name: "Reino Unido",
      flagUrl: "https://flagcdn.com/w20/gb.png",
      dialCode: "+44",
    },
    {
      code: "CA",
      name: "Canadá",
      flagUrl: "https://flagcdn.com/w20/ca.png",
      dialCode: "+1",
    },
    {
      code: "AU",
      name: "Austrália",
      flagUrl: "https://flagcdn.com/w20/au.png",
      dialCode: "+61",
    },
    {
      code: "AR",
      name: "Argentina",
      flagUrl: "https://flagcdn.com/w20/ar.png",
      dialCode: "+54",
    },
    {
      code: "MX",
      name: "México",
      flagUrl: "https://flagcdn.com/w20/mx.png",
      dialCode: "+52",
    },
    {
      code: "FR",
      name: "França",
      flagUrl: "https://flagcdn.com/w20/fr.png",
      dialCode: "+33",
    },
    {
      code: "DE",
      name: "Alemanha",
      flagUrl: "https://flagcdn.com/w20/de.png",
      dialCode: "+49",
    },
    {
      code: "IT",
      name: "Itália",
      flagUrl: "https://flagcdn.com/w20/it.png",
      dialCode: "+39",
    },
  ])

  const [selectedCountry, setSelectedCountry] = useState<CountryDto | null>(null)

  useEffect(() => {
    const country = countries.find((c) => c.code === value)
    setSelectedCountry(country || countries[0])
  }, [value, countries])

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode)
    if (country) {
      setSelectedCountry(country)
      onChange(countryCode)
    }
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => handleCountryChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2 px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        {selectedCountry && (
          <img src={selectedCountry.flagUrl || "/placeholder.svg"} alt="Bandeira" className="w-6 h-4 object-cover" />
        )}
        <span className="text-sm">{selectedCountry ? selectedCountry.name : "Selecione um país"}</span>
      </div>
    </div>
  )
}
