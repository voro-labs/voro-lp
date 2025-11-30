"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2, Loader2, User, FileText, DollarSign, ListChecks, Clock, Package } from "lucide-react"
import type { CreateProposalDto, ProposalTimelinePhaseDto } from "@/types/DTOs/proposalDto.interface"
import { DatePicker } from "@/components/ui/custom/date-picker"
import { PhoneInput } from "@/components/ui/custom/phone-input"

export default function NewProposalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contactId = searchParams.get("contactId")
  const clientName = searchParams.get("clientName") || ""
  const clientEmail = searchParams.get("clientEmail") || ""

  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [countryCode, setCountryCode] = useState("BR")

  // Form state
  const [formData, setFormData] = useState<CreateProposalDto>({
    clientName: clientName,
    clientCompany: "",
    clientEmail: clientEmail,
    clientPhone: "",
    validUntil: "",
    projectTitle: "",
    projectDescription: "",
    projectPackage: "Básico",
    projectDuration: "",
    projectStartDate: "",
    projectDeliveryDate: "",
    scope: [{ category: "Frontend", items: [""] }],
    timeline: [{ phase: "", duration: "", tasks: [""] }],
    deliverables: [""],
    investmentDevelopment: 0,
    investmentInfrastructure: 0,
    investmentTraining: 0,
    investmentSupport: 0,
    investmentCurrency: "R$",
    paymentTerms: [""],
    contactId: contactId || undefined,
  })

  const steps = [
    { title: "Cliente", icon: User },
    { title: "Projeto", icon: FileText },
    { title: "Escopo", icon: ListChecks },
    { title: "Cronograma", icon: Clock },
    { title: "Entregáveis", icon: Package },
    { title: "Investimento", icon: DollarSign },
  ]

  const updateFormData = (field: keyof CreateProposalDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Scope handlers
  const addScopeCategory = () => {
    setFormData((prev) => ({
      ...prev,
      scope: [...prev.scope, { category: "", items: [""] }],
    }))
  }

  const updateScopeCategory = (index: number, category: string) => {
    const newScope = [...formData.scope]
    newScope[index].category = category
    setFormData((prev) => ({ ...prev, scope: newScope }))
  }

  const addScopeItem = (categoryIndex: number) => {
    const newScope = [...formData.scope]
    newScope[categoryIndex].items.push("")
    setFormData((prev) => ({ ...prev, scope: newScope }))
  }

  const updateScopeItem = (categoryIndex: number, itemIndex: number, value: string) => {
    const newScope = [...formData.scope]
    newScope[categoryIndex].items[itemIndex] = value
    setFormData((prev) => ({ ...prev, scope: newScope }))
  }

  const removeScopeItem = (categoryIndex: number, itemIndex: number) => {
    const newScope = [...formData.scope]
    newScope[categoryIndex].items.splice(itemIndex, 1)
    setFormData((prev) => ({ ...prev, scope: newScope }))
  }

  const removeScopeCategory = (index: number) => {
    const newScope = [...formData.scope]
    newScope.splice(index, 1)
    setFormData((prev) => ({ ...prev, scope: newScope }))
  }

  // Timeline handlers
  const addTimelinePhase = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { phase: "", duration: "", tasks: [""] }],
    }))
  }

  const updateTimelinePhase = (index: number, field: keyof ProposalTimelinePhaseDto, value: string) => {
    const newTimeline = [...formData.timeline]
    if (field === "tasks") return
    newTimeline[index][field] = value
    setFormData((prev) => ({ ...prev, timeline: newTimeline }))
  }

  const addTimelineTask = (phaseIndex: number) => {
    const newTimeline = [...formData.timeline]
    newTimeline[phaseIndex].tasks.push("")
    setFormData((prev) => ({ ...prev, timeline: newTimeline }))
  }

  const updateTimelineTask = (phaseIndex: number, taskIndex: number, value: string) => {
    const newTimeline = [...formData.timeline]
    newTimeline[phaseIndex].tasks[taskIndex] = value
    setFormData((prev) => ({ ...prev, timeline: newTimeline }))
  }

  const removeTimelineTask = (phaseIndex: number, taskIndex: number) => {
    const newTimeline = [...formData.timeline]
    newTimeline[phaseIndex].tasks.splice(taskIndex, 1)
    setFormData((prev) => ({ ...prev, timeline: newTimeline }))
  }

  const removeTimelinePhase = (index: number) => {
    const newTimeline = [...formData.timeline]
    newTimeline.splice(index, 1)
    setFormData((prev) => ({ ...prev, timeline: newTimeline }))
  }

  // Deliverables handlers
  const addDeliverable = () => {
    setFormData((prev) => ({ ...prev, deliverables: [...prev.deliverables, ""] }))
  }

  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables]
    newDeliverables[index] = value
    setFormData((prev) => ({ ...prev, deliverables: newDeliverables }))
  }

  const removeDeliverable = (index: number) => {
    const newDeliverables = [...formData.deliverables]
    newDeliverables.splice(index, 1)
    setFormData((prev) => ({ ...prev, deliverables: newDeliverables }))
  }

  // Payment terms handlers
  const addPaymentTerm = () => {
    setFormData((prev) => ({ ...prev, paymentTerms: [...prev.paymentTerms, ""] }))
  }

  const updatePaymentTerm = (index: number, value: string) => {
    const newTerms = [...formData.paymentTerms]
    newTerms[index] = value
    setFormData((prev) => ({ ...prev, paymentTerms: newTerms }))
  }

  const removePaymentTerm = (index: number) => {
    const newTerms = [...formData.paymentTerms]
    newTerms.splice(index, 1)
    setFormData((prev) => ({ ...prev, paymentTerms: newTerms }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Filter empty items
      const cleanedData = {
        ...formData,
        scope: formData.scope.filter((s) => s.category).map((s) => ({ ...s, items: s.items.filter((i) => i) })),
        timeline: formData.timeline
          .filter((t) => t.phase)
          .map((t) => ({ ...t, tasks: t.tasks.filter((task) => task) })),
        deliverables: formData.deliverables.filter((d) => d),
        paymentTerms: formData.paymentTerms.filter((p) => p),
      }

      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/proposals/${data.proposalNumber}`)
      } else if (response.status === 401) {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("[v0] Error creating proposal:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return (
      (formData.investmentDevelopment || 0) +
      (formData.investmentInfrastructure || 0) +
      (formData.investmentTraining || 0) +
      (formData.investmentSupport || 0)
    )
  }

  function calculateDurationWeeks(start: string, end: string) {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffWeeks = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));

    return `${diffWeeks} semanas`;
  }


  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <motion.h1
              className="text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Nova Proposta Comercial
            </motion.h1>
            <p className="text-muted-foreground text-sm">Preencha os dados para gerar a proposta</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`flex flex-col items-center gap-1 min-w-20 transition-colors ${
                index === activeStep ? "text-primary" : index < activeStep ? "text-primary/60" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === activeStep
                    ? "bg-primary text-primary-foreground"
                    : index < activeStep
                      ? "bg-primary/20 text-primary"
                      : "bg-muted"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Form Steps */}
        <Card>
          <CardContent className="p-6">
            {/* Step 0: Cliente */}
            {activeStep === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome do Cliente *</Label>
                    <Input
                      autoComplete="off"
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => updateFormData("clientName", e.target.value)}
                      placeholder="João Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCompany">Empresa</Label>
                    <Input
                      autoComplete="off"
                      id="clientCompany"
                      value={formData.clientCompany}
                      onChange={(e) => updateFormData("clientCompany", e.target.value)}
                      placeholder="TechStart Ltda"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email *</Label>
                    <Input
                      autoComplete="off"
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => updateFormData("clientEmail", e.target.value)}
                      placeholder="email@empresa.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Telefone</Label>
                    <PhoneInput
                      id="clientPhone"
                      countryCode={countryCode}
                      autoComplete="off"
                      value={`${formData.clientPhone}`}
                      onChange={(value) => updateFormData("clientPhone", value)}></PhoneInput>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Projeto */}
            {activeStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Título do Projeto *</Label>
                  <Input
                    autoComplete="off"
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={(e) => updateFormData("projectTitle", e.target.value)}
                    placeholder="Desenvolvimento de Plataforma Web"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Descrição</Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription}
                    onChange={(e) => updateFormData("projectDescription", e.target.value)}
                    placeholder="Descreva o projeto em detalhes..."
                    rows={4}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectPackage">Pacote</Label>
                    <Select value={formData.projectPackage} onValueChange={(v) => updateFormData("projectPackage", v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Profissional">Profissional</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                        <SelectItem value="Personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectDuration">Duração</Label>
                    <Input
                      autoComplete="off"
                      id="projectDuration"
                      value={formData.projectDuration}
                      placeholder="8 semanas"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Proposta Válida Até *</Label>
                    <DatePicker
                      id="validUntil"
                      value={formData.validUntil}
                      onChange={(date) => updateFormData("validUntil", date)}></DatePicker>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectStartDate">Início Previsto</Label>
                    <DatePicker
                      id="projectStartDate"
                      value={formData.projectStartDate || ""}
                      onChange={(date) => {
                        updateFormData("projectStartDate", date);
                        const duration = calculateDurationWeeks(date, `${formData.projectDeliveryDate}`);
                        updateFormData("projectDuration", duration);
                      }}></DatePicker>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="projectDeliveryDate">Entrega Prevista</Label>
                    <DatePicker
                      id="projectDeliveryDate"
                      value={formData.projectDeliveryDate || ""}
                      onChange={(date) => {
                        updateFormData("projectDeliveryDate", date);
                        const duration = calculateDurationWeeks(`${formData.projectStartDate}`, date);
                        updateFormData("projectDuration", duration);
                      }}></DatePicker>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Escopo */}
            {activeStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {formData.scope.map((category, catIndex) => (
                  <div key={catIndex} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        autoComplete="off"
                        value={category.category}
                        onChange={(e) => updateScopeCategory(catIndex, e.target.value)}
                        placeholder="Categoria (ex: Frontend, Backend)"
                        className="flex-1"
                      />
                      {formData.scope.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeScopeCategory(catIndex)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2">
                          <Input
                            autoComplete="off"
                            value={item}
                            onChange={(e) => updateScopeItem(catIndex, itemIndex, e.target.value)}
                            placeholder="Item do escopo"
                          />
                          {category.items.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeScopeItem(catIndex, itemIndex)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addScopeItem(catIndex)} className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addScopeCategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Categoria
                </Button>
              </motion.div>
            )}

            {/* Step 3: Cronograma */}
            {activeStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {formData.timeline.map((phase, phaseIndex) => (
                  <div key={phaseIndex} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {phaseIndex + 1}
                      </div>
                      <Input
                        autoComplete="off"
                        value={phase.phase}
                        onChange={(e) => updateTimelinePhase(phaseIndex, "phase", e.target.value)}
                        placeholder="Nome da Fase"
                        className="flex-1"
                      />
                      <Input
                        autoComplete="off"
                        value={phase.duration}
                        onChange={(e) => updateTimelinePhase(phaseIndex, "duration", e.target.value)}
                        placeholder="Duração"
                        className="w-32"
                      />
                      {formData.timeline.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTimelinePhase(phaseIndex)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2 pl-10">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-2">
                          <Input
                            autoComplete="off"
                            value={task}
                            onChange={(e) => updateTimelineTask(phaseIndex, taskIndex, e.target.value)}
                            placeholder="Tarefa"
                          />
                          {phase.tasks.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTimelineTask(phaseIndex, taskIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addTimelineTask(phaseIndex)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Tarefa
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addTimelinePhase}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Fase
                </Button>
              </motion.div>
            )}

            {/* Step 4: Entregáveis */}
            {activeStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      autoComplete="off"
                      value={deliverable}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      placeholder="Ex: Código-fonte completo com documentação"
                    />
                    {formData.deliverables.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDeliverable(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addDeliverable}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Entregável
                </Button>
              </motion.div>
            )}

            {/* Step 5: Investimento */}
            {activeStep === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Moeda</Label>
                    <Select
                      value={formData.investmentCurrency}
                      onValueChange={(v) => updateFormData("investmentCurrency", v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="R$">R$ (Real)</SelectItem>
                        <SelectItem value="US$">US$ (Dólar)</SelectItem>
                        <SelectItem value="€">€ (Euro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Desenvolvimento</Label>
                    <Input
                      autoComplete="off"
                      type="number"
                      value={formData.investmentDevelopment || ""}
                      onChange={(e) => updateFormData("investmentDevelopment", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Infraestrutura</Label>
                    <Input
                      autoComplete="off"
                      type="number"
                      value={formData.investmentInfrastructure || ""}
                      onChange={(e) =>
                        updateFormData("investmentInfrastructure", Number.parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Treinamento</Label>
                    <Input
                      autoComplete="off"
                      type="number"
                      value={formData.investmentTraining || ""}
                      onChange={(e) => updateFormData("investmentTraining", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Suporte</Label>
                    <Input
                      autoComplete="off"
                      type="number"
                      value={formData.investmentSupport || ""}
                      onChange={(e) => updateFormData("investmentSupport", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formData.investmentCurrency} {calculateTotal().toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Condições de Pagamento</Label>
                  {formData.paymentTerms.map((term, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        autoComplete="off"
                        value={term}
                        onChange={(e) => updatePaymentTerm(index, e.target.value)}
                        placeholder="Ex: 30% na assinatura do contrato"
                      />
                      {formData.paymentTerms.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePaymentTerm(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addPaymentTerm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Condição
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
              >
                Anterior
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button onClick={() => setActiveStep((prev) => prev + 1)}>Próximo</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar Proposta"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
