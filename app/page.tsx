import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
