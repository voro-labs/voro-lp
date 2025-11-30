"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Save,
  Loader2,
  Type,
  FileText,
  Settings2,
  Briefcase,
  Phone,
  Share2,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactMetaDataDto, FooterMetaDataDto, HeroMetaDataDto, LandingPageConfigDto, LandingPageSectionDto, ProcessMetaDataDto, ProcessStepDto, ServiceItemDto, ServicesMetaDataDto } from "@/types/DTOs/landingPageConfigDto.interface"
import { Loading } from "@/components/ui/custom/loading/loading"

const ICON_OPTIONS = [
  "Search",
  "Code",
  "Code2",
  "Globe",
  "Zap",
  "Smartphone",
  "Rocket",
  "Settings",
  "Users",
  "Shield",
  "Database",
  "Cloud",
  "Mail",
  "MessageSquare",
]

export default function SettingsPage() {
  const router = useRouter()
  const [config, setConfig] = useState<LandingPageConfigDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("hero")

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/landing/home")
      if (res.ok) {
        const data = await res.json()
        setConfig(data)
      }
    } catch (error) {
      console.error("Failed to fetch config:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateSection = async (sectionId: number, updates: any) => {
    setSaving(String(sectionId))
    try {
      const res = await fetch(`/api/landing/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        await fetchConfig()
      }
    } catch (error) {
      console.error("Failed to update section:", error)
    } finally {
      setSaving(null)
    }
  }

  const getSection = (type: string): LandingPageSectionDto | undefined => {
    return config?.sections.find((s) => s.sectionType === type)
  }

  const toggleVisibility = async (section: LandingPageSectionDto) => {
    await updateSection(section.id, { isVisible: !section.isVisible })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Loading isLoading={!config || loading}></Loading>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold">
              Configurações do Site
            </h1>
            <p className="text-sm text-muted-foreground">
              Edite o conteúdo da landing page
            </p>
          </motion.div>
        </div>

        <main className="container py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
              <TabsTrigger value="hero" className="gap-2">
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">Hero</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Sobre</span>
              </TabsTrigger>
              <TabsTrigger value="process" className="gap-2">
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Processo</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Serviços</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Contato</span>
              </TabsTrigger>
              <TabsTrigger value="footer" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Rodapé</span>
              </TabsTrigger>
            </TabsList>

            {/* Hero Section */}
            <TabsContent value="hero">
              <HeroEditor
                section={getSection("Hero")}
                onSave={updateSection}
                onToggleVisibility={toggleVisibility}
                saving={saving}
              />
            </TabsContent>

            {/* About Section */}
            <TabsContent value="about">
              <AboutEditor
                section={getSection("About")}
                onSave={updateSection}
                onToggleVisibility={toggleVisibility}
                saving={saving}
              />
            </TabsContent>

            {/* Process Section */}
            <TabsContent value="process">
              <ProcessEditor
                section={getSection("Process")}
                onSave={updateSection}
                onToggleVisibility={toggleVisibility}
                saving={saving}
              />
            </TabsContent>

            {/* Services Section */}
            <TabsContent value="services">
              <ServicesEditor
                section={getSection("Services")}
                onSave={updateSection}
                onToggleVisibility={toggleVisibility}
                saving={saving}
              />
            </TabsContent>

            {/* Contact Section */}
            <TabsContent value="contact">
              <ContactEditor
                section={getSection("Contact")}
                onSave={updateSection}
                onToggleVisibility={toggleVisibility}
                saving={saving}
              />
            </TabsContent>

            {/* Footer Section */}
            <TabsContent value="footer">
              <FooterEditor
                section={getSection("Footer")}
                onSave={updateSection}
                onToggleVisibility={toggleVisibility}
                saving={saving}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

// Hero Editor Component
function HeroEditor({
  section,
  onSave,
  onToggleVisibility,
  saving,
}: {
  section?: LandingPageSectionDto
  onSave: (id: number, updates: any) => Promise<void>
  onToggleVisibility: (section: LandingPageSectionDto) => Promise<void>
  saving: string | null
}) {
  const [subtitle, setSubtitle] = useState("")

  useEffect(() => {
    if (section?.metaData) {
      const meta = section.metaData as HeroMetaDataDto
      setSubtitle(meta.subtitle || "")
    }
  }, [section])

  if (!section) return <p className="text-muted-foreground">Seção não encontrada</p>

  const handleSave = () => {
    onSave(section.id, { metaData: { subtitle } })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Seção Hero</CardTitle>
          <CardDescription>Configure o título e subtítulo da página inicial</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="hero-visible" className="text-sm text-muted-foreground">
            Visível
          </Label>
          <Switch id="hero-visible" checked={section.isVisible} onCheckedChange={() => onToggleVisibility(section)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-subtitle">Subtítulo</Label>
          <Textarea
            id="hero-subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Digite o subtítulo da hero..."
            rows={3}
          />
        </div>
        <Button onClick={handleSave} disabled={saving === String(section.id)}>
          {saving === String(section.id) ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar
        </Button>
      </CardContent>
    </Card>
  )
}

// About Editor Component
function AboutEditor({
  section,
  onSave,
  onToggleVisibility,
  saving,
}: {
  section?: LandingPageSectionDto
  onSave: (id: number, updates: any) => Promise<void>
  onToggleVisibility: (section: LandingPageSectionDto) => Promise<void>
  saving: string | null
}) {
  const [content, setContent] = useState("")

  useEffect(() => {
    if (section?.htmlContent) {
      setContent(section.htmlContent)
    }
  }, [section])

  if (!section) return <p className="text-muted-foreground">Seção não encontrada</p>

  const handleSave = () => {
    onSave(section.id, { htmlContent: content })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Seção Sobre</CardTitle>
          <CardDescription>Edite o conteúdo da seção sobre a empresa (HTML)</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="about-visible" className="text-sm text-muted-foreground">
            Visível
          </Label>
          <Switch id="about-visible" checked={section.isVisible} onCheckedChange={() => onToggleVisibility(section)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="about-content">Conteúdo HTML</Label>
          <Textarea
            id="about-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="<p>Seu conteúdo aqui...</p>"
            rows={10}
            className="font-mono text-sm"
          />
        </div>
        <Button onClick={handleSave} disabled={saving === String(section.id)}>
          {saving === String(section.id) ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar
        </Button>
      </CardContent>
    </Card>
  )
}

// Process Editor Component
function ProcessEditor({
  section,
  onSave,
  onToggleVisibility,
  saving,
}: {
  section?: LandingPageSectionDto
  onSave: (id: number, updates: any) => Promise<void>
  onToggleVisibility: (section: LandingPageSectionDto) => Promise<void>
  saving: string | null
}) {
  const [steps, setSteps] = useState<ProcessStepDto[]>([])

  useEffect(() => {
    if (section?.metaData) {
      const meta = section.metaData as ProcessMetaDataDto
      setSteps(meta.steps || [])
    }
  }, [section])

  if (!section) return <p className="text-muted-foreground">Seção não encontrada</p>

  const handleSave = () => {
    onSave(section.id, { metaData: { steps } })
  }

  const updateStep = (index: number, field: keyof ProcessStepDto, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setSteps(newSteps)
  }

  const addStep = () => {
    setSteps([...steps, { icon: "Search", title: "", description: "" }])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Seção Processo</CardTitle>
          <CardDescription>Configure as etapas do processo de trabalho</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="process-visible" className="text-sm text-muted-foreground">
            Visível
          </Label>
          <Switch
            id="process-visible"
            checked={section.isVisible}
            onCheckedChange={() => onToggleVisibility(section)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-lg border p-4 space-y-4"
          >
            <div className="absolute -left-3 top-4 cursor-grab">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Etapa {index + 1}</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeStep(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ícone</Label>
                <Select value={step.icon} onValueChange={(v) => updateStep(index, "icon", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(index, "title", e.target.value)}
                  placeholder="Título da etapa"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={step.description}
                onChange={(e) => updateStep(index, "description", e.target.value)}
                placeholder="Descrição da etapa"
                rows={2}
              />
            </div>
          </motion.div>
        ))}

        <Button variant="outline" onClick={addStep} className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Etapa
        </Button>

        <Button onClick={handleSave} disabled={saving === String(section.id)}>
          {saving === String(section.id) ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar
        </Button>
      </CardContent>
    </Card>
  )
}

// Services Editor Component
function ServicesEditor({
  section,
  onSave,
  onToggleVisibility,
  saving,
}: {
  section?: LandingPageSectionDto
  onSave: (id: number, updates: any) => Promise<void>
  onToggleVisibility: (section: LandingPageSectionDto) => Promise<void>
  saving: string | null
}) {
  const [services, setServices] = useState<ServiceItemDto[]>([])

  useEffect(() => {
    if (section?.metaData) {
      const meta = section.metaData as ServicesMetaDataDto
      setServices(meta.services || [])
    }
  }, [section])

  if (!section) return <p className="text-muted-foreground">Seção não encontrada</p>

  const handleSave = () => {
    onSave(section.id, { metaData: { services } })
  }

  const updateService = (index: number, field: keyof ServiceItemDto, value: string) => {
    const newServices = [...services]
    newServices[index] = { ...newServices[index], [field]: value }
    setServices(newServices)
  }

  const addService = () => {
    setServices([...services, { icon: "Code", title: "", description: "" }])
  }

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Seção Serviços</CardTitle>
          <CardDescription>Configure os serviços oferecidos</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="services-visible" className="text-sm text-muted-foreground">
            Visível
          </Label>
          <Switch
            id="services-visible"
            checked={section.isVisible}
            onCheckedChange={() => onToggleVisibility(section)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-lg border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Serviço {index + 1}</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeService(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ícone</Label>
                <Select value={service.icon} onValueChange={(v) => updateService(index, "icon", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={service.title}
                  onChange={(e) => updateService(index, "title", e.target.value)}
                  placeholder="Título do serviço"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={service.description}
                onChange={(e) => updateService(index, "description", e.target.value)}
                placeholder="Descrição do serviço"
                rows={2}
              />
            </div>
          </motion.div>
        ))}

        <Button variant="outline" onClick={addService} className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Serviço
        </Button>

        <Button onClick={handleSave} disabled={saving === String(section.id)}>
          {saving === String(section.id) ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar
        </Button>
      </CardContent>
    </Card>
  )
}

// Contact Editor Component
function ContactEditor({
  section,
  onSave,
  onToggleVisibility,
  saving,
}: {
  section?: LandingPageSectionDto
  onSave: (id: number, updates: any) => Promise<void>
  onToggleVisibility: (section: LandingPageSectionDto) => Promise<void>
  saving: string | null
}) {
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (section?.metaData) {
      const meta = section.metaData as ContactMetaDataDto
      setWhatsapp(meta.whatsapp || "")
      setEmail(meta.email || "")
    }
  }, [section])

  if (!section) return <p className="text-muted-foreground">Seção não encontrada</p>

  const handleSave = () => {
    onSave(section.id, { metaData: { whatsapp, email } })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Seção Contato</CardTitle>
          <CardDescription>Configure as informações de contato</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="contact-visible" className="text-sm text-muted-foreground">
            Visível
          </Label>
          <Switch
            id="contact-visible"
            checked={section.isVisible}
            onCheckedChange={() => onToggleVisibility(section)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-whatsapp">WhatsApp (com código do país)</Label>
          <Input
            id="contact-whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5511999999999"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">E-mail</Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@exemplo.com"
          />
        </div>
        <Button onClick={handleSave} disabled={saving === String(section.id)}>
          {saving === String(section.id) ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar
        </Button>
      </CardContent>
    </Card>
  )
}

// Footer Editor Component
function FooterEditor({
  section,
  onSave,
  onToggleVisibility,
  saving,
}: {
  section?: LandingPageSectionDto
  onSave: (id: number, updates: any) => Promise<void>
  onToggleVisibility: (section: LandingPageSectionDto) => Promise<void>
  saving: string | null
}) {
  const [linkedin, setLinkedin] = useState("")
  const [instagram, setInstagram] = useState("")
  const [github, setGithub] = useState("")

  useEffect(() => {
    if (section?.metaData) {
      const meta = section.metaData as FooterMetaDataDto
      setLinkedin(meta.linkedin || "")
      setInstagram(meta.instagram || "")
      setGithub(meta.github || "")
    }
  }, [section])

  if (!section) return <p className="text-muted-foreground">Seção não encontrada</p>

  const handleSave = () => {
    onSave(section.id, { metaData: { linkedin, instagram, github } })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Seção Rodapé</CardTitle>
          <CardDescription>Configure os links de redes sociais</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="footer-visible" className="text-sm text-muted-foreground">
            Visível
          </Label>
          <Switch id="footer-visible" checked={section.isVisible} onCheckedChange={() => onToggleVisibility(section)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="footer-linkedin">LinkedIn</Label>
          <Input
            id="footer-linkedin"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/company/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="footer-instagram">Instagram</Label>
          <Input
            id="footer-instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="footer-github">GitHub</Label>
          <Input
            id="footer-github"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <Button onClick={handleSave} disabled={saving === String(section.id)}>
          {saving === String(section.id) ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar
        </Button>
      </CardContent>
    </Card>
  )
}
