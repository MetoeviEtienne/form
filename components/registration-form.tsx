"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    motivation: "",
  })
  const [activeSession, setActiveSession] = useState<{ active: boolean } | null>(null)

  // Vérifie si une session est active
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/registration-sessions")
        const data = await res.json()
        setActiveSession(data?.active ? { active: true } : { active: false })
      } catch (err) {
        console.error(err)
        setActiveSession({ active: false })
      }
    }
    fetchSession()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Échec de l'inscription")
      }

      toast.success("Inscription réussie ! Vérifiez votre email pour confirmation.")
      setFormData({ name: "", email: "", phone: "", level: "", motivation: "" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = !activeSession?.active

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-card p-8 rounded-2xl shadow-lg max-w-lg mx-auto">

      {/* Barre de progression */}
      <div className="w-full bg-gray-200 h-1 rounded-full mb-6">
        <div
          className="h-1 bg-primary rounded-full transition-all duration-300"
          style={{
            width: `${Object.values(formData).filter((v) => v).length / 5 * 100}%`,
          }}
        />
      </div>

      {/* Nom */}
      <div className="relative">
        <Input
          id="name"
          placeholder=" "
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isDisabled}
          className="peer h-12 rounded-xl border border-border text-foreground placeholder-transparent focus:ring-2 focus:ring-primary"
        />
        <Label
          htmlFor="name"
          className="absolute left-3 top-3 text-muted-foreground text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary"
        >
          Nom complet *
        </Label>
        {formData.name && <Check className="absolute right-3 top-3 text-green-500 size-5" />}
      </div>

      {/* Email */}
      <div className="relative">
        <Input
          id="email"
          type="email"
          placeholder=" "
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isDisabled}
          className="peer h-12 rounded-xl border border-border text-foreground placeholder-transparent focus:ring-2 focus:ring-primary"
        />
        <Label
          htmlFor="email"
          className="absolute left-3 top-3 text-muted-foreground text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary"
        >
          Adresse email *
        </Label>
        {formData.email.includes("@") && <Check className="absolute right-3 top-3 text-green-500 size-5" />}
      </div>

      {/* Phone */}
      <div className="relative">
        <Input
          id="phone"
          type="tel"
          placeholder=" "
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={isDisabled}
          className="peer h-12 rounded-xl border border-border text-foreground placeholder-transparent focus:ring-2 focus:ring-primary"
        />
        <Label
          htmlFor="phone"
          className="absolute left-3 top-3 text-muted-foreground text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary"
        >
          Numéro WhatsApp
        </Label>
        {formData.phone && <Check className="absolute right-3 top-3 text-green-500 size-5" />}
      </div>

      {/* Niveau */}
      <div className="relative">
        <Select
          value={formData.level}
          onValueChange={(value) => setFormData({ ...formData, level: value })}
          disabled={isDisabled}
        >
          <SelectTrigger className="h-12 w-full bg-background border border-border rounded-xl text-foreground">
            <SelectValue placeholder="Sélectionnez votre niveau" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="beginner">Débutant</SelectItem>
            <SelectItem value="intermediate">Intermédiaire</SelectItem>
            <SelectItem value="advanced">Avancé</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Motivation */}
      <div className="relative">
        <Textarea
          id="motivation"
          placeholder=" "
          value={formData.motivation}
          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          rows={4}
          disabled={isDisabled}
          className="peer w-full bg-background border border-border rounded-xl text-foreground placeholder-transparent focus:ring-2 focus:ring-primary resize-none"
        />
        <Label
          htmlFor="motivation"
          className="absolute left-3 top-3 text-muted-foreground text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary"
        >
          Motivation à rejoindre 
        </Label>
      </div>

      {/* Bouton */}
      <Button
        type="submit"
        disabled={isLoading || isDisabled}
        size="lg"
        className="h-12 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-base transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin mr-2" />
            Inscription en cours...
          </>
        ) : (
          "Soumettre"
        )}
      </Button>
    </form>
  )
}


// "use client"

// import { useState } from "react"
// import { toast } from "sonner"
// import { Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// export function RegistrationForm() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     level: "",
//     motivation: "",
//   })

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()

//     if (!formData.name.trim() || !formData.email.trim()) {
//       toast.error("Veuillez remplir tous les champs obligatoires.")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.error || "Échec de l'inscription")
//       }

//       toast.success("Inscription réussie ! Vérifiez votre email pour confirmation.")
//       setFormData({ name: "", email: "", phone: "", level: "", motivation: "" })
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Une erreur est survenue"
//       toast.error(message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="name" className="text-foreground">
//           Nom complet <span className="text-primary">*</span>
//         </Label>
//         <Input
//           id="name"
//           placeholder="Jean Dupont"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           required
//           className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label htmlFor="email" className="text-foreground">
//           Adresse email <span className="text-primary">*</span>
//         </Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="jean@example.com"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           required
//           className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label htmlFor="phone" className="text-foreground">
//           Numéro WhatsApp
//         </Label>
//         <Input
//           id="phone"
//           type="tel"
//           placeholder="+229 90 00 00 00"
//           value={formData.phone}
//           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//           className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label htmlFor="level" className="text-foreground">
//           Niveau actuel
//         </Label>
//         <Select
//           value={formData.level}
//           onValueChange={(value) => setFormData({ ...formData, level: value })}
//         >
//           <SelectTrigger className="h-11 w-full bg-background border-border text-foreground">
//             <SelectValue placeholder="Sélectionnez votre niveau" />
//           </SelectTrigger>
//           <SelectContent className="bg-card border-border">
//             <SelectItem value="beginner">Débutant</SelectItem>
//             <SelectItem value="intermediate">Intermédiaire</SelectItem>
//             <SelectItem value="advanced">Avancé</SelectItem>
//             <SelectItem value="expert">Expert</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex flex-col gap-2">
//         <Label htmlFor="motivation" className="text-foreground">
//           Qu’est-ce qui vous motive à rejoindre ?
//         </Label>
//         <Textarea
//           id="motivation"
//           placeholder="Parlez-nous de vos objectifs et de ce que vous espérez accomplir..."
//           value={formData.motivation}
//           onChange={(e) =>
//             setFormData({ ...formData, motivation: e.target.value })
//           }
//           rows={4}
//           className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary resize-none"
//         />
//       </div>

//       <Button
//         type="submit"
//         disabled={isLoading}
//         size="lg"
//         className="h-12 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base cursor-pointer transition-all duration-200"
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="size-5 animate-spin" />
//             Inscription en cours...
//           </>
//         ) : (
//           "S’inscrire maintenant"
//         )}
//       </Button>
//     </form>
//   )
// }


