import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { RegistrationForm } from "@/components/registration-form"
import { Footer } from "@/components/footer"
import InstallAppPrompt from "@/components/install-app-prompt"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      {/* Popup installation PWA */}
      <InstallAppPrompt />

      <main>

        {/* Section Hero */}
        <HeroSection />

        {/* Section formulaire d'inscription */}
        <section
          id="register"
          className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 overflow-hidden"
        >
          <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Texte + image à droite sur PC, au-dessus du formulaire sur mobile */}
            <div className="flex flex-col bg-white/90 rounded-3xl shadow-md p-6 lg:h-full order-1 lg:order-2">

              {/* Texte */}
              <div className="mb-6">
                <p className="text-pink-500 font-semibold text-sm tracking-wider uppercase mb-3">
                  Commencez maintenant
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Inscrivez-vous à la formation
                </h2>

                <p className="text-gray-700 text-lg">
                  Remplissez le formulaire ci-dessous et nous vous contacterons avec toutes les informations nécessaires pour commencer votre apprentissage.
                </p>
              </div>

              {/* Image décorative (seulement sur PC) */}
              <div className="hidden lg:block mt-auto">
                <img
                  src="/images/form2.jpg"
                  alt="Illustration apprentissage"
                  className="w-full pointer-events-none select-none rounded-2xl"
                />
              </div>
            </div>

            {/* Formulaire à gauche sur PC, en dessous sur mobile */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl lg:h-full order-2 lg:order-1">
              <RegistrationForm />
            </div>

          </div>

          {/* Décorations supplémentaires */}
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-200 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute -top-20 -right-10 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        </section>

        {/* Section avantages */}
        {/* <div id="benefits">
          <BenefitsSection />
        </div> */}

        {/* Section témoignages */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  )
}