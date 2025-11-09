"use client"

import { Button } from "@/components/ui/button"
import { HtmlRender } from "@/lib/utils"
import { LandingPageSectionDto } from "@/types/DTOs/landingPageSectionDto.interface"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function Hero({ lpConfig }: { lpConfig: LandingPageSectionDto | undefined }) {
  const scrollToContact = () => {
    const element = document.getElementById("contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-accent/10 opacity-50" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Tecnologia & Inovação</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Soluções digitais{" "}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    sob medida
                </span>{" "}
                para o seu negócio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
                {lpConfig?.metaData.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={scrollToContact} size="lg" className="text-base group">
                Fale com a VoroLabs
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={scrollToContact} variant="outline" size="lg" className="text-base bg-transparent">
                Ver Serviços
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative lg:h-[600px] h-[400px] flex items-center justify-center"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/20 to-accent/20 blur-3xl" />
              <div className="relative w-full h-full rounded-full overflow-hidden border border-primary/20">
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80" />
                <Image
                  src="/modern-tech-workspace-with-code-and-automation-too.jpg"
                  alt="VoroLabs Technology"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
