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
      if (!res.ok) throw new Error(data.error || "Échec de l'inscription")
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-8 max-w-md mx-auto rounded-3xl shadow-2xl 
                 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"
    >
      {/* Barre de progression */}
      <div className="w-full bg-gray-200 h-1 rounded-full mb-6">
        <div
          className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${Object.values(formData).filter((v) => v).length / 5 * 100}%` }}
        />
      </div>

      {/* Nom */}
      <div className="flex flex-col relative">
        <Label htmlFor="name" className="text-gray-700 font-semibold mb-1">
          Nom complet *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isDisabled}
          className="h-12 rounded-xl border border-gray-300 bg-white text-gray-900 px-4 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
        />
        {formData.name && <Check className="absolute right-4 top-10 text-green-500 size-5" />}
      </div>

      {/* Email */}
      <div className="flex flex-col relative">
        <Label htmlFor="email" className="text-gray-700 font-semibold mb-1">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isDisabled}
          className="h-12 rounded-xl border border-gray-300 bg-white text-gray-900 px-4 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
        />
        {formData.email.includes("@") && <Check className="absolute right-4 top-10 text-green-500 size-5" />}
      </div>

      {/* Téléphone */}
      <div className="flex flex-col relative">
        <Label htmlFor="phone" className="text-gray-700 font-semibold mb-1">
          Numéro WhatsApp
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={isDisabled}
          className="h-12 rounded-xl border border-gray-300 bg-white text-gray-900 px-4 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
        />
        {formData.phone && <Check className="absolute right-4 top-10 text-green-500 size-5" />}
      </div>

      {/* Niveau */}
      <div className="flex flex-col">
        <Label className="text-gray-700 font-semibold mb-1">Niveau</Label>
        <Select
          value={formData.level}
          onValueChange={(value) => setFormData({ ...formData, level: value })}
          disabled={isDisabled}
        >
          <SelectTrigger className="h-12 w-full bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-pink-400">
            <SelectValue placeholder="Sélectionnez votre niveau" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 text-gray-900">
            <SelectItem value="beginner">Débutant</SelectItem>
            <SelectItem value="intermediate">Intermédiaire</SelectItem>
            <SelectItem value="advanced">Avancé</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Motivation */}
      <div className="flex flex-col">
        <Label htmlFor="motivation" className="text-gray-700 font-semibold mb-1">
          Motivation à rejoindre
        </Label>
        <Textarea
          id="motivation"
          value={formData.motivation}
          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          rows={4}
          disabled={isDisabled}
          className="w-full bg-white border border-gray-300 rounded-xl text-gray-900 px-4 py-2 focus:ring-2 focus:ring-pink-400 resize-none"
        />
      </div>

      {/* Bouton */}
      <Button
        type="submit"
        disabled={isLoading || isDisabled}
        size="lg"
        className="h-12 mt-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold text-base transition-all duration-200 shadow-lg"
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