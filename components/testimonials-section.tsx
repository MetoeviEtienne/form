import { Star, Youtube, Music } from "lucide-react"

const testimonials = [
  {
    name: "Alice VLAVONOU",
    role: "Créatrice de contenus IA",
    content:
      "Grâce aux formations de Mr Etienne, j'ai appris à créer des vidéos IA et mon premier projet m'a permis de générer mes premiers revenus. Je recommande vivement ses cours !",
    rating: 5,
  },
  {
    name: "David LALO.",
    role: "Monteur vidéo",
    content:
      "Les cours de Mr Etienne m'ont permis de maîtriser le montage vidéo et la création de contenu. Aujourd'hui, je travaille sur mes propres projets et je gagne ma vie avec mes créations.",
    rating: 5,
  },
  {
    name: "Jeanne DOUDOUI.",
    role: "Entrepreneure digitale",
    content:
      "J'ai suivi les formations de Mr Etienne et appris à produire du contenu IA de qualité. Mes compétences m'ont permis de lancer mes services et de générer mes premiers revenus rapidement.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-6xl mx-auto">

        {/* Section Réseaux / Réalisations */}
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            Mes réalisations
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Regardez mes vidéos IA
          </h2>

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Je crée des vidéos avec l'intelligence artificielle et je fais moi-même
            les montages. Découvrez mes contenus et les vidéos que je réalise pour
            mes clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">

          {/* Youtube */}
          <a
            href="https://www.youtube.com/@OrisOne1"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition"
          >
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Youtube className="size-12 text-red-500" />
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2">
                Ma chaîne YouTube
              </h3>

              <p className="text-sm text-muted-foreground">
                Regardez les vidéos IA que je crée et monte moi-même.
              </p>
            </div>
          </a>

          {/* TikTok personnel */}
          <a
            href="https://www.tiktok.com/@oris1247"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition"
          >
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Music className="size-12" />
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2">
                Mon TikTok
              </h3>

              <p className="text-sm text-muted-foreground">
                Découvrez mes vidéos virales créées avec l’IA.
              </p>
            </div>
          </a>

          {/* TikTok client */}
          <a
            href="https://www.tiktok.com/@sillyorangecat002"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition"
          >
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Music className="size-12" />
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2">
                Vidéos pour un client
              </h3>

              <p className="text-sm text-muted-foreground">
                Je réalise aussi des vidéos pour ce client qui me paie
                <span className="text-primary font-semibold"> 25 000F par vidéo</span>.
              </p>
            </div>
          </a>

        </div>

        {/* Pourquoi s’inscrire */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Pourquoi s’inscrire
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tout ce qu’il vous faut pour réussir en ligne<br />
            La plateforme est conçue pour que les intéressés puissent s’inscrire et suivre des formations en ligne, avec tous les outils nécessaires pour apprendre efficacement et atteindre leurs objectifs.
          </p>
        </div>

        {/* Témoignages */}
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            Témoignages
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Nos apprenants témoignent
          </h2>

          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez comment nos formations ont aidé nos étudiants à créer,
            progresser et réussir financièrement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card border border-border rounded-xl p-6 flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="text-foreground/90 text-sm leading-relaxed flex-1 mb-6">
                {`"${testimonial.content}"`}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div>
                  <p className="text-foreground font-medium text-sm">
                    {testimonial.name}
                  </p>

                  <p className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}