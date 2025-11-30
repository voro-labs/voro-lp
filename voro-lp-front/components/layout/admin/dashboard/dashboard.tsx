"use client"


import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Loader2, LogOut, MessageSquare, FileText, Plus, Eye, DollarSign, Clock, Users } from "lucide-react"
import { ProposalListItemDto } from "@/types/DTOs/proposalDto.interface"
import { Loading } from "@/components/ui/custom/loading/loading"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProposalStatusEnum } from "@/types/Enums/proposalStatusEnum.enum"

export default function AdminDashboard() {
  const router = useRouter()

  const [proposals, setProposals] = useState<ProposalListItemDto[]>([])
  const [loadingProposals, setLoadingProposals] = useState(true)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch("/api/proposal")
      if (response.ok) {
        const data = await response.json()
        setProposals(data.proposals || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching proposals:", error)
    } finally {
      setLoadingProposals(false)
    }
  }

  const getStatusBadge = (status: ProposalStatusEnum) => {
    switch (status) {
      case ProposalStatusEnum.Approved:
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprovada</Badge>
      case ProposalStatusEnum.Rejected:
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejeitada</Badge>
      case ProposalStatusEnum.Pending:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>
      case ProposalStatusEnum.UnderReview:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Em Revisão</Badge>
      case ProposalStatusEnum.OnHold:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Em Espera</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Desconhecido</Badge>
    }
  }

  const formatCurrency = (value: number, currency: string) => {
    return `${currency} ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
  }

  const proposalStats = {
    total: proposals.length,
    pending: proposals.filter((p) => p.status === ProposalStatusEnum.Pending).length,
    approved: proposals.filter((p) => p.status === ProposalStatusEnum.Approved).length,
    totalValue: proposals.reduce((acc, p) => acc + (p.investmentTotal || 0), 0),
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Loading isLoading={loadingProposals} />      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <motion.h1 className="text-3xl font-bold" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Admin Dashboard
          </motion.h1>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/admin/messages")} variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensagens
            </Button>
            <Button onClick={() => router.push("/admin/proposals/new")} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nova Proposta
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Propostas</p>
                <p className="text-2xl font-bold">{proposalStats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{proposalStats.pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
                <p className="text-2xl font-bold">{proposalStats.approved}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">R$ {proposalStats.totalValue.toLocaleString("pt-BR")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Propostas Comerciais
            </CardTitle>
            <CardDescription>Gerencie suas propostas comerciais</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingProposals ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : proposals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma proposta cadastrada</p>
                <Button onClick={() => router.push("/admin/proposals/new")} variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Proposta
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {proposals.map((proposal) => (
                      <TableRow key={proposal.id} className="cursor-pointer">
                        <TableCell className="w-[320px] max-w-[320px]">
                          <span className="font-medium text-sm block voro-scroll">
                            {proposal.proposalNumber}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="font-medium">{proposal.clientName}</p>
                            {proposal.clientCompany && (
                              <p className="text-sm text-muted-foreground">
                                {proposal.clientCompany}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm">{proposal.projectTitle}</span>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium">
                            {formatCurrency(proposal.investmentTotal, proposal.investmentCurrency)}
                          </span>
                        </TableCell>

                        <TableCell>{getStatusBadge(proposal.status)}</TableCell>

                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(proposal.proposalDate).toLocaleDateString("pt-BR")}
                          </span>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`/proposals/${proposal.proposalNumber}`, "_blank")}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
