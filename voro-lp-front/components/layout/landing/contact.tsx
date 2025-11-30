"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mail, MessageCircle, Send } from "lucide-react"
import { LandingPageSectionDto } from "@/types/DTOs/landingPageSectionDto.interface"
import { useLandingPageContact } from "@/hooks/use-landing-page-contact.hook"
import { LandingPageContactDto } from "@/types/DTOs/landingPageContactDto.interface"
import { Spinner } from "../../ui/custom/loading/spinner"

export function Contact({ lpConfig }: { lpConfig: LandingPageSectionDto | undefined }) {
  const { postLandingPageContact, loading, error, clearError } = useLandingPageContact();
  
  const [formData, setFormData] = useState<LandingPageContactDto>({
    id: "",
    name: "",
    email: "",
    message: "",
    company: "",
  })

  const [success, setSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Partial<LandingPageContactDto>>({})

  const validateForm = (): boolean => {
    const errors: Partial<LandingPageContactDto> = {}

    if (!formData.name) {
      errors.name = "nome é obrigatório"
    }

    if (!formData.email) {
      errors.email = "email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "email inválido"
    }

    if (!formData.message) {
      errors.message = "Mensagem é obrigatória"
    } else if (formData.message.length < 6) {
      errors.message = "Mensagem deve ter pelo menos 6 caracteres"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    clearError();
    setSuccess(false);

    if (!validateForm()) {
      return
    }

    await postLandingPageContact(formData);
    
    setFormData({
      id: "",
      name: "",
      email: "",
      message: "",
      company: ""
    })

    setSuccess(true);

    setTimeout(() => setSuccess(false), 5000);
  }

  const handleInputChange = (field: keyof LandingPageContactDto, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Entre em Contato</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Pronto para transformar seu negócio? Fale conosco agora
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex justify-center items-center h-64">
                    <Spinner />
                  </div>
                )}

                {!loading && !error && success && (
                  <div className="bg-green-50 border border-green-400 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in">
                    <div className="shrink-0">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-700 mb-1">Mensagem enviada com sucesso!</p>
                      <p className="text-sm text-green-600">Agradecemos pelo seu contato. Retornaremos em breve.</p>
                    </div>
                  </div>
                )}

                {!loading && !success && error && (
                  <div className="bg-red-50 border border-red-400 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in">
                    <div className="shrink-0">
                      <AlertCircle size={24} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-red-700 mb-1">Erro ao enviar a mensagem</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <button
                        onClick={clearError}
                        className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  </div>
                )}

                {!loading && !error && !success && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`bg-background/50 ${
                          fieldErrors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        autoComplete="name"
                        disabled={loading}
                      />
                      {fieldErrors.name && <span className="text-red-500 text-sm block mt-1">{fieldErrors.name}</span>}
                    </div>
                    <div>
                      <Input
                        name="email"
                        placeholder="Seu e-mail"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`bg-background/50 ${
                          fieldErrors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        autoComplete="email"
                        disabled={loading}
                      />
                      {fieldErrors.email && <span className="text-red-500 text-sm block mt-1">{fieldErrors.email}</span>}
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        placeholder="Sua mensagem"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={5}
                        className={`bg-background/50 ${
                          fieldErrors.message ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      />
                      {fieldErrors.message && <span className="text-red-500 text-sm block mt-1">{fieldErrors.message}</span>}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="company"
                        style={{ display: "none" }}
                        autoComplete="off"
                        tabIndex={-1}
                        onChange={(e) => handleInputChange("company" as any, e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar mensagem
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <a
                  href={`https://wa.me/${lpConfig?.metaData?.whatsapp}?text=Olá!%20Tenho%20interesse%20em%20criar%20um%20sistema%20com%20a%20VoroLabs.%20Podemos%20conversar%3F`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">WhatsApp</h3>
                    <p className="text-muted-foreground">Fale conosco agora</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <a href={`mailto:${lpConfig?.metaData?.email}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">E-mail</h3>
                    <p className="text-muted-foreground">{lpConfig?.metaData?.email}</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <div className="p-6 bg-linear-to-br from-primary/10 to-accent/10 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Responderemos sua mensagem o mais breve possível. Nosso horário de atendimento é de segunda a sexta, das
                9h às 18h.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
