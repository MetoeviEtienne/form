import {
  Rocket,
  Users,
  BookOpen,
  Trophy,
} from "lucide-react"

const benefits = [
  {
    icon: Rocket,
    title: "Accélérez vos compétences",
    description:
      "Inscrivez-vous et développez des compétences recherchées pour booster votre carrière et vos projets personnels.",
  },
  {
    icon: Users,
    title: "Formations par des experts",
    description:
      "Apprenez auprès de professionnels expérimentés et suivez des parcours pédagogiques conçus pour réussir rapidement.",
  },
  {
    icon: BookOpen,
    title: "Apprentissage flexible",
    description:
      "Étudiez à votre rythme, en ligne, avec un accès illimité aux contenus et aux ressources pédagogiques.",
  },
  {
    icon: Trophy,
    title: "Certifications valorisantes",
    description:
      "Obtenez des certificats officiels qui reconnaissent vos compétences et vous démarquent dans le monde professionnel.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            Pourquoi s’inscrire
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Tout ce qu’il vous faut pour réussir en ligne
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            La plateforme est conçue pour que les intéressés puissent s’inscrire et suivre des formations en ligne, avec tous les outils nécessaires pour apprendre efficacement et atteindre leurs objectifs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.15)]"
            >
              <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <benefit.icon className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}