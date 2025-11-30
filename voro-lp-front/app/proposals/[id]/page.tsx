"use client"

import ProposalView from "@/components/layout/proposal-view"
import { ProposalDto } from "@/types/DTOs/proposalDto.interface"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Loading } from "@/components/ui/custom/loading/loading"
import { useLandingPageConfig } from "@/hooks/use-landing-page-config.hook"

export default function ProposalPage() {
  const params = useParams()
  const proposalNumber = params?.id

  const [proposal, setProposal] = useState<ProposalDto | null>(null)
  const { LandingPageConfig } = useLandingPageConfig("home")

  // Pega a seção do footer
  const lpConfig = LandingPageConfig?.sections.find(
    (section) => section.sectionType.toLowerCase() === "contact"
  )

  useEffect(() => {
    if (!proposalNumber) return

    async function fetchProposal() {
      try {
        const response = await fetch(`/api/proposal/${proposalNumber}`)
        const data = await response.json()
        setProposal(data.proposal)
      } catch (err) {
        console.error(err)
      }
    }

    fetchProposal()
  }, [proposalNumber])

  // Caso o ID não exista
  if (!proposalNumber) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg border border-gray-200 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-2"/>
          <h2 className="text-gray-700 text-xl font-bold mb-2">Proposta inválida</h2>
          <p className="text-gray-500">ID da proposta não encontrado.</p>
        </div>
      </div>
    )
  }

  // Enquanto carrega
  if (!proposal) {
    return <Loading isLoading={true} />
  }

  // Quando a proposta foi carregada
  return (
    <div>
      <ProposalView proposal={proposal} lpConfig={lpConfig} />
    </div>
  )
}
