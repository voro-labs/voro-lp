"use client"

import { HtmlRender } from "@/lib/utils"
import { LandingPageSectionDto } from "@/types/DTOs/landingPageConfigDto.interface"
import { motion } from "framer-motion"

export function About({ lpConfig }: { lpConfig: LandingPageSectionDto | undefined }) {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">Sobre a VoroLabs</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <HtmlRender html={lpConfig?.htmlContent || ''}></HtmlRender>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
