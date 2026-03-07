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

        <HeroSection />

        {/* formulaire */}
        <section
          id="register"
          className="py-20 px-4 sm:px-6 lg:px-8"
        >

          <div className="max-w-xl mx-auto">

            <div className="text-center mb-10">

              <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">
                Commencez maintenant
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Inscrivez-vous à la formation
              </h2>

              <p className="mt-4 text-muted-foreground text-lg">
                Remplissez le formulaire ci-dessous et nous vous contacterons
                avec toutes les informations nécessaires pour commencer votre
                apprentissage.
              </p>

            </div>

            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <RegistrationForm />
            </div>

          </div>

        </section>

        <div id="benefits">
          <BenefitsSection />
        </div>

        <TestimonialsSection />

      </main>

      <Footer />

    </div>
  )
}




// import { Navbar } from "@/components/navbar"
// import { HeroSection } from "@/components/hero-section"
// import { BenefitsSection } from "@/components/benefits-section"
// import { TestimonialsSection } from "@/components/testimonials-section"
// import { RegistrationForm } from "@/components/registration-form"
// import { Footer } from "@/components/footer"
// import InstallAppButton from "@/components/install-app-button"

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <main>
//         {/* Hero */}
//         <HeroSection />

//         {/* Bouton installer l'app */}
//         <div className="flex justify-center mt-6">
//           <InstallAppButton />
//         </div>

//         {/* Formulaire d'inscription */}
//         <section
//           id="register"
//           className="py-20 px-4 sm:px-6 lg:px-8"
//         >
//           <div className="max-w-xl mx-auto">
//             <div className="text-center mb-10">
//               <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">
//                 Commencez maintenant
//               </p>

//               <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
//                 Inscrivez-vous à la formation
//               </h2>

//               <p className="mt-4 text-muted-foreground text-lg text-pretty">
//                 Remplissez le formulaire ci-dessous et nous vous contacterons avec toutes les informations nécessaires pour commencer votre apprentissage.
//               </p>
//             </div>

//             <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
//               <RegistrationForm />
//             </div>
//           </div>
//         </section>

//         {/* Avantages */}
//         <div id="benefits">
//           <BenefitsSection />
//         </div>

//         {/* Témoignages */}
//         <TestimonialsSection />
//       </main>

//       <Footer />
//     </div>
//   )
// }


// import { Navbar } from "@/components/navbar"
// import { HeroSection } from "@/components/hero-section"
// import { BenefitsSection } from "@/components/benefits-section"
// import { TestimonialsSection } from "@/components/testimonials-section"
// import { RegistrationForm } from "@/components/registration-form"
// import { Footer } from "@/components/footer"

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <main>
//         {/* Section Hero */}
//         <HeroSection />

//         {/* Formulaire d'inscription juste après le Hero */}
//         <section
//           id="register"
//           className="py-20 px-4 sm:px-6 lg:px-8"
//         >
//           <div className="max-w-xl mx-auto">
//             <div className="text-center mb-10">
//               <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">
//                 Commencez maintenant
//               </p>
//               <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
//                 Inscrivez-vous à la formation
//               </h2>
//               <p className="mt-4 text-muted-foreground text-lg text-pretty">
//                 Remplissez le formulaire ci-dessous et nous vous contacterons avec toutes les informations nécessaires pour commencer votre apprentissage.
//               </p>
//             </div>

//             <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
//               <RegistrationForm />
//             </div>
//           </div>
//         </section>

//         {/* Section des avantages */}
//         <div id="benefits">
//           <BenefitsSection />
//         </div>

//         {/* Section témoignages */}
//         <TestimonialsSection />
//       </main>

//       <Footer />
//     </div>
//   )
// }